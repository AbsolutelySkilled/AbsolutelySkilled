<!-- Part of the customer-research AbsolutelySkilled skill. Load this file when
     setting up, analyzing, or interpreting behavioral analytics data. -->

# Behavioral Analytics Reference

## Metrics frameworks

### AARRR (Pirate Metrics)

A funnel-shaped framework for tracking the full customer lifecycle:

| Stage | Question | Example metrics |
|---|---|---|
| **Acquisition** | How do users find us? | Signups by channel, landing page conversion |
| **Activation** | Do they have a good first experience? | Completed onboarding, first key action |
| **Retention** | Do they come back? | DAU/MAU, Day 7/30 retention, cohort curves |
| **Revenue** | Do they pay? | Conversion to paid, ARPU, expansion revenue |
| **Referral** | Do they tell others? | Invite rate, viral coefficient, NPS |

Use AARRR to identify which stage has the biggest drop-off. Fix that stage first.

### North Star Metric

A single metric that best captures the core value your product delivers to customers.

Criteria for a good North Star:
1. **Reflects customer value** - Not revenue or vanity (page views)
2. **Leading indicator** - Predicts future business outcomes
3. **Actionable** - Teams can influence it through product changes
4. **Measurable** - Can be tracked reliably with existing instrumentation

Examples:
- Slack: messages sent per organization per week
- Airbnb: nights booked
- Spotify: time spent listening
- Notion: active team blocks created

### Input metrics

Break the North Star into 3-5 input metrics that drive it:

```
North Star: Weekly active projects (for a project management tool)

Input metrics:
  1. New projects created per week (creation)
  2. Collaborators added per project (collaboration)
  3. Tasks completed per project per week (engagement depth)
  4. Return rate of project owners within 7 days (retention)
```

Each input metric should be owned by a specific team and have a target.

## Activation analysis

### Defining the activation event

The activation event is the action that signals a user has experienced the core
value of your product. It is the strongest early predictor of long-term retention.

Finding it:
1. List all actions a user can take in the first 7 days
2. For each action, calculate Day 30 retention rate for users who did vs. did not
   perform it
3. The action with the highest retention lift is your activation event
4. Validate: does it make intuitive sense? Does it reflect real value delivery?

### Activation funnel

Map every step from signup to activation event. Measure drop-off at each step:

```
Step 1: Sign up                    100%
Step 2: Verify email                85%  (-15%)
Step 3: Complete profile setup      62%  (-23%)  <-- biggest drop-off
Step 4: Create first [object]       48%  (-14%)
Step 5: Invite a teammate           31%  (-17%)
Step 6: Complete first workflow     24%  (-7%)   = activation
```

Fix the step with the biggest absolute drop-off first (Step 3 in this example).

### Time-to-activate

Track the median time from signup to activation. Shorter is better. Benchmark
against your own historical data. If time-to-activate is increasing, onboarding
is getting worse even if total activation rate holds steady.

## Retention analysis

### Retention curve types

**N-day retention** - What % of users who signed up on Day 0 are active on Day N?
- Day 1 retention: immediate engagement signal
- Day 7 retention: habit formation signal
- Day 30 retention: product-market fit signal

**Unbounded retention (rolling)** - What % of users who signed up on Day 0 were
active at any point during the Day N-to-Day N+7 window? More forgiving than
N-day; better for products with irregular usage patterns.

**Bracket retention** - What % of users are active in Week 1, Week 2, Week 3, etc.?
Groups time into buckets. Good for weekly-use products.

### Reading retention curves

A healthy retention curve flattens over time (asymptote). An unhealthy curve
continues to decline toward zero.

```
Healthy:    100% -> 40% -> 28% -> 22% -> 20% -> 19% -> 19%  (flattens at ~19%)
Unhealthy:  100% -> 30% -> 15% -> 8%  -> 4%  -> 2%  -> 1%   (never flattens)
Improving:  Newer cohorts flatten at a higher % than older cohorts
```

If the curve never flattens, you have a retention problem that no amount of
acquisition can fix. Focus on product-market fit before scaling acquisition.

### Cohort analysis

