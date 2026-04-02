<!-- Part of the Super Brainstorm AbsolutelySkilled skill. Load this file when the agent needs detailed guidance on conducting the design interview. -->

# Interview Playbook

The design interview is the engine of Super Brainstorm. A relentless, structured interview extracts every requirement, constraint, and edge case before a single line of code is written. This playbook provides the full methodology - design tree traversal, question banks, codebase intelligence patterns, calibration rules, and anti-patterns.

---

## Design Tree Traversal

Every feature is a tree of decisions. Super Brainstorm walks that tree **depth-first**, resolving each branch completely before moving to siblings. This prevents half-explored requirements from haunting the implementation later.

### Traversal Rules

1. **Root first** - Start with the purpose node. Why does this feature exist? What problem does it solve?
2. **Depth before breadth** - When a node has children, explore the first child fully before moving to siblings.
3. **Resolve before advancing** - A node is "resolved" when you have a clear answer, a concrete decision, or an explicit deferral. Never leave a node ambiguous.
4. **Backtrack on dead ends** - If a branch leads to "we don't need this," mark it as explicitly out of scope and backtrack.
5. **Dependency edges** - When a node depends on another branch's resolution, note the dependency and resolve the blocker first.

### Example: "Add a Commenting System"

```
commenting-system (root)
├── purpose
│   ├── who comments? (authenticated users only? admins?)
│   └── what is commentable? (posts? pages? both?)
├── data-model
│   ├── comment schema (author, body, timestamp, parent_id)
│   │   ├── max length? (validation)
│   │   └── rich text or plain text?
│   ├── threading (flat vs nested)
│   │   ├── if nested: max depth?
│   │   └── if nested: how to render deep threads?
│   └── storage (same DB? separate collection?)
├── permissions
│   ├── who can create? (depends on: purpose/who comments)
│   ├── who can edit? (author only? admins?)
│   ├── who can delete? (soft delete vs hard delete?)
│   └── moderation (flagging? auto-moderation? approval queue?)
├── ui
│   ├── comment input (inline? modal? expandable?)
│   ├── comment list (pagination? infinite scroll? load-more?)
│   ├── threading display (indentation? collapse/expand?)
│   └── empty state (no comments yet - what shows?)
├── real-time
│   ├── needed? (depends on: purpose - is this high-traffic?)
│   ├── if yes: websockets? polling? SSE?
│   └── optimistic updates?
├── notifications
│   ├── notify on reply? (depends on: threading decision)
│   ├── notify post author?
│   └── delivery channel (in-app? email? both?)
└── edge-cases
    ├── deleted parent comment with children
    ├── comment on deleted post
    ├── concurrent edits
    └── spam/abuse
```

**Traversal walkthrough:**

1. Start at `purpose`. Ask: "Who will be commenting, and what content can they comment on?" Resolve fully.
2. Descend into `data-model > comment schema`. Ask about max length, formatting. Resolve.
3. Move to sibling: `data-model > threading`. This is a major fork - flat vs nested changes everything downstream. Resolve before continuing.
4. Move to `data-model > storage`. Resolve.
5. Now `data-model` is fully resolved. Move to `permissions`. Note that `permissions > who can create` depends on the `purpose` branch - but that is already resolved, so proceed.
6. Continue depth-first through `ui`, `real-time`, `notifications`, `edge-cases`.

The key insight: by the time you reach `notifications > notify on reply`, you have already resolved the threading decision, so you know whether replies even exist.

---

## Question Banks by Project Type

### Feature Development
| # | Question | Purpose | Depth Trigger |
|---|----------|---------|---------------|
| 1 | What is the feature and what user problem does it solve? | Root purpose | Always ask first |
| 2 | Who is the target user? Are there different user roles involved? | Scope actors | If multi-role system |
| 3 | What is the expected user flow from start to finish? | Map the journey | Always |
| 4 | What existing features does this interact with? | Dependency map | If not greenfield |
| 5 | What does the happy path look like? Walk me through it. | Core behavior | Always |
| 6 | What happens when things go wrong? (network failure, invalid input, missing data) | Error handling | Always |
| 7 | Are there any performance requirements? (response time, data volume) | Non-functional reqs | If data-heavy |
| 8 | Is this feature behind a flag or always-on? | Rollout strategy | If production system |
| 9 | What is explicitly out of scope for this version? | Prevent scope creep | Always |
| 10 | How will we know this feature is working correctly in production? | Observability | If production system |

