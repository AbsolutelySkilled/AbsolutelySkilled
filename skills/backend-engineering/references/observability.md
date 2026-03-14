<!-- Part of the Backend Engineering AbsolutelySkilled skill. Load this file when setting up logging, metrics, tracing, alerting, or SLOs. -->

# Observability Reference

Observability is not monitoring. Monitoring tells you *when* something is broken. Observability tells you *why*. The three pillars - logs, metrics, traces - are useless in isolation. They work together. Invest in correlation between them from day one.

---

## 1. Structured Logging

### Use JSON Logs - Always

Plain text logs are for humans staring at a terminal. JSON logs are for systems that need to search, filter, and aggregate across millions of entries. Every service should emit structured JSON.

```json
{
  "timestamp": "2025-03-14T10:23:45.123Z",
  "level": "ERROR",
  "service": "payment-service",
  "trace_id": "abc123def456",
  "request_id": "req-789",
  "user_id": "u-42",
  "method": "POST",
  "path": "/api/v1/charges",
  "status": 500,
  "duration_ms": 234,
  "error": "upstream timeout from billing-gateway",
  "message": "Failed to process charge"
}
```

### Log Levels

| Level   | When to Use                                          | Example                                  |
|---------|------------------------------------------------------|------------------------------------------|
| `TRACE` | Fine-grained debugging, never in production          | Cache key lookup details                 |
| `DEBUG` | Development diagnostics, off by default in prod      | SQL query parameters                     |
| `INFO`  | Normal operations worth recording                    | Request completed, job started/finished  |
| `WARN`  | Recoverable issues that need attention               | Retry succeeded, fallback used, pool low |
| `ERROR` | Failures that need investigation                     | Request failed, dependency timeout       |
| `FATAL` | Process cannot continue                              | DB connection lost, config missing        |

**Opinion:** Default to `INFO` in production. If you are logging at `DEBUG` in production to diagnose an issue, you have a tracing or metrics gap.

### Correlation IDs

Every request entering your system gets a correlation/trace ID. Propagate it through every service call.

```
Client -> API Gateway (generates trace_id: "abc123")
  -> Service A (logs with trace_id: "abc123", span_id: "span-1")
    -> Service B (logs with trace_id: "abc123", span_id: "span-2")
    -> Service C (logs with trace_id: "abc123", span_id: "span-3")
```

Propagation checklist:
- [ ] Extract `X-Request-ID` or `traceparent` header on ingress
- [ ] Generate one if missing (at the edge only)
- [ ] Attach to thread-local / async context
- [ ] Include in every log line automatically (middleware, not manual)
- [ ] Forward in all outbound HTTP/gRPC/message headers

### What to Log vs What NOT to Log

| Log This                          | Never Log This                        |
|-----------------------------------|---------------------------------------|
| Request ID, trace ID              | Passwords, tokens, API keys           |
| User ID (pseudonymized if needed) | Credit card numbers, SSNs             |
| HTTP method, path, status code    | Full request/response bodies          |
| Duration in milliseconds          | PII (email, phone, address)           |
| Error messages and codes          | Session tokens or auth headers        |
| Upstream service and latency      | Database connection strings            |
| Queue depth, retry count          | Internal IP addresses (in public logs) |

**Opinion:** If you log full request bodies "for debugging," you will eventually leak PII into your log aggregator. Log a content hash or size instead.

### Log Aggregation Patterns

- Ship logs via a sidecar or agent (Fluentd, Vector, Filebeat) - not directly from your app
- Use a structured pipeline: App -> Agent -> Buffer (Kafka) -> Aggregator (Elasticsearch/Loki)
- Set retention policies per log level: ERROR=90d, WARN=30d, INFO=14d
- Index on: `trace_id`, `service`, `level`, `status`, `user_id`

---

## 2. Metrics

### RED Method (for Services)

Use RED for any service that handles requests:

