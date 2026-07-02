# Absolute

A focused development workflow engine for AI coding agents: eleven separate skills, each invoked directly — a one-time setup (`absolute-init`), a build loop (`absolute-work`, `absolute-spec`, `absolute-ui`, `absolute-simplify`, `absolute-docs`) and an engineering-health family (`absolute-upgrade`, `absolute-audit`, `absolute-prune`, `absolute-debt`, `absolute-deflake`).

## Project Structure

```
skills/
  absolute-init/              # One-time setup: interview + detect → config
    SKILL.md                  # Skill definition (frontmatter + full flow)
    README.md                 # Skill landing page
  absolute-work/              # End-to-end SDLC
    SKILL.md
    README.md
    references/               # Deep-dive guides (intake-playbook, spec-writing, execution-model, etc.)
  absolute-spec/              # Lightweight standalone spec
    SKILL.md
    README.md
  absolute-ui/                # Polished UI design
    SKILL.md
    README.md
    references/               # 25 topic guides (typography, color, forms, etc.)
  absolute-simplify/          # Diff-scoped code simplification
    SKILL.md
    README.md
    references/               # Language guides (golang, javascript, react, python, css, sql, tests, catalog)
  absolute-docs/              # Diátaxis-driven documentation
    SKILL.md
    README.md
    references/               # Doc-type guides (tutorials, how-tos, reference, etc.)
  absolute-upgrade/           # Dependency upgrades
    SKILL.md
    README.md
    references/health-engine.md
  absolute-audit/             # Vulnerability & security scan
    SKILL.md
    README.md
    references/health-engine.md
  absolute-prune/             # Dead code & dependency cleanup
    SKILL.md
    README.md
    references/health-engine.md
  absolute-debt/              # Lint & typecheck debt paydown
    SKILL.md
    README.md
    references/health-engine.md
  absolute-deflake/           # Flaky test fixes
    SKILL.md
    README.md
    references/health-engine.md
CONTRIBUTING.md               # Full contribution guide
```

## Each Skill

- Every skill lives in `skills/absolute-<name>/` with a `SKILL.md` and a `README.md`
- `SKILL.md` contains the full frontmatter + command flow (no separate router)
- Deep-dive guides go under `references/` within the skill's directory
- The five health skills each carry their own copy of `references/health-engine.md`

## SKILL.md Requirements

- Frontmatter must include: `name`, `version`, `description`, `category`, `tags`, `platforms`, `license`, `maintainers`, `user-invocable`, `argument-hint`
- Valid categories: engineering, operations, marketing, ai-ml, design, product, devtools, sales, data, infra, monitoring, cloud, writing, workflow, analytics, game-development, developer-tools, communication, video
- `license` should be `MIT`
- All code examples must be syntactically valid

## Maintaining the Skills

Eleven separate skills — not an open registry. When editing a skill, keep `SKILL.md`, `README.md`, and any files in `references/` in sync. Companion command references use the full skill name (e.g. `/absolute-work`, `/absolute-ui`). When editing `health-engine.md`, update the copy in each of the five health skill directories.

## Package Manager

Use `npm` for this project (not pnpm/yarn/bun).
