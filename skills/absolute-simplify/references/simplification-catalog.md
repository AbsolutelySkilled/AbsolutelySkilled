<!-- Part of the Absolute Simplify AbsolutelySkilled skill. Always load this file
     as it contains language-agnostic simplification patterns. -->

# Universal Simplification Catalog

This reference contains language-agnostic patterns for code simplification.
Every pattern here applies regardless of programming language. Language-specific
guidance is in the dedicated reference files.

---

## Nesting Reduction

### Guard clauses / early return

The single most impactful simplification. Invert the condition, return/continue
early, and flatten the happy path.

**Before:**
```
function process(input) {
  if (input != null) {
    if (input.isValid()) {
      if (input.hasPermission()) {
        // 20 lines of actual logic
        return result
      } else {
        return error("no permission")
      }
    } else {
      return error("invalid")
    }
  } else {
    return error("null input")
  }
}
```

**After:**
```
function process(input) {
  if (input == null) return error("null input")
  if (!input.isValid()) return error("invalid")
  if (!input.hasPermission()) return error("no permission")

  // 20 lines of actual logic at zero indentation
  return result
}
```

**When to apply:** Any function with nesting depth > 2 where early exit is
possible. Works with return, continue, break, throw.

**When NOT to apply:** When the early return would need cleanup that happens at
the end of the function (e.g., closing resources). Use language-specific patterns
like `defer` or `finally` instead.

### Decompose nested conditionals

Extract each condition into a named boolean or predicate function.

**Before:**
```
if (user.age >= 18 && user.country === "US" && !user.isBanned && subscription.isActive) {
  // logic
}
```

**After:**
```
const isEligible = user.age >= 18 && user.country === "US" && !user.isBanned
const hasActiveSubscription = subscription.isActive

if (isEligible && hasActiveSubscription) {
  // logic
}
```

**When to apply:** Conditions with 3+ clauses, especially when the combined
meaning is not obvious from reading the raw expression.

### Replace nested loops with extraction

When a loop body contains another loop, the inner loop often represents a
distinct operation that deserves a name.

**Before:**
```
for item in items:
    for tag in item.tags:
        if tag.name == target:
            results.append(item)
            break
```

**After:**
```
def has_tag(item, target):
    return any(tag.name == target for tag in item.tags)

results = [item for item in items if has_tag(item, target)]
```

---

## Dead Code Removal

### Unreachable code

Code after `return`, `throw`, `break`, `continue`, `os.Exit()`, or `panic()`.
Remove it -- it never executes.

### Commented-out code blocks

Remove them. Git has the history. Commented-out code confuses readers about
what is active and what is not.

**Exception:** Comments that explain WHY code was removed (not the code itself)
are fine: `// Removed OAuth flow after migration to SSO (2024-03)`.

### Unused variables and parameters

Remove unused variables. For unused function parameters, check if the function
implements an interface or is a callback -- in those cases the parameter must
stay even if unused.

### Unused imports

Remove them. Most linters catch this, but if the project linter doesn't, handle
it manually.

### Dead feature flags

Feature flags for features that shipped and were never cleaned up. If the flag
is always true in all environments, remove the flag and keep only the enabled
code path. **Be conservative** -- only remove if you can verify the flag is
always on.

---

## Redundancy Elimination

### Unnecessary wrapper functions

A function that just calls another function with the same arguments:

```
// Before
function getUser(id) { return fetchUser(id) }

// After: delete getUser, use fetchUser directly at call sites
```

**Exception:** Wrappers that exist for dependency injection, testing, or to
provide a stable API are intentional. Don't remove them.

### Redundant boolean expressions

| Before | After |
|---|---|
| `if (x === true)` | `if (x)` |
| `if (x === false)` | `if (!x)` |
| `return condition ? true : false` | `return condition` |
| `if (condition) return true; else return false;` | `return condition` |
| `if (condition) { flag = true } else { flag = false }` | `flag = condition` |
| `!!value` (when boolean context is already guaranteed) | `value` |

### Redundant variable assignments

Assigning to a variable only to return it immediately:

```
// Before
const result = computeValue()
return result

// After
return computeValue()
```

**Exception:** Keep the intermediate variable if:
- It adds meaningful naming to an opaque return value
- It's used in a debugger frequently (the team knows this)
- The function call has side effects and you want to make it clear

