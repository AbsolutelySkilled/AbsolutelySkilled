# Technical SEO Deep Reference

## Crawl Budget Optimization

Crawl budget = crawl rate limit (server capacity) x crawl demand (freshness/importance).

### Signals That Increase Crawl Demand
- Frequent content updates (genuine changes, not cosmetic)
- High PageRank / many inbound links
- Fresh sitemap `<lastmod>` dates (only when content actually changed)
- URL submitted via Indexing API or URL Inspection tool

### Signals That Waste Crawl Budget
- Faceted navigation generating thousands of parameterized URLs
- Session IDs or tracking parameters in URLs
- Infinite scroll without paginated URLs
- Calendar widgets generating endless date URLs
- Soft 404s (200 status but error content)
- Redirect chains (3+ hops)
- Duplicate content accessible at multiple URLs

### Crawl Budget Audit Process
1. Download crawl stats from GSC (Settings > Crawl Stats)
2. Compare crawled URLs vs indexed URLs (Coverage report)
3. Identify gap: URLs crawled but not indexed = waste
4. Check server logs for Googlebot activity patterns
5. Fix: consolidate parameters, add canonical tags, block low-value paths in robots.txt

---

## Robots.txt Advanced Directives

```
# Standard structure
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /search?
Disallow: /*?sessionid=
Disallow: /tag/*  # if tag pages are thin

# AI crawlers (opt-in/opt-out)
User-agent: GPTBot
Allow: /blog/
Disallow: /proprietary/

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Disallow: /  # Blocks Gemini training, NOT Google Search

# Always allow CSS/JS for rendering
User-agent: *
Allow: /static/
Allow: /_next/
Allow: /assets/

Sitemap: https://example.com/sitemap.xml
```

### Common Mistakes
- `Disallow: /` on production (blocks entire site)
- Blocking `/api/` paths that serve rendered content
- Using `noindex` in robots.txt (not a valid directive, Google ignores it)
- Forgetting trailing wildcards: `Disallow: /search` blocks `/search` but not `/search?q=test` - use `Disallow: /search`
- Testing with wrong User-agent (Google only honors Googlebot-specific rules for Googlebot)

---

## Rendering Strategy Implementations

### Next.js SEO Setup

```tsx
// app/layout.tsx - Global metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: { default: 'Site Name', template: '%s | Site Name' },
  description: 'Site description',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'Site Name' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

// app/blog/[slug]/page.tsx - Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
    alternates: { canonical: `/blog/${params.slug}` },
  }
}
```

### Nuxt SEO Setup

```vue
<!-- pages/blog/[slug].vue -->
<script setup>
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

useSeoMeta({
  title: post.value.title,
  description: post.value.excerpt,
  ogTitle: post.value.title,
  ogDescription: post.value.excerpt,
  ogImage: post.value.image,
})

useHead({
  link: [{ rel: 'canonical', href: `https://example.com/blog/${route.params.slug}` }],
})
</script>
```

### Astro SEO Setup

```astro
---
// src/layouts/Base.astro
const { title, description, canonical, image } = Astro.props
---
<html>
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical || Astro.url.href} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {image && <meta property="og:image" content={image} />}
</head>
<body><slot /></body>
</html>
```

---

## JavaScript SEO

### Critical Rules

1. **Google renders JavaScript** but with delays (seconds to weeks). Critical content in JS may be indexed late.
2. **Other search engines** (Bing, Yandex) have limited JS rendering. SSR/SSG is safer for multi-engine visibility.
3. **AI crawlers do NOT execute JavaScript**. Content only in client-side JS is invisible to ChatGPT, Perplexity, Claude.
4. **Canonical conflicts**: If raw HTML differs from JS-injected canonical, Google may use EITHER. Keep them identical.
5. **noindex + JavaScript**: If raw HTML has noindex but JS removes it, Google MAY still honor the raw HTML noindex.
6. **Structured data timing**: Schema injected via JS faces delayed processing. Include in server-rendered HTML.

### Debugging JS Rendering Issues

```bash
# Compare raw HTML vs rendered HTML
curl -sL "URL" > /tmp/raw.html
# Use Chrome: chrome://inspect -> Network conditions -> Googlebot UA
# Or use Google's URL Inspection tool "View Tested Page" -> compare HTML

