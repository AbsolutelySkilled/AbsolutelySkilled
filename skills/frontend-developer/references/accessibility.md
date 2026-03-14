<!-- Part of the frontend-developer AbsolutelySkilled skill. Load this file when working with web accessibility. -->

# Web Accessibility Reference

## WCAG 2.2 Conformance Levels

WCAG (Web Content Accessibility Guidelines) is organized into three levels:

| Level | Meaning | Target |
|---|---|---|
| **A** | Minimum - removing major barriers | Legal floor in many jurisdictions |
| **AA** | Standard - removes most barriers | The industry standard target; required by most legal standards (ADA, EN 301 549) |
| **AAA** | Enhanced - specialized needs | Aspire to where feasible; not required for full sites |

**AA is the practical target.** It covers the majority of users with disabilities without being prohibitively restrictive. New WCAG 2.2 criteria added to AA: focus appearance (2.4.11), dragging movements alternative (2.5.7), target size minimum 24x24px (2.5.8).

---

## Semantic HTML

Use the right element - native semantics are free accessibility, no ARIA needed.

| Need | Use | Not |
|---|---|---|
| Main navigation | `<nav>` | `<div class="nav">` |
| Primary content | `<main>` | `<div id="main">` |
| Standalone content | `<article>` | `<div class="article">` |
| Grouped related content | `<section>` (with heading) | `<div>` |
| Clickable action | `<button>` | `<div onclick>` |
| Page-level heading | `<h1>` (one per page) | `<p class="title">` |
| Supplementary content | `<aside>` | `<div class="sidebar">` |
| Site header/footer | `<header>`, `<footer>` | `<div id="header">` |
| Data table | `<table>` with `<th scope>` | CSS grid/flex layout |
| Form control | `<input>`, `<select>`, `<textarea>` | `<div contenteditable>` |

```html
<!-- BAD: div soup -->
<div class="btn" onclick="submit()">Submit</div>

<!-- GOOD: native button - keyboard accessible, announced as button, activatable with Space/Enter -->
<button type="submit">Submit</button>
```

Heading hierarchy matters: screen readers use headings for page navigation. Don't skip levels (h1 -> h3). One `<h1>` per page.

---

## ARIA

ARIA (Accessible Rich Internet Applications) adds semantics to non-semantic HTML. It only affects the accessibility tree - it does not change visual rendering or behavior.

### The 5 Rules of ARIA

1. **Don't use ARIA if a native HTML element exists** - prefer `<button>` over `role="button"`
2. **Don't change native semantics unless you must** - don't add `role="heading"` to a `<button>`
3. **All interactive ARIA controls must be keyboard operable** - if you add a role, add keyboard support
4. **Don't hide focusable elements** - `aria-hidden="true"` on a focusable element traps keyboard users
5. **All interactive elements must have an accessible name** - every button, input, link needs a label

### Common ARIA Patterns

**Dialog (Modal)**
```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <h2 id="dialog-title">Confirm Delete</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
  <button autofocus>Cancel</button>
  <button>Delete</button>
</div>
```
- `aria-modal="true"` tells screen readers to ignore content behind the modal
- Move focus to first interactive element (or dialog itself) on open
- Return focus to trigger on close

**Tabs**
```html
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">General</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Privacy</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>...</div>
```

**Combobox (autocomplete)**
```html
<input type="text" role="combobox" aria-expanded="true" aria-haspopup="listbox"
       aria-autocomplete="list" aria-controls="suggestions" aria-activedescendant="opt-2">
<ul id="suggestions" role="listbox">
  <li role="option" id="opt-1">Apple</li>
  <li role="option" id="opt-2" aria-selected="true">Apricot</li>
</ul>
```

**Live Regions**
```html
<!-- Polite: waits for user to finish current action before announcing -->
<div aria-live="polite" aria-atomic="true">
  3 results found
</div>

<!-- Assertive: interrupts immediately - use only for errors/urgent info -->
<div aria-live="assertive" role="alert">
  Error: Form submission failed
</div>
```

### When NOT to use ARIA
- Don't add `role="button"` to a `<div>` - use `<button>`
- Don't add `aria-label` to `<div>` or `<span>` with no role - it does nothing
- Don't use `aria-hidden="true"` on the `<body>` or on focused elements
- Don't add `role="presentation"` to elements with children that have meaning
- Redundant ARIA: `<button aria-role="button">` - the `<button>` already has that role

---

## Keyboard Navigation

All interactive functionality must be keyboard accessible. Mouse-only interactions (hover-only menus, drag-only sorting) fail WCAG 2.1 AA.

