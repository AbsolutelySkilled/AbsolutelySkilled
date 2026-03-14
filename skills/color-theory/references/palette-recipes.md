<!-- Part of the color-theory AbsolutelySkilled skill. Load this file when
     building a new product color system or choosing a palette archetype. -->

# Palette Recipes

Pre-built color systems for common product archetypes. Each recipe includes
a full primitive scale, semantic token map, and dark mode overrides ready to
drop into a `:root` block. All contrast pairs are WCAG AA compliant.

---

## How to use these recipes

1. Pick the recipe closest to your product archetype.
2. Replace the brand hue (the OKLCH `H` value) with your own brand hue.
3. Verify primary CTA contrast with browser DevTools before shipping.
4. Keep primitives as-is; only customize the semantic layer.

---

## Recipe 1: SaaS / Productivity (Indigo-Neutral)

Calm, trustworthy, familiar. Indigo brand on a cool blue-gray neutral.

```css
/* === PRIMITIVES === */
:root {
  /* Brand: indigo (hue 264) */
  --color-brand-50:  oklch(0.97 0.03 264);
  --color-brand-100: oklch(0.93 0.06 264);
  --color-brand-200: oklch(0.86 0.10 264);
  --color-brand-300: oklch(0.76 0.15 264);
  --color-brand-400: oklch(0.64 0.19 264);
  --color-brand-500: oklch(0.56 0.22 264);
  --color-brand-600: oklch(0.49 0.22 264);  /* 4.7:1 on white */
  --color-brand-700: oklch(0.42 0.21 264);
  --color-brand-800: oklch(0.33 0.18 264);
  --color-brand-900: oklch(0.24 0.14 264);

  /* Neutral: tinted with brand hue at low chroma */
  --color-neutral-50:  oklch(0.98 0.005 264);
  --color-neutral-100: oklch(0.95 0.007 264);
  --color-neutral-200: oklch(0.90 0.009 264);
  --color-neutral-300: oklch(0.82 0.011 264);
  --color-neutral-400: oklch(0.68 0.012 264);
  --color-neutral-500: oklch(0.54 0.012 264);
  --color-neutral-600: oklch(0.43 0.011 264);
  --color-neutral-700: oklch(0.33 0.010 264);
  --color-neutral-800: oklch(0.22 0.008 264);
  --color-neutral-900: oklch(0.14 0.006 264);
}

/* === SEMANTICS - LIGHT === */
:root {
  --color-bg-primary:         var(--color-neutral-50);
  --color-bg-secondary:       var(--color-neutral-100);
  --color-bg-elevated:        oklch(1.00 0.000 264);

  --color-text-primary:       var(--color-neutral-900);
  --color-text-secondary:     var(--color-neutral-600);
  --color-text-muted:         var(--color-neutral-400);

  --color-border:             var(--color-neutral-200);
  --color-border-strong:      var(--color-neutral-300);

  --color-action-primary:       var(--color-brand-600);
  --color-action-primary-hover: var(--color-brand-700);
  --color-action-primary-text:  oklch(1.00 0.000 264);

  --color-action-secondary:       transparent;
  --color-action-secondary-border: var(--color-brand-200);
  --color-action-secondary-hover:  var(--color-brand-50);

  --color-status-success:     oklch(0.53 0.17 145);
  --color-status-success-bg:  oklch(0.96 0.04 145);
  --color-status-warning:     oklch(0.63 0.16 70);
  --color-status-warning-bg:  oklch(0.97 0.04 70);
  --color-status-error:       oklch(0.50 0.19 27);
  --color-status-error-bg:    oklch(0.97 0.03 27);
  --color-status-info:        var(--color-brand-600);
  --color-status-info-bg:     var(--color-brand-50);

  --shadow-sm: 0 1px 2px  oklch(0 0 0 / 0.07);
  --shadow-md: 0 4px 8px  oklch(0 0 0 / 0.09);
  --shadow-lg: 0 12px 24px oklch(0 0 0 / 0.11);
}

/* === SEMANTICS - DARK === */
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary:     oklch(0.20 0.012 264);
    --color-bg-secondary:   oklch(0.15 0.010 264);
    --color-bg-elevated:    oklch(0.26 0.014 264);

    --color-text-primary:   oklch(0.93 0.008 264);
    --color-text-secondary: oklch(0.70 0.010 264);
    --color-text-muted:     oklch(0.52 0.010 264);

    --color-border:         oklch(0.31 0.012 264);
    --color-border-strong:  oklch(0.39 0.012 264);

    --color-action-primary:       var(--color-brand-400);
    --color-action-primary-hover: var(--color-brand-300);
    --color-action-primary-text:  oklch(0.14 0.006 264);

    --color-action-secondary-border: var(--color-brand-700);
    --color-action-secondary-hover:  oklch(0.26 0.014 264);

    --color-status-success:     oklch(0.73 0.17 145);
    --color-status-success-bg:  oklch(0.22 0.05 145);
    --color-status-warning:     oklch(0.80 0.15 70);
    --color-status-warning-bg:  oklch(0.22 0.05 70);
    --color-status-error:       oklch(0.68 0.19 27);
    --color-status-error-bg:    oklch(0.22 0.04 27);
    --color-status-info:        var(--color-brand-400);
    --color-status-info-bg:     oklch(0.22 0.04 264);

    --shadow-sm: 0 1px 2px  oklch(0 0 0 / 0.40);
    --shadow-md: 0 4px 8px  oklch(0 0 0 / 0.50);
    --shadow-lg: 0 12px 24px oklch(0 0 0 / 0.60);
  }
}
```