### System Design / Architecture
| # | Question | Purpose | Depth Trigger |
|---|----------|---------|---------------|
| 1 | What is the system's primary responsibility? One sentence. | Core abstraction | Always |
| 2 | What are the inputs and outputs? | Boundary definition | Always |
| 3 | What are the throughput and latency requirements? | Scale constraints | Always |
| 4 | What is the data model? What are the core entities and relationships? | Data layer | Always |
| 5 | How does data flow through the system? | Architecture pattern | Always |
| 6 | What are the failure modes? What happens when each dependency is down? | Resilience | Always |
| 7 | What consistency guarantees are needed? (eventual vs strong) | Data integrity | If distributed |
| 8 | What are the security boundaries? Who can access what? | Auth/authz model | Always |
| 9 | How will this be deployed and scaled? | Infrastructure | If production |
| 10 | What existing systems does this replace or integrate with? | Migration/integration | If not greenfield |

### Refactoring
| # | Question | Purpose | Depth Trigger |
|---|----------|---------|---------------|
| 1 | What is the specific pain point with the current code? | Root cause | Always |
| 2 | What does the ideal end state look like? | Target architecture | Always |
| 3 | What is the blast radius? How many files, modules, consumers? | Risk assessment | Always |
| 4 | Is there test coverage for the code being refactored? | Safety net check | Always |
| 5 | Can this be done incrementally, or is it all-or-nothing? | Strategy | If blast radius > 5 files |
| 6 | Are there downstream consumers or public APIs affected? | Breaking changes | If library/shared code |
| 7 | What is the rollback plan if the refactor introduces regressions? | Safety | If production code |
| 8 | Are there performance characteristics that must be preserved? | Regression prevention | If performance-sensitive |

### Greenfield Projects
| # | Question | Purpose | Depth Trigger |
|---|----------|---------|---------------|
| 1 | What problem does this project solve? Who has this problem? | Problem/user fit | Always |
| 2 | What are the 3-5 core features for v1? No more. | Scope discipline | Always |
| 3 | What is the tech stack? Any hard constraints? | Foundation | Always |
| 4 | Are there reference implementations, competitors, or designs to study? | Prior art | Always |
| 5 | What does the data model look like at a high level? | Core entities | Always |
| 6 | How will users authenticate and what are their roles? | Auth model | If multi-user |
| 7 | What third-party services or APIs are needed? | External deps | If integrations exist |
| 8 | What is the deployment target? (Vercel, AWS, self-hosted, etc.) | Infrastructure | Always |
| 9 | What is the testing strategy? (unit, integration, e2e) | Quality gates | Always |
| 10 | What is the priority order? If you could only ship one feature, which? | Prioritization | Always |

### API Design
| # | Question | Purpose | Depth Trigger |
|---|----------|---------|---------------|
| 1 | Who are the consumers of this API? (frontend, mobile, third-party, internal) | Audience | Always |
| 2 | REST, GraphQL, gRPC, or something else? Why? | Protocol | Always |
| 3 | What are the core resources/entities? | Domain model | Always |
| 4 | What operations are needed on each resource? (CRUD? Custom actions?) | Endpoints | Always |
| 5 | What are the authentication and authorization requirements? | Security | Always |
| 6 | What is the pagination strategy? (cursor, offset, keyset) | Data access pattern | If list endpoints exist |
| 7 | What is the error response format? | Developer experience | Always |
| 8 | What are the rate limiting requirements? | Abuse prevention | If public API |
| 9 | Is versioning needed? What strategy? (URL, header, content negotiation) | Evolution | If long-lived API |
| 10 | What is the expected payload size and response time? | Performance | If high-traffic |

