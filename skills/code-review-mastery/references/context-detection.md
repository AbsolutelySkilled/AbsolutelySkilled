<!-- Part of the code-review-mastery AbsolutelySkilled skill. Load this file
     when you need to gather project context before reviewing local changes. -->

# Project Context Detection

Before analyzing any diff, gather project context to calibrate your review.
This avoids flagging patterns that are intentional project conventions and
ensures you catch violations of explicit project rules.

---

## Config file detection

Scan the project root for these files. Each reveals specific conventions:

| File pattern | What it reveals |
|---|---|
| `package.json` | Node.js project; dependencies, scripts, engine constraints |
| `.eslintrc*` / `eslint.config.*` | JavaScript/TypeScript lint rules - check for custom rules and overrides |
| `.prettierrc*` / `.editorconfig` | Formatting rules - indent style, line width, trailing commas |
| `tsconfig.json` | TypeScript strictness level (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| `biome.json` / `biome.jsonc` | Biome lint and format rules (replaces ESLint + Prettier in some projects) |
| `ruff.toml` / `pyproject.toml [tool.ruff]` | Python lint rules, line length, selected/ignored rules |
| `.flake8` / `setup.cfg [flake8]` | Python legacy lint config |
| `mypy.ini` / `pyproject.toml [tool.mypy]` | Python type checking strictness |
| `.golangci.yml` / `.golangci.yaml` | Go lint rules and enabled linters |
| `Cargo.toml` + `clippy.toml` | Rust project; clippy lint configuration |
| `.rubocop.yml` | Ruby style and lint rules |
| `CLAUDE.md` / `AGENT.md` | Agent-specific project rules - these override general conventions |
| `.github/CODEOWNERS` | Ownership boundaries - helps identify sensitive areas |
| `Makefile` / `justfile` / `Taskfile.yml` | Build/task conventions |
| `.env.example` | Expected environment variables |

**Priority order**: `CLAUDE.md` > explicit lint/format configs > framework defaults > language defaults.

If `CLAUDE.md` or `AGENT.md` exists, read it first - it contains the project's
authoritative rules and any instruction there takes precedence over general
best practices.

---

## Framework detection heuristics

Identify the framework to know which patterns are idiomatic vs problematic:

| Signal | Framework | Key review implications |
|---|---|---|
| `next.config.*` in root | Next.js | Check RSC boundaries, server/client component separation, metadata exports |
| `app/` dir + `layout.tsx` | Next.js App Router | Verify `"use client"` directives, check for client-side data fetching in server components |
| `pages/` dir + `_app.tsx` | Next.js Pages Router | Check `getServerSideProps`/`getStaticProps` usage |
| `express` in deps | Express.js | Check middleware ordering, error handler placement, async route handlers |
| `fastify` in deps | Fastify | Check schema validation, plugin encapsulation |
| `django` in deps | Django | Check ORM query efficiency, middleware ordering, CSRF |
| `flask` in deps | Flask | Check blueprint structure, app factory pattern, request context |
| `fastapi` in deps | FastAPI | Check Pydantic models, dependency injection, async endpoints |
| `spring-boot` in deps | Spring Boot | Check bean scoping, transaction boundaries, injection patterns |
| `gin-gonic/gin` in deps | Gin (Go) | Check middleware chain, context usage, error handling |
| `react` in deps (no Next) | React SPA | Check effect cleanup, memoization, state management patterns |
| `vue` in deps | Vue.js | Check reactivity patterns, composition API usage |
| `svelte` in deps | SvelteKit | Check load functions, form actions, reactive declarations |

---

## Convention sampling

For each directory containing changed files, read 2-3 existing files in the
same directory to detect local patterns:

### What to look for

- **Naming conventions**: camelCase vs snake_case vs PascalCase for files, variables, functions, classes
- **Import style**: relative vs absolute imports, barrel files, import ordering
- **Error handling**: try/catch patterns, Result types, error boundary placement
- **Export style**: named vs default exports, re-export patterns
- **Comment style**: JSDoc vs inline, when comments are used
- **Test organization**: co-located vs separate `__tests__` directory, naming convention for test files

### How to use detected conventions

- If the changed code deviates from surrounding file conventions: `[MINOR]` Convention finding
- If the changed code deviates from an explicit lint/config rule: `[MAJOR]` Convention finding
- If surrounding code is inconsistent (no clear convention): do not flag

---

## Language-specific focus areas

Each language has characteristic pitfalls to watch for during review:

| Language | Key focus areas |
|---|---|
| TypeScript | Strict null checks, exhaustive switch/union handling, `any` escape hatches, proper generic constraints, `as` casts hiding type errors |
| JavaScript | `==` vs `===`, missing `await`, prototype pollution, implicit type coercion, missing error handling in Promises |
| Python | Missing type hints on public APIs, bare `except:` clauses, mutable default arguments, context manager usage for resources, f-string injection |
| Go | Unchecked errors (`_ = err`), goroutine leaks, deferred close on nil, error wrapping with `%w`, context propagation |
| Rust | `unwrap()` / `expect()` in library code, unnecessary `clone()`, lifetime issues, missing `Send`/`Sync` bounds |
| Java | Null pointer risks, unclosed resources (use try-with-resources), checked exception handling, thread safety |
| Ruby | Method visibility, N+1 queries in ActiveRecord, missing strong parameters, symbol vs string keys |
| C# | `IDisposable` not disposed, async void (should be async Task), null reference in nullable context |

---

## What to do with gathered context

1. **Store mentally** - Do not output the context gathering step to the user
2. **Calibrate severity** - A pattern that violates an explicit lint rule is `[MAJOR]`; a pattern that merely differs from surrounding code style is `[MINOR]`
3. **Skip what's automated** - If a linter already enforces a rule and CI runs it, don't duplicate the finding
4. **Note gaps** - If there are no lint configs and no CLAUDE.md, note that conventions are implicit and be more conservative with `[MAJOR]` Convention findings
