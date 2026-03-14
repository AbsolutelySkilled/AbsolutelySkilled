<!-- Part of the Clean Architecture AbsolutelySkilled skill. Load this file when
     working with code patterns for specific architectural layers. -->

# Layer Patterns

Detailed code patterns for each layer of Clean Architecture. Each section shows
what belongs in the layer, what doesn't, and concrete implementation patterns.

---

## Entities Layer (innermost)

### What belongs here
- Business objects with enterprise-wide rules
- Value objects (immutable, equality by value)
- Domain events
- Enums representing business concepts

### What does NOT belong here
- Framework annotations (`@Entity`, `@Column`, `@Injectable`)
- Database concerns (IDs from auto-increment, timestamps from ORM)
- Serialization logic (`toJSON`, `fromJSON`)
- Validation that depends on external state

### Patterns

**Entity with business rules:**
```typescript
class Order {
  private items: OrderItem[] = [];
  private status: OrderStatus = OrderStatus.DRAFT;

  addItem(product: Product, quantity: number): void {
    if (this.status !== OrderStatus.DRAFT) {
      throw new OrderAlreadySubmittedError(this.id);
    }
    if (quantity <= 0) {
      throw new InvalidQuantityError(quantity);
    }
    const existing = this.items.find((i) => i.productId === product.id);
    if (existing) {
      existing.increaseQuantity(quantity);
    } else {
      this.items.push(OrderItem.create(product, quantity));
    }
  }

  submit(): void {
    if (this.items.length === 0) {
      throw new EmptyOrderError(this.id);
    }
    this.status = OrderStatus.SUBMITTED;
  }

  get total(): Money {
    return this.items.reduce(
      (sum, item) => sum.add(item.subtotal),
      Money.zero("USD"),
    );
  }
}
```

**Value object:**
```typescript
class Money {
  private constructor(
    readonly amount: number,
    readonly currency: string,
  ) {
    if (amount < 0) throw new NegativeAmountError(amount);
  }

  static of(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  static zero(currency: string): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
```

Key properties of value objects:
- Immutable (methods return new instances)
- Equality by value, not reference
- Self-validating (constructor enforces invariants)
- No identity (no ID field)

---

## Use Cases Layer

### What belongs here
- Application-specific business rules (one class per use case)
- Input/output port interfaces (request/response models)
- Gateway interfaces (abstractions for external dependencies)
- Application-level validation (does this user have permission?)

### What does NOT belong here
- Framework types (HTTP requests, database connections)
- Presentation logic (formatting, HTML, JSON structure)
- Infrastructure details (SQL queries, API calls)

### Patterns

**Use case with input/output ports:**
```typescript
// Input port (what the use case accepts)
interface CreateOrderInput {
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
}

// Output port (what the use case returns)
interface CreateOrderOutput {
  orderId: string;
  total: number;
  itemCount: number;
}

// Gateway interfaces (what the use case needs from the outside)
interface CustomerGateway {
  findById(id: string): Promise<Customer | null>;
}

interface OrderGateway {
  save(order: Order): Promise<void>;
  nextId(): Promise<string>;
}

interface ProductGateway {
  findByIds(ids: string[]): Promise<Product[]>;
}

// The use case itself
class CreateOrder {
  constructor(
    private customers: CustomerGateway,
    private orders: OrderGateway,
    private products: ProductGateway,
  ) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const customer = await this.customers.findById(input.customerId);
    if (!customer) throw new CustomerNotFoundError(input.customerId);

    const productIds = input.items.map((i) => i.productId);
    const products = await this.products.findByIds(productIds);

    const orderId = await this.orders.nextId();
    const order = Order.create(orderId, customer);

    for (const item of input.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new ProductNotFoundError(item.productId);
      order.addItem(product, item.quantity);
    }

    order.submit();
    await this.orders.save(order);

    return {
      orderId: order.id,
      total: order.total.amount,
      itemCount: input.items.length,
    };
  }
}
```

**Key pattern:** The use case defines the gateway interfaces it needs. It does
not import concrete implementations. The implementations are injected.

---

## Interface Adapters Layer

### What belongs here
- Controllers (convert external input to use case input)
- Presenters (convert use case output to external output)
- Repository implementations (convert between entities and database)
- API clients (convert between entities and external service formats)
- Mappers/translators between data formats

### What does NOT belong here
- Business rules or domain logic
- Direct framework configuration

### Patterns

**Controller (HTTP to use case):**
```typescript
class OrdersController {
  constructor(private createOrder: CreateOrder) {}

  async handleCreate(req: Request, res: Response): Promise<void> {
    const input: CreateOrderInput = {
      customerId: req.body.customerId,
      items: req.body.items,
    };

    const output = await this.createOrder.execute(input);

    res.status(201).json({
      id: output.orderId,
      total: `$${output.total.toFixed(2)}`,
      items: output.itemCount,
    });
  }
}
```

**Repository implementation (entity to database):**
```typescript
class PostgresOrderGateway implements OrderGateway {
  constructor(private db: Pool) {}

  async save(order: Order): Promise<void> {
    await this.db.query(
      "INSERT INTO orders (id, customer_id, status, total) VALUES ($1, $2, $3, $4)",
      [order.id, order.customerId, order.status, order.total.amount],
    );

    for (const item of order.items) {
      await this.db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [order.id, item.productId, item.quantity, item.price.amount],
      );
    }
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.db.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (!row) return null;
    return this.toEntity(row);
  }

  private toEntity(row: any): Order {
    // Map database row back to domain entity
    return Order.reconstitute(row.id, row.customer_id, row.status, ...);
  }
}
```

**Key pattern:** The mapper (`toEntity`) lives in the adapter. The entity has a
`reconstitute` factory method for rebuilding from persisted state, separate from
the `create` method used for new instances.

---

## Frameworks & Drivers Layer (outermost)

### What belongs here
- Framework configuration (Express routes, Spring beans, Django URLs)
- Database connection setup
- The composition root (dependency injection wiring)
- Entry point (`main`)

### Patterns

**Composition root:**
```typescript
// main.ts - wires everything together
import { Pool } from "pg";
import { createApp } from "express";

// Infrastructure
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// Gateways (adapters implementing use case interfaces)
const orderGateway = new PostgresOrderGateway(db);
const customerGateway = new PostgresCustomerGateway(db);
const productGateway = new PostgresProductGateway(db);

// Use cases (injected with gateways)
const createOrder = new CreateOrder(customerGateway, orderGateway, productGateway);
const cancelOrder = new CancelOrder(orderGateway);

// Controllers (injected with use cases)
const ordersController = new OrdersController(createOrder);
const cancellationController = new CancellationController(cancelOrder);

// Routes (framework glue)
const app = createApp();
app.post("/orders", (req, res) => ordersController.handleCreate(req, res));
app.post("/orders/:id/cancel", (req, res) => cancellationController.handle(req, res));
app.listen(3000);
```

This is the only file that knows about every layer. It's the outermost circle,
maximally unstable (I=1), and that's fine - it changes whenever anything changes.

---

## Layer boundary rules summary

| From | Can import from | Cannot import from |
|---|---|---|
| Entities | Nothing (only language stdlib) | Use cases, adapters, frameworks |
| Use Cases | Entities | Adapters, frameworks |
| Adapters | Use cases, entities | Frameworks (except via injection) |
| Frameworks | Adapters, use cases, entities | - (can see everything) |
