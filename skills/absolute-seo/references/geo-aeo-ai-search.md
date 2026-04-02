# GEO, AEO & AI Search Optimization Reference

## Generative Engine Optimization (GEO)

### How AI Search Works

AI search engines use Retrieval-Augmented Generation (RAG):
1. **Retrieve**: Query is converted to embeddings, matched against indexed web content
2. **Augment**: Top-matching passages are assembled as context
3. **Generate**: LLM synthesizes an answer, citing source passages

Unlike traditional search (10 blue links), AI search produces a single synthesized answer with inline citations. Visibility depends on being selected as a citation source.

### Citation Mechanism

AI selects citations based on:
- **Semantic relevance**: Content closely matches the query intent
- **Authority signals**: Brand recognition, domain authority, entity presence
- **Content structure**: Self-contained passages, clear headings, data points
- **Unique value**: Original data, expert perspective, primary source

### Key Statistics (2025-2026)

| Metric | Value | Source |
|--------|-------|--------|
| Brand mentions vs backlinks | Brand mentions correlate **3x stronger** with AI visibility | Ahrefs, Dec 2025 |
| AI Overviews reach | 1.5B users/month, 200+ countries | Google, 2025 |
| AI Overview query coverage | 50%+ of queries | Various studies, 2025 |
| Citation from top-10 pages | 92% of AI Overview citations | Ahrefs |
| Citations from below position 5 | 47% of citations | Ahrefs |
| Domain overlap ChatGPT vs Google AIO | Only 11% | ZipTie study |
| Optimal citation passage length | 134-167 words | Multiple studies |
| Multi-modal content selection rate | 156% higher | Google, 2025 |

### GEO Analysis Criteria (Weighted)

| Factor | Weight | How to optimize |
|--------|--------|----------------|
| Citability | 25% | Self-contained answer blocks, specific facts, statistics, data points |
| Structural readability | 20% | Semantic headings, question-based H2/H3, lists, tables, numbered steps |
| Authority & brand signals | 20% | Author byline, publication date, primary source citations, brand mentions |
| Technical accessibility | 20% | Server-side rendering (AI does NOT execute JS), fast loading, clean HTML |
| Multi-modal content | 15% | Text + images + data tables + charts (156% higher selection rate) |

### Princeton GEO Research Findings

| Optimization | Citation improvement |
|-------------|-------------------|
| Adding statistics with sources | +40% |
| Citing authoritative sources | +30% |
| Including expert quotes | +25% |
| Improving grammar and fluency | +20% |
| Adding specific technical terms | +15% |

### Content Optimization for AI Citation

**Do**:
- Write self-contained paragraphs (134-167 words) that answer specific questions
- Include statistics with attribution ("According to [source], X is Y%")
- Add expert quotes and named attributions
- Use semantic HTML headings (H2 for questions, H3 for sub-answers)
- Include data in tables (AI extracts tabular data well)
- Provide clear definitions for technical terms
- Keep content factual and verifiable

**Don't**:
- Rely on visual elements alone (AI cannot see images)
- Use vague language ("many experts say", "studies show")
- Bury answers in long paragraphs without structure
- Use client-side rendering for important content
- Assume all AI platforms index the same way

---

## Platform-Specific Optimization

### Google AI Overviews
- Sources from Google's own web index (Googlebot)
- 92% of citations from top-10 ranking pages
- Traditional SEO is prerequisite
- Schema markup improves selection probability
- Blocking Google-Extended does NOT affect AI Overviews (uses Googlebot)

### Google AI Mode (May 2025)
- Separate tab in Google Search
- Available in 180+ countries
- **Zero organic blue links** - AI citation is the ONLY visibility mechanism
- Content must be in Google's index to be cited

### ChatGPT Web Search
- Sources from Bing web index (not Google)
- Also pulls from: Wikipedia, Reddit, Yelp, TripAdvisor, BBB
- GPTBot crawls for training data; ChatGPT-User browses in real-time
- Blocking GPTBot blocks training but NOT real-time browsing
- Only 11% domain overlap with Google AI Overviews

### Perplexity
- Sources from its own web index + Bing
- Heavy Reddit sourcing, 40% more from high-authority sources
- Averages **21.87 citations per question** (Qwairy study)
- Provides inline citations with page titles
- PerplexityBot crawls for indexing
- Respects robots.txt (blocks = no Perplexity visibility)

### Bing Copilot
- Sources from Bing index exclusively
- Integrated into Bing search results
- Strong Enterprise usage (Microsoft 365 integration)

---

## AI Crawler Management

### robots.txt Directives

```
# Allow AI crawlers for visibility in AI search results
User-agent: GPTBot
Allow: /blog/
Allow: /docs/
Disallow: /proprietary/
Disallow: /internal/

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Block AI training but allow search
User-agent: Google-Extended
Disallow: /  # Blocks Gemini training, NOT Google Search/AI Overviews

User-agent: Bytespider
Disallow: /  # ByteDance training, usually safe to block

User-agent: CCBot
Disallow: /  # Common Crawl, optional
```

### Decision Framework

