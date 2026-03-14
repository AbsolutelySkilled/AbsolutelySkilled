# Pane Management

Advanced pane operations beyond basic create/close.

## Resize panes

```bash
# Resize pane left by 10 cells
cmux resize-pane --pane pane:5 -L --amount 10

# Resize pane right, up, down
cmux resize-pane --pane pane:5 -R --amount 5
cmux resize-pane --pane pane:5 -U --amount 3
cmux resize-pane --pane pane:5 -D --amount 3
```

Direction flags: `-L` (left), `-R` (right), `-U` (up), `-D` (down).
`--amount` defaults to 1 if omitted.

## Swap panes

```bash
cmux swap-pane --pane pane:5 --target-pane pane:8
```

Swaps the positions of two panes within the same workspace.

## Break pane (promote to workspace)

```bash
# Break surface out of current pane into a new workspace
cmux break-pane --surface surface:42

# Break without focusing the new workspace
cmux break-pane --surface surface:42 --no-focus
```

## Join pane (merge into another)

```bash
# Move current surface into target pane
cmux join-pane --target-pane pane:8

# Join specific surface into target, without focusing
cmux join-pane --target-pane pane:8 --surface surface:42 --no-focus
```

## Drag surface to split

```bash
# Drag a surface to create a new split in a direction
cmux drag-surface-to-split --surface surface:42 right
cmux drag-surface-to-split --surface surface:42 down
```

## Move surface between panes

```bash
# Move surface to a different pane
cmux move-surface --surface surface:42 --pane pane:8

# Move to specific index within the pane
cmux move-surface --surface surface:42 --pane pane:8 --index 0

# Move before/after another surface
cmux move-surface --surface surface:42 --before surface:50
cmux move-surface --surface surface:42 --after surface:50

# Move and focus
cmux move-surface --surface surface:42 --pane pane:8 --focus true
```

## Reorder surfaces within a pane

```bash
cmux reorder-surface --surface surface:42 --index 0
cmux reorder-surface --surface surface:42 --before surface:50
cmux reorder-surface --surface surface:42 --after surface:50
```

## Multiple surfaces per pane (tabs)

A pane can hold multiple surfaces as tabs. Create additional surfaces in
an existing pane:

```bash
# Add a new terminal tab to an existing pane
cmux --json new-surface --type terminal --pane pane:5

# Add a browser tab to an existing pane
cmux --json new-surface --type browser --pane pane:5 --url "https://example.com"
```

## List panels

Panels are a separate concept from panes - they are sidebar/auxiliary views.

```bash
cmux --json list-panels
cmux focus-panel --panel panel:1
cmux send-panel --panel panel:1 "some text"
cmux send-key-panel --panel panel:1 Enter
```

## Respawn a surface

Kill and restart the process in a surface:

```bash
cmux respawn-pane --surface surface:42
cmux respawn-pane --surface surface:42 --command "zsh"
```

## Pipe pane output

Pipe all output from a surface to a shell command:

```bash
cmux pipe-pane --command "tee /tmp/surface-log.txt" --surface surface:42
```

## Clear history

```bash
cmux clear-history --surface surface:42
```

## Wait for signal

Synchronization primitive between surfaces:

```bash
# In surface A: wait for a signal
cmux wait-for my-signal --timeout 30

# In surface B: send the signal
cmux wait-for --signal my-signal
```

## Surface health check

```bash
cmux --json surface-health
```

Returns health status for all surfaces in the current workspace.

## Trigger flash (visual identification)

```bash
# Flash current surface
cmux trigger-flash

# Flash specific surface
cmux trigger-flash --surface surface:42
```

Useful for visually identifying which surface a ref points to.
