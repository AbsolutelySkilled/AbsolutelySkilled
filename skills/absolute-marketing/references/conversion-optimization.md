<!-- Part of the Absolute Marketing skill. Load this file when optimizing pages, signup flows, forms, onboarding, popups, or paywalls for conversions. -->

# Conversion Rate Optimization (CRO) Reference

## Page CRO Framework

### Analysis Priority Order

Work top-down. Fixing lower items while upper items are broken wastes effort.

1. **Value Prop Clarity** - Can a visitor explain what you do in 5 seconds?
2. **Headline** - Does it communicate the outcome, not the feature?
3. **CTA** - Is the next action obvious and compelling?
4. **Visual Hierarchy** - Does the eye flow toward the conversion action?
5. **Trust Signals** - Are there logos, testimonials, or security badges?
6. **Objection Handling** - Are common hesitations addressed before the CTA?
7. **Friction** - Are there unnecessary fields, steps, or distractions?

### Headline Patterns

| Pattern | Template | Example |
|---------|----------|---------|
| Outcome-focused | `[Achieve outcome] without [pain point]` | "Ship 2x faster without breaking prod" |
| Social proof | `[N] [users] trust [product] to [outcome]` | "12,000 teams trust Acme to manage deploys" |
| Specific benefit | `[Verb] your [metric] by [amount] in [time]` | "Cut your build times by 60% in one sprint" |
| Question | `[Struggling with / Tired of] [pain point]?` | "Tired of debugging config drift at 2am?" |

Rules: One headline per page. Under 12 words. Test headline before anything else - it moves the needle more than any other element.

### CTA Optimization

| Weak CTA | Strong CTA | Why |
|-----------|------------|-----|
| Submit | Start Free Trial | Action + what they get |
| Sign Up | Get My Dashboard | First-person + specific outcome |
| Learn More | See It In Action | Implies low commitment |
| Download | Get the Free Guide | Specificity + value framing |
| Buy Now | Start Saving Today | Outcome-oriented |

**CTA Formula:** `[Action Verb] + [What They Get]`

First-person CTAs ("Get **My** Report") outperform third-person ("Get **Your** Report") by ~90% on warm audiences. However, first-person backfires on cold audiences who have no relationship with the brand yet.

**Match CTA temperature to audience:**
- **Cold** (ads, cold email): Low commitment. "See How It Works", "Watch Demo"
- **Warm** (blog readers, retargeted): Medium commitment. "Start Free Trial", "Get the Guide"
- **Hot** (pricing page, returning users): Direct. "Start My Plan", "Upgrade Now"

### Page Section Framework

Optimal order for long-form pages:

1. **Hero** - Headline + subhead + primary CTA + hero image/video
2. **Social Proof** - Logos, user count, or a single strong testimonial
3. **Problem** - Agitate the pain. Make them feel understood.
4. **Solution** - Your product as the answer. Show, don't tell.
5. **How It Works** - 3-step explanation. Reduce perceived complexity.
6. **Objections** - FAQ or comparison table addressing top hesitations
7. **Final CTA** - Repeat the primary CTA with urgency or incentive

### Page-Type Checklists

**Homepage:**
- [ ] Clear value prop visible without scrolling
- [ ] Primary CTA above the fold
- [ ] Social proof within first two viewports
- [ ] Navigation limited to 5-7 items
- [ ] One primary action per viewport section
- [ ] Page loads under 3 seconds

**Landing Page:**
- [ ] Single goal - one CTA, no navigation
- [ ] Headline matches the ad/link that brought them here
- [ ] Benefit-oriented subheadline
- [ ] Visual showing the product or outcome
- [ ] 3+ trust signals (logos, testimonials, guarantees)
- [ ] Mobile-optimized form

**Pricing Page:**
- [ ] Recommended plan visually highlighted
- [ ] Feature comparison table for 3+ plans
- [ ] Annual/monthly toggle (annual shown first)
- [ ] FAQ addressing billing, cancellation, refunds
- [ ] Social proof specific to enterprise/team tiers
- [ ] Free tier or trial option clearly visible

---

## Signup Flow Optimization

### Field Strategy

| Field | Include? | Rationale |
|-------|----------|-----------|
| Email | Always | Primary identifier |
| Password | Always | Account security |
| Name | Usually | Personalization, but can defer |
| Company | Defer | Ask post-signup or infer from email domain |
| Role/Title | Defer | Useful for segmentation but adds friction |
| Team size | Defer | Qualification signal, collect in onboarding |
| Phone | Defer | High friction, collect only when needed |

### Progressive Commitment

