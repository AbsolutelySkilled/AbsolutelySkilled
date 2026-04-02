<!-- Part of the Absolute Marketing skill. Load this file when doing SEO audits, keyword research, technical SEO, AEO/GEO optimization, programmatic SEO, or schema markup implementation. -->

# Search Visibility Reference

## Keyword Research

### Tri-Surface Scoring (0-30)

Score every keyword across three surfaces before prioritizing:

| Surface | Score | Criteria |
|---------|-------|----------|
| Organic | 0-10 | Volume, difficulty, SERP features present |
| AEO | 0-10 | Snippet opportunity, PAA presence, voice eligibility |
| GEO | 0-10 | AI Overview likelihood, citation potential, source authority |

Total = Organic + AEO + GEO. Prioritize keywords scoring 18+.

### Search Intent Classification

| Intent | Signal Words | SERP Pattern |
|--------|-------------|--------------|
| Informational | what, how, why, guide | Knowledge panels, PAA, wikis |
| Navigational | [brand], login, app | Brand sitelinks, homepage |
| Transactional | buy, pricing, discount, coupon | Shopping ads, product pages |
| Commercial Investigation | best, vs, review, compare | Listicles, comparison tables, review sites |

### Modifiers by Buyer Stage

- **Awareness**: "what is", "how to", "why does", "examples of", "guide to"
- **Consideration**: "best", "vs", "comparison", "alternatives", "top 10"
- **Decision**: "pricing", "reviews", "demo", "free trial", "discount"
- **Implementation**: "templates", "tutorial", "setup", "integration", "API docs"

### Cluster Building Process

1. Gather keyword variants (seed + related + questions + long-tail)
2. Group by SERP overlap: if 5+ of top 10 results are identical, keywords belong together
3. Select primary keyword (highest volume in cluster)
4. Name cluster after primary keyword
5. Map one page per cluster - no cannibalization

### Priority Formula

```
Priority = (monthly_volume * relevance_score) / keyword_difficulty
```

Where relevance_score = 1-10 based on product fit. Filter out priority < 5.

---

## On-Page SEO

### Title Tags
- 50-60 characters (Google truncates at ~600px)
- Primary keyword near the beginning
- No brand name in title (wastes characters unless brand is the query)
- Unique per page - never duplicate titles

### Meta Descriptions
- 150-160 characters
- Include a compelling CTA ("Learn how to...", "Discover why...")
- Include primary keyword naturally (Google bolds matches)
- Not a ranking factor, but directly impacts CTR

### Content Structure
- **H1**: One per page, contains primary keyword
- **H2**: Major sections, contain secondary keywords
- **H3**: Subsections, contain long-tail variants
- Internal links: 5-10 per 1,000 words
- Anchor text: Descriptive, keyword-relevant - never "click here"
- First 100 words: Include primary keyword naturally

### Image Optimization
- Descriptive filenames: `blue-running-shoes.webp` not `IMG_4521.webp`
- Alt text: Describe the image for screen readers, include keyword if natural
- Explicit `width` and `height` attributes (prevents CLS)
- Format: WebP (26% smaller than PNG) or AVIF (50% smaller)
- Lazy loading: `loading="lazy"` on below-fold images
- Responsive: `srcset` for multiple resolutions

---

## Technical SEO

### Crawlability Essentials
- **XML Sitemap**: Submit to GSC, include only indexable URLs, update dynamically
- **robots.txt**: Block admin, staging, duplicate parameter URLs
- **Canonicals**: Self-referencing on every page, cross-domain when syndicating
- **noindex**: Use on thin pages, tag pages, internal search results, staging

### Core Web Vitals Targets & Fixes

| Metric | Good | Fix Strategy |
|--------|------|-------------|
| LCP < 2.5s | Preload hero image, inline critical CSS, CDN, reduce server response |
| CLS < 0.1 | Set explicit dimensions, reserve ad slots, avoid dynamic content injection above fold |
| INP < 200ms | Break long tasks, defer non-critical JS, use `requestIdleCallback`, reduce DOM size |

