---
name: skill-forge
description: >
  Generate a production-ready AbsolutelySkilled skill from any source: GitHub repos,
  documentation URLs, or domain topics (marketing, sales, TypeScript, etc.). Triggers
  on /skill-forge, "create a skill for X", "generate a skill from these docs", "make
  a skill for this repo", "build a skill about marketing", or "add X to the registry".
  For URLs: performs deep doc research (README, llms.txt, API references). For domains:
  runs a brainstorming discovery session with the user to define scope and content.
  Outputs a complete skill/ folder with SKILL.md, evals.json, and optionally
  sources.yaml, ready to PR into the AbsolutelySkilled registry.
---

# skill-forge

Generate production-ready AbsolutelySkilled skills from any source - GitHub repos,
documentation URLs, or pure domain knowledge (marketing, sales, TypeScript, design
patterns, etc.). This is the bootstrapping tool for the registry.

---

## Slash command

Register as a slash command:

```
/skill-forge <url-or-topic>
```

Where `<url-or-topic>` is a GitHub repo URL, docs site URL, or a domain topic
(e.g. "marketing", "typescript", "sales", "design-patterns").

---

## Step 0 - Detect input type

Classify the input to determine which Phase 1 path to follow:

- **URL input** (starts with `http`, `github.com`, or looks like a domain) ->
  Phase 1A (doc crawl)
- **Domain topic** (a word or phrase like "marketing", "sales strategy",
  "typescript best practices") -> Phase 1B (brainstorm discovery)

If ambiguous, ask the user: "Is this a URL I should crawl, or a domain topic
I should brainstorm with you about?"

---

## Phase 1A - Research (URL-based)

Before writing a single line of SKILL.md, do a thorough crawl. The quality of the
skill is entirely determined by the depth of research here.

### 1A.1 Crawl order (priority high to low)

For every URL provided, attempt to fetch these in order. Stop fetching a category
once you have good coverage - don't fetch 20 pages if 5 give you the full picture.

```
1. /llms.txt          - curated AI-readable doc map (gold if it exists)
2. /llms-full.txt     - extended version with full content
3. README.md          - top-level overview, install, quickstart
4. /docs or /docs/    - main documentation index
5. API reference      - endpoints, parameters, error codes
6. Guides / tutorials - real-world usage patterns
7. Changelog          - recent breaking changes, versioning info
8. GitHub repo        - if given a docs URL, find the repo too
```

### 1A.2 For GitHub repos specifically

```
github.com/org/repo  ->  fetch in this order:
  /README.md
  /docs/ (index any .md files found)
  /CHANGELOG.md or /CHANGELOG
  Any file named llms.txt, llms-full.txt, or ai-docs.md at root
  Look for /docs/api/ or similar for API reference
```

### 1A.3 Discovery heuristics

While crawling, build a mental model by answering these six questions:

1. **What does this tool do?** (1 sentence)
2. **Who uses it?** (developers, data scientists, devops, etc.)
3. **What are the 5-10 most common tasks** someone would use an agent to do with
   this tool?
4. **What are the gotchas?** (auth patterns, rate limits, pagination, SDK quirks,
   version differences)
5. **What's the install/auth story?** (env vars, API keys, SDK vs REST)
6. **Are there multiple sub-domains?** (e.g. Stripe has Payments, Billing, Connect,
   Radar - each might need a separate references/ file)

### 1A.4 Uncertainty handling

When the docs are ambiguous or missing detail, make a best guess and flag it with
an inline comment. Never leave a section blank or skip it.

Use this comment syntax inside SKILL.md:

```markdown
<!-- VERIFY: Could not confirm from official docs - best guess based on
     common SDK patterns. Source: https://... -->
```

Aim for < 5 flagged items per skill. If you're flagging more than 5, you haven't
crawled enough - go back and fetch more pages.

---

## Phase 1B - Brainstorm Discovery (domain-based)

For domain topics without a single canonical URL, run an interactive brainstorm
session with the user. Use the brainstorming skill's approach: ask questions one
at a time, explore scope, then synthesize.

<HARD-GATE>
Do NOT write any SKILL.md content until the brainstorm is complete and the user
has approved the scope. Even "obvious" topics need scoping - "TypeScript" could
mean best practices, advanced patterns, migration guides, or project setup.
</HARD-GATE>

