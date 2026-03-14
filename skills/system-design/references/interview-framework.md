<!-- Part of the system-design AbsolutelySkilled skill. Load this file when
     preparing for or conducting system design interviews. -->

# System Design Interview Framework

A repeatable process for structuring system design interviews at FAANG and
equivalent companies. The framework is called **RESHADED** and gives you a
step-by-step structure so you never lose your place under pressure.

---

## The RESHADED Framework

| Step | Letter | What you do |
|---|---|---|
| 1 | **R** - Requirements | Clarify functional and non-functional requirements |
| 2 | **E** - Estimation | Back-of-envelope capacity estimates |
| 3 | **S** - Storage | Choose data model and database type |
| 4 | **H** - High-level design | Draw the major components and data flow |
| 5 | **A** - APIs | Define the public-facing or internal API contract |
| 6 | **D** - Detail | Deep dive into 1-2 components the interviewer cares about |
| 7 | **E** - Evaluation | Identify bottlenecks, SPOFs, and trade-offs |
| 8 | **D** - Distinctive features | Scale, fault tolerance, or advanced features |

---

## Step 1: Requirements (5 minutes)

Never start drawing boxes until you have nailed the requirements. Most failed
interviews are failed in the first 5 minutes by jumping to solutions.

### Functional requirements

Ask: "What should the system do? What are the core features?"

Focus on the minimum required - do not expand scope yourself. For a URL shortener:
- Users can shorten a URL
- Users can be redirected via the short URL
- (Optional) Users can see click analytics

### Non-functional requirements

Ask these specifically - interviewers expect you to:

| Question | Why it matters |
|---|---|
| What is the expected scale? (DAU, QPS) | Determines if a single machine works or you need distribution |
| What is the read/write ratio? | Drives caching strategy and DB choice |
| What is the latency SLA? | Determines where caches are needed |
| Is strong consistency required or is eventual OK? | Drives CAP choice |
| What is the availability target? (99.9%? 99.99%?) | Determines redundancy level |
| Geographic distribution needed? | Determines if multi-region is in scope |
| Data retention period? | Affects storage estimates |

### Functional vs non-functional checklist

- [ ] Core user actions defined (create, read, update, delete what?)
- [ ] Expected scale confirmed (DAU, peak QPS)
- [ ] Consistency requirement confirmed (strong vs eventual)
- [ ] Latency SLA noted
- [ ] Out-of-scope features explicitly named

---

## Step 2: Estimation (5 minutes)

Do this out loud. Interviewers assess your ability to reason about numbers, not
get them exactly right.

### Reference constants

| Metric | Value |
|---|---|
| Seconds per day | 86,400 (use 100,000 to round up) |
| Bytes per ASCII char | 1 byte |
| Average URL | 100 bytes |
| Average user profile | 1 KB |
| Average tweet/post | 300 bytes |
| Average image (compressed JPEG) | 300 KB |
| Average HD video (1 minute) | 50 MB |
| 1 TB | 10^12 bytes |
| 1 PB | 10^15 bytes |

### Estimation process

```
1. QPS:       (DAU * actions_per_user_per_day) / 86,400
2. Peak QPS:  average QPS * 2-3x
3. Storage:   writes_per_day * record_size * retention_days
4. Bandwidth: peak QPS * average_response_size
5. Cache:     storage * hot_data_fraction (typically 20% of data = 80% of reads)
```

### Example - URL shortener

```
Scale: 100M DAU, 1 write per 10 users per day, 100 reads per write

Writes:  (100M / 10) / 86400 = 10M/day = ~116 writes/sec
Reads:   116 * 100 = 11,600 reads/sec
Storage: 10M records/day * 100 bytes * 365 days * 5 years = ~18 TB (5 years)
Cache:   ~20% of recent URLs = 80% of reads -> cache ~1 TB of hot URLs
```

State your assumptions explicitly: "I'm assuming 300 bytes per URL, 5 year retention."

---

## Step 3: Storage (3-5 minutes)

Define the data model first, then pick the technology.

### Data model

List the main entities and their core fields:

