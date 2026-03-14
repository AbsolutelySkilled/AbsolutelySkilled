<!-- Part of the frontend-developer AbsolutelySkilled skill. Load this file when working with web performance optimization. -->

# Web Performance Reference

## Core Web Vitals

Google's user-centric metrics that directly affect Search ranking and UX quality.

### LCP - Largest Contentful Paint
Measures loading performance: time until the largest visible content element is rendered.

- **Good**: < 2.5s | **Needs Improvement**: 2.5s - 4.0s | **Poor**: > 4.0s
- Measured from navigation start to when the largest image/text block in the viewport is painted
- Common LCP elements: hero images, large text blocks, `<video>` poster frames
- **Diagnose**: Chrome DevTools > Performance panel > look for "LCP" marker; or Lighthouse

**Top causes of slow LCP**:
1. Slow server response (TTFB > 600ms)
2. Render-blocking resources (CSS/JS in `<head>`)
3. Slow resource load time (unoptimized images)
4. Client-side rendering without SSR/SSG

### INP - Interaction to Next Paint
Replaced FID in March 2024. Measures responsiveness: the worst interaction latency (p98) across the full page visit.

- **Good**: < 200ms | **Needs Improvement**: 200ms - 500ms | **Poor**: > 500ms
- Covers all clicks, taps, and keyboard interactions (not hover/scroll)
- An interaction = input delay + processing time + presentation delay

**Reduce INP**:
- Break up long tasks with `scheduler.yield()` or `setTimeout(0)` chunking
- Move heavy work off the main thread (Web Workers)
- Minimize JS execution time in event handlers
- Avoid layout thrashing inside event callbacks

```js
// Break long tasks
async function processItems(items) {
  for (const item of items) {
    process(item);
    await scheduler.yield(); // yield to browser between iterations
  }
}
```

### CLS - Cumulative Layout Shift
Measures visual stability: sum of all unexpected layout shift scores during a page's lifetime.

- **Good**: < 0.1 | **Needs Improvement**: 0.1 - 0.25 | **Poor**: > 0.25
- Score = impact fraction * distance fraction (per shift)

**Common causes and fixes**:
| Cause | Fix |
|---|---|
| Images without dimensions | Always set `width` + `height` attributes |
| Ads/embeds without reserved space | Use `min-height` or aspect-ratio containers |
| Late-injected content above fold | Reserve space; avoid inserting DOM above existing content |
| Web fonts causing FOUT | Use `font-display: optional` or preload fonts |

```html
<!-- Always include dimensions to prevent layout shift -->
<img src="hero.jpg" width="1200" height="630" alt="..." />

<!-- Or use aspect-ratio in CSS -->
<style>
.image-container { aspect-ratio: 16 / 9; }
</style>
```

---

## Critical Rendering Path

Browser steps to render a page: HTML parsing -> DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite

### What blocks rendering

**Render-blocking CSS**: All `<link rel="stylesheet">` in `<head>` block paint until downloaded and parsed.
- Solution: inline critical CSS; load non-critical CSS asynchronously

**Parser-blocking JS**: `<script>` without `async`/`defer` stops HTML parsing.
- `defer`: executes after HTML parsed, before DOMContentLoaded, in order
- `async`: executes as soon as downloaded, out of order - use for independent scripts (analytics)
- Module scripts (`type="module"`) are deferred by default

```html
<!-- Blocks parsing - avoid for non-critical JS -->
<script src="app.js"></script>

<!-- Deferred - recommended for most scripts -->
<script src="app.js" defer></script>

<!-- Async - analytics, ads, independent widgets -->
<script src="analytics.js" async></script>
```

### Inline critical CSS
Extract above-the-fold CSS and inline it in `<head>`. Load the rest asynchronously.

```html
<style>/* critical above-the-fold styles here */</style>
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

---

## Bundle Optimization

### Tree Shaking
Dead code elimination. Requires ES modules (static `import`/`export`). Ensure:
- `"sideEffects": false` in package.json (or list files with side effects)
- Avoid `import *` - import named exports specifically
- CommonJS (`require()`) cannot be tree-shaken by most bundlers

### Code Splitting
Split your bundle so users only download what they need.

```js
// Route-level splitting (framework-agnostic dynamic import)
const module = await import('./heavy-feature.js');

