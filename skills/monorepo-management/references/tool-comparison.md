<!-- Part of the monorepo-management AbsolutelySkilled skill. Load this file when
     choosing a monorepo tool or comparing options. -->

# Monorepo Tool Comparison: Turborepo vs Nx vs Bazel vs Lerna

## Overview

| Dimension | Turborepo | Nx | Bazel | Lerna |
|-----------|-----------|----|----|-------|
| Maintained by | Vercel | Nrwl / Nx Inc. | Google / community | Nrwl (maintenance mode) |
| Language focus | JS/TS only | JS/TS primary, plugins for others | Polyglot | JS/TS only |
| Primary function | Task runner + cache | Task runner + project graph + generators | Hermetic build system | Package versioning + publish |
| Config complexity | Low | Medium | High | Low |
| Learning curve | Low | Medium | High | Low |
| Remote caching | Vercel (free tier), self-host | Nx Cloud (free tier), self-host | Remote execution API (RBE) | None built-in |
| License | MIT | MIT | Apache 2.0 | MIT |

---

## Turborepo

### What it is

Turborepo (owned by Vercel, written in Rust) is a high-performance task runner
for JavaScript and TypeScript monorepos. It focuses on one thing: running tasks
in the correct order with maximum parallelism and a content-addressed local and
remote cache.

### Strengths

- **Zero-config adoption** - Drop `turbo.json` into any existing pnpm/npm/yarn
  workspace and it works. No need to restructure packages or add config per project.
- **Fastest cold starts** - The Rust-based engine starts and schedules tasks
  faster than any JS-based alternative.
- **Pipeline simplicity** - The `tasks` section of `turbo.json` is easy to
  reason about. `dependsOn: ["^build"]` is the entire API for ordering.
- **Vercel remote cache** - Free tier available. Enterprise teams can self-host
  using the open HTTP Remote Cache API compatible with S3, GCS, or custom servers.
- **`--filter` syntax** - Powerful and composable: `--filter=@scope/*`,
  `--filter=...[HEAD^1]`, `--filter=./apps/*`.
- **Turborepo TUI** - Interactive terminal UI shows running tasks, logs, and
  cache status in real time (`"ui": "tui"` in turbo.json).

### Weaknesses

- **No generators** - No scaffolding or code generation. You need separate tools
  (plop, hygen, custom scripts).
- **No module boundary enforcement** - Cannot statically prevent `app-a` from
  importing `app-b`'s internals. Nx's `@nx/enforce-module-boundaries` does this.
- **JS/TS only** - Cannot orchestrate builds for Go, Rust, Java, or Python
  packages in the same repo.
- **Less plugin ecosystem** - No official integrations for storybook, Next.js
  migrations, module federation, etc. compared to Nx plugins.
- **Affected analysis is simpler** - `--filter=...[base]` works on package
  granularity, not file granularity (Nx is more precise via `namedInputs`).

### Best for

Small to medium JS/TS teams that want fast builds with minimal setup. Ideal as
a first monorepo tool. Teams already on Vercel benefit most from the remote
cache integration.

### Setup time

15-30 minutes to add to an existing workspace.

---

## Nx

### What it is

Nx (by Nrwl, written in TypeScript with a Rust-based task runner since v17) is
a full-featured build system and developer platform. It combines task
orchestration with a project graph, workspace generators, module boundary
enforcement, and a rich plugin ecosystem.

### Strengths

- **Project graph visualization** - `nx graph` renders an interactive dependency
  graph of all projects and their relationships.
- **Generators and migrations** - `nx generate` scaffolds new apps, libs, and
  components following workspace conventions. `nx migrate` automates dependency
  upgrades across the repo.
- **Module boundary enforcement** - The `@nx/enforce-module-boundaries` ESLint
  rule uses project `tags` to enforce architectural constraints (e.g., feature
  libs cannot import from app libs).
- **Nx Cloud** - First-party remote caching and distributed task execution (DTE).
  DTE splits a task graph across multiple CI agents for maximum parallelism.
- **Rich plugin ecosystem** - Official plugins for Next.js, React, Angular, NestJS,
  Vite, Storybook, Cypress, Playwright, Docker, and more.
- **`namedInputs` precision** - Fine-grained cache input definitions allow
  per-project cache granularity beyond package-level boundaries.
- **Affected commands** - `nx affected -t build` is precise to the project graph,
  not just changed files.

### Weaknesses

- **More ceremony** - Each project needs a `project.json`. Configuration is
  verbose compared to Turborepo.
- **Plugin coupling** - Nx plugins often abstract underlying tools (e.g., Vite,
  Jest) behind Nx executors. This adds a layer that can lag behind upstream tool
  releases.
- **Nx Cloud costs** - The free tier has limits. Larger teams need paid plans.
  Self-hosting is possible but more complex than Turborepo's cache API.
- **Steeper learning curve** - Concepts like executors, generators, `project.json`,
  and tags require investment to understand fully.

### Best for

Medium to large JS/TS teams that want generators, enforced architecture, and
distributed task execution. Especially strong for Angular or large React
enterprise workspaces, or teams that want Nx Cloud's distributed CI.

### Setup time

1-4 hours depending on existing workspace structure. Full Nx workspace from
scratch: `npx create-nx-workspace`.

---

## Bazel

### What it is

