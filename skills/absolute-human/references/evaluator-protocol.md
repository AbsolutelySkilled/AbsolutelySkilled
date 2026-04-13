# Evaluator Protocol

Generator-evaluator separation for Absolute-Human verification. Based on the
principle that self-evaluation has systematic bias: generators over-praise their
own work. A standalone evaluator tuned to be skeptical is more tractable than
making a generator critical of its own work.

---

## Core Principle: Separation of Concerns

The agent that **built** a task must NOT be the same agent instance that **verifies**
it. Verification is dispatched as a separate subagent with an independent context,
a skeptical prompt, and a structured grading rubric.

**Why this matters:**
- Generators develop attachment to their implementation choices
- Self-evaluation consistently rates work higher than independent evaluation
- Generators dismiss legitimate issues they notice ("this is probably fine")
- A fresh context sees the work as a user or reviewer would

---

## Complexity-Based Evaluator Gating

Not every task needs the full evaluator. Match evaluation depth to task risk:

| Complexity | Evaluator | Rationale |
|------------|-----------|-----------|
| **S** (< 50 lines) | Signals only (tests, lint, build) | Binary signals catch most issues in small changes |
| **M** (50-200 lines) | Full evaluator protocol | Subjective quality matters at this scale |
| **Any failed task** | Mandatory full evaluator | Failure indicates the task is at the capability edge |
| **Any task touching shared interfaces** | Mandatory full evaluator | Integration risk demands independent verification |

When signals-only is sufficient, skip straight to the verification report. When
the full evaluator is needed, proceed through the sections below.

---

## Scored Grading Rubric

Replace binary pass/fail with multi-dimensional scored evaluation. Each dimension
is scored 1-5 independently.

### Rubric for `code` Tasks (Default)

| Dimension | Weight | 1 (Fail) | 3 (Acceptable) | 5 (Excellent) |
|-----------|--------|----------|-----------------|----------------|
| **Correctness** | 30% | Tests fail or acceptance criteria unmet | Tests pass, basic criteria met | All criteria met including edge cases, no regressions |
| **Code Quality** | 20% | Ignores project conventions, unclear logic | Follows conventions, readable | Clean, idiomatic, extends existing patterns naturally |
| **Completeness** | 20% | Partial implementation, TODO comments left | All stated criteria addressed | Handles implicit requirements the spec missed |
| **Test Coverage** | 15% | No new tests or trivial assertions only | Happy path tested | Edge cases, error paths, and boundary conditions tested |
| **Integration Safety** | 15% | Broken imports or type errors | Builds and passes existing tests | No warnings, clean integration with adjacent code |

### Rubric Adaptations by Task Type

**`test` tasks** - Swap Code Quality (20%) with Assertion Quality (20%): tests
meaningful assertions, not just "it doesn't throw". Increase Test Coverage weight
to 25%, reduce Completeness to 15%.

**`docs` tasks** - Replace Code Quality with Clarity/Accuracy (20%): technically
correct, unambiguous, a developer can follow it. Replace Test Coverage with
Coverage/Completeness (15%): all public APIs documented, examples included.

**`config`/`infra` tasks** - Increase Integration Safety to 25%, reduce Test
Coverage to 10%. Add Idempotency check: running the config change twice produces
the same result.

### Score Thresholds

| Weighted Score | Verdict | Action |
|----------------|---------|--------|
| **4.0 - 5.0** | PASS | Proceed to next task |
| **3.0 - 3.9** | NEEDS WORK | Generator receives evaluator feedback, retries |
| **Below 3.0** | FAIL | Escalate to user for guidance |

---

## Evaluator Agent Prompt Template

When dispatching the evaluator subagent, provide this structured context:

```
## Evaluator Task: {SH-XXX} - {Title}

You are an independent evaluator. Your job is to grade this work skeptically
and honestly. Do not assume good intent. Do not give benefit of the doubt.
Look for gaps, shortcuts, incomplete work, and hidden bugs.

### Acceptance Criteria (from Sprint Contract)
{criteria list from the board - what "done" means}

### Verification Method (from Sprint Contract)
{how each criterion should be tested}

### Files Modified
{list of files the generator changed}

### Git Diff
{the actual diff of all changes}

### Test Output
{test run results - pass/fail counts, any failures}

### Lint/Type/Build Output
{output from lint, type check, and build commands}

### Project Conventions
{detected conventions from the board}

### Grading Instructions

Score each dimension 1-5 using the rubric below:
{insert rubric table for this task type}

Output format (STRICT - do not deviate):

#### Evaluation: SH-{XXX}
- **Correctness**: {score}/5 - {one-line justification}
- **Code Quality**: {score}/5 - {one-line justification}
- **Completeness**: {score}/5 - {one-line justification}
- **Test Coverage**: {score}/5 - {one-line justification}
- **Integration Safety**: {score}/5 - {one-line justification}
- **Weighted Score**: {calculated}/5.0
- **Verdict**: PASS | NEEDS WORK | FAIL

#### Specific Feedback (required if score < 4.0)
For each dimension scoring below 4:
- What specifically is wrong
- What the fix should look like
- Which files need changes

#### Bugs Found
- {list any bugs discovered, with file:line references}

#### What Was Done Well
- {1-2 things the generator did right - maintains signal quality}
```

