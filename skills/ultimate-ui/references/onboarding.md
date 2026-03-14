<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with onboarding flows, empty states, first-run experience, or tutorials. -->

# Onboarding

## First-run experience principles
1. Get the user to value as fast as possible (under 60 seconds to first "aha")
2. Ask only what you absolutely need upfront
3. Show, don't tell - interactive > text explanation
4. Let users skip and come back later
5. Celebrate first completion (confetti, success message)

## Progressive disclosure pattern
- Start with the essential 20% of features
- Reveal complexity as users demonstrate competence
- Use contextual tooltips (not upfront tours) for advanced features
- "Learn more" links, not forced tutorials

## Onboarding flow patterns

### 1. Welcome wizard (multi-step setup)
- 3-5 steps max
- Progress indicator (dots or numbered steps)
- Each step has ONE clear action
- Allow skip on optional steps
- Structure: Welcome -> Profile/Config -> First action -> Success

```css
/* Step indicator */
.wizard-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.wizard-step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background 0.2s, transform 0.2s;
}

.wizard-step-dot.active {
  background: var(--color-primary);
  transform: scale(1.3);
}

.wizard-step-dot.completed {
  background: var(--color-primary);
}

/* Wizard card */
.wizard-card {
  max-width: 480px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
}

.wizard-card__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.wizard-card__description {
  color: var(--color-text-muted);
  margin-bottom: 28px;
}

.wizard-card__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
}

.wizard-card__skip {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}
```

### 2. Empty state onboarding
- Every empty state is an onboarding opportunity
- Structure: illustration + headline + description + CTA
- The CTA should be the primary action ("Create your first project")
- Show sample data or templates as alternative to blank slate

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  min-height: 320px;
}

.empty-state__illustration {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  opacity: 0.7;
}

.empty-state__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text);
}

.empty-state__description {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  max-width: 360px;
  margin-bottom: 28px;
  line-height: 1.5;
}

.empty-state__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.empty-state__secondary {
  margin-top: 16px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
```

### 3. Contextual tooltips
- Appear on first visit to a new feature area
- One at a time, never a barrage
- Dismissible, with "don't show again"
- Point to the actual UI element

```css
.onboarding-tooltip {
  position: absolute;
  z-index: 1000;
  max-width: 280px;
  padding: 16px;
  background: var(--color-primary-dark, #1e3a5f);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

/* Arrow pointing down toward the target element */
.onboarding-tooltip::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: var(--color-primary-dark, #1e3a5f);
  border-bottom: none;
}

.onboarding-tooltip__title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.onboarding-tooltip__body {
  font-size: 0.875rem;
  line-height: 1.5;
  opacity: 0.9;
}

.onboarding-tooltip__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}

.onboarding-tooltip__dismiss {
  font-size: 0.8125rem;
  opacity: 0.75;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

/* Backdrop highlight for the targeted element */
.onboarding-highlight {
  position: relative;
  z-index: 999;
  border-radius: 4px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.4);
}
```

### 4. Checklist pattern
- Show a getting-started checklist with 4-6 items
- Items complete as user takes actions
- Progress bar fills up
- Disappears or minimizes after all items done

```css
.onboarding-checklist {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 20px;
  max-width: 360px;
  background: var(--color-surface);
}

.onboarding-checklist__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.onboarding-checklist__title {
  font-size: 1rem;
  font-weight: 600;
}

.onboarding-checklist__progress-bar {
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  margin-bottom: 18px;
  overflow: hidden;
}

.onboarding-checklist__progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}

.checklist-item:last-child {
  border-bottom: none;
}

.checklist-item__check {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
}

.checklist-item.completed .checklist-item__check {
  background: var(--color-success);
  border-color: var(--color-success);
  color: #fff;
}

.checklist-item.completed .checklist-item__label {
  text-decoration: line-through;
  color: var(--color-text-muted);
}
```

## Empty states - types and copy

| Type | Headline template | CTA label | Icon guidance |
|---|---|---|---|
| First-use | "You haven't created any {X} yet" | "Create your first {X}" | Outline illustration of the object |
| Search/filter empty | "No {X} match your filters" | "Clear filters" | Magnifying glass outline |
| Error empty | "Something went wrong" | "Try again" | Warning triangle outline |
| Completed/caught up | "All caught up!" | "View archive" | Checkmark circle outline |

Use simple outline illustrations (2px stroke, brand color). Avoid sad faces or error icons for first-use states - keep the tone inviting.

## Form patterns for onboarding
- Multi-step over a single long form (reduces cognitive load)
- One question per screen for critical info (Typeform style)
- Show progress (step 2 of 4)
- Pre-fill from context where possible
- Inline validation - green checkmark on valid field
- Smart defaults > empty fields

## Skeleton screens

```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background: var(--color-border);
  border-radius: 4px;
  animation: skeleton-pulse 1.6s ease-in-out infinite;
}

.skeleton--text {
  height: 1em;
  width: 100%;
  margin-bottom: 8px;
}

.skeleton--text.short { width: 60%; }
.skeleton--text.medium { width: 80%; }

.skeleton--avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton--image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}

.skeleton--button {
  height: 36px;
  width: 120px;
  border-radius: 6px;
}
```

Match skeleton layout exactly to the real content layout so the transition is seamless.

## Success celebrations

- **Confetti**: Use for major milestones only (first project created, paid plan activated). Use a lightweight library like `canvas-confetti`. Fire once, never loop.
- **Checkmark animation**: SVG path animation for completed task / saved item. CSS `stroke-dasharray` trick.
- **Success toast**: Brief (3s) toast for routine completions ("Project saved").
- **Green state change**: Input border turns green with checkmark icon for valid inline fields.

```css
/* Animated checkmark */
@keyframes draw-check {
  from { stroke-dashoffset: 48; }
  to { stroke-dashoffset: 0; }
}

.success-check-icon path {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: draw-check 0.4s ease forwards 0.1s;
}
```

## Common onboarding mistakes

- Forcing a 10-step tutorial before the user can do anything
- Showing all features at once (feature overload)
- No empty states - blank page with no guidance
- Generic empty states ("No data" with no CTA)
- Tooltips that cover the element they describe
- Not allowing users to skip
- No way to replay onboarding or re-read tips
- Celebrating trivial actions (cheapens major milestones)
- Asking for credit card before demonstrating value
