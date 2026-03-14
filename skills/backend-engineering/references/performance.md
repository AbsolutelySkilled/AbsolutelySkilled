<!-- Part of the Backend Engineering AbsolutelySkilled skill. Load this file when diagnosing performance issues, optimizing queries, or tuning system resources. -->

# Performance Reference

Practical guide for diagnosing and fixing backend performance problems. Assumes you
have basic observability in place. If not, set that up first - you cannot optimize
what you cannot measure.

---

## 1. Performance Diagnosis Workflow

Follow this order. Do not skip to profiling code before ruling out infrastructure.

```
1. CHECK METRICS (dashboards, APM)
   |
2. IDENTIFY BOTTLENECK CATEGORY
   +-- CPU bound?      -> high CPU %, low I/O wait
   +-- Memory bound?   -> high RSS, swap usage, OOM kills
   +-- I/O bound?      -> high iowait %, disk queue depth
   +-- Network bound?  -> high latency to dependencies, packet loss
   |
3. DRILL DOWN into the specific category (see sections below)
   |
4. REPRODUCE under controlled load -> FIX -> VERIFY under same load
```

**Flame graphs** answer "where is CPU time spent?" Read bottom-up. Wide bars at the
top = leaf functions consuming time. Generate with `perf` (Linux), `async-profiler`
(JVM), or `py-spy` (Python).

**APM checklist:**
- [ ] RED metrics visible (Rate, Errors, Duration) per endpoint
- [ ] Slow transaction traces enabled (threshold: 2x your p95)
- [ ] Database query tracking with EXPLAIN capture
- [ ] External call latency tracked per dependency

**Load testing phases:**

| Phase | What to test | Tool examples |
|---|---|---|
| Smoke | Works at 1-5 users? | curl, httpie |
| Load | Expected traffic (1x baseline) | k6, Locust, wrk |
| Stress | 2-5x traffic, find breaking point | k6, Gatling |
| Soak | Sustained hours, find leaks | k6 long duration |

Always load test against production-like dataset sizes.

---

## 2. Query Optimization

### Reading EXPLAIN plans

Key fields (PostgreSQL; similar concepts in MySQL):

| EXPLAIN field | Good sign | Bad sign |
|---|---|---|
| `Seq Scan` | On tiny tables (<1000 rows) | On large tables - missing index |
| `Index Scan` | Selective index | Index returning >10% of rows |
| `Nested Loop` | Inner side uses index | Inner side is Seq Scan |
| `Hash Join` | Fits in memory | Spilling to disk |
| `Rows` (est vs actual) | Close match | Off by 10x+ - run ANALYZE |

Always use `EXPLAIN (ANALYZE, BUFFERS)` for actual execution data.

### Common anti-patterns

| Anti-pattern | Fix |
|---|---|
| `SELECT *` | Select only needed columns |
| N+1 queries | JOIN, batch fetch, or dataloader |
| Missing index on WHERE/JOIN/ORDER BY | Add targeted index |
| Implicit type cast (`WHERE varchar_col = 123`) | Match types explicitly |
| `LIKE '%term%'` | Full-text search or trigram index |
| Function on indexed column (`WHERE YEAR(col) = 2024`) | Use range predicate |
| `DISTINCT` hiding a bad JOIN | Fix the JOIN |

### Query rewriting techniques

```sql
-- SLOW: correlated subquery runs per row
SELECT o.id FROM orders o
WHERE o.total > (SELECT AVG(total) FROM orders WHERE user_id = o.user_id);

-- FAST: window function, single pass
SELECT id FROM (
  SELECT id, total, AVG(total) OVER (PARTITION BY user_id) AS avg_total
  FROM orders
) sub WHERE total > avg_total;
```

**Batch operations:** Replace N individual inserts with multi-row `INSERT INTO t (col)
VALUES ('a'), ('b'), ('c')`. Use prepared statements for any repeated query.

---

## 3. Connection Pooling

### Why it matters

Opening a connection is expensive: TCP + TLS handshake + auth + server memory.
Without pooling: 100 concurrent requests = 100 connections opened/closed.
With pooling: 100 concurrent requests = 10-20 reused connections.

### Pool sizing formula

```
connections = (core_count * 2) + spindle_count
```

For a 4-core server with SSDs: `(4 * 2) + 0 = 8` connections.

Most teams set pool size too high. 50-100 per app instance is almost always wrong.
More connections = more lock contention and memory on the DB. Start small, measure.

### Connection leak detection

Symptoms: pool exhaustion after hours, connection count grows monotonically, works
after restart then degrades.

```pseudocode
pool.on('acquire', (conn) => {
  log.debug('acquired', conn.id, stack_trace())
  setTimeout(() => {
    if (conn.still_acquired)
      log.warn('possible leak', conn.id, conn.acquired_stack_trace)
  }, 30_000)
})
pool.on('release', (conn) => log.debug('released', conn.id))
```

### PgBouncer modes

| Mode | Behavior | Default choice? |
|---|---|---|
| Transaction pooling | Returned after each transaction | Yes - use this |
| Session pooling | Held for entire session | Only if you need temp tables/prepared stmts |
| Statement pooling | Returned after each statement | Rarely useful |

### Pool exhaustion fixes

| Symptom | Fix |
|---|---|
| "pool exhausted" errors | Check for leaks first, then increase size |
| Queries queueing | Add query timeout, move slow queries to replica |
| Idle-in-transaction | Acquire connection only when executing queries |
| Burst errors after deploy | Add connection warmup, set min pool size |

---

## 4. Async Patterns

### When to use what

