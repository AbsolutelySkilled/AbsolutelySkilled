---
name: code-review-mastery
version: 0.1.0
description: >
  Use this skill when reviewing pull requests, giving code review feedback,
  creating review checklists, or improving team code review culture. Triggers
  on PR review, code review comments, review feedback, approval criteria,
  review checklist, nitpick vs blocking feedback, and any task requiring
  structured code evaluation or review process improvement.
category: engineering
tags: [code-review, pull-request, feedback, quality, collaboration]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
license: MIT
maintainers:
  - github: maddhruv
---

# Code Review Mastery

Code review is the highest-leverage quality gate on any engineering team. Done
well, it catches bugs before production, shares knowledge across the team, and
raises the overall quality bar without blocking velocity. Done poorly, it
creates friction, damages morale, and lets real problems slip through while
everyone argues about style. This skill equips an agent to conduct structured,
respectful, and actionable code reviews - covering everything from comment
phrasing to security checks to team-level process setup.

---

## When to use this skill

Trigger this skill when the user:
- Asks to review a pull request or diff for quality, correctness, or safety
- Wants to write better code review comments (clearer, kinder, more actionable)
- Needs a review checklist for a specific domain (security, performance, testing)
- Wants to categorize feedback as blocking, suggestion, or nitpick
- Asks how to handle reviewer/author disagreements constructively
- Wants to set up or improve team code review processes and standards
- Needs to define approval criteria or required-reviewer policies

Do NOT trigger this skill for:
- Writing or refactoring code from scratch (use clean-code or domain-specific skills)
- Architecture decisions not tied to a specific PR (use clean-architecture or system-design skills)

---

## Key principles

1. **Review the code, not the person** - Every comment is about the change,
   not the author's ability or intelligence. Use "this function" not "you wrote"
   and ask questions rather than issuing commands.

2. **Prioritize: correctness first, clarity second, style last** - A bug that
   reaches production costs 100x more than a style issue. Spend most attention
   on logic, edge cases, and security. Style and formatting should be enforced
   by linters, not reviewers.

3. **Nitpick responsibly - label everything** - Unlabeled comments read as
   blocking by default. Prefix non-critical feedback so authors know the stakes:
   `nit:`, `suggestion:`, `question:`, `blocking:`. Authors can merge despite
   nits; they cannot merge despite blockers.

4. **Approve with suggestions, don't block on preferences** - If you can
   approve the PR and note improvements for follow-up, do that. Reserve blocking
   for correctness issues, security flaws, missing tests, and violations of
   explicit team standards.

5. **Review within 24 hours** - Slow reviews kill flow. A PR waiting three days
   for review is a PR sitting on top of three days of work that can't be built
   on. Commit to a review SLA and keep it.

---

## Core concepts

### The review pyramid

Reviews should allocate attention proportionally to impact:

```
         [Style]          <- least important; use linters
        [Readability]     <- naming, clarity, comments
      [Design]            <- structure, patterns, coupling
    [Correctness]         <- bugs, edge cases, logic errors
  [Security / Safety]     <- the most critical layer
```

Start at the bottom. A PR with a SQL injection vulnerability does not need a
style discussion - it needs a security fix first.

### Comment categories

Every review comment should have a clear category signaled by a prefix:

| Category | Prefix | Meaning | Can author merge? |
|---|---|---|---|
| Blocking | `blocking:` | Must be resolved before merge | No |
| Suggestion | `suggestion:` | Author should consider; reviewer approves anyway | Yes |
| Nitpick | `nit:` | Minor style or preference, feel free to ignore | Yes |
| Question | `question:` | Reviewer doesn't understand; may become blocking | Pending answer |
| Praise | (none needed) | Call out good work explicitly | Yes |

### Reviewer responsibilities

- Read the PR description and linked ticket before diving into code
- Check out and run the code for complex or risky changes
- Be explicit about what you approved - line-level vs whole-PR
- Respond to author replies within one business day
- Distinguish between "I don't like this" and "this is wrong"

