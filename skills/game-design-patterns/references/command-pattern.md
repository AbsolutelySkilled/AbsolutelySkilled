<!-- Part of the Game Design Patterns AbsolutelySkilled skill. Load this file when
     working with the command pattern, undo/redo, replay systems, or input handling. -->

# Command Pattern

The command pattern encapsulates actions as objects. Instead of calling
`player.jump()` directly, you create a `JumpCommand` object and execute it. This
single layer of indirection unlocks undo, redo, replay, networking, AI input,
input rebinding, and macro recording.

---

## Core interface

Every command implements at minimum:

```typescript
interface Command {
  execute(): void;
  undo(): void;
}
```

For networking and replay, add serialization:

```typescript
interface SerializableCommand extends Command {
  readonly type: string;
  serialize(): Record<string, unknown>;
  static deserialize(data: Record<string, unknown>): SerializableCommand;
}
```

---

## Undo stack management

A command history tracks executed commands and supports undo/redo.

```typescript
class CommandHistory {
  private stack: Command[] = [];
  private pointer = -1;
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  execute(cmd: Command) {
    // Discard redo history when a new command is executed
    this.stack.length = this.pointer + 1;

    cmd.execute();
    this.stack.push(cmd);
    this.pointer++;

    // Enforce max size to prevent memory leaks
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
      this.pointer--;
    }
  }

  undo(): boolean {
    if (this.pointer < 0) return false;
    this.stack[this.pointer].undo();
    this.pointer--;
    return true;
  }

  redo(): boolean {
    if (this.pointer >= this.stack.length - 1) return false;
    this.pointer++;
    this.stack[this.pointer].execute();
    return true;
  }

  clear() {
    this.stack.length = 0;
    this.pointer = -1;
  }
}
```

**Key decisions:**
- **Max size** - Cap at 50-200 commands for gameplay, 1000+ for editors.
- **Redo discard** - When executing a new command after undoing, discard the
  redo branch. This is the standard UX expectation.
- **Checkpoint** - For long sessions, periodically snapshot the full state and
  truncate old commands. Undo only goes back to the last checkpoint.

---

## Composite commands

Group multiple commands into one undoable unit. Essential for batch operations
in editors (e.g., "move all selected objects").

```typescript
class CompositeCommand implements Command {
  constructor(private commands: Command[]) {}

  execute() {
    for (const cmd of this.commands) {
      cmd.execute();
    }
  }

  undo() {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}

// Usage: move 5 selected tiles at once
const moveAll = new CompositeCommand(
  selectedTiles.map(tile => new MoveCommand(tile, offset))
);
history.execute(moveAll); // Undo reverts ALL tiles in one step
```

---

## Replay system

Record commands with timestamps during gameplay. Replay by feeding the same
commands to a fresh game state at the same timings.

```typescript
interface TimestampedCommand {
  frame: number;
  command: SerializableCommand;
}

class ReplayRecorder {
  private recording: TimestampedCommand[] = [];
  private currentFrame = 0;

  record(cmd: SerializableCommand) {
    this.recording.push({ frame: this.currentFrame, command: cmd });
  }

  tick() {
    this.currentFrame++;
  }

  export(): string {
    return JSON.stringify(
      this.recording.map(r => ({
        frame: r.frame,
        type: r.command.type,
        data: r.command.serialize(),
      }))
    );
  }
}

class ReplayPlayer {
  private recording: TimestampedCommand[];
  private index = 0;
  private currentFrame = 0;

  constructor(data: string, private commandFactory: CommandFactory) {
    const parsed = JSON.parse(data);
    this.recording = parsed.map((r: any) => ({
      frame: r.frame,
      command: this.commandFactory.create(r.type, r.data),
    }));
  }

  tick() {
    while (
      this.index < this.recording.length &&
      this.recording[this.index].frame === this.currentFrame
    ) {
      this.recording[this.index].command.execute();
      this.index++;
    }
    this.currentFrame++;
  }

  get isComplete(): boolean {
    return this.index >= this.recording.length;
  }
}
```

