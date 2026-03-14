<!-- Part of the product-launch AbsolutelySkilled skill. Load this file when
     working with go-to-market strategy, positioning, or launch channel planning. -->

# Go-to-Market Strategy

A GTM strategy answers four questions: who is the audience, why should they care,
how will they find out, and what does success look like. This reference provides
a complete GTM template and channel playbooks.

---

## GTM Plan Template

Use this structure for any product or feature launch. Adapt depth to launch size -
a major product launch needs all sections; a small feature may only need sections 1-4.

### 1. Target Audience

Define the audience with specificity. Use the ICP (Ideal Customer Profile) format:

```
Company profile:
  - Industry: [e.g., B2B SaaS]
  - Size: [e.g., 50-500 employees]
  - Stage: [e.g., Series A to Series C]
  - Tech stack: [e.g., uses React, deploys on AWS]

Buyer persona:
  - Title: [e.g., VP of Engineering]
  - Pain: [e.g., CI/CD pipelines take 45 min, blocking developer productivity]
  - Current solution: [e.g., Jenkins with custom scripts]
  - Budget authority: [Yes/No, approx range]

User persona (if different from buyer):
  - Title: [e.g., Senior Software Engineer]
  - Daily workflow: [e.g., pushes 3-5 PRs/day, waits for CI]
  - Success metric: [e.g., PR merge time under 30 minutes]
```

### 2. Positioning Statement

Use Geoffrey Moore's positioning template:

```
For [target audience]
who [statement of need or opportunity],
[product name] is a [product category]
that [key benefit / reason to believe].
Unlike [primary competitive alternative],
our product [primary differentiation].
```

Example:
```
For engineering teams at growing startups
who lose hours waiting for slow CI pipelines,
FastCI is a cloud-native CI/CD platform
that runs builds 10x faster using intelligent parallelization.
Unlike Jenkins or CircleCI,
FastCI requires zero configuration and scales automatically.
```

### 3. Messaging Matrix

Create a message for each persona at each awareness stage:

| Persona | Unaware | Problem-aware | Solution-aware | Product-aware |
|---|---|---|---|---|
| VP Engineering | "Your CI is costing you $X/month in lost developer time" | "Fast CI exists - 10x faster builds" | "Here's how FastCI compares to Jenkins" | "Start free, see results in 5 min" |
| Senior Engineer | "What if CI never blocked your PR?" | "Parallel test execution is the answer" | "FastCI auto-parallelizes with zero config" | "Install in 2 commands, keep your yaml" |

### 4. Channel Strategy

Rank channels by expected impact. Focus on 2-3 primary channels, not all of them.

**For developer tools:**

| Channel | Effort | Impact | Timeline |
|---|---|---|---|
| Product Hunt launch | Medium | High (day-1 spike) | Launch day |
| Hacker News / Show HN | Low | High (if it hits front page) | Launch day |
| Blog post (own site) | Medium | Medium (SEO long-tail) | Launch day |
| Twitter/X thread | Low | Medium | Launch day |
| Dev community posts (Reddit, Discord) | Low | Medium | Launch week |
| YouTube demo video | High | Medium-High | Launch week |
| Conference talk | High | High (but delayed) | Post-launch |
| Paid ads (Google, LinkedIn) | Medium | Varies | Post-launch |

**For B2B SaaS:**

| Channel | Effort | Impact | Timeline |
|---|---|---|---|
| Email to existing customers | Low | High | Launch day |
| Sales enablement (battle cards, demo script) | Medium | High | Pre-launch |
| Partner co-marketing | High | High | Launch week |
| Webinar / live demo | Medium | Medium-High | Launch week |
| Case study with beta customer | High | High (long-tail) | Post-launch |
| Analyst briefing (Gartner, Forrester) | High | High (enterprise) | Post-launch |

### 5. Pricing Strategy

If the launch involves pricing, document:

```
Model: [Free / Freemium / Paid / Usage-based / Hybrid]
Free tier: [What's included, limits]
Paid tiers:
  - Starter: $X/mo - [features, limits]
  - Pro: $X/mo - [features, limits]
  - Enterprise: Custom - [features, limits]
Rationale: [Why this model fits the audience and competitive landscape]
Migration: [How existing users transition - grandfathered, grace period, etc.]
```

### 6. Timeline

Map key milestones to dates:

```
T-4 weeks:  GTM plan finalized, stakeholders aligned
T-3 weeks:  Content creation begins (blog, docs, emails)
T-2 weeks:  Sales enablement materials ready, support briefed
T-1 week:   Launch readiness review, all content approved
T-0 (Launch): Blog published, emails sent, social posted
T+1 week:   Measure day-1 to day-7 metrics
T+2 weeks:  Post-launch retrospective
T+4 weeks:  First metrics review against targets
```

### 7. Success Metrics

Define 3-5 metrics with targets. Use a mix of leading and lagging indicators:

| Metric | Target | Measurement | Leading/Lagging |
|---|---|---|---|
| Sign-ups (day 1) | 500 | Analytics | Leading |
| Activation rate (day 7) | 30% | Analytics | Leading |
| Conversion to paid (day 30) | 5% | Billing system | Lagging |
| Support ticket volume | < 2x baseline | Helpdesk | Leading |
| NPS from new users (day 14) | > 40 | Survey | Lagging |

---

## GTM Anti-patterns

- **Launching everywhere at once** - Spreading thin across 10 channels produces no
  signal. Pick 2-3, execute well, measure, then expand.
- **Positioning by features** - Users care about outcomes, not features. Lead with
  the problem solved, not the technology used.
- **No competitive positioning** - If you cannot articulate why you are different from
  the top 2 alternatives, neither can your users.
- **Ignoring existing users** - Your best launch channel is often your existing user
  base. They already trust you and will amplify the message.
- **Success metrics after launch** - If you define metrics after seeing the data, you
  will unconsciously pick metrics that look good. Define them before.
