<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     working with shadows, borders, elevation, depth, or card design. -->

# Shadows and Borders

## Shadow elevation scale
Define a 5-level shadow scale (like Material Design but subtler). Use rgba with low opacity:

Level 0 (flat): no shadow, border only
Level 1 (raised): subtle card shadow - 0 1px 2px rgba(0,0,0,0.05)
Level 2 (elevated): interactive card hover - 0 4px 6px rgba(0,0,0,0.07)
Level 3 (floating): dropdown, popover - 0 10px 15px rgba(0,0,0,0.1)
Level 4 (overlay): modal, dialog - 0 20px 25px rgba(0,0,0,0.15)

```css
:root {
  --shadow-0: none;
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-2: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-3: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-4: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

## Shadow color: gray, not black

Default tool shadows use `rgba(0,0,0,0.1)` which looks harsh. Instead, change the shadow color to a light gray and increase blur significantly. This produces softer, more natural shadows:

```css
/* Harsh (default Figma/tool shadow) */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

/* Better: gray color + more blur */
box-shadow: 0 4px 16px rgba(100, 100, 110, 0.12);
```

When in doubt, remove the shadow entirely. Most of the time, less visual noise = better design.

## Multi-layer shadows (the secret to realistic shadows)
Single box-shadow looks flat. Use 2-3 stacked:

```css
/* Realistic card shadow */
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.04),
  0 4px 8px rgba(0, 0, 0, 0.06),
  0 12px 24px rgba(0, 0, 0, 0.04);

/* Elevated card (hover state) */
box-shadow:
  0 2px 4px rgba(0, 0, 0, 0.05),
  0 8px 16px rgba(0, 0, 0, 0.08),
  0 20px 32px rgba(0, 0, 0, 0.06);

/* Dropdown / popover */
box-shadow:
  0 2px 4px rgba(0, 0, 0, 0.06),
  0 8px 20px rgba(0, 0, 0, 0.1),
  0 24px 48px rgba(0, 0, 0, 0.08);

/* Modal / dialog */
box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.07),
  0 12px 28px rgba(0, 0, 0, 0.13),
  0 32px 64px rgba(0, 0, 0, 0.1);
```

## Shadow in dark mode
Shadows are barely visible on dark backgrounds. Use these strategies:

- Increase opacity: 0.3-0.5 instead of 0.05-0.15
- Use subtle lighter border instead of shadow
- Use a soft light glow (positive spread, light color)

```css
/* Dark mode shadow alternatives */
.dark .card {
  /* Strategy 1: higher opacity shadow */
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.4);
}

.dark .card-border {
  /* Strategy 2: border instead of shadow */
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: none;
}

.dark .card-glow {
  /* Strategy 3: subtle light glow */
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 4px 16px rgba(0, 0, 0, 0.5);
}
```

## Border usage
- Default border color: gray-200 light mode, gray-700 dark mode
- Border width: 1px for most cases, 2px for emphasis only
- Border-bottom only for horizontal dividers (no full borders)
- Avoid border-top + border-bottom together (creates double lines)

```css
:root {
  --border-color: #e5e7eb;       /* gray-200 */
  --border-color-dark: #374151;  /* gray-700 */
  --border-width: 1px;
  --border-width-emphasis: 2px;
}

.divider {
  border: none;
  border-bottom: var(--border-width) solid var(--border-color);
}
```

## Border radius
Pick ONE value and use it everywhere:

- 4px: sharp, technical (code editors, data tools)
- 6px: balanced, professional (dashboards, SaaS)
- 8px: friendly, modern (consumer apps, marketing)
- 12px: soft, playful (mobile apps, casual products)
- Full radius (9999px): pills (tags, badges, avatars)

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;  /* your main radius */
  --radius-lg: 12px;
  --radius-full: 9999px;
}
```

**Nested border-radius rule:** when a rounded element sits inside another rounded element, the inner radius must be smaller. Formula: `inner radius = outer radius - gap between them`. If outer is 30px and gap is 10px, inner should be 20px. If the gap exceeds the outer radius, use 0 (no rounding). Without this, nested corners look uneven - the distance increases at curves even though straight edges match.

Exception: pill shapes (9999px) don't need this adjustment since the distance is constant all the way around.

## Card design patterns

### Flat card (border only)
- 1px border, no shadow
- Cleanest look, good for dense layouts
- Hover: subtle shadow or border color change

```css
.card-flat {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.card-flat:hover {
  border-color: #9ca3af; /* gray-400 */
  box-shadow: var(--shadow-1);
}
```