### Tab order
- Follows DOM order by default - keep DOM order logical
- `tabindex="0"`: makes non-interactive element focusable, joins natural tab order
- `tabindex="-1"`: programmatically focusable (via `.focus()`) but removed from tab order
- `tabindex="1+"`: avoid - creates unpredictable tab order, hard to maintain

### Skip links
Provide a skip navigation link as the first focusable element on every page:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<!-- ... navigation ... -->
<main id="main-content" tabindex="-1">...</main>
```
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
}
.skip-link:focus {
  top: 0; /* visible only on focus */
}
```

### Focus Management
Move focus programmatically when UI changes significantly:
```js
// After opening modal
modalEl.querySelector('[autofocus], button, [href], input').focus();

// After closing modal - return to trigger
triggerButton.focus();

// After route change in SPA
document.querySelector('h1').focus(); // h1 should have tabindex="-1"
```

### Focus Trapping (modals)
When a modal is open, Tab must cycle within the modal only:
```js
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}
```

### Roving tabindex (composite widgets)
For widgets like toolbars, tab lists, radio groups - only one item in tab order at a time; arrow keys navigate within:
```js
// Tab moves focus into/out of group; arrow keys move within
items.forEach((item, i) => {
  item.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      items[i].setAttribute('tabindex', '-1');
      const next = items[(i + 1) % items.length];
      next.setAttribute('tabindex', '0');
      next.focus();
    }
  });
});
```

---

## Screen Reader Testing

Manual testing with real screen readers is irreplaceable. Automated tools catch ~30% of issues.

### VoiceOver (macOS/iOS)
- Enable: Cmd + F5 (macOS) or triple-click home (iOS)
- Navigate: VO key (Caps Lock or Ctrl+Option) + arrows
- Read page: VO + A
- Open rotor (landmark/heading nav): VO + U
- **Test checklist**: headings make sense out of context, buttons/links are descriptive, forms announce errors, modals trap focus, dynamic content is announced

### NVDA (Windows, free)
- Most-used screen reader on Windows
- Navigate by heading: H; by landmark: D; by form element: F
- Browse mode (reading) vs. Forms mode (interacting) - be aware of mode switching
- Test in Firefox + NVDA (strong combination)

### What to verify
1. Every image has meaningful alt text (or `alt=""` for decorative)
2. Form inputs are announced with their label, type, and required state
3. Error messages are associated with their inputs and announced
4. Button and link text is descriptive standalone ("Submit order" not "Click here")
5. Modal focus trap works; focus returns to trigger on close
6. Dynamic updates (toasts, status messages) are announced without stealing focus
7. Page title changes on route navigation in SPAs

---

## Color and Contrast

### WCAG Contrast Ratios (AA level)
| Element | Minimum ratio |
|---|---|
| Normal text (< 18pt / < 14pt bold) | 4.5:1 |
| Large text (>= 18pt / >= 14pt bold) | 3:1 |
| UI components (input borders, focus rings) | 3:1 against adjacent color |
| Graphical objects (icons, chart lines) | 3:1 |
| Decorative elements | No requirement |

```css
/* Focus indicator must meet 3:1 against adjacent colors */
:focus-visible {
  outline: 3px solid #005fcc; /* check contrast against both background and element color */
  outline-offset: 2px;
}
```

### Never convey information by color alone
```html
<!-- BAD - colorblind users can't distinguish -->
<span style="color: red">Error</span>

<!-- GOOD - icon + color + text -->
<span class="error">
  <svg aria-hidden="true"><!-- error icon --></svg>
  Error: Invalid email address
</span>
```

### Tools
- **Browser DevTools**: Chrome accessibility panel shows contrast ratio
- **axe DevTools browser extension**: flags contrast violations
- **Colour Contrast Analyser** (desktop app): eyedrop any pixels
- **APCA** (Advanced Perceptual Contrast Algorithm): more nuanced, used in WCAG 3.0 (future)

---

## Forms

### Labels
Every input needs a visible, associated label:
```html
<!-- Preferred: explicit label with for/id -->
<label for="email">Email address</label>
<input type="email" id="email" name="email">

<!-- Wrapping label also works -->
<label>
  Email address
  <input type="email" name="email">
</label>

<!-- aria-label for icon-only inputs -->
<input type="search" aria-label="Search products">

<!-- aria-labelledby for labels defined elsewhere -->
<h2 id="billing">Billing address</h2>
<input type="text" aria-labelledby="billing" aria-label="Street address">
```

