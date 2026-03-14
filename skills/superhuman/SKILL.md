---
name: superhuman
version: 0.1.0
description: >
  AI-native software development lifecycle that replaces traditional SDLC.
  Triggers on "plan and build", "break this into tasks", "build this feature
  end-to-end", "sprint plan this", "superhuman this", or any multi-step
  development task. Decomposes work into dependency-graphed sub-tasks, executes
  in parallel waves with TDD verification, and tracks progress on a persistent
  board. Handles features, refactors, greenfield projects, and migrations.
category: engineering
tags:
  - sdlc
  - planning
  - parallel-execution
  - tdd
  - task-management
  - workflow
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
  - mcp
sources:
  - url: https://github.com/AbsolutelySkilled/AbsolutelySkilled
    accessed: 2026-03-14
    description: Original skill design combining sprint planning, TDD, spec-driven development, and parallel agent execution into a unified AI-native lifecycle
license: MIT
maintainers:
  - github: maddhruv
---

# Superhuman: AI-Native Development Lifecycle

Superhuman is a development lifecycle built from the ground up for AI agents. Traditional methods like Agile, Waterfall, and TDD were designed around human constraints - limited parallelism, context switching costs, communication overhead, and meetings. AI agents have none of these constraints. Superhuman exploits this by decomposing work into dependency-graphed sub-tasks, executing independent tasks in parallel waves, enforcing TDD verification at every step, and tracking everything on a persistent board that survives across sessions.

The model has 7 phases: **INTAKE - DECOMPOSE - DISCOVER - PLAN - EXECUTE - VERIFY - CONVERGE**.

---

## When to Use This Skill

**Use Superhuman when:**
- Multi-step feature development touching 3+ files or components
- User says "build this end-to-end" or "plan and execute this"
- User says "break this into tasks" or "sprint plan this"
- Any task requiring planning + implementation + verification
- Greenfield projects, major refactors, or migrations
- Complex bug fixes that span multiple systems

**Do NOT use Superhuman when:**
- Single-file bug fixes or typo corrections
- Quick questions or code explanations
- Tasks the user wants to do manually with your guidance
- Pure research or exploration tasks

---

## Key Principles

### 1. Dependency-First Decomposition
Every task is a node in a directed acyclic graph (DAG), not a flat list. Dependencies between tasks are explicit. This prevents merge conflicts, ordering bugs, and wasted work.

### 2. Wave-Based Parallelism
Tasks at the same depth in the dependency graph form a "wave". All tasks in a wave execute simultaneously via parallel agents. Waves execute in serial order. This maximizes throughput while respecting dependencies.

### 3. Test-First Verification
Every sub-task writes tests before implementation. A task is only "done" when its tests pass. No exceptions for "simple" changes - tests are the proof of correctness.

### 4. Persistent State
All progress is tracked in `.superhuman/board.md` in the project root. This file survives across sessions, enabling resume, audit, and handoff. The user chooses during INTAKE whether the board is git-tracked or gitignored.

### 5. Interactive Intake
Never assume. Scale questioning depth to task complexity - simple tasks get 3 questions, complex ones get 8-10. Extract requirements, constraints, and success criteria before writing a single line of code.

---

## Core Concepts

### The 7 Phases

```
INTAKE --> DECOMPOSE --> DISCOVER --> PLAN --> EXECUTE --> VERIFY --> CONVERGE
  |           |             |          |         |           |          |
  |  gather   |  build DAG  | research | detail  | parallel  | test +   | merge +
  |  context  |  + waves    | per task | per task| waves     | verify   | close
```

### Task Graph
A directed acyclic graph (DAG) where each node is a sub-task and edges represent dependencies. Tasks with no unresolved dependencies can execute in parallel. See `references/dependency-graph-patterns.md`.

### Execution Waves
Groups of independent tasks assigned to the same depth level in the DAG. Wave 1 runs first (all tasks in parallel), then Wave 2 (all tasks in parallel), and so on. See `references/wave-execution.md`.

### Board
The `.superhuman/board.md` file is the single source of truth. It contains the intake summary, task graph, wave assignments, per-task status, research notes, plans, and verification results. See `references/board-format.md`.

### Sub-task Lifecycle
```
pending --> researching --> planned --> in-progress --> verifying --> done
                                           |                |
                                           +--- blocked     +--- failed (retry)
```

---

## Phase 1: INTAKE (Interactive Interview)

The intake phase gathers all context needed to decompose the task. Scale depth based on complexity.

### Complexity Detection
- **Simple** (single component, clear scope): 3 questions
- **Medium** (multi-component, some ambiguity): 5 questions
- **Complex** (cross-cutting, greenfield, migration): 8-10 questions

### Core Questions (always ask)
1. **Problem Statement**: What exactly needs to be built or changed? What triggered this work?
2. **Success Criteria**: How will we know this is done? What does "working" look like?
3. **Constraints**: Are there existing patterns, libraries, or conventions we must follow?

### Extended Questions (medium + complex)
4. **Existing Code**: Is there related code already in the repo? Should we extend it or build fresh?
5. **Dependencies**: Does this depend on external APIs, services, or other in-progress work?

