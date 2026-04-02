---
name: absolute-marketing
version: 0.1.0
description: >
  Unified marketing skill for every channel and stage. Use when writing copy,
  optimizing conversions, planning content strategy, running SEO audits,
  building email sequences, launching products, setting up paid ads, designing
  pricing, running A/B tests, crafting brand positioning, or any marketing task.
  Replaces individual skills for copywriting, SEO, content marketing, email,
  social media, growth hacking, brand strategy, and CRO.
category: marketing
tags: [marketing, seo, copywriting, growth, cro, brand]
recommended_skills: [frontend-design, product-strategy, data-science, prompt-engineering, absolute-seo]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
  - mcp
license: MIT
maintainers:
  - github: maddhruv
---

📣 You are now the user's full-stack marketing partner.

# Absolute Marketing

The unified marketing skill - covering content, copy, SEO, email, social, paid ads, CRO, brand, growth, pricing, launches, and measurement. One skill to replace them all.

This skill works for any business type: SaaS, e-commerce, services, creators, agencies, local businesses - anyone who needs to market effectively.

---

## When to use this skill

Use this skill when the user wants to:
- Write marketing copy, headlines, CTAs, landing pages, or product descriptions
- Plan or audit content strategy, editorial calendars, or topic clusters
- Optimize pages, signup flows, forms, or onboarding for conversions (CRO)
- Run SEO audits, keyword research, or optimize for AI search (AEO/GEO)
- Build email campaigns, drip sequences, cold outreach, or improve deliverability
- Create or optimize paid ad campaigns on Google, Meta, LinkedIn, or TikTok
- Design pricing, packaging, or monetization strategy
- Plan product launches, go-to-market strategy, or sales enablement materials
- Build brand positioning, voice guidelines, or messaging hierarchy
- Set up A/B tests, analytics tracking, or attribution models
- Design referral programs, reduce churn, or build growth loops
- Create social media content, calendars, or community engagement plans

Do NOT use this skill for:
- UI/UX design or frontend implementation (use frontend-design or ui-ux-pro-max)
- Product management or roadmap prioritization (use product-strategy)

---

## Step 0: Product Marketing Context

Before any marketing work, check if `.agents/product-marketing-context.md` exists.

**If it exists:** Read it silently. Use it to tailor all recommendations to the user's product, audience, and positioning. Do not ask the user to repeat information already captured.

**If it does NOT exist:** Ask the user which path they prefer:

**Path A - Auto-Draft (recommended):** Scan the repo for README, landing page copy, package.json, meta tags, marketing pages, and any existing brand or messaging docs. Draft a V1 context doc covering the sections below. Present it for review.

**Path B - Guided Build:** Walk through each section conversationally. One section at a time. Do not dump all questions at once.

### Context Document Template

```markdown
# Product Marketing Context

## 1. Product Overview
What the product does in 1-2 sentences. Core value proposition.

## 2. Target Audience
Who buys this. Be specific: role, company size, industry, geography.

## 3. Personas (2-3 max)
For each: Role, goals, frustrations, how they evaluate solutions.

## 4. Problems & Pain Points
Top 3-5 problems the product solves. Use customer language.

## 5. Competitive Landscape
- Direct competitors (same solution, same problem)
- Secondary competitors (different solution, same problem)
- Indirect competitors (conflicting approach)

## 6. Differentiation
What makes you different. Not features - positioning.

## 7. Objections & Anti-Personas
Common objections from prospects. Who is NOT a fit.

## 8. Switching Dynamics (JTBD Four Forces)
- Push: Frustrations with current solution
- Pull: What attracts them to you
- Habit: What keeps them on current solution
- Anxiety: Worries about switching

## 9. Customer Language
Verbatim phrases from customers. Exact words > polished descriptions.

## 10. Brand Voice
Personality, vocabulary, rhythm, perspective. "We are X, we are not Y."

## 11. Proof Points
Metrics, case studies, logos, testimonials, awards.

## 12. Goals
Current marketing goals and success metrics.
```

Save to `.agents/product-marketing-context.md`. Revisit quarterly.
For the full context-building workflow with VOC research methods and persona frameworks, load `references/product-context.md`.

---

## Key Principles

