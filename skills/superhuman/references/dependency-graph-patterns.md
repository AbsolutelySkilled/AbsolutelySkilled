<!-- Part of the Superhuman AbsolutelySkilled skill. Load this file when the agent needs guidance on decomposing tasks into dependency graphs, common DAG patterns, ASCII rendering, and wave assignment. -->

# Dependency Graph Patterns

This reference covers how to decompose tasks into dependency graphs, common patterns, the ASCII rendering format, and the wave assignment algorithm.

---

## Identifying Dependencies

A task B depends on task A if:
- B needs code/files that A creates
- B extends or modifies A's output
- B tests functionality that A implements
- B documents behavior that A defines
- B configures infrastructure that A requires

A task B does NOT depend on A if:
- They modify different files with no shared interfaces
- They implement independent features
- They can be tested in isolation

### Dependency Checklist
For each pair of tasks, ask:
1. Does task B need any file that task A creates? -> dependency
2. Does task B import or use any function/type that task A defines? -> dependency
3. Does task B test code that task A writes? -> dependency
4. Can task B's tests pass without task A being complete? -> if yes, no dependency

---

## Common DAG Patterns

### Linear Chain
One task after another. No parallelism possible.
```
SH-001 --> SH-002 --> SH-003 --> SH-004
```
**When it occurs**: Sequential migrations, step-by-step setup
**Waves**: Each task is its own wave (worst case for parallelism)

### Fan-Out
One task fans out to many independent tasks.
```
            +---> SH-002
            |
SH-001 ----+---> SH-003
            |
            +---> SH-004
```
**When it occurs**: After initial setup, multiple independent features branch off
**Waves**: Wave 1 = SH-001, Wave 2 = SH-002 + SH-003 + SH-004

### Fan-In
Many independent tasks converge to one.
```
SH-001 ---+
           |
SH-002 ---+---> SH-004
           |
SH-003 ---+
```
**When it occurs**: Integration testing after parallel implementation
**Waves**: Wave 1 = SH-001 + SH-002 + SH-003, Wave 2 = SH-004

### Diamond
Fan-out followed by fan-in.
```
            +---> SH-002 ---+
            |                |
SH-001 ----+                +---> SH-005
            |                |
            +---> SH-003 ---+
            |                |
            +---> SH-004 ---+
```
**When it occurs**: Setup -> parallel features -> integration
**Waves**: Wave 1 = SH-001, Wave 2 = SH-002 + SH-003 + SH-004, Wave 3 = SH-005

### Independent Clusters
Multiple disconnected sub-graphs that can run entirely in parallel.
```
Cluster A:  SH-001 --> SH-002
Cluster B:  SH-003 --> SH-004 --> SH-005
Cluster C:  SH-006
```
**When it occurs**: Unrelated features being built simultaneously
**Waves**: Wave 1 = SH-001 + SH-003 + SH-006, Wave 2 = SH-002 + SH-004, Wave 3 = SH-005

### Layered Architecture
Tasks organized by architectural layers.
```
Layer 1 (infra):    SH-001, SH-002
Layer 2 (data):     SH-003, SH-004    (depend on Layer 1)
Layer 3 (logic):    SH-005, SH-006    (depend on Layer 2)
Layer 4 (UI):       SH-007, SH-008    (depend on Layer 3)
Layer 5 (tests):    SH-009, SH-010    (depend on Layer 4)
```
**When it occurs**: Full-stack feature development
**Waves**: One wave per layer

---

## Wave Assignment Algorithm

### Algorithm (Topological Sort + Depth Grouping)

```
function assignWaves(tasks):
  // Calculate depth for each task
  for each task in tasks:
    if task has no dependencies:
      task.depth = 0
    else:
      task.depth = max(dependency.depth for dependency in task.dependencies) + 1

  // Group by depth
  waves = group tasks by task.depth

  // Wave 1 = depth 0, Wave 2 = depth 1, etc.
  return waves
```

### Rules
1. Tasks with no dependencies are always Wave 1
2. A task's wave = max(wave of its dependencies) + 1
3. All tasks in the same wave can execute in parallel
4. Waves execute in strict sequential order
5. If a wave has only 1 task, it still counts as a wave (serial execution)

### Optimization
- If two tasks are in the same wave but modify the same file, move one to a later wave to prevent conflicts
- If a wave has more tasks than available parallel agents, split it into sub-waves

---

## ASCII Graph Rendering Format

### Conventions
- `-->` for dependency edges (A --> B means "B depends on A")
- `+` for branch points
- `|` for vertical connections
- Indent child tasks under their parents
- Include task type and title in brackets

### Standard Format
```
Task Graph:
  SH-001 [type: title]
    |
    +---> SH-002 [type: title]
    |       |
    |       +---> SH-004 [type: title]
    |
    +---> SH-003 [type: title]
```

### With Wave Annotations
```
Task Graph:
  [W1] SH-001 [config: Init project structure]
         |
         +---> [W2] SH-002 [code: Database schema]
         |            |
         |            +---> [W3] SH-004 [code: User model]
         |
         +---> [W2] SH-003 [code: API router setup]

Wave Summary:
  Wave 1 (1 task):  SH-001
  Wave 2 (2 tasks): SH-002, SH-003  [parallel]
  Wave 3 (1 task):  SH-004
```

---

## Example: Full-Stack Feature Decomposition

### Task: "Add a commenting system to blog posts"

**Sub-tasks identified:**
- SH-001: Create Comment database model and migration (config, S)
- SH-002: Create Comment API endpoints - CRUD (code, M)
- SH-003: Create CommentList UI component (code, M)
- SH-004: Create CommentForm UI component (code, S)
- SH-005: Wire API to UI with data fetching (code, M)
- SH-006: Add comment notification system (code, M)
- SH-007: Write API integration tests (test, M)
- SH-008: Write UI component tests (test, S)
- SH-009: Update API documentation (docs, S)

**Dependencies:**
- SH-002 depends on SH-001 (needs the model)
- SH-003 depends on nothing (can use mock data)
- SH-004 depends on nothing (can use mock data)
- SH-005 depends on SH-002, SH-003, SH-004 (wires them together)
- SH-006 depends on SH-002 (needs API to trigger notifications)
- SH-007 depends on SH-002 (tests the API)
- SH-008 depends on SH-003, SH-004 (tests the components)
- SH-009 depends on SH-002 (documents the API)

**Graph:**
```
  SH-001 [config: Comment model + migration]
    |
    +---> SH-002 [code: Comment CRUD API]
    |       |
    |       +---> SH-005 [code: Wire API to UI] (also depends on SH-003, SH-004)
    |       +---> SH-006 [code: Notification system]
    |       +---> SH-007 [test: API integration tests]
    |       +---> SH-009 [docs: API documentation]
    |
    (independent)
    SH-003 [code: CommentList component]
    |       |
    |       +---> SH-005 (see above)
    |       +---> SH-008 [test: UI component tests] (also depends on SH-004)
    |
    SH-004 [code: CommentForm component]
```

**Wave Assignment:**
```
  Wave 1 (3 tasks): SH-001, SH-003, SH-004    [parallel]
  Wave 2 (1 task):  SH-002                      [serial - needs SH-001]
  Wave 3 (4 tasks): SH-005, SH-006, SH-007, SH-008, SH-009  [parallel]
```

Note: SH-005 depends on SH-002 (Wave 2) AND SH-003, SH-004 (Wave 1), so it goes in Wave 3. SH-008 depends on SH-003, SH-004 (Wave 1), so it could be Wave 2, but since it also tests the components, waiting for Wave 2 to complete is cleaner.
