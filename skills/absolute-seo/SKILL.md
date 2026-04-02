---
name: absolute-seo
version: 1.0.0
description: >
  Use this skill when optimizing for search engines across any dimension -
  technical SEO, on-page optimization, content quality (E-E-A-T), schema markup,
  Core Web Vitals, local SEO, link building, international SEO, e-commerce SEO,
  programmatic SEO, AI search optimization (GEO/AEO), or running SEO audits.
  Triggers on SEO, search ranking, indexing, crawlability, schema, CWV, local
  pack, GBP, backlinks, hreflang, AI Overviews, featured snippets, or site audit.
category: marketing
tags: [seo, technical-seo, local-seo, schema, core-web-vitals, geo, aeo, link-building, ecommerce-seo, international-seo, programmatic-seo, audit]
recommended_skills: [keyword-research]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
  - mcp
license: MIT
maintainers:
  - github: maddhruv
---

When this skill is activated, always start your first response with the 🔍 emoji.

# Absolute SEO

Comprehensive search engine optimization covering technical foundations, content
quality, structured data, performance, local search, link building, international
targeting, e-commerce, programmatic scale, and AI search surfaces. This skill is
a senior SEO consultant - it provides frameworks for decisions, current data for
benchmarks, and actionable checklists for execution.

---

## When to use this skill

Trigger when the user:
- Asks about improving search rankings, indexing, or crawlability
- Needs to implement or audit schema markup / structured data
- Wants to optimize Core Web Vitals (LCP, INP, CLS)
- Works on local SEO, Google Business Profile, or maps rankings
- Needs link building strategy or backlink audit
- Implements hreflang or multi-language/region targeting
- Optimizes e-commerce pages (products, categories, faceted navigation)
- Plans programmatic SEO at scale (location pages, comparison pages)
- Wants to optimize for AI search (Google AI Overviews, ChatGPT, Perplexity)
- Needs a comprehensive SEO audit or health check
- Asks about featured snippets, People Also Ask, or voice search
- Needs to configure robots.txt, sitemaps, or canonical tags

Do NOT trigger for:
- Keyword research workflows, difficulty scoring, gap analysis - use **keyword-research** skill
- Paid advertising (Google Ads, PPC campaigns)
- Social media marketing strategy
- General content writing without SEO focus

---

## Key Principles

1. **Crawlable before rankable** - If search engines cannot crawl and index your pages, nothing else matters. Fix technical foundations first.
2. **E-E-A-T is demonstrated, not declared** - Experience, Expertise, Authoritativeness, and Trustworthiness come from first-hand evidence, credentials, citations, and transparency - not claims.
3. **Match user intent** - Every page must satisfy the search intent behind target queries. Mismatched intent means zero chance of ranking regardless of optimization.
4. **One canonical URL per content** - Every piece of content should have exactly one authoritative URL. Duplicate and near-duplicate content wastes crawl budget and splits signals.
5. **Measure, iterate, re-audit** - SEO is not set-and-forget. Track rankings, traffic, and indexation. Re-audit quarterly. Expect 90-day windows before results stabilize.
6. **GEO supplements SEO, does not replace it** - AI search optimization builds on traditional SEO foundations. 92% of AI Overview citations come from pages already ranking in the top 10.

---

## Industry Detection

Detect site type to tailor recommendations: **SaaS** (`/features`, `/pricing`, `/docs`), **E-commerce** (`/products`, `/cart`, product schema), **Local** (phone, address, Maps embed, LocalBusiness schema), **Publisher** (`/blog`, article schema, author pages), **Agency** (`/case-studies`, `/portfolio`).

---

## Technical SEO

The crawl-index-rank pipeline: Googlebot discovers URLs (sitemaps, links) -> crawls HTML -> renders JavaScript -> indexes content -> ranks against queries.

### Crawlability Essentials

