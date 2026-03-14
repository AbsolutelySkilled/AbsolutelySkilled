<!-- Part of the remote-collaboration AbsolutelySkilled skill. Load this file when
     designing a specific async process or workflow for a distributed team. -->

# Async Workflows

## Async standup variations

### Classic three-question standup
Best for small teams (3-8 people). Post daily in a dedicated channel.
- What I completed yesterday
- What I'm working on today
- Any blockers

### Progress-and-plans standup
Best for project-focused teams. Post at end of day (captures what actually happened).
- Progress: What moved forward today (with links to PRs/docs)
- Plans: Top 1-2 priorities for tomorrow
- Signals: Anything the team should know (risks, delays, discoveries)

### Weekly async standup
Best for senior/autonomous teams where daily updates add friction without value.
- Shipped: What was completed this week
- In flight: Current focus areas
- Upcoming: What's planned for next week
- Help needed: Where input from others would accelerate progress

### Standup implementation checklist
1. Choose a channel or tool (Slack channel, Geekbot, Linear updates, etc.)
2. Set a consistent posting window (not a fixed time - a 3-hour window works)
3. Establish the read norm: standups are write-only unless someone needs help
4. Rotate a weekly "standup reviewer" who scans for patterns and raises risks
5. Review the format quarterly - adjust if people are writing boilerplate

---

## Async code review protocol

### Setting expectations
- Author tags reviewers and sets a review-by date (default: 24 hours for standard
  PRs, 4 hours for hotfixes, 48 hours for large architectural changes)
- PR description includes: what changed, why, how to test, and any areas where
  the author wants specific feedback
- If no review by deadline: author pings once. If still no review after 8 hours:
  author can merge with a note explaining the situation

### Review quality standards
- Comments should be actionable: "Consider X because Y" not "I don't like this"
- Use comment prefixes to signal intent:
  - `nit:` - Style preference, non-blocking
  - `suggestion:` - Improvement idea, author decides
  - `question:` - Need clarification before approving
  - `blocker:` - Must be addressed before merge
- Approve with comments means the nits can be addressed in a follow-up

### Reducing review round-trips
- Author self-reviews the diff before requesting review (catches 30% of issues)
- Use PR templates that force the author to fill in context
- For complex changes: record a 3-5 minute Loom walkthrough of the code
- If a review thread exceeds 3 back-and-forth exchanges: move to a 10-minute call,
  then document the outcome in the thread

---

## Async brainstorming techniques

### Silent brainstorm (brainwriting)
1. Share a prompt or problem statement in a doc
2. Each participant adds ideas independently (set a contribution window: 24-48 hours)
3. No commenting on others' ideas during the contribution phase
4. After the window closes, a facilitator groups ideas into themes
5. Team votes asynchronously (dot voting: 3 votes per person)
6. Top ideas move to evaluation (can be async or sync depending on complexity)

**Why it works:** Removes anchoring bias, gives introverts equal voice, allows
deeper thinking than real-time brainstorming.

### Structured proposal round
For decisions with 2-4 clear options:
1. Each option gets a one-page brief (written by its advocate)
2. All briefs shared simultaneously
3. 48-hour comment period where people ask clarifying questions
4. Advocates update their briefs based on questions
5. Team votes or decision-maker decides with written rationale

### Async design critique
For visual or UX work:
1. Designer shares work in a doc/Figma with specific questions ("Is the nav hierarchy
   clear?" not "What do you think?")
2. Reviewers leave contextual comments tied to specific elements
3. Designer responds async, grouping feedback into "will do," "won't do (because),"
   and "need to discuss"
4. Only the "need to discuss" items require a sync touchpoint

---

## Async decision-making frameworks

### RAPID for distributed teams
- **Recommend:** One person writes the proposal (async, in a doc)
- **Agree:** Named stakeholders must sign off (async comments, explicit +1/-1)
- **Perform:** The person who will execute - confirms feasibility in comments
- **Input:** Broader team provides input during the review window
- **Decide:** One named decider makes the call after the review period closes

### Consent-based decision making
Instead of seeking consensus (everyone agrees), seek consent (nobody objects).
1. Proposal is shared with a review deadline
2. Team members respond with: "consent" (no objections), "concern" (minor issue,
   not blocking), or "objection" (fundamental problem that must be addressed)
3. If no objections by deadline: proposal is accepted
4. If objections: author addresses them and re-shares for a shorter review period
5. Silence after deadline = consent (state this norm explicitly in your charter)

---

## Tools and automation

### Bot-assisted standups
Use tools like Geekbot, Standuply, or custom Slack workflows to:
- Prompt team members at their preferred time
- Collect responses and post them in a shared channel
- Flag when someone misses a standup (gentle nudge, not surveillance)
- Generate weekly summaries from daily standups

### Async video messages
For context-heavy updates where text feels insufficient:
- Loom, Vidyard, or screen recordings for code walkthroughs
- Keep videos under 5 minutes (if longer, it should be a doc)
- Always include a text summary below the video link
- Videos are supplements, not replacements for written artifacts