### Author responsibilities

- Keep PRs small (under 400 lines changed is a healthy target)
- Write a clear description: what changed, why, how to test
- Self-review the diff before requesting review
- Respond to every comment - resolve or discuss, never silently ignore
- Don't take feedback personally; the reviewer is protecting the codebase

---

## Common tasks

### Review a PR systematically

Follow this sequence to avoid missing anything:

1. **Read the description** - Understand the intent. If there is no description,
   ask for one before reviewing the code.
2. **Check scope** - Is the PR doing one thing? If it mixes a refactor with a
   feature, request a split.
3. **Correctness pass** - Does the logic match the stated intent? Walk through
   edge cases: empty input, null/undefined, concurrent access, off-by-one.
4. **Security pass** - Look for injection, auth bypass, data exposure. Use the
   OWASP checklist in the security section below.
5. **Performance pass** - Scan for N+1 queries, unnecessary re-renders, memory
   leaks, and missing pagination.
6. **Tests pass** - Are tests present? Do they cover the happy path AND edge
   cases? Would they catch a regression if the implementation changed?
7. **Readability pass** - Are names clear? Is there dead code or commented-out
   code? Do comments explain "why" not "what"?
8. **Leave summary comment** - Close with a summary that tells the author the
   overall state: approved, approved with suggestions, or changes requested.

### Write actionable review comments

A great review comment includes: what the problem is, why it matters, and a
concrete suggestion for how to fix it.

**Template:**
```
[prefix]: [what the problem is].
[Why it matters].
[Suggestion or example fix].
```

**Example - blocking:**
```
blocking: This loop calls getUserById() on every iteration, resulting in an
N+1 query against the database.
With 10,000 users this will time out and take down the service under load.
Fetch all users in one query before the loop: const users = await getUsersByIds(ids);
```

**Example - suggestion:**
```
suggestion: The variable name `data` doesn't communicate what this holds.
Naming it `pendingInvoices` would make the loop below self-documenting
without needing the comment above it.
```

**Example - nitpick:**
```
nit: Prefer const over let here since this variable is never reassigned.
```

**Example - question:**
```
question: Why is the retry count hard-coded to 3 here rather than using
MAX_RETRY_ATTEMPTS from the config? Is this intentional?
```

**Example - praise:**
```
Nice use of the Strategy pattern here - adding a new payment provider now
requires zero changes to this class.
```

### Categorize feedback

Use this decision tree before writing any comment:

```
Is this a bug, security issue, or data-loss risk?
  YES -> blocking:

Is this a violation of an explicit, written team standard?
  YES -> blocking:

Would a reasonable engineer disagree with this?
  YES -> suggestion: or nit:

Is this purely style or preference?
  YES -> nit: (or skip it and let the linter handle it)

Do you genuinely not understand the code?
  YES -> question:
```

When in doubt, downgrade. A suggestion that turns out to be a misunderstanding
costs nothing. A blocking comment that turns out to be a preference war costs
team trust.

### Review for security issues

Walk through these checks for any PR touching auth, data handling, or external
input:

| Check | What to look for |
|---|---|
| Injection (SQL/HTML/cmd) | String concatenation in queries, unsanitized template output, shell exec with user input |
| Broken auth | Missing auth middleware on routes, privilege escalation paths, hardcoded credentials |
| Sensitive data exposure | Logging of passwords, tokens, or PII; API responses returning more fields than needed |
| IDOR | IDs in URLs used without verifying the requesting user owns the resource |
| Mass assignment | Object spread or ORM `fill()` accepting user-controlled fields without allowlist |
| Dependency vulnerabilities | New packages added without a security audit; known CVEs in version range |
| Secrets in code | API keys, tokens, or connection strings committed to the repo |
| CSRF | State-changing endpoints missing CSRF token validation |

Flag any security finding as `blocking:` regardless of likelihood. Security
issues compound; a "low probability" bug becomes critical when combined with
another.

### Review for performance

