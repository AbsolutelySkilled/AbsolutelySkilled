<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with toasts, tooltips, modals, loading states, empty states, or status indicators. -->

# Feedback and Status

## Toast notifications

- Position: bottom-right (desktop), bottom-center (mobile)
- Types: success (green), error (red), warning (amber), info (blue)
- Auto-dismiss: success 3-5s, info 5s, warning 8s, error never (manual dismiss)
- Max visible: 3, stack with 8px gap
- Width: 320-420px, z-index: 50

```css
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  z-index: 50;
  max-width: 420px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid transparent;
  animation: toast-in 200ms ease-out;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.toast--success { border-left-color: #16a34a; }
.toast--error   { border-left-color: #dc2626; }
.toast--warning { border-left-color: #d97706; }
.toast--info    { border-left-color: #2563eb; }

.toast__message { font-size: 14px; color: #111827; line-height: 1.5; }
.toast__dismiss {
  flex-shrink: 0;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
}
```

## Tooltips

- Show delay: 300ms, hide delay: 100ms
- Dark bg (#1f2937), white text, 6px 10px padding, 6px radius
- Max width: 240px, z-index: 40

```css
.tooltip-trigger { position: relative; display: inline-flex; }

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #ffffff;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  max-width: 240px;
  text-align: center;
  pointer-events: none;
  z-index: 40;
  opacity: 0;
  transition: opacity 100ms ease;
}

.tooltip-trigger:hover .tooltip { opacity: 1; transition-delay: 300ms; }

/* Arrow */
.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #1f2937;
}
```

## Modals / Dialogs

- Width: 480px (sm), 640px (md), 800px (lg)
- Max-height: 85vh, scroll internal body
- Close on: X button, Escape, overlay click (non-critical)
- Mobile: bottom sheet or full-screen

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  animation: overlay-in 150ms ease-out;
}

@keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }

.modal {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: modal-in 150ms ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.modal__body { padding: 20px 24px; overflow-y: auto; flex: 1; }
.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 20px;
  border-top: 1px solid #f3f4f6;
}

/* Mobile: bottom sheet */
@media (max-width: 640px) {
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal { border-radius: 16px 16px 0 0; max-height: 90vh; }
}

body.modal-open { overflow: hidden; }
```

## Confirmation dialogs

- Use for destructive actions ONLY (delete, remove, unsubscribe)
- Title: "Delete project?" not "Are you sure?"
- Description: explain the consequence clearly
- Actions: "Cancel" (secondary) + "Delete" (destructive red)

## Loading states

### Spinner

```css
.spinner {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  border-top-color: #2563eb;
  animation: spin 0.8s linear infinite;
}
.spinner--sm { width: 16px; height: 16px; }
.spinner--md { width: 24px; height: 24px; }
.spinner--lg { width: 40px; height: 40px; border-width: 3px; }

@keyframes spin { to { transform: rotate(360deg); } }
```

> Always pair spinners with a text label: "Loading messages..." not just a spinner.

### Skeleton screens

```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
}

.skeleton {
  background: #e5e7eb;
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease infinite;
}
.skeleton--text   { height: 14px; }
.skeleton--title  { height: 20px; }
.skeleton--avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton--image  { height: 180px; border-radius: 8px; }
```

### Progress bar

```css
.progress {
  height: 4px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}
.progress__bar {
  height: 100%;
  background: #2563eb;
  border-radius: 9999px;
  transition: width 300ms ease;
}
/* Indeterminate */
.progress--indeterminate .progress__bar {
  width: 40%;
  animation: progress-slide 1.4s ease infinite;
}
@keyframes progress-slide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
```

## Empty states

Four types:
1. First-use: "No projects yet" + CTA to create
2. No results: "No matches" + clear filters button
3. Error: "Something went wrong" + retry
4. Completed: "All caught up!" + positive message

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  gap: 12px;
}
.empty-state__icon { width: 48px; height: 48px; color: #9ca3af; }
.empty-state__title { font-size: 16px; font-weight: 600; color: #111827; }
.empty-state__description { font-size: 14px; color: #6b7280; max-width: 320px; }
```

## Status badges and indicators

```css
/* Dot indicator */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-dot--green  { background: #16a34a; }
.status-dot--yellow { background: #d97706; }
.status-dot--red    { background: #dc2626; }
.status-dot--gray   { background: #9ca3af; }

/* Badge pill */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
.badge--green  { background: #dcfce7; color: #15803d; }
.badge--red    { background: #fee2e2; color: #b91c1c; }
.badge--yellow { background: #fef9c3; color: #a16207; }
.badge--gray   { background: #f3f4f6; color: #4b5563; }
.badge--blue   { background: #dbeafe; color: #1d4ed8; }
```

## Inline form validation

```css
.field__input {
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  transition: border-color 150ms ease;
}
.field__input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  outline: none;
}
.field--error .field__input { border-color: #dc2626; }
.field--success .field__input { border-color: #16a34a; }
.field__error { font-size: 12px; color: #dc2626; margin-top: 4px; }
```

> Validate on blur, not on change. Never use red placeholder text.

## Notification badges

```css
.notif-wrapper { position: relative; display: inline-flex; }
.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9999px;
  background: #dc2626;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  border: 2px solid #ffffff;
}
```

> Use "9+" for counts over 9, "99+" for over 99.

## Common feedback mistakes

- Using `window.alert` instead of toasts
- Modal for non-critical information (use toast instead)
- No loading state (user thinks nothing happened)
- Error messages that don't explain what to do
- Tooltip for essential information (not discoverable enough)
- Success toast for every tiny action (only for meaningful completions)
- Multiple modals stacked (never nest modals)
