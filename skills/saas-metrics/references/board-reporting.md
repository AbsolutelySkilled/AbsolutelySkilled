<!-- Part of the saas-metrics AbsolutelySkilled skill. Load this file when
     preparing a board deck, investor update, or executive metrics report. -->

# Board Reporting - Complete Reference

## Board Deck Structure

A SaaS board deck typically has 10-15 slides. The metrics/financial section
should be 4-6 slides positioned after the executive summary and before the
product/roadmap section.

### Recommended Slide Order

```
1.  Cover slide (company name, date, confidential)
2.  Executive summary (3-5 bullet highlights)
3.  Headline KPIs (single slide, 4-6 metrics)
4.  MRR Waterfall (stacked bar chart)
5.  Cohort Retention (heatmap table)
6.  Unit Economics (LTV, CAC, Payback)
7.  Pipeline & Forecast (optional, for sales-led businesses)
8.  Product Update (key releases, usage metrics)
9.  Team & Hiring
10. Cash Position & Runway
11. Key Risks & Asks
```

---

## Slide Templates

### Slide 3 - Headline KPIs

Present 4-6 metrics in a grid layout. Each metric shows:
- **Current value** (large, bold font)
- **Period-over-period change** (MoM or QoQ with directional arrow)
- **Trailing trend** (sparkline or mini bar chart, 6 months)
- **Target/plan** (if set)
- **Status indicator** (green/yellow/red dot)

**Recommended metrics (pick 4-6):**

| Metric | Format | Green | Yellow | Red |
|---|---|---|---|---|
| ARR | $X.XM | > Plan | 90-100% of Plan | < 90% of Plan |
| Net New MRR | $XXK | > Plan | 80-100% of Plan | < 80% of Plan |
| Monthly Logo Churn | X.X% | < 2% | 2-4% | > 4% |
| NRR (trailing 12mo) | XXX% | > 115% | 100-115% | < 100% |
| CAC Payback (months) | XX mo | < 12 | 12-24 | > 24 |
| Active Customers | ### | > Plan | 90-100% of Plan | < 90% of Plan |

**Formatting rules:**
- Use consistent decimal places across all decks (1 decimal for percentages,
  0 decimals for counts, $X.XM for revenue > $1M, $XXK for < $1M)
- Green/yellow/red thresholds should be set once and not changed
- MoM change uses percentage points (pp) for rates, percent (%) for amounts

### Slide 4 - MRR Waterfall

**Chart type:** Stacked bar chart (waterfall style)

**X-axis:** Last 6-12 months (calendar months)
**Y-axis:** MRR in dollars

**Bar components (bottom to top):**
- Starting MRR (grey, baseline)
- New MRR (green, positive stack)
- Expansion MRR (light green, positive stack)
- Reactivation MRR (blue, positive stack, if material)
- Contraction MRR (orange, negative stack)
- Churned MRR (red, negative stack)
- Ending MRR (dark line or marker)

**Include a data table below the chart:**

```
| Month      | Starting  | +New    | +Expansion | -Contraction | -Churned | =Ending  | Net New |
|------------|-----------|---------|------------|--------------|----------|----------|---------|
| Oct 2025   | $310K     | $22K   | $12K       | ($4K)        | ($8K)    | $332K    | $22K    |
| Nov 2025   | $332K     | $25K   | $14K       | ($3K)        | ($7K)    | $361K    | $29K    |
| Dec 2025   | $361K     | $18K   | $10K       | ($5K)        | ($9K)    | $375K    | $14K    |
```

**Narrative guidance:**
Add 1-2 sentences below the chart explaining the trend:
- "Net new MRR declined in December due to seasonal sales slowdown; pipeline
  for January indicates recovery."
- "Expansion MRR reached a record $14K in November driven by enterprise
  tier upgrades."

### Slide 5 - Cohort Retention

**Format:** Heatmap table showing monthly cohorts

