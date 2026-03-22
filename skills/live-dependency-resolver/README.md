# live-dependency-resolver

live-dependency-resolver is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex, and 1 more. Installing, adding, or updating packages, checking latest versions, scaffolding projects with dependencies, or generating code that imports third-party packages.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | engineering |
| Version | 0.1.0 |
| Platforms | claude-code, gemini-cli, openai-codex, mcp |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill live-dependency-resolver
```

3. The live-dependency-resolver skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

LLMs have knowledge cutoff dates that are months old. When helping users install coding
dependencies, this causes hallucinated version numbers, suggestions for deprecated packages,
and incorrect install commands. This skill teaches agents to always verify packages against
live registries before suggesting any installation - using CLI commands first for speed and
simplicity, with web API fallback when CLI tools are unavailable.

---

## Tags

`dependencies` `npm` `pip` `cargo` `gem` `go-modules` `package-management` `version-check`

## Platforms

- claude-code
- gemini-cli
- openai-codex
- mcp

## Related Skills

Pair live-dependency-resolver with these complementary skills:

- [shell-scripting](https://www.absolutelyskilled.pro/skill/shell-scripting)
- [monorepo-management](https://www.absolutelyskilled.pro/skill/monorepo-management)
- [ci-cd-pipelines](https://www.absolutelyskilled.pro/skill/ci-cd-pipelines)

## Frequently Asked Questions

### What is live-dependency-resolver?

Use this skill when installing, adding, or updating packages, checking latest versions, scaffolding projects with dependencies, or generating code that imports third-party packages. Triggers on npm install, pip install, cargo add, gem install, go get, dependency resolution, package management, module installation, crate addition, or any task requiring live version verification across npm, pip, Go modules, Rust/cargo, and Ruby/gem ecosystems. Covers synonyms: dependency, package, module, crate, gem, library.


### How do I install live-dependency-resolver?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill live-dependency-resolver` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support live-dependency-resolver?

This skill works with claude-code, gemini-cli, openai-codex, mcp. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/live-dependency-resolver)*
