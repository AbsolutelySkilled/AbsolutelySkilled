<!-- Part of the Super Brainstorm AbsolutelySkilled skill. Load this file when evaluating approaches or decomposing large projects. -->

# Approach Analysis

This reference covers when and how to propose multiple approaches, how to evaluate trade-offs, and how to decompose large projects into manageable sub-projects.

---

## When to Propose Multiple Approaches

Not every decision deserves a multi-approach breakdown. Use this decision framework to determine the right level of analysis.

### Decision Framework

| Scenario | What to Do | Example |
|---|---|---|
| **Genuine fork** - multiple viable paths with meaningful trade-offs | Propose 2-3 approaches with explicit trade-offs | "Auth: NextAuth vs Clerk vs custom JWT" |
| **Clear winner** - one approach is obviously better | Present it directly, explain why alternatives were dismissed | "Use TypeScript - the project already uses it everywhere" |
| **Constraint-driven** - requirements narrow it to one option | State the constraint and the single approach | "Must use PostgreSQL per company policy" |

### How to Tell Which Scenario You Are In

Ask these questions in order:

1. **Is there a hard constraint?** (company policy, existing tech stack, compliance requirement) - If yes, it is constraint-driven. State the constraint and move on.
2. **Does one option dominate on every dimension?** (faster, simpler, cheaper, more maintainable) - If yes, it is a clear winner. Present it with brief dismissals.
3. **Do the options trade off against each other?** (A is faster but harder to maintain, B is slower but more flexible) - If yes, it is a genuine fork. Present the full comparison.

### Anti-Patterns

- **Analysis paralysis**: Proposing 5+ approaches when 2 would suffice
- **False equivalence**: Presenting a clearly inferior option alongside a superior one just to fill space
- **Missing the obvious**: Over-analyzing when the codebase already has an established pattern
- **Premature commitment**: Picking an approach without surfacing the trade-offs to the user

---

## Approach Proposal Format

Use this format when presenting 2-3 approaches for a genuine fork.

```
### Approach A: [Name] **(Recommended)**
[1-2 sentence description]
- Pros: ...
- Cons: ...
- When to pick: ...
- Complexity: S/M/L

### Approach B: [Name]
[1-2 sentence description]
- Pros: ...
- Cons: ...
- When to pick: ...
- Complexity: S/M/L

**Recommendation:** Approach A because [specific rationale tied to project context]
```

### Format Rules

1. **Always lead with the recommended approach.** The user should see the best option first.
2. **Cap at 3 approaches.** If you have more, you have not filtered enough.
3. **Tie the recommendation to project context.** "Approach A because your app already uses Redux" is better than "Approach A because it is popular."
4. **Complexity uses t-shirt sizes.** S = hours, M = days, L = weeks. Be honest.
5. **"When to pick" is mandatory.** It tells the user under what conditions each approach wins - this is the most valuable part.

---

## Single Approach Format

Use this format when the answer is obvious (clear winner or constraint-driven).

```
Given [project context], [approach] is the clear path because [reason].
I considered [alternative 1] but dismissed it because [reason].
[Alternative 2] doesn't apply here because [reason].
```

### Rules for Single Approach

- Still mention what you considered and why you dismissed it. This builds trust.
- Keep the dismissals to one sentence each.
- Do not apologize for not providing multiple options. Confidence is appropriate when the answer is clear.

---

## Trade-off Dimensions

When comparing approaches, evaluate them against these dimensions. You do not need all of them - pick the 3-5 most relevant to the decision at hand.

| Dimension | What to Compare | Questions to Ask |
|---|---|---|
| **Complexity** | Implementation effort and cognitive load | How many moving parts? How hard is it to reason about? |
| **Performance** | Runtime speed, memory, bundle size | Does the performance difference matter at this scale? |
| **Maintainability** | Long-term cost of ownership | Can a new team member understand this in 30 minutes? |
| **Testing difficulty** | How hard it is to write and maintain tests | Can we test this without complex mocking or infrastructure? |
| **Migration risk** | Risk of breaking existing functionality | What is the blast radius if something goes wrong? |
| **Team familiarity** | How well the team knows the technology | Will this require a learning curve that slows delivery? |
| **Time to implement** | Calendar time from start to working feature | What is the fastest path to a working solution? |
| **Reversibility** | How easy it is to undo the decision | If this turns out to be wrong, can we switch without a rewrite? |

### Weighting by Project Phase

- **Early-stage / MVP**: Weight time to implement, reversibility, and complexity highest
- **Growth / scaling**: Weight performance, maintainability, and testing difficulty highest
- **Mature / enterprise**: Weight migration risk, team familiarity, and maintainability highest

---

## Project Decomposition Guide

Large requests often hide multiple independent projects. Breaking them apart leads to better planning, clearer milestones, and earlier delivery of value.

### Signals That a Project Is Too Large

A request should be decomposed if it has **2 or more** of these signals:

