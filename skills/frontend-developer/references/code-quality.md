<!-- Part of the frontend-developer AbsolutelySkilled skill. Load this file when reviewing code or improving code quality. -->

# Code Quality - Senior Frontend Engineering Reference

## Code Review Heuristics

A senior engineer reviews code across multiple dimensions simultaneously. Not just "does it work?"

**Correctness:**
- Does it handle edge cases? (empty arrays, null/undefined, 0, empty string, network failure)
- Are async operations handled correctly? (loading state, error state, race conditions)
- Is state mutation avoided where it shouldn't happen?
- Are event listeners and subscriptions cleaned up?

**Readability:**
- Can you understand what this code does in 30 seconds without the author explaining?
- Are names meaningful at the right level of abstraction?
- Is the code structured to minimize surprise - does it do what it looks like it does?
- Are there comments explaining *why*, not just *what*?

**Performance:**
- Are there unnecessary re-renders or recalculations on every render?
- Are large lists virtualized?
- Are heavy computations deferred or moved off the main thread?
- Does any synchronous work block the UI?

**Accessibility:**
- Do interactive elements have accessible names?
- Is the focus order logical?
- Do dynamic changes announce to screen readers (live regions)?
- Can everything be done with keyboard alone?

**Security:**
- Is user-supplied content rendered as HTML anywhere? (`innerHTML`, `dangerouslySetInnerHTML`)
- Are authentication checks done server-side (not just hidden in the UI)?
- Are sensitive values exposed in source, logs, or URL params?

---

## Refactoring Signals

Refactor when code has these smells - not before, not never.

**Rule of Three** - the first time you write something, write it. The second time, note the duplication. The third time, refactor to a shared abstraction.

**Shotgun surgery** - a single conceptual change requires edits in many unrelated files. This signals that a concern is not properly encapsulated. Solution: co-locate related logic.

**Feature envy** - a function or component is more interested in the data and methods of another module than its own. Solution: move the behavior to where the data lives.

**Primitive obsession** - using raw strings, numbers, or booleans to represent domain concepts with their own behavior. Solution: introduce a type or class that encapsulates the concept.

```js
// Bad - primitive obsession
const status = 'PENDING' // magic string everywhere
if (status === 'PENDING' || status === 'PROCESSING') { ... }

// Good - encapsulated concept
const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  isPending: (s) => s === 'PENDING',
  isInProgress: (s) => s === 'PENDING' || s === 'PROCESSING',
}
```

**Long parameter list** - a function with 4+ parameters is usually doing too much or passing too much context. Group related parameters into an options object. Consider whether the function should be split.

**Boolean parameter flags** - a `boolean` argument that changes fundamental behavior is a sign of two functions merged into one:
```js
// Bad
function fetchUser(id, includeDeleted) { ... }

// Good
function fetchUser(id) { ... }
function fetchDeletedUser(id) { ... }
```

---

## TypeScript Patterns

**Discriminated unions** over type assertions - model state machines explicitly:
```ts
// Bad - overlapping optional fields, runtime confusion
type RequestState = {
  loading?: boolean
  data?: User
  error?: Error
}

// Good - each state is unambiguous
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error }

// Exhaustive handling with discriminated unions
switch (state.status) {
  case 'success': return state.data.name // TypeScript knows data exists here
  case 'error': return state.error.message // TypeScript knows error exists here
}
```

**Const assertions** - preserve literal types instead of widening:
```ts
const DIRECTIONS = ['north', 'south', 'east', 'west'] as const
type Direction = typeof DIRECTIONS[number] // 'north' | 'south' | 'east' | 'west'
```

**Template literal types** - type-safe string composition:
```ts
type EventName = `on${Capitalize<string>}`
type CSSProperty = `--${string}` // CSS custom property
type ApiRoute = `/api/${string}`
```

**Branded types** - prevent accidentally mixing semantically different primitives:
```ts
type UserId = string & { readonly _brand: 'UserId' }
type ProductId = string & { readonly _brand: 'ProductId' }

function getUser(id: UserId) { ... }

const productId = '123' as ProductId
getUser(productId) // TypeScript error - wrong brand
```

