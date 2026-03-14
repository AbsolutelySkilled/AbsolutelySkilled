<!-- Part of the NLP Engineering AbsolutelySkilled skill. Load this file when choosing an embedding model, comparing retrieval quality, evaluating cost/performance trade-offs, or migrating between embedding providers. -->

# Embedding Models Reference

Opinionated comparison of production embedding models as of 2024-2025. When in
doubt, start with `BAAI/bge-small-en-v1.5` locally or `text-embedding-3-small`
via API, then benchmark against your actual retrieval task before upgrading.

---

## Quick decision guide

| Need | Pick |
|---|---|
| Free, fast, local, English only | `BAAI/bge-small-en-v1.5` |
| Free, local, multilingual | `intfloat/multilingual-e5-small` |
| Best local English quality | `BAAI/bge-large-en-v1.5` or `mixedbread-ai/mxbai-embed-large-v1` |
| API convenience, cost-sensitive | `text-embedding-3-small` (OpenAI) |
| API, best retrieval quality | `text-embedding-3-large` (OpenAI) |
| API, long context (up to 128k tokens) | `embed-english-v3.0` (Cohere) |
| Multilingual API | `embed-multilingual-v3.0` (Cohere) |

---

## Model comparison table

| Model | Provider | Dimensions | Max Tokens | MTEB Score* | Params | Cost |
|---|---|---|---|---|---|---|
| `text-embedding-3-small` | OpenAI | 1536 (matryoshka) | 8191 | 62.3 | - | $0.02 / 1M tokens |
| `text-embedding-3-large` | OpenAI | 3072 (matryoshka) | 8191 | 64.6 | - | $0.13 / 1M tokens |
| `text-embedding-ada-002` | OpenAI | 1536 | 8191 | 61.0 | - | $0.10 / 1M tokens (legacy) |
| `embed-english-v3.0` | Cohere | 1024 | 512 (default) / 128k | 64.5 | - | $0.10 / 1M tokens |
| `embed-multilingual-v3.0` | Cohere | 1024 | 512 (default) / 128k | 62.1 | - | $0.10 / 1M tokens |
| `BAAI/bge-large-en-v1.5` | BGE (HuggingFace) | 1024 | 512 | 64.2 | 335M | Free (self-hosted) |
| `BAAI/bge-small-en-v1.5` | BGE (HuggingFace) | 384 | 512 | 62.2 | 33M | Free (self-hosted) |
| `BAAI/bge-m3` | BGE (HuggingFace) | 1024 | 8192 | 63.5 | 568M | Free (self-hosted) |
| `intfloat/e5-large-v2` | E5 (HuggingFace) | 1024 | 512 | 62.2 | 335M | Free (self-hosted) |
| `intfloat/multilingual-e5-large` | E5 (HuggingFace) | 1024 | 512 | 61.5 | 560M | Free (self-hosted) |
| `intfloat/multilingual-e5-small` | E5 (HuggingFace) | 384 | 512 | 59.3 | 117M | Free (self-hosted) |
| `mixedbread-ai/mxbai-embed-large-v1` | Mixedbread | 1024 | 512 | 64.7 | 335M | Free (self-hosted) |
| `all-MiniLM-L6-v2` | SBERT | 384 | 256 | 56.3 | 22M | Free (self-hosted) |

*MTEB (Massive Text Embedding Benchmark) average across retrieval tasks. Higher
is better. Scores shift slightly between benchmark runs; use as a relative guide.

---

## Provider deep-dives

### OpenAI

**Best for:** Teams already using the OpenAI API who want zero infrastructure
overhead and a single billing relationship.

**Key characteristics:**
- `text-embedding-3-small` and `text-embedding-3-large` support **matryoshka
  representation learning** - you can truncate the embedding to a smaller
  dimension (e.g., 256 from 1536) with minimal quality loss. Use this to reduce
  vector storage costs.
