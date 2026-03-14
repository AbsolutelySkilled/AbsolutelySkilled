<!-- Part of the support-analytics AbsolutelySkilled skill. Load this file when
     working with detailed metric calculations, statistical methods, or sampling. -->

# Support Metrics - Formula Reference

Complete formula reference for all support analytics metrics, including statistical
considerations for reliable measurement.

---

## CSAT formulas

### Basic CSAT score

```
CSAT % = (count of 4 and 5 responses) / (total responses) * 100
```

### Weighted CSAT (when response volumes differ across segments)

```
Weighted CSAT = SUM(segment_csat * segment_ticket_volume) / total_ticket_volume
```

Use weighted CSAT when comparing across segments with very different volumes.
A segment with 10 responses and 100% CSAT should not dominate reporting.

### CSAT confidence interval

For a given sample size and CSAT score, the 95% confidence interval is:

```
margin_of_error = 1.96 * sqrt((csat * (1 - csat)) / n)

Example:
  CSAT = 0.82 (82%), n = 200 responses
  margin = 1.96 * sqrt(0.82 * 0.18 / 200) = 1.96 * 0.0272 = 0.053
  95% CI: 76.7% to 87.3%
```

**Minimum sample sizes for reliable CSAT:**

| Desired margin of error | Required responses (at 80% CSAT) |
|---|---|
| +/- 10% | 62 |
| +/- 5% | 246 |
| +/- 3% | 683 |
| +/- 1% | 6,147 |

If your weekly response count falls below 62, report CSAT as directional only,
not as a reliable metric.

### Response rate and bias

```
Response Rate = total_responses / total_resolved_tickets * 100
```

Response rates below 10% introduce severe selection bias - dissatisfied customers
are more likely to respond, skewing CSAT downward. Conversely, if only prompted
users respond, CSAT may skew upward.

Corrective strategies:
- Target 15-25% response rate as the reliability threshold
- Compare respondent demographics to full ticket population
- Use stratified sampling if certain segments under-respond

---

## NPS formulas

### Standard NPS

```
NPS = (% Promoters) - (% Detractors)

Where:
  Promoters:  score 9 or 10
  Passives:   score 7 or 8
  Detractors: score 0 through 6

Range: -100 to +100
```

### NPS margin of error

```
NPS standard error = sqrt((p_promoter * (1 - p_promoter) + p_detractor * (1 - p_detractor)
                          + 2 * p_promoter * p_detractor) / n)

95% CI = NPS +/- 1.96 * standard_error

Example:
  n = 300, Promoters = 40%, Detractors = 20%, NPS = +20
  SE = sqrt((0.40 * 0.60 + 0.20 * 0.80 + 2 * 0.40 * 0.20) / 300)
     = sqrt((0.24 + 0.16 + 0.16) / 300) = sqrt(0.001867) = 0.0432
  95% CI: +20 +/- 8.5 points -> range [+11.5, +28.5]
```

**Minimum sample sizes for NPS:**

| Desired margin of error | Required responses |
|---|---|
| +/- 10 points | ~100 |
| +/- 5 points | ~400 |
| +/- 3 points | ~1,100 |

### NPS trend significance

To determine if an NPS change between two periods is statistically significant:

```
z = (NPS_2 - NPS_1) / sqrt(SE_1^2 + SE_2^2)

If |z| > 1.96, the change is significant at p < 0.05
```

---

## Resolution time formulas

### Percentile-based reporting

Always report resolution time as percentiles, not averages. Averages are skewed by
outliers (one 30-day ticket destroys a weekly average).

```
Key percentiles:
  p50 (median):  Typical customer experience
  p75:           Start of the "long tail" - where most frustration lives
  p90:           Worst common experience
  p95:           Near-worst case, useful for SLA compliance

SQL:
  SELECT
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY resolution_hours) AS p50,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY resolution_hours) AS p75,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY resolution_hours) AS p90,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY resolution_hours) AS p95
  FROM tickets
  WHERE resolved_at IS NOT NULL
    AND resolved_at >= NOW() - INTERVAL '28 days';
```

### Business hours adjustment

Raw resolution time includes nights and weekends. For teams with defined business
hours, calculate business-hours resolution time:

```
Business Hours Resolution = total_elapsed_time - non_business_hours_in_range

Non-business hours calculation:
  For each calendar day in the range:
    If weekday: subtract hours outside 9am-6pm (15h per day)
    If weekend: subtract full 24h
    If holiday: subtract full 24h
```

### SLA compliance rate

```
SLA Compliance % = (tickets resolved within SLA target) / (total tickets) * 100

Report per priority tier:
  P1 SLA compliance: tickets_resolved_under_4h / total_p1_tickets * 100
  P2 SLA compliance: tickets_resolved_under_8h / total_p2_tickets * 100
  ...
```

---

## Deflection rate formulas

### Standard deflection rate

```
Deflection Rate = deflected / (deflected + not_deflected) * 100

Where:
  deflected     = self-service views with NO ticket created within 24h
  not_deflected = self-service views WITH ticket created within 24h
```

### Content effectiveness score

For individual help articles or chatbot flows:

```
Article Effectiveness = 1 - (tickets_created_after_view / total_article_views)

Rank articles by:
  1. Total views (high traffic = high impact)
  2. Effectiveness score (low score = needs improvement)
  3. Impact = views * (1 - effectiveness) = potential tickets saved if improved
```

### Deflection ROI

```
Monthly deflection savings =
  deflected_interactions * (avg_ticket_cost - avg_self_service_cost)

Annual ROI of deflection improvement =
  (new_deflection_rate - old_deflection_rate) * monthly_contacts * 12
  * (avg_ticket_cost - avg_self_service_cost)
```

---

## Trend analysis formulas

### Trailing average (smoothing)

```
4-week trailing average:
  avg_t = (value_t + value_t-1 + value_t-2 + value_t-3) / 4

Exponential moving average (more weight on recent data):
  EMA_t = alpha * value_t + (1 - alpha) * EMA_t-1
  Where alpha = 2 / (N + 1), N = number of periods
```

### Week-over-week change detection

```
WoW change % = (this_week - last_week) / last_week * 100

Alert if:
  |WoW change| > 2 * standard_deviation_of_weekly_changes

This catches unusual spikes or drops relative to normal variation.
```

### Seasonality decomposition

```
For weekly data with known seasonal patterns:
  seasonal_index_w = avg_value_for_week_w / overall_avg

Deseasonalized value:
  adjusted_t = actual_t / seasonal_index_for_that_week

Use deseasonalized values for trend detection to avoid false alarms from
predictable seasonal spikes (e.g., post-holiday ticket surges).
```

---

## Sampling guidelines

When ticket volume is too high for 100% survey coverage:

```
Stratified sampling approach:
  1. Define strata: channel x priority x product_area
  2. Calculate required sample per stratum (min 30 for statistical validity)
  3. Sample proportionally or use minimum allocation per stratum

Simple random sampling minimum:
  For 95% confidence, +/- 5% margin on a population of:
    500 tickets/week:   217 surveys needed
    1,000 tickets/week: 278 surveys needed
    5,000 tickets/week: 357 surveys needed
    10,000+ tickets/week: 370 surveys needed (diminishing returns)
```
