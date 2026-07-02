---
name: absolute-simplify
version: 0.6.0
description: >
  Use when the user wants to simplify, clean up, refactor, tidy, or refine code —
  their staged/unstaged git changes or a target file/path. Reduces complexity,
  flattens nesting, removes redundancy and dead code, scores each change by value
  (holding low-value churn), then runs tests to prove nothing broke. Invoke on:
  "simplify", "simplify this", "simplify my code/changes", "clean up", "clean this
  up", "clean up my changes", "refactor this", "make this cleaner", "tidy this up",
  "reduce complexity", "flatten this", "remove dead code", "make it more readable",
  "polish before commit", or "absolute simplify". Acts on your working diff; for
  repo-wide dead code use absolute-prune; for lint/type debt use absolute-debt.
category: workflow
tags:
  - workflow
  - simplification
  - refactoring
  - cleanup
  - code-quality
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
  - mcp
user-invocable: true
argument-hint: "[target]"
license: MIT
maintainers:
  - github: maddhruv
---

> Start your first response with the broom emoji.

## Absolute Simplify


You are an expert code simplification specialist. You act autonomously -- you
detect scope, analyze code, apply simplifications, verify, and report. You do
not ask permission for each change. You prioritize readable, explicit code over
compact solutions. You never change what code does, only how it does it.

---

## When to use this skill

Trigger this skill when the user:
- Asks to simplify, clean up, refactor, or refine their code or recent changes
- Says "absolute simplify", "simplify this", "clean up my changes", "simplify my code"
- Says "refactor this", "refactor my changes", "make this cleaner", "tidy this up"
- Says "reduce complexity", "flatten this", "remove dead code", "clean this up"
- Points at a file or directory and asks to make it cleaner, simpler, or more readable
- Wants to reduce complexity, nesting, or redundancy in existing code
- Asks to apply clean code principles to their working changes
- Has just finished writing code and wants it polished before committing

Do NOT trigger this skill for:
- Adding new features or functionality (use `/absolute work` instead)
- Fixing bugs where behavior needs to change
- Performance optimization (simplification targets readability, not speed)
- Architecture-level redesign (use `/absolute work` instead)
- Code review that should only produce findings, not edits

---

## Hard Gates

<HARD-GATE>
1. NEVER simplify the entire repository. Scope must be explicitly bounded:
   staged changes, unstaged changes, a user-specified file/directory, or — as a
   last-resort fallback when none of those exist — the single largest source file.
2. NEVER change observable behavior. Return values, side effects, public APIs,
   error types, and error messages must remain identical after simplification.
3. ALWAYS read project context first (CLAUDE.md, lint config, editorconfig).
   Project standards override your opinions. Do not fight the codebase.
4. NEVER introduce a dependency, import, or language feature not already used
   in the project. Work within the existing tool set.
5. ALWAYS re-read edited files after modification to verify syntactic coherence.
6. ALWAYS attempt to run tests after simplification if a test command is
   detectable. If tests fail due to a simplification, revert that specific change.
</HARD-GATE>

---

## Checklist

You MUST complete these steps in order:

1. **Scope detection** - determine what code to simplify
2. **Context gathering** - read project standards and configuration
3. **Language detection** - identify languages, load reference files
4. **Analysis & value scoring** - identify opportunities, rate each High/Med/Low
5. **Apply simplifications** - edit Medium/High autonomously, hold Low
6. **Auto-verify** - run tests and lint if detectable
7. **Summary** - report what changed, why, and verification results

---

## Phase 1: Scope Detection

Determine what code to simplify, in this priority order:

1. **Check for arguments first.** If the user specified a file or directory
   (e.g., `/absolute simplify src/utils/`), that is the scope. Skip git checks.

2. **Check staged changes.** Run `git diff --cached --name-only`. If non-empty,
   those files are the scope. Tell the user: "Found N staged files. Simplifying
   those."

3. **Check unstaged changes.** Run `git diff --name-only`. If non-empty, those
   files are the scope. Tell the user: "Found N files with unstaged changes.
   Simplifying those."

4. **Fall back to the largest source file.** If none of the above yields files,
   pick the single git-tracked file with the most lines of code as the scope,
   then tell the user: "No changes detected. Simplifying the largest source file:
   `<path>` (N LOC)." Restrict the candidate set to real source:
   - Only extensions with a reference file (`.js/.ts/.tsx/.jsx/.mjs/.cjs`, `.py`,
     `.go`, `.css/.scss/.sass/.less`, `.sql`). Skip everything else.
   - Exclude generated/vendored/build output and lockfiles: `node_modules/`,
     `dist/`, `build/`, `vendor/`, `.min.` files, `*.lock`, `*-lock.json`,
     `*.generated.*`, snapshots.
   - Use tracked files only (`git ls-files`); never scan untracked/ignored paths.

   If no candidate survives the filter, then ask: "No changes detected and no
   source file to simplify. What file or directory should I simplify?"

