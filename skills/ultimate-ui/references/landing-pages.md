<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with landing pages, hero sections, CTAs, or conversion-focused layouts. -->

# Landing Pages

## The proven section order
1. Hero (above the fold) - headline + subheadline + CTA + visual
2. Social proof (logos, testimonials, numbers)
3. Problem/pain statement
4. Solution/features (3-4 features with icons)
5. How it works (3 steps)
6. Detailed features or use cases
7. Testimonials/case studies
8. Pricing (if applicable)
9. FAQ
10. Final CTA (repeat hero CTA)

## Hero section

- Headline: 1 line, 6-12 words, specific value proposition
- Subheadline: 1-2 lines, supporting detail
- CTA: 1 primary button, optionally 1 secondary
- Visual: screenshot, illustration, or demo video
- Padding: 80-120px vertical

Good headlines: specific + benefit-focused ("Deploy in 30 seconds, not 30 minutes")
Bad headlines: vague + feature-focused ("The next-generation deployment platform")

```css
.hero {
  padding: 96px 0;
}
.hero__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.hero__headline {
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.hero__subheadline {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  max-width: 480px;
}
.hero__visual img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
}

/* Centered variant */
.hero--centered .hero__inner {
  grid-template-columns: 1fr;
  text-align: center;
  justify-items: center;
}

@media (max-width: 768px) {
  .hero { padding: 56px 0; }
  .hero__inner { grid-template-columns: 1fr; gap: 40px; }
}
```

## CTA design

- Verb + object: "Start free trial", "Get started" - never "Submit" or "Click here"
- Primary CTA: 48px height, primary color, high contrast
- One CTA per section, repeat at bottom
- Urgency without manipulation: "Free 14-day trial, no credit card"

```css
.btn--cta {
  height: 48px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  background: var(--color-primary);
  color: #fff;
  border: none;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.4);
  transition: background 0.15s ease, transform 0.1s ease;
}
.btn--cta:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}
```

## Social proof patterns

### Logo bar

```css
.logo-bar__logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}
.logo-bar__logos img {
  height: 28px;
  filter: grayscale(1) opacity(0.6);
  transition: filter 0.2s ease;
}
.logo-bar__logos img:hover {
  filter: grayscale(0) opacity(1);
}
```

### Testimonial cards

- Quote + name + title + company + avatar, 3 cards in a row (1 on mobile)

```css
.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.testimonial-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.testimonial-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.testimonial-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
@media (max-width: 640px) {
  .testimonials__grid { grid-template-columns: 1fr; }
}
```

### Stats row

```css
.stats__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}
.stat__number {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  color: var(--color-primary);
}
.stat__label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 6px;
}
```

## Feature sections

### Three-column features

```css
.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.feature-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(79, 70, 229, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: 16px;
}
.feature-card__title {
  font-size: 1.0625rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.feature-card__description {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
}
@media (max-width: 640px) {
  .features__grid { grid-template-columns: 1fr; }
}
```

### Alternating feature rows

Image + text, alternating sides. Use `order` to flip on even rows.

```css
.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding: 64px 24px;
}
.feature-row:nth-child(even) .feature-row__content { order: 1; }
.feature-row:nth-child(even) .feature-row__visual { order: 0; }
@media (max-width: 768px) {
  .feature-row { grid-template-columns: 1fr; gap: 32px; }
}
```

### Feature bento grid

```css
.bento__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 220px;
  gap: 16px;
}
.bento-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: box-shadow 0.2s ease;
}
.bento-card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); }
.bento-card--wide { grid-column: span 2; }
.bento-card--tall { grid-row: span 2; }
@media (max-width: 768px) {
  .bento__grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .bento-card--wide, .bento-card--tall { grid-column: span 1; grid-row: span 1; }
}
```

## Pricing section

- 2-3 tiers, highlight recommended, annual/monthly toggle

```css
.pricing__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}
.pricing-card {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 32px;
}
.pricing-card--recommended {
  border-color: var(--color-primary);
  border-width: 2px;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.12);
  position: relative;
}
.pricing-card__badge {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 14px;
  border-radius: 99px;
}
.pricing-card__amount {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.pricing-card__features li::before {
  content: '\2713';
  color: var(--color-primary);
  font-weight: 700;
}
@media (max-width: 1024px) {
  .pricing__cards { grid-template-columns: 1fr; max-width: 420px; }
}
```

## FAQ section - accessible accordion

```css
.faq__list details { border-bottom: 1px solid var(--color-border); }
.faq__list summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  font-weight: 600;
  cursor: pointer;
}
.faq__list summary::-webkit-details-marker { display: none; }
.faq__list summary::after {
  content: '+';
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}
.faq__list details[open] summary::after { transform: rotate(45deg); }
.faq__answer { padding: 0 0 20px; line-height: 1.7; color: var(--color-text-secondary); }
```

## Page-level section CSS

```css
.section { width: 100%; padding: 96px 0; }
.section__inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section:nth-child(even) { background: var(--color-surface-subtle, #f9fafb); }
.section__eyebrow {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 12px;
}
.section__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* Sticky frosted header */
.lp-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

html { scroll-behavior: smooth; }

@media (max-width: 768px) { .section { padding: 56px 0; } }
```

## Common landing page mistakes

- Headline is about the company, not the user's problem
- Too many CTAs competing (pick ONE primary action)
- Wall of text instead of scannable sections
- No social proof
- CTA below the fold with no reason to scroll
- Feature list without benefits (users care about outcomes)
- Stock photos instead of product screenshots
