<!-- Part of the saas-metrics AbsolutelySkilled skill. Load this file when
     building, analyzing, or visualizing cohort retention tables. -->

# Cohort Analysis - Complete Reference

## What is a Cohort Table

A cohort table groups users by a shared characteristic (usually signup date)
and tracks a metric over time relative to their group start date. It answers:
"How does customer behavior evolve over their lifetime, and is it getting
better or worse for newer customers?"

---

## Building a Cohort Table from Raw Data

### Step 1 - Assign Cohorts

Each customer gets a cohort label based on their signup/activation date:

```
cohort = YEAR(signup_date) & "-" & MONTH(signup_date)

Example:
  Customer A, signed up 2025-01-15 -> cohort "2025-01"
  Customer B, signed up 2025-01-28 -> cohort "2025-01"
  Customer C, signed up 2025-02-03 -> cohort "2025-02"
```

### Step 2 - Calculate Relative Periods

For each customer at each measurement point, calculate months since signup:

```
relative_month = DATEDIF(signup_date, measurement_date, "M")
```

Important: Use complete months only. A customer signed up Jan 28 measured on
Feb 15 has NOT completed Month 1 (only 18 days). Use the month-end snapshot
that is at least 30 days after signup for Month 1.

### Step 3 - Aggregate by Cohort and Period

**Logo retention table:**
```
For each (cohort, relative_month):
  count = number of active customers
  retention = count / cohort_size_at_month_0
```

**Revenue retention table:**
```
For each (cohort, relative_month):
  mrr = SUM(MRR for active customers in this cohort)
  retention = mrr / mrr_at_month_0
```

### Step 4 - Build the Matrix

```
              Month 0   Month 1   Month 2   Month 3   Month 6   Month 12
Jan 2025      100.0%    87.2%     81.5%     78.3%     71.0%     62.4%
Feb 2025      100.0%    89.1%     83.0%     79.8%     72.5%     -
Mar 2025      100.0%    91.3%     85.2%     81.0%     -         -
Apr 2025      100.0%    90.0%     84.1%     -         -         -
May 2025      100.0%    88.5%     -         -         -         -
Jun 2025      100.0%    -         -         -         -         -
```

The diagonal staircase pattern (dashes in the lower-right) is normal - newer
cohorts haven't aged enough to fill later columns.

---

## Types of Cohort Analysis

### Logo (Customer Count) Cohorts

- Cells contain percentage of original customers still active
- Can never exceed 100%
- Shows pure retention behavior
- Best for understanding product stickiness

### Revenue (Dollar) Cohorts

- Cells contain percentage of original MRR retained
- CAN exceed 100% if expansion revenue from upgrades/seat-adds exceeds churn
- Shows the combined effect of retention + expansion
- Best for understanding revenue dynamics and NRR by cohort

### Usage Cohorts

- Cells contain a usage metric (DAU, sessions, API calls) relative to Month 0
- Useful for product-led growth analysis
- Helps identify engagement patterns that predict churn

### Acquisition Channel Cohorts

- Instead of grouping by month, group by acquisition source
- Shows which channels bring the stickiest customers
- Compare: organic vs. paid vs. referral vs. outbound

---

## Reading Cohort Tables

### Horizontal Reading (across a row)

Each row tells the story of one cohort's lifecycle. Look for:
- **Steep early drop-off:** If Month 0 to Month 1 drops more than 15-20%, there's
  a first-value or onboarding problem
- **Flattening curve:** Healthy products show retention stabilizing by Month 3-6
  (the "smile curve" flattens into an asymptote)
- **Continued decay:** If retention keeps dropping linearly, there's no natural
  retention floor and the product has a structural problem

### Vertical Reading (down a column)

Each column compares cohorts at the same relative age. Look for:
- **Improving trend:** Newer cohorts retaining better at Month 3 than older
  cohorts did at Month 3 means product/onboarding improvements are working
- **Worsening trend:** Newer cohorts performing worse signals degrading
  product-market fit or lower-quality customer acquisition
- **Flat:** Retention behavior is stable across cohorts

### Diagonal Reading

The diagonal represents "this month's retention for the cohort that's N months
old." It shows the current state of each active cohort simultaneously.

