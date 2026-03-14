<!-- Part of the accessibility-wcag AbsolutelySkilled skill. Load this file when
     implementing ARIA widget patterns, custom interactive components, or auditing
     complex widgets against ARIA Authoring Practices Guide (APG) specifications. -->

# ARIA Widget Patterns Reference

This reference documents correct ARIA roles, required states/properties, and
keyboard interaction models for common custom widgets. Source: W3C ARIA
Authoring Practices Guide (APG) 1.2 - https://www.w3.org/WAI/ARIA/apg/

---

## General Rules

Before implementing any ARIA widget:
1. Check if a native HTML element covers the use case (`<select>`, `<details>`, `<dialog>`)
2. If building custom: implement **all** keyboard interactions in the spec - partial is broken
3. Test with at least VoiceOver (macOS) and NVDA (Windows) before shipping
4. ARIA only affects the accessibility tree - you must write keyboard behavior manually

---

## Combobox (Autocomplete / Select)

**Roles:** `combobox` on the input, `listbox` on the popup, `option` on each item

**Required ARIA:**
- `aria-expanded` on combobox: `true` when list is visible, `false` when hidden
- `aria-haspopup="listbox"` on combobox
- `aria-autocomplete`: `"list"` (filters), `"none"` (no filtering), `"both"` (filters + inline)
- `aria-controls` pointing to the listbox id
- `aria-activedescendant` on combobox, set to the id of the focused option

**Keyboard interactions:**

| Key | Action |
|---|---|
| Down Arrow | Open popup if closed; move focus to next option |
| Up Arrow | Move focus to previous option |
| Enter | Select focused option; close popup |
| Escape | Close popup; clear selection or restore previous value |
| Alt + Down Arrow | Open popup without moving focus |
| Alt + Up Arrow | Close popup; keep focused option selected |
| Printable characters | Filter list; move to first matching option |
| Home / End | Move to first / last option |

```html
<label for="fruit-input">Fruit</label>
<input
  id="fruit-input"
  type="text"
  role="combobox"
  aria-expanded="false"
  aria-haspopup="listbox"
  aria-autocomplete="list"
  aria-controls="fruit-listbox"
  aria-activedescendant=""
  autocomplete="off"
>
<ul id="fruit-listbox" role="listbox" aria-label="Fruits" hidden>
  <li role="option" id="opt-apple">Apple</li>
  <li role="option" id="opt-banana">Banana</li>
  <li role="option" id="opt-cherry" aria-selected="true">Cherry</li>
</ul>
```

---

## Menu / Menu Button

**Roles:** `button` on trigger, `menu` on container, `menuitem` / `menuitemcheckbox` / `menuitemradio` on items

**Required ARIA:**
- `aria-haspopup="menu"` on the trigger button
- `aria-expanded` on the trigger: `true` when open, `false` when closed
- `aria-controls` on trigger pointing to menu id

**Keyboard interactions:**

| Key | Action |
|---|---|
| Enter / Space | Open menu; focus first item |
| Down Arrow | Open menu (if closed); move to next item |
| Up Arrow | Move to previous item; wraps to last |
| Home / End | Focus first / last item |
| Escape | Close menu; return focus to trigger |
| Tab | Close menu; move focus out of menu |
| Printable character | Move focus to next item starting with that character |

```html
<button type="button" id="menu-trigger"
  aria-haspopup="menu" aria-expanded="false" aria-controls="actions-menu">
  Actions
</button>
<ul id="actions-menu" role="menu" aria-labelledby="menu-trigger" hidden>
  <li role="menuitem" tabindex="-1">Edit</li>
  <li role="menuitem" tabindex="-1">Duplicate</li>
  <li role="separator" aria-hidden="true"></li>
  <li role="menuitem" tabindex="-1">Delete</li>
</ul>
```

Note: Only the focused item has `tabindex="0"` (roving tabindex). All others have `tabindex="-1"`.

---

## Accordion

**Roles:** `button` on each header (inside an `<h2>`–`<h6>`), no special role on panels

**Required ARIA:**
- `aria-expanded` on each trigger button: `true` / `false`
- `aria-controls` on button pointing to panel id
- `id` on panel; `aria-labelledby` pointing to trigger button id (optional but recommended)

