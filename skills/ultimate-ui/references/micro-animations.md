<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
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
