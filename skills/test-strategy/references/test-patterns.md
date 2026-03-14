<!-- Part of the test-strategy AbsolutelySkilled skill. Load this file when
     working with specific test patterns, builders, fakes, or parameterized tests. -->

# Test Patterns

A catalog of reusable patterns that make tests easier to write, read, and
maintain. Each pattern solves a recurring problem in test design.

---

## Builder Pattern (Object Mother variant)

**Problem:** Tests need complex objects with 10+ fields; most tests only care
about 1-2 fields. Giant constructors or fixture files make tests hard to read.

**Pattern:** Create a builder function that provides sensible defaults. Override
only the fields that matter to the specific test.

```typescript
// Builder with defaults
function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'member',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

// Tests only specify what matters
test('inactive users cannot log in', () => {
  const user = buildUser({ isActive: false });
  expect(canLogin(user)).toBe(false);
});

test('admin users can access settings', () => {
  const user = buildUser({ role: 'admin' });
  expect(canAccessSettings(user)).toBe(true);
});
```

**When to use:** Any time test setup requires more than 3-4 fields.

---

## In-Memory Fake

**Problem:** Mocking a repository method-by-method is tedious and couples tests
to implementation. Real DBs are slow to spin up in unit test contexts.

**Pattern:** Implement a working in-memory version of your repository interface.
It behaves like the real thing but stores data in a plain array or map.

```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async save(user: User): Promise<User> {
    const saved = { ...user, id: user.id ?? randomId() };
    this.users.set(saved.id, saved);
    return saved;
  }

  async findByEmail(email: string): Promise<User | null> {
    return [...this.users.values()].find(u => u.email === email) ?? null;
  }

  // Test helper: seed data without going through save()
  seed(user: User): void {
    this.users.set(user.id, user);
  }
}
```

```typescript
// Service test uses the fake - no DB needed
test('cannot register duplicate email', async () => {
  const repo = new InMemoryUserRepository();
  repo.seed(buildUser({ email: 'alice@example.com' }));

  const service = new UserService(repo);
  await expect(service.register({ email: 'alice@example.com', name: 'Bob' }))
    .rejects.toThrow(DuplicateEmailError);
});
```

**When to use:** Service-layer tests that need a repository. Prefer over mocking
every individual method.

---

## Parameterized Tests

**Problem:** A function has many edge cases. Writing a separate test for each
creates massive test files with mostly duplicate setup code.

**Pattern:** Use `test.each` (Jest/Vitest) or equivalent to express a table of
inputs and expected outputs.

```typescript
describe('calculateShippingCost', () => {
  test.each([
    // [orderTotal, membershipTier, expectedCost]
    [10,  'free',    5.99],  // low value, no membership
    [50,  'free',    5.99],  // below free-shipping threshold
    [100, 'free',    0],     // meets free-shipping threshold
    [10,  'silver',  2.99],  // silver discount
    [10,  'gold',    0],     // gold members always free
    [200, 'gold',    0],     // gold members - high value
  ])('order of $%i with %s tier → $%f shipping', (total, tier, expected) => {
    const order = buildOrder({ total, membershipTier: tier });
    expect(calculateShippingCost(order)).toBe(expected);
  });
});
```

**When to use:** Pure functions with boundary conditions, parsers, validators,
price calculators. Avoid when the setup logic differs significantly between cases.

---

## Test Clock (Time Control)

**Problem:** Code that calls `Date.now()`, `new Date()`, or `setTimeout`
produces different results on different runs. Tests become flaky or must
`sleep()` to wait for timers.

**Pattern:** Inject a clock abstraction or use your test framework's fake timer.

```typescript
// Option A: inject a clock (best for unit tests)
interface Clock {
  now(): Date;
}

class SessionManager {
  constructor(private clock: Clock) {}

  isExpired(session: Session): boolean {
    const elapsed = this.clock.now().getTime() - session.createdAt.getTime();
    return elapsed > SESSION_TTL_MS;
  }
}

// Test with a frozen clock
test('session expired after 30 minutes', () => {
  const fixedNow = new Date('2024-06-01T12:30:00Z');
  const clock = { now: () => fixedNow };
  const session = { createdAt: new Date('2024-06-01T12:00:00Z') };
  const manager = new SessionManager(clock);

  expect(manager.isExpired(session)).toBe(true);
});
```

