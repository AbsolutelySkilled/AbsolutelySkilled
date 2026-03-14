<!-- Part of the second-brain AbsolutelySkilled skill. Load this file when onboarding
     a new user or bootstrapping the ~/.memory/ structure for the first time. -->

# Onboarding - First-Run Setup

## Detection logic

Check these conditions to determine if onboarding is needed:
1. Does `~/.memory/` directory exist?
2. Does `~/.memory/index.yaml` exist?
3. Does `~/.memory/profile.md` exist?

If any are missing, trigger onboarding. If all exist but index.yaml is empty
or malformed, offer to rebuild (see `maintenance.md`).

---

## The 7 onboarding questions

Ask these questions sequentially. Each question seeds a specific part of the
memory structure. Adapt follow-ups based on answers.

### Question 1: Work domains

> "What are your primary work domains? (e.g., software engineering, marketing,
> data science, design, product management, writing, devops)"

**Purpose**: Seeds the top-level directory structure. Each domain becomes a
category directory in ~/.memory/.

**Follow-up**: If they list more than 5, ask them to pick the top 3-5 they
work in most frequently. Others can be added later organically.

### Question 2: Tools, languages, and frameworks

> "What tools, languages, and frameworks do you use most regularly?"

**Purpose**: Creates initial tags and topic files within categories. "React,
TypeScript, PostgreSQL" creates `coding/react.md`, `coding/typescript.md`,
`coding/postgresql.md` with basic tag entries.

**Follow-up**: Group their answers into the domains from Question 1. Ask for
clarification if a tool spans multiple domains.

### Question 3: Communication style

> "How do you prefer AI agents to communicate with you? (e.g., direct and
> concise, detailed explanations, code-first with minimal prose, casual,
> formal)"

**Purpose**: Stored in `profile.md` under Communication Preferences. Agents
load this to calibrate their response style.

### Question 4: Active projects

> "What are your current active projects? Just names and a one-line description
> each."

**Purpose**: Creates context mappings for relevance matching - helps the agent
know which memories are relevant when working in a specific project. Does NOT
create project-specific memory (that belongs in CLAUDE.md).

**Stored in**: `profile.md` under Active Projects. Updated as projects change.

### Question 5: Workflows and processes

> "What workflows or processes do you follow? (e.g., git branching strategy,
> PR review process, testing philosophy, deployment approach, writing process)"

**Purpose**: Stored in relevant category files. "I use conventional commits
and squash-merge PRs" goes into `coding/workflows.md` or similar.

### Question 6: Learning goals

> "What areas are you currently learning or growing in?"

**Purpose**: Helps the agent prioritize what to remember from future sessions.
If the user is learning Rust, the agent should be more proactive about saving
Rust-related learnings. Stored in `profile.md` under Learning Goals.

### Question 7: Golden rules

> "Any strong preferences or things you always want AI agents to know about
> you? These are your non-negotiable rules."

**Purpose**: The highest-priority memories. Things like "never use semicolons
in JS", "always use TypeScript strict mode", "I hate ORMs", "prefer functional
over OOP". Stored in `profile.md` under Golden Rules - these are loaded in
almost every session via profile.md.

---

## Bootstrapping the directory structure

After collecting answers, create the following structure:

### Step 1: Create ~/.memory/ directory

```
mkdir -p ~/.memory
```

### Step 2: Create profile.md

```markdown
---
tags: [profile, identity, preferences]
created: "<today>"
updated: "<today>"
links: []
---

# User Profile

## Work Style
- Primary domains: <from Q1>
- Core tools: <from Q2>

## Communication Preferences
- <from Q3>

## Active Projects
- <project>: <one-line description> (from Q4)

## Workflows
- <key workflow items from Q5>

## Learning Goals
- <from Q6>

## Golden Rules
- <from Q7 - these are non-negotiable>
```

### Step 3: Create category directories

For each domain from Q1, create:
```
~/.memory/<domain>/index.md
```

Category index.md template:
```markdown
---
tags: [<domain>]
created: "<today>"
updated: "<today>"
links: []
---

# <Domain> Memory

Overview of <domain>-related knowledge and preferences.

## Topics
- [[<domain>/<topic>.md]] - <brief description>
```

### Step 4: Create initial topic files

For each tool/framework from Q2, create a topic file in the matching category:
```markdown
---
tags: [<tool-name>, <category>]
created: "<today>"
updated: "<today>"
links:
  - "[[<category>/index.md]]"
---

# <Tool Name>

<Any initial preferences or knowledge from the onboarding answers>
```

### Step 5: Create index.yaml

```yaml
version: 1
last_updated: "<today>T<now>Z"
categories:
  - name: <domain-1>
    path: <domain-1>/
    topics: [<topic-1>, <topic-2>]
  - name: <domain-2>
    path: <domain-2>/
    topics: [<topic-3>]
tags:
  <tag-1>: [<file-path-1>, <file-path-2>]
  <tag-2>: [<file-path-3>]
  profile: [profile.md]
files:
  profile.md:
    tags: [profile, identity, preferences]
    lines: <count>
    updated: "<today>T<now>Z"
  <domain>/<topic>.md:
    tags: [<tag-1>, <tag-2>]
    lines: <count>
    updated: "<today>T<now>Z"
```

---

## Worked example

**User answers:**
1. Domains: software engineering, marketing
2. Tools: React, TypeScript, Node.js, Mailchimp
3. Style: "Direct and concise, code-first"
4. Projects: "SaaS dashboard (Next.js app)", "Newsletter growth project"
5. Workflows: "Conventional commits, PR reviews, TDD"
6. Learning: "Rust, advanced CSS animations"
7. Golden rules: "Always use TypeScript strict mode", "Never use default exports"

**Resulting structure:**
```
~/.memory/
  index.yaml
  profile.md
  coding/
    index.md
    react.md
    typescript.md
    nodejs.md
  marketing/
    index.md
    mailchimp.md
```

**profile.md would contain:**
- Work Style: software engineering + marketing, React/TS/Node/Mailchimp
- Communication: Direct, concise, code-first
- Active Projects: SaaS dashboard (Next.js), Newsletter growth
- Workflows: Conventional commits, PR reviews, TDD
- Learning Goals: Rust, advanced CSS animations
- Golden Rules: Always TypeScript strict mode, never default exports

---

## Edge cases

**Multi-domain users** - Create separate category directories. Use tags for
cross-domain connections. A user doing both "marketing analytics" and "data
engineering" might have `[[marketing/analytics.md]]` linking to
`[[coding/data-pipelines.md]]`.

**Uncertain answers** - Create a minimal structure with just profile.md and
one or two categories. The memory will grow organically as the user works.
Don't force categories that feel uncertain.

**Importing existing notes** - If the user has existing knowledge in other
formats, help them restructure into the memory format: add YAML frontmatter,
split into sub-100-line files, assign tags, and build the index.yaml.