Bazel (open-sourced from Google's internal Blaze) is a hermetic, reproducible
build system designed for polyglot monorepos at massive scale. It guarantees
that given the same inputs, the same outputs are produced on any machine.

### Strengths

- **True hermeticity** - Every build rule declares all its inputs and outputs
  explicitly. Builds cannot accidentally depend on the host environment.
- **Polyglot** - First-class support for Java, Go, C++, Python, Rust, and
  JavaScript (via rules_nodejs or aspect-build/rules_js). One tool for the
  entire repo regardless of language.
- **Remote execution (RBE)** - Bazel can distribute individual build actions to
  a cluster of remote workers (Google RBE, BuildBuddy, EngFlow). This is beyond
  caching - it parallelizes at the action level, not the task level.
- **Precise incremental builds** - Bazel tracks file-level inputs, not package-level.
  Only the exact set of affected actions re-runs.
- **Scales to enormous repos** - Used by Google (hundreds of millions of LOC),
  Stripe, Canva, LinkedIn, Twitter, and others.

### Weaknesses

- **Very high learning curve** - Starlark (Bazel's Python-like build language),
  `BUILD.bazel` files, toolchain configuration, and remote execution setup all
  require significant investment.
- **JS ecosystem friction** - The JavaScript ecosystem was not designed with
  Bazel in mind. `rules_js` (by aspect-build) is the best current solution but
  still requires migration effort.
- **Maintenance overhead** - You need dedicated build engineering capacity to
  maintain Bazel in a large repo. Small teams should not adopt it.
- **Slow cold builds** - The first build is often slower than other tools due to
  toolchain downloading and action graph construction.
- **No remote cache free tier** - Remote caching requires infrastructure (GCS,
  S3, BuildBuddy, EngFlow). BuildBuddy offers a free tier for open source.

### Best for

Large organizations with 50+ packages, polyglot repos, or Google-scale build
requirements. Only worthwhile if you have engineers willing to invest in build
infrastructure.

### Setup time

Days to weeks for a meaningful integration. Not suitable for teams without
build engineering resources.

---

## Lerna (deprecated / maintenance mode)

### What it is

Lerna was the original JavaScript monorepo tool, popularized around 2017-2018.
It managed package versioning, changelog generation, and publishing for
multi-package repos. Nrwl took over maintenance in 2022.

### Current status

Lerna is in maintenance mode. Nrwl recommends migrating to Nx + Nx release
(for versioning/publishing) or to Turborepo. New projects should not use Lerna.

### What it did well (historically)

- Conventional commits-based versioning (`lerna version`)
- Coordinated publishing to npm (`lerna publish`)
- `lerna run` for running scripts across packages

### Why it fell behind

- No meaningful caching (unless integrating Nx under the hood)
- Slow task execution - no parallelism or DAG-aware scheduling
- Complex `independent` vs `fixed` versioning modes caused confusion
- pnpm/yarn workspaces made the dependency management parts redundant

### Migration path

- Task orchestration: migrate to Turborepo or Nx
- Publishing/versioning: use `changesets` (recommended), `nx release`, or
  `semantic-release`

---

## Feature comparison matrix

| Feature | Turborepo | Nx | Bazel | Lerna |
|---------|-----------|----|----|-------|
| Local task caching | Yes | Yes | Yes | No |
| Remote caching | Yes (Vercel/self-host) | Yes (Nx Cloud/self-host) | Yes (RBE/GCS/S3) | No |
| Affected analysis | Package-level | Project-level (precise) | Action-level (most precise) | No |
| Parallel task execution | Yes | Yes | Yes (distributed) | Limited |
| Code generators | No | Yes | No (macros only) | No |
| Module boundary enforcement | No | Yes (ESLint rule) | Yes (visibility) | No |
| Project graph visualization | No | Yes (`nx graph`) | Via Bazel query | No |
| Distributed task execution | No | Yes (Nx Cloud DTE) | Yes (RBE) | No |
| Polyglot support | No | Partial (via plugins) | Yes (first-class) | No |
| Package versioning/publish | No | Yes (`nx release`) | No | Yes (legacy) |
| Learning curve | Low | Medium | High | Low |
| Config verbosity | Low | Medium-High | High | Low |
| Community/ecosystem | Growing | Large | Large (non-JS) | Declining |

---

## When to migrate between tools

**Turborepo to Nx**: When you need generators to enforce workspace conventions,
module boundary rules to prevent architectural violations, or Nx Cloud's
distributed task execution for long CI pipelines.

**Nx to Bazel**: When you have a genuine polyglot repo (non-trivial Java/Go/Rust
alongside JS), when you hit scaling limits of Nx's JS-centric model, or when
you need true hermetic builds for compliance/security reasons.

**Lerna to Turborepo**: One-day migration. Remove `lerna.json`, add `turbo.json`.
Move versioning to `changesets`. Done.

**Lerna to Nx**: Use the official `nx migrate` tooling which automates most of
the conversion.

---

## Remote caching options by tool

| Provider | Turborepo | Nx | Bazel |
|----------|-----------|-----|-------|
| Vercel Remote Cache | Native | No | No |
| Nx Cloud | No | Native | No |
| BuildBuddy | No | No | Yes |
| EngFlow | No | No | Yes |
| Self-hosted S3/GCS | Yes (cache API) | Yes (custom runner) | Yes (RBE) |
| GitHub Actions Cache | Yes (community) | Yes (community) | Limited |

---

## References

- [Turborepo docs](https://turbo.build/repo/docs)
- [Turborepo remote caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Nx docs](https://nx.dev)
- [Nx Cloud](https://nx.app)
- [Nx affected](https://nx.dev/ci/features/affected)
- [Bazel docs](https://bazel.build/docs)
- [aspect-build/rules_js](https://github.com/aspect-build/rules_js) - best JS/TS rules for Bazel
- [BuildBuddy](https://www.buildbuddy.io/) - Bazel remote cache/execution
- [changesets](https://github.com/changesets/changesets) - versioning/publishing alternative to Lerna
- [Lerna deprecation notice](https://github.com/lerna/lerna/issues/3121)
