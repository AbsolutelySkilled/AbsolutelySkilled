<!-- Part of the core-web-vitals AbsolutelySkilled skill. Load this file when
     working with LCP optimization, TTFB, image loading, or critical rendering path. -->

# LCP Optimization Reference

LCP (Largest Contentful Paint) measures the time from navigation start to when the largest
visible content element is rendered. Target: < 2.5s at the 75th percentile of real users.

---

## LCP Breakdown: Four Sub-Parts

LCP time can be decomposed into four additive phases. Identify which phase is slowest before optimizing.

```
LCP = TTFB + Resource Load Delay + Resource Load Duration + Element Render Delay
```

| Phase | What it measures | Optimization target |
|---|---|---|
| TTFB | Time to first byte from server | Server performance, CDN, caching |
| Resource Load Delay | Time from TTFB to when LCP resource starts loading | Preload, fetchpriority, no lazy-load |
| Resource Load Duration | Time to download the LCP resource | Image compression, CDN, HTTP/2 |
| Element Render Delay | Time from resource loaded to element painted | Remove render-blocking, critical CSS |

Use Chrome DevTools `Performance` panel or PageSpeed Insights "Opportunities" to identify which phase dominates.

---

## Phase 1: TTFB Optimization

TTFB > 600ms is a red flag. The browser cannot start loading the LCP resource until the initial HTML arrives.

### Server-side improvements

```nginx
# Nginx: enable gzip and set cache headers for HTML
server {
  gzip on;
  gzip_types text/html text/css application/javascript;

  location / {
    # For dynamic pages: short TTL with stale-while-revalidate
    add_header Cache-Control "public, max-age=0, stale-while-revalidate=60";
    proxy_pass http://app_server;
  }

  location ~* \.(js|css|webp|avif|woff2)$ {
    # Static assets: immutable cache (filename has hash)
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
}
```

### CDN and edge caching

- Serve HTML from a CDN edge node close to the user when content can be cached
- For personalized pages, use CDN with Edge Side Includes (ESI) or edge functions to cache the shell
- Use `stale-while-revalidate` to avoid cache misses impacting TTFB:

```
Cache-Control: public, max-age=60, stale-while-revalidate=600
```

### Preconnect to critical origins

```html
<!-- In <head> - establishes TCP+TLS to critical third-party origins before they're needed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.example.com" crossorigin>

<!-- dns-prefetch is lighter - use for non-critical third parties -->
<link rel="dns-prefetch" href="https://analytics.example.com">
```

---

## Phase 2: Resource Load Delay Elimination

The LCP resource must start loading as early as possible. Two common mistakes delay it:

**Mistake 1: LCP image is not in initial HTML**

When images are injected by JavaScript (carousel libraries, CMS hydration, lazy components), the
browser cannot discover them during HTML parsing. The LCP resource starts loading seconds late.

Fix: Ensure the LCP `<img>` is in the server-rendered HTML, not injected by JS.

**Mistake 2: Missing preload for background-image LCP**

If the LCP element uses a CSS `background-image`, the browser won't discover it until the CSS is
parsed. Use `<link rel="preload">` to fetch it early.

```html
<!-- Preload CSS background LCP image -->
<link
  rel="preload"
  as="image"
  href="/hero-800.webp"
  imagesrcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1600.webp 1600w"
  imagesizes="(max-width: 600px) 100vw, 800px"
  fetchpriority="high"
/>

<!-- Or for a simple non-responsive background image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
```

### fetchpriority attribute

`fetchpriority="high"` instructs the browser to prioritize the LCP resource above other fetches.
Without it, the browser may deprioritize images during the initial burst of network requests.

```html
<!-- On the LCP img element -->
<img
  src="/hero.webp"
  fetchpriority="high"
  loading="eager"
  width="1200"
  height="630"
  alt="Hero"
/>

<!-- Never use fetchpriority="high" on multiple images - defeats the purpose -->
<!-- Reserve it for exactly one element: the LCP candidate -->
```

---

## Phase 3: Image Optimization

A fast-discovered image that's 2MB will still be slow. Reduce the payload.

### Modern image formats

| Format | Compression vs JPEG | Use case | Browser support |
|---|---|---|---|
| AVIF | 50% smaller | Photos, highest quality | ~92% (2024) |
| WebP | 25-35% smaller | Photos + graphics | ~97% |
| SVG | N/A | Icons, logos, illustrations | Universal |
| JPEG | baseline | Fallback for photos | Universal |

Use `<picture>` for format negotiation with graceful fallback:

```html
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img
    src="/hero.jpg"
    fetchpriority="high"
    loading="eager"
    width="1200"
    height="630"
    alt="Hero image"
  />
</picture>
```

### Responsive images with srcset + sizes

The browser uses `sizes` to calculate the display width, then picks the best `srcset` candidate.
An incorrectly sized image wastes bandwidth or delivers a pixelated result.

```html
<img
  srcset="
    /hero-400.webp   400w,
    /hero-800.webp   800w,
    /hero-1200.webp 1200w,
    /hero-1600.webp 1600w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1200px) 50vw,
    800px
  "
  src="/hero-800.webp"
  fetchpriority="high"
  loading="eager"
  width="1600"
  height="900"
  alt="Hero"
/>
```

