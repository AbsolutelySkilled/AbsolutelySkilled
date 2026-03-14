<!-- Part of the responsive-design AbsolutelySkilled skill. Load this file when
     working with specific responsive layout patterns, reflow strategies, or
     needing copy-paste breakpoint CSS for common UI structures. -->

# Breakpoint Patterns

Common responsive layout patterns with production-ready CSS. All patterns follow
mobile-first convention: base styles target mobile, `min-width` queries expand
for larger screens.

---

## Page-level layout patterns

### Holy grail (header, sidebar, content, aside, footer)

```css
.page {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
}

@media (min-width: 1024px) {
  .page {
    grid-template-columns: clamp(200px, 20%, 280px) 1fr clamp(160px, 16%, 240px);
    grid-template-areas:
      "header  header  header"
      "sidebar main    aside"
      "footer  footer  footer";
  }
}

.page-header  { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main    { grid-area: main; }
.page-aside   { grid-area: aside; }
.page-footer  { grid-area: footer; }
```

### Dashboard: sidebar + content

```css
.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.dashboard-sidebar {
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-content {
  flex: 1;
  padding: 16px;
}

@media (min-width: 1024px) {
  .dashboard {
    flex-direction: row;
  }

  .dashboard-sidebar {
    width: 256px;
    flex-shrink: 0;
    height: 100dvh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    border-bottom: none;
    border-right: 1px solid #e5e7eb;
  }

  .dashboard-content {
    padding: 32px;
    overflow-y: auto;
  }
}
```

### Centered content with max-width

```css
.content-wrapper {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 48px);
}

/* Narrow reading column */
.prose-wrapper {
  width: 100%;
  max-width: 720px;
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 32px);
}
```

> Reading content max-width: 65-75 characters (~720px). App/dashboard: 1280px.
> Wide/full-bleed sections: no max-width, but pad content inside them.

---

## Component-level patterns

### Card: stacked to horizontal

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.card-media {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@container (min-width: 480px) {
  .card {
    flex-direction: row;
  }

  .card-media {
    width: 200px;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
  }
}

@container (min-width: 640px) {
  .card-media {
    width: 280px;
  }

  .card-body {
    padding: 24px;
    gap: 12px;
  }
}
```

### Form: stacked to inline labels

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .form-group {
    flex-direction: row;
    align-items: baseline;
    gap: 16px;
  }

  .form-group label {
    width: 160px;
    flex-shrink: 0;
    text-align: right;
    padding-top: 2px;
  }

  .form-group > *:not(label) {
    flex: 1;
  }
}
```

### Modal: full-screen on mobile, centered on desktop

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  z-index: 100;
}

.modal {
  width: 100%;
  max-height: 95dvh;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  overflow-y: auto;
  padding: 24px 16px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

@media (min-width: 640px) {
  .modal-overlay {
    align-items: center;
    padding: 24px;
  }

  .modal {
    width: auto;
    min-width: 400px;
    max-width: 600px;
    max-height: 90dvh;
    border-radius: 12px;
    padding: 32px;
  }
}
```

### Table: scrollable wrapper on mobile

```css
.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* Visual cue that content is scrollable */
  background:
    linear-gradient(to right, #fff 30%, rgba(255,255,255,0)),
    linear-gradient(to right, rgba(255,255,255,0), #fff 70%) right,
    radial-gradient(farthest-side at 0 50%, rgba(0,0,0,0.12), transparent),
    radial-gradient(farthest-side at 100% 50%, rgba(0,0,0,0.12), transparent) right;
  background-repeat: no-repeat;
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-attachment: local, local, scroll, scroll;
}

.table {
  width: 100%;
  min-width: 600px;  /* enforce minimum so columns don't collapse */
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
}
```

> The `background` scroll-shadow technique provides a visual affordance that
> the table can be scrolled horizontally, without JavaScript.

---

## Reflow strategies

### Priority+ navigation (show/hide items based on space)

Use container queries to progressively show nav items as width grows.

```css
.nav-container {
  container-type: inline-size;
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Hide lower-priority links by default */
.nav-item[data-priority="2"],
.nav-item[data-priority="3"] {
  display: none;
}

@container (min-width: 480px) {
  .nav-item[data-priority="2"] {
    display: flex;
  }
}

@container (min-width: 720px) {
  .nav-item[data-priority="3"] {
    display: flex;
  }
}
```

### Reverse source order for mobile

When visual order on desktop doesn't match reading/DOM order needed for mobile,
use CSS Grid `order` property rather than duplicating HTML.

```css
.article-layout {
  display: grid;
  grid-template-areas:
    "image"
    "content"
    "meta";
}

@media (min-width: 768px) {
  .article-layout {
    grid-template-columns: 1fr 360px;
    grid-template-areas:
      "content  image"
      "meta     image";
    gap: 32px;
  }
}

.article-image   { grid-area: image; }
.article-content { grid-area: content; }
.article-meta    { grid-area: meta; }
```

### Responsive hero with text overlay

```css
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: clamp(320px, 50vw, 600px);
  padding: clamp(32px, 6vw, 96px) clamp(16px, 4vw, 48px);
  background-color: #0f172a;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.hero-title {
  font-size: clamp(2rem, 1rem + 5vw, 5rem);
  line-height: 1.1;
  color: #ffffff;
}

@media (min-width: 768px) {
  .hero {
    justify-content: center;
    min-height: clamp(400px, 60vh, 700px);
  }
}
```

---

## Viewport unit reference

| Unit | What it represents | When to use |
|------|-------------------|-------------|
| `vw` | 1% of viewport width | Fluid font sizes, hero dimensions |
| `vh` | 1% of viewport height | Full-screen sections (use `dvh` instead) |
| `dvh` | 1% of dynamic viewport height | Full-screen mobile (accounts for browser chrome) |
| `svh` | 1% of small viewport height | Conservative full-screen (never taller than visible) |
| `lvh` | 1% of large viewport height | Full-screen desktop where browser chrome doesn't shift |
| `cqw` | 1% of container query width | Fluid sizing inside `@container` queries |
| `cqi` | 1% of container inline size | Preferred over `cqw` for writing-mode independence |

> Always prefer `dvh` over `vh` for full-screen mobile layouts. `vh` on iOS
> Safari historically measured the viewport without browser chrome, causing
> elements to be obscured. `dvh` updates dynamically as chrome shows/hides.

---

## Testing checklist

- [ ] 320px - minimum supported Android width
- [ ] 375px - iPhone SE / standard iPhone width
- [ ] 430px - iPhone Pro Max width
- [ ] 768px - tablet portrait
- [ ] 900px - the "awkward" size many breakpoints miss
- [ ] 1024px - tablet landscape / small laptop
- [ ] 1280px - standard desktop
- [ ] 1440px - large desktop
- [ ] Landscape orientation on mobile
- [ ] With browser zoom at 150% and 200%
- [ ] With OS font size set to "Large" or "Extra Large"
