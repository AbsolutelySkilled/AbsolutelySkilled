<!-- Part of the Absolute Marketing skill. Load this file when designing A/B tests, setting up marketing analytics, building attribution models, or defining KPIs. -->

# Testing and Measurement

## A/B Test Design

### Hypothesis Template

> "Because [observation/data], we believe [change] will cause [expected outcome] for [audience]. We'll know when [metric] changes by [amount]."

Every test starts with a hypothesis. No hypothesis, no test. "Let's try a new headline" is not a hypothesis. "Because our hero bounce rate is 68% (above 50% benchmark), we believe a benefit-focused headline will reduce bounce rate by 15% for first-time visitors" is.

### Sample Size Quick Reference

| Baseline Rate | 10% Lift | 20% Lift | 50% Lift |
|---------------|----------|----------|----------|
| 1%            | 150,000/var | 39,000/var | 6,000/var |
| 5%            | 27,000/var  | 7,000/var  | 1,200/var |
| 10%           | 12,000/var  | 3,000/var  | 550/var   |

These assume 95% confidence, 80% power, two-tailed test. For one-tailed tests, reduce by ~20%. For 90% confidence, reduce by ~30%.

**Traffic estimation**: Total sample / daily traffic = days to run. If the test runs longer than 4 weeks, consider a bigger change (larger expected lift) or test on a higher-traffic page.

### Metrics Selection

