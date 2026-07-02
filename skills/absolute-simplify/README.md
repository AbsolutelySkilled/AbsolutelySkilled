# absolute-simplify

Autonomously simplify your staged/unstaged git changes or a target path. Detects scope, reduces complexity, flattens nesting, removes redundancy and dead code, then runs tests to prove nothing broke.

## Quick Facts

| Field | Value |
|-------|-------|
| Category | workflow |
| Version | 0.6.0 |
| Platforms | claude-code, gemini-cli, openai-codex, mcp |
| License | MIT |
| Deep-dive guides | `references/` (golang, javascript, react, python, css, sql, tests, simplification-catalog) |

## How to Install

```bash
npx skills add maddhruv/absolute-simplify
```

## Usage

```bash
/absolute-simplify
/absolute-simplify "clean up my changes in src/api/"
```

Acts on your working diff. Each change is scored High/Med/Low — low-value churn (e.g. local renames) is held out of the diff and listed for manual pickup, and the summary gives a PR-worthiness verdict so you know if the diff is worth raising.

For repo-wide dead code use `/absolute-prune`; for lint/type debt use `/absolute-debt`.

## Maintainers

- [@maddhruv](https://github.com/maddhruv)
