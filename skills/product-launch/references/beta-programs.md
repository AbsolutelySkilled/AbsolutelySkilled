<!-- Part of the product-launch AbsolutelySkilled skill. Load this file when
     working with beta programs, early access, or user feedback collection. -->

# Beta Programs

A beta program is a structured feedback loop with real users. The goal is to validate
assumptions, find critical issues, and build confidence before general availability.
This reference covers program design, recruitment, feedback collection, and graduation.

---

## Beta Program Structure

### Phase Model

Most products benefit from a two-phase beta:

```
Closed Beta (4-6 weeks)
  - 20-50 hand-picked users
  - High-touch: weekly check-ins, dedicated Slack channel
  - Goal: Find critical bugs, validate core workflow
  - Exit criteria: Zero P0 bugs, core workflow completion rate > 80%

Open Beta (2-4 weeks)
  - 200-1000 self-service sign-ups
  - Low-touch: in-app feedback widget, community forum
  - Goal: Stress-test at scale, validate onboarding, collect usage patterns
  - Exit criteria: Error rate < 0.5%, onboarding completion > 60%, NPS > 30
```

### Beta Goals Template

Define 3-5 specific questions the beta will answer:

```
1. Can users complete [core workflow] without assistance?
   Metric: Unassisted completion rate > 80%

2. Is the onboarding flow intuitive?
   Metric: Time-to-first-value < 10 minutes

3. Does the system handle real-world data patterns?
   Metric: Zero data corruption or loss incidents

4. What are the top 3 feature requests?
   Metric: Categorized feedback from 50+ users

5. Is the product stable under concurrent usage?
   Metric: p99 latency < 500ms at 100 concurrent users
```

---

## Recruitment

### Criteria Matrix

Score potential beta users on fit:

| Criterion | Weight | Description |
|---|---|---|
| ICP match | High | Matches your target audience profile |
| Technical sophistication | Medium | Can provide detailed, actionable feedback |
| Engagement likelihood | High | Has responded to previous communications or is an active community member |
| Use case diversity | Medium | Represents a different workflow or industry from other participants |
| Reference potential | Low | Willing to be a public case study or reference |

### Recruitment Channels

Ranked by quality of participants:

1. **Existing power users** - Already trust you, provide the best feedback
2. **Waitlist sign-ups** - Self-selected interest, high engagement
3. **Community members** - Active in your Discord/Slack/forum
4. **Social media followers** - Broader reach, lower engagement rate
5. **Cold outreach** - Targeted emails to ICP-matching companies

### Recruitment Email Template

```
Subject: You're invited to beta test [Product] - [one-line benefit]

Hi [Name],

We're building [product] to solve [problem], and we'd love your feedback
before we launch publicly.

As a beta tester, you'll get:
- Early access to [product] starting [date]
- Direct line to our product team via a private Slack channel
- [Incentive: e.g., 3 months free, lifetime discount, swag]

What we ask in return:
- Use [product] for [specific workflow] at least [frequency]
- Complete a 5-minute feedback survey each week
- Report any bugs or issues you encounter

The beta runs from [start date] to [end date]. Interested?

[CTA button: Join the Beta]
```

---

## Onboarding Beta Users

### Day-1 Welcome Kit

Send immediately upon access:

1. **Welcome email** with login credentials and getting-started link
2. **Quick-start guide** (5 minutes to first value)
3. **Known limitations** document - set expectations early
4. **Feedback channels** - where to report bugs, request features, ask questions
5. **Beta agreement** - expectations, NDA (if needed), timeline

### Slack/Discord Channel Structure

```
#beta-announcements  - Product team posts updates (read-only for users)
#beta-feedback       - Users share feedback, vote on ideas
#beta-bugs           - Bug reports with reproduction steps
#beta-general        - Open discussion, questions, tips
```

---

## Feedback Collection

### Weekly Survey Template

Keep it short (under 5 minutes). Rotate questions to avoid fatigue.

**Core questions (every week):**
1. How would you rate your experience this week? (1-5)
2. Did you encounter any bugs or issues? (Yes/No + description)
3. What is the ONE thing we should improve next?

**Rotating questions (pick 2 per week):**
- How easy was it to [specific feature]? (1-5)
- Compared to your current tool, how does [product] perform? (Much worse to Much better)
- Would you recommend [product] to a colleague? (0-10 NPS)
- What feature are you most excited about?
- What almost made you stop using [product]?

### Feedback Categorization

Tag all feedback into these buckets:

| Category | Action | Priority |
|---|---|---|
| Bug - P0 (data loss, crash) | Fix immediately | Blocker for GA |
| Bug - P1 (broken workflow) | Fix before GA | High |
| Bug - P2 (cosmetic, edge case) | Fix if time allows | Medium |
| Feature request | Add to backlog, cluster by theme | Evaluate |
| UX friction | Investigate, may fix before GA | High |
| Positive feedback | Share with team, use in marketing | Low (but valuable) |
| Out of scope | Acknowledge, explain timeline | Low |

### Usage Analytics to Track

Instrument these events during beta:

```
- account_created (timestamp, source)
- onboarding_started / onboarding_completed (timestamp, duration)
- core_action_performed (action_type, timestamp, success/failure)
- feature_used (feature_name, timestamp, duration)
- error_encountered (error_type, timestamp, user_action)
- session_started / session_ended (duration, pages_viewed)
- feedback_submitted (type, sentiment_score)
```

---

## Exit Criteria and Graduation

### Go/No-Go Checklist

Before graduating from beta to GA, verify:

- [ ] All P0 bugs resolved
- [ ] All P1 bugs resolved or have documented workarounds
- [ ] Core workflow completion rate > target (e.g., 80%)
- [ ] Onboarding completion rate > target (e.g., 60%)
- [ ] Error rate < target (e.g., 0.5%)
- [ ] NPS > target (e.g., 30)
- [ ] Support documentation covers top 10 beta questions
- [ ] Performance meets SLA under expected GA load
- [ ] Beta users notified of GA timeline and any changes

### Communicating Beta End

```
Subject: [Product] beta is graduating - here's what's next

Hi [Name],

Thank you for being part of our beta program! Your feedback directly shaped
[product] - here are the top 3 changes we made based on your input:

1. [Change based on feedback]
2. [Change based on feedback]
3. [Change based on feedback]

What happens next:
- [Product] launches publicly on [date]
- Your account transitions automatically - no action needed
- As a beta tester, you get [incentive: e.g., 6 months free, special badge]

Thank you for helping us build something better.
```

---

## Beta Anti-patterns

- **Too many users, too early** - 500 users in closed beta produces overwhelming
  noise. Start with 20-50 and add more as you fix initial issues.
- **No feedback structure** - "Let us know what you think" produces nothing. Use
  specific, weekly surveys with concrete questions.
- **Ignoring feedback** - If beta users report issues that are not addressed or
  acknowledged, they disengage. Close the loop on every report.
- **Indefinite beta** - A beta without an end date signals lack of confidence.
  Set a fixed duration and stick to it (extend only with clear rationale).
- **Beta as free tier** - Some users join betas for free access with no intention
  of providing feedback. Screen for engagement likelihood.
