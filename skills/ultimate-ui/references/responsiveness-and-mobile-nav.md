<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with responsive design, mobile layouts, breakpoints, or mobile navigation. -->

# Responsiveness and Mobile Navigation

## Mobile-first approach

Write base CSS for mobile (320px+), add min-width media queries for larger screens. Never use max-width queries (leads to override chains).

```css
/* Base = mobile */
.container { padding: 16px; flex-direction: column; }

/* Expand for larger */
@media (min-width: 768px) {
  .container { padding: 24px; flex-direction: row; }
}
```

## Breakpoints

| Name | Width  | Target                          |
|------|--------|---------------------------------|
| sm   | 640px  | Large phones landscape          |
| md   | 768px  | Tablets portrait                |
| lg   | 1024px | Tablets landscape, small laptops|
| xl   | 1280px | Desktop                         |
| 2xl  | 1536px | Large desktop                   |

## Touch targets

- Minimum: 44x44px (Apple HIG) / 48x48px (Material Design)
- Spacing between targets: minimum 8px
- Thumb zone: bottom 1/3 of screen is easiest to reach
- Place primary actions in bottom zone on mobile

## Responsive patterns

### Content reflow

```css
/* Sidebar: full-width mobile, fixed on desktop */
.layout { display: flex; flex-direction: column; }
.sidebar { width: 100%; }
@media (min-width: 1024px) {
  .layout { flex-direction: row; }
  .sidebar { width: 260px; flex-shrink: 0; }
}

/* Grid: 1 col -> 2 -> 3 -> 4 */
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 768px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .grid { grid-template-columns: repeat(4, 1fr); } }
```

### Responsive typography

```css
/* Fluid headings with clamp() */
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3rem); }
h2 { font-size: clamp(1.375rem, 0.75rem + 2vw, 2.25rem); }
h3 { font-size: clamp(1.125rem, 0.5rem + 1.5vw, 1.75rem); }
```

### Responsive spacing

```css
.section { padding: clamp(16px, 4vw, 48px); }
```

### Responsive images

```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1600.jpg 1600w"
  sizes="(min-width: 1024px) 800px, 100vw"
  alt="Description"
  style="max-width: 100%; height: auto;"
/>
```

## Mobile navigation patterns

### 1. Bottom tab bar

- 4-5 items max, 56-64px height, fixed to bottom
- Active: filled icon + label + primary color
- Safe area padding for notched phones

```css
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding-bottom: env(safe-area-inset-bottom);
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #6b7280;
  font-size: 0.75rem;
  min-height: 44px;
}
.tab-item.active { color: #2563eb; }
@media (min-width: 1024px) { .bottom-tab-bar { display: none; } }
```

### 2. Hamburger menu

- Slide-in from left, dark overlay behind
- Close on overlay tap or X button, focus trap when open

```css
.nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 40;
}
.nav-overlay.open { opacity: 1; visibility: visible; }

.nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(80vw, 320px);
  background: #ffffff;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 50;
  overflow-y: auto;
  padding: 24px 16px;
}
.nav-drawer.open { transform: translateX(0); }
@media (min-width: 1024px) { .nav-overlay, .nav-drawer { display: none; } }
```

### 3. Bottom sheet

```css
.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 8px 16px 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 50;
  max-height: 90vh;
  overflow-y: auto;
}
.bottom-sheet.open { transform: translateY(0); }
.bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background: #d1d5db;
  border-radius: 9999px;
  margin: 0 auto 16px;
}
```

## Responsive component adaptations

```css
/* Cards: vertical mobile, horizontal desktop */
.card { display: flex; flex-direction: column; }
@media (min-width: 768px) {
  .card { flex-direction: row; }
  .card-image { width: 200px; flex-shrink: 0; }
}

/* Tables: horizontal scroll on mobile */
.table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* Forms: stacked mobile, side labels desktop */
.form-field { display: flex; flex-direction: column; gap: 4px; }
@media (min-width: 768px) {
  .form-field { flex-direction: row; align-items: baseline; gap: 16px; }
  .form-field label { width: 160px; flex-shrink: 0; text-align: right; }
}

/* Modals: full-screen mobile, centered desktop */
@media (max-width: 767px) { .modal { position: fixed; inset: 0; border-radius: 0; } }

/* Dropdowns: bottom sheet mobile, positioned desktop */
.dropdown-menu { position: fixed; left: 0; right: 0; bottom: 0; border-radius: 16px 16px 0 0; }
@media (min-width: 768px) {
  .dropdown-menu {
    position: absolute;
    inset: auto;
    top: calc(100% + 4px);
    border-radius: 8px;
    min-width: 180px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}
```

## Testing responsive

- Chrome DevTools device mode (Cmd+Shift+M)
- Test at: 320px, 375px, 768px, 1024px, 1440px
- Test orientation changes
- Test with actual devices - DevTools is not a perfect substitute

## Common responsive mistakes

- Using `px` for everything - use `rem` for text, `px` only for borders/shadows
- Hiding content on mobile instead of reorganizing it
- Tiny touch targets - buttons and links below 44px
- Horizontal scroll on body - check for overflow caused by wide elements
- Not testing between breakpoints - worst layouts often appear at ~900px
- Fixed-width sidebars that don't collapse on mid-size screens
