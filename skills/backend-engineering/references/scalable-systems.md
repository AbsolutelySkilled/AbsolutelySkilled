<!-- Part of the Backend Engineering AbsolutelySkilled skill. Load this file when working with distributed systems, scaling strategies, caching, or message queues. -->

# Scalable Systems Reference

Opinionated defaults for mid-level backend engineers. Follow the defaults unless you have a measured reason to deviate.

## 1. Scaling Decision Tree

```
START: Is your service stateless?
  |
  +-- NO --> Make it stateless first. Move state to a database/cache/object store.
  |           Do NOT scale a stateful service horizontally without understanding the cost.
  |
  +-- YES --> Are you CPU or memory bound?
                +-- CPU bound, single-threaded bottleneck --> Scale UP (vertical) first.
                +-- Memory bound, dataset fits in one box --> Scale UP (vertical) first.
                +-- Already on the largest practical instance --> Scale OUT (horizontal).
                +-- Need fault tolerance across zones/regions --> Scale OUT (horizontal).
                +-- Traffic is spiky and you need elasticity --> Scale OUT (horizontal).
```

### Vertical vs Horizontal - Decision Table

| Signal                              | Scale UP | Scale OUT |
|-------------------------------------|----------|-----------|
| Single-threaded bottleneck          | YES      | No        |
| Need >99.99% availability           | No       | YES       |
| Spiky/unpredictable traffic         | No       | YES       |
| Simple ops team (< 3 engineers)     | YES      | No        |
| Already on largest instance class   | No       | YES       |
| Stateful workload hard to partition | YES      | No        |

**Default: Start vertical, go horizontal when forced.**

### Session Affinity Pitfalls

- Session affinity (sticky sessions) makes horizontal scaling a lie - you get uneven load.
- If one node goes down, all its sticky sessions are lost.
- Fix: externalize session state to Redis/database. Make every request routable to any node.
- Only use session affinity as a temporary migration step, never as a permanent architecture.

## 2. Caching Patterns

### Pattern Selection

| Pattern        | Read Heavy | Write Heavy | Consistency Need | Complexity |
|----------------|------------|-------------|------------------|------------|
| Cache-aside    | YES        | No          | Eventual OK      | Low        |
| Read-through   | YES        | No          | Eventual OK      | Medium     |
| Write-through  | No         | YES         | Strong needed    | Medium     |
| Write-behind   | No         | YES         | Eventual OK      | High       |

**Default: Cache-aside.** Simplest pattern, works for 80% of use cases.

### Cache-Aside (Lazy Loading)

```pseudocode
function get(key):
    value = cache.get(key)
    if value is null:
        value = database.get(key)
        cache.set(key, value, ttl=300)
    return value

function update(key, new_value):
    database.update(key, new_value)
    cache.delete(key)  // DELETE, not SET. Avoids race conditions.
```

**Rule: On write, DELETE the cache entry. Do not try to update it.** Updating creates race conditions between concurrent writes.

### Read-Through

Same as cache-aside but the cache library handles the DB fetch. Use when your cache layer supports it natively. The application only talks to the cache.

### Write-Through

```pseudocode
function update(key, new_value):
    cache.set(key, new_value)  // Cache layer writes to DB synchronously before returning
```

Use when you need strong read-after-write consistency AND you read recently written data.

### Write-Behind (Write-Back)

```pseudocode
function update(key, new_value):
    cache.set(key, new_value)
    queue_async_write(key, new_value)  // Persisted to DB asynchronously
```

Use only when you can tolerate data loss on cache failure. Good for analytics counters, non-critical metrics.

### TTL Strategy

| Data Type             | TTL          | Reasoning                               |
|-----------------------|--------------|-----------------------------------------|
| User profile          | 5-15 min     | Changes infrequently, stale OK briefly  |
| Product catalog       | 1-5 min      | Moderate change rate                    |
| Session data          | 30 min       | Matches session timeout                 |
| Config/feature flags  | 30-60 sec    | Need fast propagation                   |
| Computed aggregations | 1-15 min     | Expensive to recompute                  |

**Default: 5 minutes.** Adjust based on how much staleness your users tolerate.

