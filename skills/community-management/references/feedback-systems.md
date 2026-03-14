<!-- Part of the community-management AbsolutelySkilled skill. Load this file when
     working with feedback collection, surveys, NPS, or feedback routing systems. -->

# Feedback Systems

## Feedback collection methods

### Structured feedback channels

| Method | Frequency | Best for | Response rate benchmark |
|---|---|---|---|
| NPS survey | Quarterly | Overall sentiment | 20-40% |
| Pulse survey (3-5 questions) | Monthly | Specific topics | 15-30% |
| Feature request board | Always-on | Product input | N/A (track submissions) |
| Bug report form | Always-on | Issue collection | N/A (track submissions) |
| Post-event survey | After each event | Event quality | 30-50% |
| Annual community survey | Yearly | Deep strategic input | 10-20% |

<!-- VERIFY: Response rate benchmarks are general estimates for online communities.
     Actual rates depend heavily on community size, engagement level, and survey
     distribution method. -->

### Unstructured feedback signals

| Signal | Where to find it | How to process |
|---|---|---|
| Sentiment in posts | Forum threads, chat channels | Weekly keyword + tone scan |
| Support requests | Help channels, DMs to mods | Categorize and count themes monthly |
| Exit signals | Lapsed member behavior, unsubscribes | Track patterns, trigger outreach |
| External mentions | Social media, review sites | Monthly brand monitoring scan |
| Event chat | Live event Q&A, chat during sessions | Capture and categorize within 48 hours |

## Survey templates

### Monthly pulse survey (5 questions)

```
1. How would you rate your experience in [community] this month? (1-5 stars)

2. What was the most valuable thing you got from the community this month?
   [Open text, optional]

3. Is there anything that frustrated you or felt missing?
   [Open text, optional]

4. How likely are you to recommend [community] to a colleague? (0-10 NPS)

5. What topic should we focus on next month?
   [ ] Option A
   [ ] Option B
   [ ] Option C
   [ ] Other: ___
```

### Post-event survey (4 questions)

```
1. How would you rate today's [event name]? (1-5 stars)

2. What was the most useful takeaway?
   [Open text]

3. What would make this event better next time?
   [Open text]

4. Would you attend a follow-up session on this topic?
   [ ] Yes, definitely
   [ ] Maybe, depends on timing
   [ ] No, I got what I needed
```

### Annual community survey (10-12 questions)

```
1. How long have you been a member? [Multiple choice: ranges]

2. How often do you visit the community? [Multiple choice: daily/weekly/monthly/rarely]

3. What's your primary reason for being in this community?
   [ ] Learning and professional development
   [ ] Networking with peers
   [ ] Getting help with specific problems
   [ ] Staying up to date with trends
   [ ] Contributing and giving back
   [ ] Other: ___

4. Which community activities do you find most valuable? (Select top 3)
   [ ] Discussion threads
   [ ] Events and webinars
   [ ] Resource library
   [ ] Q&A / help channels
   [ ] Networking opportunities
   [ ] Member spotlights / showcases

5. How would you rate the quality of discussions? (1-5)

6. How would you rate the responsiveness of the community? (1-5)

7. How would you rate the moderation? (1-5)

8. What's the ONE thing you'd change about this community?
   [Open text]

9. What topics or content would you like to see more of?
   [Open text]

10. How likely are you to recommend this community? (0-10 NPS)

11. Any other feedback?
    [Open text, optional]
```

## NPS implementation

### Calculating NPS

- Promoters: respondents scoring 9-10
- Passives: respondents scoring 7-8
- Detractors: respondents scoring 0-6
- NPS = % Promoters - % Detractors (range: -100 to +100)

### NPS benchmarks for communities

| NPS range | Interpretation | Action |
|---|---|---|
| 50+ | Excellent | Maintain and optimize |
| 30-49 | Good | Identify what's working and do more of it |
| 10-29 | Average | Investigate detractor feedback for improvement areas |
| Below 10 | Concerning | Urgent deep-dive into member satisfaction issues |

