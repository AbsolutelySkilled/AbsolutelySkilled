<!-- Part of the core-web-vitals AbsolutelySkilled skill. Load this file when
     working with INP (interaction responsiveness) or CLS (layout shift) optimization. -->

# INP and CLS Optimization Reference

---

## INP - Interaction to Next Paint

INP replaced FID (First Input Delay) as a Core Web Vital in March 2024. It measures the
worst interaction latency (at the 98th percentile for long visits) across the full page
lifetime. Target: < 200ms at the 75th percentile of real users.

### The Three INP Components

Every interaction (click, tap, key press) passes through three phases:

```
INP = Input Delay + Processing Time + Presentation Delay
```

**1. Input Delay** (time from user gesture to event handler start)

Caused by: other tasks running on the main thread when the interaction fires. Long tasks
(> 50ms) are the primary culprit - if a 200ms task is running when the user clicks, the
event waits for it to finish.

**2. Processing Time** (time spent running event handlers)

Caused by: heavyweight synchronous code inside click/keydown handlers. Reading the DOM,
running loops, synchronous XHR, or calling expensive library functions all add to this.

**3. Presentation Delay** (time from handler finish to next frame painted)

Caused by: forced synchronous layout (layout thrashing), large style recalculations, or
heavy paint operations. Reading layout properties (offsetWidth, getBoundingClientRect)
after writing to the DOM forces an early layout.

### Diagnosing INP in DevTools

1. Open Chrome DevTools > Performance panel
2. Record while interacting with the page
3. Look for long tasks (red triangles in the main thread row)
4. Find the interaction in the "Interactions" track
5. Click it to see input delay / processing time / presentation delay breakdown

Alternatively, use the INP Attribution API:

```js
import { onINP } from 'web-vitals/attribution';

onINP(({ value, attribution }) => {
  const { interactionTarget, inputDelay, processingDuration, presentationDelay } = attribution;

  console.log({
    inp: value,
    element: interactionTarget,   // CSS selector of the clicked element
    inputDelay,                    // ms waiting for main thread
    processingDuration,            // ms running handlers
    presentationDelay,             // ms waiting for frame
    phase: inputDelay > processingDuration
      ? 'INPUT_DELAY'
      : processingDuration > presentationDelay
        ? 'PROCESSING'
        : 'PRESENTATION'
  });
}, { reportAllChanges: true });
```

### Fixing Input Delay: Break Long Tasks

The main thread must be free when users interact. Any task > 50ms is a "long task" that
creates input delay. Break them up so the browser can process interactions between chunks.

```js
// Modern: scheduler.yield() - Chrome 115+
// Yields control back to the browser, allowing input events to be processed
async function processLargeList(items) {
  const results = [];
  for (let i = 0; i < items.length; i++) {
    results.push(processItem(items[i]));

    // Yield every N items to stay under 50ms task budget
    if (i % 20 === 0) {
      await scheduler.yield();
    }
  }
  return results;
}

// Polyfill / fallback for browsers without scheduler.yield
function yieldToMain() {
  if ('scheduler' in globalThis && 'yield' in scheduler) {
    return scheduler.yield();
  }
  return new Promise(resolve => setTimeout(resolve, 0));
}
```

### Fixing Processing Time: Lightweight Event Handlers

Event handlers must complete quickly. Defer heavy work that doesn't need to happen synchronously.

```js
// BAD: Heavy synchronous processing in click handler
button.addEventListener('click', () => {
  const data = processEntireDataset(largeArray); // 300ms of work
  renderTable(data);
});

// GOOD: Update UI immediately, defer heavy work
button.addEventListener('click', async () => {
  // Immediately update UI state (gives user feedback)
  button.disabled = true;
  button.textContent = 'Processing...';

  // Yield before heavy work - this frame will paint the button state
  await scheduler.yield();

  // Now do expensive processing
  const data = await processEntireDataset(largeArray);
  renderTable(data);
  button.textContent = 'Done';
});
```

### Fixing Presentation Delay: Avoid Layout Thrashing

Layout thrashing occurs when you interleave DOM reads and writes, forcing the browser to
recalculate layout multiple times.

```js
// BAD: Reads and writes interleaved - forces reflow on every iteration
elements.forEach(el => {
  const height = el.offsetHeight;         // read -> forces layout
  el.style.height = (height * 1.5) + 'px'; // write
});

// GOOD: Batch all reads, then all writes
const heights = elements.map(el => el.offsetHeight); // all reads (one layout)
elements.forEach((el, i) => {
  el.style.height = (heights[i] * 1.5) + 'px';       // all writes
});
```

Properties that trigger layout when read: `offsetWidth/Height`, `clientWidth/Height`,
`scrollTop/Left`, `getBoundingClientRect()`, `getComputedStyle()`.

### Debouncing and Web Workers

For continuous events (input, resize), debounce with `setTimeout` (300ms for search) or
throttle for scroll handlers. Do not debounce `click` - it harms perceived responsiveness.

For CPU-heavy work that doesn't need the DOM (data parsing, encryption, image processing),
use `new Worker('/worker.js')` to move computation off the main thread entirely. Post data
with `worker.postMessage(payload)` and receive results via `worker.onmessage`.

---

## CLS - Cumulative Layout Shift

CLS measures visual instability: the sum of all unexpected layout shift scores during a
page's lifetime. Target: < 0.1 at the 75th percentile of real users.

