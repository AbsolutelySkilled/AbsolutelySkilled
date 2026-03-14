<!-- Part of the Clean Code AbsolutelySkilled skill. Load this file when
     working with naming conventions and improvements. -->

# Naming Guide

Names are the most powerful tool for making code readable. A good name eliminates
the need for comments, makes intent obvious, and prevents misuse. Invest time in
names - it pays dividends every time someone reads the code.

---

## Universal rules

### Use intention-revealing names

The name should answer: why does this exist, what does it do, how is it used?

```python
# Bad: requires a comment to understand
d = 86400  # elapsed time in seconds

# Good: name reveals intent
SECONDS_PER_DAY = 86400
```

### Use pronounceable names

If you can't say it out loud, it's hard to discuss in code reviews and meetings.

```java
// Bad
Date genymdhms;    // generation year-month-day-hour-minute-second

// Good
Date generationTimestamp;
```

### Use searchable names

Single-letter names and numeric constants are hard to grep. The length of a name
should be proportional to the size of its scope.

```javascript
// Bad: searching for "5" finds thousands of results
if (items.length > 5) { ... }

// Good: searchable and self-documenting
const MAX_ITEMS_PER_PAGE = 5;
if (items.length > MAX_ITEMS_PER_PAGE) { ... }
```

### Avoid encodings and prefixes

Don't embed type information, scope, or notation in names.

```typescript
// Bad: Hungarian notation, member prefixes
let strName: string;
let m_count: number;
let IShapeFactory: interface;

// Good: let the type system handle types
let name: string;
let count: number;
interface ShapeFactory { ... }
```

### Avoid mental mapping

Readers shouldn't have to mentally translate a name into a concept they already know.

```python
# Bad: reader must remember that 'r' means 'urlRewritten'
r = rewrite_url(original)

# Good: no mapping needed
rewritten_url = rewrite_url(original)
```

**Exception:** Single-letter variables are fine in small scopes where the convention
is universal: `i`, `j` for loop indices; `x`, `y` for coordinates; `e` for
exception in a catch block.

---

## Rules by entity type

### Variables

| Guideline | Bad | Good |
|---|---|---|
| Noun or noun phrase | `calc` | `totalPrice` |
| Specific, not generic | `data`, `info`, `temp` | `userProfile`, `orderDetails` |
| No noise words | `nameString`, `accountData` | `name`, `account` |
| Plural for collections | `userList` | `users` |

### Booleans

Booleans should read as true/false questions using prefixes like `is`, `has`,
`can`, `should`, `was`:

| Bad | Good |
|---|---|
| `active` | `isActive` |
| `permission` | `hasPermission` |
| `visible` | `isVisible` |
| `open` | `canOpen` or `isOpen` |

Avoid negated boolean names - they cause double negatives:

```python
# Bad: double negative is confusing
if not is_not_found: ...

# Good: positive name
if is_found: ...
```

### Functions and methods

Functions should be verbs or verb phrases. The name should describe the action.

| Bad | Good |
|---|---|
| `data()` | `fetchUserData()` |
| `process()` | `calculateTax()` |
| `handle()` | `routeRequest()` |
| `check()` | `validateEmail()` |
| `make()` | `createInvoice()` |

**Accessors, mutators, and predicates** follow conventions:

```java
getName()       // accessor (get + noun)
setName(val)    // mutator (set + noun)
isActive()      // predicate (is + adjective)
hasPermission() // predicate (has + noun)
```

### Classes

Classes should be nouns or noun phrases. Never verbs.

| Bad | Good |
|---|---|
| `Process` | `PaymentProcessor` |
| `Manage` | `UserManager` |
| `Run` | `TaskRunner` |

Avoid meaningless suffixes that add no information:

| Avoid | Prefer |
|---|---|
| `UserInfo` | `User` |
| `AccountData` | `Account` |
| `OrderObject` | `Order` |

**Exception:** Suffixes that communicate a design pattern are valuable:
`EmailSender`, `OrderRepository`, `PaymentStrategy`, `UserFactory`.

### Constants

Use SCREAMING_SNAKE_CASE. The name should explain the meaning, not just the value.

```python
# Bad: the value is obvious, the meaning is not
FIVE = 5
SIXTY = 60

# Good: explains meaning
MAX_RETRY_ATTEMPTS = 5
SESSION_TIMEOUT_SECONDS = 60
```

### Enums

Enum type should be singular; members should be SCREAMING_SNAKE_CASE:

```typescript
enum OrderStatus {
  PENDING,
  PROCESSING,
  SHIPPED,
  DELIVERED,
  CANCELLED,
}
```

---

## Scope-length rule

The length of a name should be proportional to the scope in which it's used:

| Scope | Name length | Example |
|---|---|---|
| Loop (2-3 lines) | 1 character | `i`, `x` |
| Lambda / closure | Short | `user`, `item` |
| Local variable | Short to medium | `activeUsers` |
| Function parameter | Medium | `targetUserId` |
| Class field | Medium to long | `connectionTimeout` |
| Module constant | Long and descriptive | `MAX_CONCURRENT_CONNECTIONS` |
| Global / exported | Very descriptive | `DEFAULT_SESSION_TIMEOUT_SECONDS` |

---

## Naming consistency

### Pick one word per concept

Choose one synonym and use it everywhere. Don't mix:

- `fetch` / `retrieve` / `get` / `load` - pick one
- `create` / `make` / `build` / `generate` - pick one
- `controller` / `manager` / `handler` - pick one

### Use domain language

Use the terms your business domain uses (Domain-Driven Design's "ubiquitous
language"). If the business says "policy," don't call it "rule" in code.

```python
# Bad: invented terminology
class DiscountRule:
    def applies_to(self, purchase): ...

# Good: matches business language
class PricingPolicy:
    def applies_to(self, order): ...
```

---

## Renaming checklist

When improving names in existing code:

1. Identify the name's scope and all usages
2. Choose a name that passes the "read aloud" test
3. Use your IDE's rename refactoring (not find-and-replace)
4. Verify tests still pass
5. Check that no external API contracts are broken
