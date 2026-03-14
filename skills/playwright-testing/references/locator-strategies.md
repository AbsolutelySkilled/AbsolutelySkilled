<!-- Part of the playwright-testing AbsolutelySkilled skill. Load this file when
     working with complex locator scenarios, filtering, chaining, ARIA roles,
     test IDs, or when choosing between competing locator strategies. -->

# Locator Strategies

Locators are Playwright's mechanism for finding elements. They are lazy
(re-queried on each use), auto-waiting, and strict by default (throw if more
than one element matches). Prefer them over `ElementHandle` and `$()`.

---

## Priority order

Always use the highest-priority locator that is stable and meaningful:

| Priority | Method | When to use |
|---|---|---|
| 1 | `getByRole` | Any interactive or landmark element with an ARIA role |
| 2 | `getByLabel` | Form inputs associated with a `<label>` |
| 3 | `getByPlaceholder` | Inputs without a label but with placeholder text |
| 4 | `getByText` | Non-interactive elements identified by visible text |
| 5 | `getByAltText` | Images with meaningful alt text |
| 6 | `getByTitle` | Elements with a `title` attribute |
| 7 | `getByTestId` | Elements with `data-testid` (or custom attribute) |
| 8 | `locator('css=...')` | Only when none of the above are feasible |
| 9 | `locator('xpath=...')` | Last resort; brittle and hard to read |

> If you find yourself reaching for CSS or XPath, first ask whether the
> application is missing an ARIA role, label, or `data-testid`. Often the
> right fix is improving the app's accessibility, not writing a brittle selector.

---

## getByRole - the primary locator

`getByRole` matches elements by their implicit or explicit ARIA role. It
mirrors how screen readers traverse the page.

```typescript
// Buttons
page.getByRole('button', { name: 'Submit' })
page.getByRole('button', { name: /cancel/i })  // regex, case-insensitive

// Links
page.getByRole('link', { name: 'Learn more' })

// Headings
page.getByRole('heading', { name: 'Dashboard', level: 1 })

// Form fields (matches by associated label text)
page.getByRole('textbox', { name: 'Email address' })
page.getByRole('combobox', { name: 'Country' })
page.getByRole('checkbox', { name: 'I agree to the terms' })

// Tables and navigation
page.getByRole('table', { name: 'Order history' })
page.getByRole('navigation', { name: 'Main menu' })

// Dialogs and regions
page.getByRole('dialog', { name: 'Confirm deletion' })
page.getByRole('alert')
```

Common ARIA roles to know: `button`, `link`, `textbox`, `checkbox`, `radio`,
`combobox`, `listbox`, `option`, `menuitem`, `tab`, `tabpanel`, `dialog`,
`alertdialog`, `alert`, `status`, `heading`, `img`, `list`, `listitem`,
`table`, `row`, `cell`, `columnheader`, `navigation`, `main`, `banner`,
`contentinfo`, `region`, `search`.

---

## getByLabel - form inputs

Matches `<input>`, `<select>`, and `<textarea>` by their associated `<label>`.
Works with `for`/`id` pairing, `aria-label`, and `aria-labelledby`.

```typescript
page.getByLabel('Email')
page.getByLabel('Password', { exact: true })
page.getByLabel(/date of birth/i)
```

---

## getByTestId - stable escape hatch

When no semantic locator fits, add `data-testid` to the element and query it.
This is the right trade-off: it doesn't couple to styles, text, or structure.

```html
<div data-testid="product-card-123">...</div>
```

```typescript
page.getByTestId('product-card-123')
```

Configure a custom attribute name in `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    testIdAttribute: 'data-pw',  // use data-pw="..." in HTML
  },
})
```

---

## Filtering and chaining locators

### Filter by text

```typescript
// Find a list item containing specific text
page.getByRole('listitem').filter({ hasText: 'Alice' })

// Combine: find a row that contains a specific cell value
page.getByRole('row').filter({ hasText: 'Order #1042' })
```

