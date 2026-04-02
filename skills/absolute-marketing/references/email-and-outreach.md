<!-- Part of the Absolute Marketing skill. Load this file when building email campaigns, drip sequences, cold outreach, or improving email deliverability. -->

# Email & Outreach Reference

## Email Sequence Architecture

### Welcome Series (5-7 emails over 14 days)

| Email | Timing | Purpose | Key Element |
|-------|--------|---------|-------------|
| 1 - Welcome + Value | Immediate | Set expectations, deliver lead magnet | Clear next step, what to expect |
| 2 - Quick Win | Day 1-2 | Deliver immediate result | Actionable tip they can use in 5 min |
| 3 - Story / Why | Day 3-4 | Build connection and trust | Origin story, mission, shared values |
| 4 - Social Proof | Day 5-6 | Reduce uncertainty | Case study, testimonial, data point |
| 5 - Objection Handler | Day 7-8 | Address top buying concern | FAQ format or myth-busting |
| 6 - Feature Spotlight | Day 9-11 | Show specific capability | Demo, walkthrough, use case |
| 7 - Conversion | Day 12-14 | Drive action | Time-limited offer, clear CTA |

**Rules:** Email 1 must arrive within 60 seconds of signup. Each email should stand alone - assume they skipped previous ones. Single CTA per email.

### Onboarding Series (5 emails)

| Email | Timing | Goal |
|-------|--------|------|
| 1 - First Action | Day 0 | Get them to complete one meaningful action |
| 2 - Use Case | Day 2 | Show how people like them use the product |
| 3 - Power Feature | Day 5 | Introduce the feature that drives retention |
| 4 - Success Story | Day 10 | Show what "good" looks like with real results |
| 5 - Check-in | Day 14 | Ask how it's going, offer help, gauge satisfaction |

**Key principle:** Onboarding emails are behavioral, not calendar-based. If the user completes the action before the scheduled email, skip it or send the next one. Never congratulate someone for something they haven't done.

### Lead Nurture Series (5-10 emails)

Structure: Educational content mixed with proof and soft CTAs.

- **Ratio:** 3 educational : 1 proof : 1 soft CTA
- **Frequency:** 1-2x per week (never daily for nurture)
- **Content types:** How-to guides, industry data, expert interviews, templates, checklists
- **Soft CTAs:** "See how [Company] did this" or "Try this approach free" - not "Buy now"
- **Exit triggers:** Move to sales sequence when lead scores above threshold or takes high-intent action

### Re-engagement Series (3-4 emails)

Trigger: 30-60 days of inactivity (no opens, no clicks, no logins).

| Email | Content | Tone |
|-------|---------|------|
| 1 - Check-in | "We noticed you've been quiet" | Warm, no pressure |
| 2 - Value Reminder | Best content or feature update they missed | Helpful, FOMO-light |
| 3 - Incentive | Discount, extended trial, exclusive content | Generous, time-bound |
| 4 - Last Chance | "Should we stop emailing?" | Direct, respectful |

**After last chance:** If no engagement, move to suppression list. Keeping disengaged contacts hurts deliverability. Clean lists beat big lists.

### Sequence Length Guidelines

| Type | Emails | Duration |
|------|--------|----------|
| Welcome | 3-7 | 7-14 days |
| Nurture | 5-10 | 4-8 weeks |
| Onboarding | 5-10 | 14-30 days |
| Re-engagement | 3-5 | 14-21 days |

---

## Email Copy

### Length by Type

| Email Type | Word Count | Why |
|------------|-----------|-----|
| Transactional | 50-125 words | Action-focused, no fluff |
| Educational | 150-300 words | Teach one thing well |
| Story-driven | 300-500 words | Needs narrative arc to land |

**Rule of thumb:** If you can cut a sentence without losing meaning, cut it.

### Subject Line Patterns

| Pattern | Example | When to Use |
|---------|---------|-------------|
| Question | "Still using spreadsheets?" | Provoke curiosity |
| How-to | "How to cut churn by 30%" | Promise specific value |
| Number | "3 mistakes killing your CTR" | Scannable, specific |
| Direct | "Your trial expires Friday" | Urgency, transactional |
| Story tease | "She almost quit. Then..." | Narrative emails |

