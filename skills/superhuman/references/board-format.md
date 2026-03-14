<!-- Part of the Superhuman AbsolutelySkilled skill. Load this file when the agent needs the full specification for the .superhuman/board.md file, including format, status transitions, and examples. -->

# Board Format Specification

The `.superhuman/board.md` file is the single source of truth for a Superhuman execution. It tracks everything from intake through convergence and is designed to be both human-readable and machine-parseable.

---

## File Location

```
{project-root}/.superhuman/board.md
```

The `.superhuman/` directory may also contain:
- `board.md` - the main board file (always present)
- Historical boards renamed to `board-{timestamp}.md` (if running multiple sessions)

---

## Board Metadata (YAML Frontmatter)

```yaml
---
id: sh-{timestamp}
title: "{brief description of the overall task}"
status: intake | decomposing | discovering | planning | executing | verifying | converged | completed | abandoned
created: "{ISO 8601 timestamp}"
updated: "{ISO 8601 timestamp}"
git_tracked: true | false
total_tasks: {N}
completed_tasks: {N}
failed_tasks: {N}
current_wave: {N}
total_waves: {N}
---
```

---

## Board Sections

The board is organized into sections that correspond to the 7 phases. Each section is populated as the relevant phase completes.

### Section 1: Intake Summary

```markdown
## Intake Summary

- **Task**: {one-line description}
- **Type**: feature | bug | refactor | greenfield | migration
- **Complexity**: simple | medium | complex
- **Problem**: {what needs to be built/fixed}
- **Success Criteria**: {what "done" looks like}
- **Constraints**: {patterns, libraries, conventions to follow}
- **Dependencies**: {external APIs, services, other work}
- **Edge Cases**: {known edge cases} (if complex)
- **Testing Strategy**: {approach to testing} (if complex)
- **Board Persistence**: git-tracked | gitignored
```

### Section 2: Task Graph

```markdown
## Task Graph

### Sub-tasks

| ID | Title | Type | Size | Dependencies | Wave | Status |
|----|-------|------|------|-------------|------|--------|
| SH-001 | {title} | code | S | - | 1 | done |
| SH-002 | {title} | code | M | SH-001 | 2 | in-progress |
| SH-003 | {title} | test | S | SH-002 | 3 | pending |

### Dependency Graph

{ASCII graph - see dependency-graph-patterns.md}

### Wave Assignments

- **Wave 1** (N tasks): SH-001, SH-002 [parallel]
- **Wave 2** (N tasks): SH-003 [serial]
- **Wave 3** (N tasks): SH-004, SH-005, SH-006 [parallel]
```

### Section 3: Sub-task Details

Each sub-task gets its own subsection that grows as phases complete:

```markdown
## Tasks

### SH-001: {title}
- **Type**: code | test | docs | infra | config
- **Size**: S | M
- **Dependencies**: none | [SH-XXX, SH-YYY]
- **Wave**: {N}
- **Status**: {current status}

#### Research Notes
{populated during DISCOVER phase}
- Key files: {list of relevant files}
- Reusable code: {functions/utilities to reuse}
- Patterns: {conventions observed}
- Risks: {any risks identified}
- External docs: {URLs referenced}

#### Execution Plan
{populated during PLAN phase}
- Files to create: {list}
- Files to modify: {list}
- Test files: {list}
- Approach: {brief description}
- Acceptance criteria:
  - [ ] {criterion 1}
  - [ ] {criterion 2}
- Test cases:
  - {test case 1}
  - {test case 2}

#### Verification
{populated during VERIFY phase}
- Status: PASS | FAIL
- Tests: {passed}/{total} ({new} new)
- Lint: clean | {issues}
- Type Check: pass | {errors}
- Build: pass | fail
- Retries: {used}/{max}
- Notes: {context}
```

### Section 4: Execution Log

```markdown
## Execution Log

### Wave 1 - {timestamp}
- Started: {timestamp}
- Tasks: SH-001, SH-002
- Agents: 2 parallel
- Completed: {timestamp}
- Result: all passed | {N} failed

### Wave 2 - {timestamp}
- Started: {timestamp}
- Tasks: SH-003
- Agents: 1 serial
- Completed: {timestamp}
- Result: all passed
```

### Section 5: Convergence Summary

```markdown
## Convergence Summary

### Files Changed
| File | Action | Lines |
|------|--------|-------|
| src/models/user.ts | created | +45 |
| src/api/auth.ts | created | +120 |
| src/api/auth.test.ts | created | +85 |
| src/middleware/auth.ts | modified | +30, -5 |

### Tests Added
- Total new tests: {N}
- Test files: {list}
- Coverage: {percentage if available}

### Key Decisions
- {decision 1 and why}
- {decision 2 and why}

### Deferred Work
- {anything not completed and why}
- {follow-up tasks suggested}

### Suggested Commit Message
```
{emoji} {type}: {subject}

{body with summary of changes}
```
```

---

## Status Transitions

