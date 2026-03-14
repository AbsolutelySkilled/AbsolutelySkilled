<!-- Part of the microservices AbsolutelySkilled skill. Load this file when
     implementing specific microservice patterns. -->

# Microservice Patterns Reference

Detailed implementation guidance for core microservice patterns. Each pattern section covers intent, when to use it, how it works, and implementation notes.

---

## Saga Pattern

**Intent:** Manage distributed transactions across multiple services without two-phase commit.

**How it works:** A saga is a sequence of local transactions. Each local transaction updates the service's own database and publishes an event or sends a command. If a step fails, compensating transactions execute in reverse order to undo the completed steps.

### Choreography-based Saga

No central coordinator. Each service reacts to events and emits its own events.

```
OrderService  --[OrderCreated]--> PaymentService
PaymentService --[PaymentProcessed]--> InventoryService
InventoryService --[StockReserved]--> ShippingService

On failure:
InventoryService --[StockReservationFailed]--> PaymentService (compensate: refund)
PaymentService --[PaymentRefunded]--> OrderService (compensate: cancel order)
```

- Pros: No single point of failure, loose coupling
- Cons: Hard to trace across services, complex to understand the overall flow

### Orchestration-based Saga

A saga orchestrator (dedicated service or state machine) sends commands and tracks progress.

```
SagaOrchestrator:
  1. Send ReserveStock to InventoryService
  2. On StockReserved: Send ProcessPayment to PaymentService
  3. On PaymentProcessed: Send CreateShipment to ShippingService
  4. On failure at any step: issue compensating commands in reverse
```

- Pros: Explicit flow, easy to trace, clear failure handling
- Cons: Orchestrator can become a bottleneck; adds another service to maintain

**Implementation rules:**
- All compensating transactions must be idempotent
- Use a saga log / state machine to survive orchestrator crashes
- Publish events atomically with DB writes using the transactional outbox pattern

---

## CQRS (Command Query Responsibility Segregation)

**Intent:** Separate the model used for writes (commands) from the model used for reads (queries).

**How it works:**

```
Client
  |-- Command (write) --> Command Handler --> Write Store (normalized)
  |                                           |
  |                                           +--> Domain Event
  |                                                     |
  |                                             Event Handler --> Read Store (denormalized)
  |
  +-- Query (read)  --> Query Handler --> Read Store
```

### Logical CQRS (same datastore, separated code)

Separate command and query handlers in code. Both read from the same database but use different models. Start here before introducing separate stores.

### Physical CQRS (separate datastores)

- Write store: normalized relational DB, optimized for consistency
- Read store: denormalized (Elasticsearch, Redis, read-replica), optimized for query patterns
- Sync via domain events (eventually consistent)

**When to use:** High read-to-write ratio, complex query requirements that differ from write requirements, need to scale reads independently.

**Pitfalls:**
- Read models are eventually consistent - design UX to handle this
- Increased operational complexity (two stores to maintain)
- Do not apply CQRS everywhere - only where there is a real read/write asymmetry

---

## Event Sourcing

**Intent:** Store the state of a domain object as a sequence of events rather than current state.

**How it works:**

```
Traditional:  DB row = {orderId: 1, status: "shipped", total: 100}

Event Sourced: event store = [
  {type: "OrderCreated", orderId: 1, total: 100},
  {type: "PaymentProcessed", orderId: 1, amount: 100},
  {type: "OrderShipped", orderId: 1, trackingId: "XYZ"}
]
Current state = replay of all events
```

**Benefits:**
- Full audit log of every state change
- Ability to rebuild any past state
- Natural fit for CQRS (events populate read models)
- Event stream is the integration contract

**Drawbacks:**
- Schema evolution of events is hard - cannot alter past events
- Rebuilding state from a long history is slow (use snapshots)
- Eventual consistency by default
- High cognitive overhead for developers unfamiliar with the pattern

**Snapshots:** Periodically capture current state as a snapshot. On replay, load the last snapshot then apply only subsequent events.

---

## Circuit Breaker