### Site Architecture
- **3-click rule**: Any page reachable in 3 clicks from homepage
- **Navigation**: 4-7 top-level items maximum
- **URL design**: Hyphens (not underscores), lowercase, short, descriptive
- **Flat hierarchy**: `/category/page` not `/category/subcategory/sub-subcategory/page`

### Common Technical Mistakes
- Dates in URLs (forces new URL for updates, loses equity)
- Over-nesting beyond 3 levels (dilutes crawl priority)
- Changing URLs without 301 redirects (immediate traffic loss)
- Leaving `noindex` on staging then pushing to production
- Orphan pages with zero internal links
- Mixed content (HTTP resources on HTTPS pages)

---

## E-E-A-T & Topical Authority

### E-E-A-T Breakdown

| Signal | What It Means | How to Demonstrate |
|--------|--------------|-------------------|
| Experience | First-hand involvement | Original screenshots, case studies, "I tested this" |
| Expertise | Deep subject knowledge | Detailed explanations, technical accuracy, credentials |
| Authoritativeness | Industry recognition | Backlinks, mentions, citations, speaking engagements |
| Trustworthiness | Reliability and honesty | HTTPS, clear policies, accurate claims, corrections |

### E-E-A-T Audit Checklist
- [ ] Author byline with bio on every article
- [ ] Author credentials visible (certifications, experience)
- [ ] "Last reviewed" or "Updated" date on content
- [ ] Claims backed by citations to primary sources
- [ ] Comprehensive "About" page with team bios
- [ ] No AI-generated filler content (thin, generic, no unique insight)
- [ ] Contact information easily accessible
- [ ] Clear editorial policy or review process documented

### Content Freshness Tiers

| Tier | Update Frequency | Content Types |
|------|-----------------|---------------|
| High | Every 3-6 months | Pricing, tool comparisons, "best of" lists, statistics |
| Medium | Annually | How-to guides, strategy content, frameworks |
| Low | Every 18-24 months | Foundational concepts, historical content, glossaries |

**Decay signal**: Traffic drops 20%+ over a rolling 90-day window. Trigger a refresh.

---

## SEO Audit Priority Order

1. **Crawlability** - Can search engines find and access pages?
2. **Technical** - CWV, mobile-friendliness, HTTPS, structured data errors
3. **On-Page** - Titles, headings, content quality, internal links
4. **Content Quality** - E-E-A-T, freshness, depth, uniqueness
5. **Authority** - Backlink profile, brand mentions, domain trust

### Issues by Site Type

| Site Type | Common Issues |
|-----------|--------------|
| SaaS | Missing comparison/alternative pages, thin feature pages, no programmatic SEO |
| E-commerce | Thin category descriptions, faceted navigation creating duplicate URLs, missing product schema |
| Blog/Publisher | Outdated content, keyword cannibalization, no topical clusters, thin author pages |

---

## AEO (Answer Engine Optimization)

### Featured Snippet Types

| Type | Format | Optimization |
|------|--------|-------------|
| Paragraph | 40-60 words | Direct answer immediately after the question heading |
| Ordered list | 5-8 items | Step-by-step with H2/H3 + numbered list |
| Unordered list | 5-8 items | "Types of", "Examples of" + bullet list |
| Table | 3-5 columns | Comparison data in HTML `<table>` elements |

### PAA (People Also Ask) Mining Workflow
1. Search target keyword, expand all PAA boxes
2. Click each PAA to generate more questions (cascade effect)
3. Collect 20-40 questions per topic
4. Group by theme
5. Answer each in a dedicated H2 section (40-60 words per answer)
6. Link between related answers

### Voice Search Optimization
- Write answers in FAQ format (question as heading, answer as paragraph)
- Keep answers under 30 words for voice readback
- Use conversational, spoken-style language
- Target "near me" and question-based queries

### AEO Rules
- Pages not ranking in top 10 rarely win featured snippets
- PAA boxes can be won from page 2 results
- Snippet ownership is volatile - monitor weekly
- Tables win snippets for comparison queries 3x more often than paragraphs