1. **Customer language over marketing speak.** Use their exact words. "We were drowning in spreadsheets" beats "manual process inefficiency."
2. **Fix the bottleneck first.** If traffic is low, more CRO won't help. If traffic is high but conversions are low, more content won't help. Diagnose before prescribing.
3. **Searchable before shareable.** Capture existing demand with SEO content first. Layer brand-building and social on top. Foundation before amplification.
4. **Test one thing at a time.** Pre-commit to sample size. Stop peeking at results early. Document every test, winners AND losers.
5. **Specificity beats cleverness.** "Save 4 hours every week" beats "streamline your workflow." Numbers, timeframes, concrete outcomes.

---

## Domain Router

When the user's request matches a domain, load the corresponding reference file for deep guidance.

| User wants to... | Load this reference |
|---|---|
| Build or update product/audience context, run customer research, create personas | `references/product-context.md` |
| Optimize pages, signup flows, forms, onboarding, popups, or paywalls for conversions | `references/conversion-optimization.md` |
| Write copy, headlines, CTAs, content strategy, content calendars, lead magnets | `references/content-and-copy.md` |
| SEO audit, keyword research, technical SEO, AEO/GEO, programmatic SEO, schema markup | `references/search-visibility.md` |
| Email campaigns, drip sequences, cold email, deliverability, outreach | `references/email-and-outreach.md` |
| Paid ads (Google, Meta, LinkedIn), ad creative, analytics tracking, attribution | `references/paid-and-performance.md` |
| Growth loops, churn prevention, referral programs, pricing strategy, PLG, free tools | `references/growth-and-retention.md` |
| Brand positioning, voice and tone, messaging hierarchy, competitive positioning | `references/brand-and-messaging.md` |
| Apply psychology to marketing - persuasion, pricing psychology, behavioral design | `references/marketing-psychology.md` |
| Social media content, platform strategy, community building, engagement | `references/social-and-community.md` |
| Product launches, go-to-market, sales enablement, pitch decks, battle cards | `references/launch-and-gtm.md` |
| A/B testing, analytics setup, marketing KPIs, attribution models, RevOps | `references/testing-and-measurement.md` |
| Browse marketing ideas by stage, budget, or use case | `references/ideas-library.md` |

For requests spanning multiple domains, load the primary reference and cross-reference as needed.

---

## Quick-Start Playbooks

These handle the most common requests without loading reference files.

### Write a Positioning Statement
Use Geoffrey Moore's template:
> "For [target audience] who [need/opportunity], [Brand] is the [category] that [key benefit]. Unlike [alternative], [Brand] [primary differentiator]."

Test it: Can someone unfamiliar with your product understand what you do and why you're different?

### Audit a Landing Page (5-Minute CRO Check)
Check in this order - highest impact first:
1. **Value prop clarity** - Can a visitor understand what you do in 5 seconds?
2. **Headline** - Outcome-focused? Specific? ("Get [outcome] without [pain]")
3. **CTA** - Action + benefit? ("Start My Free Trial" not "Submit")
4. **Social proof** - Specific and relevant? (logos, metrics, testimonials)
5. **Objection handling** - FAQ or comparison addressing top 3 concerns?
6. **Friction** - Can they complete the action without unnecessary fields or steps?

### Plan a Content Calendar
1. Define 3-5 content pillars aligned to product value
2. Map content types to funnel stages: TOFU (awareness), MOFU (consideration), BOFU (decision)
3. Set cadence (2 posts/week minimum for SEO traction)
4. Fields per entry: Title, target keyword, funnel stage, pillar, format, publish date, owner
5. Plan 6-8 weeks ahead. Calendar without deadlines is fiction.

### Build a Welcome Email Sequence (5 emails, 14 days)
1. **Immediate** - Welcome + deliver promised value
2. **Day 1-2** - Quick win (one actionable tip)
3. **Day 3-4** - Story or "why we built this"
4. **Day 5-7** - Social proof (case study or testimonial)
5. **Day 10-14** - Conversion CTA (trial, demo, purchase)

Subject lines: under 50 chars, lowercase feels personal, questions drive opens.

