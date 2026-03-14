<!-- Part of the A2UI AbsolutelySkilled skill. Load this file when
     working with custom catalogs, catalog negotiation, or client-to-server actions. -->

# Catalogs and Actions

## Catalog schema

A catalog is a JSON Schema file defining what components, functions, and themes
an agent can use. All A2UI JSON is validated against the chosen catalog.

```json
{
  "catalogId": "https://myapp.com/catalog/v1",
  "components": {
    "Text": {
      "type": "object",
      "properties": {
        "text": {"type": "string"},
        "variant": {"type": "string", "enum": ["h1", "h2", "h3", "h4", "h5", "body", "caption"]}
      },
      "required": ["text"]
    },
    "StockTicker": {
      "type": "object",
      "properties": {
        "symbol": {"type": "string"},
        "refreshInterval": {"type": "number", "default": 5000}
      },
      "required": ["symbol"]
    }
  },
  "functions": [
    {
      "name": "openUrl",
      "parameters": {
        "type": "object",
        "properties": {
          "url": {"type": "string", "format": "uri"}
        },
        "required": ["url"]
      }
    }
  ],
  "theme": {
    "primaryColor": {"type": "string"},
    "fontFamily": {"type": "string"}
  }
}
```

## Catalog negotiation (3-step handshake)

1. **Agent advertises**: Agent optionally lists supported catalogs (e.g., in A2A AgentCard)
2. **Client sends preferences**: Include `supportedCatalogIds` in message metadata (required)
3. **Agent selects**: Picks best matching catalog when creating a surface; locked for the surface lifetime

```json
// Client metadata in every outgoing message
{
  "a2uiClientCapabilities": {
    "supportedCatalogIds": [
      "https://a2ui.org/specification/v0_9/basic_catalog.json",
      "https://myapp.com/catalog/v1"
    ]
  }
}
```

## Building custom catalogs

Use the catalog build tool to assemble catalogs from multiple source files:

```bash
uv run tools/build_catalog/assemble_catalog.py \
  base_components.json \
  custom_components.json \
  --extend-basic-catalog \
  --output-name my-catalog \
  --catalog-id "https://myapp.com/catalog/v1" \
  --version "1.0.0" \
  --out-dir ./catalogs
```

Options:
- `--extend-basic-catalog`: Include all standard A2UI components
- `--output-name`: Output filename (without extension)
- `--catalog-id`: URI identifier for the catalog
- `--version`: Semantic version string

## Catalog versioning

- Any structural change (new component, new property, rename, removal) requires a new version
- Metadata-only changes (descriptions, typos) do not require versioning
- Include version in the catalogId URI: `https://myapp.com/catalog/v2`

## Two-phase validation

1. **Agent-side**: Validate generated JSON against catalog schema before sending
2. **Client-side**: Validate received messages on receipt

Error reporting:
```json
{
  "version": "v0.9",
  "error": {
    "code": "VALIDATION_FAILED",
    "surfaceId": "flight-card-123",
    "path": "/components/FlightCard/flightNumber",
    "message": "Missing required property 'flightNumber' in component 'FlightCard'."
  }
}
```

---

## Client-to-server actions

### Server events

Dispatch user actions to the agent for processing:

```json
{
  "id": "book-btn",
  "component": "Button",
  "child": "btn-label",
  "action": {
    "event": {
      "name": "submit_booking",
      "context": {
        "date": {"path": "/booking/date"},
        "guests": {"path": "/booking/guests"}
      }
    }
  }
}
```

The `context` object resolves data binding paths at click time and includes
resolved values in the action payload sent to the agent.

### Local function calls

Execute client-side functions without contacting the agent:

```json
{
  "action": {
    "functionCall": {
      "call": "openUrl",
      "args": {"url": "https://example.com/help"}
    }
  }
}
```

Functions must be defined in the catalog's `functions` array.

### Validation checks

Auto-disable buttons until conditions are met:

```json
{
  "id": "submit-btn",
  "component": "Button",
  "child": "btn-text",
  "action": {
    "event": {"name": "submit_form"}
  },
  "checks": [
    {
      "condition": {"call": "required", "args": {"value": {"path": "/email"}}},
      "message": "Email is required"
    },
    {
      "condition": {"call": "required", "args": {"value": {"path": "/name"}}},
      "message": "Name is required"
    }
  ]
}
```

### Data model sync

Enable with `sendDataModel: true` in `createSurface`. The client attaches its
entire data model as `a2uiClientDataModel` metadata to every outgoing message.
This enables stateless agents that don't need to track form state.

## Security considerations

- **Sandboxed execution**: No arbitrary code runs - only declarative JSON
- **Data model isolation**: Each surface has its own isolated data model
- **Orchestrator responsibility**: Strip `a2uiClientDataModel` metadata before forwarding to sub-agents to prevent cross-agent data leakage
- **Surface ownership**: Route actions to the agent that owns the surface via `surfaceId`
