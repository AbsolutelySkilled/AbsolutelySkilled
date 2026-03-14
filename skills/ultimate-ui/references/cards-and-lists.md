<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with cards, list views, content grids, or collection layouts. -->

# Cards and Lists

## Card anatomy
- Container: border OR shadow (not both), border-radius, consistent padding 16-24px
- Title: 16-18px semibold; Description: 14px regular, secondary color, 2-3 lines max
- Metadata: 12-13px muted; Actions: bottom

```css
.card { border-radius: 8px; padding: 20px; background: #fff; display: flex; flex-direction: column; gap: 8px; }
.card__title { font-size: 17px; font-weight: 600; line-height: 1.4; color: #111827; margin: 0; }
.card__description { font-size: 14px; color: #6b7280; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin: 0; }
.card__meta { font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 6px; }
.card__actions { margin-top: auto; padding-top: 12px; display: flex; gap: 8px; }
```

## Card variants

```css
/* Flat - border only */
.card--flat { border: 1px solid #e5e7eb; box-shadow: none; }

/* Raised - shadow only */
.card--raised { border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); }

/* Image top */
.card--image { padding: 0; overflow: hidden; border: 1px solid #e5e7eb; }
.card--image .card__image { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }
.card--image .card__body { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 8px; }

/* Horizontal - image left, content right */
.card--horizontal { flex-direction: row; padding: 0; overflow: hidden; border: 1px solid #e5e7eb; }
.card--horizontal .card__image { width: 120px; min-width: 120px; object-fit: cover; display: block; }
.card--horizontal .card__body { padding: 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }

/* Interactive - entire card clickable */
.card--interactive { cursor: pointer; text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: box-shadow 200ms ease, transform 200ms ease; }
.card--interactive:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08); transform: translateY(-2px); }
.card--interactive .card__link { pointer-events: none; } /* avoid nested interactive elements */

/* Stat/metric */
.card--stat { padding: 20px 24px; border: 1px solid #e5e7eb; }
.card__stat-value { font-size: 32px; font-weight: 700; color: #111827; line-height: 1; margin: 0 0 4px; }
.card__stat-label { font-size: 13px; color: #6b7280; font-weight: 500; margin: 0; }
.card__stat-trend { font-size: 12px; font-weight: 600; margin-top: 8px; }
.card__stat-trend--up { color: #16a34a; }
.card__stat-trend--down { color: #dc2626; }
```

## Card grid layouts

```css
/* Auto-fill responsive */
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 20px; }

/* Fixed 3-column with breakpoints */
.card-grid--fixed { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 1024px) { .card-grid--fixed { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .card-grid--fixed { grid-template-columns: 1fr; } }

/* Masonry via CSS columns */
.card-grid--masonry { columns: 3 280px; column-gap: 20px; }
.card-grid--masonry > .card { break-inside: avoid; margin-bottom: 20px; }
```

## List views

```css
/* Simple border-bottom list */
.list { list-style: none; margin: 0; padding: 0; }
.list__item { border-bottom: 1px solid #e5e7eb; }
.list__item:last-child { border-bottom: none; }

/* Card list - each item is a horizontal card */
.list--card { display: flex; flex-direction: column; gap: 12px; list-style: none; margin: 0; padding: 0; }
.list--card .list__item { border: 1px solid #e5e7eb; border-radius: 8px; }

/* Compact */
.list--compact .list__item-inner { padding: 8px 12px; font-size: 13px; }

/* Selectable */
.list__item--selectable { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 150ms ease; }
.list__item--selectable:hover { background: #f9fafb; }
.list__item--selectable[aria-selected="true"] { background: #eff6ff; }
```

## List item anatomy

```css
/* Three-zone layout: left (avatar/icon) | content (title+desc) | right (meta/action) */
.list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; min-height: 64px; }
.list-item__left { flex: 0 0 40px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
.list-item__content { flex: 1; min-width: 0; } /* min-width: 0 enables text truncation */
.list-item__title { font-size: 14px; font-weight: 500; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
.list-item__desc { font-size: 13px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 2px 0 0; }
.list-item__right { flex: 0 0 auto; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9ca3af; }
```

## Infinite scroll