**Keyboard interactions:**

| Key | Action |
|---|---|
| Enter / Space | Toggle panel open/closed |
| Tab | Move focus to next focusable element (standard tab order) |
| Shift + Tab | Move focus to previous focusable element |
| Down Arrow (optional) | Move focus to next accordion header |
| Up Arrow (optional) | Move focus to previous accordion header |
| Home (optional) | Focus first accordion header |
| End (optional) | Focus last accordion header |

```html
<div class="accordion">
  <h3>
    <button type="button" aria-expanded="true" aria-controls="panel-1" id="btn-1">
      Section 1
    </button>
  </h3>
  <div id="panel-1" role="region" aria-labelledby="btn-1">
    <p>Panel content...</p>
  </div>

  <h3>
    <button type="button" aria-expanded="false" aria-controls="panel-2" id="btn-2">
      Section 2
    </button>
  </h3>
  <div id="panel-2" role="region" aria-labelledby="btn-2" hidden>
    <p>Panel content...</p>
  </div>
</div>
```

---

## Tooltip

**Role:** `tooltip` on the tooltip container

**Required ARIA:**
- `aria-describedby` on the trigger element pointing to the tooltip id
- Do NOT use `aria-labelledby` for tooltips - they supplement, not replace, the accessible name

**Keyboard interactions:**
- Tooltip appears on focus and hover
- Escape dismisses tooltip (WCAG 1.4.13 - content on hover/focus must be dismissible)
- Tooltip must remain visible when pointer is moved over it

```html
<button type="button" aria-describedby="tooltip-save">
  <svg aria-hidden="true"><!-- save icon --></svg>
  Save
</button>
<div role="tooltip" id="tooltip-save" hidden>
  Save your changes (Ctrl+S)
</div>
```

Note: Never put interactive content (links, buttons) inside a tooltip. Use a `dialog` or `popover` for interactive overlays.

---

## Listbox

**Role:** `listbox` on container, `option` on each item

**Required ARIA:**
- `aria-selected` on each option: `true` / `false`
- `aria-multiselectable="true"` if multiple selection is allowed
- `aria-labelledby` or `aria-label` on the listbox
- `aria-activedescendant` on the listbox element pointing to the focused option id

**Keyboard interactions:**

| Key | Action |
|---|---|
| Down / Up Arrow | Move focus to next / previous option |
| Home / End | Focus first / last option |
| Enter / Space | Select focused option |
| Shift + Down/Up | Extend selection (multiselect) |
| Ctrl + A | Select all (multiselect) |
| Printable character | Jump to next option starting with character |

```html
<ul role="listbox" id="size-listbox" aria-label="T-shirt size"
    aria-activedescendant="size-m" tabindex="0">
  <li role="option" id="size-s" aria-selected="false">Small</li>
  <li role="option" id="size-m" aria-selected="true">Medium</li>
  <li role="option" id="size-l" aria-selected="false">Large</li>
</ul>
```

---

## Tree (Hierarchical List)

**Roles:** `tree` on root, `treeitem` on each item, `group` on nested lists

**Required ARIA:**
- `aria-expanded` on treeitem nodes that have children: `true` (open) / `false` (closed)
- Leaf nodes do not have `aria-expanded`
- `aria-selected` for selection state
- `aria-level`, `aria-posinset`, `aria-setsize` for virtual trees (not rendered in DOM)

**Keyboard interactions:**

| Key | Action |
|---|---|
| Down / Up Arrow | Move focus to next / previous visible item |
| Right Arrow | Expand node (if collapsed); move to first child (if expanded) |
| Left Arrow | Collapse node (if expanded); move to parent (if collapsed) |
| Home / End | Focus first / last visible item |
| Enter | Activate / select item |
| Printable character | Jump to next item starting with character |

```html
<ul role="tree" aria-label="File system">
  <li role="treeitem" aria-expanded="true">
    <span>src/</span>
    <ul role="group">
      <li role="treeitem" aria-expanded="false">
        <span>components/</span>
        <ul role="group">
          <li role="treeitem">Button.tsx</li>
        </ul>
      </li>
      <li role="treeitem">index.ts</li>
    </ul>
  </li>
</ul>
```