**Critical requirement for replay:** The game must be deterministic. Same commands
on same frame must produce same result. This means:
- No `Math.random()` - use a seeded PRNG and include the seed in the replay
- No `Date.now()` for gameplay logic - use frame count
- Fixed timestep physics (not variable dt)
- Consistent floating-point behavior across platforms (use fixed-point if needed)

---

## Networking with commands

In multiplayer, send commands over the network instead of state. This reduces
bandwidth and leverages the same determinism required for replay.

### Lockstep model

Both clients wait for the other's commands before advancing a frame.

```
Frame N:
  1. Collect local input -> create commands
  2. Send commands to server/peer
  3. Wait for remote commands
  4. Execute ALL commands (local + remote) in deterministic order
  5. Advance to frame N+1
```

### Rollback model (GGPO-style)

Predict the remote player's input. If the prediction was wrong, roll back to
the last confirmed frame and replay with correct commands.

```typescript
class RollbackManager {
  private confirmedFrame = 0;
  private stateSnapshots = new Map<number, GameState>();
  private commandHistory = new Map<number, Command[]>();

  predict(frame: number, localCmd: Command, predictedRemoteCmd: Command) {
    this.commandHistory.set(frame, [localCmd, predictedRemoteCmd]);
    this.stateSnapshots.set(frame, this.gameState.snapshot());
    localCmd.execute();
    predictedRemoteCmd.execute();
  }

  correctPrediction(frame: number, actualRemoteCmd: Command) {
    const predicted = this.commandHistory.get(frame)?.[1];
    if (predicted && this.commandsEqual(predicted, actualRemoteCmd)) {
      this.confirmedFrame = frame;
      return; // Prediction was correct
    }

    // Rollback to the frame before the misprediction
    this.gameState.restore(this.stateSnapshots.get(frame)!);

    // Replay from that frame with correct commands
    this.commandHistory.get(frame)![1] = actualRemoteCmd;
    // ... re-execute all frames from here to current
  }
}
```

> Rollback requires the ability to snapshot and restore game state quickly.
> Keep gameplay state compact and separate from visual state.

---

## Input rebinding

When input is mapped through commands, rebinding is just changing which key
maps to which command - no gameplay code changes.

```typescript
class InputMapper {
  private bindings = new Map<string, () => Command>();

  bind(key: string, commandFactory: () => Command) {
    this.bindings.set(key, commandFactory);
  }

  handleInput(key: string): Command | null {
    const factory = this.bindings.get(key);
    return factory ? factory() : null;
  }
}

// Default bindings
const mapper = new InputMapper();
mapper.bind("Space", () => new JumpCommand(player));
mapper.bind("KeyZ", () => new AttackCommand(player));

// Player rebinds attack to KeyX
mapper.bind("KeyX", () => new AttackCommand(player));
mapper.bind("KeyZ", () => new DashCommand(player)); // Z is now dash
```

---

## Macro recording

Record a sequence of commands as a single reusable macro. Useful for strategy
games, automation tools, and level editors.

```typescript
class MacroRecorder {
  private isRecording = false;
  private commands: Command[] = [];

  startRecording() {
    this.commands = [];
    this.isRecording = true;
  }

  record(cmd: Command) {
    if (this.isRecording) this.commands.push(cmd);
  }

  stopRecording(): CompositeCommand {
    this.isRecording = false;
    return new CompositeCommand([...this.commands]);
  }
}
```

---

## Common pitfalls

1. **Skipping undo()** - "We'll add it later." You won't, and then replay breaks.
   Implement undo() for every command from day one.
2. **Mutable command state** - A command that references mutable objects may produce
   different results on redo. Capture values at execute time, not construction time.
3. **Non-deterministic commands** - Using `Math.random()` or system time inside
   execute(). All randomness must come from a seeded PRNG passed to the command.
4. **Unbounded history** - Storing every command forever. Set a max size and/or
   use periodic checkpoints.
5. **Forgetting composite undo order** - Composite commands must undo in reverse
   order. Forward undo creates inconsistent state.
