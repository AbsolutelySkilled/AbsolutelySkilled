<!-- Part of the product-discovery AbsolutelySkilled skill. Load this file when
     designing discovery experiments or testing assumptions. -->

# Assumption Testing

This reference covers the full catalog of discovery experiment types, organized by
which assumption category they test. Use it to pick the fastest, cheapest experiment
for the riskiest assumption on your opportunity solution tree.

---

## The assumption matrix

Before choosing an experiment, classify assumptions on two dimensions:

```
                         HIGH IMPORTANCE
                    (if wrong, solution fails)
                              |
        Leap-of-faith    |   Known risk
        TEST THESE FIRST  |   Test these second
                              |
   LOW EVIDENCE ----------+---------- STRONG EVIDENCE
                              |
        Irrelevant        |   Table stakes
        Deprioritize      |   Monitor, don't test
                              |
                         LOW IMPORTANCE
                    (if wrong, solution still works)
```

Focus your experiment budget on the upper-left quadrant: high importance, low evidence.
These are leap-of-faith assumptions.

---

## Experiment catalog by assumption type

### Desirability experiments

Test whether customers actually want the solution.

| Experiment | How it works | Duration | Sample size | Signal strength |
|---|---|---|---|---|
| **Fake door test** | Add a button/link for the feature that leads to a "coming soon" page. Measure click rate. | 3-7 days | 500+ impressions | Medium - shows interest, not commitment |
| **Landing page test** | Create a landing page describing the value prop. Measure sign-up or waitlist conversion. | 5-14 days | 1000+ visitors | Medium-high - real behavior on perceived real offering |
| **Concierge test** | Manually deliver the solution to 5-10 users. Observe engagement and willingness to continue. | 1-2 weeks | 5-10 users | High - real usage, real feedback |
| **Wizard of Oz** | Users interact with what looks like a working product, but a human performs the backend work. | 1-2 weeks | 10-20 users | High - tests full experience without building |
| **Pre-order / LOI** | Ask customers to pre-order or sign a letter of intent. Money or commitment on the table. | 1-2 weeks | 10-50 prospects | Very high - willingness to pay is the strongest signal |
| **One-question survey** | Ask existing users: "How disappointed would you be if you could no longer use [feature]?" | 2-3 days | 100+ responses | Medium - Sean Ellis test for product-market fit |

### Viability experiments

Test whether the business model works.

| Experiment | How it works | Duration | Sample size | Signal strength |
|---|---|---|---|---|
| **Pricing page test** | Show different price points to different cohorts and measure conversion. | 1-2 weeks | 500+ per variant | High - real purchasing behavior |
| **Willingness-to-pay survey** | Van Westendorp price sensitivity meter: ask 4 pricing questions to find acceptable range. | 3-5 days | 50-100 respondents | Medium - stated preference, not revealed |
| **Unit economics model** | Build a spreadsheet: CAC, LTV, margin, payback period. Stress-test with pessimistic inputs. | 1 day | N/A (analytical) | Low-medium - depends on input quality |
| **Partner/vendor feasibility call** | Call potential partners or vendors to confirm terms, pricing, and integration requirements. | 1-3 days | 3-5 calls | Medium - verbal commitments are soft |

### Feasibility experiments

Test whether the team can build it.

| Experiment | How it works | Duration | Sample size | Signal strength |
|---|---|---|---|---|
| **Technical spike** | Engineer builds the riskiest technical component in isolation. Time-boxed. | 1-3 days | N/A | High - proves or disproves the technical hypothesis |
| **API prototype** | Build a minimal API that handles the core data flow. No UI. | 2-5 days | N/A | High - surfaces integration issues early |
| **Third-party evaluation** | Evaluate vendor APIs, libraries, or services for the key capability. | 1-2 days | 3-5 vendors | Medium-high - reveals real constraints |
| **Data audit** | Check whether the data needed for the solution exists, is accessible, and is clean enough. | 1 day | N/A | High - data problems kill more features than code problems |

### Usability experiments

Test whether users can figure out the solution.

