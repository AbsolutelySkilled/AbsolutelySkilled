<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with UI performance, Core Web Vitals, loading optimization, or rendering. -->

# Performance

## Core Web Vitals targets
- LCP (Largest Contentful Paint): < 2.5s (what users see as "loaded")
- INP (Interaction to Next Paint): < 200ms (responsiveness)
- CLS (Cumulative Layout Shift): < 0.1 (visual stability)

## Image optimization
- Use next-gen formats: WebP (95% support), AVIF (85% support, smaller)
- Provide srcset for responsive images
- Always set width and height (prevents CLS)
- Lazy load below-fold images: `loading="lazy"`
- Eager load above-fold hero image: `loading="eager" fetchpriority="high"`
- Use `<picture>` for art direction or format fallback
- SVG for icons and logos (scalable, tiny file size)
- Max hero image: ~200KB. Thumbnails: ~20-50KB

```html
<!-- Hero image: eager + high priority -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img
    src="hero.jpg"
    alt="Hero description"
    width="1200"
    height="600"
    loading="eager"
    fetchpriority="high"
  >
</picture>

<!-- Below-fold image: lazy + responsive srcset -->
<picture>
  <source
    srcset="card-400.avif 400w, card-800.avif 800w"
    type="image/avif"
  >
  <source
    srcset="card-400.webp 400w, card-800.webp 800w"
    type="image/webp"
  >
  <img
    src="card-800.jpg"
    srcset="card-400.jpg 400w, card-800.jpg 800w"
    sizes="(max-width: 600px) 400px, 800px"
    alt="Card description"
    width="800"
    height="450"
    loading="lazy"
  >
</picture>
```

## Font loading
- Use `font-display: swap` to prevent FOIT (flash of invisible text)
- Preload critical fonts in `<head>`
- Use WOFF2 format only (best compression, 95%+ support)
- Subset fonts to needed character sets (latin only if applicable)
- Variable fonts: one file covers all weights - prefer `Inter Variable`, `Geist`, etc.
- Self-host fonts instead of Google Fonts (avoids extra DNS lookup, better privacy)
- Limit to 2 font files max (1 body + 1 heading, or 1 variable font)

```html
<!-- Preload in <head> before stylesheet -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900; /* variable font range */
  font-display: swap;
}
```

## CSS performance
- Avoid expensive properties on scroll: `box-shadow`, `filter`, `backdrop-filter`
- Use `transform` and `opacity` for animations (GPU-accelerated, no layout reflow)
- `will-change: transform` only on elements about to animate - remove after animation
- Contain paint on isolated components: `contain: layout paint`
- Use `content-visibility: auto` for long off-screen sections
- Avoid `@import` in CSS (blocks parallel loading) - use `<link>` tags instead

```css
/* Isolated widget - browser skips layout/paint outside this box */
.widget {
  contain: layout paint;
}

/* Long page sections below fold - skip rendering until near viewport */
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* estimated height to prevent CLS */
}

/* Animation - only use transform/opacity */
.card:hover {
  transform: translateY(-4px);
  opacity: 0.9;
  transition: transform 200ms ease, opacity 200ms ease;
}
```

## JavaScript and rendering
- Defer non-critical JS: `<script defer src="...">`
- Async for independent scripts (analytics, etc.): `<script async src="...">`
- Avoid layout thrashing: batch DOM reads then writes (never interleave)
- Use `requestAnimationFrame` for visual updates
- `IntersectionObserver` for lazy loading and scroll effects (not scroll events)
- `ResizeObserver` over `window.resize` (element-level, no global overhead)
- Debounce input/scroll/resize handlers: 150-300ms

```js
// Layout thrashing - BAD
elements.forEach(el => {
  const h = el.offsetHeight; // read
  el.style.height = h + 10 + 'px'; // write - forces reflow each iteration
});

// Batched reads then writes - GOOD
const heights = elements.map(el => el.offsetHeight); // all reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // all writes
});

// Debounce utility
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
window.addEventListener('resize', debounce(handleResize, 200));
```

## Lazy loading patterns
- Images: native `loading="lazy"` (use this by default for all below-fold images)
- Components: `React.lazy()` + `Suspense`
- Routes: code-split per route (Next.js does this automatically)
- Below-fold sections: `IntersectionObserver` trigger

```js
// IntersectionObserver for lazy-loading a component or triggering animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // stop watching after first trigger
      }
    });
  },
  { rootMargin: '100px' } // start loading 100px before entering viewport
);

document.querySelectorAll('.lazy-section').forEach(el => observer.observe(el));
```

```jsx
// React lazy component
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton height={300} />}>
      <HeavyChart />
    </Suspense>
  );
}
```

## Preventing CLS
- Always set `width` and `height` on images (or use `aspect-ratio`)
- Reserve space for ads/embeds with `min-height`
- Use skeleton/placeholder instead of content popping in
- Never insert content above existing content after load
- Font fallback with `size-adjust` to prevent text shift when swap occurs
- Use `aspect-ratio` for media containers

```css
/* Media container that reserves space */
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: #f0f0f0; /* placeholder color */
}

/* Font fallback to reduce CLS from font swap */
@font-face {
  font-family: 'Inter-fallback';
  src: local('Arial');
  size-adjust: 107%; /* tweak until metrics match your web font */
  ascent-override: 90%;
  descent-override: 22%;
}

body {
  font-family: 'Inter', 'Inter-fallback', sans-serif;
}
```

## Loading states
Hierarchy of loading patterns (best to worst UX):
1. Skeleton screens - match layout shape, pulse animation
2. Content placeholder - gray blocks approximating content
3. Spinner with context - "Loading messages..."
4. Generic spinner - worst, no context for the user

```css
/* Skeleton screen with pulse animation */
.skeleton {
  background: #e0e0e0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Usage */
.skeleton-text   { height: 1em; margin-bottom: 0.5em; }
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton-card   { height: 200px; border-radius: 8px; }
```

## Performance budget
| Asset      | Ideal     | Acceptable |
|------------|-----------|------------|
| Total page | < 1MB     | < 2MB      |
| JavaScript | < 300KB gzipped | < 500KB gzipped |
| CSS        | < 50KB gzipped  | < 100KB gzipped |
| Fonts      | < 100KB total   | < 150KB total   |
| Images     | Lazy load all below fold; compress aggressively |

## Monitoring
- **Lighthouse CI** - add to pipeline, fail on regression
- **web-vitals** library - real user monitoring (RUM) in production
- **Chrome DevTools Performance panel** - identify long tasks and layout thrashing
- **Network panel** - look for render-blocking resources (red bar in waterfall)

```js
// web-vitals RUM snippet
import { onCLS, onINP, onLCP } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  navigator.sendBeacon('/analytics', JSON.stringify({ name, value, id }));
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

## Common performance mistakes
| Mistake | Fix |
|---------|-----|
| Not lazy loading below-fold images | Add `loading="lazy"` to all below-fold `<img>` |
| Loading all fonts upfront | Preload only critical font, defer the rest |
| CSS-in-JS runtime overhead | Prefer static CSS, Tailwind, or CSS Modules |
| Animating `top`/`left`/`width`/`height` | Use `transform: translate/scale` instead |
| No image `width`/`height` attributes | Always set dimensions - prevents CLS |
| Third-party scripts blocking render | Load with `async` or `defer`, or use Partytown |
| Not code-splitting large JS bundles | Split by route, lazy-load heavy components |
| `window.resize` without debounce | Debounce at 150-300ms or use `ResizeObserver` |
