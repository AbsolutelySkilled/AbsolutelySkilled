<!-- Part of the Absolute Marketing skill. Load this file when building or updating product marketing context, running customer research, or creating personas. -->

# Product Marketing Context - Full Guide

A product marketing context document is the single source of truth that feeds every downstream deliverable - landing pages, ads, emails, positioning statements, and competitive battle cards. This guide covers how to build one, research customers, and define your ICP.

---

## Building the Context Document

### Path A: Auto-Draft

Scan available artifacts and pre-populate sections automatically.

| Source | Sections it feeds |
|---|---|
| README / docs | Product Overview, Differentiation |
| Landing pages | Value prop, Target Audience, Proof Points |
| package.json / manifest | Category, integrations, tech stack |
| Meta tags / OG data | Positioning, description, category |
| Marketing copy / ads | Customer Language, Objections |
| Changelog / release notes | Differentiation, Proof Points |
| Support tickets / FAQs | Pain Points, Objections |
| Competitor websites | Competitive Landscape |

After auto-draft, flag every section as `[DRAFT]` or `[VERIFIED]`. No section ships as verified without human review or customer data backing it.

### Path B: Guided Build

Work through all 12 sections using discovery questions. Each section has a defined output format.

---

## Section 1: Product Overview

**Questions to answer:**
- What does the product do in one sentence (no jargon)?
- What is the core value proposition?
- What category does it belong to? (use the customer's category, not yours)
- What is the primary use case?
- What are 2-3 secondary use cases?

**Output format:**
```
Product: [name]
One-liner: [plain language sentence]
Category: [market category]
Core value prop: [single sentence]
Primary use case: [description]
Secondary use cases: [list]
```

## Section 2: Target Audience

**Questions to answer:**
- Who is the primary buyer? (role/title, not demographics)
- What company profile? (size, industry, stage, tech stack)
- B2B, B2C, or B2B2C?
- Who influences the purchase vs. who signs the check?
- What is the typical buying process duration?

**Output format:**
```
Buyer role: [title/function]
Company profile: [size, industry, stage]
Model: [B2B / B2C / B2B2C]
Decision maker: [role]
Influencers: [roles]
Typical sales cycle: [duration]
```

## Section 3: Personas (2-3 max)

**Template per persona:**

| Field | Content |
|---|---|
| Role | Job title and function |
| Goals | Top 3 professional goals |
| Frustrations | Top 3 pain points with current approach |
| Evaluation criteria | How they judge solutions (speed, cost, features, support) |
| Trigger events | What makes them start looking for a solution |
| Preferred channels | Where they consume information and make decisions |

**Anti-patterns to avoid:**
- Do not name personas cutely ("Marketing Mary") - use role-based labels
- Do not average across segments - each persona should be distinct
- Do not invent personas without data - mark as `[HYPOTHESIS]` until validated
- Revisit personas quarterly - stale personas cause stale messaging

## Section 4: Problems and Pain Points

**Questions to answer:**
- What are the top 3-5 problems your product solves?
- Use customer language, not internal jargon
- Prioritize problems mentioned unprompted over prompted responses
- What is the cost of inaction (staying with current approach)?
- Which problems are table-stakes vs. differentiating?

**Prioritization matrix:**

| Pain Point | Frequency | Intensity | Unprompted? | Cost of Inaction |
|---|---|---|---|---|
| [pain 1] | High/Med/Low | High/Med/Low | Yes/No | [describe] |

## Section 5: Competitive Landscape

### Three tiers of competition

| Tier | Definition | Example |
|---|---|---|
| Direct | Same solution, same problem | Competitor A vs. your product |
| Secondary | Different solution, same problem | Spreadsheets vs. your SaaS tool |
| Indirect | Conflicting approach to same goal | Outsourcing vs. your automation |

### Per-competitor analysis

```
Competitor: [name]
Tier: [Direct / Secondary / Indirect]
Positioning: [their one-liner]
Pricing: [model and range]
Strengths: [2-3 bullet points]
Weaknesses: [2-3 bullet points]
Key differentiator from us: [one sentence]
Where they win deals: [scenario]
Where we win deals: [scenario]
```

Update competitive analysis quarterly. Set calendar reminders.

## Section 6: Differentiation

Focus on positioning, not features. Features are what you built. Positioning is why it matters.

**Questions to answer:**
- What can you do that competitors cannot or will not?
- What do customers say is different about you (in their words)?
- What is your unfair advantage (data, distribution, team, tech)?
- Complete: "Only [product] does [X] because [Y]"

**Output:** A positioning statement following the format:
```
For [target audience] who [situation/need],
[product] is the [category]
that [key benefit]
unlike [primary alternative]
because [reason to believe].
```

## Section 7: Objections and Anti-Personas

**Common objection categories:**
- Price ("too expensive")
- Timing ("not the right time")
- Authority ("need to check with...")
- Need ("we're fine with current approach")
- Trust ("how do I know this works?")

For each objection, document: the objection verbatim, the underlying concern, the response framework, and supporting proof points.

**Anti-personas** - people you should NOT sell to:
- Who consistently churns?
- Who requires disproportionate support?
- Who has use cases you do not support well?

## Section 8: Switching Dynamics (JTBD Four Forces)

| Force | Direction | Discovery question |
|---|---|---|
| Push | Toward switching | "What frustrates you about your current approach?" |
| Pull | Toward switching | "What attracted you to [product]?" |
| Habit | Against switching | "What would you miss about your current tool?" |
| Anxiety | Against switching | "What concerns you about making a change?" |

**Key principle:** Push + Pull must exceed Habit + Anxiety for switching to occur.

For each force, collect 5+ verbatim customer quotes. Map the balance per persona - different roles have different force profiles.

## Section 9: Customer Language

**Rules:**
- Exact customer words always beat polished marketing descriptions
- Collect phrases from: support tickets, sales calls, reviews, social posts, community forums
- Organize by theme, not by source

| Theme | Customer phrase (verbatim) | Source | Frequency |
|---|---|---|---|
| Speed | "I just need it to not take forever" | G2 review | 8x |
| Simplicity | "I don't want to read docs for an hour" | Reddit | 5x |

**Usage:** Customer language feeds headlines, ad copy, email subject lines, and landing page copy directly. Do not paraphrase.

## Section 10: Brand Voice

**Four dimensions:**

| Dimension | Spectrum | Our position |
|---|---|---|
| Formality | Casual --- Formal | [position] |
| Humor | Serious --- Playful | [position] |
| Enthusiasm | Reserved --- Enthusiastic | [position] |
| Technicality | Simple --- Technical | [position] |

**We are / We are not pairs:**

| We are | We are not |
|---|---|
| Direct | Blunt |
| Confident | Arrogant |
| Helpful | Patronizing |
| [add yours] | [add yours] |

## Section 11: Proof Points

| Type | Content | Impact metric | Where to use |
|---|---|---|---|
| Metric | "Reduced deploy time by 40%" | Quantified outcome | Landing page, ads |
| Logo | [Company name] | Brand recognition | Homepage, decks |
| Case study | [Title] | Full narrative | Sales enablement |
| Testimonial | "[verbatim quote]" - Name, Title | Social proof | Emails, landing page |
| Award/Press | [Publication/award] | Third-party validation | Footer, about page |

**Proof point quality ladder:** Vanity metrics < Output metrics < Outcome metrics < Revenue/ROI metrics.

## Section 12: Goals

```
90-day marketing goals:
1. [Goal] - Metric: [target] - Current: [baseline]
2. [Goal] - Metric: [target] - Current: [baseline]
3. [Goal] - Metric: [target] - Current: [baseline]

Constraints:
- Budget: [amount or range]
- Team: [size and roles]
- Dependencies: [list blockers]
```

---

## Voice of Customer Research

### Extraction Framework (6 Dimensions)

For every customer data point, extract:

| Dimension | What to capture | Example |
|---|---|---|
| JTBD | The job the customer is hiring your product to do | "I need to ship features faster without breaking things" |
| Pain Points | Specific frustrations with current approach | "Our deploys take 45 minutes and fail half the time" |
| Trigger Events | What caused them to start looking | "We had a production outage that cost us a client" |
| Desired Outcomes | What success looks like to them | "Deploy in under 5 minutes with zero rollbacks" |
| Language/Vocabulary | Exact words and phrases they use | "CI/CD pipeline", not "continuous integration system" |
| Alternatives Considered | What else they evaluated or tried | "We looked at Jenkins and CircleCI before this" |

### Confidence Labeling

| Level | Criteria |
|---|---|
| High | 3+ independent sources, mentioned unprompted |
| Medium | 2 sources, or prompted but consistent |
| Low | Single source, anecdotal |

Only use High confidence data for positioning statements and headlines. Medium for supporting copy. Low for internal hypotheses only.

### Bias Awareness

| Source | Known bias | Mitigation |
|---|---|---|
| Online reviews | Over-represents power users and angry users | Weight by recency; cross-reference |
| Support tickets | Skews toward problems, misses happy paths | Pair with NPS/CSAT data |
| Reddit/forums | Technical and skeptical audience | Note demographic skew |
| Sales calls | Survivorship bias (only talks to prospects) | Include churned customer interviews |
| Surveys | Framing effects, social desirability | Use open-ended questions first |
| App store reviews | Extreme opinions (1-star and 5-star) | Focus on 2-4 star for nuance |

### Minimum Viable Sample

5+ independent data points per segment before treating a finding as actionable. Below 5, label as `[HYPOTHESIS]`.

### Digital Watering Holes by ICP

| ICP | Primary sources | Secondary sources |
|---|---|---|
| B2B SaaS | Reddit (r/SaaS, r/startups), G2, HN, LinkedIn | Capterra, TrustRadius, industry Slack groups |
| SMB / Founders | Reddit, Indie Hackers, Product Hunt, Facebook groups | Twitter/X, niche forums, YouTube comments |
| Developer | DevOps subreddits, HN, Stack Overflow, Discord servers | Dev.to, GitHub discussions, tech podcasts |
| B2C | App store reviews, Reddit, YouTube, TikTok comments | Amazon reviews, Facebook groups, Twitter/X |
| Enterprise | LinkedIn, analyst reports (Gartner, Forrester), G2 Enterprise | Job postings (signals pain points), conference talks |

### Asset-Specific Extraction Tips

| Asset Type | Look For | Watch Out For |
|---|---|---|
| Interview transcripts | "The moment they decided" - switching triggers | Leading questions that bias responses |
| Surveys | Segment before drawing conclusions | Open vs multiple-choice conflicts |
| Support tickets | Categorize by theme before analyzing | Over-indexes on problems, misses value |
| Win/loss interviews | Why they chose you (or didn't) | Post-hoc rationalization |
| NPS responses | Passives and detractors have highest signal | Promoters tell you what you want to hear |
| App store reviews | 2-4 star reviews for nuance | 1-star and 5-star are extreme outliers |

### Research Deliverables

1. **Synthesis report** - Top themes ranked by frequency x intensity, with representative quotes
2. **VOC quote bank** - Organized by theme, tagged with persona and confidence level
3. **Persona documents** - Updated with validated data
4. **JTBD map** - Jobs, pains, gains per persona
5. **Competitive intel summary** - What customers say about alternatives
6. **Research gap analysis** - What we still don't know and how to find it

Use a 12-month recency window. Data older than 12 months should be revalidated.

### Research Process

1. **Identify sources** - Pick 3-5 watering holes matching your ICP
2. **Collect raw data** - Gather 50+ data points (quotes, reviews, posts)
3. **Extract dimensions** - Tag each data point with the 6 dimensions above
4. **Label confidence** - Apply High/Medium/Low per finding
5. **Synthesize** - Group findings by theme, identify patterns
6. **Update context doc** - Feed findings into the relevant sections above

---

## ICP Definition

### Firmographic Criteria

| Criterion | Ideal | Acceptable | Disqualified |
|---|---|---|---|
| Industry | [target industries] | [adjacent industries] | [excluded] |
| Company size | [employee range] | [extended range] | [too small/large] |
| Geography | [primary markets] | [secondary markets] | [excluded regions] |
| Tech stack | [required technologies] | [compatible technologies] | [incompatible] |
| Growth stage | [ideal stage] | [acceptable stages] | [excluded stages] |
| Annual revenue | [target range] | [extended range] | [below minimum] |

### Behavioral Criteria

| Criterion | Signal | How to detect |
|---|---|---|
| Pain trigger | Active problem that your product solves | Search queries, forum posts, support requests |
| Current solution | Using a workaround or competitor | Tech stack data, job postings, integrations |
| Buying signal | Budget allocated, timeline defined | Intent data, RFP activity, demo requests |
| Budget authority | Can approve purchase at your price point | Title, company size, procurement process |
| Champion potential | Internal advocate who will push adoption | Engagement level, questions asked, referrals |

### Disqualification Criteria (Anti-ICP)

Document who you do NOT want as customers:
- Companies below [X] employees (support cost exceeds LTV)
- Industries with [specific constraint] (compliance, regulation)
- Teams without [prerequisite] (technical skill, process maturity)
- Buyers expecting [thing you do not do] (custom builds, white-label)

### Optional: ICP Scoring Model

| Factor | Weight | 5 (ideal) | 3 (acceptable) | 1 (poor fit) |
|---|---|---|---|---|
| Company size | 25% | 50-500 employees | 10-49 or 501-2000 | < 10 or > 2000 |
| Pain intensity | 30% | Active, urgent problem | Recognized problem | No awareness |
| Budget fit | 20% | Budget allocated | Budget available | No budget |
| Tech readiness | 15% | Uses compatible stack | Willing to adopt | Incompatible |
| Champion access | 10% | Direct contact | Warm intro possible | No access |

**Scoring:** Weighted sum produces a 1-5 score. Prioritize leads scoring 4+. Nurture 3-4. Disqualify below 3.

---

## Maintenance Schedule

| Section | Review frequency | Trigger for ad-hoc update |
|---|---|---|
| Product Overview | Quarterly | Major feature launch or pivot |
| Personas | Quarterly | New segment discovered |
| Competitive Landscape | Quarterly | Competitor raises funding, launches feature, changes pricing |
| Customer Language | Monthly | New batch of reviews or interviews |
| Proof Points | Monthly | New case study, metric, or logo |
| Goals | Quarterly | Goal achieved or strategy shift |
| ICP | Semi-annually | Significant churn pattern or new market entry |
