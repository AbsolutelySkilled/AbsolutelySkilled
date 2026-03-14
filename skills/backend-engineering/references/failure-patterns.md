<!-- Part of the Backend Engineering AbsolutelySkilled skill. Load this file when implementing retry logic, circuit breakers, idempotency, sagas, or other failure handling patterns. -->

# Failure Handling Patterns

Distributed systems fail in partial, unpredictable ways. These patterns help services degrade gracefully instead of cascading failures.

---

## 1. Retry Patterns

| Strategy | Delay Formula | Best For |
|---|---|---|
| Simple retry | Fixed delay (e.g., 1s) | Quick transient blips |
| Exponential backoff | `base * 2^attempt` | Sustained outages |
| Backoff + jitter | `random(0, base * 2^attempt)` | **Production default** |

**Retry (transient):** 503, 429 (with backoff), connection reset, timeout, 502
**Do NOT retry (permanent):** 400, 401/403, 404, 409, 422

**Retry budgets:** Cap retries at 10-20% of total requests to prevent retry amplification.

```python
def retry_with_backoff(op, max_retries=3, base_ms=100, max_ms=10000):
    for attempt in range(max_retries + 1):
        try:
            return op()
        except RetryableError as e:
            if attempt == max_retries:
                raise e
            delay = min(base_ms * (2 ** attempt), max_ms)
            sleep(random_between(0, delay))  # Full jitter
```

---

## 2. Circuit Breaker

Stops calling a dependency known to be failing. Three states:

```
CLOSED --[failure threshold]--> OPEN --[reset timeout]--> HALF-OPEN
HALF-OPEN --[trial succeeds]--> CLOSED | --[trial fails]--> OPEN
```

| Parameter | Typical Default |
|---|---|
| Failure threshold | 5 failures in 60s or 50% failure rate |
| Reset timeout | 30s |
| Half-open trial count | 3 |

**When to use:** External APIs, databases under load, any remote dependency with expected failures. NOT for local in-process calls.

```python
class CircuitBreaker:
    def __init__(self, threshold=5, reset_ms=30000):
        self.state, self.failures, self.last_fail = CLOSED, 0, None

    def call(self, op):
        if self.state == OPEN:
            if now() - self.last_fail > self.reset_ms:
                self.state = HALF_OPEN
            else:
                raise CircuitOpenError("Failing fast")
        try:
            result = op()
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        if self.state == HALF_OPEN: self.state = CLOSED
        self.failures = 0

    def _on_failure(self):
        self.failures += 1
        self.last_fail = now()
        if self.failures >= self.threshold: self.state = OPEN
```

**Circuit breaker + retry are complementary:** Retries handle transient blips; circuit breaker handles sustained outages. Retries run inside the circuit breaker: `Request -> CB -> Retry -> Downstream`.

---

## 3. Idempotency

Retries without idempotency cause duplicate side effects (e.g., double charges).

| Type | Description | Example |
|---|---|---|
| **Natural** | Inherently idempotent | `SET balance = 100`, `DELETE WHERE id = X` |
| **Artificial** | Made idempotent via keys | `CHARGE $50` with key `txn-abc-123` |

Prefer natural idempotency (absolute values over deltas). Use idempotency keys when the operation is inherently non-idempotent.

```python
def process_payment(request):
    key = request.headers["Idempotency-Key"]  # Client-generated UUID
    existing = db.query("SELECT result FROM idempotency_store WHERE key = ?", key)
    if existing:
        return existing.result  # Return cached response
    result = charge_payment(request.amount)
    db.execute("INSERT INTO idempotency_store (key, result, created_at) VALUES (?, ?, now())", key, result)
    return result
```

**Database-level:** Use `INSERT ... ON CONFLICT DO NOTHING` with idempotency key as primary/unique key.

**TTL:** Expire idempotency keys after 24-72 hours to prevent unbounded storage growth.

---

## 4. Timeouts

| Type | Controls | Typical Default |
|---|---|---|
| Connect timeout | TCP connection establishment | 1-3s |
| Read timeout | Waiting for response data | 5-30s |
| Total timeout | End-to-end including retries | 30-60s |

**Without timeouts:** Slow dependency blocks threads, pool exhausts, your service stops responding, callers cascade fail. A single missing timeout can take down an entire service mesh.

### Deadline Propagation

In chains (A -> B -> C), propagate a shrinking deadline so downstream knows time remaining:

```python
def handle_request(request):
    deadline = request.header("X-Deadline") or (now() + DEFAULT_TIMEOUT)
    remaining = deadline - now()
    if remaining <= 0:
        return error(504, "Deadline exceeded")
    downstream_timeout = remaining - LOCAL_BUFFER_MS
    return call_service_b(timeout=downstream_timeout, headers={"X-Deadline": deadline})
```

