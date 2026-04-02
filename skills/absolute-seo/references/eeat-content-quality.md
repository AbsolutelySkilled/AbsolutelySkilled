# E-E-A-T & Content Quality Reference

## E-E-A-T Scoring Framework

### Experience (20% weight)

| Signal | Strong | Weak |
|--------|--------|------|
| First-hand evidence | Original photos, videos, case studies | Stock images, generic descriptions |
| Specific examples | "We tested X for 6 months and saw Y" | "Many experts recommend X" |
| Process documentation | Step-by-step with screenshots of real usage | Theoretical steps without evidence |
| Unique data | Original research, proprietary benchmarks | Citing others' data only |
| Community engagement | Author responds to comments, shares updates | No interaction |

### Expertise (25% weight)

| Signal | Strong | Weak |
|--------|--------|------|
| Author credentials | Named author with verifiable background | "Admin" or no author |
| Professional depth | Technical accuracy, nuanced analysis | Surface-level overview |
| Certifications | Relevant industry certs displayed | No credential signals |
| Publication history | Consistent writing in the domain | Single post on topic |
| ProfilePage schema | Person entity with `sameAs` links | No author markup |

### Authoritativeness (25% weight)

| Signal | Strong | Weak |
|--------|--------|------|
| External citations | Other authoritative sites reference this content | No inbound citations |
| Brand mentions | Named in industry discussions, news, forums | Unknown brand |
| Industry awards | Recognized by peers | No recognition |
| Backlink profile | Links from .edu, .gov, industry leaders | Links from directories only |
| Wikipedia/Wikidata | Entity has knowledge panel | No entity presence |

### Trustworthiness (30% weight)

| Signal | Strong | Weak |
|--------|--------|------|
| Contact information | Physical address, phone, email visible | No contact page |
| Privacy policy | Clear, accessible, GDPR/CCPA compliant | Missing or generic |
| HTTPS | Valid SSL, no mixed content | HTTP or certificate errors |
| Reviews/testimonials | Third-party reviews with responses | No social proof |
| Date stamps | Published and updated dates on content | Undated content |
| Corrections | Transparent updates, changelog | Errors left uncorrected |
| Editorial process | Stated review process, fact-checking | No editorial standards |

---

## December 2025 Core Update Impact

### Key Changes
- E-E-A-T now applies to **ALL competitive queries**, not just YMYL
- Anonymous/generic authorship penalized even for non-YMYL content
- **Experience** elevated as key differentiator (first-person narrative required)
- AI-generated content without genuine E-E-A-T signals actively demoted

### Traffic Impact by Industry (Dec 2025)
| Industry | Average decline for low-E-E-A-T sites |
|----------|---------------------------------------|
| Affiliate | 71% |
| Health/YMYL | 67% |
| E-commerce | 52% |
| Technology | 38% |
| Entertainment | 22% |

### Recovery Playbook
1. Add author bylines with verifiable credentials to all content
2. Implement ProfilePage schema for authors
3. Add first-hand experience signals (original images, case studies, test results)
4. Update publication dates and add "last reviewed" dates
5. Add editorial process documentation (about page, methodology)
6. Build external authority signals (guest posts, PR, conference talks)

---

## AI Content Assessment

Google's stance (Sept 2025 Quality Rater Guidelines):
- AI content is **acceptable** if it demonstrates genuine E-E-A-T
- AI content is **penalized** when:
  - Generic phrasing without unique value
  - No first-hand experience signals
  - Factual errors or hallucinations
  - Mass-produced without editorial review
  - Duplicative of existing content without added perspective

### AI Content Quality Checklist
- [ ] Contains original insights not available elsewhere
- [ ] Includes first-hand experience (photos, case studies, specific examples)
- [ ] Factually verified by subject matter expert
- [ ] Author byline with verifiable credentials
- [ ] Unique perspective or angle on the topic
- [ ] Edited for style, voice, and accuracy (not raw AI output)

---

## Content Quality Gates (Extended)

### Word Count by Page Type

| Page type | Min words | Unique content | Notes |
|-----------|-----------|----------------|-------|
| Homepage | 500 | 100% | Clear value proposition, service overview |
| Service/Feature page | 800 | 100% | Detailed explanation, benefits, CTAs |
| Blog post (standard) | 1,500 | 100% | Comprehensive coverage of topic |
| Blog post (pillar) | 3,000 | 100% | Definitive guide, links to cluster pages |
| Product page | 400 | 80%+ | Unique descriptions, not manufacturer copy |
| Category page | 400 | 100% | Unique intro, not just product grid |
| Location (primary market) | 600 | 60%+ | Market-specific content, local details |
| Location (secondary) | 500 | 40%+ | Location-specific details, not template fill |
| FAQ page | 800 | 100% | Real questions from customers |
| About page | 400 | 100% | Team, mission, credentials, contact |
| Landing page | 600 | 100% | Focused conversion, clear CTA |
| Comparison page | 1,000 | 100% | Real data, not template fill |

