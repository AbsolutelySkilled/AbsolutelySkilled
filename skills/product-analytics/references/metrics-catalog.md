<!-- Part of the product-analytics AbsolutelySkilled skill. Load this file when
     working with specific metric definitions, formulas, or benchmark guidance. -->

# Product Metrics Catalog

A reference catalog of common product metrics organized by category. Each entry
includes a definition, formula, and notes on interpretation and common mistakes.

---

## Acquisition metrics

### Traffic volume

**Definition:** Total sessions or unique visitors arriving at a product surface in a period.

**Formula:** Count of sessions (or unique `user_id` / `anonymous_id`) within date range.

**Notes:** Traffic alone is meaningless without conversion context. Always report alongside
acquisition channel breakdown. Direct/organic vs. paid vs. referral ratios matter as much
as the total.

---

### Customer Acquisition Cost (CAC)

**Definition:** The average cost to acquire one new paying customer.

**Formula:** `CAC = Total sales and marketing spend / New customers acquired` (same period)

**Notes:** Segment by channel. Blended CAC hides that paid search CAC may be 10x organic
CAC. Compare against LTV; healthy SaaS businesses target LTV:CAC of 3:1 or better.
Recovery time (months to recoup CAC from gross margin) should be under 12 months.

---

### Organic vs. paid split

**Definition:** The proportion of new user acquisition coming from paid channels vs.
unpaid (SEO, word of mouth, referral, direct).

**Formula:** `Organic % = Organic new users / Total new users`

**Notes:** High paid dependency is a risk factor. If you turn off paid, does growth stop?
Growing organic share over time indicates product-led or brand-led growth compounding.

---

## Activation metrics

### Activation rate

**Definition:** The percentage of new users who reach the product's "aha moment" - the
first experience of core value - within a defined window.

**Formula:** `Activation rate = Users who completed activation event / New users in cohort`

**Notes:** The activation event must be defined specifically. "Logged in" is not activation.
Define it as the earliest action that predicts long-term retention. A/B testing activation
flows is high-leverage; each percentage point improvement compounds through the entire funnel.

---

### Time to activate

**Definition:** The median and 90th-percentile time between signup and completion of the
activation event.

**Formula:** `median(activation_timestamp - signup_timestamp)` across activated users.

**Notes:** Long time-to-activate often indicates friction in onboarding, not user
disinterest. Reduce steps, pre-fill data, and use progressive disclosure to compress it.
Track the 90th percentile - a long tail means a significant group never activates in time.

---

### Onboarding completion rate

**Definition:** The percentage of new users who complete each step of the onboarding flow.

**Formula:** Funnel conversion at each onboarding step.

**Notes:** Report as a funnel, not a single number. The step with the steepest drop-off
is the highest-leverage fix. Compare completion rates across acquisition channels; users
from different sources often have different onboarding behavior.

---

## Engagement metrics

### Daily / Weekly / Monthly Active Users (DAU / WAU / MAU)

**Definition:** The count of unique users who complete a qualifying action within a day /
week / month.

**Formula:** `Count of distinct user_id where core_event occurred in window`

**Notes:** "Active" must be defined as a meaningful action, not just a session open. DAU/MAU
ratio (stickiness) is more informative than MAU alone. A ratio above 20% indicates habitual
use; above 50% is strong for productivity tools.

---

### DAU/MAU ratio (Stickiness)

**Definition:** The proportion of monthly active users who also use the product daily.
Measures habit formation.

**Formula:** `Stickiness = DAU / MAU`

**Benchmarks:**
- 50%+ - world-class (WhatsApp, Instagram)
- 20-50% - strong (Slack, Notion)
- 10-20% - moderate; investigate use case frequency
- Under 10% - low; may be expected for low-frequency tools (e.g., tax software)

**Notes:** For low-frequency-by-nature products (quarterly review tools, annual planning),
WAU/MAU or a custom "expected use interval" is more appropriate than DAU/MAU.

---

### Session depth and duration

**Definition:** The number of actions or pages viewed per session (depth) and the time
spent per session (duration).

**Formula:** `avg(actions per session)`, `avg(session_end - session_start)`

**Notes:** Higher is not always better. A shorter session that completes the user's job
faster may indicate better UX. Compare depth and duration against task completion to
determine whether long sessions reflect engagement or confusion.

---

### Feature engagement rate

**Definition:** The percentage of active users who use a specific feature within a period.

**Formula:** `Feature engagement rate = Users who triggered feature event / Total active users`

**Notes:** Segment by user plan, acquisition cohort, and user role. Low engagement may
indicate poor discoverability, irrelevance to a segment, or a broken experience. Combine
with qualitative research before concluding the feature should be removed.

---

## Retention metrics

### D1 / D7 / D30 retention

**Definition:** The percentage of users from a cohort who return and complete a qualifying
action on day 1, 7, or 30 after their first use.

**Formula:** `D7 retention = Users active on day 6-8 / Users in cohort`

**Notes:** Use a ±1 day window for day markers to smooth for timezone and activity timing
variance. D1 is an early signal of first-run experience quality. D30 is a proxy for
product-market fit. See SKILL.md retention curve benchmarks.

---

### Net Revenue Retention (NRR)

