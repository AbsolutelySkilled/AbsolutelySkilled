<!-- Part of the bookkeeping-automation AbsolutelySkilled skill. Load this file when
     working on month-end close procedures, close timelines, or period-end tasks. -->

# Month-End Close Checklist

The month-end close is the systematic process of verifying, adjusting, and locking
a period's financial records so that the resulting statements are accurate and
auditable. A disciplined close takes 5 business days or fewer. This checklist is
organized by day and owner. Adapt timing to your company's payroll and billing cycles.

---

## Before Close Begins (Last 2 Days of Month)

**Owner: Finance / AP**

- [ ] Send reminders to all budget owners to submit outstanding expense reports
- [ ] Chase any unsubmitted corporate card transactions (auto-lock cards if needed)
- [ ] Confirm all open vendor invoices are entered into AP - no invoices sitting in email
- [ ] Verify pending ACH/wire payments have cleared or are correctly outstanding
- [ ] Confirm payroll has posted correctly if payroll date falls end-of-month

---

## Day 1 - Lock and Reconcile Transactions

**Owner: Controller / Senior Bookkeeper**

### Lock the Period

- [ ] Set prior-period lock date in accounting system to prevent backdated entries
  from the previous month (exception: close-related adjustments must still be
  posted until close is signed off)
- [ ] Communicate the lock to all system users

### Bank and Credit Card Reconciliations

- [ ] Download or confirm bank feed is current for all bank accounts
- [ ] Reconcile each operating account:
  - [ ] Match all cleared transactions to GL entries
  - [ ] List all outstanding checks with issue date and payee
  - [ ] List all deposits in transit
  - [ ] Verify: Adjusted Bank Balance = Adjusted Book Balance
  - [ ] Flag any stale outstanding checks older than 90 days for void/reissue review
- [ ] Reconcile each company credit card account:
  - [ ] Match all card transactions to GL entries
  - [ ] Verify closing statement balance matches GL credit card liability balance
- [ ] File signed reconciliation workpapers (PDF or locked spreadsheet)

### Petty Cash (if applicable)

- [ ] Count petty cash and reconcile to GL petty cash account
- [ ] Post replenishment journal entry if balance is below threshold

---

## Day 2 - Subledger Reconciliations

**Owner: AP Accountant / AR Accountant**

### Accounts Receivable

- [ ] Run AR aging report from billing system
- [ ] Confirm AR subledger total matches the AR control account in the GL
  - Difference = unposted cash receipts or invoice syncs - investigate and clear
- [ ] Apply any unapplied cash receipts to open invoices
- [ ] Review invoices in "pending" or "draft" status - post or void
- [ ] Identify balances over 90 days for bad debt review (see Bad Debt section below)

### Accounts Payable

- [ ] Run AP aging report
- [ ] Confirm AP subledger total matches the AP control account in the GL
- [ ] Ensure all invoices received by month-end are entered, even if not yet approved
  (accrual basis: expense is incurred when invoice is received)
- [ ] Review any credit memos from vendors - apply or post correctly
- [ ] Confirm no duplicate invoices exist (same vendor, same amount, same period)

### Payroll Subledger (if applicable)

- [ ] Reconcile total gross payroll to payroll provider report
- [ ] Reconcile payroll tax liabilities to payroll provider tax detail
- [ ] Confirm employer payroll tax entries have posted (FICA match, FUTA, SUTA)

---

## Day 3 - Accruals and Adjusting Entries

**Owner: Controller**

### Accrued Expenses

Post accruals for expenses incurred but not yet invoiced. Each accrual should be
set to auto-reverse on the first day of the following month.

- [ ] **Accrued payroll** - Calculate days worked but unpaid at month-end
  ```
  Debit:  Salary and Wages Expense
  Credit: Accrued Payroll Liability
  Memo:   Accrued payroll - [X] days - [Month Year] - AUTO-REVERSE [Date]
  ```
- [ ] **Accrued payroll taxes** - Corresponding employer taxes on accrued payroll
- [ ] **Accrued PTO/vacation** - If policy requires accrual of earned but unused PTO
- [ ] **Uninvoiced vendor expenses** - Any service received without invoice yet
  (legal fees, consultants, utilities if bill not received)
- [ ] **Accrued interest** - On outstanding loans (balance * monthly rate)
- [ ] **Accrued bonuses** - If annual bonus is earned ratably through the year

### Deferred Revenue

- [ ] Review deferred revenue schedule for subscriptions or prepaid contracts
- [ ] Post monthly revenue recognition entry for each active contract:
  ```
  Debit:  Deferred Revenue (liability)
  Credit: Subscription Revenue (income)
  Amount: Contract total / contract term months
  ```
- [ ] Confirm new contracts have been added to the deferred revenue schedule
- [ ] Confirm expired or terminated contracts have been removed

### Prepaid Expenses

- [ ] Run prepaid amortization schedule
- [ ] Post monthly amortization for each prepaid item:
  ```
  Debit:  [Relevant Expense Account]
  Credit: Prepaid Expenses (asset)
  Amount: Prepaid balance / remaining months
  ```
