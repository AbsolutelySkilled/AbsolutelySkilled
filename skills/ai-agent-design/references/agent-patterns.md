<!-- Part of the ai-agent-design AbsolutelySkilled skill. Load this file when
     selecting an agent architecture pattern, comparing ReAct vs plan-and-execute,
     implementing reflexion, LATS tree search, or multi-agent debate. -->

# Agent Patterns Catalog

A catalog of production-proven agent architectures. Each pattern includes the
core loop, when to use it, implementation considerations, and known failure modes.

---

## 1. ReAct (Reason + Act)

**Paper**: "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., 2022)

### How it works

The agent interleaves reasoning traces and actions in a single context window:

```
Thought: I need to find the population of Tokyo.
Action: search_web[{"query": "Tokyo population 2024"}]
Observation: Tokyo has a population of approximately 13.96 million in the city proper.
Thought: Now I have the data. I can answer the question.
Final Answer: Tokyo's population is approximately 13.96 million.
```

Each step is appended to the context, giving the agent full visibility into its
own reasoning history.

### When to use

- Tasks requiring frequent external lookups (search, APIs, file reads)
- Interactive tasks where errors need mid-run correction
- Debugging-friendly workflows (the thought chain is readable)
- General-purpose agents where task structure is unknown upfront

### Implementation notes

- Parse the LLM output to extract `Action:` and `Final Answer:` markers
- Validate tool names and inputs before execution; return structured errors as observations
- Set `maxIterations` (typically 10-15 for complex tasks)
- Include the tool list and their descriptions in the initial system prompt

### Failure modes

- **Looping**: Agent repeats the same action after receiving the same observation. Fix: track action/observation pairs and break on duplicates.
- **Tool hallucination**: Agent invokes a tool that doesn't exist. Fix: strict tool name validation; return "tool not found" as observation.
- **Context overflow**: Long observation chains fill the window. Fix: summarize old observations; use a sliding window.

---

## 2. Plan-and-Execute

**Paper**: "Plan-and-Solve Prompting" (Wang et al., 2023)

### How it works

Two-phase architecture:

1. **Planner** - generates a full task decomposition upfront
2. **Executor** - runs each subtask independently, optionally in parallel

```typescript
// Phase 1: plan
const plan = await planner.generate(`
  Goal: Research and summarize AI trends for Q1 2025
  Output: A JSON list of tasks with dependencies
`)
// plan = [
//   { id: "t1", description: "Search for AI news Jan 2025", dependsOn: [] },
//   { id: "t2", description: "Search for AI news Feb 2025", dependsOn: [] },
//   { id: "t3", description: "Summarize findings", dependsOn: ["t1", "t2"] },
// ]

// Phase 2: execute
for (const task of topologicalSort(plan)) {
  const context = getCompletedResults(task.dependsOn)
  results[task.id] = await executor.generate(task.description, context)
}
```

### When to use

- Long-horizon tasks with predictable subtask structure (research, report generation)
- Workflows where subtasks are independent and can parallelize
- When you need human review of the plan before execution begins

### Implementation notes

- Planner output should be structured (JSON) for reliable parsing
- Use dependency tracking for parallel execution of independent tasks
- Allow the plan to be revised if a subtask fails (re-plan from failure point)
- Executor agents should be stateless - pass all necessary context explicitly

### Failure modes

- **Over-planning**: LLM generates too many trivial subtasks. Fix: ask planner to keep plan to N steps max.
- **Stale plan**: Initial plan doesn't account for information discovered during execution. Fix: add a re-planning step after each execution phase.
- **Dependency deadlock**: Circular dependencies in the plan. Fix: validate the DAG before execution; detect cycles.

---

## 3. Reflexion

**Paper**: "Reflexion: Language Agents with Verbal Reinforcement Learning" (Shinn et al., 2023)

### How it works

The agent evaluates its own output and iteratively improves through verbal reflection:

```
Attempt 1 -> Output -> Evaluate -> "Output was too brief, missing key metrics"
Attempt 2 -> Output -> Evaluate -> "Good coverage but incorrect calculation in section 3"
Attempt 3 -> Output -> Evaluate -> "Passes all criteria" -> DONE
```

Each reflection is stored in an "episodic memory buffer" and injected into the
next attempt's context.

### When to use

- Tasks with a clear quality evaluator (unit tests, rubrics, validators)
- Writing or code generation where iterative refinement is natural
- Tasks where first-pass quality is often insufficient

### Implementation notes

```typescript
async function reflexionAgent(
  task: string,
  evaluator: (output: string) => Promise<{ passed: boolean; feedback: string }>,
  agent: (task: string, memory: string[]) => Promise<string>,
  maxAttempts = 3,
): Promise<string> {
  const memory: string[] = []

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const output = await agent(task, memory)
    const { passed, feedback } = await evaluator(output)

    if (passed) return output

    memory.push(`Attempt ${attempt + 1} feedback: ${feedback}`)
  }

  throw new Error(`Failed after ${maxAttempts} attempts`)
}
```

- The evaluator can be another LLM, a programmatic test, or a human
- Memory accumulates across attempts - keep it concise (summarize if needed)
- Set a hard `maxAttempts` to prevent infinite refinement

