<!-- Part of the Game Design Patterns AbsolutelySkilled skill. Load this file when
     working with object pooling, memory management, or spawn performance. -->

# Object Pooling

Object pooling eliminates runtime allocation by pre-creating objects and recycling
them. In games, this is not an optimization - it is a requirement for any entity
spawned more than once per second.

---

## Why pooling matters in games

**The problem is not allocation - it is deallocation.** Creating an object is fast.
But when the garbage collector eventually runs to clean up destroyed objects, it
pauses your game for milliseconds. At 60fps, a 5ms GC pause means a visible stutter.

**When to pool:**
- Bullets, projectiles, particles (high spawn rate)
- Enemies that spawn in waves
- UI elements like damage numbers, floating text
- Audio source objects
- Visual effects (explosions, hit sparks)

**When NOT to pool:**
- Singleton systems (one instance, never destroyed)
- Level geometry (loaded once, persists all level)
- Anything created fewer than once per 10 seconds

---

## Pool sizing strategies

### Fixed pool

Pre-allocate an exact count. If the pool is empty, refuse the spawn.

```typescript
const MAX_BULLETS = 200;
const bulletPool = new ObjectPool(() => new Bullet(), MAX_BULLETS);

function fireBullet(pos: Vector2, dir: Vector2) {
  const bullet = bulletPool.acquire();
  if (!bullet) return; // Pool exhausted - skip this bullet
  bullet.init(pos, dir);
}
```

**Pros:** Predictable memory. No allocations ever.
**Cons:** Hard to tune. Too small = missed spawns. Too large = wasted memory.

### Growing pool with warning

Start with an estimate. If exhausted, grow by allocating more - but log a warning
so you can tune the initial size.

```typescript
class GrowablePool<T> {
  private available: T[] = [];
  private growCount = 0;

  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize: number,
    private growSize: number = 10
  ) {
    this.fill(initialSize);
  }

  private fill(count: number) {
    for (let i = 0; i < count; i++) {
      this.available.push(this.factory());
    }
  }

  acquire(): T {
    if (this.available.length === 0) {
      this.growCount++;
      console.warn(`Pool grew ${this.growCount} times. Consider increasing initial size.`);
      this.fill(this.growSize);
    }
    return this.available.pop()!;
  }

  release(obj: T) {
    this.reset(obj);
    this.available.push(obj);
  }
}
```

**Best practice:** Run your heaviest gameplay scenario and check growCount. Set
initial size to cover that peak with 20% headroom.

### Double-buffer pool

For systems where objects are spawned and released in bulk (particle bursts),
use two lists and swap them each frame to avoid iterator invalidation.

---

## Reset contract

The most critical part of pooling is the reset function. When an object is released
back to the pool, it MUST be returned to a pristine state. Stale data from a
previous life is the #1 pooling bug.

```typescript
function resetBullet(bullet: Bullet) {
  bullet.active = false;
  bullet.position.set(0, 0);
  bullet.velocity.set(0, 0);
  bullet.damage = 0;
  bullet.owner = null;
  bullet.lifetime = 0;
  // Clear any event listeners attached during this life
  bullet.removeAllListeners();
}
```

**Checklist for a reset function:**
- [ ] Zero all physics state (position, velocity, acceleration)
- [ ] Reset all gameplay state (health, damage, owner, team)
- [ ] Deactivate rendering (hide sprite, disable mesh)
- [ ] Remove event subscriptions added during this object's life
- [ ] Cancel any active timers or coroutines
- [ ] Reset animation to default

---

## Language-specific GC considerations

### JavaScript / TypeScript

- No manual memory management. GC is unavoidable for unreferenced objects.
- Pool ALL frequently spawned objects. Avoid `new` in update loops.
- Use `TypedArray` (Float32Array, etc.) for bulk numeric data instead of object arrays.
- Avoid closures in hot paths - they allocate.

### C# (Unity)

- Use `ObjectPool<T>` from Unity 2021+ (`UnityEngine.Pool`).
- For older Unity: implement your own with `Queue<T>`.
- Disable GameObjects with `SetActive(false)` instead of `Destroy()`.
- Use `struct` for small value types to avoid heap allocation.

### C++

- Pooling is still valuable for cache locality even without GC.
- Use contiguous arrays (`std::vector<T>`) for cache-friendly iteration.
- Consider slot maps (sparse set) for stable handles with dense storage.
- Object pools in C++ also prevent memory fragmentation.

### Rust

- No GC, but pooling still helps with allocation cost and cache performance.
- Use `Vec<T>` as a free list. `pop()` to acquire, `push()` to release.
- Consider `Arena` allocators for frame-scoped temporary objects.

---

## Thread safety

If your game uses multithreaded job systems (Unity DOTS, Bevy ECS), pools need
synchronization:

```typescript
class ThreadSafePool<T> {
  private available: T[] = [];
  private lock = new Mutex();

  acquire(): T | null {
    this.lock.acquire();
    try {
      return this.available.pop() ?? null;
    } finally {
      this.lock.release();
    }
  }

  release(obj: T) {
    this.lock.acquire();
    try {
      this.available.push(obj);
    } finally {
      this.lock.release();
    }
  }
}
```

**Better approach:** Use per-thread pools. Each thread has its own pool, eliminating
contention entirely. Only rebalance between threads periodically.

---

## Common pitfalls

1. **Forgetting to reset** - Object retains state from previous use. Add assertions
   in debug builds that verify the reset contract.
2. **Double release** - Releasing an object that is already in the pool. Guard with
   an `active` flag or a set of active references.
3. **Pool too small** - Causes allocation during gameplay. Profile your peak and
   add headroom.
4. **Pool too large** - Wastes memory on objects never used. Log high-water marks
   and trim during loading screens.
5. **Holding references to released objects** - Other systems still point at a
   recycled object. Use handle/generation systems to detect stale references.
