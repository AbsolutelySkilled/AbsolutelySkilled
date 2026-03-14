<!-- Part of the Clean Architecture AbsolutelySkilled skill. Load this file when
     working with the Dependency Rule and enforcement strategies. -->

# The Dependency Rule

The Dependency Rule is the single most important rule of Clean Architecture:

> Source code dependencies must only point inward.

Nothing in an inner circle can know anything at all about something in an outer
circle. This includes names, functions, classes, data types, or any other named
software entity.

---

## Why it matters

When inner layers depend on outer layers, changes to frameworks, databases, or UI
cascade into business rules. This creates:
- **Fragility** - A database schema change breaks business logic
- **Rigidity** - Can't change the web framework without rewriting use cases
- **Untestability** - Can't test business rules without standing up infrastructure

The Dependency Rule prevents all three by ensuring the most important code (policy)
is protected from the least important code (mechanism).

---

## The direction of dependencies

```
Frameworks & Drivers  ->  Interface Adapters  ->  Use Cases  ->  Entities

(outer)                                                        (inner)
```

Each arrow means "depends on" / "knows about" / "imports from."

**Allowed:**
- A controller (adapter) imports a use case
- A use case imports an entity
- A repository implementation (adapter) imports a repository interface (use case)

**Forbidden:**
- An entity imports a use case
- A use case imports a controller
- A use case imports a concrete database class
- An entity imports an ORM decorator

---

## Crossing boundaries inward (easy)

When an outer layer needs something from an inner layer, it simply imports it.
This follows the natural dependency direction.

```typescript
// Adapter imports Use Case - allowed
import { PlaceOrder } from "../usecases/PlaceOrder";

class OrdersController {
  constructor(private placeOrder: PlaceOrder) {}
}
```

---

## Crossing boundaries outward (requires inversion)

When an inner layer needs to call an outer layer (e.g. a use case needs to save
to a database), you must invert the dependency:

1. Define an **interface** in the inner layer
2. Create an **implementation** in the outer layer
3. **Inject** the implementation at the composition root

```
Use Case layer:     OrderGateway (interface)     <-- dependency points inward
Adapter layer:      PostgresOrderGateway (class)  -- implements the interface
Composition root:   new PlaceOrder(new PostgresOrderGateway(db))
```

This way the use case depends on an abstraction it owns, not on a concrete
database class.

### The Composition Root

The composition root is the single place (usually in `main` or the framework's
bootstrap) where all concrete dependencies are wired together. It's the only place
that knows about all layers.

```typescript
// main.ts (composition root - outermost layer)
const db = new Pool(config);
const orderGateway = new PostgresOrderGateway(db);
const productGateway = new PostgresProductGateway(db);
const placeOrder = new PlaceOrder(orderGateway, productGateway);
const controller = new OrdersController(placeOrder);

app.post("/orders", (req, res) => controller.handlePost(req, res));
```

---

## Data crossing boundaries

Data that crosses a boundary should be in the form most convenient for the inner
layer. Never pass database rows, ORM entities, or HTTP request objects across
a boundary.

**Request/Response models (DTOs):**
```typescript
// Defined in the use case layer - simple data structures
interface PlaceOrderRequest {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
}

interface PlaceOrderResponse {
  orderId: string;
  total: number;
}
```

The controller converts HTTP data into `PlaceOrderRequest`. The use case returns
`PlaceOrderResponse`. The controller converts that into an HTTP response. Each
layer owns its own data format.

**Never pass entities out of the use case layer.** Return a response model
instead. This prevents outer layers from calling entity methods or depending on
entity structure.

---

## Enforcement strategies by language

### TypeScript / JavaScript
- `eslint-plugin-boundaries` - Define layer zones and allowed import directions
- `eslint-plugin-import` with `no-restricted-imports` - Block specific import paths
- Path aliases in `tsconfig.json` - Make violations visually obvious

```json
// eslint config example
{
  "rules": {
    "boundaries/element-types": [2, {
      "default": "disallow",
      "rules": [
        { "from": "entities", "allow": [] },
        { "from": "usecases", "allow": ["entities"] },
        { "from": "adapters", "allow": ["usecases", "entities"] },
        { "from": "frameworks", "allow": ["adapters", "usecases", "entities"] }
      ]
    }]
  }
}
```

### Java / Kotlin
- **ArchUnit** - Write architecture tests that verify dependency rules at build time
- **Java modules (JPMS)** - Use `module-info.java` to control exports/requires
- Package-private visibility - Don't make classes public unless they need to cross boundaries

```java
// ArchUnit test
@Test
void entities_should_not_depend_on_usecases() {
    noClasses().that().resideInAPackage("..entities..")
        .should().dependOnClassesThat().resideInAPackage("..usecases..")
        .check(importedClasses);
}
```

### Go
- Internal packages (`internal/`) prevent external imports by convention
- Package-level visibility (unexported types) enforces boundaries naturally
- `go-cleanarch` linter checks dependency direction

### Python
- `import-linter` - Define contracts that forbid certain import paths
- Separate packages with `__init__.py` controlling exports

---

## Common violations and fixes

| Violation | Example | Fix |
|---|---|---|
| Entity imports ORM | `from sqlalchemy import Column` in entity | Keep entities as plain classes. Map to ORM in the adapter |
| Use case imports HTTP | `from express import Request` in use case | Define a request DTO. Controller converts HTTP to DTO |
| Use case imports concrete DB | `import { PrismaClient }` in use case | Define a gateway interface. Inject Prisma implementation |
| Entity knows about JSON | `toJSON()` method on entity | Put serialization in the adapter layer |
| Framework annotations on entities | `@Entity`, `@Column` decorators | Use separate ORM models and map to/from entities |