### 1B.1 Scope the domain

Ask these questions **one at a time** (prefer multiple choice when possible):

1. **What's the target audience?** Who will use this skill - beginners, senior
   engineers, marketers, sales reps, designers?
2. **What's the scope?** Is this broad (all of marketing) or narrow (email
   marketing campaigns)? Offer 2-3 scope options with your recommendation.
3. **What are the 5-8 most important things** an agent should know to be
   genuinely useful in this domain? Ask the user to list or confirm your proposal.
4. **What are the common mistakes** people make in this domain that the skill
   should prevent?
5. **Are there sub-domains** that deserve their own references/ files? E.g.
   "marketing" might split into content-marketing, paid-ads, analytics.
6. **What's the output format?** Will the agent produce code, prose, templates,
   checklists, strategies, or a mix?

### 1B.2 Propose skill structure

After gathering answers, present a proposed skill outline to the user:

```
Proposed skill: <name>
Target audience: <who>
Scope: <what's in, what's out>

SKILL.md sections:
  1. Overview
  2. When to use
  3. Key principles (replaces "Setup & auth" for non-code skills)
  4. Core concepts / mental model
  5. Common tasks (5-8)
  6. Anti-patterns / common mistakes
  7. References

references/ files:
  - <topic-1>.md
  - <topic-2>.md
```

Wait for the user to approve or revise before proceeding.

### 1B.3 Gather domain knowledge

Once scope is approved, build the skill content from:

1. **Your training knowledge** - leverage what you know about the domain
2. **Web research** (optional) - if the user points to specific articles,
   frameworks, or methodologies, fetch those URLs
3. **User expertise** - ask follow-up questions on specifics where your
   knowledge might be generic or outdated

### 1B.4 Uncertainty handling

Same as 1A.4 - use `<!-- VERIFY -->` comments for uncertain claims. For
domain skills, flag things like:

```markdown
<!-- VERIFY: This conversion rate benchmark (2-5% for email) is based on
     general industry data. May vary significantly by vertical. -->
```

---

## Phase 2 - Write SKILL.md

Write the canonical SKILL.md using the required schema and structure.
Every section is required unless marked optional.

### Frontmatter

See `references/frontmatter-schema.md` for the full YAML template, description
writing guidelines, and category taxonomy.

Key rules:
- `name`: kebab-case tool name
- `version`: start at `0.1.0`
- `description`: one tight paragraph answering what triggers this skill, what the
  tool does, and the 3-5 most common agent tasks. This is the PRIMARY triggering
  mechanism - be specific. Include tool name, common synonyms, and key verbs.
- All other fields: see the reference file for the complete list

### Body structure

See `references/body-structure-template.md` for the full markdown scaffold with
target lengths per section.

Required sections in order (adapt based on skill type):

**For URL-based / code skills:**
1. Title + overview paragraph (3-5 sentences, distinct from frontmatter description)
2. When to use this skill (5-8 trigger bullets + 2 anti-triggers)
3. Setup and authentication (env vars, install, basic init)
4. Core concepts (2-5 paragraphs on the domain model)
5. Common tasks (5-8 subsections with working code examples)
6. Error handling (3-5 most common errors in a table)
7. References (pointer to references/ folder with when-to-read guidance)

