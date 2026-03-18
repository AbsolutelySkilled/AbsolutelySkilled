<!-- Part of the codedocs AbsolutelySkilled skill. Load this file when
     running codedocs:generate to document a codebase. -->

# Generate Workflow

Complete reference for the `codedocs:generate` command - discovery heuristics,
module boundary detection, tech stack identification, sub-module splitting, coverage
verification, and output templates.

---

## Discovery Phase

### Step 1: Tech stack identification

Scan the repo root (and target path) for manifest files. Each file reveals
language, framework, and dependency information:

| Manifest file | Language/Platform | Key info to extract |
|---|---|---|
| `package.json` | JavaScript/TypeScript | dependencies, scripts, main/module entry |
| `tsconfig.json` | TypeScript | paths, baseUrl, project references |
| `Cargo.toml` | Rust | dependencies, workspace members, bin targets |
| `go.mod` | Go | module path, dependencies |
| `requirements.txt` / `pyproject.toml` / `setup.py` | Python | dependencies, entry points |
| `composer.json` | PHP | autoload paths, dependencies |
| `pom.xml` / `build.gradle` | Java/Kotlin | modules, dependencies |
| `Gemfile` | Ruby | gems, groups |
| `mix.exs` | Elixir | deps, applications |
| `CMakeLists.txt` / `Makefile` | C/C++ | targets, includes |
| `Package.swift` | Swift | targets, dependencies |
| `.csproj` / `.sln` | C#/.NET | project references, packages |

For monorepos, check for workspace definitions:
- `package.json` with `workspaces` field
- `Cargo.toml` with `[workspace]` section
- `go.work` file
- `pnpm-workspace.yaml`
- `lerna.json`
- `nx.json`
- `turbo.json`

Record: primary language, framework (if detectable from dependencies), build
tool, and test framework.

---

### Step 2: Entry point detection

Entry points are the starting locations for understanding code flow. Detect them
by checking (in priority order):

1. **Explicit main files** - `main.ts`, `main.go`, `main.rs`, `__main__.py`,
   `Main.java`, `Program.cs`
2. **Index/entry exports** - `index.ts`, `index.js`, `lib.rs`, `__init__.py`,
   `mod.rs`
3. **Framework entry points** - `app.ts` (Express/Fastify), `pages/` or `app/`
   (Next.js), `src/App.tsx` (React), `manage.py` (Django), `config/routes.rb`
   (Rails)
4. **CLI entry points** - `bin/` directory, `scripts` in package.json,
   `[tool.poetry.scripts]` in pyproject.toml
5. **Config-defined entries** - `main` or `module` field in package.json,
   `[lib]` in Cargo.toml

---

### Step 3: Full recursive directory census

Before detecting module boundaries, build a complete census of the repo. Walk
the entire directory tree (excluding ignore paths) and record every directory
with its file count. This census drives both module detection and coverage
verification.

```
Census format:
  <path> | <source file count> | <depth>
  src/                    | 3   | 1
  src/auth/               | 8   | 2
  src/auth/strategies/    | 4   | 3
  src/api/                | 22  | 2
  src/api/routes/         | 11  | 3
  src/api/middleware/     | 6   | 3
  ...
```

**What to count as source files:** `.ts`, `.js`, `.py`, `.go`, `.rs`, `.java`,
`.kt`, `.rb`, `.ex`, `.exs`, `.cs`, `.cpp`, `.c`, `.swift`, `.php`. Exclude
lock files, config files (`.json`, `.yaml`, `.toml` unless they define code),
test files (unless `include_test_files: true`), and generated files.

---

### Step 4: Multi-level module boundary detection

Modules are the primary unit of documentation. Apply these heuristics in layers,
from coarsest to finest, collecting all candidates before deduplicating.

#### Layer 1: Monorepo packages (highest priority)

Each workspace package is its own top-level module. For each package:
- Record the package root as a module boundary
- Recurse into the package to find sub-modules (apply Layer 2-4 within it)

#### Layer 2: Top-level structural directories

Inside each package (or the repo root if not a monorepo), scan the first two
levels of directories for structural modules:

**Explicit source roots:** `src/`, `lib/`, `app/`, `pkg/`, `cmd/`
- Every direct child directory of these roots with 2+ source files is a module candidate

**Framework convention directories** (these are themselves modules):
- Express/Fastify/Hapi: `routes/`, `controllers/`, `middleware/`, `services/`, `models/`
- Next.js: `app/` (or `pages/`), `components/`, `lib/`, `server/`
- Django/Flask: `views/`, `models/`, `serializers/`, `urls/`
- Rails: `app/models/`, `app/controllers/`, `app/services/`
- Spring: `controller/`, `service/`, `repository/`, `config/`
- Go: every directory containing `.go` files is a package (and a module candidate)
- Rust: every directory containing `mod.rs` or `lib.rs`

