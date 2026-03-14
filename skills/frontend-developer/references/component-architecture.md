<!-- Part of the frontend-developer AbsolutelySkilled skill. Load this file when working with component design and architecture. -->

# Component Architecture - Senior Frontend Engineering Reference

## Composition Over Inheritance

Inheritance creates tight coupling and deep hierarchies that are hard to reason about. Composition builds behavior by assembling small, focused pieces.

**Bad - inheritance-based:**
```js
// BaseButton -> IconButton -> LoadingIconButton -> DisabledLoadingIconButton
// Every new variation requires a new subclass
class BaseButton { render() { ... } }
class IconButton extends BaseButton { render() { /* duplicates + extends */ } }
```

**Good - composition-based:**
```js
// Assemble behavior at call site
<Button loading={true} icon={<Spinner />} disabled={false}>
  Submit
</Button>

// Internally, Button composes primitives
function Button({ loading, icon, children, ...rest }) {
  return (
    <button {...rest}>
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  )
}
```

**Slot patterns** - expose named areas for consumers to inject content without needing props for every variation:
```js
// Consumer controls what goes in each slot
<Card
  header={<h2>Title</h2>}
  footer={<Button>Save</Button>}
>
  <p>Body content</p>
</Card>
```

**Render delegation** - let the parent decide how to render a child item:
```js
// List doesn't know how to render items - consumer provides renderItem
<List
  items={users}
  renderItem={(user) => <UserRow key={user.id} user={user} />}
/>
```

---

## Component Boundaries - When to Split

Apply the **single responsibility principle**: a component should have one reason to change.

**The "reason to change" test:**
- If you can describe a component's purpose with "and", split it.
- "This component fetches data AND renders a table AND handles sorting" = three components.

**Signals to split a component:**
- File is over ~150-200 lines and growing
- Component has multiple independent units of state
- Part of the component re-renders when unrelated state changes
- Reusing part of it in another context requires copy-pasting

**Signals NOT to split:**
- The pieces are never used independently
- Splitting would require prop-drilling through one layer just to split for the sake of it
- The component is genuinely simple - don't split for splitting's sake

**Layer model:**
```
Page / Route component        - orchestrates layout, data fetching
  Feature component           - specific business domain (UserProfile, CheckoutForm)
    UI component              - reusable, stateless or controlled (Button, Input, Modal)
      Primitive / Token       - lowest level building block (Icon, Text, Stack)
```

---

## State Management Decision Tree

Ask these questions in order:

```
1. Does only this component need it?
   YES -> local component state

2. Does it belong in the URL (shareable, bookmarkable, survive refresh)?
   YES -> URL/query string state (search params, router state)

3. Is it data from the server (cached, async, invalidated by mutations)?
   YES -> server state (React Query, SWR, Apollo cache)

4. Is it truly global UI state shared across distant components (auth, theme, cart)?
   YES -> global client state (context, Zustand, Redux)
```

**Local state** - default choice. Co-locate as close to usage as possible.

**URL state** - underused. Pagination, filters, selected tab, search query. Makes pages shareable and survives refresh.

**Server state** - the largest category. Don't duplicate it into global state. Server state libraries handle caching, deduplication, background refresh, and stale-while-revalidate automatically.

**Global client state** - the last resort. If you find yourself putting server data into global state, reconsider. Common legitimate uses: auth session, theme preference, notification queue, open modals.

---

## Render Optimization

Optimize only when you have evidence of a problem. Premature optimization adds complexity with no benefit.

**Memoization patterns:**

```js
// Memoize expensive derived values - not all values
const sortedItems = useMemo(
  () => items.slice().sort(compareFn),
  [items, compareFn] // only recompute when inputs change
)

// Memoize callbacks passed to children that rely on referential equality
const handleSubmit = useCallback(
  () => submitForm(formData),
  [formData]
)

// Memoize components that receive stable props but re-render due to parent
const MemoizedRow = memo(Row) // only useful if Row's props are stable
```

**Avoiding unnecessary re-renders:**
- Keep state as local as possible - lifting state high causes wide re-renders
- Split context by concern: `ThemeContext`, `AuthContext`, `CartContext` - not one giant app context
- Avoid creating new object/array literals in render - they break referential equality on every render:

```js
// Bad - new object on every render causes child to re-render
<Child config={{ timeout: 3000 }} />

// Good - stable reference
const CONFIG = { timeout: 3000 }
<Child config={CONFIG} />
```

**Stable references rule:** If a value is passed as a prop or dependency, and it changes identity on every render without changing value, you have a bug waiting to happen - not just a performance issue.

---

## Props Design

**Minimal props principle:** Pass only what the component needs. If a component accepts a whole `user` object but only uses `user.name`, consider passing just `name`.

**Avoid boolean prop explosion:**
```js
// Bad - combinatorial explosion of boolean props
<Button primary large outline disabled loading />

// Good - use a variant prop for mutually exclusive states
<Button variant="primary" size="large" appearance="outline" disabled loading />
```

