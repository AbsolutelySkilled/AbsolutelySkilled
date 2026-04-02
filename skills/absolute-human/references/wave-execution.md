<!-- Part of the Superhuman AbsolutelySkilled skill. Load this file when the agent needs guidance on executing tasks in parallel waves, agent orchestration, prompt templates, and error recovery. -->

# Wave Execution Model

This reference covers how to orchestrate parallel execution of sub-tasks in waves, including agent management, prompt templates, blocked task handling, and error recovery.

---

## Execution Overview

```
for each wave in [Wave 1, Wave 2, ..., Wave N]:
  1. Gather all tasks in this wave
  2. For each task, prepare the agent prompt from the board
  3. Launch parallel agents (one per task)
  4. Wait for all agents to complete
  5. Update board with results
  6. Run cross-task verification for this wave
  7. Resolve any conflicts between parallel outputs
  8. Proceed to next wave
```

---

## Agent Orchestration

### Claude Code (Primary Platform)

**Parallel Agents via Agent Tool:**
Launch multiple Agent tool calls in a single message. Each agent runs independently with its own context.

```
Agent 1: Execute SH-002 (Database schema)
Agent 2: Execute SH-003 (API router setup)
Agent 3: Execute SH-004 (Config files)
```

**Worktree Isolation (for file-conflict-prone tasks):**
Use `isolation: "worktree"` when tasks in the same wave might touch overlapping files. Each agent gets an isolated copy of the repo. Changes are merged back after the wave completes.

**When to use worktrees:**
- Two tasks in the same wave modify the same directory
- Tasks create files with potential naming conflicts
- Complex refactors where intermediate states might conflict

**When NOT to use worktrees:**
- Tasks touch completely different directories
- Simple additions with no overlap
- The overhead of merging isn't worth the isolation

### Other Platforms (Adaptable)
The wave model works with any agent system that supports:
- Spawning multiple independent execution contexts
- Waiting for all contexts to complete
- Collecting results from each context

---

## Agent Prompt Template

Each agent receives a structured prompt derived from the board. Use this template:

```
## Task: {task.id} - {task.title}

### Context
{task.description}

### Research Notes
{task.research_notes from DISCOVER phase}

### Execution Plan
- Files to create/modify: {task.plan.files}
- Test files: {task.plan.test_files}
- Approach: {task.plan.approach}

### Acceptance Criteria
{task.plan.acceptance_criteria}

### Instructions
1. Write tests FIRST based on the acceptance criteria
2. Run the tests - they should FAIL (red phase)
3. Implement the code to make the tests pass (green phase)
4. Refactor if needed, ensuring tests still pass (refactor phase)
5. Run lint and type-check on all modified files
6. Report: files changed, tests written, tests passing, any issues

### Constraints
- Follow existing project conventions found in research notes
- Reuse existing utilities identified in research: {task.research.reusable_code}
- Do NOT modify files outside the planned scope
- If blocked, report the blocker instead of working around it
```

### Template Customization by Task Type

**For `code` tasks**: Use the full TDD template above.

**For `test` tasks**: Skip the "write tests first" step - the task IS writing tests.
```
### Instructions
1. Write comprehensive tests for: {what_is_being_tested}
2. Include: happy path, edge cases, error scenarios
3. Run the tests to verify they pass against the existing implementation
4. Report: test count, coverage if available, any gaps identified
```

**For `docs` tasks**: No TDD, focus on accuracy.
```
### Instructions
1. Review the code/API that needs documentation
2. Write documentation following the project's existing doc style
3. Verify all code examples are syntactically correct
4. Report: files created/modified, sections covered
```

**For `config`/`infra` tasks**: Verify by running the tool/build.
```
### Instructions
1. Create/modify configuration files as planned
2. Verify the configuration works by running the relevant tool
3. Report: files changed, verification output
```

---

## Handling Blocked Tasks

### What Causes Blocks
- A dependency task failed and its output isn't available
- An external service is unavailable during DISCOVER
- The planned approach turns out to be infeasible during EXECUTE
- A file conflict is detected between parallel tasks

### Block Resolution Protocol

```
When a task is blocked:
  1. Mark task status as "blocked" on the board
  2. Record the blocker reason: {why it's blocked}
  3. Record the blocking task ID (if applicable): {SH-XXX}
  4. Continue executing non-blocked tasks in the current wave
  5. After wave completes, reassess blocked tasks:
     a. If blocker is resolved -> add task to next wave
     b. If blocker persists -> flag for user attention
     c. If task can be approached differently -> revise plan and retry
```

### Dynamic Re-Waving
If blocked tasks need to be rescheduled:
1. Remove the blocked task from its current wave
2. Recalculate its earliest possible wave based on resolved dependencies
3. Insert it into the appropriate wave
4. Update the board with the revised wave plan

---

## Error Recovery

### Failure Categories

| Category | Action | Max Retries |
|----------|--------|-------------|
| Test failure (code bug) | Fix the code, re-run tests | 2 |
| Lint/type error | Fix the issue, re-run check | 2 |
| Build failure | Investigate root cause, fix | 1 |
| Agent crash/timeout | Restart agent with same prompt | 1 |
| Merge conflict | Resolve conflict, re-verify | 1 |
| Fundamental approach failure | Revise plan, flag for user | 0 (needs user input) |

### Retry Protocol

```
When a task fails:
  1. Capture the error output
  2. Determine the failure category
  3. If retries remaining:
     a. Append error context to the agent prompt
     b. Re-run the agent with: "Previous attempt failed because: {error}. Fix and retry."
     c. Decrement retry counter
  4. If no retries remaining:
     a. Mark task as "failed" on the board
     b. Record the failure reason and all attempt logs
     c. Flag for user attention with a clear summary
     d. Continue with other tasks - don't block the wave
```

### Cascade Failure Prevention
If a Wave N task fails and Wave N+1 tasks depend on it:
1. Mark dependent tasks as "blocked" (not "failed")
2. Execute non-dependent tasks in Wave N+1 normally
3. If the failed task is eventually fixed (via retry or user intervention), unblock and execute dependents

---

## Cross-Task Verification (Post-Wave)

After all tasks in a wave complete:

1. **File Conflict Check**: Verify no two agents modified the same file in conflicting ways
2. **Interface Compatibility**: If tasks defined shared interfaces, verify they match
3. **Import Resolution**: Verify all cross-task imports resolve correctly
4. **Combined Build**: Run the build with all wave outputs combined
5. **Combined Tests**: Run the test suite for all tasks in the wave

If conflicts are detected:
1. Identify which tasks conflict
2. Determine priority (earlier task ID wins by default)
3. Resolve the conflict
4. Re-verify the resolution

---

## Performance Guidelines

### Optimal Wave Size
- **1-3 tasks per wave**: Efficient, low coordination overhead
- **4-6 tasks per wave**: Good parallelism, manageable verification
- **7+ tasks per wave**: Consider splitting into sub-waves to reduce blast radius of failures

### Agent Resource Management
- Each parallel agent consumes context window and compute
- For resource-constrained environments, limit concurrent agents to 3-4
- Use `run_in_background: true` for independent tasks that don't block your next action

### When to Skip Parallelism
- Wave has only 1 task (obvious)
- All tasks in the wave modify the same file (serialize to prevent conflicts)
- Tasks have implicit dependencies not captured in the DAG (rare, indicates decomposition issue)
