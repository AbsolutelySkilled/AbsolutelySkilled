<!-- Part of the code-review-mastery AbsolutelySkilled skill. Load this file
     when performing a detailed review pass on local changes. -->

# Review Checklist

Use this checklist when analyzing local git diffs. Work top-to-bottom through
each section. Any "No" in Correctness or Security is a `[MAJOR]` finding. Any
"No" in Testing is `[MAJOR]`. Convention violations of explicit project rules
are `[MAJOR]`. Everything else is `[MINOR]`.

---

## Correctness

Core logic must be right. These are always `[MAJOR]` findings.

- [ ] The implementation matches the apparent intent of the changes
- [ ] All code paths are covered (happy path, empty/null input, error path)
- [ ] Off-by-one errors checked (loop bounds, array indices, pagination offsets)
- [ ] No silent failures: errors are surfaced, not swallowed
- [ ] Concurrent access is safe: shared state is protected if accessed from multiple threads/workers
- [ ] Integer overflow / type coercion edge cases considered (e.g., JavaScript `==` vs `===`)
- [ ] Async code awaited correctly: no fire-and-forget where the result matters
- [ ] No race conditions in state updates
- [ ] Return values and error types match the function's documented contract

---

## Security

One security miss can outweigh a thousand correct lines. Always `[MAJOR]`.

### Input handling
- [ ] All user-supplied input is validated and sanitized before use
- [ ] SQL queries use parameterized statements or an ORM, never string concatenation
- [ ] HTML output is escaped to prevent XSS (or a templating engine handles it automatically)
- [ ] Shell commands do not use user input directly (`exec`, `spawn`, etc.)
- [ ] File paths constructed from user input are validated against a safe root

### Authentication and authorization
- [ ] All new endpoints have authentication middleware applied
- [ ] Every resource access verifies the requesting user owns or has permission for that resource (no IDOR)
- [ ] Privilege checks happen server-side, never based on client-supplied role or flag
- [ ] Admin-only routes are protected at the route level, not just hidden in the UI

### Data exposure
- [ ] API responses return only the fields the client needs (no full DB row serialization)
- [ ] Passwords, tokens, and secrets are never logged
- [ ] PII is not written to application logs
- [ ] Error responses do not expose stack traces, SQL, or internal paths to the client

### Secrets and dependencies
- [ ] No API keys, tokens, or credentials committed to the repository
- [ ] Environment variables used for all secrets; `.env.example` updated if new vars added
- [ ] New dependencies do not have known critical CVEs (check with `npm audit` / `pip-audit` / equivalent)
- [ ] New dependencies are actively maintained and have an appropriate license

### CSRF and transport
- [ ] State-changing endpoints (POST/PUT/DELETE) validate CSRF tokens where applicable
- [ ] Sensitive endpoints enforce HTTPS; no mixed content
- [ ] CORS configuration is not overly permissive (no `*` in production for credentialed requests)

---

## Performance

- [ ] No N+1 queries: database calls are not inside loops over collections
- [ ] New database queries on large tables have an appropriate index (check the migration)
- [ ] Queries have a LIMIT or pagination; no unbounded full-table scans in production paths
- [ ] No synchronous blocking I/O in a hot path (e.g., `fs.readFileSync` in a request handler)
- [ ] No unnecessary re-renders in frontend code: memoization applied where the component re-renders on every parent update
- [ ] Event listeners, intervals, and subscriptions have cleanup/teardown logic
- [ ] Large payloads are paginated or streamed; not loaded entirely into memory
- [ ] Caching is used appropriately for expensive, frequently-read, rarely-changing data

---

## Readability

- [ ] Variable and function names are intention-revealing (no `data`, `temp`, `flag`, single letters outside tight loops)
- [ ] Functions do one thing and operate at one level of abstraction
- [ ] No function is longer than ~40 lines without a clear justification
- [ ] Complex logic has a comment explaining _why_, not _what_
- [ ] No commented-out code (use version control instead)
- [ ] No dead code (unreachable branches, unused variables, obsolete imports)
- [ ] Magic numbers and strings are extracted to named constants
- [ ] Nesting depth is kept shallow (max 3 levels of indentation; extract early returns or helper functions)

---

## Testing

Untested code is untrusted code. Missing tests for new behavior are `[MAJOR]`.

- [ ] New behavior has corresponding unit tests
- [ ] Tests cover the happy path and at least one failure/edge case
- [ ] Tests would catch a regression if the implementation changed (not just asserting the implementation returned something)
- [ ] Tests do not rely on ordering, timing, or shared mutable state between test cases
- [ ] Mocks and stubs are used for external services; tests do not hit real databases, APIs, or the filesystem
- [ ] Test names describe what behavior is being verified (`it('returns 401 when token is expired')` not `it('works')`)
- [ ] No test is skipped (`.skip`, `xtest`, `xit`) without a linked issue explaining why
- [ ] Code coverage is not regressed (if the project tracks coverage thresholds)

---

## Documentation

- [ ] Public API methods have updated JSDoc / docstrings if their signature or behavior changed
- [ ] `README.md` is updated if the change affects setup, configuration, or usage
- [ ] `CHANGELOG.md` entry added for user-facing changes (if the project maintains one)
- [ ] Architecture Decision Record (ADR) created for significant design choices
- [ ] New environment variables are documented in `.env.example` and the setup guide
- [ ] Deprecations are marked with `@deprecated` and include a migration path

---

## Convention

Checks against detected project rules. Violations of explicit rules (lint
configs, CLAUDE.md) are `[MAJOR]`. Deviations from implicit patterns are `[MINOR]`.

- [ ] Code follows project lint rules (ESLint, Ruff, golangci-lint, etc.)
- [ ] Naming matches the convention in surrounding files (camelCase vs snake_case, etc.)
- [ ] Import style matches project pattern (relative vs absolute, ordering, barrel files)
- [ ] Error handling follows the project's established pattern
- [ ] Export style is consistent (named vs default exports)
- [ ] File organization matches project structure conventions
- [ ] CLAUDE.md / AGENT.md rules are followed (if present)
- [ ] Framework-idiomatic patterns are used (see `references/context-detection.md`)
