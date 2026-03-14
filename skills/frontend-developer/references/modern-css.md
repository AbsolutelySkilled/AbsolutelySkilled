<!-- Part of the frontend-developer AbsolutelySkilled skill. Load this file when working with modern CSS patterns and layout. -->

# Modern CSS Reference

## Container Queries

Style elements based on their container's size, not the viewport. Solves the component reusability problem with media queries.

```css
/* 1. Define a containment context */
.card-wrapper {
  container-type: inline-size; /* tracks width changes */
  container-name: card;        /* optional name for targeting */
}

/* 2. Query the container */
@container card (min-width: 400px) {
  .card { flex-direction: row; }
}

/* Without a name, queries the nearest ancestor with containment */
@container (min-width: 600px) {
  .sidebar-widget { font-size: 1.2rem; }
}
```

`container-type` values:
- `inline-size`: tracks width (most common)
- `size`: tracks width and height (use only if needed - blocks intrinsic sizing)
- `normal`: enables style queries only, no size queries

**Container vs media queries**: Use media queries for page-level layout; use container queries for reusable components whose context varies. A card component should not need to know if it's in a sidebar or a main content area.

### Style queries (newer)
Query custom property values on a container:
```css
.card-wrapper { --variant: featured; }

@container style(--variant: featured) {
  .card { border: 2px solid gold; }
}
```

---

## Cascade Layers

`@layer` provides explicit control over the cascade, making specificity battles a thing of the past.

```css
/* Declare layer order first - earlier = lower priority */
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  a { color: var(--color-link); }
}

@layer components {
  .btn { padding: 0.5rem 1rem; border-radius: 4px; }
}

@layer utilities {
  .mt-4 { margin-top: 1rem; }
}
```

Rules: unlayered styles always win over layered styles (same specificity). Within layers, later declaration wins. This means you can import third-party CSS into a layer and override it easily:

```css
/* Third-party CSS is locked into 'vendor' layer - your styles always win */
@layer vendor {
  @import url('https://cdn.example.com/library.css');
}

@layer components {
  /* This overrides vendor styles regardless of their specificity */
  .library-button { color: var(--color-primary); }
}
```

### Reset strategy with layers
```css
@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  img, video { max-width: 100%; display: block; }
  h1, h2, h3, h4 { text-wrap: balance; }
  p { text-wrap: pretty; }
}
```

---

## New Selectors

### :has() - the "parent selector"
```css
/* Card that contains an image gets different padding */
.card:has(img) { padding: 0; }

/* Form fields that contain invalid inputs */
.form-group:has(input:invalid) label { color: red; }

/* Navigation with an open dropdown */
nav:has(.dropdown[open]) { z-index: 100; }

/* Sibling targeting - li after a checked checkbox */
li:has(input:checked) + li { opacity: 0.5; }
```

### :is() - forgiving selector list
Reduces repetition, takes the highest specificity of its arguments:
```css
/* Old way */
h1 a, h2 a, h3 a, h4 a { color: inherit; }

/* New way */
:is(h1, h2, h3, h4) a { color: inherit; }
```

### :where() - zero-specificity version of :is()
```css
/* Good for resets - zero specificity, easy to override */
:where(h1, h2, h3) { font-weight: bold; }
/* Overriding is trivial since :where has 0 specificity */
.article h2 { font-weight: 400; }
```

### :not() level 4 - complex selectors and lists
```css
/* Old: only simple selectors allowed inside :not() */
/* New: full selector lists supported */
a:not(.btn, .nav-link, [aria-current]) { text-decoration: underline; }

/* Every list item except the last */
li:not(:last-child) { border-bottom: 1px solid var(--border); }
```

### Native CSS nesting
```css
/* No preprocessor needed */
.card {
  padding: 1rem;

  /* Nested rule - & is explicit parent reference */
  & .title { font-size: 1.25rem; }
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

  /* At-rules can be nested too */
  @media (min-width: 768px) {
    padding: 2rem;
  }
}
```

