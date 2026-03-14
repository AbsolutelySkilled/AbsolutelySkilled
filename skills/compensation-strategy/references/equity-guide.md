<!-- Part of the Compensation Strategy AbsolutelySkilled skill. Load this file when explaining equity types, tax treatment, vesting structures, early exercise, or 83(b) elections to employees, candidates, or founders. -->

# Equity Guide: ISO vs NSO vs RSU

Practical reference for understanding equity compensation instruments, their
tax implications, and vesting patterns. This guide is informational - always
recommend employees consult a personal tax advisor before making exercise or
election decisions.

---

## 1. Instrument Comparison

| Attribute | ISO | NSO | RSU |
|---|---|---|---|
| Full name | Incentive Stock Option | Non-Qualified Stock Option | Restricted Stock Unit |
| Who can receive | Employees only | Employees, contractors, advisors, board | Employees (primarily) |
| Tax on grant | None | None | None |
| Tax on vest | None | None | Ordinary income on FMV at vest |
| Tax on exercise | Possible AMT preference item | Ordinary income on spread (FMV - strike) | N/A (RSUs vest, not exercised) |
| Tax on sale | Capital gains (long-term if holding rules met) | Capital gains on any appreciation after exercise | Capital gains on appreciation after vest |
| Withholding required | No | Yes - employer withholds at exercise | Yes - employer withholds at vest |
| ISO holding rule | 2 years from grant + 1 year from exercise | None | None |
| Maximum grant | $100k per year (at exercise, by FMV at grant) | No statutory limit | No statutory limit |
| Value when issued | Only valuable if stock appreciates above strike | Only valuable if stock appreciates above strike | Always has value equal to current FMV |
| Strike price required | Yes - must equal FMV at grant (409A) | Yes - typically FMV at grant | No - no strike price |
| Best for | Early-stage employees; low FMV = low tax risk | Advisors, contractors, late grants above $100k ISO cap | Late-stage or public companies; predictable value |

---

## 2. ISO - Incentive Stock Options

### How they work

ISOs grant the right to purchase shares at a fixed price (the strike price,
set at FMV on the grant date via 409A valuation) for a defined period (typically
10 years from grant, or 90 days after termination).

An employee does not pay tax when ISOs are granted. Tax events occur at:
- **Exercise**: no regular income tax, but the spread (FMV - strike) is an AMT
  preference item - it counts toward Alternative Minimum Tax calculations
- **Sale**: if ISO holding rules are met, the entire gain from strike to sale
  price is taxed at long-term capital gains rates (currently 20% max federal)

### ISO holding rules

To get the favored long-term capital gains treatment, shares acquired via ISO
exercise must be held for the longer of:
- 2 years from the grant date
- 1 year from the exercise date

Selling before both holding periods are satisfied creates a **disqualifying
disposition** - the spread at exercise is reclassified as ordinary income.

### AMT risk

The spread at ISO exercise is an AMT preference item. In years where employees
exercise large ISO grants, their AMT bill can be substantial even if they do not
sell the shares. This is the primary reason employees should consult a tax
advisor before exercising ISOs, especially at high-FMV companies.

**Mitigation strategies:**
- Exercise early (83(b) election) when FMV is near the strike price
- Exercise in tranches across tax years to spread AMT exposure
- Keep track of AMT credits generated - they can be used to offset future regular
  tax once the ISO shares are sold

### ISO $100k limit

ISOs that become exercisable in a single year are limited to $100,000 in FMV
(measured at the grant date). Amounts above this automatically convert to NSOs.
For high-value senior grants, this limit means part of the grant is always NSOs.

---

## 3. NSO - Non-Qualified Stock Options

### How they work

NSOs work mechanically the same as ISOs - a fixed strike price, an exercise
window, and the right to purchase shares - but the tax treatment is less
favorable.

Tax events:
- **Exercise**: the spread (FMV at exercise - strike price) is ordinary income,
  reported on the W-2 (employees) or 1099 (contractors). The employer must
  withhold taxes at exercise.
- **Sale**: any appreciation from FMV at exercise to sale price is capital gains
  (long-term if held > 1 year after exercise)

### Who gets NSOs

- Contractors, advisors, and board members (cannot receive ISOs)
- Employees receiving grants above the $100k ISO limit
- Employees at companies that choose to use NSOs for simplicity

### NSO tax planning

Since exercise triggers ordinary income, employees with NSOs need to plan around:
- Cash needed to cover both the purchase price and the tax withholding at exercise
- Whether to exercise pre-liquidity (betting on appreciation) or wait until
  a liquidity event (simpler but concentrates risk)
- Post-termination exercise window: standard is 90 days, but some companies
  extend to 5 or 10 years for NSOs specifically to reduce departure tax pressure

---

## 4. RSU - Restricted Stock Units

### How they work

RSUs are a promise to deliver shares (or the cash equivalent) on a future date,
contingent on meeting a vesting condition (time-based, performance-based, or
both). There is no strike price - the RSU holder receives the full FMV of the
shares at vesting.

Tax events:
- **Vest**: the FMV of the shares on the vesting date is ordinary income,
  reported on the W-2. The employer withholds taxes, typically by withholding
  a portion of the vesting shares (sell-to-cover)
- **Sale**: any appreciation from FMV at vest to sale price is capital gains

### Why RSUs are common at later stages

At early-stage companies, the 409A strike price is low, making options
attractive (small spread = small tax event at exercise). At later stages, the
409A rises close to preferred share prices - exercising options with a high
FMV spread creates immediate large tax bills. RSUs avoid this: tax is deferred
to vest, and the shares have known value when the tax event occurs.

