<!-- Part of the refactoring-patterns AbsolutelySkilled skill. Load this file when
     identifying code smells or choosing which refactoring to apply. -->

# Code Smells Catalog

A code smell is a surface indication of a deeper structural problem. Smells signal
that refactoring *might* improve the design - always apply judgment. Use this
catalog to name a smell precisely and select the right refactoring move.

---

## Function-level smells

### 1. Long Method
- **Detection:** Function exceeds 20 lines, or requires section comments to divide
  distinct operations, or mixes multiple levels of abstraction
- **Refactoring:** Extract Method - give each section a name that states intent
- **Signal:** "This function first validates, then calculates, then saves..."

### 2. Too Many Parameters
- **Detection:** Function takes 4+ arguments; callers pass confusing positional values
- **Refactoring:** Introduce Parameter Object or Preserve Whole Object
- **Threshold:** 0 args (ideal), 1 arg (good), 2 args (acceptable), 3 args (justify),
  4+ args (refactor)

### 3. Flag Argument
- **Detection:** A boolean parameter that causes the function to behave in two
  fundamentally different ways
- **Refactoring:** Split into two separate functions with descriptive names
```typescript
// Smell
render(data, true);           // what does true mean?
// Fixed
renderForPrint(data);
renderForScreen(data);
```

### 4. Dead Code
- **Detection:** Unreachable branches, unused variables, functions that are never
  called, commented-out blocks
- **Refactoring:** Delete it. Version control preserves history.
- **Note:** IDE "find usages" confirms a function has no callers before deleting

### 5. Temp Variable Used Once
- **Detection:** A local variable is assigned and then used exactly once immediately
  after, adding no clarity
- **Refactoring:** Replace Temp with Query - inline the expression or extract a
  named function

### 6. Side Effects Hidden Behind Name
- **Detection:** Function name says `checkPassword` but it also resets a session
- **Refactoring:** Either rename to reflect all effects (`checkPasswordAndResetSession`)
  or extract the side effect into a separate function

---

## Class-level smells

### 7. Large Class (God Object)
- **Detection:** Class has many instance variables, many methods, or describes
  unrelated concerns. Can't describe it in one sentence without "and".
- **Refactoring:** Extract Class - group cohesive fields and methods into a new class
- **Test:** Count instance variables. More than 7-10 is a strong signal.

### 8. Feature Envy
- **Detection:** A method accesses data or methods from another class more than its
  own. The method seems to "want" to live somewhere else.
- **Refactoring:** Move Method to the class whose data it uses most
```typescript
// Smell: OrderFormatter envies Order's data
class OrderFormatter {
  format(order: Order): string {
    return `${order.customer.name}: ${order.calculateTotal()}`;
  }
}
// Fixed: Move to Order
class Order {
  toSummaryString(): string {
    return `${this.customer.name}: ${this.calculateTotal()}`;
  }
}
```

### 9. Inappropriate Intimacy
- **Detection:** Two classes access each other's private fields directly or call
  each other's internal methods extensively; they are tightly coupled
- **Refactoring:** Move fields/methods to reduce coupling; introduce a mediator or
  extract a shared abstraction

### 10. Refused Bequest
- **Detection:** A subclass inherits methods or fields from its parent but doesn't
  use them, overrides them to do nothing, or throws "not supported" exceptions
- **Refactoring:** Replace inheritance with composition; use Push Down Method to
  move the unused methods to a sibling that actually needs them

### 11. Temporary Field
- **Detection:** An instance variable is only set and used in one code path; in
  other paths it is null or meaningless
- **Refactoring:** Extract Class to hold the temporary field and its related methods,
  or convert to a local variable passed as a parameter

---

## Structural smells

### 12. Duplicated Code
- **Detection:** Same or structurally similar logic in two or more places. Changes
  to one copy must be mirrored in others.
- **Refactoring:**
  - Same class: Extract Method
  - Sibling classes: Pull Up Method to parent, or extract to shared utility
  - Unrelated classes: Extract to a standalone function or service