Always analyze retention by cohort (the week or month users signed up). This
reveals whether the product is getting better or worse over time.

Structure a cohort table:

```
              Week 0   Week 1   Week 2   Week 3   Week 4
Jan cohort     100%     35%      22%      18%      16%
Feb cohort     100%     38%      25%      20%      --
Mar cohort     100%     42%      28%      --       --
Apr cohort     100%     45%      --       --       --
```

Read diagonals for "what happened this week across all cohorts?" (useful for
detecting the impact of a release or outage). Read rows for "how does this cohort
age?" (useful for comparing cohort quality over time).

## Funnel analysis

### Designing a funnel

1. **Define the goal** - What is the desired end action? (e.g., completed purchase,
   activated account, submitted form)
2. **Map the steps** - List every required step in order from entry to goal
3. **Set the conversion window** - How long does a user have to complete the funnel?
   (e.g., within one session, within 7 days)
4. **Choose strict vs. loose** - Strict: steps must happen in exact order. Loose:
   steps can happen in any order. Strict is more accurate for linear flows.

### Funnel metrics

| Metric | Definition | Why it matters |
|---|---|---|
| Step conversion rate | % who complete step N given they completed step N-1 | Identifies the weakest step |
| Overall conversion rate | % who complete the final step given they entered step 1 | Top-line funnel health |
| Drop-off rate | 1 - step conversion rate | Where users abandon |
| Time between steps | Median time from step N to step N+1 | Identifies friction or confusion |
| Funnel velocity | Median time from entry to completion | Overall flow efficiency |

### Diagnosing drop-off

When a step has high drop-off:
1. **Segment** - Is drop-off universal or concentrated in a specific segment?
2. **Session replay** - Watch recordings of users who dropped off at that step
3. **Exit survey** - Trigger a one-question survey when users abandon
4. **Hypothesis** - Form 2-3 hypotheses for why users drop off
5. **Qualitative validation** - Run 3-5 interviews with users who dropped off
6. **Experiment** - A/B test the top hypothesis

## Feature adoption analysis

### Measuring adoption

| Metric | Formula | Use |
|---|---|---|
| Adoption rate | Users who used feature / Total active users | Overall penetration |
| Adoption breadth | Features used per user per period | Engagement depth |
| Time to first use | Median days from signup to first feature use | Discovery speed |
| Sticky feature ratio | Users who use feature in 2+ of last 4 weeks / Users who ever used it | Habit strength |

### Feature-retention correlation

For each feature, calculate:
1. Day 30 retention for users who adopted the feature
2. Day 30 retention for users who did not adopt the feature
3. Retention lift = (1) - (2)

Rank features by retention lift. The features with the highest lift are your
product's core value drivers - protect them and promote adoption.

**Caution**: Correlation is not causation. Power users adopt more features AND
retain better, but forcing feature adoption may not cause retention. Validate
with qualitative research before building "feature nudge" campaigns.

## Tool-agnostic implementation

### Event taxonomy

Define a consistent naming convention for all tracked events:

```
Format: [Object]_[Action]

Examples:
  project_created
  project_viewed
  task_completed
  invite_sent
  report_exported
  subscription_upgraded
```

Rules:
- Use snake_case consistently
- Object first, then action (past tense)
- Include properties as structured key-value pairs, not in the event name
- Document every event in a tracking plan spreadsheet before implementation

### Essential event properties

Every event should carry:
- `user_id` - Unique identifier for the user
- `timestamp` - ISO 8601 format
- `session_id` - Groups events within a session
- `platform` - web, ios, android, api
- `plan_tier` - For segmented analysis

Feature-specific events add:
- `object_id` - The entity being acted on
- `source` - Where the user came from (navigation path, notification, search)
- `duration_ms` - For time-based interactions

### Data quality checklist

- [ ] All critical funnel events are instrumented and firing
- [ ] Event properties match the tracking plan schema
- [ ] No duplicate events (check for double-firing on page load)
- [ ] User identity is resolved across devices (if applicable)
- [ ] Historical data backfill covers at least 90 days before analysis
- [ ] Bot / test traffic is filtered from production data
