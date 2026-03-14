<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with design tokens, CSS custom properties, theming architecture, or design system setup. -->

# Design Tokens and Theming Architecture

## What are design tokens
- Named values for design decisions (colors, spacing, typography, shadows)
- Single source of truth - change once, update everywhere
- Enable theming (light/dark, multi-brand); in CSS: custom properties

## Token naming convention
Three-tier naming:
1. Global/primitive: raw values (`--blue-500: #3b82f6`)
2. Semantic/alias: purpose-based (`--color-primary: var(--blue-500)`)
3. Component: scoped (`--btn-bg: var(--color-primary)`)

Rules: always use semantic tokens in components (never primitives directly). Pattern: `--{category}-{property}-{variant}-{state}`

## Complete token system

### Color tokens - Primitives

```css
:root {
  /* Gray scale */
  --gray-50: #f9fafb;  --gray-100: #f3f4f6;  --gray-200: #e5e7eb;  --gray-300: #d1d5db;
  --gray-400: #9ca3af; --gray-500: #6b7280;  --gray-600: #4b5563;  --gray-700: #374151;
  --gray-800: #1f2937; --gray-900: #111827;

  /* Primary (indigo) */
  --primary-50: #eef2ff;  --primary-100: #e0e7ff;  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc; --primary-400: #818cf8;  --primary-500: #6366f1;
  --primary-600: #4f46e5; --primary-700: #4338ca;  --primary-800: #3730a3; --primary-900: #312e81;

  /* Red */
  --red-50: #fef2f2;  --red-100: #fee2e2;  --red-400: #f87171;
  --red-500: #ef4444; --red-600: #dc2626;  --red-700: #b91c1c;

  /* Green */
  --green-50: #f0fdf4;   --green-100: #dcfce7; --green-400: #4ade80;
  --green-500: #22c55e;  --green-600: #16a34a; --green-700: #15803d;

  /* Amber */
  --amber-50: #fffbeb;   --amber-100: #fef3c7; --amber-400: #fbbf24;
  --amber-500: #f59e0b;  --amber-600: #d97706; --amber-700: #b45309;

  /* Blue */
  --blue-50: #eff6ff;   --blue-100: #dbeafe; --blue-400: #60a5fa;
  --blue-500: #3b82f6;  --blue-600: #2563eb; --blue-700: #1d4ed8;
}
```

### Color tokens - Semantic (light theme)

```css
:root {
  --color-bg-primary: #ffffff;  --color-bg-secondary: var(--gray-50);  --color-bg-tertiary: var(--gray-100);
  --color-text-primary: var(--gray-900);  --color-text-secondary: var(--gray-600);
  --color-text-tertiary: var(--gray-400);  --color-text-inverted: #ffffff;
  --color-border: var(--gray-200);  --color-border-strong: var(--gray-400);
  --color-ring: var(--primary-500);
  --color-surface: #ffffff;  --color-surface-elevated: #ffffff;
  --color-interactive-primary: var(--primary-600);
  --color-interactive-primary-hover: var(--primary-700);
  --color-interactive-primary-active: var(--primary-800);
  --color-interactive-destructive: var(--red-600);
  --color-interactive-destructive-hover: var(--red-700);
  --color-success: var(--green-600);    --color-success-bg: var(--green-50);    --color-success-text: var(--green-700);
  --color-warning: var(--amber-500);    --color-warning-bg: var(--amber-50);    --color-warning-text: var(--amber-700);
  --color-error: var(--red-600);        --color-error-bg: var(--red-50);        --color-error-text: var(--red-700);
  --color-info: var(--blue-600);        --color-info-bg: var(--blue-50);        --color-info-text: var(--blue-700);
}
```

### Color tokens - Dark theme overrides

```css
[data-theme="dark"] {
  --color-bg-primary: var(--gray-900);         --color-bg-secondary: var(--gray-800);     --color-bg-tertiary: var(--gray-700);
  --color-text-primary: var(--gray-50);        --color-text-secondary: var(--gray-400);   --color-text-tertiary: var(--gray-500);
  --color-text-inverted: var(--gray-900);
  --color-border: var(--gray-700);             --color-border-strong: var(--gray-500);
  --color-ring: var(--primary-400);
  --color-surface: var(--gray-800);            --color-surface-elevated: var(--gray-700);
  --color-interactive-primary: var(--primary-500);
  --color-interactive-primary-hover: var(--primary-400);
  --color-interactive-primary-active: var(--primary-300);
  --color-interactive-destructive: var(--red-500);
  --color-interactive-destructive-hover: var(--red-400);
  --color-success: var(--green-400);    --color-success-bg: rgba(34,197,94,0.1);    --color-success-text: var(--green-400);
  --color-warning: var(--amber-400);    --color-warning-bg: rgba(245,158,11,0.1);   --color-warning-text: var(--amber-400);
  --color-error: var(--red-400);        --color-error-bg: rgba(239,68,68,0.1);      --color-error-text: var(--red-400);
  --color-info: var(--blue-400);        --color-info-bg: rgba(59,130,246,0.1);      --color-info-text: var(--blue-400);
}

/* System dark as fallback when no data-theme attribute */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary: var(--gray-900);  --color-bg-secondary: var(--gray-800);  --color-bg-tertiary: var(--gray-700);
    --color-text-primary: var(--gray-50); --color-text-secondary: var(--gray-400); --color-text-tertiary: var(--gray-500);
    --color-border: var(--gray-700);      --color-border-strong: var(--gray-500);
    --color-surface: var(--gray-800);     --color-surface-elevated: var(--gray-700);
    --color-interactive-primary: var(--primary-500);
  }
}
```