- `ada-002` is legacy; migrate to `text-embedding-3-small` - same price, better
  quality.
- No batch size limit stated, but recommended max ~2048 inputs per API call.
- Rate limits apply per organization tier; large indexing jobs need queuing.

**Matryoshka truncation example:**
```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def embed_truncated(texts: list[str], dimensions: int = 256) -> list[list[float]]:
    """Get embeddings at reduced dimensions to save storage cost."""
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small",
        dimensions=dimensions,  # built-in truncation, no quality hack
    )
    return [item.embedding for item in response.data]
```

**When NOT to use:** High-volume indexing (millions of docs), latency-sensitive
paths, or air-gapped/on-premise environments.

---

### Cohere

**Best for:** Applications needing long-context embedding (research papers, legal
docs) or strong multilingual retrieval.

**Key characteristics:**
- Unique **128k token context window** via the `input_type` parameter set to
  `"search_document"` - the only API-hosted model supporting this at scale.
- Exposes four `input_type` values: `"search_document"`, `"search_query"`,
  `"classification"`, `"clustering"`. Always set this - it conditions the model
  to produce better vectors for each use case.
- `embed-multilingual-v3.0` covers 100+ languages in a shared embedding space,
  enabling cross-lingual retrieval (query in English, match French documents).
- Supports binary and int8 quantized embeddings to reduce storage/memory costs.

**Usage pattern:**
```python
import cohere

co = cohere.Client("YOUR_API_KEY")

def embed_documents(texts: list[str]) -> list[list[float]]:
    response = co.embed(
        texts=texts,
        model="embed-english-v3.0",
        input_type="search_document",  # ALWAYS set input_type
        embedding_types=["float"],
    )
    return response.embeddings.float

def embed_query(query: str) -> list[float]:
    response = co.embed(
        texts=[query],
        model="embed-english-v3.0",
        input_type="search_query",  # different from document type
        embedding_types=["float"],
    )
    return response.embeddings.float[0]
```

**When NOT to use:** Simple English-only tasks where cost matters - `bge-small`
is free and nearly as good.

---

### sentence-transformers (SBERT)

**Best for:** The default local embedding stack. Handles most use cases with
zero API cost.

**Key characteristics:**
- `all-MiniLM-L6-v2` is the classic starter - fast, 22M params, 256 token
  limit. Good for short sentences, weak for long passages.
- `BAAI/bge-small-en-v1.5` is now the recommended starter - better MTEB score,
  384 tokens, still very fast.
- Always pass `normalize_embeddings=True` to `encode()` so cosine similarity
  equals dot product, enabling FAISS `IndexFlatIP` and cheaper ANN indexes.
- Supports `prompt_name` parameter on newer models for task-specific prefixing.

```python
from sentence_transformers import SentenceTransformer

# For retrieval: use BGE small (recommended starter)
model = SentenceTransformer("BAAI/bge-small-en-v1.5")

# BGE models benefit from a query prefix at inference time
query_prefix = "Represent this sentence for searching relevant passages: "

def embed_query(query: str) -> list[float]:
    return model.encode(query_prefix + query, normalize_embeddings=True).tolist()

def embed_documents(docs: list[str]) -> list[list[float]]:
    # No prefix for documents
    return model.encode(docs, normalize_embeddings=True, batch_size=64).tolist()
```

**When NOT to use:** Multilingual corpora with more than 3-4 languages (use
`multilingual-e5` or Cohere instead), or when you need >512 token context.

---

### E5 (intfloat)

**Best for:** Teams wanting a well-documented, research-backed open model family
with strong multilingual support.

**Key characteristics:**
- E5 models use instruction prefixes: prepend `"query: "` to queries and
  `"passage: "` to documents. Missing this prefix degrades retrieval quality.
- `multilingual-e5-large` covers 100 languages; `multilingual-e5-small` trades
  quality for speed.
- `e5-mistral-7b-instruct` (7B params) achieves state-of-the-art scores but
  requires significant GPU memory - only viable for high-budget setups.
