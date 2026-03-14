<!-- Part of the growth-hacking AbsolutelySkilled skill. Load this file when
     designing growth experiments, selecting a north star metric, running AARRR
     diagnostics, or building growth loop templates. -->

# Growth Frameworks Reference

Deep-dive templates and calculators for the core frameworks referenced in the
growth-hacking skill. Load this file when a task requires detailed framework
application rather than conceptual understanding.

---

## AARRR Diagnostic Template

Use this template to systematically audit which stage of the funnel is broken
before recommending a growth lever.

### Step 1 - Instrument the funnel

Map every measurable event to its AARRR stage:

| Stage | Key events to track | Benchmark to beat |
|---|---|---|
| Acquisition | Visits, signups, CAC by channel | CAC < LTV / 3 |
| Activation | % completing onboarding, time-to-aha | >30% reach aha in 24h |
| Retention | Day-1 / Day-7 / Day-30 active users | D30 >25% consumer, >40% B2B |
| Referral | Invites sent per user, K-factor | K > 0.3 meaningful, K > 1 viral |
| Revenue | MRR, LTV, LTV:CAC ratio | LTV:CAC > 3:1 |

### Step 2 - Identify the leakiest stage

Calculate the conversion rate between each adjacent stage:

```
Acquisition -> Activation conversion = activated_users / new_signups
Activation -> Retention conversion   = retained_day7_users / activated_users
Retention -> Referral conversion     = users_who_invited / retained_users
Retention -> Revenue conversion      = paying_users / activated_users
```

The stage with the lowest conversion rate OR the largest absolute user drop is
the bottleneck. Fix that stage first.

### Step 3 - Diagnose the bottleneck

**If Activation is broken:**
- Time-to-value is too long (reduce setup steps, add sample data)
- Aha moment is unclear to the user (add inline guidance, progress indicators)
- Onboarding asks for too much before delivering value (defer configuration)

**If Retention is broken:**
- Aha moment is not repeated in subsequent sessions (identify habit triggers)
- Product does not have a natural usage cadence (add notifications, streaks, digests)
- Users don't understand the full value of the product (feature discovery campaigns)

**If Referral is broken:**
- No sharing mechanics built into the product workflow
- Reward is not motivating enough or too hard to redeem
- Referral prompt fires at the wrong moment (too early, before aha)

**If Revenue is broken:**
- Upgrade trigger is unclear or not tied to the aha moment
- Pricing is misaligned with the user's value realization
- Free tier is too generous (no compelling reason to upgrade)

---

## ICE Scoring Template

Use ICE to stack-rank a backlog of growth experiments before each sprint.

### Scoring rubric

**Impact (1-10):** Estimated effect on the north star metric if the experiment succeeds.

| Score | Meaning |
|---|---|
| 9-10 | Could move the metric by >20% |
| 6-8 | Could move the metric by 5-20% |
| 3-5 | Could move the metric by 1-5% |
| 1-2 | Marginal effect (<1%) |

**Confidence (1-10):** How certain are you the experiment will produce a positive result?

| Score | Meaning |
|---|---|
| 9-10 | Strong data or validated analogues from similar products |
| 6-8 | Qualitative user research supports the hypothesis |
| 3-5 | Educated guess, no direct evidence |
| 1-2 | Gut feel only |

**Ease (1-10):** How quickly and cheaply can you run this experiment?

| Score | Meaning |
|---|---|
| 9-10 | Copy/config change, ship in < 1 day |
| 6-8 | Small engineering task, ship in 1-3 days |
| 3-5 | Medium feature work, 1-2 week sprint |
| 1-2 | Major engineering effort, > 2 weeks |

### ICE scoring sheet

```
Experiment: _______________________________________________
Hypothesis: If we [change], then [metric] will [increase/decrease]
            because [reason], as evidenced by [data or analogue].

Impact score:     ___ / 10   Reason: ___________________
Confidence score: ___ / 10   Reason: ___________________
Ease score:       ___ / 10   Reason: ___________________

ICE Score = (Impact + Confidence + Ease) / 3 = ___

Primary metric:   ___________________
Secondary metric: ___________________
Baseline:         ___________________
Minimum detectable effect: ___ %
Required sample size:      ___
Experiment duration:       ___ days
```

### Post-experiment log

```
Result:    [ ] Win   [ ] Loss   [ ] Inconclusive
Outcome:   Primary metric moved from ___ to ___
Learning:  ___________________________________________________
Next step: [ ] Ship it   [ ] Iterate   [ ] Kill it
```

---

