# second-brain

second-brain is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex, and 1 more. Managing persistent user memory in ~/.memory/ - a structured, hierarchical second brain for AI agents.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | devtools |
| Version | 0.1.0 |
| Platforms | claude-code, gemini-cli, openai-codex, mcp |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill second-brain
```

3. The second-brain skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

Second Brain turns `~/.memory/` into a persistent, hierarchical knowledge store that works
across projects and tools. Unlike project-level context files (CLAUDE.md, .cursorrules),
Second Brain holds personal, cross-project knowledge - your preferences, learnings, workflows,
and domain expertise. It is designed for AI agents: tag-indexed for fast relevance
matching, wiki-linked for graph traversal, and capped at 100 lines per file for
context-window efficiency.

---

## Tags

`second-brain` `memory` `knowledge-base` `persistence` `context` `personalization`

## Platforms

- claude-code
- gemini-cli
- openai-codex
- mcp

## Related Skills

Pair second-brain with these complementary skills:

- [knowledge-base](https://www.absolutelyskilled.pro/skill/knowledge-base)
- [internal-docs](https://www.absolutelyskilled.pro/skill/internal-docs)
- [technical-writing](https://www.absolutelyskilled.pro/skill/technical-writing)

## Frequently Asked Questions

### What is second-brain?

Use this skill when managing persistent user memory in ~/.memory/ - a structured, hierarchical second brain for AI agents. Triggers on conversation start (auto-load relevant memories by matching context against tags), "remember this", "what do you know about X", "update my memory", completing complex tasks (auto-propose saving learnings), onboarding a new user, searching past learnings, or maintaining the memory graph - splitting large files, pruning stale entries, and updating cross-references.


### How do I install second-brain?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill second-brain` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support second-brain?

This skill works with claude-code, gemini-cli, openai-codex, mcp. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/second-brain)*
