---
name: address-pr-comments
version: 0.1.0
description: >
  Use this skill when addressing, responding to, or resolving PR review comments
  on GitHub pull requests. Triggers on "address PR comments", "respond to review",
  "handle review feedback", "reply to PR comments", "fix review comments", or when
  the user wants to process open review threads on their PR. Uses the gh CLI to
  fetch unresolved comments, make code changes where agreed, and post batch replies
  with a humble, thankful tone.
category: engineering
tags: [github, pr-review, code-review, gh-cli, pull-request, review-comments]
recommended_skills: [git-advanced, clean-code, code-review-mastery]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
license: MIT
maintainers:
  - github: maddhruv
---

When this skill is activated, always start your first response with the :speech_balloon: emoji.

# Address PR Review Comments

Automates the workflow of reading open PR review comments, understanding each one,
making code changes where the feedback is valid, and posting thoughtful replies to
every comment - all via the `gh` CLI. The agent exercises judgment on which comments
to accept vs. respectfully defer, and batches all replies for user review before posting.

---

## When to use this skill

Trigger this skill when the user:
- Wants to address or respond to PR review comments
- Says "handle my PR feedback" or "fix review comments"
- Asks to reply to open review threads on a GitHub PR
- Wants to process unresolved review comments on their branch
- Says "address the PR comments" or "respond to reviewer"
- Needs to batch-reply to all open comments on a PR

Do NOT trigger this skill for:
- Creating a new PR or writing a PR description
- Reviewing someone else's PR (that's code-review, not addressing comments)
- General git operations unrelated to PR review comments

---

## Prerequisites

The `gh` CLI must be authenticated. Verify with:

```bash
gh auth status
```

The user should be on the branch associated with the PR, or provide a PR number/URL.

---

## Core workflow

### Step 1 - Identify the PR

Determine the PR number. If the user doesn't specify one:

```bash
gh pr view --json number,title,url -q '.number'
```

> **Gotcha:** This only works if the current branch has an open PR. If it fails,
> ask the user for the PR number or URL.

### Step 2 - Fetch all review comments

Fetch all review comments (not issue comments) on the PR:

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments --paginate
```

Each comment object contains:
- `id` - unique comment ID
- `body` - the reviewer's comment text
- `path` - file path the comment is on
- `line` / `original_line` - line number in the diff
- `diff_hunk` - surrounding diff context
- `in_reply_to_id` - if this is a reply to another comment (threaded)
- `user.login` - who left the comment

Also fetch review-level comments (top-level review bodies):

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews --paginate
```

### Step 3 - Filter to unaddressed comments

A comment is "unaddressed" if:
1. It was NOT written by the PR author (the user)
2. It has no reply from the PR author in its thread
3. It is not a bot comment

To check threads, group comments by `in_reply_to_id`. A root comment (no `in_reply_to_id`)
that has no reply from the PR author's login is unaddressed.

> **Gotcha:** The `in_reply_to_id` field links replies to their parent comment.
> Comments without this field are root comments. Always check the full thread
> before deciding a comment is unaddressed.

### Step 4 - Read code context and evaluate each comment

For each unaddressed comment:
1. Read the file at the path mentioned in `path`
2. Understand the reviewer's suggestion in context
3. Decide: **agree** (the suggestion improves the code) or **defer** (current approach is better)

**Agreement criteria:**
- The suggestion fixes a real bug or edge case
- It improves readability, performance, or maintainability
- It follows project conventions the current code missed
- It catches a typo, naming issue, or documentation gap

**Defer criteria (respectfully):**
- The suggestion would introduce unnecessary complexity
- The current approach was intentional and has good reasons
- The suggestion conflicts with project conventions or requirements
- The comment is based on a misunderstanding of the context

### Step 5 - Make code changes for agreed comments

For each agreed comment, make the code change. Track what was changed:
- File path and what was modified
- Which comment prompted the change

> **Gotcha:** Multiple comments may affect the same file or even the same lines.
> Process them carefully to avoid conflicting edits. Read the file fresh before
> each edit if multiple comments target the same file.

### Step 6 - Draft all replies (batch mode)

Draft replies for ALL comments before posting any. Present them to the user for review.

**Reply tone guidelines:**
- Be humble and thankful: "Good catch!", "Thanks for flagging this!", "Great suggestion, updated!"
- For agreed + changed: mention the specific change made
- For deferred: explain the reasoning respectfully, stay open to further discussion
- Keep replies concise - 1-3 sentences max
- Never be defensive or dismissive

**Reply templates:**

For agreed comments where changes were made:
```
Good catch! Updated [brief description of change]. Thanks for the review!
```
```
Thanks for flagging this - you're right. Fixed in the latest push.
```
```
Great suggestion! Refactored to [what was done]. Appreciate the feedback.
```

For deferred comments:
```
Thanks for the suggestion! I considered this, but went with [current approach] because [reason]. Happy to discuss further if you see issues with this approach.
```
```
Appreciate the review! The current implementation is intentional here - [brief reason]. Let me know if you think there's still a concern.
```

### Step 7 - Present batch to user for approval

Before posting, present a summary table:

```
| # | File | Comment (summary) | Action | Reply (draft) |
|---|------|-------------------|--------|---------------|
| 1 | src/api.ts:42 | Missing null check | Agreed - Fixed | "Good catch! Added null check..." |
| 2 | src/utils.ts:15 | Use lodash instead | Deferred | "Thanks! Kept native impl because..." |
```

Ask the user to approve, edit, or skip specific replies.

### Step 8 - Post replies

Post each reply using the GitHub API:

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
  -method POST \
  -f body="Good catch! Updated the null check. Thanks for the review!" \
  -F in_reply_to={parent_comment_id}
```

> **Gotcha:** Use `in_reply_to` to thread the reply under the original comment.
> Do NOT create a new top-level review comment - always reply in the existing thread.
> The `in_reply_to` value should be the `id` of the root comment in the thread.

---

## Error handling

| Error | Cause | Resolution |
|---|---|---|
| `gh: not found` | gh CLI not installed | Ask user to install: `brew install gh` |
| `HTTP 401` | gh not authenticated | Run `gh auth login` |
| `HTTP 404` on PR | Wrong repo or PR doesn't exist | Verify PR number and repo |
| `HTTP 422` on reply | Invalid `in_reply_to` ID | Verify the comment ID exists and belongs to the PR |
| No unaddressed comments | All comments already replied to | Inform the user - nothing to do |

---

## Anti-patterns

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| Agreeing with everything | Wastes effort, may introduce bad changes | Exercise judgment - defer when current approach is better |
| Being defensive in replies | Creates friction, poor collaboration | Stay humble: "Thanks for the suggestion" even when deferring |
| Posting replies before user approval | User loses control over what's posted | Always batch and present for approval first |
| Replying as top-level comments | Breaks the review thread structure | Always use `in_reply_to` to thread replies |
| Ignoring diff context | May misunderstand what the reviewer is pointing at | Always read `diff_hunk` and the full file before deciding |

---

## References

For detailed information on specific topics, read the relevant file from `references/`:

- `references/gh-api-reference.md` - Full GitHub API endpoints for PR reviews and comments