---

## Iterative Refinement Loop

Replaces the previous "max 2 retries" binary retry. The evaluator and generator
iterate until the work meets the quality bar or the iteration budget is exhausted.

```
for iteration in 1..5:
  1. Evaluator grades the work against the rubric
  2. If weighted score >= 4.0: PASS, exit loop
  3. If iteration >= 3 AND score is stagnant or declining:
     FAIL, escalate to user with full evaluation history
  4. If score is trending upward (improving each iteration):
     Generator receives evaluator's specific feedback
     Generator makes targeted fixes (not a rewrite)
     Loop continues
  5. If score < 3.0 on any iteration: FAIL immediately, escalate
```

**Iteration budget:** 5 maximum. The article shows 5-15 iterations for design
tasks, but code tasks involve actual file changes and test runs per iteration,
so 5 is the practical cap.

**Score trend tracking:** Record scores per iteration on the board. If the
weighted score drops between iterations, the generator is thrashing. Stop and
escalate.

**What the generator receives on retry:**
- The evaluator's per-dimension scores and justifications
- The specific feedback section (what's wrong, what the fix should look like)
- The bugs found list
- Instruction: "Fix ONLY what the evaluator flagged. Do not rewrite unrelated code."

---

## Sprint Contracts

Before executing each wave, the evaluator reviews the planned acceptance criteria
for all tasks in that wave. This prevents generators from setting easy goals.

### Contract Negotiation

1. The PLAN phase defines acceptance criteria per task (as today)
2. Before wave execution begins, dispatch an evaluator subagent to review criteria:

```
## Sprint Contract Review: Wave {N}

Review the acceptance criteria for these tasks. For each task:
1. Are the criteria specific enough to verify? ("works correctly" is too vague)
2. Are there missing criteria the generator could exploit to deliver incomplete work?
3. Is each criterion testable with concrete verification steps?

### Tasks to Review
{for each task in the wave: ID, title, current acceptance criteria}

### Output Format (per task)
- **SH-{XXX}**: {title}
  - Criteria kept as-is: {list}
  - Criteria strengthened: {original} -> {revised}
  - Criteria added: {new criterion} - Reason: {why it was missing}
  - Verification steps: {how each criterion will be tested}
  - Contract status: agreed | disputed
```

3. If any criteria are `disputed`, flag for user arbitration
4. Write the agreed contract to the board under each task

### Contract Format on the Board

```markdown
#### Sprint Contract
- **Agreed criteria**: {numbered list}
- **Verification method**: {per criterion - how it will be tested}
- **Evaluator additions**: {criteria the evaluator added, with rationale}
- **Contract status**: agreed | disputed (awaiting user)
```

### Dispute Resolution

The evaluator should NOT expand scope - only sharpen criteria within the existing
scope. If the evaluator wants to add criteria that go beyond the task's stated
description, that is a scope expansion and must be flagged for the user.

Signs of legitimate strengthening vs. scope creep:
- **Legitimate**: "handle errors" -> "return 400 with {code, message} for invalid input"
- **Scope creep**: adding "also implement rate limiting" to an auth task

---

## Platform Fallback

On platforms without subagent support (no Agent tool), the evaluator cannot be
a separate agent instance. Use a structured context switch instead:

```
--- EVALUATOR MODE ---
I am now switching to evaluator mode. I must evaluate the work I just completed
as if I am a different, skeptical reviewer seeing it for the first time.

Rules in evaluator mode:
- Do NOT reference my implementation reasoning or intent
- Judge ONLY what is visible in the code and test output
- Be skeptical of every claim of completeness
- Score strictly against the rubric
- If I catch myself making excuses for the code, that's a signal to score lower
--- END EVALUATOR MODE HEADER ---
```

This is weaker than true separation (the same context still carries implementation
bias) but is strictly better than no evaluation gate. On platforms with subagent
support, always prefer true separation.

---

## Evaluator Tuning Notes

From real-world experience with evaluator agents:

1. **Out-of-box evaluators are too lenient.** Without the explicit rubric and
   "be skeptical" instruction, evaluators identify issues then talk themselves
   into dismissing them. The structured output format (scores + justification)
   forces commitment to a number.

2. **Evaluators test superficially without guidance.** Tell them exactly what to
   check: "click through the UI", "call the API with invalid input", "check the
   database state after the operation". Generic "verify it works" produces generic
   verification.

3. **Even well-tuned evaluators miss deeply nested bugs.** The evaluator catches
   the 80% - obvious gaps, broken contracts, missing edge cases. Subtle interaction
   bugs in deeply nested features still get through. The evaluator improves the
   floor, not the ceiling.

4. **Language shapes output.** How you phrase criteria affects what the generator
   produces. "The code should be clean" produces different results than "the code
   should follow the existing patterns in src/utils/". Be specific.

5. **Evaluator value is task-relative.** For tasks well within model capability
   (simple CRUD, config changes), the evaluator is overhead. For tasks at the
   capability edge (complex state machines, concurrent logic), the evaluator
   provides real lift. The complexity gating table above encodes this.