// Conditional loading
if (userNeedsFeature) {
  const { init } = await import('./feature.js');
  init();
}
```

### Chunk Strategy
- **Entry chunks**: one per page/route
- **Vendor chunk**: stable third-party code - long cache TTL
- **Shared chunk**: code used across multiple routes
- Keep initial JS under **170KB compressed** for mobile

### Analyze bundles
- webpack-bundle-analyzer, rollup-plugin-visualizer
- `source-map-explorer` for any bundle with source maps
- Check: duplicate dependencies, large libraries with small-usage (moment.js -> date-fns)

---

## Image Optimization

### Modern Formats
| Format | Best for | Browser support |
|---|---|---|
| AVIF | Photos, high compression | ~90% (2024) |
| WebP | Photos and graphics | ~97% |
| SVG | Icons, logos, illustrations | Universal |
| PNG | Graphics with transparency (fallback) | Universal |

Use `<picture>` for format negotiation with fallback:
```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero image" width="1200" height="630">
</picture>
```

### Responsive Images
```html
<!-- srcset with sizes - browser picks best fit -->
<img
  srcset="img-400.webp 400w, img-800.webp 800w, img-1600.webp 1600w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
  src="img-800.webp"
  alt="..."
>
```

### Lazy Loading and Priority
```html
<!-- Lazy load below-fold images (native, no JS required) -->
<img src="below-fold.jpg" loading="lazy" alt="...">

