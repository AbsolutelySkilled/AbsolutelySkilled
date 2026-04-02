<!-- Part of the Super Simplify AbsolutelySkilled skill. Load this file when
     simplifying JavaScript, TypeScript, JSX, or TSX files. -->

# JavaScript / TypeScript Simplification Guide

Deep opinions for simplifying JS/TS/React/Node code. These supplement the
universal catalog -- apply both. When project config (ESLint, tsconfig, CLAUDE.md)
contradicts anything here, project config wins.

---

## Module System

**Prefer ES modules** (`import`/`export`) over CommonJS (`require`/`module.exports`).

**When NOT to convert:** If the project is consistently CommonJS with no ESM
migration in progress, do not convert individual files. Mixing module systems
in one project causes more problems than it solves.

**Import sorting order:**
1. Node builtins (`node:fs`, `node:path`)
2. External packages (`react`, `express`)
3. Internal aliases (`@/utils`, `~/lib`)
4. Relative imports (`./helper`, `../types`)

Separate groups with blank lines. Remove unused imports.

**Note:** If the project has ESLint `import/order` or a Prettier plugin for
imports, skip manual sorting -- the tooling handles it.

---

## Function Declarations

**Top-level and exported functions:** Use `function` keyword.
```typescript
// Prefer
export function createUser(data: UserInput): User {
  // ...
}

// Avoid
export const createUser = (data: UserInput): User => {
  // ...
}
```

**Why:** Function declarations are hoisted (useful for readability), produce
named stack traces, and are more greppable.

**Use arrow functions for:**
- Callbacks: `items.map(item => item.id)`
- Inline event handlers: `onClick={() => setOpen(true)}`
- Short expressions that don't need a name

**Never convert all functions to arrows.** This is a common over-simplification
that hurts readability.

---

## Return Types (TypeScript)

**Exported functions:** Always add explicit return types.
```typescript
export function getUser(id: string): Promise<User | null> {
  // ...
}
```

**Internal/private helpers:** Let TypeScript infer the return type unless it's
non-obvious.

**Why explicit return types on exports:** They serve as documentation, prevent
accidental return type changes, and speed up type checking in large codebases.

---

## React Component Patterns

### Function components only
Never introduce class components. If simplifying an existing class component,
only convert to a function component if the user explicitly asks -- that's a
refactor, not a simplification.

### Named exports over default exports
```typescript
// Prefer
export function UserCard(props: UserCardProps): ReactElement { ... }

// Avoid
export default function UserCard(props: UserCardProps) { ... }
```

### Explicit Props types
```typescript
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

## Error Handling

**Catch specific error types:**
```typescript
// Before
try { ... } catch (e) { console.error(e) }

// After
try { ... } catch (error) {
  if (error instanceof NetworkError) {
    // handle network errors
  }
  throw error // re-throw unknown errors
}
```

**Async/await over .then().catch() chains:**
```typescript
// Before
fetchUser(id)
  .then(user => fetchProfile(user.profileId))
  .then(profile => renderProfile(profile))
  .catch(err => handleError(err))

// After
try {
  const user = await fetchUser(id)
  const profile = await fetchProfile(user.profileId)
  renderProfile(profile)
} catch (error) {
  handleError(error)
}
```

**Prefer Error subclasses over string throws:**
```typescript
// Before
throw "User not found"

// After
throw new NotFoundError("User not found")
```

---

## Type Narrowing (TypeScript)

**Discriminated unions over type assertions:**
```typescript
// Before
const value = response as SuccessResponse

// After
if (response.status === 'success') {
  // response is narrowed to SuccessResponse
}
```

**`satisfies` over `as` for type checking without widening:**
```typescript
// Before
const config = { timeout: 5000, retries: 3 } as Config

// After
const config = { timeout: 5000, retries: 3 } satisfies Config
```

**Type predicates for reusable narrowing:**
```typescript
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value
}
```

---

## JS-Specific Simplification Patterns

### Optional chaining over nested && checks
```typescript
// Before
const city = user && user.address && user.address.city

// After
const city = user?.address?.city
```

### Nullish coalescing over ||
```typescript
// Before (bug: || treats 0 and "" as falsy)
const port = config.port || 3000

// After (only null/undefined trigger the fallback)
const port = config.port ?? 3000
```

Use `??` when `0`, `""`, or `false` are valid values. Use `||` when you
genuinely want all falsy values to trigger the fallback.

### Object destructuring for 3+ property accesses
```typescript
// Before
console.log(user.name)
console.log(user.email)
console.log(user.role)

// After
const { name, email, role } = user
console.log(name)
console.log(email)
console.log(role)
```

### Array methods over imperative loops (when clearer)
```typescript
// Before
const active = []
for (const user of users) {
  if (user.isActive) active.push(user)
}

// After
const active = users.filter(user => user.isActive)
```

**But NOT when it hurts readability:**
```typescript
// This reduce is WORSE than a loop -- don't "simplify" to this
const grouped = items.reduce((acc, item) => {
  const key = item.type
  acc[key] = acc[key] || []
  acc[key].push(item)
  return acc
}, {})
```

### Template literals over concatenation
```typescript
// Before
const msg = "Hello " + name + ", welcome to " + site

// After
const msg = `Hello ${name}, welcome to ${site}`
```

---

## Anti-Patterns to Avoid When Simplifying JS/TS

| Do NOT do this | Why |
|---|---|
| Convert all functions to arrow functions | Loses hoisting, named stack traces, and `this` binding |
| Replace clear if/else with `&&` short-circuit in JSX | Can render `0` or `""`, and is less readable |
| Use `.reduce()` when `.forEach()` or `for...of` is clearer | Reduce is for accumulation, not general iteration |
| Destructure in function signatures when it obscures what the param is | `function process({ a, b, c })` loses the "what is this object?" context |
| Remove `as const` assertions without understanding their purpose | They enforce literal types and readonly, removal widens types |
| Convert `.then()` chains when error handling differs per step | Async/await is simpler only when error handling is uniform |
| Add `!` non-null assertions to "simplify" null checks | This hides bugs. Keep the null check |
