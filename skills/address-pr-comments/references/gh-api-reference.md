<!-- Part of the address-pr-comments AbsolutelySkilled skill. Load this file when
     working with GitHub API endpoints for PR reviews and comments. -->

# GitHub API Reference for PR Review Comments

## Key endpoints

### List review comments on a PR

```
GET /repos/{owner}/{repo}/pulls/{pull_number}/comments
```

Returns all review comments (inline code comments) on a PR. Supports pagination.

Key response fields per comment:
- `id` (integer) - unique comment ID, use this for `in_reply_to`
- `body` (string) - comment text
- `path` (string) - relative file path
- `line` (integer) - line in the diff (null for outdated comments)
- `original_line` (integer) - original line number
- `side` (string) - "LEFT" or "RIGHT" side of the diff
- `diff_hunk` (string) - diff context around the comment
- `in_reply_to_id` (integer) - parent comment ID if this is a threaded reply
- `user.login` (string) - GitHub username of the commenter
- `created_at` (string) - ISO timestamp
- `updated_at` (string) - ISO timestamp

### List reviews on a PR

```
GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews
```

Returns top-level reviews (approve, request changes, comment). Each review may have a `body`.

Key response fields:
- `id` (integer) - review ID
- `user.login` (string) - reviewer username
- `body` (string) - top-level review body (may be empty)
- `state` (string) - "APPROVED", "CHANGES_REQUESTED", "COMMENTED", "DISMISSED"

### Reply to a review comment (thread a reply)

```
POST /repos/{owner}/{repo}/pulls/{pull_number}/comments
```

Body parameters:
- `body` (string, required) - the reply text
- `in_reply_to` (integer, required) - the ID of the comment to reply to

This creates a threaded reply under the specified comment.

**Example with gh CLI:**

```bash
gh api repos/{owner}/{repo}/pulls/42/comments \
  -method POST \
  -f body="Good catch! Fixed in the latest push." \
  -F in_reply_to=123456789
```

### Create a new review comment (not a reply)

```
POST /repos/{owner}/{repo}/pulls/{pull_number}/comments
```

Body parameters:
- `body` (string, required)
- `commit_id` (string, required) - SHA of the commit to comment on
- `path` (string, required) - relative file path
- `line` (integer) - line number in the diff
- `side` (string) - "LEFT" or "RIGHT"

> You almost never need this for addressing review comments. Always prefer
> replying to existing threads with `in_reply_to`.

### Get a single review comment

```
GET /repos/{owner}/{repo}/pulls/comments/{comment_id}
```

Useful for verifying a comment exists before replying.

## Pagination

All list endpoints support pagination. With `gh api`, use `--paginate`:

```bash
gh api repos/{owner}/{repo}/pulls/42/comments --paginate
```

This automatically follows `Link` headers and returns all pages.

## Rate limits

- Authenticated requests: 5,000/hour
- Each reply POST counts as one request
- Batch posting 20 replies is fine, but if a PR has 100+ comments, be mindful

## Common gotchas

1. **Outdated comments** - Comments on lines that no longer exist in the latest
   diff have `line: null`. The `original_line` and `diff_hunk` still show where
   the comment was. You can still reply to these.

2. **Review comments vs issue comments** - Review comments (`/pulls/{n}/comments`)
   are inline code comments. Issue comments (`/issues/{n}/comments`) are the
   general conversation. This skill focuses on review comments.

3. **Minimized/resolved comments** - The REST API doesn't expose the "resolved"
   state of review threads. A comment thread is considered "addressed" if the
   PR author has replied. The GraphQL API has `isResolved` on `ReviewThread`
   if needed.

4. **Bot comments** - Filter out comments from bots (check `user.type == "Bot"`
   or known bot logins like `dependabot`, `github-actions`).

5. **`in_reply_to` must be the root comment ID** - When replying in a thread,
   `in_reply_to` should reference the original comment's `id`, not a reply's ID.
   Using a reply's ID still works but may create inconsistent threading on
   some GitHub UI views.