### Deep Questions (complex only)
6. **Edge Cases**: What are the known edge cases or failure modes?
7. **Testing Strategy**: Are there existing test patterns? Integration vs unit preference?
8. **Rollout**: Any migration steps, feature flags, or backwards compatibility needs?
9. **Documentation**: What docs need updating? API docs, README, architecture docs?
10. **Priority**: Which parts are most critical? What can be deferred if needed?

### Board Persistence Question (always ask)
Ask: "Should the `.superhuman/` board be git-tracked (audit trail, resume across machines) or gitignored (local working state)?"

### Output
Write the intake summary to `.superhuman/board.md` with all answers captured. See `references/intake-playbook.md` for the full question bank organized by task type.

---

## Phase 2: DECOMPOSE (Task Graph Creation)

Break the intake into atomic sub-tasks and build the dependency graph.

### Sub-task Anatomy
Each sub-task must have:
- **ID**: Sequential identifier (e.g., `SH-001`)
- **Title**: Clear, action-oriented (e.g., "Create user authentication middleware")
- **Description**: 2-3 sentences on what this task does
- **Type**: `code` | `test` | `docs` | `infra` | `config`
- **Complexity**: `S` (< 50 lines) | `M` (50-200 lines) | `L` (200+ lines - consider splitting)
- **Dependencies**: List of task IDs this depends on (e.g., `[SH-001, SH-003]`)

### Decomposition Rules
1. Every task should be S or M complexity. If L, decompose further
2. Test tasks are separate from implementation tasks
3. Infrastructure/config tasks come before code that depends on them
4. Documentation tasks depend on the code they document
5. Aim for 5-15 sub-tasks. Fewer means under-decomposed; more means over-engineered