**`satisfies` operator** - validate a value matches a type without widening it:
```ts
const palette = {
  red: [255, 0, 0],
  blue: '#0000ff',
} satisfies Record<string, string | number[]>
// palette.red is still number[], not string | number[]
// satisfies validates without losing specificity
```

**Avoid type assertions (`as`)** - they silence the type checker. If you need `as`, ask why TypeScript disagrees. Often it's a sign the types are wrong, not the code.

---

## Clean Code Principles for Frontend

**Naming conventions:**
- Event handlers passed as props: `onX` (`onClick`, `onSubmit`, `onUserSelect`)
- Event handler implementations: `handleX` (`handleClick`, `handleSubmit`)
- Boolean variables: `is`, `has`, `should`, `can` (`isLoading`, `hasError`, `shouldRedirect`)
- Collections: plural nouns (`users`, `selectedItems`, `pendingRequests`)
- Async functions: describe the action (`fetchUser`, `loadConfig`, `savePreferences`)
- Avoid abbreviations except universally understood ones (`id`, `url`, `api`, `db`, `i` in loops)

**File organization:**
```
components/
  Button/
    Button.tsx        - component
    Button.test.tsx   - tests co-located
    Button.stories.tsx - Storybook stories (if applicable)
    index.ts          - re-export (controls public API)
```

- Co-locate tests and stories with the component they test
- Index files as barrel exports - but avoid deep barrel chains (they hurt tree-shaking and dev server performance)
- Group by feature, not by type: `features/checkout/` not `components/checkout/ + hooks/checkout/ + utils/checkout/`

**Function length** - if a function doesn't fit on one screen, look for natural extraction points. Named sub-functions communicate intent better than comments.

**Early returns** reduce nesting and make the happy path clear:
```js
// Bad - arrow-head anti-pattern
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.status === 'pending') {
        // actual logic buried here
      }
    }
  }
}

// Good - guard clauses
function processOrder(order) {
  if (!order) return
  if (order.items.length === 0) return
  if (order.status !== 'pending') return
  // actual logic at the top level
}
```

---

## Linting Philosophy

**Lint for bugs, not style.** Style is solved by formatters (Prettier). Use ESLint to catch:
- Potential runtime errors (`no-undef`, `no-unused-vars`, `eqeqeq`)
- Accessibility violations (`jsx-a11y` rules)
- Security issues (`no-eval`, `no-implied-eval`)
- Deprecated patterns and API misuse
- Rule-of-hooks violations (for React codebases)

**Start from recommended configs** and add rules deliberately:
```js
// A reasonable baseline
{
  extends: [
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
    '@typescript-eslint/recommended',
  ]
}
```

**Custom rules sparingly** - every custom rule has a maintenance cost. Only add a custom rule if it catches a real recurring bug pattern in your codebase.

**Never disable lint warnings wholesale.** `// eslint-disable-next-line` is sometimes necessary - but always add a comment explaining why. PRs with unexplained disables should be questioned in review.

---

## Security in the Frontend

**XSS prevention:**
- Never set `innerHTML` with user-supplied content
- Framework templating systems escape by default - don't bypass them
- `dangerouslySetInnerHTML` (React) or `v-html` (Vue) require sanitization first - use DOMPurify

```js
// Bad - XSS vector
element.innerHTML = userProvidedContent

// Good - use safe DOM APIs
element.textContent = userProvidedContent

// If HTML is required, sanitize first
element.innerHTML = DOMPurify.sanitize(userProvidedContent)
```

**Content Security Policy (CSP)** - HTTP header that restricts what sources scripts, styles, and media can load from. Prevents injected scripts from executing. Implement at the server level, not in JavaScript.

**CSRF tokens** - for any state-mutating request. Most modern SPA frameworks with same-site cookies are protected by default, but verify your setup.

**Secure cookies:** always set `HttpOnly` (prevents JS access), `Secure` (HTTPS only), `SameSite=Strict` or `Lax` for auth cookies.

**Never trust the frontend** for authorization. Every permission check must be enforced on the server. Frontend checks are UX, not security.

**Avoid exposing sensitive data in:**
- URL query parameters (appear in server logs, browser history, referer headers)
- `console.log` in production builds (readable in DevTools)
- Client-accessible local storage for auth tokens (prefer `HttpOnly` cookies)

