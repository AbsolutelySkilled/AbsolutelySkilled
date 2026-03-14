<!-- Part of the Mastra AbsolutelySkilled skill. Load this file when
     working with advanced workflow patterns: branching, loops, parallel
     execution, foreach, suspend/resume, state, and nested workflows. -->

# Workflows - Advanced Patterns

## Control flow methods

All control flow methods are chained on the workflow builder before `.commit()`.

### Sequential

```typescript
workflow.then(step1).then(step2).then(step3).commit()
```

### Parallel

Runs steps concurrently. Waits for all to complete. Output is keyed by step ID.

```typescript
workflow
  .then(fetchData)
  .parallel([analyzeText, analyzeImages, analyzeMeta])
  .then(combineResults)
  .commit()
```

> If any step in a parallel block throws, the entire block fails. Use try/catch
> inside step `execute` functions and return typed success/failure indicators.

### Branch

Only the first matching branch executes. All branches must share the same
input and output schema.

```typescript
workflow
  .then(classify)
  .branch([
    [({ inputData }) => inputData.type === 'email', handleEmail],
    [({ inputData }) => inputData.type === 'sms', handleSms],
    [() => true, handleDefault],  // fallback
  ])
  .then(notify)
  .commit()
```

### Do-until loop

Repeats a step until the condition returns true.

```typescript
workflow
  .dountil(pollStatus, ({ inputData }) => inputData.status === 'complete')
  .then(processResult)
  .commit()
```

> Use `iterationCount` limit to prevent infinite loops in production.

### Do-while loop

Repeats while condition is true.

```typescript
workflow
  .dowhile(refineOutput, ({ inputData }) => inputData.score < 0.9)
  .commit()
```

### Foreach

Iterates over an array, running a step per element. Default concurrency is 1.

```typescript
workflow
  .then(getItems)
  .foreach(processItem, { concurrency: 5 })
  .then(aggregateResults)
  .commit()
```

> Chained `.foreach().foreach()` creates nested arrays. Use `.map()` with
> `.flat()` or nested workflows to flatten.

### Map (data transformation)

Transform data between steps when schemas don't align.

```typescript
workflow
  .then(fetchUser)
  .map(({ inputData }) => ({ name: inputData.firstName + ' ' + inputData.lastName }))
  .then(greetUser)
  .commit()
```

---

## State management

Shared state persists across all steps and survives suspend/resume cycles.

```typescript
const step = createStep({
  id: 'counter',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ value: z.number() }),
  stateSchema: z.object({ count: z.number() }),
  execute: async ({ inputData, state, setState }) => {
    const newCount = (state.count || 0) + 1
    setState({ ...state, count: newCount })
    return { value: inputData.value * newCount }
  },
})
```

State is defined per-step via `stateSchema` but shared across all steps in the
workflow. Each step sees the same state object.

---

## Suspend and resume

Workflows can suspend mid-execution (e.g. waiting for human approval) and
resume later with new input.

```typescript
const approvalStep = createStep({
  id: 'wait-for-approval',
  inputSchema: z.object({ proposal: z.string() }),
  outputSchema: z.object({ approved: z.boolean() }),
  execute: async ({ inputData, suspend }) => {
    // Suspend and wait for external input
    const resumeData = await suspend({ proposal: inputData.proposal })
    return { approved: resumeData.approved }
  },
})

// Start workflow - will suspend at approval step
const run = workflow.createRun()
const result = await run.start({ inputData: { proposal: 'Buy 100 widgets' } })

if (result.status === 'suspended') {
  // Later, resume with approval decision
  const resumed = await run.resume({
    step: 'wait-for-approval',
    data: { approved: true },
  })
}
```

---

## RequestContext in steps

Access per-request context (e.g. user tier, auth tokens) inside steps.

```typescript
const step = createStep({
  id: 'tiered-step',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ results: z.array(z.string()) }),
  execute: async ({ inputData, requestContext }) => {
    const tier = requestContext.get('user-tier')
    const limit = tier === 'enterprise' ? 1000 : 50
    return { results: await search(inputData.query, limit) }
  },
})
```

---

## Nested and cloned workflows

### Nested workflows

Use a workflow as a step inside another workflow.

```typescript
const parentWorkflow = createWorkflow({ id: 'parent', ... })
  .then(step1)
  .then(childWorkflow)  // child runs as a step
  .then(step2)
  .commit()
```

### Cloning

Create a copy of a workflow with a new ID.

```typescript
import { cloneWorkflow } from '@mastra/core/workflow'
const clone = cloneWorkflow(parentWorkflow, { id: 'cloned-parent' })
```

---

## Active run management

```typescript
// List all active (in-progress or suspended) runs
const activeRuns = await workflow.listActiveWorkflowRuns()

// Restart a single run from its last active step
await run.restart()

// Restart all active runs
await workflow.restartAllActiveWorkflowRuns()
```

---

## Result status discrimination

Always check `status` before accessing result properties.

```typescript
const result = await run.start({ inputData })

switch (result.status) {
  case 'success':
    console.log(result.result)      // typed output
    break
  case 'failed':
    console.error(result.error)     // Error object
    break
  case 'suspended':
    console.log(result.suspendPayload, result.suspended)
    break
  case 'tripwire':
    console.log(result.tripwire)    // limit exceeded info
    break
  case 'paused':
    // common properties only
    break
}
```

---

## Streaming workflow execution

```typescript
const run = workflow.createRun()
const stream = run.stream({ inputData: { text: 'Hello' } })

for await (const chunk of stream.fullStream) {
  console.log(chunk)  // step-level progress events
}

const finalResult = await stream.result
```

---

## Step-level scorers

Attach evals to individual workflow steps.

```typescript
const step = createStep({
  id: 'scored-step',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ answer: z.string() }),
  execute: async ({ inputData }) => ({ answer: 'result' }),
  scorers: {
    relevancy: {
      scorer: createAnswerRelevancyScorer({ model: 'openai/gpt-4.1-nano' }),
      sampling: { type: 'ratio', rate: 1 },
    },
  },
})
```

Scorer execution is asynchronous and does not block step output.
