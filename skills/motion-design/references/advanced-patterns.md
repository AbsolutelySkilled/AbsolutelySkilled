<!-- Part of the Motion Design AbsolutelySkilled skill. Load this file when working with GSAP timelines, micro-interactions, or complex animation sequences. -->

# Advanced Motion Patterns

## Micro-interactions - hover, press, toggle

```tsx
import { motion } from 'framer-motion';

// Button with press feedback
function Button({ children, onClick }: React.ComponentProps<'button'>) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

// Animated toggle switch (CSS)
```

```css
.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--color-gray-300);
  border-radius: 12px;
  transition: background 150ms var(--ease-in-out);
  cursor: pointer;
}
.toggle[aria-checked="true"] {
  background: var(--color-primary-500);
}
.toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 200ms var(--ease-spring);
}
.toggle[aria-checked="true"]::after {
  transform: translateX(20px);
}

/* Accordion with grid-template-rows trick */
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms var(--ease-out);
}
.accordion-content[data-open="true"] {
  grid-template-rows: 1fr;
}
.accordion-content > div {
  overflow: hidden;
}
```

## GSAP timeline for complex sequences

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Hero entrance sequence
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.from('.hero-badge',    { opacity: 0, y: 16, duration: 0.4 })
    .from('.hero-headline', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
    .from('.hero-subtext',  { opacity: 0, y: 16, duration: 0.4 }, '-=0.3')
    .from('.hero-cta',      { opacity: 0, scale: 0.95, duration: 0.35 }, '-=0.2');

  return tl;
}

// Scroll-triggered feature cards
gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    y: 32,
    duration: 0.5,
    delay: i * 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      once: true,
    },
  });
});
```

> The `'-=0.2'` offset in GSAP timelines creates overlap between steps for
> a fluid, cohesive sequence. Without it each step feels disconnected. Overlap
> by 20-40% of the previous step's duration.
