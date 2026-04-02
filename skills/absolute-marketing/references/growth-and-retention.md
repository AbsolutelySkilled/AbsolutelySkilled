<!-- Part of the Absolute Marketing skill. Load this file when building growth loops, reducing churn, designing referral programs, setting pricing strategy, or implementing product-led growth. -->

# Growth and Retention Reference

## AARRR Pirate Metrics

The five stages every user passes through:

| Stage | Question | Key Metric |
|-------|----------|------------|
| **Acquisition** | How do users find you? | Channel conversion rate |
| **Activation** | Do they have a great first experience? | Setup completion rate |
| **Retention** | Do they come back? | D7/D30/D90 retention |
| **Revenue** | Do they pay? | ARPU, conversion to paid |
| **Referral** | Do they tell others? | Viral coefficient (K) |

### North Star Metric Examples

Pick one metric that captures the core value exchange:

- **Slack** - Messages sent per active team per week
- **Airbnb** - Nights booked
- **Spotify** - Time spent listening
- **Dropbox** - Files saved/synced
- **HubSpot** - Weekly active contacts managed

A north star must be measurable, reflect value delivery, and lead revenue (not lag it).

---

## Growth Loops vs Funnels

Funnels leak at every step and require constant top-of-funnel investment. Loops compound - each cohort's output feeds the next cohort's input.

### Loop Types

| Type | Mechanism | Example |
|------|-----------|---------|
| **Viral** | Users invite users | Dropbox referral, Calendly links |
| **Content** | Usage generates indexable content | Pinterest pins, Stack Overflow answers |
| **Sales-assisted** | Product usage triggers sales outreach | Slack free team hits limits |
| **Paid** | Revenue funds acquisition spend | DTC brands reinvesting margin |

### Viral Coefficient

```
K = average_invites_per_user * invite_conversion_rate
```

- **K > 1** - True viral growth (rare, unsustainable long-term)
- **K = 0.5-1.0** - Strong word-of-mouth amplification
- **K < 0.3** - Referral is a minor channel

Measure K over a 90-day window, not launch burst. Early adopters always over-index on sharing.

---

## Activation Optimization

### Finding the Aha Moment

Compare behavioral data between two groups:
1. Users who churned within week 1
2. Users who retained through week 4

Look for the action or threshold that separates them (e.g., "invited 3 teammates" or "created first dashboard").

### Optimization Process

1. **Define** the aha moment from data analysis
2. **Map** every step from signup to aha
3. **Measure** drop-off at each step
4. **Prioritize** the largest absolute drop-off (not percentage)
5. **A/B test** interventions on that step
6. **Repeat** for the next largest drop

### Retention Benchmarks by Category

| Product Type | Good D30 Retention | Great D30 Retention |
|-------------|-------------------|---------------------|
| Consumer social | 25% | 40%+ |
| B2B SaaS | 40% | 70%+ |
| E-commerce | 10% | 25%+ |
| Mobile games | 5% | 15%+ |
| Productivity tools | 20% | 45%+ |

---

## Product-Led Growth (PLG)

### PLG Motions

| Motion | How It Works | Best For |
|--------|-------------|----------|
| **Freemium** | Free tier forever, paid unlocks more | Wide TAM, low marginal cost |
| **Free trial** | Full product, time-limited | Complex products needing exploration |
| **Usage-based** | Pay for what you use | Variable consumption patterns |

### Freemium Gotcha

The #1 PLG failure: free tier is too generous. Users never hit the upgrade trigger. Design the free tier to deliver value but create natural friction at the expansion moment.

### PLG Metrics

- **Activation rate** - % of signups reaching aha moment (target: 40-60%)
- **Time-to-value** - Minutes/hours from signup to first value (target: <5 min for simple tools)
- **PQL rate** - % of free users qualifying as product-qualified leads (target: 15-30%)
- **Expansion revenue** - Revenue from existing customers upgrading (target: >30% of new ARR)

---

## Churn Prevention

### Churn Split

- **Voluntary churn** (50-70%) - User actively cancels
- **Involuntary churn** (30-50%) - Payment fails, card expires

### Cancel Flow Design

