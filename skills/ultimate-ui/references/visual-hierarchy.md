<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with visual hierarchy, layout emphasis, or content prioritization. -->

# Visual Hierarchy

## The 5 tools of hierarchy (in order of impact)

1. **Size** - larger = more important
2. **Color/contrast** - darker or brand-colored = more important
3. **Weight** - bolder = more important
4. **Spacing** - more whitespace around it = more important
5. **Position** - top-left (LTR) gets seen first

## F-pattern and Z-pattern

- **F-pattern**: text-heavy pages (articles, docs). Users scan top bar, then left column
- **Z-pattern**: minimal pages (landing pages, hero sections). Eye goes top-left -> top-right -> bottom-left -> bottom-right
- Design implications: put CTAs at the end of the Z, put navigation in the F's top bar

```
Z-pattern:          F-pattern:
[====== -> ======]  [============]
       \            [====]
[====== -> ======]  [====]
```

## Creating focal points

- One primary focal point per screen/section (never zero, rarely two)
- Use size + color + whitespace together for maximum emphasis
- **Squint test**: blur your eyes - the focal point should still be obvious

```css
/* Hero section with a clear focal point */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96px 24px;
  text-align: center;
}

/* Focal point: headline dominates via size + weight + spacing */
.hero__headline {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-text-primary);
  max-width: 720px;
  margin-bottom: 24px;
}

/* Subtext clearly subordinate */
.hero__subtext {
  font-size: 18px;
  font-weight: 400;
  color: var(--color-text-secondary);
  max-width: 560px;
  margin-bottom: 40px;
}

/* CTA stands out via color contrast, not competing with headline */
.hero__cta {
  background: var(--color-brand);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  border-radius: 8px;
}
```

## Whitespace as hierarchy tool

- More whitespace = more importance/separation
- The ratio matters more than absolute values

| Level | Gap range | Use case |
|---|---|---|
| Section | 48-96px | Between major page sections |
| Component | 16-32px | Between related components (cards in a grid) |
| Element | 4-12px | Between tightly related elements (label + input) |

```css
/* Spacing scale - define once, use consistently */
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  32px;
  --space-xl:  48px;
  --space-2xl: 80px;
}

.page-section + .page-section {
  margin-top: var(--space-2xl); /* 80px - section-level gap */
}

.card-grid {
  gap: var(--space-lg); /* 32px - component-level gap */
}

.form-field label + input {
  margin-top: var(--space-xs); /* 4px - element-level gap */
}
```

## Text hierarchy levels

Create exactly 4-5 levels, no more:

```css
:root {
  --color-text-primary:   #111827;
  --color-text-secondary: #6b7280;
}

/* Level 1 - Page title */
.text-h1 {
  font-size: 36px;   /* 30-48px range */
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

/* Level 2 - Section heading */
.text-h2 {
  font-size: 24px;   /* 20-24px range */
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

/* Level 3 - Subsection / card title */
.text-h3 {
  font-size: 18px;   /* 16-18px range */
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

/* Level 4 - Body text */
.text-body {
  font-size: 15px;   /* 14-16px range */
  font-weight: 400;
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* Level 5 - Caption / metadata */
.text-caption {
  font-size: 12px;   /* 12-13px range */
  font-weight: 400;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
```

## Card hierarchy

- Cards create visual grouping - elements inside a card are related
- Three levels of elevation, pick the right one per context:

```css
/* Flat - use for low-emphasis grouping inside an already-elevated surface */
.card--flat {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

/* Raised - default card on a white/light background */
.card--raised {
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
}

/* Elevated - modals, popovers, or feature callouts */
.card--elevated {
  border-radius: 12px;
  padding: 24px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);
}
```

- **Never nest cards inside cards** - max 1 level of card nesting
- Card padding: 16-24px, consistent within a page

## De-emphasis techniques

Use these to push secondary content out of the focal path:

```css
/* 1. Secondary text color - for metadata, timestamps, labels */
.text-muted {
  color: var(--color-text-secondary); /* #6b7280 */
}

/* 2. Reduced opacity - for disabled or inactive states */
.state-disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* 3. Smaller size - for supplemental info */
.text-supporting {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 4. On-demand disclosure - hide secondary content until needed */
.details-panel {
  display: none;
}
.details-panel.is-open {
  display: block;
}

/* 5. Reduced saturation - for background UI chrome */
.nav-icon {
  color: #9ca3af; /* desaturated, not competing with content */
}
.nav-icon.is-active {
  color: var(--color-brand);
}
```

## Common hierarchy mistakes

| Mistake | Why it fails | Fix |
|---|---|---|
| Everything is bold | Nothing stands out if everything is emphasized | Reserve `font-weight: 700` for level 1 only |
| No clear CTA | User doesn't know what to do next | One prominent action per screen |
| Competing focal points | Two large/colorful elements fight each other | One hero element, others clearly subordinate |
| Border + shadow + color for separation | Visual noise, not clarity | Pick 1-2 separation techniques max |
| Heading and body same size | No scannable structure | At least 4px difference between adjacent levels; prefer 6-8px+ |
| Icon-only navigation | Position context lost, no F/Z anchor | Pair icons with labels for primary nav |

## Quick audit checklist

Before shipping a UI, verify:

- [ ] Squint test passes - focal point is obvious at a glance
- [ ] Only 4-5 distinct text sizes used on the page
- [ ] `font-weight: 700` used sparingly (level 1 heading only, or CTA label)
- [ ] Section gaps are noticeably larger than component gaps
- [ ] There is exactly one primary CTA visible per screen
- [ ] Secondary information uses `text-secondary` color, not primary
- [ ] No cards nested inside cards
- [ ] Elevation level matches content importance (flat < raised < elevated)
