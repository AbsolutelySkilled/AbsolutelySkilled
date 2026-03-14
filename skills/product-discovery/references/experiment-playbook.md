<!-- Part of the product-discovery AbsolutelySkilled skill. Load this file when
     designing discovery experiments or selecting the right validation method
     for a given assumption type. -->

# Experiment Playbook

Every product experiment should be matched to the type of assumption being tested.
Using a high-fidelity experiment for a low-certainty desirability assumption wastes
weeks. Using a quick interview for a feasibility question produces noise. This
playbook maps assumption categories to the right experiment type with templates,
sample sizes, and success criteria.

---

## Universal Experiment Brief Template

Fill this out before running any experiment. Define the kill threshold before
collecting data - post-hoc rationalization is the enemy of real learning.

```
EXPERIMENT BRIEF
================
Assumption:
  [One specific, falsifiable belief you are testing]

Assumption type:
  [ ] Desirability  [ ] Viability  [ ] Feasibility  [ ] Usability

Experiment type:
  [Customer interview / smoke test / survey / prototype test /
   technical spike / wizard of oz / concierge / A/B test]

Setup:
  [What to build or prepare - keep it minimal]

Participants:
  Who:     [Customer segment]
  How many: [Minimum to reach signal]
  Recruited via: [Source]

Success metric:
  [One quantitative signal - task completion rate, click-through, etc.]

Success threshold:
  [e.g., >= 30% click-through, >= 4/5 task completions]

Kill threshold:
  [e.g., < 15% click-through, < 2/5 task completions]

Timeline:
  Start: [Date]  End: [Date]  Max duration: [1-2 weeks]

Decision rules:
  If success threshold is met:  [next step]
  If kill threshold is hit:     [pivot or stop]
  If results are ambiguous:     [follow-up action]
```

---

## Desirability Experiments

**Question answered:** Do customers want this? Will they change behavior to get it?

Desirability is usually the first assumption to test. If nobody wants it, viability
and feasibility are irrelevant.

---

### Customer Interview (Switch Interview)

Best for early-stage discovery when you have not yet narrowed to a solution.

**When to use:** Before building anything. You want to understand struggle and pull.

**Setup:**
- 45-60 min per session
- Recruit people who have recently done the behavior you're studying (within 90 days)
- Use the timeline reconstruction method (see SKILL.md)

**Sample size:** 5-8 participants per customer segment. Stop when you stop hearing
new themes (theoretical saturation).

**Signal:** Frequency and intensity of struggle mentions. Look for:
- Workarounds ("I end up having to...")
- Switch stories ("I switched from X because...")
- Emotional language ("It drives me crazy when...")

**Kill signal:** 0 of 5 participants express the struggle you hypothesized. Revisit
your opportunity framing before testing a solution.

**Template - Key questions:**

```
JTBD Interview Guide
====================
Opening (5 min):
  "Tell me a bit about your role and how you [domain area] day-to-day."

Timeline reconstruction (20 min):
  "Walk me through the last time you [target behavior].
   Start from the moment you first realized you needed to do it."

Dig into struggle (15 min):
  "What had you tried before that didn't work?"
  "What's the most frustrating part of the current process?"
  "Have you ever paid for something to help with this? What happened?"

Outcomes and anxieties (10 min):
  "What would your ideal world look like after this is solved?"
  "What would make you nervous about switching to something new?"

Wrap (5 min):
  "Is there anything about this topic I haven't asked that seems important?"
```

---

### Smoke Test / Fake Door

Best for testing whether users will take a concrete action toward a not-yet-built
feature.

**When to use:** After qualitative interviews reveal a pattern. You want to quantify
intent with actual behavior, not reported preference.

**Setup:**
1. Add a UI element (button, menu item, landing page) for the non-existent feature
2. When a user clicks/signs up, show a "coming soon" screen and optionally collect email
3. Track click-through rate and, if collecting emails, conversion to sign-up

**Sample size:** 200-500 unique visitors (or 2 weeks of live traffic, whichever comes first)

**Success metric:** Click-through rate on the fake door CTA

**Typical benchmarks:**

| CTR range | Signal |
|---|---|
| < 5% | Weak demand - revisit the opportunity |
| 5-15% | Moderate - investigate with follow-up interviews |
| 15-30% | Strong signal - proceed to solution design |
| > 30% | Very strong - prioritize immediately |

