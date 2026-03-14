# Contributing to AbsolutelySkilled

Thanks for your interest in contributing! This project thrives on community-built skills.

## Adding a new skill

### Using skill-forge (recommended)

The fastest way to create a skill is with the `skill-forge` skill in Claude Code:

```
/skill-forge <url-or-topic>
```

This generates a complete skill folder with SKILL.md, evals.json, and sources.yaml.

### Manual creation

Create a folder under `skills/<skill-name>/` with at minimum:

```
skills/<skill-name>/
  SKILL.md        # Required - core skill content
  evals.json      # Required - test suite
  sources.yaml    # Required for URL-based skills, optional for domain skills
  references/     # Optional - deep-dive files
```

### SKILL.md requirements

- Frontmatter must include: `name`, `version`, `description`, `category`, `tags`, `platforms`, `license`, `maintainers`
- Description must name the tool/domain and list 3-5 concrete tasks
- Body must follow the standard section order (see existing skills for examples)
- Total file must be under 500 lines
- All code examples must be syntactically valid
- All domain advice must be actionable, not generic

### evals.json requirements

Write 10-15 evals covering:
- 2-3 trigger tests
- 4-5 core task tests
- 2-3 gotcha/edge case tests
- 1-2 anti-hallucination tests
- 1 references load test

## Updating an existing skill

- Read the existing SKILL.md and sources.yaml first
- Check if the upstream docs have changed
- Update `version` in frontmatter (semver)
- Update `sources` with new accessed dates
- Add or update evals for any new content

## Pull request checklist

- [ ] Skill folder is in `skills/<skill-name>/`
- [ ] SKILL.md is under 500 lines
- [ ] All references/ files are under 400 lines
- [ ] evals.json has 10-15 evals across all categories
- [ ] sources.yaml URLs point to official docs only (if applicable)
- [ ] `license: MIT` in frontmatter

## Code of conduct

Be respectful, constructive, and focused on making skills useful. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
