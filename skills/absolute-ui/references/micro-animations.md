<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     working with animations, transitions, micro-interactions, or motion design. -->

# Micro-animations and Interactions

## Animation principles for UI
1. Duration: 150-300ms for most UI transitions. Under 100ms feels instant. Over 500ms feels slow.
2. Easing: ease-out for entrances, ease-in for exits, ease-in-out for state changes. NEVER use linear for UI (feels robotic).
3. Purpose: every animation must serve a purpose - showing state change, providing feedback, or guiding attention.
4. Restraint: animate the minimum needed. If everything moves, nothing stands out.

## Timing reference
| Action | Duration | Easing |
|---|---|---|
| Button hover/press | 100-150ms | ease |
| Dropdown open | 150-200ms | ease-out |
| Modal open | 200-250ms | ease-out |
| Modal close | 150-200ms | ease-in |
| Toast enter | 200ms | ease-out |
| Toast exit | 150ms | ease-in |
| Page transition | 200-300ms | ease-in-out |
| Accordion expand | 200-250ms | ease-out |
| Color/bg change | 150ms | ease |

## Essential micro-interactions

### Button feedback
- Hover: darken bg (150ms), cursor pointer
- Active: scale(0.98) or darken further (100ms)
- Loading: disable + spinner replace
- CSS for button transitions

### Hover effects
- Cards: translateY(-2px) + shadow increase
- Links: underline slide-in or color change
- Icons: scale(1.1) or color change
- Images: scale(1.03) inside overflow:hidden container
- CSS examples for each

### Toggle/switch
- Thumb slides left/right (200ms ease)
- Background color changes
- Width: 44px, height: 24px, thumb: 20px
- CSS for animated toggle

### Accordion/collapse
- Height auto animation using grid-template-rows: 0fr -> 1fr (200ms)
- Chevron icon rotates 180deg
- CSS for accessible animated accordion

### Dropdown/popover
- Enter: fade in + slide down 4-8px (150ms ease-out)
- Exit: fade out (100ms ease-in)
- Scale from 0.95 -> 1 for popover feel
- CSS with @keyframes

### Tab switching
- Active indicator slides with transform (200ms)
- Content crossfade or slide
- CSS for animated tab indicator

## CSS transitions reference
Provide reusable transition custom properties:
```css
:root {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

## Keyframe animations

### Fade in up (for content appearing)
- translateY(16px) + opacity 0 -> translateY(0) + opacity 1
- 200ms ease-out

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Scale in (for modals, popovers)
- scale(0.95) + opacity 0 -> scale(1) + opacity 1
- 150ms ease-out

```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Pulse (for skeleton loading)
- opacity 1 -> 0.5 -> 1
- 1.5s ease infinite

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Spin (for loading spinners)
- rotate(0) -> rotate(360deg)
- 0.8s linear infinite

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Shake (for error feedback)
- translateX(-4px, 4px, -4px, 0)
- 300ms ease

```css
@keyframes shake {
  0%       { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  50%      { transform: translateX(4px); }
  75%      { transform: translateX(-4px); }
  100%     { transform: translateX(0); }
}
```

### Slide in from right (for sheets, panels)
- translateX(100%) -> translateX(0)
- 250ms ease-out

```css
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
```

## Scroll-triggered animations
- Use IntersectionObserver (not scroll events)
- Animate when entering viewport, not every scroll
- Common: fade-in, slide-up, stagger children
- Keep it subtle - large motions on scroll feel gimmicky

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
```

```css
[data-animate] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
[data-animate].animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

