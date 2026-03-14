<!-- Part of the customer-success-playbook AbsolutelySkilled skill. Load this file
     when designing, auditing, or calibrating a customer health scoring system. -->

# Health Score Model

A customer health score is a weighted composite metric (0-100) that aggregates
multiple behavioral and relational signals into a single risk/opportunity indicator.
A well-designed model predicts renewal probability and triggers CSM actions before
churn becomes irreversible.

---

## Design principles

- **Fewer inputs, higher signal.** Start with 4-6 dimensions. Models with 20+ inputs
  dilute strong predictors and create noise. Add dimensions only when they
  demonstrably improve predictive accuracy.
- **Automate data collection.** A dimension you can't populate automatically will
  drift stale and corrupt the score. If a signal requires manual CSM entry, weight
  it lower or exclude it from the automated score.
- **Every band triggers an action.** If a score change doesn't trigger a defined
  CSM workflow, the score is decorative. Define mandatory actions per band before
  launch.
- **Calibrate continuously.** Initial weights are hypotheses. Validate against
  actual churn and renewal data every quarter and adjust.

---

## Dimensions

### 1. Product Usage (default weight: 35%)

Measures whether the customer is actively and broadly using the product.

| Sub-signal | What to measure | Red flag threshold |
|---|---|---|
| Login frequency | Active users / licensed seats in last 30 days | <20% of seats active |
| Feature adoption breadth | % of licensed feature modules used in last 30 days | <30% of modules |
| Usage depth | Core action volume per active user per week | <3 core actions/user/week |
| Usage trend | 90-day slope of weekly active users | Declining >20% over 90 days |

**Normalization example (login frequency):**

| Seats active (30-day) | Sub-score |
|---|---|
| <20% | 0 |
| 20-34% | 20 |
| 35-49% | 40 |
| 50-64% | 60 |
| 65-79% | 80 |
| 80-100% | 100 |

**Composite usage sub-score:**
`usage_score = (login_freq * 0.40) + (feature_breadth * 0.30) + (usage_depth * 0.20) + (trend * 0.10)`

---

### 2. Engagement (default weight: 25%)

Measures the quality and consistency of the relationship between the customer and
the CS team.

| Sub-signal | What to measure | Red flag threshold |
|---|---|---|
| CSM touchpoint cadence | % of scheduled touchpoints completed in last 90 days | <60% completion |
| Executive sponsor accessibility | Days since last exec-level interaction | >60 days |
| Outreach response time | Average hours to respond to CSM outreach | >72 hours |
| EBR / QBR attendance | % of scheduled QBRs attended by exec sponsor | <50% |

**Normalization example (touchpoint cadence):**

| Scheduled touchpoints completed | Sub-score |
|---|---|
| <40% | 0 |
| 40-59% | 30 |
| 60-74% | 60 |
| 75-89% | 80 |
| 90-100% | 100 |

---

### 3. Outcomes (default weight: 20%)

Measures whether the customer is achieving the goals documented in the success plan.
This is the hardest dimension to automate but the most predictive of genuine retention.

| Sub-signal | What to measure | Red flag threshold |
|---|---|---|
| Success plan milestone completion | % of milestones completed on schedule | <50% by quarter midpoint |
| Customer-reported ROI | NPS or CSAT score, weighted by recency | NPS <7 or CSAT <3.5/5 |
| Business outcome proxy | Customer-defined metric (e.g., tickets deflected, deals closed, time saved) | Negative or flat trend |

**Scoring approach:**
Because outcome data is partially subjective, weight CSM-assessed milestone
completion (60%) and objective NPS/CSAT (40%) to reduce gaming.

`outcomes_score = (milestone_pct * 0.60) + (normalized_nps * 0.40)`

---

### 4. Support (default weight: 10%)

Measures product quality experience and service burden signals.

| Sub-signal | What to measure | Red flag threshold |
|---|---|---|
| Open critical tickets | Count of P1/P2 tickets open >5 business days | Any |
| CSAT on closed tickets | Average CSAT score on resolved tickets in 30 days | <3.5/5 |
| Ticket volume trend | Month-over-month change in total ticket count | >50% spike |

**Composite support sub-score:**
`support_score = (100 if no_open_critical else 0) * 0.40 + (normalized_csat * 0.40) + (volume_trend_score * 0.20)`