| Signal     | What It Measures             | Metric Type | Example Metric Name                    |
|------------|------------------------------|-------------|----------------------------------------|
| **R**ate   | Requests per second          | Counter     | `http_requests_total`                  |
| **E**rrors | Failed requests per second   | Counter     | `http_requests_errors_total`           |
| **D**uration | Time per request           | Histogram   | `http_request_duration_seconds`        |

### USE Method (for Resources)

Use USE for infrastructure - CPU, memory, disk, connections:

| Signal          | What It Measures                      | Example                              |
|-----------------|---------------------------------------|--------------------------------------|
| **U**tilization | % of resource capacity in use         | CPU at 72%, memory at 85%            |
| **S**aturation  | Work waiting (queue depth)            | 14 threads waiting for DB connection |
| **E**rrors      | Resource-level error events           | Disk I/O errors, network drops       |

### Metric Types

| Type        | Use When                                     | Example                                |
|-------------|----------------------------------------------|----------------------------------------|
| **Counter** | Value only goes up (resets on restart)        | Total requests, total errors           |
| **Gauge**   | Value goes up and down                       | Current connections, queue depth        |
| **Histogram** | You need distribution (p50, p95, p99)      | Request latency, response size         |
| **Summary** | Like histogram but calculated client-side    | Avoid - prefer histograms for flexibility |

**Opinion:** Default to histograms for latency. If you use averages for latency, you are hiding your tail - p99 problems are invisible in averages.

### Naming Conventions

```
<namespace>_<subsystem>_<name>_<unit>

payment_service_http_request_duration_seconds   # Good
payment_service_orders_processed_total          # Good
requestTime                                     # Bad: no namespace, no unit
PaymentService.http                             # Bad: dots and camelCase
```

Rules:
- [ ] Use snake_case
- [ ] Include the unit as a suffix (`_seconds`, `_bytes`, `_total`)
- [ ] Use `_total` suffix for counters
- [ ] Prefix with service/namespace
- [ ] Use base units (seconds not milliseconds, bytes not megabytes)

### Cardinality Traps

High-cardinality labels will kill your metrics backend. Every unique label combination creates a new time series.

| Label            | Cardinality | Safe?  |
|------------------|-------------|--------|
| `method`         | ~5          | Yes    |
| `status_code`    | ~5 (grouped)| Yes    |
| `endpoint`       | ~50         | Usually |
| `customer_tier`  | ~4          | Yes    |
| `user_id`        | Millions    | **NO** |
| `request_id`     | Infinite    | **NO** |
| `email`          | Millions    | **NO** |

**Rule of thumb:** If a label has more than ~100 unique values, do not put it on a metric. Use logs or traces for high-cardinality data.

---

## 3. Distributed Tracing

### Core Concepts

```
Trace (trace_id: "abc123")
+-- Span A: API Gateway (span_id: "s1", 245ms)
|   +-- Span B: Auth Service (span_id: "s2", parent: "s1", 12ms)
|   +-- Span C: Order Service (span_id: "s3", parent: "s1", 220ms)
|       +-- Span D: DB Query (span_id: "s4", parent: "s3", 45ms)
|       +-- Span E: Cache Lookup (span_id: "s5", parent: "s3", 3ms)
```

- **Trace:** The full journey of a request across all services
- **Span:** A single unit of work within a trace (one service call, one DB query)
- **Context propagation:** Passing trace_id + span_id between services via headers (`traceparent`)

### OpenTelemetry Basics

OpenTelemetry (OTel) is the standard. Use it.

```pseudo
tracer = OpenTelemetry.getTracer("payment-service")

function processOrder(order):
    span = tracer.startSpan("process-order")
    span.setAttribute("order.id", order.id)
    try:
        result = chargePayment(order)
        span.setStatus(OK)
        return result
    catch error:
        span.setStatus(ERROR)
        span.recordException(error)
        raise
    finally:
        span.end()
```

Prefer auto-instrumentation for HTTP/gRPC/DB clients. Add manual spans for business logic.

### Sampling Strategies

You cannot trace 100% of production traffic. Sampling is required.

