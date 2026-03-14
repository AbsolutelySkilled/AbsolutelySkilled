<!-- Part of the Game Design Patterns AbsolutelySkilled skill. Load this file when
     working with event systems, observer pattern, message bus, or pub/sub in games. -->

# Event Systems

Event systems decouple game systems by letting them communicate through messages
rather than direct references. The damage system does not need to know about the
UI, audio, analytics, or camera shake - it just emits "damage dealt" and
subscribers handle the rest.

---

## Immediate dispatch vs event queue

### Immediate dispatch

Handlers fire synchronously the moment `emit()` is called. Simple and predictable.

```typescript
class ImmediateEventBus {
  private handlers = new Map<string, Set<Function>>();

  emit(event: string, data: any) {
    this.handlers.get(event)?.forEach(fn => fn(data));
  }
}
```

**Pros:** Simple. Handlers see the event in the same frame. Stack trace is readable.
**Cons:** A slow handler blocks the emitter. Handlers can emit more events, causing
re-entrant cascades.

### Event queue

Events are buffered and processed at a defined point in the frame (e.g., end of
update, between fixed steps).

```typescript
class QueuedEventBus {
  private queue: Array<{ event: string; data: any }> = [];
  private handlers = new Map<string, Set<Function>>();

  emit(event: string, data: any) {
    this.queue.push({ event, data });
  }

  processQueue() {
    const current = this.queue;
    this.queue = []; // Swap to avoid infinite loops from handlers emitting
    for (const { event, data } of current) {
      this.handlers.get(event)?.forEach(fn => fn(data));
    }
  }
}
```

**Pros:** No re-entrancy issues. Can batch-process events. Easier to debug.
**Cons:** One frame of latency. Harder to reason about ordering.

**Recommendation:** Use immediate dispatch for UI and simple gameplay. Use queued
dispatch for physics callbacks, networking, and any system where re-entrancy is a risk.

---

## Priority ordering

When multiple systems react to the same event, order can matter. A shield system
should reduce damage before the health system applies it.

```typescript
class PriorityEventBus {
  private handlers = new Map<string, Array<{ priority: number; fn: Function }>>();

  on(event: string, handler: Function, priority = 0) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    const list = this.handlers.get(event)!;
    list.push({ priority, fn: handler });
    list.sort((a, b) => b.priority - a.priority); // Higher priority first
  }

  emit(event: string, data: any) {
    this.handlers.get(event)?.forEach(({ fn }) => fn(data));
  }
}

// Shield processes damage first (priority 100), then health (priority 0)
bus.on("damage-taken", shieldSystem.onDamage, 100);
bus.on("damage-taken", healthSystem.onDamage, 0);
```

> Use priority sparingly. If you have more than 3 priority levels for one event,
> the systems are too coupled and you should redesign the data flow.

---

## Event filtering

Not every subscriber cares about every instance of an event. The UI only cares about
damage to the player, not to every enemy.

### Filter at subscribe time

```typescript
bus.on("damage-taken", (data) => {
  if (data.target !== player) return; // Early exit
  healthBar.update(data.amount);
});
```

### Scoped event buses

Instead of one global bus, create buses per scope:

```typescript
class Entity {
  readonly events = new EventBus(); // Per-entity bus
}

// Subscribe to this specific enemy's events
boss.events.on("health-changed", updateBossHealthBar);
```

**Best practice:** Use a global bus for system-level events (level-complete, pause,
game-over). Use per-entity buses for entity-specific events (health-changed,
state-changed).

---

## Debugging leaked subscriptions

The #1 bug with event systems: a destroyed entity's handler is still subscribed,
causing it to process events after "death."

### Prevention: unsubscribe on destroy

```typescript
class Enemy {
  private unsubscribers: Array<() => void> = [];

  init() {
    this.unsubscribers.push(
      bus.on("player-moved", this.onPlayerMoved.bind(this))
    );
  }

  destroy() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers.length = 0;
  }
}
```

### Detection: debug mode listener tracking

```typescript
class DebugEventBus extends EventBus {
  private subscriberSources = new Map<Function, string>();

  on(event: string, handler: Function) {
    this.subscriberSources.set(handler, new Error().stack ?? "unknown");
    return super.on(event, handler);
  }

  debugListeners(event: string) {
    console.log(`Listeners for "${event}":`);
    this.handlers.get(event)?.forEach(fn => {
      console.log(" -", this.subscriberSources.get(fn));
    });
  }
}
```

> In debug builds, log a warning when event handler count for any event exceeds
> a threshold (e.g., 50). This catches subscription leaks early.

---

## Typed events pattern

Use TypeScript's type system to enforce correct event payloads at compile time.

```typescript
// Define all events and their payloads in one place
interface GameEvents {
  "player:damage": { amount: number; source: string; isCritical: boolean };
  "player:death": { killer: string; position: Vector2 };
  "enemy:spawn": { type: string; level: number; position: Vector2 };
  "ui:notification": { message: string; duration: number };
  "game:pause": {};
  "game:resume": {};
}

class TypedEventBus {
  private handlers = new Map<string, Set<Function>>();

  on<K extends keyof GameEvents>(
    event: K,
    handler: (data: GameEvents[K]) => void
  ): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)!.delete(handler);
  }

  emit<K extends keyof GameEvents>(event: K, data: GameEvents[K]) {
    this.handlers.get(event)?.forEach(fn => fn(data));
  }
}
```

This catches typos in event names and wrong payload shapes at compile time.

---

## Common pitfalls

1. **God bus** - One global bus handles everything. Hard to trace which systems
   react to what. Split into domain-specific buses.
2. **Event storms** - Handler A emits event B, handler for B emits event A,
   creating an infinite loop. Use queued dispatch or add re-entrancy guards.
3. **Order dependence** - System correctness depends on handler execution order
   without making that order explicit. Use priority if order matters.
4. **Stale data in events** - Event carries a reference to mutable data that
   changes before all handlers process it. Copy data into the event payload.
5. **Subscription leaks** - Destroyed entities still subscribed. Always unsubscribe
   in the destroy/cleanup method.