### UI/UX Features
| # | Question | Purpose | Depth Trigger |
|---|----------|---------|---------------|
| 1 | What is the user trying to accomplish? Describe the goal, not the widget. | User intent | Always |
| 2 | Is there a design/mockup/wireframe? Link or describe it. | Visual spec | Always |
| 3 | What is the interaction model? (click, drag, keyboard, touch) | Input methods | Always |
| 4 | What are the states? (empty, loading, error, partial, complete) | State coverage | Always |
| 5 | How does this behave on different screen sizes? | Responsiveness | If web/mobile |
| 6 | What accessibility requirements exist? (keyboard nav, screen reader, contrast) | A11y | Always |
| 7 | What animations or transitions are expected? | Motion design | If interactive |
| 8 | What existing component library or design system should be used? | Consistency | If not greenfield |
| 9 | What is the data source? How is state managed? | Data binding | Always |
| 10 | What happens at the boundaries? (0 items, 1000 items, very long text) | Edge cases | Always |

---

## Codebase-First Intelligence

Before asking the user a question, check whether the codebase already has the answer. Every question you ask that the codebase could have answered is a wasted round-trip and erodes trust.

### What to Search Before Asking

| Before Asking About | Search For | Where to Look |
|---|---|---|
| Database / ORM | `package.json` deps (prisma, typeorm, sequelize, mongoose, drizzle), config files | `package.json`, `*.config.*`, `prisma/schema.prisma`, `drizzle.config.*` |
| Authentication | Auth middleware, JWT libraries, session config, auth routes | `middleware/auth*`, `lib/auth*`, `**/passport*`, `package.json` (next-auth, clerk, passport) |
| Testing framework | Test config, existing test files, test scripts | `jest.config*`, `vitest.config*`, `.mocharc*`, `cypress.config*`, `package.json` scripts |
| State management | Store files, context providers, state libraries | `**/store/**`, `**/context/**`, `package.json` (redux, zustand, jotai, mobx) |
| API patterns | Route files, handler patterns, middleware chain | `**/routes/**`, `**/api/**`, `**/handlers/**`, `**/controllers/**` |
| Styling approach | CSS config, style files, component patterns | `tailwind.config*`, `postcss.config*`, `*.module.css`, `styled-components` in deps |
| Component library | UI library deps, shared component directory | `package.json` (shadcn, radix, chakra, MUI), `**/components/ui/**` |
| Deployment | CI/CD config, Dockerfiles, deploy scripts | `.github/workflows/*`, `Dockerfile`, `docker-compose*`, `vercel.json`, `netlify.toml` |
| Linting / formatting | Lint config, prettier config, editor config | `.eslintrc*`, `.prettierrc*`, `biome.json`, `.editorconfig` |
| Monorepo structure | Workspace config, package directories | `pnpm-workspace.yaml`, `lerna.json`, `turbo.json`, `packages/`, `apps/` |
| Environment variables | Env files, env validation, env usage | `.env.example`, `.env.local`, `**/env.*`, `process.env` usage in code |
| Error handling | Error classes, error middleware, error boundaries | `**/errors/**`, `**/middleware/error*`, `**/ErrorBoundary*` |
| Logging | Logger setup, logging library | `**/logger*`, `package.json` (winston, pino, bunyan) |
| Caching | Cache config, Redis/Memcached setup | `**/cache*`, `package.json` (redis, ioredis), `**/redis*` |
| File structure conventions | Existing module organization | Top-level directories, barrel exports (`index.ts`), naming patterns |

### Intelligence-First Protocol

For every question you are about to ask, run this check:

1. **Can I find this in the codebase?** Search for it. If found, state what you found and skip the question.
2. **Can I infer this from the codebase?** If the project uses Prisma + PostgreSQL, do not ask "what database do you use?" Instead, state: "I see you're using Prisma with PostgreSQL" and ask the deeper question.
3. **Is this a preference or a fact?** Facts live in code. Preferences require asking. "What test framework?" is a fact. "What level of test coverage do you want?" is a preference.

