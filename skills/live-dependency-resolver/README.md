# live-dependency-resolver

Use this skill when installing, adding, or updating packages, checking latest versions, scaffolding projects with dependencies, or generating code that imports third-party packages. Triggers on npm install, pip install, cargo add, gem install, go get, dependency resolution, package management, module installation, crate addition, or any task requiring live version verification across npm, pip, Go modules, Rust/cargo, and Ruby/gem ecosystems. Covers synonyms: dependency, package, module, crate, gem, library.

## Install

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill live-dependency-resolver
```

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

## Recommended Skills

- [shell-scripting](https://absolutely-skilled.vercel.app/skill/shell-scripting)
- [monorepo-management](https://absolutely-skilled.vercel.app/skill/monorepo-management)
- [ci-cd-pipelines](https://absolutely-skilled.vercel.app/skill/ci-cd-pipelines)

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/live-dependency-resolver)*
