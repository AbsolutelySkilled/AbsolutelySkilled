<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with forms, inputs, selects, checkboxes, radios, or form validation. -->

# Forms and Inputs

## Text input styling
- Height: 40px (md), 36px (sm), 48px (lg); padding: 8px 12px; font-size: 14px
- Border: 1.5px solid #d1d5db, border-radius 6px
- Placeholder: #9ca3af - never as a label replacement
- Focus: primary border + 3px ring (rgba of primary at 0.15)
- States: default, focus, error (red), success (green), disabled (opacity 0.5 + bg #f9fafb)

```css
.input {
  display: block;
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input::placeholder { color: #9ca3af; }
.input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
.input--sm { height: 36px; font-size: 13px; padding: 6px 10px; }
.input--lg { height: 48px; font-size: 15px; padding: 10px 14px; }

.input--error { border-color: #dc2626; }
.input--error:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15); }
.input--success { border-color: #16a34a; }
.input--success:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15); }
.input:disabled, .input--disabled { opacity: 0.5; background: #f9fafb; cursor: not-allowed; }
```

## Labels
- Always visible above input (not floating, not placeholder-only)
- Font size: 14px, font-weight 500; gap 4-6px between label and input
- Always associate with `for=` attribute

```css
.field { display: flex; flex-direction: column; gap: 5px; }
.label { font-size: 14px; font-weight: 500; color: #111827; line-height: 1.4; }
.label__required { color: #dc2626; margin-left: 3px; }
.label__optional { font-size: 12px; font-weight: 400; color: #9ca3af; margin-left: 4px; }
.field__error-message { font-size: 12px; color: #dc2626; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
```

## Select / dropdown

```css
.select-wrapper { position: relative; display: inline-block; width: 100%; }

.select {
  display: block;
  width: 100%;
  height: 40px;
  padding: 8px 36px 8px 12px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.select:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
.select:disabled { opacity: 0.5; background: #f9fafb; cursor: not-allowed; }

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%236b7280'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
}
```

## Checkboxes and radios
- Size: 18px; checked: primary fill (checkbox) or primary dot (radio); focus ring 3px
- Use `<fieldset>` + `<legend>` for groups; 10px gap between items

```css
.checkbox-label, .radio-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #111827;
  user-select: none;
}

.checkbox-input, .radio-input { position: absolute; opacity: 0; width: 0; height: 0; }

.checkbox-control {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
}
.checkbox-input:checked + .checkbox-control { background: #4f46e5; border-color: #4f46e5; }
.checkbox-input:checked + .checkbox-control::after {
  content: '';
  width: 10px; height: 6px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
  display: block;
}
.checkbox-input:focus-visible + .checkbox-control { box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2); }

.radio-control {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1.5px solid #d1d5db;
  border-radius: 9999px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.radio-input:checked + .radio-control { border-color: #4f46e5; }
.radio-input:checked + .radio-control::after { content: ''; width: 8px; height: 8px; border-radius: 9999px; background: #4f46e5; display: block; }
.radio-input:focus-visible + .radio-control { box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2); }

fieldset.field-group { border: none; padding: 0; margin: 0; }
fieldset.field-group legend { font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 8px; }
.field-group__items { display: flex; flex-direction: column; gap: 10px; }
```

## Toggle / switch
- Width 44px, height 24px, thumb 20px; track: #d1d5db off, #4f46e5 on; transition 200ms

```css
.toggle-label { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; font-size: 14px; color: #111827; }
.toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track { position: relative; width: 44px; height: 24px; border-radius: 9999px; background: #d1d5db; transition: background 200ms ease; flex-shrink: 0; }
.toggle-track::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 9999px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: transform 200ms ease; }
.toggle-input:checked + .toggle-track { background: #4f46e5; }
.toggle-input:checked + .toggle-track::after { transform: translateX(20px); }
.toggle-input:focus-visible + .toggle-track { box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2); }
.toggle-input:disabled + .toggle-track { opacity: 0.5; cursor: not-allowed; }
```

## Textarea

```css
.textarea {
  display: block;
  width: 100%;
  min-height: 80px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  color: #111827;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  resize: vertical;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.textarea:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
.textarea::placeholder { color: #9ca3af; }
/* Auto-resize via JS: set height to scrollHeight on input */
```

## Search input

```css
.search-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
.search-icon { position: absolute; left: 12px; width: 16px; height: 16px; color: #9ca3af; pointer-events: none; }
.search-input {
  width: 100%;
  height: 40px;
  padding: 8px 36px 8px 36px;
  font-size: 14px;
  color: #111827;
  background: #f9fafb;
  border: 1.5px solid #d1d5db;
  border-radius: 9999px; /* use 6px to match system */
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
}
.search-input:focus { background: #fff; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
.search-clear { position: absolute; right: 10px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border: none; background: none; cursor: pointer; color: #9ca3af; border-radius: 9999px; padding: 0; }
.search-clear:hover { color: #374151; }
.search-clear:not([data-visible]) { display: none; }
```

## File upload

```css
.file-input-native { position: absolute; opacity: 0; width: 0; height: 0; }
.file-trigger-btn { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 16px; font-size: 14px; font-weight: 500; color: #4f46e5; background: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 6px; cursor: pointer; transition: background 150ms ease; }
.file-trigger-btn:hover { background: #e0e7ff; border-color: #a5b4fc; }

.drop-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 32px 24px; border: 2px dashed #d1d5db; border-radius: 8px; background: #f9fafb; text-align: center; cursor: pointer; transition: border-color 150ms ease, background 150ms ease; }
.drop-zone:hover, .drop-zone--drag-over { border-color: #6366f1; background: #eef2ff; }
.drop-zone__text { font-size: 14px; color: #6b7280; }
.drop-zone__text strong { color: #4f46e5; }
```

## Form layout patterns

```css
.form { max-width: 480px; width: 100%; }
.form__fields { display: flex; flex-direction: column; gap: 18px; }
.form__section + .form__section { margin-top: 32px; }
.form__row--2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form__row--side-label { display: grid; grid-template-columns: 160px 1fr; gap: 12px; align-items: center; }
.form__row--side-label .label { text-align: right; padding-top: 2px; }
.form--inline { display: flex; gap: 8px; align-items: flex-start; }
.form--inline .input { flex: 1; }
.form__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

@media (max-width: 640px) {
  .form__row--2col, .form__row--side-label { grid-template-columns: 1fr; }
  .form__row--side-label .label { text-align: left; }
  .form__actions { flex-direction: column-reverse; }
  .form__actions .btn { width: 100%; }
}
```

## Multi-step forms
- Progress: numbered steps or dots; one logical group per step; back button always available
- Validate each step before allowing next; 3-5 steps max

```css
.step-progress { display: flex; align-items: center; gap: 0; margin-bottom: 32px; }
.step-dot { width: 28px; height: 28px; border-radius: 9999px; background: #e5e7eb; color: #6b7280; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 200ms ease, color 200ms ease; }
.step-dot--active { background: #4f46e5; color: #fff; }
.step-dot--complete { background: #16a34a; color: #fff; }
.step-connector { flex: 1; height: 2px; background: #e5e7eb; transition: background 200ms ease; }
.step-connector--complete { background: #16a34a; }
```

## Validation patterns
- Validate on blur, not on keystroke; show success state on valid blur
- Show errors on submit attempt; scroll + focus first error field

```js
input.addEventListener('blur', () => validateField(input));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const errors = validateAllFields();
  if (errors.length) {
    const first = document.querySelector('.input--error');
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    first?.focus();
    return;
  }
  submitForm();
});
```

```css
.input--success {
  border-color: #16a34a;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2316a34a'%3E%3Cpath d='M3 8l3.5 3.5L13 5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 34px;
}
```

## Common form mistakes
- Placeholder as label - disappears on focus, fails accessibility
- Validating on every keystroke - shows errors before user finishes
- No visible focus states - fails keyboard/accessibility requirements
- Submit button with no loading state - user double-submits
- Showing error states before user has interacted with the field
- No `<fieldset>`/`<legend>` for radio/checkbox groups
- Tiny touch targets for checkboxes/radios (minimum 44x44px tap target)
- Missing `for=` on labels or unlabeled inputs