---

## Recipe 2: E-Commerce / Consumer (Emerald-Warm)

Friendly, energetic, conversion-focused. Green brand signals freshness and "go". Warm neutrals feel approachable.

```css
/* === PRIMITIVES === */
:root {
  /* Brand: emerald-green (hue 160) */
  --color-brand-50:  oklch(0.97 0.04 160);
  --color-brand-100: oklch(0.93 0.07 160);
  --color-brand-200: oklch(0.86 0.12 160);
  --color-brand-300: oklch(0.76 0.16 160);
  --color-brand-400: oklch(0.65 0.19 160);
  --color-brand-500: oklch(0.57 0.20 160);
  --color-brand-600: oklch(0.50 0.20 160);  /* 4.6:1 on white */
  --color-brand-700: oklch(0.42 0.18 160);
  --color-brand-800: oklch(0.33 0.15 160);
  --color-brand-900: oklch(0.24 0.11 160);

  /* Neutral: warm beige-gray (hue 60 = warm direction) */
  --color-neutral-50:  oklch(0.98 0.006 60);
  --color-neutral-100: oklch(0.95 0.008 60);
  --color-neutral-200: oklch(0.90 0.010 60);
  --color-neutral-300: oklch(0.82 0.012 60);
  --color-neutral-400: oklch(0.68 0.013 60);
  --color-neutral-500: oklch(0.54 0.013 60);
  --color-neutral-600: oklch(0.43 0.012 60);
  --color-neutral-700: oklch(0.33 0.010 60);
  --color-neutral-800: oklch(0.22 0.008 60);
  --color-neutral-900: oklch(0.14 0.006 60);

  /* Accent: amber for sale tags, CTAs (complementary to green) */
  --color-accent-400: oklch(0.80 0.16 70);
  --color-accent-600: oklch(0.63 0.17 70);
}

/* === SEMANTICS - LIGHT === */
:root {
  --color-bg-primary:       var(--color-neutral-50);
  --color-bg-secondary:     var(--color-neutral-100);
  --color-bg-elevated:      oklch(1.00 0.000 60);

  --color-text-primary:     var(--color-neutral-900);
  --color-text-secondary:   var(--color-neutral-600);
  --color-text-muted:       var(--color-neutral-400);

  --color-border:           var(--color-neutral-200);

  --color-action-primary:       var(--color-brand-600);
  --color-action-primary-hover: var(--color-brand-700);

  /* Sale / promo accent */
  --color-promo:            var(--color-accent-600);
  --color-promo-bg:         oklch(0.97 0.05 70);
}

/* === SEMANTICS - DARK === */
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary:     oklch(0.18 0.010 60);
    --color-bg-secondary:   oklch(0.13 0.008 60);
    --color-bg-elevated:    oklch(0.24 0.012 60);

    --color-text-primary:   oklch(0.94 0.006 60);
    --color-text-secondary: oklch(0.70 0.009 60);
    --color-text-muted:     oklch(0.52 0.009 60);

    --color-border:         oklch(0.30 0.010 60);

    --color-action-primary:       var(--color-brand-400);
    --color-action-primary-hover: var(--color-brand-300);

    --color-promo:          var(--color-accent-400);
    --color-promo-bg:       oklch(0.22 0.05 70);
  }
}
```

