<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with buttons, icons, or interactive controls. -->

# Buttons and Icons

## Button hierarchy

- 3 levels: Primary (filled), Secondary (outlined), Ghost (text-only)
- Only 1 primary button per visual section
- Destructive buttons: red variant of primary, use sparingly
- Size scale: sm (32-36px height), md (40px), lg (48px)
- Padding formula: vertical = (height - lineHeight) / 2, horizontal = height * 0.5
- Min-width: 80px to prevent tiny buttons

## Button states (ALL required)

All 5 states must be covered - missing any one of them is a bug, not a style choice.

### Default
Base appearance. Background, border, text color all at resting values.

### Hover
Darken background by 1 shade (e.g. `bg-blue-600` -> `bg-blue-700`). For outlined/ghost, add a light background fill.

### Active / Pressed
Scale down slightly + darken one more shade: `transform: scale(0.98)` + `bg-blue-800`. Gives tactile feedback.

### Focus-visible
Use `outline`, not `box-shadow`, for accessibility (box-shadow is clipped by overflow:hidden parents).
```css
/* Correct */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Wrong - gets clipped */
button:focus-visible {
  box-shadow: 0 0 0 2px #3b82f6;
}
```

### Disabled
```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Complete CSS example - primary button

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 80px;
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  background-color: #2563eb; /* blue-600 */
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: background-color 120ms ease, transform 80ms ease;
}

.btn-primary:hover {
  background-color: #1d4ed8; /* blue-700 */
}

.btn-primary:active {
  background-color: #1e40af; /* blue-800 */
  transform: scale(0.98);
}

.btn-primary:focus-visible {
  outline: 2px solid #3b82f6; /* blue-500 */
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

## Icon sizing

Match icon optical size to text size - mixing sizes creates visual imbalance:

| Text size | Icon size | Stroke width |
|-----------|-----------|--------------|
| 12px      | 14px      | 2px          |
| 14px      | 16px      | 2px          |
| 16px      | 20px      | 2px          |
| 20px      | 24px      | 1.5px        |

- Icon-only buttons need a minimum 44x44px touch target even if the icon itself is 20px - use padding to expand the hit area
- Stroke width: 1.5px for 24px icons, 2px for 20px and smaller
- Popular libraries: Lucide (recommended), Heroicons, Phosphor

## Icon + text pairing

- Icon goes LEFT of text for actions: Save, Delete, Edit, Add
- Icon goes RIGHT for navigation/direction: Next, External link, Dropdown arrow
- Gap between icon and text: 6px for sm/md buttons, 8px for lg buttons
- Always center vertically with flexbox - never use manual margin/padding to nudge icons

```css
/* Correct */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Wrong - brittle, breaks on different line heights */
.btn svg {
  margin-top: 2px;
}
```

- Icon color: inherit from text color by default (`currentColor`), or use a slightly muted tone for decorative icons

## Button groups

**Connected (segmented control style):**
```css
.btn-group .btn:not(:first-child):not(:last-child) {
  border-radius: 0;
}
.btn-group .btn:first-child {
  border-radius: 6px 0 0 6px;
}
.btn-group .btn:last-child {
  border-radius: 0 6px 6px 0;
}
/* Collapse double borders */
.btn-group .btn + .btn {
  margin-left: -1px;
}
```

**Separated:**
```css
.btn-group-separated {
  display: flex;
  gap: 8px;
}
```

- Icon-only button groups: keep all buttons equal width, consistent icon sizing across all

## Loading state buttons

- Replace text with spinner, but keep the button the same width - use `min-width` set to the button's natural width
- Disable pointer events and interaction during loading
- Spinner size: 16px for sm/md, 20px for lg, always centered
- Pattern: keep original label visible, add spinner to the left, hide the icon if one was present

```html
<!-- Default -->
<button class="btn-primary">
  <SaveIcon size={16} />
  Save changes
</button>

<!-- Loading -->
<button class="btn-primary" disabled>
  <Spinner size={16} />
  Save changes
</button>
```

## Tailwind examples

### Primary button
```html
<button class="inline-flex items-center justify-content-center gap-1.5 min-w-[80px] h-10 px-5 rounded-md bg-blue-600 text-white text-sm font-medium transition-colors hover:bg-blue-700 active:bg-blue-800 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
  Save
</button>
```

### Secondary (outlined) button
```html
<button class="inline-flex items-center justify-center gap-1.5 min-w-[80px] h-10 px-5 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium transition-colors hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
  Cancel
</button>
```

### Ghost button
```html
<button class="inline-flex items-center justify-center gap-1.5 min-w-[80px] h-10 px-5 rounded-md bg-transparent text-gray-700 text-sm font-medium transition-colors hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
  Learn more
</button>
```

### Icon-only button
```html
<!-- 44x44px touch target, 20px icon -->
<button class="inline-flex items-center justify-center w-11 h-11 rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none" aria-label="Settings">
  <SettingsIcon size={20} />
</button>
```

### Button with icon + text
```html
<!-- Action: icon on the left -->
<button class="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
  <PlusIcon size={16} />
  Add item
</button>

<!-- Navigation: icon on the right -->
<button class="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
  Next
  <ArrowRightIcon size={16} />
</button>
```

### Disabled state
```html
<button class="... opacity-50 cursor-not-allowed pointer-events-none" disabled>
  Submit
</button>
```

### Loading state
```html
<button class="inline-flex items-center justify-center gap-1.5 min-w-[120px] h-10 px-5 rounded-md bg-blue-600 text-white text-sm font-medium opacity-80 cursor-not-allowed pointer-events-none" disabled>
  <Spinner size={16} class="animate-spin" />
  Saving...
</button>
```

## Common mistakes

- **Buttons too small**: under 36px height fails usability; under 44px fails touch target guidelines (WCAG 2.5.5)
- **Color alone for hierarchy**: primary vs secondary must differ structurally (filled vs outlined) - color alone is insufficient for accessibility
- **Missing focus-visible**: skipping focus styles breaks keyboard navigation; `:focus` alone fires on click too, use `:focus-visible`
- **`<a>` styled as button or `<button>` styled as link**: use the correct element - `<button>` for actions, `<a>` for navigation
- **Inconsistent border-radius**: buttons must match the radius used across the rest of the UI (cards, inputs, modals)
- **No transition**: state changes (hover, active) without `transition` feel jarring; use `transition-colors 120ms ease`
- **Icon and text misaligned**: always use `display: flex; align-items: center` - never nudge with `margin-top`
- **Loading state changes button width**: set `min-width` equal to the resting button width to prevent layout shift
