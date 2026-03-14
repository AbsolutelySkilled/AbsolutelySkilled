<!-- Part of the Unity Development AbsolutelySkilled skill. Load this file when working with Unity ECS, DOTS, Jobs system, or Burst compiler. -->

# ECS / DOTS Reference

---

## 1. Architecture Overview

ECS (Entity Component System) is Unity's data-oriented tech stack (DOTS). It replaces
the traditional GameObject/MonoBehaviour model with a cache-friendly, parallelizable
architecture.

| Concept | Traditional | ECS |
|---|---|---|
| Identity | GameObject | Entity (lightweight int ID) |
| Data | MonoBehaviour fields | IComponentData struct |
| Logic | MonoBehaviour.Update() | ISystem.OnUpdate() |
| Grouping | Transform hierarchy | Archetypes (component combos) |

**When to use ECS:** 10,000+ entities with similar behavior (bullets, particles,
NPCs, terrain chunks). Below that threshold, the traditional model is simpler and
usually fast enough.

---

## 2. Components

Components are plain structs. No methods, no inheritance, no managed types.

```csharp
// Simple data component
public struct Health : IComponentData
{
    public float Current;
    public float Max;
}

// Tag component (zero-size, used for filtering)
public struct EnemyTag : IComponentData { }

// Buffer element (variable-length per-entity data)
[InternalBufferCapacity(8)]
public struct DamageBufferElement : IBufferElementData
{
    public float Value;
    public Entity Source;
}

// Shared component (same value shared across many entities - use sparingly)
public struct TeamId : ISharedComponentData
{
    public int Value;
}

// Enableable component (toggled on/off without structural changes)
public struct Stunned : IComponentData, IEnableableComponent { }
```

**Rules:**
- No `class` types, `string`, or arrays inside components (breaks Burst)
- Use `FixedString64Bytes` instead of `string`
- Use `DynamicBuffer<T>` instead of arrays
- Shared components cause archetype fragmentation - use only for truly shared data

---

## 3. Systems

Systems contain all logic. They query for entities with specific component combos.

```csharp
[BurstCompile]
public partial struct DamageSystem : ISystem
{
    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        var ecb = new EntityCommandBuffer(Allocator.Temp);

        foreach (var (health, buffer, entity) in
            SystemAPI.Query<RefRW<Health>, DynamicBuffer<DamageBufferElement>>()
                .WithEntityAccess())
        {
            foreach (var dmg in buffer)
                health.ValueRW.Current -= dmg.Value;

            buffer.Clear();

            if (health.ValueRO.Current <= 0f)
                ecb.DestroyEntity(entity);
        }

        ecb.Playback(state.EntityManager);
        ecb.Dispose();
    }
}
```

**System ordering:** Use `[UpdateBefore(typeof(OtherSystem))]` and
`[UpdateAfter(typeof(OtherSystem))]` attributes. Group related systems with
`[UpdateInGroup(typeof(SimulationSystemGroup))]`.

**Built-in system groups (execution order):**
1. `InitializationSystemGroup`
2. `SimulationSystemGroup` (default - most gameplay systems go here)
3. `PresentationSystemGroup` (rendering-related)

---

## 4. Entity Command Buffers (ECB)

Structural changes (create/destroy entity, add/remove component) cannot happen
during iteration. Use ECBs to defer them.

```csharp
// From a system using the built-in ECB system
[BurstCompile]
public partial struct SpawnSystem : ISystem
{
    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        var ecbSingleton = SystemAPI.GetSingleton<BeginSimulationEntityCommandBufferSystem.Singleton>();
        var ecb = ecbSingleton.CreateCommandBuffer(state.WorldUnmanaged);

        foreach (var (spawner, transform) in
            SystemAPI.Query<RefRW<Spawner>, RefRO<LocalTransform>>())
        {
            spawner.ValueRW.Timer -= SystemAPI.Time.DeltaTime;
            if (spawner.ValueRO.Timer <= 0f)
            {
                Entity e = ecb.Instantiate(spawner.ValueRO.Prefab);
                ecb.SetComponent(e, LocalTransform.FromPosition(transform.ValueRO.Position));
                spawner.ValueRW.Timer = spawner.ValueRO.Interval;
            }
        }
    }
}
```

**ECB timing:** Use `BeginSimulationEntityCommandBufferSystem` for changes that
should apply at the start of the next frame. Use `EndSimulationEntityCommandBufferSystem`
for end-of-frame cleanup.

---

## 5. Jobs and Burst

For CPU-intensive work, schedule jobs that run on worker threads.

```csharp
[BurstCompile]
public partial struct MoveJob : IJobEntity
{
    public float DeltaTime;

    public void Execute(ref LocalTransform transform, in MoveSpeed speed)
    {
        transform.Position += transform.Forward() * speed.Value * DeltaTime;
    }
}

// In the system:
[BurstCompile]
public partial struct MoveSystem : ISystem
{
    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        new MoveJob { DeltaTime = SystemAPI.Time.DeltaTime }.ScheduleParallel();
    }
}
```

**Burst constraints:**
- No managed types (classes, strings, delegates)
- No try/catch blocks
- No virtual method calls
- Use `NativeArray`, `NativeList`, `NativeHashMap` for collections
- Use `[ReadOnly]` attribute on job fields that are read-only (enables parallelism)

---

## 6. Baking (Authoring to Runtime)

Baking converts GameObjects in subscenes into ECS entities at build time.

```csharp
// Authoring component (MonoBehaviour in the Editor)
public class SpeedAuthoring : MonoBehaviour
{
    public float speed = 10f;
}

// Baker converts it to ECS component
public class SpeedBaker : Baker<SpeedAuthoring>
{
    public override void Bake(SpeedAuthoring authoring)
    {
        Entity entity = GetEntity(TransformUsageFlags.Dynamic);
        AddComponent(entity, new MoveSpeed { Value = authoring.speed });
    }
}
```

**Subscenes** are the entry point. Place authored GameObjects in a subscene, and
Unity bakes them to entities. At runtime, the subscene loads as serialized entity
data - much faster than instantiating GameObjects.

---

## 7. Hybrid Approach

You don't have to go all-in on ECS. Common hybrid patterns:

- **ECS for simulation, GameObjects for presentation** - entities hold data,
  companion GameObjects hold meshes and particle systems
- **Managed components** for bridging - `class IComponentData` can hold managed
  references but loses Burst/Jobs compatibility
- **SystemBase** (managed system) when you need access to managed APIs
  (UnityEngine.Object, MonoBehaviour references)

```csharp
// Managed system - no Burst, but can access managed types
public partial class AudioSystem : SystemBase
{
    protected override void OnUpdate()
    {
        Entities.ForEach((ref PlaySoundRequest request) =>
        {
            AudioSource.PlayClipAtPoint(request.Clip, request.Position);
        }).WithoutBurst().Run();  // Run() = main thread, no jobs
    }
}
```

Use the hybrid approach to incrementally adopt ECS. Don't rewrite your entire
game - identify the hot systems (movement, AI, spawning) and migrate those first.

---

## 8. Performance Checklist

- [ ] Components are blittable structs (no managed types)
- [ ] Systems use `[BurstCompile]` attribute
- [ ] Jobs use `ScheduleParallel()` when no write conflicts exist
- [ ] Read-only job fields are marked `[ReadOnly]`
- [ ] ECBs are used for structural changes (not direct EntityManager calls in loops)
- [ ] Shared components are used sparingly (each unique value creates an archetype)
- [ ] Queries use `WithAll`, `WithNone`, `WithAny` to narrow scope
- [ ] NativeContainers are disposed after use (or use `Allocator.Temp`)
