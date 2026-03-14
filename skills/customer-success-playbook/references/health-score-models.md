<!-- Part of the customer-success-playbook AbsolutelySkilled skill. Load this
     file when building or refining a customer health scoring system. -->

# Health Score Models - Complete Reference

## Signal Selection Methodology

Start with the outcome you're predicting (churn vs. expansion vs. advocacy),
then work backward to identify the signals that correlate with that outcome.

### Step 1: Gather candidate signals

Audit every data source available to CS:

```
Product Analytics:
  - DAU/MAU ratio (stickiness)
  - Feature adoption breadth (# of paid features used / total available)
  - Core action volume (the "aha moment" action, measured per user per week)
  - Session duration and depth
  - API call volume (for developer products)
  - Integration count (connected third-party tools)

Engagement Data:
  - CSM meeting attendance rate (attended / scheduled)
  - Support ticket volume and sentiment
  - Email/message response time from customer
  - Event and webinar attendance
  - Community forum participation
  - Training/certification completion

Outcome Data:
  - Progress toward stated success criteria
  - Customer-reported satisfaction (NPS, CSAT, CES)
  - ROI metrics (if measurable and tracked)
  - Business outcome indicators (e.g., revenue influenced, time saved)

Contractual Data:
  - Days to renewal
  - Contract value trend (expanding, flat, contracting)
  - Payment history (on-time %, overdue invoices)
  - Multi-year vs. annual vs. monthly contract
  - Number of products/modules purchased
```

### Step 2: Validate against historical outcomes

For each candidate signal, run a correlation analysis against actual churn
and expansion events from the past 12-24 months.

**Validation approach:**
```
1. Pull churned accounts from past 12 months
2. Pull expanded accounts from past 12 months
3. Pull stable (retained, no change) accounts as control group
4. For each signal, compare distributions across the three groups
5. Keep signals where churned accounts show statistically different
   values from retained/expanded accounts
6. Discard signals that look the same across all groups
```

### Step 3: Assign weights

**Initial weight recommendations by business model:**

```
B2B SaaS (Sales-Led):
  Product Adoption:  35%
  Engagement:        30%  (CSM relationship matters heavily)
  Outcomes:          20%
  Contractual:       15%

B2B SaaS (Product-Led Growth):
  Product Adoption:  45%  (usage IS the relationship)
  Engagement:        15%
  Outcomes:          25%
  Contractual:       15%

Enterprise / High ACV:
  Product Adoption:  25%
  Engagement:        35%  (multi-threading, exec sponsors critical)
  Outcomes:          25%
  Contractual:       15%
```

> These are starting points. After 2-3 quarters of data, use logistic
> regression or a simple decision tree on your actual churn data to derive
> empirically optimal weights.

---

## Scoring Implementation

### Normalize each signal to 0-100

Every raw signal must be normalized before applying weights.

**Common normalization approaches:**

```
Percentile-based (recommended for most signals):
  Score = Percentile rank of this account among all active accounts
  Example: If account's DAU/MAU is in the 75th percentile, score = 75

Threshold-based (good for binary or categorical signals):
  Score = 100 if condition met, 50 if partially met, 0 if not met
  Example: Executive sponsor identified and engaged = 100,
           identified but unresponsive = 50, none identified = 0

Trend-based (for signals where direction matters):
  Score = 50 (baseline) + (trend_direction * magnitude_adjustment)
  Example: Login frequency up 20% MoM = 50 + 20 = 70
           Login frequency down 30% MoM = 50 - 30 = 20
```

### Composite score calculation

```
Health Score = SUM(signal_score_i * weight_i) for all signals

Example:
  Product Adoption score: 72, weight: 0.40 -> 28.8
  Engagement score:       85, weight: 0.25 -> 21.25
  Outcomes score:         60, weight: 0.20 -> 12.0
  Contractual score:      90, weight: 0.15 -> 13.5
  -----------------------------------------------
  Composite Health Score: 75.55 -> rounds to 76 (Green)
```

---

## Threshold Calibration

### Initial thresholds (start here, then calibrate)

```
Score Range | Label  | Action
------------|--------|-------------------------------------------
85-100      | Strong | Expansion opportunity - connect with AE
70-84       | Good   | Monitor, continue driving deeper adoption
50-69       | Fair   | Proactive outreach, investigate weak signals
30-49       | Poor   | Urgent intervention, CSM + manager review
0-29        | Crisis | Executive escalation, recovery playbook
```

### Calibration process (run quarterly)

```
1. Pull all accounts that churned last quarter
2. Record their health score 90 days before churn
3. Calculate the distribution:
   - What % of churned accounts were scored Green?  (false negatives)
   - What % of Green accounts actually churned?     (false negative rate)
   - What % of Red accounts did NOT churn?           (false positives)

4. Adjust thresholds to minimize false negatives:
   - If many churned accounts were Green, lower the Green threshold
   - If many Red accounts are stable, raise the Red threshold
   - Target: <10% of churned accounts should have been Green 90 days prior

5. Revalidate signal weights:
   - Which signals had the strongest predictive power this quarter?
   - Which signals added noise (no correlation with outcomes)?
   - Adjust weights accordingly, maximum 10% shift per quarter
```

> Do not change thresholds or weights more than once per quarter. Frequent
> changes make the score unreliable for CSMs who learn to calibrate their
> intuition against it. Stability builds trust.

---

## Health Score by Customer Lifecycle Stage

Not all signals matter equally at every stage.

```
Onboarding (0-90 days):
  Overweight: Time-to-first-value, onboarding milestone completion,
              stakeholder identification, training attendance
  Underweight: NPS (too early), expansion signals, renewal proximity

Adoption (90 days - 1 year):
  Overweight: Feature adoption breadth, core action frequency,
              integration depth, user growth within account
  Underweight: Renewal proximity (still far away)

Maturity (1+ year):
  Overweight: Outcome achievement, executive engagement, NPS trend,
              expansion signals, renewal proximity
  Underweight: Onboarding milestones (irrelevant)

Pre-Renewal (90 days before renewal):
  Overweight: Renewal signals (budget approval, legal review started),
              executive sentiment, competitive mentions in tickets
  Underweight: Feature adoption (too late to change)
```

---

## Common Health Score Pitfalls

| Pitfall | Impact | Fix |
|---|---|---|
| Using only product data | Misses relationship and outcome dimensions; scores look "healthy" right up until the customer leaves | Add engagement and outcome signals; validate against churn data |
| Not accounting for customer size | A 500-person company with 10 active users is not healthy; a 5-person company with 5 active users is | Normalize usage metrics by licensed seats or expected users |
| Static thresholds across segments | Enterprise and SMB accounts have fundamentally different usage patterns | Set segment-specific thresholds and weights |
| Ignoring seasonality | Some businesses are seasonal; Q4 dips don't always mean churn risk | Build seasonal baselines; compare to same-period last year |
| No manual override mechanism | Sometimes CSMs have context the data doesn't capture | Allow CSM overrides with required notes; track override accuracy over time |
