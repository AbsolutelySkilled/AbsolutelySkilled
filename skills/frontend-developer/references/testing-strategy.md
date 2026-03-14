<!-- Part of the frontend-developer AbsolutelySkilled skill. Load this file when working with frontend testing strategy. -->

# Testing Strategy - Senior Frontend Engineering Reference

## The Testing Trophy (Not Pyramid)

The classical pyramid (many unit, some integration, few E2E) was designed for backend services. For frontend UI, the **testing trophy** reflects higher value:

```
         /\
        /E2E\          - Few, covering critical user flows
       /------\
      /Integrat\       - Most tests live here (component + user flow tests)
     /----------\
    /   Unit     \     - Pure functions, utilities, formatters, parsers
   /--------------\
  / Static Analysis\   - TypeScript, ESLint (catches bugs before tests run)
 /------------------\
```

**Why integration tests give the most value for frontend:**
- They test real behavior: render a component, simulate a user interaction, assert what the user sees.
- They survive implementation refactors - if you rename a state variable, the test shouldn't care.
- They catch interaction bugs that unit tests of individual pieces would miss entirely.

---

## Unit Tests

Best suited for code with no DOM involvement:

- Pure utility functions (`formatCurrency`, `parseDate`, `sortBy`)
- Data transformations and normalizers
- Business logic that doesn't touch UI (`calculateDiscount`, `validateEmail`)
- Complex state reducers
- Custom hook logic (if it contains substantial business logic)

**Keep unit tests:**
- Fast (milliseconds, no DOM, no network)
- Focused (one function, one behavior per test)
- Isolated (no external dependencies - mock at the boundary)

```js
// Good unit test - tests behavior of a pure function
test('formatCurrency formats negative values with parentheses', () => {
  expect(formatCurrency(-1500, 'USD')).toBe('($1,500.00)')
})

test('sortBy handles null values last', () => {
  const result = sortBy([{ name: 'B' }, { name: null }, { name: 'A' }], 'name')
  expect(result.map(r => r.name)).toEqual(['A', 'B', null])
})
```

---

## Integration / Component Tests

This is where most frontend test effort should go.

**Core approach:**
1. Render the component in a realistic environment (with providers, routing context)
2. Simulate what a user would actually do (click, type, submit)
3. Assert what the user would actually see (visible text, ARIA state, DOM presence)

```js
// Arrange - render with realistic context
render(<LoginForm />, { wrapper: AppProviders })

// Act - interact as a user would
await userEvent.type(getByLabelText('Email'), 'user@example.com')
await userEvent.type(getByLabelText('Password'), 'secret')
await userEvent.click(getByRole('button', { name: 'Log in' }))

// Assert - check what the user sees
expect(await findByText('Welcome back!')).toBeVisible()
```

**Query priority (most to least preferred):**
1. `getByRole` - mirrors how screen readers navigate, tests accessibility too
2. `getByLabelText` - for form inputs
3. `getByPlaceholderText` - acceptable fallback for inputs
4. `getByText` - visible text
5. `getByDisplayValue` - current form field value
6. `getByAltText` - images
7. `getByTitle` - accessible name via title
8. `getByTestId` - last resort, implementation detail, avoid when possible

**Test behavior, not implementation:**
- Don't assert on component state variables
- Don't assert on class names or inline styles (unless testing visual intent)
- Don't assert on internal function calls
- Do assert on what the user sees, hears (ARIA), and can interact with

---

## End-to-End Tests

E2E tests run against a real browser, real network (or realistic stub), full stack.

**Use E2E for:**
- Critical happy paths (checkout, signup, login, core feature flows)
- Key failure modes on critical paths (payment failure, auth error)
- Flows that span multiple pages or require real navigation

**Do NOT use E2E for:**
- Every UI component variation - that's what component tests are for
- Testing business logic - unit tests do that faster
- Validating every error message - too slow, too brittle

**Resilient E2E test principles:**
- Use accessible selectors (`getByRole`, `aria-label`) not CSS selectors or XPath
- Assert on stable user-visible outcomes, not transient loading states
- Avoid fixed `sleep`/`wait` calls - use assertions that wait for condition
- Keep each test independent - no shared state between tests, seed data per test

```js
// Good E2E - tests the critical checkout flow
test('user can complete a purchase', async () => {
  await page.goto('/products/widget')
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('link', { name: 'Checkout' }).click()
  await page.getByLabel('Card number').fill('4242424242424242')
  // ... fill form
  await page.getByRole('button', { name: 'Place order' }).click()
  await expect(page.getByText('Order confirmed')).toBeVisible()
})
```

---

## Visual Regression Testing

Screenshot comparison catches unintended visual changes that functional tests miss.

**Tools:**
- **Chromatic** - integrates with Storybook, per-component screenshot, UI review workflow
- **Percy** - CI-integrated, page-level and component-level
- **Playwright screenshots** - built-in, lower overhead, good for specific components

**When it's worth the cost:**
- Design systems and component libraries - high visual stability expectation
- Marketing pages or landing pages with strict brand requirements
- Tables, charts, data visualizations where layout bugs are subtle

**When to skip:**
- Rapidly-changing UI during early development (too many false positives)
- Content-driven pages where text changes trigger false positives
- Small teams without a review process to handle visual diffs