**Constraints:**
- Under 50 characters (many clients truncate)
- Under 30 characters for mobile-first audiences
- No ALL CAPS, no excessive punctuation (!!!), no spam trigger words
- Preview text is your second subject line - never waste it on "View in browser"

### A/B Testing Subjects

- **Split:** 20% variant A / 20% variant B / 60% winning variant
- **Minimum sample:** 1,000 per variant for statistical significance
- **Wait time:** 2-4 hours before declaring winner
- **Test one variable at a time:** subject OR preview text OR send time - never all three

---

## Segmentation

### Segmentation Models

| Model | Segments | Best For |
|-------|----------|----------|
| Engagement-based | Active (opened/clicked last 30d), Lapsing (31-60d), Inactive (60d+) | Deliverability, re-engagement |
| Lifecycle stage | Subscriber, Lead, MQL, SQL, Customer, Churned | Content relevance |
| RFM (Recency, Frequency, Monetary) | Champions, Loyal, At Risk, Lost | E-commerce, SaaS upsell |
| Behavioral | Feature used, content consumed, pages visited | Product-led nurture |
| Demographic | Role, company size, industry, geography | Personalization at scale |

### Implementation Order

1. **Start with:** Engagement + Lifecycle (highest impact, lowest complexity)
2. **Add next:** Behavioral signals when you have event tracking
3. **Then:** RFM when you have purchase/revenue data
4. **Last:** Demographic when data quality supports it

**Anti-pattern:** Over-segmenting before you have volume. 50 segments with 20 people each means no statistical learning. Keep segments large enough to learn from (500+ contacts minimum).

---

## Deliverability

### Authentication (All Required)

| Protocol | Purpose | Record Type |
|----------|---------|-------------|
| SPF | Authorizes sending IPs | TXT on domain DNS |
| DKIM | Cryptographic signature on emails | TXT (public key) on DNS |
| DMARC | Policy for failed SPF/DKIM | TXT on `_dmarc.yourdomain.com` |

**DMARC progression:** Start with `p=none` (monitoring only) for 2-4 weeks. Move to `p=quarantine` for 2-4 weeks. Move to `p=reject` once clean. Total timeline: 60-90 days.

### IP Warmup Schedule

| Week | Daily Volume | Notes |
|------|-------------|-------|
| 1 | 200-500 | Send to most engaged contacts only |
| 2 | 1,000-2,000 | Expand to recent openers |
| 3 | 3,000-5,000 | Add broader engaged segments |
| 4 | 5,000-10,000 | Approaching full volume |
| 5+ | Full send | Monitor bounce/complaint rates |

**Critical rule:** Never more than 2x volume day-over-day. Spikes trigger ISP throttling.

### Technical Constraints

- **Gmail:** Clips messages at 102KB HTML size. Keep emails lean.
- **Apple MPP:** Mail Privacy Protection (iOS 15+) pre-fetches images, inflating open rates. Opens are unreliable for Apple Mail users - use clicks as primary engagement signal.
- **Outlook:** Uses Microsoft Word rendering engine. Limited CSS support - no `background-image` on `<div>`, no `margin` on `<p>`, limited `max-width`.
- **Dark mode:** Test in dark mode. Use transparent PNGs, avoid white backgrounds baked into images.

### HTML Email Standards

- **Layout:** Table-based (not `<div>` flexbox/grid)
- **CSS:** Inline styles only (many clients strip `<style>` blocks)
- **Width:** 600px max for desktop, fluid for mobile
- **Font size:** 16px minimum body text
- **Tap targets:** 44x44px minimum on mobile
- **Images:** Always include `alt` text, assume images won't load by default
- **Links:** Use full URLs, not URL shorteners (shorteners trigger spam filters)

---

## Email Benchmarks

