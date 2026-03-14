<!-- Part of the seo-audit AbsolutelySkilled skill. Load this file when
     generating a formal SEO audit report for a client or stakeholder. -->

# SEO Audit Report Template

A complete, fill-in-the-blank audit report template. Replace all `[BRACKETED]` placeholders
with actual findings. Do not delete sections - fill every section or explicitly mark as N/A.

---

# SEO Audit Report: [SITE NAME]

**Prepared by:** [Auditor Name / Team]
**Date:** [YYYY-MM-DD]
**Site URL:** [https://domain.com]
**Audit type:** [Full audit / Technical only / Content only / Pre-launch]
**Period covered:** [Date range of data used, e.g., GSC data Jan - Mar 2025]

---

## 1. Executive Summary

### Overall Score

| Metric | Value |
|---|---|
| Total checks | 35 |
| PASS | [N] |
| WARN | [N] |
| FAIL | [N] |
| N/A | [N] |
| **Overall score** | **[PASS count]/[35 - N/A count]** |

### Score interpretation

[Copy the appropriate line from the scoring guide:]
- 32-35 PASS: Excellent - monitor and maintain
- 26-31 PASS: Good - address WARNs before they become FAILs
- 18-25 PASS: Needs work - prioritize Critical and High items
- Under 18 PASS: Significant SEO debt - consider a full remediation project

### Top 3 findings

These are the most impactful issues discovered in this audit:

1. **[FINDING 1 - highest priority]** - [One sentence describing the issue and its impact.]
   Fix: [Brief description of the fix and which specialized skill to use.]

2. **[FINDING 2]** - [One sentence describing the issue and its impact.]
   Fix: [Brief description of the fix and which specialized skill to use.]

3. **[FINDING 3]** - [One sentence describing the issue and its impact.]
   Fix: [Brief description of the fix and which specialized skill to use.]

### Business impact statement

[2-4 sentences summarizing the expected organic traffic and revenue impact of the current
SEO issues. Be specific where data is available: "Based on GSC data, the 3 Critical issues
are estimated to be causing X% crawl inefficiency and affecting Y pages."]

---

## 2. Full Scorecard

### Section 1: Technical SEO

| # | Check | Status | Evidence / Details |
|---|---|---|---|
| T1 | Robots.txt configured correctly | [PASS/FAIL/WARN/N/A] | [What was found] |
| T2 | XML sitemap valid and submitted | | |
| T3 | Canonical URLs set on all pages | | |
| T4 | No redirect chains (max 1 hop) | | |
| T5 | HTTPS everywhere, no mixed content | | |
| T6 | Mobile-friendly | | |
| T7 | Core Web Vitals pass | | |
| T8 | No orphan pages | | |
| T9 | Clean URL structure | | |
| T10 | Rendering strategy appropriate | | |
| **Section score** | | | **[N] PASS / [N] WARN / [N] FAIL** |

### Section 2: On-Page SEO

| # | Check | Status | Evidence / Details |
|---|---|---|---|
| O1 | Unique title tags (50-60 chars) | | |
| O2 | Meta descriptions present (120-160 chars) | | |
| O3 | Single H1 per page with target keyword | | |
| O4 | Heading hierarchy correct | | |
| O5 | Image alt text present | | |
| O6 | Internal linking structure logical | | |
| O7 | Open Graph tags complete | | |
| O8 | Semantic HTML used | | |
| **Section score** | | | **[N] PASS / [N] WARN / [N] FAIL** |

### Section 3: Content SEO

| # | Check | Status | Evidence / Details |
|---|---|---|---|
| C1 | No thin content pages | | |
| C2 | No keyword cannibalization | | |
| C3 | Topic clusters defined | | |
| C4 | E-E-A-T signals present | | |
| C5 | Content freshness maintained | | |
| C6 | No duplicate content | | |
| C7 | Search intent alignment | | |
| **Section score** | | | **[N] PASS / [N] WARN / [N] FAIL** |

### Section 4: Off-Page SEO

| # | Check | Status | Evidence / Details |
|---|---|---|---|
| L1 | Backlink profile healthy | | |
| L2 | No toxic links | | |
| L3 | Anchor text diversity | | |
| L4 | Local SEO configured | | |
| L5 | Brand mentions and citations | | |
| **Section score** | | | **[N] PASS / [N] WARN / [N] FAIL** |

### Section 5: AEO & GEO Readiness

| # | Check | Status | Evidence / Details |
|---|---|---|---|
| A1 | Featured snippet optimization | | |
| A2 | FAQ / HowTo schema implemented | | |
| A3 | Content structured for AI extraction | | |
| A4 | Entity authority signals present | | |
| A5 | LLMs.txt present | | |
| **Section score** | | | **[N] PASS / [N] WARN / [N] FAIL** |

---

## 3. Detailed Findings

For each FAIL and WARN, provide a detailed entry. Group by priority level.

### Critical Priority (Fix Immediately)

---

#### [Check ID] - [Check Name]

**Status:** FAIL

**What was found:**
[Specific description of the issue. Include URLs, numbers, or screenshots where relevant.
E.g., "Robots.txt at https://domain.com/robots.txt contains `Disallow: /products/` which
blocks Googlebot from crawling the entire product catalog (approximately 1,200 URLs)."]

**Why it matters:**
[Business impact in plain language. E.g., "Google cannot crawl or index any product pages,
meaning they receive zero organic traffic from product keyword searches."]

**How to fix it:**
[Specific, actionable steps. E.g., "Remove the `Disallow: /products/` rule from robots.txt.
Replace with more targeted blocks for admin routes: `Disallow: /admin/` and `Disallow: /wp-login`.
After updating, use GSC URL Inspection to request re-crawl of key product pages."]

**Specialized skill:** `technical-seo`
**Estimated effort:** [Low / Medium / High]
**Estimated impact:** [Low / Medium / High / Critical]

---

[Repeat for each Critical finding]

### High Priority (Fix This Sprint)

---

#### [Check ID] - [Check Name]

**Status:** [FAIL / WARN]

**What was found:**
[...]

**Why it matters:**
[...]

**How to fix it:**
[...]

**Specialized skill:** [skill-name]
**Estimated effort:** [Low / Medium / High]
**Estimated impact:** [Low / Medium / High / Critical]

---

[Repeat for each High priority finding]

### Medium Priority (Fix This Quarter)

[Use the same entry format as above, but abbreviated descriptions are acceptable]

---

### Low Priority (Backlog)

[Use a table format for efficiency:]

| Check ID | Check Name | Status | Brief description | Skill |
|---|---|---|---|---|
| [O5] | Image alt text | WARN | [~50 images missing alt text on blog pages] | `on-site-seo` |
| ... | | | | |

---

## 4. Action Plan

### Week 1 - Critical Issues

| Task | Owner | Check ID | Skill |
|---|---|---|---|
| [Fix robots.txt to allow /products/] | [Developer] | T1 | `technical-seo` |
| [Submit sitemap to GSC] | [SEO/Dev] | T2 | `technical-seo` |
| [Resolve canonical loop on /blog/ pagination] | [Developer] | T3 | `technical-seo` |

### Month 1 - High Priority Issues

| Task | Owner | Check ID | Skill | Target date |
|---|---|---|---|---|
| [Fix Core Web Vitals on product template] | [Performance] | T7 | `core-web-vitals` | [Date] |
| [Fix duplicate title tags on category pages] | [SEO] | O1 | `on-site-seo` | [Date] |
| [Resolve cannibalization on [keyword]] | [Content] | C2 | `content-seo` | [Date] |

### Quarter 1 - Medium Priority Issues

| Task | Owner | Check ID | Skill | Target date |
|---|---|---|---|---|
| [Add author bios to all blog posts] | [Content] | C4 | `content-seo` | [Date] |
| [Implement FAQ schema on /faq/ page] | [Developer] | A2 | `schema-markup` | [Date] |
| [Build topic cluster for [primary topic]] | [Content] | C3 | `content-seo` | [Date] |

### Backlog - Low Priority

[List remaining low-priority tasks or link to the issue tracker where they are filed]

---

## 5. Appendix

### Tools Used in This Audit

| Tool | Purpose | Notes |
|---|---|---|
| Google Search Console | Crawl errors, index status, Core Web Vitals (field data), links | Free; requires site ownership verification |
| Screaming Frog SEO Spider | Full site crawl, title/meta/heading analysis, redirect detection | Free up to 500 URLs; paid license for larger sites |
| PageSpeed Insights | Core Web Vitals lab + field data per URL | Free; powered by Lighthouse + CrUX |
| Ahrefs Site Explorer | Backlink profile, referring domains, anchor text, toxic links | Paid subscription required |
| Semrush Site Audit | Comprehensive technical and content audit | Paid subscription; has a limited free tier |
| Google Rich Results Test | Schema markup validation | Free |
| SSL Labs | HTTPS certificate and configuration audit | Free |
| Siteliner | Internal duplicate content detection | Free up to 250 pages |
| BrightLocal | NAP consistency and local citation audit | Paid; free trial available |
| Google Mobile-Friendly Test | Mobile usability validation | Free |

### Re-Audit Schedule

| Audit type | Frequency | Next due date |
|---|---|---|
| Full 35-check audit | Quarterly | [Date + 90 days] |
| Quick 10-check health check | Monthly | [Date + 30 days] |
| Core Web Vitals spot check | Monthly | [Date + 30 days] |
| Backlink profile review | Monthly | [Date + 30 days] |

### GSC Access Required

Before the next audit, ensure the following GSC access is available:
- Performance report (last 3 months, all pages)
- Coverage report (indexed vs. not indexed breakdown)
- Core Web Vitals report (field data)
- Manual Actions report
- Sitemaps report (submitted sitemaps and last read dates)
- Links report (top linked pages and top linking sites)
