<!-- Part of the codedocs AbsolutelySkilled skill. Load this file when
     creating or validating the codedocs output directory structure. -->

# Output Structure

Complete specification for the codedocs output directory, file formats,
and the `.codedocs.json` manifest schema.

---

## Directory Layout

```
<output-dir>/                    # Default: docs/ at repo root
  OVERVIEW.md                    # Architecture, tech stack, entry points, module map
  INDEX.md                       # File-to-module lookup table for AI agent navigation
  .codedocs.json                 # Manifest: tracked modules, SHAs, config, coverage stats
  modules/                       # One file per code module (flat for simple modules)
    <module-name>.md             # e.g. auth.md, api.md, database.md
    <module-name>/               # Directory for modules with sub-modules
      <sub-module>.md            # e.g. api/routes.md, api/middleware.md
  patterns/                      # One file per cross-cutting concern
    <pattern-name>.md            # e.g. error-handling.md, testing.md
```

### When to use flat files vs sub-module directories

Use a **flat file** (`modules/auth.md`) when:
- The module has fewer than 15 source files
- The module has no meaningfully distinct internal directories
- All of the module's behavior can be described in one focused document

Use a **sub-module directory** (`modules/api/routes.md`, `modules/api/middleware.md`) when:
- The module has 15+ source files with distinct internal groupings
- Sub-directories have 3+ files each with a clearly different purpose
- The module doc would otherwise need 4+ "Internal Structure" subsections

A parent module with sub-modules still gets its own `<module-name>.md` as an
index that describes the module's overall purpose and lists sub-modules. The
sub-module files contain the detailed content.

### Naming conventions

- **Module files**: kebab-case matching the directory or package name.
  `src/auth/` becomes `modules/auth.md`. `packages/user-service/` becomes
  `modules/user-service.md`.
- **Sub-module files**: kebab-case inside a directory named after the parent.
  `src/api/routes/` becomes `modules/api/routes.md`.
- **Pattern files**: kebab-case describing the concern.
  `patterns/error-handling.md`, `patterns/testing-strategy.md`,
  `patterns/logging-conventions.md`.
- **No deeper nesting**: Sub-module directories are the deepest level allowed.
  `modules/<parent>/<child>.md` is the maximum depth. Do not create
  `modules/<parent>/<child>/<grandchild>.md`.

### Output directory configuration

The output directory defaults to `docs/` at the repo root. Override with
the `--output` flag:

```
codedocs:generate --output documentation/
codedocs:generate path/to/subpackage --output path/to/subpackage/docs/
```

The output directory is recorded in the manifest so that `codedocs:ask` and
`codedocs:update` can find it automatically.

---

## .codedocs.json Manifest Schema

```json
{
  "version": "1.1",
  "project_name": "<repo or directory name>",
  "output_dir": "docs/",
  "generated_at": "2026-03-18T10:30:00Z",
  "last_updated": "2026-03-18T14:45:00Z",
  "last_global_sha": "abc1234def5678...",
  "update_count": 0,
  "tech_stack": {
    "primary_language": "TypeScript",
    "framework": "Next.js 14",
    "build_tool": "Turbopack",
    "test_framework": "Vitest",
    "package_manager": "pnpm"
  },
  "coverage": {
    "total_source_files": 187,
    "documented_source_files": 154,
    "percentage": 82
  },
  "modules": [
    {
      "name": "auth",
      "source_path": "src/auth/",
      "doc_path": "modules/auth.md",
      "description": "Authentication and authorization middleware",
      "last_sha": "abc1234...",
      "last_updated": "2026-03-18T10:30:00Z",
      "file_count": 8,
      "primary_language": "TypeScript",
      "sub_modules": []
    },
    {
      "name": "api",
      "source_path": "src/api/",
      "doc_path": "modules/api.md",
      "description": "REST API route handlers and middleware",
      "last_sha": "def5678...",
      "last_updated": "2026-03-18T10:30:00Z",
      "file_count": 22,
      "primary_language": "TypeScript",
      "sub_modules": [
        {
          "name": "api/routes",
          "source_path": "src/api/routes/",
          "doc_path": "modules/api/routes.md",
          "description": "Route definitions for all API endpoints",
          "last_sha": "def5678...",
          "last_updated": "2026-03-18T10:30:00Z",
          "file_count": 11
        },
        {
          "name": "api/middleware",
          "source_path": "src/api/middleware/",
          "doc_path": "modules/api/middleware.md",
          "description": "Request/response middleware chain",
          "last_sha": "def5678...",
          "last_updated": "2026-03-18T10:30:00Z",
          "file_count": 6
        }
      ]
    }
  ],
  "patterns": [
    {
      "name": "error-handling",
      "doc_path": "patterns/error-handling.md",
      "description": "Shared error types and error middleware",
      "appears_in": ["auth", "api", "database"]
    }
  ],
  "config": {
    "ignore_paths": ["node_modules", "dist", "build", ".git", "coverage"],
    "min_module_files": 2,
    "include_test_files": false,
    "max_sub_module_depth": 1
  }
}
```