### Build the DAG
1. List all sub-tasks
2. For each task, identify which other tasks must complete first
3. Draw edges from dependencies to dependents
4. Verify no cycles exist (it's a DAG, not a general graph)

### Assign Waves
Group tasks by depth level in the DAG:
- **Wave 1**: Tasks with zero dependencies (roots of the DAG)
- **Wave 2**: Tasks whose dependencies are all in Wave 1
- **Wave N**: Tasks whose dependencies are all in Waves 1 through N-1

### Present for Approval
Generate an ASCII dependency graph and wave assignment table. Present to the user and wait for explicit approval before proceeding.

Example output:
```
Task Graph:
  SH-001 [config: Init project structure]
    |
    +---> SH-002 [code: Database schema]
    |       |
    |       +---> SH-004 [code: User model]
    |       +---> SH-005 [code: Auth model]
    |
    +---> SH-003 [code: API router setup]
              |
              +---> SH-006 [code: Auth endpoints]
                      |
                      +---> SH-007 [test: Auth integration tests]
                      +---> SH-008 [docs: API documentation]

Wave Assignments:
  Wave 1: SH-001                          (1 task, serial)
  Wave 2: SH-002, SH-003                  (2 tasks, parallel)
  Wave 3: SH-004, SH-005, SH-006         (3 tasks, parallel)
  Wave 4: SH-007, SH-008                  (2 tasks, parallel)
```

Update the board with the full task graph and wave assignments. See `references/dependency-graph-patterns.md` for common patterns and the wave assignment algorithm.

---

## Phase 3: DISCOVER (Parallel Research)

Research each sub-task before planning implementation. This phase is parallelizable per wave.

### Per Sub-task Research
For each sub-task, investigate:

1. **Codebase Exploration**
   - Find existing patterns, utilities, and conventions relevant to this task
   - Identify files that will be created or modified
   - Check for reusable functions, types, or components
   - Understand the testing patterns used in the project

2. **Web Research** (when codebase context is insufficient)
   - Official documentation for libraries and APIs involved
   - Best practices and common patterns
   - Known gotchas or breaking changes

3. **Risk Assessment**
   - Flag unknowns or ambiguities
   - Identify potential conflicts with other sub-tasks
   - Note any assumptions that need validation

### Execution Strategy
- Launch parallel Explore agents for all tasks in Wave 1 simultaneously
- Once Wave 1 research completes, launch Wave 2 research, and so on
- Each agent writes its findings to the board under the respective task

### Output
Append research notes to each sub-task on the board:
- Key files identified
- Reusable code/patterns found
- Risks and unknowns flagged
- External docs referenced

---

## Phase 4: PLAN (Execution Planning)

Create a detailed execution plan for each sub-task based on research findings.

### Per Sub-task Plan
For each sub-task, specify:

1. **Files to Create/Modify**: Exact file paths
2. **Test Files**: Test file paths (TDD - these are written first)
3. **Implementation Approach**: Brief description of the approach
4. **Acceptance Criteria**: Specific, verifiable conditions for "done"
5. **Test Cases**: List of test cases to write
   - Happy path tests
   - Edge case tests
   - Error handling tests

### Planning Rules
1. Tests are always planned before implementation
2. Each plan must reference specific reusable code found in DISCOVER
3. Plans must respect the project's existing conventions (naming, structure, patterns)
4. If a plan reveals a missing dependency, update the task graph (re-approve with user)

### Output
Update each sub-task on the board with its execution plan. The board now contains everything an agent needs to execute the task independently.

---

## Phase 5: EXECUTE (Wave-Based Implementation)

Execute tasks wave by wave. Within each wave, spin up parallel agents for independent tasks.

### Wave Execution Loop
```
for each wave in [Wave 1, Wave 2, ..., Wave N]:
  for each task in wave (in parallel):
    1. Write tests (TDD - red phase)
    2. Implement code to make tests pass (green phase)
    3. Refactor if needed (refactor phase)
    4. Update board status: in-progress -> verifying
  wait for all tasks in wave to complete
  run cross-task verification for this wave
  proceed to next wave
```

### Agent Prompt Template
Each parallel agent receives:
- The sub-task details from the board (ID, title, description, plan)
- The research notes for that task
- The acceptance criteria
- Instructions to follow TDD: write tests first, then implement

### Handling Blocked Tasks
If a task cannot proceed:
1. Mark it as `blocked` on the board with a reason
2. Continue with non-blocked tasks in the same wave
3. After the wave completes, reassess blocked tasks
4. If the blocker is resolved, add the task to the next wave

### Handling Failures
If an agent fails to complete a task:
1. Capture the error/failure reason on the board
2. Attempt one retry with adjusted approach
3. If retry fails, mark as `failed` and flag for user attention
4. Continue with other tasks - don't let one failure block the wave

See `references/wave-execution.md` for detailed agent orchestration patterns.

---

## Phase 6: VERIFY (Per-Task + Integration)

Every sub-task must prove it works before closing.

### Per-Task Verification
For each completed sub-task, run:
1. **Tests**: Run the task's test suite - all tests must pass
2. **Lint**: Run the project's linter on modified files
3. **Type Check**: Run type checker if applicable (TypeScript, mypy, etc.)
4. **Build**: Verify the project still builds

### Integration Verification
After each wave completes:
1. Run tests for tasks that depend on this wave's output
2. Check for conflicts between parallel tasks (file conflicts, API mismatches)
3. Run the full test suite if available

### Verification Loop
```
if all checks pass:
  mark task as "done"
  update board with verification report
else:
  mark task as "failed"
  loop back to EXECUTE for this task (max 2 retries)
  if still failing after retries:
    flag for user attention
    continue with other tasks
```

### Output
Update each sub-task on the board with a verification report:
- Tests: pass/fail (with details on failures)
- Lint: clean/issues
- Type check: pass/fail
- Build: pass/fail

See `references/verification-framework.md` for the full verification protocol.

---

## Phase 7: CONVERGE (Final Integration)

Merge all work and close out the board.

### Steps
1. **Merge**: If using worktrees or branches, merge all work into the target branch
2. **Full Test Suite**: Run the complete project test suite
3. **Documentation**: Update any docs that were part of the task scope
4. **Summary**: Generate a change summary with:
   - Files created/modified (with line counts)
   - Tests added (with coverage if available)
   - Key decisions made during execution
   - Any deferred work or follow-ups
5. **Close Board**: Mark the board as `completed` with a timestamp
6. **Suggest Commit**: Propose a commit message summarizing the work

### Board Finalization
The completed board serves as an audit trail:
- Full history of all 7 phases
- Every sub-task with its research, plan, and verification
- Timeline of execution
- Any issues encountered and how they were resolved

---

## Anti-Patterns and Common Mistakes

| Anti-Pattern | Better Approach |
|---|---|
| Skipping intake for "obvious" tasks | Even simple tasks benefit from 3 intake questions - assumptions kill projects |
| Flat task lists without dependencies | Always model as a DAG - hidden dependencies cause merge conflicts and ordering bugs |
| Executing without user approval of the graph | Always present the wave plan and get explicit approval before any execution |
| Skipping TDD for "simple" changes | Tests are verification proof, not optional extras - write them first, always |
| Massive sub-tasks (L+ complexity) | Decompose further until all tasks are S or M - large tasks hide complexity |
| Not persisting board state | Always write to `.superhuman/board.md` - it enables resume, audit, and handoff |
| Over-decomposing into 20+ micro-tasks | Aim for 5-15 tasks - too many creates overhead that defeats the purpose |
| Ignoring research phase | DISCOVER prevents rework - 10 minutes of research saves hours of wrong implementation |
| Sequential execution when parallelism is possible | Always check the DAG for parallel opportunities - that's the whole point of Superhuman |

---

## References

For detailed guidance on specific phases, load these reference files:

- **`references/intake-playbook.md`** - Full question bank organized by task type (feature, bug, refactor, greenfield, migration), with scaling rules and example sessions
- **`references/dependency-graph-patterns.md`** - Common DAG patterns, ASCII rendering format, wave assignment algorithm, and example graphs
- **`references/wave-execution.md`** - Parallel agent orchestration, agent prompt templates, blocked task handling, error recovery
- **`references/verification-framework.md`** - TDD workflow per sub-task, verification signals, integration testing, failure handling
- **`references/board-format.md`** - Full `.superhuman/board.md` specification with format, status transitions, and example board
