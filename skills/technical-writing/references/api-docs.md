<!-- Part of the technical-writing AbsolutelySkilled skill. Load this file when
     working with API documentation (REST, GraphQL, gRPC). -->

# API Documentation

## Principles

API docs are reference material. They must be exhaustive, accurate, and scannable.
Every endpoint, parameter, response shape, and error code must be documented. The
reader is a developer integrating with your API - they need facts, not narratives.

## REST API documentation structure

For each endpoint, document in this order:

### 1. Method and path

```
POST /api/v1/resources
```

Use the full path including version prefix. Group endpoints by resource.

### 2. One-line description

A single sentence describing what the endpoint does. Use imperative mood:
"Create a new user" not "Creates a new user" or "This endpoint creates a user."

### 3. Authentication

State the auth requirement explicitly:
- "Bearer token (required)"
- "API key via X-Api-Key header (required)"
- "No authentication required"

### 4. Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id        | string (UUID) | The resource identifier |

### 5. Query parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page      | integer | 1 | Page number for pagination |
| limit     | integer | 20 | Items per page (max 100) |

### 6. Request body

Show the JSON schema as a table, then provide a complete example:

```json
{
  "email": "ada@example.com",
  "name": "Ada Lovelace",
  "role": "member"
}
```

### 7. Response

Show status code, headers (if relevant), and a complete body example with realistic
data. Never use placeholder values like "string" or "0".

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "usr_abc123",
  "email": "ada@example.com",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### 8. Error responses

Document every error the endpoint can return:

| Status | Error code | Description | Resolution |
|--------|-----------|-------------|------------|
| 400 | invalid_email | Email format invalid | Check email format |
| 409 | email_exists | Email already registered | Use a different email |
| 429 | rate_limited | Too many requests | Retry after Retry-After header value |

## OpenAPI / Swagger integration

When the project uses OpenAPI specs, generate docs from the spec rather than
maintaining separate documentation. Tools:

- **Redoc** - Clean, three-panel layout from OpenAPI 3.x specs
- **Swagger UI** - Interactive "try it" panels
- **Stoplight** - Visual editor + hosted docs

Keep the OpenAPI spec as the single source of truth. Add `x-codeSamples` extensions
for language-specific examples.

## GraphQL documentation

For GraphQL APIs, document:

1. **Schema overview** - Types, queries, mutations, subscriptions
2. **Type definitions** - Each type with field descriptions
3. **Query examples** - Complete queries with variables and responses
4. **Error conventions** - How errors are returned in the `errors` array
5. **Rate limiting** - Query complexity limits, depth limits

Use tools like GraphQL Voyager for visual schema exploration and GraphiQL for
interactive documentation.

## Common mistakes in API docs

- **Missing error codes** - Document every error, not just the happy path
- **Outdated examples** - Automate example generation from tests when possible
- **No pagination docs** - Always document how pagination works (cursor vs offset)
- **Inconsistent naming** - Use the same field names in docs as in the actual API
- **Missing rate limit info** - Always document rate limits and how to handle 429s

## Versioning documentation

When the API is versioned, document:
- Which version is current
- Which versions are deprecated (with sunset dates)
- Migration guides between versions
- Changelog of breaking changes per version
