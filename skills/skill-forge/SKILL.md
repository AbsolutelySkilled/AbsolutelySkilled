---
name: skill-forge
version: 0.3.0
description: >
  Generate a production-ready AbsolutelySkilled skill from any source: GitHub repos,
  documentation URLs, or domain topics (marketing, sales, TypeScript, etc.). Triggers
  on /skill-forge, "create a skill for X", "generate a skill from these docs", "make
  a skill for this repo", "build a skill about marketing", or "add X to the registry".
  For URLs: performs deep doc research (README, llms.txt, API references). For domains:
  runs a brainstorming discovery session with the user to define scope and content.
  Outputs a complete skill/ folder with SKILL.md, evals.json, and optionally
  sources.yaml, ready to PR into the AbsolutelySkilled registry.
category: devtools
tags: [skill-creation, code-generation, scaffolding, registry, agent-skills]
recommended_skills: []
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
license: MIT
maintainers:
  - github: maddhruv
hooks:
  - type: PreToolUse
    matcher: Write
    hook: |
      # Block writing SKILL.md files that exceed 500 lines
      if echo "$TOOL_INPUT" | grep -q "SKILL.md"; then
        LINE_COUNT=$(echo "$TOOL_INPUT" | jq -r '.content' | wc -l)
        if [ "$LINE_COUNT" -gt 500 ]; then
          echo "BLOCK: SKILL.md exceeds 500 lines ($LINE_COUNT). Move detail to references/ files."
          exit 1
        fi
      fi
---

When this skill is activated, always start your first response with the 🔨 emoji.

# skill-forge

Generate production-ready AbsolutelySkilled skills from any source - GitHub repos,
documentation URLs, or pure domain knowledge. This is the bootstrapping tool for the
registry.

A common misconception is that skills are "just markdown files." That undersells
them significantly. A skill is a **folder, not a file**. It can contain markdown
instructions, scripts, reference code, data files, templates, configuration -
anything an agent might need to do its job well. SKILL.md is the entry point that
tells the agent what the skill does and when to use it. But the real power comes
from the supporting files - reference docs give deeper context, scripts let it
take action, templates give it a head start on output.

---

## Slash command

```
/skill-forge <url-or-topic>
```

---

## Setup

On first run, check for `${CLAUDE_PLUGIN_DATA}/forge-config.json`. If it doesn't
exist, ask the user these questions (use AskUserQuestion with multiple choice):

1. **Default output directory** - `skills/` (registry PR) or custom path?
2. **Skill type preference** - code-heavy, knowledge-heavy, or balanced?

Store answers in `${CLAUDE_PLUGIN_DATA}/forge-config.json`. Read this config at the
start of every forge session.

---

## Forge history

After every successful forge, append an entry to `${CLAUDE_PLUGIN_DATA}/forge-log.jsonl`:

```json
{"skill": "api-design", "type": "domain", "date": "2025-01-15", "lines": 245, "refs": 3, "evals": 12}
```

Read this log at the start of each session. It helps you:
- Avoid creating duplicate skills
- Reference patterns from previously forged skills
- Track which categories are over/under-represented

---

## Step 0 - Detect input type

- **URL input** (starts with `http`, `github.com`, or looks like a domain) -> Phase 1A
- **Domain topic** (a word or phrase) -> Phase 1B
- **Ambiguous** -> ask the user

---

## Phase 1A - Research (URL-based)

The quality of the skill is entirely determined by the depth of research here.
Do not write a single line of SKILL.md until research is complete.

### Crawl order (priority high to low)

```
1. /llms.txt or /llms-full.txt   - AI-readable doc map (gold)
2. README.md                      - overview, install, quickstart
3. /docs/                         - main documentation index
4. API reference                  - endpoints, params, errors
5. Guides / tutorials             - real-world usage patterns
6. Changelog                      - breaking changes, versioning
```

Stop fetching a category once you have good coverage - 5 pages that give the full
picture beats 20 pages of marginal detail.

### Discovery questions

While crawling, answer these six questions - they form your mental model:

1. What does this tool do? (1 sentence)
2. Who uses it?
3. What are the 5-10 most common agent tasks?
4. What are the gotchas? (auth, rate limits, pagination, SDK quirks)
5. What's the install/auth story?
6. Are there sub-domains needing separate references/ files?

### Uncertainty handling

Flag ambiguous or missing detail inline - never skip a section:

```markdown
<!-- VERIFY: Could not confirm from official docs. Source: https://... -->
```

Aim for < 5 flags. More than 5 means you haven't crawled enough.

---

## Phase 1B - Brainstorm Discovery (domain-based)

