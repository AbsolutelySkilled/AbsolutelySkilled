<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     working with grids, spacing, layout systems, or page structure. -->

# Grids, Spacing, and Layout

## The 8px Spacing Scale

Base unit: 8px. All spacing values are multiples:

| Value | Multiplier | CSS custom property     | Tailwind class | Use case                          |
|-------|-----------|-------------------------|----------------|-----------------------------------|
| 4px   | 0.5       | `--spacing-1: 4px`      | `gap-1`        | Icon-text gap, inline elements    |
| 8px   | 1         | `--spacing-2: 8px`      | `gap-2`        | Form field gaps, list item padding|
| 12px  | 1.5       | `--spacing-3: 12px`     | `gap-3`        | Button padding, small card padding|
| 16px  | 2         | `--spacing-4: 16px`     | `gap-4`        | Card padding, component gaps      |
| 24px  | 3         | `--spacing-6: 24px`     | `gap-6`        | Section padding, grid gaps        |
| 32px  | 4         | `--spacing-8: 32px`     | `gap-8`        | Between components                |
| 48px  | 6         | `--spacing-12: 48px`    | `gap-12`       | Section breaks                    |
| 64px  | 8         | `--spacing-16: 64px`    | `gap-16`       | Major section gaps                |
| 96px  | 12        | `--spacing-24: 96px`    | `gap-24`       | Page section separation           |

```css
:root {
  --spacing-1:  4px;
  --spacing-2:  8px;
  --spacing-3:  12px;
  --spacing-4:  16px;
  --spacing-6:  24px;
  --spacing-8:  32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-24: 96px;
}
```

## Spacing Workflow and Principles

**The 3-value shortcut:** for most UIs you only need three spacing values:
- **0.5rem (8px)** - closely related elements (icon + text, title + subtitle)
- **1rem (16px)** - padding, button groups, same-group items
- **1.5-2rem (24-32px)** - separating distinct groups/sections

**Workflow: group then separate.** Break the UI into logical groups first. Apply small spacing within groups. Apply larger spacing between groups. This is the core of spacing design.

**Inner spacing < outer spacing, always.** The gap between an icon and text inside a button must be smaller than the button's padding. This applies to any container: inner gaps should never exceed container padding.

**Optical weight in buttons:** vertical padding should be LESS than horizontal padding. Text has more visual noise horizontally (varying letter widths like I vs W) than vertically (constrained by cap height). Equal padding makes buttons look bloated. Rule of thumb: vertical padding = X, horizontal = 2X or 3X.

**Consistency > correctness.** Even imperfect spacing looks acceptable if it's consistent throughout. Inconsistent spacing is the #1 tell of unpolished UI.

**Border-radius should match padding optically.** If padding is 1rem, use border-radius from the same scale (0.5rem, 0.75rem, 1rem). They create visual harmony together.

---

## Container and Max-Widths

| Context           | Max-width | Notes                              |
|-------------------|-----------|------------------------------------|
| Full app layout   | 1440px    | Outermost shell                    |
| Content area      | 1280px    | Main page content                  |
| Reading content   | 720px     | 65-75 characters per line          |
| Narrow forms      | 480px     | Login, signup, settings sub-forms  |

Always center with `margin: 0 auto`.

Horizontal padding by breakpoint:
- Mobile (< 640px): `padding-inline: 16px`
- Tablet (640px - 1023px): `padding-inline: 24px`
- Desktop (>= 1024px): `padding-inline: 32px`

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 16px;
}

@media (min-width: 640px) {
  .container { padding-inline: 24px; }
}

@media (min-width: 1024px) {
  .container { padding-inline: 32px; }
}

.container--content  { max-width: 1280px; }
.container--reading  { max-width: 720px; }
.container--narrow   { max-width: 480px; }
```

---

## CSS Grid Patterns

### 1. Auto-fill Responsive Card Grid

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 24px;
}
```

### 2. Sidebar + Main (two-column)

```css
.sidebar-main {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
}
```

### 3. Sidebar + Main + Aside (three-column)

```css
.three-column {
  display: grid;
  grid-template-columns: 240px 1fr 240px;
  gap: 32px;
}
```

### 4. Dashboard Grid with Named Areas

```css
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  min-height: 100vh;
}

.dashboard__sidebar { grid-area: sidebar; }
.dashboard__topbar  { grid-area: topbar; }
.dashboard__content { grid-area: content; }
```

### 5. Equal Three-Column Grid

```css
.equal-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

---

## Breaking the Grid

Predictable, symmetric layouts are the visual signature of AI-generated UIs. For marketing pages, landing pages, and creative contexts, intentional grid-breaking creates visual interest.

**Important**: Grid-breaking is for expressive contexts (landing pages, marketing sites, portfolios). App UIs (dashboards, forms, data tables) should stay systematic and predictable.

### Asymmetric Two-Column

```css
/* 40/60 split - content left, visual right */
.asymmetric {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 64px;
  align-items: center;
}

/* 30/70 split - narrow sidebar emphasis */
.asymmetric--narrow {
  grid-template-columns: 1fr 2.5fr;
}

@media (max-width: 768px) {
  .asymmetric,
  .asymmetric--narrow {
    grid-template-columns: 1fr;
  }
}
```

### Overlapping Elements

```css
/* Image overlapping a content card */
.overlap-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.overlap-section__image {
  border-radius: 16px;
  z-index: 1;
}

.overlap-section__content {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 48px;
  margin-left: -64px; /* overlap into image column */
  z-index: 2;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}
```

### Off-Grid Accent Elements

```css
/* Decorative element that breaks the container */
.section-with-accent {
  position: relative;
  overflow: visible; /* allow children to escape */
}