**How `sizes` works**: The browser picks the first matching media condition and uses that
display width to select the appropriate `srcset` entry. Always define a final non-media
fallback (e.g., `800px`).

### Image compression settings

| Format | Tool | Recommended quality |
|---|---|---|
| AVIF | `sharp`, `squoosh`, `avifenc` | quality 60-75 |
| WebP | `sharp`, `cwebp`, `squoosh` | quality 75-85 |
| JPEG | `mozjpeg`, `imagemin-mozjpeg` | quality 75-85 |

```js
// sharp (Node.js) - convert and resize for srcset
import sharp from 'sharp';

const widths = [400, 800, 1200, 1600];
for (const width of widths) {
  await sharp('hero-original.jpg')
    .resize(width)
    .webp({ quality: 80 })
    .toFile(`hero-${width}.webp`);

  await sharp('hero-original.jpg')
    .resize(width)
    .avif({ quality: 65 })
    .toFile(`hero-${width}.avif`);
}
```

### Image CDN integration

Services like Cloudinary, Imgix, and Cloudflare Images transform images on the fly via URL parameters,
eliminating build-time generation:

```html
<!-- Cloudinary: auto format + quality, resize to 800px wide -->
<img
  src="https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/hero.jpg"
  fetchpriority="high"
  width="800"
  height="450"
  alt="Hero"
/>
```

---

## Phase 4: Render-Blocking Elimination

### Critical CSS inlining

Render-blocking stylesheets delay the first paint. Extract the minimum CSS needed to render
above-the-fold content and inline it; load the rest asynchronously.

```html
<head>
  <!-- Inline critical CSS - no network round-trip needed -->
  <style>
    /* Minimal styles for hero, nav, and above-fold layout */
    body { margin: 0; font-family: system-ui, sans-serif; }
    .hero { width: 100%; aspect-ratio: 16 / 9; background: #f5f5f5; }
    nav { display: flex; padding: 1rem; }
  </style>

  <!-- Load full stylesheet asynchronously - won't block render -->
  <link rel="preload" href="/styles.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
</head>
```

Tools for generating critical CSS: `critical` (npm), `critters` (webpack plugin), Astro's built-in critical CSS.

### Eliminate parser-blocking scripts

```html
<!-- Parser-blocking: stops HTML parsing until script downloads + executes -->
<script src="/app.js"></script>

<!-- Deferred: HTML parses fully, then script runs in order -->
<script src="/app.js" defer></script>

<!-- Async: executes as soon as downloaded, may interrupt parsing -->
<!-- Use only for independent scripts like analytics -->
<script src="/analytics.js" async></script>

<!-- ES modules are deferred by default -->
<script type="module" src="/app.js"></script>
```

**Rule**: Never place `<script>` without `defer` or `async` in `<head>` unless it's truly
critical for initial render (rare).

### Third-party script impact on LCP

Third-party scripts (chat widgets, A/B testing, tag managers) are common LCP killers. They:
1. Compete for main thread time
2. Inject content that becomes the LCP element (e.g., hero banner from CMS)
3. Block rendering if loaded synchronously

Audit with: Chrome DevTools > Performance > "Third-party usage" section or `web.dev/third-party-summary`.

```html
<!-- Load third parties after LCP renders - use facade pattern -->
<!-- Delay chat widget initialization until after user interaction -->
<script>
  // Don't load chat SDK on initial paint
  document.addEventListener('click', loadChatWidget, { once: true });
  document.addEventListener('scroll', loadChatWidget, { once: true });

  function loadChatWidget() {
    const script = document.createElement('script');
    script.src = 'https://cdn.chat-provider.com/widget.js';
    document.body.appendChild(script);
  }
</script>
```

---

## Debugging LCP in Chrome DevTools

### Finding the LCP element

1. Open DevTools > Performance panel
2. Record a page load
3. Click the "LCP" marker in the timeline
4. The "Related Node" in the summary shows the LCP element

Alternatively, use the console:

```js
// Log LCP entries to console
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lcp = entries[entries.length - 1];
  console.log('LCP element:', lcp.element);
  console.log('LCP time:', lcp.startTime, 'ms');
  console.log('LCP size:', lcp.size, 'px²');
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

### Timing the four sub-parts

```js
// Decompose LCP into its phases
new PerformanceObserver((list) => {
  const lcp = list.getEntries().at(-1);

  // Get resource timing for the LCP image
  const resources = performance.getEntriesByType('resource');
  const lcpResource = resources.find(r => lcp.url && r.name === lcp.url);

  if (lcpResource) {
    const ttfb = performance.getEntriesByType('navigation')[0].responseStart;
    const loadDelay = lcpResource.startTime - ttfb;
    const loadDuration = lcpResource.responseEnd - lcpResource.startTime;
    const renderDelay = lcp.startTime - lcpResource.responseEnd;

    console.table({ ttfb, loadDelay, loadDuration, renderDelay });
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

### Common LCP DevTools checks

- **Waterfall**: Is the LCP resource starting late? (should start < 500ms after navigation)
- **Priority**: Is the LCP resource marked as "Highest" priority? (should be)
- **Coverage tab**: Is there unused CSS blocking render?
- **Rendering > Paint flashing**: Watch what paints when - LCP should paint early