### Cache Invalidation Approaches

1. **TTL expiry** (default) - simplest, handles most cases
2. **Explicit delete on write** - use with cache-aside
3. **Event-driven invalidation** - publish invalidation events on write; subscribers delete keys
4. **Version keys** - append a version number to the cache key; bump version on write

### Redis vs Memcached

| Factor                  | Redis       | Memcached   |
|-------------------------|-------------|-------------|
| Data structures         | Rich        | Key-value   |
| Persistence             | Yes         | No          |
| Replication             | Yes         | No          |
| Pub/Sub                 | Yes         | No          |
| Memory efficiency       | Good        | Better      |
| Multi-threaded          | No (mostly) | Yes         |
| Max value size          | 512 MB      | 1 MB        |

**Default: Redis.** Unless you only need a simple, volatile key-value cache at massive scale with no persistence needs.

### Multi-Layer Caching

```
Request -> L1 (in-process, e.g., Caffeine/Guava) -> L2 (distributed, e.g., Redis) -> Database
```

- **L1**: In-process. Sub-millisecond. Small capacity (100 MB - 1 GB). Short TTL (30-60 sec).
- **L2**: Distributed. Single-digit milliseconds. Large capacity. Longer TTL.

Use L1 when you have a hot key problem or read latency matters at p99. Skip L1 when data changes frequently and consistency matters, or your service has many instances (each L1 diverges).

### Cache Stampede Prevention

When a popular key expires, hundreds of requests hit the database simultaneously.

**Solution 1 - Locking (default):**
```pseudocode
function get_with_lock(key):
    value = cache.get(key)
    if value is null:
        if acquire_lock(key, timeout=5s):
            value = database.get(key)
            cache.set(key, value, ttl=300)
            release_lock(key)
        else:
            sleep(50ms)
            return get_with_lock(key)  // Retry, lock holder populates cache
    return value
```

**Solution 2 - Probabilistic early expiry:**
```pseudocode
function get_with_early_recompute(key):
    value, expiry = cache.get_with_expiry(key)
    ttl_remaining = expiry - now()
    if value is not null AND random() < exp(-ttl_remaining / beta):
        value = database.get(key)
        cache.set(key, value, ttl=300)
    return value
```

Use locking for most cases. Use probabilistic early expiry for extremely hot keys where lock contention itself becomes a bottleneck.

## 3. Message Queues and Event-Driven Architecture

### When to Use a Queue vs Direct Call

| Scenario                                     | Direct Call | Queue   |
|----------------------------------------------|-------------|---------|
| Need synchronous response                    | YES         | No      |
| Caller does not need to know the result      | No          | YES     |
| Downstream is unreliable or slow             | No          | YES     |
| Need to fan out to multiple consumers        | No          | YES     |
| Processing can be deferred                   | No          | YES     |
| Request-response within 100ms SLA            | YES         | No      |
| Need retry with backoff                      | No          | YES     |

**Default: Direct call for queries, queue for commands/events that don't need an immediate response.**

### Pub/Sub vs Point-to-Point

- **Point-to-point (queue):** One message, one consumer. Use for task distribution.
- **Pub/Sub (topic):** One message, many consumers. Use for event notification (e.g., order placed - notify shipping AND billing AND analytics).

### Delivery Semantics

| Semantic       | Guarantee                          | Use When                              |
|----------------|------------------------------------|---------------------------------------|
| At-most-once   | May lose messages                  | Metrics, logs (acceptable loss)       |
| At-least-once  | May duplicate messages             | Most business logic (DEFAULT)         |
| Exactly-once   | No loss, no duplicates             | Financial transactions                |

**Default: At-least-once with idempotent consumers.** Exactly-once is expensive and often an illusion - make your consumers idempotent instead.

```pseudocode
function handle_message(msg):
    if already_processed(msg.idempotency_key):
        ack(msg)
        return
    process(msg)
    mark_processed(msg.idempotency_key)
    ack(msg)
```

### Dead Letter Queues (DLQ)

