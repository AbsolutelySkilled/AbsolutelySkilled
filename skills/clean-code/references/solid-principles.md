<!-- Part of the Clean Code AbsolutelySkilled skill. Load this file when
     working with SOLID principles. -->

# SOLID Principles

The five SOLID principles guide class and module design toward code that is easy to
change, test, and extend. Apply them when you feel the pain of rigidity - not
preemptively everywhere.

---

## S - Single Responsibility Principle (SRP)

**A class should have only one reason to change.**

This means one actor (stakeholder or group) owns each class. When two different
business concerns live in the same class, a change for one concern risks breaking
the other.

### Before (violates SRP)

```python
class Employee:
    def calculate_pay(self):        # owned by accounting
        ...
    def generate_report(self):      # owned by reporting
        ...
    def save_to_database(self):     # owned by DBA/infra
        ...
```

### After (SRP applied)

```python
class PayCalculator:
    def calculate_pay(self, employee): ...

class EmployeeReporter:
    def generate_report(self, employee): ...

class EmployeeRepository:
    def save(self, employee): ...
```

### When NOT to apply

- Tiny scripts or one-off utilities - splitting a 30-line script into 3 classes
  adds friction without value.
- Data classes / DTOs - a class that just holds data fields doesn't need splitting
  even if multiple consumers read from it.

---

## O - Open/Closed Principle (OCP)

**Software entities should be open for extension but closed for modification.**

You should be able to add new behavior without changing existing, tested code.
Achieve this through polymorphism, strategy pattern, or plugin architectures.

### Before (violates OCP)

```typescript
function calculateShipping(order: Order): number {
  if (order.type === 'standard') return 5.99;
  if (order.type === 'express') return 12.99;
  if (order.type === 'overnight') return 24.99;
  // Every new shipping type requires modifying this function
}
```

### After (OCP applied)

```typescript
interface ShippingStrategy {
  calculate(order: Order): number;
}

class StandardShipping implements ShippingStrategy {
  calculate(order: Order) { return 5.99; }
}

class ExpressShipping implements ShippingStrategy {
  calculate(order: Order) { return 12.99; }
}

// New types are added by creating new classes, not modifying existing code
function calculateShipping(order: Order, strategy: ShippingStrategy): number {
  return strategy.calculate(order);
}
```

### When NOT to apply

- When you have 2-3 cases that rarely change - a simple if/switch is clearer
  than a strategy pattern with one implementation per case.
- Internal utilities where you control all callers - just change the code directly.

---

## L - Liskov Substitution Principle (LSP)

**Subtypes must be substitutable for their base types without altering correctness.**

If code works with a base class, it must work identically with any subclass.
Violations show up as `instanceof` checks or broken assumptions in calling code.

### Classic violation: Square/Rectangle

```java
class Rectangle {
    void setWidth(int w) { this.width = w; }
    void setHeight(int h) { this.height = h; }
    int area() { return width * height; }
}

class Square extends Rectangle {
    void setWidth(int w) { this.width = w; this.height = w; }   // breaks LSP
    void setHeight(int h) { this.width = h; this.height = h; }  // breaks LSP
}

// Calling code assumes width and height are independent - Square breaks that
Rectangle r = new Square();
r.setWidth(5);
r.setHeight(10);
assert r.area() == 50; // FAILS: area is 100
```

### Fix

Don't make Square extend Rectangle. Use a Shape interface with an `area()` method
that each implements independently.

### When NOT to apply

- LSP is rarely "over-applied" - it's more of a diagnostic. If your subtypes work
  correctly everywhere the parent is used, you're fine. Don't create elaborate type
  hierarchies just to prove LSP compliance.

---

## I - Interface Segregation Principle (ISP)

**Clients should not be forced to depend on methods they do not use.**

Fat interfaces that serve multiple clients force unnecessary coupling. Split them
into focused, role-specific interfaces.

### Before (violates ISP)

```typescript
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
}

// A Robot worker is forced to implement eat() and sleep()
class Robot implements Worker {
  work() { /* ... */ }
  eat() { throw new Error('Robots do not eat'); }  // forced stub
  sleep() { throw new Error('Robots do not sleep'); }
  attendMeeting() { /* ... */ }
}
```

### After (ISP applied)

```typescript
interface Workable { work(): void; }
interface Feedable { eat(): void; }
interface Restable { sleep(): void; }
interface Meetable { attendMeeting(): void; }

class Robot implements Workable, Meetable {
  work() { /* ... */ }
  attendMeeting() { /* ... */ }
}
```

### When NOT to apply

- Don't split an interface that has a single consumer into micro-interfaces of
  one method each. ISP solves the problem of multiple consumers with different needs.
- Standard library or framework interfaces (e.g. `Iterable`) shouldn't be split
  even if some methods go unused.

---

## D - Dependency Inversion Principle (DIP)

**High-level modules should not depend on low-level modules. Both should depend
on abstractions.**

The business logic (policy) should define the interface it needs. Infrastructure
(database, HTTP, filesystem) implements that interface and is injected.

### Before (violates DIP)

```python
class OrderService:
    def __init__(self):
        self.db = MySQLDatabase()         # hard-coded dependency
        self.mailer = SmtpEmailSender()   # hard-coded dependency

    def place_order(self, order):
        self.db.save(order)
        self.mailer.send(order.customer.email, "Order placed")
```

### After (DIP applied)

```python
class OrderService:
    def __init__(self, repository: OrderRepository, notifier: Notifier):
        self.repository = repository
        self.notifier = notifier

    def place_order(self, order):
        self.repository.save(order)
        self.notifier.notify(order.customer, "Order placed")
```

Now `OrderService` depends on abstractions (`OrderRepository`, `Notifier`) that
it defines. Tests can inject fakes; production wires in real implementations.

### When NOT to apply

- Simple scripts or small applications where you control the full stack and
  dependency injection adds ceremony without testability benefit.
- When there will only ever be one implementation (e.g. wrapping a single
  third-party SDK) - inject the concrete class directly; add the interface
  when a second implementation actually appears.

---

## Applying SOLID pragmatically

Use this decision heuristic:

1. **Feel the pain first** - Don't apply SOLID preemptively. Wait until a change
   is hard, a test is awkward, or a class is confusing.
2. **Identify which principle is violated** - The symptom tells you the principle:
   - Hard to change without breaking other things -> SRP or OCP
   - Subclass doesn't work where parent is expected -> LSP
   - Forced to implement empty methods -> ISP
   - Can't test without real database/network -> DIP
3. **Apply the minimum fix** - Don't restructure the whole codebase. Fix the one
   class or interface causing the problem.
4. **Verify with tests** - The refactoring should make tests easier to write, not
   harder. If you need more mocks after applying SOLID, you may have over-applied.
