<!-- Part of the Edge Computing AbsolutelySkilled skill. Load this file when
     working with CDN cache configuration, Cache-Control headers, or cache invalidation. -->

# CDN Caching Reference

## Cache-Control directives

### Response directives (server to CDN/browser)

| Directive | Effect | Example |
|---|---|---|
| `public` | Any cache (CDN, browser) may store | `public, max-age=3600` |
| `private` | Only browser cache, not CDN | `private, max-age=600` |
| `no-cache` | Cache may store but must revalidate every time | `no-cache` |
| `no-store` | Do not cache at all | `no-store` |
| `max-age=N` | Fresh for N seconds from origin response | `max-age=86400` |
| `s-maxage=N` | Fresh for N seconds in shared caches (CDN) only | `s-maxage=3600` |
| `stale-while-revalidate=N` | Serve stale for N seconds while fetching fresh copy in background | `max-age=60, stale-while-revalidate=86400` |
| `stale-if-error=N` | Serve stale for N seconds if origin returns 5xx | `max-age=60, stale-if-error=3600` |
| `immutable` | Never revalidate (use with content-hashed URLs) | `max-age=31536000, immutable` |
| `must-revalidate` | Once stale, must revalidate before use | `max-age=3600, must-revalidate` |
| `no-transform` | CDN must not modify body (no image optimization, compression changes) | `no-transform` |

### Common patterns

```
# Static assets with content hash (app.a1b2c3.js)
Cache-Control: public, max-age=31536000, immutable

# HTML pages - always fresh but fast
Cache-Control: public, max-age=0, must-revalidate
# or with stale-while-revalidate for speed
Cache-Control: public, max-age=60, stale-while-revalidate=86400

# API responses - short TTL
Cache-Control: public, s-maxage=10, stale-while-revalidate=30

# Personalized content - browser only
Cache-Control: private, max-age=300

# Sensitive data - no caching anywhere
Cache-Control: no-store
```

## Vary header

The `Vary` header tells caches to store separate versions based on request header values.

```
# Different response per encoding
Vary: Accept-Encoding

# Different response per auth token (effectively uncacheable at CDN)
Vary: Authorization

# Multiple varies
Vary: Accept-Encoding, Accept-Language, Cookie
```

**Critical rule**: If your response depends on cookies or auth headers, you MUST
set `Vary` appropriately or risk serving one user's content to another.

**Performance impact**: Each unique combination of Vary header values creates a
separate cache entry. `Vary: Cookie` effectively disables CDN caching because
cookies differ per user. Prefer `Vary` on specific, low-cardinality headers.

## Surrogate keys / cache tags

Surrogate keys allow targeted cache invalidation without purging entire zones.

### Cloudflare (Enterprise)

```
# Response header
Surrogate-Key: product-123 category-shoes homepage

# Purge by tag via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -d '{"tags": ["product-123"]}'
```

### Fastly

```
# Response header
Surrogate-Key: product-123 category-shoes

# Purge
curl -X POST "https://api.fastly.com/service/{id}/purge/product-123" \
  -H "Fastly-Key: {token}"
```

### CloudFront (invalidation paths)

```bash
# CloudFront uses path-based invalidation, not tags
aws cloudfront create-invalidation \
  --distribution-id E1234 \
  --paths "/products/123" "/category/shoes/*"
```

> CloudFront invalidations are slow (5-15 minutes) and limited to 1000 free/month.
> For frequent invalidation, use versioned URLs instead.

## Cache key design

The cache key determines what makes a request "unique" for caching purposes.

### Default cache key components

Most CDNs use: `scheme + host + path + query string` as the default cache key.

### Custom cache key strategies

```typescript
// Cloudflare Workers - normalize cache key
function getCacheKey(request: Request): Request {
  const url = new URL(request.url);

  // Strip tracking query params that don't affect content
  const stripParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
  stripParams.forEach((p) => url.searchParams.delete(p));

  // Sort remaining params for consistency
  url.searchParams.sort();

  // Normalize to lowercase path
  url.pathname = url.pathname.toLowerCase();

  return new Request(url.toString(), request);
}
```

### Common cache key mistakes

| Mistake | Effect | Fix |
|---|---|---|
| Not stripping UTM params | Same page cached N times for N campaign links | Strip marketing params from cache key |
| Including session cookies in cache key | Every user gets a unique cache entry (0% hit rate) | Exclude session cookies; use `Vary` only for meaningful headers |
| Case-sensitive paths | `/Products/` and `/products/` cached separately | Normalize to lowercase |
| Random query param order | `?a=1&b=2` and `?b=2&a=1` cached separately | Sort query params |

## Tiered caching

### How tiers work

```
User -> L1 Edge PoP (closest) -> L2 Regional Shield -> Origin

L1 cache miss: check L2 before going to origin
L2 cache miss: fetch from origin, populate both L2 and L1
```

### Configuration

**Cloudflare Tiered Cache**: Enable in dashboard or via API. Argo Tiered Cache
uses Cloudflare's network to route cache misses through optimal regional PoPs.

**CloudFront Origin Shield**: Enable per-origin, choose the region closest to
your origin server. Costs $0.0090/10,000 requests.

**Fastly Shielding**: Configure a shield PoP per backend in VCL or UI.

### Benefits

- Reduces origin load by 50-90% (L1 misses are absorbed by L2)
- Improves cache hit ratio because L2 aggregates requests from many L1 PoPs
- Fewer origin connections means lower origin cost

## Cache invalidation strategies

| Strategy | When to use | Latency | Complexity |
|---|---|---|---|
| **TTL expiry** | Content changes on predictable schedule | Seconds to hours | Low |
| **Surrogate key purge** | Content updated on-demand (CMS publish, product update) | 1-5 seconds | Medium |
| **Versioned URLs** | Static assets (CSS, JS, images) | Instant (new URL = new cache) | Low |
| **Soft purge (stale-while-revalidate)** | Need instant updates without origin spikes | Immediate (serves stale briefly) | Medium |
| **Full zone purge** | Emergency only - nuclear option | 30-60 seconds | Low |

### Best practice: combine strategies

```
Static assets: versioned URLs (app.abc123.js) + immutable cache
HTML pages:    short TTL (60s) + stale-while-revalidate (24h) + surrogate key purge on publish
API responses: short TTL (5-10s) + stale-while-revalidate (30s)
User data:     private, no-store, or short max-age with Vary: Authorization
```

## ETag and conditional requests

```
# Origin response
ETag: "abc123"
Cache-Control: public, max-age=60

# After TTL expires, CDN sends conditional request
If-None-Match: "abc123"

# Origin responds 304 Not Modified (no body transferred)
# CDN refreshes TTL and serves cached body
```

ETags reduce bandwidth but still require an origin round-trip on revalidation.
For truly static content, prefer long `max-age` with versioned URLs to avoid
revalidation entirely.

## CDN-specific headers

| Header | CDN | Purpose |
|---|---|---|
| `CF-Cache-Status` | Cloudflare | HIT, MISS, EXPIRED, DYNAMIC, BYPASS |
| `X-Cache` | CloudFront, Fastly | Hit from cloudfront, Miss from cloudfront |
| `Age` | All | Seconds since object was cached |
| `CDN-Cache-Control` | Cloudflare | Override Cache-Control for CDN only (browser ignores) |
| `Surrogate-Control` | Fastly | CDN-only cache directives (stripped before browser) |
| `X-Cache-Hits` | Fastly | Number of times this object has been served from cache |
