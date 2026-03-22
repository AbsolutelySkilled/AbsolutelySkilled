# code-review-mastery

code-review-mastery is a production-ready AI agent skill for claude-code, gemini-cli, openai-codex. The user asks to review their local git changes, staged or unstaged diffs, or wants a code review before committing.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | engineering |
| Version | 0.2.0 |
| Platforms | claude-code, gemini-cli, openai-codex |
| License | MIT |

## How to Install

1. Make sure you have Node.js installed on your machine.
2. Run the following command in your terminal:

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill code-review-mastery
```

3. The code-review-mastery skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).

## Overview

This skill reviews your local git changes (staged or unstaged) with
project-aware analysis. It gathers project context - lint rules, conventions,
framework patterns - then produces structured `[MAJOR]` / `[MINOR]` findings
you can work through interactively.

---

## Tags

`code-review` `git-diff` `local-review` `automated-review` `quality`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Related Skills

Pair code-review-mastery with these complementary skills:

- [clean-code](https://www.absolutelyskilled.pro/skill/clean-code)
- [refactoring-patterns](https://www.absolutelyskilled.pro/skill/refactoring-patterns)
- [test-strategy](https://www.absolutelyskilled.pro/skill/test-strategy)
- [git-advanced](https://www.absolutelyskilled.pro/skill/git-advanced)

## Frequently Asked Questions

### What is code-review-mastery?

Use this skill when the user asks to review their local git changes, staged or unstaged diffs, or wants a code review before committing. Triggers on "review my changes", "review staged", "review my diff", "check my code", "code review local changes", "review unstaged", "review before commit".


### How do I install code-review-mastery?

Run `npx skills add AbsolutelySkilled/AbsolutelySkilled --skill code-review-mastery` in your terminal. The skill will be immediately available in your AI coding agent.

### What AI agents support code-review-mastery?

This skill works with claude-code, gemini-cli, openai-codex. Install it once and use it across any supported AI coding agent.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://www.absolutelyskilled.pro/skill/code-review-mastery)*