<!-- Never lazy-load LCP image; add fetchpriority=high -->
<img src="hero.jpg" loading="eager" fetchpriority="high" alt="...">
```

- `fetchpriority="high"`: boosts resource priority in browser's fetch queue (use on LCP image)
- `fetchpriority="low"`: deprioritize non-critical images
- Do NOT lazy-load images in the initial viewport

---

## Font Optimization

### font-display values
```css
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;     /* FOUT: shows fallback immediately, swaps when loaded */
  /* font-display: optional; best for CLS - uses fallback if font not cached */
  /* font-display: block;  FOIT: invisible text for up to 3s - avoid */
}
```

- `swap`: best for content fonts - text visible immediately
- `optional`: best for decorative fonts - no layout shift, may not show on slow connections

### Preload critical fonts
```html
<!-- Preload only the font variants used above the fold -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
```

### Subsetting
Reduce font file size by including only needed characters. Tools: `pyftsubset`, `glyphhanger`.
A full latin font might be 200KB; a subset for English can be under 20KB.

### Variable fonts
One file replaces multiple weight/style files. Use when you need 3+ font variants.
```css
@font-face {
  font-family: 'Inter';
  src: url('inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900; /* weight range covered by this file */
}
```

---

## Caching Strategies

### Cache-Control headers
```
# Immutable assets (hash in filename) - cache forever
Cache-Control: public, max-age=31536000, immutable

# HTML - always revalidate
Cache-Control: no-cache

# API responses - short cache + stale-while-revalidate
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

### stale-while-revalidate
Serve stale content immediately while fetching fresh content in background. Eliminates wait time on cache miss.

### Service Worker caching
```js
// Cache-first for static assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ?? fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open('v1').then(cache => cache.put(event.request, clone));
        return response;
      })
    )
  );
});
```

Strategies: Cache-first (static assets), Network-first (API), Stale-while-revalidate (balance).

---

## Resource Hints

```html
<!-- preconnect: establish TCP+TLS early to critical third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- dns-prefetch: DNS only - lighter than preconnect, use for non-critical origins -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- preload: high-priority fetch for current page resources (fonts, hero images, critical JS) -->
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="hero.webp" as="image" fetchpriority="high">

<!-- prefetch: low-priority fetch for next navigation resources -->
<link rel="prefetch" href="/next-page-bundle.js">

<!-- modulepreload: preload + parse ES module -->
<link rel="modulepreload" href="/app.js">
```

**Rules**:
- Only `preload` what you'll use on the current page - unused preloads generate console warnings
- `preconnect` to max 2-3 origins - each has CPU cost
- Use `prefetch` for likely-next-page routes based on user behavior

---

## Performance Measurement

### Performance API
```js
// Navigation timing
const [nav] = performance.getEntriesByType('navigation');
console.log('TTFB:', nav.responseStart - nav.requestStart);
console.log('DOM ready:', nav.domContentLoadedEventEnd);

// Custom marks and measures
performance.mark('feature-start');
doExpensiveWork();
performance.mark('feature-end');
performance.measure('feature', 'feature-start', 'feature-end');
const [measure] = performance.getEntriesByName('feature');
console.log(measure.duration + 'ms');
```

### PerformanceObserver
```js
// Observe LCP
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lcp = entries[entries.length - 1];
  console.log('LCP:', lcp.startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });

// Observe CLS
let cls = 0;
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) cls += entry.value;
  }
}).observe({ type: 'layout-shift', buffered: true });
```

### web-vitals library
```js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

onLCP(({ value, rating }) => sendToAnalytics({ metric: 'LCP', value, rating }));
onINP(({ value, rating }) => sendToAnalytics({ metric: 'INP', value, rating }));
onCLS(({ value, rating }) => sendToAnalytics({ metric: 'CLS', value, rating }));
```

---

## Rendering Performance

### Layout Thrashing
Occurs when you read layout properties then write, forcing multiple reflows in a loop.

```js
// BAD - causes layout thrashing (read/write interleaved)
elements.forEach(el => {
  const height = el.offsetHeight; // read (forces reflow)
  el.style.height = height * 2 + 'px'; // write
});

// GOOD - batch reads then writes
const heights = elements.map(el => el.offsetHeight); // all reads
elements.forEach((el, i) => { el.style.height = heights[i] * 2 + 'px'; }); // all writes
```

Use `fastdom` library to schedule reads/writes automatically.

### Compositor Layers
Certain CSS properties are handled by the GPU compositor, skipping layout and paint:
- `transform` and `opacity` are compositor-only - animate these instead of `top`/`left`/`width`
- `will-change: transform` promotes element to its own layer (use sparingly - memory cost)

```css
/* BAD - triggers layout on every frame */
.animate { transition: left 300ms; }

/* GOOD - compositor only, smooth 60fps */
.animate { transition: transform 300ms; }
```

### requestAnimationFrame
Use for any visual updates to sync with browser paint cycle.

```js
// BAD - may run mid-frame
setInterval(updateUI, 16);

// GOOD - synced to display refresh rate
function update() {
  updateUI();
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
```

### content-visibility
```css
/* Skip rendering off-screen sections entirely */
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* estimated size to avoid CLS */
}
```

---

## Network Optimization

### HTTP/2 and HTTP/3
- HTTP/2: multiplexing eliminates head-of-line blocking; domain sharding is now anti-pattern
- HTTP/3: QUIC-based, better on lossy networks (mobile)
- With HTTP/2, bundling many small files is less critical than with HTTP/1.1

### Compression
- **Brotli** (br): 15-25% better than gzip, supported by all modern browsers - prefer for text assets
- **Gzip**: universal fallback
- Always compress: HTML, CSS, JS, JSON, SVG (text-based assets)
- Never compress: already-compressed formats (JPEG, WebP, AVIF, WOFF2)

### CDN Strategy
- Serve all static assets from a CDN - reduces latency via edge PoPs
- Set immutable cache headers on hashed assets
- Use CDN for API responses when appropriate (with correct Vary headers)
- Consider CDN-level image optimization (Cloudflare Images, Imgix, Cloudinary)

### Connection limits
- Browsers allow 6 concurrent connections per origin (HTTP/1.1)
- HTTP/2 uses a single connection with multiplexing - no need to shard
- Third-party scripts compete for connections - audit and remove unused third parties