- Always configure a DLQ. Set max retry count to 3-5.
- Monitor DLQ depth. Alert when it grows.
- Build tooling to replay DLQ messages after fixing the bug.
- Never silently drop messages.

### Backpressure Handling Checklist

- [ ] Set max queue depth. Reject or shed load when full.
- [ ] Consumer scales with queue depth (autoscaling).
- [ ] Producer has circuit breaker if queue is unavailable.
- [ ] Monitor consumer lag. Alert when lag exceeds N minutes.
- [ ] Have a plan for falling hours behind (skip, batch, prioritize).

### Kafka vs RabbitMQ vs SQS

| Factor                 | Kafka               | RabbitMQ            | SQS                  |
|------------------------|---------------------|---------------------|----------------------|
| Throughput             | Very high (1M+/sec) | High (50K+/sec)     | High (managed)       |
| Ordering               | Per-partition       | Per-queue           | Best-effort (FIFO*)  |
| Message replay         | Yes (retention)     | No                  | No                   |
| Consumer groups        | Native              | Manual              | No                   |
| Ops complexity         | High                | Medium              | None (managed)       |
| Exactly-once           | Yes (with config)   | No                  | FIFO dedup window    |
| Best for               | Event streaming,    | Task queues,        | Simple async,        |
|                        | event sourcing      | RPC patterns        | serverless, AWS      |

**Defaults:**
- AWS shop, simple async work - **SQS**
- Need message replay or event streaming - **Kafka**
- Complex routing, priority queues, RPC - **RabbitMQ**

## 4. Load Balancing

### Algorithm Decision Table

| Algorithm           | Best For                                 | Avoid When                        |
|---------------------|------------------------------------------|-----------------------------------|
| Round-robin         | Homogeneous backends, stateless          | Backends have different capacity  |
| Weighted round-robin| Heterogeneous backends                   | Load varies per request           |
| Least connections   | Varying request duration                 | Needs accurate connection counts  |
| Consistent hashing  | Caching layers, sticky needs             | Backends frequently added/removed |
| Random              | Simple, surprisingly effective           | Need deterministic routing        |

**Default: Round-robin for stateless services. Least connections when request latency varies significantly.**

### L4 vs L7 Load Balancing

| Feature            | L4 (Transport)         | L7 (Application)         |
|--------------------|------------------------|---------------------------|
| Inspects           | TCP/UDP headers        | HTTP headers, URL, body   |
| Performance        | Faster (less parsing)  | Slower (full parsing)     |
| Routing            | IP + port only         | Path, header, cookie      |
| TLS termination    | Pass-through or term   | Always terminates         |
| Cost               | Lower                  | Higher                    |
| Use case           | TCP services, DBs      | HTTP APIs, web apps       |

**Default: L7 for HTTP services (you almost always want path-based routing, header inspection, and TLS termination).**

### Health Check Checklist

- [ ] Liveness check: is the process alive? (simple HTTP 200)
- [ ] Readiness check: can it serve traffic? (DB connected, caches warm)
- [ ] Health endpoint checks downstream dependencies with timeouts
- [ ] Interval: 10 seconds. Threshold: 3 consecutive failures before removing.
- [ ] Health check is lightweight - no expensive DB queries.

### Connection Draining

When removing a backend from the pool:

1. Stop sending new requests to the node.
2. Let in-flight requests complete (drain timeout: 30 seconds).
3. If requests still in-flight after timeout, forcibly close.
4. Shut down the node.

Never skip connection draining during deployments. It causes user-visible errors.

## 5. Microservices Patterns

### Service Boundary Checklist

- [ ] The service owns its data (no shared database with another service).
- [ ] The service can be deployed independently.
- [ ] The service maps to a bounded context (one business domain).
- [ ] The team can make changes without coordinating with other teams.
- [ ] It is not so small that every operation requires cross-service calls.

**If two services are always deployed together or always change together, merge them.**

### Sync vs Async Communication

| Factor                        | Sync (HTTP/gRPC)       | Async (Events/Queues)   |
|-------------------------------|------------------------|--------------------------|
| Need immediate response       | YES                    | No                       |
| Temporal coupling acceptable  | YES                    | No                       |
| Fan-out to many services      | No                     | YES                      |
| Resilience to downstream fail | Low                    | High                     |
| Debugging/tracing difficulty  | Low                    | High                     |

