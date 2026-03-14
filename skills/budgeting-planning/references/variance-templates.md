<!-- Part of the budgeting-planning AbsolutelySkilled skill. Load this file when
     conducting variance analysis, building variance reports, or formatting
     budget-vs-actuals comparisons for stakeholder review. -->

# Variance Analysis Templates

Variance analysis is the practice of comparing planned (budget or forecast)
figures to actual results, decomposing the difference, and communicating the
finding with a root cause and forward impact. These templates cover the three
most common reporting contexts.

---

## Core variance notation

```
Variance ($)   = Actual - Budget
Variance (%)   = (Actual - Budget) / |Budget| x 100

Favorable (FAV):  Revenue over budget  OR  Expense under budget
Unfavorable (UNF): Revenue under budget OR  Expense over budget
```

Always include both dollar and percentage variance. Dollar values show absolute
impact; percentages enable comparison across line items of different sizes.

---

## Template 1: Monthly P&L variance report

Use this for the standard monthly FP&A package sent to the CFO and leadership.

```
MONTHLY P&L VARIANCE REPORT
Period: [Month YYYY]  |  Prepared: [Date]  |  Owner: [FP&A Lead]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                        Actual    Budget    Var $     Var %   F/U
─────────────────────────────────────────────────────────────────
REVENUE
  Product Revenue        $XXX      $XXX     $XXX      X.X%   FAV
  Services Revenue       $XXX      $XXX    ($XXX)    (X.X%)  UNF
  Total Revenue          $XXX      $XXX     $XXX      X.X%   FAV

COST OF GOODS SOLD
  Direct Labor           $XXX      $XXX    ($XXX)    (X.X%)  UNF
  Hosting/Infrastructure $XXX      $XXX     $XXX      X.X%   FAV
  Total COGS             $XXX      $XXX     $XXX      X.X%   FAV

GROSS PROFIT             $XXX      $XXX     $XXX      X.X%   FAV
  Gross Margin %         XX.X%     XX.X%   +X.Xpp

OPERATING EXPENSES
  Engineering            $XXX      $XXX     $XXX      X.X%   FAV
  Product                $XXX      $XXX    ($XXX)    (X.X%)  UNF
  Sales & Marketing      $XXX      $XXX    ($XXX)    (X.X%)  UNF
  General & Admin        $XXX      $XXX     $XXX      X.X%   FAV
  Total OpEx             $XXX      $XXX    ($XXX)    (X.X%)  UNF

EBITDA                   $XXX      $XXX     $XXX      X.X%   FAV
  EBITDA Margin %        XX.X%     XX.X%   +X.Xpp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY VARIANCES (>$50K or >5% of budget line):

1. [Line item] - [FAV/UNF] $XXX (X.X%)
   Root cause: [One sentence explaining the driver]
   Reforecast impact: [Will this recur? How does it affect the remainder of year?]

2. [Line item] - [FAV/UNF] $XXX (X.X%)
   Root cause: [One sentence explaining the driver]
   Reforecast impact: [Will this recur? How does it affect the remainder of year?]
```

**Threshold guidance:** Explain any variance that is both >$25K AND >5% of
the budget line. For revenue, lower the threshold to >$10K or >2%.

---

## Template 2: Year-to-date (YTD) variance with full-year reforecast

Use this for quarterly business reviews and mid-year reforecasting sessions.

```
YTD VARIANCE + FULL-YEAR REFORECAST
Period: YTD through [Month YYYY]  |  Prepared: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   YTD Actual  YTD Budget  YTD Var $  FY Budget  FY Reforecast
─────────────────────────────────────────────────────────────────────────────
Total Revenue        $XXX        $XXX        $XXX       $XXX        $XXX
Total COGS           $XXX        $XXX       ($XXX)      $XXX        $XXX
Gross Profit         $XXX        $XXX        $XXX       $XXX        $XXX
  GP Margin %        XX.X%       XX.X%      +X.Xpp      XX.X%       XX.X%
Total OpEx           $XXX        $XXX       ($XXX)      $XXX        $XXX
EBITDA               $XXX        $XXX        $XXX       $XXX        $XXX
  EBITDA Margin %    XX.X%       XX.X%      +X.Xpp      XX.X%       XX.X%
Headcount (EOP)      XXX         XXX         +X/-X      XXX         XXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REFORECAST ASSUMPTIONS (items changed from original budget):
- [Assumption]: Budget was [X], reforecast is [Y] because [reason]
- [Assumption]: Budget was [X], reforecast is [Y] because [reason]

FY REFORECAST RISKS AND OPPORTUNITIES:
Upside risks (could beat reforecast):
  + [Description]: potential $XXX improvement
Downside risks (could miss reforecast):
  - [Description]: potential ($XXX) impact
```