| Scenario | Suggested Timeout |
|---|---|
| Internal service RPC | 3-5s |
| Database query | 5-10s |
| External third-party API | 10-30s |
| User-facing API total | 10-30s |

Always set timeouts explicitly. Never rely on library defaults.

---

## 5. Bulkhead Pattern

Isolates failures so one degraded dependency does not exhaust shared resources.

```python
# BAD: Shared pool - slow payment service blocks all 100 threads
executor = ThreadPoolExecutor(max_workers=100)

# GOOD: Isolated pools per dependency
payment_pool  = ThreadPoolExecutor(max_workers=30)
email_pool    = ThreadPoolExecutor(max_workers=20)
inventory_pool = ThreadPoolExecutor(max_workers=30)
```

**Pool sizing:** `target_throughput * avg_latency_seconds + buffer` (e.g., 100 req/s at 200ms = 30 threads).

Also apply to DB connection pools: separate pools for critical (order processing) vs non-critical (analytics) paths.

---

## 6. Saga Pattern

Manages distributed transactions across services where ACID is not possible.

| Aspect | Choreography | Orchestration |
|---|---|---|
| Coordination | Services react to events | Central coordinator directs |
| Best for | Simple sagas (2-4 steps) | Complex sagas (5+ steps) |
| Visibility | Hard to trace | Easy to see full flow |

**Use when:** Multi-service business processes, cross-database operations. NOT for single-database operations.

```python
class OrderSaga:
    steps = [
        SagaStep(action=reserve_inventory,  compensate=release_inventory),
        SagaStep(action=charge_payment,     compensate=refund_payment),
        SagaStep(action=schedule_shipping,  compensate=cancel_shipping),
    ]

    def execute(self, order):
        completed = []
        for step in self.steps:
            try:
                step.action(order)
                completed.append(step)
            except Exception as e:
                for s in reversed(completed):  # Compensate in reverse
                    try:
                        s.compensate(order)
                    except Exception:
                        alert_ops_team(order, s)  # Manual intervention needed
                raise SagaFailed(e)
```

**Key rules:** Compensations must be idempotent. Persist saga state so it survives coordinator crashes.

---

## 7. Outbox Pattern

Solves the dual-write problem: updating a database AND publishing an event atomically.

```python
def create_order(order):
    with db.transaction():  # Same transaction guarantees consistency
        db.execute("INSERT INTO orders (id, status) VALUES (?, ?)", order.id, 'created')
        db.execute("INSERT INTO outbox (id, event_type, payload) VALUES (?, ?, ?)",
                   uuid4(), 'OrderCreated', serialize(order))
```

**Publishing approaches:**

| Approach | How | Trade-off |
|---|---|---|
| Polling publisher | Query outbox for unpublished rows | Simple; adds DB load |
| CDC (e.g., Debezium) | Read DB transaction log | Near real-time; more infra |

```python
def publish_outbox():  # Polling publisher
    events = db.query("SELECT * FROM outbox WHERE published_at IS NULL ORDER BY created_at LIMIT 100")
    for event in events:
        message_broker.publish(event.event_type, event.payload)
        db.execute("UPDATE outbox SET published_at = now() WHERE id = ?", event.id)
```

Provides **at-least-once delivery** - consumers must be idempotent.

---

## 8. Graceful Degradation

Shed non-critical work under pressure to preserve core functionality.

| Pressure Level | Response |
|---|---|
| Normal | Full functionality |
| Elevated | Disable recommendations, analytics |
| High | Return cached/fallback responses |
| Critical | Read-only mode, reject new work |

```python
def get_product(product_id):
    product = product_service.get(product_id)  # Always execute
    if feature_flags.enabled("recommendations"):
        product.recs = recommendation_service.get(product_id)
    else:
        product.recs = []  # Fallback
    return product

# Load shedding
def handle(request):
    if active_requests.get() >= MAX_CONCURRENT:
        return Response(503, headers={"Retry-After": "5"})
    active_requests.increment()
    try:
        return process(request)
    finally:
        active_requests.decrement()
```

**Fallback chain:** Try live service -> Try cache -> Return generic default.

---

## Pattern Selection Guide

| Problem | Primary Pattern | Complementary |
|---|---|---|
| Transient network errors | Retry + backoff | Idempotency, timeouts |
| Dependency frequently down | Circuit breaker | Retry (inside CB), fallbacks |
| Duplicate side effects | Idempotency keys | DB unique constraints |
| Slow dependency hangs service | Timeouts | Circuit breaker, bulkhead |
| One bad dep takes down all | Bulkhead | Circuit breaker, timeouts |
| Multi-service transaction | Saga | Idempotency (compensations) |
| Reliable event publishing | Outbox pattern | Idempotency (consumers) |
| System overloaded | Graceful degradation | Load shedding, queue leveling |
