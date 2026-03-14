<!-- Part of the spreadsheet-modeling AbsolutelySkilled skill. Load this file when
     working with financial models, DCF analysis, three-statement models,
     sensitivity tables, or investment analysis in spreadsheets. -->

# Financial Modeling Patterns

## Model architecture

Every financial model follows the same three-layer architecture:

```
[Assumptions Sheet]  -->  [Calculations Sheet]  -->  [Output Sheet]
     (inputs)               (formulas only)          (dashboard/summary)
```

### Assumptions sheet

Contains every editable input in the model. Organize into sections:

| Section | Examples |
|---|---|
| Revenue drivers | Units sold, price per unit, growth rate |
| Cost drivers | COGS %, headcount, salary, rent |
| Capital | CapEx schedule, depreciation method, useful life |
| Financing | Debt amount, interest rate, repayment schedule |
| Tax | Tax rate, NOL carryforward |
| Timing | Forecast start, number of periods, fiscal year end |

**Formatting convention:**
- Blue font = hardcoded input (editable)
- Black font = formula (do not edit)
- Yellow background = key assumption that drives the model

### Calculations sheet

Pure formulas. No hardcoded values. Every cell references either the Assumptions
sheet or other cells on the Calculations sheet.

### Output sheet

Summary tables, charts, and KPIs. Typically contains:
- Income statement summary
- Key metrics (revenue growth, margins, EBITDA)
- Scenario comparison table
- Valuation summary

---

## Three-statement model

Links the Income Statement, Balance Sheet, and Cash Flow Statement.

### Income Statement structure

```
Revenue
  - COGS
= Gross Profit
  - Operating Expenses (SG&A, R&D)
= EBITDA
  - Depreciation & Amortization
= EBIT (Operating Income)
  - Interest Expense
= EBT (Earnings Before Tax)
  - Taxes
= Net Income
```

**Formula pattern for revenue line:**
```
=Prior_Period_Revenue * (1 + Revenue_Growth_Rate)
```

**Formula pattern for expense lines:**
```
=Revenue * Expense_As_Pct_Of_Revenue
```

### Balance Sheet structure

```
Assets:
  Cash
  Accounts Receivable
  Inventory
  PP&E (net of depreciation)
  Other Assets

Liabilities:
  Accounts Payable
  Short-term Debt
  Long-term Debt

Equity:
  Common Stock
  Retained Earnings (prior + Net Income - Dividends)
```

**Balance check formula (must always equal zero):**
```
=Total_Assets - Total_Liabilities - Total_Equity
```

> If the balance check is not zero, there is an error in the model. Use
> conditional formatting to turn the check cell red if non-zero.

### Cash Flow Statement structure

```
Operating Activities:
  Net Income
  + Depreciation & Amortization
  - Change in Working Capital
    (Change in AR, Inventory, AP)

Investing Activities:
  - Capital Expenditures
  + Asset Sales

Financing Activities:
  + Debt Issuance
  - Debt Repayment
  - Dividends
  + Equity Issuance

= Net Change in Cash
  + Beginning Cash
= Ending Cash (must tie to Balance Sheet)
```

**Working capital change formula:**
```
=-(Current_AR - Prior_AR) - (Current_Inventory - Prior_Inventory) + (Current_AP - Prior_AP)
```

---

## DCF valuation

### Free Cash Flow (FCF) projection

```
EBIT
  * (1 - Tax Rate)
= NOPAT
  + Depreciation & Amortization
  - Capital Expenditures
  - Change in Working Capital
= Free Cash Flow
```

### Terminal value (perpetuity growth method)

```
=FCF_Last_Year * (1 + Terminal_Growth_Rate) / (WACC - Terminal_Growth_Rate)
```

<!-- VERIFY: Terminal growth rate should typically be 2-3%, not exceeding
     long-term GDP growth. This is a standard assumption but varies by
     industry and geography. -->

### Discount FCF to present value

```
=FCF_Year_N / (1 + WACC) ^ N
```

**Full DCF formula in a row:**
```
Year:              1        2        3        4        5       Terminal
FCF:              =calc    =calc    =calc    =calc    =calc
Terminal Value:                                               =TV formula
Discount Factor:  =1/(1+WACC)^1  ...
PV of FCF:        =FCF*DF  =FCF*DF  ...
```

```
Enterprise Value = SUM(PV of FCFs) + PV of Terminal Value
Equity Value = Enterprise Value - Net Debt
Value per Share = Equity Value / Shares Outstanding
```

### WACC calculation

```
=Equity_Weight * Cost_Of_Equity + Debt_Weight * Cost_Of_Debt * (1 - Tax_Rate)
```

**Cost of Equity (CAPM):**
```
=Risk_Free_Rate + Beta * Equity_Risk_Premium
```

---

## Sensitivity analysis

### Two-variable data table for DCF

Set up a matrix with WACC values across the top and terminal growth rates down
the side, with the implied share price formula in the top-left corner.

```
              WACC
              8%     9%     10%    11%    12%
Growth  1%   $XX    $XX    $XX    $XX    $XX
        2%   $XX    $XX    $XX    $XX    $XX
        3%   $XX    $XX    $XX    $XX    $XX
```

Use Excel's Data Table feature (Data > What-If > Data Table) to fill the matrix
automatically.

### Scenario toggle pattern

```
Scenario_Selector: [dropdown: 1=Base, 2=Bull, 3=Bear]

Revenue_Growth: =CHOOSE(Scenario_Selector, 0.05, 0.10, 0.02)
EBITDA_Margin:  =CHOOSE(Scenario_Selector, 0.20, 0.25, 0.15)
CapEx_Pct:      =CHOOSE(Scenario_Selector, 0.05, 0.04, 0.06)
```

This lets the entire model recalculate by changing a single cell.

---

## Depreciation schedules

### Straight-line

```
=Asset_Cost / Useful_Life
```

### Declining balance (double declining)

```
Year 1: =Asset_Cost * (2 / Useful_Life)
Year N: =MAX(0, Prior_Book_Value * (2 / Useful_Life))
```

Switch to straight-line when straight-line depreciation exceeds declining balance.

### Sum-of-years-digits

```
=Asset_Cost * (Remaining_Life / Sum_Of_Years)
where Sum_Of_Years = Useful_Life * (Useful_Life + 1) / 2
```

---

## Debt schedule

```
Beginning Balance
  + New Borrowings
  - Scheduled Repayments
  - Optional Prepayments (from excess cash)
= Ending Balance

Interest Expense = Beginning_Balance * Interest_Rate
```

For revolving credit facilities, model the draw as:
```
=MAX(0, -Cash_Before_Revolver)
```

This creates a circular reference (interest affects cash, cash affects revolver
draw). Resolve by enabling iterative calculation or using a prior-period
approximation.

---

## Common financial modeling mistakes

| Mistake | Impact | Fix |
|---|---|---|
| Hardcoded growth rates in formulas | Cannot run scenarios or audit assumptions | All assumptions on a dedicated Assumptions sheet |
| Balance sheet does not balance | Indicates a structural error in the model | Add a balance check row with conditional formatting |
| Mixing real and nominal values | Overstates or understates projections | Be consistent - use nominal throughout or real throughout |
| Forgetting working capital changes | Overstates free cash flow | Always include AR, inventory, AP changes in cash flow |
| Terminal value dominates DCF (>75% of EV) | Model is not useful - all value is in one speculative number | Extend the explicit forecast period or cross-check with multiples |
| Circular references from revolver/interest | Model may not converge or gives unstable results | Enable iterative calc with max 100 iterations, or use prior-period interest |