For domain topics, run an interactive brainstorm with the user.

**HARD GATE:** Do NOT write any SKILL.md until the user approves the scope.
"TypeScript" could mean best practices, migration guides, or project setup.

Ask these questions **one at a time** (use multiple choice when possible):

1. Target audience?
2. Scope? (offer 2-3 options with your recommendation)
3. Top 5-8 things an agent should know?
4. Common mistakes to prevent?
5. Sub-domains needing their own references/ files?
6. Output format? (code, prose, templates, checklists, or mix)

Present a proposed outline. Wait for approval before proceeding.

---

## Phase 2 - Write SKILL.md

Read `references/frontmatter-schema.md` for YAML fields and
`references/body-structure-template.md` for the markdown scaffold.

### Key principles for writing

**Focus on the delta - what the agent does NOT know.** The agent already knows a
lot about coding and common patterns. If a skill mostly restates common knowledge,
it wastes context tokens. Focus on information that pushes the agent outside its
defaults - non-obvious conventions, where the "standard" approach breaks down,
domain quirks that trip up even experienced developers.

**The description field is a trigger condition, not a summary.** The agent scans
every available skill's description at session start to decide which are relevant.
Write it as a when-to-trigger condition with specific tool names, synonyms, action
verbs, and common task types. A vague "Helps with deployment" will never fire. A
specific "Use when deploying services to production, running canary releases,
checking deploy status, or rolling back failed deploys" will.

**Build the Gotchas section first.** This is the highest-value content in any
skill. Start with 3-5 known failure points from actual usage. Expect this section
to grow over time as new edge cases appear. A mature skill's gotchas section is
its most valuable asset. Put gotchas inline next to the relevant task, not in a
separate section users might skip.

**Use progressive disclosure.** Don't dump everything into one massive SKILL.md.
Tell the agent what files are available and let it read them when needed. This
keeps initial context small (cheaper, faster) while making deep knowledge
available on demand. The agent is good at deciding when it needs more context.

**Give flexibility, not rails.** Because skills are reusable across many
situations, being too prescriptive backfires. Give the agent the *information* it
needs, but let it decide *how* to apply it. "Tests should cover unit, integration,
and e2e scenarios as appropriate" beats "Always create exactly 3 test files with
at least 5 functions each."

**Include scripts and composable code.** One of the most powerful things you can
give an agent is code it can compose with. Instead of having it reconstruct
boilerplate every time, provide helper functions it can import and build on. A
data-science skill with `fetch_events.py` beats one with 200 lines explaining
how to query your event source.

**Think through the setup.** Some skills need user-specific configuration. Good
pattern: store setup info in a `config.json` in the skill directory. If the config
doesn't exist, the agent asks the user for it on first run. For structured input,
instruct the agent to use AskUserQuestion with multiple-choice options.

**Consider memory and logging.** Some skills benefit from remembering what happened
in previous runs. A standup skill might keep a log of every post. A deploy skill
might track recent deploys. Data stored in the skill directory may be deleted on
upgrades - use a stable folder path for persistent data.

**Register on-demand hooks when appropriate.** Skills can register hooks that are
only active when the skill is invoked. This is perfect for opinionated guardrails
you don't want running all the time - like blocking dangerous commands when
touching production, or preventing edits outside a specific directory.

### After writing

Run `scripts/validate-skill.sh <path-to-skill-dir>` to check structure and
catch common issues before finalizing.

---

## Phase 3 - Write references/

Create a references/ file when:
- A topic has more than ~10 API endpoints
- A topic needs its own mental model (e.g. Stripe Connect vs Payments)
- Including it inline would push SKILL.md past 300 lines

Every references file must start with:

```markdown
<!-- Part of the <ToolName> AbsolutelySkilled skill. Load this file when
     working with <topic>. -->
```

Consider adding these non-markdown files when they'd help the agent:
- **Scripts** (`scripts/`) - validation, setup, code generation helpers
- **Templates** (`assets/`) - output templates the agent can copy and fill
- **Data** (`data/`) - lookup tables, enum lists, config schemas as JSON/YAML
- **Examples** (`examples/`) - complete working code the agent can reference

---

## Phase 4 - Write evals.json

Read `references/evals-schema.md` for the JSON schema and worked examples.

Write 10-15 evals covering: trigger tests (2-3), core tasks (4-5),
gotcha/edge cases (2-3), anti-hallucination (1-2), references load (1).

---

## Phase 5 - Write sources.yaml

Read `references/sources-schema.md` for the YAML schema.
Only for URL-based skills. Domain skills can omit this if purely from
training knowledge and user input.

