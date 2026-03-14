<!-- Part of the agile-scrum AbsolutelySkilled skill. Load this file when
     working with estimation, story points, or sizing techniques. -->

# Estimation Techniques - Deep Dive

## Story Points (Modified Fibonacci)

### The scale

```
1  -  2  -  3  -  5  -  8  -  13  -  21
```

Story points measure **relative complexity**, not time. A 2-point story is roughly
twice as complex as a 1-point story. The gaps widen intentionally - distinguishing
between a 14 and a 15 is false precision.

### Anchoring the scale

Every team needs reference stories to anchor their scale. Without anchors, estimates
drift over time.

**How to establish anchors:**
1. Pick a recently completed story that everyone agrees was straightforward
2. Assign it 3 points (the middle of the useful range)
3. Find a story that was roughly half as complex - that's your 1-2 point anchor
4. Find a story that was roughly twice as complex - that's your 5-8 point anchor
5. Document these as the team's reference stories; revisit quarterly

**Example anchor set:**
| Points | Reference story | Why |
|--------|----------------|-----|
| 1 | "Update error message text" | Single file change, no logic |
| 3 | "Add email validation to signup form" | Frontend + backend change, tests needed |
| 5 | "Integrate Slack notifications for order events" | Third-party API, error handling, new config |
| 8 | "Migrate user preferences from localStorage to database" | Schema change, data migration, backward compat |
| 13 | "Add multi-currency support to checkout" | Multiple services affected, edge cases, localization |

### What story points capture

Points reflect three dimensions:
1. **Complexity** - How many moving parts? How many systems touched?
2. **Uncertainty** - How well do we understand the problem? Any unknowns?
3. **Effort** - How much raw work is involved?

High uncertainty alone can justify a higher estimate. A simple task in an unfamiliar
codebase might be a 5 even though the logic itself is a 2.

---

## Planning Poker

### Process (detailed)

1. **Moderator reads the story** - PO explains the user story and acceptance criteria
2. **Clarifying questions** (time-box: 3 min) - Developers ask questions. No
   estimating discussion yet
3. **Silent estimation** - Each person selects a card from the Fibonacci sequence.
   Do not reveal yet
4. **Simultaneous reveal** - Everyone shows their card at the same time. This prevents
   anchoring bias
5. **Discuss outliers** - If estimates span more than 2 levels (e.g., 2 and 8):
   - Highest estimator explains their concerns
   - Lowest estimator explains what they see as simple
   - Often reveals hidden assumptions or missed requirements
6. **Re-vote** - After discussion, vote again. If still divergent after 2 rounds,
   take the higher estimate and note the uncertainty
7. **Record and move on** - Don't spend more than 5 minutes per story. If consensus
   is impossible, the story needs more refinement

### Tools
- Physical cards (traditional, best for co-located teams)
- PlanningPoker.com (free, works for remote teams)
- Jira estimation features
- Slack-based bots (e.g., Polly for quick votes)

### Common mistakes in planning poker
- **Anchoring**: Senior dev speaks first and everyone follows. Fix: simultaneous reveal
- **Averaging**: Taking the mean of divergent estimates. Fix: discuss and re-vote
- **Time-based reasoning**: "That'll take 2 days so it's 2 points." Fix: redirect to
  complexity, not hours
- **Skipping discussion**: Everyone picks the same number so you move on. Fix: still
  do a quick sanity check

---

## T-Shirt Sizing

Best for early-stage estimation when stories are not yet refined enough for story points.

### Scale

| Size | Relative effort | Roughly maps to |
|------|----------------|-----------------|
| XS | Trivial | 1 point |
| S | Small | 2-3 points |
| M | Medium | 5 points |
| L | Large | 8 points |
| XL | Very large | 13 points - consider splitting |
| XXL | Epic | 21+ points - must split before sprint |

### When to use T-shirt sizing
- Roadmap planning (quarter-level estimation)
- Initial backlog triage before refinement
- Non-technical stakeholders are in the room
- The team is new to estimation and story points feel intimidating

### Process
1. Sort stories into buckets (XS through XXL) as a group
2. Review each bucket for consistency
3. Convert to story points later during refinement if needed

---

## Affinity Estimation (Wall Estimation)

Best for estimating a large backlog quickly (30+ items in under an hour).

### Process
1. Write each story on a card or sticky note
2. Draw a horizontal scale on a wall: Small <----> Large
3. Team members silently place cards on the wall relative to each other
4. Anyone can move any card, but must explain if challenged
5. Continue until the wall stabilizes (no more moves)
6. Draw vertical lines to group cards into point buckets
7. Record the estimates

### When to use
- New project kickoff with a large initial backlog
- Quarterly planning where many epics need rough sizing
- Team has estimation fatigue from too many planning poker sessions

---

## #NoEstimates Approach

An alternative philosophy that argues estimation itself is waste.

### Core idea
Instead of estimating, break all work into roughly equal-sized stories (target: 1-2
days each). Then count stories instead of summing points.

### How it works
- Every story must be small enough to complete in 1-2 days
- If a story is bigger, split it - don't estimate it, just split it
- Velocity = number of stories completed per sprint (not points)
- Forecasting uses throughput (stories/week) and Monte Carlo simulation

### When #NoEstimates works well
- Mature teams with good story-splitting discipline
- Teams where estimation sessions consistently produce low-value debates
- Organizations that trust teams to self-manage without point-based tracking

### When it does not work
- Teams that struggle to split stories consistently
- Organizations that need point-based roadmap commitments
- New teams that haven't yet calibrated what "small" means

---

## Estimation anti-patterns

| Anti-pattern | Problem | Fix |
|-------------|---------|-----|
| Padding estimates for safety | Destroys trust; velocity inflates but delivery stays flat | Track accuracy over time; normalize through velocity |
| Re-estimating done work | Waste of time; changes velocity history | Only re-estimate if the story was fundamentally misunderstood |
| Estimating bugs | Bugs are not planned features; estimating them inflates velocity | Track bugs separately; use a bug budget (10-15% of capacity) |
| Manager-assigned estimates | Developers lose ownership; estimates become targets | Only the people doing the work can estimate the work |
| Estimating in hours then converting | Points become proxy hours; loses the complexity dimension | Estimate directly in points using reference stories |
