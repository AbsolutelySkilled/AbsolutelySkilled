<!-- Part of the Product Analytics AbsolutelySkilled skill. Load this file when
     working with funnel construction, conversion analysis, or funnel comparison. -->

# Funnel Methodology

Deep reference for building, analyzing, and optimizing conversion funnels in
product analytics. Covers funnel types, time-window selection, segmentation
strategies, statistical comparison, and debugging common funnel problems.

---

## Funnel Types

### Linear funnel

A strict sequence of steps where users must complete step N before reaching step
N+1. Most common for signup, checkout, and onboarding flows.

```
Landing Page -> Sign Up -> Verify Email -> Complete Profile -> First Action
```

**When to use:** The path is deterministic and enforced by the product (e.g., you
cannot purchase without adding to cart first).

### Branching funnel

Multiple paths lead to the same goal. Users may take different routes depending on
their entry point, device, or behavior.

```
                  -> Feature A use -+
Entry -> Signup --                  +--> Activation
                  -> Feature B use -+
```

**When to use:** The product has multiple paths to value (e.g., a project tool where
activation could be "created a project" OR "joined a shared project").

**How to analyze:** Build separate linear funnels for each branch and compare
conversion rates. Then build a combined funnel that counts any path to the goal.

### Reverse funnel

Start from the goal event and work backwards to identify which preceding behaviors
correlate most strongly with conversion.

**When to use:** You know users are converting but don't know why. Reverse funnels
surface unexpected high-conversion paths.

**Method:**
1. Select all users who completed the goal event in a period
2. Look at their behavior in the 7/14/30 days before conversion
3. Identify the most common action sequences
4. Compare against users who did NOT convert in the same period
5. The actions with the highest differential are your conversion drivers

---

## Time Window Selection

The conversion window defines the maximum time allowed between funnel entry and
goal completion. Choosing the wrong window distorts conversion rates.

### How to choose

1. Pull the time-to-convert distribution for users who eventually reach the goal
2. Find the 90th percentile of time-to-convert
3. Set the window at or slightly above the 90th percentile

**Example:**
```
Time to first purchase (from signup):
  P50:  2 days
  P75:  5 days
  P90:  12 days
  P95:  21 days

Recommended window: 14 days (covers 90%+ of natural converters)
```

### Common windows by product type

| Product type | Funnel | Typical window |
|---|---|---|
| E-commerce | Browse to purchase | 1 session or 7 days |
| SaaS (self-serve) | Signup to activation | 7-14 days |
| SaaS (enterprise) | Trial start to paid | 30-45 days |
| Marketplace | Search to transaction | 1-7 days |
| Mobile app | Install to core action | 1-3 days |

### Window pitfalls

- **Too short:** Excludes legitimate converters; understates true conversion rate
- **Too long:** Includes coincidental converters who would not have converted due to
  the funnel experience; overstates conversion rate
- **No window at all:** "Ever converted" is meaningless for optimization - it mixes
  Day 1 converters with Month 6 converters

---

## Segmentation Strategies

Never analyze a funnel in aggregate alone. Always segment by at least two dimensions.

### High-value segments to compare

| Segment dimension | Why it matters |
|---|---|
| Acquisition channel | Paid users may have different intent than organic |
| Device / platform | Mobile funnels often have different friction points |
| Geography | Localization, payment methods, and trust differ by region |
| User plan / tier | Free vs. trial vs. paid users behave differently |
| First-touch feature | Users who entered via Feature A may convert differently |
| Cohort (signup week) | Newer cohorts should convert better if product is improving |

### Segmented funnel analysis workflow

1. Build the aggregate funnel as a baseline
2. Break down by acquisition channel - identify the highest and lowest converting channels
3. Break down by device - find mobile-specific drop-offs
4. Break down by cohort - confirm whether product changes are improving conversion
5. Cross-segment the top finding (e.g., "paid + mobile" or "organic + desktop") to
   identify the most actionable audience

---

## Comparing Funnels Statistically

When comparing funnel conversion rates across segments or time periods, use
statistical tests to confirm the difference is meaningful.

### Chi-square test for step conversion

Use when comparing conversion rates between two segments at a specific funnel step.

```
             Converted   Not Converted   Total
Segment A      120           880          1000
Segment B      150           850          1000

chi2 = sum of (observed - expected)^2 / expected for each cell
df = 1

If chi2 > 3.84 (alpha = 0.05), the difference is statistically significant.
```

### Confidence interval for conversion rate

```
CI = p +/- z * sqrt(p * (1 - p) / n)

Where:
  p = observed conversion rate
  z = 1.96 for 95% confidence
  n = sample size
```

Report confidence intervals when presenting funnel metrics to stakeholders. A
conversion rate of "12% (95% CI: 10.5% - 13.5%)" communicates uncertainty honestly.

### Practical significance vs. statistical significance

A 0.1 percentage point improvement that is statistically significant with n=1M users
is real but may not justify the engineering investment. Always pair statistical
significance with a practical significance threshold defined before analysis.

---

## Debugging Common Funnel Problems

### Problem: Step conversion is unexpectedly low

**Diagnostic checklist:**
1. Check event instrumentation - is the step event firing correctly on all platforms?
2. Check for tracking gaps - ad blockers, consent banners, and network failures cause
   event loss; estimate the gap with server-side vs. client-side event comparison
3. Check for UX friction - session recordings at the drop-off step reveal confusion,
   rage clicks, or error states
4. Check for technical errors - error rates on the API call that powers the step
5. Check for segmentation effects - one segment may have near-zero conversion (e.g.,
   a specific browser or region)

### Problem: Funnel shows 0% at a step

Almost always an instrumentation issue. Verify:
1. The event name matches exactly (case-sensitive)
2. The event is firing in production (not just staging)
3. The event is within the conversion window
4. User identity is stitched correctly (anonymous to authenticated)

### Problem: Conversion rate improved but revenue didn't

Possible causes:
1. Lower-value users are converting (more volume, less revenue per user)
2. Conversion window was shortened, excluding high-value but slower converters
3. The improvement is in a low-traffic segment that doesn't move the overall number
4. There is a downstream drop-off (e.g., more trials start but trial-to-paid is flat)

---

## Advanced: Multi-Touch Funnels

For products where the conversion path spans multiple sessions over days or weeks,
single-session funnels miss the full picture.

### Multi-session funnel construction

1. Define a user-level funnel (not session-level)
2. Track the first occurrence of each step event per user within the window
3. Order steps by their first occurrence timestamp
4. Allow steps to occur in different sessions
5. Report median sessions-to-convert alongside the conversion rate

### Attribution within the funnel

When a user completes steps across multiple touchpoints (email, web, mobile app),
attribute each step to the platform/channel where it occurred. This reveals which
channels drive which funnel stages.

```
Example:
  Step 1 (Awareness):   Email campaign (42%), In-app banner (38%), Blog (20%)
  Step 2 (Trial):       Web app (78%), Mobile app (22%)
  Step 3 (Activation):  Web app (65%), Mobile app (35%)
```

This attribution view tells you email drives awareness but web drives conversion -
different channels serve different funnel stages.
