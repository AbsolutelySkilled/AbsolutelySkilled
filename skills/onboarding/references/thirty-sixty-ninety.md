<!-- Part of the Onboarding AbsolutelySkilled skill. Load this file when
     creating role-specific 30/60/90 day plans for engineering, product, or sales. -->

# 30/60/90 Day Plan Templates

Role-specific milestone definitions for engineering, product, and sales. Use these
alongside the general 30/60/90 template in `SKILL.md`. Each template fills in the
role-specific sections that a generic plan cannot cover.

---

## Engineering

### Context

Engineering onboarding has a well-defined leading indicator: time to first meaningful
code contribution. The milestones below balance learning the domain (codebase, systems,
team norms) with contributing early enough to validate understanding and build
confidence.

### Day 1-30: Learn the system

**Goals:**

| Goal | Done when |
|---|---|
| Development environment set up | Can run the full local stack without help |
| CI/CD pipeline understood | Can read a build log, identify a failure, and know who to ask |
| First pull request merged | Any PR - a doc fix, a small bug, a test - reviewed and merged |
| Codebase orientation complete | Can navigate the repo, identify the main modules, explain the data flow at a high level |
| On-call and incident process reviewed | Knows the severity levels, has read 2-3 post-mortems |
| Team ceremonies attended | Has attended standup, sprint planning, and at least one retro or design review |
| Read 3 architecture docs or RFCs | Can summarize the key design decisions and tradeoffs |

**30-day check: Is the engineer unblocked on their own?**
If they are still asking for help setting up their environment or finding files,
the onboarding plan needs adjustment - not the engineer.

---

### Day 31-60: Ship real work

**Goals:**

| Goal | Done when |
|---|---|
| First feature or fix shipped to production | A real user-facing or internal-facing change, no matter how small |
| Code reviewed by peers | Has given and received at least 5 code reviews |
| Debugging independently | Can triage a failing test or production error without being walked through the steps |
| Understands team's definition of done | Can articulate what a PR needs before it merges (tests, docs, monitoring, etc.) |
| Owns one backlog item end-to-end | From scoping to deployment, including writing the PR description and notifying stakeholders |
| Has a working relationship with their buddy | Buddy confirms the engineer is asking questions and unblocking themselves |

**60-day check: Is the engineer contributing independently?**
A healthy 60-day check means the manager is reviewing the engineer's work,
not holding their hand through it.

---

### Day 61-90: Own a domain

**Goals:**

| Goal | Done when |
|---|---|
| Owns a component, service, or area of the codebase | Team recognizes them as the go-to for questions in this area |
| Has proposed at least one improvement | Filed a ticket, written an RFC draft, or opened a discussion - not just noted verbally |
| On-call ready (if applicable) | Has been shadowed, understands escalation, and is added to rotation |
| Shipped a milestone-sized feature or project | Something that appears in a sprint demo or release note |
| 90-day self-assessment written | Written summary of what they learned, what they shipped, and where they need to grow |

**90-day check: Would you hire this person again?**
If yes, ramp is complete. If no, have a direct conversation about the gap before Day 90.

---

### Engineering anti-patterns to avoid

- **Skipping the small PR** - Some managers want new engineers to start on "real" work.
  The small PR is real work: it teaches the CI/CD pipeline, code review culture, and
  branch conventions. Do not skip it.
- **No production access in first 30 days** - If an engineer cannot read production logs
  or run a query against a staging database by Day 30, their ramp is already delayed.
- **Over-assigning to onboarding tasks** - New engineers do not need 10 hours of
  onboarding meetings. They need a codebase to explore and a task to work on by Day 3.

---

## Product

### Context

Product onboarding is harder to measure than engineering because outputs are less
binary. The milestones below focus on customer understanding, cross-functional
relationship building, and the first spec as a concrete artifact that proves comprehension.

### Day 1-30: Learn the customer and product

**Goals:**

| Goal | Done when |
|---|---|
| Completed 5+ customer interviews or call shadowing sessions | Can synthesize what customers say they want vs. what the data shows they need |
| Read all major strategy docs | Product vision, roadmap, positioning doc, last 3 quarterly reviews |
| Understands the data | Can run basic analytics queries or pull a product dashboard without help |
| Has met all key cross-functional partners | 1:1s with engineering lead, design lead, sales lead, marketing lead |
| Attended 3+ customer-facing meetings | Sales calls, customer success calls, user research sessions |
| First written artifact produced | A user interview summary, a competitive teardown, or a problem brief |

**30-day check: Can this PM articulate the customer problem in 3 sentences?**
If not, they need more customer exposure before moving to solution work.

---

### Day 31-60: Write and drive

**Goals:**

| Goal | Done when |
|---|---|
| First spec written and reviewed | A real PRD or spec for a real feature - reviewed by engineering and design, with feedback incorporated |
| Has run at least one discovery session | Independently facilitated a customer interview or usability test |
| Understands the team's delivery process | Can describe how a spec becomes a shipped feature at this company |
| Cross-functional relationships working | Engineering and design are proactively consulting them on decisions |
| Data-informed recommendation made | Has used product analytics to make or support a prioritization decision |

