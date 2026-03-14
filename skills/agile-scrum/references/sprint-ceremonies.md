<!-- Part of the agile-scrum AbsolutelySkilled skill. Load this file when
     working with sprint ceremonies, facilitation, or Scrum events. -->

# Sprint Ceremonies - Detailed Facilitation Guide

## Sprint Planning

### Pre-requisites
- Product Backlog is refined: top items have acceptance criteria, estimates, and
  are ordered by priority
- Team knows their average velocity (last 3-5 sprints)
- PO has a proposed sprint goal aligned with the product roadmap
- Any known PTO, holidays, or on-call duties are documented

### Time-box guidelines

| Sprint length | Planning time-box |
|--------------|------------------|
| 1 week | 1 hour |
| 2 weeks | 2 hours |
| 3 weeks | 3 hours |
| 4 weeks | 4 hours |

### Facilitator checklist
1. Share the sprint goal before discussing individual stories
2. Let developers pull work - never assign stories to individuals during planning
3. If a story generates more than 5 minutes of debate, it needs more refinement -
   send it back to the backlog
4. Track capacity adjustments explicitly (PTO, on-call, training days)
5. End by reading back the sprint goal and committed items; get verbal confirmation

### Capacity planning formula

```
Available capacity = (Number of devs) x (Sprint days) x (Focus factor)
Focus factor = 0.6 to 0.8 (accounts for meetings, support, interruptions)

Example: 5 devs, 10-day sprint, 0.7 focus factor
Available = 5 x 10 x 0.7 = 35 ideal dev-days
```

Map this to story points using historical data: if the team averages 40 points in
a 10-day sprint with full attendance, and one dev is on PTO for 3 days, adjust to
roughly 34 points (40 x 47/50 available dev-days).

---

## Daily Standup (Daily Scrum)

### Format
- Time-box: 15 minutes, same time every day
- Standing up is optional - the brevity is what matters
- Each person answers three questions or uses a walk-the-board approach

**Three questions format:**
1. What did I complete since last standup?
2. What will I work on today?
3. What is blocking me?

**Walk-the-board format (recommended for mature teams):**
- Start from the rightmost column (closest to Done)
- For each item in progress, the owner gives a brief status
- Focus on flow, not individual updates
- Naturally surfaces blockers and stale items

### Anti-patterns to watch for
- **Status report to the Scrum Master** - The standup is for the team, not a report
  to management. Redirect: "Tell the team, not me."
- **Problem-solving during standup** - Note the issue, take it offline immediately
  after. Say: "Let's park that - who needs to be in the follow-up?"
- **Going over 15 minutes** - Strictly enforce. If consistently over time, the team
  has too many members (split into sub-teams) or too many blockers (systemic issue).
- **Skipping when remote** - Async standups via Slack/Teams are acceptable but must
  happen daily and be read by the whole team.

---

## Sprint Review (Demo)

### Purpose
Demonstrate the completed increment to stakeholders and gather feedback. This is
NOT a status meeting - it is an inspection of the product.

### Agenda template (1 hour for a 2-week sprint)

1. **Sprint goal recap** (5 min) - PO states the goal and whether it was met
2. **Live demo** (30 min) - Developers demo working software (not slides). Each
   completed story gets a brief walkthrough
3. **Stakeholder feedback** (15 min) - Structured Q&A. Capture feedback as new
   backlog items
4. **Upcoming priorities** (10 min) - PO shares what's coming next sprint and any
   priority shifts based on feedback

### Tips
- Demo from the staging/production environment, not localhost
- Invite real stakeholders, not just the team - the point is external feedback
- Incomplete stories are not demoed. Partially done work is not an increment
- Record the demo for absent stakeholders

---

## Sprint Retrospective

### Safety check (run at the start)

Ask each team member to rate on a scale of 1-5 how safe they feel to share openly:
- 5: I'll talk about anything
- 4: I'll talk about most things
- 3: I'll talk about some things but hold back on others
- 2: I'll only say what's safe
- 1: I won't say anything meaningful

If the average is below 3, address psychological safety before running the retro.
Consider running an anonymous format or having management leave the room.

### Format rotation schedule

Rotate retrospective formats every 2-3 sprints to prevent staleness:

| Sprint | Format | Best for |
|--------|--------|----------|
| 1-2 | Start-Stop-Continue | New teams, simple and familiar |
| 3-4 | 4Ls (Liked, Learned, Lacked, Longed for) | Balanced reflection |
| 5-6 | Sailboat | Identifying risks and goals visually |
| 7-8 | Timeline | After a turbulent sprint or release |
| 9-10 | Lean Coffee | Mature teams that want open discussion |
| 11-12 | Circles and Soup | When team feels stuck on things outside control |

### Action item quality checklist

Every action item must be:
- **Specific** - "Improve code reviews" is vague. "Add a review checklist to PR
  template by Friday" is specific.
- **Owned** - One person is accountable (not "the team")
- **Time-bound** - Due within the next sprint
- **Achievable** - Can actually be completed in one sprint
- **Tracked** - Added to the sprint backlog or a visible board

### Tracking retro effectiveness

Keep a running log of retro actions and their completion rate:

```
Sprint 14 actions:
  [x] Add PR checklist template (owner: Alice, done Sprint 15)
  [x] Set up staging deploy pipeline (owner: Bob, done Sprint 15)
  [ ] Reduce flaky test count by 50% (owner: Carol, carried to Sprint 16)

Completion rate: 67% (target: >80%)
```

If completion rate drops below 50% for 3+ sprints, the team is committing to
actions they cannot deliver. Reduce to 1-2 actions per retro.

---

## Backlog Refinement (Grooming)

### Cadence
- Allocate 10% of sprint capacity (roughly 1 hour per week for a 2-week sprint)
- Schedule mid-sprint to avoid conflicting with planning and review
- Attendance: PO + developers. Scrum Master facilitates.

### What happens in refinement
1. PO presents upcoming backlog items (look 2-3 sprints ahead)
2. Team asks clarifying questions
3. Team writes or refines acceptance criteria together
4. Team estimates items (story points)
5. Large items are split into smaller stories
6. Items are re-ordered based on new understanding

### Definition of Ready (entrance criteria for sprint planning)

An item is "Ready" for sprint planning when:
- [ ] User story follows the As a / I want / So that template
- [ ] Acceptance criteria are written in Given-When-Then format
- [ ] Story is estimated in story points
- [ ] Story is small enough to complete in one sprint (13 points or less)
- [ ] Dependencies are identified and resolved (or scheduled)
- [ ] UX designs are available (if applicable)
- [ ] Technical approach is discussed (not designed in detail, but understood)