## North Star Metric Selection Guide

### Criteria for a good north star metric

A north star metric must satisfy all five criteria:

1. **Leads revenue** - Correlates strongly with long-term MRR or LTV (not a vanity metric)
2. **Reflects user value** - Goes up when users get more value from the product
3. **Measurable** - Can be instrumented precisely and tracked in real time
4. **Actionable** - The team can run experiments that directly move it
5. **Lagging indicator of acquisition** - Not just "signups" (acquisition is an input, not a north star)

### Selection process

**Step 1 - List candidate metrics.** Brainstorm 5-10 metrics that could reflect your
product's core value delivery. Examples: messages sent, files created, reports
generated, tasks completed, bookings made.

**Step 2 - Run the "would you trade" test.** For each candidate, ask: "Would you
trade 10% more signups for 5% more [metric]?" If yes, the metric reflects deeper
value than acquisition.

**Step 3 - Run the retention correlation test.** Pull cohorts of users who did vs
did not hit the candidate metric in week 1. If the cohort that hit the metric shows
materially better Day-30 retention, it is a strong north star candidate.

**Step 4 - Decompose into inputs.** A good north star decomposes into 3-5 input
metrics the team can own. If you can't decompose it, it is too abstract.

```
North Star: [Weekly active teams using core feature]
   |
   +-- Input 1: New teams completing onboarding (Activation team)
   +-- Input 2: Existing teams returning weekly (Retention team)
   +-- Input 3: Teams expanding feature usage depth (Expansion team)
```

### Common north star metrics by product type

| Product type | Example north star |
|---|---|
| Collaboration SaaS | Active collaborators per workspace per week |
| Marketplace | Successful transactions per week |
| Consumer social | Daily active users who posted or commented |
| Developer tool | Projects with > 1 deploy per week |
| E-learning | Lessons completed per active learner per week |
| Healthcare | Appointments booked and attended per month |

---

## Growth Loop Templates

### Template 1 - Viral invitation loop

```
[Existing user] --invites--> [New prospect]
      ^                             |
      |                         signs up
      |                             |
      +---- creates value <-- reaches aha moment
```

**Key metric to optimize:** Invite acceptance rate
**Lever:** Reward structure, invite copy, landing page relevance

### Template 2 - Content / SEO loop

```
[User creates content] --> [Content indexed by search]
         ^                          |
         |                   [New user discovers]
         |                          |
    creates more content <-- signs up and engages
```

**Key metric to optimize:** Content creation rate per active user
**Lever:** Make content creation a natural output of using the product (not an extra step)

### Template 3 - Paid acquisition loop

```
[Revenue] --> [Ad spend] --> [New user acquisition]
    ^                                  |
    |                           activation
    |                                  |
    +----------- LTV expansion <-- retention
```

**Key metric to optimize:** LTV:CAC ratio (must stay > 3:1 for the loop to be healthy)
**Lever:** Improve LTV via retention and expansion; reduce CAC via conversion rate optimization

### Template 4 - Product-embedded sharing loop

```
[User produces artifact] --> [Artifact shared externally]
          ^                              |
          |                    [External viewer sees it]
          |                              |
    produces more <-- signs up to create their own
```

**Examples:** Loom video links, Figma share links, Notion pages, Typeform results
**Key metric to optimize:** Share rate (% of users who share an artifact externally)
**Lever:** Make sharing a natural part of the workflow; add "powered by" attribution
           to shared artifacts so viewers know where it came from

---

## Viral Coefficient Calculator

```
K = i * c

Where:
  i = average number of invites sent per active user per period
  c = conversion rate of those invites to new signups (0.0 to 1.0)

Example:
  i = 3 invites/user
  c = 0.25 (25% of invitees sign up)
  K = 3 * 0.25 = 0.75

Interpretation:
  K >= 1.0  -> Viral growth: product grows without any external acquisition
  K = 0.5   -> Strong WOM: every 2 users bring 1 more; good supplement to paid
  K = 0.1   -> Weak WOM: negligible organic amplification
```

### Improving K-factor

To raise K without degrading user experience:

1. **Increase invite intent (raise i):** Move the referral prompt to post-aha moment,
   not post-signup. Users who have experienced value are 3-5x more likely to share.

2. **Increase invite conversion (raise c):** Personalize the invite (sent from a real
   person's name), make the landing page reflect the context of the invite, offer
   a double-sided reward.

3. **Reduce invite friction:** One-click share, pre-written message, multiple channels
   (email, Slack, link copy). Each additional step in the sharing flow reduces i.