**60-day check: Is the PM driving, or being driven?**
A PM who is primarily receiving direction rather than giving it at Day 60 needs
coaching on ownership, not just more information.

---

### Day 61-90: Own a roadmap area

**Goals:**

| Goal | Done when |
|---|---|
| Owns a roadmap area or product vertical | Named as the DRI for a defined scope in the next quarter's plan |
| Has shipped a feature from their first spec | The feature their spec described is in production |
| Stakeholder trust established | Engineering, design, and leadership are treating them as the point of contact for their area |
| Has identified a gap in current strategy | Has documented a problem or opportunity not previously on the roadmap |
| 90-day retrospective presented | Has shared what they learned, what they shipped, and what they would do differently |

---

### Product anti-patterns to avoid

- **Too much strategy, too little customer** - New PMs get loaded with strategy docs and
  roadmap decks. Without customer interviews in Week 1, everything they read is abstract.
  Put customer calls first.
- **First spec is too big** - The first spec should be small enough to ship in one sprint.
  Large first specs get stuck in review and delay the feedback loop.
- **Skipping the data layer** - A PM who cannot pull their own analytics is dependent on
  engineers for every question. Invest in data access and SQL basics in the first two weeks.

---

## Sales

### Context

Sales onboarding has the clearest success metric (pipeline and closed revenue) but
the longest feedback delay. The milestones below create leading indicators - activities
that predict pipeline health before a deal closes.

### Day 1-30: Learn the product and the motion

**Goals:**

| Goal | Done when |
|---|---|
| Product certified | Has completed product training and passed certification quiz or demo eval |
| ICP understood | Can describe the ideal customer profile and why they buy |
| Shadowed 10+ calls | Has taken notes and debriefed on at least 10 calls across discovery, demo, and close stages |
| CRM mastered | Can log a call, update a deal stage, and generate a pipeline report without help |
| First solo discovery call completed | Has run a discovery call start to finish; recording reviewed with manager |
| Competitive landscape mapped | Can handle the top 3 objections about competitors without notes |

**30-day check: Can this rep tell the story?**
Have them deliver the core pitch and respond to the top 5 objections in a role-play.
If they cannot, they need more repetition before moving to live calls.

---

### Day 31-60: Build pipeline

**Goals:**

| Goal | Done when |
|---|---|
| Pipeline at 3x quota target | Has enough opportunities in flight to cover the quarter at expected close rates |
| First solo demo delivered | Has presented the product demo to a real prospect; manager or buddy attended and debriefed |
| Outbound sequence running | Has written and launched at least one outbound sequence; reply rate reviewed with manager |
| Discovery call volume at target | Running the weekly number of discovery calls set by the team target |
| First deal progressed to proposal stage | At least one deal has moved from discovery to a qualified proposal or contract |

**60-day check: Is the pipeline real?**
Review pipeline quality, not just quantity. Deals that have not had a second touch in
two weeks are stale and should not count toward the pipeline target.

---

### Day 61-90: Close and optimize

**Goals:**

| Goal | Done when |
|---|---|
| First deal closed (or on-track to close) | Has closed at least one deal, or has a deal in late stage with a signed commitment |
| Quota attainment forecast | Manager has a credible forecast that the rep will hit 70%+ of quota in Month 3 |
| Owns full sales motion independently | Can run discovery, demo, negotiation, and close without manager involvement |
| Identified one process improvement | Has surfaced a gap in the sales playbook, messaging, or tooling with a concrete suggestion |
| Onboarding feedback submitted | Has completed the 90-day survey and had a debrief conversation with manager |

---

### Sales anti-patterns to avoid

- **Live calls too late** - Waiting until Week 3-4 to put a rep on live calls delays the
  learning that only comes from real prospect interactions. Run a shadowed live call in
  Week 1; a solo call (with support) in Week 2.
- **Quota set too early** - Setting full quota in Month 1 creates pressure to skip
  learning and close prematurely. Ramp quotas (25% in Month 1, 50% in Month 2, 75%
  in Month 3, 100% in Month 4) give reps room to learn while maintaining accountability.
- **CRM discipline treated as optional** - Reps who do not log consistently during ramp
  never develop the habit. Make CRM hygiene a Day 1 expectation, not an afterthought.
- **No debrief culture** - The fastest learning in sales comes from structured call debriefs.
  If a manager is not reviewing recordings with new reps weekly, the feedback loop is broken.

---

## Adapting these templates

These templates cover the most common scenarios. To adapt for other roles:

1. Identify the role's primary output (code, specs, pipeline, content, analyses)
2. Find the leading indicator that predicts that output (first PR, first spec, first call)
3. Set milestones that prove the new hire can produce that output independently by Day 90
4. Add role-specific tooling, certifications, and relationship targets for each phase
5. Calibrate for seniority: senior hires should compress the learning phase and expand
   the ownership phase; junior hires may need a 120-day ramp instead of 90