**Domain/feature directories** - Any directory 1-3 levels deep whose name
suggests a domain concept: `auth`, `billing`, `users`, `products`, `orders`,
`notifications`, `search`, `analytics`, `admin`, `api`, `core`, `shared`,
`common`, `utils`, `helpers`, `hooks`, `store`, `context`, `types`

#### Layer 3: Deep scanning for large modules

For every module candidate from Layer 2 that has **15+ source files** OR
contains **subdirectories with 3+ files each**, recursively scan inside it to
find sub-modules. Apply this rule:

> If a module contains a subdirectory with 3+ source files and a distinct
> purpose (different name from parent, has its own index/exports), that
> subdirectory becomes a sub-module documented in `modules/<parent>/<child>.md`.

Examples of when to split:
- `src/api/` with 22 files splits into `api/routes`, `api/middleware`, `api/validators`
- `src/components/` with 30 files splits into `components/ui`, `components/forms`, `components/layout`
- `src/utils/` with 18 files splits into `utils/string`, `utils/date`, `utils/http`

Examples of when NOT to split:
- `src/auth/` with 8 files - document as one module even with 2-3 subdirs
- `src/config/` with 5 files - too small to warrant sub-modules
- Single-level flat directories with no internal structure

#### Layer 4: Minimum-threshold cleanup

After collecting all candidates:
- Keep modules with 2+ source files (lower than the manifest default to avoid gaps)
- Merge candidates that are clearly the same logical module (e.g., `types/` with
  1 file that only re-exports from `models/` - fold into `models`)
- Flag directories with 1 source file as "minor files" - mention in the parent
  module doc rather than creating a separate module doc

---

### Step 5: Cross-cutting pattern detection (expanded)

Patterns are concerns that span multiple modules. Scan for all of these:

**Structural patterns:**
- **Error handling** - Shared error types, error middleware, Result/Either patterns,
  custom exception classes, error codes/enums
- **Logging/observability** - Logger setup, structured logging, metrics export,
  tracing instrumentation, correlation IDs
- **Configuration** - Config loading order, environment variable handling, feature
  flags, secrets management
- **Authentication/authorization** - Auth middleware, JWT/session handling, guards,
  decorators, permission checks, RBAC

**Data patterns:**
- **Database access** - ORM setup, migration patterns, repository/DAO patterns,
  connection management, query builders
- **Caching** - Cache clients, cache key conventions, TTL patterns, cache
  invalidation strategies
- **Event/message handling** - Queue clients, event emitters, pub/sub patterns,
  event schemas
- **External API clients** - HTTP client wrappers, retry logic, circuit breakers,
  service clients

**Code quality patterns:**
- **Testing** - Test directory structure, test utilities, fixtures, factories,
  mocking patterns, test configuration, test helpers
- **Validation** - Input validation libraries, schema validation, DTO patterns,
  sanitization
- **Type system** - Shared type definitions, interfaces, enums, generics patterns
- **Dependency injection** - DI containers, service registration, provider patterns

**Operational patterns:**
- **API conventions** - Request/response schemas, pagination patterns, versioning,
  error response format, serialization
- **Background jobs** - Job queue setup, worker definitions, scheduled tasks,
  job retry patterns
- **File/storage handling** - File upload patterns, storage clients, CDN integration
- **Internationalization** - i18n library setup, translation file structure,
  locale handling

Only create a pattern doc if the pattern appears in 2+ modules. Single-module
patterns belong in the module doc.

---

### Step 6: Coverage verification

After collecting all module candidates and patterns, run a coverage check before
presenting the plan. This ensures the documentation plan covers the codebase
adequately.

**Calculate coverage:**
```
covered_files = sum of source files in all module candidates
total_files = total source files from the census (Step 3)
coverage = covered_files / total_files * 100
```

**Coverage targets by repo size:**
| Total source files | Minimum acceptable coverage |
|---|---|
| < 50 files | 90% |
| 50-200 files | 80% |
| 200-500 files | 70% |
| 500+ files | 60% (focus on top-level architecture) |

**If coverage is below target:**
1. Identify uncovered directories (those in the census but not in any module candidate)
2. For each uncovered directory with 2+ source files, add it as a module candidate
3. For single files not in any module, group them into a `misc` module or fold
   them into the nearest parent module
4. Re-run coverage calculation
5. Report the final coverage percentage in the discovery plan

**Always report in the discovery plan:**
```
Coverage: <N>% (<covered> of <total> source files documented)
```

---

### Step 7: Present the plan

Before writing any documentation, present the discovery results to the user:

