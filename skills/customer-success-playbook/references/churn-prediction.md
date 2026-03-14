<!-- Part of the customer-success-playbook AbsolutelySkilled skill. Load this
     file when building churn prediction or early warning systems. -->

# Churn Prediction - Complete Reference

## Beyond Health Scores: Velocity-Based Risk Modeling

A health score is a snapshot; churn prediction is a trajectory. The core
insight is that the rate of change in health signals is often more predictive
than the absolute level.

### The Velocity Framework

```
For each health signal, track three values:
  1. Current value (today's score)
  2. Velocity (rate of change over 30 days)
  3. Acceleration (change in velocity - is the decline speeding up?)

Risk Assessment Matrix:

Current Score | Velocity      | Risk Level
--------------|---------------|------------------
High (70+)    | Stable/Up     | Low - monitor
High (70+)    | Declining     | Medium - investigate
High (70+)    | Rapid decline | High - act now
Mid (40-69)   | Improving     | Medium - continue support
Mid (40-69)   | Stable        | Medium-High - proactive outreach
Mid (40-69)   | Declining     | High - escalate
Low (<40)     | Improving     | Medium - recovery in progress
Low (<40)     | Stable        | Critical - recovery stalled
Low (<40)     | Declining     | Emergency - exec escalation
```

### Calculating Velocity

```
Signal Velocity = (Current_30day_avg - Previous_30day_avg) / Previous_30day_avg

Example:
  DAU/MAU last 30 days: 0.35
  DAU/MAU previous 30 days: 0.50
  Velocity = (0.35 - 0.50) / 0.50 = -0.30 (-30% decline)

Velocity Thresholds:
  > +10%:  Positive trend (green)
  -10% to +10%: Stable (neutral)
  -10% to -25%: Declining (yellow)
  < -25%: Rapid decline (red)
```

---

## Early Warning System Design

### Signal Priority for Early Warning

Not all signals degrade at the same rate before churn. The typical degradation
timeline for B2B SaaS (from earliest warning to cancellation):

```
Timeline Before Churn    | Signal
--------------------------|------------------------------------------
6-12 months              | Executive sponsor engagement drops
4-8 months               | Feature adoption breadth narrows
3-6 months               | Login frequency declines
2-4 months               | CSM meeting cancellations increase
1-3 months               | Support ticket sentiment turns negative
1-2 months               | Renewal conversation stalls
2-4 weeks                | Customer asks about data export/migration
1-2 weeks                | Cancellation request submitted
```

> The earlier signals are harder to detect but give you more time to recover.
> Invest in tracking executive engagement and feature adoption breadth - they
> are the 6-month early warning system most CS teams ignore.

### Alert Design

Structure alerts in three tiers:

```
Tier 1 - Automated Watch (no human action required yet):
  Trigger: Any single signal crosses yellow threshold
  Action:  Log to account timeline, include in weekly CSM digest
  Example: "Login frequency dropped 15% MoM for Acme Corp"

Tier 2 - CSM Action Required:
  Trigger: Two or more signals cross yellow, OR any signal crosses red
  Action:  Task assigned to CSM with 48-hour SLA to investigate
  Example: "Acme Corp: Login decline (-25%) + Support sentiment negative"

Tier 3 - Escalation Required:
  Trigger: Health score drops below 30, OR velocity multiplier hits 2.0x
  Action:  CS manager + CSM sync within 24 hours, exec sponsor assigned
  Example: "CRITICAL: Acme Corp health score dropped from 62 to 28 in 30 days"
```

---

## Churn Cohort Analysis

Analyze churn patterns by cohort to identify systemic issues vs. individual
account problems.

### Building a Churn Cohort View

```
Group churned accounts by:

1. Signup cohort (when they became a customer)
   - Are recent cohorts churning faster than older ones?
   - If yes: onboarding or product-market fit problem

2. Segment (Enterprise / Mid-Market / SMB)
   - Is churn concentrated in a specific segment?
   - If yes: pricing, coverage model, or product fit issue for that segment

3. Churn reason category
   - Product gaps, poor adoption, budget, competitor, bad fit, M&A
   - Track distribution over time - is "competitor" growing as a reason?

4. Lifecycle stage at churn
   - First 90 days: onboarding failure
   - 90 days - 1 year: adoption/value failure
   - 1+ years: relationship, evolving needs, or competitive displacement

5. Last known health score trajectory
   - Sudden drop (event-driven): champion departure, outage, billing issue
   - Gradual decline (trend-driven): fading engagement, slow disengagement
   - Never healthy (fit-driven): should not have been sold in the first place
```