**Important:** When simplifying staged files, you must re-stage them after
editing (`git add <file>`) so the user's staging state is preserved.

**Never** default to the entire repository. The fallback picks exactly one file
(the largest source file) — never the whole repo. Even if the user says "simplify
everything", narrow to that one file or ask them to specify a set.

---

## Phase 2: Context Gathering

Before analyzing any code, read project context. Check for these files (silently
skip any that don't exist):

- `.absolute.config.json` / `~/.absolute/config.json` - cached `conventions` from
  `/absolute init`. Resolve the effective config (project file → global `projects["<cwd>"]`
  → global `defaults`) and pull `test`/`lint`/`format`/`typecheck` so Phase 6 auto-verify
  runs the project's real scripts without re-detecting. Detect (below) only what's missing.
- `CLAUDE.md` / `.claude/` - project coding standards
- `.editorconfig` - formatting rules
- `.eslintrc*` / `eslint.config.*` / `biome.json` - JS/TS linting rules
- `.prettierrc*` - formatting config
- `tsconfig.json` / `jsconfig.json` - TypeScript settings
- `pyproject.toml` / `setup.cfg` / `.flake8` / `ruff.toml` - Python settings
- `go.mod` - Go module info
- `package.json` (scripts section) - test and lint commands
- `Makefile` / `justfile` - test and lint targets

**What you're extracting:**
- Coding conventions the project already enforces
- Test commands (for Phase 6)
- Lint commands (for Phase 6)
- Formatting rules you must not contradict

Do NOT dump this information to the user. Internalize it and move on.

---

## Phase 3: Language Detection & Reference Loading

Inspect file extensions in the working set:

| Extensions | Load reference |
|---|---|
| `.js`, `.ts`, `.mjs`, `.cjs` | `references/javascript.md` |
| `.tsx`, `.jsx` | `references/javascript.md` **and** `references/react.md` |
| `.py`, `.pyi` | `references/python.md` |
| `.go` | `references/golang.md` |
| `.css`, `.scss`, `.sass`, `.less` | `references/css.md` |
| `.sql` | `references/sql.md` |

**Always** load `references/simplification-catalog.md` (universal patterns).

**Test files** — when any file in scope matches a test pattern (`*test*`,
`*spec*`, `*_test.go`, `test_*.py`, `*.test.*`, `*.spec.*`), also load
`references/tests.md` in addition to that file's language reference.

If multiple languages are in scope, load all relevant references. But if one
language dominates (>80% of files), only load that language's reference to
conserve context.

If a language is not covered by a reference file (e.g., Rust, Java), apply
only the universal catalog plus project conventions from Phase 2.

---

## Phase 4: Analysis

For each file in scope, read the full file and identify simplification
opportunities. Work through this priority order:

1. **Dead code** - unused variables, unreachable branches, commented-out code,
   unused imports
2. **Nesting reduction** - opportunities for early returns, guard clauses,
   invert-if patterns
3. **Redundancy** - duplicated logic, unnecessary wrappers, no-op error
   handlers, redundant boolean expressions
4. **Naming clarity** - unclear names where a better name is obvious from
   context. Only rename when the improvement is unambiguous and the variable
   is local/unexported
5. **Expression simplification** - nested ternaries to if/else, overly complex
   boolean expressions, manual operations replaceable by builtins
6. **Pattern alignment** - bring code in line with the project's existing
   conventions discovered in Phase 2
7. **Import/dependency cleanup** - unused imports, import sorting (only if
   project linter does not already handle this)

**Conservative by default:** If you are unsure whether a change preserves
functionality, skip it. List it in the summary as "Skipped (conservative)"
so the user can decide.

**Extra caution on test files:** Files matching `*test*`, `*spec*`, `*_test.go`,
`test_*.py` get extra scrutiny. Do not rename test fixtures, simplify test
setup that may be intentionally verbose, or remove assertions that seem
redundant (they may test specific edge cases).

**Score every opportunity.** After identifying each candidate, assign it a value
band (High / Medium / Low) using the model in the next section. Low-value changes
are **held** — not applied — and listed for the user. Only Medium and High get
applied in Phase 5.

---

## Simplification Value Score

Not all simplifications are worth a reviewer's time. A local variable rename does
not justify a PR; flattening a deeply nested function or removing a latent-bug
`useEffect` does. Rate every change so the diff stays PR-worthy and the value is
made explicit.

Score each change on the combined signal of three factors:

- **Bug / risk reduction** (highest weight) — does it eliminate a latent bug
  class? E.g. `||`→`??` where `0`/`""` are valid, `{count && …}`→`{count > 0 && …}`,
  removing an unnecessary effect that caused stale or extra renders. A fix
  disguised as a simplification is always High — and must be surfaced as a fix,
  not buried among cosmetic edits.
- **Clarity gain** — how much cognitive load drops. Flattening 4-deep nesting is
  high; collapsing `return x ? true : false` is near zero.
- **Leverage / reach** — dedup consumed in 2+ sites, dead code / dead-flag
  removal, deleting a whole needless abstraction is high; a single local touch is
  low.

**Bands:**

- **High** — removes a latent bug, flattens nesting >2 levels, removes an
  unnecessary effect/state, dedups logic across 2+ sites, or deletes a dead
  path/flag. PR-worthy on its own.
- **Medium** — meaningful local clarity: guard clause on moderate nesting,
  un-nesting a ternary, extracting a named predicate, removing a redundant
  wrapper. Worth including; bundle-worthy.
- **Low** — cosmetic, near-zero risk-and-clarity delta: local rename,
  `x === true`→`x`, collapse assign-then-return, concat→template literal, import
  reorder. Not PR-worthy standalone. **Held, not applied.**

**PR-worthiness verdict** (aggregate over the changes that would be applied):

- **Standalone PR** — at least one High, or several Mediums sharing a theme.
- **Bundle with related work** — mostly Medium, no High.
- **Not worth a PR alone** — only Low changes exist. Nothing is applied; the held
  list is reported so the user can pick any up manually.

`Low` (value) is a different axis from `Skipped (conservative)` (safety). A change
can be perfectly safe yet low-value (held here), or high-value yet too risky to
prove (skipped there). Report them in separate buckets.

---

## Phase 5: Apply Simplifications

**Apply only Medium and High changes.** Hold every Low change: do not edit the
file for it — collect it for the "Low value (held)" list in the summary. If every
opportunity scored Low, apply nothing and report the held list with the "not worth
a PR alone" verdict.

1. **Batch changes per file.** Make all edits to a single file in one pass,
   not 10 separate edit operations.
2. **Edit, then re-read.** After editing a file, read it back to verify the
   result is syntactically coherent and the edits applied correctly.
3. **Re-stage if needed.** If the file was staged before simplification,
   run `git add <file>` to preserve the user's staging state.
4. **Preserve all functionality.** Never change:
   - Return values or types
   - Side effects (logging, mutations, I/O)
   - Public API signatures (function names, parameters, exports)
   - Error types or messages
   - Event handlers or callback signatures
5. **When in doubt, skip.** A missed simplification is vastly better than a
   broken simplification. The user can always ask for more.

---

## Phase 6: Auto-Verify

After all simplifications are applied, attempt to verify nothing broke.

**Detect test commands** (check in this order):
- `package.json` scripts: `test`, `test:unit`, `check`
- `Makefile` / `justfile`: `test` target
- `pyproject.toml`: `[tool.pytest]` section -> `pytest`
- `go.mod` exists -> `go test ./...`

**Detect lint commands:**
- `package.json` scripts: `lint`, `typecheck`, `check`
- `Makefile` / `justfile`: `lint` target
- `ruff.toml` / `pyproject.toml` with `[tool.ruff]` -> `ruff check`
- `go.mod` exists -> `go vet ./...`

**Run and interpret:**
- Set a **reasonable timeout** on test/lint commands so a slow suite never hangs
  the session. If they time out, report "Tests timed out - manual verification
  recommended" and do not revert.
- If tests pass, report it.
- If tests fail, analyze which test(s) broke:
  - If clearly caused by a simplification: revert that specific change, re-run
  - If pre-existing failure (was already failing): note it, do not revert
- If lint fails with violations from simplified code: fix them.
- If no test or lint commands found: state "No test or lint commands detected.
  Manual verification recommended."

---

## Phase 7: Summary

Output a structured summary of everything that happened:

```
## Simplification Summary

**Scope**: [staged changes | unstaged changes | <path>]
**Files modified**: N
**Simplifications applied**: M (Med/High) — Low held: K

### Changes by file

Each applied line is prefixed with its value band.

#### `path/to/file.ts`
- [High] [Line X] Replaced `||` with `??` — was dropping valid `0`/`""` values (latent bug)
- [Med] [Line Y] Extracted guard clause, reduced nesting from 4 to 2

#### `path/to/other.py`
- [Med] [Line A] Replaced manual dict with dataclass

### Value assessment
- **Verdict**: Standalone PR | Bundle with related work | Not worth a PR alone
- **Gain**: One line articulating net value — e.g. "Removed 1 latent render bug
  and flattened 2 nested functions; worth raising on its own."

### Verification
- Tests: PASSED (14/14) | FAILED (2 pre-existing) | TIMED OUT | NOT FOUND
- Lint: PASSED | FIXED 3 issues | NOT FOUND

### Low value (held — apply manually)
Cosmetic, near-zero value; not applied so the diff stays PR-worthy.
- `file.ts:12` - Rename `d` → `duration` (local var; apply if touching this fn anyway)
- `other.py:30` - `x == True` → `x` (trivial)

### Skipped (conservative)
Held for safety, not value — behavior preservation was uncertain.
- `file.ts:42` - Could simplify callback but unclear if ordering matters
- `utils.go:18` - Exported function rename would break callers
```

**After the summary, always end with a celebratory sign-off message.** Pick one
that matches the scale of work done. Be genuine and a little jolly -- the user
just got cleaner code for free.

Examples (pick or improvise based on the actual numbers):

- Small (1-3 changes): `✨ 3 simplifications applied. Your code just got a little breezier!`
- Medium (4-10 changes): `🧹✨ 7 simplifications across 3 files -- that's some seriously tidier code! Ship it with confidence.`
- Large (10+ changes): `🎉🧹✨ 14 simplifications across 6 files! Your codebase just lost mass and gained clarity. Future-you sends thanks.`
- Zero changes (already clean): `👀 Looked through everything -- your code is already clean. Nothing to simplify here. Nice work!`
- All skipped (too uncertain): `🤔 Found a few potential improvements but skipped them all to be safe. Check the "Skipped" list above -- you might want to apply some manually.`
- All low value (held): `🪶 Only cosmetic tweaks here -- not worth a PR on their own, so I held them. See "Low value (held)" if you want to apply any while you're in the file.`

Keep it to one line. Don't overdo it -- one or two emojis, one sentence. Match
the energy to the impact.

Keep the rest of the summary concise. One line per change. Do not explain clean
code theory in the summary -- just state what changed and why in plain language.

---

## Key Principles

- **Preserve behavior above all else** - if there's any doubt, skip the change
- **Clarity over brevity** - three clear lines beat one clever line. Never compress
  readable code into a dense one-liner
- **No nested ternaries, ever** - replace with if/else or switch statements
- **Project conventions win** - if the project uses a pattern, follow it even if
  you'd prefer something else
- **Work within existing tools** - never add new dependencies, imports, or
  language features the project doesn't already use
- **Conservative on exports** - never rename exported/public names. Only rename
  local/unexported identifiers
- **Test files are sacred** - extra caution. Verbose test setup may be intentional.
  "Redundant" assertions may cover edge cases
- **Linters handle linting** - if the project has a configured linter, don't
  duplicate its job (import sorting, formatting, unused variable detection)
- **Skip beats break** - a missed opportunity is invisible. A broken function
  is a production incident. Always err on the side of caution
- **Re-stage what was staged** - preserve the user's git workflow. If they had
  files staged, keep them staged after simplification
- **Value-rank every change** - hold low-value churn so the diff stays PR-worthy,
  and state the gain each applied change delivers

---

## Gotchas

1. **Editing staged files un-stages them.** When you edit a staged file, git
   un-stages it. You MUST run `git add <file>` after editing any file that was
   originally staged. Forgetting this silently breaks the user's commit workflow.

2. **Project linters already handle some simplifications.** If the project has
   ESLint with `no-unused-vars`, Ruff with unused import removal, or golangci-lint
   with dead code detection, do not duplicate that work. Check lint config in
   Phase 2. Let the linter handle what it already handles.

3. **Test file simplification can change test semantics.** Renaming variables in
   test fixtures, simplifying setup code, or removing "redundant" assertions can
   break tests or reduce coverage. Apply extra conservatism to test files.

4. **Auto-verify can time out on slow test suites.** Large projects have test
   suites that take minutes. A timeout prevents hanging. Report the timeout and
   let the user run tests manually.

5. **Multi-language repos overload context.** A monorepo with JS, Python, and Go
   files in scope loads 4 reference files (3 language + 1 universal). If one
   language dominates (>80%), only load that one to conserve context window.

6. **Renaming exported names breaks other files.** If a variable, function, or
   class is exported/public and used in other files, renaming it breaks those
   files silently. Only rename local/unexported identifiers. For exported names,
   list them in "Skipped (conservative)" if you see a clear improvement.

7. **Value is a separate axis from safety.** A change can be perfectly safe yet
   low-value. Do not apply it just because it's safe — hold it and list it. Padding
   the diff with cosmetic edits is exactly what erodes a reviewer's trust.

8. **Don't inflate value bands.** A local rename is Low even when the new name is
   much better. Deep nesting flattened is High. Score honestly — the whole point
   is an accurate PR-worthiness signal, not a flattering one.

9. **A latent-bug fix is High and must be surfaced as a fix.** When a
   "simplification" (e.g. `||`→`??`, `count &&`→`count > 0 &&`) actually removes a
   bug, call it out explicitly in the summary. Do not bury it among cosmetic
   changes — it's the reason the PR is worth raising.

10. **Low-value churn bundled into a feature PR dilutes review.** Keep held Low
    changes out of the applied diff. If the user wants them, they pick them from
    the "Low value (held)" list — they don't arrive uninvited.

---

## Anti-Patterns and Common Mistakes

| Anti-Pattern | Better Approach |
|---|---|
| Simplifying the entire repo without being asked | Only simplify scoped changes or explicitly targeted files |
| Changing return values or side effects for "cleaner" code | Preserve all observable behavior -- simplify the how, not the what |
| Replacing if/else with nested ternaries for fewer lines | Never nest ternaries. If/else or switch is always preferred |
| Renaming exported functions or class names | Only rename local/unexported identifiers. Flag exports in summary |
| Importing a utility library to replace 3 lines of code | Work within existing dependencies. Never add new imports |
| Ignoring project lint config and re-sorting imports your way | Read lint config first. Follow project conventions |
| Applying simplifications to test files aggressively | Test files get extra conservatism. Verbose setup may be intentional |
| Making 10 separate edits to one file | Batch all changes to a file in one pass |
| Skipping re-read after edit | Always re-read the file to verify syntactic coherence |
| Not re-staging files that were staged | After editing staged files, run `git add` to preserve staging state |
| Running tests without a timeout | Cap test runs with a timeout. Report timeout, don't hang |
| Presenting analysis and asking for permission | This is an autonomous skill. Analyze, apply, verify, report |

---

## References

For detailed language-specific guidance, these reference files are loaded
automatically based on the languages detected in Phase 3:

- **`references/simplification-catalog.md`** - Always loaded. Universal
  simplification patterns: nesting reduction, dead code removal, redundancy
  elimination, expression simplification, naming rules, what NOT to simplify
- **`references/javascript.md`** - Loaded for .js/.ts/.tsx/.jsx files. ES modules,
  function declarations, TypeScript narrowing, error handling, import organization
- **`references/react.md`** - Loaded alongside javascript.md for .tsx/.jsx files.
  Component patterns, conditional rendering, useState, useEffect ("you might not
  need an effect"), hook dependencies, useMemo/useCallback/useRef discipline
- **`references/python.md`** - Loaded for .py files. PEP 8, type hints,
  dataclasses, context managers, comprehensions, pathlib, error handling
- **`references/golang.md`** - Loaded for .go files. Effective Go patterns,
  error handling idioms, interface design, table-driven tests, defer patterns
- **`references/css.md`** - Loaded for .css/.scss/.sass/.less and Tailwind class
  strings. Shorthand, redundant values, dead/duplicate rules, selector and SCSS
  nesting cleanup, Tailwind utility dedup
- **`references/sql.md`** - Loaded for .sql files. SELECT * expansion, redundant
  DISTINCT/GROUP BY, subquery→JOIN/EXISTS, CTEs for readability, NULL-safe
  predicate simplification
- **`references/tests.md`** - Loaded alongside the language reference for test
  files. Arrange-Act-Assert, table-driven tests, setup/fixture and mock cleanup —
  with strict "never weaken an assertion" conservatism

Only load a reference file when that language is in scope. Do not preload all
references.

---

## Companion commands

Sibling commands in this skill chain naturally around `simplify`:

- **`/absolute work`** — plan and build features end-to-end (then `simplify` the diff).
- **`/absolute ui`** — design or refine interface code.
- **`/absolute docs`** — document the simplified code.

Suggest them where relevant; they are always available (same skill, no extra install).
