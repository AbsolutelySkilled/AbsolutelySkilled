<!-- Part of the project-execution AbsolutelySkilled skill. Load this file when
     working with dependency mapping, cross-team coordination, or blocked work. -->

# Dependency Tracking Deep Dive

## Dependency types

### Hard dependencies
Work cannot begin or continue without the deliverable. Example: cannot start frontend integration until the API contract is finalized. These require the most rigorous tracking.

### Soft dependencies
Work can proceed with a workaround, but the final deliverable needs the dependency. Example: can build against mock data while waiting for the real data pipeline. Track these but with lower urgency.

### External dependencies
Deliverables from outside your organization - vendor APIs, third-party approvals, regulatory decisions. These carry the highest uncertainty because you have the least control. Always have a fallback plan.

### Internal cross-team dependencies
Deliverables from other teams within your organization. These are the most common source of project delays. The key risk is priority misalignment - your critical dependency may be their low-priority backlog item.

## Dependency documentation template

For each dependency, capture:

```
Dependency ID: D-XXX
Description: [What exactly is needed]
Source team: [Who needs it]
Target team: [Who provides it]
Deliverable: [Specific artifact - API endpoint, library version, design spec, etc.]
Due date: [When it's needed by]
Buffer: [How many days of float before it blocks critical path]
Status: [Unconfirmed / Confirmed / In Progress / Delivered / Late / Blocked]
Confirmation date: [When the target team acknowledged the commitment]
Target contact: [Primary person]
Backup contact: [Secondary person]
Fallback plan: [What to do if it's late]
Last checked: [Date of most recent status check]
```

## Cross-team coordination protocols

### Dependency handshake
When establishing a new dependency:
1. Write the dependency spec (what, when, acceptance criteria)
2. Send to the target team lead with a request for confirmation
3. Get explicit acknowledgment with their committed date (may differ from your requested date)
4. If dates misalign, escalate immediately - do not wait
5. Document the confirmed date and add to both teams' tracking systems

### Weekly dependency check
Every week, for each active dependency:
1. Contact the target team's designated contact
2. Ask three questions: Is it still on track? Any blockers on your side? Any scope changes?
3. Update the dependency log with the response and date
4. If status changed, update the risk register accordingly

### Escalation triggers
Escalate a dependency when any of these conditions are true:
- Target team has not confirmed the dependency within 5 business days of request
- Status check reveals a slip of more than 2 days on a critical-path dependency
- Target team's contact is unresponsive for more than 3 business days
- Scope of the deliverable has changed without agreement
- The dependency is within 1 week of due date and not yet in progress

## Dependency visualization

### Simple text-based dependency chain
```
Phase 1: Foundation
  [T1: Schema design] --(feeds)--> [T2: API implementation]
  [T3: Auth setup] --(feeds)--> [T2: API implementation]

Phase 2: Integration
  [T2: API implementation] --(feeds)--> [T4: Frontend integration]
  [T5: Design specs] --(feeds)--> [T4: Frontend integration]

Phase 3: Validation
  [T4: Frontend integration] --(feeds)--> [T6: E2E testing]

Critical path: T1 -> T2 -> T4 -> T6 (shortest: 8 weeks)
Float: T3 has 2 weeks float, T5 has 1 week float
```

### Dependency health dashboard

| Dep ID | Deliverable | From | Due | Status | Days to Due | Health |
|--------|------------|------|-----|--------|-------------|--------|
| D-001 | API contract v2 | Platform | Mar 20 | In Progress | 6 | GREEN |
| D-002 | OAuth SDK | Auth | Mar 25 | Unconfirmed | 11 | RED |
| D-003 | Design specs | Design | Mar 18 | Delivered | - | DONE |
| D-004 | Data migration | Data | Apr 1 | In Progress | 18 | AMBER |

Health rules:
- GREEN: Confirmed, on track, more than 5 days of buffer
- AMBER: Confirmed but less than 5 days of buffer, or minor scope questions
- RED: Unconfirmed, late, blocked, or contact unresponsive
- DONE: Delivered and accepted

## Managing blocked work

When a dependency blocks progress:
1. Immediately log it as an Issue (not just a Risk) in the RAID log
2. Quantify the impact: which tasks are blocked, how many person-days are idle
3. Activate the fallback plan if one exists
4. Redirect blocked team members to non-blocked work (pull forward future tasks, pay down tech debt, improve test coverage)
5. Escalate with impact data: "Team X is blocked. 3 engineers idle. Costing 15 person-days per week. Need [dependency] by [date] or we slip milestone by [N days]."

## Common dependency anti-patterns

| Anti-pattern | Consequence | Better approach |
|---|---|---|
| Verbal agreements only | No accountability, "I never said that" | Written confirmation with dates |
| Checking status only at milestones | Late discovery of slips | Weekly status checks minimum |
| Assuming shared priorities | Your P0 is their P2 | Verify priority alignment with their manager |
| No fallback plan | Complete block when dependency slips | Define fallback for every critical dependency |
| Single point of contact | Person goes on PTO, progress stops | Always have primary and backup contacts |