**Practical approach:** Run visual tests on Storybook stories of UI primitives only. Keep the scope narrow so the signal-to-noise ratio stays high.

---

## Accessibility Testing

**axe-core in component tests:**
```js
import { axe } from 'jest-axe'

test('Modal is accessible', async () => {
  const { container } = render(<Modal open title="Confirm deletion">...</Modal>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

This catches: missing labels, insufficient color contrast (in some configurations), invalid ARIA roles, missing alt text, duplicate IDs.

**Keyboard navigation tests:**
```js
test('dropdown can be navigated with keyboard', async () => {
  render(<Dropdown options={options} />)

  await userEvent.tab() // focus trigger
  await userEvent.keyboard('{Enter}') // open
  expect(getByRole('listbox')).toBeVisible()

  await userEvent.keyboard('{ArrowDown}') // move to first option
  await userEvent.keyboard('{Enter}') // select
  expect(getByRole('button', { name: 'Option 1' })).toBeInTheDocument()
})
```

**Manual screen reader testing** - automated tools catch ~30-40% of accessibility issues. For critical flows, manually test with VoiceOver (macOS/iOS) or NVDA/JAWS (Windows).

---

## What NOT to Test

Knowing what to skip is as important as knowing what to cover.

| Don't test | Why |
|---|---|
| CSS class names | Implementation detail - refactoring styles breaks tests for no reason |
| Third-party library internals | You don't own them, they have their own tests |
| That a function was called | Test outcomes, not mechanism |
| Component state variables | Internal implementation - test what renders |
| Exact HTML structure | Brittle - a `div` to `section` change breaks tests unnecessarily |
| Framework rendering behavior | Trust the framework |
| `console.log` calls | Not a user-observable behavior |

---

## Test Structure - Arrange / Act / Assert

Keep tests readable by separating phases clearly:

```js
describe('ShoppingCart', () => {
  describe('when the cart has items', () => {
    test('shows item count in the badge', async () => {
      // Arrange
      const items = [{ id: '1', name: 'Widget', quantity: 3 }]
      render(<CartBadge items={items} />)

      // Act - (none needed for a render test)

      // Assert
      expect(getByRole('status', { name: 'Cart items' })).toHaveTextContent('3')
    })

    test('removes item when delete is clicked', async () => {
      // Arrange
      const onRemove = jest.fn()
      render(<CartItem item={item} onRemove={onRemove} />)

      // Act
      await userEvent.click(getByRole('button', { name: 'Remove Widget' }))

      // Assert
      expect(onRemove).toHaveBeenCalledWith('1')
    })
  })
})
```

**Async patterns:**
- Use `findBy*` queries when waiting for async rendering (they retry until timeout)
- Use `waitFor` when asserting on something that becomes true after an async operation
- Avoid arbitrary `await new Promise(r => setTimeout(r, 100))` - it's fragile and slow

---

## Mocking Strategy

**Mock when:**
- Network calls - use MSW (Mock Service Worker) to intercept at the network level, not in code
- Timers (`setInterval`, `setTimeout`, `Date.now`) - use fake timers for determinism
- Browser APIs not in jsdom (`IntersectionObserver`, `ResizeObserver`, `matchMedia`)
- Complex third-party services (payment SDK, analytics)

**Don't mock when:**
- Simple utility functions - just call them (they're fast, they're pure)
- The DOM itself - jsdom is good enough for component tests
- Your own modules unless they have side effects

**MSW is the gold standard for API mocking:**
```js
// Define once, reuse across unit, integration, and E2E tests
http.get('/api/users/:id', ({ params }) => {
  return HttpResponse.json({ id: params.id, name: 'Test User' })
})

// Override per-test for error scenarios
server.use(
  http.get('/api/users/:id', () => HttpResponse.error())
)
```

MSW works at the network layer - your data fetching code runs exactly as in production. No coupling to implementation.

---

## Performance Testing

**Lighthouse CI** - run Lighthouse in CI, fail builds when performance scores drop below threshold. Catches regressions before they reach users.

**Bundle size checks:**
```json
// bundlesize config in package.json or bundlesize.config.js
{
  "files": [
    { "path": "./dist/main.*.js", "maxSize": "150 kB" },
    { "path": "./dist/vendor.*.js", "maxSize": "200 kB" }
  ]
}
```

Run in CI on every PR. Forces intentional decisions when adding large dependencies.

**Web Vitals monitoring** - measure real user LCP, CLS, INP in production. Tools: web-vitals library, Sentry performance, Datadog RUM. Synthetic tests (Lighthouse) don't replace real user measurement.

---

## Test Quality Signals

**Signs of a bad test:**
- Breaks when you rename an internal variable or extract a helper function
- Tests that test only that code runs without error (no meaningful assertion)
- Tests with more mocks than real code
- Tests that duplicate other tests without covering new cases
- Flaky tests that sometimes pass, sometimes fail (fix or delete them)

**Signs of a good test:**
- Would catch a real bug a developer could plausibly introduce
- Survives a complete internal refactor as long as behavior is preserved
- Reads like documentation - another engineer can understand what the feature does from the test
- Fails clearly with a message that points to what broke and why