### Failure modes

- **Feedback oscillation**: Agent improves one aspect and degrades another. Fix: use a multi-criteria evaluator that scores each dimension independently.
- **Evaluator bias**: LLM evaluator is too lenient or inconsistent. Fix: use programmatic validators where possible (tests, schemas).

---

## 4. LATS (Language Agent Tree Search)

**Paper**: "Language Agent Tree Search Unifies Reasoning, Acting, and Planning in Language Models" (Zhou et al., 2023)

### How it works

Applies Monte Carlo Tree Search (MCTS) to agent trajectories:

```
Root (initial state)
├── Branch A: search_web -> read_page -> summarize
│   ├── Branch A1: different search query
│   └── Branch A2: different page selection
└── Branch B: read_file -> extract_data -> validate
    └── Branch B1: different extraction strategy
```

Each node is scored by a value function (LLM-based or heuristic). The search
expands the most promising branches, backtracks from dead ends, and selects
the highest-scoring complete trajectory.

### When to use

- Tasks with a clear success metric where maximizing quality is worth the compute cost
- Complex reasoning tasks (math, code generation) with multiple valid solution paths
- When other single-trajectory methods consistently fail

### Implementation notes

```typescript
interface TreeNode {
  state: string        // current context/observations
  action: string       // action taken to reach this node
  parent: TreeNode | null
  children: TreeNode[]
  visits: number
  value: number        // cumulative score
}

// UCB1 selection: balance exploration vs exploitation
function ucb1Score(node: TreeNode, explorationConstant = 1.4): number {
  if (node.visits === 0) return Infinity
  const exploitation = node.value / node.visits
  const exploration = explorationConstant * Math.sqrt(Math.log(node.parent!.visits) / node.visits)
  return exploitation + exploration
}
```

- Expensive: each branch requires LLM calls. Use for high-value tasks only.
- Value function quality is critical - a bad evaluator leads to poor branch selection.
- Implement beam search as a simpler alternative when full MCTS is too costly.

### Failure modes

- **Compute explosion**: Branching factor too high. Fix: limit branching factor to 2-3 per node; prune low-score branches early.
- **Value function gaming**: Agent finds outputs that score well but aren't actually correct. Fix: use diverse evaluation criteria.

---

## 5. Multi-Agent Debate

**Paper**: "Improving Factuality and Reasoning in Language Models through Multiagent Debate" (Du et al., 2023)

### How it works

Multiple agents independently produce answers, then iteratively critique and
refine each other's responses. A judge (or consensus) produces the final answer.

```
Round 1:
  Agent A: "The capital is Paris"
  Agent B: "The capital is Lyon"
  Agent C: "The capital is Paris"

Round 2 (each sees all round 1 answers):
  Agent A: "I maintain Paris - it's clearly the capital"
  Agent B: "After review, I agree Paris is correct"
  Agent C: "Paris. Agent B was incorrect initially"

Judge: "Consensus: Paris" -> Final Answer
```

### When to use

- High-stakes factual questions where hallucination risk is high
- Complex reasoning where diverse perspectives reduce blind spots
- Tasks where a single LLM consistently makes the same systematic error

### Implementation notes

```typescript
async function multiAgentDebate(
  question: string,
  agents: Array<(question: string, context: string) => Promise<string>>,
  rounds = 2,
  judge: (question: string, responses: string[]) => Promise<string>,
): Promise<string> {
  let responses = await Promise.all(agents.map(a => a(question, '')))

  for (let round = 1; round < rounds; round++) {
    const context = responses.map((r, i) => `Agent ${i + 1}: ${r}`).join('\n')
    responses = await Promise.all(agents.map(a => a(question, context)))
  }

  return judge(question, responses)
}
```

- Use agents with different system prompts or temperatures to ensure diversity
- Typically 2-3 rounds is sufficient; diminishing returns after that
- Judge can be a separate LLM or a majority-vote function

### Failure modes

- **Echo chamber**: Agents converge too quickly and reinforce each other's errors. Fix: use agents with different base prompts or models; force disagreement in round 1.
- **Indecisive judge**: Judge fails to pick between evenly split responses. Fix: instruct the judge to always select one answer with explicit reasoning.

---

## Pattern Selection Guide

| Situation | Recommended Pattern |
|---|---|
| Interactive task, errors need mid-run correction | ReAct |
| Long task, subtasks are known upfront, parallelizable | Plan-and-Execute |
| Output quality matters, a validator exists | Reflexion |
| Maximize quality regardless of compute cost | LATS |
| High-stakes facts, hallucination risk is critical concern | Multi-Agent Debate |
| Simple one-shot task, no iteration needed | Single LLM call (no agent loop) |

---

## Combining Patterns

Patterns compose. Common combinations:

- **Plan-and-Execute + ReAct**: Each executor step is itself a ReAct loop
- **Reflexion + Multi-Agent Debate**: Debate evaluates each reflexion attempt
- **Plan-and-Execute + LATS**: Planner uses tree search; executor uses ReAct
- **Hierarchical + Debate**: Orchestrator spawns debaters, synthesizes consensus

Start with the simplest pattern that can solve the task. Add complexity only
when benchmarking shows the simpler pattern falls short.
