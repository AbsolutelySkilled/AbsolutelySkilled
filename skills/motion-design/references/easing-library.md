<!-- Part of the motion-design AbsolutelySkilled skill. Load this file when
     choosing easing curves, configuring spring physics, or selecting animation
     durations for a specific interaction type. -->

# Easing Library

A reference for easing functions, spring configurations, and duration
guidelines. Use this to pick the right motion personality for any interaction.

---

## Named easing presets

These CSS `cubic-bezier` values cover the full range of UI motion needs.
Define them as custom properties in `:root` for consistent use across a project.

```css
:root {
  /* Standard material-design inspired set */
  --ease-standard:    cubic-bezier(0.4, 0.0, 0.2, 1);   /* elements moving within screen */
  --ease-decelerate:  cubic-bezier(0.0, 0.0, 0.2, 1);   /* elements entering from off-screen */
  --ease-accelerate:  cubic-bezier(0.4, 0.0, 1.0, 1);   /* elements exiting to off-screen */

  /* Common shorthand aliases */
  --ease-out:         cubic-bezier(0.0, 0.0, 0.2, 1);   /* same as decelerate */
  --ease-in:          cubic-bezier(0.4, 0.0, 1.0, 1);   /* same as accelerate */
  --ease-in-out:      cubic-bezier(0.4, 0.0, 0.2, 1);   /* same as standard */

  /* Expressive / playful */
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1); /* gentle overshoot, feels alive */
  --ease-bounce:      cubic-bezier(0.68, -0.55, 0.27, 1.55); /* strong overshoot, use rarely */
  --ease-anticipate:  cubic-bezier(0.36, 0, 0.66, -0.56); /* pull back before forward motion */

  /* Linear - only for color, opacity at constant speed */
  --ease-linear:      linear;
}
```

### When to use each curve

| Curve | Use case | Avoid for |
|---|---|---|
| `--ease-decelerate` (ease-out) | Elements entering the screen, dropdowns opening, modals appearing | Exit animations |
| `--ease-accelerate` (ease-in) | Elements leaving the screen, modals closing | Entrances - feels abrupt |
| `--ease-standard` (ease-in-out) | Elements moving from one position to another, drawer sliding | Entrances and exits |
| `--ease-spring` | Buttons, toggles, interactive feedback, anything user-triggered | Long sequences, background transitions |
| `--ease-bounce` | Celebratory moments (confetti landing, success state), one per page max | Navigation, everyday interactions |
| `--ease-anticipate` | Menus that "pull back" before expanding, expressive hero elements | Any subtle or professional UI |
| `linear` | Progress bars, color stops in gradients, opacity at uniform speed | Shape transforms (looks robotic) |

---

## Spring configurations (Framer Motion)

Spring replaces duration + easing with physics parameters. The formula:
`stiffness` controls acceleration speed, `damping` controls how quickly
oscillation stops, `mass` affects inertia.

### Named spring presets

```ts
export const springs = {
  // Snappy - responds immediately, settles fast. Good for buttons, toggles.
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
    mass: 1,
  },

  // Smooth - gentle acceleration, clean landing. Good for panels, cards.
  smooth: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  // Bouncy - visible overshoot. Good for menus, celebratory UI, popovers.
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
    mass: 0.8,
  },

  // Slow - heavy, deliberate. Good for drawers, large modals.
  slow: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 28,
    mass: 1.2,
  },

  // Instant - effectively no animation. Use when prefers-reduced-motion.
  instant: {
    type: 'spring' as const,
    stiffness: 9999,
    damping: 9999,
    mass: 1,
  },
} as const;
```

### Tuning guide

| Parameter | Lower value | Higher value |
|---|---|---|
| `stiffness` | Slower to start, floaty | Faster to start, snappy |
| `damping` | More oscillation, bouncy | Less oscillation, settles fast |
| `mass` | Lighter, faster overall | Heavier, slower overall |

