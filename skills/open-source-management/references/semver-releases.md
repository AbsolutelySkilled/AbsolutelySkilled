# Semantic Versioning and Release Management

This reference covers SemVer edge cases, pre-release conventions, and release automation
tooling. Load this file only when the user needs detailed versioning or release guidance.

---

## Semantic versioning rules

SemVer follows the format: **MAJOR.MINOR.PATCH**

Given a version number MAJOR.MINOR.PATCH, increment the:
- **MAJOR** version when you make incompatible API changes (breaking changes)
- **MINOR** version when you add functionality in a backward-compatible manner
- **PATCH** version when you make backward-compatible bug fixes

### What counts as a breaking change?

| Change | Breaking? | Bump |
|---|---|---|
| Remove a public function or method | Yes | MAJOR |
| Rename a public function or method | Yes | MAJOR |
| Change function signature (add required parameter) | Yes | MAJOR |
| Change return type of a public function | Yes | MAJOR |
| Change default behavior that users depend on | Yes | MAJOR |
| Add a new optional parameter with a default | No | MINOR |
| Add a new public function or method | No | MINOR |
| Add a new event or hook | No | MINOR |
| Fix a bug without changing the API | No | PATCH |
| Improve performance without changing behavior | No | PATCH |
| Update documentation | No | PATCH |
| Internal refactoring with no API change | No | PATCH |
| Add a new dependency | Depends | MINOR (if no API change) |
| Upgrade a dependency with breaking changes | Maybe | MAJOR if it leaks through your API |

### Edge cases and judgment calls

**Bug fix that changes behavior**: If the previous behavior was clearly a bug (not matching
docs), fixing it is a PATCH even though some users may depend on the buggy behavior.
Document the fix prominently in release notes.

**Deprecation**: Deprecating a feature is MINOR (it's backward compatible). Removing the
deprecated feature is MAJOR. Always give at least one MINOR release cycle between
deprecation and removal.

**Security fix that changes API**: If a security vulnerability requires a breaking change
to fix, release it as MAJOR with a clear security advisory. If you can fix it without
breaking the API, it's a PATCH.

**Pre-1.0 versions (0.x.y)**: The SemVer spec says anything goes before 1.0.0. In
practice, most projects treat 0.MINOR as the "major" and 0.MINOR.PATCH as the "minor."
Ship 1.0.0 when you have a stable public API.

---

## Pre-release and build metadata

### Pre-release versions

Pre-release versions indicate that the version is unstable and might not satisfy the
intended compatibility requirements:

```
1.0.0-alpha.1    # First alpha - feature incomplete, expect breakage
1.0.0-alpha.2    # Second alpha
1.0.0-beta.1     # Feature complete, fixing bugs
1.0.0-beta.2     # More bug fixes
1.0.0-rc.1       # Release candidate - believed ready, final testing
1.0.0-rc.2       # Another release candidate if issues found
1.0.0            # Stable release
```

Pre-release versions have lower precedence than the associated normal version:
`1.0.0-alpha.1 < 1.0.0-beta.1 < 1.0.0-rc.1 < 1.0.0`

### Build metadata

Build metadata is appended with a `+` sign and is ignored for version precedence:

```
1.0.0+build.123
1.0.0+20250301
1.0.0-beta.1+exp.sha.a1b2c3d
```

Build metadata is informational only - two versions differing only in build metadata
are considered equal.

---

## Release automation tools

### semantic-release (JavaScript ecosystem)

Fully automated version management and package publishing:

- Analyzes commit messages to determine the version bump
- Generates release notes from commit messages
- Publishes to npm and creates GitHub releases
- Requires Conventional Commits format

```json
{
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/github",
      "@semantic-release/git"
    ]
  }
}
```

### release-please (Google, multi-language)

Creates release PRs automatically based on Conventional Commits:

- Opens a PR that tracks unreleased changes
- Updates CHANGELOG.md and version files
- Merging the PR triggers the release
- Supports: Node.js, Python, Java, Go, Rust, Ruby, and more

```yaml
# .github/workflows/release-please.yml
on:
  push:
    branches: [main]
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
```

### changesets (multi-package / monorepo)

Designed for monorepos with multiple packages:

- Contributors add "changeset" files describing their changes
- A CI job aggregates changesets into version bumps and changelog entries
- Handles inter-package dependency updates automatically
- Used by: Vercel, Chakra UI, Radix

```bash
npx changeset        # Create a changeset
npx changeset version # Apply changesets to bump versions
npx changeset publish # Publish to npm
```

### conventional-changelog (standalone)

Generates changelogs from Conventional Commits without full release automation:

```bash
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

---

## Conventional Commits

Conventional Commits is a commit message convention that works with all the release
automation tools above:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types that affect versioning:
- `fix:` - triggers a PATCH bump
- `feat:` - triggers a MINOR bump
- `feat!:` or any type with `BREAKING CHANGE:` footer - triggers a MAJOR bump

Common types:
- `fix:` - Bug fix
- `feat:` - New feature
- `docs:` - Documentation only
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring, no behavior change
- `perf:` - Performance improvement
- `test:` - Adding or fixing tests
- `ci:` - CI/CD changes
- `chore:` - Maintenance tasks

Example:
```
feat(auth): add OAuth 2.0 support for GitHub login

Implements the OAuth 2.0 authorization code flow for GitHub.
Users can now sign in with their GitHub account.

Closes #234
```

---

## Release checklist

For any release, follow this sequence:

1. **Freeze** - Stop merging new features. Only bug fixes from here.
2. **Version** - Determine the version bump from changes since last release.
3. **Changelog** - Write or generate the changelog. Review for accuracy.
4. **Test** - Run the full test suite. Run manual smoke tests if applicable.
5. **Tag** - Create an annotated git tag: `git tag -a v1.2.0 -m "Release v1.2.0"`
6. **Build** - Create distributable artifacts (if applicable).
7. **Publish** - Push to package registry (npm, PyPI, crates.io, etc.).
8. **Release** - Create GitHub Release with changelog as body.
9. **Announce** - Post to community channels (Discord, blog, Twitter/X, mailing list).
10. **Monitor** - Watch for regression reports in the first 24-48 hours.

---

## Hotfix process

When a critical bug is found in a release:

1. Create a hotfix branch from the release tag: `git checkout -b hotfix/1.2.1 v1.2.0`
2. Fix the bug with minimal changes (no feature work)
3. Bump PATCH version
4. Follow the full release checklist above
5. Merge the fix back into `main` to prevent regression
