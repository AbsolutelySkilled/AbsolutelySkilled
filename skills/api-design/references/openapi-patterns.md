<!-- Part of the api-design AbsolutelySkilled skill. Load this file when
     writing or reviewing OpenAPI specifications. -->

# OpenAPI 3.1 Patterns Reference

Reusable patterns for writing production-quality OpenAPI 3.1 specifications.
Load this reference when writing or reviewing any OpenAPI spec.

---

## Reusable Components

The `components` section is the heart of a maintainable spec. Define everything
once, reference it everywhere with `$ref`.

### Component types

```yaml
components:
  schemas:       # Data shapes (request bodies, response objects, enums)
  responses:     # Reusable HTTP response definitions
  parameters:    # Reusable path/query/header parameters
  requestBodies: # Reusable request body definitions
  headers:       # Reusable response headers
  securitySchemes: # Auth method definitions
  links:         # Hypermedia links between operations
  callbacks:     # Webhook/callback definitions
  pathItems:     # Reusable full path items (OpenAPI 3.1 only)
  examples:      # Named example values for parameters and schemas
```

---

## Schema Patterns

### Nullable fields (OpenAPI 3.1 style)

OpenAPI 3.1 aligns with JSON Schema. Use `type` as an array instead of the
deprecated `nullable: true` from 3.0.

```yaml
# OpenAPI 3.1 - correct
deletedAt:
  type: [string, "null"]
  format: date-time

# OpenAPI 3.0 - deprecated, avoid in new specs
deletedAt:
  type: string
  format: date-time
  nullable: true
```

### Read-only and write-only fields

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          readOnly: true   # present in responses, ignored in requests
        password:
          type: string
          writeOnly: true  # accepted in requests, never returned
        email:
          type: string
          format: email
```

### Enums with descriptions

```yaml
components:
  schemas:
    OrderStatus:
      type: string
      enum: [pending, processing, shipped, delivered, cancelled]
      description: |
        - pending: order placed, awaiting payment
        - processing: payment confirmed, preparing shipment
        - shipped: handed to carrier
        - delivered: confirmed delivery
        - cancelled: order voided
```

### Shared pagination envelope

```yaml
components:
  schemas:
    CursorPage:
      type: object
      required: [data, pagination]
      properties:
        pagination:
          type: object
          required: [hasMore]
          properties:
            nextCursor:
              type: [string, "null"]
              description: Opaque base64url cursor. Pass as ?cursor= to get the next page.
            hasMore:
              type: boolean

    # Inline per-resource via allOf
    ArticlePage:
      allOf:
        - $ref: '#/components/schemas/CursorPage'
        - type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/components/schemas/Article'
```

---

## Discriminators

Use discriminators when a field value determines the concrete schema type.
Useful for polymorphic request bodies (e.g. different payment methods).

```yaml
components:
  schemas:
    PaymentMethod:
      type: object
      required: [type]
      discriminator:
        propertyName: type
        mapping:
          card:   '#/components/schemas/CardPayment'
          bank:   '#/components/schemas/BankPayment'
          wallet: '#/components/schemas/WalletPayment'
      properties:
        type:
          type: string

    CardPayment:
      allOf:
        - $ref: '#/components/schemas/PaymentMethod'
        - type: object
          required: [cardToken, expiryMonth, expiryYear]
          properties:
            cardToken:
              type: string
            expiryMonth:
              type: integer
              minimum: 1
              maximum: 12
            expiryYear:
              type: integer

    BankPayment:
      allOf:
        - $ref: '#/components/schemas/PaymentMethod'
        - type: object
          required: [accountNumber, routingNumber]
          properties:
            accountNumber:
              type: string
            routingNumber:
              type: string

    WalletPayment:
      allOf:
        - $ref: '#/components/schemas/PaymentMethod'
        - type: object
          required: [walletId]
          properties:
            walletId:
              type: string
              format: uuid
```

---

## Security Schemes

Define all auth methods in `components/securitySchemes`, then apply globally
or per-operation.

```yaml
components:
  securitySchemes:

    # API Key - simplest, server-to-server
    apiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key

    # HTTP Bearer (JWT)
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

    # OAuth2 with scopes
    oauth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://auth.example.com/oauth/authorize
          tokenUrl: https://auth.example.com/oauth/token
          scopes:
            articles:read:  Read articles
            articles:write: Create and update articles
            admin:          Full administrative access

        clientCredentials:
          tokenUrl: https://auth.example.com/oauth/token
          scopes:
            service:read:  Read-only service account access
            service:write: Write service account access

    # OpenID Connect
    openIdConnect:
      type: openIdConnect
      openIdConnectUrl: https://auth.example.com/.well-known/openid-configuration
```

### Applying security globally vs per-operation

```yaml
# Global default - all operations require bearer auth
security:
  - bearerAuth: []

