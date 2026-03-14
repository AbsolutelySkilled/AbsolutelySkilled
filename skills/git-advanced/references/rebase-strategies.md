<!-- Part of the git-advanced AbsolutelySkilled skill. Load this file when
     working with rebase workflows, merge vs rebase decisions, or composing
     interactive rebase sequences. -->

# Rebase Strategies

Rebasing rewrites commit history by replaying commits on top of a new base.
This produces a linear history but changes commit SHAs. Knowing when to rebase,
when to merge, and how to compose interactive rebase sequences is the difference
between clean, reviewable history and a tangled mess.

---

## Rebase vs merge: the decision framework

Both integrate changes from one branch into another. The difference is in what
the resulting history looks like and what guarantees you have.

| Dimension | Merge | Rebase |
|---|---|---|
| History shape | Non-linear; preserves true timeline | Linear; commit SHAs are rewritten |
| Merge commit | Yes - one commit with two parents | No - no merge commit |
| Conflict resolution | Once per merge | Once per replayed commit |
| Safety on shared branches | Always safe | Never safe (rewrites SHAs) |
| Bisect friendliness | Harder (merge commits clutter) | Excellent (linear = fast binary search) |
| Blame accuracy | Accurate (original dates preserved) | Dates change to replay time |

**Rule of thumb:**
- `git rebase` - feature branches onto their target before pushing; local cleanup
- `git merge` - integrating completed features into main/develop; shared branch updates

---

## Workflow: keeping a feature branch current

When main advances while you are developing a feature, use rebase (not merge)
to stay current. This avoids merge commits that clutter history with
"Merge branch 'main' into feat/foo" noise.

```bash
# Fetch latest changes without checking out main
git fetch origin

# Rebase your feature branch on top of the updated main
git checkout feat/my-feature
git rebase origin/main

# Resolve any conflicts commit-by-commit, then:
git rebase --continue
```

If the feature branch has already been pushed and you are the only author:
```bash
# Force-push with a safety check (fails if someone else has pushed)
git push --force-with-lease origin feat/my-feature
```

---

## Workflow: preparing a clean PR

Before opening a pull request, compress and organize your working commits into
a set of logical, reviewable units using interactive rebase.

**Goal:** transform implementation commits into a readable story.

```bash
# See how many commits ahead of main you are
git log --oneline main..HEAD

# Start interactive rebase against the branch point
git rebase -i $(git merge-base HEAD origin/main)
```

**Typical raw history:**
```
pick 1a2b3c4 feat: scaffold auth module
pick 5d6e7f8 wip
pick 9a0b1c2 fix lint
pick 3d4e5f6 add password hashing
pick 7a8b9c0 actually fix lint
pick 1b2c3d4 add tests
pick 5e6f7a8 fix test typo
pick 9b0c1d2 pr feedback: rename method
```

**Target clean history:**
```
pick 1a2b3c4 feat: scaffold auth module
fixup 5d6e7f8 wip
fixup 9a0b1c2 fix lint
fixup 7a8b9c0 actually fix lint
squash 3d4e5f6 add password hashing
squash 1b2c3d4 add tests
fixup 5e6f7a8 fix test typo
fixup 9b0c1d2 pr feedback: rename method
```

Result: 2 clean commits - one for the module scaffold, one for the implementation
with tests. Combined squash messages are edited to be descriptive.

---

## Interactive rebase recipes

### Recipe: combine all commits into one

Useful for experiments or trivial features with many micro-commits.

```bash
git rebase -i HEAD~8
# In editor: change all but the first 'pick' to 'fixup'
# Result: one commit with the message from the first pick
```

### Recipe: split a commit into two

Use `edit` to pause at a commit and amend it into multiple commits.

```bash
git rebase -i HEAD~3
# Change the target commit from 'pick' to 'edit'
# Git pauses at that commit - you are now in a mid-rebase state

# Undo the commit but keep the changes staged
git reset HEAD~

# Now selectively stage and commit parts:
git add src/auth.ts
git commit -m "feat: add authentication service"

git add src/auth.test.ts
git commit -m "test: add auth service unit tests"

# Continue the rebase
git rebase --continue
```

### Recipe: move a commit to a different position

Simply reorder lines in the interactive rebase editor. Git replays them in
the order listed.

```bash
git rebase -i HEAD~5
# Move the line for the commit you want to reposition
# up or down relative to other commits
# Save and close - git replays in new order
```

### Recipe: remove a debug commit before merging

```bash
git rebase -i HEAD~4
# Change 'pick' to 'drop' on the debug commit line
# That commit is deleted from history entirely
```

### Recipe: reword a commit message without changing content

```bash
git rebase -i HEAD~3
# Change 'pick' to 'reword' on the target commit
# Git opens editor for just that commit message
# Edit and save - commit SHA changes, content unchanged
```

---

## Rebase onto a different base

`git rebase --onto` lets you transplant a sequence of commits onto any base,
not just the current parent.

**Scenario:** You branched off a feature branch instead of main by mistake.

```bash
# Branch structure:
#   main --- A --- B --- C (feat/base)
#                        \--- D --- E (feat/my-feature)

# Transplant feat/my-feature (D, E) onto main directly:
git rebase --onto main feat/base feat/my-feature

# Result:
#   main --- A --- B --- C (feat/base)
#         \--- D' --- E' (feat/my-feature)
```

General syntax: `git rebase --onto <new-base> <old-base> <branch>`

---

## Handling rebase conflicts

When replaying commits, git may encounter conflicts on any individual commit.
Conflicts during rebase are smaller and more focused than merge conflicts
because each replayed commit is a single unit of change.

```bash
# When a conflict occurs, git pauses and shows:
# CONFLICT (content): Merge conflict in src/config.ts
# error: could not apply a1b2c3... feat: update config schema

# 1. See the current state
git status
git diff

# 2. Resolve the conflict in each file

# 3. Stage the resolved files
git add src/config.ts

# 4. Do NOT commit - continue the rebase
git rebase --continue

# If a conflict makes you want to skip a commit entirely:
git rebase --skip

# If the rebase is unrecoverable, abort entirely:
git rebase --abort
# This returns HEAD to exactly where it was before the rebase started
```

---

## Merge strategies for complex scenarios

When merging, git supports different merge strategies for special cases.

```bash
# Default recursive strategy (most cases)
git merge feat/my-feature

# Squash merge: bring in all changes as a single unstaged diff
# (common in GitHub/GitLab "squash and merge" workflows)
git merge --squash feat/my-feature
git commit -m "feat: add user authentication (#123)"

# No fast-forward: always create a merge commit even when FF is possible
# Preserves the branch topology in history
git merge --no-ff feat/my-feature

# Accept all changes from the incoming branch (theirs) on conflict
git merge -X theirs feat/my-feature

# Accept all changes from the current branch (ours) on conflict
git merge -X ours feat/my-feature
```

---

## Common mistakes with rebase

| Mistake | Consequence | Prevention |
|---|---|---|
| Rebasing a branch others have checked out | Diverged history; teammates' pushes rejected | Never rebase branches on remotes that others track |
| Using `--force` instead of `--force-with-lease` | Silently overwrites teammates' pushes | Always use `--force-with-lease` when force-pushing |
| Rebasing a merge commit | Merge commit is replayed as a regular commit, losing parent structure | Use `--rebase-merges` flag to preserve merge commits |
| Forgetting `git rebase --abort` on a bad conflict | Left in partial rebase state | Always abort or continue - never leave a rebase half-done |
| Interactive rebasing past a pushed commit | Must force-push, risks losing others' work | Only rebase commits that have not been pushed to shared refs |
