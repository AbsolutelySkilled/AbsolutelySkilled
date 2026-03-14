<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with colors, palettes, themes, or dark/light mode. -->

# Color and Theming

## The 60-30-10 Rule

- **60%** dominant - background, neutral surfaces
- **30%** secondary - cards, sidebars, secondary surfaces
- **10%** accent - CTAs, active states, links

```css
:root {
  /* 60% - dominant backgrounds */
  --color-bg-primary: #f8fafc;       /* slate-50 */
  --color-bg-secondary: #f1f5f9;     /* slate-100 */

  /* 30% - secondary surfaces */
  --color-surface-card: #ffffff;
  --color-surface-sidebar: #f1f5f9;

  /* 10% - accent */
  --color-accent: #4f46e5;           /* indigo-600 */
  --color-accent-hover: #4338ca;     /* indigo-700 */
}
```

---

## Building a Palette

Start with ONE brand color and generate 10 shades using HSL manipulation.

**Strategy:**
- Fix the hue (e.g., `243` for indigo)
- 50-400: keep saturation moderate, increase lightness toward 100%
- 500: base color, full saturation
- 600-900: increase saturation slightly, decrease lightness toward 10%

**HSL formulas for a brand hue of `243`:**

| Shade | HSL                        | Hex       | Usage                      |
|-------|----------------------------|-----------|----------------------------|
| 50    | `hsl(243, 60%, 97%)`       | `#f5f3ff` | Page backgrounds, tints    |
| 100   | `hsl(243, 65%, 93%)`       | `#ede9fe` | Hover backgrounds          |
| 200   | `hsl(243, 68%, 85%)`       | `#c4b5fd` | Focus rings, subtle fill   |
| 300   | `hsl(243, 72%, 74%)`       | `#a78bfa` | Decorative, disabled icons |
| 400   | `hsl(243, 76%, 63%)`       | `#818cf8` | Links in dark mode         |
| 500   | `hsl(243, 80%, 55%)`       | `#6366f1` | Base brand color           |
| 600   | `hsl(243, 83%, 47%)`       | `#4f46e5` | Primary CTA, links         |
| 700   | `hsl(243, 86%, 40%)`       | `#4338ca` | Hover state on CTA         |
| 800   | `hsl(243, 88%, 30%)`       | `#3730a3` | Active/pressed state       |
| 900   | `hsl(243, 90%, 20%)`       | `#312e81` | Text on light backgrounds  |

**Neutral gray (tinted, not pure):** use your brand hue at 3-5% saturation.

```css
/* Pure gray: hsl(0, 0%, L%) - AVOID */
/* Tinted neutral: hsl(243, 4%, L%) - USE THIS */

--neutral-50:  hsl(243, 4%, 98%);   /* #f8f8fb */
--neutral-100: hsl(243, 4%, 95%);   /* #f1f1f6 */
--neutral-200: hsl(243, 4%, 89%);   /* #e2e2ea */
--neutral-300: hsl(243, 4%, 78%);   /* #c5c5d0 */
--neutral-400: hsl(243, 4%, 63%);   /* #9e9eac */
--neutral-500: hsl(243, 4%, 48%);   /* #787885 */
--neutral-600: hsl(243, 4%, 36%);   /* #5a5a65 */
--neutral-700: hsl(243, 5%, 26%);   /* #403f4c */
--neutral-800: hsl(243, 6%, 16%);   /* #272631 */
--neutral-900: hsl(243, 7%, 10%);   /* #17161f */
```

---

## Semantic Color Tokens

Map palette values to semantic names. Never use raw palette tokens in components - always go through semantic tokens.

```css
:root {
  /* Backgrounds */
  --color-bg-primary:    #f8f8fb;   /* neutral-50 */
  --color-bg-secondary:  #f1f1f6;   /* neutral-100 */
  --color-bg-tertiary:   #e2e2ea;   /* neutral-200 */

  /* Text */
  --color-text-primary:   #17161f;  /* neutral-900 */
  --color-text-secondary: #5a5a65;  /* neutral-600 */
  --color-text-tertiary:  #9e9eac;  /* neutral-400 */

  /* Borders */
  --color-border:        #e2e2ea;   /* neutral-200 */
  --color-border-strong: #c5c5d0;   /* neutral-300 */

  /* Status */
  --color-success: #16a34a;   /* green-600  */
  --color-warning: #d97706;   /* amber-600  */
  --color-error:   #dc2626;   /* red-600    */
  --color-info:    #2563eb;   /* blue-600   */
}
```

---

## Dark Mode Implementation

**Rules:**
- NEVER just invert colors - inversion breaks hue relationships and contrast
- Use dark blue-grays for backgrounds, not pure black (`#000000`)
- Reduce text brightness to `#f1f5f9`, not `#ffffff` (prevents eye strain)
- Increase shadow opacity from `0.1` to `0.3-0.5`
- Use lighter border colors - borders need more contrast on dark surfaces
- Slightly reduce image brightness: `filter: brightness(0.9) contrast(0.95)`

**Dark backgrounds to use:**
- `#0f172a` (slate-950) - deepest background layer
- `#1e293b` (slate-800) - primary page background
- `#334155` (slate-700) - cards, elevated surfaces
- `#475569` (slate-600) - hover states, secondary surfaces