- [ ] Add any new prepaid invoices paid during the month (insurance, SaaS annuals)

### Fixed Asset Depreciation

- [ ] Run depreciation schedule for all capitalized assets
- [ ] Post depreciation journal entry:
  ```
  Debit:  Depreciation Expense
  Credit: Accumulated Depreciation
  Amount: Per depreciation schedule
  ```
- [ ] Add any assets placed in service during the month
- [ ] Remove fully depreciated assets from the active schedule

### Inventory Adjustments (if applicable)

- [ ] Reconcile inventory count or system quantity to GL inventory balance
- [ ] Post any write-downs for obsolete or damaged inventory
- [ ] Record cost of goods sold for any manual adjustments

---

## Day 4 - Review and Flux Analysis

**Owner: Controller / CFO**

### Trial Balance Review

- [ ] Pull the trial balance and check for:
  - [ ] Any accounts with an unexpected balance sign (e.g., negative cash, negative revenue)
  - [ ] Any accounts with abnormally large or small balances versus last month
  - [ ] Any accounts used for the first time that may be miscategorized
  - [ ] Zero-balance accounts that should not be zero (e.g., payroll tax liabilities)

### Revenue Tie-Out

- [ ] Export revenue from billing system (Stripe, Recurly, Salesforce, etc.)
- [ ] Compare to GL revenue accounts line by line
- [ ] Variance > $100 or 0.5% requires investigation and explanation

### Flux Analysis (Month-over-Month Variance)

Review each P&L line for variances greater than the higher of $1,000 or 5% versus
prior month and versus budget:

- [ ] Revenue - explain volume, pricing, or timing changes
- [ ] COGS - explain margin changes; flag margin compression
- [ ] Payroll - reconcile headcount change to payroll dollar change
- [ ] Each significant OpEx line - explain or document as expected

Document explanations in the monthly close memo for the financial package.

### Balance Sheet Reconciliation

Every balance sheet account should have a supporting schedule. Confirm existence of:

- [ ] Cash - bank reconciliation (Day 1)
- [ ] Accounts Receivable - AR aging + subledger tie (Day 2)
- [ ] Prepaid Expenses - prepaid amortization schedule (Day 3)
- [ ] Fixed Assets - fixed asset + depreciation schedule (Day 3)
- [ ] Accounts Payable - AP aging + subledger tie (Day 2)
- [ ] Accrued Liabilities - list of all open accruals with amounts
- [ ] Deferred Revenue - contract-level schedule (Day 3)
- [ ] Loans Payable - lender statement or amortization schedule

---

## Day 5 - Sign-Off, Lock, and Distribute

**Owner: CFO / Controller**

### Final Checks

- [ ] Confirm all adjusting entries from Days 3-4 have been reviewed and posted
- [ ] Run final trial balance and confirm it balances (debits = credits)
- [ ] Confirm no unauthorized entries were posted after the Day 1 lock date
- [ ] Review auto-reversals scheduled for Day 1 of next month - confirm they are set

### Bad Debt Review (Quarterly or as needed)

- [ ] Review AR invoices over 120 days with the sales or account management team
- [ ] For invoices deemed uncollectible, post write-off entry:
  ```
  Debit:  Allowance for Doubtful Accounts
  Credit: Accounts Receivable
  ```
- [ ] Update allowance for doubtful accounts estimate based on aging percentages

### CFO / Controller Sign-Off

- [ ] Controller reviews and approves all adjusting journal entries
- [ ] CFO reviews P&L and balance sheet at summary level
- [ ] Both sign off on close memo confirming the period is complete and accurate
- [ ] **Lock the period in the accounting system** - no further entries permitted
  without Controller approval and a documented reason

### Financial Package Distribution

- [ ] Generate final Income Statement (P&L) - current month and YTD
- [ ] Generate final Balance Sheet
- [ ] Generate Statement of Cash Flows (if on accrual)
- [ ] Attach flux analysis memo with explanations
- [ ] Distribute to: CEO, CFO, Board (if applicable), department heads
- [ ] File all close workpapers in the designated close folder with month/year label

---

## Continuous Improvement Checklist

After each close, record:

- [ ] **Close completion date** - Did we hit Day 5?
- [ ] **Blockers encountered** - What caused delays?
- [ ] **Errors found** - Where did a wrong entry need correction?
- [ ] **Process improvements** - One specific thing to automate or tighten before next close

Track close duration month-over-month. A close that takes longer than the prior month
without a clear reason (e.g., new entity, audit) is a process regression - investigate it.

---

## Quick Reference: Journal Entry Sign-Off Thresholds

| Entry Amount  | Required Approver         |
|---------------|---------------------------|
| < $1,000      | Senior Bookkeeper          |
| $1,000-$9,999 | Controller                 |
| $10,000+      | Controller + CFO           |
| Any reversal  | Controller                 |
| Any write-off | Controller + CFO           |
