<!-- Part of the Backend Engineering AbsolutelySkilled skill. Load this file when designing REST, GraphQL, or gRPC APIs, or implementing pagination, versioning, or rate limiting. -->
# API Design Reference
Opinionated defaults for mid-level backend engineers. When in doubt, pick the simpler option.

## 1. REST Conventions
### Resource Naming
| Do | Don't |
|---|---|
| `GET /users` | `GET /getUsers` |
| `GET /users/42` | `GET /user/42` |
| `POST /users` | `POST /createUser` |
| `GET /users/42/orders` | `GET /getUserOrders?userId=42` |

**Rules:** Plural nouns always. No verbs in URLs. Lowercase, hyphen-separated (`/order-items`). Max two levels of nesting - flatten beyond that.

### HTTP Method Semantics
| Method | Semantics | Idempotent | Safe | Body |
|--------|-----------|------------|------|------|
| `GET` | Read | Yes | Yes | No |
| `POST` | Create / trigger action | **No** | No | Yes |
| `PUT` | Full replace | Yes | No | Yes |
| `PATCH` | Partial update | Yes* | No | Yes |
| `DELETE` | Remove | Yes | No | No |

**Default:** Use `PATCH` for updates, not `PUT`. Clients rarely have the full resource.

### Status Codes
**Success:** `200` GET/PATCH ok | `201` POST created (+ `Location` header) | `202` async accepted | `204` DELETE ok, no body

**Client errors:**
| Code | Use | Common Mistake |
|------|-----|----------------|
| `400` | Malformed JSON, missing required field | - |
| `401` | No auth / expired token ("I don't know who you are") | Using 403 |
| `403` | Authenticated but no permission ("I know you, and no") | Using 401 |
| `404` | Resource doesn't exist | - |
| `409` | Duplicate creation, version conflict | - |
| `410` | Permanently deleted (was here, now gone) | Using 404 |
| `422` | Valid JSON but fails business rules | Using 400 |
| `429` | Rate limited (always include `Retry-After`) | Forgetting header |

**400 vs 422:** `400` = structural (bad JSON). `422` = business logic (email taken).

### Nested vs Flat
**Default: Flat with filters.** Nest only when child can't exist without parent.
```
GET /users/42/orders       # OK - order belongs to user
GET /orders?user_id=42     # Better for most cases
```

### HATEOAS
**Skip it.** Exception: public APIs for third parties where discoverability matters.

## 2. GraphQL
### When It Makes Sense
| Good Fit | Poor Fit |
|----------|----------|
| Mobile clients with varied data needs | Simple CRUD |
| BFF pattern, multiple frontend teams | Server-to-server (use gRPC) |
| Reducing over-fetching on slow networks | File uploads, HTTP caching needed |

### Schema Design
Use Relay connection spec for lists. Non-nullable by default. Prefix mutations: `createUser`, `updateUser`. Return mutated object from mutations.
```graphql
type User {
  id: ID!
  email: String!
  orders(first: Int, after: String): OrderConnection!
}
type OrderConnection { edges: [OrderEdge!]!; pageInfo: PageInfo! }
type OrderEdge { cursor: String!; node: Order! }
type PageInfo { hasNextPage: Boolean!; endCursor: String }
```

### N+1 and DataLoader
```pseudo
# BAD - called once per user = N+1
resolve User.orders(user):
    return db.query("SELECT * FROM orders WHERE user_id = ?", user.id)
# GOOD - DataLoader batches all keys into one query
resolve User.orders(user):
    return orderLoader.load(user.id)
batch_load_orders(user_ids):
    return db.query("SELECT * FROM orders WHERE user_id IN (?)", user_ids)
```

### Query Complexity Limits
Assign cost per field. Reject queries exceeding max complexity (1000) or max depth (10). Use persisted queries (APQ) in production - prevents arbitrary execution, smaller payloads, auditable.

## 3. gRPC
### When gRPC Shines
| Strength | Why |
|----------|-----|
| Internal service-to-service | Strict protobuf contracts, fast serialization |
| High throughput / low latency | Binary protocol, HTTP/2 multiplexing |
| Polyglot environments | Auto-generated clients for any language |
| Streaming data | First-class bidirectional streaming |

### Protobuf Schema Design
```protobuf
syntax = "proto3";
package orders.v1;
service OrderService {
  rpc GetOrder(GetOrderRequest) returns (GetOrderResponse);
  rpc ListOrders(ListOrdersRequest) returns (ListOrdersResponse);
  rpc StreamOrderUpdates(StreamOrderUpdatesRequest) returns (stream OrderUpdate);
}
message GetOrderRequest { string order_id = 1; }
message GetOrderResponse { Order order = 1; }
message Order {
  string id = 1; string user_id = 2; OrderStatus status = 3;
  repeated OrderItem items = 4; google.protobuf.Timestamp created_at = 5;
}
enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = 0; ORDER_STATUS_PENDING = 1;
  ORDER_STATUS_CONFIRMED = 2; ORDER_STATUS_SHIPPED = 3;
}
```
**Rules:** Always wrap in request/response messages. `UNSPECIFIED = 0` first enum. Package as `<service>.v1`. Use `google.protobuf.Timestamp`.

### Unary vs Streaming
**Default: Unary.** Server streaming for live feeds/large results. Client streaming for uploads/batching. Bidirectional for chat/collab. Only stream when you need it.

### Error Model
| gRPC Code | HTTP | Use |
|-----------|------|-----|
| `INVALID_ARGUMENT` | 400 | Bad input |
| `NOT_FOUND` | 404 | Missing resource |
| `ALREADY_EXISTS` | 409 | Duplicate |
| `PERMISSION_DENIED` | 403 | Forbidden |
| `UNAUTHENTICATED` | 401 | No/bad auth |
| `RESOURCE_EXHAUSTED` | 429 | Rate limited |
| `INTERNAL` | 500 | Server bug |
| `UNAVAILABLE` | 503 | Temporary, retry |