**Default: Sync for queries (reads). Async for commands/events (writes that trigger side effects).**

### API Gateway Pattern

Place an API gateway in front of your microservices when:
- Clients need a single entry point (mobile, SPA).
- You need cross-cutting concerns: auth, rate limiting, request logging.
- You want to aggregate responses from multiple services.

Do NOT build a custom gateway. Use an existing one (Kong, Envoy, AWS API Gateway).

### Service Mesh

Consider a service mesh (Istio, Linkerd) when you have 15+ services and need standardized observability, mTLS, and traffic management. Skip the service mesh when you have fewer than 10 services - the operational overhead is not worth it.

### Database Per Service

**Non-negotiable.** Each service owns its data store. Other services access data through the service's API, never by querying the database directly.

If you need data from another service:
1. Call their API (sync).
2. Consume their events and maintain a local read model (async, preferred for high-read scenarios).
3. Never share a database. It creates hidden coupling that makes independent deployment impossible.

## 6. CAP Theorem Applied

### What CAP Actually Means

- **Consistency (C):** Every read returns the most recent write.
- **Availability (A):** Every request receives a response (not an error).
- **Partition Tolerance (P):** System continues operating despite network partitions between nodes.

**Key insight: Network partitions will happen.** You do not get to opt out of P. Your real choice is between C and A during a partition.

### Why "CA" Does Not Exist

A "CA" system assumes the network never partitions. In a distributed system, this is fantasy. A single-node PostgreSQL is technically "CA" but it is not distributed - it is just a database. The moment you add a second node, you must handle partitions.

### CP vs AP - Decision Table

| System Type | During Partition         | Example Systems                    | Use When                           |
|-------------|--------------------------|------------------------------------|------------------------------------|
| CP          | Rejects some requests    | ZooKeeper, etcd, HBase, MongoDB*   | Correctness > availability.        |
|             | to preserve consistency  | (with majority write concern)      | Financial data, leader election,   |
|             |                          |                                    | distributed locks, inventory counts|
| AP          | Serves possibly stale    | Cassandra, DynamoDB, CouchDB, DNS  | Availability > consistency.        |
|             | data to stay available   |                                    | Shopping carts, social feeds,      |
|             |                          |                                    | user preferences, analytics        |

*MongoDB is configurable - it can behave as CP or AP depending on read/write concern settings.

### Real-World Examples

**CP - Bank account balance:** User withdraws during a partition. CP rejects the request rather than risk an overdraft. Temporary unavailability beats losing money.

**AP - Social media feed:** During a partition, a 30-second stale feed beats an error page. Users notice downtime but not slight staleness.

### Practical Checklist

- [ ] Identify: Is this data correctness-critical or availability-critical?
- [ ] Correctness-critical (money, inventory, auth) - choose CP.
- [ ] Availability-critical (feeds, recommendations, caches) - choose AP.
- [ ] Most systems are a mix - different data stores for different needs.
- [ ] Do not over-index on CAP. Partitions are rare. Focus on latency vs consistency tradeoffs for the common case.

## Quick Reference - Opinionated Defaults

| Decision                  | Default                                      |
|---------------------------|----------------------------------------------|
| Scaling strategy          | Vertical first, horizontal when forced       |
| Caching pattern           | Cache-aside with TTL                         |
| Cache technology          | Redis                                        |
| Cache TTL                 | 5 minutes                                    |
| Cache invalidation        | Delete on write + TTL expiry                 |
| Stampede prevention       | Locking                                      |
| Message queue (AWS)       | SQS                                          |
| Message queue (streaming) | Kafka                                        |
| Delivery semantics        | At-least-once + idempotent consumers         |
| Load balancer algorithm   | Round-robin (stateless), least-conn (varied) |
| Load balancer layer       | L7 for HTTP services                         |
| Service communication     | Sync for reads, async for events             |
| Database sharing          | Never. Database per service.                 |
| CAP for money             | CP                                           |
| CAP for feeds             | AP                                           |