**Show last 6-8 cohorts with these columns:**
- Cohort month
- Cohort size (# customers)
- Month 1, Month 3, Month 6, Month 12 retention (%)

**Color scale:**
- > 90%: Dark green
- 80-90%: Light green
- 70-80%: Yellow
- 60-70%: Orange
- < 60%: Red

**Example:**

```
| Cohort    | Size | Mo 1  | Mo 3  | Mo 6  | Mo 12 |
|-----------|------|-------|-------|-------|-------|
| Jul 2025  | 42   | 88%   | 79%   | 71%   | 63%   |
| Aug 2025  | 38   | 86%   | 76%   | 69%   | -     |
| Sep 2025  | 51   | 90%   | 81%   | 72%   | -     |
| Oct 2025  | 47   | 89%   | 80%   | -     | -     |
| Nov 2025  | 55   | 91%   | -     | -     | -     |
| Dec 2025  | 44   | 87%   | -     | -     | -     |
```

**Include both logo and revenue retention** if space permits (two tables or
a toggle). Revenue retention often tells a different and more positive story
due to expansion.

**Narrative guidance:**
- "Month 1 retention improved from 86% to 91% over the last 6 cohorts,
  reflecting onboarding improvements launched in Q3."
- "Cohort sizes growing: Dec 2025 is 44 vs. Jul 2025's 42 despite holiday
  seasonality."

### Slide 6 - Unit Economics

**Layout:** 2x2 grid of metric cards + trend chart

**Top row (metric cards):**
```
| LTV        | CAC        | LTV:CAC    | Payback    |
|------------|------------|------------|------------|
| $8,400     | $2,500     | 3.4x       | 14 months  |
| +$600 QoQ  | -$200 QoQ  | +0.4x QoQ  | -2mo QoQ   |
```

**Bottom row (trailing chart):**
Line chart showing LTV:CAC ratio and CAC Payback over the last 4-6 quarters.

**Narrative guidance:**
- "LTV:CAC improved to 3.4x from 3.0x last quarter as gross margin expanded
  and churn decreased."
- "CAC payback dropped to 14 months, within our target of sub-18 months."

---

## Narrative Frameworks

Every metric should be accompanied by a one-line narrative. Use this formula:

```
[Metric] [direction] to [value] from [previous value], driven by [cause].
[Implication or action].
```

**Examples:**
- "NRR improved to 118% from 112%, driven by the enterprise upsell motion
  launched in Q3. On track to hit 120% target by Q2."
- "Logo churn increased to 3.1% from 2.4%, concentrated in the SMB segment.
  CS team is piloting a proactive health-score outreach program."
- "CAC payback decreased to 14 months from 17 months as ACV increased without
  proportional S&M spend increase. Signals pricing power."

### Narrative Anti-patterns

| Anti-pattern | Why it fails | Better approach |
|---|---|---|
| "MRR is $350K" (number only) | No context, no trend, no insight | "MRR grew 8% MoM to $350K, ahead of plan" |
| "Churn was bad this month" | Vague, no data, no cause | "Churn spiked to 4.2% due to 2 enterprise losses; both cited feature gaps we're addressing in Q1" |
| "We're tracking well" | Says nothing actionable | "ARR is at 94% of annual plan with 2 months remaining; pipeline suggests we'll reach 101%" |
| Showing 20+ metrics | Overwhelms, dilutes focus | Pick 4-6 headline metrics; put detail in appendix |

---

## Investor Update Email Template

For monthly/quarterly investor updates (separate from board decks):

```
Subject: [Company] - [Month/Quarter] Update | $[ARR] ARR | [Growth]% MoM

Hi [Name],

HIGHLIGHTS
- [Top achievement - usually revenue or customer milestone]
- [Second achievement - product or team]
- [Third - if notable]

KEY METRICS
- ARR: $X.XM ([+/-]X% MoM, [+/-]X% YoY)
- Net New MRR: $XXK
- NRR: XXX%
- Customers: ### ([+/-]X MoM)
- Runway: XX months at current burn

WHAT'S WORKING
- [1-2 sentences on top growth driver]

CHALLENGES
- [1-2 sentences on top risk or blocker, be transparent]

ASK
- [Specific, actionable ask: intro, advice, resource]
  If you can help with any of the above, reply to this email.

Thanks,
[Name]
```

---

## Benchmark Tables

Use these benchmarks to contextualize your metrics for board members. Always
note that benchmarks vary by segment, stage, and vertical.

### Revenue Growth Benchmarks (ARR Growth Rate)

| Stage | Median | Top Quartile |
|---|---|---|
| Pre-seed to Seed ($0-1M ARR) | 15-25% MoM | > 30% MoM |
| Seed to Series A ($1-5M ARR) | 8-15% MoM | > 20% MoM |
| Series A to B ($5-15M ARR) | 100-150% YoY | > 200% YoY |
| Series B to C ($15-50M ARR) | 70-100% YoY | > 150% YoY |
| Growth stage ($50M+ ARR) | 30-50% YoY | > 70% YoY |

<!-- VERIFY: These growth benchmarks are based on general SaaS industry
     surveys (Bessemer, OpenView, KeyBanc). Actual benchmarks vary significantly
     by vertical and market conditions. -->

### Churn Benchmarks

| Segment | Monthly Logo Churn | Annual Logo Churn | Monthly Revenue Churn |
|---|---|---|---|
| Enterprise (>$100K ACV) | 0.5-1% | 5-10% | 0.3-0.8% |
| Mid-Market ($20-100K ACV) | 1-2% | 10-20% | 0.8-1.5% |
| SMB (<$20K ACV) | 3-5% | 30-45% | 2-4% |

### NRR Benchmarks

| Performance | NRR Range |
|---|---|
| Best-in-class | > 130% |
| Excellent | 120-130% |
| Good | 110-120% |
| Median | 105-115% |
| Below average | 100-105% |
| Net contraction | < 100% |

### Unit Economics Benchmarks

| Metric | Excellent | Good | Acceptable | Concerning |
|---|---|---|---|---|
| LTV:CAC | > 5:1 | 3:1-5:1 | 2:1-3:1 | < 2:1 |
| CAC Payback | < 12 mo | 12-18 mo | 18-24 mo | > 24 mo |
| Gross Margin | > 80% | 70-80% | 60-70% | < 60% |

---

## Board Meeting Preparation Checklist

- [ ] Pull MRR waterfall data for the reporting period
- [ ] Calculate all headline KPIs with MoM and QoQ changes
- [ ] Update cohort retention table with latest month's data
- [ ] Refresh LTV, CAC, and payback calculations with trailing 3-month data
- [ ] Write narrative for each metric (cause + implication)
- [ ] Color-code status indicators (green/yellow/red)
- [ ] Verify all numbers reconcile (MRR waterfall balances, ARR = MRR * 12)
- [ ] Compare actuals to plan/budget - note variances
- [ ] Prepare appendix with detailed segment breakdowns
- [ ] Prepare responses for likely questions (churn spikes, missed targets)
- [ ] Review previous board deck to ensure consistent metric definitions
- [ ] Share deck 48-72 hours before meeting for pre-read
