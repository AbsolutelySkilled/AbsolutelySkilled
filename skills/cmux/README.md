# cmux

Use this skill when managing cmux terminal panes, surfaces, and workspaces from Claude Code or any AI agent. Triggers on spawning split panes for sub-agents, sending commands to terminal surfaces, reading screen output, creating/closing workspaces, browser automation via cmux, and any task requiring multi-pane terminal orchestration. Also triggers on "cmux", "split pane", "new-pane", "read-screen", "send command to pane", or subagent-driven development requiring isolated terminal surfaces.

## Install

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill cmux
```

## Overview

cmux is a terminal multiplexer controlled via a Unix socket CLI. It manages
windows, workspaces, panes, and surfaces. AI agents use it to spawn isolated
terminal panes for parallel tasks, send commands, read output, and clean up
when done.

All commands use `cmux [--json] <command> [options]`. Always pass `--json` when
parsing output programmatically. References use short refs like `pane:5`,
`surface:12`, `workspace:3` - or UUIDs.

---

## Tags

`terminal` `panes` `split` `subagent` `automation` `cli`

## Platforms

- claude-code

## Recommended Skills

- [shell-scripting](https://absolutely-skilled.vercel.app/skill/shell-scripting)
- [vim-neovim](https://absolutely-skilled.vercel.app/skill/vim-neovim)
- [debugging-tools](https://absolutely-skilled.vercel.app/skill/debugging-tools)
- [super-human](https://absolutely-skilled.vercel.app/skill/super-human)

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/cmux)*