---

## Error Handling Patterns

**Error boundaries** - wrap top-level sections in error boundaries. Components fail; the page shouldn't.

**Global error handlers:**
```js
window.addEventListener('unhandledrejection', (event) => {
  reportError(event.reason)
})
window.addEventListener('error', (event) => {
  reportError(event.error)
})
```

**User-facing error messages** - separate what you log from what you show:
```js
try {
  await submitOrder(cart)
} catch (error) {
  // Log technical details for debugging
  logger.error('Order submission failed', { error, cart })

  // Show human-readable message to user
  setErrorMessage("We couldn't place your order. Please try again or contact support.")
}
```

Never expose stack traces, internal IDs, or technical error messages to users.

**Error reporting** - integrate with an error monitoring service (Sentry, Datadog). Capture: error message, stack trace, user context (anonymized), reproduction steps (breadcrumbs), release version.

---

## Performance Code Patterns

**Avoiding layout thrashing** - interleaving DOM reads and writes forces multiple reflows:
```js
// Bad - read, write, read, write = multiple reflows
elements.forEach(el => {
  const height = el.offsetHeight // read (forces reflow)
  el.style.height = height + 10 + 'px' // write
})

// Good - batch reads then writes
const heights = elements.map(el => el.offsetHeight) // all reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px' // all writes
})
```

**Debounce vs throttle:**
- `debounce` - delay execution until N ms after the last call. Use for search-as-you-type, window resize handlers.
- `throttle` - execute at most once per N ms. Use for scroll handlers, mousemove, real-time position tracking.

**Virtualization** - for lists over ~100 items, render only the visible items. Libraries: `@tanstack/virtual`, `react-window`. Drastically reduces DOM node count and re-render cost.

**Web Workers** - offload CPU-intensive work (large data parsing, image processing, cryptography) to a background thread. Keeps the main thread free for user interaction.

```js
// Main thread stays responsive
const worker = new Worker('./heavy-computation.js')
worker.postMessage({ data: largeDataset })
worker.onmessage = (e) => setResult(e.data)
```

**`requestAnimationFrame`** for any animation or visual update tied to rendering - ensures updates happen at the browser's next paint cycle, preventing jank.

---

## Dependency Hygiene

**Before adding a dependency:**
1. Check bundle impact with bundlephobia.com
2. Verify it's actively maintained (last commit, open issues, npm downloads)
3. Check for a simpler native alternative (is a library really needed for this?)
4. Prefer dependencies with ESM exports for better tree-shaking

**Micro-package problem** - packages that do one trivial thing (`is-even`, `left-pad`) add supply chain risk with no value. Write the 3-line utility yourself.

**Auditing:**
- Run `npm audit` in CI, fail on high/critical vulnerabilities
- Review the lockfile in PRs - dependency additions should be intentional

**Lockfile hygiene:**
- Always commit lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
- Unexplained lockfile churn in a PR (hundreds of lines changed) is a red flag - investigate why

---

## Git Workflow for Frontend

**Meaningful commits** - each commit should represent one logical change. The message should complete the sentence "This commit will...":
```
feat: add keyboard navigation to Dropdown component
fix: prevent cart total from showing NaN when quantity is empty
refactor: extract useFormValidation hook from CheckoutForm
```

**Feature flags for WIP** - don't block a long-running feature on a branch for weeks. Merge incrementally behind a flag. Reduces merge conflicts and keeps main releasable.

**Branch naming:**
```
feat/user-profile-redesign
fix/checkout-npe-on-empty-cart
refactor/migrate-to-tanstack-query
chore/upgrade-typescript-5
```

**PR size guidelines:**
- Aim for under 400 lines changed per PR (excluding generated files, lockfiles)
- Large PRs are reviewed worse - reviewers lose context and miss bugs
- If a PR is large, add a description that walks through the structure
- Split refactoring PRs from feature PRs - mixing them hides intent

**What goes in a PR description:**
- What changed and why (not just "updated X")
- How to test it manually
- Screenshots or recordings for visual changes
- Decisions made and alternatives rejected
- Risks or areas that need extra review attention
