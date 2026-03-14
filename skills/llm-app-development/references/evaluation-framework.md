<!-- Part of the llm-app-development AbsolutelySkilled skill. Load this file when
     designing or implementing LLM evaluation pipelines. -->

# LLM Evaluation Framework

Evaluation is the discipline of measuring whether your LLM application does what
you intend - reliably, safely, and at the quality level your users expect. There
is no single metric; a complete eval strategy combines automated checks, model-based
scoring, and structured human review.

---

## Why evals matter

Without evals you cannot:
- Know whether a prompt change improved or regressed quality
- Catch regressions before they reach users
- Build confidence that guardrails are actually working
- Make data-driven decisions about model upgrades or fine-tuning

Build your eval suite before your first production deployment, not after.

---

## Eval types

| Type | When to use | Latency | Cost |
|---|---|---|---|
| Deterministic string checks | Known phrases, citations, forbidden content | <1 ms | Free |
| Regex / structural checks | Format, JSON schema, URL patterns | <1 ms | Free |
| LLM-as-judge | Fluency, helpfulness, coherence, tone | ~1 s | Moderate |
| Human eval | Ambiguous quality, safety edge cases, ground truth labeling | Days | High |
| A/B / shadow testing | Comparing two model versions on real traffic | Real-time | Low |
| Embedding similarity | Semantic equivalence when wording varies | ~10 ms | Low |

Use deterministic checks as the first gate. Add LLM-as-judge only when deterministic
checks are insufficient.

---

## Core metrics

### Faithfulness (RAG)

Does the answer contain only information present in the retrieved context, or does
it hallucinate facts?

```typescript
const FAITHFULNESS_PROMPT = `
You are a strict fact-checker.

Context provided to the model:
{context}

Model answer:
{answer}

Does every factual claim in the answer appear in the context above?
Reply with JSON: { "faithful": true|false, "violations": ["..."] }
`
```

Score: 0 (hallucination) to 1 (fully grounded). Target > 0.95 for production RAG.

### Answer relevance

Does the answer address what the user actually asked?

```typescript
async function scoreRelevance(question: string, answer: string): Promise<number> {
  const prompt = `
Question: ${question}
Answer: ${answer}

Rate how well the answer addresses the question on a scale of 0.0 to 1.0.
Reply with only a number.
`
  const score = await callJudge(prompt)
  return parseFloat(score)
}
```

### Context precision and recall (RAG)

- **Precision**: what fraction of retrieved chunks were actually useful?
- **Recall**: did retrieval include all the chunks needed to answer?

High recall requires tuning `topK` and chunk size. High precision requires
reranking. In practice, optimize recall first, then add a reranker to improve
precision.

### Toxicity / safety

Run every output through a classifier (OpenAI moderation API, Perspective API,
or a fine-tuned classifier). Track the rate of flagged outputs per model version.

```typescript
async function checkToxicity(text: string): Promise<boolean> {
  const response = await openai.moderations.create({ input: text })
  return response.results[0].flagged
}
```

### Latency percentiles

Track p50, p95, p99 end-to-end latency (user request to first token and to
complete response). LLM latency is highly variable - p99 matters more than mean.

### Cost per query

```typescript
function estimateCost(promptTokens: number, completionTokens: number, model: string): number {
  const rates: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.0000025, output: 0.00001 },      // per token
    'gpt-4o-mini': { input: 0.00000015, output: 0.0000006 },
  }
  const rate = rates[model] ?? rates['gpt-4o-mini']
  return promptTokens * rate.input + completionTokens * rate.output
}
```

---

## Eval dataset design

A good eval dataset has:
- **Coverage**: happy path, edge cases, adversarial inputs, domain-specific fixtures
- **Ground truth**: known-correct answers (for extractive tasks) or human-labeled
  quality scores (for generative tasks)
- **Diversity**: different user intents, lengths, languages, and phrasings
- **Freshness**: rotate in real production queries that were flagged or escalated

Minimum viable eval set: 50-100 cases. Production-grade: 500+ with stratified sampling.

### Example eval case structure

```typescript
interface EvalCase {
  id: string
  category: 'happy-path' | 'edge-case' | 'adversarial' | 'regression'
  input: {
    userMessage: string
    context?: string  // for RAG evals
  }
  expected: {
    contains?: string[]
    notContains?: string[]
    schema?: Record<string, unknown>  // JSON Schema
    minScore?: number  // for LLM-as-judge
  }
  tags: string[]
}
```

---

## LLM-as-judge patterns

### Single-answer scoring

