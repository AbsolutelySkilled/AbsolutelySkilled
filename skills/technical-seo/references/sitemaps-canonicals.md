<!-- Part of the Technical SEO AbsolutelySkilled skill. Load this file when implementing sitemaps, resolving canonical URL issues, handling URL variants, or configuring hreflang. -->

# Sitemaps and Canonical URLs Reference

Detailed implementation guide for XML sitemaps and canonical URL strategy. These
two mechanisms work together to tell search engines which URLs are authoritative
and how often to re-crawl them.

---

## 1. XML Sitemap Specification

### Structure and limits

| Constraint | Value |
|---|---|
| Max URLs per sitemap file | 50,000 |
| Max file size (uncompressed) | 50 MB |
| Max file size (compressed, .gz) | 50 MB |
| Max sitemaps in a sitemap index | 50,000 |
| Max total URLs across all sitemaps | 2.5 billion (50,000 x 50,000) |

In practice: compress all sitemaps with gzip. A 50 MB uncompressed sitemap
compresses to ~5 MB and is fetched much faster.

### Full URL element attributes

```xml
<url>
  <!-- Required -->
  <loc>https://example.com/products/widget</loc>

  <!-- Optional: date of last meaningful content change, ISO 8601 -->
  <lastmod>2024-01-15</lastmod>

  <!-- Optional: hint for recrawl frequency (Google largely ignores this) -->
  <changefreq>weekly</changefreq>

  <!-- Optional: relative importance 0.0-1.0 (Google largely ignores this) -->
  <priority>0.8</priority>
</url>
```

`changefreq` and `priority` are hints only. Google's crawl scheduling is based
primarily on its own signals. Spend time on accurate `lastmod` instead.

### lastmod accuracy rules

**Always update lastmod when**: Title changes, body content substantially changes,
main image changes, structured data changes.

**Do NOT update lastmod when**: Template/CSS/JS changes that do not affect page
content, sidebar changes that appear on all pages, navigation updates.

**Why accuracy matters**: Googlebot tracks whether your `lastmod` values correlate
with actual content changes. If you always set `lastmod` to today's date, Googlebot
learns to ignore it. If it accurately reflects real changes, Googlebot uses it to
prioritize recrawls.

### Sitemap index for large sites

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Group by content type for easier monitoring -->
  <sitemap>
    <loc>https://example.com/sitemaps/products-1.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemaps/products-2.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemaps/blog.xml</loc>
    <lastmod>2024-01-14</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemaps/categories.xml</loc>
    <lastmod>2024-01-01</lastmod>
  </sitemap>

</sitemapindex>
```

Group sitemaps by content type, not just by size. This lets you monitor indexing
rates per content type in Search Console.

### What to include (and exclude) from sitemaps

**Include:**
- All canonical, indexable URLs (returning 200 with real content)
- URLs you actively want Google to discover and crawl

**Exclude:**
- URLs with `noindex` directive (contradictory signal)
- URLs that redirect (include only the final destination)
- Paginated pages beyond page 1 in most cases
- Faceted navigation URLs you want to noindex
- Duplicate content URLs (include only the canonical form)
- Parameter variants (include only the clean URL)

Including non-canonical URLs in your sitemap is a strong anti-pattern. It confuses
Googlebot about which version is authoritative.

### Submission methods

1. **robots.txt** (recommended - always active):
   ```
   Sitemap: https://example.com/sitemap.xml
   Sitemap: https://example.com/sitemap-index.xml
   ```

2. **Google Search Console** - Submit via Sitemaps report. Best for initial
   submission and monitoring indexing rates per sitemap file.

3. **HTTP ping** (legacy, still works):
   ```
   https://www.google.com/ping?sitemap=https://example.com/sitemap.xml
   ```
   Google deprecated this in 2023 - use Search Console instead.

### Dynamic sitemap generation (Next.js example)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts(); // fetch from CMS/DB

  const productUrls = products.map((product) => ({
    url: `https://example.com/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productUrls,
  ];
}
```

For very large catalogs (100k+ pages), generate sitemaps statically during build
or on a scheduled job rather than dynamically on each request. Dynamic generation
under load can become a bottleneck.

---

## 2. Canonical URL Rules

The canonical URL is the "master" URL for a piece of content. All ranking signals
(links, crawl frequency, page experience data) accumulate on the canonical URL.

### The canonical signal hierarchy

Google uses multiple signals to determine the canonical. In order of weight:

1. **301 redirect** - Strongest signal. URL A redirects to URL B = B is canonical.
2. **`<link rel="canonical">` tag** - Strong hint. Not a directive - Google may
   override it if the canonical seems wrong.
3. **Sitemap inclusion** - Weak hint. Being in the sitemap suggests a URL is canonical.
4. **Internal links** - Weak hint. The URL you link to most often is treated as canonical.

If these signals conflict, Google picks what it considers the most reliable signal,
which may differ from your intent.

### Self-referencing canonicals

Every page should declare a self-referencing canonical, even if there is no
duplicate content risk. This is defensive practice:

```html
<!-- On https://example.com/products/widget -->
<link rel="canonical" href="https://example.com/products/widget" />