---

## Alert / Status

**Roles:** `alert` (assertive, interrupts), `status` (polite, waits)

**When to use:**
- `role="alert"` / `aria-live="assertive"` - errors, session expiry warnings, destructive action confirmations. Interrupts the screen reader immediately.
- `role="status"` / `aria-live="polite"` - form save confirmations, search result counts, progress updates. Waits until the user pauses.

**Critical rules:**
- Inject text content into a pre-existing container. Screen readers register live regions at page load - dynamically created live regions are unreliable.
- `aria-atomic="true"` announces the full region content as one unit (use for status messages)
- `aria-relevant="additions"` (default) announces only additions; `"all"` announces additions and removals

```html
<!-- Persistent containers, created in initial HTML -->
<div id="sr-alert" role="alert" aria-live="assertive" aria-atomic="true"></div>
<div id="sr-status" role="status" aria-live="polite" aria-atomic="true"></div>
```

```js
// To announce: inject text into the pre-existing container
function announce(message, type = 'polite') {
  const el = document.getElementById(type === 'assertive' ? 'sr-alert' : 'sr-status');
  el.textContent = '';
  // Brief timeout allows re-announcement of the same message
  requestAnimationFrame(() => { el.textContent = message; });
}

announce('Changes saved successfully');
announce('Error: Network request failed. Please retry.', 'assertive');
```

---

## Progress Bar / Spinner

**Role:** `progressbar`

**Required ARIA:**
- `aria-valuenow` - current value (omit for indeterminate)
- `aria-valuemin`, `aria-valuemax` - range (typically 0 and 100)
- `aria-valuetext` - human-readable label e.g. "3 of 10 files uploaded"
- `aria-label` or `aria-labelledby` for context

```html
<!-- Determinate -->
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"
     aria-valuetext="65% - uploading file 3 of 5" aria-label="Upload progress">
  <div style="width: 65%"></div>
</div>

<!-- Indeterminate (no aria-valuenow) -->
<div role="progressbar" aria-label="Loading results">
  <!-- animated spinner -->
</div>
```

---

## Switch (Toggle)

**Role:** `switch` (subclass of checkbox; specifically for on/off state)

**Required ARIA:**
- `aria-checked`: `"true"` / `"false"`

**Keyboard:**
- Space toggles the switch
- Enter (optionally) also toggles

```html
<!-- Preferred: native checkbox styled as switch -->
<label class="switch">
  <input type="checkbox" role="switch" aria-checked="false">
  <span class="switch-track" aria-hidden="true"></span>
  Enable notifications
</label>
```

Note: prefer `<input type="checkbox" role="switch">` over a custom `<button role="switch">` - the checkbox handles `aria-checked` state automatically via the `checked` property.

---

## Disclosure (Show/Hide)

The simplest expand/collapse pattern - a button that reveals or hides content.

```html
<button type="button" aria-expanded="false" aria-controls="details-panel">
  Show details
</button>
<div id="details-panel" hidden>
  <p>Additional information...</p>
</div>
```

```js
const btn = document.querySelector('[aria-controls="details-panel"]');
const panel = document.getElementById('details-panel');
btn.addEventListener('click', () => {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  panel.hidden = expanded;
});
```

No special keyboard beyond the native button behavior (Enter/Space). This is distinct from Accordion only in that Accordion wraps triggers in heading elements.

---

## Common Pitfalls Summary

| Pattern | Common mistake | Correct behavior |
|---|---|---|
| Combobox | Forgetting `aria-activedescendant` | Update it on every option focus change |
| Menu | Using Tab to navigate menu items | Tab must close menu; Arrow keys navigate items |
| Dialog | Not returning focus to trigger on close | Always store and restore trigger focus |
| Tooltip | Interactive content inside tooltip | Use `popover` or `dialog` for interactive overlays |
| Live region | Creating region dynamically | Create region in initial HTML; inject content later |
| Tree | Applying `aria-expanded` to leaf nodes | Only nodes with children get `aria-expanded` |
| Listbox | Missing `aria-activedescendant` | Screen readers cannot track which option is "focused" |
