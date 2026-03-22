# playwright-testing

Use this skill when writing Playwright e2e tests, debugging flaky tests, setting up visual regression, testing APIs with request context, configuring CI sharding, or automating browser interactions. Triggers on Playwright, page.route, storageState, toHaveScreenshot, trace viewer, codegen, test.describe, page object model, and any task requiring Playwright test automation or flaky test diagnosis.

## Install

```bash
npx skills add AbsolutelySkilled/AbsolutelySkilled --skill playwright-testing
```

## Overview

Playwright runs real Chromium, Firefox, and WebKit browsers from a single API with auto-waiting, network interception, and built-in assertions. This skill focuses on what Claude gets wrong by default: auth state management, flaky test diagnosis, CI optimization, and the subtle gotchas that burn hours. Includes executable scripts for project setup, flaky test diagnosis, and safe snapshot updates.

## What's inside

```
SKILL.md              # Core skill - gotchas, non-obvious patterns, hooks
config.json           # Project-specific settings (baseURL, auth strategy, CI)
scripts/
  setup-project.sh    # Init Playwright with CI-ready defaults
  diagnose-flaky.sh   # Run tests repeatedly, categorize failures, track patterns
  update-snapshots.sh # Safe snapshot update with git diff summary
references/
  locator-strategies.md   # Priority guide, filtering, chaining, iframe/shadow DOM
  auth-patterns.md        # storageState, token refresh, multi-role, OAuth mocking
  flaky-test-playbook.md  # Diagnosis flowchart, 7 root causes, trace debugging
  ci-optimization.md      # Sharding math, browser caching, Docker, artifacts
  component-testing.md    # CT mode, mounting, props serialization, mocking
```

---

## Tags

`playwright` `e2e` `testing` `browser-automation` `visual-regression` `flaky-tests`

## Platforms

- claude-code
- gemini-cli
- openai-codex

## Recommended Skills

- [cypress-testing](https://absolutely-skilled.vercel.app/skill/cypress-testing)
- [test-strategy](https://absolutely-skilled.vercel.app/skill/test-strategy)
- [jest-vitest](https://absolutely-skilled.vercel.app/skill/jest-vitest)
- [api-testing](https://absolutely-skilled.vercel.app/skill/api-testing)
- [webapp-testing](https://absolutely-skilled.vercel.app/skill/webapp-testing)

## Maintainers

- [@maddhruv](https://github.com/maddhruv)

---

*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/playwright-testing)*