**Compound components pattern** - for components with tightly related sub-parts:
```js
// Instead of a monolithic component with many props:
<Select
  options={options}
  renderOption={...}
  renderTrigger={...}
  groupBy={...}
/>

// Use compound components that share implicit context:
<Select value={value} onChange={setValue}>
  <Select.Trigger>{selectedLabel}</Select.Trigger>
  <Select.Options>
    {options.map(opt => (
      <Select.Option key={opt.value} value={opt.value}>
        {opt.label}
      </Select.Option>
    ))}
  </Select.Options>
</Select>
```

Compound components give consumers full control over structure while components share state through implicit context.

---

## Design System Thinking - Layered Architecture

```
Tokens          - raw design decisions (colors, spacing, typography, radii)
                  e.g. --color-blue-500, --space-4, --radius-md

Primitives      - single-purpose, token-consuming components
                  Box, Text, Stack, Inline, Icon
                  No opinions about business logic

Composables     - assembled from primitives, cover common patterns
                  Card, Badge, Button, Input, Modal

Feature components - business-domain components using composables
                  UserAvatar, ProductCard, CheckoutSummary

Page components - route-level, orchestrate data + layout
```

**Rules:**
- Higher layers can use lower layers. Lower layers must never know about higher layers.
- Tokens live outside component code - in CSS custom properties or a theme object.
- Primitives accept all valid HTML attributes (spread `...rest` to the underlying element).
- Document when/why to use a component, not just how.

---

## Controlled vs Uncontrolled Components

**Uncontrolled** - the component manages its own state. Consumer reads it only when needed (e.g., on submit via ref).
- Use when: the value is ephemeral, form submit is the only time parent cares, reducing re-renders matters.

**Controlled** - the consumer owns the state and passes it via props. Component is a pure rendering function.
- Use when: the value must be synchronized with other UI, parent needs to react to every change, external validation is needed.

**Hybrid approach** - accept an optional `value` prop. If provided, be controlled. If absent, manage internally:
```js
function Input({ value: controlledValue, defaultValue, onChange }) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  const value = isControlled ? controlledValue : internalValue

  function handleChange(e) {
    if (!isControlled) setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

  return <input value={value} onChange={handleChange} />
}
```

Rule: never switch between controlled and uncontrolled during a component's lifetime - it causes bugs. Log a warning if the consumer does this.

---

## Error Boundaries

Error boundaries catch rendering errors in the component subtree and display fallback UI instead of crashing the whole page.

**Placement strategy:**
- One at the app root - catches anything that slips through
- One per major page section (sidebar, main content, header) - lets rest of page survive
- One per independently loaded widget or third-party integration

**Fallback UI patterns:**
```js
// Minimal fallback - show nothing, log error
<ErrorBoundary fallback={null} onError={reportToMonitoring}>
  <Sidebar />
</ErrorBoundary>

// Meaningful fallback - tell user what happened
<ErrorBoundary fallback={<ErrorMessage retry={reset} />}>
  <ProductList />
</ErrorBoundary>
```

**What error boundaries do NOT catch:** async errors, event handlers, server-side errors, errors inside the boundary itself. Handle async errors separately with `.catch()` or `try/catch` in async functions and feed them to state.

---

## Data Fetching Patterns

**Colocation** - fetch data as close to where it's needed as possible. Don't fetch everything at the top and drill it down.

**Waterfall prevention** - parallel fetches are faster than sequential:
```js
// Bad - waterfall: user fetch completes, THEN posts fetch starts
const user = await fetchUser(id)
const posts = await fetchPostsByUser(user.id)

// Good - parallel when IDs are known upfront
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPostsByUser(id) // if you can derive the ID early
])
```

**Optimistic updates** - update UI immediately, revert on failure:
```js
// Immediately update local state
setTodos(prev => prev.map(t => t.id === id ? { ...t, done: true } : t))

// Send to server in background
try {
  await api.updateTodo(id, { done: true })
} catch {
  // Revert on failure
  setTodos(originalTodos)
  showError('Failed to save. Your change was reverted.')
}
```

**Cache invalidation** - after a mutation, declare which cached queries are stale. Don't manually merge - just refetch or invalidate.

---

## Side Effect Management

**Cleanup is mandatory for:** timers, subscriptions, event listeners, fetch/abort controllers, websockets.

```js
useEffect(() => {
  const controller = new AbortController()

  fetchData({ signal: controller.signal })
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err)
    })

  return () => controller.abort() // cleanup on unmount or dependency change
}, [dependency])
```

**Race conditions** - when a fast response arrives after a slow one:
```js
useEffect(() => {
  let cancelled = false

  fetchSearch(query).then(results => {
    if (!cancelled) setResults(results) // ignore stale responses
  })

  return () => { cancelled = true }
}, [query])
```

**Stale closures** - a closure captures the variable value at the time it was created. If that variable changes later, the closure sees the old value. Solutions: include the variable in the dependency array, use a ref to hold the latest value, or use the functional update form of setState:

```js
// Safe - uses functional update, doesn't close over count
setCount(prev => prev + 1)

// Risky - closes over count, may be stale in async context
setCount(count + 1)
```