---

## Visualization Techniques

### Heatmap Table

The most common visualization. Color-code cells:
- Green: > 90% retention
- Light green: 80-90%
- Yellow: 70-80%
- Orange: 60-70%
- Red: < 60%

This immediately surfaces problem cohorts and trends.

### Cohort Curves (Line Chart)

Plot each cohort as a line on the same chart:
- X-axis: Relative months (0, 1, 2, 3, ...)
- Y-axis: Retention percentage
- Each line = one cohort

Benefits: Easy to spot if newer cohorts (bolder/darker lines) perform better
or worse than older ones. Shows the characteristic retention curve shape.

### Stacked Area Chart

Shows total active customers or MRR broken down by cohort over calendar time:
- X-axis: Calendar months
- Y-axis: Total customers or MRR
- Each band = one cohort's contribution

Benefits: Shows how much of current revenue depends on old vs. new cohorts.
A healthy business shows new cohort bands growing thicker over time.

---

## Common Cohort Analysis Mistakes

| Mistake | Impact | Fix |
|---|---|---|
| Using calendar months instead of relative months | Customer signed up Dec 31 shows "Month 1" on Jan 1 | Calculate relative months from signup date using DATEDIF |
| Including incomplete periods | Newest cohort shows artificially low retention | Only include cohort-period combinations with full measurement windows |
| Mixing free trial and paid users | Inflates Month 0 counts, makes Month 1 drop look worse | Start cohort clock at first paid subscription, not trial start |
| Ignoring cohort size | A cohort of 5 customers with 80% retention is noise | Show absolute counts alongside percentages; flag small cohorts |
| Only looking at logo retention | Misses the revenue expansion story | Always build both logo AND revenue retention cohort tables |
| Not controlling for seasonality | January cohorts may naturally differ from July cohorts | Compare same-season cohorts year-over-year, not just sequential months |

---

## Spreadsheet Implementation

### Google Sheets / Excel Formula Pattern

Assuming raw data with columns: customer_id, signup_date, month_end_date, is_active, mrr

**Cohort assignment (helper column):**
```
=TEXT(signup_date, "YYYY-MM")
```

**Relative month (helper column):**
```
=DATEDIF(signup_date, month_end_date, "M")
```

**Cohort size at Month 0:**
```
=COUNTIFS(cohort_column, cohort_label, relative_month_column, 0, is_active_column, TRUE)
```

**Retention at Month N:**
```
=COUNTIFS(cohort_column, cohort_label, relative_month_column, N, is_active_column, TRUE)
 / COUNTIFS(cohort_column, cohort_label, relative_month_column, 0, is_active_column, TRUE)
```

### SQL Pattern for Cohort Table

```sql
WITH customer_cohorts AS (
  SELECT
    customer_id,
    DATE_TRUNC('month', first_subscription_date) AS cohort_month
  FROM customers
),
monthly_activity AS (
  SELECT
    c.customer_id,
    c.cohort_month,
    DATE_TRUNC('month', s.activity_date) AS activity_month,
    DATEDIFF('month', c.cohort_month, DATE_TRUNC('month', s.activity_date)) AS relative_month
  FROM customer_cohorts c
  JOIN subscriptions s ON c.customer_id = s.customer_id
  WHERE s.status = 'active'
),
cohort_sizes AS (
  SELECT cohort_month, COUNT(DISTINCT customer_id) AS cohort_size
  FROM customer_cohorts
  GROUP BY cohort_month
)
SELECT
  ma.cohort_month,
  ma.relative_month,
  COUNT(DISTINCT ma.customer_id) AS active_customers,
  cs.cohort_size,
  ROUND(COUNT(DISTINCT ma.customer_id)::DECIMAL / cs.cohort_size * 100, 1) AS retention_pct
FROM monthly_activity ma
JOIN cohort_sizes cs ON ma.cohort_month = cs.cohort_month
GROUP BY ma.cohort_month, ma.relative_month, cs.cohort_size
ORDER BY ma.cohort_month, ma.relative_month;
```

This produces a flat result set that can be pivoted into the cohort matrix
in a spreadsheet or BI tool.
