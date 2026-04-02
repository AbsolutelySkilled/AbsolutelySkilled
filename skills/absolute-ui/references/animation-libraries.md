<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     using Framer Motion, GSAP, or needing spring physics parameters and easing references. -->

# Animation Libraries & Advanced Techniques

Companion to `micro-animations.md` - this reference covers JavaScript animation
libraries, spring physics, and production patterns for complex motion work.

---

## 1. Standard Easing Library

Material Design easing curves as CSS custom properties:

```css
:root {
  /* Material Design standard curves */
  --ease-standard:   cubic-bezier(0.4, 0.0, 0.2, 1);   /* default for most */
  --ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);   /* entering elements */
  --ease-accelerate: cubic-bezier(0.4, 0.0, 1.0, 1);   /* exiting elements */

  /* Expressive curves */
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* playful overshoot */
  --ease-bounce:     cubic-bezier(0.68, -0.55, 0.27, 1.55); /* cartoon bounce */
  --ease-snappy:     cubic-bezier(0.2, 0, 0, 1);        /* quick, decisive */

  /* Duration tokens */
  --duration-instant: 100ms;  /* button press, toggle */
  --duration-fast:    150ms;  /* hover, color change */
  --duration-normal:  250ms;  /* modal open, dropdown */
  --duration-slow:    350ms;  /* page transition, complex animation */
  --duration-slower:  500ms;  /* orchestrated sequence max */
}
```

**When to use each:**

- `--ease-standard` - state changes, most transitions
- `--ease-decelerate` - elements entering the screen (ease-out)
- `--ease-accelerate` - elements leaving the screen (ease-in)
- `--ease-spring` - playful UI, toggle states, card interactions
- `--ease-snappy` - decisive actions, tab switches, nav highlights

---

## 2. Spring Physics Parameters

For Framer Motion and CSS `spring()`:

```jsx
// Framer Motion spring configs
const springs = {
  // Gentle - tooltips, subtle movements
  gentle: { type: "spring", stiffness: 120, damping: 20 },

  // Default - most UI interactions
  default: { type: "spring", stiffness: 300, damping: 25 },

  // Snappy - toggles, switches, quick feedback
  snappy: { type: "spring", stiffness: 500, damping: 30 },

  // Bouncy - playful interactions, celebrations
  bouncy: { type: "spring", stiffness: 400, damping: 15 },

  // Heavy - large elements, page transitions
  heavy: { type: "spring", stiffness: 200, damping: 35 },
};
```

**Rules of thumb:**

- Higher stiffness = faster movement
- Higher damping = less oscillation (bounce)
- `stiffness: 300-500, damping: 25-35` covers 90% of UI needs
- Ratio matters: stiffness/damping > 15 = noticeable bounce

---

## 3. Framer Motion Patterns (React)

### Enter/Exit with AnimatePresence

```jsx
import { motion, AnimatePresence } from "framer-motion";

// Modal with enter/exit
function Modal({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          {/* Modal content */}
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Layout Animations

Auto-animate position and size changes:

```jsx
// List with automatic reorder animation
function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <motion.li
          key={item.id}
          layout           /* enables layout animation */
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
        >
          {item.name}
        </motion.li>
      ))}
    </ul>
  );
}
```

### Staggered Children

```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function StaggeredList({ items }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map((i) => (
        <motion.li key={i.id} variants={item}>{i.name}</motion.li>
      ))}
    </motion.ul>
  );
}
```

### Framer Motion Gotchas

- `AnimatePresence` requires a unique `key` on each direct child
- `layout` animations can conflict with CSS transforms - avoid both on same element
- Clean up animation subscriptions in useEffect returns
- `exit` animations only work when the component is a direct child of `AnimatePresence`

---

## 4. GSAP Basics

For complex timeline sequences:

```js
import { gsap } from "gsap";

// Simple timeline
const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } });

tl.from(".hero__title", { y: 30, opacity: 0 })
  .from(".hero__subtitle", { y: 20, opacity: 0 }, "-=0.3") // overlap by 0.3s
  .from(".hero__cta", { y: 20, opacity: 0, scale: 0.95 }, "-=0.2")
  .from(".hero__visual", { x: 40, opacity: 0 }, "-=0.4");
```

### Scroll-Driven Animation

```js
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.from(".section__content", {
  scrollTrigger: {
    trigger: ".section",
    start: "top 80%",
  },
  y: 40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
});
```

### When GSAP > Framer Motion

- Complex multi-step timelines with precise overlap control
- Scroll-driven animations with scrubbing
- Animating SVG paths, morphing
- When you need `.from()`, `.to()`, `.fromTo()` flexibility

### When Framer Motion > GSAP

- React component enter/exit animations
- Layout animations (automatic position/size)
- Gesture-driven interactions (drag, hover, tap)
- When you want declarative animation in JSX

---

## 5. Performance Rules

- **Only animate `transform` and `opacity`** for 60fps - everything else triggers layout/paint
- **`will-change` hints:** use sparingly, only on elements about to animate, remove after
- **CSS transitions for simple state changes**, JS animation for complex sequences
- **On mobile:** reduce animation complexity, disable parallax, respect `prefers-reduced-motion`
- **GSAP cleanup:** always `kill()` timelines and ScrollTriggers on component unmount

```js
// React cleanup pattern for GSAP
useEffect(() => {
  const ctx = gsap.context(() => {
    // all GSAP animations here
  }, containerRef);

  return () => ctx.revert(); // kills all animations in scope
}, []);
```

```jsx
// Reduced motion media query hook
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
```
