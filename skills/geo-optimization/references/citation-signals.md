<!-- Part of the geo-optimization AbsolutelySkilled skill. Load this file when
     auditing content for AI citability, building a GEO optimization checklist,
     or advising on the Princeton GEO research findings. -->

# Citation Signals - GEO Reference

Detailed coverage of what makes content more likely to be cited by AI search engines,
grounded in the Princeton GEO research and extended with observed best practices.

---

## Princeton GEO Research (2023)

### Overview

The foundational academic paper on GEO is "GEO: Generative Engine Optimization" by
Aggarwal et al. from Princeton University (arXiv:2311.09735, 2023). The paper introduced
the term "GEO" and ran controlled experiments measuring how different optimization
strategies affected the fraction of AI-generated responses that included content from
a given source.

<!-- VERIFY: Paper citation is arXiv:2311.09735. Verify DOI and publication venue at
     arxiv.org/abs/2311.09735. Publication status (preprint vs peer-reviewed journal)
     may have changed since initial release. -->

### Benchmark methodology

The researchers built a benchmark called GEO-bench with 10,000 queries across multiple
domains (healthcare, law, technology, finance, travel) and tested responses from Bing,
Google (SGE), and Perplexity. For each query they measured whether a given source was
included in the AI-generated response (citation presence) and if so, how prominently.

The "GEO score" they defined = (weighted sum of source citations across a response) /
(total response length), measuring both presence and prominence.

### Optimization strategies tested and results

The paper tested nine distinct optimization strategies:

| Strategy | Description | Observed Impact |
|---|---|---|
| Authoritative statistics | Add specific numeric statistics with source attribution | ~40% improvement in citation rate |
| Citing sources | Include references to external authoritative sources within the content | ~30% improvement |
| Quotations | Add direct quotes from recognized experts or authoritative bodies | Positive impact, especially informational queries |
| Easy-to-understand language | Simplify and improve readability/clarity | Small but consistent improvement |
| Fluency optimization | Fix grammar, sentence structure, overall prose quality | Small consistent improvement |
| Adding unique/technical terms | Use domain-specific terminology correctly | Mixed results - better in technical domains |
| Authoritative tone | Write with confident, authoritative voice vs hedged/tentative | Positive impact across domains |
| Keyword stuffing | Add high-frequency query keywords repeatedly | Minimal or negative impact |
| Citing your own sources | Self-reference your own content | Minimal impact, sometimes negative |

<!-- VERIFY: Specific percentage improvements (+40%, +30%) are from early summaries and
     may differ from final published numbers. Verify exact figures against the paper. -->

### Key takeaways from the research

1. **Qualitative signals beat keyword signals.** The strategies that worked were about
   content quality (statistics, sources, quotes, clarity), not keyword manipulation.
   This aligns with how RAG-based systems work - they care about passage quality,
   not keyword density.

2. **Domain matters.** The effectiveness of each strategy varied by domain. Technical
   and scientific domains benefited more from statistics and citations. Humanities and
   lifestyle domains benefited more from fluency and clarity improvements.

3. **The effect is additive.** Applying multiple strategies compounds the improvement.
   A page that adds statistics AND cites external sources AND includes expert quotes
   outperforms a page that does only one of those things.

4. **Prominence matters, not just presence.** Being mentioned briefly at the end of an
   AI response is less valuable than being the primary cited source at the start.
   Content that answers the core of the query (not just peripheral aspects) earns
   more prominent placement.

---

## Core citation signals

### 1. Specific, attributable statistics

The single strongest individual signal found in research and observed in practice.
Statistics must be:
- **Specific**: "73% of enterprises exceeded cloud budgets" not "many companies overspend"
- **Attributed**: "According to Gartner's 2024 Cloud Report" or "per the 2023 Stack
  Overflow Developer Survey"
- **Relevant**: Directly supports the claim being made, not tangential

Example transformation:
```
Weak:  "API security is an important concern for modern applications."
Strong: "The OWASP API Security Top 10 reports that broken object-level authorization
         affects an estimated 40% of production APIs, making it the leading API
         vulnerability class."
```

**Original data as a citation superpower:** Publishing your own survey, benchmark, or
dataset creates statistics that only you can provide. AI engines must cite you if they
want to reference that data. Annual reports, developer surveys, and industry benchmarks
are high-citation-value content investments.

### 2. External source citations in content

Including citations to authoritative third-party sources within your content signals
to AI engines that your content has been researched and verified. Effective citation
patterns:
- Link to primary sources (original research, official standards, authoritative reports)
  not secondary summaries
- Use academic/journalistic citation style: "A 2023 study published in Nature found..."
- Cite the specific section or finding, not just the source

Note: this is citing external sources within your content to boost your own citability -
not the same as building backlinks.

### 3. Expert quotations

Direct quotes from recognized experts, industry organizations, or authoritative bodies
are frequently lifted verbatim by AI engines. To maximize effectiveness:
- Attribute clearly: "Dr. Jane Smith, Professor of Computer Science at MIT, explains:"
- Use quotation marks precisely around the quoted text
- Choose quotes that directly answer common questions in your domain
- Include the quote source context (interview, publication, talk)