**Intent:** Prevent cascading failures by stopping requests to a failing downstream service.

### State Machine

```
[CLOSED] ---(failure threshold exceeded)---> [OPEN]
[OPEN]   ---(timeout elapsed)-------------> [HALF-OPEN]
[HALF-OPEN] ---(probe succeeds)-----------> [CLOSED]
[HALF-OPEN] ---(probe fails)--------------> [OPEN]
```

### Configuration parameters

| Parameter | Description | Typical value |
|-----------|-------------|---------------|
| Failure threshold | % of failures to trip to OPEN | 50% |
| Minimum requests | Minimum calls before evaluating | 10 |
| Open timeout | How long to stay OPEN before probing | 30-60s |
| Slow call threshold | Duration considered a slow call | 1-2s |

### Fallback strategies (in order of preference)

1. Return cached / stale data
2. Return a degraded response (partial data)
3. Return a default / empty response
4. Fail fast with a meaningful error (last resort)

### Libraries

| Language | Library |
|----------|---------|
| Java | Resilience4j, Hystrix (deprecated) |
| .NET | Polly |
| Node.js | opossum, cockatiel |
| Go | gobreaker, sony/gobreaker |
| Python | pybreaker |

---

## Bulkhead

**Intent:** Isolate failures by partitioning resources so that a failure in one partition does not exhaust resources for others.

**Analogy:** Ship bulkheads - compartments prevent the whole ship from sinking if one section floods.

### Thread pool bulkhead

Assign separate thread pools to different downstream calls. If the payment service is slow and exhausts its pool, the user service pool is unaffected.

```
[HTTP Request Pool]
  ├── [Payment Service Pool: 10 threads]
  ├── [Inventory Service Pool: 10 threads]
  └── [User Service Pool: 10 threads]
```

### Semaphore bulkhead

Limit concurrent calls to a downstream service using a semaphore rather than a separate thread pool.

**When to use:** When you have many downstream dependencies and want to prevent any single slow dependency from saturating your application's thread pool or connection pool.

**Combine with:** Circuit breaker (bulkhead limits concurrent calls; circuit breaker stops calls entirely when the service is unhealthy).

---

## Sidecar Pattern

**Intent:** Offload cross-cutting concerns (logging, tracing, mTLS, config) into a separate process (the sidecar) that runs alongside the main service container.

**How it works:** The sidecar container shares the same network namespace and lifecycle as the primary container (same Pod in Kubernetes). All inbound and outbound traffic is intercepted by the sidecar proxy.

```
[Pod]
  ├── [App Container]  <--> localhost <--> [Sidecar Proxy (Envoy)]
  └── [Sidecar handles: mTLS, retries, tracing, metrics]
```

**Common sidecar responsibilities:**
- mTLS termination and certificate rotation
- Distributed tracing header injection
- Metrics collection (Prometheus scraping)
- Log shipping
- Config/secret fetching (Vault agent injector)

**Used by:** Istio, Linkerd, Dapr, AWS App Mesh

---

## Ambassador Pattern

**Intent:** Create a helper service that sends network requests on behalf of a service, handling cross-cutting concerns like retry, timeout, and circuit breaking without changing the application.

**Difference from sidecar:** The ambassador pattern is a conceptual pattern; a sidecar is the deployment mechanism. An ambassador proxy is a sidecar that specifically handles outbound network traffic.

**Use cases:**
- Legacy services that cannot be modified but need circuit breaking added
- Standardizing retry and timeout policies across polyglot services
- Monitoring outbound calls without modifying application code

```
[Legacy Service] --> [Ambassador Proxy] --> [Downstream Service]
                     (handles retry, CB, mTLS)
```

---

## Strangler Fig Pattern

**Intent:** Incrementally migrate a monolith to microservices by routing traffic to new services while the monolith shrinks.

**Named after:** The strangler fig tree, which grows around a host tree and eventually replaces it.

### Migration steps

