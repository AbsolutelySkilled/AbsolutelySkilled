<!-- Part of the no-code-automation AbsolutelySkilled skill. Load this file when
     working with n8n workflow patterns and self-hosting. -->

# n8n Patterns

Advanced patterns for building n8n workflows, including custom code nodes,
credential management, self-hosting considerations, and community nodes.

---

## Workflow architecture

n8n workflows are directed graphs of nodes. Each node receives data from its
input connections, processes it, and passes output to connected nodes.

**Data model:**
- Data flows as arrays of JSON objects (called "items")
- Each item has a `json` property containing the actual data
- Binary data (files, images) is stored in a separate `binary` property
- Nodes can output to multiple connections (branching)
- Nodes can receive from multiple inputs (merging)

---

## Expression syntax

n8n uses a custom expression syntax for referencing data:

```javascript
// Current node's input data
{{ $json.fieldName }}
{{ $json["field with spaces"] }}

// Nested objects
{{ $json.address.city }}

// Access data from a specific previous node
{{ $node["Node Name"].json.fieldName }}

// Access data from the trigger node
{{ $('Webhook').item.json.body }}

// Access workflow variables
{{ $vars.apiKey }}

// Access environment variables
{{ $env.DATABASE_URL }}

// Built-in functions
{{ $now.toISO() }}
{{ $today.format('yyyy-MM-dd') }}
{{ $json.email.toLowerCase() }}
```

> In n8n v1.0+, use the new expression syntax with `$()` for node references.
> The older `$node[""]` syntax still works but is deprecated.

---

## Code node patterns

The Code node lets you write custom JavaScript (or Python in newer versions)
for complex transformations.

### Transform items

```javascript
// Code node - Run Once for All Items
const results = [];

for (const item of $input.all()) {
  const name = item.json.fullName.split(' ');
  results.push({
    json: {
      firstName: name[0],
      lastName: name.slice(1).join(' '),
      email: item.json.email.toLowerCase(),
      createdAt: new Date().toISOString()
    }
  });
}

return results;
```

### Filter and enrich

```javascript
// Code node - Run Once for All Items
const items = $input.all();

return items
  .filter(item => item.json.amount > 100)
  .map(item => ({
    json: {
      ...item.json,
      tier: item.json.amount > 1000 ? 'enterprise' : 'standard',
      formattedAmount: `$${item.json.amount.toFixed(2)}`
    }
  }));
```

### Make HTTP requests in Code node

```javascript
// Code node - Run Once for All Items
const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://api.example.com/enrich',
  body: {
    emails: $input.all().map(item => item.json.email)
  },
  headers: {
    'Authorization': `Bearer ${$env.API_KEY}`
  }
});

return response.results.map(r => ({ json: r }));
```

---

## Error handling

### Error Trigger workflow

Create a separate workflow with an "Error Trigger" node that fires whenever
any workflow fails:

```
Error Trigger -> Set (extract error details) -> Slack (send alert)
```

The Error Trigger receives:
- `execution.id` - the failed execution ID
- `workflow.id` and `workflow.name` - which workflow failed
- `error.message` - the error description
- `error.node` - which node failed

### Try/Catch pattern

n8n doesn't have native try/catch, but you can simulate it:

1. Set "Continue On Fail" on the risky node (in node settings)
2. Add an If node after it that checks `{{ $json.error }}` exists
3. Route errors to a logging/notification path

```
HTTP Request (Continue On Fail: true)
  -> If: {{ $json.error }} is not empty
    True  -> Log error to Sheet + Slack notification
    False -> Continue normal processing
```

### Retry on failure

Configure retry behavior in node settings:
- **Retry On Fail**: enable retries for transient errors
- **Max Tries**: number of retry attempts (default: 3)
- **Wait Between Tries**: milliseconds between retries

---

## Self-hosting

n8n can be self-hosted for full data control and no per-execution costs.

### Docker deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=n8n.yourdomain.com
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.yourdomain.com/
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${DB_PASSWORD}
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168  # hours
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  postgres_data:
```

### Key self-hosting considerations

- **Database**: Use PostgreSQL for production. SQLite (default) is fine for
  testing but doesn't handle concurrent executions well.
- **Execution data**: Enable pruning (`EXECUTIONS_DATA_PRUNE=true`) to prevent
  the database from growing indefinitely. Keep 7 days (168 hours) of history.
- **Webhook URL**: Must be set to the public URL so webhook triggers work.
  Without this, webhooks will use localhost and fail.
- **Scaling**: n8n runs single-threaded by default. For high throughput, use
  n8n's queue mode with Redis and multiple worker instances.
- **Backups**: Export workflows as JSON regularly. Also back up the PostgreSQL
  database for credentials and execution history.

---

## Credential management

n8n stores credentials encrypted in the database.

**Best practices:**
- Use environment variables for sensitive values: `{{ $env.API_KEY }}`
- In self-hosted setups, mount credentials via Docker secrets or environment files
- Never hardcode credentials in Code nodes
- Use n8n's built-in credential types when available (they handle token refresh)

**Custom credentials for internal APIs:**
1. Go to Credentials > Add Credential > Header Auth
2. Set the header name (e.g., `Authorization`) and value
3. Reference this credential in HTTP Request nodes

---

## Community nodes

n8n has a community node ecosystem for apps without official support:

**Installing community nodes:**
1. Go to Settings > Community Nodes
2. Enter the npm package name (e.g., `n8n-nodes-notion-enhanced`)
3. Click Install
4. The node appears in the node palette

**Cautions:**
- Community nodes are not vetted by n8n - review the source code first
- They may break on n8n version upgrades
- For production workflows, prefer official nodes or HTTP Request nodes
- Pin the community node version to prevent unexpected updates

---

## Workflow organization

**Naming convention:** `[Category] [Source] to [Target] - [Purpose]`
- Example: `[Sales] Webhook to CRM - Lead capture`
- Example: `[Ops] Cron DB cleanup - Daily`

**Tags:**
- Use tags to categorize: `production`, `staging`, `deprecated`, `experimental`
- Tag by team: `engineering`, `sales`, `marketing`, `ops`

**Sub-workflows:**
- Use the "Execute Workflow" node to call other workflows
- This enables reuse: build a "Send Slack Alert" workflow once, call it from many
- Pass data via the workflow input and return via the workflow output node

**Version control:**
- Export workflows as JSON and commit to git
- Use n8n's API to automate exports: `GET /api/v1/workflows`
- For teams, use the n8n CLI: `n8n export:workflow --all --output=./workflows/`
