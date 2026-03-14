<!-- Part of the project-execution AbsolutelySkilled skill. Load this file when
     working with risk identification, assessment, or mitigation strategies. -->

# Risk Management Deep Dive

## Risk identification techniques

### Pre-mortem analysis
Assume the project has already failed. Ask each team member independently to list reasons for failure. Aggregate and deduplicate. This technique bypasses optimism bias and surfaces risks people are reluctant to raise in normal planning.

### Assumption mapping
List every assumption the plan relies on. Rate each assumption's certainty (Confirmed/Likely/Uncertain/Unvalidated). Any assumption rated Uncertain or Unvalidated becomes a risk candidate. Common hidden assumptions: API stability, team availability, third-party SLA compliance, approval timelines.

### Dependency risk scan
For each external dependency, ask: What happens if this is 1 week late? 2 weeks late? Never delivered? If any answer threatens a milestone, create a risk entry with the dependency as the trigger.

### Historical pattern review
Check post-mortems from similar past projects. Common recurring risks by project type:

| Project type | Typical risks |
|---|---|
| Migration | Data integrity issues, rollback plan gaps, feature parity misses |
| New product launch | Scope creep, underestimated integration work, late design changes |
| Platform upgrade | Breaking changes in downstream consumers, testing coverage gaps |
| Cross-team initiative | Conflicting priorities, communication gaps, unclear ownership |

## Quantitative risk assessment

### 3x3 risk matrix

Score each risk on Likelihood (1-3) and Impact (1-3). Multiply for a Risk Score (1-9).

```
Impact -->    Low(1)    Medium(2)    High(3)
High(3)    |  3(M)   |   6(H)    |   9(C)   |
Medium(2)  |  2(L)   |   4(M)    |   6(H)   |
Low(1)     |  1(L)   |   2(L)    |   3(M)   |
```

- **Critical (7-9)**: Requires immediate mitigation plan and weekly review. Escalate to sponsor.
- **High (5-6)**: Requires mitigation plan. Review biweekly.
- **Medium (3-4)**: Monitor. Review monthly.
- **Low (1-2)**: Accept. Review quarterly or at milestones.

### Expected delay calculation
For schedule risks, estimate: Expected Delay = Probability x Days of Impact. Sum expected delays across all open risks for a risk-adjusted timeline. If risk-adjusted completion exceeds the deadline, the plan needs intervention now, not later.

## Mitigation strategy patterns

### Avoid
Eliminate the risk by changing the plan. Example: if a dependency on Team X's API is risky, build an internal adapter that removes the dependency entirely.

### Transfer
Shift the risk to another party. Example: use a managed service instead of self-hosting to transfer operational risk to the vendor.

### Mitigate
Reduce likelihood or impact. Example: cross-train a second engineer to reduce the impact of a key-person dependency. Add integration tests early to reduce likelihood of late-discovered bugs.

### Accept
Acknowledge the risk and prepare a contingency plan. Use when mitigation cost exceeds expected impact. Document the acceptance decision and the trigger conditions for the contingency plan.

### Buffer
Add explicit time buffers to the schedule for high-uncertainty tasks. A common formula: add 20% buffer to any task with Medium+ risk. Add 40% buffer to tasks with High risk and external dependencies.

## Risk review cadence

| Project phase | Review frequency | Focus |
|---|---|---|
| Planning | Daily during planning sprint | Identification and initial scoring |
| Early execution (0-30%) | Weekly | New risks from early learnings, dependency confirmation |
| Mid execution (30-70%) | Weekly | Risk score changes, mitigation effectiveness |
| Late execution (70-100%) | Twice weekly | Critical path risks, go/no-go criteria |
| Post-launch | Once at retrospective | Risk accuracy review, lessons learned |

## Risk register maintenance rules

1. Every risk has exactly one owner - never "the team"
2. Review date is updated every time the risk is discussed, even if nothing changes
3. Closed risks stay in the register with a resolution note - they inform future projects
4. New risks can be added by anyone at any time - do not gate risk identification
5. Risk scores change as the project progresses - a Low risk in week 1 may become High in week 6
