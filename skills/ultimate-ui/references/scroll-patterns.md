<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with scroll behavior, sticky elements, scroll-snap, infinite scroll, or pagination. -->

# Scroll Patterns

## Smooth scrolling

```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
```

## Sticky elements
- Sticky header: `position: sticky; top: 0`
- Sticky sidebar: `top: <header-height + gap>` (e.g. `top: 72px`)
- Sticky table header: `position: sticky; top: 0; z-index: 1` on `<thead> th`
- Sticky bottom bar (mobile): `position: sticky; bottom: 0`
- Add shadow when stuck - detect with `IntersectionObserver` on a sentinel element

```css
.site-header { position: sticky; top: 0; z-index: 100; background: #fff; transition: box-shadow 0.2s ease; }
.site-header.is-stuck { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }

.sidebar { position: sticky; top: 72px; max-height: calc(100vh - 72px); overflow-y: auto; }

.data-table thead th { position: sticky; top: 0; z-index: 1; background: #f5f5f5; border-bottom: 2px solid #ddd; }
```

```js
const sentinel = document.querySelector('.header-sentinel');
const header = document.querySelector('.site-header');
const observer = new IntersectionObserver(
  ([entry]) => header.classList.toggle('is-stuck', !entry.isIntersecting),
  { threshold: 0 }
);
observer.observe(sentinel);
```

## Scroll-snap
- Container: `scroll-snap-type: x mandatory` (or `y`, `proximity`)
- Children: `scroll-snap-align: start` (or `center`, `end`)
- Add `overscroll-behavior: contain` to prevent page scroll bleeding

```css
/* Horizontal card carousel */
.carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scroll-padding: 0 24px;
  padding: 0 24px;
  -webkit-overflow-scrolling: touch;
}
.carousel__item { flex: 0 0 280px; scroll-snap-align: start; border-radius: 8px; background: #fff; }

/* Full-page vertical sections */
.page-sections { height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory; }
.section { height: 100vh; scroll-snap-align: start; }
```

## Scrollbar styling

```css
/* Firefox */
.scrollable { scrollbar-width: thin; scrollbar-color: #999 #f0f0f0; }

/* WebKit */
.scrollable::-webkit-scrollbar { width: 8px; height: 8px; }
.scrollable::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
.scrollable::-webkit-scrollbar-thumb { background: #999; border-radius: 4px; }
.scrollable::-webkit-scrollbar-thumb:hover { background: #666; }

/* Hide but keep scrolling */
.no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
```

## Infinite scroll

```html
<ul class="feed-list" id="feed-list"></ul>
<div class="sentinel" id="scroll-sentinel" aria-hidden="true"></div>
<div class="loading-indicator" id="loading" hidden>Loading...</div>
```

```css
.sentinel { height: 1px; margin-top: -200px; } /* trigger 200px before bottom */
.loading-indicator { display: flex; justify-content: center; padding: 24px; }
.skeleton-item { height: 80px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; margin-bottom: 12px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
```

```js
let page = 1, loading = false;
const observer = new IntersectionObserver(
  async ([entry]) => {
    if (!entry.isIntersecting || loading) return;
    loading = true;
    loadingEl.hidden = false;
    await fetchAndAppendItems(++page);
    loadingEl.hidden = true;
    loading = false;
  },
  { rootMargin: '200px' }
);
observer.observe(sentinel);
// Stop: observer.unobserve(sentinel);
```

## Pagination vs Load More vs Infinite Scroll

| Pattern | Best for | Pros | Cons |
|---|---|---|---|
| Pagination | Search results, catalogs | SEO, shareable URLs, predictable | More clicks |
| Load more | Social feeds, comments | Simple, controllable | No URL state |
| Infinite scroll | Feeds, discovery | Effortless browsing | No footer, hard to bookmark |

## Back to top button
- Show after scrolling ~2 viewport heights; fixed bottom-right 48px circle; fade in/out

```css
.back-to-top { position: fixed; bottom: 32px; right: 32px; width: 48px; height: 48px; border-radius: 50%; background: #333; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); opacity: 0; pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease; z-index: 200; }
.back-to-top.is-visible { opacity: 1; pointer-events: auto; }
.back-to-top:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.25); }
```

```js
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 2);
}, { passive: true });
backToTop.addEventListener('click', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
});
```

## Scroll-linked animations (use sparingly)

```css
.reading-progress { position: fixed; top: 0; left: 0; height: 3px; background: #0070f3; width: 0%; z-index: 999; transition: width 0.1s linear; }

.fade-in-section { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-in-section.is-visible { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) { .fade-in-section { opacity: 1; transform: none; transition: none; } }
```

```js
window.addEventListener('scroll', () => {
  progressBar.style.width = `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`;
}, { passive: true });

const fadeObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => e.target.classList.toggle('is-visible', e.isIntersecting)),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in-section').forEach(el => fadeObserver.observe(el));
```

## Horizontal scroll with fade edges

```css
.h-scroll-wrapper { position: relative; }
.h-scroll-wrapper::before, .h-scroll-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40px; pointer-events: none; z-index: 1; }
.h-scroll-wrapper::before { left: 0; background: linear-gradient(to right, #fff 0%, transparent 100%); }
.h-scroll-wrapper::after  { right: 0; background: linear-gradient(to left, #fff 0%, transparent 100%); }

.h-scroll { display: flex; gap: 12px; overflow-x: auto; scroll-padding: 0 24px; padding: 0 24px 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.h-scroll::-webkit-scrollbar { display: none; }
.h-scroll > * { flex: 0 0 auto; }
```

## Overflow handling

```css
.modal-body { overflow-y: auto; max-height: calc(90vh - 120px); overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
body.modal-open { overflow: hidden; }
```

## Scroll restoration

```js
history.scrollRestoration = 'manual';
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem(`scroll:${location.pathname}`, window.scrollY);
});
window.addEventListener('load', () => {
  const saved = sessionStorage.getItem(`scroll:${location.pathname}`);
  if (saved) window.scrollTo({ top: parseInt(saved, 10), behavior: 'auto' });
});
```

## Virtual scrolling
- For lists with >100 items or complex per-item rendering
- Only render visible items + buffer (10-20 above/below viewport)
- Libraries: `@tanstack/virtual`, `react-virtuoso`; requires known/estimated item heights

```js
import { useVirtualizer } from '@tanstack/react-virtual';
const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 72,
  overscan: 10,
});
```

## Common scroll mistakes
- Scroll hijacking - overriding native scroll behavior disrupts users
- No sticky header shadow - users can't tell it's sticky without a visual cue
- Infinite scroll with no footer access - always provide a way to reach the footer
- Horizontal scroll with no hint - show partial item or gradient to signal more content
- JS scroll listeners instead of IntersectionObserver - always prefer `IntersectionObserver` or `{ passive: true }`
- Not preserving scroll position in SPAs - breaks the back-button mental model
