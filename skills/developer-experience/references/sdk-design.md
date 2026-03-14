<!-- Part of the developer-experience AbsolutelySkilled skill. Load this file when
     working with SDK design, API surface area, or method signature decisions. -->

# SDK Design Checklist

## Naming conventions

### Methods
- Use verb-noun pairs: `createUser`, `listInvoices`, `deleteWebhook`
- Use consistent verbs across resources: `create`, `get`, `list`, `update`, `delete`
- Avoid ambiguous verbs: `handle`, `process`, `manage`, `do`
- Boolean methods start with `is`, `has`, `can`, `should`
- Avoid negated names: `isEnabled` not `isNotDisabled`

### Resources
- Use the same noun the API uses (don't rename `payment_intent` to `charge`)
- Plural for collections: `client.users.list()` not `client.user.list()`
- Singular for singletons: `client.account.get()` not `client.accounts.get()`

### Parameters
- Required params go in the function signature positionally
- Optional params go in a trailing options/config object
- Never use positional booleans: `send(email, true)` - what does `true` mean?

```typescript
// Bad: positional boolean
await client.emails.send("user@example.com", true, false);

// Good: options object
await client.emails.send("user@example.com", {
  trackOpens: true,
  trackClicks: false,
});
```

## Constructor and configuration

### Minimum viable constructor
The constructor should require only what is truly necessary to authenticate.
Everything else gets a sensible default.

```typescript
// Minimum: just the API key
const client = new Acme({ apiKey: "sk_..." });

// Optional overrides for advanced use cases
const client = new Acme({
  apiKey: "sk_...",
  baseUrl: "https://api.staging.acme.com",
  timeout: 30_000,
  retries: 3,
  logger: customLogger,
});
```

### Environment variable fallback
SDKs should check for well-known environment variables when no explicit
config is provided. Document which env vars are checked.

```typescript
// Constructor checks process.env.ACME_API_KEY if apiKey is omitted
const client = new Acme(); // works if ACME_API_KEY is set
```

## Return types and error handling

### Consistent return shapes
Every method should return the same shape for success. Use typed errors
for failure - never return `null` to indicate an error.

```typescript
// Good: consistent returns
const user = await client.users.get("usr_123"); // returns User
const users = await client.users.list();          // returns User[]

// Good: typed errors
try {
  await client.users.get("usr_999");
} catch (error) {
  if (error instanceof AcmeNotFoundError) {
    // handle 404
  }
}
```

### Error hierarchy
Design a small, useful error hierarchy:

```
AcmeError (base)
  AcmeApiError (any API response error)
    AcmeNotFoundError (404)
    AcmeValidationError (400/422)
    AcmeAuthError (401/403)
    AcmeRateLimitError (429)
  AcmeConnectionError (network failures)
  AcmeTimeoutError (request timeout)
```

Every error should include:
- Human-readable message with fix suggestion
- HTTP status code (if from API)
- Request ID for support escalation
- Original response body for debugging

### Pagination
Never return unbounded lists. Default to paginated responses.

```typescript
// Cursor-based pagination (preferred)
const page1 = await client.users.list({ limit: 20 });
const page2 = await client.users.list({ limit: 20, after: page1.cursor });

// Convenience: auto-pagination iterator
for await (const user of client.users.list({ limit: 20 })) {
  console.log(user.email);
}
```

## Idempotency

For any operation that creates or mutates state, support idempotency keys:

```typescript
await client.payments.create(
  { amount: 1000, currency: "usd" },
  { idempotencyKey: "order_abc_payment_1" }
);
```

Document clearly which methods are idempotent by default and which require
an explicit key.

## Extensibility

### Middleware / hooks
Allow consumers to intercept requests for logging, metrics, or custom headers:

```typescript
const client = new Acme({
  apiKey: "sk_...",
  beforeRequest: (req) => {
    req.headers["X-Request-Source"] = "my-service";
    return req;
  },
  afterResponse: (res) => {
    metrics.record("acme_api_call", { status: res.status });
    return res;
  },
});
```

### Custom HTTP client
Allow injecting a custom HTTP client for environments with specific
networking requirements (proxies, custom TLS, etc.).

## Versioning

- Follow semantic versioning strictly
- Never ship breaking changes in minor or patch releases
- Use header-based API versioning (`Acme-Version: 2024-01-15`) over URL versioning
- Document the SDK-to-API version mapping clearly
- Support at least the current and previous major API version simultaneously

## Testing support

Make the SDK testable without hitting the real API:

```typescript
// Provide a mock/test mode
const client = new Acme({ apiKey: "sk_test_..." }); // test mode by key prefix

// Or provide explicit test helpers
import { createMockClient } from "@acme/sdk/testing";
const mock = createMockClient();
mock.users.get.mockResolvedValue({ id: "usr_123", email: "test@example.com" });
```

## Documentation requirements for SDKs

Every SDK must ship with:
1. README with install + quickstart (< 30 lines of code to first result)
2. API reference generated from types/docstrings (not hand-written)
3. At least 3 guides covering the most common workflows
4. Changelog following Keep a Changelog format
5. Migration guide for every major version bump
