<!-- Part of the partnership-strategy AbsolutelySkilled skill. Load this file when
     working with affiliate programs, referral commissions, or affiliate recruitment. -->

# Affiliate Program Design

## Commission modeling

### Commission structures compared

| Structure | Example | Best for | Risk |
|-----------|---------|----------|------|
| Flat fee per sale | $50 per signup | Low-ACV products (< $100/mo) | Overpaying for upsells |
| Percentage of first sale | 25% of first payment | Mid-ACV products | Front-loaded cost |
| Recurring percentage | 15% monthly for 12 months | SaaS with high LTV | Long-term cost commitment |
| Lifetime recurring | 10% for life of customer | High-retention products | Unpredictable costs |
| Tiered by volume | 20% base, 25% at 10+ sales/mo | Scaling affiliates | Complexity |
| Hybrid | $100 flat + 10% recurring 12 mo | Balancing incentives | Harder to explain |

### How to set commission rates

1. **Calculate your customer acquisition cost (CAC)** from other channels
   (paid ads, content, sales). Your affiliate commission should be at or below
   this number.

2. **Work backwards from LTV** - If customer lifetime value is $5,000 and your
   target LTV:CAC ratio is 3:1, your max CAC is ~$1,667. Affiliate commission
   should be well under this.

3. **Benchmark by industry:**
   - SaaS: 15-30% of first year or 10-20% recurring
   - E-commerce: 5-15% per sale
   - Financial services: $50-200 per qualified lead
   - Education / courses: 20-50% per sale

4. **Account for cookie duration** - Longer cookies (90 days) cost more because
   they attribute more organic conversions to affiliates. Shorter cookies
   (30 days) are cheaper but less attractive to affiliates.

### Commission calculator template

```
Inputs:
  Average contract value (ACV):           $[X]/year
  Average customer lifetime:              [X] years
  Customer LTV:                           $[X]
  Target LTV:CAC ratio:                   [3]:1
  Max acceptable CAC:                     $[X]
  Current blended CAC (non-affiliate):    $[X]

Commission options:
  A) Flat fee: $[X] per sale        -> Effective CAC: $[X]
  B) 20% of first year: $[X]       -> Effective CAC: $[X]
  C) 15% recurring x 12 months:    -> Effective CAC: $[X]

Recommendation: Option [X] because [reasoning]
```

---

## Fraud prevention framework

### Common affiliate fraud types

| Fraud type | How it works | Detection method |
|------------|-------------|-----------------|
| Self-referral | Affiliate refers themselves or company | Match affiliate email domain to customer domain |
| Cookie stuffing | Affiliate forces cookie drops via hidden iframes | Monitor for clicks without matching page views |
| Brand bidding | Affiliate bids on your brand keywords in search ads | Regular brand keyword monitoring in Google Ads |
| Coupon hijacking | Affiliate claims credit for users searching for existing coupons | Track coupon code origin vs. affiliate source |
| Fake leads | Affiliate submits fabricated information | Validate email domains, check for patterns, phone verification |
| Click fraud | Bot-generated clicks to inflate commissions on CPC deals | Analyze click-to-conversion ratio, IP patterns |

### Prevention controls

```
Technical controls:
  - Require email verification before commission eligibility
  - Block commissions from disposable email domains
  - Set minimum conversion rate threshold (flag if < 0.5%)
  - Monitor for abnormal click patterns (> 1000 clicks, 0 conversions)
  - IP fingerprinting to detect self-referrals
  - Automated brand keyword monitoring (weekly)

Policy controls:
  - 30-day review window before any payout
  - Minimum payout threshold: $50-100
  - Clawback clause: refunds within 60 days reverse the commission
  - Prohibited tactics list in affiliate agreement:
    * Self-referrals
    * Brand keyword bidding (unless approved)
    * Coupon/deal sites (unless approved)
    * Incentivized traffic (pay-to-click, reward sites)
    * Cookie stuffing or forced clicks
    * Misleading claims about the product

Monitoring cadence:
  - Daily: Automated anomaly alerts (unusual click/conversion spikes)
  - Weekly: Brand keyword audit
  - Monthly: Manual review of top 20 affiliates by volume
  - Quarterly: Full program audit (terms compliance, fraud patterns)
```

---

## Affiliate recruitment strategies

### Where to find affiliates

| Source | Quality | Volume | Effort |
|--------|---------|--------|--------|
| Existing customers | Very high | Low | Medium |
| Industry bloggers / YouTubers | High | Low-medium | High |
| Affiliate networks (ShareASale, CJ) | Medium | High | Low |
| Competitor affiliate programs | Medium-high | Medium | Medium |
| Social media influencers | Variable | Medium | High |
| Review sites (G2, Capterra) | Medium | Low | Low |
| Partner program graduates | High | Low | Low |

