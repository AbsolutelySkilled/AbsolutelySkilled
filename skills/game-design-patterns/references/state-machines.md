<!-- Part of the Game Design Patterns AbsolutelySkilled skill. Load this file when
     working with state machines, FSMs, hierarchical state machines, or behavior trees. -->

# State Machines

State machines are the most fundamental pattern for managing entity behavior in games.
Every character, AI agent, UI screen, and game phase can be modeled as a state machine.

---

## Finite State Machine (FSM)

The simplest form. An entity is always in exactly one state. Each state defines:

- **enter()** - Run once when entering the state (play animation, set flags)
- **update(dt)** - Run every frame while in the state
- **exit()** - Run once when leaving (cleanup, stop effects)
- **transitions** - Conditions that trigger a move to another state

### Transition table design

Define valid transitions upfront rather than scattering them through state code.
This makes the machine auditable and prevents spaghetti.

```typescript
type TransitionTable = {
  [fromState: string]: {
    [condition: string]: string; // target state
  };
};

const playerTransitions: TransitionTable = {
  Idle:      { jump: "Jumping", move: "Running", attack: "Attacking" },
  Running:   { stop: "Idle", jump: "Jumping", attack: "Attacking" },
  Jumping:   { land: "Idle", attack: "AirAttack" },
  Attacking: { done: "Idle" },
  AirAttack: { land: "Idle" },
};
```

> If a transition is not in the table, it is illegal. This catches bugs like
> "attacking while already attacking" at the architecture level.

### Common FSM implementation patterns

**Enum-based FSM** - Simplest. Good for fewer than 5 states with minimal per-state logic.

```typescript
enum PlayerState { Idle, Running, Jumping }

class Player {
  state = PlayerState.Idle;

  update(dt: number) {
    switch (this.state) {
      case PlayerState.Idle:
        if (this.input.move) this.state = PlayerState.Running;
        break;
      case PlayerState.Running:
        this.position.x += this.speed * dt;
        if (!this.input.move) this.state = PlayerState.Idle;
        break;
    }
  }
}
```

**Class-based FSM** - Better for 5+ states or states with significant per-state logic.
Each state is its own class implementing a common interface. This is the recommended
approach for most game entities.

**Data-driven FSM** - States and transitions defined in external data (JSON, ScriptableObjects).
Good for designer-facing tools where non-programmers need to tweak behavior.

---

## Hierarchical State Machine (HFSM)

When a flat FSM has too many states, group related states into parent states.
The parent handles shared behavior; children handle specifics.

```
CombatState (parent)
  - AttackingState (child)
  - DefendingState (child)
  - FlankingState (child)

IdleState (parent)
  - PatrolState (child)
  - StandingState (child)
```

**Key rule:** Transitions can target a parent state (enters its default child) or
a specific child. A child can transition to a sibling without leaving the parent.
Transitioning out of a child to a non-sibling exits the parent too.

### When to use HFSM vs flat FSM

| Situation | Use |
|---|---|
| Fewer than 8 states, minimal shared behavior | Flat FSM |
| 8-20 states with clear groupings | HFSM (2 levels max) |
| States share entry/exit logic | HFSM - put shared logic in parent |
| Designer needs to visualize/edit states | HFSM with visual editor |
| 20+ states with complex transitions | Consider behavior trees instead |

---

## Pushdown Automata

A stack-based state machine where new states push onto a stack and popping resumes
the previous state. Perfect for interrupt-and-resume patterns.

**Use cases:**
- Pause menu pushes onto gameplay state; unpausing pops back
- Cutscene pushes onto exploration; cutscene ends, exploration resumes exactly
- Stun effect pushes onto any current state; stun ends, previous behavior resumes

```typescript
class PushdownFSM {
  private stack: State[] = [];

  get current(): State | undefined {
    return this.stack[this.stack.length - 1];
  }

  push(state: State) {
    this.current?.pause?.();
    this.stack.push(state);
    state.enter();
  }

  pop() {
    const old = this.stack.pop();
    old?.exit();
    this.current?.resume?.();
  }

  update(dt: number) {
    this.current?.update(dt);
  }
}
```

> The `pause()` and `resume()` hooks are critical. Without them, a paused state's
> timers and animations continue running in the background.

---

## FSM vs Behavior Trees

| Aspect | FSM | Behavior Tree |
|---|---|---|
| Complexity sweet spot | Simple, predictable behavior | Complex AI with priorities and fallbacks |
| Transitions | Explicit (state A -> state B) | Implicit (tree traversal determines next action) |
| Adding behavior | Requires new states and transitions | Add a new branch to the tree |
| Debugging | Easy - print current state | Harder - need tree visualization |
| Player characters | Excellent | Overkill for most cases |
| NPC AI | Good for simple enemies | Better for complex enemies with many behaviors |
| Game phases | Excellent | Not appropriate |

**Rule of thumb:** Start with an FSM. If you find yourself adding transitions between
states that shouldn't know about each other, it is time to consider a behavior tree.

---

## Common pitfalls

1. **State explosion** - Too many states in a flat FSM. Solution: use HFSM or
   behavior trees.
2. **Transition spaghetti** - Every state can go to every other state. Solution:
   define a transition table and enforce it.
3. **Duplicated exit logic** - Multiple states need the same cleanup. Solution:
   use a parent state in an HFSM.
4. **Missing enter/exit hooks** - Putting initialization in `update()` behind a
   `firstFrame` flag instead of using `enter()`. Always use the hooks.
5. **Stateless state machine** - Storing state data on the entity instead of in the
   state object. This leads to stale data when re-entering a state.
