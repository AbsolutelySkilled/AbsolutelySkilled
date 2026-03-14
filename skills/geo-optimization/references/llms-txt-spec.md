<!-- Part of the geo-optimization AbsolutelySkilled skill. Load this file when
     implementing or advising on LLMs.txt for a site. -->

# LLMs.txt Specification - GEO Reference

Complete reference for the `/llms.txt` specification: what it is, the format, how
to implement it, and its relationship to the broader GEO ecosystem.

---

## What is LLMs.txt?

LLMs.txt is a proposed standard for a plain-text file placed at the root of a website
(`/llms.txt`) that provides a curated, AI-readable summary of the site's content
structure. It is conceptually similar to `robots.txt` (which tells crawlers what to
access) but serves a different purpose: rather than controlling access, it guides AI
systems toward the most relevant and authoritative content on the site.

The specification was proposed by Jeremy Howard (fast.ai) in September 2024. As of
early 2025, it is not an official W3C or IETF standard - it is a community proposal
with growing adoption, especially among developer-facing documentation sites.

**LLMs.txt vs robots.txt comparison:**

| | robots.txt | llms.txt |
|---|---|---|
| Purpose | Control crawler access | Guide AI systems to relevant content |
| Format | Custom key-value syntax | Markdown |
| Enforcement | Honored by well-behaved crawlers | Advisory only - no enforcement mechanism |
| Location | `/robots.txt` | `/llms.txt` |
| Standard body | Informally standardized | Community proposal (no formal body) |
| Required? | De facto required | Optional, growing adoption |

---

## File format

LLMs.txt uses Markdown syntax. The structure is:

```markdown
# Site or Project Name

> One-sentence tagline or description of what this site/project is.

Optional introductory paragraph providing context that is useful for an AI system
trying to understand this site's purpose, audience, and content scope.

## Section Name

- [Page Title](https://example.com/page): Brief description of what this page contains
- [Another Page](https://example.com/other): Brief description

## Another Section

- [API Reference](https://docs.example.com/api): Complete REST API documentation
```

### Format rules

1. **H1 (`#`)**: The site or project name. Required. Appears once at the top.
2. **Blockquote (`>`)**: A single-sentence description. Required. Immediately follows H1.
3. **Introductory paragraph**: Optional. Provides context. Comes after the blockquote.
4. **H2 (`##`) sections**: Logical groupings of content. Use descriptive labels like
   "Documentation", "Guides", "API Reference", "About", "Blog".
5. **List items**: Each item is a Markdown link with an optional inline description
   after a colon. The description should be 1-2 sentences explaining what the page
   contains, not just restating the title.

### Naming guidance for sections

Good section names:
- "Documentation" - core product/service documentation
- "Getting Started" - onboarding and quickstart content
- "API Reference" - technical API documentation
- "Guides" - how-to and tutorial content
- "About" - company/project information
- "Blog" - articles, engineering posts, release notes
- "Changelog" - version history

Avoid vague section names like "Resources" or "Links" - they provide no signal to AI systems about what the content is.

---

## llms-full.txt variant

The specification also defines an optional `/llms-full.txt` file. Where `llms.txt`
contains a curated index of links, `llms-full.txt` contains the full text content
of the site's most important pages, concatenated.

The purpose of `llms-full.txt` is to allow AI systems (especially those with large
context windows) to ingest a complete snapshot of a site's content in a single request,
rather than following individual links.

**When to use llms-full.txt:**
- Documentation sites where AI tools (like IDE assistants) need offline/cached access
- Sites targeting AI coding tools that context-load documentation before answering questions
- Smaller sites where full content fits in a reasonable context window (< 100K tokens)

**Format:** Plain text or Markdown, sections separated by `---`, each section starting
with the source URL as a reference comment:

```markdown
<!-- Source: https://docs.example.com/quickstart -->
# Quickstart Guide

[Full content of the quickstart page here]

---

<!-- Source: https://docs.example.com/api/auth -->
# Authentication

[Full content of the auth page here]
```

**Practical limit:** `llms-full.txt` files larger than ~1-2MB become impractical for
most AI consumption scenarios. Prioritize the most commonly needed content rather than
attempting to include everything.

---

## Relationship to robots.txt

LLMs.txt and robots.txt serve complementary roles:

- `robots.txt` controls which crawlers can access which paths. If you block `GPTBot`
  in `robots.txt`, those pages won't appear in ChatGPT Search regardless of what
  `llms.txt` says.
- `llms.txt` guides AI systems that have already been granted access (i.e., not blocked
  by `robots.txt`) toward the most relevant content.

**Common configuration mistake:** Adding an `llms.txt` file while simultaneously
blocking AI crawlers in `robots.txt`. The `llms.txt` will be ignored because the
crawlers can't reach it or won't trust the guidance from a site that blocks them.

**Recommended robots.txt for GEO-friendly configuration:**
```
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: msnbot
Allow: /
```

Only add `Disallow` rules for paths that should genuinely not be indexed (admin panels,
authenticated content, private APIs, etc.).

---

## Implementation guide

### Step 1 - Identify your key content

Before writing `llms.txt`, inventory your site's most important pages by category:
- Core documentation or product pages (highest priority)
- Getting started / quickstart content (high priority - most commonly queried)
- API reference or technical specifications (high priority for technical audiences)
- Blog posts and guides (medium priority - selective, pick evergreen content)
- About / company pages (lower priority - include briefly)

Aim for 15-40 links total. Too few provides insufficient guidance; too many dilutes
the signal and starts to look like a sitemap rather than a curated index.