### Interpreting Churn Cohort Data

```
Pattern                          | Root Cause                | Action
---------------------------------|---------------------------|---------------------------
New cohorts churn faster         | Onboarding degraded       | Audit onboarding, time-to-value
Churn spikes in specific months  | Renewal bunching          | Stagger renewals, prep earlier
One segment churns 2x+ others   | Product-market fit gap    | Investigate segment-specific needs
"Competitor" reason trending up  | Competitive pressure      | Win/loss analysis, feature gap review
Most churn from "never healthy"  | Sales/CS misalignment     | Tighten ICP, improve handoff process
```

---

## Predictive Modeling Approaches

### Simple: Rules-Based Scoring

Best for teams with <500 accounts or limited data science resources.

```
Churn Risk Score = weighted sum of risk factors

Risk Factors:
  Health score < 50:              +30 points
  Health velocity negative:       +20 points
  Days to renewal < 90:           +15 points
  Executive sponsor departed:     +25 points
  2+ negative support tickets:    +15 points
  CSM meetings declined 2x:       +10 points
  No login in 14+ days:           +20 points

Risk Levels:
  0-25:   Low risk
  26-50:  Moderate risk
  51-75:  High risk
  76-100: Critical risk
```

### Intermediate: Logistic Regression

Best for teams with 500+ accounts and 50+ churn events to train on.

```
Approach:
  1. Define the target: churned within 90 days (binary: yes/no)
  2. Feature set: health score, velocity, engagement metrics, tenure,
     contract value, segment, support ticket count/sentiment
  3. Train on historical data (12-24 months)
  4. Output: probability of churn within 90 days for each account
  5. Set action thresholds: >70% probability = critical, >40% = high

Advantages:
  - Interpretable (you can explain WHY an account is high risk)
  - Works with relatively small datasets
  - Easy to update quarterly with new data

Disadvantages:
  - Assumes linear relationships
  - May miss complex interaction effects
```

### Advanced: Survival Analysis

Best for teams that need to predict WHEN churn will happen, not just IF.

```
Approach:
  1. Model time-to-churn as a survival function
  2. Accounts that haven't churned are "censored" (still at risk)
  3. Cox Proportional Hazards model identifies which factors accelerate
     or decelerate time-to-churn
  4. Output: hazard ratio for each factor and predicted survival curves

Example output:
  "Executive sponsor departure increases churn hazard by 2.3x"
  "Each additional integrated tool reduces churn hazard by 0.85x"
  "This account has a 35% probability of churning within 6 months"
```

---

## Involuntary Churn Prevention

Involuntary churn (failed payments, expired cards) is often 20-40% of total
churn for self-serve and SMB segments. It deserves its own playbook.

```
Dunning sequence (pre-failure):
  Day -30:  Alert customer that card expires soon
  Day -14:  Second reminder with one-click update link
  Day -7:   Final warning, highlight what they'll lose access to

Dunning sequence (post-failure):
  Day 0:    Payment failed - retry immediately
  Day 1:    Email: "Payment issue - update your card" (friendly tone)
  Day 3:    Retry payment + second email
  Day 7:    Retry + "Your account will be paused in 7 days" email
  Day 10:   Retry + final warning
  Day 14:   Account paused (not deleted), email with reactivation link
  Day 30:   Account cancelled, data retained for 90 days

Best practices:
  - Retry failed payments 4-6 times over 14 days (different times/days)
  - Use card updater services (Visa Account Updater, Mastercard ABU)
  - Send in-app notifications, not just email
  - Make the update flow one click, no login required
  - Track recovery rate by dunning step to optimize the sequence
```

---

## Churn Prevention Metrics

Track these metrics to measure the effectiveness of your churn prediction
and prevention programs:

```
Metric                        | Target         | Measurement
------------------------------|----------------|-------------------------------------
Prediction accuracy (AUC)     | >0.75          | % of churned accounts flagged 90d prior
False negative rate           | <15%           | Churned accounts that were scored Green
False positive rate           | <30%           | Red accounts that did not churn
Recovery rate                 | >40%           | Red accounts saved within 90 days
Time to intervention          | <48 hours      | Time from alert to first CSM action
Churn reason accuracy         | >80%           | Validated churn reasons match prediction
Save offer acceptance rate    | 20-35%         | Accounts that accept a retention offer
```
