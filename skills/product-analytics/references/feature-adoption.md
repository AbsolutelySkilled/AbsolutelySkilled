<!-- Part of the Product Analytics AbsolutelySkilled skill. Load this file when
     working with feature adoption measurement, launch metrics, or feature lifecycle. -->

# Feature Adoption

Deep reference for measuring feature adoption throughout the lifecycle - from launch
through maturity or deprecation. Covers the adoption funnel, scorecards, launch
metrics, kill criteria, and benchmarks by product category.

---

## The Adoption Lifecycle

Feature adoption is not binary ("used" vs. "not used"). It progresses through four
stages, each requiring different measurement and different interventions.

### Stage 1: Awareness

**Definition:** The user knows the feature exists. They have been exposed to it
through in-app discovery surfaces, announcements, tooltips, or onboarding.

**Metric:** `Awareness rate = Users exposed to feature / Eligible users`

**Eligible users:** Not all users should see every feature. Define eligibility based
on plan tier, role, platform, or prerequisite actions. Using "all users" as the
denominator deflates awareness rate for features behind plan gates.

**How to track:**
- Impression events on feature entry points (buttons, menu items, tooltips)
- Email/notification open events for feature announcements
- Onboarding step completion events that introduce the feature

**Interventions for low awareness:**
- Add feature to onboarding flow
- Create in-app announcements or spotlights
- Add contextual tooltips at the point of need
- Send targeted email campaigns to eligible non-aware users

---

### Stage 2: Activation (Trial)

**Definition:** The user has tried the feature at least once. This is first meaningful
interaction, not a hover or tooltip dismissal.

**Metric:** `Trial rate = Users who performed feature action / Aware users`

**How to define "tried":**
- The user completed the core action of the feature (not just opened the modal)
- Example: For a "Smart Filters" feature, trial = applied at least one filter, not
  just opened the filter panel

**Interventions for low trial:**
- Reduce friction to first use (pre-fill, templates, defaults)
- Improve value proposition copy on the entry point
- Add interactive walkthroughs or guided experiences
- Remove unnecessary steps before the core action

---

### Stage 3: Engagement (Repeat Use)

**Definition:** The user has used the feature multiple times, indicating it provides
ongoing value beyond initial curiosity.

**Metric:** `Repeat rate = Users with 3+ uses in 14 days / Users who tried once`

**Why 3+ in 14 days?** A single repeat could be accidental. Three uses within two
weeks suggests intentional repeated engagement. Adjust the threshold based on expected
feature frequency - a weekly reporting feature might use "2+ uses in 30 days."

**Interventions for low repeat rate:**
- Investigate first-use experience quality (was it confusing or buggy?)
- Check whether the feature solved the user's problem on first try
- Add follow-up prompts reminding users the feature exists for subsequent tasks
- Improve the feature's output quality or speed

---

### Stage 4: Habitual Use

**Definition:** The feature is part of the user's regular workflow. They use it
consistently over multiple weeks or months.

**Metric:** `Habitual rate = Users with weekly usage for 4+ consecutive weeks / Repeat users`

**Interpretation:** Habitual users are the feature's true adopters. They are the
users to interview for improvement ideas, and their usage patterns should inform
the feature roadmap.

**Interventions for low habitual rate:**
- The feature may solve a one-time need (not inherently habitual)
- Check if the feature creates output that drives return visits
- Add integrations that embed the feature into existing workflows
- Consider whether the feature should be repositioned or merged into another flow

---

## Feature Adoption Scorecard

Track all four stages in a single view to diagnose adoption health at a glance.

### Template

```
Feature: [Feature Name]
Launch date: [YYYY-MM-DD]
Eligible users: [Count and definition]
Measurement period: [Date range]

| Stage    | Metric          | Value  | Target | Status |
|----------|-----------------|--------|--------|--------|
| Aware    | Exposure rate   | 72%    | >80%   | Below  |
| Trial    | First-use rate  | 48%    | >40%   | Met    |
| Repeat   | 3+ uses / 14d  | 29%    | >30%   | Below  |
| Habitual | Weekly 4+ weeks | 61%    | >50%   | Met    |
| Overall  | End-to-end      | 6.1%   | >10%   | Below  |

Bottleneck: Awareness (72% vs. 80% target)
Action: Increase in-app feature surface visibility; add contextual tooltip.
```

