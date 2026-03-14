<!-- Part of the Edge Computing AbsolutelySkilled skill. Load this file when
     working with Cloudflare Workers, wrangler CLI, or Workers bindings. -->

# Cloudflare Workers Reference

## Runtime environment

Workers run on V8 isolates with Web Platform APIs. Key differences from Node.js:

- **No `require()` or CommonJS** - use ES modules (`import`/`export`)
- **No `process`, `Buffer` global, `fs`, `path`** - use `TextEncoder`, `crypto.subtle`, Web Streams
- **CPU time limit**: 10ms (free), 50ms (paid), measured as actual CPU, not wall-clock
- **Memory limit**: 128MB per isolate
- **Max request body**: 100MB (free plan restricted further)
- **Subrequest limit**: 50 fetch calls per request (1000 on paid)

## Module format

```typescript
// The standard Workers module format (recommended)
export interface Env {
  MY_KV: KVNamespace;
  MY_R2: R2Bucket;
  MY_DB: D1Database;
  MY_DO: DurableObjectNamespace;
  MY_SECRET: string; // from wrangler secret
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // handle request
    return new Response('Hello');
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // cron trigger handler
    ctx.waitUntil(doWork(env));
  },

  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {
    // queue consumer handler
    for (const msg of batch.messages) {
      console.log(msg.body);
      msg.ack();
    }
  },
};
```

## Wrangler CLI

```bash
# Create new project
npx wrangler init my-worker

# Dev server with live reload
npx wrangler dev

# Deploy to production
npx wrangler deploy

# Tail production logs
npx wrangler tail

# Manage secrets
npx wrangler secret put MY_API_KEY
npx wrangler secret list

# KV namespace management
npx wrangler kv:namespace create MY_KV
npx wrangler kv:key put --namespace-id=<id> "key" "value"
npx wrangler kv:key get --namespace-id=<id> "key"

# D1 database
npx wrangler d1 create my-database
npx wrangler d1 execute my-database --command "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)"
```

## wrangler.toml configuration

```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# KV binding
[[kv_namespaces]]
binding = "MY_KV"
id = "abc123"
preview_id = "def456"

# R2 bucket
[[r2_buckets]]
binding = "MY_R2"
bucket_name = "my-bucket"

# D1 database
[[d1_databases]]
binding = "MY_DB"
database_name = "my-database"
database_id = "xyz789"

# Durable Object
[durable_objects]
bindings = [
  { name = "MY_DO", class_name = "MyDurableObject" }
]

[[migrations]]
tag = "v1"
new_classes = ["MyDurableObject"]

# Cron triggers
[triggers]
crons = ["*/5 * * * *"]  # every 5 minutes

# Environment-specific overrides
[env.staging]
name = "my-worker-staging"
routes = [{ pattern = "staging.example.com/*", zone_name = "example.com" }]

[env.production]
name = "my-worker-production"
routes = [{ pattern = "example.com/*", zone_name = "example.com" }]
```

## KV Namespace API

```typescript
// Write
await env.MY_KV.put('key', 'value');
await env.MY_KV.put('key', JSON.stringify(data), {
  expirationTtl: 3600,     // seconds until auto-delete
  metadata: { version: 1 }, // small metadata object (max 1024 bytes)
});

// Read
const value = await env.MY_KV.get('key');                    // string | null
const data = await env.MY_KV.get('key', 'json');             // parsed JSON
const binary = await env.MY_KV.get('key', 'arrayBuffer');    // ArrayBuffer
const withMeta = await env.MY_KV.getWithMetadata('key', 'json');
// { value: T | null, metadata: M | null }

// Delete
await env.MY_KV.delete('key');

// List keys (paginated, max 1000 per call)
const list = await env.MY_KV.list({ prefix: 'user:', limit: 100 });
// { keys: Array<{ name: string, expiration?: number, metadata?: unknown }>, list_complete: boolean, cursor?: string }
```

## Durable Objects

```typescript
export class RateLimiter {
  private state: DurableObjectState;
  private requests: number[] = [];

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    // Load persisted state on construction
    this.state.blockConcurrencyWhile(async () => {
      this.requests = (await this.state.storage.get<number[]>('requests')) ?? [];
    });
  }

  async fetch(request: Request): Promise<Response> {
    const now = Date.now();
    const windowMs = 60_000;
    const maxRequests = 100;

    // Prune old entries
    this.requests = this.requests.filter((t) => now - t < windowMs);

    if (this.requests.length >= maxRequests) {
      return new Response('Rate limited', { status: 429 });
    }

    this.requests.push(now);
    await this.state.storage.put('requests', this.requests);

    return new Response('OK', { status: 200 });
  }
}
```

Key Durable Object properties:
- **Single-threaded** - only one instance of a named DO exists globally
- **Strong consistency** - reads and writes within a DO are serialized
- **Location-aware** - the DO runs near its first requester, then stays put
- **Storage API** - `state.storage.get/put/delete/list` with transactional semantics
- **Hibernation** - idle DOs are evicted from memory but state persists

## D1 (SQLite at the edge)

```typescript
// Query
const result = await env.MY_DB.prepare('SELECT * FROM users WHERE id = ?')
  .bind(userId)
  .first<User>();

// Batch queries (single round-trip)
const results = await env.MY_DB.batch([
  env.MY_DB.prepare('INSERT INTO users (name) VALUES (?)').bind('Alice'),
  env.MY_DB.prepare('INSERT INTO users (name) VALUES (?)').bind('Bob'),
]);

// Raw query for dynamic SQL
const { results: rows } = await env.MY_DB.prepare(
  'SELECT * FROM users WHERE name LIKE ? LIMIT ?'
).bind('%search%', 10).all<User>();
```

## Cache API

```typescript
// Use the Workers Cache API for fine-grained cache control
const cache = caches.default;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cacheKey = new Request(request.url, request);

    // Check cache first
    let response = await cache.match(cacheKey);
    if (response) return response;

    // Fetch from origin
    response = await fetch(request);

    // Clone and cache (response body can only be read once)
    const responseToCache = new Response(response.body, response);
    responseToCache.headers.set('Cache-Control', 'public, max-age=3600');

    // waitUntil so caching doesn't block response
    ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));

    return responseToCache;
  },
};
```

## Other edge platforms comparison

| Feature | Cloudflare Workers | Vercel Edge Functions | Deno Deploy | Lambda@Edge |
|---|---|---|---|---|
| Runtime | V8 isolate | V8 isolate (Node subset) | Deno (V8) | Node.js container |
| Cold start | <5ms | <5ms | <10ms | 50-500ms |
| CPU limit | 10-50ms | 25ms (Hobby) | 50ms | 5-30s |
| KV store | Workers KV | Vercel KV (Redis) | Deno KV | DynamoDB |
| Deploy | wrangler deploy | git push | deployctl | SAM/CDK |
| Locations | 300+ PoPs | ~20 regions | 35+ regions | CloudFront PoPs |