Step users through increasing commitment levels:

1. **Email only** - Lowest barrier. Get them in the door.
2. **Password + Name** - Create the account.
3. **Customization** (optional) - Role, team size, use case. Mark as skippable.

Each step should deliver value before asking for more. Never gate step 1 behind information needed for step 3.

### Social Auth by Audience

| Audience | Priority Order |
|----------|---------------|
| B2C | Google > Apple > Facebook |
| B2B | Google > Microsoft/Azure AD > SSO (SAML) |
| Developer | GitHub > Google > GitLab |

Always offer email/password as fallback. Social auth reduces friction by 20-40% on average.

### Password UX

- **Allow paste** - Never disable paste in password fields. It breaks password managers.
- **Show/hide toggle** - Eye icon to toggle visibility. Default to hidden.
- **Strength meter** - Visual bar (weak/medium/strong). Color-coded.
- **Requirements upfront** - Show all rules before the user types, not after they fail.
- **No arbitrary rules** - Minimum 8 characters is sufficient. Don't require special characters.

### Signup Metrics

| Metric | What It Tells You |
|--------|-------------------|
| Form start rate | % of page visitors who interact with the first field |
| Completion rate | % of form starters who submit |
| Field-level drop-off | Which specific field causes abandonment |
| Time to complete | How long from first interaction to submit |
| Error rate per field | Which validations are tripping users up |

---

## Onboarding CRO

### Core Principle: Time-to-Value

The single most important onboarding metric is how quickly users reach the "aha moment" - the point where they experience the core value.

**Finding the aha moment:** Compare behavior of retained users (active at day 30) vs churned users (inactive by day 7). The actions that most differentiate these groups are your activation events.

### Onboarding Checklist Design

