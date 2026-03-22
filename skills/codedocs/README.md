# codedocs

codedocs is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex, and 1 more. Generating AI-agent-friendly documentation for a git repo or directory, answering questions about a codebase from existing docs, or incrementally updating documentation after code changes.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | engineering |
| Version | 0.2.0 |
| Platforms | claude-code, gemini-cli, openai-codex, mcp |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill codedocs
```

3. The codedocs skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

Codedocs generates structured, layered documentation for any git repository or code
directory - documentation designed to be consumed by AI agents first and human developers
second. Instead of flat READMEs that lose context, codedocs produces a `docs/` tree with
an architecture overview, per-module deep dives, cross-cutting pattern files, and a
manifest that tracks what has been documented and when. Once docs exist, the skill answers
questions from the docs (not by re-reading source code), and supports incremental updates
via targeted scope or git-diff detection.

---

## Tags

`documentation` `codebase` `onboarding` `architecture` `ai-agent` `code-understanding`

## Platforms

- claude-code
- gemini-cli
- openai-codex
- mcp

## Related Skills

Pair codedocs with these complementary skills:

- [technical-writing](https://www.absolutelyskilled.pro/skill/technical-writing)
- [internal-docs](https://www.absolutelyskilled.pro/skill/internal-docs)
- [clean-code](https://www.absolutelyskilled.pro/skill/clean-code)
- [developer-experience](https://www.absolutelyskilled.pro/skill/developer-experience)
- [open-source-management](https://www.absolutelyskilled.pro/skill/open-source-management)

## Frequently Asked Questions

### What is codedocs?

Use this skill when generating AI-agent-friendly documentation for a git repo or directory, answering questions about a codebase from existing docs, or incrementally updating documentation after code changes. Triggers on codedocs:generate, codedocs:ask, codedocs:update, "document this codebase", "generate docs for this repo", "what does this project do", "update the docs after my changes", or any task requiring structured codebase documentation that serves AI agents, developers, and new team members.


### How do I install codedocs?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill codedocs` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support codedocs?

This skill works with claude-code, gemini-cli, openai-codex, mcp. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/codedocs)*