Do NOT use `placeholder` as the only label - it disappears on focus, fails contrast requirements.

### Required fields and validation
```html
<!-- Use required attribute (announced by screen readers) -->
<input type="email" id="email" required aria-describedby="email-hint email-error">
<span id="email-hint">We'll never share your email</span>
<span id="email-error" role="alert" hidden>Please enter a valid email</span>
```

```js
// On validation failure: show error, move focus, announce via role=alert
input.setAttribute('aria-invalid', 'true');
errorEl.removeAttribute('hidden'); // role=alert triggers announcement
input.focus();
```

### Grouping
```html
<!-- Fieldset + legend for related inputs (radio groups, checkboxes, address) -->
<fieldset>
  <legend>Shipping method</legend>
  <label><input type="radio" name="shipping" value="standard"> Standard (5-7 days)</label>
  <label><input type="radio" name="shipping" value="express"> Express (2 days)</label>
</fieldset>
```

---

## Dynamic Content

### Live regions
```html
<!-- Status messages (non-urgent) -->
<div role="status" aria-live="polite">Changes saved</div>

<!-- Alerts (urgent, interrupts) -->
<div role="alert" aria-live="assertive">Session expiring in 1 minute</div>

<!-- Log (chat, feed) -->
<div role="log" aria-live="polite" aria-relevant="additions">...</div>
```

Inject content into pre-existing live region elements - don't create new ones dynamically, as some screen readers only register them at page load.

### SPA route changes
Single-page apps don't trigger native browser page announcements. Implement:
1. Update `document.title` on every route change
2. Move focus to `<h1>` (with `tabindex="-1"`) or a skip-link after navigation
3. Optionally use a live region to announce "Navigated to: [page title]"

### Loading states
```html
<!-- Indicate busy state to AT -->
<button aria-disabled="true" aria-busy="true">
  <span aria-hidden="true"><!-- spinner --></span>
  Saving...
</button>

<!-- Container loading state -->
<section aria-busy="true" aria-label="Loading search results">
  <!-- skeleton content -->
</section>
```

---

## Media

### Alt text
- **Informative images**: describe purpose and content concisely
- **Decorative images**: `alt=""` (empty string) - screen readers skip entirely; never omit the attribute
- **Functional images** (links/buttons with only an image): describe the action, not the image
- **Complex images** (charts, infographics): short alt + long description via `aria-describedby` or adjacent text
- Never start with "Image of..." or "Picture of..." - screen readers already announce it's an image

```html
<!-- Decorative -->
<img src="divider.svg" alt="">

<!-- Functional -->
<a href="/home"><img src="logo.svg" alt="Acme Corp - Home"></a>

<!-- Complex -->
<img src="chart.png" alt="Q4 revenue chart" aria-describedby="chart-desc">
<p id="chart-desc">Revenue grew from $2M in October to $3.5M in December...</p>
```

### Video and audio
- `<video>` needs closed captions (`<track kind="captions">`) for all speech/meaningful audio
- Audio-only content needs a transcript
- Video-only content needs an audio description or text alternative
- Auto-playing media with sound violates WCAG 1.4.2 - provide pause/stop control

### Reduced motion
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

Parallax, auto-playing carousels, and large motion animations can trigger vestibular disorders. Provide a static alternative.

---

## Automated Testing

### axe-core
Industry-standard accessibility rules engine. Powers Deque's axe DevTools, Lighthouse, and many CI tools.

```js
import axe from 'axe-core';

// In tests (works with any test runner)
const results = await axe.run(document.body);
expect(results.violations).toHaveLength(0);

// Analyze a specific element
const results = await axe.run(document.querySelector('#modal'));
```

### Lighthouse accessibility audit
Built into Chrome DevTools. Gives a 0-100 score. Run via:
- DevTools > Lighthouse tab > check Accessibility
- CLI: `npx lighthouse https://example.com --only-categories=accessibility`

### Limitations of automated tools
**Automated tools catch approximately 30% of WCAG failures.** They reliably catch:
- Missing alt text, labels, ARIA attributes
- Contrast failures
- Missing form labels
- Structural issues (duplicate IDs, invalid ARIA roles)

They cannot catch:
- Meaningful vs. decorative image judgment
- Whether alt text is actually descriptive
- Focus management correctness
- Screen reader announcement quality
- Cognitive load and plain language issues
- Whether keyboard navigation order is logical

Always supplement automated testing with:
1. Keyboard-only navigation walkthrough
2. Screen reader testing (VoiceOver, NVDA)
3. Testing with real users with disabilities
