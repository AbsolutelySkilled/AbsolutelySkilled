<!-- Part of the AI Agent Design AbsolutelySkilled skill. Load this file when working with multi-agent orchestration or plan-and-execute decomposition. -->

# Multi-Agent Orchestration and Planning Patterns

## Multi-agent orchestration

```typescript
interface AgentResult {
  agentId: string
  output: string
  success: boolean
}

type AgentFn = (input: string, context: string) => Promise<AgentResult>

// Sequential pipeline - each agent feeds the next
async function sequentialPipeline(
  agents: Array<{ id: string; fn: AgentFn }>,
  initialInput: string,
): Promise<AgentResult[]> {
  const results: AgentResult[] = []
  let current = initialInput

  for (const { id, fn } of agents) {
    const context = results.map(r => `${r.agentId}: ${r.output}`).join('\n')
    const result = await fn(current, context)
    results.push(result)
    if (!result.success) break  // fail fast
    current = result.output
  }

  return results
}

// Parallel fan-out with synthesis
async function parallelFanOut(
  workers: Array<{ id: string; fn: AgentFn }>,
  synthesizer: AgentFn,
  input: string,
): Promise<AgentResult> {
  const workerResults = await Promise.allSettled(
    workers.map(({ id, fn }) => fn(input, ''))
  )

  const outputs = workerResults
    .filter((r): r is PromiseFulfilledResult<AgentResult> => r.status === 'fulfilled')
    .map(r => r.value)

  const synthesisInput = outputs.map(r => `[${r.agentId}]: ${r.output}`).join('\n\n')
  return synthesizer(synthesisInput, input)
}

// Hierarchical: orchestrator delegates to specialists
async function hierarchical(
  orchestrator: AgentFn,
  specialists: Record<string, AgentFn>,
  goal: string,
): Promise<string> {
  // Orchestrator plans which specialists to invoke
  const plan = await orchestrator(goal, JSON.stringify(Object.keys(specialists)))
  const lines = plan.output.split('\n').filter(l => l.startsWith('DELEGATE:'))

  const delegations = await Promise.all(
    lines.map(line => {
      const [, agentId, task] = line.match(/DELEGATE:(\w+):(.+)/) ?? []
      const specialist = specialists[agentId]
      return specialist ? specialist(task, goal) : Promise.resolve({ agentId, output: 'agent not found', success: false })
    })
  )

  return orchestrator(
    `Synthesize these specialist outputs into a final answer for: ${goal}`,
    delegations.map(d => `${d.agentId}: ${d.output}`).join('\n'),
  ).then(r => r.output)
}
```

## Planning with task decomposition

```typescript
interface Task {
  id: string
  description: string
  dependsOn: string[]
  status: 'pending' | 'running' | 'done' | 'failed'
  result?: string
}

async function planAndExecute(
  goal: string,
  planner: (goal: string) => Promise<Task[]>,
  executor: (task: Task, context: Record<string, string>) => Promise<string>,
): Promise<Record<string, string>> {
  const tasks = await planner(goal)
  const results: Record<string, string> = {}

  // Topological execution respecting dependencies
  while (tasks.some(t => t.status === 'pending')) {
    const ready = tasks.filter(
      t => t.status === 'pending' && t.dependsOn.every(dep => results[dep] !== undefined)
    )

    if (ready.length === 0) {
      const stuck = tasks.filter(t => t.status === 'pending')
      throw new Error(`Deadlock: tasks ${stuck.map(t => t.id).join(', ')} cannot proceed`)
    }

    // Run independent ready tasks in parallel
    await Promise.all(
      ready.map(async task => {
        task.status = 'running'
        try {
          results[task.id] = await executor(task, results)
          task.status = 'done'
        } catch (err) {
          task.status = 'failed'
          results[task.id] = `Error: ${String(err)}`
        }
      })
    )
  }

  return results
}
```