- **robots.txt**: Allow CSS/JS (required for rendering). Include `Sitemap:` directive. Never `Disallow: /` on production.
- **XML sitemaps**: Max 50,000 URLs or 50MB per file. Use sitemap index for larger sites. `<lastmod>` must reflect actual content change dates.
- **Canonical tags**: Self-referencing canonicals on every page. Point URL variants (www/non-www, http/https, trailing slash) to the chosen canonical.
- **Redirects**: Use 301 for permanent moves. Single-hop only - chains waste crawl budget and leak PageRank. Audit redirect chains quarterly.
- **Meta robots**: `noindex` prevents indexing. `nofollow` prevents link equity flow. Can combine: `noindex, nofollow`. HTTP header `X-Robots-Tag` works for non-HTML.
- **IndexNow**: Instant indexing protocol for Bing, Yandex, Naver (not Google). Push URL changes immediately instead of waiting for crawl.

### Rendering Strategy

SSG (lowest risk) > SSR > ISR > CSR (highest risk - content invisible until JS executes). Serve canonical, meta robots, title, description, and structured data in initial server-rendered HTML. Never rely on JavaScript injection for SEO-critical elements.

### AI Crawler Management

Key crawlers: `GPTBot` (OpenAI training), `ChatGPT-User` (real-time browsing), `ClaudeBot` (Anthropic), `PerplexityBot` (search + training), `Google-Extended` (Gemini training only), `Bytespider` (ByteDance). Blocking `Google-Extended` does NOT affect Google Search or AI Overviews (those use Googlebot).

> Load `references/technical-seo-deep.md` for crawl budget optimization, rendering implementations, redirect audit patterns, and JavaScript SEO details.

---

## On-Page & Content Quality

### On-Page Hierarchy

| Element | Guidelines |
|---------|-----------|
| Title tag | 50-60 chars, primary keyword near start, unique per page |
| Meta description | 120-160 chars, include CTA, unique per page |
| H1 | One per page, contains primary keyword |
| Headings | Logical hierarchy (H2 > H3 > H4), no skipping levels |
| Images | Descriptive alt text (10-125 chars), width/height for CLS, `fetchpriority="high"` on LCP image, `decoding="async"`, WebP/AVIF, lazy load below fold only |
| Internal links | Descriptive anchor text (not "click here"), link to related content, distribute authority |

### E-E-A-T Framework (Updated Dec 2025)

As of December 2025, E-E-A-T applies to ALL competitive queries, not just YMYL. Anonymous/generic authorship is penalized even for non-YMYL content.

| Signal | Weight | How to demonstrate |
|--------|--------|--------------------|
| **Experience** | 20% | First-hand testing, original photos/videos, case studies, specific examples |
| **Expertise** | 25% | Author credentials, certifications, technical depth, author schema (ProfilePage) |
| **Authoritativeness** | 25% | External citations, industry recognition, backlinks from authorities |
| **Trustworthiness** | 30% | Contact info, privacy policy, HTTPS, reviews, date stamps, transparent corrections |

**AI content**: Acceptable if it demonstrates genuine E-E-A-T. Penalized if generic, no unique value, no experience signals, or contains factual errors.

### Content Quality Gates

| Page type | Min words | Unique content |
|-----------|-----------|----------------|
| Homepage | 500 | 100% |
| Service/Feature | 800 | 100% |
| Blog post | 1,500 | 100% |
| Product page | 400 | 80%+ |
| Category page | 400 | 100% |
| Location (primary) | 600 | 60%+ |
| Location (secondary) | 500 | 40%+ |
| FAQ page | 800 | 100% |

Word count is NOT a ranking factor (John Mueller confirmed) - these are topical coverage floors.

### Image Size Targets

Thumbnails <50KB, content images <100KB, hero/banner <200KB. Format priority: AVIF (93.8% support) > WebP (95.3%) > JPEG > PNG.

> Load `references/eeat-content-quality.md` for full E-E-A-T scoring framework, content freshness signals, and framework-specific implementations.

---

## Schema Markup