### Browser Clients
gRPC doesn't work natively in browsers. Use **gRPC-Web proxy** (Envoy) or **Connect protocol** (Buf). Or just use REST/GraphQL for frontend, gRPC internally.

## 4. Pagination
### Cursor vs Offset Decision
| Factor | Cursor-Based | Offset-Based |
|--------|-------------|--------------|
| Large dataset perf | O(1) seek | O(n) scan |
| Consistency under writes | Stable | Items shift |
| Random page access | No | Yes (`?page=5`) |
| **Default for APIs** | **Yes** | Admin UIs only |

### Cursor Implementation
```pseudo
# Cursor = base64(json({"id": last_id, "sort": sort_value}))
GET /orders?limit=20&cursor=eyJpZCI6NDIsInNvcnQiOiIyMDI0LTAxLTE1In0=
# Server:
decode cursor -> {id: 42, sort: "2024-01-15"}
SELECT * FROM orders WHERE (created_at, id) < ('2024-01-15', 42)
ORDER BY created_at DESC, id DESC LIMIT 21;  -- +1 to check hasNextPage
```
Always include primary key in cursor alongside sort key to handle ties.

### Page Size & Response
Enforce server-side max: `limit = min(request.limit || 20, 100)`
```json
{ "data": [...], "pagination": { "next_cursor": "...", "has_next_page": true, "page_size": 20 } }
```

## 5. Versioning
### Strategy
| Strategy | Pros | Cons | Use When |
|----------|------|------|----------|
| **URL path `/v1/`** | Obvious, easy routing/caching | URL pollution | **Default** |
| Header `Accept-Version` | Clean URLs | Hidden, hard to debug | Internal w/ sophisticated clients |
| Query param | Easy browser testing | Caching issues | Almost never |

### Breaking vs Non-Breaking
**Safe:** Add response field, add optional param, add endpoint, widen validation.
**Breaking (new version):** Remove/rename field, change type, change URL, tighten validation.

### Sunset Process
```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Mar 2025 00:00:00 GMT
Link: <https://api.example.com/v2/users>; rel="successor-version"
```
External APIs: 6+ months notice. Internal: 1-3 months. Never support more than 2 active versions.

### Multiple Versions
Route at controller layer, share service/domain logic. V1 and V2 controllers call same service, apply different serializers.

## 6. Rate Limiting
### Algorithms
| Algorithm | Behavior | Pros | Cons |
|-----------|----------|------|------|
| **Token Bucket** | Fills at steady rate, request takes token | Allows bursts | Slightly complex |
| Sliding Window | Rolling time window count | Accurate | Memory cost |
| Fixed Window | Count per interval | Simple | 2x spike at boundaries |

**Default: Token bucket.** Most gateways (Kong, Envoy) use it.

### Headers and 429 Response
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 742
X-RateLimit-Reset: 1710432000
# On 429:
Retry-After: 30       # ALWAYS include this
Content-Type: application/problem+json
{"type":"https://api.example.com/errors/rate-limited","title":"Rate limit exceeded","status":429}
```

### Scopes and Tiers
| Scope | Use Case |
|-------|----------|
| Per API key / user | Default, fairest |
| Per IP | Unauthenticated endpoints (login, signup) |
| Per endpoint | Protect expensive operations |
| Global | Infrastructure protection |

Tier limits in API key/user record. Enforce at gateway, not application code. Example: free=100/hr, pro=5000/hr, enterprise=50000/hr.

## 7. API Design Checklist
### Before Shipping Any Endpoint
- [ ] Resource names are plural nouns, lowercase, hyphen-separated
- [ ] Consistent field naming (`snake_case` or `camelCase` - pick one, stick with it)
- [ ] Dates in ISO 8601 UTC (`2024-01-15T09:30:00Z`)
- [ ] Errors follow RFC 7807 format with machine-readable `code` per field
- [ ] 5xx errors never expose internals (no stack traces, SQL, IPs)
- [ ] All list endpoints paginated with enforced max page size
- [ ] Filtering: `?status=shipped&created_after=2024-01-01`
- [ ] Sorting: `?sort=-created_at,+total` (prefix for direction)
- [ ] Field selection: `?fields=id,name,email`
- [ ] Bulk endpoints cap at 100 items, return per-item status (207)
- [ ] POST endpoints accept `Idempotency-Key` header (UUIDv4, stored 24h)
- [ ] Auth on all endpoints except health checks
- [ ] Authorization at resource level, not just endpoint level
- [ ] Rate limiting configured per scope
- [ ] Request body size limits enforced
- [ ] No secrets in URLs - use headers or body
- [ ] OpenAPI spec auto-generated from code
- [ ] Every endpoint has request/response examples documented

### RFC 7807 Error Format
```json
{"type":"https://api.example.com/errors/validation-error","title":"Validation Error",
 "status":422,"detail":"Email is invalid.","errors":[{"field":"email","code":"invalid_format"}]}
```

## Quick Decision Defaults
| Decision | Default |
|----------|---------|
| Frontend API style | REST (GraphQL if multiple clients with varied needs) |
| Service-to-service | gRPC |
| Pagination | Cursor-based |
| Versioning | URL path `/v1/` |
| Rate limiting | Token bucket |
| Error format | RFC 7807 |
| Field naming | `snake_case` for JSON |
| Timestamps | ISO 8601, always UTC |
| IDs | UUIDs (not auto-increment in public APIs) |
| Auth | Bearer token in `Authorization` header |
