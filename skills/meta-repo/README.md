# meta-repo

Use this skill when managing multi-repository systems using the `meta` tool (github.com/mateodelnorte/meta). Triggers on meta git clone, meta exec, meta project create/import/migrate, coordinating commands across many repos, running npm/yarn installs across all projects, migrating a monorepo to a multi-repo architecture, or any workflow that requires running git or shell commands against multiple child repositories at once.

## Install

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill meta-repo
```

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

## Recommended Skills

- [monorepo-management](https://absolutely-skilled.vercel.app/skill/monorepo-management)
- [git-advanced](https://absolutely-skilled.vercel.app/skill/git-advanced)
- [open-source-management](https://absolutely-skilled.vercel.app/skill/open-source-management)
- [ci-cd-pipelines](https://absolutely-skilled.vercel.app/skill/ci-cd-pipelines)

## Maintainers

- [@AbsolutelySkilled](https://github.com/AbsolutelySkilled)

---

*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/meta-repo)*
