<!-- Part of the Technical SEO AbsolutelySkilled skill. Load this file when diagnosing crawl budget issues, investigating Googlebot behavior, or auditing internal linking for crawlability. -->

# Crawlability and Indexing Reference

Deep reference for ensuring Googlebot can discover, crawl, and index your pages
efficiently. Covers crawl budget mechanics, log file analysis, orphan page detection,
internal linking strategy, and the index coverage pipeline.

---

## 1. Googlebot Behavior

### How Googlebot discovers URLs

1. **Sitemap submission** via Search Console or `Sitemap:` directive in robots.txt
2. **Following links** from already-crawled pages (internal and external)
3. **Submitted URLs** via URL Inspection tool in Search Console
4. **DNS records and link graphs** maintained internally

Googlebot does not crawl pages it cannot reach via links or sitemaps. An isolated
page - reachable only via direct URL entry - is an orphan and will likely not be
discovered or re-crawled.

### Crawl frequency signals

Googlebot adjusts crawl frequency based on:

| Signal | Effect |
|---|---|
| High-quality inbound links to the page | Increases crawl priority |
| Accurate `lastmod` in sitemap | Influences recrawl scheduling |
| Fast server response time | Allows more crawls within same rate limit |
| Consistent 200 status (not flapping) | Builds crawl confidence |
| Fresh content on recrawl | Increases future crawl frequency |
| 5xx errors on crawl | Reduces crawl rate; Google backs off |

### Crawl rate vs crawl demand

**Crawl rate**: How fast Googlebot is allowed to crawl. Controlled by server response
speed and the crawl rate setting (adjustable in Search Console, though rarely needed).
Google auto-adjusts to avoid overloading your server.

**Crawl demand**: How much Google wants to crawl your site. Driven by page popularity,
freshness signals, and link graph centrality. You influence demand by improving content
quality and earning links.

**Crawl budget** = effective crawls per day = min(crawl rate, crawl demand).

You cannot directly set crawl budget. You influence it by:
- Removing low-value URLs from the crawl frontier
- Improving server response speed
- Ensuring crawled pages return 200 with real content
- Building internal links to important pages

---

## 2. Crawl Budget Optimization

### Identify URL budget waste

Common sources of wasted crawl budget:

| Source | Volume | Fix |
|---|---|---|
| Faceted navigation permutations | Can be millions | Canonicals + robots.txt disallow |
| Paginated URLs beyond page 2-3 | Grows with content | Noindex or remove from sitemap |
| Session IDs in URLs | Per-visitor | Block in robots.txt |
| Tracking parameters | Per-campaign | Canonical to clean URL |
| Duplicate content with/without trailing slash | 2x all URLs | 301 redirect to canonical form |
| Legacy redirect targets still in sitemap | Each wastes a hop | Update sitemap to final URLs |
| Soft 404 pages | Crawled but wasted | Fix to return 404/410 or real content |
| Infinite scroll / calendar archives | Unbounded URL space | Pagination with disallow or noindex |

### Crawl budget audit checklist

```
1. Pull log file data (see section 3 below)
2. Count unique URLs Googlebot fetched in the last 30 days
3. What % returned 200? Non-200 is wasted budget.
4. What % are canonical? Non-canonical crawls waste budget.
5. What % have noindex? These should ideally not be crawled.
6. Identify top 20 URL templates by volume - are these all valuable?
7. Check robots.txt is not accidentally allowing junk URLs
8. Check sitemap only contains canonical 200 pages
```

### Prioritizing pages for crawl

Internal linking is the most powerful lever for influencing crawl priority.
Pages with more internal links get crawled more often. Structure your internal
linking to concentrate crawls on:

1. High-value landing pages (highest revenue/conversion intent)
2. Recently updated content (freshness signals)
3. Newly published content (discovery)
4. Deep pages in large catalogs

Deprioritize by removing internal links from:
- Thin pages with low-value content
- Near-duplicate pages
- Paginated pages beyond first 1-2 pages

---

## 3. Log File Analysis

Server access logs are the ground truth for what Googlebot actually crawled.
More reliable than Search Console for diagnosing crawl issues.

### Extract Googlebot requests from logs

```bash
# Apache/Nginx combined log format
grep "Googlebot" /var/log/nginx/access.log | \
  grep -v "AdsBot\|APIs-Google\|Mediapartners" > googlebot.log

# Count requests by URL pattern
awk '{print $7}' googlebot.log | \
  sed 's/?.*$//' | \
  sort | uniq -c | sort -rn | head 50

# Count by status code
awk '{print $9}' googlebot.log | sort | uniq -c | sort -rn

# Find most crawled URLs in last 7 days
grep "$(date -d '7 days ago' '+%d/%b/%Y')" googlebot.log | \
  awk '{print $7}' | sort | uniq -c | sort -rn | head 100
```

### Key metrics to compute from logs

| Metric | Formula | Target |
|---|---|---|
| Crawl efficiency | 200 responses / total requests | >90% |
| Canonical ratio | canonical-URL requests / total requests | >85% |
| Noindex crawl waste | noindex page requests / total requests | <5% |
| Redirect ratio | 3xx responses / total requests | <5% |
| Error ratio | 4xx + 5xx responses / total requests | <1% |

### Identify unexpected Googlebot behavior

