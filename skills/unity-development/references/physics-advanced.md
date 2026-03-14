<!-- Part of the Unity Development AbsolutelySkilled skill. Load this file when working with Unity physics - joints, raycasting, trigger volumes, layers, or continuous collision detection. -->

# Physics Advanced Reference

---

## 1. Collision Detection Modes

| Mode | Use for | Cost |
|---|---|---|
| Discrete | Slow objects (characters, crates) | Cheapest |
| Continuous | Fast objects that must not tunnel (bullets) | Medium |
| Continuous Dynamic | Fast objects hitting other fast objects | Expensive |
| Continuous Speculative | Fast kinematic objects | Medium |

Set on the Rigidbody component. Default is Discrete - only change when you observe
tunneling artifacts.

---

## 2. Raycasting Strategies

```csharp
// Basic raycast
if (Physics.Raycast(origin, direction, out RaycastHit hit, maxDistance, layerMask))
{
    Debug.Log($"Hit {hit.collider.name} at {hit.point}");
}

// Non-allocating multi-hit (pre-allocate buffer)
private readonly RaycastHit[] _hitBuffer = new RaycastHit[16];

public int RaycastNonAlloc(Vector3 origin, Vector3 dir, float dist, int layer)
{
    return Physics.RaycastNonAlloc(origin, dir, _hitBuffer, dist, layer);
}

// SphereCast for "fat" raycasts (useful for aim assist)
Physics.SphereCast(origin, radius: 0.5f, direction, out RaycastHit hit, maxDistance);

// OverlapSphere for area detection (non-alloc)
private readonly Collider[] _overlapBuffer = new Collider[32];

public int DetectNearby(Vector3 center, float radius, int layer)
{
    return Physics.OverlapSphereNonAlloc(center, radius, _overlapBuffer, layer);
}
```

**Performance rules:**
- Always pass a `layerMask` to avoid testing every collider in the scene
- Use `NonAlloc` variants to avoid GC allocations
- Pre-allocate buffers as class fields, not local variables
- Use `QueryTriggerInteraction.Ignore` when you don't need trigger hits

---

## 3. Trigger Volumes

Triggers detect overlap without physical collision response. Use for pickup zones,
damage areas, quest triggers, and proximity detection.

```csharp
// Requires a Collider with "Is Trigger" checked on the GameObject
public class DamageZone : MonoBehaviour
{
    [SerializeField] private float damagePerSecond = 10f;

    private void OnTriggerStay(Collider other)
    {
        if (other.TryGetComponent<Health>(out var health))
            health.TakeDamage(damagePerSecond * Time.fixedDeltaTime);
    }
}
```

**Trigger callbacks require:**
- At least one of the two objects has a Rigidbody
- At least one collider has "Is Trigger" enabled
- Both layers must be enabled in the collision matrix

| Callback | When fired |
|---|---|
| OnTriggerEnter | First frame of overlap |
| OnTriggerStay | Every FixedUpdate while overlapping |
| OnTriggerExit | First frame after overlap ends |

---

## 4. Physics Layers and Collision Matrix

Use layers to control which objects can collide. This is the single most impactful
physics optimization.

**Setup:**
1. Define layers in Project Settings > Tags and Layers (up to 32 layers)
2. Configure collisions in Project Settings > Physics > Layer Collision Matrix
3. Uncheck every pair that should never interact

**Common layer setup:**

| Layer | Collides with |
|---|---|
| Player | Environment, Enemy, Pickup, Trigger |
| Enemy | Environment, Player, EnemyProjectile |
| PlayerBullet | Enemy, Environment |
| EnemyProjectile | Player, Environment |
| Trigger | Player only |
| UI | Nothing (raycasts only) |

```csharp
// Set layer in code
gameObject.layer = LayerMask.NameToLayer("PlayerBullet");

// Create layermask for raycasts
int mask = LayerMask.GetMask("Enemy", "Environment");
Physics.Raycast(ray, out hit, 100f, mask);
```

---

## 5. Joints

Joints constrain Rigidbody movement relative to another body or a point in space.

| Joint | Use for |
|---|---|
| Fixed Joint | Gluing objects together (breakable walls, attached items) |
| Hinge Joint | Doors, levers, rotating platforms |
| Spring Joint | Bouncy connections, suspension, grappling hooks |
| Configurable Joint | Custom constraints on any axis (ragdolls, vehicles) |
| Character Joint | Ragdoll limbs (limits on each rotation axis) |

```csharp
// Create a spring joint at runtime
var spring = gameObject.AddComponent<SpringJoint>();
spring.connectedBody = targetRigidbody;
spring.spring = 500f;        // stiffness
spring.damper = 50f;         // damping force
spring.maxDistance = 2f;     // rest length
spring.breakForce = 1000f;  // force to break the joint
```

**Ragdoll tip:** Use Unity's ragdoll wizard (GameObject > 3D Object > Ragdoll) for
initial setup, then tune joint limits and mass distribution manually. Set all limb
Rigidbodies to kinematic during animation, then enable physics on death.

---

## 6. Physics Materials

PhysicMaterial controls friction and bounciness on colliders.

| Property | Range | Effect |
|---|---|---|
| Dynamic Friction | 0-1 | Friction while moving |
| Static Friction | 0-1 | Friction to start moving |
| Bounciness | 0-1 | 0 = no bounce, 1 = full bounce |
| Friction Combine | Average/Min/Max/Multiply | How two materials combine |
| Bounce Combine | Average/Min/Max/Multiply | How two materials combine |

```csharp
// Create physics material in code
var material = new PhysicMaterial("Ice")
{
    dynamicFriction = 0.05f,
    staticFriction = 0.05f,
    bounciness = 0f,
    frictionCombine = PhysicMaterialCombine.Minimum
};
collider.material = material;
```

---

## 7. FixedUpdate vs Update for Physics

| Action | Where | Why |
|---|---|---|
| Rigidbody.MovePosition | FixedUpdate | Syncs with physics timestep |
| Rigidbody.AddForce | FixedUpdate | Force accumulates per physics step |
| Input polling | Update | Input is sampled per frame, not per physics tick |
| Camera follow | LateUpdate | After all movement is resolved |
| Raycast for aim | Update | Matches visual frame, not physics frame |

```csharp
// Common pattern: read input in Update, apply in FixedUpdate
private Vector2 _inputDir;

private void Update()
{
    _inputDir = new Vector2(Input.GetAxis("Horizontal"), Input.GetAxis("Vertical"));
}

private void FixedUpdate()
{
    _rb.AddForce(new Vector3(_inputDir.x, 0, _inputDir.y) * moveForce);
}
```

**Time.fixedDeltaTime** defaults to 0.02s (50Hz). Increase for performance-sensitive
games (0.03-0.04), decrease for physics-heavy simulations (0.01). Never set it below
0.005 - it multiplies CPU cost linearly.

---

## 8. 2D vs 3D Physics

Unity has two completely separate physics engines. They do not interact.

| Feature | 3D (PhysX) | 2D (Box2D) |
|---|---|---|
| Rigidbody | `Rigidbody` | `Rigidbody2D` |
| Collider | `BoxCollider`, `SphereCollider` | `BoxCollider2D`, `CircleCollider2D` |
| Raycast | `Physics.Raycast` | `Physics2D.Raycast` |
| Callbacks | `OnCollisionEnter(Collision)` | `OnCollisionEnter2D(Collision2D)` |
| Gravity | 3-axis | 2-axis (default Y only) |

Do not mix 2D and 3D physics components on the same GameObject. A Rigidbody2D
ignores a BoxCollider (3D) and vice versa.
