<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     building a new color system from scratch or choosing a palette for a specific product type. -->

# Palette Recipes

Ready-to-paste color palettes using modern CSS color functions. Practical recipes - not theory.

---

## Section 1: CSS `color-mix()` for Tints and Shades

The modern way to create tints/shades without manual calculation:

```css
/* Tint: mix with white */
--color-primary-light: color-mix(in oklch, var(--color-primary), white 30%);

/* Shade: mix with black */
--color-primary-dark: color-mix(in oklch, var(--color-primary), black 20%);

/* Transparent version */
--color-primary-ghost: color-mix(in oklch, var(--color-primary), transparent 85%);

/* Hover state: darken by 10% */
.btn:hover {
  background: color-mix(in oklch, var(--color-primary), black 10%);
}
```

`color-mix(in oklch, ...)` is preferred over `in srgb` for perceptually uniform results. Supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+).

**Fallback pattern for older browsers:**

```css
.btn {
  background: #4f46e5; /* fallback hex */
  background: oklch(0.55 0.18 264); /* oklch for modern */
}
```

---

## Section 2: Four Production-Ready Palette Recipes

Each recipe includes: full primitive scale in OKLCH, semantic token map, and dark mode overrides. All contrast pairs are WCAG AA compliant.

### Recipe 1: SaaS / Productivity (Indigo-Neutral)

Calm, trustworthy, familiar. Indigo brand on cool blue-gray neutral.

```css
:root {
  /* Brand primitives (hue 264) */
  --brand-50:  oklch(0.97 0.03 264);
  --brand-100: oklch(0.93 0.06 264);
  --brand-200: oklch(0.87 0.09 264);
  --brand-300: oklch(0.78 0.13 264);
  --brand-400: oklch(0.68 0.16 264);
  --brand-500: oklch(0.55 0.18 264);  /* primary */
  --brand-600: oklch(0.47 0.18 264);  /* CTA */
  --brand-700: oklch(0.40 0.16 264);  /* hover */
  --brand-800: oklch(0.33 0.13 264);
  --brand-900: oklch(0.25 0.10 264);

  /* Neutral (cool gray, hue 264 at 0.01 chroma) */
  --gray-50:  oklch(0.98 0.005 264);
  --gray-100: oklch(0.95 0.005 264);
  --gray-200: oklch(0.90 0.008 264);
  --gray-300: oklch(0.82 0.008 264);
  --gray-400: oklch(0.68 0.010 264);
  --gray-500: oklch(0.55 0.010 264);
  --gray-600: oklch(0.44 0.010 264);
  --gray-700: oklch(0.36 0.012 264);
  --gray-800: oklch(0.27 0.012 264);
  --gray-900: oklch(0.18 0.015 264);

  /* Semantic */
  --color-bg: var(--gray-50);
  --color-surface: white;
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-500);
  --color-border: var(--gray-200);
  --color-primary: var(--brand-600);
  --color-primary-hover: var(--brand-700);
}

[data-theme="dark"] {
  --color-bg: var(--gray-900);
  --color-surface: var(--gray-800);
  --color-text: var(--gray-100);
  --color-text-muted: var(--gray-400);
  --color-border: var(--gray-700);
  --color-primary: var(--brand-400);
  --color-primary-hover: var(--brand-300);
}
```

### Recipe 2: E-Commerce / Consumer (Emerald-Warm)

Friendly, energetic. Green trust + orange urgency on warm neutrals.

