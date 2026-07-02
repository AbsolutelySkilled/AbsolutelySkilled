<!-- Part of the `absolute` skill (simplify command). Load this file when
     simplifying React files (.jsx, .tsx) IN ADDITION TO javascript.md.
     javascript.md carries the JS/TS rules; this file carries React specifics. -->

# React Simplification Guide

Deep opinions for simplifying React components, state, and effects. These
supplement `javascript.md` and the universal catalog -- apply all three. When
project config (ESLint, `eslint-plugin-react-hooks`, tsconfig, CLAUDE.md)
contradicts anything here, project config wins.

**This is a simplify skill, not a rewrite skill.** The goal is to *remove*
unnecessary state and effects, not to *add* memoization or restructure behavior.
Every change must preserve render output, effect timing, and observable behavior.
When effect semantics are unclear, skip and list in "Skipped (conservative)".

---

## React Component Patterns

### Function components only
Never introduce class components. If simplifying an existing class component,
only convert to a function component if the user explicitly asks -- that's a
refactor, not a simplification.

### Named exports over default exports
```tsx
// Prefer
export function UserCard(props: UserCardProps): ReactElement { ... }

// Avoid
export default function UserCard(props: UserCardProps) { ... }
```

### Explicit Props types
```tsx
// Prefer
interface UserCardProps {
  name: string
  email: string
  onEdit: () => void
}

export function UserCard({ name, email, onEdit }: UserCardProps): ReactElement {
  // ...
}
```

### Avoid inline object/array literals in JSX props
```tsx
// Before -- creates new object on every render
<Component style={{ color: 'red', fontSize: 14 }} />

// After -- stable reference
const errorStyle = { color: 'red', fontSize: 14 }
<Component style={errorStyle} />
```

Only apply this when the component re-renders frequently or the prop triggers
memoization. For static/rarely-rendered components, inline is fine.

### Extract custom hooks for reused logic
If the same `useState` + `useEffect` pattern appears in 2+ components, extract
a custom hook. But do NOT extract hooks preemptively for one-off logic.

---

## Conditional Rendering

**No nested ternaries in JSX.** This is the number one JSX readability problem.

```tsx
// NEVER
return (
  <div>
    {status === 'loading' ? <Spinner /> : status === 'error' ? <Error /> : <Content />}
  </div>
)

// Prefer early return
if (status === 'loading') return <Spinner />
if (status === 'error') return <Error />
return <Content />
```

**Avoid `&&` short-circuit rendering when it can produce `0` or `""`:**
```tsx
// Bug: renders "0" when count is 0
{count && <Badge count={count} />}

// Fix
{count > 0 && <Badge count={count} />}
```

---

## useState

### Derived state -- compute during render, don't store it
If a value can be computed from existing props or state, do NOT put it in its
own `useState` + `useEffect`. Compute it inline during render.

```tsx
// Before -- redundant state + effect, extra render, can go stale
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// After -- derived during render
const fullName = `${firstName} ${lastName}`
```

If the computation is expensive AND measured to be slow, wrap in `useMemo` --
but do not reach for `useMemo` reflexively (see below).

### Functional updates when next state depends on previous
```tsx
// Before -- stale closure risk
setCount(count + 1)

// After -- when the update reads current state
setCount(c => c + 1)
```

Only switch to the functional form when the update derives from previous state
(counters, toggles, accumulations). Direct `setX(value)` for fresh values is fine.

### Lazy initializer for expensive initial state
```tsx
// Before -- runs createInitialState() on EVERY render (result discarded after mount)
const [state, setState] = useState(createInitialState())

// After -- runs once, on mount only
const [state, setState] = useState(() => createInitialState())
```

Only when the initializer is a real computation (parsing, reading storage). For
literals/cheap values, `useState(0)` is correct -- do not wrap in an arrow.

### State colocation
State used by only one subtree belongs in that subtree, not lifted to a parent.
If you see state in a parent that only one child reads, note it -- but moving it
is a structural change; flag in the summary rather than doing it silently unless
the move is local and obvious.

