# meta-repo

meta-repo is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex, and 1 more. Managing multi-repository systems using the `meta` tool (github.com/mateodelnorte/meta).

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
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill meta-repo
```

3. The meta-repo skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

`meta` solves the mono-repo vs. many-repos dilemma by saying "both". A meta
repo is a thin git repository that contains a `.meta` config file listing child
repositories; `meta` commands then fan out across all those children at once.
Unlike git submodules or subtree, child repos remain independent first-class git
repos — different teams can clone just the slice they need. The plugin
architecture (commander.js, `meta-*` npm packages) means you can extend meta
to wrap any CLI tool, not just git.

---

## Tags

`meta` `multi-repo` `polyrepo` `git` `monorepo-migration` `orchestration`

## Platforms

- claude-code
- gemini-cli
- openai-codex
- mcp

## Related Skills

Pair meta-repo with these complementary skills:

- [monorepo-management](https://www.absolutelyskilled.pro/skill/monorepo-management)
- [git-advanced](https://www.absolutelyskilled.pro/skill/git-advanced)
- [open-source-management](https://www.absolutelyskilled.pro/skill/open-source-management)
- [ci-cd-pipelines](https://www.absolutelyskilled.pro/skill/ci-cd-pipelines)

## Frequently Asked Questions

### What is meta-repo?

Use this skill when managing multi-repository systems using the `meta` tool (github.com/mateodelnorte/meta). Triggers on meta git clone, meta exec, meta project create/import/migrate, coordinating commands across many repos, running npm/yarn installs across all projects, migrating a monorepo to a multi-repo architecture, or any workflow that requires running git or shell commands against multiple child repositories at once.


### How do I install meta-repo?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill meta-repo` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support meta-repo?

This skill works with claude-code, gemini-cli, openai-codex, mcp. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@AbsolutelySkilled](https://github.com/AbsolutelySkilled)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/meta-repo)*