For non-original content (curating others' quotes): Always link to the original source.

### 4. Content clarity and readability

AI extraction is easier when content is:
- Written in plain, direct sentences (Flesch-Kincaid grade 8-12 for most topics)
- Free of grammatical errors and run-on sentences
- Structured so each paragraph addresses one idea
- Avoiding excessive hedging ("might possibly", "could perhaps") - authoritative tone
  signals confident expertise

### 5. Schema.org structured data

Schema markup provides machine-readable signals about content structure and entity
relationships. High-impact schema types for GEO:

**FAQPage:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is Generative Engine Optimization?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Generative Engine Optimization (GEO) is the practice of optimizing..."
    }
  }]
}
```
FAQPage schema gives AI engines direct access to Q&A pairs without requiring extraction.
This is arguably the highest-leverage structured data type for GEO.

**HowTo:**
Numbered step instructions with HowTo schema are frequently cited in procedural AI
responses. Include `name`, `text`, and optionally `image` for each step.

**Article / NewsArticle:**
Establishes content type, author, datePublished, and publisher entity. Important for
E-E-A-T signal and for establishing freshness.

**Organization / SoftwareApplication:**
Defines your brand/product as a recognized entity with `sameAs` links to authoritative
external profiles (Wikipedia, LinkedIn, Crunchbase, GitHub).

---

## Entity authority signals

### What entity authority means

In AI search, an "entity" is a distinct, named thing: a company, product, person,
technology, or concept. AI engines maintain implicit entity graphs where certain
entities are more trusted and recognized than others. High entity authority means
the AI engine "knows" your entity and associates it with your domain of expertise.

### Building entity authority

**Wikipedia and Wikidata presence:**
Wikipedia is the most heavily weighted entity source for most AI systems. A well-sourced
Wikipedia article about your company, product, or founders significantly boosts entity
recognition. Wikidata entries (the structured data layer under Wikipedia) are directly
ingested by many AI knowledge graph systems.

Criteria for Wikipedia notability: typically requires significant coverage in independent,
reliable sources. If your entity is notable by Wikipedia standards, having a presence
there is very high GEO value. Do not create or edit Wikipedia articles for promotional
purposes - it backfires and violates Wikipedia policy.

**Knowledge Panel maintenance:**
Google's Knowledge Panel pulls from Wikipedia, Wikidata, and other structured sources.
Verify your entity's panel (if one exists) for accuracy. Claim it through Google Search
Console to submit corrections.

**Consistent entity naming:**
Choose a canonical entity name and use it consistently everywhere:
- Website content, title tags, and schema markup
- Social media profiles (LinkedIn, Twitter/X)
- External business directories (Crunchbase, Bloomberg, G2)
- Press releases and earned media

Inconsistency (sometimes "Acme Inc.", sometimes "Acme", sometimes "acme.io") fragments
entity association and reduces authority.

**sameAs links in schema:**
Use `sameAs` in Organization or Person schema to explicitly link your entity across
different platforms:
```json
{
  "@type": "Organization",
  "name": "Acme Inc.",
  "url": "https://acme.com",
  "sameAs": [
    "https://en.wikipedia.org/wiki/Acme_Inc",
    "https://www.linkedin.com/company/acme-inc",
    "https://www.crunchbase.com/organization/acme-inc",
    "https://twitter.com/acme"
  ]
}
```

---

## Content freshness signals

AI engines favor current information, especially for fast-moving domains. Freshness
signals:

1. **Accurate datePublished and dateModified** in Article schema - Do not manipulate
   these dates; AI engines and search crawlers notice inconsistencies between stated
   and observed modification dates.
2. **Annual or periodic content refresh** - Review top-ranking content annually to
   update statistics, add new sections, and remove outdated information.
3. **Publication date visible in content** - "Last updated March 2025" in the page
   body reinforces freshness signals for AI extractors.
4. **New content velocity** - Sites that publish regularly signal active maintenance
   and authority maintenance. Stale content inventories (no new content in 6+ months)
   negatively impact entity authority over time.

---

## Domain reputation signals

These are table-stakes prerequisites - without them, content-level GEO efforts are
less effective:

- **Domain age and backlink profile**: Established domains with earned backlinks from
  authoritative sites are trusted more heavily by all AI engines.
- **HTTPS and security**: Mandatory. Non-HTTPS domains face ranking penalties that
  reduce eligibility for AI citations.
- **Core Web Vitals**: Heavily loaded, slow pages may be crawled less completely,
  reducing passage extraction quality.
- **Thin content audit**: Pages with fewer than 400-500 words of substantive content
  rarely get cited. Consolidate thin pages or expand them with specific, useful content.
- **Spam and duplicate content**: Duplicate content confuses entity association.
  Canonical tags must be correctly set.

---

## Quick GEO optimization checklist

For auditing a single piece of content:

- [ ] At least one specific, attributed statistic in each major section
- [ ] External authoritative sources cited inline (not just in a reference list)
- [ ] One or more expert quotes with full attribution
- [ ] Headings phrased as questions or clear topic statements
- [ ] Each core paragraph is self-contained and answers one question fully
- [ ] FAQPage or HowTo schema applied where appropriate
- [ ] Article schema with accurate datePublished and author entity
- [ ] Organization schema with sameAs links on key landing pages
- [ ] Entity name consistent throughout page content and schema
- [ ] Page ranks in top 20 for target query (prerequisite for AI Overview citation)
- [ ] Engine crawlers (Googlebot, GPTBot, PerplexityBot, Bingbot) not blocked