---

## Phase 6 - Output

Write to `skills/<skill-name>/` (or the path from forge-config.json).

```
skills/<skill-name>/
  SKILL.md
  sources.yaml       (optional for domain skills)
  evals.json
  references/        (if needed)
  scripts/           (if needed)
  assets/            (if needed)
```

Print a summary and append to forge-log.jsonl.

---

## Gotchas

These are the most common failure points when forging skills. Update this list
as new patterns emerge. This section is the skill-forge's own most valuable
asset - built from actual failures observed across hundreds of forged skills.

1. **Description too vague** - "A skill for testing" will never trigger. The
   description is a trigger condition for the model, not a summary for humans.
   Include the tool name, 3-5 task types, common synonyms, and action verbs.
   This is the #1 reason skills don't activate.

2. **Stuffing everything into SKILL.md** - If you're past 300 lines, you're
   doing it wrong. Move detail to references/ files. The agent reads them on
   demand - trust the progressive disclosure. Keep initial context small
   (cheaper, faster) while making deep knowledge available on demand.

3. **Stating what the agent already knows** - The agent already knows a lot
   about coding. Don't explain how REST APIs work or what JSON is. Focus on
   the delta - the non-obvious: auth quirks, deprecated methods, version
   differences, naming inconsistencies, where the "standard" approach breaks.

4. **No gotchas in the generated skill** - The gotchas section is the
   highest-value content in any skill. Every skill should have inline gotchas
   next to relevant tasks. "This method requires amount in cents, not dollars"
   saves more time than 50 lines of API docs. Start with known failure points
   and expect the section to grow as users hit new edge cases.

5. **Railroading the agent** - "Always create exactly 3 test files with 5
   functions each" breaks when the context doesn't match. Give the agent the
   *information* it needs, but let it decide *how* to apply it. Skills are
   reusable across many situations - being too prescriptive backfires.

6. **Forgetting the folder is the skill** - SKILL.md is just the entry point.
   Scripts, templates, data files, and examples are what make a skill genuinely
   useful. Provide helper functions the agent can import and compose with.
   A data-science skill with `fetch_events.py` beats one with 200 lines
   explaining how to query your event source.

7. **Not checking for duplicates** - Always read `references/skill-registry.md`
   before forging. Redundant skills fragment the registry.

8. **Generic domain advice** - For knowledge skills, "write good copy" is
   useless. "Use the PAS framework: Problem, Agitate, Solution" is actionable.
   Every piece of advice should be specific enough to act on immediately.

9. **Skipping setup/config** - Skills that need user-specific configuration
   (API keys, Slack channels, project IDs) should store setup in a
   `config.json`. If the config doesn't exist, the agent should ask on first
   run. Don't hardcode values that vary per user.

10. **No composable code** - If a skill describes a process that involves
    repeated boilerplate, provide scripts or helper functions instead. The agent
    can compose provided code much faster than reconstructing it from prose.

---

## Quality checklist

- [ ] Description is a trigger condition (tool name + 3-5 task types + synonyms + action verbs)
- [ ] Gotchas are present, inline next to relevant tasks, and built from actual failure points
- [ ] SKILL.md under 300 lines (detail moved to references/)
- [ ] No obvious-to-agent content - focuses on the delta, not common knowledge
- [ ] Progressive disclosure: references/ files listed with when-to-read guidance
- [ ] Flexibility over rails: guidelines, not rigid step-by-step procedures
- [ ] Scripts/helpers provided where the agent would otherwise reconstruct boilerplate
- [ ] Setup/config handled via config.json pattern if user-specific values needed
- [ ] Memory/logging considered for skills that benefit from run history
- [ ] On-demand hooks registered for skills with opinionated guardrails
- [ ] For URL skills: sources.yaml has only official doc URLs
- [ ] For domain skills: user approved scope before writing
- [ ] Evals cover all 5 categories
- [ ] Flagged items use `<!-- VERIFY: -->` format
- [ ] Forge history log updated

---

## References

Load these files only when you need them for the current phase:

- `references/frontmatter-schema.md` - YAML template + category taxonomy (Phase 2)
- `references/body-structure-template.md` - Markdown body scaffold (Phase 2)
- `references/evals-schema.md` - JSON schema + worked example (Phase 4)
- `references/sources-schema.md` - YAML schema for sources (Phase 5)
- `references/worked-example.md` - Resend end-to-end example (first-time orientation)
- `references/skill-registry.md` - Full catalog of existing skills (duplicate check)
- `scripts/validate-skill.sh` - Structural validation for generated skills (Phase 2)