### Field descriptions

| Field | Type | Description |
|---|---|---|
| `version` | string | Manifest schema version. Currently `"1.1"` |
| `project_name` | string | Name of the project (from package.json, Cargo.toml, or directory name) |
| `output_dir` | string | Relative path to the output directory from repo root |
| `generated_at` | string | ISO 8601 timestamp of initial generation |
| `last_updated` | string | ISO 8601 timestamp of most recent update |
| `last_global_sha` | string | Git commit SHA at last generation/update |
| `update_count` | number | Number of times `codedocs:update` has been run |
| `tech_stack` | object | Detected technology stack |
| `coverage` | object | Documentation coverage statistics |
| `coverage.total_source_files` | number | Total source files in repo (excluding ignored paths) |
| `coverage.documented_source_files` | number | Source files covered by at least one module doc |
| `coverage.percentage` | number | Integer percentage of documented files |
| `modules` | array | List of documented modules (includes top-level and those with sub-modules) |
| `modules[].name` | string | Module name (kebab-case, or `parent/child` for sub-modules) |
| `modules[].source_path` | string | Relative path to source directory |
| `modules[].doc_path` | string | Relative path to module doc file (from output dir) |
| `modules[].description` | string | One-line description of the module |
| `modules[].last_sha` | string | Git SHA of latest commit touching this module |
| `modules[].last_updated` | string | ISO 8601 timestamp of last doc update for this module |
| `modules[].file_count` | number | Number of source files in the module |
| `modules[].primary_language` | string | Dominant language in the module |
| `modules[].sub_modules` | array | Sub-module entries (same shape, no further nesting) |
| `patterns` | array | List of documented cross-cutting patterns |
| `patterns[].name` | string | Pattern name (kebab-case) |
| `patterns[].doc_path` | string | Relative path to pattern doc file |
| `patterns[].description` | string | One-line description |
| `patterns[].appears_in` | array | Module names where this pattern is found |
| `config` | object | Generation configuration |
| `config.ignore_paths` | array | Paths to skip during discovery |
| `config.min_module_files` | number | Minimum files for a directory to become a module (default: 2) |
| `config.include_test_files` | boolean | Whether to scan test files during discovery |
| `config.max_sub_module_depth` | number | Maximum nesting depth for sub-modules (always 1) |

---

## File Format Guidelines

### All doc files

- Use standard GitHub-flavored Markdown
- Start with a level-1 heading (`# Title`)
- Use level-2 headings (`## Section`) for major sections
- Use tables for structured data (dependencies, exports, config)
- Use code blocks with language annotation for code references
- Reference file paths relative to the repo root
- Keep each file self-contained - don't require reading other files to
  understand the basics (cross-references are fine for deep dives)

### OVERVIEW.md specifics

- Must be readable in under 5 minutes by a human
- Must contain enough context for an AI agent to route questions to the
  right module doc
- Module Map table is the routing index - every documented module must
  appear here (sub-modules nested under their parent)
- Cross-cutting Patterns table is the secondary routing index
- Getting Started section should be copy-pasteable commands
- Always include a Documentation Coverage line at the bottom

### INDEX.md specifics

- One row per source file that belongs to a documented module
- Sorted alphabetically by file path
- Columns: File, Module, Doc (link to module doc)
- Primary purpose is AI agent navigation: given a file name, find the doc
- Does not include undocumented files (they're not linked to any doc)
- Updated during `codedocs:update` when files are added or moved

### Module doc specifics

- Public API section is the most important - this is what consumers need
- Internal Structure table should cover every significant file (not trivial helpers)
- Dependencies and Dependents sections enable understanding the module in
  context without reading the full codebase
- Implementation Notes is optional - only include if there are genuinely
  non-obvious design decisions
- Parent module docs (those with sub-modules) should have a Sub-modules table
  immediately after the opening summary

### Pattern doc specifics

- Convention section must be prescriptive, not descriptive - tell the
  reader what to do, not just what exists
- Examples must reference actual file paths in the repo
- Where It Appears must list specific modules, not vague references
- Adding to This Pattern section helps developers extend the pattern correctly

---

## Default Ignore Paths

These paths are always excluded from discovery unless explicitly overridden:

```
node_modules/
dist/
build/
.git/
coverage/
.next/
.nuxt/
__pycache__/
*.pyc
target/          # Rust, Java
vendor/          # Go, PHP, Ruby
.cache/
.turbo/
.vercel/
.output/
out/
.expo/
.svelte-kit/
generated/
gen/
*.generated.*
*.pb.go          # Protobuf generated
*_pb2.py         # Protobuf generated
```

Test directories (`__tests__/`, `test/`, `tests/`, `spec/`) are excluded by
default but can be included with `config.include_test_files: true` in the
manifest. When included, test files count toward coverage but are documented
under the `patterns/testing-strategy.md` pattern doc rather than as modules.