| Metric | B2C Benchmark | B2B Benchmark | Action Threshold |
|--------|--------------|--------------|-----------------|
| Open Rate | 20-30% | 25-35% | Investigate below 15% |
| Click-Through Rate (CTR) | 2-5% | 2-5% | Investigate below 1% |
| Click-to-Open Rate (CTOR) | 10-20% | 10-20% | Below 8% = content problem |
| Unsubscribe Rate | < 0.2% | < 0.2% | Above 0.5% = targeting issue |
| Spam Complaint Rate | < 0.1% | < 0.1% | Above 0.1% = deliverability risk |
| Bounce Rate | < 2% | < 2% | Above 3% = list hygiene issue |
| Average ROI | $36 per $1 spent | $36 per $1 spent | - |
| Mobile Opens | 60%+ | 50%+ | Design mobile-first always |

---

## Cold Email

### Core Principles

- **Peer tone, not vendor tone.** Write like a colleague sharing something relevant, not a salesperson pitching.
- **Every sentence earns its place.** If a sentence doesn't advance the email's single goal, delete it.
- **"You/your" > "I/we."** The email is about them and their problem, not about you and your product.
- **Personalization test:** Remove the personalized opening. Does the email still make sense? If yes, your personalization is cosmetic - it's not actually relevant to the recipient's situation.

### Subject Lines

- 2-4 words, lowercase, no punctuation
- Should look like an internal email, not a marketing email
- Examples: "quick question", "shared resource", "re: your team's approach"

### What to Avoid

- "I hope this finds you well" (instant delete trigger)
- "My name is X and I work at Y" (nobody cares yet)
- Industry jargon and buzzwords ("synergy", "leverage", "paradigm shift")
- HTML formatting, images, or tracking pixels in cold emails
- Fake Re: or Fwd: prefixes (deceptive and damages trust permanently)
- Multiple CTAs or asks in one email

### Follow-up Cadence

| Email | Timing | Rule |
|-------|--------|------|
| 1 - Initial | Day 0 | Lead with their problem, not your solution |
| 2 - Follow-up | Day 3-4 | Add new value (data point, case study, insight) |
| 3 - Follow-up | Day 7-8 | Different angle, same problem |
| 4 - Follow-up | Day 14 | Social proof or trigger event reference |
| 5 - Breakup | Day 21-28 | "Not the right time? No worries." |

**Rules:** Each email stands alone (don't say "per my last email"). Each adds new value. Never "just checking in" or "bumping this up." Increasing gaps between emails shows respect for their time.

### CTA Strategy

Interest-based CTAs beat meeting requests:
- "Worth exploring?" > "Can we schedule 15 minutes?"
- "Want me to send the case study?" > "Let's hop on a call"
- "Does this resonate?" > "Are you free Tuesday at 2pm?"

Lower commitment = higher response rate. Earn the meeting through the reply thread.

### Audience Calibration

| Audience | Style | Length | CTA |
|----------|-------|--------|-----|
| C-suite (VP+) | Ultra-brief, peer-level, strategic | 3-5 sentences max | Soft interest check |
| Mid-level (Directors, Managers) | Specific value, outcome-focused | 5-8 sentences | Resource or case study offer |
| Technical (Engineers, Analysts) | Precise, no fluff, respect expertise | 4-6 sentences | Technical asset or demo |

---

## Lifecycle Automation Triggers

| Trigger Event | Automation | Timing | Goal |
|---------------|-----------|--------|------|
| Sign up | Welcome series | Immediate | Deliver value, set expectations |
| Trial start | Onboarding drip | Immediate | Drive first meaningful action |
| Activation achieved | Celebration + next steps | Within 1 hour | Reinforce behavior, advance to next milestone |
| Feature not used | Feature spotlight | Day 7 of inactivity | Surface overlooked value |
| Trial expiring | Urgency + value recap | 3 days before | Convert with deadline + proof |
| Payment failed | Dunning sequence | Immediate, then day 3, 7 | Recover revenue, update payment |
| Upgrade | Thank you + advanced features | Immediate | Reduce buyer's remorse, drive adoption |
| Churn risk signal | Save offer | When risk score triggers | Retain with personalized incentive |

**Dunning detail:** Payment failed emails recover 20-40% of failed charges. Send 3-5 attempts over 14 days. Include a direct link to update payment - no login required if possible. Tone: helpful, not threatening.

**Churn risk signals:** Usage drop > 50% week-over-week, support ticket escalation, cancellation page visit, key feature abandonment, negative NPS response.