Map ticket volume trend: declining = 100, flat = 70, increasing = 40, spike = 0.

---

### 5. Relationship (default weight: 10%)

Measures stakeholder stability and strategic alignment signals.

| Sub-signal | What to measure | Red flag threshold |
|---|---|---|
| Champion stability | Has the primary champion changed in last 90 days? | Yes = critical flag |
| Multi-threading depth | Number of distinct stakeholders engaged in last 60 days | <2 |
| Executive alignment | Exec sponsor confirmed and engaged | Not confirmed |

**Champion departure** is a special-case trigger: regardless of composite score,
a champion departure should immediately flag the account for Watch status and
CSM outreach within 24 hours.

---

## Composite score formula

```
health_score =
  (usage_score   * 0.35) +
  (engagement_score * 0.25) +
  (outcomes_score   * 0.20) +
  (support_score    * 0.10) +
  (relationship_score * 0.10)
```

Round to nearest integer. The result is a value from 0 to 100.

---

## Thresholds and action triggers

| Band | Score range | Meaning | Mandatory CSM action | SLA |
|---|---|---|---|---|
| Green | 75-100 | Healthy, on track | Monitor; look for expansion signals; request reference if >90 | Weekly automated review |
| Yellow | 50-74 | At risk; early warning | Schedule proactive check-in; document root cause hypothesis | CSM contact within 7 days |
| Red | 0-49 | Critical risk | Escalate to CS Manager; executive outreach; build save plan | Escalation within 48 hours |

### Threshold override rules

These conditions force Red regardless of composite score:
- Any open P1 ticket unresolved for >5 business days
- Primary champion departed without replacement confirmed
- Customer has sent formal cancellation intent or legal notice
- Payment overdue >30 days

---

## Calibration methodology

### Step 1 - Collect baseline data

For each account that churned or renewed in the last 4 quarters, pull the
health score from 90 days before the renewal date. This is your training set.

### Step 2 - Measure predictive accuracy

Calculate the confusion matrix:

```
True Positive  = Red score at T-90 AND customer churned
False Negative = Green/Yellow at T-90 AND customer churned  (missed churns)
True Negative  = Green score at T-90 AND customer renewed
False Positive = Red at T-90 AND customer renewed           (false alarms)
```

Target: False Negative rate <25% (you should catch 75%+ of churns in the Red band).

### Step 3 - Adjust weights

If False Negatives are high, the model is under-weighting the signals that
churned accounts showed. Analyze what those accounts had in common at T-90
and increase the weight of those dimensions.

If False Positives are high, the model is over-penalizing for signals that
don't actually predict churn. Reduce weights for those dimensions or adjust
the normalization thresholds.

### Step 4 - Validate, then recalibrate quarterly

Never run more than one quarter on uncalibrated weights. Set a calendar
reminder to re-run the confusion matrix after every renewal cycle.

---

## Common model pitfalls

| Pitfall | Consequence | Fix |
|---|---|---|
| Usage as the only dimension | High-usage customers who see no ROI will still churn | Always include an outcomes dimension |
| Static thresholds | What was "healthy" in Year 1 may be "at risk" in Year 3 as product evolves | Recalibrate thresholds annually at minimum |
| Ignoring velocity | A stable score at 55 is less dangerous than a score dropping from 80 to 60 | Add a velocity multiplier: declining * 1.5x, dropping fast * 2.0x |
| Over-indexing on NPS | NPS is a lagging, self-reported metric that churning customers often inflate | Weight NPS at <15% of any dimension; prioritize behavioral signals |
| Missing the long tail | SMB accounts with no CSM engagement produce silent churn | Implement automated threshold alerts routed to pooled queue |

---

## Velocity scoring (optional enhancement)

Layer a velocity multiplier onto the composite score to capture directional momentum:

```
30-day delta = current_score - score_30_days_ago

Velocity bucket:
  delta > +5   : improving  -> multiplier 0.85 (reduces effective risk)
  -5 to +5     : stable     -> multiplier 1.00
  -15 to -5    : declining  -> multiplier 1.25
  delta < -15  : rapid drop -> multiplier 1.50 (auto-escalate to Warning)

risk_adjusted_score = health_score / velocity_multiplier
```

Use `risk_adjusted_score` for triage prioritization but display `health_score`
to customers and in reporting to avoid confusion.