```
Codedocs Discovery Plan
========================
Repository: <name>
Tech stack: <language> + <framework> (<build tool>)
Entry points: <list>

Modules to document (<count>):
  Top-level modules:
  - <module-name> (<path>) - <one-line summary> (<N> files)
  - ...

  Sub-modules:
  - <parent>/<child> (<path>) - <one-line summary> (<N> files)
  - ...

Patterns detected (<count>):
  - <pattern-name> - <where it appears>
  - ...

Coverage: <N>% (<covered> of <total> source files)
Estimated output: <N> files in <output-dir>/
  - 1 OVERVIEW.md
  - 1 INDEX.md
  - <N> module docs
  - <N> pattern docs
  - 1 .codedocs.json

Proceed? [Y/n]
```

Wait for user approval. They may want to add, remove, rename, or merge modules.
If coverage is below target, proactively call out which directories are uncovered
and ask if they should be included.

---

### Step 8: Generate INDEX.md

After writing all module docs, generate `INDEX.md` as a lookup table mapping
every significant source file to its module doc. This is primarily for AI agent
navigation.

```markdown
# File Index

Quick lookup: find which module documents any file in this repo.

| File | Module | Doc |
|---|---|---|
| `src/auth/middleware.ts` | auth | `modules/auth.md` |
| `src/auth/strategies/jwt.ts` | auth/strategies | `modules/auth/strategies.md` |
| `src/api/routes/users.ts` | api/routes | `modules/api/routes.md` |
| ... | ... | ... |
```

Only include files that are part of a documented module. Skip generated files,
lock files, and trivial configs.

---

## Output templates

### OVERVIEW.md Template

```markdown
# <Project Name>

<2-3 sentence summary of what the project does, who it's for, and the core
problem it solves.>

## Tech Stack

| Layer | Technology |
|---|---|
| Language | <e.g. TypeScript> |
| Framework | <e.g. Next.js 14> |
| Database | <e.g. PostgreSQL via Prisma> |
| Testing | <e.g. Vitest + Playwright> |
| Build | <e.g. Turbopack> |

## Architecture

<2-4 paragraphs describing the high-level architecture. Include:
- System boundaries (what's in this repo vs external services)
- Request/data flow (how a request enters, gets processed, and returns)
- Key architectural decisions and their rationale>

## Entry Points

| Entry point | Purpose |
|---|---|
| `<path>` | <what it starts/serves> |

## Module Map

| Module | Path | Description | Files |
|---|---|---|---|
| <name> | `<path>` | <one-line purpose> | <N> |

> Sub-modules are listed under their parent. See `INDEX.md` for file-level lookup.

## Cross-cutting Patterns

| Pattern | Doc | Modules affected |
|---|---|---|
| <name> | `patterns/<name>.md` | <module list> |

## Key Concepts

<Glossary of domain-specific terms used throughout the codebase. Only include
terms that would confuse someone unfamiliar with the project.>

## Getting Started

<Minimal steps to clone, install, and run the project locally. Pull from
existing README if available.>

## Documentation Coverage

Generated by codedocs. Coverage: <N>% (<covered>/<total> source files).
Last updated: <timestamp> at commit `<sha>`.
```

---

### Module Doc Template

Each module doc in `modules/` follows this structure. For top-level modules with
sub-modules, include a sub-module index at the top.

```markdown
# <Module Name>

<1-2 sentence summary of the module's purpose and responsibility.>

## Sub-modules

> Only include this section if the module has sub-modules.

| Sub-module | Doc | Description |
|---|---|---|
| <name> | `modules/<parent>/<child>.md` | <purpose> |

## Public API

<List of exported functions, classes, types, or endpoints with brief
descriptions. This is what other modules consume.>

## Internal Structure

<How the module is organized internally. Key files and their roles.
Only list files that are important for understanding - skip trivial
utility files.>

| File | Purpose |
|---|---|
| `<relative-path>` | <what it does> |

## Dependencies

| Depends on | Why |
|---|---|
| <module/package> | <what it uses from it> |

## Dependents

| Used by | How |
|---|---|
| <module> | <what it imports/uses> |

## Implementation Notes

<Key design decisions, non-obvious behavior, performance considerations,
or known limitations specific to this module. Skip this section if there
is nothing noteworthy.>
```

---

### Pattern Doc Template

Each pattern doc in `patterns/` follows this structure:

```markdown
# <Pattern Name>

<1-2 sentence description of the pattern and why the codebase uses it.>

## Where It Appears

<List of modules that implement or interact with this pattern.>

## Convention

<The rules to follow when working with this pattern. Be specific -
code style, naming conventions, file placement, etc.>

## Examples

<2-3 concrete examples from the codebase showing the pattern in use.
Reference actual file paths.>

## Adding to This Pattern

<What a developer should do when adding new code that touches this pattern.
E.g., "When adding a new route, register it in X and add error handling
using Y.">
```