| Pattern | Best for | Avoid when |
|---|---|---|
| Event loop (Node, asyncio) | I/O-bound: HTTP, DB, file reads | CPU work blocks the loop |
| Thread pool (Java, Go) | CPU-bound: image processing, parsing | Threads >> cores |
| Hybrid (worker threads) | Mixed workloads | Over-engineering simple I/O services |

**The rule:** Waiting on external things? Async. Crunching data on CPU? Threads.

### Promise/future patterns

```pseudocode
// Fan-out (parallel I/O) - total time = max, not sum
results = await Promise.all([fetch_user(id), fetch_orders(id), fetch_prefs(id)])

// Settle all, handle partial failures
results = await Promise.allSettled([task1, task2, task3])
succeeded = results.filter(r => r.status === 'fulfilled')
```

### Background job queues

Use when: work >500ms, user doesn't wait, must survive restarts, needs retry logic.

**Queue checklist:**
- [ ] Jobs are idempotent (safe to retry)
- [ ] Max retry count with exponential backoff
- [ ] Dead letter queue for permanently failed jobs
- [ ] Payload contains IDs, not full objects
- [ ] Per-job-type processing timeout

### Worker pool sizing

```pseudocode
// I/O-bound:  core_count * (1 + wait_time / compute_time)
// CPU-bound:  core_count (or core_count - 1 for headroom)
// Mixed:      start at core_count * 2, adjust by measured utilization
```

---

## 5. Caching for Performance

### Hot path identification

1. Sort endpoints by request volume
2. Check if response is cacheable (same input = same output)
3. Measure per-request cost (DB queries, external calls)
4. Cache where `volume * cost` is highest

### Cache hit ratio targets

| Cache type | Target | Below target means |
|---|---|---|
| Hot path (profiles, config) | >95% | Bad key design or TTL too short |
| Search/feeds | >80% | High cardinality, try partial caching |
| Aggregations | >70% | Data changes too fast |
| Sessions | >99% | Store misconfigured |

A cache with <50% hit ratio is added latency and cost. Remove it.

### Cache-aside with database fallback

```pseudocode
function get_user(user_id):
  cached = cache.get("user:" + user_id)
  if cached != null: return cached

  user = db.query("SELECT ... WHERE id = ?", user_id)
  if user == null:
    cache.set("user:" + user_id, NULL_SENTINEL, ttl=60)  // prevent stampede
    return null

  cache.set("user:" + user_id, user, ttl=3600)
  return user

function update_user(user_id, data):
  db.update(...)
  cache.delete("user:" + user_id)  // DELETE, don't SET - avoids race conditions
```

Always invalidate by deleting, not updating. Delete + lazy reload avoids stale-write
race conditions.

### Materialized views as caching

```sql
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT date_trunc('day', created_at) AS day, SUM(amount), COUNT(*)
FROM orders GROUP BY 1;

REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue;  -- no read lock
```

---

## 6. Memory and Resource Management

### Memory leak detection

| Symptom | Common cause |
|---|---|
| RSS grows over hours | Unbounded caches, event listener accumulation |
| GC pauses increasing | Objects promoted to old gen |
| OOM kills | Limit too low or actual leak |

**Process:** Take heap snapshot after warmup. Run load 30min. Take second snapshot.
Diff objects - growing counts = likely leak source.

### GC tuning basics

| Concern | Lever |
|---|---|
| Frequent minor GCs | Increase young gen size |
| Long major GC pauses | Use concurrent collector (G1GC, ZGC) |
| High GC overhead (>10% CPU) | Reduce allocation rate in code first |

GC tuning is a last resort. Reduce allocation rate by fixing the code first.

### Resource limits checklist

- [ ] **File descriptors** - Set to 65535+. Default 1024 is too low. (`ulimit -n`)
- [ ] **DB connections** - Match `max_connections` to total pool size across all instances
- [ ] **Memory limits** - Leave 10-20% headroom above peak for GC and OS
- [ ] **TIME_WAIT sockets** - Tune `tcp_tw_reuse` for high outbound connection rates

---

## 7. Latency Budgets

### Budget allocation example (200ms total)

```
API Gateway: 5ms -> Auth: 15ms -> Main Service: 80ms -> Downstream: 50ms
                                   |-> DB: 30ms        Network overhead: 40ms
                                   |-> Cache: 5ms      Serialization: 10ms
                                   |-> Compute: 20ms
```

- [ ] Reserve 20% for network overhead and variance
- [ ] No single dependency gets >40% of total budget
- [ ] Set timeouts equal to budget allocation at each hop

### p50 vs p99

| Percentile | What it tells you |
|---|---|
| p50 | Typical experience - half see this or better |
| p95 | Bad-day experience - 1 in 20 requests |
| p99 | Worst realistic experience - often your biggest users |

**Optimize for p99 first.** A service with p50=100ms, p99=150ms is better than
p50=30ms, p99=3000ms. Consistency beats average speed. At 100 requests per session,
every user hits p99 at least once.

### Tail latency amplification

When fanning out to N parallel calls, overall latency = slowest response:

| Fan-out | Impact | Mitigation |
|---|---|---|
| 1-3 services | Manageable | Standard retry + timeout |
| 5-10 services | p99 becomes common | Hedged requests (send to 2, take first) |
| 10-50 services | Tail dominates | Deadline propagation, partial results |
| 50+ services | Assume partial failure | Best-effort response, fill in async |

**Key mitigations:**
- [ ] **Hedged requests** - After p50 latency, send duplicate to another replica
- [ ] **Deadline propagation** - Pass remaining budget downstream
- [ ] **Partial results** - Return incomplete data with completeness indicator
- [ ] **Request coalescing** - Deduplicate identical in-flight downstream calls