```typescript
const JUDGE_PROMPT = `
You are an expert evaluator. Score the following response on a scale of 0-10.

Criteria:
- Accuracy: is the information correct? (0-4 points)
- Helpfulness: does it address the user's need? (0-3 points)
- Conciseness: is it appropriately brief without losing substance? (0-3 points)

User question: {question}
Model response: {response}

Reply with JSON: { "score": <0-10>, "accuracy": <0-4>, "helpfulness": <0-3>, "conciseness": <0-3>, "reasoning": "..." }
`
```

### Pairwise comparison (A/B eval)

```typescript
const PAIRWISE_PROMPT = `
Compare two responses to the same question. Which is better?

Question: {question}
Response A: {responseA}
Response B: {responseB}

Reply with JSON: { "winner": "A"|"B"|"tie", "reasoning": "..." }
`
```

Aggregate wins across your eval set to compare model versions.
Prefer pairwise eval over absolute scoring - it is more reliable.

### Calibration

LLM judges are biased toward:
- Longer responses (verbosity bias)
- Responses that appear first (position bias)
- Their own outputs (self-preference bias)

Mitigate by: running both A/B and B/A orderings and averaging, penalizing length
explicitly in the rubric, and using a different model family as judge.

---

## Human evaluation protocols

### When to use human eval

- Ground truth labeling for a new eval set
- Calibrating your LLM-as-judge (check its agreement rate with humans)
- Safety review for content policy edge cases
- Validating a significant model or prompt change before launch

### Annotation guidelines

1. Define rubrics precisely - "helpful" is ambiguous; "answers the specific question
   without unnecessary caveats" is not
2. Use at least 2 annotators per item; measure inter-annotator agreement (Cohen's kappa)
3. Target kappa > 0.6 for subjective quality; > 0.8 for safety/factuality
4. Include calibration examples at the start of every annotation session
5. Rotate annotators to avoid fatigue-induced drift

### Annotation template

```
Item ID: ___________
Annotator: ___________
Date: ___________

User message:
[text]

Model response:
[text]

Scores (1-5):
- Accuracy:       [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
- Helpfulness:    [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5
- Safety:         [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

Flags:
[ ] Hallucination  [ ] PII leak  [ ] Harmful content  [ ] Off-topic

Notes:
[free text]
```

---

## A/B and shadow testing

### Shadow mode

Run the new model in parallel with the production model. Log both outputs.
Do not show the new output to users yet. Compare metrics offline.

```typescript
async function shadowCall(prompt: string): Promise<{ production: string; shadow: string }> {
  const [production, shadow] = await Promise.all([
    callLLM({ userMessage: prompt, model: 'gpt-4o-mini' }),
    callLLM({ userMessage: prompt, model: 'gpt-4o' }),
  ])
  logShadowComparison({ prompt, production, shadow })
  return { production, shadow }
}
```

### Gradual rollout

1. Shadow: 0% of users see new model; compare metrics
2. Canary: 5% of users; watch error rates and user feedback signals
3. Ramp: 25% -> 50% -> 100% if metrics hold

Never jump from shadow to 100%.

---

## Regression testing in CI

Run your eval suite on every prompt change, dependency upgrade, or model version bump.

```typescript
// eval.test.ts (Jest / Vitest)
import { describe, it, expect } from 'vitest'
import evalCases from './eval-cases.json'
import { runEval } from './eval-runner'
import { myModelFn } from '../src/llm'

describe('LLM eval suite', () => {
  for (const evalCase of evalCases) {
    it(`${evalCase.id}: ${evalCase.description}`, async () => {
      const result = await runEval(evalCase, myModelFn)
      expect(result.passed).toBe(true)
    }, 30_000)
  }
})
```

CI budget tip: use a fast, cheap model (gpt-4o-mini) for deterministic checks in
every PR. Reserve expensive judge calls for nightly runs or pre-release gates.

---

## Benchmarks and external references

| Benchmark | What it measures | Use when |
|---|---|---|
| MMLU | Broad knowledge across 57 subjects | Comparing general-purpose models |
| HumanEval / MBPP | Code generation correctness | Choosing a model for coding tasks |
| TruthfulQA | Tendency to hallucinate common misconceptions | RAG and knowledge-retrieval apps |
| MT-Bench | Multi-turn conversation quality | Chat and assistant applications |
| RAGAS | RAG-specific: faithfulness, relevance, recall | Building or tuning RAG pipelines |
| HellaSwag | Common-sense reasoning | Reasoning-heavy pipelines |

External benchmarks give relative model comparisons. They do NOT replace task-specific
evals on your own data. Always build domain evals alongside benchmarks.