---

## Question Calibration

### Multiple Choice vs Open-Ended

| Use Multiple Choice When | Use Open-Ended When |
|---|---|
| There are 2-4 well-known options | The answer space is unbounded |
| You want to anchor the user on realistic choices | You want to discover requirements you haven't thought of |
| The user is non-technical and might not know terminology | The user is the domain expert and you need their mental model |
| Speed matters - reduce back-and-forth | Depth matters - you need their full reasoning |

**Examples:**

- **Multiple choice**: "For threading, should comments be: (a) flat - single level, (b) nested - up to 3 levels, (c) nested - unlimited depth?"
- **Open-ended**: "Describe how you envision the moderation workflow when a comment is flagged."

### When a Question Is Too Broad

A question is too broad if the user would need more than 3 sentences to answer it well. Split it.

| Too Broad | Better |
|---|---|
| "How should the notification system work?" | "Should notifications be in-app only, email only, or both?" followed by "For in-app notifications, should they appear as a badge, a dropdown, or a full page?" |
| "What are the security requirements?" | "Who should be able to access this resource?" followed by "Do we need rate limiting on this endpoint?" |
| "How should errors be handled?" | "When the API returns a 4xx error, what should the user see?" followed by "Should we retry on network failures? How many times?" |

### When to Merge vs Split Questions

**Merge** when two questions are so tightly coupled that answering one without the other is meaningless:
- "Should comments support threading, and if so, what is the max nesting depth?" (threading yes/no and depth are inseparable)

**Split** when a question bundles independent decisions:
- Bad: "Should we use WebSockets for real-time updates and Redis for caching?"
- Good: Ask about real-time transport separately from caching strategy.

### Calibration Rules

1. **One decision per question.** If your question contains "and," consider splitting.
2. **No compound conditionals.** Instead of "If X, should we do Y or Z, and if not X, should we do A?" - first resolve X, then ask the follow-up.
3. **Ground in the codebase.** Reference what you found: "I see you're using Express with middleware-based routing. Should the new auth endpoints follow the same pattern?"
4. **Offer a recommendation when you can.** "I'd suggest cursor-based pagination here because your dataset will grow over time. Does that work, or do you need offset-based for a specific reason?"
5. **Timebox complexity.** If a question opens a 20-minute rabbit hole, flag it: "This is a significant decision. Should we resolve it now or defer and use a simple placeholder?"

---

## Extracting Implicit Requirements

Users say what they want. They rarely say what they need. Watch for these patterns and surface the hidden requirements.

| User Says | Hidden Requirements |
|---|---|
| "Add notifications" | Delivery channel (in-app, email, push), read/unread state, notification preferences, quiet hours, batch/digest mode, notification center UI |
| "Make it real-time" | WebSocket infrastructure, reconnection logic, optimistic updates, conflict resolution, offline handling, connection state UI |
| "Add user roles" | Permission model, role assignment UI, role hierarchy, inheritance rules, admin override, audit logging |
| "Support file uploads" | Max file size, allowed formats, virus scanning, storage backend (S3, local), progress indicator, resume on failure, thumbnail generation |
| "Add a dashboard" | Data aggregation, refresh interval, date range filtering, export capability, empty state, loading skeletons, responsive layout |
| "Make it work offline" | Sync strategy, conflict resolution, storage limits, cache invalidation, sync status indicator, queue management |
| "Add search" | Full-text vs exact match, indexing strategy, debounce, highlighting, filters/facets, empty results state, typo tolerance, pagination |
| "Support multiple languages" | i18n framework, string extraction, RTL support, date/number formatting, language detection, translation workflow, fallback language |
| "Add an API" | Authentication, rate limiting, versioning, documentation, error format, pagination, CORS, request validation, response caching |
| "Add logging" | Log levels, structured vs unstructured, rotation policy, PII redaction, correlation IDs, alerting thresholds, log aggregation |

