<!-- Part of the second-brain AbsolutelySkilled skill. Load this file when creating,
     reading, or updating memory files in ~/.memory/. Contains the canonical
     format specs for all file types. -->

# Memory File Format Specification

## index.yaml schema

The master registry at `~/.memory/index.yaml`. Always read this first to
determine what memories exist and which to load.

```yaml
version: 1
last_updated: "2026-03-14T10:30:00Z"

categories:
  - name: coding
    path: coding/
    topics: [react, typescript, nodejs, testing]
  - name: marketing
    path: marketing/
    topics: [seo, email-marketing, analytics]

tags:
  react: [coding/react.md]
  typescript: [coding/typescript.md, coding/react.md]
  hooks: [coding/react.md]
  testing: [coding/react.md, coding/testing.md]
  seo: [marketing/seo.md]
  email: [marketing/email-marketing.md]
  profile: [profile.md]

files:
  profile.md:
    tags: [profile, identity, preferences]
    lines: 42
    updated: "2026-03-14T10:30:00Z"
  coding/react.md:
    tags: [react, frontend, hooks, components]
    lines: 67
    updated: "2026-03-14T10:30:00Z"
  coding/typescript.md:
    tags: [typescript, types, generics, strict-mode]
    lines: 38
    updated: "2026-03-12T15:00:00Z"
  marketing/seo.md:
    tags: [seo, content, keywords]
    lines: 25
    updated: "2026-03-10T09:00:00Z"
```

**Required fields:**
- `version`: Always `1` (for future schema migrations)
- `last_updated`: ISO 8601 timestamp of last index modification
- `categories`: List of top-level domains with directory path and topic list
- `tags`: Map of tag name to list of file paths containing that tag
- `files`: Map of file path to metadata (tags, line count, last updated)

**Update rules:**
- Update `last_updated` on every index modification
- Update `files.<path>.lines` whenever a memory file is written
- Update `files.<path>.updated` whenever a memory file is modified
- Add/remove entries in `tags` when files are created, deleted, or re-tagged

---

## Memory file format

Every `.md` file in ~/.memory/ (except index.yaml) follows this format:

```markdown
---
tags: [react, hooks, state-management]
created: "2026-03-14"
updated: "2026-03-14"
links:
  - "[[coding/typescript.md]]"
  - "[[coding/index.md]]"
---

# React Patterns

## Hooks preferences
- Always use useReducer for complex state over nested useState
- Custom hooks for any logic shared between 2+ components
- Never call hooks conditionally

## Component patterns
- Prefer function components exclusively
- Colocate styles with components
- Extract components when JSX exceeds 50 lines
```

### Frontmatter fields

| Field | Required | Format | Description |
|---|---|---|---|
| `tags` | Yes | List of lowercase, hyphenated strings | Used by index.yaml for lookup |
| `created` | Yes | ISO 8601 date (YYYY-MM-DD) | When this file was first created |
| `updated` | Yes | ISO 8601 date (YYYY-MM-DD) | When this file was last modified |
| `links` | No | List of `[[path]]` strings | Wiki-links to related memory files |
| `supersedes` | No | String (file path) | If this replaced an older memory |

### Content rules

- **Max 100 lines** per file (including frontmatter)
- Use markdown headers (##) to organize sub-topics within the file
- Write in terse, scannable format - bullet points over paragraphs
- This is a knowledge dump, not documentation - skip preambles and explanations
- Use concrete values, not vague descriptions ("8px spacing" not "appropriate spacing")
- One topic per file - if covering multiple topics, split into separate files

---

## Category index.md format

Each category directory has an `index.md` that serves as the category overview:

```markdown
---
tags: [coding]
created: "2026-03-14"
updated: "2026-03-14"
links: []
---

# Coding Memory

High-level coding preferences and cross-topic patterns.

## Topics
- [[coding/react.md]] - React patterns, hooks, component preferences
- [[coding/typescript.md]] - TypeScript config, type patterns, strict mode rules
- [[coding/testing.md]] - Testing philosophy, TDD approach, framework preferences

## Cross-cutting preferences
- Always prefer explicit over implicit
- Type safety over convenience
- Readable code over clever code
```

---

## profile.md format

Special file at ~/.memory/profile.md. Loaded as baseline context when no
specific memories match. Contains the user's identity and universal preferences.

```markdown
---
tags: [profile, identity, preferences]
created: "2026-03-14"
updated: "2026-03-14"
links: []
---

# User Profile

## Work Style
- Primary domains: software engineering, marketing
- Core tools: React, TypeScript, Node.js, Mailchimp

## Communication Preferences
- Direct and concise, code-first
- Minimal hand-holding, show the solution
- Use bullet points over long paragraphs

## Active Projects
- SaaS dashboard: Next.js app with Prisma + PostgreSQL
- Newsletter growth: Mailchimp automation project

## Learning Goals
- Rust systems programming
- Advanced CSS animations

## Golden Rules
- Always use TypeScript strict mode
- Never use default exports
- Conventional commits on all projects
- Prefer composition over inheritance
```

---

## Wiki-link resolution

Wiki-links use the format `[[relative/path/to/file.md]]` and always resolve
relative to the `~/.memory/` root.

Examples:
- `[[coding/react.md]]` resolves to `~/.memory/coding/react.md`
- `[[profile.md]]` resolves to `~/.memory/profile.md`
- `[[marketing/email/templates.md]]` resolves to `~/.memory/marketing/email/templates.md`

**Resolution rules:**
- Path is always relative to ~/.memory/ (never absolute)
- Extension (.md) is always included
- If a linked file doesn't exist, the link is stale - flag for cleanup
- When a file is moved or renamed, update all wiki-links pointing to it

---

## Conflict resolution strategy

When new information contradicts an existing memory:

1. **Detection** - Agent notices the contradiction when reading existing memory
   during a save or update operation
2. **Flagging** - Present both versions to the user:
   "Existing memory says X (from <date>). New information says Y. Which is correct?"
3. **Resolution** - User picks the correct version
4. **Update** - Write the correct version, set new `updated` timestamp
5. **Tracking** - Optionally add `supersedes: "<old-info-summary>"` in frontmatter

**Timestamp rule**: When in doubt and the user doesn't respond, newer information
is preferred but the agent should still flag the conflict for future review.