- **Warning:** Two occurrences might be coincidental. Three is a pattern worth extracting.

### 13. Primitive Obsession
- **Detection:** Domain concepts represented as raw strings, numbers, or booleans
  instead of types (e.g., `"active"` status, `"USD"` currency, `"555-1234"` phone)
- **Refactoring:** Replace with a Value Object or an enum that encapsulates the
  validation and behavior

```typescript
// Smell
function charge(amount: number, currency: string): void { ... }

// Fixed
class Money {
  constructor(public readonly amount: number, public readonly currency: Currency) {}
}
function charge(amount: Money): void { ... }
```

### 14. Data Clumps
- **Detection:** The same group of variables appears together in multiple function
  signatures, method calls, or class fields (e.g., `startX, startY, endX, endY`)
- **Refactoring:** Introduce Parameter Object to bundle the group into a named type

```typescript
// Smell
function drawRect(x: number, y: number, width: number, height: number): void { ... }

// Fixed
interface Rect { x: number; y: number; width: number; height: number; }
function drawRect(rect: Rect): void { ... }
```

### 15. Divergent Change
- **Detection:** One class is frequently modified for several unrelated reasons.
  Every time a new requirement arrives, this class gets touched.
- **Refactoring:** Split the class by responsibility - each resulting class has one
  reason to change (Single Responsibility Principle)

### 16. Shotgun Surgery
- **Detection:** One logical change requires small edits scattered across many
  unrelated classes. Opposite of divergent change.
- **Refactoring:** Move Method / Move Field to consolidate the logic into one class

### 17. Speculative Generality
- **Detection:** Abstract classes, interfaces, or parameters added "just in case"
  with only one concrete implementation
- **Refactoring:** Remove the abstraction (Collapse Hierarchy). Add it back when a
  second concrete use case actually materializes (YAGNI)

### 18. Switch Statements (Repeated)
- **Detection:** The same `switch`/`if-else` chain on a type tag appears in multiple
  places. Adding a new type requires finding and updating every occurrence.
- **Refactoring:** Replace Conditional with Polymorphism - each case becomes a class

---

## Comment smells

### 19. Redundant Comment
- **Detection:** Comment restates exactly what the code already says
```typescript
i++; // increment i
```
- **Refactoring:** Delete it. The code is the documentation.

### 20. Commented-Out Code
- **Detection:** Blocks of code disabled with comments, often with no explanation
- **Refactoring:** Delete it. Git history preserves every prior version.

### 21. Journal Comment
- **Detection:** Changelog entries embedded in source files
```typescript
// 2024-01-15 - Added validation
// 2024-02-01 - Fixed null pointer
```
- **Refactoring:** Delete it. That's what `git log` is for.

### 22. Explanatory Comment for Bad Code
- **Detection:** A comment that explains why the code is confusing, rather than
  fixing the code
- **Refactoring:** Remove the comment and fix the code so it explains itself

---

## Choosing the right refactoring

| Smell | Primary Move | Secondary Move |
|---|---|---|
| Long method | Extract Method | Decompose Conditional |
| Too many parameters | Introduce Parameter Object | Preserve Whole Object |
| Switch on type | Replace Conditional with Polymorphism | - |
| Duplicated code | Extract Method | Pull Up Method |
| Large class | Extract Class | Extract Interface |
| Feature envy | Move Method | Move Field |
| Primitive obsession | Replace with Value Object | Introduce Parameter Object |
| Data clumps | Introduce Parameter Object | Extract Class |
| Magic numbers | Replace Magic Number with Constant | - |
| Temp variable | Replace Temp with Query | - |

---

## Refactoring safety checklist

Before any refactoring move:
1. Are there tests covering the code you are about to change? If no, write them first.
2. Can you name the smell precisely from this catalog?
3. What is the minimal refactoring move that addresses it?
4. After the move: do all tests still pass?
5. Is the code more readable than before? If not, revert.
