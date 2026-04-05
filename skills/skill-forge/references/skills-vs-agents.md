<!-- Part of the skill-forge AbsolutelySkilled skill. Load this file when
     the user's request is ambiguous between creating a skill vs an agent
     definition, or when you need to explain the distinction. -->

# Skills vs Agent Definitions: When to Create Which

## The core distinction

Skills and agent definitions serve fundamentally different purposes in the AI
agent ecosystem. Getting this wrong means building the wrong artifact.

| Aspect | Skill | Agent Definition |
|--------|-------|-----------------|
| What it is | Knowledge package (textbook/manual) | Execution context (specialist) |
| Standard | AgentSkills.io open standard | Claude Code specific |
| Portability | Works in Claude Code, Cursor, VS Code, Gemini CLI, 40+ tools | Tied to Claude Code |
| Context | Runs inline in main conversation | Always runs in isolated context window |
| Purpose | Extend capabilities with knowledge/instructions | Delegate tasks to a specialized assistant |
| File | `SKILL.md` in a folder | Agent definition file (YAML + markdown) |
| Invocation | `/skill-name` or auto-detect from description | Claude delegates, `@`-mention, or `--agent` flag |

**One-liner:** Skills tell the agent *what to know*. Agents define *who does the work*.

## AgentSkills.io open standard

The AgentSkills.io specification defines a portable skill format that works
across all compatible agent products. These are the **portable fields** -
any agent that supports the standard will understand them:

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Identifier (kebab-case, max 64 chars, must match directory name) |
| `description` | Yes | When to use this skill (max 1024 chars) - the trigger condition |
| `license` | No | License name or reference to bundled file |
| `compatibility` | No | Environment requirements (max 500 chars) |
| `metadata` | No | Arbitrary key-value pairs for additional info |
| `allowed-tools` | No | Space-delimited list of pre-approved tools (experimental) |

Skills following this spec work everywhere. Default to these fields unless the
skill genuinely needs platform-specific behavior.

## Claude Code extensions

Claude Code extends the AgentSkills spec with additional frontmatter fields.
These are **ignored by other agent products** - use them only when needed:

| Field | Purpose |
|-------|---------|
| `argument-hint` | Hint during `/` autocomplete for expected arguments |
| `disable-model-invocation` | Prevent Claude from auto-loading (manual `/invoke` only) |
| `user-invocable` | Set `false` to hide from slash menu (background knowledge only) |
| `model` | Override model when skill is active |
| `effort` | Effort level override (low, medium, high, max) |
| `context` | Set to `fork` to run in a subagent context instead of inline |
| `agent` | Which subagent type to use when `context: fork` |
| `hooks` | Lifecycle hooks scoped to skill's lifecycle |
| `paths` | Glob patterns for auto-activation on matching file paths |
| `shell` | Shell for inline commands (bash or powershell) |

**When to use Claude-specific fields:**
- `hooks` - for safety guardrails (e.g., blocking dangerous writes)
- `context: fork` - for heavy workloads that should run in isolation
- `disable-model-invocation` - for skills like `/deploy` that should only be manual
- `paths` - for auto-activating on specific file types

**Note:** AbsolutelySkilled registry also adds `category`, `tags`,
`recommended_skills`, `platforms`, `sources`, and `maintainers` - these are
registry metadata, not part of either the AgentSkills spec or Claude extensions.

## Agent definition format

Agent definitions create execution contexts with their own tools, permissions,
and system prompts. They use YAML frontmatter + markdown body, but the fields
are different from skills:

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Grep, Glob, Bash          # What tools the agent can use
disallowedTools: Write, Edit            # What tools are denied
model: sonnet                           # Model override
permissionMode: default                 # Permission checking behavior
maxTurns: 15                            # Maximum agentic turns
skills:                                 # Skills to preload
  - code-review-standards
  - error-handling-patterns
memory: project                         # Persistent memory scope
background: false                       # Whether to run in background
isolation: worktree                     # Git worktree isolation
---

You are a code reviewer. Analyze code and provide specific, actionable
feedback on quality, security, and best practices.
```

Agent definitions are stored in `.claude/agents/` (project) or
`~/.claude/agents/` (user-level). They are **not portable** across agent
products.

## Decision flowchart

Use this to determine whether the user needs a skill or an agent definition:

```
Is this primarily knowledge, instructions, or best practices?
  YES -> Create a SKILL
  NO  -> Continue...

Does it need to run in an isolated context window?
  YES -> Create an AGENT DEFINITION
  NO  -> Continue...

Does it need specific tool permissions (allow/disallow certain tools)?
  YES -> Create an AGENT DEFINITION
  NO  -> Continue...

Does it need to be portable across Claude Code, Cursor, VS Code, etc.?
  YES -> Create a SKILL
  NO  -> Continue...

Does it need its own model, maxTurns, or permission mode?
  YES -> Create an AGENT DEFINITION
  NO  -> Create a SKILL (the default)
```

**When in doubt, create a skill.** Skills are the more portable, composable
choice. An agent definition can always preload skills later.

## Composition patterns

The most powerful pattern is combining both: a skill provides knowledge, an
agent definition creates a controlled execution environment that uses it.

**Example:** Code review

1. Create a `code-review` skill with review standards, checklists, and gotchas
2. Create a `code-reviewer` agent that preloads the skill with restricted tools:

```yaml
# .claude/agents/code-reviewer.md
---
name: code-reviewer
description: Reviews code for quality using team standards
tools: Read, Grep, Glob, Bash
skills:
  - code-review                # Preloads the skill's knowledge
maxTurns: 15
---

Review the code changes and provide feedback following the preloaded standards.
```

The skill is portable (works in any agent tool). The agent definition creates a
focused, permission-controlled reviewer specific to Claude Code.

## How skills are actually installed

The skill ecosystem uses a **canonical directory + symlink federation** model:

### Global installation (user-level)

```
~/.agents/skills/              <- CANONICAL: actual files live here
  clean-code/
    SKILL.md
    evals.json
    references/

~/.claude/skills/              <- SYMLINKS for Claude Code
  clean-code -> ../../.agents/skills/clean-code

~/.cursor/skills/              <- SYMLINKS for Cursor
  clean-code -> ../../.agents/skills/clean-code
```

- `~/.agents/skills/` is the single source of truth for global skills
- Agent-specific directories (`~/.claude/skills/`, `~/.cursor/skills/`, etc.)
  contain **symlinks** pointing back to the canonical directory
- One copy of the skill serves all 40+ compatible agents
- Non-universal agents (Cursor rules, Windsurf) get **adapted copies** instead
  of symlinks (content converted to agent-specific formats like MDC)
- Installation metadata tracked in `~/.agents/.skill-lock.json`

### Project-level installation

| Path | Scope | Discovered by |
|------|-------|---------------|
| `.agents/skills/<name>/` | This project, cross-client | All compatible agents |
| `.claude/skills/<name>/` | This project, Claude-only | Claude Code only |

Project-level skills are committed to the repo so the whole team gets them.
Use `.agents/skills/` for cross-client compatibility.

### The `skl` CLI

The `npx skills add` command manages the full installation lifecycle:

```bash
# Install from AbsolutelySkilled registry
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill clean-code

# Install from any GitHub repo
npx skills add owner/repo --skill skill-name

# Install from local path
npx skills add ./path/to/skill
```

It handles: fetching, writing to canonical directory, creating symlinks for all
detected agents, adapting content for non-universal agents, and updating the
lock file.
