<!-- Part of the A2UI AbsolutelySkilled skill. Load this file when
     working with A2UI message formats and streaming. -->

# A2UI Message Reference

A2UI uses JSON Lines (JSONL) for streaming - each line is a complete JSON object
representing one operation. Messages flow from agent to client via any transport.

## v0.9 message types (current draft)

### createSurface

Creates a new UI surface. Must be sent before any component or data updates.

```json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "booking-form",
    "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json",
    "sendDataModel": true
  }
}
```

- `catalogId` is **required** in v0.9
- `sendDataModel: true` enables the client to attach its data model to outgoing messages

### updateComponents

Adds or updates components on an existing surface.

```json
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "booking-form",
    "components": [
      {"id": "title", "component": "Text", "text": "Reservation", "variant": "h1"},
      {"id": "name-input", "component": "TextField", "label": "Your Name", "value": {"path": "/guest/name"}},
      {"id": "row-1", "component": "Row", "children": ["title", "name-input"], "justify": "spaceBetween"}
    ]
  }
}
```

- Components are upserted by `id` - sending a component with an existing ID updates it
- Order within the array does not matter; parent-child relationships use ID references

### updateDataModel

Sets or updates data in the surface's data model.

```json
{
  "version": "v0.9",
  "updateDataModel": {
    "surfaceId": "booking-form",
    "path": "/guest",
    "value": {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

- `path` uses JSON Pointer (RFC 6901) notation
- Granular updates: send only the changed path, not the entire model
- Supports nested paths: `"/guest/preferences/dietary"`

### deleteSurface

Removes a surface and all its components and data.

```json
{
  "version": "v0.9",
  "deleteSurface": {
    "surfaceId": "booking-form"
  }
}
```

### error

Report errors back to the agent.

```json
{
  "version": "v0.9",
  "error": {
    "code": "VALIDATION_FAILED",
    "surfaceId": "booking-form",
    "path": "/components/FlightCard/flightNumber",
    "message": "Missing required property 'flightNumber'"
  }
}
```

---

## v0.8 message types (stable)

### surfaceUpdate

Creates or updates a surface with components. Serves as both create and update.

```json
{
  "surfaceUpdate": {
    "surfaceId": "main",
    "components": [
      {"id": "header", "component": {"Text": {"text": {"literalString": "Hello"}, "usageHint": "h1"}}}
    ]
  }
}
```

### dataModelUpdate

Sets data in the surface's data model using typed value fields.

```json
{
  "dataModelUpdate": {
    "surfaceId": "main",
    "contents": [
      {"key": "user", "valueMap": [
        {"key": "name", "valueString": "Jane"},
        {"key": "age", "valueInt": 30},
        {"key": "active", "valueBool": true}
      ]}
    ]
  }
}
```

Value types: `valueString`, `valueInt`, `valueFloat`, `valueBool`, `valueMap`, `valueList`.

### beginRendering

Signals the client to start rendering. **Required** in v0.8 before UI appears.

```json
{
  "beginRendering": {
    "surfaceId": "main",
    "root": "header"
  }
}
```

- `root` specifies the top-level component ID to start the render tree

### deleteSurface

Same as v0.9.

---

## Message ordering rules

1. Components must be defined before they are referenced as children
2. `createSurface` (v0.9) or `surfaceUpdate` (v0.8) must come before data/component updates
3. In v0.8, `beginRendering` must come after all initial components and data are sent
4. After initial render, component and data updates can arrive in any order
5. Different surfaces operate independently - no ordering constraints between them

## Client-to-server action payload (v0.9)

When a user interacts with an action-bearing component:

```json
{
  "version": "v0.9",
  "action": {
    "name": "submit_reservation",
    "surfaceId": "booking-form",
    "sourceComponentId": "submit-btn",
    "timestamp": "2026-02-25T10:40:00Z",
    "context": {
      "time": "7:00 PM",
      "size": 4
    }
  }
}
```

- `context` values are resolved from data binding paths defined in the component's action
- Client includes `a2uiClientCapabilities` with `supportedCatalogIds` in message metadata

## Transport options

| Transport | Status | Notes |
|-----------|--------|-------|
| A2A Protocol | Stable | Multi-agent systems, enterprise meshes |
| AG UI | Stable | Full-stack React apps, auto-translates A2UI messages |
| REST/SSE | Planned | Simple HTTP streaming |
| WebSocket | Proposed | Real-time bidirectional |