---

## Subgrid

Allows nested elements to participate in the parent grid's tracks, solving the alignment-across-components problem.

```css
/* Old way: each card is its own grid, headers don't align across cards */

/* New way: cards share the parent's row tracks */
.grid {
  display: grid;
  grid-template-rows: auto 1fr auto; /* header, content, footer */
  gap: 1rem;
}

.card {
  display: grid;
  /* Inherit the parent's row tracks */
  grid-row: span 3;
  grid-template-rows: subgrid;
}

/* Now card-header, card-body, card-footer align across all cards automatically */
```

For column subgrid, use `grid-template-columns: subgrid` on an item that spans multiple columns.

**When to use**: Cards in a grid that need aligned internal sections (consistent header/footer heights); form layouts where labels and inputs must align across rows; any time sibling elements inside different containers need to share alignment.

---

## Modern Layout

### Flexbox vs Grid decision tree
- **Flexbox**: one-dimensional layout, content-driven sizing, distributing space along one axis
- **Grid**: two-dimensional layout, layout-driven sizing, precise placement in rows AND columns simultaneously
- When unsure: if you're thinking in rows OR columns - flex; rows AND columns - grid

### auto-fit vs auto-fill
```css
/* auto-fill: creates as many tracks as fit, even empty ones */
.grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

/* auto-fit: collapses empty tracks, items stretch to fill */
.grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
```
Use `auto-fit` when you want fewer items to expand; use `auto-fill` when empty cells should maintain column widths.

### Named grid areas
Use `grid-template-areas` for readable page layouts. Assign elements with `grid-area: name`. Redefine the template in a media query for responsive reflow - no element reordering needed.

### aspect-ratio
```css
/* Old way: padding-top hack (56.25% for 16:9) */
/* New way: */
.video-embed { aspect-ratio: 16 / 9; width: 100%; }
.avatar { aspect-ratio: 1; width: 48px; }
.card-image { aspect-ratio: 4 / 3; object-fit: cover; }
```

---

## Logical Properties

Physical properties (`margin-left`, `padding-top`) break in RTL languages and vertical writing modes. Logical properties adapt automatically.

| Physical | Logical equivalent | Maps to (LTR) |
|---|---|---|
| `margin-left` | `margin-inline-start` | left |
| `margin-right` | `margin-inline-end` | right |
| `margin-top` | `margin-block-start` | top |
| `margin-bottom` | `margin-block-end` | bottom |
| `padding-left/right` | `padding-inline` | shorthand |
| `padding-top/bottom` | `padding-block` | shorthand |
| `border-left` | `border-inline-start` | left border |
| `width` | `inline-size` | width in LTR |
| `height` | `block-size` | height in LTR |

Use `margin-inline-start` instead of `margin-left`, `text-align: start` instead of `text-align: left`, etc. Physical properties remain fine for truly directional things (e.g., a drop shadow always to the bottom-right).

---

## Modern Color

### oklch
Perceptually uniform color space - equal numeric changes produce equal-looking changes. Better for generating color scales and accessible palettes.

```css
:root {
  /* oklch(lightness chroma hue) */
  --color-primary: oklch(55% 0.2 250);       /* medium blue */
  --color-primary-light: oklch(80% 0.15 250); /* lighter, same hue */
  --color-primary-dark: oklch(35% 0.2 250);   /* darker, same hue */
}
```

### color-mix()
```css
:root {
  --color-primary: oklch(55% 0.2 250);

  /* 20% lighter */
  --color-primary-100: color-mix(in oklch, var(--color-primary) 20%, white);

  /* Semi-transparent */
  --color-overlay: color-mix(in srgb, black 50%, transparent);
}
```

### Relative color syntax
Derive colors from existing ones: `oklch(from var(--brand) calc(l + 0.2) calc(c * 0.5) h)` - same hue, lighter, less saturated.

