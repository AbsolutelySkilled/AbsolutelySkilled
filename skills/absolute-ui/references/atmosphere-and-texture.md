<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     working with backgrounds, textures, gradients, visual atmosphere, or depth effects. -->

# Atmosphere and Texture

## Why Flat Backgrounds Feel Generic

Solid white or gray backgrounds are the number one tell of AI-generated UI. Every default template, every quick prototype, every "just ship it" screen lands on `#ffffff` or `#f5f5f5` and calls it done. The result: an interface that feels like a wireframe someone forgot to finish.

Real designed interfaces use subtle texture, gradients, or patterns to create atmosphere. The background is not just a container - it sets the emotional tone. Compare any Stripe page to a generic SaaS template. The difference is almost entirely in the background treatment.

**The goal:** make backgrounds feel intentional and crafted without distracting from content.

---

## Gradient Meshes

Layer multiple radial-gradient or conic-gradient calls to create organic, mesh-like backgrounds. The key is low opacity and wide spread so blobs blend softly.

### Cool tone (default/professional)

```css
.gradient-mesh-cool {
  background:
    radial-gradient(at 20% 80%, hsla(210, 100%, 70%, 0.3) 0%, transparent 50%),
    radial-gradient(at 80% 20%, hsla(340, 100%, 70%, 0.2) 0%, transparent 50%),
    radial-gradient(at 50% 50%, hsla(260, 100%, 80%, 0.15) 0%, transparent 60%),
    hsl(220, 20%, 97%);
}
```

### Warm tone (creative/friendly)

```css
.gradient-mesh-warm {
  background:
    radial-gradient(at 30% 70%, hsla(30, 100%, 70%, 0.25) 0%, transparent 50%),
    radial-gradient(at 70% 30%, hsla(350, 90%, 65%, 0.2) 0%, transparent 50%),
    radial-gradient(at 60% 80%, hsla(45, 100%, 75%, 0.15) 0%, transparent 55%),
    hsl(35, 25%, 97%);
}
```

### Dark mode mesh

```css
.gradient-mesh-dark {
  background:
    radial-gradient(at 20% 80%, hsla(210, 100%, 50%, 0.15) 0%, transparent 50%),
    radial-gradient(at 80% 20%, hsla(280, 80%, 50%, 0.1) 0%, transparent 50%),
    radial-gradient(at 50% 50%, hsla(200, 100%, 40%, 0.08) 0%, transparent 60%),
    hsl(220, 25%, 8%);
}
```

**Tips:**
- Keep individual blob opacity between 0.08 and 0.3
- Place blobs at different positions (20/80, 80/20, 50/50) to avoid symmetry
- The final solid color in the stack is your fallback - always include it

---

## Noise and Grain Overlays

Grain adds analog warmth. Two techniques:

### SVG filter approach (inline, no external files)

```css
.grain-filter {
  position: relative;
  isolation: isolate;
}

.grain-filter::after {
  content: '';
  position: absolute;
  inset: 0;
  filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 1;
}
```

### SVG data URI approach (repeating tile)

```css
.grain-tile::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E") repeat;
  background-size: 256px 256px;
  opacity: 0.04;
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

### Combining grain with gradient mesh

```css
.atmosphere {
  position: relative;
  background:
    radial-gradient(at 20% 80%, hsla(210, 100%, 70%, 0.3) 0%, transparent 50%),
    radial-gradient(at 80% 20%, hsla(340, 100%, 70%, 0.2) 0%, transparent 50%),
    hsl(220, 20%, 97%);
}

.atmosphere::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E") repeat;
  background-size: 256px 256px;
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

---

## Glassmorphism and Layered Transparencies

Beyond basic `backdrop-filter: blur(10px)` - here is how to make glass panels look real.

### Frosted glass with tinted background

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
```

### Light mode glass (tinted white)

```css
.glass-light {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px) saturate(1.8);
  -webkit-backdrop-filter: blur(16px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}
```

### Multiple transparency layers for depth

```css
.layered-glass {
  position: relative;
}

