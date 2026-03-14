<!-- Part of the pricing-strategy AbsolutelySkilled skill. Load this file when
     working with price testing, willingness-to-pay research, or pricing experiments. -->

# Price Testing Methodology

## Overview

Price testing answers the question: "What price maximizes revenue (or profit, or
adoption) for a given customer segment?" There are three primary methodologies, each
with different trade-offs on cost, accuracy, and risk.

| Method | Cost | Accuracy | Risk | Best for |
|---|---|---|---|---|
| Van Westendorp | Low | Moderate | None (survey) | Early-stage price discovery |
| Gabor-Granger | Low | Moderate-High | None (survey) | Demand curve estimation |
| Conjoint analysis | High | High | None (survey) | Multi-feature packaging + pricing |
| A/B test (live) | Medium | Highest | Moderate (trust risk) | Validating a specific price point |

---

## Van Westendorp Price Sensitivity Meter

### How it works

Survey respondents answer four questions about a product description:

1. **Too Cheap** - "At what price would you consider this product to be so cheap
   that you would question its quality?"
2. **Cheap (Bargain)** - "At what price would you consider this product a bargain -
   a great buy for the money?"
3. **Expensive** - "At what price would you consider this product to be getting
   expensive - you would still consider it, but you would have to think about it?"
4. **Too Expensive** - "At what price would you consider this product to be so
   expensive that you would never consider buying it?"

### Analyzing results

Plot four cumulative distribution curves:
- Too Cheap (cumulative from high to low)
- Cheap (cumulative from high to low)
- Expensive (cumulative from low to high)
- Too Expensive (cumulative from low to high)

**Key intersections:**
- **Point of Marginal Cheapness (PMC)** = Too Cheap intersects Expensive
- **Point of Marginal Expensiveness (PME)** = Too Expensive intersects Cheap
- **Optimal Price Point (OPP)** = Too Cheap intersects Too Expensive
- **Indifference Price Point (IDP)** = Cheap intersects Expensive

The acceptable price range is PMC to PME. The optimal price point (OPP) is where
the fewest people reject the price on either end.

### Sample size

Minimum 100 respondents per segment. 200+ is recommended for stable curves.
Segment by company size, role, or use case - never aggregate all respondents
into one curve.

### Survey template

```
We are developing [product description - 2-3 sentences of what it does and
the problem it solves].

Thinking about the value this product provides, please answer the following:

1. At what monthly price would you consider this product to be priced so low
   that you would question its quality? $____

2. At what monthly price would you consider this product to be a bargain -
   a great buy for the money? $____

3. At what monthly price would you start to think this product is getting
   expensive - you would still consider buying it, but you would have to
   think about it? $____

4. At what monthly price would you consider this product so expensive that
   you would never consider buying it, regardless of its quality? $____
```

---

## Gabor-Granger Demand Curve

### How it works

Show respondents a price and ask a binary purchase intent question. Vary the
price across respondents (between-subjects) or sequentially for one respondent
(within-subjects with ascending or descending price ladder).

**Between-subjects approach (recommended):**
- Divide respondents into 5-7 groups
- Each group sees a different price point
- Ask: "At $X/month, how likely are you to purchase?" (Definitely would /
  Probably would / Might or might not / Probably would not / Definitely would not)
- Count "Definitely + Probably would" as demand at that price

**Within-subjects approach:**
- Start at the highest price: "Would you buy at $199/mo?"
- If no, step down: "Would you buy at $149/mo?"
- Continue until yes, or until the lowest price
- Record the price where they convert

### Building the demand curve

Plot: Price (x-axis) vs % who would buy (y-axis). This gives you a demand curve.

Revenue at each price = Price * % who would buy * Total addressable market.

The revenue-maximizing price is the point where (Price * Conversion %) is highest.

### Sample size

Minimum 30 respondents per price point (between-subjects). For 6 price points,
that is 180 respondents minimum.

---

## Conjoint Analysis

### When to use

