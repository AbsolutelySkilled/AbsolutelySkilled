<!-- Part of the developer-experience AbsolutelySkilled skill. Load this file when
     working with changelogs, release notes, or deprecation communication. -->

# Changelog Guide

## Format: Keep a Changelog

Follow the [Keep a Changelog](https://keepachangelog.com) convention. Every release
gets a section with the version number, date, and categorized entries.

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features not yet released

## [2.3.0] - 2026-03-14

### Added
- `client.users.archive()` method for soft-deleting users (#342)
- TypeScript 5.4 support with improved type inference (#355)

### Changed
- `client.users.list()` now returns paginated results by default.
  Pass `{ paginate: false }` to restore previous behavior. (#338)

### Deprecated
- `client.users.delete()` is deprecated in favor of `client.users.archive()`.
  Will be removed in v3.0. See [migration guide](/docs/migrate-v2.3). (#342)

### Fixed
- `client.invoices.send()` no longer throws on zero-amount invoices (#401)
- Rate limit headers now correctly parsed on HTTP/2 connections (#398)

### Security
- Updated `xml-parser` dependency to fix CVE-2026-1234 (#410)

## [2.2.1] - 2026-02-28
...
```

## Change categories

Use exactly these categories, in this order. Omit empty categories.

| Category | When to use | Example |
|---|---|---|
| **Added** | New features or capabilities | New API method, new config option |
| **Changed** | Changes to existing functionality | Different default value, renamed param |
| **Deprecated** | Features marked for future removal | Method replaced by better alternative |
| **Removed** | Features removed in this release | Dropped support for Node 14 |
| **Fixed** | Bug fixes | Null pointer on empty input |
| **Security** | Vulnerability patches | Dependency CVE fix |

## Writing good changelog entries

### The three-question test
Every entry must answer:
1. **What** changed? (the fact)
2. **Why** does the developer care? (the impact)
3. **What** should they do? (the action, if any)

### Good vs bad entries

**Bad:**
```markdown
- Updated user module
- Various bug fixes
- Improved performance
```

**Good:**
```markdown
- `client.users.list()` now returns results sorted by `created_at` descending
  by default. Pass `{ sort: "created_at:asc" }` to restore previous behavior. (#338)
- Fixed: `client.webhooks.verify()` returned false for payloads containing
  unicode characters (#401)
- `client.search()` is now 3x faster for queries with > 1000 results due to
  cursor-based pagination replacing offset pagination (#412)
```

### Entry format rules
- Start with the affected method, class, or feature in backticks
- Use present tense ("adds", "fixes", "removes") or past tense consistently - pick one
- Link to the issue or PR with a parenthetical reference `(#123)`
- For **Changed** and **Removed**: always include the migration action
- For **Deprecated**: always state when it will be removed (version or date)
- For **Security**: reference the CVE number

## Semantic versioning rules

| Change type | Version bump | Example |
|---|---|---|
| Breaking change to public API | MAJOR (X.0.0) | Renamed method, removed parameter |
| New feature, backward compatible | MINOR (0.X.0) | New method, new optional parameter |
| Bug fix, backward compatible | PATCH (0.0.X) | Fixed null handling, corrected docs |

### What counts as a breaking change
- Removing or renaming a public method, class, or parameter
- Changing the return type of a public method
- Changing the default value of a parameter in a way that alters behavior
- Dropping support for a runtime version (Node 14, Python 3.8, etc.)
- Changing error types that consumers might be catching

### What does NOT count as breaking
- Adding a new optional parameter
- Adding a new method to an existing resource
- Fixing a bug (unless consumers depend on the buggy behavior - document this)
- Internal refactoring that doesn't change the public API

## Deprecation communication playbook

### Step 1: Announce deprecation (minor release)
```markdown
### Deprecated
- `client.users.delete()` is deprecated. Use `client.users.archive()` instead.
  `delete()` will be removed in v3.0 (estimated Q3 2026).
  See [migration guide](/docs/migrate-delete-to-archive).
```

### Step 2: Runtime deprecation warning
Add a runtime warning that fires when the deprecated method is called:

```typescript
/** @deprecated Use archive() instead. Will be removed in v3.0. */
async delete(id: string): Promise<void> {
  console.warn(
    "[acme-sdk] users.delete() is deprecated. Use users.archive() instead. " +
    "See: https://docs.acme.com/migrate-delete-to-archive"
  );
  return this.archive(id);
}
```

### Step 3: Remove in major release
```markdown
### Removed
- `client.users.delete()` has been removed. Use `client.users.archive()`.
  See [v3 migration guide](/docs/migrate-v3).
```

### Deprecation timeline rules
- Minimum 1 minor release between deprecation announcement and removal
- Minimum 3 months calendar time for widely-used features
- Always provide the replacement in the deprecation notice
- Never deprecate without a migration path

## Automating changelogs

### From conventional commits
If using conventional commit messages (`feat:`, `fix:`, `breaking:`), generate
changelog entries automatically:

```bash
# Generate changelog from git history
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

### From PR labels
Use GitHub labels (`breaking`, `feature`, `fix`, `deprecation`) and generate
changelog entries from merged PRs between releases.

### Human review is still required
Automated changelogs capture the "what" but miss the "why" and "what to do."
Always have a human review and enhance automated entries before publishing.

## Release notes vs changelog

| Aspect | Changelog | Release notes |
|---|---|---|
| Audience | Developers integrating the SDK | Broader audience including managers |
| Tone | Technical, precise | Narrative, highlights-focused |
| Content | Every user-facing change | Top 3-5 highlights + link to full changelog |
| Location | CHANGELOG.md in repo | GitHub release page, blog post, email |
| Format | Categorized list | Prose paragraphs with screenshots/demos |

Write the changelog first, then derive release notes from it. Never the reverse.