**Definition:** The percentage of recurring revenue retained from existing customers over
a period, including expansion and contraction. Also called Net Dollar Retention (NDR).

**Formula:**
```
NRR = (MRR at start + expansion MRR - contraction MRR - churned MRR) / MRR at start
```

**Benchmarks:**
- 130%+ - best-in-class (Snowflake, Twilio)
- 110-130% - strong SaaS
- 100-110% - healthy; expansion offsets churn
- Under 100% - revenue is leaking; fix churn before scaling acquisition

**Notes:** NRR above 100% means the business can grow revenue without acquiring a single
new customer. It is the most powerful indicator of a healthy B2B SaaS model.

---

### Gross Revenue Retention (GRR)

**Definition:** The percentage of recurring revenue retained from existing customers,
excluding expansion. Measures raw churn.

**Formula:**
```
GRR = (MRR at start - contraction MRR - churned MRR) / MRR at start
```

**Notes:** GRR has a ceiling of 100%. Compare GRR and NRR together: high GRR + high NRR
indicates a healthy expanding base. Low GRR + high NRR means expansion is masking churn -
a risk if the expansion pool runs out.

---

### Churn rate

**Definition:** The percentage of customers (or revenue) lost in a period.

**Formula:**
- **Logo churn:** `Churned customers / Customers at period start`
- **Revenue churn:** `Churned MRR / MRR at period start`

**Notes:** Always clarify whether "churn" refers to logo churn or revenue churn - they
differ significantly for businesses with tiered pricing. Measure churn at multiple time
horizons (monthly and annual) and by customer segment. Early-cohort churn is often higher
and skews aggregate numbers; normalize by cohort age.

---

### Resurrection rate

**Definition:** The percentage of previously churned users who become active again in a
period.

**Formula:** `Resurrected users / Churned users from prior period`

**Notes:** A high resurrection rate is a positive signal and an acquisition efficiency
win - reactivating a lapsed user is typically cheaper than acquiring a new one. Investigate
what triggers re-activation: product changes, marketing campaigns, or natural lifecycle
events.

---

## Conversion metrics

### Free-to-paid conversion rate

**Definition:** The percentage of free or trial users who convert to a paid plan.

**Formula:** `Paid conversions / Free or trial users in cohort`

**Notes:** Measure within a defined window (30-day or 90-day trial cohort). Analyze by
acquisition channel, activation status, and feature usage. Users who activated typically
convert at 2-5x the rate of users who did not. Improving activation is usually the highest-
leverage lever for conversion.

---

### Funnel conversion rate

**Definition:** The percentage of users who complete each step in a defined conversion
funnel, from entry to goal.

**Formula:** `Step N+1 completions / Step N completions`

**Notes:** See SKILL.md funnel analysis section for full methodology. Always set a
conversion window. Report step-level rates, not just overall conversion.

---

## Revenue metrics

### Monthly Recurring Revenue (MRR)

**Definition:** The normalized monthly value of all active recurring subscriptions.

**Formula:** `Sum of (subscription value / subscription period in months)` for all active subscriptions.

**Notes:** Track MRR movement components separately: new MRR, expansion MRR, contraction
MRR, churned MRR, and reactivation MRR. The MRR waterfall chart makes growth drivers and
drags immediately visible.

---

### Average Revenue Per User (ARPU)

**Definition:** The average revenue generated per active user in a period.

**Formula:** `ARPU = Total revenue / Active users`

**Notes:** Segment by plan tier and user cohort. ARPU trends upward when expansion revenue
is working; it trends downward when a product moves down-market or discounting increases.
Compare ARPU against CAC: if ARPU is low and CAC is high, the unit economics are broken.

---

### Customer Lifetime Value (LTV / CLV)

**Definition:** The projected total revenue a customer generates over their relationship
with the product.

**Formula (simple):** `LTV = ARPU / Churn rate`

**Formula (with gross margin):** `LTV = (ARPU * Gross margin %) / Churn rate`

**Notes:** LTV is a projection based on current churn; it is sensitive to churn rate
assumptions. A 2% monthly churn implies ~12-month average lifetime; 0.5% monthly churn
implies ~17-year average lifetime. Use gross-margin-adjusted LTV when comparing against
CAC to get a true picture of unit economics.

---

## Product-market fit signals

### Sean Ellis PMF score

**Definition:** The percentage of surveyed users who would be "very disappointed" if they
could no longer use the product.

**Benchmark:** 40%+ is considered a threshold indicating product-market fit.

**Notes:** Survey active users only. If the number is below 40%, the open-ended responses
explaining "very disappointed" answers reveal what the product is already doing right for
its core segment.

---

### NPS (Net Promoter Score)

**Definition:** A measure of customer loyalty based on likelihood to recommend.

**Formula:** `NPS = % Promoters (9-10) - % Detractors (0-6)`

**Benchmarks:**
- 70+ - exceptional
- 50-70 - excellent
- 30-50 - good
- 0-30 - room for improvement
- Negative - urgent issue

**Notes:** NPS is most useful as a trend signal and a segmentation tool (what do promoters
have in common?). A single NPS number without verbatim qualitative feedback is low-value.
Survey timing matters: surveying immediately after onboarding vs. 90 days in yields
different scores for different reasons.
