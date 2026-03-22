# skill-forge

Generate a production-ready AbsolutelySkilled skill from any source: GitHub repos, documentation URLs, or domain topics (marketing, sales, TypeScript, etc.). Triggers on /skill-forge, "create a skill for X", "generate a skill from these docs", "make a skill for this repo", "build a skill about marketing", or "add X to the registry".

## Install

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill skill-forge
```

## Overview

Skill Forge is the bootstrapping tool for the AbsolutelySkilled registry. Given a
URL, it performs deep doc research (README, llms.txt, API references) and generates
a complete skill folder. Given a domain topic, it runs a brainstorming discovery
session with the user to define scope and content before writing. The output is a
production-ready skill/ folder with SKILL.md, evals.json, references, scripts, and
optionally sources.yaml - ready to PR into the registry.

---

## Tags

`skill-creation` `code-generation` `scaffolding` `registry` `agent-skills`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Recommended Skills

- [skill-creator](https://absolutely-skilled.vercel.app/skill/skill-creator)
- [writing-skills](https://absolutely-skilled.vercel.app/skill/writing-skills)
- [technical-writing](https://absolutely-skilled.vercel.app/skill/technical-writing)

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/skill-forge)*