Conjoint is the most powerful method but also the most complex and expensive. Use it
when you need to simultaneously optimize:
- Which features go in which tier
- What price to charge for each tier
- How much each feature contributes to willingness to pay

### How it works

Respondents see pairs (or sets) of product configurations and choose which they
prefer. Each configuration varies on multiple attributes (features, price, support
level, etc.). Statistical analysis decomposes choices into the relative value of
each attribute.

### Attribute design

Choose 4-6 attributes with 2-4 levels each:

```
Attribute 1: Price         -> $29, $49, $99, $149
Attribute 2: Seats         -> 5, 25, unlimited
Attribute 3: Storage       -> 10GB, 100GB, 1TB
Attribute 4: Support       -> Email only, Priority email, Dedicated CSM
Attribute 5: Integrations  -> Basic (5), Advanced (20), Custom API
```

### Output

Conjoint analysis produces:
1. **Part-worth utilities** - The value contribution of each attribute level
2. **Relative importance** - Which attributes drive purchase decisions most
3. **Willingness to pay** - Dollar value of each feature
4. **Optimal bundles** - The packaging that maximizes revenue or market share

### Practical advice

- Use a conjoint analysis platform (Sawtooth, Conjointly, or SurveyMonkey's
  conjoint module) - do not build this from scratch
- Minimum 200 respondents for stable results
- Limit to 6 attributes maximum or respondent fatigue degrades data quality
- Pre-test with 10-15 respondents to verify attribute levels make sense

---

## Live A/B testing prices

### The trust problem

Showing different prices to different users in the same market at the same time is
risky. If customers discover it (and they will), it destroys trust. The backlash
can outweigh any insight gained.

### Safe A/B testing approaches

**1. Geographic splits**
- Test Price A in one country, Price B in another
- Adjust for purchasing power parity
- Works well for global products with low cross-market communication

**2. New cohort splits**
- All existing customers keep current pricing
- New signups are randomly assigned to Price A or B
- Measure conversion rate, not existing customer reaction
- Run for 4-8 weeks to get statistical significance

**3. Feature packaging tests (price held constant)**
- Same price, different feature bundles
- "Would you rather have Plan A ($49/mo with X, Y) or Plan B ($49/mo with X, Z)?"
- Reveals feature value without price perception risk

**4. Landing page tests**
- Show different pricing pages to different traffic sources
- Measure click-through on "Start Free Trial" or "Buy Now"
- Does not require actual different prices at checkout
- Tests price perception, not willingness to pay

**5. Time-based sequential tests**
- Week 1-4: Price A for all new signups
- Week 5-8: Price B for all new signups
- Compare conversion rates between periods
- Risk: external factors (seasonality, marketing campaigns) can confound

### Statistical requirements

- Minimum 1,000 visitors per variant for pricing page conversion tests
- Run for at least 2 full billing cycles to capture churn effects
- Measure not just signup conversion but also:
  - 30-day retention
  - Expansion revenue (upgrades)
  - Net revenue per visitor (accounts for different conversion rates)

### What to measure

| Metric | Why it matters |
|---|---|
| Signup conversion rate | Direct price sensitivity signal |
| Trial-to-paid conversion | Whether the price survives the evaluation period |
| ARPU (average revenue per user) | Higher price * lower conversion may still win |
| Net revenue per visitor | The composite metric that matters most |
| 90-day retention | Cheap prices attract low-intent users who churn |
| NPS / satisfaction score | Detect if pricing is causing resentment |

---

## Common price testing mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Testing on existing customers | Churn and trust erosion | Only test on new prospects |
| Testing too many prices at once | Insufficient sample size per variant | Test 2-3 prices max |
| Running for less than 4 weeks | Seasonal and weekly variation skews results | Minimum 4 weeks, ideally 8 |
| Measuring only conversion rate | A lower price converts better but may yield less revenue | Always calculate net revenue per visitor |
| Not segmenting results | Aggregate data hides segment differences | Analyze by company size, source, and use case |
| Announcing the test publicly | Customers wait for the lower price | Never announce pricing experiments |
