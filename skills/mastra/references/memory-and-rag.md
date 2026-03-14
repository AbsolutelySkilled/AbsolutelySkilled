<!-- Part of the Mastra AbsolutelySkilled skill. Load this file when
     working with memory configuration, working memory, semantic recall,
     RAG pipelines, chunking, embeddings, or vector stores. -->

# Memory and RAG

## Memory types

| Type | Purpose | Persistence |
|---|---|---|
| Message history | Recent N messages in context window | Per thread |
| Working memory | Structured user profile (Markdown or JSON schema) | Per resource or thread |
| Observational | Background Observer/Reflector agents summarizing conversations | Per thread |
| Semantic recall | RAG over past messages via vector similarity search | Cross-thread (resource scope) or per-thread |

---

## Full Memory configuration

```typescript
import { Memory } from '@mastra/memory'
import { LibSQLStore, LibSQLVector } from '@mastra/libsql'
import { ModelRouterEmbeddingModel } from '@mastra/core/llm'

const memory = new Memory({
  storage: new LibSQLStore({ id: 'storage', url: 'file:./local.db' }),
  vector: new LibSQLVector({ id: 'vector', url: 'file:./local.db' }),
  embedder: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 5,
      messageRange: 2,
      scope: 'resource',  // 'resource' = cross-thread, or thread-specific
    },
    workingMemory: {
      enabled: true,
      scope: 'resource',  // 'resource' (default) or 'thread'
      template: `# User Profile\n- **Name**:\n- **Location**:\n- **Preferences**:`,
    },
  },
})
```

### Attach memory to agent

```typescript
const agent = new Agent({
  id: 'memory-agent',
  model: 'openai/gpt-4.1',
  instructions: 'You remember user preferences across conversations.',
  memory,
})
```

### Call agent with thread context

```typescript
await agent.generate('My name is Alice and I prefer dark mode', {
  memory: {
    thread: { id: 'thread-abc', title: 'Onboarding' },
    resource: 'user-456',
    options: { readOnly: false },
  },
})
```

> Forgetting the `resource` parameter when using resource-scoped memory will
> break cross-thread recall silently.

---

## Working memory - schema-based

For structured data, use a Zod schema instead of a Markdown template.
Schema and template are mutually exclusive.

```typescript
const memory = new Memory({
  options: {
    workingMemory: {
      enabled: true,
      schema: z.object({
        name: z.string().optional(),
        timezone: z.string().optional(),
        preferences: z.object({
          theme: z.string().optional(),
          language: z.string().optional(),
        }).optional(),
      }),
    },
  },
})
```

> Schema arrays replace entirely on update (no element-level merge).
> Set a field to `null` to delete it.

---

## Thread management

```typescript
// Create thread with initial working memory
const thread = await memory.createThread({
  threadId: 'thread-123',
  resourceId: 'user-456',
  title: 'Support Chat',
  metadata: { workingMemory: '# User\n- Name: Alice' },
})

// Update working memory directly
await memory.updateWorkingMemory({
  threadId: 'thread-123',
  resourceId: 'user-456',
  workingMemory: '# User\n- Name: Alice\n- Plan: Enterprise',
})
```

---

## Semantic recall query

```typescript
const mem = await agent.getMemory()
const { messages } = await mem.recall({
  threadId: 'thread-123',
  vectorSearchString: 'What did we discuss about the deadline?',
  threadConfig: { semanticRecall: true },
  perPage: 50,
})
```

---

## Storage backends

| Package | Backend | Notes |
|---|---|---|
| `@mastra/libsql` | LibSQL / Turso | Good for dev, file-based option |
| `@mastra/pg` | PostgreSQL | Production recommended |
| `@mastra/upstash` | Upstash Redis | Serverless-friendly |
| `@mastra/mongodb` | MongoDB | Document store |

> File-based storage (`file:./mastra.db`) is incompatible with serverless.
> Use PostgreSQL or ClickHouse for production high-traffic workloads.

---

## Vector stores

Supported for both memory semantic recall and RAG:

Astra, Chroma, Cloudflare Vectorize, Convex, Couchbase, DuckDB, Elasticsearch,
LanceDB, LibSQL, MongoDB, OpenSearch, Pinecone, PostgreSQL (pgvector), Qdrant,
S3 Vectors, Turbopuffer, Upstash.

### PostgreSQL HNSW index optimization

```typescript
import { PgVector } from '@mastra/pg'

const memory = new Memory({
  vector: new PgVector({ id: 'vec', connectionString: process.env.DATABASE_URL }),
  options: {
    semanticRecall: {
      topK: 5,
      messageRange: 2,
      indexConfig: {
        type: 'hnsw',
        metric: 'dotproduct',  // recommended for OpenAI embeddings
        m: 16,
        efConstruction: 64,
      },
    },
  },
})
```

---

## RAG pipeline

Process documents into searchable embeddings.

### 1. Chunk documents

```typescript
import { MDocument } from '@mastra/core/document'

const doc = MDocument.fromText(longText)
const chunks = await doc.chunk({
  strategy: 'recursive',  // or 'sliding window'
  size: 512,
  overlap: 50,
})
```

### 2. Generate embeddings

```typescript
import { ModelRouterEmbeddingModel } from '@mastra/core/llm'

const embedder = new ModelRouterEmbeddingModel('openai/text-embedding-3-small')
const embeddings = await embedder.embedMany(chunks.map(c => c.text))
```

### 3. Store in vector database

```typescript
import { PgVector } from '@mastra/pg'

const vectorStore = new PgVector({
  id: 'rag-store',
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
})

await vectorStore.upsert({
  indexName: 'my-docs',
  vectors: embeddings.map((vec, i) => ({
    id: `chunk-${i}`,
    values: vec,
    metadata: { text: chunks[i].text, source: 'docs' },
  })),
})
```

### 4. Query at runtime

```typescript
const queryEmbedding = await embedder.embed('How do I configure auth?')
const results = await vectorStore.query({
  indexName: 'my-docs',
  queryVector: queryEmbedding,
  topK: 5,
})
```

---

## Security note

The memory system has NO built-in access control. Always verify user authorization
in your application logic before querying any `resourceId`. Never expose raw
memory APIs to untrusted clients.
