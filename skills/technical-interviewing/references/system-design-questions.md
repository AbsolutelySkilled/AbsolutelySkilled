<!-- Part of the technical-interviewing AbsolutelySkilled skill. Load this file
     when designing system design interview questions or preparing question banks. -->

# System Design Question Library

## Question selection principles

- Match question complexity to candidate level (mid vs senior vs staff)
- Choose domains the candidate likely understands as a user
- Prepare 4-6 follow-up dimensions per question
- Write expected discussion points before using in interviews

---

## Mid-level questions (45 min)

### Design a URL shortener

**Initial constraints:** 100M URLs created/month, 10:1 read-to-write ratio

**Expected discussion:**
- Hashing strategy (MD5 truncation, base62 encoding, counter-based)
- Storage: key-value store for fast lookups
- Redirect: 301 vs 302 and caching implications
- Analytics: click counting, geographic data

**Follow-ups:**
- Custom aliases and collision handling
- Expiration and cleanup
- Rate limiting creation

**Strong signal:** Candidate discusses trade-offs between hash collision rate
and URL length without prompting.

### Design a paste bin

**Initial constraints:** 5M pastes/day, 10:1 read-to-write, max 10MB per paste

**Expected discussion:**
- Object storage for paste content vs database
- Content-addressable storage for deduplication
- Expiration policies (TTL-based)
- Access control (public, unlisted, private)

**Follow-ups:**
- Syntax highlighting as a service
- Versioning / edit history
- Abuse prevention (spam, malware)

---

## Senior questions (60 min)

### Design a notification system

**Initial constraints:** 50M users, supports push, email, SMS, in-app

**Expected discussion:**
- Channel abstraction and routing logic
- Priority queue for urgent vs batched notifications
- User preference storage and opt-out handling
- Template engine for personalization
- Delivery tracking and retry logic

**Follow-ups:**
- Rate limiting per user (no notification spam)
- Cross-channel deduplication
- Real-time in-app with WebSocket fallback to polling
- Digest mode (batch low-priority into daily summary)

**Strong signal:** Candidate separates the ingestion pipeline from delivery
pipeline and discusses backpressure handling.

### Design a rate limiter

**Initial constraints:** API gateway processing 100K req/sec, per-user limits

**Expected discussion:**
- Token bucket vs sliding window vs fixed window
- Distributed counting (Redis, consistent hashing)
- Header communication (X-RateLimit-Remaining, Retry-After)
- Differentiated limits by endpoint and user tier

**Follow-ups:**
- Distributed rate limiting across multiple data centers
- Graceful degradation under extreme load
- Rate limit key design (IP, API key, user ID, composite)

### Design a chat application

**Initial constraints:** 10M DAU, 1:1 and group chat, message persistence

**Expected discussion:**
- WebSocket connection management and reconnection
- Message ordering (per-conversation sequence numbers)
- Fan-out: write-time vs read-time for group messages
- Presence system (online/offline/typing indicators)
- Message storage and retrieval pagination

**Follow-ups:**
- End-to-end encryption implications on server architecture
- Media message handling (images, files)
- Search across message history
- Read receipts at scale

---

## Staff+ questions (60 min)

### Design a distributed task scheduler

**Initial constraints:** 10M scheduled tasks, at-least-once execution, sub-second precision

**Expected discussion:**
- Task storage and indexing by execution time
- Partition strategy for horizontal scaling
- Leader election or leaderless coordination
- At-least-once vs exactly-once semantics
- Dead letter queue for failed tasks
- Clock skew handling across nodes

**Follow-ups:**
- Multi-region deployment with region-affinity
- Task dependency graphs (DAG execution)
- Dynamic priority adjustment
- Observability: how do you know a task was dropped?

**Strong signal:** Candidate proactively discusses failure modes and recovery
without being asked.

### Design a collaborative document editor

**Initial constraints:** Google Docs-style, 100 concurrent editors per document

**Expected discussion:**
- Conflict resolution: OT vs CRDT trade-offs
- Operation log and transformation pipeline
- Cursor and selection synchronization
- Document storage (snapshots + operation log)
- Permission model (owner, editor, viewer, commenter)

**Follow-ups:**
- Offline editing and sync
- Version history and rollback
- Comments and suggestions as separate CRDT
- Performance with very large documents (100K+ characters)

---

## Rubric template for system design

| Competency | Strong Hire (4) | Hire (3) | No Hire (2) | Strong No Hire (1) |
|---|---|---|---|---|
| Requirements gathering | Asks clarifying questions, identifies core vs nice-to-have, states assumptions | Asks some questions, identifies main requirements | Jumps to solution without clarifying | Cannot articulate what the system should do |
| High-level design | Clear component diagram, explains data flow, justifies choices | Reasonable architecture with minor gaps | Vague or missing components, hand-wavy connections | No coherent design emerges |
| Deep-dive ability | Proactively dives into hardest component, discusses trade-offs in detail | Can deep-dive when prompted, shows reasonable depth | Stays surface-level even when prompted | Cannot explain any component in detail |
| Scalability | Identifies bottlenecks, proposes concrete solutions with numbers | Acknowledges scale challenges, proposes some solutions | Vague "just add more servers" without specifics | Does not consider scale |
| Trade-off reasoning | Articulates multiple options with pros/cons, makes justified choice | Sees some trade-offs when prompted | Binary thinking ("this is the right way") | Cannot articulate any trade-offs |