```typescript
// Option B: fake timers (best for timer-based code)
test('retries after 5 second delay', async () => {
  vi.useFakeTimers();
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout'));

  const promise = sendWithRetry(send);
  vi.advanceTimersByTime(5000);
  await promise;

  expect(send).toHaveBeenCalledTimes(2);
  vi.useRealTimers();
});
```

**When to use:** Any code that branches on the current time, schedules work, or
handles TTL/expiry.

---

## Boundary Test Checklist

When testing any function with inputs, cover these categories systematically:

| Category | Examples |
|---|---|
| **Happy path** | Typical valid input producing expected output |
| **Empty / zero** | `""`, `0`, `[]`, `null`, `undefined` |
| **Minimum valid** | `1`, one-character string, single-element array |
| **Maximum valid** | Max integer, 255-char string, large array |
| **Just below boundary** | `limit - 1` |
| **At boundary** | Exactly `limit` |
| **Just above boundary** | `limit + 1` |
| **Negative** | `-1`, `-Infinity` |
| **Type coercion** | `"1"` vs `1`, `true` vs `1` (for loosely typed languages) |
| **Special chars** | `null bytes`, `\n`, SQL injection strings, Unicode |

Not every function needs all categories - pick the ones that are plausible
failure modes for the specific function.

---

## Spy on Side Effects

**Problem:** You need to verify that a side effect was triggered (email sent,
event published, audit logged) without building the full infrastructure.

**Pattern:** Use a spy or a recording fake for side-effect boundaries.

```typescript
class RecordingEmailSender {
  sentEmails: { to: string; subject: string; body: string }[] = [];

  async send(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }

  // Test helper
  sentTo(email: string): boolean {
    return this.sentEmails.some(e => e.to === email);
  }
}

test('sends confirmation email after successful registration', async () => {
  const emailSender = new RecordingEmailSender();
  const service = new RegistrationService(repo, emailSender);

  await service.register({ email: 'alice@example.com', name: 'Alice' });

  expect(emailSender.sentTo('alice@example.com')).toBe(true);
  expect(emailSender.sentEmails[0].subject).toMatch(/welcome/i);
});
```

**When to use:** Email senders, event publishers, audit loggers, webhook
dispatchers - any side effect that cannot be observed through the main return
value.

---

## Contract Test Pattern (Pact)

**Problem:** Two teams own different services. You need confidence the API
contract holds without setting up both services in the same test run.

**Pattern:** Consumer-driven contract testing. The consumer writes an expected
interaction; the pact file becomes the contract the provider must verify.

```typescript
// Consumer test (e.g., frontend calling user-service)
describe('user-service API contract', () => {
  it('returns user by id', async () => {
    await provider.addInteraction({
      state: 'user 123 exists',
      uponReceiving: 'a request for user 123',
      withRequest: {
        method: 'GET',
        path: '/users/123',
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: like('123'),
          name: like('Alice'),
          email: like('alice@example.com'),
        },
      },
    });

    const user = await userServiceClient.getUser('123');
    expect(user.name).toBeDefined();
  });
});
```

Key rules:
- Use `like()` matchers, not exact values - contracts test shape not data
- Only assert on fields the consumer actually uses
- Both teams run the pact verification in CI; `can-i-deploy` blocks mismatches

---

## Test Data Isolation

**Problem:** Tests that share state (global variables, a shared database) pass
individually but fail when run together due to ordering effects.

**Patterns:**

**For databases - transaction rollback:**
```typescript
let db: Database;
beforeAll(async () => { db = await connectTestDb(); });
beforeEach(async () => { await db.query('BEGIN'); });
afterEach(async () => { await db.query('ROLLBACK'); });
afterAll(async () => { await db.disconnect(); });
```

**For shared module state - explicit reset:**
```typescript
// Singleton that accumulates state
let cache: Map<string, unknown>;
beforeEach(() => { cache = new Map(); });
```

**For global HTTP mocks (MSW):**
```typescript
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers()); // remove per-test overrides
afterAll(() => server.close());
```

**When to use:** Every test suite that touches shared infrastructure. Isolation
is not optional - it's the prerequisite for a reliable suite.