| Strategy        | How It Works                                  | Trade-off                              |
|-----------------|-----------------------------------------------|----------------------------------------|
| **Head-based**  | Decide at ingress whether to sample            | Simple; misses interesting traces      |
| **Tail-based**  | Collect all spans, decide after trace completes| Catches errors and slow traces; costly |
| **Rate-limited** | Sample N traces per second                    | Predictable cost; biased sample        |

**Opinion:** Start with head-based sampling at 5-10%. Add tail-based sampling for errors and high-latency traces. Tail-based is harder to operate but catches the traces you actually need.

### When Tracing Matters Most

- Multi-service request chains (3+ hops)
- Async workflows (message queues, event-driven flows)
- Diagnosing latency - "where is the time spent?"
- Debugging fan-out/fan-in patterns
- Verifying retry and fallback behavior

Tracing is less useful for single-service, synchronous request-response. Logs and metrics are enough there.

---

## 4. SLOs and SLIs

### Defining SLIs

An SLI (Service Level Indicator) is a measurement of your service's behavior that users care about.

| SLI Type       | Definition                                    | Measurement                             |
|----------------|-----------------------------------------------|-----------------------------------------|
| Availability   | % of requests that succeed                    | `successful_requests / total_requests`  |
| Latency        | % of requests faster than threshold           | `requests < 300ms / total_requests`     |
| Throughput     | Requests processed per time window            | `requests_per_second`                   |
| Correctness    | % of requests returning correct results       | `correct_responses / total_responses`   |

### Setting Realistic SLOs

An SLO (Service Level Objective) is a target for your SLI, measured over a time window.

```
SLO: 99.9% of requests succeed within 300ms, 30-day rolling window
Error budget: At 100 rps -> 259M requests/month -> 0.1% = 259,200 failures allowed
```

| SLO Target | Downtime per Month | Realistic For                     |
|------------|-------------------|-----------------------------------|
| 99%        | 7.3 hours         | Internal tools, batch systems     |
| 99.9%      | 43.8 minutes      | Most production APIs              |
| 99.95%     | 21.9 minutes      | Customer-facing critical paths    |
| 99.99%     | 4.4 minutes       | Payment processing, auth services |
| 99.999%    | 26.3 seconds      | Almost nobody needs this          |

**Opinion:** Start with 99.9%. If you have not operated a service at 99.9% successfully, do not set a 99.99% target - you will just create noise.

### Error Budgets and Burn Rate

- **Error budget** = 1 - SLO target. For 99.9% SLO, budget is 0.1%
- **Burn rate** = how fast you consume budget. Rate of 1 = expected pace

```
Burn rate = error_rate_observed / error_rate_allowed
Example: 0.5% observed / 0.1% allowed = 5x burn -> 30-day budget gone in 6 days
```

### SLO-Based vs Threshold-Based Alerting

| Approach        | Alert When                                | Problem                               |
|-----------------|-------------------------------------------|---------------------------------------|
| Threshold       | Error rate > 1% for 5 minutes            | Too many false alarms or missed issues|
| **SLO-based**   | Burn rate threatens to exhaust budget     | Smarter - accounts for sustained impact|

SLO-based alerting (recommended):
- **Fast burn (14.4x):** Alert in 2 min, page immediately - major incident
- **Slow burn (3x):** Alert in 1 hour, create ticket - degradation trend

### Example SLO for a Web Service

```yaml
service: order-api
slos:
  - name: availability
    sli: successful_responses / total_responses  # (non-5xx)
    target: 99.9%
    window: 30d

  - name: latency
    sli: responses_under_300ms / total_responses
    target: 99.0%
    window: 30d

  - name: latency-critical
    sli: responses_under_1000ms / total_responses
    target: 99.9%
    window: 30d
```

---

## 5. Alerting

### Alert Fatigue - Causes and Prevention

| Cause                         | Fix                                           |
|-------------------------------|-----------------------------------------------|
| Alerts on symptoms, not impact| Alert on SLO burn rate, not CPU spikes        |
| No ownership                  | Every alert has a team owner                  |
| Duplicate alerts              | Deduplicate and group related alerts          |
| Flapping alerts               | Add hysteresis (alert on sustained condition) |
| Alerts nobody acts on         | Delete them. If nobody investigates, it is noise |