Always use **JSON-LD** format (Google's explicit recommendation). Schema earns rich results but does not directly boost rankings. However, pages with structured data have **2.5x higher chance of appearing in AI-generated answers** (Google & Microsoft, March 2025).

### Active Types (Most Used)

| Type | Rich result | Key requirement |
|------|------------|-----------------|
| Article / BlogPosting | Article carousel | headline, datePublished, author |
| Product | Shopping, price | name, offers with price/availability |
| LocalBusiness | Local pack, maps | name, address, telephone |
| Organization | Knowledge panel | name, url, logo |
| BreadcrumbList | Breadcrumb trail | itemListElement array |
| VideoObject | Video carousel | name, uploadDate, thumbnailUrl |
| Event | Event listing | name, startDate, location |
| SoftwareApplication | App info | name, offers, operatingSystem |
| ProfilePage | Author info | mainEntity with Person |
| ProductGroup | Variant selector | hasVariant, variesBy |

### Deprecated / Restricted - NEVER Recommend

| Type | Status | Date |
|------|--------|------|
| HowTo | Removed | Sept 2023 |
| FAQPage | Restricted to gov/healthcare only | Aug 2023 |
| SpecialAnnouncement | Retired | July 2025 |
| CourseInfo, EstimatedSalary, LearningVideo | Deprecated | June 2025 |
| ClaimReview, VehicleListing, Dataset | Deprecated | Late 2025 |

**FAQPage exception**: While Google no longer shows rich results for most sites, FAQPage schema still improves AI/LLM citation visibility on non-Google platforms.

**E-commerce update**: `returnPolicyCountry` in MerchantReturnPolicy is **required** since March 2025. Product Certification markup available since April 2025.

### Validation

Test with Google Rich Results Test before deploy. Ensure: all required properties present, `@context` uses `https://`, all URLs absolute, dates in ISO 8601, no deprecated types, prices include ISO 4217 currency, content marked up is visible on page.

> Load `references/schema-types-full.md` for complete type catalog, JSON-LD examples, and industry-specific implementations.

---

## Core Web Vitals

| Metric | Good | Needs improvement | Poor | What it measures |
|--------|------|-------------------|------|-----------------|
| LCP | <=2.5s | 2.5-4.0s | >4.0s | Largest visible element load time |
| INP | <=200ms | 200-500ms | >500ms | Responsiveness to user interaction |
| CLS | <=0.1 | 0.1-0.25 | >0.25 | Visual stability / layout shifts |

**INP replaced FID** on March 12, 2024. FID fully removed September 9, 2024. INP = Input Delay + Processing Time + Presentation Delay.

- **Evaluation**: 75th percentile of real user data (CrUX). Field data (CrUX) determines ranking, not lab data (Lighthouse). CWV is a tiebreaker signal.
- **December 2025 update**: Mobile CWV weighted more heavily than desktop.

### Top Bottlenecks

- **LCP**: Unoptimized hero images (no `fetchpriority="high"`, lazy-loaded above fold), render-blocking CSS/JS, slow TTFB (>200ms)
- **INP**: Long JavaScript tasks (>50ms). Break with `scheduler.yield()`. Excessive DOM size (>1,500 elements).
- **CLS**: Images/iframes without `width`/`height` attributes. Web font FOUT/FOIT. Dynamically injected content above viewport.

> Load `references/cwv-performance.md` for CrUX API queries, LCP subparts breakdown, and framework-specific fixes (Next.js, Nuxt, Astro).

---

## Local SEO

### Ranking Factors (Whitespark 2026)

| Factor | Weight |
|--------|--------|
| GBP Signals | **32%** (primary category is #1 signal) |
| Proximity | **55.2%** of ranking variance (Search Atlas ML) |
| Review Signals | **~20%** (up from 16% in 2023) |
| On-Page Signals | 15-19% |
| Link Signals | Declining |

### GBP Optimization Priority

1. **Primary category** - Most specific subtype (e.g., "Cosmetic Dentist" not "Dentist")
2. **Additional categories** - Optimal: 4 additional
3. **Complete business info** - Name, address, phone, hours, website (NAP must match everywhere)
4. **Photos** - 10+ photos (logo, cover, interior, exterior, team, products). Refresh within 30 days.
5. **Reviews** - The **18-day rule**: rankings cliff if no new reviews for 3 weeks. The **magic 10**: significant boost at 10 reviews. Never incentivize reviews.
6. **Google Posts** - 1+ per week (update, offer, event)
7. **Services/Products** - List all with descriptions
8. Note: GBP Q&A deprecated Dec 3, 2025 (replaced by Ask Maps Gemini AI). GBP messaging removed July 2025.

### GBP Platform Changes (2025-2026)

- **Diversity Update (2025)**: Harder to rank in BOTH map pack AND organic. Do NOT link GBP to your strongest organic page.
- **Bing Places overhauled** (Oct 2025) - now powers ChatGPT, Copilot, Alexa. Critical for AI visibility.
- **Dedicated service pages** = #1 local organic factor AND #2 AI visibility factor (Whitespark 2026).

### Multi-Location

- Subdirectory structure: `domain.com/locations/city-name/` (50%+ traffic lift vs subdomain)
- Each location page needs >60-70% unique content (doorway page risk below this)
- **Doorway page test**: If you can swap the city name and content still makes sense, it is a doorway page
- Individual LocalBusiness schema per location with unique `@id` + `branchOf` Organization

### AI Impact on Local (2026)

- 45% of users now use ChatGPT/AI for local recommendations
- ChatGPT conversion rate: 15.9% vs Google organic: 1.76%
- ChatGPT sources: Bing web index, Yelp, TripAdvisor, BBB, Reddit (NOT GBP directly)
- 3 of top 5 AI visibility factors are citation-related (Whitespark 2026)

> Load `references/local-seo-signals.md` for full ranking factors, citation tiers, GBP audit checklist, and industry-specific weights.

---

## Link Building & Off-Page

### Acquisition Priority

1. **Digital PR** - Original research, data studies, expert commentary -> editorial links from publications
2. **Resource/link pages** - Find curated lists in your niche, pitch inclusion
3. **Broken link building** - Find broken outbound links on relevant sites, offer your content as replacement
4. **Guest posting** - Contribute to relevant sites with editorial standards (vet: organic traffic, relevance, editorial links)
5. **Unlinked mentions** - Find brand mentions without links, request link addition

### Link Quality Evaluation

A link is valuable when: Domain Rating is strong AND topically relevant AND editorially placed AND the linking page has real organic traffic. Missing any of these significantly reduces value.

### Anchor Text Benchmarks

| Type | SaaS | E-commerce | Local |
|------|------|------------|-------|
| Branded | 40-55% | 35-45% | 45-60% |
| URL/naked | 15-20% | 15-25% | 10-15% |
| Generic | 10-15% | 10-15% | 15-20% |
| Exact-match keyword | 3-8% | 5-10% | 5-10% |
| Partial-match | 10-15% | 10-20% | 5-10% |

**Exact-match keyword anchor >15% = Penguin penalty risk.**

### Toxic Link Indicators (Auto-Flag)

- 10K+ outbound links per page
- Domain not indexed in Google
- Known link networks / PBNs
- Exact-match anchors from 5+ unrelated domains
- Hacked sites with pharma/casino injections

> Load `references/link-building-offpage.md` for all 30 toxic patterns, velocity red flags, disavow file format, and detailed acquisition workflows.

---

## International SEO

- **hreflang is bidirectional**: If page A lists page B as alternate, page B MUST list page A. Missing return tags invalidate the signal.
- **Always include `x-default`**: Fallback for users whose language/region does not match any variant.
- **URL structure**: ccTLD (strongest geo signal, separate domain authority) vs subdomain (moderate signal, shared authority) vs subfolder (weakest signal, consolidated authority). Most sites should use subfolder.
- **Localize, do not just translate**: Currency, date formats, phone numbers, cultural references, legal requirements.
- **Implementation**: HTML `<link rel="alternate" hreflang="xx">`, HTTP headers (PDFs/non-HTML), or XML sitemap (best for large sites).

---

## E-commerce SEO

### Faceted Navigation

The #1 crawl budget killer in e-commerce. Control spectrum (least to most aggressive):
1. **Canonical to base category** - Faceted URLs point canonical to unfaceted version
2. **robots.txt Disallow** - Block crawling of facet parameters
3. **noindex, follow** - Allow link discovery but prevent indexing
4. **AJAX/dynamic filtering** - No URL change, no crawl waste

**Selectively index** high-value facets (e.g., brand + category) that have search volume.

### Product Lifecycle

| Status | Action |
|--------|--------|
| In-stock | Full optimization, Product schema with `InStock` |
| Out-of-stock | Keep page live, show alternatives, update `availability` to `OutOfStock` |
| Discontinued | 301 redirect to replacement or parent category |
| Seasonal | Keep URL, update content and `availability` seasonally |

### Key Patterns

- Category taxonomy: 3 levels max (Department > Category > Subcategory)
- Pagination: Each page self-canonicalizes (NOT to page 1). `rel=next/prev` is deprecated but harmless.
- Product variants: Use `ProductGroup` schema with `hasVariant` to consolidate
- Breadcrumbs: `BreadcrumbList` schema on every product and category page

---

## Programmatic SEO

### Quality Gates

| Metric | Threshold | Action |
|--------|-----------|--------|
| Pages without review | 100+ | WARNING - enforce 40%+ unique content |
| Pages without justification | 500+ | HARD STOP - require explicit justification |
| Unique content between pages | <40% | Flag as thin content |
| Word count per page | <300 | Review required |

### Safe vs Penalty Risk Patterns

**Safe**: Integration/tool pages with real docs, glossary (200+ word definitions), product pages with unique specs/images/reviews, data-driven pages with unique statistics per record.

### Penalty Risk Patterns

- Location pages with only city name swapped (doorway pages)
- "[Competitor] alternative" without real comparison data
- AI-generated content without human review (5-10% sample human review minimum)
- **Site reputation abuse**: pSEO content under high-authority domain triggers penalties (Nov 2024 escalation). Scaled content abuse enforcement intensified June-Aug 2025.

### Launch Strategy

1. **Seed**: Publish 50-100 pages first
2. **Observe**: Monitor for 4-6 weeks (indexation rate, rankings, GSC coverage)
3. **Scale**: If quality signals positive, publish in batches of 100/day (not thousands at once)
4. **Monitor**: Search Console API for cluster-level metrics

---

## AI Search Optimization (GEO + AEO)

### Generative Engine Optimization (GEO)

- **Brand mentions correlate 3x stronger with AI visibility than backlinks** (Ahrefs, Dec 2025). YouTube mentions show 0.737 correlation (strongest single signal).
- AI Overviews reach 1.5B users/month across 200+ countries. **Google AI Mode** (May 2025) has zero organic blue links - AI citation is the only visibility mechanism.
- 92% of AI Overview citations come from top-10 ranking pages, but 47% from below position 5
- Only 11% domain overlap between ChatGPT citations and Google AI Overviews - platform-specific optimization needed
- Optimal citation passage length: **134-167 words**
- Multi-modal content sees **156% higher selection rates** in AI answers

### Citability Scoring

| Factor | Weight |
|--------|--------|
| Self-contained answer blocks with specific facts | 25% |
| Structural readability (semantic headings, lists, tables) | 20% |
| Authority signals (author byline, publication date, primary sources) | 20% |
| Multi-modal content (text + images + data) | 15% |
| Technical accessibility (SSR critical - AI does not execute JS) | 20% |

**Princeton GEO research**: Statistics +40% citation, cited sources +30%, expert quotes +25%.

### llms.txt Standard

Emerging guidance file at `/llms.txt` (domain root). Structured content guidance for AI crawlers: key page highlights, content areas, authority info.

### Answer Engine Optimization (AEO)

**Featured snippet formats**:
- Paragraph: 40-60 words, question in heading, answer immediately after
- List: 5-8 items, self-contained, use `<ol>` or `<ul>`
- Table: 3-5 columns, semantic HTML with `<thead>`/`<tbody>`

**People Also Ask**: Dynamic, auto-populated. Research via AlsoAsked.com. Target question-based H2/H3 headings with concise 40-60 word answers.

**Voice search**: Conversational queries (7-10 words), local bias. Optimize with FAQ schema, concise answers, LocalBusiness schema.

> Load `references/geo-aeo-ai-search.md` for platform-specific optimization, AI crawler directives, RSL 1.0, and detailed AEO strategies.

---

## SEO Audit Methodology

### 35-Check Scorecard (5 Categories)

| Category | Checks | Focus |
|----------|--------|-------|
| Technical SEO | 10 | Crawlability, indexability, sitemaps, canonicals, HTTPS, mobile, speed |
| On-Page SEO | 8 | Titles, meta, headings, images, internal links, URL structure |
| Content SEO | 7 | E-E-A-T, topical authority, freshness, cannibalization, thin content |
| Off-Page SEO | 5 | Backlink profile, anchor diversity, toxic links, domain authority |
| AEO & GEO Readiness | 5 | Schema, featured snippet eligibility, AI citation signals, llms.txt |

**Scoring**: PASS (meets standard) / WARN (partially meets) / FAIL (does not meet)

### Priority Matrix

| Priority | Criteria | Examples |
|----------|----------|---------|
| Critical | Prevents indexing or causes penalty | noindex on key pages, security issues, manual actions |
| High | Significant ranking impact | Missing titles, broken canonicals, CWV failures |
| Medium | Moderate impact, easy to fix | Missing alt text, thin meta descriptions |
| Low | Minor optimization opportunity | Schema enhancements, minor redirect chains |

**Cadence**: Full audit quarterly. Quick health check (top 10 items) monthly.

---

## Web Analysis Patterns

Fetch and inspect any page's SEO elements:

```bash
curl -sL -A "Mozilla/5.0" -o /tmp/seo-page.html "URL"  # Fetch HTML
curl -sL "https://domain.com/robots.txt"                 # Check robots.txt
curl -sI -L "URL"                                        # Headers & redirects
curl -sL "https://domain.com/llms.txt"                   # Check llms.txt
curl -sL "https://domain.com/sitemap.xml" | head -50     # Check sitemap
grep -iE '<title|<meta name="(robots|description)|rel="canonical"' /tmp/seo-page.html
grep -oP '<script type="application/ld\+json">.*?</script>' /tmp/seo-page.html
```

---

## Anti-Patterns

| Anti-pattern | Why it fails |
|-------------|-------------|
| Keyword stuffing in titles/content | Spam signal since Panda; degrades user experience |
| Buying links or joining link schemes | Penguin penalty; manual actions |
| `noindex` left on production after staging | Entire site deindexed |
| Publishing thousands of pSEO pages day one | Scaled content abuse; immediate manual action |
| Blocking CSS/JS in robots.txt | Prevents rendering; pages indexed as blank |
| Duplicate title tags across pages | Wastes ranking potential; confuses intent signals |
| Stuffing keywords in GBP business name | Violation of Google guidelines; suspension risk |
| Canonical pointing to a different page's content | Signals the wrong page should rank |
| Ignoring mobile experience | 100% mobile-first indexing since July 2024 |
| Treating CWV lab scores as truth | Field data (CrUX) determines ranking, not Lighthouse |

---

## Gotchas

1. **robots.txt blocks crawling, not indexing** - URLs can appear in results (without snippet) via inbound links. Use `noindex` to prevent indexing.
2. **Canonical is a hint, not a directive** - Google may ignore it. Ensure canonical target is clearly the better version.
3. **Redirect chains leak PageRank** - Each hop loses ~15% equity in practice. Single-hop 301s only.
4. **Staging site indexed** - Password-protect staging, do not rely solely on meta robots.
5. **hreflang without return tags** - Missing bidirectional tags invalidate the entire hreflang cluster.

---

## References

Load these on demand when the task requires deep data:

- `references/technical-seo-deep.md` - Crawl budget, rendering implementations, redirect audit, robots.txt advanced, JS SEO
- `references/eeat-content-quality.md` - Full E-E-A-T scoring, content freshness, framework-specific SEO implementations
- `references/schema-types-full.md` - Complete type catalog, JSON-LD examples, industry-specific schemas, validation
- `references/local-seo-signals.md` - Whitespark 2026 factors, review benchmarks, citation tiers, GBP audit, multi-location
- `references/link-building-offpage.md` - 30 toxic indicators, anchor text analysis, disavow format, acquisition workflows
- `references/geo-aeo-ai-search.md` - AI crawler directives, llms.txt spec, Princeton research, featured snippets, voice search

---

## Companion Check

On first activation, check if the user has **keyword-research** installed. If not, suggest installing it for keyword discovery, difficulty scoring, and gap analysis.