---

## Template 3: Department-level variance report

Use this when a department head needs to explain their spend to FP&A or to
their budget owner. Covers one department for one period.

```
DEPARTMENT VARIANCE REPORT
Department: [Name]  |  Head: [Name]  |  Period: [Month YYYY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                        Actual    Budget    Var $     Var %   F/U
─────────────────────────────────────────────────────────────────
HEADCOUNT COSTS
  Salaries               $XXX      $XXX     $XXX      X.X%   FAV
  Benefits               $XXX      $XXX     $XXX      X.X%   FAV
  Total Headcount        $XXX      $XXX     $XXX      X.X%   FAV

NON-HEADCOUNT COSTS
  Software/SaaS          $XXX      $XXX    ($XXX)    (X.X%)  UNF
  Contractors            $XXX      $XXX     $XXX      X.X%   FAV
  Travel & Entertainment $XXX      $XXX    ($XXX)    (X.X%)  UNF
  Training               $XXX      $XXX     $XXX      X.X%   FAV
  Other                  $XXX      $XXX     $XXX      X.X%   FAV
  Total Non-HC           $XXX      $XXX    ($XXX)    (X.X%)  UNF

TOTAL DEPARTMENT SPEND   $XXX      $XXX     $XXX      X.X%   FAV

HEADCOUNT SUMMARY
  Filled FTEs (EOP):      XX  (Budget: XX)
  Open Reqs:              XX
  Attrition MTD:          X

NOTES FROM DEPARTMENT HEAD:
[Free text: explain key variances, flag upcoming unbudgeted spend,
 note timing shifts vs. structural changes]
```

---

## Variance decomposition worksheet

Use when a single line item needs deeper decomposition into volume, price,
and mix components.

```
VARIANCE DECOMPOSITION
Line: [Revenue or Cost line]  |  Period: [Month YYYY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1 - Gather inputs:
  Actual Volume (units):       A_vol = ____
  Budget Volume (units):       B_vol = ____
  Actual Price/Rate:           A_prc = ____
  Budget Price/Rate:           B_prc = ____

Step 2 - Total variance:
  Actual ($):                  A_vol x A_prc = $____
  Budget ($):                  B_vol x B_prc = $____
  Total Variance ($):          ________________

Step 3 - Volume variance:
  (A_vol - B_vol) x B_prc = $____
  Interpretation: [More/fewer units than planned, at budget price]

Step 4 - Price/rate variance:
  (A_prc - B_prc) x A_vol = $____
  Interpretation: [Higher/lower price than planned, on actual volume]

Step 5 - Verify (should sum to total variance):
  Volume var + Price var = $____ + $____ = $____  [matches total variance]

Step 6 - Root cause summary:
  "Total [FAV/UNF] variance of $____ was driven by [volume/price/both]:
   [volume var driver] and [price var driver]."
```

---

## Variance reporting cadence

| Report | Audience | Deadline | Threshold to explain |
|---|---|---|---|
| Flash report | CFO, CEO | Day 2 post-close | Revenue only; >2% variance |
| Full monthly P&L variance | Leadership team | Day 7 post-close | >$25K and >5% per line |
| Department variance | Dept heads | Day 5 post-close | All items >$10K |
| QBR YTD + reforecast | Board / investors | 2 weeks post-quarter | All material lines |

---

## Common variance root causes by category

| Category | Common root causes |
|---|---|
| Revenue - favorable | Accelerated deal close, upsell/expansion, pricing uplift, new segment outperformance |
| Revenue - unfavorable | Deal slippage, churn above plan, pricing concessions, segment mix shift |
| Headcount - favorable | Open reqs unfilled, later start dates, lower-than-budgeted grade |
| Headcount - unfavorable | Backfill costs not budgeted, off-cycle promotions, above-plan attrition driving overtime |
| Software/SaaS - unfavorable | New tool approved outside budget cycle, usage-based pricing scaled faster than forecast |
| T&E - unfavorable | Conference attendance, customer onsite visits, above-plan team events |
