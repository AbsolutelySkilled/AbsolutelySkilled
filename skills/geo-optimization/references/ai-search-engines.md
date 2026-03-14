<!-- Part of the geo-optimization AbsolutelySkilled skill. Load this file when
     working with engine-specific GEO strategy for Google AI Overviews, ChatGPT
     Search, Perplexity, or Microsoft Copilot Search. -->

# AI Search Engines - GEO Reference

How each major AI search engine works, what triggers citations, and what content
signals increase the probability of being included. Note that all AI search products
are actively evolving - retrieval logic, citation formats, and ranking factors change
with model updates. Treat everything here as current as of early 2025.

---

## Google AI Overviews

### What it is

Google AI Overviews (formerly Search Generative Experience / SGE) is Google's
AI-generated answer panel that appears above organic results for qualifying queries.
It synthesizes a multi-paragraph response by pulling from multiple pages and cites
sources inline with expandable links.

### What triggers AI Overviews

AI Overviews appear on:
- Informational and research queries ("how does X work", "what is the best Y")
- Multi-faceted questions that traditionally required clicking multiple results
- Comparison queries ("X vs Y", "pros and cons of Z")
- How-to and step-by-step queries

AI Overviews generally do NOT appear on:
- Navigational queries (brand name lookups, "login to Gmail")
- Local queries (Google favors Maps/Local Pack)
- Recent news (real-time freshness requirement that AI Overviews cannot meet)
- YMYL (Your Money Your Life) queries where accuracy risk is high - Google is conservative

<!-- VERIFY: YMYL suppression of AI Overviews is based on early 2024 observations.
     Google may have expanded or changed this policy since. -->

### How citations are selected

Google's AI Overviews pull from pages that already rank in the top ~20 organic results.
If your page doesn't rank on page 1-2 for a query, it is very unlikely to be cited in
the AI Overview for that query. This is the single most important implication for GEO:
**AI Overviews are a layer on top of traditional ranking, not a replacement for it.**

Within eligible pages, Google's extraction logic favors:
- Self-contained passages that directly answer the query question
- Content with clear, unambiguous factual claims
- Structured content (numbered lists, tables, definition blocks)
- Pages with strong E-E-A-T signals (experience, expertise, authoritativeness, trust)
- Schema.org markup that explicitly defines content type (HowTo, FAQPage, Article)

### What increases citation probability on Google

1. **Rank first** - Appear in organic results for the target query (prerequisite)
2. **FAQPage schema** - Explicitly structured Q&A markup directly feeds AI Overview extraction
3. **HowTo schema** - Step-by-step content with HowTo markup is frequently cited in
   procedural AI Overviews
4. **Authoritative statistics** - Specific, sourced data points are frequently lifted verbatim
5. **Clear topic headings** - H2/H3 headers phrased as questions match query intent directly
6. **E-E-A-T signals** - Author bios with credentials, publication dates, sources cited in
   the body of the content

### Known limitations and behaviors

- Google does not guarantee citation even if you rank #1 - it picks the best passage,
  not necessarily from the top result
- AI Overview citations can change day to day as Google updates the underlying model
- Google has been observed pulling from pages that rank position 10-20 if those pages
  have a more precisely matching passage than the top result
- Content blocked from Googlebot indexing will not appear in AI Overviews

---

## ChatGPT Search (SearchGPT)

### What it is

ChatGPT Search (previously called SearchGPT, now integrated into ChatGPT's browsing
mode) is OpenAI's real-time web search feature. When a user's query requires current
information or web sources, ChatGPT triggers a web search, retrieves pages, and
synthesizes a response with cited sources shown in a sidebar.

### How content gets discovered