### light-dark()
Set `color-scheme: light dark` on `:root`, then use `light-dark(#light, #dark)` for any property. No `@media (prefers-color-scheme)` needed per property.

---

## Responsive Design Without Breakpoints

### clamp() for fluid sizing
```css
/* clamp(minimum, preferred, maximum) */
/* preferred is usually a viewport-relative value */
:root {
  --font-size-body: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --font-size-h1: clamp(2rem, 1.5rem + 2.5vw, 4rem);
  --spacing-section: clamp(2rem, 5vw, 8rem);
}

h1 { font-size: var(--font-size-h1); }
```

Use utopia.fyi to generate fluid type scales. Container query units (`cqi`, `cqw`) size relative to container instead of viewport.

---

## View Transitions API

Animate between DOM states and page navigations natively - no JS animation library needed.

### Same-document transitions
```js
// Wrap DOM mutation in startViewTransition
document.startViewTransition(() => {
  // Update the DOM
  listEl.innerHTML = newContent;
});
```

CSS controls the animation:
```css
/* Default: fade. Customize: */
::view-transition-old(root) {
  animation: slide-out 300ms ease-in forwards;
}
::view-transition-new(root) {
  animation: slide-in 300ms ease-out forwards;
}

/* Animate specific elements independently */
.hero-image {
  view-transition-name: hero; /* must be unique per page */
}
::view-transition-old(hero),
::view-transition-new(hero) {
  animation-duration: 500ms;
}
```

For cross-document (MPA) transitions, use `@view-transition { navigation: auto; }` in both pages - no JS needed.

Always wrap in `@media (prefers-reduced-motion: no-preference)` or check `window.matchMedia`.

---

## Scroll-Driven Animations

Animate elements based on scroll position using pure CSS - no scroll event listeners needed.

### scroll() - link to scroll position
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animated-section {
  animation: fade-in linear;
  animation-timeline: scroll(); /* progress = page scroll progress */
  animation-range: entry 0% entry 50%; /* animate during this range */
}
```

### view() - link to element's position in viewport
```css
.card {
  animation: fade-in linear both;
  animation-timeline: view(); /* progress based on element entering/leaving viewport */
  animation-range: entry 10% entry 60%; /* start when 10% visible, end at 60% */
}
```

Combine `scroll(root)` with a `scaleX` keyframe for a pure-CSS reading progress bar. Check `animation-timeline` browser support before using in production.

---

## Custom Properties

Define tokens on `:root`, override on `[data-theme="dark"]` - children inherit automatically. Works with `calc()` for dynamic computations.

### @property - typed and animatable custom properties
```css
/* Register a typed custom property */
@property --hue {
  syntax: '<number>';       /* type: number, length, color, percentage, etc. */
  inherits: false;
  initial-value: 250;
}

/* Now it can be animated! */
.colorful {
  background: oklch(60% 0.2 var(--hue));
  transition: --hue 300ms;
}
.colorful:hover { --hue: 150; } /* animates smoothly */
```

Unregistered custom properties cannot be animated because the browser doesn't know their type.

---

## Performance

### contain
`contain: layout paint` tells the browser this element is independent - changes don't affect outside. `contain: strict` adds size containment.

### content-visibility
`content-visibility: auto` skips rendering off-screen content entirely. Pair with `contain-intrinsic-size: auto 500px` to prevent CLS. Can reduce initial render time by 50%+ on content-heavy pages.

### will-change - use sparingly
`will-change: transform, opacity` promotes to compositor layer. Consumes GPU memory - add/remove programmatically before/after animation. Never leave on permanently or apply to many elements.

### Avoid triggering layout
Properties that trigger layout (reflow): `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`. Compositor-only (no layout/paint): `transform`, `opacity`, `filter`. Always animate `transform`/`opacity` instead of geometric properties.