### Filter by child element

```typescript
// Find a card that contains a "Featured" badge
page.getByTestId('product-card').filter({
  has: page.getByRole('status', { name: 'Featured' }),
})
```

### Chain locators to scope searches

```typescript
// Scope to a specific section before finding elements inside it
const sidebar = page.getByRole('navigation', { name: 'Sidebar' })
await sidebar.getByRole('link', { name: 'Settings' }).click()

// Scope to a form
const loginForm = page.getByRole('form', { name: 'Login' })
await loginForm.getByLabel('Email').fill('user@example.com')
await loginForm.getByLabel('Password').fill('secret')
await loginForm.getByRole('button', { name: 'Sign in' }).click()
```

### Picking from a list

```typescript
// First match
page.getByRole('listitem').first()

// Last match
page.getByRole('listitem').last()

// By index (0-based)
page.getByRole('row').nth(2)
```

---

## Strict mode and multiple matches

By default, if a locator matches more than one element, any action on it
throws a strict mode violation. Resolve this by:

1. Making the locator more specific (add `{ name: '...' }`, scope to a parent)
2. Using `.first()` / `.nth(n)` if order is meaningful
3. Using `.filter()` to narrow down by text or child element
4. Using `.all()` if you intentionally want all matches

```typescript
// Wrong: throws if multiple buttons exist
await page.getByRole('button').click()

// Right: be explicit
await page.getByRole('button', { name: 'Add to cart' }).click()

// Intentionally iterate over all matches
const items = await page.getByRole('listitem').all()
for (const item of items) {
  console.log(await item.textContent())
}
```

---

## Dynamic and asynchronous content

### Wait for element to appear

```typescript
// Web-first assertion retries until visible or timeout
await expect(page.getByRole('status')).toBeVisible()
await expect(page.getByRole('status')).toHaveText('Saved!')
```

### Wait for element to disappear (loading states)

```typescript
// Wait for spinner to disappear before asserting on results
await expect(page.getByRole('progressbar')).not.toBeVisible()
await expect(page.getByRole('list')).toContainText('Result A')
```

### Wait for URL after navigation

```typescript
await page.getByRole('button', { name: 'Go to checkout' }).click()
await page.waitForURL('**/checkout')
// OR use assertion:
await expect(page).toHaveURL(/\/checkout/)
```

### Wait for network response tied to an action

```typescript
const [response] = await Promise.all([
  page.waitForResponse('**/api/search'),
  page.getByRole('button', { name: 'Search' }).click(),
])
expect(response.status()).toBe(200)
```

---

## Locating inside iframes

```typescript
const frame = page.frameLocator('iframe[title="Payment form"]')
await frame.getByLabel('Card number').fill('4242 4242 4242 4242')
await frame.getByLabel('Expiry date').fill('12/26')
await frame.getByLabel('CVC').fill('123')
```

---

## Shadow DOM

Playwright pierces open shadow roots automatically. Standard locators work
without any special configuration:

```typescript
// Finds element inside shadow DOM transparently
await page.getByLabel('Username').fill('alice')
```

---

## Common mistakes

| Mistake | Why it fails | Fix |
|---|---|---|
| `page.locator('button:has-text("Submit")')` | Pseudo-selector syntax; readable but CSS-coupled | `page.getByRole('button', { name: 'Submit' })` |
| `page.locator('[class*="btn-primary"]`)` | Breaks on CSS refactors | `page.getByRole('button', { name: '...' })` or `getByTestId` |
| `page.locator('text=Submit')` | Legacy shorthand; less explicit | `page.getByText('Submit')` or `getByRole` |
| `(await page.$('input')).type('text')` | Stale `ElementHandle`; legacy API | `page.getByRole('textbox').fill('text')` |
| `page.getByText('3')` on a table with many "3" values | Matches multiple elements | Scope: `row.getByRole('cell', { name: '3' })` |