.layered-glass::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-radius: inherit;
  z-index: -1;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1px;
}
```

**Key details:**
- Always include `-webkit-backdrop-filter` for Safari
- `saturate(1.5)` makes colors behind the glass pop - without it, blur looks washed out
- The `1px solid rgba(255, 255, 255, 0.1)` border creates a visible edge on the glass
- `inset 0 1px 0 rgba(255, 255, 255, 0.5)` adds a highlight line on the top edge

---

## Geometric Patterns as Backgrounds

CSS-only patterns that add structure without images.

### Dot grid

```css
.dot-grid {
  background-image: radial-gradient(circle, #00000008 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Dark mode */
.dark .dot-grid {
  background-image: radial-gradient(circle, #ffffff06 1px, transparent 1px);
}
```

### Line grid

```css
.line-grid {
  background-image:
    linear-gradient(to right, #00000006 1px, transparent 1px),
    linear-gradient(to bottom, #00000006 1px, transparent 1px);
  background-size: 40px 40px;
}
```

### Diagonal stripes

```css
.diagonal-stripes {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    #00000004 10px,
    #00000004 11px
  );
}
```

### Combining pattern with gradient

```css
.patterned-hero {
  background:
    radial-gradient(circle, #00000008 1px, transparent 1px),
    radial-gradient(at 30% 70%, hsla(210, 100%, 70%, 0.2) 0%, transparent 50%),
    hsl(220, 20%, 97%);
  background-size: 24px 24px, 100% 100%, 100% 100%;
}
```

---

## Dramatic Shadows for Depth

Move beyond generic gray shadows. Colored shadows and large diffuse spreads create real depth.

### Colored shadows matching content

```css
.hero-image {
  box-shadow:
    0 20px 60px -10px rgba(var(--brand-rgb), 0.3),
    0 40px 100px -20px rgba(0, 0, 0, 0.15);
}

/* For a blue-themed element */
.card-blue {
  box-shadow:
    0 10px 40px -8px rgba(59, 130, 246, 0.25),
    0 4px 12px -2px rgba(0, 0, 0, 0.08);
}
```

### Large diffuse shadows for hero sections

```css
.hero-element {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 12px 24px rgba(0, 0, 0, 0.06),
    0 48px 80px -12px rgba(0, 0, 0, 0.12);
}
```

### Glow effect for dark mode CTAs

```css
.dark .cta-button {
  box-shadow:
    0 0 20px rgba(99, 102, 241, 0.4),
    0 0 60px rgba(99, 102, 241, 0.15);
  transition: box-shadow 0.3s ease;
}

.dark .cta-button:hover {
  box-shadow:
    0 0 30px rgba(99, 102, 241, 0.5),
    0 0 80px rgba(99, 102, 241, 0.2);
}
```

---

## Dark Mode Atmosphere

Dark mode is where texture shines most because contrast works in your favor.

### Subtle colored glow behind key elements

```css
.dark .feature-card {
  position: relative;
}

.dark .feature-card::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    ellipse at center,
    hsla(210, 100%, 50%, 0.08) 0%,
    transparent 70%
  );
  z-index: -1;
  pointer-events: none;
}
```

### Gradient borders using background-clip

```css
.gradient-border {
  position: relative;
  background: hsl(220, 25%, 10%);
  border-radius: 12px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    hsla(210, 100%, 70%, 0.3),
    hsla(280, 100%, 70%, 0.1),
    transparent 60%
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
}
```

### Ambient light effect on page

```css
.dark-page {
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, hsla(220, 80%, 50%, 0.12) 0%, transparent 60%),
    hsl(220, 25%, 6%);
  min-height: 100vh;
}
```

---

## When Texture Helps vs When Clean is Better

| Context | Recommendation | Reason |
|---|---|---|
| Marketing / landing pages | Texture strongly recommended | Character and brand personality |
| Hero sections | Gradient mesh + grain | Sets the visual tone for the page |
| Onboarding / empty states | Subtle pattern or gradient | Makes empty space feel intentional |
| Blog / content pages | Minimal - maybe a faint gradient | Content is the focus |
| Dense data UIs (dashboards) | Keep clean, no texture | Texture competes with data density |
| Tables and forms | No texture | Readability is paramount |
| Modals and dialogs | Glass or subtle background | Creates layered depth |
| Dark mode in general | Texture adds the most value | Flat dark surfaces feel like voids |

**Rule of thumb:** texture should be felt, not seen. If you notice it consciously, it is too much.

---

## Common Texture Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Grain opacity above 0.06 | Visible noise, looks like a rendering artifact | Keep opacity between 0.02 and 0.05 |
| Gradient blobs too saturated | Background competes with content for attention | Keep individual blob opacity under 0.3 |
| Mixing too many techniques | Gradient + grain + pattern + glass = visual chaos | Pick one primary technique, one subtle accent |
| Not testing on low-contrast displays | Subtle effects vanish or bloom unpredictably | Test on a low-quality laptop screen |
| Texture behind text without contrast | Text becomes hard to read over gradients | Ensure WCAG AA contrast at every point in the gradient |
| Using texture on every surface | Feels overwhelming, loses the intentional quality | Reserve texture for hero areas and backgrounds, keep content surfaces clean |
| Forgetting `pointer-events: none` on overlays | Grain or pattern pseudo-elements block clicks | Always add `pointer-events: none` to decorative overlays |
| Skipping `-webkit-backdrop-filter` | Glass effects break in Safari | Always include the prefixed version alongside the standard property |
| Animation on gradient meshes | Constant movement is distracting and costly | Static meshes work - animate only on hover or scroll if at all |