paths:
  /v1/articles:
    get:
      # Override: this endpoint is public (no auth)
      security: []

    post:
      # Override: requires a specific OAuth2 scope
      security:
        - oauth2: [articles:write]
```

---

## Webhooks

OpenAPI 3.1 adds first-class webhook support via the `webhooks` field.

```yaml
webhooks:
  orderShipped:
    post:
      summary: Triggered when an order ships
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [event, data]
              properties:
                event:
                  type: string
                  enum: [order.shipped]
                data:
                  $ref: '#/components/schemas/Order'
                timestamp:
                  type: string
                  format: date-time
      responses:
        '200':
          description: Webhook received successfully
        '410':
          description: Webhook endpoint no longer active - stop sending
```

---

## Reusable Parameters

```yaml
components:
  parameters:
    ResourceId:
      name: id
      in: path
      required: true
      schema:
        type: string
        format: uuid

    PageCursor:
      name: cursor
      in: query
      description: Opaque pagination cursor from a previous response
      schema:
        type: string

    PageLimit:
      name: limit
      in: query
      description: Number of items per page
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

    FilterCreatedAfter:
      name: createdAfter
      in: query
      description: Return only items created after this ISO 8601 timestamp
      schema:
        type: string
        format: date-time

    SortOrder:
      name: order
      in: query
      schema:
        type: string
        enum: [asc, desc]
        default: desc
```

---

## Reusable Responses

```yaml
components:
  responses:
    NoContent:
      description: Operation succeeded with no response body

    BadRequest:
      description: Invalid request parameters or malformed body
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'
          example:
            type: https://api.example.com/errors/bad-request
            title: Bad Request
            status: 400
            detail: The field "limit" must be between 1 and 100.

    Unauthorized:
      description: Missing or invalid authentication credentials
      headers:
        WWW-Authenticate:
          schema:
            type: string
            example: Bearer realm="api.example.com"
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    Forbidden:
      description: Authenticated but not authorized for this operation
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    NotFound:
      description: Resource does not exist
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    Conflict:
      description: Resource already exists or update would cause a conflict
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    UnprocessableEntity:
      description: Request is well-formed but fails business validation
      content:
        application/problem+json:
          schema:
            allOf:
              - $ref: '#/components/schemas/ProblemDetails'
              - type: object
                properties:
                  errors:
                    type: array
                    items:
                      type: object
                      required: [field, message]
                      properties:
                        field:
                          type: string
                        message:
                          type: string

    TooManyRequests:
      description: Rate limit exceeded
      headers:
        Retry-After:
          description: Seconds to wait before retrying
          schema:
            type: integer
        X-RateLimit-Limit:
          schema:
            type: integer
        X-RateLimit-Remaining:
          schema:
            type: integer
        X-RateLimit-Reset:
          description: Unix timestamp when the rate limit resets
          schema:
            type: integer
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'

    InternalServerError:
      description: Unexpected server error
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'
```

---

## RFC 7807 Problem Details Schema

Include this in every API spec that returns errors.

```yaml
components:
  schemas:
    ProblemDetails:
      type: object
      required: [type, title, status]
      properties:
        type:
          type: string
          format: uri
          description: >
            A URI reference that identifies the problem type.
            Dereferencing this URI should provide human-readable documentation.
          example: https://api.example.com/errors/validation-error
        title:
          type: string
          description: >
            A short, human-readable summary of the problem type.
            Stable across occurrences of the same problem type.
          example: Validation Error
        status:
          type: integer
          description: HTTP status code
          example: 422
        detail:
          type: string
          description: >
            Human-readable explanation specific to this occurrence of the problem.
          example: The field "email" must be a valid email address.
        instance:
          type: string
          format: uri
          description: >
            A URI reference identifying the specific occurrence (e.g. trace ID path).
          example: /requests/01HXYZ1234ABCD
      additionalProperties: true  # extension fields allowed per RFC 7807
```

---

## Links (Hypermedia)

Links describe relationships between operations, enabling HATEOAS-style
discoverability without embedding URLs in every response.

```yaml
paths:
  /v1/orders:
    post:
      operationId: createOrder
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
          links:
            GetOrder:
              operationId: getOrder
              parameters:
                id: $response.body#/id
              description: Use the returned order ID to fetch full details
            CancelOrder:
              operationId: cancelOrder
              parameters:
                id: $response.body#/id
```

---

## Spec Organization Tips

- Keep specs under 500 lines per file; use `$ref` to external files for large APIs
- Use `operationId` on every operation - tooling (SDKs, mocks) derives names from it
- Tag operations by resource (`tags: [Orders]`) for grouped documentation
- Add `x-` extension fields for tooling metadata without polluting the spec
- Validate specs with `redocly lint` or `spectral lint` in CI
- Generate server stubs and client SDKs from the spec with `openapi-generator`