**For domain-based / knowledge skills:**
1. Title + overview paragraph (3-5 sentences)
2. When to use this skill (5-8 trigger bullets + 2 anti-triggers)
3. Key principles (replaces "Setup & auth" - 3-5 foundational rules of the domain)
4. Core concepts / mental model (the domain's key entities and how they relate)
5. Common tasks (5-8 subsections - may use prose, templates, checklists, or
   frameworks instead of code examples)
6. Anti-patterns / common mistakes (replaces "Error handling" - what to avoid)
7. References (pointer to references/ folder with when-to-read guidance)

Principles:
- For code skills: all code examples must be syntactically valid
- For domain skills: all advice must be actionable, not generic platitudes
- Use imperative/infinitive form throughout
- Keep SKILL.md under 300 lines when possible (hard limit 500)
- If approaching 300 lines, move detail to references/ files

---

## Phase 3 - Write references/

For any sub-domain too detailed for the main SKILL.md body, create a focused file
in `references/`. Each file should be:

- Under 400 lines
- Focused on one topic (auth, webhooks, a specific API sub-section, etc.)
- Fetched only when relevant (agent loads it on demand)

**When to create a references/ file:**
- The topic has more than ~10 API endpoints
- The topic requires its own mental model (e.g. Stripe Connect vs Stripe Payments)
- It would bloat SKILL.md past 300 lines if included inline

**Naming:**
```
references/
  api.md          - core REST/GraphQL API reference
  webhooks.md     - event payloads and verification
  auth.md         - detailed auth flows (if complex)
  <feature>.md    - any major sub-feature
```

**Header comment** - every references file must start with:

```markdown
<!-- Part of the <ToolName> AbsolutelySkilled skill. Load this file when
     working with <topic>. -->
```

---

## Phase 4 - Write evals.json

Write a test suite that validates the skill works correctly. Each eval tests whether
an agent using this skill can answer a real question correctly.

See `references/evals-schema.md` for the full JSON schema, assertion types, and a
worked example eval entry.

**Coverage targets - write 10-15 evals covering:**

| Type | Count | What to test |
|---|---|---|
| Trigger test | 2-3 | Does the skill activate for on-topic prompts? |
| Core task | 4-5 | Can it produce correct code for the main tasks? |
| Gotcha / edge case | 2-3 | Does it handle auth errors, pagination, rate limits? |
| Anti-hallucination | 1-2 | Does it avoid inventing API methods that don't exist? |
| References load | 1 | Does it correctly reference a references/ file? |

---

## Phase 5 - Write sources.yaml

Track crawl provenance so humans can verify and update the skill later.

See `references/sources-schema.md` for the full YAML schema. Key rules:
- All URLs must be from official documentation only
- No Stack Overflow, blog posts, or community wikis
- One entry per source crawled with `type`, `description`, and `accessed` date

**For domain-based skills:** sources.yaml is optional. If you fetched specific
URLs during Phase 1B.3, include them. If the skill is purely from training
knowledge and user input, omit sources.yaml entirely.

---

## Phase 6 - Output structure

Always write output to `skills/<skill-name>/` in the project root. This is
the canonical location for all skills - never use a temporary output directory.

```
skills/<skill-name>/
  SKILL.md           <- canonical skill (Phase 2)
  sources.yaml       <- crawl provenance (Phase 5, optional for domain skills)
  evals.json         <- test suite (Phase 4)
  references/        <- deep reference files (Phase 3, if needed)
    <topic>.md
```

Print a summary when done:

```
Skill generated: <tool-name>/

  SKILL.md          <N> lines
  sources.yaml      <N> sources crawled
  evals.json        <N> evals written
  references/       <N> files

Flagged items requiring human review:
  1. SKILL.md:47  - webhook signature verification method unconfirmed
  2. evals.json:23 - rate limit value (100 req/min) is a best guess

Next steps:
  1. Review flagged items above
  2. Run: npx @askilled/cli validate ./<tool-name>/
  3. Open a PR to github.com/AbsolutelySkilled/skills
```

---

## Quality checklist

Before outputting, verify all of these:

- [ ] Every frontmatter field is populated (no empty strings)
- [ ] Description is specific - includes skill name + 3 key task types
- [ ] For URL skills: all sources in sources.yaml are from official docs only
- [ ] For domain skills: user approved the scope before writing began
- [ ] Code examples (if any) are syntactically valid; domain advice is actionable
- [ ] Evals cover all 5 type categories (trigger, task, gotcha, anti-hallucination, reference)
- [ ] Flagged items use the `<!-- VERIFY: -->` comment format
- [ ] references/ files each have the header comment
- [ ] Output summary is printed

---

## References

Consult these files for detailed schemas and examples. Only load a file when
you need it for the current phase.

- `references/frontmatter-schema.md` - Full YAML template and category taxonomy (read during Phase 2)
- `references/body-structure-template.md` - Complete markdown body scaffold (read during Phase 2)
- `references/evals-schema.md` - JSON schema, assertion types, worked example (read during Phase 4)
- `references/sources-schema.md` - YAML schema for sources.yaml (read during Phase 5)
- `references/worked-example.md` - Resend end-to-end worked example (read for first-time orientation)
- `references/skill-registry.md` - Full catalog of existing and planned skills by category (read when choosing what to build next or checking for duplicates)
