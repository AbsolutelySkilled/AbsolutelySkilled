# AbsolutelySkilled

A registry of production-ready skills for AI coding agents. 160+ skills across 25 categories.

## Project Structure

```
skills/<skill-name>/        # Each skill is a self-contained folder
  SKILL.md                  # Core skill content (required, under 500 lines)
  README.md                 # Required for website build
  evals.json                # Test suite (required, 10-15 evals)
  sources.yaml              # Crawl provenance (required for URL-based skills)
  references/               # Deep-dive files loaded on demand (under 400 lines each)
website/                    # Astro + Tailwind + React islands site
CONTRIBUTING.md             # Full contribution guide
```

## Skills

- Every skill lives in `skills/<skill-name>/` and must contain both a `SKILL.md` and a `README.md`
- `README.md` is required for the Astro website build - missing it will break the build
- Follow the README pattern from existing skills (e.g., `skills/cli-design/README.md`): description, install command, overview, tags, platforms, recommended skills, maintainers, and footer link

## SKILL.md Requirements

- Frontmatter must include: `name`, `version`, `description`, `category`, `tags`, `platforms`, `license`, `maintainers`
- Valid categories: engineering, operations, marketing, ai-ml, design, product, devtools, sales, data, infra, monitoring, cloud, writing, workflow, analytics, game-development, developer-tools, communication, video
- `license` should be `MIT`
- Description must name the tool/domain and list 3-5 concrete tasks
- Body follows standard section order (see existing skills for examples)
- Total file must be under 500 lines
- All code examples must be syntactically valid

## evals.json Requirements

Write 10-15 evals covering:
- 2-3 trigger tests
- 4-5 core task tests
- 2-3 gotcha/edge case tests
- 1-2 anti-hallucination tests
- 1 references load test

## Creating Skills

Use the `skill-forge` skill to generate new skills:
```
/skill-forge <url-or-topic>
```

## Package Manager

Use `npm` for this project (not pnpm/yarn/bun).

## Website

The website lives in `website/` and is built with Astro. It reads skill data from `skills/*/README.md` - every skill must have a README or the build will fail.