- **Primary metric** - Single metric that determines win/loss. One. Not two, not three. One.
- **Secondary metrics** - Support interpretation of the primary. Help you understand why the primary moved (or didn't).
- **Guardrail metrics** - Things that shouldn't get worse. Revenue per visitor when testing for signups. Page load time when testing new layouts. Unsubscribe rate when testing email frequency.

### The Peeking Problem

Looking at results before reaching sample size inflates false positive rate from 5% to as high as 30%. Every peek is a chance to stop early on noise.

Rules:
1. Pre-commit to sample size before launching
2. Do not check results until sample size is reached
3. Statistical significance requires 95% confidence minimum
4. Run tests for full business cycles (minimum 1-2 weeks) to capture weekday/weekend variation
5. If you must peek, use sequential testing methods (group sequential or always-valid p-values)

### Test Prioritization

**ICE scoring**: (Impact + Confidence + Ease) / 3
- Impact: How much will this move the metric? (1-10)
- Confidence: How sure are you it will work? (1-10)
- Ease: How easy to implement? (1-10)

**PIE framework**: Potential, Importance, Ease
- Potential: How much room for improvement on this page?
- Importance: How valuable is the traffic to this page?
- Ease: How complex is the test to run?

**General priority order**: Test highest-traffic, highest-value pages first. A 5% lift on a page with 100K visitors beats a 20% lift on a page with 5K visitors.

### Common Test Types

| Category | What to Test | Example |
|----------|-------------|---------|
| Copy | Headlines, CTAs, value props, social proof text | "Start Free Trial" vs "Get Started Free" |
| Layout | Hero section, form placement, CTA position | Above-fold CTA vs below-fold after explanation |
| Flow | Multi-step vs single page, field order, progress bars | 3-step signup vs single form |
| Pricing | Tier structure, anchoring, annual/monthly default | Annual pre-selected vs monthly pre-selected |
| Social proof | Placement, format, specificity | Logo bar vs case study quotes vs metrics |

### Test Documentation

For every test, record:
1. **Hypothesis** - Full hypothesis statement
2. **Variants** - Description of control and each variant
3. **Sample size target** - Per variant
4. **Metrics** - Primary, secondary, guardrail
5. **Start/end dates** - Actual, not just planned
6. **Result** - Winner, lift amount, statistical significance
7. **Confidence level** - p-value or confidence interval
8. **Learning** - What did we learn beyond the result?
9. **Next action** - Ship it, iterate, or kill it

---

## Marketing Analytics

### Event Naming Convention

Use Object-Action format. Lowercase. Underscores as separators.

Good examples:
- `cta_hero_clicked`
- `form_signup_submitted`
- `pricing_annual_toggled`
- `video_demo_played`
- `modal_upgrade_dismissed`

Bad examples:
- `button_clicked` (which button?)
- `Click` (uppercase, vague)
- `formSubmit` (camelCase, no object specificity)
- `user-signed-up` (hyphens, inconsistent format)

Be specific enough that the event name alone tells you what happened and where.

### UTM Convention

| Parameter | Purpose | Examples |
|-----------|---------|----------|
| `utm_source` | Where traffic comes from | google, linkedin, newsletter, podcast |
| `utm_medium` | Marketing medium | cpc, social, email, referral, organic |
| `utm_campaign` | Specific campaign | spring-launch-2024, webinar-ai-series |
| `utm_content` | Differentiate similar links | cta_top, cta_bottom, sidebar_banner |
| `utm_term` | Paid search keywords | marketing+automation, crm+software |

UTM rules:
- Always lowercase
- Use hyphens for multi-word values (not underscores or spaces)
- Maintain a shared UTM registry so teams use consistent values
- Never put UTMs on internal links (it breaks session attribution)
- Use URL shorteners or redirects for clean sharing

### GA4 Setup Checklist

- [ ] Enhanced measurement enabled (scroll, outbound clicks, site search, video, file downloads)
- [ ] Custom events defined and documented
- [ ] Conversion events marked (form submissions, signups, purchases)
- [ ] Audiences built for remarketing segments
- [ ] Google Ads linked (if running paid)
- [ ] Data retention set to 14 months (default is 2 months)
- [ ] Cross-domain tracking configured (if applicable)
- [ ] Internal traffic filtered
- [ ] Referral exclusions set (payment providers, auth redirects)
- [ ] Custom dimensions/metrics registered

### Core Principle

Track for decisions, not data. Every event should answer: "What decision will this data inform?" If you can't answer that question, don't track it. More data is not better data. Unused data is technical debt.

---

## Attribution Models

| Model | Credits | Best For | Weakness |
|-------|---------|----------|----------|
| First-touch | 100% to first interaction | Understanding discovery channels | Ignores nurture |
| Last-touch | 100% to last interaction | Understanding closing channels | Ignores awareness |
| Linear | Equal across all touchpoints | Even credit distribution | Dilutes signal |
| Time-decay | More weight to recent touches | Sales cycles with nurture | Undervalues discovery |
| Position-based | 40% first / 20% middle / 40% last | Balanced view of journey | Arbitrary weights |
| Data-driven | Algorithmic based on patterns | High-volume, mature programs | Needs significant data |

### Attribution Gotchas

- **Platform self-reporting bias**: Every ad platform over-reports conversions. Facebook, Google, and LinkedIn all take credit for the same conversion. Compare platform data against GA4 for ground truth.
- **Blended CAC over platform CPA**: Total marketing spend / total new customers is more honest than any single platform's reported CPA.
- **B2B attribution is hard**: Long sales cycles (3-12 months), multiple stakeholders, committee decisions, and offline touchpoints make precise attribution nearly impossible.
- **Dark social is real**: DMs, Slack messages, word-of-mouth, podcast mentions - these drive real pipeline but are unmeasurable. Add "How did you hear about us?" as a freeform field on signup/demo forms. It's imperfect but captures what analytics can't.
- **Attribution is directional, not precise**: Use it to inform budget allocation, not to justify every dollar. If you're arguing over 5% attribution differences, you're missing the point.

---

## Marketing KPI Dashboards

### Acquisition Metrics

| Metric | What It Measures | Benchmark Range |
|--------|-----------------|-----------------|
| Traffic by source/medium | Channel mix health | Varies by stage |
| Cost per click (CPC) | Paid efficiency | $0.50-$5 B2B, $0.20-$2 B2C |
| Cost per lead (CPL) | Lead gen efficiency | $20-$200 B2B, $5-$50 B2C |
| Customer acquisition cost (CAC) | Full cost to acquire | Varies widely |
| LTV:CAC ratio | Unit economics health | 3:1 to 5:1 is healthy |

### Engagement Metrics

| Metric | What It Measures | Benchmark Range |
|--------|-----------------|-----------------|
| Email open rate | Subject line effectiveness | 20-30% |
| Email CTR | Content relevance | 2-5% |
| Email CTOR (click-to-open) | Content quality for openers | 10-15% |
| Social engagement rate | Content resonance | 1-3% |
| Time on page | Content depth | 2-4 minutes |
| Content downloads | Gated content appeal | 5-15% of landing page visitors |

### Conversion Metrics

| Metric | What It Measures | Benchmark Range |
|--------|-----------------|-----------------|
| MQL to SQL rate | Lead quality | 30-50% |
| SQL to Opportunity | Sales qualification | 50-70% |
| Win rate | Sales effectiveness | 20-30% |
| Free-to-paid | Product-led conversion | 2-5% freemium, 15-25% trial |
| Average deal size / ACV | Revenue per customer | Varies by segment |

### Retention Metrics

| Metric | What It Measures | Benchmark Range |
|--------|-----------------|-----------------|
| Monthly churn rate | Customer loss velocity | <5% B2C, <2% B2B |
| Net revenue retention | Expansion vs contraction | >100% means expansion > churn |
| NPS | Customer advocacy | >40 good, >60 excellent |

---

## RevOps Fundamentals

### Lead Lifecycle

```
Subscriber > Lead > MQL > SQL > Opportunity > Customer > Evangelist
```

**MQL requires BOTH fit AND engagement.** A perfect-fit company that never engages with your content is not an MQL - it's a target account. A student downloading every ebook you publish is not an MQL - it's a content consumer. MQL = right profile + meaningful buying signals.

### Speed-to-Lead

- Contact within **5 minutes** = 21x more likely to qualify
- After **30 minutes** = 10x drop in qualification likelihood
- After **24 hours** = effectively cold outreach

Speed-to-lead is one of the highest-leverage improvements in B2B marketing. Automate lead routing. Alert reps in real-time. Remove manual steps between form fill and first contact.

### MQL-to-SQL Handoff SLA

1. MQL alert fires immediately on qualification
2. Rep contacts lead within **4 business hours**
3. Rep qualifies or rejects within **48 hours**
4. Rejected leads go back to nurture **with a reason code**
5. Reason codes feed back into scoring model refinement

Track SLA compliance weekly. If reps consistently miss the 4-hour window, the problem is either too many MQLs (quality issue) or too few reps (capacity issue).

### Pipeline Coverage

Target **3-4x quota** in active pipeline. Below 3x means you're likely to miss. Above 5x means deals are stale or poorly qualified. Pipeline coverage is a leading indicator - if it drops, you have weeks to react before revenue misses.

### Lead Scoring Mistakes

1. **Weighting downloads too heavily** - Research behavior does not equal buying intent. A competitor downloading your whitepaper scores the same as a prospect.
2. **No negative scoring** - Competitors, students, job seekers, and existing customers should lose points, not just gain them.
3. **All page visits scored equally** - A pricing page visit is a buying signal. A careers page visit is not. Weight pages by intent.
4. **Set and forget** - Recalibrate scoring quarterly. Compare MQL-to-close rates across score bands. If high-scoring leads don't convert, the model is wrong.

### Lead Routing Methods

| Method | When to Use |
|--------|------------|
| Round-robin | Equal distribution, small team, similar territories |
| Territory-based | Geographic or industry segmentation |
| Account-based | Named accounts assigned to specific reps |
| Skill-based | Complex products requiring specialist knowledge |

Rules: Route to most specific match first. Always have a fallback owner. Set capacity limits per rep. Log all routing decisions for audit.

### Pipeline Stage Management

| Stage | Definition | Required Fields | Exit Criteria |
|-------|-----------|----------------|---------------|
| Qualified | Meets MQL criteria, rep accepted | Contact info, company, source | Discovery call scheduled |
| Discovery | Understanding needs and fit | Pain points, timeline, budget range | Demo/evaluation agreed |
| Demo/Evaluation | Prospect evaluating product | Use case documented, stakeholders | Proposal requested |
| Proposal | Pricing and terms shared | Proposal sent date, decision maker | Verbal agreement or objection |
| Negotiation | Terms being finalized | Redlines, legal review status | Signed contract |
| Closed Won | Deal signed | Contract, payment terms, start date | Handoff to CS |
| Closed Lost | Deal lost | Loss reason, competitor if any | Post-mortem logged |

**Stage hygiene rules:** Required fields must be filled before stage advance. Stale deal alerts at 2x average time-in-stage. Flag stage skips for manager review. Enforce close date discipline (no "end of quarter" defaults).

### Lead Scoring Model

Build scoring from two dimensions:

**Explicit (Fit) scoring** - Does this lead match our ICP?
- Job title/seniority (+10-25 pts)
- Company size in range (+10-20 pts)
- Industry match (+10-15 pts)
- Technology stack fit (+5-10 pts)

**Implicit (Engagement) scoring** - Are they showing buying signals?
- Pricing page visit (+15 pts)
- Demo request (+25 pts)
- Case study download (+10 pts)
- Blog visit (+2 pts per visit, cap at 20)
- Email open (+1 pt, cap at 10)

**Negative scoring:**
- Competitor domain (-50 pts)
- Student email (-30 pts)
- Unsubscribed (-20 pts)
- No activity 30 days (-10 pts)

MQL threshold: typically 50-75 points with both fit AND engagement minimums met.

### CRM Automation Essentials

| Trigger | Automation | Purpose |
|---------|-----------|---------|
| Form submission | Create/update contact, assign owner, notify rep | Speed-to-lead |
| MQL threshold hit | Alert sales, create task, start SLA timer | Handoff |
| Demo scheduled | Send confirmation, prep doc to rep, reminder sequence | Meeting prep |
| No-show | Trigger reschedule email, notify rep, flag in CRM | Recovery |
| Deal closed won | Handoff to CS, trigger onboarding, update reporting | Customer success |
| Deal closed lost | Trigger loss survey, add to nurture, log reason | Learning |

### Deal Desk Triggers

Route to deal desk when:
- ACV exceeds $25K
- Non-standard payment terms requested
- Multi-year commitments
- Volume or enterprise discounts
- Custom legal or security requirements
- Channel/partner deals with revenue sharing