## Staggered animations
- Children appear one by one with delay increment
- Delay: index * 50-100ms
- Max total stagger: 300-500ms (don't keep users waiting)

```css
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
/* Or set via JS: el.style.animationDelay = `${index * 50}ms`; */
```

## Orchestrated Page Reveals

One well-choreographed page-load sequence creates more delight than scattered micro-interactions. Plan the entrance as a story: what appears first, what follows, what lands last.

### Hero entrance sequence

```css
/* Each element enters in narrative order */
.hero__eyebrow {
  animation: fade-in-up 400ms ease-out both;
  animation-delay: 0ms;
}
.hero__headline {
  animation: fade-in-up 500ms ease-out both;
  animation-delay: 100ms;
}
.hero__subtext {
  animation: fade-in-up 400ms ease-out both;
  animation-delay: 250ms;
}
.hero__cta {
  animation: fade-in-up 400ms ease-out both;
  animation-delay: 400ms;
}
.hero__visual {
  animation: scale-in 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 300ms;
}

/* The visual enters with a different animation type - 
   mixing animation styles creates more interest than 
   uniform fade-in-up on everything */
```

### Key principles for orchestration
- **Lead with text, follow with visuals** - text loads fast, images may not
- **Max total sequence: 600-800ms** - beyond that, it feels slow
- **Mix animation types** - headline slides up, visual scales in, accent fades. Uniform motion is boring
- **One hero sequence per page** - don't orchestrate every section
- **Below-fold sections**: simpler entrance (single fade-in-up on scroll), not full choreography

## Scroll-Triggered Storytelling

Build sequences where scroll position reveals content in narrative order. Each section's entrance should feel intentional, not just "fade in when visible."

```css
/* Progressive reveal on scroll - each child animates when parent enters viewport */
.story-section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}
.story-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Children stagger within the section */
.story-section.is-visible .story-item:nth-child(1) { transition-delay: 0ms; }
.story-section.is-visible .story-item:nth-child(2) { transition-delay: 80ms; }
.story-section.is-visible .story-item:nth-child(3) { transition-delay: 160ms; }

.story-item {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
}
.story-section.is-visible .story-item {
  opacity: 1;
  transform: translateY(0);
}
```

```js
// Scroll observer that triggers section animations
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.story-section').forEach((el) => sectionObserver.observe(el));
```

## 3D Transforms and Card Flip

CSS can break the flat 2D plane with `perspective` and 3D transforms.

```css
/* 3D container - perspective = distance from user's eyes to screen */
.card-3d {
  perspective: 800px;          /* 100px = nose-to-screen, 800px = arm's length */
  transform-style: preserve-3d; /* children keep their 3D positions */
}

/* Card flip - front and back stacked with position absolute */
.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;  /* hide face when rotated away */
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-back {
  transform: rotateY(180deg);   /* starts facing away */
}
.card-3d.is-flipped .card-front { transform: rotateY(180deg); }
.card-3d.is-flipped .card-back  { transform: rotateY(360deg); }
```

The custom cubic-bezier `(0.34, 1.56, 0.64, 1)` overshoots and settles back, giving the flip a sense of physical weight and momentum.

## SVG Path Animations

**Drawing/tracing effect** with `stroke-dasharray` + `stroke-dashoffset`:

```css
.icon-path {
  stroke-dasharray: 1;      /* one giant dash covers whole path */
  stroke-dashoffset: 1;     /* pushed off-screen = hidden */
  animation: draw 1.5s ease-out forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; } /* pull dash into view */
}
```

Set `pathLength="1"` on the SVG path element to normalize the length, making dash values simple (0 = hidden, 1 = fully drawn).

## Dynamic Animations with JavaScript

For animations where coordinates are unknown at author time (e.g., "fly to cart"):

```js
// Get start and destination positions
const from = product.getBoundingClientRect();
const to = cartIcon.getBoundingClientRect();
const dx = to.left - from.left;
const dy = to.top - from.top;

// Clone, position, and animate
const clone = product.cloneNode(true);
clone.style.cssText = `position:fixed;top:${from.top}px;left:${from.left}px;z-index:999;`;
document.body.appendChild(clone);

clone.animate([
  { transform: 'translate(0,0) scale(1)', opacity: 1 },
  { transform: `translate(${dx}px,${dy}px) scale(0.1)`, opacity: 0 }
], { duration: 700, easing: 'ease-in' }).onfinish = () => {
  clone.remove();
  updateCartCount(); // update number AFTER item "lands"
};
```

Key: delay state updates (cart count, success message) until the animation finishes. Timing sells the illusion.

## prefers-reduced-motion
- ALWAYS respect this setting
- Remove animations, keep instant state changes

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Common animation mistakes
- Animating layout properties (width, height, top, left) - use transform instead
- Duration too long (over 300ms for simple interactions)
- Bounce/spring on everything (one bounce effect max per page)
- Animation on page load for every element (pick 1-2 hero elements)
- Not respecting prefers-reduced-motion
- Using linear easing for UI transitions
- Animating color with transition: all (animate specific properties)
- Scattered micro-interactions without a cohesive motion story - plan one orchestrated sequence instead
- Same animation type on every element (all fade-in-up) - mix slide, scale, and fade for visual variety