### Recruitment outreach template

```
Subject: Partner with [Your Company] - earn [X]% commission

Hi [Name],

I've been following your [blog/YouTube/podcast] on [topic] and really
enjoyed your [specific piece of content]. Your audience aligns well
with [Your Company]'s users.

We just launched our affiliate program and I think it could be a great
fit:

  - [X]% commission on every sale you refer
  - [X]-day cookie duration
  - Average earnings per referral: $[X]
  - Dedicated affiliate manager (me)
  - Custom landing pages and creative assets

A few of our affiliates are earning $[X]-[X]/month by [specific tactic -
e.g., including us in tool comparison posts].

Would you be open to a 15-minute call this week to discuss?

[Your name]
[Your title]
```

### Affiliate onboarding sequence

```
Day 0:  Welcome email + portal access + getting started guide
Day 1:  Intro call with affiliate manager (15 min)
        - Walk through product value prop
        - Review commission structure
        - Share top-performing content strategies
Day 3:  Send creative asset pack (banners, email swipes, social copy)
Day 7:  Check-in email: "Have you placed your first link?"
Day 14: Share case study of successful affiliate
Day 21: Offer to create a custom landing page if they have > 1K audience
Day 30: First performance review - celebrate first conversions or
        troubleshoot if none
```

---

## Platform selection guide

### Key features to evaluate

| Feature | Must-have | Nice-to-have |
|---------|-----------|-------------|
| Real-time tracking dashboard | Yes | |
| Automated payouts (PayPal, wire) | Yes | |
| Custom commission structures | Yes | |
| Fraud detection | Yes | |
| Affiliate portal / self-serve | Yes | |
| Multi-tier commissions | | Yes |
| API access | | Yes |
| CRM integration (Salesforce, HubSpot) | | Yes |
| Custom landing page builder | | Yes |
| White-label portal | | Yes |

### Platform comparison

| Platform | Best for | Pricing model | Key strength |
|----------|----------|--------------|-------------|
| PartnerStack | B2B SaaS | % of payouts + base | Full PRM + affiliate |
| Impact | Enterprise, multi-channel | Custom | Advanced attribution |
| FirstPromoter | SaaS startups | Flat monthly | Simple, developer-friendly |
| Rewardful | Stripe-based SaaS | Flat monthly | Deep Stripe integration |
| ShareASale / CJ | E-commerce, high volume | % of payouts | Large affiliate network |
| Tapfiliate | Mid-market | Flat monthly | Flexible, good API |
| Custom (in-house) | Unique needs | Dev cost | Full control |

### Build vs. buy decision framework

**Build in-house if:**
- You have unique attribution requirements
- Your commission structure is highly custom
- You process > 10,000 affiliate transactions/month
- You need deep integration with proprietary systems

**Buy a platform if:**
- You're launching your first affiliate program
- You need to move fast (< 4 weeks to launch)
- You want access to an existing affiliate network
- You have < 500 affiliates

---

## Measuring affiliate program health

### Key metrics

| Metric | Healthy benchmark | Warning sign |
|--------|------------------|-------------|
| Active affiliate rate | > 10% of total affiliates | < 5% |
| Click-to-conversion rate | 2-10% (varies by niche) | < 1% or > 20% (fraud) |
| Avg revenue per affiliate | > $200/month (top 20%) | Declining QoQ |
| Earnings per click (EPC) | $0.50-5.00 | < $0.10 |
| Refund rate from affiliates | < 10% | > 15% (quality issue) |
| Time to first sale | < 30 days | > 60 days (onboarding issue) |
| Top 10 affiliate concentration | < 60% of revenue | > 80% (risk) |

### Monthly reporting template

```
AFFILIATE PROGRAM REPORT - [Month Year]

Program size:
  Total affiliates: [N]
  Active (1+ click): [N] ([X]%)
  Producing (1+ sale): [N] ([X]%)
  New this month: [N]

Revenue:
  Gross revenue from affiliates: $[X]
  Commissions paid: $[X]
  Net revenue: $[X]
  Effective CAC: $[X]

Performance:
  Total clicks: [N]
  Conversions: [N]
  Conversion rate: [X]%
  Avg EPC: $[X]

Top 5 affiliates:
  1. [Name] - $[X] revenue, [N] sales
  2. ...

Fraud / compliance:
  Flagged transactions: [N]
  Reversed commissions: $[X]
  Affiliates removed: [N]

Actions for next month:
  - [Recruitment, optimization, or policy changes]
```