### How to calculate overall adoption

```
Overall adoption = Awareness * Trial * Repeat * Habitual
Example: 0.72 * 0.48 * 0.29 * 0.61 = 6.1%
```

The overall number is useful for comparison across features, but the stage-level
breakdown is where actionable insight lives.

---

## Launch Metrics

When launching a new feature, define success criteria before launch and measure at
predefined checkpoints.

### Pre-launch checklist

1. Define eligible user population
2. Set instrumentation: awareness event, core action event, error event
3. Define the activation event (what counts as "tried the feature")
4. Set targets for each adoption stage at Day 7, Day 30, and Day 90
5. Define guardrail metrics (error rate, support tickets, page load time)
6. Agree on kill criteria (see below)

### Checkpoint cadence

| Checkpoint | When | What to evaluate |
|---|---|---|
| Day 1 | 24 hours post-launch | Error rates, crash rates, page load impact |
| Day 7 | 1 week post-launch | Awareness rate, trial rate, first-use completion |
| Day 30 | 1 month post-launch | Repeat rate, early habitual signals, support ticket volume |
| Day 90 | 3 months post-launch | Full adoption scorecard, habitual rate, impact on NSM |

### Comparing new vs. existing user adoption

New users encountering the feature during onboarding and existing users discovering
it later adopt at different rates and for different reasons. Always segment:

| Segment | Typical pattern |
|---|---|
| New users (onboarding) | Higher awareness (shown in flow), lower trial (overwhelmed) |
| Existing users (discovery) | Lower awareness (must find it), higher trial (self-selected interest) |

---

## Kill Criteria

Not every feature should persist. Define criteria before launch that trigger a
deprecation discussion.

### When to consider killing a feature

| Signal | Threshold | Action |
|---|---|---|
| Overall adoption below target at Day 90 | <50% of target | Investigate causes; if no clear fix, deprecate |
| Trial rate below 10% | <10% of aware users try it | Value proposition is not compelling; redesign or kill |
| Habitual rate below 20% | <20% of repeat users stick | Feature solves a one-time need or has quality issues |
| Support ticket spike | >2x baseline in feature area | Feature is confusing or buggy; fix or pull back |
| Negative impact on guardrails | Any guardrail regression | Roll back immediately; investigate before re-launch |

### Deprecation process

1. Confirm the decision with adoption data and qualitative feedback
2. Communicate timeline to habitual users (give 30+ days notice)
3. Provide migration path if the feature stored user data
4. Monitor for churn among habitual users during wind-down
5. Remove instrumentation and clean up code after full deprecation

---

## Benchmarks by Product Category

Adoption benchmarks vary significantly by product type, feature type, and whether
the feature is core or peripheral.

### Core feature adoption (expected as part of main workflow)

| Product category | Awareness | Trial | Repeat | Habitual |
|---|---|---|---|---|
| SaaS productivity | >90% | >60% | >50% | >40% |
| E-commerce | >85% | >50% | >30% | >20% |
| Mobile social | >95% | >70% | >60% | >50% |
| Developer tools | >80% | >55% | >45% | >35% |

### Peripheral feature adoption (optional, enhances main workflow)

| Product category | Awareness | Trial | Repeat | Habitual |
|---|---|---|---|---|
| SaaS productivity | >60% | >30% | >20% | >15% |
| E-commerce | >50% | >25% | >15% | >10% |
| Mobile social | >70% | >40% | >25% | >15% |
| Developer tools | >50% | >25% | >20% | >12% |

<!-- VERIFY: These benchmarks are synthesized from general industry patterns and
     published reports. Actual benchmarks vary significantly by specific product,
     market, and user segment. Use as directional guidance, not hard targets. -->

---

## Feature Adoption vs. Feature Usage

A common mistake is conflating adoption with usage. They are related but distinct.

| Concept | What it measures | Example |
|---|---|---|
| Feature adoption | Whether users integrate the feature into their workflow | 15% of eligible users use Smart Filters weekly |
| Feature usage | How much the feature is used in aggregate | Smart Filters applied 50,000 times this month |

High usage with low adoption means a small group of power users drives all the
volume. This is fragile - losing those users would collapse the feature's metrics.

Low usage with high adoption means many users use it occasionally. This is healthy
but may not justify significant further investment.

Always report both together to get the complete picture.