**Kill threshold:** Define before launch. Example: "If CTR < 8% after 300 visitors,
we pause this solution and explore alternative opportunities."

**Template - Fake door copy:**

```
Fake Door Copy Template
=======================
Headline:   [Specific outcome promise, not feature name]
            e.g., "Export reports directly to your accountant in one click"

Subhead:    [Concrete evidence of value]
            e.g., "Save 2 hours every month on manual data entry"

CTA:        [Action-oriented, specific]
            e.g., "Turn on auto-export" (not "Learn more")

Post-click: "This feature is coming soon. We're building it now.
             Leave your email to be first in line."
```

---

### Concept Test Survey

Best for quantifying a pattern already discovered qualitatively.

**When to use:** After 5+ interviews reveal a theme. You want to know "how many?"
before committing engineering.

**Setup:**
- 5-8 questions max
- Lead with the struggle, then present the solution concept (text or low-fi image)
- Measure: problem frequency, current solution satisfaction, willingness to switch

**Sample size:** 100-300 responses (email list, in-app prompt, or panel)

**Template - Core questions:**

```
Survey Template
===============
Q1 (Frequency): How often do you [target struggle]?
  [ ] Daily  [ ] Weekly  [ ] Monthly  [ ] Rarely  [ ] Never

Q2 (Pain intensity): How much of a problem is [struggle] for you?
  1 (Not a problem) ---- 5 (Major problem)

Q3 (Concept): [2-sentence description of solution concept]
  "Imagine if [product] could [value prop]. You would [specific action]."

Q4 (Desirability): How useful would this be for you?
  1 (Not useful) ---- 5 (Extremely useful)

Q5 (Open): What would you need to see to trust this feature?
  [Free text]
```

**Success threshold:** >= 40% rate the concept 4+ on usefulness AND struggle is 4+
intensity. Lower than this suggests the opportunity needs reframing.

---

## Viability Experiments

**Question answered:** Can we build a sustainable business around this? Will customers
pay, and at what price?

---

### Willingness-to-Pay Interview

Best for B2B or prosumer products where pricing is a key unknown.

**When to use:** Before pricing a new tier or feature. After desirability is
established.

**Setup:**
- 30-45 min interview
- Show a working prototype or detailed description
- Use the Van Westendorp Price Sensitivity Meter

**Sample size:** 15-25 participants (B2B); 30-50 (B2C)

**Van Westendorp questions:**

```
Van Westendorp Price Sensitivity
=================================
After showing the product/feature:

Q1 (Too cheap): "At what price would this be so cheap that
    you'd question the quality?"

Q2 (Cheap but acceptable): "At what price would this be a
    bargain - great value for money?"

Q3 (Getting expensive): "At what price would this start to
    feel expensive, but you'd still consider it?"

Q4 (Too expensive): "At what price would this be so expensive
    that you wouldn't consider buying it?"

Plot responses to find:
- Acceptable price range: intersection of "too cheap" and "too expensive" curves
- Optimal price point: intersection of "cheap but acceptable" and "getting expensive"
```

**Kill signal:** Optimal price point is below your required revenue per customer.
Revisit the value proposition or target segment before investing further.

---

### Fake Pricing Page

Best for SaaS products testing tier structure and price sensitivity at scale.

**Setup:**
1. Build a pricing page with real prices before the feature exists
2. Add a CTA that collects intent (e.g., "Start free trial" or "Upgrade now")
3. Intercept post-click with "coming soon" + waitlist signup
4. Track: which tier gets the most clicks, overall conversion rate

**Sample size:** 500+ unique visitors or 3 weeks of traffic

**Success metric:** Conversion rate to "upgrade intent" click

**Kill threshold:** < 2% conversion on target tier after 500 visitors means
the price or tier structure needs rework.

---

## Feasibility Experiments

**Question answered:** Can we actually build this? Do we have the data, APIs, compute,
or skills required?

---

### Technical Spike

Best for validating novel technical integrations or data assumptions.

**When to use:** When engineering believes there is meaningful uncertainty about
whether something can be built, or built within acceptable performance bounds.

**Setup:**
- Time-box to 2-5 days
- One engineer, one specific question to answer
- Produce a decision artifact (code snippet, benchmark result, or written finding)

**Template:**