```css
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  /* Backgrounds */
  --color-bg-primary:    #1e293b;   /* slate-800 */
  --color-bg-secondary:  #0f172a;   /* slate-950 */
  --color-bg-tertiary:   #334155;   /* slate-700 */

  /* Text - reduced brightness, never pure white */
  --color-text-primary:   #f1f5f9;  /* slate-100 */
  --color-text-secondary: #94a3b8;  /* slate-400 */
  --color-text-tertiary:  #64748b;  /* slate-500 */

  /* Borders - more visible on dark */
  --color-border:        #334155;   /* slate-700 */
  --color-border-strong: #475569;   /* slate-600 */

  /* Status - shift to lighter shades for contrast on dark */
  --color-success: #4ade80;   /* green-400  */
  --color-warning: #fbbf24;   /* amber-400  */
  --color-error:   #f87171;   /* red-400    */
  --color-info:    #60a5fa;   /* blue-400   */

  /* Shadows need more opacity in dark mode */
  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.4);
  --shadow-md: 0 4px 6px hsl(0 0% 0% / 0.45);
  --shadow-lg: 0 10px 15px hsl(0 0% 0% / 0.5);

  /* Slightly dim images */
  img {
    filter: brightness(0.9) contrast(0.95);
  }
}
```

---

## Theme Switching

Structure: `:root` defines light defaults, `[data-theme="dark"]` overrides, `@media` is the fallback.

```css
/* 1. Light defaults on :root */
:root {
  --color-bg-primary: #f8f8fb;
  --color-text-primary: #17161f;
  /* ... full token set */
}

/* 2. Manual dark override via data attribute */
[data-theme="dark"] {
  --color-bg-primary: #1e293b;
  --color-text-primary: #f1f5f9;
  /* ... full dark token set */
}

/* 3. System preference fallback (no JS required) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary: #1e293b;
    --color-text-primary: #f1f5f9;
    /* ... full dark token set */
  }
}
```

```js
// Theme toggle - store preference, respect system default
const STORAGE_KEY = 'theme-preference';

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// On page load - apply before paint to prevent flash
applyTheme(getPreferredTheme());

// Listen for system changes when no manual preference is set
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});
```

---

## Contrast and Readability

**WCAG requirements:**
- AA (minimum): 4.5:1 for normal text, 3:1 for large text (18px+ regular, or 14px+ bold)
- AAA (enhanced): 7:1 for normal text, 4.5:1 for large text

**Perceptually uniform manipulation:** use `oklch()` or `oklab()` instead of `hsl()` when fine-tuning accessible contrast - HSL is not perceptually uniform so equal lightness steps look unequal.

```css
/* oklch(lightness chroma hue) - perceptually uniform */
--color-accent-light: oklch(0.95 0.02 264);  /* very light */
--color-accent-base:  oklch(0.55 0.18 264);  /* 4.5:1 on white */
--color-accent-dark:  oklch(0.35 0.15 264);  /* 7:1 on white */
```

**Common failing combos - never use these:**
- `#9ca3af` (gray-400) on `#ffffff` - ratio ~2.7:1, fails AA
- `#fbbf24` (amber-400) on `#ffffff` - ratio ~2.1:1, fails AA
- `#60a5fa` (blue-400) on `#ffffff` - ratio ~3.0:1, fails AA for normal text
- `#d1d5db` (gray-300) on `#ffffff` - ratio ~1.6:1, fails everything

**Safe swap:** shift to -600 variants in light mode and -400 variants in dark mode to reliably clear AA.

---

## Color in Context

| Context       | Light mode        | Hex       | Dark mode         | Hex       |
|---------------|-------------------|-----------|-------------------|-----------|
| Links         | `primary-600`     | `#4f46e5` | `primary-400`     | `#818cf8` |
| Link hover    | `primary-700`     | `#4338ca` | `primary-300`     | `#a78bfa` |
| Success       | `green-600`       | `#16a34a` | `green-400`       | `#4ade80` |
| Error         | `red-600`         | `#dc2626` | `red-400`         | `#f87171` |
| Warning       | `amber-600`       | `#d97706` | `amber-400`       | `#fbbf24` |
| Info          | `blue-600`        | `#2563eb` | `blue-400`        | `#60a5fa` |
| Disabled text | `gray-400`        | `#9ca3af` | `gray-600`        | `#4b5563` |
| Disabled bg   | `gray-100`        | `#f3f4f6` | `gray-800`        | `#1f2937` |

Notes:
- Success: use `green-600`/`green-400`, never neon green (`#00ff00`)
- Error: use muted red, not bright red - `red-600` is `#dc2626`, not `#ff0000`
- Warning: amber reads better than yellow - yellow fails contrast on white at any shade

---

## Common Color Mistakes

1. **Too many hues** - stick to 1 brand hue + 1 neutral + status colors. More than 3 hues looks unfocused.

2. **Pure gray neutrals** - `hsl(0, 0%, 50%)` looks flat and disconnected from your brand. Always add 3-5% saturation of your brand hue.

3. **Same shade, different purpose** - if your border and your disabled text both use `gray-300`, they will compete. Assign distinct shades to distinct roles.

4. **Skipping contrast checks** - use the browser DevTools accessibility panel or [whocanuse.com](https://whocanuse.com) before shipping. Check all state variants (hover, focus, disabled).

5. **Dark mode as afterthought** - if you define tokens once and invert at the end, you will break contrast relationships. Define dark mode tokens alongside light from the start.

6. **Hardcoding hex in components** - always reference `--color-text-primary`, never `#17161f` directly. Tokens are the contract; components consume them.
