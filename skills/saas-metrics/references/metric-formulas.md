<!-- Part of the saas-metrics AbsolutelySkilled skill. Load this file when
     calculating specific SaaS metrics from raw data, handling edge cases,
     or dealing with pro-rata and multi-currency scenarios. -->

# SaaS Metric Formulas - Complete Reference

## MRR Calculation Details

### Base MRR
```
MRR = SUM(normalized_monthly_value for each active subscription)
```

**Normalization rules:**
- Monthly plan: use as-is
- Annual plan: divide by 12
- Quarterly plan: divide by 3
- Semi-annual plan: divide by 6
- Custom term (N months): divide by N

**What to exclude from MRR:**
- One-time setup or onboarding fees
- Professional services revenue
- Usage-based overages (unless contracted minimum)
- Credits, refunds, or promotional discounts (deduct from MRR)
- Free/trial accounts (zero MRR until conversion)

### MRR Waterfall Components

```
New MRR         = SUM(MRR from customers with first-ever subscription this month)
Expansion MRR   = SUM(MRR increase for customers active both this and last month)
Contraction MRR = SUM(MRR decrease for customers active both this and last month)
Churned MRR     = SUM(MRR from customers active last month but not this month)
Reactivation MRR = SUM(MRR from customers returning after previous churn)
```

**Reconciliation check:**
```
Ending MRR = Starting MRR + New + Expansion + Reactivation - Contraction - Churned
```

If this doesn't balance, investigate:
- Mid-month plan changes with proration
- Backdated subscriptions
- Currency conversion fluctuations
- Duplicate customer records

### Pro-rata Handling

When a customer upgrades mid-month:
- **Option A (simple):** Count full new plan value as Expansion in the month the
  change takes effect. Most common for board reporting.
- **Option B (precise):** Pro-rate the old and new plan values for the partial
  month. More accurate but adds complexity.

Choose one method and apply consistently. Document which method in your metrics
glossary.

### Multi-currency MRR

When subscriptions are in multiple currencies:
- Choose a reporting currency (usually USD)
- Convert each subscription at the exchange rate on the subscription start date
  (locked rate) OR at month-end spot rate (floating rate)
- **Locked rate** is preferred - it prevents MRR fluctuations from FX movements
  that don't reflect real business changes
- If using floating rate, add an "FX impact" line to the MRR waterfall to
  separate currency effects from operational changes

---

## Churn Rate Formulas

### Logo Churn (Customer Churn)

```
Monthly Logo Churn Rate = Customers lost in month / Customers at start of month
Annualized Logo Churn   = 1 - (1 - Monthly Rate)^12
```

**Denominator choice matters:**
- Start-of-period (recommended): Clean, standard, avoids survivor bias
- Average of start and end: Smooths large swings but mixes periods
- End-of-period: Never use - systematically understates churn

### Revenue Churn

```
Gross Revenue Churn = (Contraction MRR + Churned MRR) / Starting MRR
Net Revenue Churn   = (Contraction + Churned - Expansion) / Starting MRR
```

Net revenue churn can be negative (net expansion). When negative, some teams
report it as "Net Revenue Expansion" instead to avoid confusion.

### Churn by Segment

Break churn into segments for actionable insight:
```
Enterprise Churn  = Churned MRR (enterprise) / Starting MRR (enterprise)
Mid-Market Churn  = Churned MRR (mid-market) / Starting MRR (mid-market)
SMB Churn         = Churned MRR (SMB) / Starting MRR (SMB)
```

Segment definitions (common thresholds):
- Enterprise: ARR > $100K
- Mid-Market: ARR $20K-$100K
- SMB: ARR < $20K

---

## LTV Formulas

### Simple LTV (constant churn assumption)

```
LTV = ARPA * Gross Margin % / Monthly Revenue Churn Rate
```

Where ARPA = MRR / Active Customers

### Discounted LTV (time-value adjusted)

```
LTV = SUM over t=0 to T of [ (ARPA * Gross Margin %) / (1 + monthly_discount_rate)^t * (1 - churn_rate)^t ]
```

Use a monthly discount rate of 0.83% (approximately 10% annual) for standard
SaaS businesses.

### Cohort-based LTV (most accurate)

Instead of formula-based LTV, sum actual cumulative gross profit per customer
from mature cohorts:

```
Cohort LTV at Month N = Cumulative Gross Profit per Customer from Month 0 to N
```

Use the oldest cohorts (24-36 months of data) to project LTV for newer cohorts.
This captures expansion revenue, seasonal churn patterns, and non-linear
retention curves that the simple formula misses.

---

## CAC Formulas

### Blended CAC
```
CAC = Total S&M Spend in Period / New Customers Acquired in Period
```

### CAC by Channel
```
Organic CAC  = Organic S&M Spend / Organic New Customers
Paid CAC     = Paid S&M Spend / Paid New Customers
Outbound CAC = Outbound S&M Spend / Outbound New Customers
```

### What to include in S&M Spend
- Sales team salaries, commissions, bonuses
- Marketing team salaries
- Advertising spend (all channels)
- Content production costs
- Marketing tools and software
- Event sponsorships and travel
- Agency and contractor fees
- Sales tools (CRM, outreach, etc.)

### What to exclude
- Customer success costs (post-sale)
- Product development
- General & administrative overhead
- Infrastructure costs

### CAC Payback Period
```
CAC Payback (months) = CAC / (ARPA * Gross Margin %)
```

Benchmarks:
- Excellent: < 12 months
- Good: 12-18 months
- Acceptable: 18-24 months
- Concerning: > 24 months

---

## Retention Metrics

### Gross Revenue Retention (GRR)
```
GRR = (Starting MRR - Contraction - Churned) / Starting MRR
```

GRR can never exceed 100%. It measures the floor of your revenue base.

Benchmarks:
- Best-in-class: > 95%
- Good: 90-95%
- Median: 85-90%
- Concerning: < 80%

### Net Revenue Retention (NRR)
```
Monthly NRR = (Starting MRR - Contraction - Churned + Expansion) / Starting MRR

Trailing 12-month NRR:
  Take the set of customers active 12 months ago
  NRR = Their current MRR / Their MRR 12 months ago
```

Benchmarks:
- Best-in-class: > 130%
- Good: 115-130%
- Median: 105-115%
- Concerning: < 100%

### Dollar-Based Net Retention (DBNR)

Identical to NRR in most contexts. Some companies use DBNR specifically for
annual cohort measurement (comparing ARR of a customer set year-over-year)
while using NRR for monthly measurement.

---

## Growth Efficiency Metrics

### Quick Ratio
```
Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR)
```

### Burn Multiple
```
Burn Multiple = Net Burn / Net New ARR
```

Lower is better. A burn multiple of 1x means spending $1 of cash for every $1
of new ARR added.

### Rule of 40
```
Rule of 40 Score = Revenue Growth Rate (%) + EBITDA Margin (%)
```

Score >= 40 indicates a healthy balance of growth and profitability.

### Magic Number
```
Magic Number = Net New ARR (quarterly) / S&M Spend (prior quarter)
```

- Above 1.0: Efficient - increase S&M investment
- 0.5-1.0: Moderate efficiency
- Below 0.5: Inefficient - fix unit economics before scaling