For public companies, RSUs are the standard instrument because:
- Employees can immediately sell vesting shares to cover taxes
- No cash required to exercise
- No AMT risk
- Predictable value at grant based on current stock price

### RSU double-trigger vesting (private companies)

Private company RSUs often use **double-trigger vesting**: shares vest only when
both (1) the time-based schedule is satisfied AND (2) a liquidity event occurs
(IPO or acquisition). This avoids the tax problem of vesting shares that cannot
be sold (would trigger income tax with no cash to pay it).

Without double-trigger, a private company RSU creates a taxable income event
at vesting with no way to sell shares to cover the tax.

---

## 5. Vesting Patterns

### Standard 4-year monthly with 1-year cliff

The most common structure for startup employees:

```
Grant date: January 1, Year 0
Grant: 48,000 shares

Year 1 (cliff):
  - Months 1-11: 0 shares vest
  - Month 12 (January 1, Year 1): 12,000 shares vest (25% cliff)

Years 2-4:
  - Months 13-48: 1,000 shares vest per month
  - 36 months * 1,000 = 36,000 shares

Total at 48 months: 48,000 shares (100%)
```

**Purpose of the cliff:** Protects the company from very early departures -
someone who leaves at month 6 receives no equity. Creates a meaningful milestone
at the 1-year mark.

### Back-weighted vesting (10/20/30/40)

Some companies use a schedule that grants more equity in later years:

```
Year 1: 10% vests
Year 2: 20% vests
Year 3: 30% vests
Year 4: 40% vests
```

This maximizes retention incentive in years 3 and 4 but feels slow to early
employees. Less common than standard cliff vesting.

### Immediate/monthly from day one (no cliff)

Used for senior hires or at mature companies where the cliff is seen as
hostile. Shares vest monthly from the start date, often at 1/48th per month.
Increases departure risk in the first year.

### Performance-based vesting

Vesting tied to achieving specific milestones (revenue targets, product
launches, funding rounds). Common for:
- Founder grants at investor-backed companies
- Executive compensation packages
- Sales roles (blended with time-vesting)

Mixed structures (50% time / 50% performance) are common for executives.

### Refresh grants

Refresh grants are new option or RSU grants issued to existing employees to
maintain ongoing retention incentives as initial grants vest out. Standard
practice:

- **Frequency**: annually, or at promotion
- **Sizing**: typically 25-50% of the initial grant value
- **Timing**: often issued at the same time as annual performance reviews
- **Cliff**: refresh grants sometimes carry a shorter 6-month cliff or no cliff
  since the employee has already proven tenure

Without a refresh program, every tenured employee eventually becomes fully
vested and has no equity-based reason to stay. Model the vesting curve for your
team annually to identify "vesting cliffs" before attrition spikes.

---

## 6. Early Exercise and 83(b) Elections

### Early exercise

Some option grants (typically ISOs at early-stage startups) include the right
to early exercise: purchasing shares before they vest. The shares are subject
to a repurchase right by the company that lapses as the normal vesting schedule
would have occurred.

**Why early exercise matters:** Exercising options at a very low 409A (common
in seed/pre-seed companies) minimizes the taxable spread at exercise and starts
the capital gains holding clock early.

### 83(b) election

When shares are received subject to vesting conditions (restricted shares or
early-exercised options), an 83(b) election allows the holder to elect to pay
taxes based on the current FMV rather than waiting for vesting.

**Requirements:**
- Must be filed with the IRS within **30 days** of receiving the restricted
  shares - this deadline is absolute and cannot be extended
- A copy must be attached to the employee's tax return for the year of election

**When it makes sense:**
- Early-stage company with very low 409A - the spread and FMV are both near
  zero, so the tax event is negligible
- Strong conviction the company will grow significantly (locking in capital
  gains treatment on the full appreciation)

**When it does not make sense:**
- Large spread at exercise (large immediate tax bill with no liquidity)
- Uncertain company prospects (paying taxes on value you may never realize)
- Company fails - the tax paid is lost and only partially recoverable as a
  capital loss

---

## 7. QSBS - Qualified Small Business Stock

Section 1202 of the IRS code provides a federal capital gains exclusion of up
to $10 million (or 10x the investor's basis, whichever is greater) on the gain
from selling QSBS, if:

- Stock was issued by a domestic C-corporation
- The corporation had gross assets under $50 million when the stock was issued
- The holder has held the stock for more than 5 years
- The stock was acquired at original issuance (not secondary market)
- The corporation is in a qualifying trade or business (most tech startups qualify;
  professional services, finance, and hospitality generally do not)

Employees who early-exercise ISOs or purchase restricted shares at a very early
stage may be eligible for QSBS treatment, potentially eliminating federal taxes
on up to $10M of gain. State taxes vary - California, for example, does not
conform to the federal QSBS exclusion.

> QSBS analysis requires a tax attorney or CPA. The rules are complex and
> fact-specific. This section is informational only.

---

## Quick Decision Reference

**"Which instrument should we grant to this person?"**
- Employee, early-stage, low 409A -> ISO (+ recommend 83(b) if early exercise available)
- Employee, grant exceeds $100k ISO limit -> Split: ISO up to $100k, NSO for remainder
- Advisor or contractor -> NSO only (ISOs are not available)
- Employee, late-stage or public company -> RSU
- Senior executive requiring large grant -> RSU or NSO depending on stage

**"Should I early exercise?"**
- 409A is very low (near par value) + strong conviction in company -> Yes, and file 83(b) within 30 days
- 409A has risen significantly + large spread -> Consult tax advisor first; AMT risk may be high

**"When should I tell employees about QSBS?"**
- At grant, if the company qualifies - employees who early exercise may start the 5-year clock immediately
- Again at Series B/C when valuation growth makes the potential exclusion material