---

## GEO (Generative Engine Optimization)

### AI Overview Impact
- AI Overviews appear in ~45% of Google searches
- Clicks reduced by up to 58% when AI Overview is present
- Informational queries most affected; transactional least affected

### Princeton Research: Content Signals That Improve AI Visibility

| Signal | Impact | Implementation |
|--------|--------|---------------|
| Cite sources | +40% | Link to studies, data, official docs |
| Statistics | +37% | Include specific numbers, percentages, dates |
| Quotations | +30% | Quote experts, researchers, practitioners |
| Authoritative tone | +25% | Write with confidence, avoid hedging |
| Clarity | +20% | Short sentences, clear structure, no jargon |
| Technical terms | +18% | Use domain-specific vocabulary correctly |
| Keyword stuffing | -10% | Actively penalized - write naturally |

**Best combination**: Fluency + Statistics outperforms any single signal.

### Content Types Cited by AI

| Type | Citation Share |
|------|--------------|
| Comparisons | ~33% |
| Comprehensive guides | ~15% |
| Original research | ~12% |
| Listicles | ~10% |

### AI Visibility Audit Framework

1. **Query audit** - Test 20-50 target queries across ChatGPT, Perplexity, Google AI Overviews, and Gemini. Record: Are you cited? Which page? Competitor cited instead?
2. **Citation analysis** - Brands are 6.5x more likely cited via third-party sources than their own domain. Check: Wikipedia, Reddit, review sites, industry publications.
3. **Content extractability check** - For each priority page: self-contained paragraphs? Stats with sources? Comparison tables? FAQ schema? 40-60 word answer blocks?
4. **Bot access verification** - Confirm robots.txt allows: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `Bingbot`
5. **Gating audit** - Any authoritative content behind login/paywall? AI cannot access it. Move key content to open pages.

### Three Pillars of AI SEO

- **Structure** - Make content extractable: self-contained paragraphs, semantic headings as questions, data tables, FAQ schema
- **Authority** - Make content citable: statistics with sources, expert quotes, original research, clear definitions
- **Presence** - Be where AI looks: Wikipedia mentions, Reddit discussions, YouTube, review sites, industry directories

### GEO Best Practices
- Write key passages of 40-60 words optimized for extraction
- Third-party citations outperform self-citations (Wikipedia = 7.8% of ChatGPT citations)
- Allow AI bots in robots.txt: `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Bingbot`
- Gating content behind logins kills AI visibility completely
- Structure content as self-contained, extractable paragraphs
- Include data tables - AI models love structured data
- Implement `llms.txt` at site root for AI-readable documentation maps

---

## Programmatic SEO

### 12 Playbooks

| Playbook | Example | Pattern |
|----------|---------|---------|
| Templates | "[Tool] invoice template" | Template gallery + download |
| Curation | "Best [category] tools" | Curated list + mini-reviews |
| Conversions | "[X] to [Y] converter" | Input/output tool page |
| Comparisons | "[Tool A] vs [Tool B]" | Side-by-side feature table |
| Examples | "[Type] examples" | Gallery with explanations |
| Locations | "[Service] in [City]" | Localized landing pages |
| Personas | "[Tool] for [Role]" | Role-specific use cases |
| Integrations | "[Tool A] + [Tool B] integration" | Setup guide + benefits |
| Glossary | "What is [Term]" | Definition + context + related |
| Translations | "[Phrase] in [Language]" | Translation + usage examples |
| Directory | "[Category] companies" | Filterable directory listing |
| Profiles | "[Entity] profile" | Structured entity pages |

### Data Defensibility Ranking
1. **Proprietary** - Data you generate that nobody else has
2. **Product-derived** - Data created through product usage
3. **User-generated** - Reviews, ratings, contributions
4. **Licensed** - Exclusive data partnerships
5. **Public** - Available to anyone (lowest defensibility)

