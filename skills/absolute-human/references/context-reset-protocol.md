# Context Reset Protocol

For long-running Absolute-Human sessions, context resets beat context compaction.
Clearing the window entirely and providing a structured handoff preserves reasoning
quality better than compressing accumulated context. This protocol defines when
to reset, how to hand off state, and how to resume.

---

## When to Reset Context

Trigger a context reset when ANY of these conditions are met:

| Trigger | Why |
|---------|-----|
| **3+ waves completed** | Context accumulates diffs, verification reports, and agent outputs that degrade signal-to-noise |
| **Reasoning quality degrades** | Repeated mistakes, circular reasoning, forgetting earlier decisions, or hallucinating file contents |
| **Context window pressure** | Platform warns about context size, or responses become noticeably slower |
| **Natural breakpoint before tail tasks** | The mandatory tail tasks (code review, requirements validation, full verification) deserve a fresh context |
| **After a major failure/escalation** | A failed task that required user intervention may have polluted context with debugging noise |

**Do NOT reset:**
- Mid-task (always finish the current task first)
- Mid-wave (complete the wave boundary checks first)
- When only 1-2 waves remain (overhead of reset exceeds benefit)

---

## Handoff Document

Before resetting, write a structured handoff to `.absolute-human/handoff.md`.
This document captures everything the next context needs that is NOT already on
the board.

### Handoff Template

```markdown
# Context Reset Handoff

## Session State
- **Board path**: .absolute-human/board.md
- **Current phase**: {EXECUTE | VERIFY | CONVERGE}
- **Current wave**: {N} of {total}
- **Completed waves**: {list}
- **Failed tasks**: {none | list with failure reasons}
- **Blocked tasks**: {none | list with blocker IDs}

## Key Decisions Made This Session
Decisions that informed implementation but aren't captured on the board:
- {decision 1}: {what was decided and why}
- {decision 2}: {what was decided and why}

## Patterns Discovered During Execution
Things learned about the codebase that aren't in Project Conventions:
- {pattern 1}: {e.g., "the auth middleware expects req.user to be set by passport"}
- {pattern 2}: {e.g., "tests in this project use factory functions from test/helpers"}

## Workarounds Applied
Any non-obvious workarounds and why they were necessary:
- {workaround}: {why it was needed, what the ideal fix would be}

## Active Warnings
Issues to watch for in remaining work:
- {warning 1}: {e.g., "SH-007 modified the shared types file - downstream tasks should verify imports"}

## Next Actions
- Execute Wave {N}: {task list with IDs and titles}
- Then: {remaining waves or tail tasks}
- Watch for: {known risks}
```

### What NOT to Put in the Handoff

- Full diffs or code listings (the board and git have these)
- Complete research notes (already on the board)
- The full task graph (already on the board)
- Anything that duplicates board content

The handoff captures the **implicit context** that lives in the agent's reasoning
but hasn't been written down anywhere. Keep it under 100 lines.

---

## Reset Procedure

### Step 1: Prepare

1. Ensure the current wave is complete (all tasks done or failed)
2. Run wave boundary checks (conflict resolution, progress report)
3. Update the board with all current state
4. Write the handoff document to `.absolute-human/handoff.md`

### Step 2: Notify the User

```
Context is getting large after {N} waves. Resetting for better reasoning quality.

**State preserved in:**
- Board: .absolute-human/board.md (full task graph, research, plans, verification)
- Handoff: .absolute-human/handoff.md (session-specific context)

**To resume:** Re-invoke Absolute-Human in a new conversation. It will detect
the existing board and handoff, then pick up from Wave {next_wave}.
```

### Step 3: Resume After Reset

When Absolute-Human is invoked and detects both a board AND a handoff file:

1. Read `board.md` - parse frontmatter, identify current phase and wave
2. Read `handoff.md` - absorb session-specific context
3. Read `## Project Conventions` from the board
4. Display a compact status summary:
   ```
   Resuming from context reset.
   Completed: Waves 1-{N} ({X}/{Y} tasks done)
   Next: Wave {N+1} ({task list})
   Active warnings: {from handoff}
   ```
5. Delete `handoff.md` after successful resume (it's ephemeral)
6. Continue execution from the next incomplete wave

### Step 4: Verify Resume Integrity

After resuming, before executing the next wave:
1. Run a quick build check to verify the project is in the expected state
2. Compare the board's expected completed tasks against actual git state
3. If anything is out of sync, flag to the user before proceeding

---

## Platform-Specific Mechanisms

### Claude Code

- The Session Resume Protocol in SKILL.md handles board detection automatically
- For an intentional reset: suggest the user start a new conversation
- Claude Code's automatic compaction may trigger before a manual reset - the
  handoff document ensures no implicit context is lost during compaction

### Other Platforms (Gemini CLI, Codex, etc.)

- Write the handoff document as above
- Instruct the user to close the current session and start a new one
- The new session invokes Absolute-Human, which detects the board and handoff

### Within a Single Long Session

If the platform supports it (e.g., Claude Code's context management), a reset
can happen within the same conversation:
1. Write the handoff
2. Let automatic compaction occur
3. On the next turn, read board + handoff to rebuild context
4. This avoids the user needing to start a new conversation

---

## Monitoring Context Health

Signs that context quality is degrading (watch for these during execution):

| Signal | What It Looks Like |
|--------|--------------------|
| **Repetition** | Agent re-discovers something it already found earlier |
| **Contradiction** | Agent makes a decision that conflicts with an earlier decision |
| **Hallucination** | Agent references files or functions that don't exist |
| **Premature completion** | Agent rushes to wrap up, skipping planned work |
| **Circular debugging** | Agent applies the same fix repeatedly for a recurring failure |
| **Lost conventions** | Agent stops following project conventions it detected earlier |

If 2+ of these signals appear in the same wave, trigger a context reset at the
next wave boundary regardless of other triggers.
