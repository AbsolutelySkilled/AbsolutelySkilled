<!-- Part of the figma-to-code AbsolutelySkilled skill. Load this file when
     you need a complete property-by-property reference of Figma-to-CSS mappings,
     including effects, blend modes, shadows, typography details, and constraints. -->

# Figma to CSS - Complete Property Mapping

## Auto Layout

| Figma | CSS |
|---|---|
| Auto layout ON | `display: flex` |
| Direction: Horizontal | `flex-direction: row` |
| Direction: Vertical | `flex-direction: column` |
| Gap (uniform) | `gap: <value>px` |
| Gap (row / column separate) | `row-gap: <r>px; column-gap: <c>px` |
| Padding (uniform) | `padding: <value>px` |
| Padding (individual) | `padding: <top> <right> <bottom> <left>` |
| Align items: Start | `align-items: flex-start` |
| Align items: Center | `align-items: center` |
| Align items: End | `align-items: flex-end` |
| Align items: Baseline | `align-items: baseline` |
| Justify content: Start | `justify-content: flex-start` |
| Justify content: Center | `justify-content: center` |
| Justify content: End | `justify-content: flex-end` |
| Justify content: Space between | `justify-content: space-between` |
| Wrap: No wrap | `flex-wrap: nowrap` |
| Wrap: Wrap | `flex-wrap: wrap` |
| Overflow: Hidden | `overflow: hidden` |
| Overflow: Clip | `overflow: clip` |
| Overflow: Scroll | `overflow: auto` |

## Sizing

| Figma | CSS |
|---|---|
| Fixed width (e.g., 320px) | `width: 320px` |
| Fixed height (e.g., 48px) | `height: 48px` |
| Hug contents (width) | `width: fit-content` |
| Hug contents (height) | `height: fit-content` |
| Fill container (width) | `width: 100%` or `flex: 1` (inside flex parent) |
| Fill container (height) | `height: 100%` or `align-self: stretch` |
| Min width | `min-width: <value>px` |
| Max width | `max-width: <value>px` |
| Min height | `min-height: <value>px` |
| Max height | `max-height: <value>px` |
| Aspect ratio (e.g., 16:9) | `aspect-ratio: 16 / 9` |

## Constraints (within non-auto-layout frames)

Constraints tell you what happens when the parent resizes. They map to responsive CSS:

| Figma constraint | CSS interpretation |
|---|---|
| Left | `left: <Xpx>` - pinned to left edge |
| Right | `right: <Xpx>` - pinned to right edge |
| Left + Right | `left: <Xpx>; right: <Xpx>` - stretches with parent |
| Center (horizontal) | `left: 50%; transform: translateX(-50%)` or `margin: auto` |
| Scale (horizontal) | `width: <percent>%` - proportional to parent |
| Top | `top: <Ypx>` - pinned to top edge |
| Bottom | `bottom: <Ypx>` - pinned to bottom edge |
| Top + Bottom | `top: <Ypx>; bottom: <Ypx>` - stretches with parent |
| Center (vertical) | `top: 50%; transform: translateY(-50%)` |
| Scale (vertical) | `height: <percent>%` |

All constrained children need `position: absolute` inside a `position: relative` parent.

## Typography

| Figma property | CSS property | Notes |
|---|---|---|
| Font family | `font-family` | Match exact name; add fallback |
| Font size (px) | `font-size: Xrem` | Divide by 16 to get rem |
| Font weight | `font-weight` | 100-900 numeric values |
| Line height (px) | `line-height: X` (unitless) | Divide by font-size; e.g., 24/16 = 1.5 |
| Line height (%) | `line-height: X` (unitless) | Divide by 100; e.g., 150% = 1.5 |
| Letter spacing (%) | `letter-spacing: Xem` | Divide by 100; e.g., 2% = 0.02em |
| Letter spacing (px) | `letter-spacing: Xpx` | Use directly |
| Text align: Left | `text-align: left` | |
| Text align: Center | `text-align: center` | |
| Text align: Right | `text-align: right` | |
| Text align: Justify | `text-align: justify` | Avoid for small text |
| Text decoration: Underline | `text-decoration: underline` | |
| Text decoration: Strikethrough | `text-decoration: line-through` | |
| Text transform: Uppercase | `text-transform: uppercase` | |
| Text transform: Lowercase | `text-transform: lowercase` | |
| Text transform: Capitalize | `text-transform: capitalize` | |
| Paragraph spacing | `margin-bottom: <value>px` on `<p>` | |
| Truncate (single line) | `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` | |
| Truncate (multi-line) | `display: -webkit-box; -webkit-line-clamp: N; -webkit-box-orient: vertical; overflow: hidden` | |

## Colors and Fill

