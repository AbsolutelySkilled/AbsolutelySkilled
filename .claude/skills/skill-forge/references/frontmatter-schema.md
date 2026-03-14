<!-- Part of the skill-forge AbsolutelySkilled skill. Load this file when
     writing the YAML frontmatter for a new skill's SKILL.md. -->

# Frontmatter Schema

## Full YAML template

```yaml
---
name: <kebab-case-tool-name>
version: 0.1.0
description: >
  <One tight paragraph. Must answer: what triggers this skill, what the tool
  does, and the 3-5 most common agent tasks it enables. This is the PRIMARY
  triggering mechanism - be specific. Include tool name, common synonyms,
  and key verbs. E.g. "Use this skill when working with Stripe - payments,
  subscriptions, refunds, customers, webhooks, or billing. Triggers on any
  Stripe-related task including checkout sessions, payment intents, and
  invoice management.">
category: <see taxonomy below>
tags: [<3-6 lowercase tags>]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
  - mcp
sources:
  - url: <official docs URL>
    accessed: <YYYY-MM-DD>
    description: <what this source covers>
  # add one entry per source crawled
license: MIT
maintainers:
  - github: <your-handle>
---
```

## Description writing guidelines

The description is the PRIMARY triggering mechanism. It must:

1. Name the tool explicitly (e.g. "Stripe", "Resend", "Supabase")
2. List 3-5 concrete task types the skill enables
3. Include common synonyms and related terms users might say
4. Use action verbs: "create", "send", "manage", "configure", "deploy"
5. Be one paragraph, no line breaks

**Good example:**
> Use this skill when working with Stripe - payments, subscriptions, refunds,
> customers, webhooks, or billing. Triggers on any Stripe-related task including
> checkout sessions, payment intents, and invoice management.

**Bad example:**
> A skill for payment processing. (Too vague, no tool name, no task types)

## Category taxonomy

| Category | Use for |
|---|---|
| `payments` | Stripe, PayPal, Razorpay, Braintree |
| `cloud` | AWS, GCP, Azure, Vercel, Fly, Netlify |
| `databases` | Postgres, MongoDB, Redis, Supabase, Neon |
| `ai-ml` | OpenAI, Anthropic, HuggingFace, Replicate |
| `communication` | SendGrid, Twilio, Resend, Mailchimp |
| `devtools` | GitHub, Linear, Jira, Sentry, Notion |
| `design` | Figma, Canva, Framer |
| `auth` | Auth0, Clerk, Supabase Auth |
| `data` | dbt, Airflow, BigQuery, Snowflake |
| `infra` | Docker, Kubernetes, Terraform |
| `workflow` | Zapier, n8n, Temporal |
| `ecommerce` | Shopify, WooCommerce |
| `analytics` | Amplitude, Mixpanel, PostHog |
| `meta` | Skills about the registry itself |
| `cms` | Contentful, Sanity, Strapi |
| `storage` | S3, Cloudflare R2, Backblaze B2 |
| `monitoring` | Datadog, Grafana, PagerDuty |
| `marketing` | Content marketing, SEO, email campaigns, growth |
| `sales` | Sales strategy, outreach, CRM workflows, lead gen |
| `writing` | Technical writing, copywriting, documentation, comms |
| `engineering` | Best practices, patterns, code review, architecture |
| `product` | Product management, roadmaps, user research, specs |
| `operations` | Project management, process design, team workflows |

If a skill doesn't fit any category, use the closest match. Do not invent new
categories without updating this taxonomy.