# Check if content is in raw HTML
curl -sL "URL" | grep -c "target content phrase"
# If 0, content is JS-rendered only
```

---

## Redirect Audit Patterns

### Chain Detection

```bash
# Follow redirect chain and show each hop
curl -sIL "URL" 2>&1 | grep -E "^(HTTP/|location:)" -i

# Expected: single 301 -> 200
# Problem: 301 -> 301 -> 301 -> 200 (chain)
# Problem: 301 -> 302 -> 200 (mixed, breaks PageRank transfer)
```

### Common Redirect Issues

| Issue | Impact | Fix |
|-------|--------|-----|
| Chain (3+ hops) | PageRank loss (~15%/hop), crawl waste | Collapse to single 301 |
| Loop (A -> B -> A) | Page inaccessible, crawl trap | Fix destination |
| Mixed 301/302 | 302 does not pass full PageRank | Change to 301 if permanent |
| HTTP -> HTTPS -> www | Two-hop chain | Direct HTTP to final HTTPS+www |
| Redirect to soft 404 | Wastes crawl budget | 301 to real content or return 410 |

---

## URL Parameter Handling

### Faceted Navigation Strategy

| Parameter type | Example | Action |
|---------------|---------|--------|
| Sort order | `?sort=price-asc` | Canonical to base URL |
| Pagination | `?page=2` | Self-canonical, NOT canonical to page 1 |
| Filter (low volume) | `?color=red` | Canonical to base URL or noindex |
| Filter (high volume) | `?brand=nike` | Allow indexing if search demand exists |
| Session/tracking | `?utm_source=email` | Canonical to clean URL |
| Search results | `?q=keyword` | noindex, follow |

---

## Sitemap Index Pattern

For sites with 50,000+ URLs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2026-03-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-blog.xml</loc>
    <lastmod>2026-03-28</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
    <lastmod>2026-04-01</lastmod>
  </sitemap>
</sitemapindex>
```

Rules:
- Max 50,000 URLs per child sitemap
- Max 50MB uncompressed per file
- `<lastmod>` must be W3C datetime format
- Only include canonical, indexable URLs (no noindex, no redirects, no 404s)
- Gzip compression recommended for large sitemaps
- Submit sitemap URL in robots.txt AND Google Search Console

---

## Orphan Page Detection

Orphan pages have no internal links pointing to them. They rely solely on sitemap discovery.

```bash
# Extract all internal links from a page
curl -sL "URL" | grep -oP 'href="(/[^"]*)"' | sort -u

# Compare sitemap URLs vs internally linked URLs
# URLs in sitemap but not linked = potential orphans
```

Fix: Add internal links from relevant parent/sibling pages. If the page has no logical parent, consider whether it should exist.

---

## IndexNow Protocol

Instant URL submission for Bing, Yandex, Naver, Seznam (NOT Google - Google only uses sitemaps and URL Inspection).

```bash
# Submit URL via IndexNow
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{"host":"example.com","key":"YOUR_KEY","urlList":["https://example.com/new-page"]}'
```

- Generate key file at `https://example.com/YOUR_KEY.txt` containing the key
- Submit up to 10,000 URLs per request
- Supported by: Bing, Yandex, Naver, Seznam, Yep
- Useful for: new content, updated content, deleted content (pair with 410 status)

---

## Tooling Updates (2025-2026)

- **Lighthouse 13.0** (Oct 2025): Major audit restructuring with reorganized performance categories
- **CrUX Vis** replaced CrUX Dashboard (Nov 2025)
- **LCP subparts** added to CrUX (Feb 2025): TTFB + Resource Load Delay + Resource Load Time + Element Render Delay
- **round_trip_time** replaced effectiveConnectionType in CrUX (Feb 2025)
- **Google Search Console 2025**: AI-powered configuration, branded vs non-branded filter, hourly API data, custom annotations
- **Content API for Shopping sunsets August 18, 2026** - migrate to Merchant API

---

## Mobile-First Indexing

Since July 5, 2024, Google uses 100% mobile-first indexing. ALL sites crawled with mobile Googlebot exclusively. Desktop-only content is invisible to Google.

**Checklist**:
- [ ] Same content on mobile and desktop (no hidden content on mobile)
- [ ] Same structured data on mobile and desktop
- [ ] Same meta tags (title, description, robots) on mobile
- [ ] Responsive design or dynamic serving (not separate mobile URLs if possible)
- [ ] Touch targets >= 48x48px
- [ ] No horizontal scrolling
- [ ] Text readable without zooming (>=16px base font)