- To make a spring **faster without adding bounce**: increase stiffness and damping proportionally.
- To make a spring **bouncier**: lower damping without changing stiffness.
- To make a spring **heavier**: increase mass, adjust stiffness up to compensate.

---

## Duration guidelines

### By interaction type

| Interaction | Duration | Notes |
|---|---|---|
| Button hover/active | 100-150ms | Faster feels more responsive |
| Checkbox / radio | 150ms | Instant-feeling but perceptible |
| Toggle switch thumb | 200ms | Thumb travels visible distance |
| Tooltip appear | 150ms | Longer disappear feels more natural |
| Tooltip disappear | 100ms | |
| Dropdown open | 150-200ms | |
| Dropdown close | 100-150ms | |
| Modal / dialog open | 200-250ms | |
| Modal / dialog close | 150-200ms | Exit faster than enter |
| Drawer / sheet open | 250-350ms | Larger surface needs more time |
| Drawer / sheet close | 200-250ms | |
| Toast / notification enter | 200ms | |
| Toast / notification exit | 150ms | |
| Accordion expand | 200-250ms | |
| Accordion collapse | 150-200ms | |
| Page / route transition | 200-300ms | Keep short - users wait |
| Skeleton pulse loop | 1500ms | Slow pulse feels calmer |
| Loading spinner rotation | 750-900ms | |
| Scroll reveal | 250-350ms | |
| Stagger per child | 50-75ms delay | Cap total stagger at 400ms |

### Rules of thumb

- Enter animations are always slower than exit animations for the same element. Exits should feel quick and decisive.
- When in doubt, go faster. 200ms feels fine to the designer; 300ms feels sluggish to the user.
- Duration above 500ms is only acceptable for page-level transitions or carefully choreographed marketing sequences. Never for interactive UI feedback.

---

## GSAP named eases

GSAP uses string names for its easing library. Key ones to know:

```ts
// Standard eases
'power1.out'   // gentle ease-out, similar to CSS ease
'power2.out'   // medium ease-out, good default for most UI
'power3.out'   // strong ease-out, snappy and decisive
'power4.out'   // very strong, reserve for dramatic entrances

// Natural motion
'expo.out'     // starts extremely fast, glides to rest - hero animations
'circ.out'     // circular, very smooth deceleration

// Playful
'back.out(1.7)'  // slight overshoot on arrival - menus, popovers
'elastic.out(1, 0.3)' // spring-like oscillation - celebrations only
'bounce.out'     // physical bounce - very expressive, use once per page

// Exits
'power2.in'    // standard exit acceleration
'power3.in'    // strong exit, dramatic

// Symmetric
'power2.inOut' // smooth symmetric - elements moving across screen
'sine.inOut'   // very gentle S-curve - subtle background animations
```

---

## CSS scroll-driven animation ranges

With native CSS scroll-driven animations (`animation-timeline: scroll()` or
`animation-timeline: view()`), `animation-range` controls when the animation
starts and ends relative to the scroll position.

```css
/* Reveal as element enters viewport */
.reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

/* Parallax effect tied to full page scroll */
.parallax-bg {
  animation: parallax linear;
  animation-timeline: scroll(root);
  animation-range: 0% 100%;
}

/* Sticky header fades in after scrolling 100px */
.sticky-header {
  animation: fade-in linear both;
  animation-timeline: scroll(root);
  animation-range: 80px 140px;
}
```

### Range keywords

| Keyword | Meaning |
|---|---|
| `entry 0%` | Element's top edge enters viewport |
| `entry 100%` | Element's bottom edge enters viewport |
| `exit 0%` | Element's top edge exits viewport |
| `exit 100%` | Element's bottom edge exits viewport |
| `cover 0%` | Element starts covering the viewport |
| `cover 100%` | Element stops covering the viewport |

> Browser support: Chrome 115+, Edge 115+. Use `@supports` or IntersectionObserver
> as a fallback for Safari and Firefox until support improves.
