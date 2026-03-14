<!-- Part of the Clean Architecture AbsolutelySkilled skill. Load this file when
     working with boundary crossing strategies. -->

# Boundaries

Boundaries are the lines drawn between software components where the Dependency Rule
is enforced. Crossing a boundary always involves an inner layer calling or being
called by an outer layer. The challenge is doing this without violating the
dependency direction.

---

## Full boundary

A full boundary uses complete Dependency Inversion: an interface on the inner side,
an implementation on the outer side, injected at the composition root.

```
Inner layer:     Port (interface)
Outer layer:     Adapter (implementation)
Composition:     Wires adapter into port
```

**Input boundary (outside calls in):**
```typescript
// Use case defines the input port
interface CreateOrderUseCase {
  execute(input: CreateOrderInput): Promise<CreateOrderOutput>;
}

// Use case implementation
class CreateOrder implements CreateOrderUseCase {
  execute(input: CreateOrderInput): Promise<CreateOrderOutput> { ... }
}

// Controller calls through the interface
class OrdersController {
  constructor(private createOrder: CreateOrderUseCase) {}
}
```

**Output boundary (inside calls out):**
```typescript
// Use case defines the output port (gateway)
interface OrderGateway {
  save(order: Order): Promise<void>;
}

// Adapter implements it
class PostgresOrderGateway implements OrderGateway {
  save(order: Order): Promise<void> { ... }
}
```

**Cost:** Two extra types (interface + implementation) per boundary crossing.
Use when the boundary is architecturally significant and you need to swap
implementations (test doubles, different databases, different delivery mechanisms).

---

## Partial boundary

When a full boundary feels like over-engineering but you want to preserve the
option for later, use a partial boundary.

### Strategy 1: Interface with single implementation

Define the interface but have only one concrete class. Skip the DI framework -
just instantiate directly. You can add the DI wiring later when a second
implementation appears.

```typescript
// Interface exists for documentation and future flexibility
interface NotificationSender {
  send(to: string, message: string): Promise<void>;
}

// Only one implementation right now
class EmailNotificationSender implements NotificationSender {
  send(to: string, message: string): Promise<void> { ... }
}

// Directly instantiated (no DI container needed)
const sender = new EmailNotificationSender();
const useCase = new ProcessOrder(sender);
```

### Strategy 2: Facade pattern

Put a simple facade in front of a complex subsystem. The facade is the boundary -
it presents a simplified interface that hides the subsystem's complexity.

```typescript
// Facade hides the payment processing complexity
class PaymentFacade {
  processPayment(amount: Money, method: PaymentMethod): PaymentResult {
    // Internally uses Stripe SDK, retry logic, logging, etc.
    // Callers see only this simple interface
  }
}
```

### Strategy 3: Same-package boundary

Keep the interface and implementation in the same package but use the interface
as the public API. This doesn't enforce the boundary at build time but signals
intent.

**Cost of partial boundaries:** They tend to degrade over time if not actively
maintained. The implementation starts leaking through the boundary because
"it's right there." Use code reviews to keep the boundary clean.

---

## Humble Object Pattern

The Humble Object pattern separates hard-to-test behavior from easy-to-test
behavior by placing them in different classes. The hard-to-test class (the humble
object) is stripped down to the bare minimum.

**The pattern:**
```
TestablePresenter  <-- contains all the logic, easy to test
HumbleView         <-- just renders what the presenter tells it to
```

### Example: Presenter + View

```typescript
// Presenter - testable, contains display logic
class OrderPresenter {
  present(output: CreateOrderOutput): OrderViewModel {
    return {
      title: `Order #${output.orderId}`,
      totalDisplay: `$${output.total.toFixed(2)}`,
      itemSummary: `${output.itemCount} item${output.itemCount !== 1 ? "s" : ""}`,
      isLargeOrder: output.total > 1000,
    };
  }
}

// View - humble, just renders the view model
class OrderView {
  render(viewModel: OrderViewModel): string {
    return `<div class="${viewModel.isLargeOrder ? 'highlight' : ''}">
      <h2>${viewModel.title}</h2>
      <p>${viewModel.totalDisplay} - ${viewModel.itemSummary}</p>
    </div>`;
  }
}
```

The presenter is a pure function - no DOM, no HTTP, no framework. Easy to test.
The view is a humble object - it just takes the view model and renders. So simple
it barely needs testing.

### Where humble objects appear

| Boundary | Testable side | Humble side |
|---|---|---|
| UI | Presenter | View / Component |
| Database | Gateway interface | ORM mapping code |
| HTTP | Controller logic | Framework routing |
| External service | Service interface | API client wrapper |

---

## Data Transfer Objects (DTOs)

DTOs carry data across boundaries. They are simple data structures with no
behavior - just fields.

### Rules for DTOs

1. **Each boundary has its own DTOs.** Don't reuse the same DTO across multiple
   boundaries.
2. **DTOs are not entities.** Entities have behavior and enforce invariants. DTOs
   are flat data bags.
3. **Map at the boundary.** The adapter is responsible for converting between
   entity and DTO.

```typescript
// Use case boundary DTO
interface CreateOrderInput {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
}

// HTTP boundary DTO (may have different field names, validation)
interface CreateOrderHttpBody {
  customer_id: string;  // snake_case from API convention
  line_items: Array<{ sku: string; qty: number }>;
}

// Database boundary DTO
interface OrderRow {
  id: string;
  customer_id: string;
  status: string;
  total_cents: number;  // stored as cents, not dollars
  created_at: Date;
}
```

Each DTO is shaped for its boundary's needs. The controller maps HTTP body to
use case input. The repository maps database rows to entities. Never let one
boundary's DTO leak into another.

---

## When to draw boundaries

Not every boundary needs full enforcement from day one. Use this decision guide:

| Signal | Boundary type |
|---|---|
| Different teams own each side | Full boundary (enforced at build time) |
| Will definitely swap implementations (test vs prod DB) | Full boundary |
| Might swap later, one implementation now | Partial boundary (interface + single impl) |
| Conceptual separation only, same developer | Code organization (folders, naming) |
| Small app, simple CRUD | Maybe no internal boundaries at all |

**Start with fewer boundaries** and add them when the cost of not having them
exceeds the cost of maintaining them. A boundary that never gets crossed by
a second implementation is pure overhead.

---

## Boundary violation symptoms

Watch for these signs that a boundary is being violated:

1. **Import from wrong direction** - An entity importing a use case type
2. **Shared mutable state** - Two sides of a boundary modifying the same object
3. **Leaking types** - Database column types appearing in use case code
4. **Test difficulty** - Needing a real database to test business logic
5. **Cascade changes** - Changing a database column requires updating a controller
