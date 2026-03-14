<!-- Part of the Financial Modeling AbsolutelySkilled skill. Load this file when modeling SaaS businesses, calculating unit economics, benchmarking growth metrics, or preparing investor-facing financial summaries. -->
# SaaS Financial Metrics Reference

Definitions, formulas, and benchmarks for the metrics that matter in SaaS. Use this
as a lookup when building models or pressure-testing assumptions against industry norms.

---

## Revenue Metrics

### MRR (Monthly Recurring Revenue)

The normalized monthly value of all active subscription contracts. The single most
important leading indicator for a SaaS business.

**Formula:** Sum of all active contract values normalized to one month
- Annual contracts: `Annual contract value / 12`
- Multi-year contracts: `Total value / (months in contract)`

**MRR components:**

| Component | Definition |
|---|---|
| **New MRR** | MRR from customers who started paying this month |
| **Expansion MRR** | MRR increase from existing customers (upsell, seat adds, tier upgrades) |
| **Contraction MRR** | MRR decrease from existing customers (downgrades, seat reductions) |
| **Churned MRR** | MRR lost from customers who cancelled this month |
| **Reactivation MRR** | MRR from previously churned customers who returned |

**Net New MRR = New MRR + Expansion MRR - Contraction MRR - Churned MRR**

### ARR (Annual Recurring Revenue)

`ARR = MRR * 12`

ARR is a snapshot metric, not a trailing 12-month sum. It represents the annualized
run-rate of current recurring revenue. Use MRR for month-to-month operations, ARR
for investor reporting and benchmarking.

### NRR (Net Revenue Retention)

Also called Net Dollar Retention (NDR). Measures how much revenue you retain and
expand from existing customers over a period, excluding new customers.

**Formula:** `NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR`

Measured on a cohort basis, typically over 12 months.

| NRR | Interpretation |
|---|---|
| > 130% | World-class (Snowflake, Datadog tier) |
| 120-130% | Excellent - strong expansion engine |
| 110-120% | Good - healthy SaaS business |
| 100-110% | Adequate - not losing revenue, minimal expansion |
| < 100% | Warning - expansion doesn't offset churn |

> NRR > 100% means the business can grow ARR even with zero new customer acquisition.
> This is the most powerful financial property a SaaS company can have.

### GRR (Gross Revenue Retention)

Revenue retained from existing customers, ignoring expansion. Measures the "floor"
of your business - how much you keep even if no one buys more.

**Formula:** `GRR = (Starting MRR - Contraction - Churn) / Starting MRR`

GRR is capped at 100% by definition. Benchmark: > 85% for SMB, > 90% for mid-market,
> 95% for enterprise.

---

## Growth Metrics

### MoM Growth Rate

`MoM Growth = (This Month MRR - Last Month MRR) / Last Month MRR`

Benchmark for early-stage ($0-$1M ARR): 15-20% MoM is exceptional. 10% is strong.
Compress to ARR doubling pace for normalized comparison at scale.

### ARR Growth (YoY)

| ARR Range | Strong Growth | Good Growth |
|---|---|---|
| $1M - $10M | > 200% | > 100% |
| $10M - $50M | > 150% | > 80% |
| $50M - $100M | > 100% | > 60% |
| > $100M | > 60% | > 40% |

Source: Bessemer Venture Partners "Laws of Cloud" benchmarks.

### T2D3 Rule

"Triple, Triple, Double, Double, Double" - a benchmark path to $100M ARR:
- Year 1 to Year 2: 3x ARR
- Year 2 to Year 3: 3x ARR
- Year 3 to Year 4: 2x ARR
- Year 4 to Year 5: 2x ARR
- Year 5 to Year 6: 2x ARR

A company hitting this trajectory from a ~$2M ARR starting point reaches ~$100M ARR
in ~5 years. Used as a benchmark for top-tier SaaS businesses.

---

## Efficiency Metrics

### CAC (Customer Acquisition Cost)

**Fully-loaded CAC:** `(Sales + Marketing spend) / New customers acquired`

Always use fully-loaded CAC: include salaries, tools, events, and agency fees.
Blended CAC hides channel efficiency - break it out by acquisition channel.

| Channel | Typical CAC (B2B SaaS) |
|---|---|
| Outbound sales (SDR + AE) | $5,000 - $50,000+ |
| Paid digital (Google, LinkedIn) | $500 - $5,000 |
| Organic / SEO / content | $50 - $500 |
| Product-led growth (PLG) | $100 - $1,000 |

CAC varies enormously by ACV. A $100K ACV deal can justify $20K CAC. A $1K ACV deal
cannot.

### CAC Payback Period

Months required to recover the cost of acquiring a customer from gross profit.

**Formula:** `CAC Payback (months) = CAC / (ARPU * Gross Margin %)`

| Payback Period | Assessment |
|---|---|
| < 12 months | Excellent |
| 12-18 months | Good |
| 18-24 months | Acceptable - watch closely |
| > 24 months | Concerning - capital-intensive |

For enterprise deals, 18-24 months is often acceptable given contract stability.

### LTV (Customer Lifetime Value)

The total gross profit expected from a customer over their lifetime.

**Formula:** `LTV = (ARPU * Gross Margin %) / Monthly Churn Rate`