```
User:    user_id (PK), email, created_at
URL:     short_code (PK), original_url, user_id (FK), created_at, expires_at
Click:   click_id (PK), short_code (FK), timestamp, ip, referrer
```

### Database selection decision table

| Requirement | Choice |
|---|---|
| ACID transactions, complex joins, well-defined schema | PostgreSQL (default) |
| Horizontal write scaling (>100K writes/sec) | Cassandra or DynamoDB |
| Flexible/evolving schema + JSON documents | MongoDB |
| Key-value at very high throughput | Redis or DynamoDB |
| Full-text search | Elasticsearch |
| Graph traversals (social networks) | Neo4j |
| Time-series (metrics, IoT) | InfluxDB or TimescaleDB |

**Default: PostgreSQL.** Change only with a specific measured reason.

### Sharding strategy (if needed)

| Strategy | Best for | Risk |
|---|---|---|
| Range-based | Time-series data | Hot partitions if traffic is recent-biased |
| Hash-based | Even distribution needed | Cannot do range queries across shards |
| Directory-based | Complex routing logic | Directory itself becomes SPOF |

---

## Step 4: High-Level Design (10 minutes)

Draw the system on a whiteboard (or describe components clearly). Include:

1. **Client** (mobile, web, CLI)
2. **DNS** - not usually a design concern, but note CDN here
3. **CDN** - for static assets and geographically distributed reads
4. **Load balancer** - L7 for HTTP services
5. **API servers** - stateless, horizontally scalable
6. **Cache** - Redis, positioned between API servers and database
7. **Database** - primary + read replicas
8. **Message queue** - if async processing is needed
9. **Workers** - consumers of the queue

Describe the data flow for the two most critical use cases (e.g., write a URL,
redirect a URL). Say what happens at each hop.

---

## Step 5: APIs (3-5 minutes)

Define the external API contracts. Be specific about HTTP method, path, and
payload shape.

```
POST /api/v1/urls
  Body: { "original_url": "https://...", "custom_slug": "optional" }
  Response 201: { "short_url": "https://sho.rt/abc123", "expires_at": "..." }

GET /{short_code}
  Response 301: Location: https://original-url.com
  Response 404: { "error": "not found" }

GET /api/v1/urls/{short_code}/stats
  Response 200: { "clicks": 1234, "last_clicked_at": "..." }
```

Note: use 301 (permanent) redirects to save server load via browser caching.
Use 302 (temporary) if you need to track every click server-side.

---

## Step 6: Detail (10 minutes)

Pick 1-2 components and go deep. Let the interviewer guide which one. Common
deep-dive areas:

### Deep dive: key generation

Naive approach: generate a random 6-char Base62 code on each write.
Problem: hash collisions as the dataset grows.

Better approach: **pre-generation pool**
1. A background worker generates Base62 codes offline and stores them in a
   `key_pool` table (status: unused/used).
2. On each write request, the API server picks one key from the pool
   (atomic SELECT + UPDATE to mark used).
3. Keep two copies: used_keys and unused_keys for fast failover.

Benefit: no collision checking at write time; sub-millisecond key assignment.

### Deep dive: caching strategy

```
Read path:
  1. Check Redis: GET short_code
  2. Hit: return URL, record impression asynchronously
  3. Miss: query PostgreSQL, cache result with TTL=24h, return URL

Write path:
  1. Insert to PostgreSQL
  2. Do NOT pre-populate cache (lazy loading - cache-aside)
  3. Hot URLs will self-populate after first redirect
```

Invalidation: when a URL is deleted or expires, `DEL short_code` from Redis
and let the next read propagate naturally.

---

## Step 7: Evaluation (5 minutes)

Walk through three questions:

**1. Where are the single points of failure?**

For each component, ask: "what happens if this dies?"
- Load balancer -> add standby LB with failover (AWS ELB handles this)
- Primary DB -> add replica; promote on failure (< 30 sec with auto-failover)
- Redis -> add replica; cache misses fall back to DB (system degrades gracefully)
- Message queue -> managed service (SQS/Kafka) has built-in replication

**2. Where are the bottlenecks?**

