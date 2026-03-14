<!-- Part of the Mastra AbsolutelySkilled skill. Load this file when
     working with server configuration, middleware, authentication, CLI
     commands, deployment targets, evals/scorers, or observability. -->

# Deployment, Server, Evals, and Observability

## CLI reference

| Command | Description |
|---|---|
| `mastra dev` | Dev server + Studio at localhost:4111 |
| `mastra dev --https` | Dev with local HTTPS (auto-generates cert) |
| `mastra dev --inspect` | Dev with Node.js debugger |
| `mastra build` | Bundle to `.mastra/output/` |
| `mastra build --studio` | Include Studio UI in build |
| `mastra start` | Serve production build (OTEL tracing enabled) |
| `mastra start --dir <path>` | Custom build output directory |
| `mastra init` | Initialize Mastra in existing project |
| `mastra lint` | Validate project structure |
| `mastra migrate` | Run DB migrations |
| `mastra studio` | Standalone Studio server on port 3000 |
| `mastra scorers add <name>` | Add a scorer template |
| `mastra scorers list` | List available scorer templates |

### Common flags

- `--dir` - Mastra folder path (default: `src/mastra`)
- `--debug` - Verbose logging
- `--env` - Custom environment file path
- `--root` - Root folder path
- `--tools` - Tool paths (default: `src/mastra/tools`)

---

## Server configuration

The full `server` key inside `new Mastra({})`:

```typescript
export const mastra = new Mastra({
  server: {
    port: 4111,
    host: 'localhost',
    timeout: 180000,          // ms
    bodySizeLimit: 4718592,   // bytes (~4.5MB)
    cors: { origin: '*' },    // or false to disable
    https: { key: Buffer, cert: Buffer },
    studioBase: '/',

    // Auth
    auth: jwtAuthProvider | clerkProvider | supabaseProvider,

    // Middleware (Hono-compatible)
    middleware: [
      {
        path: '/api/*',
        handler: async (c, next) => {
          // return Response to halt, call next() to continue
          await next()
        },
      },
    ],

    // Custom routes
    apiRoutes: [
      {
        path: '/api/custom',
        method: 'GET',
        handler: async (c) => c.json({ ok: true }),
      },
    ],

    // Error handlers
    onError: (err, c) => c.json({ error: err.message }, 500),
    onValidationError: (error, context) => ({
      status: 400,
      body: { errors: error.issues },
    }),

    // Build options
    build: {
      swaggerUI: false,
      apiReqLogs: false,
      openAPIDocs: false,
    },
  },
})
```

### Built-in endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /api/openapi.json` | OpenAPI spec |
| `GET /swagger-ui` | Interactive API docs (requires `build.swaggerUI: true`) |

### Auth providers

JWT, Clerk, Supabase, Firebase, Auth0, WorkOS.

JWT requires `MASTRA_JWT_SECRET` env var.

### Security

Stream data redaction is enabled by default - strips system prompts, tool
definitions, and API keys from streamed responses.

---

## Deployment targets

| Target | Notes |
|---|---|
| Mastra Server | `mastra build && mastra start` - standalone Hono server |
| Vercel | Deploy via Vercel CLI or git integration |
| Netlify | Standard Netlify deployment |
| Cloudflare Workers | Edge runtime support |
| AWS EC2 | Standard Node.js deployment |
| AWS Lambda | Serverless functions |
| Azure App Services | Azure deployment |
| DigitalOcean | App Platform or Droplets |
| Monorepo | Deploy alongside other services |
| Mastra Cloud | Managed hosting (beta) |
| Next.js / Astro | Embed in web framework |
| Inngest | Workflow runner with step memoization, retries, monitoring |

### Runtime requirements

- Node.js v22.13.0+
- Bun, Deno, and Cloudflare Workers also supported

---

## Evals and scorers

### Package

```bash
npm install @mastra/evals@latest
```

### Built-in scorers

```typescript
import {
  createAnswerRelevancyScorer,
  createToxicityScorer,
} from '@mastra/evals/scorers/prebuilt'
```

Categories: Textual, Classification, Prompt Engineering.

### Agent-level scorers

```typescript
const agent = new Agent({
  id: 'eval-agent',
  model: 'openai/gpt-4.1',
  scorers: {
    relevancy: {
      scorer: createAnswerRelevancyScorer({ model: 'openai/gpt-4.1-nano' }),
      sampling: { type: 'ratio', rate: 0.5 },
    },
    safety: {
      scorer: createToxicityScorer({ model: 'openai/gpt-4.1-nano' }),
      sampling: { type: 'ratio', rate: 1 },
    },
  },
})
```

### Mastra-level scorers (trace evaluation)

```typescript
const mastra = new Mastra({
  scorers: {
    answerRelevancy: myScorer,
    responseQuality: myOtherScorer,
  },
})
```

### Behavior

- Execution is asynchronous - does not block agent responses
- `sampling.rate`: 0 to 1 (1.0 = every response, 0.5 = 50%)
- Results auto-persist to `mastra_scorers` database table
- Results visible in Studio UI

---

## Observability

### Packages

```bash
npm install @mastra/observability
npm install @mastra/loggers     # includes PinoLogger
```

### Configuration

```typescript
import { PinoLogger } from '@mastra/loggers'
import {
  Observability,
  DefaultExporter,
  CloudExporter,
  SensitiveDataFilter,
} from '@mastra/observability'

export const mastra = new Mastra({
  logger: new PinoLogger(),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'my-app',
        exporters: [
          new DefaultExporter(),        // persists to storage
          new CloudExporter(),          // sends to Mastra Cloud
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(),    // redacts passwords, tokens, keys
        ],
      },
    },
  }),
})
```

### What is traced

- Model calls (tokens, latency, prompts, completions)
- Agent execution paths, tool calls, memory operations
- Workflow steps, branching, parallel execution

### External integrations

MLflow, Langfuse, Braintrust, and any OpenTelemetry-compatible platform
(Datadog, New Relic, SigNoz).

### Required env vars

- `MASTRA_CLOUD_ACCESS_TOKEN` - for CloudExporter

---

## Environment variables reference

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | OpenAI models and voice |
| `ANTHROPIC_API_KEY` | Anthropic models |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google/Gemini models |
| `OPENROUTER_API_KEY` | OpenRouter models |
| `POSTGRES_CONNECTION_STRING` | PostgreSQL / pgvector |
| `MASTRA_CLOUD_ACCESS_TOKEN` | Mastra Cloud / CloudExporter |
| `MASTRA_JWT_SECRET` | JWT authentication |
| `PORT` | Override server port (default 4111) |
| `MASTRA_SKIP_DOTENV` | Skip .env loading |
| `MASTRA_DEV_NO_CACHE=1` | Force full rebuild |
| `MASTRA_CONCURRENCY=N` | Limit parallel operations |
| `MASTRA_TELEMETRY_DISABLED=1` | Opt out of analytics |
| `MASTRA_SKIP_PEERDEP_CHECK=1` | Skip peer dep checks |

---

## TypeScript requirements

```json
{
  "compilerOptions": {
    "module": "ES2022",
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

CommonJS and legacy `node` module resolution are NOT supported.