### Raised card (shadow)
- No border, subtle shadow
- Feels floating, good for standalone items
- Hover: increase shadow level

```css
.card-raised {
  border: none;
  border-radius: var(--radius-md);
  padding: 16px;
  background: #ffffff;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;
}

.card-raised:hover {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 8px 16px rgba(0, 0, 0, 0.09),
    0 20px 32px rgba(0, 0, 0, 0.06);
}
```

### Ghost card (minimal)
- No border, no shadow
- Just padding and content grouping
- Hover: add subtle background

```css
.card-ghost {
  border: none;
  border-radius: var(--radius-md);
  padding: 16px;
  background: transparent;
  transition: background-color 0.15s ease;
}

.card-ghost:hover {
  background-color: #f9fafb; /* gray-50 */
}
```

## Dividers and separators
- Horizontal rule: 1px solid, border color
- Use gap + no divider when possible (whitespace beats lines)
- Section dividers: full-width, margin: 32px 0 to 48px 0
- List dividers: inset (aligned with text, not edge-to-edge)
- Vertical dividers: 1px wide, height auto, in flex layouts

```css
/* Section divider */
.divider-section {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 40px 0;
}

/* Inset list divider */
.divider-inset {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 0 0 0 16px; /* inset from left edge */
}

/* Vertical divider in flex layout */
.divider-vertical {
  width: 1px;
  background-color: var(--border-color);
  align-self: stretch;
  flex-shrink: 0;
}
```

## Ring and outline patterns
- Focus rings: 2px solid primary, 2px offset
- Selected state: ring + primary-50 background
- Input focus: ring instead of border change

```css
/* Focus ring */
.focusable:focus-visible {
  outline: 2px solid #3b82f6; /* primary blue */
  outline-offset: 2px;
}

/* Selected state */
.item-selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  background-color: #eff6ff; /* blue-50 */
}

/* Input focus (ring replaces border) */
.input {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  outline: none;
}
```

## The 3-Shade Layering System

Depth is the easiest way to fix boring UIs. The recipe: create 3 shades of the same color (increment lightness by ~0.05-0.1), then layer them.

```css
:root {
  --bg-dark:  hsl(220 10% 8%);   /* page base - deepest layer */
  --bg:       hsl(220 10% 13%);  /* cards, sections - middle */
  --bg-light: hsl(220 10% 18%);  /* interactive/important - top */
}
```

- **Dark** = page background (everything sits on top of this)
- **Base** = cards, sections, containers
- **Light** = interactive elements, selected states, buttons, important items

Lighter = elevated = closer to user = more important. Then add shadows to sell the illusion.

**When color layers are enough, remove borders.** If an element is already differentiated by background shade, a border is redundant. Drop it for a cleaner look.

## Raised vs Recessed Shadows

Shadows aren't just for elevation - you can push elements DOWN too.

```css
/* Raised: light inset on top + dark shadow below (elevated, important) */
.raised {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),  /* light from above */
    0 2px 4px rgba(0, 0, 0, 0.2);              /* dark shadow below */
}

/* Recessed: dark inset on top + light inset below (pushed in, contained) */
.recessed {
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),        /* dark pushes top down */
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);   /* light rim at bottom */
}
```

Use **raised** for cards, selected tabs, CTAs, elevated elements. Use **recessed** for inputs, progress bar tracks, tables, and wells/containers. The top-light/bottom-dark pattern simulates light coming from above, which our eyes expect.

## Hover Shadow Escalation

Small shadow at rest, bigger on hover. One of the cheapest ways to add interactivity:

```css
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

This works best in light mode. Don't ignore light mode just because you prefer dark - it's the default for most users.

## When to use shadow vs border vs background
Decision tree:
1. Separating content at same level? -> Border or whitespace
2. Elevating content above page? -> Shadow
3. Grouping content together? -> Background color
4. Interactive hover state? -> Shadow increase or background change
5. Elements already differentiated by bg shade? -> Drop the border
6. Never use all three simultaneously

## Common shadow/border mistakes
- Different border-radius values across the page (pick one and be consistent)
- Shadows on every element (too heavy, reserve for elevated content)
- Dark borders in dark mode (invisible or too harsh - use rgba white instead)
- Border-radius on only some corners randomly
- Using box-shadow instead of outline for focus (bad for accessibility)
- Putting borders inside borders (card with bordered internal sections)
- Keeping borders on elements that are already differentiated by background shade (redundant)
- Flat design with no depth variation (everything on same plane = boring)
- Ignoring light mode depth (shadows are more visible and effective in light themes)