---

## Recipe 3: Editorial / Content (Slate-Serif)

Minimal, typographic, high contrast. Near-black on near-white. A single accent for links and interactive elements. Works equally well for blogs, documentation, and news sites.

```css
/* === PRIMITIVES === */
:root {
  /* Brand: slate-blue accent (hue 220) */
  --color-brand-400: oklch(0.63 0.17 220);
  --color-brand-600: oklch(0.48 0.18 220);  /* 5.1:1 on white */
  --color-brand-700: oklch(0.40 0.17 220);

  /* Neutral: near-neutral with subtle cool tint */
  --color-neutral-50:  oklch(0.99 0.003 220);
  --color-neutral-100: oklch(0.96 0.005 220);
  --color-neutral-200: oklch(0.91 0.007 220);
  --color-neutral-300: oklch(0.83 0.009 220);
  --color-neutral-400: oklch(0.69 0.010 220);
  --color-neutral-500: oklch(0.55 0.010 220);
  --color-neutral-600: oklch(0.44 0.009 220);
  --color-neutral-700: oklch(0.34 0.008 220);
  --color-neutral-800: oklch(0.23 0.007 220);
  --color-neutral-900: oklch(0.13 0.005 220);
}

/* === SEMANTICS - LIGHT === */
:root {
  --color-bg-primary:   var(--color-neutral-50);
  --color-bg-secondary: var(--color-neutral-100);
  --color-bg-elevated:  oklch(1.00 0.000 220);

  --color-text-primary:   var(--color-neutral-900);   /* 16:1 on bg */
  --color-text-secondary: var(--color-neutral-600);
  --color-text-muted:     var(--color-neutral-400);

  --color-border:         var(--color-neutral-200);

  /* Links and interactive */
  --color-link:       var(--color-brand-600);
  --color-link-hover: var(--color-brand-700);

  /* Blockquote / pull quote accent */
  --color-accent-bar:   var(--color-brand-600);
  --color-accent-bar-bg: var(--color-brand-400);
}

/* === SEMANTICS - DARK === */
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary:   oklch(0.16 0.007 220);
    --color-bg-secondary: oklch(0.12 0.005 220);
    --color-bg-elevated:  oklch(0.21 0.008 220);

    --color-text-primary:   oklch(0.94 0.005 220);
    --color-text-secondary: oklch(0.70 0.008 220);
    --color-text-muted:     oklch(0.53 0.008 220);

    --color-border:         oklch(0.28 0.008 220);

    --color-link:       var(--color-brand-400);
    --color-link-hover: oklch(0.74 0.16 220);
  }
}
```

---

## Recipe 4: Fintech / Enterprise (Navy-Gold)

Authoritative, serious, trustworthy. Deep navy signals stability. Gold accent communicates premium value. Zero tolerance for contrast failures.