```
Technical Spike Brief
=====================
Question to answer:
  [One specific technical question]
  e.g., "Can we classify transaction categories with > 90% accuracy
         using only the merchant name field from our existing data?"

Definition of done:
  [Concrete deliverable]
  e.g., "A notebook showing precision/recall on a sample of 1,000
         real transactions from our production database"

Time box: [2-5 days]

Success signal: [Threshold to proceed]
  e.g., "> 85% precision on unseen test set"

Kill signal: [Threshold to abandon this technical approach]
  e.g., "< 70% precision OR requires data we don't have access to"
```

---

### Data Audit

Best for assumption that existing behavioral data can power a feature.

**Setup:**
1. Define the exact data fields the solution requires
2. Query existing data sources to measure completeness, quality, and availability
3. Assess: coverage rate, recency, and accuracy on a sample

**Template:**

```
Data Audit Checklist
====================
Required data fields:
  [ ] Field 1: [name, source, expected format]
  [ ] Field 2: ...

For each field, measure:
  Coverage rate:  [% of records with this field populated]
  Recency:        [age of most recent record for typical user]
  Accuracy check: [% correct on manually verified sample of 50]

Pass criteria: All required fields >= 80% coverage and >= 85% accuracy
Fail criteria: Any required field < 60% coverage -> infeasible as designed
```

---

## Usability Experiments

**Question answered:** Can customers use this without friction? Can they complete
the target task independently?

---

### Think-Aloud Prototype Test

Best for testing navigation flows, information architecture, and task completion.

**When to use:** After a solution is designed but before engineering begins.

**Setup:**
1. Prepare tasks (not leading questions - "find the export option", not "click export")
2. Use Figma prototype, coded component, or paper sketch
3. Record session (with consent)

**Sample size:** 5 participants reveals ~85% of usability issues. Run 5, fix the
biggest issues, then run 5 more.

**Facilitation template:**

```
Think-Aloud Facilitation Guide
================================
Introduction (3 min):
  "We're testing the design, not you. There are no wrong answers.
   Please think out loud as you navigate - tell me what you're
   looking at, what you're thinking, and what you expect to happen."

Per task:
  Task prompt: [Action to complete without revealing how]
  Observe:     [Record hesitations, errors, and recovery attempts]
  Post-task:   "What did you expect to happen there?"
               "What would you do next if this were real?"

Debrief (5 min):
  "What was most confusing?"
  "What felt natural or familiar?"
  "Is there anything you expected to see that was missing?"
```

**Metrics to track:**

| Metric | How to measure | Target |
|---|---|---|
| Task completion rate | % of participants who complete without help | >= 80% |
| Time on task | Seconds from task start to completion | Benchmark vs. current state |
| Error rate | Number of wrong clicks before correction | <= 2 per task |
| Confusion moments | Count of pauses > 5 sec or backtracking | 0 per critical path |

**Kill threshold:** < 60% task completion rate OR 3+ participants cannot complete
the primary task = redesign before engineering.

---

### First-Click Test

Best for testing information architecture and labeling decisions quickly.

**Setup:**
- Show a static screenshot or wireframe
- Ask: "Where would you click to [accomplish task]?"
- Measure: where users click and how long it takes (< 5 sec = confident, > 15 sec = confused)

**Sample size:** 30-50 participants (can be done async via Maze, Optimal Workshop)

**Success threshold:** >= 70% correct first click on the target element.

**Kill threshold:** < 50% correct first click = rename the element or restructure navigation.

---

## Experiment Selection Guide

Use this table to quickly choose the right experiment for your context:

| Assumption type | Time available | Best experiment | Min sample |
|---|---|---|---|
| Desirability | 1-3 days | 5 customer interviews | 5 people |
| Desirability | 1-2 weeks | Smoke test / fake door | 200 visitors |
| Desirability | 1 week | Concept test survey | 100 responses |
| Viability | 2-3 days | Willingness-to-pay interview | 15 people |
| Viability | 2-3 weeks | Fake pricing page | 500 visitors |
| Feasibility | 2-5 days | Technical spike | 1 engineer |
| Feasibility | 1 day | Data audit | Existing data |
| Usability | 1-3 days | Think-aloud test (5 users) | 5 people |
| Usability | 1 week | First-click test (async) | 30 people |

**Decision rule:** Always start with the fastest, cheapest experiment that could
change your mind. Only escalate to a more expensive experiment if the cheaper one
produces an ambiguous result.
