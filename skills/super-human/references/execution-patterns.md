<!-- Part of the Super-Human AbsolutelySkilled skill. Load this file when working with wave execution, scope management, failure handling, or anti-patterns. -->

# Execution Patterns and Anti-Patterns

## Scope Creep Guard

During EXECUTE, agents may discover additional work needed ("oh, this also needs X"). Handle scope creep strictly:

1. **Blocking discovery** (can't complete the current task without it): Add a new task to the DAG, assign it to the current or next wave, and flag the change to the user on the board. Continue with other tasks in the wave.
2. **Non-blocking discovery** (nice-to-have, related improvement, cleanup): Do NOT absorb it. Add it to a `## Deferred Work` section on the board. Mention it in the CONVERGE summary. The user decides whether to start a new Super-Human session for it.
3. **Never silently expand scope** - every addition to the DAG must be visible on the board and flagged in the next progress report.

## Handling Blocked Tasks

If a task cannot proceed:
1. Mark it as `blocked` on the board with a reason
2. Continue with non-blocked tasks in the same wave
3. After the wave completes, reassess blocked tasks
4. If the blocker is resolved, add the task to the next wave

## Handling Failures

If an agent fails to complete a task:
1. Capture the error/failure reason on the board
2. Attempt one retry with adjusted approach
3. If retry fails, mark as `failed` and flag for user attention with the rollback point hash
4. Continue with other tasks - don't let one failure block the wave

See `references/wave-execution.md` for detailed agent orchestration patterns.

## Mandatory Tail Tasks

Every Super-Human task graph must include these three tasks as the final tasks, in this order:

**Third-to-last task: Self Code Review**
- **Type**: `review`
- **Title**: "Self code review of all changes"
- **Description**: Run a structured code review of all changes made across every completed sub-task using the `code-review-mastery` methodology. Get the full diff of all changes since the rollback point. Execute the review pyramid bottom-up: Security > Correctness > Performance > Design > Readability > Convention > Testing. Classify each finding as `[MAJOR]` or `[MINOR]`. Fix all `[MAJOR]` findings immediately and address reasonable `[MINOR]` findings. Re-run the review after fixes to confirm no new issues were introduced. Only proceed when no `[MAJOR]` findings remain.
- **Dependencies**: All other implementation/test/docs tasks
- **Acceptance Criteria**: Zero `[MAJOR]` findings remaining after fixes. All `[MINOR]` findings documented on the board (fixed or explicitly deferred).

**Second-to-last task: Requirements Validation**
- **Type**: `verify`
- **Title**: "Validate changes against original requirements"
- **Description**: Review all changes made across every completed sub-task and compare them against the original user prompt and intake summary. Verify that every requirement, success criterion, and constraint from INTAKE is satisfied. If any requirement is unmet or the implementation deviates from what was asked, flag the gaps and loop back to EXECUTE to address them. Do NOT proceed to the final task until all requirements are confirmed met.
- **Dependencies**: The self code review task above
- **Acceptance Criteria**: Every success criterion from INTAKE is demonstrably satisfied. If gaps are found, reiterate until they are resolved.

**Last task: Full Project Verification**
- **Type**: `verify`
- **Title**: "Run full project verification suite"
- **Description**: Run all available verification checks in the repo, in order. Use the project's package manager scripts (check `package.json`, `Makefile`, `pyproject.toml`, etc.) - never invoke tools directly. Skip any that are not configured in the project - only run what exists:
  1. **Tests** - Run the test script (`npm test`, `yarn test`, `pnpm test`, `make test`, `pytest`, etc.)
  2. **Lint** - Run the lint script (`npm run lint`, `yarn lint`, `pnpm lint`, `make lint`, etc.)
  3. **Typecheck** - Run the typecheck script (`npm run typecheck`, `yarn typecheck`, `pnpm typecheck`, `make typecheck`, etc.)
  4. **Build** - Run the build script (`npm run build`, `yarn build`, `pnpm build`, `make build`, etc.)
- **Dependencies**: The requirements validation task above
- **Acceptance Criteria**: All available checks pass. If any check fails, fix the issues and re-run until green. Do not mark the board as complete until every available check passes.

## Agent Context Handoff Format

Each parallel agent receives a standardized prompt with these sections:
```
## Task: {SH-XXX} - {Title}

### Context
{Description from the board}

### Project Conventions
{Detected conventions from Codebase Convention Detection - package manager, test runner, linter, directory patterns}

### Research Notes
{Findings from DISCOVER phase for this task}

### Execution Plan
- Files to create/modify: {list}
- Test files: {list}
- Approach: {from PLAN phase}

### Acceptance Criteria
{Specific, verifiable conditions from PLAN phase}

### Rules
1. Follow TDD: write tests first, then implement
2. Use the project's existing patterns and conventions
3. Do NOT modify files outside your task scope
4. If you encounter a blocker, stop and report it - do not work around it
5. Update the board with your status when done
```

## Wave Boundary Checks

After all tasks in a wave complete, before proceeding to the next wave:

**1. Conflict Resolution**
- Check if any two agents in the wave modified the same file
- If conflicts exist: review both changes, merge them intelligently (prefer the change that better satisfies its task's acceptance criteria), and verify the merged result
- If conflicts cannot be auto-resolved: flag to the user with both versions and let them decide
- Run a quick build/test check after any merge to catch integration issues early

**2. Progress Report**
Print a compact status table after each wave:
```
Wave 2 Complete (3/6 waves done)
-----------------------------------------
| Task   | Status | Notes               |
|--------|--------|----------------------|
| SH-001 | done   |                      |
| SH-002 | done   |                      |
| SH-003 | done   |                      |
| SH-004 | done   | wave 2               |
| SH-005 | done   | wave 2               |
| SH-006 | next   | wave 3               |
| SH-007 | next   | wave 3               |
| SH-008 | queued | wave 4               |
-----------------------------------------
```

## Anti-Patterns and Common Mistakes

| Anti-Pattern | Better Approach |
|---|---|
| Skipping intake for "obvious" tasks | Even simple tasks benefit from 3 intake questions - assumptions kill projects |
| Flat task lists without dependencies | Always model as a DAG - hidden dependencies cause merge conflicts and ordering bugs |
| Executing without user approval of the graph | Always present the wave plan and get explicit approval before any execution |
| Skipping TDD for "simple" changes | Tests are verification proof, not optional extras - write them first, always |
| Massive sub-tasks (L+ complexity) | Decompose further until all tasks are S or M - large tasks hide complexity |
| Not persisting board state | Always write to `.super-human/board.md` - it enables resume, audit, and handoff |
| Over-decomposing into 20+ micro-tasks | Aim for 5-15 tasks - too many creates overhead that defeats the purpose |
| Ignoring research phase | DISCOVER prevents rework - 10 minutes of research saves hours of wrong implementation |
| Sequential execution when parallelism is possible | Always check the DAG for parallel opportunities - that's the whole point of Super-Human |
| Silently absorbing scope creep during EXECUTE | Flag blocking additions on the board; defer non-blocking discoveries to the Deferred Work section |
| Starting fresh when a board already exists | Detect existing boards, display status, and resume from last incomplete wave |
| Assuming project conventions without checking | Always run Codebase Convention Detection before INTAKE - read `package.json`, config files, directory structure |
| No rollback plan before execution | Record the git commit hash before Wave 1 starts - offer rollback if things go sideways |
| Parallel agents modifying the same file without reconciliation | Run conflict resolution checks at every wave boundary before proceeding |
| Skipping self code review before verification | Verification catches build/test failures but not code quality issues - review catches bugs, security issues, and design problems that tests miss |
| Ignoring `docs/` when it exists | Reading raw source files when codedocs output is available wastes context window and misses curated architecture context - always check for `.codedocs.json` during Convention Detection and use docs-first in DISCOVER |
