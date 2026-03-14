<!-- Part of the remote-collaboration AbsolutelySkilled skill. Load this file when
     writing a specific document type for a remote team (RFC, ADR, post-mortem, etc.). -->

# Documentation Templates

## RFC (Request for Comments)

Use for any decision that affects more than one person, is hard to reverse, or
where you want structured input from the team.

```markdown
# RFC: [Title]

**Author:** [Name]
**Status:** Draft | In Review | Accepted | Rejected | Superseded
**Created:** [Date]
**Review deadline:** [Date - typically 3-5 business days from sharing]
**Reviewers:** [Names - tag specific people, don't rely on "the team"]
**Decision maker:** [Name - one person who makes the final call]

## TL;DR

[2-3 sentences. A busy person should be able to read this and know what you're
proposing and why.]

## Context

[What is the current situation? What problem are we solving? Include data,
metrics, or user feedback if available. Link to related docs or past decisions.]

## Proposal

[What do you recommend? Be specific and concrete. Include enough detail that
someone could implement this without further clarification.]

### Implementation plan

[How would this be executed? Key milestones, rough timeline, who does what.]

## Alternatives considered

[What other options did you evaluate? For each alternative:]

### Alternative A: [Name]

- **Description:** [What is it]
- **Pros:** [Why it could work]
- **Cons:** [Why the proposal is better]

### Alternative B: [Name]

[Same structure]

## Trade-offs and risks

[What are we giving up by choosing this path? What could go wrong?]

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk 1] | Low/Medium/High | Low/Medium/High | [How to reduce it] |

## Open questions

[What do you need input on? Number these so reviewers can reference them.]

1. [Question 1]
2. [Question 2]

## Decision log

[Filled in after the review period closes]

- **Decision:** [Accepted/Rejected/Modified]
- **Date:** [When decided]
- **Rationale:** [Why, incorporating reviewer feedback]
- **Dissenting views:** [Any strong objections and how they were addressed]
```

### RFC process rules
- Author shares the RFC and pings reviewers with the deadline
- Reviewers comment inline, referencing specific sections
- Author responds to all comments (even if just "acknowledged")
- After deadline: author summarizes feedback, updates the proposal if needed,
  and the decision maker makes the call
- Silence after deadline = consent (state this norm explicitly)
- Accepted RFCs are archived in a known location (docs folder, wiki, Notion)

---

## ADR (Architecture Decision Record)

Use for technical decisions that future engineers will need to understand. Lighter
than an RFC - captures the decision after it's made, not the deliberation.

```markdown
# ADR-[NNN]: [Title]

**Date:** [Date]
**Status:** Accepted | Deprecated | Superseded by ADR-[NNN]
**Deciders:** [Names]

## Context

[What is the technical context? What forces are at play?]

## Decision

[What did we decide? State it clearly in one paragraph.]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Neutral
- [Side effect that's neither good nor bad]

## Related

- [Link to RFC if one existed]
- [Link to related ADRs]
```

### ADR conventions
- Number ADRs sequentially (ADR-001, ADR-002, etc.)
- Store in a `/docs/adr/` directory in the repo
- Never delete an ADR - mark it as "Superseded by ADR-NNN" instead
- Keep ADRs short (under 50 lines) - they capture what and why, not how

---

## Post-mortem / incident review

Use after any incident, outage, or significant project failure. Focus on learning,
not blame.

```markdown
# Post-mortem: [Incident title]

**Date of incident:** [Date]
**Duration:** [How long the incident lasted]
**Severity:** [P0/P1/P2/P3]
**Author:** [Name]
**Reviewers:** [Names of people involved in the incident]

## Summary

[2-3 sentences: what happened, what was the impact, how was it resolved.]

## Timeline

[Chronological account of events. Use timestamps with timezone.]

| Time (UTC) | Event |
|---|---|
| HH:MM | [What happened] |
| HH:MM | [Detection: how we found out] |
| HH:MM | [Response: first action taken] |
| HH:MM | [Resolution: what fixed it] |

## Root cause

[What was the underlying cause? Go deeper than "a bug in the code" - why did
the bug exist? Why wasn't it caught?]

## Impact

- **Users affected:** [Number or percentage]
- **Revenue impact:** [If measurable]
- **Data impact:** [Any data loss or corruption]

## What went well

- [Thing that worked in our response]
- [Process that helped us resolve faster]

## What went poorly

- [Gap in our process or tooling]
- [Communication breakdown]

## Action items

| Action | Owner | Deadline | Priority |
|---|---|---|---|
| [Specific fix or improvement] | [Name] | [Date] | P0/P1/P2 |

## Lessons learned

[1-3 key takeaways that should change how we work going forward.]
```

### Post-mortem process
- Write the draft within 48 hours of resolution (while memory is fresh)
- Review with all involved parties before publishing
- Focus on systems, not individuals - "the deploy process allowed X" not "person Y did X"
- Action items must have named owners and deadlines or they won't happen
- Review action item completion in the next team sync

---

## Project brief

Use at the start of any project to align stakeholders before work begins.

```markdown
# Project brief: [Project name]

**Owner:** [Name]
**Team:** [Names and roles]
**Created:** [Date]
**Target launch:** [Date]
**Status:** Planning | In Progress | Shipped | Paused

## Problem statement

[What problem are we solving? Who has this problem? How do we know it's worth
solving? Include data if available.]

## Goals and success metrics

| Goal | Metric | Target |
|---|---|---|
| [Goal 1] | [How we'll measure it] | [What success looks like] |

## Non-goals

[What are we explicitly NOT trying to do? This is as important as the goals.]

- [Non-goal 1]
- [Non-goal 2]

## Proposed solution

[High-level approach. Enough detail to evaluate feasibility, not enough to
implement. Link to RFC or design doc for details.]

## Key milestones

| Milestone | Target date | Owner |
|---|---|---|
| [Milestone 1] | [Date] | [Name] |

## Dependencies and risks

- [Dependency on another team or system]
- [Key risk and mitigation]

## Communication plan

- **Updates:** [Where and how often - e.g., weekly digest in #project-channel]
- **Decisions:** [Where decisions are documented - e.g., RFC folder]
- **Escalation:** [Who to contact for blockers]
```

---

## Status update template

Use for regular project updates posted async (weekly or biweekly).

```markdown
# Status update: [Project name] - [Date]

**Overall status:** On Track | At Risk | Blocked

## TL;DR

[One sentence: what's the most important thing to know this week?]

## Progress since last update

- [Completed item with link to deliverable]
- [Completed item]

## In progress

- [Work item] - [Owner] - [Expected completion]

## Risks and blockers

| Issue | Impact | Mitigation | Help needed from |
|---|---|---|---|
| [Issue] | [What happens if unresolved] | [Current plan] | [Name/team] |

## Decisions needed

- [Decision] - [Context link] - [Deadline]

## Next week's focus

- [Priority 1]
- [Priority 2]
```

---

## Document hygiene rules

1. **One canonical location** - Every document type has a known home (e.g., RFCs
   in `/docs/rfcs/`, ADRs in `/docs/adr/`). Never let docs scatter across tools.
2. **Link, don't copy** - Reference other docs by link. Copied content rots.
3. **Date everything** - Every doc has a created date. Status updates have the
   reporting period. Decisions have the decision date.
4. **Name owners** - Every action item, every review request, every decision has
   a named person. "The team" owns nothing.
5. **Archive, don't delete** - Old docs are historical artifacts. Mark them as
   superseded or archived, but keep them discoverable.
6. **Front-load the TL;DR** - Busy stakeholders read the first 3 lines. Put the
   most important information there.