### Board-Level Status
```
intake --> decomposing --> discovering --> planning --> executing --> verifying --> converged --> completed
                                                                                      |
                                                                                      +--> abandoned
```

### Task-Level Status
```
pending --> researching --> planned --> in-progress --> verifying --> done
                                          |                |
                                          +-- blocked      +-- failed
```

### Valid Transitions

| From | To | Trigger |
|------|-----|---------|
| pending | researching | DISCOVER phase starts for this task |
| researching | planned | Research complete, plan written |
| planned | in-progress | EXECUTE phase starts for this task |
| in-progress | verifying | Implementation complete, running checks |
| in-progress | blocked | Dependency failed or external blocker |
| verifying | done | All verification signals pass |
| verifying | failed | Verification failed after max retries |
| blocked | in-progress | Blocker resolved |
| failed | in-progress | User intervention or revised approach |

---

## Resuming a Board Across Sessions

When starting a new session and a `.superhuman/board.md` exists:

1. **Read the board** - parse the frontmatter and current state
2. **Identify the current phase** from the board status
3. **Find incomplete tasks** - any task not in `done` or `failed` status
4. **Resume from the current phase**:
   - If `executing`: continue with the next unfinished wave
   - If `verifying`: re-run verification on unverified tasks
   - If `discovering` or `planning`: continue research/planning for remaining tasks
5. **Update the board** with a "Resumed at {timestamp}" entry in the execution log

### Resume Detection
At the start of any Superhuman invocation:
1. Check if `.superhuman/board.md` exists
2. If yes, ask the user: "Found an existing Superhuman board. Resume it or start fresh?"
3. If resuming, load the board and continue from where it left off
4. If starting fresh, archive the old board as `board-{timestamp}.md`

---

## Example: Complete Board

```yaml
---
id: sh-1710432000
title: "Add user authentication to Next.js app"
status: executing
created: "2026-03-14T10:00:00Z"
updated: "2026-03-14T11:30:00Z"
git_tracked: false
total_tasks: 8
completed_tasks: 3
failed_tasks: 0
current_wave: 2
total_waves: 4
---

## Intake Summary

- **Task**: Add email/password + Google OAuth authentication
- **Type**: feature
- **Complexity**: complex
- **Problem**: App has no auth - need login, register, protected routes
- **Success Criteria**: Users can register, login (email + Google), access protected routes
- **Constraints**: Use NextAuth.js v5, existing Prisma + PostgreSQL
- **Dependencies**: Google OAuth credentials needed
- **Edge Cases**: Session expiry, multiple tabs, password reset
- **Testing Strategy**: E2e for auth flows, unit for middleware
- **Board Persistence**: gitignored

## Task Graph

### Sub-tasks

| ID | Title | Type | Size | Dependencies | Wave | Status |
|----|-------|------|------|-------------|------|--------|
| SH-001 | NextAuth config + providers | config | S | - | 1 | done |
| SH-002 | User + Account Prisma models | config | S | - | 1 | done |
| SH-003 | Auth API route handler | code | M | SH-001, SH-002 | 2 | in-progress |
| SH-004 | Auth middleware for protected routes | code | M | SH-001 | 2 | in-progress |
| SH-005 | Login page component | code | M | SH-003 | 3 | pending |
| SH-006 | Register page component | code | M | SH-003 | 3 | pending |
| SH-007 | Auth e2e tests | test | M | SH-005, SH-006 | 4 | pending |
| SH-008 | Auth API documentation | docs | S | SH-003 | 4 | pending |

### Wave Assignments

- **Wave 1** (2 tasks): SH-001, SH-002 [parallel] - COMPLETED
- **Wave 2** (2 tasks): SH-003, SH-004 [parallel] - IN PROGRESS
- **Wave 3** (2 tasks): SH-005, SH-006 [parallel] - PENDING
- **Wave 4** (2 tasks): SH-007, SH-008 [parallel] - PENDING

## Tasks

### SH-001: NextAuth config + providers
- **Type**: config
- **Size**: S
- **Dependencies**: none
- **Wave**: 1
- **Status**: done

#### Research Notes
- NextAuth v5 uses `auth.ts` at project root
- Existing env pattern: `.env.local` with `DATABASE_URL`
- Need: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`

#### Execution Plan
- Files to create: `auth.ts`, `app/api/auth/[...nextauth]/route.ts`
- Test files: none (config, verified by build)
- Approach: Configure NextAuth with Credentials + Google provider

#### Verification
- Status: PASS
- Tests: N/A (config)
- Build: pass
- Notes: Auth config loads, providers registered

## Execution Log

### Wave 1 - 2026-03-14T10:15:00Z
- Started: 2026-03-14T10:15:00Z
- Tasks: SH-001, SH-002
- Agents: 2 parallel
- Completed: 2026-03-14T10:25:00Z
- Result: all passed

### Wave 2 - 2026-03-14T10:26:00Z
- Started: 2026-03-14T10:26:00Z
- Tasks: SH-003, SH-004
- Agents: 2 parallel
- Status: in-progress
```