| Figma | CSS |
|---|---|
| Solid fill | `background-color: <hex>` or `color: <hex>` |
| Linear gradient | `background: linear-gradient(<angle>deg, <stop1>, <stop2>)` |
| Radial gradient | `background: radial-gradient(<stop1>, <stop2>)` |
| Image fill | `background-image: url(...)` |
| Image fill + Cover | `background-size: cover; background-position: center` |
| Image fill + Contain | `background-size: contain; background-repeat: no-repeat` |
| Opacity | `opacity: <value>` (0-1, from Figma's 0-100%) |
| Fill opacity | Use rgba: `rgba(R, G, B, <opacity>)` |

## Borders and Stroke

| Figma | CSS |
|---|---|
| Stroke: Inside | `box-shadow: inset 0 0 0 <width>px <color>` |
| Stroke: Outside | `box-shadow: 0 0 0 <width>px <color>` |
| Stroke: Center | `border: <width>px solid <color>` |
| Stroke color | `border-color: <hex>` |
| Stroke width | `border-width: <value>px` |
| Stroke style: Dashed | `border-style: dashed` |
| Stroke style: Dotted | `border-style: dotted` |
| Individual stroke sides | `border-top`, `border-right`, `border-bottom`, `border-left` |
| Border radius (uniform) | `border-radius: <value>px` |
| Border radius (individual) | `border-radius: <tl> <tr> <br> <bl>` |
| Border radius (circle) | `border-radius: 50%` |

## Effects - Drop Shadow

Figma shadow -> CSS `box-shadow`:

```
box-shadow: <X> <Y> <Blur> <Spread> <Color with opacity>
```

| Figma field | CSS field |
|---|---|
| X offset | 1st value (px) |
| Y offset | 2nd value (px) |
| Blur | 3rd value (px) |
| Spread | 4th value (px) |
| Color + Opacity | Use rgba |

```css
/* Figma: Drop shadow, X:0, Y:4, Blur:16, Spread:0, Color:#000 at 12% */
box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);

/* Multiple shadows: separate with comma */
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.08),
  0 4px 12px rgba(0, 0, 0, 0.12);
```

## Effects - Inner Shadow

```css
/* Figma: Inner shadow, X:0, Y:2, Blur:4, Spread:0, Color:#000 at 8% */
box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.08);
```

## Effects - Background Blur (Backdrop filter)

```css
/* Figma: Background blur, value: 12 */
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px); /* Safari */
```

## Effects - Layer Blur

```css
/* Figma: Layer blur, value: 8 */
filter: blur(8px);
```

## Blend Modes

| Figma blend mode | CSS `mix-blend-mode` |
|---|---|
| Normal | `normal` |
| Darken | `darken` |
| Multiply | `multiply` |
| Color Burn | `color-burn` |
| Lighten | `lighten` |
| Screen | `screen` |
| Color Dodge | `color-dodge` |
| Overlay | `overlay` |
| Soft Light | `soft-light` |
| Hard Light | `hard-light` |
| Difference | `difference` |
| Exclusion | `exclusion` |
| Hue | `hue` |
| Saturation | `saturation` |
| Color | `color` |
| Luminosity | `luminosity` |

For fills within a layer, use `mix-blend-mode` on the element. For background layers, use
`isolation: isolate` on the parent to prevent blend modes from bleeding outside.

## Overflow / Clip Content

| Figma | CSS |
|---|---|
| Clip content: OFF | `overflow: visible` (default) |
| Clip content: ON | `overflow: hidden` |
| Scroll: Horizontal | `overflow-x: auto` |
| Scroll: Vertical | `overflow-y: auto` |

## Layout Grid (background grid in Figma)

Figma layout grids are design-time guides, not runtime elements. They inform your CSS Grid or
flexbox structure. Common patterns:

```css
/* Figma: 12-column grid, 24px gutter, 64px margin */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 64px;
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* Figma: Row grid, 80px row height */
.section {
  padding: 80px 0;
}
```

## Prototyping -> Interaction states

Figma prototype transitions hint at CSS animation:

| Figma transition | CSS approach |
|---|---|
| Instant | No transition |
| Dissolve | `transition: opacity 200ms ease` |
| Move in/out | `transform: translateX/Y` + `transition` |
| Push | `transform: translateX` on both elements |
| Smart animate | CSS `transition` on shared properties |

Hover states in Figma component variants (Default -> Hover) map to `:hover` pseudo-class.
Focus states map to `:focus-visible`. Active/Pressed maps to `:active`.

## Image Properties

| Figma image fill setting | CSS equivalent |
|---|---|
| Fill | `object-fit: cover` (for `<img>`) or `background-size: cover` |
| Fit | `object-fit: contain` |
| Crop | `object-fit: cover` + `object-position: X% Y%` |
| Tile | `background-repeat: repeat` |
| Exposure | No direct CSS equivalent - use `filter: brightness()` |

```css
/* Figma image frame with Fill, 16:9 aspect ratio */
.image-frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
}

.image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

## Common conversion formulas

```
px to rem:         value / 16 = rem     (assumes 16px base)
Line height px:    lh_px / font_px = unitless    (e.g., 24/16 = 1.5)
Letter spacing %:  value / 100 = em     (e.g., 2% = 0.02em)
Opacity %:         value / 100 = decimal (e.g., 80% = 0.8)
Rotation degrees:  used directly        (e.g., 45deg = rotate(45deg))
Shadow color %:    use rgba             (e.g., #000 at 12% = rgba(0,0,0,0.12))
```

## Quick reference: Figma inspect panel sections

When you open Dev Mode (or right-click > Inspect) on any layer, you'll see:

1. **Frame/Layout** - width, height, x, y, constraints, auto layout settings
2. **Fill** - background color, gradient, image fill
3. **Stroke** - border color, width, style, position
4. **Effects** - drop shadow, inner shadow, blur values
5. **Export** - export settings (use for images and icons)
6. **Content** - text content, font properties

For components: the right panel shows the component name, variant properties, and links
to the component source. Always check the component name - it should match your code name.
