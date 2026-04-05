# skill-forge

skill-forge is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex. Generate a production-ready AbsolutelySkilled skill from any source: GitHub repos, documentation URLs, or domain topics (marketing, sales, TypeScript, etc.).

## Quick Facts

| Field | Value |
|-------|-------|
| Category | devtools |
| Version | 0.4.0 |
| Platforms | claude-code, gemini-cli, openai-codex |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill skill-forge
```

3. The skill-forge skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

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

## Tags

`skill-creation` `code-generation` `scaffolding` `registry` `agent-skills` `agent-definitions`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Frequently Asked Questions

### What is skill-forge?

Generate a production-ready AbsolutelySkilled skill from any source: GitHub repos, documentation URLs, or domain topics (marketing, sales, TypeScript, etc.). Triggers on /skill-forge, "create a skill for X", "generate a skill from these docs", "make a skill for this repo", "build a skill about marketing", or "add X to the registry". For URLs: performs deep doc research (README, llms.txt, API references). For domains: runs a brainstorming discovery session with the user to define scope and content. Outputs a complete skill/ folder with SKILL.md, evals.json, and optionally sources.yaml, ready to PR into the AbsolutelySkilled registry.


### How do I install skill-forge?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill skill-forge` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support skill-forge?

This skill works with claude-code, gemini-cli, openai-codex. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/skill-forge)*