Use your Step 2 estimates:
- 11,600 reads/sec -> Redis at < 1ms is the right tool; DB alone can't handle this
- 116 writes/sec -> PostgreSQL handles this easily; no sharding needed

**3. What trade-offs did you make?**

Name at least two:
- "I chose 301 redirects over 302 to reduce server load, which means we can't
  track every click without client-side instrumentation."
- "I'm using eventual consistency for click analytics to avoid blocking the
  redirect flow on write."

---

## Step 8: Distinctive Features (5 minutes)

Push to the next level if time allows. Pick one:

### Multi-region active-active

- Route users to the nearest region via GeoDNS
- Replicate URL metadata with async replication (AP - eventual consistency)
- Use CRDT counters for click analytics to merge without conflicts

### Fault tolerance

- Add a circuit breaker on the DB pool; serve a "please try again" page when
  the DB is unhealthy rather than queuing connections until OOM
- Use bulkhead pattern: analytics writes go through a separate connection pool;
  an analytics storm cannot exhaust the redirect connection pool

### Hot key problem

- A viral URL can exceed one Redis node's throughput
- Solution: replicate the hot key to N Redis nodes; read from a random one
- Or: local in-process cache (LRU, 100 entries, 10-second TTL) on each API server

---

## Time allocation

Total typical interview: 45-60 minutes.

| Step | Time |
|---|---|
| Requirements (R) | 5 min |
| Estimation (E) | 3-5 min |
| Storage (S) | 3-5 min |
| High-level design (H) | 10 min |
| APIs (A) | 3-5 min |
| Detail (D) | 10-15 min |
| Evaluation (E) | 5 min |
| Distinctive features (D) | 5 min |
| Buffer / interviewer questions | 5 min |

**Rule: Never spend more than 15 minutes on high-level design without the
interviewer's prompting. Move to detail early - that's where most marks are given.**

---

## Common follow-up questions and how to answer them

| Question | Key points to hit |
|---|---|
| "How does this scale to 10x traffic?" | Identify which component breaks first; add the right layer (cache, replica, shard) |
| "What happens if the database goes down?" | Describe read replica failover, circuit breaker behavior, graceful degradation |
| "How do you handle duplicate requests?" | Idempotency key on writes; atomic check-and-set in Redis |
| "How do you handle hot keys in the cache?" | Local in-process cache + jitter on TTLs |
| "What if a message is delivered twice?" | Idempotent consumers with a deduplication store |
| "How would you monitor this system?" | RED metrics per service, alerting on SLO burn rate, distributed tracing |

---

## Common design patterns by problem type

| Problem type | Key patterns |
|---|---|
| URL shortener | Pre-generation key pool, cache-aside, 301 redirect |
| Feed (Twitter/Instagram) | Fan-out on write (small accounts) + fan-out on read (celebrities), Redis sorted sets |
| Typeahead / autocomplete | Trie in Redis, prefix hash, tiered caching |
| Distributed counter | Redis INCR, approximate counting (HyperLogLog), eventual consistency |
| Distributed lock | Redis SETNX with expiry, Redlock for multi-node |
| Leaderboard | Redis sorted sets (ZADD, ZRANGE) |
| Search | Elasticsearch with inverted index; Kafka for real-time indexing pipeline |
| Video/image upload | Direct S3 upload with presigned URL; metadata in PostgreSQL; CDN for delivery |
| Payment system | Idempotency keys, ACID transactions, CP database, event sourcing for audit |

---

## Interview anti-patterns to avoid

- **Jumping to microservices before the problem demands it** - start with a monolith
  unless requirements clearly show independent scaling needs
- **Designing in silence** - narrate every decision; interviewers score your thinking,
  not just the diagram
- **Over-engineering the happy path, ignoring failure modes** - explicitly name what
  happens when each component fails
- **Picking exotic tech to impress** - using Cassandra for 1000 QPS is wrong;
  PostgreSQL is the right answer
- **Refusing to make trade-offs** - everything is a trade-off; say so, then commit
  to one option and justify it
- **Ignoring the non-functional requirements you agreed on** - if you said p99 < 100ms,
  every component decision must serve that constraint