ChatGPT Search uses Microsoft Bing's index as its primary search backend (as of 2024).
This means:
- Pages that rank in Bing have significantly higher chances of being retrieved
- Bing Webmaster Tools submission is important for ChatGPT Search visibility
- GPTBot (OpenAI's crawler) also separately crawls content for model training and
  potentially for search retrieval - do not block it unless you have a specific reason

### Citation format

ChatGPT Search shows inline citation numbers [1] in the response text, with source
cards in a right-panel sidebar showing title, domain, and snippet. Users can expand
individual sources to read more. This means your page title and meta description
matter for click-through even within AI search - users see them in the citation card.

### What increases citation probability

1. **Bing ranking** - Strong Bing SEO is the primary lever. Many sites over-index on
   Google and under-optimize for Bing. Submit to Bing Webmaster Tools, ensure
   Bingbot is not blocked.
2. **Content freshness** - ChatGPT Search has a recency bias for news and time-sensitive
   topics. Updated publication dates and fresh content signal relevance.
3. **Clear, factual prose** - ChatGPT's retrieval favors content that can be summarized
   accurately. Ambiguous or heavily opinionated content is cited less.
4. **Structured answers** - Well-organized content with clear answer sections is pulled
   more reliably than content buried in long narratives.
5. **Domain trustworthiness** - News sites, official documentation, and established
   domains are cited more frequently than new or thin-authority sites.

### GPTBot crawler

OpenAI's crawler is `GPTBot`. Allow it unless you have a specific reason not to:
```
# robots.txt - allow GPTBot
User-agent: GPTBot
Allow: /
```

Blocking GPTBot may reduce inclusion in ChatGPT Search retrieval. If you want to
allow crawling but opt out of training data use, OpenAI provides a separate mechanism
via their data opt-out process (distinct from the robots.txt signal).

<!-- VERIFY: The training vs search crawling distinction for GPTBot is based on
     OpenAI documentation from 2024. Verify current policy at openai.com/gptbot. -->

---

## Perplexity

### What it is

Perplexity is a standalone AI search engine that positions itself as a "answer engine"
rather than a traditional search engine. Every query gets an AI-synthesized response
with multiple cited sources displayed in a prominent sources panel. Perplexity has
strong adoption among researchers, developers, and technical users.

### How content gets discovered

Perplexity uses a combination of:
- Its own PerplexityBot crawler (indexes content directly)
- Bing's index as a fallback for content not yet in its own index
- Real-time search for very recent queries

PerplexityBot crawls aggressively. Ensure it is not blocked:
```
User-agent: PerplexityBot
Allow: /
```

### Sources panel behavior

Perplexity shows 4-6 sources in a right-column panel for each response. These sources
are visible and clickable, making Perplexity one of the better AI search engines for
referral traffic. Unlike Google AI Overviews (which can reduce click-through), Perplexity
citations actively drive visits.

### Pro Search vs standard search

Perplexity Pro Search (available to Pro subscribers) does multi-step research -
it generates sub-queries, retrieves multiple rounds of sources, and synthesizes
a more comprehensive answer. Content that appears in standard searches will also
appear in Pro searches, but Pro Search sometimes retrieves deeper technical content
that standard search misses.

### What increases citation probability

1. **Technical and research-heavy content** - Perplexity's user base skews technical.
   Content with depth, specificity, and citations is disproportionately favored.
2. **Primary sources and original research** - Perplexity frequently cites academic
   papers, official documentation, and original data publications.
3. **Content freshness** - Perplexity Pro Search heavily weights freshness for
   time-sensitive queries. Keep publication and modification dates accurate.
4. **Well-structured content** - Perplexity's extraction logic handles markdown-style
   content well. Clear headings, bullet points, and numbered lists extract cleanly.
5. **PerplexityBot access** - Not blocking PerplexityBot is table stakes. Giving it
   access to all content (not just crawl-allowed pages) increases coverage.

---

## Microsoft Copilot Search

### What it is

Microsoft Copilot integrates AI search directly into Bing and the Windows operating
system. It shares the Bing index and uses GPT-4-class models (via Microsoft's OpenAI
partnership) to generate answers. Copilot appears in Bing's search results, the
Microsoft Edge sidebar, Windows search, and Microsoft 365 applications.

### How content gets discovered

Copilot Search runs entirely on Bing's index. This means:
- All Bing SEO factors apply directly (Bing Webmaster Tools, Bingbot allowance)
- Bing's trust signals differ slightly from Google's - Bing places more weight on
  social signals (LinkedIn, Twitter/X engagement) and less on raw backlink count
- MicrosoftBot (Bing's crawler) must not be blocked

```
User-agent: msnbot
Allow: /

User-agent: bingbot
Allow: /
```

### Citation format

Copilot Search shows a generated response at the top of Bing results with citations
embedded inline, similar to Google AI Overviews but with Bing's look and feel. Source
links are shown below the generated response.

### What increases citation probability

1. **Bing ranking** - Primary factor, same as for ChatGPT Search
2. **Social proof signals** - Bing weights LinkedIn presence and social sharing
   signals. Content that earns social engagement indexes well on Bing.
3. **Structured data** - Bing fully supports schema.org markup and uses it for
   Copilot citation selection.
4. **HTTPS and security** - Bing has historically penalized non-HTTPS or mixed-content
   pages more aggressively than Google.

---

## Cross-engine GEO checklist

Apply these to maximize visibility across all four engines:

| Signal | Google AI Overviews | ChatGPT Search | Perplexity | Copilot Search |
|---|---|---|---|---|
| Traditional organic ranking | Critical (Google) | Important (Bing) | Moderate | Critical (Bing) |
| Allow engine crawler | Googlebot | GPTBot + Bingbot | PerplexityBot | Bingbot + msnbot |
| Schema.org markup | High impact | Moderate | Low direct impact | Moderate |
| Content freshness | Moderate | High for news | High | High |
| Statistical claims | High | High | High | High |
| E-E-A-T / author authority | High | Moderate | Moderate | Moderate |
| LLMs.txt | Emerging | Emerging | Emerging | Emerging |