```css
:root {
  /* Brand primitives (hue 160 - emerald) */
  --brand-50:  oklch(0.97 0.03 160);
  --brand-100: oklch(0.93 0.05 160);
  --brand-200: oklch(0.87 0.08 160);
  --brand-300: oklch(0.78 0.12 160);
  --brand-400: oklch(0.68 0.15 160);
  --brand-500: oklch(0.58 0.16 160);
  --brand-600: oklch(0.50 0.15 160);
  --brand-700: oklch(0.42 0.13 160);
  --brand-800: oklch(0.34 0.10 160);
  --brand-900: oklch(0.26 0.08 160);

  /* Accent (hue 40 - orange, complementary) */
  --accent-500: oklch(0.70 0.16 40);
  --accent-600: oklch(0.62 0.17 40);

  /* Neutral (warm gray, hue 60 at 0.01 chroma) */
  --gray-50:  oklch(0.98 0.005 60);
  --gray-100: oklch(0.95 0.008 60);
  --gray-200: oklch(0.90 0.008 60);
  --gray-500: oklch(0.55 0.010 60);
  --gray-800: oklch(0.27 0.010 60);
  --gray-900: oklch(0.18 0.012 60);

  --color-bg: var(--gray-50);
  --color-surface: white;
  --color-primary: var(--brand-600);
  --color-accent: var(--accent-600);
}
```

### Recipe 3: Editorial / Content (Slate-Serif)

Minimal, typographic. Muted brand, maximum reading focus.

```css
:root {
  /* Brand (hue 220 - slate blue, low chroma) */
  --brand-500: oklch(0.55 0.08 220);
  --brand-600: oklch(0.47 0.10 220);
  --brand-700: oklch(0.40 0.10 220);

  /* Neutral (pure cool gray) */
  --gray-50:  oklch(0.98 0.003 220);
  --gray-100: oklch(0.95 0.003 220);
  --gray-200: oklch(0.90 0.005 220);
  --gray-500: oklch(0.55 0.005 220);
  --gray-800: oklch(0.27 0.008 220);
  --gray-900: oklch(0.18 0.010 220);

  --color-bg: white;
  --color-surface: var(--gray-50);
  --color-text: var(--gray-900);
  --color-primary: var(--brand-600);
}
```

### Recipe 4: Fintech / Enterprise (Navy-Gold)

Authoritative, premium. Navy trust + gold accent.

```css
:root {
  /* Brand (hue 250 - navy) */
  --brand-500: oklch(0.40 0.12 250);
  --brand-600: oklch(0.32 0.10 250);
  --brand-700: oklch(0.25 0.08 250);
  --brand-900: oklch(0.15 0.05 250);

  /* Accent (hue 85 - gold) */
  --accent-400: oklch(0.78 0.14 85);
  --accent-500: oklch(0.70 0.15 85);
  --accent-600: oklch(0.62 0.14 85);

  /* Neutral (cool blue-gray) */
  --gray-50:  oklch(0.98 0.005 250);
  --gray-100: oklch(0.95 0.005 250);
  --gray-800: oklch(0.27 0.012 250);
  --gray-900: oklch(0.18 0.015 250);

  --color-bg: var(--gray-50);
  --color-primary: var(--brand-600);
  --color-accent: var(--accent-500);
}

[data-theme="dark"] {
  --color-bg: var(--brand-900);
  --color-surface: oklch(0.20 0.06 250);
  --color-text: var(--gray-100);
  --color-primary: oklch(0.65 0.14 250);
  --color-accent: var(--accent-400);
}
```

---

## Section 3: Quick Hue Reference

A compact table for common brand hues:

| Color      | OKLCH Hue | Example Use                    |
|------------|-----------|--------------------------------|
| Red        | 25        | Destructive, urgency, food     |
| Orange     | 50        | Energy, warmth, CTA            |
| Amber/Gold | 85        | Premium, achievement, finance  |
| Green      | 160       | Success, eco, health, money    |
| Teal       | 190       | Trust, calm, productivity      |
| Blue       | 240       | Trust, corporate, info         |
| Indigo     | 264       | SaaS, tech, default            |
| Purple     | 300       | Creative, AI, luxury           |
| Pink       | 350       | Social, romance, playful       |

To adapt any recipe: swap the brand hue value while keeping lightness and chroma values the same.