| Experiment | How it works | Duration | Sample size | Signal strength |
|---|---|---|---|---|
| **Paper prototype test** | Sketch the key screens on paper or whiteboard. Walk 5 users through the flow. | 1 day | 5 users | Medium - tests concept and flow, not visual design |
| **Clickable prototype test** | Build a Figma/Framer prototype. Run moderated usability tests with think-aloud protocol. | 3-5 days | 5-8 users | High - realistic interaction patterns |
| **First-click test** | Show users a screen and ask: "Where would you click to [accomplish task]?" Measure accuracy. | 1-2 days | 20-50 users | Medium - fast signal on navigation and layout |
| **Five-second test** | Show a screen for 5 seconds. Ask what the user remembers and what they think it does. | 1 day | 20-30 users | Low-medium - tests clarity of value proposition |
| **Unmoderated task test** | Record users completing specific tasks in the prototype without a facilitator. | 3-5 days | 10-20 users | Medium-high - natural behavior, larger sample |

---

## Designing experiments that can fail

The most common failure mode in discovery is designing experiments that confirm the idea
regardless of the result. Every experiment must have:

### 1. A falsifiable hypothesis

```
We believe that [specific user segment]
will [specific measurable behavior]
when [specific condition/change is introduced]
because [rationale from customer evidence].
```

### 2. Pre-committed success criteria

Define before data collection:
- **Success threshold:** "If >X% of users do Y, we proceed"
- **Kill threshold:** "If <Z% of users do Y, we stop"
- **Ambiguous zone:** "If between Z% and X%, we need more data"

### 3. Decision rules

| Result | Action |
|---|---|
| Above success threshold | Move solution to delivery backlog; test next riskiest assumption |
| In ambiguous zone | Design a more targeted experiment; increase sample size |
| Below kill threshold | Archive the solution; return to the opportunity and try a different solution |

---

## Experiment sequencing

Not all assumptions need testing. Use this decision tree:

```
Is this assumption high-importance?
  |
  NO  --> Skip (even if wrong, solution still works)
  YES --> Do we have strong evidence already?
            |
            YES --> Monitor, don't test
            NO  --> Is it a desirability assumption?
                      |
                      YES --> Test FIRST (if nobody wants it, nothing else matters)
                      NO  --> Test SECOND (viability, feasibility, usability)
```

**General sequencing rule:** Desirability > Viability > Usability > Feasibility

Rationale: Desirability failures are the most expensive to discover late. Feasibility
failures are the cheapest - engineers usually know within days whether something is
buildable. Test in order of "cost of being wrong late."

---

## Worked example

**Context:** A budgeting app team discovers that users struggle to track subscription
charges across multiple payment methods.

**Solution idea:** Auto-detect and consolidate all recurring charges into a single
"Subscriptions" view.

**Assumptions identified:**

| # | Assumption | Category | Importance | Evidence |
|---|---|---|---|---|
| A1 | Users want to see all subscriptions in one place | Desirability | High | Weak (3/6 interviews mentioned it) |
| A2 | We can reliably detect recurring charges from transaction data | Feasibility | High | Weak (untested algorithm) |
| A3 | Users will check the subscription view at least monthly | Desirability | Medium | None |
| A4 | Consolidation reduces churn from the budgeting app | Viability | Medium | None |
| A5 | Users can understand the categorization without explanation | Usability | Medium | None |

**Testing order:**
1. A1 (desirability, high importance, weak evidence) - Fake door test
2. A2 (feasibility, high importance, weak evidence) - Technical spike
3. A5 (usability, medium importance, no evidence) - Paper prototype test
4. A3 and A4 can be measured post-launch with analytics

**Experiment for A1:**

```
EXPERIMENT BRIEF
================
Assumption: Users want to see all subscriptions in one place (A1)

Experiment type: Fake door test

Setup: Add a "Subscriptions" tab to the main navigation for 50% of
users. Clicking it shows a "Coming soon - join the waitlist" modal.

Participants: 50% of active users (A/B split), ~2000 users per arm

Success metric: Waitlist sign-up rate among those who see the tab

Kill criteria: If <3% of users who see the tab click it within 7 days,
the demand signal is too weak to pursue.

Success criteria: If >8% of users click and >40% of clickers join the
waitlist, proceed to feasibility spike (A2).

Timeline: 7 days

Decision:
  If success: Run technical spike for A2
  If kill: Return to opportunity; explore other solution ideas
```