### The Extraction Protocol

When you detect an implicit requirement:

1. **Acknowledge the stated requirement.** "Got it - you want notifications."
2. **Surface 2-3 of the most critical hidden requirements as questions.** "That raises a few design questions: How should notifications be delivered - in-app banner, email, or both? And should users be able to configure their notification preferences?"
3. **Do not dump all hidden requirements at once.** Prioritize. Ask about the ones that affect architecture first, then circle back to polish later.

---

## Example Interview Session

### Task: "Add real-time notifications to our app"

**Step 1: Codebase Intelligence Scan**

Before asking anything, search the codebase:

```
Search: package.json
Found: Next.js 14, Prisma, PostgreSQL, NextAuth, Tailwind CSS, no WebSocket library

Search: **/notification*, **/socket*, **/ws*
Found: Nothing - no existing notification or real-time infrastructure

Search: **/middleware/auth*, **/lib/auth*
Found: NextAuth with JWT sessions, role-based access (user, admin)

Search: prisma/schema.prisma
Found: User model, Post model, Comment model - no Notification model

Search: **/api/**
Found: REST API routes under /api/ with consistent error handling middleware
```

**Step 2: Design Tree**

```
real-time-notifications (root)
├── purpose
│   ├── what events trigger notifications? (new comment, reply, mention, system)
│   └── who receives them? (post author, mentioned users, admins)
├── data-model
│   ├── Notification entity (id, userId, type, payload, read, createdAt)
│   └── storage (Prisma/PostgreSQL - extends existing setup)
├── delivery
│   ├── in-app (real-time push to open browser tabs)
│   │   ├── transport (WebSocket vs SSE vs polling)
│   │   └── reconnection & offline handling
│   ├── email (optional - for offline users)
│   │   └── batch/digest vs immediate
│   └── push notifications (mobile - defer or now?)
├── ui
│   ├── notification bell/badge (header component)
│   ├── notification dropdown/panel
│   ├── notification page (full list with pagination)
│   ├── read/unread state management
│   └── empty state
├── preferences
│   ├── per-type opt-in/opt-out
│   └── quiet hours / digest mode
└── edge-cases
    ├── user has 1000+ unread notifications
    ├── notification for deleted content
    ├── duplicate notifications (e.g., multiple mentions)
    └── notification ordering (out-of-order delivery)
```

**Step 3: Interview (Depth-First)**

**Agent**: "I scanned the codebase. You're running Next.js 14 with Prisma/PostgreSQL, NextAuth with JWT sessions, and REST API routes. There's no existing notification or real-time infrastructure, so we're building from scratch. Let me walk through the design.

Starting with purpose - what events should trigger a notification? For example: (a) new comment on your post, (b) reply to your comment, (c) @mention, (d) system announcements, or (e) some combination?"

**User**: "Comments on your post and replies to your comments. Maybe mentions later."

**Agent**: "Got it - comments on posts and replies to comments for v1, mentions deferred. So the notification recipients are: post author (when someone comments) and comment author (when someone replies). Does that cover it, or should admins also receive notifications?"

**User**: "Just those two for now."

**Agent**: "Good. Moving to delivery - since there's no WebSocket infrastructure yet, I want to pick the right transport. For your use case (low-to-medium frequency notifications, not a chat app), I'd recommend Server-Sent Events (SSE) over WebSockets. SSE is simpler, works over HTTP (no special server config), and is sufficient for one-way server-to-client pushes. Does that work, or do you have a reason to prefer WebSockets?"

**User**: "SSE sounds fine."

**Agent**: "Now for the UI. I see your header component uses Tailwind and follows a consistent pattern. Should the notification indicator be: (a) a bell icon with a red badge count in the header, (b) a toast/popup in the corner, or (c) both?"

**User**: "Bell with badge count. And a dropdown when you click it."

**Agent**: "When the user clicks the bell and sees the dropdown - should clicking a notification mark it as read and navigate to the relevant content (e.g., the comment on the post)? And should there be a 'Mark all as read' action?"

