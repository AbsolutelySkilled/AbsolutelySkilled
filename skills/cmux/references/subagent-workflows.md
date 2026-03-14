# Subagent Workflows

Patterns for using cmux to orchestrate multiple parallel tasks from an AI agent.

## Single subagent pattern

The simplest case: spawn one pane, run a task, read output, clean up.

```bash
# 1. Create a split pane to the right
PANE_RESULT=$(cmux --json new-pane --direction right)
# Parse: extract surface_ref from JSON (e.g., "surface:50")
SURFACE_REF="surface:50"  # extracted from PANE_RESULT

# 2. Send command
cmux send --surface $SURFACE_REF "cd /path/to/project && npm test"
cmux send-key --surface $SURFACE_REF Enter

# 3. Wait for completion, then read output
cmux read-screen --surface $SURFACE_REF --scrollback --lines 200

# 4. Clean up
cmux close-surface --surface $SURFACE_REF
```

## Parallel subagents pattern

Run multiple independent tasks simultaneously in separate panes.

```bash
# Create panes in a grid layout
# First split right
PANE1=$(cmux --json new-pane --direction right)
SURFACE1="surface:50"  # from PANE1

# Split the new pane down to create a 2x1 grid on the right
PANE2=$(cmux --json new-pane --direction down --pane pane:50)
SURFACE2="surface:51"  # from PANE2

# Send commands to each
cmux send --surface $SURFACE1 "npm run test:unit" && cmux send-key --surface $SURFACE1 Enter
cmux send --surface $SURFACE2 "npm run test:e2e" && cmux send-key --surface $SURFACE2 Enter

# Read results from each when done
OUTPUT1=$(cmux read-screen --surface $SURFACE1 --scrollback --lines 100)
OUTPUT2=$(cmux read-screen --surface $SURFACE2 --scrollback --lines 100)

# Clean up all
cmux close-surface --surface $SURFACE1
cmux close-surface --surface $SURFACE2
```

## Workspace isolation pattern

For heavier tasks, create a dedicated workspace to avoid cluttering the main one.

```bash
# Create a new workspace
WS=$(cmux --json new-workspace)
WS_REF="workspace:20"  # from WS

# Create panes in the new workspace
PANE=$(cmux --json new-pane --direction right --workspace $WS_REF)
SURFACE="surface:60"

# Run task
cmux send --surface $SURFACE "make build" && cmux send-key --surface $SURFACE Enter

# When done, close entire workspace
cmux close-workspace --workspace $WS_REF
```

## Output polling pattern

When you need to wait for a command to finish before reading output.

```bash
# Option 1: Use wait-for signals
# In the surface, append a signal after the command
cmux send --surface $SURFACE "npm test && cmux wait-for --signal task-done"
cmux send-key --surface $SURFACE Enter

# In the main agent, wait for the signal
cmux wait-for task-done --timeout 120

# Option 2: Poll read-screen for a completion marker
# Send command that echoes a marker when done
cmux send --surface $SURFACE "npm test; echo '===DONE==='"
cmux send-key --surface $SURFACE Enter

# Then poll read-screen and check for ===DONE===
```

## Naming panes for tracking

Use rename-tab to label surfaces for easier identification:

```bash
cmux rename-tab --surface $SURFACE "Unit Tests"
cmux rename-tab --surface $SURFACE2 "E2E Tests"
```

## Browser + terminal side-by-side

Common for web development - terminal on left, browser on right:

```bash
# Create browser pane to the right
cmux --json new-pane --type browser --direction right --url "http://localhost:3000"

# The terminal pane (left) runs the dev server
cmux send --surface $TERMINAL_SURFACE "npm run dev"
cmux send-key --surface $TERMINAL_SURFACE Enter
```

## Cleanup strategies

### Close individual surfaces

```bash
cmux close-surface --surface surface:50
cmux close-surface --surface surface:51
```

### Close by sending exit

```bash
cmux send-key --surface surface:50 "ctrl+c"
cmux send --surface surface:50 "exit"
cmux send-key --surface surface:50 Enter
```

### Close entire workspace

```bash
cmux close-workspace --workspace workspace:20
```

### Kill and respawn

```bash
cmux respawn-pane --surface surface:50
```

## Notification on completion

```bash
cmux send --surface $SURFACE "npm test && cmux notify --title 'Tests' --body 'Passed' || cmux notify --title 'Tests' --body 'Failed'"
cmux send-key --surface $SURFACE Enter
```

## Best practices

1. **Always save surface refs** - Store the surface ref from `new-pane` output.
   Stale refs after closing will error.

2. **Use --json for parsing** - Always pass `--json` when you need to extract
   refs from command output.

3. **Clean up after yourself** - Close surfaces/workspaces when tasks complete.
   Orphaned panes waste screen space and confuse users.

4. **Use directions wisely** - `right` for side-by-side comparison, `down` for
   log tailing. Avoid more than 3-4 splits as they become too small.

5. **Prefer read-screen over pipe-pane** - `read-screen` is a one-shot read.
   `pipe-pane` streams continuously and needs cleanup.

6. **Signal for synchronization** - Use `cmux wait-for` when you need to
   block until a task completes rather than polling.

7. **Rename for clarity** - Use `rename-tab` so the user can identify what
   each pane is doing at a glance.