| Pattern | What to look for | Fix direction |
|---|---|---|
| N+1 queries | A DB call inside a loop over a collection | Batch fetch before the loop |
| Missing indexes | New WHERE/ORDER BY columns with no migration for an index | Add index in the migration |
| Unnecessary re-renders (React) | State updates inside render; missing `useMemo`/`useCallback` for expensive ops | Memoize or lift state |
| Memory leaks | Event listeners added without cleanup; intervals without `clearInterval`; subscriptions without unsubscribe | Add cleanup in teardown |
| Unbounded queries | Queries with no LIMIT or pagination on large tables | Add pagination |
| Synchronous blocking | `fs.readFileSync`, `JSON.parse` on large payloads in a hot path | Async alternatives or move off hot path |

### Handle disagreements constructively

When author and reviewer reach an impasse:

1. **Both state their reasoning** - Avoid positional arguments ("I prefer X").
   Both parties explain the concrete benefit they're optimizing for.
2. **Check the written standard** - Does the team style guide, ADR, or lint
   config resolve this? Defer to the written record.
3. **Time-box the discussion** - If two async exchanges haven't resolved it,
   escalate to a 15-minute sync conversation.
4. **Involve a third party** - If still stuck, ask one other senior engineer to
   weigh in. Not to vote, but to surface a consideration both parties missed.
5. **Author decides on preference, reviewer decides on correctness** - Authors
   own their code and can make style calls. Reviewers have veto power on
   correctness, security, and explicit standards violations.
6. **Document the decision** - Add a comment in the code or PR explaining why
   the non-obvious path was chosen so the next reviewer doesn't re-open it.

### Set up team review guidelines

A healthy team review process needs these in writing:

**CODEOWNERS** - Define ownership per directory so reviewers are auto-assigned:
```
# .github/CODEOWNERS
/src/auth/         @security-team
/src/payments/     @payments-team @security-team
/infra/            @platform-team
```

**Required reviewers** - Configure branch protection rules: at minimum one
approval from a code owner, and one from any other engineer. Two approvals for
changes touching auth, payments, or infrastructure.

**PR size SLA** - Document and enforce: PRs over 500 lines changed require the
author to justify scope. PRs under 200 lines get reviewed within 24 hours.
Larger PRs get 48 hours.

**Review SLA** - Reviewers commit to a first-pass within 24 hours on business
days. Blocking the team on a review is treated the same as blocking a production
incident.

**Definition of "approved"** - Document what an approval means: "I have read
every changed line, I believe this is correct and safe to ship, and I take
shared ownership of this change."

---

## Anti-patterns / common mistakes

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| Rubber-stamp approvals | Approving without reading gives false confidence and shares blame for bugs | Read every changed line; if you don't have time, say so and ask to be removed as reviewer |
| Piling on style nits | Dozens of `nit:` comments on a correct PR demoralizes authors and obscures real issues | Limit nits to 3-5 per review; configure a linter to handle the rest automatically |
| Reviewing the whole codebase | Commenting on code outside the PR diff scope ("while you're here, fix X") creates scope creep | File separate issues or PRs for unrelated improvements; review only what changed |
| Ghosting author replies | Not responding to a reply leaves the PR stuck and signals the reviewer doesn't care | Commit to replying within one business day; if you changed your mind, say so explicitly |
| Blocking on personal preference | Using `blocking:` for stylistic choices the team hasn't agreed on wastes everyone's time | Only block on bugs, security issues, missing tests, or documented team standards |
| Skipping the test review | Reviewing only the implementation and ignoring test coverage allows regressions | Treat test quality as equal to implementation quality; ask "would this catch a regression?" |

---

## References

For detailed content on specific topics, read the relevant file from `references/`:

- `references/review-checklist.md` - Comprehensive category-by-category PR
  review checklist covering correctness, security, performance, readability,
  testing, and documentation

Only load the references file when performing a detailed, structured review or
when setting up team review standards. For quick feedback on a specific comment
or pattern, the sections above are sufficient.