### Spacing tokens

```css
:root {
  --space-0: 0px;  --space-0-5: 2px;  --space-1: 4px;  --space-1-5: 6px;  --space-2: 8px;
  --space-3: 12px; --space-4: 16px;   --space-5: 20px; --space-6: 24px;   --space-8: 32px;
  --space-10: 40px; --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;
}
```

### Typography tokens

```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-base: 1rem;    --text-lg: 1.125rem;
  --text-xl: 1.25rem;  --text-2xl: 1.5rem;  --text-3xl: 1.875rem; --text-4xl: 2.25rem; --text-5xl: 3rem;

  --font-regular: 400;  --font-medium: 500;  --font-semibold: 600;  --font-bold: 700;

  --leading-none: 1;  --leading-tight: 1.25;  --leading-snug: 1.375;  --leading-normal: 1.5;
  --leading-relaxed: 1.75;  --leading-loose: 2;

  --tracking-tighter: -0.05em;  --tracking-tight: -0.025em;  --tracking-normal: 0em;
  --tracking-wide: 0.025em;  --tracking-wider: 0.05em;  --tracking-widest: 0.1em;
}
```

### Shadow, Border, Motion, Z-index tokens

```css
:root {
  --shadow-sm:  0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-md:  0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  --shadow-lg:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-xl:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,0.05);

  --radius-none: 0px;  --radius-sm: 0.125rem;  --radius-md: 0.375rem;  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;  --radius-2xl: 1rem;  --radius-full: 9999px;
  --border-width: 1px;  --border-width-strong: 2px;

  --duration-instant: 0ms;  --duration-fast: 100ms;  --duration-normal: 200ms;
  --duration-slow: 300ms;   --duration-slower: 500ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  --z-base: 0;  --z-raised: 1;  --z-dropdown: 10;  --z-sticky: 20;
  --z-overlay: 30;  --z-modal: 40;  --z-toast: 50;  --z-tooltip: 60;
}
```

## Theme structure
- `:root` for light theme (default); `[data-theme="dark"]` for explicit toggle
- `@media (prefers-color-scheme: dark)` as system fallback (only when no `data-theme` attribute)
- Only semantic tokens change between themes, primitives stay the same

## Multi-brand theming

```css
.brand-a { --color-interactive-primary: #0d9488; --color-interactive-primary-hover: #0f766e; --color-ring: #0d9488; }
.brand-b { --color-interactive-primary: #e11d48; --color-interactive-primary-hover: #be123c; --color-ring: #e11d48; }
```

Keep spacing, typography, motion consistent across brands - only colors change.

## CSS file structure

```
styles/
  tokens/  colors.css  spacing.css  typography.css  shadows.css  motion.css  z-index.css
  themes/  light.css  dark.css
  base.css  (CSS reset + global styles using tokens)
```

## Tailwind integration

```js
module.exports = {
  theme: { extend: {
    colors: {
      'bg-primary': 'var(--color-bg-primary)', 'bg-secondary': 'var(--color-bg-secondary)',
      'text-primary': 'var(--color-text-primary)', 'text-secondary': 'var(--color-text-secondary)',
      'border': 'var(--color-border)', 'interactive-primary': 'var(--color-interactive-primary)',
      'success': 'var(--color-success)', 'warning': 'var(--color-warning)',
      'error': 'var(--color-error)', 'info': 'var(--color-info)',
    },
    borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', full: 'var(--radius-full)' },
    boxShadow:    { sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)', xl: 'var(--shadow-xl)' },
  }},
}
```

## Using tokens in components

```css
/* Correct - semantic tokens only */
.card {
  background-color: var(--color-surface-elevated);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  color: var(--color-text-primary);
}

/* Wrong - never hardcode or use primitives in components */
.card-bad {
  background-color: #ffffff;          /* breaks dark mode */
  border: 1px solid var(--gray-200);  /* use --color-border */
  border-radius: 8px;                 /* use --radius-lg */
}
```

## Common token mistakes
- Using primitive tokens directly in components (breaks theming)
- Too many tokens - only token repeated design decisions
- Forgetting to add new semantic tokens to dark theme override
- Not using tokens for z-index (leads to z-index wars)
- Adding dark tokens only to `@media` query but not `[data-theme="dark"]` (breaks explicit toggle)