Assumes constant ARPU and churn. For businesses with strong expansion, use a cohort
model instead - static LTV understates value when NRR > 100%.

### LTV:CAC Ratio

The ratio of lifetime value to acquisition cost. The gold standard efficiency metric.

| Ratio | Interpretation |
|---|---|
| > 5x | Excellent - may be underinvesting in growth |
| 3x - 5x | Healthy - good balance of growth and efficiency |
| 1x - 3x | Marginal - spending too much to acquire or not retaining well |
| < 1x | Burning cash - acquiring unprofitable customers |

> LTV:CAC of exactly 3x is often cited as a target, but the right ratio depends on
> capital availability and growth stage. A well-funded startup might intentionally
> run at 1.5x to capture market share.

### Magic Number

Measures sales efficiency: how much ARR growth do you get per dollar of sales and
marketing spend?

**Formula:** `Magic Number = (This Quarter ARR - Prior Quarter ARR) * 4 / Prior Quarter S&M Spend`

| Magic Number | Interpretation |
|---|---|
| > 1.5x | Excellent - accelerate S&M investment |
| 0.75x - 1.5x | Good - invest steadily |
| 0.5x - 0.75x | Caution - review efficiency before scaling |
| < 0.5x | Problem - fix before investing more |

---

## Profitability Metrics

### Gross Margin

**Formula:** `Gross Margin % = (Revenue - COGS) / Revenue`

SaaS COGS includes: hosting/infrastructure, customer support, implementation/onboarding,
third-party software embedded in the product.

| Business type | Typical Gross Margin |
|---|---|
| Pure software (no services) | 75-85% |
| SaaS with included support | 65-75% |
| SaaS + professional services | 55-70% |
| Usage-based (infra-heavy) | 50-65% |

### Rule of 40

The combined YoY revenue growth rate and EBITDA margin should equal or exceed 40%.
Balances growth and profitability.

**Formula:** `Rule of 40 = Revenue Growth Rate (%) + EBITDA Margin (%)`

Example: 60% growth + (-20%) EBITDA margin = 40 (passes). 30% growth + 15% EBITDA = 45 (passes).

| Score | Assessment |
|---|---|
| > 60 | Top-tier SaaS |
| 40-60 | Strong |
| 20-40 | Developing |
| < 20 | Needs work |

Early-stage companies typically trade growth for profitability (high growth, deeply
negative EBITDA). Rule of 40 is most useful at $10M+ ARR.

### Burn Multiple

How much net cash you burn per dollar of net new ARR added. Measures capital efficiency.

**Formula:** `Burn Multiple = Net Burn / Net New ARR`

| Burn Multiple | Assessment |
|---|---|
| < 1x | Excellent |
| 1x - 1.5x | Good |
| 1.5x - 2x | Acceptable |
| > 2x | Concerning |

Popularized by David Sacks. Particularly relevant in higher-rate environments where
capital efficiency is scrutinized.

---

## Churn Metrics

### Logo Churn vs Revenue Churn

| Metric | Definition | What it hides |
|---|---|---|
| Logo churn | % of customer accounts lost | Losing small customers while retaining large ones |
| Revenue churn | % of MRR lost | Raw cancellation rate without accounting for expansion |
| Net revenue churn | Revenue churn minus expansion | Net impact on existing revenue base |

Always report both logo and revenue churn. A company can have 10% logo churn but
negative net revenue churn if it's expanding heavily into retained accounts.

### Churn Rate Benchmarks

| Segment | Acceptable Monthly Churn | Strong Monthly Churn |
|---|---|---|
| SMB | 2-3% | < 2% |
| Mid-market | 1-2% | < 1% |
| Enterprise | 0.5-1% | < 0.5% |

Monthly churn to annual: `Annual Churn = 1 - (1 - Monthly Churn)^12`

At 2% monthly, annual logo churn is ~21%. At 0.5% monthly, it is ~6%.

---

## Valuation Multiples

SaaS companies are typically valued on revenue multiples (EV/ARR or EV/NTM Revenue)
because many are not yet profitable.

| Growth Rate (YoY) | Typical EV/NTM Revenue Multiple |
|---|---|
| > 100% | 15-30x+ |
| 60-100% | 8-15x |
| 40-60% | 5-8x |
| 20-40% | 3-5x |
| < 20% | 2-3x |

Multiples compress significantly when: growth is decelerating, NRR is below 100%,
gross margins are below 70%, or macro conditions tighten credit/risk appetite.

> Public SaaS multiples (2021 peak vs 2023 trough) swung from 20-40x NTM revenue to
> 4-8x. Build models that work across a range of multiples, not just peak-cycle comps.

---

## Quick Reference: Benchmarks Summary

| Metric | Benchmark |
|---|---|
| Gross Margin | 70%+ for pure SaaS |
| NRR | 110%+ good, 120%+ excellent |
| GRR | 85%+ SMB, 90%+ enterprise |
| LTV:CAC | 3x+ |
| CAC Payback | < 18 months |
| Magic Number | 0.75x+ to invest, 1.5x+ to accelerate |
| Rule of 40 | 40+ at scale |
| Burn Multiple | < 1.5x |
| Monthly churn (SMB) | < 2% |
| Monthly churn (enterprise) | < 0.5% |