```bash
# Find URLs Googlebot crawled that are NOT in your sitemap
# (potential orphan pages or leaked URLs)
comm -23 \
  <(awk '{print $7}' googlebot.log | sed 's/?.*$//' | sort -u) \
  <(grep "<loc>" sitemap.xml | sed 's/.*<loc>//;s/<\/loc>//' | sort -u)

# Find sitemap URLs that Googlebot has NOT crawled in 30 days
# (potential crawl budget or discovery issue)
comm -23 \
  <(grep "<loc>" sitemap.xml | sed 's/.*<loc>//;s/<\/loc>//' | sort -u) \
  <(awk '{print $7}' googlebot.log | sed 's/?.*$//' | sort -u)
```

---

## 4. Orphan Page Detection

Orphan pages are indexed pages with no internal links pointing to them. They receive
no crawl signal from the internal link graph and may drop out of the index.

### Detection methods

**Method 1: Crawl your site, then compare to Search Console**

```bash
# Crawl site with Screaming Frog or similar to get all internally linked URLs
# Export from Search Console: all indexed URLs
# Compare:
comm -13 <(sort crawled-internal-links.txt) <(sort search-console-indexed.txt)
# Lines appearing only in Search Console = orphan candidates
```

**Method 2: Compare sitemap to crawl**

Pages in your sitemap that are not discovered via internal link crawl are likely
orphaned - they exist and are submitted, but nothing links to them.

### Fixing orphan pages

Priority fix order:
1. Add internal links from high-crawl-frequency pages (homepage, category pages)
2. Add to a site-wide feature (footer links, related content, breadcrumbs)
3. If the page has no value, remove it and 410 the URL
4. If the page has value but no natural fit, add to XML sitemap (minimum signal)

---

## 5. Internal Linking for Crawlability

Internal links are how crawl budget propagates through your site. Think of it like
PageRank - pages with more internal links get more crawl budget allocated.

### Link architecture principles

**Flat is better than deep**: A page 6 clicks from the homepage will be crawled
much less frequently than a page 2 clicks away. Keep important pages within 3 clicks
of the homepage.

**Crawl depth chart:**

| Depth from homepage | Relative crawl frequency |
|---|---|
| 1 (homepage links) | Very high |
| 2 | High |
| 3 | Medium |
| 4 | Low |
| 5+ | Very low - potential orphan risk |

### High-leverage internal link placements

| Placement | Why effective |
|---|---|
| Homepage | Highest crawl frequency, passes max crawl signal |
| Global navigation | Appears on every page, strong signal |
| Breadcrumbs | Systematic coverage of category hierarchy |
| Contextual body links | Strongest quality signal (topically related) |
| Sitelinks / footer | Network coverage, ensures every page is reachable |
| "Related content" modules | Connects content clusters |

### Common internal linking failures

- **JavaScript-only links**: Links that exist only in JS event handlers or are
  injected by JS after page load may not be followed. Use `<a href="">` tags.
- **Nofollow internal links**: `rel="nofollow"` on internal links wastes crawl budget
  allocation. Reserve nofollow for external links you don't want to vouch for.
- **Links in iframes**: Googlebot may not follow links inside iframes.
- **Links behind forms or auth**: Googlebot cannot submit forms or authenticate.
  Any page requiring form submission to reach is effectively unreachable.

---

## 6. Soft 404 Handling

A soft 404 is a page that returns HTTP 200 but contains content indicating the page
does not exist (empty search results, "product not found", etc.). Google detects
these and treats them poorly.

### Detection

In Google Search Console, soft 404s appear under Index Coverage > "Crawled - not
currently indexed" with the reason "Soft 404". Also detectable in log analysis:
URLs returning 200 with very short response body size.

### Fix strategies

| Scenario | Fix |
|---|---|
| Out-of-stock product page | Keep page, show alternatives. Do not soft 404. |
| Discontinued product, no alternative | Return 404 or 410, or 301 to category |
| Empty search results page | Noindex via meta tag, or 200 with good content |
| User profile that no longer exists | Return 404 |
| Category with no products | Either 404 or 301 to parent, not empty 200 |

```javascript
// Next.js: return proper 404 instead of empty page
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) {
    notFound(); // triggers 404 response and not-found.tsx
  }
}
```

---

## 7. Index Coverage Report Interpretation

Search Console Index Coverage report categories:

| Status | Meaning | Action |
|---|---|---|
| **Valid** | Indexed and serving | Monitor for unexpected drops |
| **Valid with warning** | Indexed but flagged (e.g., submitted in sitemap but canonical is different) | Fix the canonical mismatch |
| **Excluded - Crawled, not indexed** | Google crawled but chose not to index | Improve content quality or add noindex intentionally |
| **Excluded - Discovered, not crawled** | In queue but not yet crawled | Improve crawl budget or add more internal links |
| **Excluded - Duplicate** | Treated as duplicate of another URL | Check canonical chain |
| **Excluded - Noindex** | noindex directive found | Intentional? If not, remove the directive |
| **Error - 404** | Page returned 404 | Remove from sitemap if intentional, fix if accidental |
| **Error - Soft 404** | 200 but thin/empty content | See soft 404 section above |
| **Error - Redirect error** | Redirect loop or chain too long | Fix redirects |
| **Error - robots.txt blocked** | Blocked from crawling | Intentional? If not, update robots.txt |

### Monitoring workflow

Set up weekly review of:
1. Total indexed count trend - sudden drops signal a problem
2. New errors appearing in the report
3. "Discovered, not crawled" volume - high numbers suggest crawl budget constraints
4. "Excluded - Duplicate" volume - high numbers suggest canonicalization issues