**User**: "Yes to both."

**Agent**: "One edge case to resolve: what happens when a user has hundreds of unread notifications? Should the dropdown show the most recent 10-20 with a 'View all' link to a full notifications page? Or should the dropdown try to load everything?"

**User**: "Recent 10 with a view all link."

**Agent**: "Last question for this branch - email notifications. Should we send an email when the user is offline, or is in-app sufficient for v1?"

**User**: "In-app only for now."

**Agent**: "Here is the resolved design summary:

- **Events**: Comment on post, reply to comment
- **Recipients**: Post author, comment author
- **Transport**: SSE for real-time push
- **Data model**: New Notification table in Prisma (id, userId, type, referenceId, read, createdAt)
- **UI**: Bell icon with badge count in header, dropdown with 10 most recent, 'View all' page, click to navigate + mark read, 'Mark all as read' action
- **Delivery**: In-app only (no email for v1)
- **Deferred**: @mentions, email delivery, push notifications, notification preferences

Does this capture everything, or did I miss something?"

---

## Anti-Patterns

These are the most common mistakes during a design interview. Each one wastes the user's time or produces an incomplete design.

### 1. Asking Questions the Codebase Can Answer

**Wrong**: "What database are you using?"
**Right**: Search `package.json` and config files first. Then say: "I see you're using Prisma with PostgreSQL."

**Why it matters**: It signals you haven't done your homework. The user will lose confidence that you're thorough enough to build the feature correctly.

### 2. Batching Multiple Unrelated Questions

**Wrong**: "What should the notification bell look like, and how should we handle real-time transport, and do you need email notifications?"
**Right**: Ask one question at a time, depth-first. Resolve delivery transport before asking about email. Resolve the bell UI separately.

**Why it matters**: The user will answer the easiest question and skip the hard ones. You will think you have answers when you have gaps.

### 3. Asking About Implementation Before Purpose

**Wrong**: "Should we use WebSockets or SSE?"
**Right**: First ask what the feature does and how frequently events occur. Then recommend the transport based on the requirements.

**Why it matters**: Implementation decisions without context are coin flips. Purpose determines constraints, constraints determine implementation.

### 4. Accepting Vague Answers Without Follow-Up

**Wrong**:
- User: "It should handle errors gracefully."
- Agent: "Got it." (moves on)

**Right**:
- User: "It should handle errors gracefully."
- Agent: "Can you give me an example? When a notification fails to deliver, should we: (a) silently retry, (b) show an error toast to the user, or (c) log it and move on?"

**Why it matters**: "Gracefully" means something different to every person. Vague requirements become bugs.

### 5. Not Exploring Error and Edge Case Branches

**Wrong**: Only asking about the happy path - what happens when everything works.
**Right**: For every feature branch, ask: "What happens when this fails? What happens at the boundaries (0 items, 10,000 items, very long input)?"

**Why it matters**: Edge cases are where most bugs live. If you don't ask, the user won't volunteer them, and you will discover them during implementation when they are 10x more expensive to resolve.

### 6. Asking Leading Questions

**Wrong**: "We should use Redis for caching here, right?"
**Right**: "Do you need caching for this endpoint? If so, what is the acceptable staleness - a few seconds, minutes, or hours?"

**Why it matters**: Leading questions confirm your bias instead of discovering the actual requirement. The user will often agree with your suggestion even if it is wrong.

### 7. Skipping the "Out of Scope" Conversation

**Wrong**: Assuming everything mentioned is in scope for v1.
**Right**: After mapping the full design tree, explicitly ask: "Which of these branches are v1 vs later?"

**Why it matters**: Without explicit scoping, the feature grows silently. You will build things the user did not need yet, and miss things they needed now.

### 8. Interviewing in the Wrong Order

**Wrong**: Asking about UI styling before understanding the data model.
**Right**: Follow the tree: purpose - data model - behavior - UI - edge cases.

**Why it matters**: Upstream decisions constrain downstream ones. If you design the UI before the data model, you may design something the data cannot support.