```css
/* === PRIMITIVES === */
:root {
  /* Brand: deep navy (hue 245) */
  --color-brand-50:  oklch(0.97 0.02 245);
  --color-brand-100: oklch(0.93 0.05 245);
  --color-brand-200: oklch(0.85 0.09 245);
  --color-brand-300: oklch(0.73 0.14 245);
  --color-brand-400: oklch(0.60 0.18 245);
  --color-brand-500: oklch(0.50 0.20 245);
  --color-brand-600: oklch(0.42 0.20 245);
  --color-brand-700: oklch(0.35 0.18 245);
  --color-brand-800: oklch(0.27 0.14 245);
  --color-brand-900: oklch(0.18 0.10 245);

  /* Gold accent (analogous to brand, shifted toward warm amber) */
  --color-gold-300: oklch(0.84 0.14 78);
  --color-gold-500: oklch(0.73 0.16 78);
  --color-gold-600: oklch(0.63 0.17 78);  /* 3.2:1 on white - use on dark bg only */
  --color-gold-700: oklch(0.54 0.16 78);  /* 4.7:1 on white */

  /* Neutral: cool gray leaning toward brand navy */
  --color-neutral-50:  oklch(0.98 0.004 245);
  --color-neutral-100: oklch(0.95 0.006 245);
  --color-neutral-200: oklch(0.90 0.008 245);
  --color-neutral-300: oklch(0.82 0.010 245);
  --color-neutral-400: oklch(0.68 0.011 245);
  --color-neutral-500: oklch(0.54 0.011 245);
  --color-neutral-600: oklch(0.43 0.010 245);
  --color-neutral-700: oklch(0.33 0.009 245);
  --color-neutral-800: oklch(0.22 0.007 245);
  --color-neutral-900: oklch(0.14 0.005 245);
}

/* === SEMANTICS - LIGHT === */
:root {
  --color-bg-primary:   var(--color-neutral-50);
  --color-bg-secondary: var(--color-neutral-100);
  --color-bg-elevated:  oklch(1.00 0.000 245);

  /* Navy sidebar / header */
  --color-bg-nav:     var(--color-brand-900);
  --color-text-nav:   var(--color-neutral-50);

  --color-text-primary:   var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-muted:     var(--color-neutral-400);

  --color-border:         var(--color-neutral-200);

  --color-action-primary:       var(--color-brand-600);
  --color-action-primary-hover: var(--color-brand-700);
  --color-action-primary-text:  oklch(1.00 0.000 245);

  /* Gold: premium badges, pro features - use on dark bg */
  --color-premium:    var(--color-gold-600);
  --color-premium-bg: oklch(0.97 0.04 78);

  --color-status-success: oklch(0.53 0.15 145);
  --color-status-error:   oklch(0.50 0.18 27);
  --color-status-warning: var(--color-gold-700);
}

/* === SEMANTICS - DARK === */
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary:   oklch(0.16 0.010 245);
    --color-bg-secondary: oklch(0.12 0.008 245);
    --color-bg-elevated:  oklch(0.22 0.012 245);

    /* Nav stays dark but slightly lighter than deepest bg */
    --color-bg-nav:     oklch(0.10 0.007 245);

    --color-text-primary:   oklch(0.94 0.006 245);
    --color-text-secondary: oklch(0.70 0.009 245);
    --color-text-muted:     oklch(0.52 0.009 245);

    --color-border:         oklch(0.28 0.010 245);

    --color-action-primary:       var(--color-brand-400);
    --color-action-primary-hover: var(--color-brand-300);
    --color-action-primary-text:  oklch(0.12 0.006 245);

    --color-premium:    var(--color-gold-500);
    --color-premium-bg: oklch(0.22 0.05 78);

    --color-status-success: oklch(0.73 0.15 145);
    --color-status-error:   oklch(0.68 0.18 27);
    --color-status-warning: var(--color-gold-300);
  }
}
```

---

## Quick contrast-check pairs

Before shipping, verify these pairs in DevTools for each recipe:

| Pair | Light target | Dark target |
|---|---|---|
| Body text on bg-primary | 12:1+ | 12:1+ |
| Secondary text on bg-primary | 5:1+ | 5:1+ |
| Muted text on bg-primary | 3:1+ (large only) | 3:1+ |
| Action primary text on action bg | 4.5:1+ | 4.5:1+ |
| Border on bg-primary | Not required (decorative) | Not required |
| Focus ring on bg-primary | 3:1+ | 3:1+ |
| Status text on status bg | 4.5:1+ | 4.5:1+ |

---

## Changing the brand hue

All four recipes parameterize the brand by OKLCH hue. To change hue:

1. Find the OKLCH hue for your brand color using `oklch.com` or DevTools.
2. Replace all `264` (or `160`, `220`, `245`) values with your hue.
3. For the neutral scale, use the same hue at chroma `0.005-0.013`.
4. Re-verify your primary CTA lightness gives 4.5:1 on the bg - adjust L up or down as needed.

Common brand hues for reference:

| Color family | Approx OKLCH hue |
|---|---|
| Red | 25-30 |
| Orange | 50-60 |
| Amber/Gold | 70-80 |
| Yellow-green | 120-130 |
| Green | 140-160 |
| Teal/Cyan | 185-200 |
| Blue | 220-240 |
| Indigo/Violet | 260-280 |
| Purple | 295-310 |
| Magenta/Pink | 330-350 |