```js
const sentinel = document.querySelector('#load-more-sentinel');
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !isLoading && !isExhausted) loadMore();
  },
  { rootMargin: '200px' }
);
observer.observe(sentinel);
```

```css
.load-sentinel { height: 1px; width: 100%; }
.load-more-indicator { text-align: center; padding: 20px; font-size: 14px; color: #6b7280; }
.load-end-message { text-align: center; padding: 24px; font-size: 13px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
```

## Virtualized lists
- Only render visible items + buffer (3-5 above/below viewport)
- Libraries: `react-virtual`, `@tanstack/virtual`
- Virtualize when: >100 items or complex per-item rendering
- Set explicit `itemHeight` for best performance

## Load more patterns

| Pattern | Best for |
|---|---|
| "Load more" button | Search results, directories - user-controlled, better SEO |
| Pagination | Data tables, admin views - predictable, bookmarkable |
| Infinite scroll | Social feeds, media galleries - passive consumption |

```css
.btn-load-more { display: block; margin: 24px auto 0; padding: 10px 24px; font-size: 14px; font-weight: 500; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #374151; cursor: pointer; transition: background 150ms ease, border-color 150ms ease; }
.btn-load-more:hover { background: #f9fafb; border-color: #9ca3af; }
```

## Card hover effects - pick ONE, do not combine

```css
/* 1. Shadow increase */
.card--hover-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: box-shadow 200ms ease; }
.card--hover-shadow:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08); }

/* 2. Lift */
.card--hover-lift { transition: transform 200ms ease, box-shadow 200ms ease; }
.card--hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }

/* 3. Image zoom - scale inside overflow:hidden */
.card--hover-zoom .card__image-wrap { overflow: hidden; }
.card--hover-zoom .card__image { transition: transform 300ms ease; }
.card--hover-zoom:hover .card__image { transform: scale(1.03); }

/* 4. Border color */
.card--hover-border { border: 1px solid #e5e7eb; transition: border-color 200ms ease; }
.card--hover-border:hover { border-color: #3b82f6; }
```

## Card skeleton loading

```css
@keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.skeleton-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.skeleton-card__image { width: 100%; aspect-ratio: 16 / 9; background: #e5e7eb; animation: skeleton-pulse 1.5s ease-in-out infinite; }
.skeleton-card__body { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-bar { height: 12px; border-radius: 4px; background: #e5e7eb; animation: skeleton-pulse 1.5s ease-in-out infinite; }
.skeleton-bar--title { height: 16px; width: 60%; }
.skeleton-bar--desc-1 { width: 100%; }
.skeleton-bar--desc-2 { width: 80%; }
.skeleton-bar--meta { height: 10px; width: 40%; }
```

## Empty collection state

```css
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; color: #6b7280; }
.empty-state__illustration { width: 80px; height: 80px; margin-bottom: 16px; opacity: 0.5; }
.empty-state__title { font-size: 16px; font-weight: 600; color: #374151; margin: 0 0 6px; }
.empty-state__body { font-size: 14px; color: #6b7280; margin: 0 0 20px; max-width: 320px; }
```

Scenarios: No items yet (CTA to add), no search results (adjust filters), error loading (retry button).

## Responsive card behavior

```css
@media (max-width: 640px) {
  .card-grid { grid-template-columns: 1fr; }
  .card--horizontal { flex-direction: column; }
  .card--horizontal .card__image { width: 100%; height: 160px; }

  /* Horizontal scroll carousel on mobile */
  .card-carousel { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .card-carousel::-webkit-scrollbar { display: none; }
  .card-carousel > .card { flex: 0 0 280px; scroll-snap-align: start; }
}
```

## Common card/list mistakes
- Varying card heights in a grid - use `min-height` on card body or fixed `aspect-ratio` for images
- No hover state on interactive cards - every clickable card must have a visible hover effect
- Clickable card with links inside - nested interactive elements break accessibility
- No loading state - content popping in without skeletons feels broken
- Too much text on cards - use `-webkit-line-clamp: 3` to enforce 2-3 line max
- Inconsistent card padding - pick one value and apply everywhere
- No empty state - a blank grid leaves users confused
