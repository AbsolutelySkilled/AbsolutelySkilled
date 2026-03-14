<!-- Part of the technical-interviewing AbsolutelySkilled skill. Load this file
     when designing coding challenges or building a question bank organized by
     competency signal. -->

# Coding Challenge Patterns

## Organizing by signal, not by topic

Don't organize your question bank by data structure ("graph questions", "tree
questions"). Organize by the competency you want to assess. This lets you pick
the right question for the role, not just the right difficulty.

---

## Pattern: API Design

**Signal:** Can the candidate design clean interfaces, handle edge cases, and
think about consumers of their code?

### Example: Design a key-value store API

**Level:** Mid
**Time:** 45 min
**Prompt:** Implement a key-value store class with `get`, `set`, `delete`, and
`keys` methods. Then extend it to support TTL (time-to-live) on keys.

**Base case:** Basic CRUD operations work correctly
**Standard:** TTL works, expired keys are not returned
**Extension:** Implement lazy vs active expiration, discuss trade-offs

**Rubric anchors:**
- Strong Hire: Clean API surface, handles edge cases (get expired key, delete
  nonexistent key), discusses memory implications of lazy expiration
- No Hire: API works but no thought given to edge cases or consumers

### Example: Build a middleware pipeline

**Level:** Senior
**Time:** 60 min
**Prompt:** Implement a middleware system where functions can be chained and
each can modify a request/response or short-circuit.

**Base case:** Sequential middleware execution
**Standard:** Support for async middleware, error handling middleware
**Extension:** Conditional middleware (route-based), middleware ordering

---

## Pattern: Data Modeling

**Signal:** Can the candidate choose appropriate data structures and model
relationships between entities?

### Example: Design a permission system

**Level:** Mid-Senior
**Time:** 45 min
**Prompt:** Model a role-based access control system. Users belong to
organizations, have roles, and roles grant permissions on resources.

**Base case:** User-role-permission model with basic check function
**Standard:** Hierarchical roles (admin inherits editor permissions), resource scoping
**Extension:** Attribute-based overrides, permission caching strategy

**Rubric anchors:**
- Strong Hire: Considers inheritance, discusses denormalization for performance,
  handles the "admin of org A should not see org B" case
- No Hire: Flat user-to-permission mapping, no consideration of scale

### Example: Model an event calendar

**Level:** Mid
**Time:** 45 min
**Prompt:** Design data models for a calendar app supporting one-time events,
recurring events, and event modifications (cancel one occurrence, change time
of one occurrence).

**Base case:** One-time events with CRUD
**Standard:** Recurring events with RRULE-style patterns
**Extension:** Exceptions to recurring events (modify/cancel individual occurrences)

---

## Pattern: Debugging & Code Reading

**Signal:** Can the candidate read unfamiliar code, identify issues, and
reason about behavior?

### Example: Fix the race condition

**Level:** Senior
**Time:** 30 min
**Prompt:** Present a 50-line function with a subtle race condition (e.g.
check-then-act on a shared counter). Ask the candidate to identify the bug,
explain the failure scenario, and fix it.

**What to prepare:**
- The buggy code (should look reasonable at first glance)
- 2-3 specific failure scenarios to discuss
- Multiple valid fixes (mutex, atomic operations, redesign)

**Rubric anchors:**
- Strong Hire: Identifies the race condition quickly, explains a concrete
  interleaving that causes failure, proposes multiple fixes with trade-offs
- Hire: Identifies the issue with some hints, proposes a working fix
- No Hire: Cannot identify the issue even with hints

### Example: Review this pull request

**Level:** Mid-Senior
**Time:** 30 min
**Prompt:** Present a 100-line PR with 3-5 intentional issues of varying
severity (one security issue, one logic bug, one style issue, one
performance concern, one missing test).

**Rubric anchors:**
- Strong Hire: Catches security and logic issues, prioritizes feedback by severity
- Hire: Catches most issues, reasonable feedback quality
- No Hire: Only catches style issues, misses the security/logic bugs

---

## Pattern: Concurrency & Async

**Signal:** Does the candidate understand parallel execution, synchronization,
and async patterns?

### Example: Implement a connection pool

**Level:** Senior
**Time:** 60 min
**Prompt:** Build a generic connection pool with max size, checkout/checkin,
timeout on checkout, and health checking.

**Base case:** Fixed-size pool with blocking checkout
**Standard:** Configurable max size, timeout, idle connection cleanup
**Extension:** Health checking, connection recycling, metrics

### Example: Build a rate-limited task queue

**Level:** Mid-Senior
**Time:** 45 min
**Prompt:** Implement a task queue that processes at most N tasks per second,
with configurable concurrency.

**Base case:** Serial execution with rate limiting
**Standard:** Concurrent execution within rate limit
**Extension:** Priority levels, retry with backoff

---

## General rubric template for coding challenges

| Dimension | Strong Hire (4) | Hire (3) | No Hire (2) | Strong No Hire (1) |
|---|---|---|---|---|
| Problem solving | Breaks down problem systematically, identifies edge cases early | Reasonable approach, handles main cases | Struggles with approach, needs significant hints | Cannot make progress even with hints |
| Code quality | Clean, readable, well-named, idiomatic | Functional with minor style issues | Disorganized, hard to follow | Does not produce working code |
| Communication | Thinks aloud clearly, explains trade-offs, asks good questions | Communicates approach, responds to prompts | Mostly silent, unclear explanations | Cannot articulate their thinking |
| Testing mindset | Proactively discusses test cases, boundary conditions | Tests when prompted, covers main cases | No consideration of testing | Does not understand what testing means in context |
| Extension ability | Elegantly extends to harder variant, code structure supports change | Can extend with some refactoring | Extension requires rewrite | Cannot extend beyond base case |