- Apache 2.0 license on all models.

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("intfloat/e5-large-v2")

def embed_query(query: str) -> list[float]:
    return model.encode("query: " + query, normalize_embeddings=True).tolist()

def embed_documents(docs: list[str]) -> list[list[float]]:
    prefixed = ["passage: " + d for d in docs]
    return model.encode(prefixed, normalize_embeddings=True, batch_size=32).tolist()
```

---

### BGE (BAAI)

**Best for:** The highest-quality open embedding models available as of 2024.
`bge-large-en-v1.5` and `mxbai-embed-large-v1` are the go-to local models when
quality matters and you have GPU.

**Key characteristics:**
- `BAAI/bge-m3` supports three retrieval modes simultaneously: dense (embedding),
  sparse (BM25-like), and multi-vector (ColBERT-style late interaction). Hybrid
  search with one model.
- `bge-reranker-large` is a companion cross-encoder reranker - retrieve top-100
  with embedding search, then rerank with the cross-encoder for top-10 quality.
- `bge-small-en-v1.5` is the best speed/quality tradeoff at 33M params.

```python
from sentence_transformers import SentenceTransformer, CrossEncoder

# Retrieval model
bi_encoder = SentenceTransformer("BAAI/bge-small-en-v1.5")

# Reranker (run after retrieval on top-k candidates)
cross_encoder = CrossEncoder("BAAI/bge-reranker-base")

def rerank(query: str, candidates: list[str], top_n: int = 5) -> list[str]:
    pairs = [(query, c) for c in candidates]
    scores = cross_encoder.predict(pairs)
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    return [text for text, _ in ranked[:top_n]]
```

---

## Dimension and storage trade-offs

Higher dimensions = better quality, more storage, slower ANN index build.

| Dimensions | Relative storage (float32) | Notes |
|---|---|---|
| 384 | 1.5 KB / vector | Fine for most retrieval tasks, fits in memory at scale |
| 768 | 3 KB / vector | Good quality/cost balance |
| 1024 | 4 KB / vector | Most large open models |
| 1536 | 6 KB / vector | OpenAI ada-002 / text-embedding-3-small default |
| 3072 | 12 KB / vector | text-embedding-3-large; only if quality gap is proven |

**At 1M vectors, 384-dim float32 = ~1.5 GB RAM.** Use int8 quantization or
binary embeddings (via Cohere or FAISS `IndexBinaryFlat`) to reduce by 4-32x
with modest quality loss.

---

## MTEB benchmark context

MTEB (Massive Text Embedding Benchmark) covers 58 datasets across 8 task types:
retrieval, clustering, classification, reranking, STS, summarization, bitext
mining, and pair classification. The leaderboard is at
[huggingface.co/spaces/mteb/leaderboard](https://huggingface.co/spaces/mteb/leaderboard).

**Important caveats:**
- MTEB covers general English text. Domain-specific corpora (medical, legal,
  code) may rank models differently.
- The best MTEB score does not always win on your specific task. Always run
  offline evaluation on a sample of your actual queries and documents.
- Newer models are added regularly. Check the leaderboard before finalizing
  a model choice.

---

## Selecting a model: decision checklist

1. **Language** - English only or multilingual? Multilingual narrows to E5-multilingual, BGE-M3, or Cohere multilingual.
2. **Deployment** - Can you self-host? Local models (BGE, E5, SBERT) are free at scale. API models have per-token cost.
3. **Context window** - Docs longer than 512 tokens? BGE-M3 (8192), Cohere (128k), or chunk first.
4. **Latency** - Embedding in the request path? Use small models (33M-117M params) or API with batching.
5. **Quality bar** - Run BEIR or your own retrieval benchmark on a sample. Start small, upgrade only when the gap is proven.
6. **Reranking** - If retrieval quality is borderline, add a `bge-reranker` cross-encoder before expanding the embedding model.