### Programmatic SEO Rules
- Use subfolders, not subdomains (`/tools/x` not `x.tools.com`)
- Every page must have unique value - not just swapped variables
- Quality over quantity - 500 excellent pages beat 50,000 thin pages
- Internal link every programmatic page to its cluster hub

---

## Schema Markup (JSON-LD)

### Essential Schema Types

| Type | Required Properties | Rich Result |
|------|-------------------|-------------|
| Organization | name, url, logo, sameAs | Knowledge panel |
| Article | headline, author, datePublished, image | Article carousel |
| Product | name, offers (price, currency, availability) | Product snippet |
| FAQPage | mainEntity[].name, mainEntity[].acceptedAnswer | FAQ accordion |
| HowTo | name, step[].text, step[].name | How-to steps |
| BreadcrumbList | itemListElement[].name, .item, .position | Breadcrumb trail |

### Implementation Notes
- Combine multiple schemas using `@graph` array in a single `<script type="application/ld+json">`
- Always validate with Google Rich Results Test
- **Gotcha**: `web_fetch` and `curl` cannot detect JS-injected JSON-LD - check page source directly
- Nest `author` within `Article`, reference `Organization` via `@id`
- Keep `dateModified` current when content is updated

---

## Link Building

### Strategy Priority Order
1. **Digital PR** - Newsworthy data studies, original research, expert commentary
2. **Resource page outreach** - Get listed on curated resource pages in your niche
3. **Broken link building** - Find broken links on relevant sites, offer your content as replacement
4. **Guest posts** - Contribute to authoritative publications in your space
5. **Unlinked mentions** - Find brand mentions without links, request attribution

### Link Quality Checklist
- Domain Rating (DR) > 40
- Topically relevant to your niche
- Editorial placement (not paid, not sidebar widget)
- Page has real organic traffic
- Dofollow (nofollow links have limited value)
- Not on a page with 100+ outbound links

### GSC Quick Wins for Link Building Targets
- **Position 10-20**: Pages close to page 1 - a few links could push them over
- **CTR < 2% + high impressions**: Visible but not clicked - improve title/meta + build links
- **Clicks = 0 + impressions > 100**: Indexed but invisible - needs authority boost

### Internal Link Audit
- Fix orphan pages (0 internal links pointing to them)
- Add contextual links from high-authority pages to priority targets
- Use descriptive anchor text matching the target page's keyword
- Ensure every new page gets at least 3 internal links within first week

---

## Site Architecture

### URL Patterns by Page Type

| Page Type | Pattern | Example |
|-----------|---------|---------|
| Feature | `/features/[name]` | `/features/analytics` |
| Pricing | `/pricing` | `/pricing` |
| Blog | `/blog/[slug]` | `/blog/growth-strategy` |
| Case study | `/customers/[name]` | `/customers/acme-corp` |
| Docs | `/docs/[section]/[page]` | `/docs/api/authentication` |
| Comparison | `/compare/[competitor]` | `/compare/competitor-name` |
| Integration | `/integrations/[name]` | `/integrations/slack` |
| Landing page | `/lp/[campaign]` | `/lp/free-trial` |

### Navigation Design

| Type | Purpose | Rules |
|------|---------|-------|
| Header nav | Primary navigation | 4-7 items max, CTA rightmost, logo links home |
| Dropdown | Secondary pages | 2 levels max, grouped logically |
| Footer | Discovery, legal, sitemap | 3-4 columns, organized by category |
| Breadcrumbs | Location context | On every page 2+ levels deep |
| Sidebar | Section navigation | Docs and blog categories only |

### Site Type Templates

| Type | Typical Depth | Key Sections |
|------|--------------|-------------|
| SaaS | 2-3 levels | Features, Pricing, Customers, Blog, Docs, Integrations |
| E-commerce | 3-4 levels | Categories, Products, Collections, Blog |
| Content/Blog | 2 levels | Categories, Posts, About, Newsletter |
| Documentation | 3-4 levels | Getting Started, Guides, API Reference, Changelog |