| Signal | Example |
|---|---|
| Multiple independent subsystems | "Build a platform with chat, billing, and analytics" |
| Different user personas | "Admin dashboard and customer-facing storefront" |
| Separate data stores or schemas | "User database and event log and file storage" |
| Different deployment targets | "Web app, mobile API, and CLI tool" |
| Independent release cycles | "Auth can ship before billing is ready" |
| Different tech stacks within the request | "React frontend and Python ML pipeline" |

### How to Identify Sub-Project Boundaries

1. **List the nouns.** Every distinct entity (user, order, notification, report) is a candidate boundary.
2. **Draw the data flow.** Where data crosses from one noun to another is a boundary.
3. **Ask "Can this ship alone?"** If a subsystem delivers value without the others, it is its own sub-project.
4. **Check coupling.** If two subsystems share a database table or API, they may need to be in the same sub-project, or the shared layer becomes its own sub-project.

### How to Determine Build Order

Once you have sub-projects, order them by:

1. **Shared foundations first.** Auth, database schema, core data models.
2. **Highest-value next.** The sub-project that delivers the most user value or de-risks the most unknowns.
3. **Independent sub-projects in parallel.** If two sub-projects share no dependencies, they can run simultaneously.
4. **Integration and glue last.** Cross-cutting concerns like notifications, analytics, and dashboards that aggregate data from other sub-projects.

### Example: Decomposing "Build a Platform with Chat, Billing, and Analytics"

**Step 1 - Identify sub-projects:**

| Sub-Project | Core Entities | Data Store | Ships Alone? |
|---|---|---|---|
| User & Auth | User, Session, Role | Users DB | Yes |
| Chat | Message, Conversation, Participant | Messages DB | Yes (after User & Auth) |
| Billing | Subscription, Invoice, Payment | Billing DB | Yes (after User & Auth) |
| Analytics | Event, Metric, Dashboard | Events DB / warehouse | Yes (after User & Auth) |

**Step 2 - Determine build order:**

```
Phase 1:  User & Auth (foundation)
Phase 2:  Chat, Billing              [parallel - independent of each other]
Phase 3:  Analytics                   [depends on events from Chat + Billing]
Phase 4:  Cross-cutting (admin dashboard, notification preferences, onboarding flow)
```

**Step 3 - Validate boundaries:**
- Chat and Billing both depend on User & Auth but not on each other - confirmed independent.
- Analytics consumes events from Chat and Billing - confirmed it must come after.
- Admin dashboard aggregates data from all three - confirmed it is last.

---

## Common Approach Patterns

Reusable decision trees for recurring architectural decisions. Use these as starting points, not gospel - project context always wins.

### New Feature in an Existing App

```
Is the feature closely related to an existing module?
  YES --> Extend the existing module
    - Lower risk, follows existing patterns
    - Watch for: bloating the module beyond its original responsibility
  NO --> Does it need its own data model or API surface?
    YES --> Create a new module within the app
      - Clear ownership, independent testing
      - Watch for: unnecessary duplication of shared utilities
    NO --> Create a shared utility or helper
      - Lightweight, reusable
      - Watch for: utilities that grow into modules over time
```

### State Management

```
Is the state used by a single component?
  YES --> Local state (useState, component state)
Is the state shared by a parent and a few children?
  YES --> Lift state up or use composition
Is the state shared across a subtree of components?
  YES --> Context (React Context, provide/inject)
Is the state shared app-wide or needs persistence?
  YES --> Is it server-derived data?
    YES --> Server state (React Query, SWR, tRPC)
    NO --> Client store (Zustand, Redux, Pinia)
```

### Data Fetching

```
Is the API internal to your team and typed?
  YES --> tRPC or similar end-to-end typed solution
    - Best DX, type safety, least boilerplate
Is the client a single app consuming a known set of endpoints?
  YES --> REST with a typed client (OpenAPI codegen)
    - Simple, cacheable, well-understood
Do clients need flexible queries across many entities?
  YES --> GraphQL
    - Flexible, avoids over/under-fetching
    - Watch for: complexity of schema management and N+1 queries
```

### Real-Time Communication

```
Is the update frequency low (< 1/second) and tolerance for delay is high?
  YES --> Polling
    - Simplest to implement, works everywhere
    - Watch for: unnecessary server load at scale
Is the data flow one-directional (server to client)?
  YES --> Server-Sent Events (SSE)
    - Simpler than WebSocket, auto-reconnect, works with HTTP/2
    - Watch for: limited browser connection pool in HTTP/1.1
Is the data flow bidirectional or high-frequency?
  YES --> WebSocket
    - Full-duplex, lowest latency
    - Watch for: connection management, scaling, and load balancer configuration
```

### Storage

```
Is the data structured with relationships?
  YES --> Is the schema well-defined and stable?
    YES --> SQL (PostgreSQL, MySQL)
      - Strong consistency, joins, mature tooling
    NO --> Document store (MongoDB, DynamoDB)
      - Flexible schema, horizontal scaling
Is the data unstructured (files, media, blobs)?
  YES --> Object/file storage (S3, GCS, local filesystem)
Is the data ephemeral or cache-like?
  YES --> In-memory store (Redis, Memcached)
Is the data time-series or append-only events?
  YES --> Time-series DB or event store (InfluxDB, EventStoreDB)
```