**Opinion:** If your on-call gets paged more than twice a week outside business hours, your alerts are broken. Fix the alerts, not the humans.

### Actionable Alerts Checklist

Every alert MUST have:

- [ ] **What** - clear description of the symptom
- [ ] **Impact** - who/what is affected and how severely
- [ ] **Runbook link** - step-by-step investigation/mitigation guide
- [ ] **Owner** - which team owns this alert
- [ ] **Severity** - page vs ticket vs notification
- [ ] **Dashboard link** - relevant dashboard for context
- [ ] **Expected behavior** - what "normal" looks like for comparison

If an alert does not have a runbook, it is not ready for production.

### Severity Levels

| Severity | Response           | Example                                    | SLA        |
|----------|--------------------|--------------------------------------------|------------|
| P1       | Page immediately   | Service down, data loss, security breach   | 15 min ack |
| P2       | Page during hours  | Degraded performance, partial outage       | 1 hour ack |
| P3       | Ticket, next day   | Elevated error rate, slow burn on budget   | Next biz day|
| P4       | Ticket, backlog    | Non-critical warning, capacity planning    | 1 week     |

### Escalation Patterns

```
T+0 min  -> Primary on-call paged
T+15 min -> No ack? Secondary on-call paged
T+30 min -> No ack? Engineering manager paged
T+60 min -> No resolution? Incident commander engaged
```

### On-Call Best Practices

- Rotate weekly, never longer. Handoff meetings at each rotation
- Track on-call burden: pages per shift, time-to-ack, hours spent
- Blameless postmortems for every P1 and repeated P2
- Budget 30% of sprint capacity for on-call follow-up work

---

## 6. Dashboards

### The Four Golden Signals Dashboard

Every service gets a dashboard with these four panels:

| Signal     | Metric                              | Visualization    |
|------------|-------------------------------------|------------------|
| Latency    | p50, p95, p99 request duration      | Time series graph |
| Traffic    | Requests per second                 | Time series graph |
| Errors     | Error rate (5xx / total)            | Time series graph |
| Saturation | CPU, memory, connection pool usage  | Gauge + graph    |

### Service Dashboard Template

```
Row 1: [SLO Status]  [Error Budget Remaining]  [Apdex Score]
Row 2: [Request Rate]  [Error Rate by Type]  [Latency p50/p95/p99]
Row 3: [Upstream Latency by Service]  [DB Query Duration]  [Cache Hit Rate]
Row 4: [CPU/Memory]  [Connection Pools]  [Queue Depth]
Row 5: [Orders/min]  [Revenue Impact]  [Active Users]
```

### Dashboard Anti-Patterns

| Anti-Pattern                 | Why It Hurts                                       | Fix                               |
|------------------------------|----------------------------------------------------|------------------------------------|
| 30+ panels on one dashboard  | Information overload, nothing stands out           | 8-12 panels max, link to details  |
| Vanity metrics (total users) | Feels good, reveals nothing about health           | Show rate-of-change, not totals   |
| No time range context        | Spikes look alarming without baseline              | Add week-over-week overlay        |
| Dashboard per person          | Inconsistent views, duplicated work               | One canonical dashboard per service|
| No annotations               | Deploys and incidents invisible on graphs          | Add deploy markers and incident bands|

---

## Quick Reference: Connecting the Three Pillars

```
"Orders are slow" ->
  1. Dashboard: p99 latency spiked at 14:32              (METRICS)
  2. Filter by endpoint: POST /orders is slow             (METRICS)
  3. Find traces for slow /orders requests                (TRACES)
  4. Trace shows 2s in inventory-service                  (TRACES)
  5. Search logs for inventory-service with trace_id      (LOGS)
  6. Log: "connection pool exhausted, waited 1.8s"        (LOGS)
  -> Root cause: DB pool too small after traffic increase
```

Metrics tell you *something is wrong*. Traces tell you *where*. Logs tell you *why*.
