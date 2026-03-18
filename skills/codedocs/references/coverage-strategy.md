<!-- Part of the codedocs AbsolutelySkilled skill. Load this file when
     running codedocs:status or when coverage is below target. -->

# Coverage Strategy

Reference for measuring, improving, and maintaining documentation coverage -
how to ensure a large or complex repo is comprehensively documented, not just
partially skimmed.

---

## Why coverage matters

Documentation that covers 40% of a codebase is often worse than no documentation:
it gives a false sense of completeness and fails the most common question ("where
is this?"). Codedocs targets meaningful coverage, not perfection - the goal is
that any developer or AI agent can navigate to the right place without reading
raw source code.

---

## Running codedocs:status

**Command:** `codedocs:status`

Read `.codedocs.json` and produce a coverage report:

```
Codedocs Status
===============
Project: <name>
Generated: <date>
Last updated: <date> (commit <sha>)
Updates applied: <N>

Coverage: <N>% (<documented>/<total> source files)

Documented modules (<count>):
  - <module-name> (<path>) - <N> files - last updated <date>
  - ...

Undocumented areas (<count> directories, <N> files):
  - <path> - <N> files [suggestion: add as module or fold into <nearest-module>]
  - ...

Stale modules (<count>):
  - <module-name> - documented at <sha>, code changed since
  - ...

Patterns: <count> documented
  - <pattern-name> - last updated <date>

Recommendation: <action based on coverage and staleness>
```

---

## Coverage targets

| Repo size (source files) | Target coverage | Acceptable minimum |
|---|---|---|
| < 50 | 95% | 85% |
| 50-200 | 85% | 75% |
| 200-500 | 75% | 65% |
| 500-1000 | 65% | 55% |
| 1000+ | 55% | 45% (focus on domain modules) |

For very large repos (1000+ files), prioritize coverage by importance:
1. **Domain modules** (business logic) - aim for 90%+ coverage
2. **API/interface layers** - aim for 85%+ coverage
3. **Infrastructure/platform code** - aim for 60%+ coverage
4. **Utility libraries** - aim for 50%+ coverage (often self-explanatory)
5. **Generated code** - exclude from coverage calculation

---

## How to improve coverage

### When below target after initial generate

1. **Run the gap analysis** - List all directories in the census not covered
   by any module doc. Sort by file count (highest first).

2. **Batch small undocumented directories** - Directories with 1-2 files that
   are clearly related to a larger documented module should be mentioned in
   that module's doc rather than getting their own doc.

3. **Create module docs for significant gaps** - For uncovered directories with
   3+ files, create new module docs. Use the standard module doc template.

4. **Use --exhaustive flag** - `codedocs:generate --exhaustive` lowers the
   minimum file threshold to 1 and documents every directory with at least
   one source file. Useful for repos with many small-but-important modules.
   Output will be larger but more complete.

5. **Group orphan files** - Source files not in any directory (directly in
   `src/` or repo root) get documented in a special `modules/root.md` module.

### When a module doc is too long (50+ lines of Internal Structure)

Split the module into sub-modules:
1. Identify the distinct sub-directories or groupings within the module
2. Create `modules/<parent>/` directory
3. Move the parent doc to `modules/<parent>.md` (keep it as an index)
4. Create `modules/<parent>/<child>.md` for each sub-module
5. Update `INDEX.md` to point files to their sub-module doc
6. Update `.codedocs.json` to add `sub_modules` entries

### When coverage is high but docs are shallow

Coverage percentage measures file coverage, not depth. Signs of shallow docs:
- Module docs with empty "Implementation Notes" everywhere
- Pattern docs with only one example
- Dependency/Dependent tables with 0-1 entries
- No "Getting Started" section in OVERVIEW.md

For shallow docs, re-read the source files for each module and enrich:
- Add real function/method names to Public API
- Add actual file paths to Internal Structure
- Fill in concrete dependency relationships
- Add working code examples to pattern docs

---

## Prioritization framework for large repos

When a repo is too large to document exhaustively in one session, use this
priority order:

### Tier 1: Always document first (core understanding)
- Entry points (main files, route definitions, CLI commands)
- Modules that are imported by 3+ other modules (high fan-in = central)
- Modules that import 5+ other modules (high fan-out = integration points)
- Authentication, authorization, and security modules
- Public API surface (what external callers use)

### Tier 2: Document second (operational understanding)
- Database and persistence layer
- Background jobs and async processing
- Configuration and feature flags
- Error handling and logging infrastructure
- Core domain/business logic modules

### Tier 3: Document when time allows (implementation details)
- Internal utilities and helpers
- Test infrastructure and fixtures
- Build tooling and scripts
- Third-party integration adapters
- UI components (when not the primary focus)

### Tier 4: Mention but don't deep-dive
- Generated code (proto files, ORM migrations, GraphQL schemas)
- Vendor/dependency overrides
- One-off scripts

---

## Maintaining coverage over time

### After new features are added

Run `codedocs:update --diff` after each significant feature. This:
- Detects new directories not yet in the manifest
- Flags stale modules whose files changed
- Suggests new module docs for new feature directories

Set a reminder to run `codedocs:status` at the start of each sprint to catch
coverage drift before it accumulates.

### Coverage budget

Define a coverage budget in `.codedocs.json`:

```json
"config": {
  "coverage_budget": {
    "minimum_percentage": 70,
    "alert_on_drift": 5
  }
}
```

With a budget set, `codedocs:update` will warn if coverage drops below
`minimum_percentage` or if a single update causes coverage to drop by more
than `alert_on_drift` percentage points (e.g., a module was deleted but its
doc wasn't cleaned up).

### Staleness budget

A module doc is "stale" when the git SHA recorded in the manifest no longer
matches the latest commit on that module's source path. In `codedocs:status`,
modules stale for more than 30 days are flagged as high priority for update.

---

## Coverage anti-patterns

| Anti-pattern | Effect | Fix |
|---|---|---|
| Stopping at top-level directories | Only 5-10 modules documented for a 200-file repo | Run deep scan (Step 3-4 of generate-workflow) |
| One giant module doc for `src/` | Doc is too long to be useful; everything is in one place | Split into sub-modules |
| Skipping small but critical modules | Core utilities undocumented; patterns can't be explained | Lower threshold to 2 files; document them |
| Counting generated files in coverage | Inflated coverage %; real logic is underdocumented | Exclude generated files from census |
| Never running status | Coverage drifts silently over months | Run `codedocs:status` weekly or in CI |
| Documenting file names but not behavior | High file coverage, zero explanatory value | Every module doc must describe *what*, *why*, and *how* |
