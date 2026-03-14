<!-- Part of the ecommerce-seo AbsolutelySkilled skill. Load this file when
     working with faceted navigation, product filters, URL parameter handling,
     crawl budget management, or noindex/canonical strategies for filter pages. -->

# Faceted Navigation Reference

Faceted navigation is the single largest technical SEO challenge in e-commerce. This
reference explains the problem, quantifies the impact, and provides concrete solutions
with implementation code for each approach.

---

## 1. The Faceted Navigation Problem

### What is faceted navigation?

Faceted navigation lets users refine product listings by filtering on multiple attributes
simultaneously. A typical clothing store might offer filters for:
- Brand (Nike, Adidas, Puma)
- Color (Black, White, Red, Blue, Green)
- Size (XS, S, M, L, XL, XXL)
- Price range ($0-50, $50-100, $100-200, $200+)
- Rating (4+ stars)

Each filter combination typically generates a unique URL. The combinatorial math is
brutal:

```
3 brands x 5 colors x 6 sizes x 4 price ranges x 2 ratings
= 720 URL combinations from a single category page
```

A store with 50 categories, each with comparable filter dimensionality, could generate
**36,000+ URLs** from facets alone - for a catalog of 5,000 actual products.

### Why this is an SEO problem

1. **Crawl budget exhaustion**: Googlebot allocates a crawl budget per domain based on
   site size, authority, and crawl health. If 80% of crawlable URLs are low-value filter
   pages, Googlebot never reaches new or updated product pages.

2. **Duplicate content**: `/womens/boots?color=black&size=8` and
   `/womens/boots?size=8&color=black` show identical products. So do
   `/womens/boots?sort=price_asc` and `/womens/boots?sort=price_desc` for small categories.

3. **Thin pages**: A filter for size 14 in a category with 3 products matching produces
   a page with very little content. Scaled across thousands of filter combinations, this
   generates a mass of thin pages.

4. **Diluted PageRank**: Internal links spread PageRank across all indexed URLs. Thousands
   of thin filter pages dilute the equity flowing to the high-value category and product pages.

---

## 2. Measuring the Problem

Before choosing a solution, measure the extent of crawl waste.

### Using Google Search Console

1. Go to **Index Coverage** > filter by "Crawled - currently not indexed"
2. Look for URL patterns matching filter parameters (`?color=`, `?sort=`, `?size=`)
3. Check **Crawl Stats** to see how many URLs Googlebot crawled in the last 90 days

### Using log file analysis

If you have access to server access logs:
```bash
# Count crawl requests per URL pattern (simplified)
grep -i "googlebot" access.log | grep "GET" | \
  awk '{print $7}' | \
  grep -E "\?(color|size|sort|brand)=" | \
  wc -l
```

Compare filter page crawls against total crawls to quantify crawl budget waste.

### Using a crawler (Screaming Frog, Sitebulb)

Crawl the site with "Follow all links" enabled. Export URL list and count URLs matching
filter parameter patterns. Compare against number of unique product pages.

---

## 3. Solutions

### Option A: robots.txt Disallow

Block Googlebot from crawling filter URLs entirely using `robots.txt`.

```
User-agent: Googlebot
Disallow: /*?color=
Disallow: /*?size=
Disallow: /*?sort=
Disallow: /*?brand=
Disallow: /*?page=
```

**When to use:**
- All filtered combinations have zero organic search demand
- You want zero crawl budget spent on these URLs
- The filter combinations are pure UX features, not SEO assets