1. **Facade first:** Place an API gateway or reverse proxy in front of the monolith. No behavior change yet.
2. **Identify a domain:** Pick the least-coupled, most well-defined bounded context to extract first.
3. **Build the new service:** Implement the domain logic in the new service with its own data store.
4. **Migrate data:** Sync data from the monolith to the new service's store (dual-write or backfill).
5. **Route traffic:** Switch the gateway to route that domain's requests to the new service.
6. **Remove from monolith:** Delete the migrated code from the monolith.
7. **Repeat:** Iterate for each domain.

### Data migration approaches

| Approach | Description | Risk |
|----------|-------------|------|
| Dual-write | Write to both old and new store during transition | Low - easy to roll back |
| Backfill + cutover | Backfill historical data, then cut over | Medium - requires data freeze or reconciliation |
| Event replay | Replay events to populate new store | Low if events are available |

**Do not:**
- Extract many services at once
- Cut over before the new service has proven reliability in production
- Neglect to remove the extracted code from the monolith (creates a distributed monolith)

---

## Transactional Outbox Pattern

**Intent:** Guarantee that a database write and a message publish happen atomically, preventing message loss on service crash.

**Problem:** Writing to DB and publishing to a message broker are two separate operations. A crash between them leaves the system in an inconsistent state.

**Solution:**

```
Service:
  BEGIN TRANSACTION
    INSERT INTO orders (...)
    INSERT INTO outbox (event_type, payload, published=false)
  COMMIT

Outbox Poller (separate process):
  SELECT * FROM outbox WHERE published = false
  FOR EACH event:
    publish to message broker
    UPDATE outbox SET published = true WHERE id = ?
```

The outbox table lives in the same database as the domain data, so the write is a single local transaction. The poller handles publishing asynchronously.

**Variants:**
- **Polling publisher:** Simple poller queries the outbox table
- **Transaction log tailing (CDC):** Debezium or similar tools tail the database WAL and publish changes - lower latency, no polling load on DB

---

## API Gateway Pattern

**Intent:** Provide a single entry point for all client requests, handling cross-cutting concerns and routing to appropriate backend services.

### Responsibilities

| Responsibility | Notes |
|----------------|-------|
| Routing | Map URL paths to backend services |
| Authentication | Validate tokens before forwarding |
| Rate limiting | Per-client or per-endpoint throttling |
| SSL termination | Terminate HTTPS at the gateway |
| Request/response transformation | Header manipulation, protocol translation |
| Aggregation | Compose multiple service responses (BFF) |
| Caching | Cache frequently requested, slowly-changing responses |

### Backend for Frontend (BFF)

Create separate API gateway instances (or route configurations) for different client types:

```
Mobile App  --> [Mobile BFF]  --> Service A, Service B
Web App     --> [Web BFF]     --> Service A, Service C
Partner API --> [Partner GW]  --> Service D (subset of API)
```

BFF enables each client to get exactly the data it needs without over-fetching or under-fetching, and allows mobile-specific optimizations (payload compression, reduced fields).

**Tools:** Kong, AWS API Gateway, nginx, Envoy, Traefik, Azure API Management

---

## Service Mesh

**Intent:** Handle service-to-service communication concerns (observability, security, resilience) at the infrastructure layer, removing them from application code.

### Architecture

```
[Control Plane]  --(config)--> [Data Plane: Envoy sidecars on every pod]
(Istio Pilot /
 Linkerd control plane)
```

### Capabilities

| Capability | Description |
|------------|-------------|
| mTLS | Automatic certificate rotation, zero-trust networking |
| Traffic management | Canary releases, A/B testing, traffic mirroring |
| Observability | Automatic distributed traces, metrics, access logs |
| Retries & timeouts | Configured at mesh level, not in application code |
| Circuit breaking | Outlier detection at the proxy layer |

### When to adopt

- You have 10+ services and cross-cutting concerns are inconsistently implemented
- You need zero-trust networking (mTLS between all services)
- You want canary deployments and traffic splitting without application changes

**Do not adopt** a service mesh for fewer than 5-10 services - the operational overhead is not justified.

**Tools:** Istio, Linkerd, Consul Connect, AWS App Mesh, Kuma
