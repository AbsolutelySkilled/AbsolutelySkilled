<!-- Part of the Edge Computing AbsolutelySkilled skill. Load this file when
     working with latency reduction, TTFB optimization, or edge-side performance tuning. -->

# Latency Optimization Reference

## Understanding latency sources

Every HTTP request accumulates latency from multiple sources:

```
DNS lookup:        1-50ms   (cached: ~0ms)
TCP handshake:     10-100ms (one RTT)
TLS handshake:     20-200ms (one or two RTTs)
TTFB (server):     10-500ms (processing time + network)
Content transfer:  varies   (depends on size and bandwidth)
```

**Total cold request**: 50-850ms before first byte of content arrives.
**Warm/cached request**: 0-10ms if served from edge cache.

The goal of edge computing is to eliminate as many of these layers as possible
by serving responses from the nearest PoP.

## TTFB reduction techniques

### 1. Serve from edge cache (eliminate origin)

The single biggest TTFB win. If the response is in edge cache, the entire
origin round-trip (50-200ms) is eliminated.

```typescript
// Cloudflare Worker: aggressive caching with background revalidation
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cache = caches.default;
    const cacheKey = request;

    let response = await cache.match(cacheKey);
    if (response) {
      // Check if stale - if so, revalidate in background
      const age = parseInt(response.headers.get('Age') ?? '0');
      const maxAge = 60; // seconds
      if (age > maxAge) {
        ctx.waitUntil(revalidateAndCache(request, cache, cacheKey));
      }
      return response;
    }

    // Cache miss - fetch and cache
    response = await fetch(request);
    const cachedResponse = new Response(response.body, response);
    cachedResponse.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
    ctx.waitUntil(cache.put(cacheKey, cachedResponse.clone()));
    return cachedResponse;
  },
};

async function revalidateAndCache(
  request: Request,
  cache: Cache,
  cacheKey: Request
): Promise<void> {
  const fresh = await fetch(request);
  const toCache = new Response(fresh.body, fresh);
  toCache.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  await cache.put(cacheKey, toCache);
}
```

### 2. Connection reuse and keep-alive

Reusing TCP/TLS connections to origin eliminates handshake latency (30-300ms per new connection).

```typescript
// Cloudflare Workers automatically reuse connections to origin
// But ensure your origin supports keep-alive:
//   - Set Connection: keep-alive (HTTP/1.1 default)
//   - Enable HTTP/2 on your origin for multiplexing
//   - Set reasonable keep-alive timeout (60-120s)
```

### 3. Early hints (103)

Send the browser a 103 Early Hints response before the full response is ready,
allowing it to preload critical resources while the server processes the request.

```typescript
// Cloudflare supports Early Hints via Link headers
export default {
  async fetch(request: Request): Promise<Response> {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);

    // These Link headers are sent as 103 Early Hints by Cloudflare
    newResponse.headers.append('Link', '</styles/main.css>; rel=preload; as=style');
    newResponse.headers.append('Link', '</scripts/app.js>; rel=preload; as=script');
    newResponse.headers.append('Link', '</fonts/inter.woff2>; rel=preload; as=font; crossorigin');

    return newResponse;
  },
};
```

### 4. Request collapsing / coalescing

When multiple users request the same uncached resource simultaneously, only send
one request to origin and share the response.

Cloudflare does this automatically for cacheable content. For Workers:

```typescript
// Manual request coalescing with in-flight map
const inFlight = new Map<string, Promise<Response>>();

async function fetchWithCoalescing(url: string): Promise<Response> {
  const existing = inFlight.get(url);
  if (existing) return existing.then((r) => r.clone());

  const promise = fetch(url).then((r) => {
    inFlight.delete(url);
    return r;
  });

  inFlight.set(url, promise);
  return promise.then((r) => r.clone());
}
```

> Note: In Workers, the in-flight map only persists within a single isolate
> instance. Cross-isolate coalescing requires Durable Objects or CDN-level features.

### 5. Streaming responses

