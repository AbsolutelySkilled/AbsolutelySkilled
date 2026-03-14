<!-- Part of the agile-scrum AbsolutelySkilled skill. Load this file when
     working with Kanban boards, flow metrics, or continuous delivery workflows. -->

# Kanban Flow - Advanced Practices

## Kanban Principles

1. **Start with what you do now** - Kanban does not prescribe roles or ceremonies.
   Map your current workflow onto a board first, then improve.
2. **Agree to pursue incremental change** - No big-bang transformations. Small,
   continuous improvements.
3. **Respect current roles and responsibilities** - Kanban does not require Scrum
   roles. Existing titles and structures remain.
4. **Encourage leadership at all levels** - Anyone can suggest improvements to the
   flow.

---

## Board Design

### Standard columns

```
Backlog | Ready | In Progress | In Review | Testing | Done
```

### Advanced column patterns

**Split columns (doing/done):**
```
In Progress    | Code Review      | QA
[Doing] [Done] | [Doing] [Done]   | [Doing] [Done]
```

Split columns make handoff points visible. An item sitting in "In Progress - Done"
but not yet in "Code Review - Doing" reveals a queue. Queues are waste.

**Expedite lane:**
Add a horizontal swim lane at the top for urgent items (production bugs, security
fixes). Expedite items bypass WIP limits but should represent less than 10% of
total throughput. If more than 10% of items are "expedited," nothing is actually
expedited.

**Class of service lanes:**

| Lane | SLA | Example |
|------|-----|---------|
| Expedite | Same day | Production outage, security vulnerability |
| Fixed date | By deadline | Regulatory compliance, contractual obligation |
| Standard | Normal flow | Feature work, improvements |
| Intangible | When capacity allows | Tech debt, refactoring, tooling |

---

## WIP Limits

### Setting initial WIP limits

**Rule of thumb:** WIP limit per column = number of people who work in that column.

For a team of 6 developers:
- In Progress: 6 (one per developer) or 4 (to encourage pairing)
- In Review: 3 (forces fast reviews)
- Testing: 2 (creates pull toward finishing)

### What to do when WIP limit is hit

When a column is full:
1. **First**: Help finish something in a downstream column (pull from the right)
2. **Second**: Pair with someone on an in-progress item
3. **Third**: Work on technical debt or improvement items from the intangible lane
4. **Never**: Start a new item and exceed the WIP limit. The limit exists for a reason

### Adjusting WIP limits

- If items queue between columns, lower the upstream WIP limit
- If a column is rarely full, its WIP limit may be too high
- If a column constantly blocks, the team may need more capacity there or the
  WIP limit is too low
- Adjust by 1 at a time. Wait 2-4 weeks before adjusting again

---

## Flow Metrics

### Cycle Time

**Definition:** The time from when work starts (enters "In Progress") to when it
is done (enters "Done").

```
Cycle Time = Done Date - Start Date
```

**Target:** Cycle time should be stable and predictable. A high variance in cycle
time means the team cannot make reliable delivery commitments.

**Percentile-based targets:**
- 50th percentile: "Half our items finish in X days or less"
- 85th percentile: "85% of our items finish in X days or less" (use for commitments)
- 95th percentile: "Nearly all items finish in X days or less"

### Lead Time

**Definition:** The time from when a request is made (enters "Backlog") to when it
is delivered (enters "Done").

```
Lead Time = Done Date - Request Date
```

Lead Time = Cycle Time + Queue Time. Reducing queue time (items waiting in "Ready"
or between columns) is often more impactful than reducing active work time.

### Throughput

**Definition:** The number of items completed per unit of time.

```
Throughput = Items completed / Time period
```

Track weekly throughput. Use the average over the last 4-6 weeks for forecasting.

### Cumulative Flow Diagram (CFD)

The CFD shows the number of items in each state over time. Each column is a colored
band. Key things to read from a CFD:

- **Band width** = WIP in that state. Wide bands mean items are accumulating
- **Band slope** = throughput. Flat bands mean no items are completing
- **Parallel bands** = stable flow. Diverging bands = bottleneck forming
- **Vertical distance between bands** = approximate cycle time

---

## Forecasting with Kanban

### Monte Carlo Simulation

Since Kanban does not use story points or velocity, forecasting uses historical
throughput data:

1. Collect the last 8-12 weeks of throughput data (items completed per week)
2. Randomly sample from this data to simulate future weeks
3. Run 1000+ simulations
4. Report: "There is an 85% chance we will complete 20 items in the next 4 weeks"

**Simple manual version:**
- Best case: highest weekly throughput x weeks remaining
- Likely case: average weekly throughput x weeks remaining
- Worst case: lowest weekly throughput x weeks remaining

### "How many" forecasting
Given a deadline, how many items can we deliver?
```
Items = Throughput per week x Weeks remaining
```

### "When" forecasting
Given a number of items, when will they be done?
```
Weeks needed = Items remaining / Throughput per week
```

---

## Scrumban - Combining Scrum and Kanban

### When to use Scrumban
- Team wants Scrum ceremonies but Kanban flow
- Support/maintenance team with unpredictable work mixed with planned features
- Team transitioning from Scrum to Kanban (or vice versa)

### How it works
- Keep sprint cadence for planning, review, and retro
- Replace sprint backlog commitment with WIP limits
- Use pull-based flow instead of push-based sprint planning
- Track both velocity (for sprint context) and cycle time (for flow)
- Replenish the "Ready" column when it drops below a threshold rather than
  loading an entire sprint during planning

### Scrumban planning trigger
Instead of time-boxed planning, use a replenishment trigger:
"When the Ready column drops below 5 items, schedule a planning session to
refill it to 10 items."

---

## Kanban for non-software teams

Kanban applies to any knowledge work. Common adaptations:

**Marketing team board:**
```
Ideas | Briefed | In Creation | In Review | Published | Measuring
```

**HR/Recruiting board:**
```
Open Roles | Sourcing | Screening | Interviewing | Offer | Onboarding
```

**Personal Kanban (individual productivity):**
```
To Do | Doing (WIP: 3) | Done
```

The key principle remains the same: visualize work, limit WIP, manage flow.