**Trade-offs:**
- No PageRank flows through these URLs to linked pages (since Googlebot never crawls them)
- Google cannot see the content of filtered pages (acceptable if you don't want them indexed)
- Must be combined with clean pagination strategy (see `category-pagination.md`)

**Wildcard syntax note**: `robots.txt` supports `*` wildcards. `Disallow: /*?color=` blocks
any URL containing `?color=` regardless of path prefix.

### Option B: noindex, follow Meta Tag

Allow Googlebot to crawl filter pages (to follow links and pass PageRank) but instruct it
not to index them.

```html
<!-- Add to <head> on filtered pages only, not on base category pages -->
<meta name="robots" content="noindex, follow">
```

**When to use:**
- Filter combinations have no search demand and should not appear in search results
- You want Googlebot to follow internal links on filtered pages (e.g., links to products)
- You need a softer approach than `robots.txt` blocking

**Implementation: dynamic insertion**

```javascript
// Pseudo-code: inject noindex on server-side render
function getMetaRobots(url) {
  const params = new URL(url).searchParams;
  const filterParams = ['color', 'size', 'sort', 'brand', 'rating'];
  const hasFilters = filterParams.some(p => params.has(p));

  if (hasFilters) {
    return 'noindex, follow';
  }
  return 'index, follow'; // default for base category and paginated pages
}
```

**Trade-offs:**
- Googlebot still crawls these pages (consuming crawl budget slightly)
- PageRank flows through links on the page
- More gradual deindexing - Google may continue showing these in index for weeks

### Option C: Canonical Tag Consolidation

Use the `rel="canonical"` tag to tell Google which URL is the "master" version of a set
of near-duplicate filtered pages.

```html
<!-- On /womens/boots?color=black&size=8 -->
<link rel="canonical" href="https://example.com/womens/boots">

<!-- On /womens/boots?sort=price_asc -->
<link rel="canonical" href="https://example.com/womens/boots">
```

**When to use:**
- Filter combinations may have thin organic demand but you're unsure
- You want to consolidate PageRank into the base category URL
- You need a fallback for parameter combinations you didn't predict

**Implementation: canonical should be absolute URL, not relative**

```html
<!-- GOOD -->
<link rel="canonical" href="https://www.example.com/womens/boots">

<!-- BAD - relative canonical can cause errors if crawled from a filtered URL -->
<link rel="canonical" href="/womens/boots">
```

**Trade-offs:**
- Google treats canonical as a hint, not a directive - it may choose to ignore it
- Does not prevent crawling (Googlebot will still crawl canonicalled pages)
- Works well combined with `noindex, follow` for belt-and-suspenders approach

### Option D: AJAX/JavaScript-Only Filtering

Filter results without generating new URLs. The URL stays at `/womens/boots` regardless
of what filters are selected. Filter state is managed in JavaScript only.

```javascript
// Filter updates product list via fetch/XHR, URL does not change
document.getElementById('filter-color').addEventListener('change', async (e) => {
  const products = await fetch(`/api/products?category=boots&color=${e.target.value}`);
  updateProductGrid(await products.json());
  // URL is NOT updated - intentional
});
```

**When to use:**
- All filtering is purely a UX feature with no SEO intent
- You have a large number of filter dimensions and all combinations are thin
- You're building a new store and can design the architecture from scratch

**Trade-offs:**
- Eliminates the crawl problem entirely - no filter URLs exist
- Users cannot share filtered results via URL (major UX trade-off)
- You give up any possibility of indexing filter combinations even if some have demand

### Option E: Selective Indexing for High-Value Combinations

For filters that do have real organic search demand (e.g., "Nike running shoes", "black
leather boots"), allow specific combinations to be indexed while blocking the rest.

**Identifying high-value combinations:**
1. Export all filter combination URLs from your faceted nav log
2. Run them through a keyword research tool or Google Keyword Planner
3. Filter for combinations with >100 monthly searches
4. These are candidates for selective indexing

**Implementation:**

For high-value combinations, create clean URLs (not parameter-based):
```
/womens/boots/black/          <- "black women's boots" - indexed
/womens/boots/leather/        <- "women's leather boots" - indexed
/brands/nike/running-shoes/   <- "Nike running shoes" - indexed
```

For all other filter combinations, apply `noindex, follow` or canonical.

**Optimization of selectively indexed filter pages:**
- Add unique introductory copy (100-150 words specific to the filter combination)
- Ensure title tag reflects the filtered query: "Black Women's Boots | Store"
- Do NOT just show the same category page intro with different products

---

## 4. URL Parameter Handling in Google Search Console

Google Search Console has a legacy "URL Parameters" tool (available via Settings >
Crawl > URL Parameters in some accounts). However, Google has discouraged its use and
it does not work for all sites.

Preferred approach in 2024: use `robots.txt`, `noindex`, or canonicals as described
above. Do not rely on the URL Parameters tool as a primary strategy.

### Handling parameter order canonicalization

The same filter combination can appear in different parameter orders:
```
/boots?color=black&size=8
/boots?size=8&color=black
```

These are technically different URLs but render identical content. Solutions:
1. Normalize parameter order server-side before responding (alphabetical sort)
2. Apply canonical on both pages pointing to the normalized version
3. Use `robots.txt` or `noindex` to prevent both from being indexed

```python
# Server-side parameter normalization (Python/Django example)
from urllib.parse import urlencode, urlparse, parse_qs

def normalize_url_params(url):
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    sorted_params = urlencode(sorted(params.items()), doseq=True)
    return parsed._replace(query=sorted_params).geturl()
```

---

## 5. Pre-rendered Filter Pages for High-Value Combinations

When a filtered combination has real search demand and enough products to justify
a full page, create a pre-rendered landing page:

```
/womens/black-boots/      <- dedicated landing page, not a filter URL
```

Requirements for this to work:
- At least 12-20 products matching the combination (otherwise thin)
- Unique introductory copy written specifically for this query
- Proper breadcrumb: Home > Women's > Boots > Black Boots
- `noindex` on the original filter URL (`/womens/boots?color=black`)
- Canonical on the landing page pointing to itself

This approach is most used for high-value attribute combinations that generate clear
organic traffic patterns (verified in Search Console).

---

## 6. Decision Framework

```
For each filter dimension, ask:
  |
  +-- Does filtering by this attribute produce queries with search volume?
  |     (e.g., "red dresses", "Nike shoes", "waterproof jackets")
  |
  |     YES -> Selective indexing (Option E) or dedicated landing pages
  |
  +-- Does Googlebot crawl these URLs frequently but never index them?
  |
  |     YES -> robots.txt Disallow (Option A) to reclaim crawl budget
  |
  +-- Do filtered pages contain internal links to products you want indexed?
  |
  |     YES -> noindex, follow (Option B) to allow PageRank flow
  |
  +-- Are you unsure and want a safe default?
  |
        YES -> Canonical to base category (Option C) + noindex, follow (Option B)
```

---

## 7. Common Faceted Navigation Mistakes

| Mistake | Impact | Fix |
|---|---|---|
| No crawl control strategy at all | Millions of thin pages indexed, crawl budget wasted | Audit and implement noindex/canonical/robots.txt per dimension |
| Blocking with robots.txt then expecting PageRank flow | PageRank does not flow through Disallowed URLs | Use noindex+follow instead when internal link value matters |
| Canonical pointing to wrong URL (relative vs absolute) | Canonical may be misinterpreted by Googlebot | Always use absolute URLs in canonicals |
| Applying noindex to base category pages by mistake | Category page disappears from index | Verify that noindex logic only activates when `params` exist |
| Different filter orders creating duplicate content | Google may index both or neither | Normalize parameter order server-side |
| Inconsistent canonical (page sometimes canonical to self, sometimes to category) | Confuses Googlebot, may result in wrong URL being indexed | Make canonical logic deterministic and test with URL Inspection |
