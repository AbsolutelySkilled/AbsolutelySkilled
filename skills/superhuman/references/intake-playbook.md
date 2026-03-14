<!-- Part of the Superhuman AbsolutelySkilled skill. Load this file when the agent needs detailed guidance on conducting the INTAKE phase, including question banks, scaling rules, and example sessions. -->

# Intake Playbook

The intake phase is the foundation of every Superhuman execution. A thorough intake prevents rework, missed requirements, and scope creep. This playbook provides the full question bank, scaling rules, and example sessions.

---

## Question Bank by Task Type

### Feature Development
| # | Question | Purpose |
|---|----------|---------|
| 1 | What feature needs to be built? Describe the user-facing behavior. | Problem statement |
| 2 | What does "done" look like? List specific acceptance criteria. | Success criteria |
| 3 | Are there existing patterns or conventions in the codebase we should follow? | Constraints |
| 4 | Which files, modules, or components will this touch? | Scope mapping |
| 5 | Does this depend on any external APIs, services, or libraries? | Dependencies |
| 6 | What are the known edge cases or error scenarios? | Edge cases |
| 7 | How should this be tested? Unit, integration, e2e? | Testing strategy |
| 8 | Does this need documentation updates? API docs, README, changelog? | Documentation |
| 9 | Any backwards compatibility or migration concerns? | Rollout |
| 10 | Which parts are highest priority if we need to split delivery? | Priority |

### Bug Fix
| # | Question | Purpose |
|---|----------|---------|
| 1 | What is the bug? Describe the expected vs actual behavior. | Problem statement |
| 2 | How do we reproduce it? Steps, environment, conditions. | Reproduction |
| 3 | What is the impact? Who is affected and how severely? | Priority |
| 4 | When did this start happening? Any recent changes? | Root cause hints |
| 5 | Are there related bugs or known issues? | Context |
| 6 | What is the fix criteria? When is this bug "fixed"? | Success criteria |

### Refactor
| # | Question | Purpose |
|---|----------|---------|
| 1 | What code needs refactoring and why? | Problem statement |
| 2 | What is the desired end state? | Success criteria |
| 3 | Must the refactor be backwards-compatible? | Constraints |
| 4 | What is the test coverage of the code being refactored? | Safety net |
| 5 | Can this be done incrementally or must it be all-at-once? | Strategy |
| 6 | Are there downstream consumers that will be affected? | Impact |

### Greenfield Project
| # | Question | Purpose |
|---|----------|---------|
| 1 | What is the project and what problem does it solve? | Problem statement |
| 2 | Who is the target user? | Context |
| 3 | What are the core features for v1? | Scope |
| 4 | What tech stack and conventions should we use? | Constraints |
| 5 | Are there reference implementations or designs to follow? | Patterns |
| 6 | What external services or APIs will we integrate with? | Dependencies |
| 7 | What is the testing strategy? | Testing |
| 8 | What does the deployment/infra look like? | Infrastructure |
| 9 | What documentation is needed? | Documentation |
| 10 | What is the priority order of features? | Priority |

### Migration
| # | Question | Purpose |
|---|----------|---------|
| 1 | What is being migrated and to what? (e.g., v2 to v3, JS to TS) | Problem statement |
| 2 | What is the scope? Full migration or incremental? | Strategy |
| 3 | Must the old and new coexist during migration? | Constraints |
| 4 | What is the rollback plan if something goes wrong? | Safety |
| 5 | Are there breaking changes to account for? | Risk |
| 6 | What is the test coverage of the code being migrated? | Safety net |
| 7 | What is the priority order of modules to migrate? | Priority |

---

## Scaling Rules

### When to Ask 3 Questions (Simple)
- Task touches 1-2 files
- Clear, well-defined scope ("add a button that does X")
- No external dependencies
- Existing patterns to follow
- **Always ask**: Problem statement, Success criteria, Constraints

### When to Ask 5 Questions (Medium)
- Task touches 3-5 files or 2+ components
- Some ambiguity in requirements
- May involve external APIs
- **Add**: Existing code context, Dependencies

### When to Ask 8-10 Questions (Complex)
- Task touches 5+ files or is cross-cutting
- Greenfield project or major refactor
- External services, migrations, or rollout concerns
- **Add**: Edge cases, Testing strategy, Documentation, Rollout, Priority

### Complexity Detection Heuristic
Ask yourself:
1. How many files/components will this touch? (1-2: simple, 3-5: medium, 5+: complex)
2. Are there external dependencies? (no: simpler, yes: more complex)
3. Is the scope well-defined? (yes: simpler, no: more complex)
4. Does this involve data migration or backwards compatibility? (yes: complex)

---

## Extracting Implicit Requirements

Users often omit critical requirements. Watch for these patterns:

| User Says | Implicit Requirement |
|---|---|
| "Add a login page" | Auth system, session management, error handling, redirect logic |
| "Make it faster" | Needs benchmarks before and after, specific performance targets |
| "Support dark mode" | Theme system, all components must be theme-aware, persistence |
| "Add search" | Indexing strategy, debounce, empty state, pagination |
| "Deploy to production" | CI/CD, environment config, monitoring, rollback plan |

When you detect implicit requirements, surface them as follow-up questions rather than assuming.

---

## Example Intake Session

### Task: "Add user authentication to our Next.js app"

**Detected complexity**: Complex (cross-cutting, external dependencies, security-sensitive)

**Questions asked**:
1. **Problem**: "What authentication method do you need? Email/password, OAuth providers (Google, GitHub), magic links, or a combination?"
2. **Success criteria**: "What does 'authenticated' look like? Protected routes, user profile page, session persistence across browser restarts?"
3. **Constraints**: "Are there existing auth patterns in the codebase, or is this the first auth implementation? Any preferred libraries (NextAuth, Clerk, custom)?"
4. **Existing code**: "Is there already a user model or database schema? Any existing API routes we should integrate with?"
5. **Dependencies**: "Which OAuth providers need to be supported? Do we need a database for sessions/users?"
6. **Edge cases**: "How should we handle: expired sessions, multiple tabs, password reset, account lockout?"
7. **Testing**: "What auth flows need e2e tests? Is there an existing test setup?"
8. **Docs**: "Do we need API documentation for auth endpoints?"
9. **Rollout**: "Is this for new users only, or do existing users need migration?"
10. **Board persistence**: "Should the `.superhuman/` board be git-tracked or gitignored?"

**Intake Summary** (written to board):
```
## Intake Summary
- Task: Add email/password + Google OAuth authentication to Next.js app
- Library: NextAuth.js v5
- Database: Existing Prisma + PostgreSQL setup
- Protected routes: /dashboard, /settings, /api/*
- Success: User can register, login, logout, and access protected routes
- Edge cases: Session expiry shows login prompt, password reset via email
- Testing: E2e tests for login, register, OAuth flow, protected route redirect
- Board: gitignored (local working state)
```