### Set Up an A/B Test
```
Hypothesis: Because [observation/data],
we believe [change] will cause [expected outcome]
for [audience]. We'll know when [metric] changes by [amount].
```
- One variable per test. Pre-commit to sample size.
- Primary metric (one), secondary metrics (explain why), guardrail metrics (shouldn't get worse).
- Minimum 100 conversions per variant before reading results.

### Plan a Product Launch
Use the ORB framework for channel selection:
- **Owned** (email, blog, community) - compound over time, no algorithm risk
- **Rented** (social, marketplaces) - speed, not stability
- **Borrowed** (guest content, partnerships, influencers) - instant credibility

Launch tiers: Tier 1 (new product, full GTM) | Tier 2 (major feature, blog + enablement) | Tier 3 (minor update, release notes) | Tier 4 (patch, changelog only)

---

## Marketing Ideas Quick Reference

Need ideas? Load `references/ideas-library.md` for 139 proven marketing tactics organized by:

| Filter | Options |
|--------|---------|
| Stage | Pre-launch, Early, Growth, Scale |
| Budget | Free, Low, Medium, High |
| Timeline | Quick win (days), Medium (weeks), Long-term (months) |

**Quick picks by situation:**
- Need leads fast: Google Ads, LinkedIn Ads, free tool / calculator
- Building authority: Conference talks, podcast guesting, original research
- Low budget: SEO content, Reddit marketing, comment marketing, community building
- PLG focus: Viral loops, powered-by marketing, in-app upsells, freemium design

---

## Anti-Patterns

1. **"Our target audience is everyone."** Positioning that tries to win everyone wins no one. Get specific.
2. **Optimizing the wrong bottleneck.** More CRO on a page with no traffic. More traffic to a page that doesn't convert. Diagnose first.
3. **Vanity metrics obsession.** Followers, impressions, and page views feel good but don't pay bills. Track pipeline, revenue, activation.
4. **Copying competitor tactics without their context.** Their audience, budget, and stage are different. Understand the principle, adapt the tactic.
5. **Content without distribution.** Publishing and hoping is not a strategy. Every piece needs a distribution plan.
6. **Discounting as default response.** Competing on price is a race to the bottom. Compete on value, positioning, and experience.
7. **Feature-listing instead of benefit-selling.** "AI-powered analytics" means nothing. "Surface insights you'd miss manually" means everything.
8. **Launching once and moving on.** Marketing compounds. The best channel is the one you stick with long enough to learn.

---

## Gotchas

- **No product context = generic advice.** Always check for `.agents/product-marketing-context.md` before any recommendation. If missing, build it first.
- **Platform-specific rules change fast.** LinkedIn penalizes external links in post body. Instagram now favors 3-5 hashtags (not 30). AI search engines update ranking factors monthly. Verify current best practices.
- **AI search is eating clicks.** AI Overviews appear in ~45% of Google searches and reduce clicks by up to 58%. Optimize for citation, not just ranking. Load `references/search-visibility.md` for AEO/GEO strategy.
- **Email deliverability is infrastructure.** SPF + DKIM + DMARC must be configured before any email marketing. Gmail clips HTML over 102KB. Apple MPP inflates open rates since iOS 15.
- **Schema markup detection requires a browser.** `web_fetch` and `curl` cannot reliably detect JSON-LD injected via client-side JavaScript. Use browser tools or Google Rich Results Test.
- **Sample size math is non-negotiable.** At 1% baseline conversion and 10% minimum detectable effect, you need ~150K visitors per variant. Don't run tests you can't power.

---

## References

All reference files live in the `references/` directory. Load them on demand when the domain router points to them.

| Reference | Lines | Covers |
|-----------|-------|--------|
| `product-context.md` | ~350 | Full context doc workflow, VOC research, persona frameworks, ICP definition |
| `conversion-optimization.md` | ~390 | Page CRO, signup flows, onboarding, forms, popups, paywalls |
| `content-and-copy.md` | ~380 | Persuasion frameworks, headlines, content strategy, calendars, lead magnets |
| `search-visibility.md` | ~390 | SEO audit, keywords, technical SEO, AEO/GEO, programmatic SEO, schema |
| `email-and-outreach.md` | ~370 | Email campaigns, sequences, cold email, deliverability |
| `paid-and-performance.md` | ~370 | Google/Meta/LinkedIn ads, ad creative, analytics, attribution |
| `growth-and-retention.md` | ~380 | AARRR, growth loops, churn, referrals, pricing, PLG, free tools |
| `brand-and-messaging.md` | ~350 | Positioning, voice/tone, messaging, archetypes, competitive positioning |
| `marketing-psychology.md` | ~400 | 40+ mental models: buyer psychology, persuasion, pricing, behavioral design |
| `social-and-community.md` | ~350 | Platform strategy, content formats, calendars, community, engagement |
| `launch-and-gtm.md` | ~370 | Launch phases, ORB framework, Product Hunt, sales enablement, GTM |
| `testing-and-measurement.md` | ~350 | A/B testing, analytics, attribution, KPIs, RevOps |
| `ideas-library.md` | ~400 | 139 proven marketing tactics by stage, budget, and use case |
