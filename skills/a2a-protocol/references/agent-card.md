<!-- Part of the A2A Protocol AbsolutelySkilled skill. Load this file when
     working with agent cards, agent discovery, or security schemes. -->

# Agent Card Reference

## Agent card structure

The agent card is a JSON document declaring an agent's identity, capabilities,
and how to interact with it.

### Core fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Human-readable agent name |
| `description` | string | No | What the agent does |
| `supported_interfaces` | AgentInterface[] | Yes | Protocol binding endpoints |
| `provider` | object | No | Organization info (name, url) |
| `version` | string | No | Agent version |
| `documentation_url` | string | No | Link to agent docs |
| `capabilities` | AgentCapabilities | No | Feature flags |
| `security_schemes` | map | No | Available auth methods |
| `security_requirements` | SecurityRequirement[] | No | Required auth for access |
| `default_input_modes` | string[] | No | Accepted input media types |
| `default_output_modes` | string[] | No | Produced output media types |
| `skills` | AgentSkill[] | No | List of agent abilities |

### AgentInterface

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Service endpoint URL |
| `protocol_binding` | string | Yes | One of: `jsonrpc`, `grpc`, `http+json` |
| `tenant` | string | No | Multi-tenant path parameter |
| `protocol_version` | string | No | A2A version (e.g. "1.0") |

### AgentCapabilities

| Field | Type | Description |
|---|---|---|
| `streaming` | bool | Supports SSE streaming |
| `push_notifications` | bool | Supports webhook callbacks |
| `extended_agent_card` | bool | Offers authenticated extended card |
| `extensions` | Extension[] | Supported protocol extensions |

### AgentSkill

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique skill identifier |
| `name` | string | Yes | Human-readable name |
| `description` | string | No | What the skill does |
| `tags` | string[] | No | Categorization tags |
| `examples` | string[] | No | Example prompts |
| `input_modes` | string[] | No | Override default input modes |
| `output_modes` | string[] | No | Override default output modes |
| `security_requirements` | SecurityRequirement[] | No | Skill-specific auth |

## Example agent card

```json
{
  "name": "Travel Planner Agent",
  "description": "Books flights, hotels, and creates travel itineraries",
  "supported_interfaces": [
    {
      "url": "https://travel-agent.example.com/a2a",
      "protocol_binding": "jsonrpc",
      "protocol_version": "1.0"
    }
  ],
  "provider": {
    "organization": "TravelCo",
    "url": "https://travelco.example.com"
  },
  "version": "2.1.0",
  "capabilities": {
    "streaming": true,
    "push_notifications": true,
    "extended_agent_card": false
  },
  "security_schemes": {
    "bearer": {
      "type": "http",
      "scheme": "bearer"
    }
  },
  "security_requirements": [
    { "bearer": [] }
  ],
  "default_input_modes": ["text/plain"],
  "default_output_modes": ["text/plain", "application/json"],
  "skills": [
    {
      "id": "flight-search",
      "name": "Flight Search",
      "description": "Search and book flights between any two airports",
      "tags": ["travel", "flights", "booking"],
      "examples": ["Find flights from SFO to JFK on March 20"]
    },
    {
      "id": "hotel-booking",
      "name": "Hotel Booking",
      "description": "Search and reserve hotel rooms",
      "tags": ["travel", "hotels"],
      "examples": ["Book a hotel near Times Square for 3 nights"]
    }
  ]
}
```

## Discovery strategies

### 1. Well-known URI (recommended for public agents)

Host agent card at `https://{domain}/.well-known/agent-card.json` per RFC 8615.

### 2. Curated registries (enterprise)

Central service maintains agent card collections. Clients query by skills, tags,
or capabilities. Provides centralized governance and capability-based discovery.

### 3. Direct configuration (dev/testing)

Hardcoded details, config files, or environment variables. Simple but inflexible.

## Extended agent cards

When `capabilities.extended_agent_card` is true, the server offers a
`GetExtendedAgentCard` operation that returns additional capabilities visible
only to authenticated clients. This allows agents to expose sensitive skills
or detailed configurations after credential exchange.

## Security schemes

| Type | Description |
|---|---|
| `apiKey` | API key in header, query param, or cookie |
| `http` | HTTP Basic or Bearer token |
| `oauth2` | OAuth 2.0 flows (authorizationCode, clientCredentials, deviceCode) |
| `openIdConnect` | OpenID Connect discovery |
| `mutualTLS` | Mutual TLS client certificates |

## Caching

- Servers should include `Cache-Control` headers with appropriate `max-age`
- Servers should include `ETag` headers for conditional requests
- Clients should honor HTTP caching semantics
- Use conditional requests (`If-None-Match`) rather than unconditional re-fetching