### How CLS Score is Calculated

Each layout shift has a score = `impact fraction * distance fraction`:

- **Impact fraction**: fraction of the viewport area affected by the shifting element
- **Distance fraction**: fraction of the viewport that the element moved

CLS aggregates these using **session windows**: groups of shifts where each shift is
within 1 second of the previous, and the window is at most 5 seconds total. The worst
session window score is the CLS value.

```js
// Observe layout shift entries
let cls = 0;
let sessionWindowStart = 0;
let sessionWindowValue = 0;
let clsValue = 0;

new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // Ignore shifts from user interactions (within 500ms of input)
    if (entry.hadRecentInput) continue;

    const now = entry.startTime;
    if (now - sessionWindowStart > 5000 || entry.startTime - sessionWindowStart > 1000) {
      // New session window
      sessionWindowStart = entry.startTime;
      sessionWindowValue = 0;
    }

    sessionWindowValue += entry.value;
    clsValue = Math.max(clsValue, sessionWindowValue);
  }
}).observe({ type: 'layout-shift', buffered: true });
```

### Debugging with Layout Shift Regions

Enable Layout Shift Regions in Chrome DevTools to visually identify what's shifting:

1. DevTools > More tools > Rendering
2. Enable "Layout Shift Regions" (highlights shifting elements in blue/teal)
3. Reload the page and watch for highlighted areas

Alternatively, use PerformanceObserver to log the shifting nodes:

```js
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.hadRecentInput) continue;
    // sources shows which elements shifted and by how much
    for (const source of entry.sources) {
      console.log({
        element: source.node,
        previousRect: source.previousRect,
        currentRect: source.currentRect,
        score: entry.value
      });
    }
  }
}).observe({ type: 'layout-shift', buffered: true });
```

### Fix 1: Always Set Image Dimensions

The most common CLS source. Without dimensions, the browser doesn't know the image size
until it downloads, causing everything below it to shift down.

```html
<!-- Always provide width and height - browser reserves space immediately -->
<img src="/product.webp" width="400" height="300" alt="Product" />

<!-- For responsive images, also add CSS to allow scaling -->
<style>
img {
  max-width: 100%;
  height: auto; /* maintains aspect ratio when width changes */
}
</style>

<!-- CSS aspect-ratio works even without explicit dimensions -->
<style>
.hero-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
</style>
```

### Fix 2: Reserve Space for Dynamic Content

Ads, embeds, and content loaded after the initial HTML shift existing content.

```css
/* Ad slot: reserve the known ad size */
.ad-slot {
  min-height: 250px;    /* standard banner height */
  width: 300px;
  /* Or use aspect-ratio for responsive ads */
}

/* Embed placeholder: show skeleton while content loads */
.embed-container {
  aspect-ratio: 16 / 9;
  background: #f5f5f5;
  contain: layout;       /* isolates layout recalculations to this element */
}

/* Infinite scroll: prevent CLS when new items load above viewport */
.list-container {
  overflow-anchor: none; /* disable scroll anchoring - manage manually if needed */
}
```

### Fix 3: Font Loading Without Layout Shift

Web fonts cause CLS when:
1. `font-display: swap` is used and the fallback metrics differ significantly from the web font
2. The web font causes text reflow (character widths change)

**Option A: font-display: optional** (zero CLS, may not use web font on slow connections)

```css
@font-face {
  font-family: 'Brand';
  src: url('/fonts/brand.woff2') format('woff2');
  font-display: optional; /* use fallback if font isn't cached; no swap, no CLS */
}
```

**Option B: font-display: swap + size-adjust for metrics matching**

```css
/* First, measure fallback vs web font metrics using fontpie or f-mods.netlify.app */
@font-face {
  font-family: 'Brand-Fallback';
  src: local('Arial');
  /* Adjust fallback metrics to match Brand font exactly */
  size-adjust: 107%;
  ascent-override: 94%;
  descent-override: 24%;
  line-gap-override: 0%;
}

@font-face {
  font-family: 'Brand';
  src: url('/fonts/brand.woff2') format('woff2');
  font-display: swap;
}

/* Use both: browser uses fallback with adjusted metrics, swaps to Brand (no visible shift) */
body {
  font-family: 'Brand', 'Brand-Fallback', sans-serif;
}
```

Tools for calculating font override values: `fontpie` (npm), `next/font` (automatic).

### Fix 4: Animations That Don't Cause CLS

Animations using `transform` and `opacity` are compositor-only and do NOT cause layout
shifts. Animations of layout-triggering properties (top, left, width, height, margin,
padding) DO cause CLS.

```css
/* CAUSES CLS: animating layout properties */
.bad-animation {
  transition: top 300ms ease, height 300ms ease;
}

/* NO CLS: transform and opacity are compositor-only */
.good-animation {
  transition: transform 300ms ease, opacity 300ms ease;
}

/* Slide-in from below using transform (no CLS) */
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* Expand/collapse using scale instead of height */
.expandable {
  transform-origin: top;
  transition: transform 300ms ease, opacity 300ms ease;
}
.expandable.collapsed {
  transform: scaleY(0);
  opacity: 0;
}
```

**Exception**: Animations triggered by a user interaction (click, tap) within 500ms are
excluded from CLS scoring. The browser assumes user-initiated layout changes are expected.