Start sending bytes to the client before the full response is assembled.
Reduces perceived TTFB because the browser can start parsing HTML/rendering
while the rest streams in.

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Start streaming immediately
    const streamBody = async () => {
      // Send HTML head immediately (browser starts loading CSS/JS)
      await writer.write(encoder.encode('<!DOCTYPE html><html><head><link rel="stylesheet" href="/style.css"></head><body>'));

      // Fetch data (this takes time)
      const data = await fetch('https://api.example.com/data').then((r) => r.json());

      // Stream the body content
      await writer.write(encoder.encode(`<main>${renderContent(data)}</main>`));
      await writer.write(encoder.encode('</body></html>'));
      await writer.close();
    };

    // Don't await - let it stream
    streamBody();

    return new Response(readable, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
```

### 6. Prefetching and preconnecting

Instruct the browser to start connections early:

```html
<!-- DNS prefetch for third-party domains -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- Preconnect: DNS + TCP + TLS (saves 100-300ms) -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

<!-- Prefetch: download resource for likely next navigation -->
<link rel="prefetch" href="/next-page.html">

<!-- Preload: download critical resource for current page -->
<link rel="preload" href="/hero-image.webp" as="image">
```

## Edge-side includes (ESI)

Compose pages from cached fragments with different TTLs:

```html
<!-- Main page template cached for 24 hours -->
<html>
<body>
  <header>
    <!-- User-specific nav cached for 5 minutes -->
    <esi:include src="/fragments/nav?user=123" />
  </header>
  <main>
    <!-- Product content cached for 1 hour -->
    <esi:include src="/fragments/product/456" />
  </main>
  <footer>
    <!-- Static footer cached indefinitely -->
    <esi:include src="/fragments/footer" />
  </footer>
</body>
</html>
```

Workers equivalent (no ESI needed):

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Fetch fragments in parallel with different cache policies
    const [nav, product, footer] = await Promise.all([
      fetchCached('/fragments/nav', 300),      // 5 min
      fetchCached('/fragments/product/456', 3600), // 1 hour
      fetchCached('/fragments/footer', 86400),  // 24 hours
    ]);

    const html = `<html><body>
      <header>${nav}</header>
      <main>${product}</main>
      <footer>${footer}</footer>
    </body></html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};

async function fetchCached(path: string, ttl: number): Promise<string> {
  const response = await fetch(`https://origin.example.com${path}`, {
    cf: { cacheTtl: ttl, cacheEverything: true },
  });
  return response.text();
}
```

## Measuring latency correctly

### Real User Monitoring (RUM)

```typescript
// Collect Navigation Timing data from real users
function collectTimings(): void {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  const metrics = {
    dns: nav.domainLookupEnd - nav.domainLookupStart,
    tcp: nav.connectEnd - nav.connectStart,
    tls: nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0,
    ttfb: nav.responseStart - nav.requestStart,
    download: nav.responseEnd - nav.responseStart,
    domReady: nav.domContentLoadedEventEnd - nav.fetchStart,
    fullLoad: nav.loadEventEnd - nav.fetchStart,
  };

  // Send to analytics endpoint
  navigator.sendBeacon('/analytics/timing', JSON.stringify(metrics));
}

// Run after page load
window.addEventListener('load', () => setTimeout(collectTimings, 0));
```

### Geographic breakdown

Always segment latency data by geography. A global P50 of 150ms might hide:
- US users at 50ms
- EU users at 120ms
- Southeast Asia users at 400ms (no nearby PoP, or origin in US-East)

### Synthetic monitoring

```bash
# Test from multiple regions with curl
curl -o /dev/null -s -w "DNS: %{time_namelookup}s\nTCP: %{time_connect}s\nTLS: %{time_appconnect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://example.com

# Use tools like:
# - Catchpoint / Pingdom for multi-region synthetic checks
# - WebPageTest for full waterfall analysis
# - Cloudflare Observatory for integrated testing
```

## Latency budget template

| Component | Budget | Notes |
|---|---|---|
| DNS | 0ms | Should be cached or use CDN DNS |
| TCP + TLS | 0-20ms | Edge termination, connection reuse |
| Edge processing | 5-10ms | Worker/function execution |
| Cache lookup | 1-5ms | Edge cache hit |
| Origin (on miss) | 50-200ms | Budget this as exception, not norm |
| Content transfer | 10-50ms | Depends on payload size |
| **Total (cache hit)** | **5-35ms** | Target for majority of requests |
| **Total (cache miss)** | **60-250ms** | Acceptable for dynamic content |

Aim for 90%+ cache hit rate to keep the average close to the cache-hit budget.
