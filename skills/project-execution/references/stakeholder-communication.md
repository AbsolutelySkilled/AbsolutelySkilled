<!-- Part of the project-execution AbsolutelySkilled skill. Load this file when
     working with stakeholder updates, communication plans, or difficult conversations. -->

# Stakeholder Communication Deep Dive

## Stakeholder mapping

### Influence-Interest matrix

```
                    High Interest           Low Interest
High Influence   | MANAGE CLOSELY     |  KEEP SATISFIED    |
                 | (Sponsor, PM)      |  (VP, Legal)       |
Low Influence    | KEEP INFORMED      |  MONITOR           |
                 | (Dev team, QA)     |  (Other teams)     |
```

- **Manage closely**: Direct, frequent, detailed updates. Include in decisions. These stakeholders can make or break the project.
- **Keep satisfied**: Executive summaries. Proactive on bad news. Do not overwhelm with detail but never surprise them.
- **Keep informed**: Regular broadcast updates. Invite input on their areas. They care and want to know.
- **Monitor**: Minimal communication. Include in broad announcements only.

### Stakeholder profile template

For each key stakeholder, document:
```
Name: [name]
Role: [title/function]
Quadrant: [Manage closely / Keep satisfied / Keep informed / Monitor]
Primary concern: [What they care most about - deadline, quality, cost, scope]
Communication preference: [Email / Slack / 1:1 / Document]
Update frequency: [Daily / Twice weekly / Weekly / Biweekly / Monthly]
Decision authority: [What decisions they can make]
Known preferences: [Prefers data over narrative / Wants options not problems / etc.]
```

## Communication templates

### Weekly status update (executive)

```
Subject: [Project Name] Weekly Status - [Date] - [RAG STATUS]

TL;DR: [One sentence summary of the week. Lead with the most important thing.]

## Status: [GREEN/AMBER/RED]
[If AMBER or RED: One sentence on why and what's being done about it.]

## Key progress
- [Achievement 1 - tied to a milestone]
- [Achievement 2]

## Next week
- [Priority 1]
- [Priority 2]

## Decisions needed
- [Decision] by [date] from [person] - [context in one line]

## Risks (top 3)
1. [Risk] - [RAG] - [Mitigation in progress]
```

### Escalation communication

```
Subject: [ESCALATION] [Project Name] - [Issue in 5 words]

## The problem
[One paragraph. What happened, when, and the immediate impact.]

## Impact
- Timeline: [X days/weeks delay to milestone Y]
- Cost: [additional resources, vendor costs, opportunity cost]
- Quality: [any quality implications]

## Options

### Option A: [Name]
- Description: [What we'd do]
- Timeline impact: [+X days]
- Cost: [$$]
- Trade-off: [What we give up]

### Option B: [Name]
- Description: [What we'd do]
- Timeline impact: [+X days]
- Cost: [$$]
- Trade-off: [What we give up]

### Option C: [Name] (Recommended)
- Description: [What we'd do]
- Timeline impact: [+X days]
- Cost: [$$]
- Trade-off: [What we give up]
- Why recommended: [Brief rationale]

## Decision needed
[What decision, from whom, by when]
```

### Milestone completion announcement

```
Subject: [Project Name] - Milestone [N] Complete: [Milestone Name]

## Summary
[What was delivered. 2-3 sentences.]

## Key deliverables
- [Deliverable 1] - [status: complete/partial]
- [Deliverable 2] - [status]

## Metrics
- Planned completion: [date]
- Actual completion: [date]
- Variance: [+/- N days]

## Next milestone
- [Milestone name] - Target: [date]
- Key focus: [1-2 sentences]

## Acknowledgments
[Call out teams or individuals who made notable contributions]
```

## Communication cadence by project phase

| Phase | Sponsor updates | Team updates | Broad stakeholders |
|---|---|---|---|
| Planning | Weekly | Daily standup | Kickoff announcement |
| Early execution | Weekly | Daily standup | Biweekly digest |
| Mid execution | Weekly | Daily standup | Biweekly digest |
| Late execution / crunch | Twice weekly | Daily standup + daily sync | Weekly digest |
| Launch | Daily (launch week) | Continuous | Launch announcement |
| Post-launch | Weekly (2 weeks) | Daily (1 week) | Post-launch summary |

## Difficult conversation playbooks

### Delivering bad news to a sponsor

1. **Pre-wire before the meeting**: Never surprise a sponsor in a group setting. Send a brief heads-up message: "I want to flag something before our meeting - [one sentence on the issue]. I have options to discuss."
2. **Lead with the impact**: "We are at risk of missing the April 15 deadline by approximately 2 weeks."
3. **Own it**: Do not blame. "I should have flagged this earlier" builds more trust than "Team X dropped the ball."
4. **Present options immediately**: Never deliver bad news without a path forward.
5. **Ask for what you need**: Be specific. "I need a decision on scope reduction by Friday" is better than "What should we do?"

### Negotiating a scope change

1. Frame as a trade-off, not a failure: "To hit the April date, I recommend we move feature Y to Phase 2."
2. Quantify what you're giving up and what you're protecting.
3. Show the alternative: "If we keep full scope, the new date is [X]. Here's why."
4. Get explicit sign-off. A verbal "yeah, okay" is not enough. Send a follow-up email documenting the agreed change.

### Handling stakeholder disagreement

1. Identify the root cause of disagreement: different priorities, different information, or different risk tolerance.
2. If different information: share the data and align on facts first.
3. If different priorities: escalate to the person who can arbitrate (usually the sponsor).
4. If different risk tolerance: make the risk explicit and let the decision-maker decide.
5. Document the decision and the reasoning. Revisiting settled decisions wastes time.

## RAG status definitions

Define these at project start and apply them consistently:

| Status | Definition | Action required |
|---|---|---|
| GREEN | On track. No significant risks or issues. | Continue planned work. |
| AMBER | At risk. Issues exist that could cause a miss without intervention. | Mitigation in progress. Stakeholder awareness needed. |
| RED | Off track. Current plan will not meet commitments. | Scope, timeline, or resource change required. Escalation needed. |
| BLUE | Complete. Milestone or project delivered. | Closeout activities. |

Rules for RAG changes:
- Moving from GREEN to AMBER requires a mitigation plan within 48 hours
- Moving from AMBER to RED requires an escalation within 24 hours
- Moving from RED to GREEN requires evidence, not just optimism
- Never skip AMBER - going directly from GREEN to RED indicates a tracking failure