.accent-blob {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, hsla(260, 80%, 60%, 0.15), transparent 70%);
  top: -100px;
  right: -80px;
  pointer-events: none;
  z-index: 0;
}

/* Rotated accent card */
.accent-card--tilted {
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
}
.accent-card--tilted:hover {
  transform: rotate(0deg);
}
```

### Full-Bleed Elements

```css
/* Element that breaks out of a centered container */
.container { max-width: 1200px; margin: 0 auto; }

.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 96px 0;
}

.full-bleed__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Diagonal Flow

```css
/* Angled section divider */
.angled-section {
  position: relative;
  padding: 120px 0 96px;
  background: var(--color-surface-alt);
}

.angled-section::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  height: 80px;
  background: inherit;
  clip-path: polygon(0 50%, 100% 0, 100% 100%, 0 100%);
}
```

---

## Responsive Layout Thinking

Before writing CSS, map your layout as a parent-child tree. Every design breaks into rows and columns - responsive design is about dynamically moving boxes between them as screen width changes.

**Sketch breakpoints first.** Rough sketches of mobile/tablet/desktop layouts before coding. Don't figure out responsive behavior in the code editor - sunk cost fallacy will trap you into "good enough" solutions.

**Default rule: use flexbox for everything.** Switch to grid only when you specifically need rigid, equal-size structure (card grids, data layouts). Flexbox is the "cool parent" - children choose their size. Grid is the "strict parent" - children obey.

**The go-to flex shorthand:** `flex: 1 1 auto` - items start at their natural size, then grow/shrink based on available space. This single line handles most responsive needs.

**Grid's superpower:** equal-size cards regardless of column count. A 3-column grid where one card drops to 2 columns? Cards stay the same width. With flex, they'd stretch unevenly.

---

## Flexbox Patterns

### 1. Horizontal Nav Bar

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline: 24px;
  height: 64px;
}

.nav__logo { margin-inline-end: auto; }
```

### 2. Card - Image Left, Content Right

```css
.media-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.media-card__image {
  flex: 0 0 120px;
  width: 120px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

.media-card__body {
  flex: 1 1 0;
  min-width: 0; /* prevents text overflow */
}
```

### 3. Centering (the right way)

```css
/* Absolute center - both axes */
.center-both {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Vertical center only */
.center-vertical {
  display: flex;
  align-items: center;
}
```

### 4. Space-Between Header

```css
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 16px;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

---

## Common Layout Patterns

### 1. Holy Grail (header + sidebar + main + footer)

```css
.holy-grail {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

.holy-grail__header  { grid-area: header; }
.holy-grail__sidebar { grid-area: sidebar; }
.holy-grail__main    { grid-area: main; padding: 32px; }
.holy-grail__footer  { grid-area: footer; }
```

### 2. Dashboard (sidebar nav + top bar + grid content)

```css
.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  min-height: 100vh;
}

.app-shell__sidebar  { grid-area: sidebar; overflow-y: auto; }
.app-shell__topbar   { grid-area: topbar; position: sticky; top: 0; z-index: 10; }
.app-shell__content  { grid-area: content; padding: 32px; overflow-y: auto; }
```

### 3. Marketing Page (full-width sections, centered content)

```css
.marketing-section {
  width: 100%;
  padding-block: 96px;
  padding-inline: 32px;
}

.marketing-section__inner {
  max-width: 1280px;
  margin-inline: auto;
}

.marketing-section--hero .marketing-section__inner {
  max-width: 720px;
  text-align: center;
}
```

### 4. Settings Page (sidebar nav + form content)

```css
.settings-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 48px;
  max-width: 1024px;
  margin-inline: auto;
  padding: 48px 32px;
}

.settings-layout__form {
  max-width: 480px;
}
```

### 5. Blog / Docs (narrow centered content)

```css
.prose-layout {
  max-width: 720px;
  margin-inline: auto;
  padding-block: 64px;
  padding-inline: 24px;
}

.prose-layout p,
.prose-layout li {
  line-height: 1.75;
}
```

---

## Responsive Breakpoints

| Name | Min-width | Typical device                    |
|------|-----------|-----------------------------------|
| sm   | 640px     | Large phone landscape             |
| md   | 768px     | Tablet portrait                   |
| lg   | 1024px    | Tablet landscape / small laptop   |
| xl   | 1280px    | Desktop                           |
| 2xl  | 1536px    | Large desktop                     |

**Mobile-first rule:** Write base styles for mobile (`< 640px`), then override with `min-width` media queries.

```css
/* Base: mobile */
.grid { grid-template-columns: 1fr; gap: 16px; }

/* sm */
@media (min-width: 640px)  { .grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }

/* lg */
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
```

---

## Gap Consistency Rules

- Same context = same gap. Every card in a grid uses identical gap values.
- Tighter gap = more related:
  - 4px - 8px: icon and its label, button icon and text
  - 16px: form fields within a group
  - 24px: cards in a grid, items in a list
  - 48px: between distinct sections on a page
- Vertical rhythm: use a single consistent `gap` or `margin-bottom` value for all paragraphs and headings within a content block (1.5rem or 24px is standard).

---

## Common Spacing Mistakes

1. Using `margin` instead of `gap` for flex/grid child spacing - gap is always preferred.
2. Different `padding` values on cards in the same grid (pick one and use it everywhere).
3. Arbitrary pixel values not on the 8px scale (e.g., `padding: 11px` or `margin: 22px`).
4. Insufficient whitespace between sections - sections visually merge into one block; use at least 48px-96px between major sections.
5. Too-tight padding on mobile - always ensure at least 16px horizontal padding on small screens.
6. Mixing `margin-top` and `margin-bottom` on siblings - pick one direction (prefer `margin-bottom`) to avoid margin collapse surprises.