### NPS follow-up strategy

- **Promoters (9-10)**: Ask "What do you love most?" and "Would you be interested in our ambassador program?" These are your advocate pipeline.
- **Passives (7-8)**: Ask "What would make this a 9 or 10?" Small improvements convert passives to promoters.
- **Detractors (0-6)**: Ask "What disappointed you?" and follow up personally within 48 hours. Detractor recovery has outsized impact on retention.

## Feature request board

### Structure

Set up a board (Canny, ProductBoard, or simple forum category) with:

- **Submission template**: Title, description, use case ("I want to [action] so that [benefit]")
- **Voting**: Members can upvote requests (one vote per request per member)
- **Status labels**: Under Review, Planned, In Progress, Shipped, Won't Do
- **Admin response**: Every request gets an acknowledgment within 5 business days

### Prioritization framework

Score feature requests using:

| Factor | Weight | Scale |
|---|---|---|
| Vote count | 30% | Normalize to 1-5 based on your community's vote distribution |
| Strategic alignment | 25% | 1-5 rated by product team |
| Implementation effort | 20% | Inverse: 5 = easy, 1 = massive effort |
| Requester profile | 15% | Weight higher if from power users or paying customers |
| Recency | 10% | Bonus for recently active requests vs old stale ones |

## Feedback routing architecture

Define where each type of feedback goes:

```
Community Feedback
|
|-- Feature Requests
|   |-- High vote count (top 10%) --> Product backlog (high priority)
|   |-- Medium votes --> Product backlog (normal priority)
|   |-- Low votes --> Monthly review queue
|
|-- Bug Reports
|   |-- Critical (blocking, data loss) --> Engineering on-call (immediate)
|   |-- Major (broken feature) --> Engineering triage (48 hours)
|   |-- Minor (cosmetic, edge case) --> Engineering backlog
|
|-- Sentiment Signals
|   |-- Positive trends --> Marketing team (testimonials, case studies)
|   |-- Negative trends --> Community lead + product lead (weekly review)
|   |-- Crisis signals --> Escalation to leadership (immediate)
|
|-- Strategic Insights
|   |-- Market trends --> Product strategy review (quarterly)
|   |-- Competitive intel --> Product + marketing (as received)
|   |-- Use case evolution --> Product roadmap input (quarterly)
```

## Closing the feedback loop

### The "You asked, we did" post

Publish monthly. Template:

```
# You Asked, We Did - [Month Year]

Here's what changed this month based on your feedback:

## Shipped
- [Feature/change] - Requested by [N] members. [Brief description of what changed.]
- [Feature/change] - [Brief description.]

## In Progress
- [Feature/change] - Currently being built. Expected [timeline].
- [Feature/change] - In design phase. Will share preview next month.

## Under Review
- [Feature/change] - [N] votes. We're evaluating feasibility.

## Decided Against (with explanation)
- [Feature/change] - After review, we decided not to pursue this because [honest reason].
  Alternative approach: [if applicable].

---

Keep the feedback coming! Submit ideas: [link]
Your input directly shapes what we build.
```

### Quarterly roadmap preview

Share a high-level roadmap showing:
- What's planned for next quarter
- Which items were influenced by community feedback (call this out explicitly)
- Where members can provide input on prioritization

## Feedback health metrics

Track monthly:

| Metric | What it tells you | Target |
|---|---|---|
| Feedback volume | Are members willing to share input? | Stable or growing month-over-month |
| Time to acknowledgment | Do members feel heard? | Under 5 business days |
| Feedback-to-action rate | Is feedback actually being used? | 15-25% of requests acted on within 90 days |
| Survey response rate | Is survey fatigue setting in? | Above 15% for pulse surveys |
| NPS trend | Is overall sentiment improving? | Upward or stable quarter-over-quarter |
| Closed-loop rate | Are you telling members what happened? | 100% of shipped items mentioned in "You asked, we did" |
