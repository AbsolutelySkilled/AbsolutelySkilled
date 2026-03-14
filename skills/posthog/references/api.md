<!-- Part of the PostHog AbsolutelySkilled skill. Load this file when
     working with the PostHog REST API directly. -->

# PostHog REST API Reference

## Authentication

Two authentication methods:

| Type | Key prefix | Used for | Rate limited |
|---|---|---|---|
| Project API key | `phc_` | Public endpoints (event capture, flag eval) | No |
| Personal API key | `phx_` | Private endpoints (CRUD, queries) | Yes |

**Public endpoints** accept the project API key in the request body:
```json
{ "api_key": "phc_your_key", "distinct_id": "user_123" }
```

**Private endpoints** use Bearer auth:
```
Authorization: Bearer phx_your_personal_api_key
```

---

## Base URLs

| Deployment | Public (capture/flags) | Private (API) |
|---|---|---|
| US Cloud | `https://us.i.posthog.com` | `https://us.posthog.com` |
| EU Cloud | `https://eu.i.posthog.com` | `https://eu.posthog.com` |
| Self-hosted | Your instance domain | Your instance domain |

---

## Rate limits (private endpoints)

| Endpoint type | Limit |
|---|---|
| Analytics endpoints | 240/minute, 1200/hour |
| Query endpoint | 2400/hour |
| Feature flag local evaluation | 600/minute |
| CRUD operations | 480/minute, 4800/hour |

Limits apply organization-wide across all users and API keys.

---

## Pagination

All list endpoints return paginated results:
```json
{
  "count": 150,
  "next": "https://us.posthog.com/api/projects/1/events/?limit=100&offset=100",
  "previous": null,
  "results": [...]
}
```
Default page size: 100 items. Follow `next` URL to get subsequent pages.

---

## Key public endpoints

### Capture events - POST `/i/v0/e`

```bash
curl -X POST "https://us.i.posthog.com/i/v0/e" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "phc_key",
    "event": "purchase",
    "distinct_id": "user_123",
    "properties": {
      "amount": 49.99,
      "$current_url": "https://example.com/checkout"
    },
    "timestamp": "2026-03-14T10:00:00Z"
  }'
```

### Batch capture - POST `/batch`

```bash
curl -X POST "https://us.i.posthog.com/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "phc_key",
    "batch": [
      {"event": "pageview", "distinct_id": "user_1", "timestamp": "2026-03-14T10:00:00Z"},
      {"event": "click", "distinct_id": "user_2", "timestamp": "2026-03-14T10:00:01Z"}
    ]
  }'
```

### Evaluate feature flags - POST `/decide?v=3`

```bash
curl -X POST "https://us.i.posthog.com/decide?v=3" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "phc_key",
    "distinct_id": "user_123",
    "person_properties": {"plan": "pro"}
  }'
```

Returns:
```json
{
  "featureFlags": {"new-checkout": true, "experiment": "variant-a"},
  "featureFlagPayloads": {"app-config": "{\"theme\":\"dark\"}"}
}
```

---

## Key private endpoints

All private endpoints follow the pattern:
```
https://us.posthog.com/api/projects/:project_id/<resource>/
```

### Events

```bash
# List events
GET /api/projects/:id/events/
GET /api/projects/:id/events/?event=purchase&person_id=user_123

# Get single event
GET /api/projects/:id/events/:event_id/
```

### Persons

```bash
# List persons
GET /api/projects/:id/persons/

# Search persons
GET /api/projects/:id/persons/?search=user@example.com

# Get person by distinct ID
GET /api/projects/:id/persons/?distinct_id=user_123

# Delete a person
DELETE /api/projects/:id/persons/:person_id/
```

### Feature flags

```bash
# List flags
GET /api/projects/:id/feature_flags/

# Create a flag
POST /api/projects/:id/feature_flags/
{
  "key": "new-checkout",
  "name": "New checkout flow",
  "active": true,
  "filters": {
    "groups": [{"properties": [], "rollout_percentage": 50}]
  }
}

# Update a flag
PATCH /api/projects/:id/feature_flags/:flag_id/

# Delete a flag
DELETE /api/projects/:id/feature_flags/:flag_id/
```

### Experiments

```bash
# List experiments
GET /api/projects/:id/experiments/

# Create an experiment
POST /api/projects/:id/experiments/
{
  "name": "Signup flow test",
  "feature_flag_key": "signup-experiment",
  "filters": {...}
}
```

### Dashboards

```bash
# List dashboards
GET /api/projects/:id/dashboards/

# Create a dashboard
POST /api/projects/:id/dashboards/
{ "name": "Product metrics", "description": "Key KPIs" }
```

### Insights (saved queries)

```bash
# List insights
GET /api/projects/:id/insights/

# Create a trend insight
POST /api/projects/:id/insights/
{
  "name": "Daily active users",
  "filters": {
    "insight": "TRENDS",
    "events": [{"id": "$pageview", "math": "dau"}],
    "date_from": "-30d"
  }
}
```

### Cohorts

```bash
# List cohorts
GET /api/projects/:id/cohorts/

# Create a cohort
POST /api/projects/:id/cohorts/
{
  "name": "Power users",
  "groups": [{"properties": [{"key": "plan", "value": "pro", "type": "person"}]}]
}
```

### Annotations

```bash
# Create an annotation (e.g. deployment marker)
POST /api/projects/:id/annotations/
{
  "content": "Deployed v2.0",
  "date_marker": "2026-03-14T00:00:00Z",
  "scope": "project"
}
```

---

## Response codes

| Code | Meaning |
|---|---|
| `200` | Success (for capture: payload received, not guaranteed ingested) |
| `400` | Bad request - invalid payload or project ID |
| `401` | Unauthorized - invalid API key |
| `404` | Resource not found |
| `429` | Rate limited - back off and retry |
| `503` | Database unavailable (self-hosted only) |

---

## Query API (HogQL)

PostHog supports HogQL for custom queries:

```bash
POST /api/projects/:id/query/
{
  "query": {
    "kind": "HogQLQuery",
    "query": "SELECT count() FROM events WHERE event = 'purchase' AND timestamp > now() - interval 7 day"
  }
}
```

HogQL is a SQL-like language that queries PostHog's ClickHouse backend. It supports
standard SQL functions plus PostHog-specific functions for working with properties.