### Step 2 - Write descriptions

For each link, write a description that tells an AI system what the page answers,
not just what topic it covers. Compare:

```
# Weak descriptions
- [Authentication](https://docs.example.com/auth): Authentication information
- [API Limits](https://docs.example.com/limits): Rate limits

# Strong descriptions
- [Authentication](https://docs.example.com/auth): How to generate API keys,
  implement OAuth 2.0 flows, and verify webhook signatures. Includes code
  examples for Node.js and Python.
- [API Limits](https://docs.example.com/limits): Rate limit tiers by plan,
  429 error handling, and best practices for burst traffic management.
```

### Step 3 - Deploy the file

Place `llms.txt` at the root of your web server so it is accessible at
`https://yourdomain.com/llms.txt`. Ensure:
- Content-type is `text/plain` or `text/markdown`
- File is accessible without authentication
- File is NOT listed in robots.txt Disallow rules
- File is served over HTTPS

For static sites, most frameworks support this by placing the file in the `public/`
or `static/` directory. For dynamic sites, add a route that serves the file.

### Step 4 - Add llms-full.txt (optional)

If your site is documentation-heavy and you want to support AI tools that load content
rather than follow links, generate `llms-full.txt` by concatenating the Markdown source
of your most important pages. Many documentation frameworks (Docusaurus, GitBook, Mintlify)
have plugins or scripts that can generate this automatically.

---

## Full example implementations

### Developer documentation site (e.g., API product)

```markdown
# Acme API Documentation

> RESTful payment processing API for e-commerce and SaaS platforms.

Acme's API enables developers to accept payments, manage subscriptions, and
handle payouts. This documentation covers authentication, all API endpoints,
error handling, and SDK usage.

## Getting Started

- [Quickstart](https://docs.acme.com/quickstart): Process your first payment
  in under 5 minutes. Covers API key setup, a test charge, and response handling.
- [Core Concepts](https://docs.acme.com/concepts): Mental model for Acme's data
  objects (charges, customers, subscriptions, payment methods) and how they relate.

## Authentication

- [API Keys](https://docs.acme.com/auth/api-keys): Creating and rotating API keys,
  test vs live mode, key scoping for least-privilege access.
- [OAuth 2.0](https://docs.acme.com/auth/oauth): Implementing OAuth for third-party
  integrations. Authorization code flow, refresh tokens, and scopes reference.
- [Webhook Signatures](https://docs.acme.com/auth/webhooks): Verifying webhook
  payloads using HMAC-SHA256. Required for production webhook security.

## API Reference

- [Charges](https://docs.acme.com/api/charges): Create, capture, and refund charges.
  Full parameter reference and response schema.
- [Customers](https://docs.acme.com/api/customers): Customer object CRUD operations,
  payment method attachment, and customer portal configuration.
- [Subscriptions](https://docs.acme.com/api/subscriptions): Subscription lifecycle,
  proration, trial periods, and cancellation handling.
- [Webhooks](https://docs.acme.com/api/webhooks): Event types reference, payload
  schemas, retry behavior, and testing with the CLI.

## SDKs

- [Node.js SDK](https://docs.acme.com/sdk/node): Installation, initialization,
  and complete method reference for the official Node.js library.
- [Python SDK](https://docs.acme.com/sdk/python): Installation and method reference
  for the official Python library.

## About

- [Company](https://acme.com/about): Acme Inc. is a YC-backed payments infrastructure
  company founded in 2021, processing $2B+ annually.
- [Status](https://status.acme.com): Real-time API uptime and incident history.
```

### Content/Marketing site

```markdown
# Acme Marketing Blog

> Data-driven marketing strategies and case studies for B2B SaaS companies.

## Popular Guides

- [Email Deliverability Guide](https://acme.com/guides/email-deliverability): Complete
  guide to improving inbox placement rates, covering SPF/DKIM/DMARC setup,
  list hygiene, and warm-up strategies.
- [SaaS Pricing Playbook](https://acme.com/guides/saas-pricing): Framework for
  value-based pricing, packaging strategies, and pricing page optimization with
  A/B test data from 50+ SaaS companies.

## Research & Data

- [2024 B2B Marketing Report](https://acme.com/research/2024-b2b-marketing): Annual
  survey of 500 B2B marketing leaders on budget allocation, channel performance,
  and AI tool adoption.

## About

- [About Acme](https://acme.com/about): Marketing analytics platform helping
  B2B SaaS companies attribute revenue to content and campaigns.
```

---

## Adoption status and AI engine support

As of early 2025:

- **Anthropic (Claude)**: Has stated support for the `llms.txt` concept and crawls
  these files. Claude's web browsing uses llms.txt as a navigation signal.
- **OpenAI (ChatGPT)**: No official statement, but GPTBot crawls and likely processes
  the files as structured text.
- **Perplexity**: PerplexityBot crawls llms.txt files and the team has indicated
  awareness of the spec.
- **Google**: No official statement as of early 2025. Googlebot indexes the file as
  a regular crawled page, but specific llms.txt-aware behavior in AI Overviews has
  not been confirmed.
- **Developer tools** (GitHub Copilot, Cursor, Codeium): Several AI coding tools
  have implemented llms.txt support for loading documentation context.

<!-- VERIFY: Individual AI engine adoption statements are based on blog posts and
     public statements from late 2024. Verify current support at llmstxt.org or
     each engine's developer documentation. -->

**Spec home:** The canonical spec and a registry of sites with llms.txt are maintained
at `https://llmstxt.org` (community site, not a formal standards body).
