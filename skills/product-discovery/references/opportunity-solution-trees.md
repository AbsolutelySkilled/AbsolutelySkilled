<!-- Part of the product-discovery AbsolutelySkilled skill. Load this file when
     building, updating, or reviewing an opportunity solution tree. -->

# Opportunity Solution Trees

The opportunity solution tree (OST) is a visual decision-making tool created by Teresa
Torres as part of the continuous discovery framework. It connects a desired product outcome
to customer-discovered opportunities, candidate solutions, and assumption tests. The tree
makes the team's thinking visible and ensures that every feature can be traced back to
real customer evidence.

---

## Tree structure

```
[Desired Outcome]
     |
     +-- [Opportunity 1]
     |     +-- [Solution 1a]
     |     |     +-- [Assumption test 1]
     |     |     +-- [Assumption test 2]
     |     +-- [Solution 1b]
     |           +-- [Assumption test 3]
     |
     +-- [Opportunity 2]
     |     +-- [Solution 2a]
     |     +-- [Solution 2b]
     |     +-- [Solution 2c]
     |
     +-- [Opportunity 3]
           +-- [Solution 3a]
                 +-- [Assumption test 4]
```

Each level of the tree has specific rules:

---

## Level 1: Desired outcome

The root of the tree is a single, measurable product outcome that the team has been
assigned to improve.

**Rules for good outcomes:**
- Must be a metric the product team can directly influence (not revenue or NPS alone)
- Must be measurable with existing or achievable instrumentation
- Should be a leading indicator, not a lagging one
- Must have a current baseline and a target

**Good outcomes:**
- "Increase 7-day activation rate from 30% to 50%"
- "Reduce time-to-first-value from 12 minutes to under 3 minutes"
- "Increase weekly active usage from 2.1 to 3.5 sessions per user"

**Bad outcomes:**
- "Increase revenue" (too broad, team cannot directly influence)
- "Make users happy" (not measurable)
- "Ship the new dashboard" (this is an output, not an outcome)

---

## Level 2: Opportunities

Opportunities are unmet customer needs, pain points, or desires discovered through
research. They represent the problem space - the "why" behind the metric.

### Where opportunities come from

| Source | How to extract opportunities |
|---|---|
| Customer interviews | Identify struggling moments, workarounds, and unmet needs |
| Support tickets | Cluster recurring complaints into themes |
| Behavioral analytics | Find drop-off points, rage clicks, abandoned flows |
| Sales call recordings | Note objections and feature requests; reframe as underlying needs |
| Usability tests | Identify tasks users cannot complete or complete with difficulty |
| NPS/CSAT verbatims | Theme open-text responses by underlying need |

### Writing opportunity statements

Use customer language, not internal jargon. An opportunity describes a need, not a solution.

| Quality | Example |
|---|---|
| Bad (solution) | "We need an AI categorizer" |
| Bad (vague) | "Users have trouble with categories" |
| Good (need) | "Users spend too much time manually categorizing transactions" |
| Good (need) | "Users miss important recurring charges because they get buried in the feed" |

### Structuring the opportunity space

Opportunities can be nested. A parent opportunity represents a broad theme; child
opportunities represent specific aspects of that theme.

```
Users struggle to understand where their money goes each month
  |
  +-- Manual transaction categorization takes too long
  +-- Recurring charges are hard to identify and track
  +-- Spending in one category bleeds into another without warning
```

**Rules:**
- Each parent should have 2-5 children (more means it needs further decomposition)
- Children should be mutually exclusive and collectively exhaustive (MECE) where possible
- Leaf opportunities should be specific enough to generate solution ideas
- Every opportunity must be traceable to at least one piece of customer evidence

---

## Level 3: Solutions

Solutions are ideas for addressing a specific opportunity. They represent the "how."

### Solution ideation rules

1. **Generate at least 3 solutions per opportunity** - This prevents premature commitment
   and single-option bias. Bad ideas in the mix actually improve decision quality by
   creating contrast.
2. **Keep solutions lightweight** - A sentence or two is enough. No PRDs, no wireframes,
   no technical specs at this stage.
3. **Vary the solution types** - Include at least one "boring" solution (simple, proven
   pattern), one "creative" solution (novel approach), and one "remove" solution (what if
   we eliminated the problem instead of solving it?).
4. **Score solutions against the target outcome** - Ask: "If this solution works perfectly,
   how much would it move the outcome metric?" Discard solutions with low potential impact.

### Solution comparison template

```
OPPORTUNITY: [statement]
TARGET OUTCOME: [metric]

| Criteria          | Solution A        | Solution B        | Solution C        |
|-------------------|-------------------|-------------------|-------------------|
| Impact on outcome | High / Med / Low  | High / Med / Low  | High / Med / Low  |
| Reach             | All / Segment     | All / Segment     | All / Segment     |
| Confidence        | High / Med / Low  | High / Med / Low  | High / Med / Low  |
| Effort            | S / M / L / XL    | S / M / L / XL    | S / M / L / XL    |
| Riskiest assumption| [what]           | [what]            | [what]            |
```

---

## Level 4: Assumption tests (experiments)

Each solution carries assumptions. The tree branches into experiments that test the
riskiest assumptions with the cheapest possible method.

### From solution to experiment

1. List all assumptions for the chosen solution (use the four categories: desirability,
   viability, feasibility, usability)
2. Identify the one assumption that, if wrong, would make the entire solution worthless
3. Design the cheapest experiment that produces a clear yes/no signal on that assumption
4. Define success criteria and kill criteria before running the experiment
5. Run the experiment, update the tree with the result, and decide: pursue, pivot, or stop

See `references/assumption-testing.md` for the full experiment catalog.

---

## Maintaining the tree over time

### Weekly update cadence

The product trio should update the OST weekly during their continuous discovery ritual:

1. **Add new opportunities** from this week's customer touchpoints
2. **Retire invalidated solutions** based on experiment results
3. **Promote validated solutions** to the delivery backlog
4. **Rebalance the tree** - if one branch is getting all the attention, check whether
   other high-priority opportunities are being neglected

### Tree health checks

Run these checks monthly:

| Check | Healthy sign | Unhealthy sign |
|---|---|---|
| Evidence freshness | All opportunities cite evidence from last 90 days | Opportunities based on assumptions or ancient data |
| Solution diversity | 3+ solutions per active opportunity | Single solution committed without comparison |
| Experiment velocity | 1-2 experiments completed per week | No experiments run in the last month |
| Outcome connection | Every opportunity clearly ties to the outcome metric | Orphan opportunities with no clear metric link |
| Balanced exploration | Multiple branches being explored | All effort concentrated on one branch |

### Archiving, not deleting

When an experiment invalidates a solution:
- Move the solution branch to an "archived" section of the tree
- Add a note: what was tested, what the result was, and what was learned
- The learning prevents future teams from re-testing the same failed assumption

### Common OST anti-patterns

| Anti-pattern | Symptom | Fix |
|---|---|---|
| **Solution-first tree** | Solutions appear without parent opportunities | Interview customers; opportunities must come from evidence |
| **Single-branch tree** | Only one opportunity with one solution | Brainstorm harder; you are not exploring the space |
| **Stale tree** | No updates in 3+ weeks | Re-establish weekly cadence; the tree reflects active discovery |
| **Output-as-outcome** | Root node is "Ship feature X" | Replace with a measurable behavior change metric |
| **Kitchen-sink tree** | 20+ opportunities, none deeply explored | Prioritize 2-3 opportunities; depth beats breadth |