### No-op error handling

```
// Before
try {
  doSomething()
} catch (e) {
  throw e  // Just re-throws without modification
}

// After
doSomething()
```

**Exception:** Catch blocks that log, wrap, or add context before re-throwing
are NOT no-ops. Leave them.

---

## Expression Simplification

### Nested ternaries

**Rule: NEVER nest ternaries.** Replace with if/else or switch. This is a hard
rule, not a suggestion.

```
// Before (NEVER acceptable)
const label = status === 'active' ? 'Active'
  : status === 'pending' ? 'Pending'
  : status === 'error' ? 'Error'
  : 'Unknown'

// After
let label
switch (status) {
  case 'active': label = 'Active'; break
  case 'pending': label = 'Pending'; break
  case 'error': label = 'Error'; break
  default: label = 'Unknown'
}
```

Or use a lookup object if the mapping is pure data:
```
const LABELS = { active: 'Active', pending: 'Pending', error: 'Error' }
const label = LABELS[status] ?? 'Unknown'
```

### Complex boolean algebra

Apply De Morgan's law when it makes the expression clearer:

| Before | After (if clearer) |
|---|---|
| `!(a && b)` | `!a \|\| !b` |
| `!(a \|\| b)` | `!a && !b` |
| `!(!x)` | `x` |

Only apply if the result is genuinely easier to read. Sometimes the negated
form IS clearer (e.g., `!user.isActive` is clearer than the De Morgan expansion
of a complex expression).

### String building

Replace concatenation chains with template literals or format strings:

```
// Before
const msg = "Hello " + user.name + ", you have " + count + " items"

// After
const msg = `Hello ${user.name}, you have ${count} items`
```

---

## Naming Improvements

### The "obvious improvement" test

Only rename when ALL of these are true:
1. The current name is genuinely unclear (not just "could be slightly better")
2. The new name is unambiguous -- anyone reading the code would agree it's better
3. The variable is local/unexported -- renaming exports can break callers

**Clear wins:**
| Before | After | Why |
|---|---|---|
| `d` | `duration` | Single letter, meaning not obvious from context |
| `temp` | `pendingOrder` | "temp" says nothing about what it holds |
| `cb` | `onComplete` | Callback purpose is unclear |
| `arr` | `userIds` | Content of the array is important |

**NOT worth it (skip these):**
| Before | After | Why skip |
|---|---|---|
| `user` | `currentUser` | Only one user in scope, already clear |
| `items` | `itemsList` | Redundant suffix, adds no information |
| `handleClick` | `onButtonClick` | Both are clear enough |

---

## Structural Simplification

### Flatten unnecessary data structure nesting

When an inner object/dict has only one field and the nesting adds no clarity,
flatten it.

### Replace manual iteration with builtins

If the language provides a built-in method for what a loop does (filter, map,
find, any/all, etc.), use it -- but only when it's clearer, not when it forces
a complex lambda.

### Extract repeated magic values

Numbers and strings that appear 3+ times and represent the same concept should
become named constants.

### Consolidate duplicate error messages

When the same error message or error construction pattern appears multiple times,
extract a helper or constant.

---

## What NOT to Simplify

### One-liner syndrome

**Never** compress clear multi-line code into a dense one-liner. Readability
always beats brevity.

```
// WRONG: "simplifying" to fewer lines
const result = items.filter(x => x.active).map(x => x.id).reduce((a, b) => a + b, 0)

// RIGHT: keep the steps readable
const activeItems = items.filter(item => item.active)
const ids = activeItems.map(item => item.id)
const total = ids.reduce((sum, id) => sum + id, 0)
```

### Clever code

Bitwise tricks, comma operators, obscure language features, and "golf" patterns.
If it requires a comment to explain, it's not simpler.

### Working code with tests

If code is tested, works, and is clear enough, leave it alone. Simplification
has a cost: review time, risk of introducing bugs, and git churn. The ROI must
be positive.

### Style preferences without project consensus

Tabs vs spaces, single vs double quotes, trailing commas, semicolons. Defer to
project config. If no config exists, do not impose a style preference.

### Code you didn't fully read

Never simplify a function based on a snippet. Read the full function, understand
its callers and callees, then decide. Partial context leads to broken changes.
