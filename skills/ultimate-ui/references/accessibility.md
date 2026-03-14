<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with accessibility, WCAG compliance, ARIA, or keyboard navigation. -->

# Accessibility

## WCAG 2.2 quick reference

Level AA requirements (the standard target):

- Color contrast: 4.5:1 normal text, 3:1 large text (18px+ or 14px bold+)
- Touch targets: minimum 24x24px (44x44px recommended)
- Focus indicators: visible, 2px+ ring, 3:1 contrast against background
- Text resize: page must work at 200% zoom
- Motion: respect `prefers-reduced-motion`

## Semantic HTML (do this first)

Use the right element for the job - this gets you a11y for free.

- Use `<button>` for actions, `<a href>` for navigation. NEVER `<div>`/`<span>` with `onClick`
- Use `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>` landmarks
- Use `<h1>`-`<h6>` in order, never skip levels
- Use `<ul>`/`<ol>` for lists, `<table>` for tabular data
- Use `<label>` with `for=` attribute for every form input
- Use `<fieldset>` + `<legend>` for radio/checkbox groups

```html
<!-- Bad -->
<div class="btn" onClick={handleSave}>Save</div>
<span onClick={goHome}>Home</span>

<!-- Good -->
<button type="button" onClick={handleSave}>Save</button>
<a href="/">Home</a>
```

## ARIA patterns

Only add ARIA when semantic HTML is not enough.

### Icon-only buttons

```html
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>
```

### Expandable toggles / accordions

```html
<button aria-expanded="false" aria-controls="section-1">
  Section title
</button>
<div id="section-1" hidden>...</div>
```

Update `aria-expanded` and toggle `hidden` on click.

### Dynamic content announcements

```html
<!-- Polite: announces after current speech finishes (toasts, status) -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Form saved successfully
</div>

<!-- Assertive: interrupts immediately (errors only) -->
<div aria-live="assertive" role="alert">
  Session expired. Please log in again.
</div>
```

### Modal dialogs

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Confirm deletion</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
  ...
</div>
```

### Navigation current page

```html
<nav aria-label="Main">
  <a href="/" aria-current="page">Home</a>
  <a href="/about">About</a>
</nav>
```

### Decorative elements

```html
<!-- Decorative icon: hide from screen readers -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Decorative image -->
<img src="divider.png" alt="" />
```

## Keyboard navigation

- Tab order must match visual order - never use positive `tabindex` (only `0` or `-1`)
- All interactive elements must be reachable by keyboard
- `Escape` closes modals, dropdowns, popovers, and drawers
- `Enter`/`Space` activates buttons; `Enter` follows links
- Arrow keys navigate within components (tabs, menus, radio groups, sliders)
- Focus trap inside modals: `Tab` cycles through focusable elements within the modal only
- Provide a "Skip to main content" link as the first focusable element on the page

```html
<!-- Skip link: visually hidden until focused -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<main id="main-content" tabindex="-1">...</main>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
}
.skip-link:focus {
  top: 0;
}
```

### Focus trap implementation (modals)

```js
function trapFocus(modalEl) {
  const focusable = modalEl.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modalEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  first.focus(); // move focus into modal on open
}
```

## Focus styles

```css
/* Modern focus-visible approach: only show ring for keyboard users */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Remove focus ring for mouse/pointer users */
:focus:not(:focus-visible) {
  outline: none;
}

/* High contrast mode support */
@media (forced-colors: active) {
  :focus-visible {
    outline: 2px solid ButtonText;
  }
}
```

## prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In JavaScript, check before animating:

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  element.animate([...], { duration: 300 });
}
```

## Form accessibility

```html
<!-- Every input needs a visible label -->
<label for="email">Email address <span aria-hidden="true">*</span></label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert" aria-live="polite">
  <!-- Populated by JS on validation -->
</span>

<!-- Group related fields -->
<fieldset>
  <legend>Notification preferences</legend>
  <label><input type="checkbox" name="email-notif" /> Email</label>
  <label><input type="checkbox" name="sms-notif" /> SMS</label>
</fieldset>
```

Rules:
- Placeholder is NOT a label - always use `<label>`
- Link error message to input with `aria-describedby`
- Mark required fields with `aria-required="true"` AND a visible indicator
- Provide inline validation, not just on submit
- On submit errors, move focus to an error summary at top of form

## Image accessibility

```html
<!-- Informative image: describe what it conveys, not what it looks like -->
<img src="chart.png" alt="Q3 revenue grew 24% year-over-year to $4.2M" />

<!-- Decorative image: empty alt, not omitted -->
<img src="hero-bg.jpg" alt="" />

<!-- Complex image: link to long description -->
<img src="org-chart.png" alt="Company org chart" aria-describedby="org-desc" />
<p id="org-desc">The CEO reports to the board. Three VPs report to the CEO: ...</p>

<!-- Meaningful icon -->
<svg role="img" aria-label="Warning">...</svg>
```

## Color and contrast

- Never use color alone to convey information - add icons, patterns, or text labels
- Test with color blindness simulators (Chrome DevTools > Rendering > Emulate vision)
- Contrast ratios:
  - Normal text (< 18px, or < 14px bold): 4.5:1 minimum
  - Large text (18px+ or 14px+ bold): 3:1 minimum
  - UI components and focus rings: 3:1 minimum

```css
/* Accessible error state: color + icon + text, not color alone */
.input-error {
  border-color: #d93025; /* red, but also accompanied by error text below */
}
/* Pair with: <span>Error: ...</span> */
```

Tools: Chrome DevTools contrast checker, axe DevTools browser extension, Colour Contrast Analyser app.

## Screen reader testing

| Screen reader | Platform | Shortcut |
|---|---|---|
| VoiceOver | macOS | Cmd+F5 |
| VoiceOver | iOS | Triple-click home/side |
| NVDA (free) | Windows | Install from nvaccess.org |
| TalkBack | Android | Volume up + down hold |

Common things to verify:
- All images have meaningful alt text
- All buttons and links have descriptive labels (not just "click here")
- Heading order is logical (`h1` > `h2` > `h3`)
- Dynamic content changes are announced via `aria-live`
- Reading order matches visual order

## Common accessibility mistakes

| Mistake | Problem | Fix |
|---|---|---|
| `<div onClick={...}>` | Not keyboard accessible, no role announced | Use `<button>` |
| Placeholder as label | Disappears on input, fails contrast | Add visible `<label>` |
| `tabindex="2"` | Breaks natural tab order | Only use `tabindex="0"` or `tabindex="-1"` |
| `aria-label` on `<div>` | ARIA label has no effect without a role | Add `role` or use semantic element |
| Missing `alt` attribute | Screen reader reads file name | Always set `alt=""` at minimum |
| Color-only error state | Color-blind users miss errors | Add icon or text alongside color |
| Auto-playing animation | Triggers vestibular disorders | Respect `prefers-reduced-motion` |
| Focus moves to top on modal close | Confusing for keyboard users | Return focus to the trigger element |
| `aria-hidden` on focused element | Removes element from a11y tree while still focusable | Remove `aria-hidden` or `tabindex="-1"` |
| Tooltip on hover only | Not accessible by keyboard or touch | Trigger on focus as well as hover |