### One object vs many fields
Do not merge unrelated `useState` fields into one object to "reduce hook count" --
it forces spread-merges on every update and hurts readability. Keep independent
state independent.

---

## useEffect

Most misuse of React is unnecessary Effects. Before simplifying an Effect, ask
what it's synchronizing. An Effect is for synchronizing with an *external*
system (network, DOM, subscriptions, timers). If it's not doing that, it can
usually be removed.

### You might not need an Effect: derived data
```tsx
// Before -- Effect just to derive state
const [visible, setVisible] = useState([])
useEffect(() => {
  setVisible(items.filter(i => i.active))
}, [items])

// After -- derive during render
const visible = items.filter(i => i.active)
```

### You might not need an Effect: event-driven logic
Logic that should run *in response to a user action* belongs in the event
handler, not an Effect watching state.

```tsx
// Before -- Effect fires POST as a side effect of state change
useEffect(() => {
  if (submitted) {
    api.post('/order', order)
  }
}, [submitted])

// After -- do it in the handler that caused it
function handleSubmit() {
  api.post('/order', order)
}
```

### You might not need an Effect: resetting/adjusting state on prop change
Prefer a `key` to reset a whole subtree, or compute the adjustment during render,
over an Effect that watches a prop and calls a setter.

### Dependency arrays: don't lie, don't over-suppress
- Include every reactive value the Effect reads. Do not silence
  `react-hooks/exhaustive-deps` by deleting a dep -- that hides bugs.
- If a function/object dep changes every render and causes an over-firing loop,
  the fix is to move it inside the Effect, wrap it in `useCallback`/`useMemo`, or
  hoist it out of the component -- not to drop it from the array.
- Empty deps `[]` means "run once on mount". Only correct when the Effect reads
  no reactive values.

### Always clean up subscriptions, timers, listeners
```tsx
// Before -- leaks the interval
useEffect(() => {
  const id = setInterval(tick, 1000)
}, [])

// After
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])
```

### Don't chain Effects that trigger each other
Effects that set state to trigger another Effect create extra render passes and
fragile ordering. Collapse the chain: compute the whole result in one place
(handler or single Effect).

---

## useMemo / useCallback / useRef

### Don't memoize reflexively
`useMemo` and `useCallback` add code and cost. Add them only when:
- the memoized value/callback is a dependency of another hook, OR
- it's passed to a `React.memo` child, OR
- the computation is measurably expensive.

Removing an unnecessary `useMemo`/`useCallback` (wrapping a cheap value, no
memoized consumer) is a valid simplification. Removing one that a `React.memo`
child or hook dep relies on is NOT -- verify the consumer first.

### useRef for values that shouldn't trigger renders
Mutable values read/written across renders that must NOT cause a re-render (timer
ids, previous values, DOM nodes) belong in `useRef`, not `useState`. If you see
`useState` whose setter is never used for rendering, flag it.

### Custom hook naming
Custom hooks must start with `use` (lint enforces this). Extract a `use*` hook
only for logic reused in 2+ places or to isolate a complex effect -- not for
one-off inline logic.

---

## Anti-Patterns to Avoid When Simplifying React

| Do NOT do this | Why |
|---|---|
| Delete a dep to silence `exhaustive-deps` | Hides stale-closure bugs; fix the dep's identity instead |
| Merge independent `useState` into one object to cut hook count | Forces spread-merges every update, worse readability |
| Add `useMemo`/`useCallback` everywhere "for performance" | Adds cost + code; only helps when a memoized consumer exists |
| Remove a `useCallback`/`useMemo` a `React.memo` child depends on | Breaks that child's memoization, causes re-render regressions |
| Convert derived-state Effect to render compute without checking it's pure | Only safe when the value is truly derived, no external sync |
| Move state up/down to "colocate" during a simplify pass | Structural change -- flag it, don't do it silently |
| Replace `&&` with a value that can render `0`/`""` | Renders stray `0`/empty string; guard with `> 0` / explicit boolean |
| Convert class component to function component unasked | That's a refactor, not a simplification |
| Drop an Effect cleanup return to shorten code | Leaks subscriptions/timers/listeners |
