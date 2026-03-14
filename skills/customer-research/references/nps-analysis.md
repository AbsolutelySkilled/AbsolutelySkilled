<!-- Part of the customer-research AbsolutelySkilled skill. Load this file when
     analyzing NPS data, building closed-loop programs, or benchmarking scores. -->

# NPS Analysis Reference

## Scoring methodology

### The question

"On a scale of 0-10, how likely are you to recommend [product/company] to a
friend or colleague?"

### Segmentation

| Score | Category | Meaning |
|---|---|---|
| 9-10 | Promoter | Loyal enthusiasts who will refer and repurchase |
| 7-8 | Passive | Satisfied but unenthusiastic; vulnerable to competitors |
| 0-6 | Detractor | Unhappy customers who can damage brand through negative word-of-mouth |

### Calculation

```
NPS = (% Promoters) - (% Detractors)
```

Range: -100 (all Detractors) to +100 (all Promoters). Passives affect the
denominator but not the numerator - they dilute both sides proportionally.

### Example

200 responses: 100 Promoters (50%), 60 Passives (30%), 40 Detractors (20%)
NPS = 50% - 20% = +30

## The follow-up question

The number alone is nearly useless. The follow-up open-ended question is where
insight lives:

"What is the primary reason for your score?"

This verbatim response is the most valuable data point in the entire NPS program.
Always require it. Never make it optional.

## Verbatim coding scheme

Code each open-ended response into categories. Build a codebook specific to your
product, but start with these universal categories:

### Positive codes (common among Promoters)

| Code | Description | Example verbatim |
|---|---|---|
| P-EASY | Ease of use / simplicity | "It just works, no training needed" |
| P-FAST | Speed / performance | "Reports generate in seconds" |
| P-SUPPORT | Support quality | "Support team resolved my issue same day" |
| P-VALUE | Value for money | "Best ROI of any tool we use" |
| P-FEATURE | Specific feature praise | "The dashboard is exactly what I need" |
| P-RELIABLE | Reliability / uptime | "Never had downtime in 2 years" |

### Negative codes (common among Detractors)

| Code | Description | Example verbatim |
|---|---|---|
| D-UX | Confusing interface / bad UX | "Can never find what I'm looking for" |
| D-BUG | Bugs / errors | "Keeps crashing when I export" |
| D-MISSING | Missing feature | "No API access, have to do everything manually" |
| D-PRICE | Too expensive | "Price went up 40% with no new features" |
| D-SUPPORT | Poor support | "Waited 5 days for a response" |
| D-PERF | Slow performance | "Loading times are unacceptable" |
| D-ONBOARD | Hard to get started | "Took our team 3 months to fully adopt" |

### Passive codes

Passives often cite mild versions of Detractor complaints or conditional praise:
- "It's fine but..." (code as the "but" - that is the real signal)
- "Good for basic use, but we'll outgrow it" (D-MISSING or D-SCALE)

## Segmented analysis

Never report a single NPS number. Always segment:

### Essential segments

| Segment | Why it matters |
|---|---|
| Customer tenure (0-3mo, 3-12mo, 12mo+) | New users often score higher (honeymoon) or lower (onboarding pain) |
| Plan tier (free, pro, enterprise) | Enterprise customers may have different expectations |
| Use case / job title | Product may serve one persona well and another poorly |
| Geography / region | Cultural response biases differ significantly |
| Account size (# seats) | Large accounts have different dynamics than individuals |

### Cohort trending

Track NPS monthly or quarterly by cohort. The most useful view is a line chart:
- X-axis: time (monthly or quarterly)
- Y-axis: NPS score
- Lines: one per segment (e.g., tenure cohort, plan tier)

Look for:
- **Declining trends** - Even if absolute NPS is positive, a decline signals emerging problems
- **Segment divergence** - If enterprise NPS rises while SMB drops, investigate
- **Event correlation** - Did NPS change after a pricing change, major release, or outage?

## Industry benchmarks

<!-- VERIFY: Benchmarks are approximate ranges based on widely cited industry
     reports. Actual benchmarks vary by source and year. -->

| Industry | Median NPS | "Good" threshold | "Excellent" threshold |
|---|---|---|---|
| SaaS / B2B Software | +30 to +40 | +40 | +60 |
| E-commerce | +40 to +50 | +50 | +70 |
| Financial services | +20 to +30 | +35 | +55 |
| Healthcare | +20 to +30 | +35 | +55 |
| Consumer technology | +40 to +50 | +55 | +70 |
| Telecom / ISP | -5 to +10 | +15 | +30 |

Benchmarks are directional only. Compare against your own trend first, industry
benchmarks second, and competitor benchmarks third (if available).

## Closed-loop follow-up process

NPS without follow-up is a vanity metric. Implement a closed-loop program:

### Detractor follow-up (within 48 hours)

1. **Alert** - Route Detractor responses to the account owner or CS team immediately
2. **Acknowledge** - Send a personalized response within 24 hours:
   "Thank you for your feedback. I'd like to understand your experience better.
   Would you be open to a 15-minute call this week?"
3. **Listen** - On the call, use interview techniques (see interviews.md). Do not
   defend or sell. The goal is to understand.
4. **Resolve** - If there is a fixable issue, fix it and follow up. If it is a
   product gap, document it and share the timeline honestly.
5. **Track** - Log the follow-up outcome. Measure: what % of contacted Detractors
   become Passives or Promoters in the next survey?

### Passive follow-up (within 1 week)

Passives are the most actionable segment - they are close to being Promoters but
something is holding them back.

1. **Identify the blocker** - Code their verbatim to find the specific barrier
2. **Targeted outreach** - Share feature announcements, training resources, or
   account reviews that address their stated blocker
3. **Re-survey** - Include Passives in a follow-up micro-survey 30-60 days later
   to measure movement

### Promoter follow-up (within 1 week)

1. **Thank them** - A genuine thank-you goes a long way
2. **Activate** - Ask for a review, testimonial, case study, or referral. Promoters
   who are asked are 4x more likely to refer than those who are not.
3. **Learn** - Ask Promoters what they value most to reinforce those product areas

## Statistical considerations

### Minimum sample size

For NPS to be directionally useful, collect at least 50 responses per segment.
For statistically significant comparisons between segments, aim for 200+ per segment.

### Margin of error

NPS has a wider margin of error than most people assume:

| Sample size | Margin of error (95% CI) |
|---|---|
| 50 | +/- 14 points |
| 100 | +/- 10 points |
| 200 | +/- 7 points |
| 500 | +/- 4.5 points |
| 1,000 | +/- 3 points |

A 5-point NPS change on 100 responses is within the margin of error - do not
report it as a meaningful shift. Focus on trends across multiple periods.

### Response rate targets

| Channel | Typical rate | Good rate |
|---|---|---|
| In-app survey | 15-25% | 30%+ |
| Email survey | 5-15% | 20%+ |
| Post-interaction | 20-40% | 40%+ |

Low response rates introduce non-response bias. If rate is below 10%, treat
results as directional only and supplement with qualitative methods.