```
Trigger (cancel click)
  -> Survey (why are you leaving?)
    -> Dynamic Offer (matched to reason)
      -> Confirmation (are you sure?)
        -> Post-Cancel (win-back sequence)
```

### Dynamic Save Offers

| Cancel Reason | Primary Offer | Fallback Offer |
|--------------|---------------|----------------|
| Too expensive | 20-30% discount for 2-3 months | Downgrade to lower tier |
| Not using it | Pause for 1-3 months | Free onboarding session |
| Missing feature | Roadmap + timeline commitment | Workaround documentation |
| Switching to competitor | Side-by-side comparison + discount | Feedback interview for credit |
| Technical issues | Escalated support within 24h | Account credit |
| Business closed | Skip offer (respect the situation) | N/A |

### Churn Benchmarks

| Metric | Target |
|--------|--------|
| Monthly churn (B2C) | < 5% |
| Monthly churn (B2B) | < 2% |
| Cancel flow save rate | 25-35% |
| Offer acceptance rate | 15-25% |
| Pause reactivation rate | 60-80% |
| Dunning recovery rate | 50-60% |

### Churn Risk Signals

| Signal | Severity | Lead Time |
|--------|----------|-----------|
| Login frequency drops 50%+ | High | 2-4 weeks |
| Core feature usage stops | High | 1-3 weeks |
| Billing/pricing page visits | Medium | Days |
| Data export initiated | Critical | Days |
| Support tickets spike then stop | Medium | 1-2 weeks |

### Customer Health Score

```
Health = Login_Score * 0.30
       + Feature_Usage * 0.25
       + Support_Sentiment * 0.15
       + Billing_Health * 0.15
       + Engagement_Trend * 0.15
```

Score each dimension 0-100. Overall < 40 = at risk, 40-70 = monitor, > 70 = healthy.

### Dunning (Involuntary Churn Recovery)

Retry schedule for failed payments:
1. **24 hours** after failure
2. **3 days** after failure
3. **5 days** after failure
4. **7 days** after failure (final attempt)

Smart tip: retry on the same day-of-month the original charge succeeded. Success rates jump 15-20%.

### Anti-Patterns

- Discounts too deep (50%+) - trains users to cancel for deals
- No cancel flow at all - users dispute charges instead
- Pause duration > 3 months - users forget they have an account
- Ignoring involuntary churn - it is the easiest churn to fix

---

## Referral Programs

### Referral Loop

```
Trigger (high-intent moment)
  -> Share (frictionless mechanism)
    -> Convert (friend activates)
      -> Reward (both sides)
        -> Loop (new user triggers their own referrals)
```

### High-Intent Trigger Moments

Best times to prompt a referral (in order of effectiveness):
1. Immediately after the aha moment
2. After hitting a milestone (e.g., 100th order, 1 year anniversary)
3. After a positive support interaction
4. After upgrading to a paid plan

### Share Mechanism Ranking

1. **In-product sharing** (highest conversion) - embedded invite flows
2. **Personalized link** - unique URL with attribution
3. **Email invite** - pre-written, editable template
4. **Social sharing** - one-click to Twitter/LinkedIn
5. **Referral code** (lowest conversion) - manual entry required

### Referral Program Stats

- Referred customers have **16-25% higher LTV** than non-referred
- Referred customers show **18-37% lower churn**
- Existing customers who refer have **2-3x the referral rate** of new ones
- **Tie rewards to activation, not signup** - prevents gaming

### Reward Structure

Double-sided rewards outperform single-sided by 2-4x. Reward the referrer for their friend's activation, not mere registration.

---

## Pricing Strategy

### Three Axes of Pricing

1. **Packaging** - What goes in each tier?
2. **Pricing metric** - What unit do you charge on? (seats, usage, features)
3. **Price point** - How much?

### Value-Based Pricing Stack

```
Perceived Value (ceiling)     -- what customers believe it's worth
  Your Price                  -- where you set it
    Alternatives (floor)      -- what competitors charge
      Cost (baseline)         -- what it costs you to deliver
```

Always price between alternatives and perceived value. Never price from cost up.

### Good-Better-Best Framework

