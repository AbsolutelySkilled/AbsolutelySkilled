# cmux

cmux is a production-ready AI agent skill for claude-code. Managing cmux terminal panes, surfaces, and workspaces from Claude Code or any AI agent.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | developer-tools |
| Version | 0.1.0 |
| Platforms | claude-code |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill cmux
```

3. The cmux skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

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

## Related Skills

Pair cmux with these complementary skills:

- [shell-scripting](https://www.absolutelyskilled.pro/skill/shell-scripting)
- [vim-neovim](https://www.absolutelyskilled.pro/skill/vim-neovim)
- [debugging-tools](https://www.absolutelyskilled.pro/skill/debugging-tools)
- [super-human](https://www.absolutelyskilled.pro/skill/super-human)

## Frequently Asked Questions

### What is cmux?

Use this skill when managing cmux terminal panes, surfaces, and workspaces from Claude Code or any AI agent. Triggers on spawning split panes for sub-agents, sending commands to terminal surfaces, reading screen output, creating/closing workspaces, browser automation via cmux, and any task requiring multi-pane terminal orchestration. Also triggers on "cmux", "split pane", "new-pane", "read-screen", "send command to pane", or subagent-driven development requiring isolated terminal surfaces.


### How do I install cmux?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill cmux` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support cmux?

This skill works with claude-code. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/cmux)*