<!-- On https://example.com/blog/post-title -->
<link rel="canonical" href="https://example.com/blog/post-title" />
```

### URL variants that require canonical handling

Every site has implicit URL variants. You must pick one form and consistently
canonicalize all others to it:

| Variant type | Examples | Pick one form |
|---|---|---|
| Protocol | `http://` vs `https://` | Always HTTPS |
| Subdomain | `www.example.com` vs `example.com` | Pick one, 301 the other |
| Trailing slash | `/products/widget/` vs `/products/widget` | Pick one, be consistent |
| Query parameters | `?ref=footer` vs clean URL | Clean URL is canonical |
| Capitalization | `/Products/Widget` vs `/products/widget` | Lowercase, enforce at server |
| Index files | `/about/index.html` vs `/about/` | Remove index.html from URLs |
| Fragment | `/page#section` vs `/page` | Fragment is same canonical as `/page` |

### Cross-domain canonicals

For content syndicated or duplicated across domains:

```html
<!-- On https://partner.com/article/original-content -->
<!-- If the original lives on example.com, declare: -->
<link rel="canonical" href="https://example.com/article/original-content" />
```

Cross-domain canonicals tell Google to attribute all signals to the original domain.
Use this for:
- Syndicated content (press releases, guest posts)
- AMP pages canonicaling to regular pages
- Country-specific domains that share content with the main domain

### Common canonical mistakes

**Canonical chain**: A -> B -> C
```html
<!-- Page A -->
<link rel="canonical" href="https://example.com/page-b" />

<!-- Page B -->
<link rel="canonical" href="https://example.com/page-c" />
```
Google may follow the chain or stop at B. Always canonical directly to the final URL.

**Canonical to a redirect**:
```html
<!-- Canonicaling to a URL that itself 301s to somewhere else -->
<link rel="canonical" href="https://example.com/old-page" />
<!-- old-page 301s to /new-page -->
```
The canonical should point to the final destination, not an intermediate redirect.

**Canonical to a noindex page**:
```html
<!-- Canonicaling to a page that has noindex -->
<link rel="canonical" href="https://example.com/noindex-page" />
```
Contradictory signals. If the canonical is noindexed, the current page will also
not be indexed.

**Inconsistent canonical with 301**:
```
<!-- URL A 301 redirects to URL C -->
<!-- But URL B has <link rel="canonical" href="URL A"> -->
<!-- Google sees: B -> canonical -> A -> redirect -> C -->
```
Always align redirects and canonical tags to point to the same final URL.

---

## 3. Pagination Handling

### Modern approach (preferred): Self-canonical per page

Each paginated page is canonicalized to itself. This is the current Google recommendation.
The deprecated `rel="prev"` and `rel="next"` pattern is no longer officially supported.

```html
<!-- /products?page=1 -->
<link rel="canonical" href="https://example.com/products" />

<!-- /products?page=2 -->
<link rel="canonical" href="https://example.com/products?page=2" />

<!-- /products?page=3 -->
<link rel="canonical" href="https://example.com/products?page=3" />
```

Only canonical page 2+ to page 1 if they contain identical or near-identical content.
If each page has 20 unique products, each page has distinct value and should be
self-canonical.

### When to noindex paginated pages

Noindex paginated pages when:
- Pages beyond 2-3 receive no organic traffic
- Content is highly similar across pages
- You need to conserve crawl budget

Do NOT noindex page 1 or pages that rank for head terms.

---

## 4. hreflang and Canonicals Interaction

hreflang tells Google which language/region variant to serve to which users.
It interacts with canonicals and must be consistent.

### Correct hreflang setup

```html
<!-- On https://example.com/en/products/widget (English, US) -->
<link rel="alternate" hreflang="en-US" href="https://example.com/en/products/widget" />
<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/products/widget" />
<link rel="alternate" hreflang="de" href="https://example.com/de/products/widget" />
<link rel="alternate" hreflang="x-default" href="https://example.com/products/widget" />
<link rel="canonical" href="https://example.com/en/products/widget" />
```

Rules for hreflang:
- All language variants must reference all other language variants (reciprocal)
- hreflang does not change the canonical - each language page canonicals to itself
- Do not canonical an FR page to an EN page (that removes the FR page from index)
- `x-default` is the fallback for users who don't match any specific language

### Common hreflang failure

```html
<!-- WRONG: FR page canonicaling to EN canonical -->
<!-- On /fr/products/widget: -->
<link rel="canonical" href="https://example.com/en/products/widget" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/products/widget" />
```

This tells Google "this FR page is a duplicate of the EN page" and the FR page
will not be indexed for French users. Each locale page should be self-canonical.

### hreflang in XML sitemaps

For large multilingual sites, managing hreflang in sitemaps is more maintainable
than per-page HTML tags:

```xml
<url>
  <loc>https://example.com/en/products/widget</loc>
  <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en/products/widget"/>
  <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/products/widget"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/products/widget"/>
</url>
```

Add `xmlns:xhtml="http://www.w3.org/1999/xhtml"` to the `<urlset>` opening tag.

---

## 5. Canonical Validation Checklist

Before deploying canonical changes:

- [ ] All canonical tags point to absolute URLs (including protocol)
- [ ] Canonical target returns HTTP 200
- [ ] Canonical target is not itself noindexed
- [ ] Canonical target does not redirect elsewhere
- [ ] Canonical tag is in the `<head>`, not `<body>`
- [ ] Only one canonical tag per page (duplicate canonicals are ignored)
- [ ] Canonical URL form is consistent with your chosen URL standard (www/non-www, trailing slash)
- [ ] Sitemap URLs match their declared canonical URLs exactly
- [ ] hreflang alternate URLs match the canonical URL for that locale (not a different locale's canonical)
- [ ] No canonical loops (A -> B -> A)