| Goal | GPTBot | ChatGPT-User | ClaudeBot | PerplexityBot | Google-Extended |
|------|--------|-------------|-----------|---------------|-----------------|
| Visible in ChatGPT search | Don't care | Allow | Don't care | Don't care | Don't care |
| Visible in Perplexity | Don't care | Don't care | Don't care | Allow | Don't care |
| Visible in Google AI Overviews | Don't care | Don't care | Don't care | Don't care | Don't care (uses Googlebot) |
| Block AI training | Block | N/A | Block | Block | Block |
| Maximum AI visibility | Allow all | Allow | Allow | Allow | Allow |

**Adoption**: ~3-5% of sites currently use AI-specific robots.txt rules (growing rapidly).

---

## llms.txt Standard

Emerging specification (December 2025) for providing structured content guidance to AI crawlers.

### Format

```markdown
# Example Company

> Brief description of the company/site

## Docs
- [Getting Started](https://example.com/docs/getting-started): Quick start guide
- [API Reference](https://example.com/docs/api): Complete API documentation

## Blog
- [Latest Updates](https://example.com/blog): Company news and insights

## Contact
- Support: support@example.com
- Sales: sales@example.com
```

### Location
- File at domain root: `https://example.com/llms.txt`
- Markdown format
- Curated entry point (not exhaustive sitemap)
- Highlights most important/authoritative content
- Include contact and authority information

### Checking for llms.txt
```bash
curl -sL "https://domain.com/llms.txt"
# 200 = implemented, 404 = not implemented
```

---

## RSL 1.0 (Really Simple Licensing)

Machine-readable AI licensing standard (December 2025).

Purpose: Let content owners specify how AI systems may use their content.

Location: `/.well-known/rsl.json`

**Backed by**: Reddit, Yahoo, Medium, Quora, Cloudflare, Akamai, Creative Commons. Augments robots.txt with AI-specific granular permissions. Still emerging but gaining traction with major platforms.

---

## Answer Engine Optimization (AEO)

### Featured Snippet Formats

**Paragraph snippet** (most common):
- Question in H2/H3 heading
- Answer immediately after in a single paragraph
- 40-60 words (not too short, not too long)
- Direct answer first, then context

```html
<h2>What is Core Web Vitals?</h2>
<p>Core Web Vitals are three performance metrics that Google uses as ranking
signals: Largest Contentful Paint (LCP) measures loading speed, Interaction to
Next Paint (INP) measures responsiveness, and Cumulative Layout Shift (CLS)
measures visual stability. Pages must meet all three thresholds to pass.</p>
```

**List snippet**:
- 5-8 items optimal
- Each item self-contained
- Use `<ol>` for ranked/ordered lists, `<ul>` for unordered
- H2/H3 heading with "best", "top", "steps", "ways"

**Table snippet**:
- 3-5 columns
- Semantic HTML with `<thead>` and `<tbody>`
- Comparison or data-oriented content
- H2/H3 heading describing what the table compares

### People Also Ask (PAA) Targeting

- PAA boxes are dynamic and auto-populated based on query context
- Research: Use AlsoAsked.com, Google's PAA expansion, AnswerThePublic
- Target: Create question-based H2/H3 headings matching PAA questions
- Answer: Provide concise 40-60 word answer directly after heading
- Expand: Follow with detailed explanation below

### Voice Search Optimization

- Queries are conversational (7-10 words average)
- Local/time-sensitive bias ("near me", "open now")
- Optimize: FAQ format, concise answers, conversational language
- Schema: LocalBusiness for local queries, Speakable for news
- Page speed critical (voice results typically from fast pages)

### Speakable Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-summary", ".key-findings"]
  }
}
```

- Currently Google News publishers only (English)
- Marks sections suitable for text-to-speech
- Max 30 seconds of audio when read aloud
- Use `cssSelector` (preferred) or `xpath`

---

## Zero-Click Strategy

Many searches now resolve without a click (AI Overviews, featured snippets, knowledge panels).

**Adapt by**:
- Optimize for brand visibility even without clicks
- Include brand name in snippet-optimized answers
- Track impressions alongside clicks in GSC
- Build brand recognition that drives direct/branded searches later
- Accept lower CTR on informational queries, focus conversion on transactional queries

---

## AI Search Visibility Monitoring

### Manual Spot-Checking
1. Search your target queries in ChatGPT, Google (AI Overview), Perplexity
2. Note which sources are cited
3. Track whether your domain appears
4. Document monthly for trend analysis

### Metrics to Track
- **AI citation rate**: % of target queries where you appear in AI answers
- **Source diversity**: Which AI platforms cite you (Google AIO, ChatGPT, Perplexity)
- **Citation position**: Where in the AI answer your citation appears (higher = better)
- **Brand mention frequency**: How often your brand is named in AI responses
- **Impression-to-click ratio**: GSC impressions vs clicks (declining ratio = more zero-click)

### Emerging Tools
- AI search monitoring tools are rapidly evolving
- Baseline tracking now, formal tools expected to mature in 2026
- Use manual tracking + GSC data as primary signals