- **3-7 items** - Fewer feels trivial, more feels overwhelming
- **Order by value** - Put the highest-value action second (first is too early, users aren't oriented)
- **Quick wins first** - First item should complete in under 30 seconds
- **Progress bar** - Show completion percentage. Endowed progress (start at 20%) increases completion.
- **Dismiss option** - Always let users close the checklist. Forced onboarding backfires.
- **Celebrate completion** - Confetti, congratulations, or unlock a reward at 100%

### Empty States as Onboarding

Every empty state is a conversion opportunity. Replace "No data yet" with:
- A clear explanation of what will appear here
- A single action button to create the first item
- A sample/template to reduce blank-page anxiety
- A short video or illustration showing the populated state

### Trigger-Based Email Sequences

| Email | Timing | Purpose |
|-------|--------|---------|
| Welcome | Immediate (within 1 min) | Confirm signup, set expectations, single CTA to start |
| Incomplete setup | 24 hours | Remind about unfinished onboarding steps |
| Second nudge | 72 hours | Different angle - social proof or tip-based |
| Activation | On event | Congratulate on reaching aha moment, suggest next step |
| Feature discovery | Day 3 | Introduce a second high-value feature |
| Feature discovery | Day 7 | Introduce integrations or advanced features |
| Feature discovery | Day 14 | Case study or power-user tips |

Rules: Every email has exactly one CTA. Unsubscribe link in every message. Stop the sequence once the user completes the target action.

---

## Form Optimization

### Field Count Impact

| Fields | Conversion Impact |
|--------|-------------------|
| 1-3 | Baseline (highest conversion) |
| 4-6 | 10-25% reduction |
| 7-9 | 25-40% reduction |
| 10+ | 40-60% reduction |

Every field you add must justify its existence. If you can collect it later or infer it, remove it from the form.

### Form UX Rules

- **Labels above fields** - Never use placeholder text as the only label. Placeholders disappear on focus.
- **Single column** - Multi-column forms cause tab-order confusion and slower completion.
- **Inline validation** - Validate on blur (not on keystroke). Show success states too, not just errors.
- **Smart defaults** - Pre-select the most common option. Auto-detect country, timezone, currency.
- **Autofill support** - Use correct `autocomplete` attributes (`email`, `given-name`, `tel`, etc.)
- **Mobile tap targets** - Minimum 44x44px for all interactive elements.
- **Group related fields** - Visual grouping reduces perceived complexity.
- **Mark optional fields** - Label optional fields, not required ones. Most fields should be required.

### Submit Button

Formula: `"[Action] + [What they get]"`

- "Create My Account" not "Submit"
- "Get the Report" not "Download"
- "Reserve My Spot" not "Register"

Full-width buttons on mobile. High contrast against background. Disabled state while processing with loading indicator.

---

## Popup & Modal Optimization

### Trigger Effectiveness

| Trigger | Typical CVR | Annoyance Level |
|---------|-------------|-----------------|
| Click-triggered | 10%+ | None (user initiated) |
| Exit intent | 3-10% | Low (they were leaving anyway) |
| Scroll depth (50%+) | 2-5% | Medium |
| Time delay 30-60s | 2-4% | Medium |
| Time delay <5s | <1% | High (not recommended) |
| Immediate on load | <1% | Very high (never do this) |

### Popup Rules

- **Frequency cap** - Never show the same popup more than once per session. Max once per 7 days for returning visitors.
- **Google mobile penalty** - Interstitials covering >50% of mobile screen on entry trigger ranking penalties. Use banners or bottom sheets instead.
- **Polite decline copy** - "No thanks, I don't want to save money" guilt-trip copy damages brand trust. Use neutral: "Maybe later" or "Dismiss".
- **Visible close button** - Top-right X, minimum 44x44px. Never hide or delay the close button.
- **Escape key closes** - Always. Non-negotiable for accessibility.
- **Background click closes** - Clicking outside the modal should dismiss it.

### High-Converting Popup Types

1. **Content upgrade** - "Get the PDF version of this article" on blog posts. Click-triggered. 10-25% CVR.
2. **Exit intent with incentive** - "Wait - here's 15% off" when cursor moves to close. 3-10% CVR.
3. **Click-triggered demo** - "See it in action" button opens video modal. 10%+ engagement.

---

## Paywall & Upgrade CRO

### When to Show vs NOT Show

| Show Paywall | Do NOT Show Paywall |
|--------------|---------------------|
| User hits usage limit naturally | Before user experiences core value |
| User tries a premium feature | During critical workflow mid-task |
| Free trial is expiring (with notice) | On first session ever |
| User reaches aha moment | When user is frustrated or stuck |
| After demonstrating value repeatedly | On error pages or support flows |

### Paywall Screen Components (Priority Order)

1. **Headline** - Outcome-focused: "Unlock unlimited projects" not "Upgrade to Pro"
2. **Value demo** - Show what they're missing with preview, blurred content, or usage stats
3. **Plan comparison** - Side-by-side table. Highlight the recommended plan.
4. **Pricing** - Clear monthly/annual with savings shown. Anchor to annual.
5. **Social proof** - Testimonials from users who upgraded. Specific outcomes.
6. **CTA** - "Start My Free Trial" or "Upgrade to [Plan Name]"
7. **Escape hatch** - Always provide a way to continue with the free tier or dismiss

### Anti-Patterns

- **Hiding close/dismiss** - Users will churn, not convert
- **Confusing plan names** - Use descriptive names (Starter, Team, Enterprise) not creative ones (Spark, Blaze, Inferno)
- **Guilt-trip copy** - "Continue with limited features" is fine. "No, I hate saving time" is not.
- **Blocking critical flows** - Never paywall bug reports, data export, or account settings
- **Bait and switch** - If a feature was free, give adequate notice before paywalling it

---

## CRO Prioritization

### ICE Scoring

Score each test idea on three dimensions (1-10 scale):

- **Impact** - How much will this move the target metric?
- **Confidence** - How sure are you this will work? (data-backed = high, gut = low)
- **Ease** - How quickly can you implement and measure this?

**ICE Score = (Impact + Confidence + Ease) / 3**

Prioritize by ICE score. Revisit scores monthly as you learn more.

### Key Benchmarks

| Metric | Poor | Average | Good | Great |
|--------|------|---------|------|-------|
| Homepage bounce rate | >65% | 45-65% | 25-45% | <25% |
| Landing page CVR (cold) | <2% | 2-5% | 5-15% | >15% |
| Landing page CVR (warm) | <10% | 10-20% | 20-40% | >40% |
| Signup completion | <30% | 30-50% | 50-80% | >80% |
| Onboarding completion | <20% | 20-40% | 40-70% | >70% |
| Free-to-paid (freemium) | <1% | 1-2% | 2-5% | >5% |
| Free-to-paid (trial) | <5% | 5-15% | 15-25% | >25% |

These are cross-industry medians. Your specific vertical may differ. Always benchmark against your own historical data first, industry data second.

### Quick Wins by Page Type

- **Homepage**: Fix the headline and primary CTA first. Biggest ROI.
- **Landing page**: Message match with the traffic source. If the ad says X, the page must say X.
- **Signup**: Remove one field. Measure. Repeat.
- **Onboarding**: Find and eliminate the step with the highest drop-off.
- **Pricing**: Add annual toggle and highlight the most popular plan.
- **Paywall**: Show value before asking for money. Always.