| Tier | Purpose | Pricing |
|------|---------|---------|
| **Good** | Core features, limited usage | Entry point, low friction |
| **Better** | Full feature set, "Recommended" badge | Sweet spot, most customers land here |
| **Best** | Everything + premium support/SLAs | 2-3x the Better tier price |

### Van Westendorp Price Sensitivity

Ask four questions to find the acceptable price range:
1. At what price is this **too cheap** (quality concern)?
2. At what price is this a **bargain**?
3. At what price is this **getting expensive** (but still consider)?
4. At what price is this **too expensive** (won't buy)?

Plot the four curves. The intersection zone is your optimal price range.

### Pricing Page Psychology

- **Anchoring** - Show the highest tier first (left-to-right) or most prominent
- **Decoy effect** - Middle tier looks best when flanked properly
- **Charm pricing** - $49 signals value; $50 signals premium
- **Annual discount** - Offer 17-20% off for annual commitment (2 months free)

### Signs You Should Raise Prices

- No price objections in sales calls ("no flinch")
- Customers say "this is so cheap for what we get"
- Free-to-paid conversion rate > 40%
- Monthly churn < 3%

---

## Free Tool Strategy

### Types of Free Tools

| Type | Example | Lead Capture |
|------|---------|-------------|
| **Calculators** | ROI calculator, salary estimator | Email for results |
| **Generators** | Name generator, template builder | Email for export |
| **Analyzers** | Website grader, SEO audit | Email for full report |
| **Testers** | Speed test, accessibility checker | Email for recommendations |
| **Libraries** | Templates, swipe files | Email for download |

### Free Tool Evaluation Scorecard

Rate 1-5 on each criterion. Score 25+ out of 40 = strong candidate:

1. Search volume for the problem it solves
2. Relevance to your paid product
3. Shareability / word-of-mouth potential
4. Difficulty for competitors to replicate
5. Data capture opportunity
6. SEO / backlink potential
7. Speed to build MVP
8. Ongoing maintenance cost (inverse - lower is better)

### Ideation Framework

Start with pain points to find free tool ideas:
- What does your audience Google repeatedly?
- What manual processes are tedious for them?
- What info do they need before buying your product?
- What data do they wish they had access to?

### Gating Options

| Strategy | Conversion | Lead Quality | SEO Value |
|----------|-----------|-------------|-----------|
| Fully gated (email for access) | Lower | Higher | None |
| Partially gated (preview free, full for email) | Medium | Medium | Good |
| Ungated + optional email | Higher usage | Lower | Best |
| Ungated entirely (link building play) | N/A | N/A | Best |

Best default: partial gating. Show enough value to prove the tool works, gate the full output.

### SEO for Free Tools

- Target "[thing] calculator", "[thing] generator", "[thing] checker" keywords
- Free tools attract backlinks naturally (10-50x more than blog posts)
- Each tool page should target a cluster of related keywords
- Add schema markup (SoftwareApplication type)

### Build vs Buy

- **Build custom** when: unique data advantage, core to product, high defensibility
- **No-code tools** (Outgrow, Typeform, Tally, Bubble) when: validating quickly, simple logic, time-constrained
- **Embed existing** when: API available, lower effort, good enough quality

### MVP Approach

Build only: core function + essential UX + basic lead capture. Nothing else. Ship, measure, then iterate based on actual usage data.

---

## Growth Experiment Prioritization

### ICE Framework

```
ICE Score = (Impact + Confidence + Ease) / 3
```

- **Impact** (1-10): If this works, how big is the effect?
- **Confidence** (1-10): How sure are we it will work? (data > intuition)
- **Ease** (1-10): How quickly can we run this experiment?

### Experiment Cadence

Run experiments in **2-week sprints**:
- Week 1: Launch experiment, collect data
- Week 2: Analyze, document, decide (ship, iterate, or kill)

### Experiment Documentation Template

```
Hypothesis: If we [change], then [metric] will [improve by X%]
            because [reasoning].
Result:     [metric] moved [+/- X%] with [confidence level].
Learning:   [What we now know that we didn't before.]
Next:       [Ship / Iterate / Kill]
```

Never run experiments without documenting the hypothesis first. The learning is the asset, not just the result.