### Title Tag Requirements
- 30-60 characters (Google truncates ~60)
- Primary keyword near beginning
- Unique per page (no duplicates across site)
- Brand at end (optional, e.g., "| Brand Name")
- No keyword stuffing or pipe-separated keyword lists

### Meta Description Requirements
- 120-160 characters (Google truncates ~155-160)
- Include a clear call-to-action
- Unique per page
- Include primary keyword naturally
- Preview what the user will find on the page

### Image Alt Text Requirements
- 10-125 characters
- Describe the image content, not the filename
- Include keywords naturally (not forced)
- Decorative images: use `alt=""` or `role="presentation"`
- Functional images (buttons, links): describe the action, not the image

---

## Content Freshness Signals

### Update Tiers

| Content type | Update frequency | Priority |
|-------------|-----------------|----------|
| News/breaking | Same day | Highest |
| Industry trends | Monthly | High |
| How-to guides | Quarterly | Medium |
| Product reviews | When product updates | Medium |
| Evergreen (definitions) | Annually | Low |
| Legal/compliance | When regulations change | Critical |

### Freshness Indicators
- `<meta property="article:published_time">` and `article:modified_time`
- Schema `datePublished` and `dateModified` in Article/BlogPosting
- Visible "Last updated: [date]" on page
- `<lastmod>` in XML sitemap matching actual content changes

### Helpful Content System (March 2024)
- Merged into core algorithm during March 2024 update
- No longer a separate HCU classifier
- Helpfulness signals weighted within every core update
- Key factors: satisfies search intent, provides unique value, demonstrates experience

---

## Topic Cluster Architecture

### Pillar-Spoke Model

```
[Pillar Page: "Complete Guide to X"]
    |
    |-- [Spoke: "X for Beginners"]
    |-- [Spoke: "Advanced X Techniques"]
    |-- [Spoke: "X vs Y Comparison"]
    |-- [Spoke: "Best X Tools in 2026"]
    |-- [Spoke: "X Case Studies"]
```

**Rules**:
- Pillar page covers the broad topic comprehensively (3,000+ words)
- Spoke pages go deep on subtopics (1,500+ words each)
- Pillar links to all spokes, spokes link back to pillar
- Spokes link to related spokes (lateral connections)
- Each spoke targets a distinct keyword cluster (no cannibalization)

### Cannibalization Detection

Check Google Search Console for:
1. Multiple URLs ranking for the same query
2. Rankings fluctuating between pages (position volatility)
3. Neither page ranking well (split authority)

**Fix**: Consolidate content into the stronger page, 301 redirect the weaker page.

---

## Internal Linking Strategy

### Guidelines
- Every page should be reachable within 3 clicks from homepage
- Use descriptive anchor text (not "click here" or "read more")
- Link contextually within body content (not just navigation)
- Distribute links to important pages (more internal links = more crawl priority)
- Avoid excessive links per page (>100 internal links dilutes per-link value)

### Hub-and-Spoke Pattern
- Hub pages (categories, pillars) link down to detail pages
- Detail pages link up to hub and sideways to related detail pages
- Breadcrumbs provide consistent upward navigation
- Related posts/products sections provide lateral discovery

---

## Framework-Specific SEO Patterns

### Next.js
- Use `generateMetadata()` for dynamic pages
- `metadataBase` for canonical resolution
- `robots.ts` for programmatic robots.txt
- `sitemap.ts` for dynamic sitemap generation
- Image component with `priority` prop for LCP images
- `next/font` for CLS-free web fonts

### Nuxt
- `useSeoMeta()` composable for reactive metadata
- `useHead()` for canonical and hreflang links
- `@nuxtjs/sitemap` module for automatic sitemaps
- `nuxt-og-image` for dynamic OG images
- `NuxtImg` component for optimized images

### Astro
- Layout-based metadata with props
- `@astrojs/sitemap` integration
- Static site generation by default (best for SEO)
- `<Image>` component for optimization
- Partial hydration keeps pages fast (minimal JS)

### Remix
- `meta` export function per route
- `links` export for canonical tags
- Server-side rendering by default
- Nested routes for layout inheritance
