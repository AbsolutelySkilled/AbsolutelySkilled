<!-- Part of the Unity Development AbsolutelySkilled skill. Load this file when working with advanced C# patterns in Unity - object pooling, state machines, dependency injection, or async/await. -->

# C# Patterns for Unity

---

## 1. Object Pooling

Instantiate/Destroy cycles cause GC pressure. Pool frequently spawned objects
(bullets, particles, enemies) and recycle them.

```csharp
public class ObjectPool<T> where T : MonoBehaviour
{
    private readonly Queue<T> _pool = new();
    private readonly T _prefab;
    private readonly Transform _parent;

    public ObjectPool(T prefab, int initialSize, Transform parent = null)
    {
        _prefab = prefab;
        _parent = parent;
        for (int i = 0; i < initialSize; i++)
            _pool.Enqueue(CreateInstance());
    }

    private T CreateInstance()
    {
        T obj = Object.Instantiate(_prefab, _parent);
        obj.gameObject.SetActive(false);
        return obj;
    }

    public T Get()
    {
        T obj = _pool.Count > 0 ? _pool.Dequeue() : CreateInstance();
        obj.gameObject.SetActive(true);
        return obj;
    }

    public void Return(T obj)
    {
        obj.gameObject.SetActive(false);
        _pool.Enqueue(obj);
    }
}
```

Unity 2021+ provides `UnityEngine.Pool.ObjectPool<T>` as a built-in alternative.
Prefer the built-in version for new projects.

---

## 2. State Machine Pattern

Use for player controllers, AI behavior, and UI flow. Avoid deeply nested
if/else chains in Update.

```csharp
public interface IState
{
    void Enter();
    void Execute();  // called each frame
    void Exit();
}

public class StateMachine
{
    private IState _current;

    public void ChangeState(IState newState)
    {
        _current?.Exit();
        _current = newState;
        _current.Enter();
    }

    public void Update() => _current?.Execute();
}

// Usage
public class IdleState : IState
{
    private readonly PlayerController _player;
    public IdleState(PlayerController player) => _player = player;

    public void Enter() => _player.Animator.Play("Idle");
    public void Execute()
    {
        if (_player.MoveInput.sqrMagnitude > 0.01f)
            _player.StateMachine.ChangeState(_player.RunState);
    }
    public void Exit() { }
}
```

For complex AI with many transitions, consider Unity's built-in Animator as a
state machine or a dedicated library like NodeCanvas or Behavior Designer.

---

## 3. Event-Driven Communication

Decouple systems using ScriptableObject-based event channels instead of direct
references or singletons.

```csharp
[CreateAssetMenu(menuName = "Events/Void Event Channel")]
public class VoidEventChannel : ScriptableObject
{
    private readonly HashSet<Action> _listeners = new();

    public void Register(Action listener) => _listeners.Add(listener);
    public void Unregister(Action listener) => _listeners.Remove(listener);

    public void Raise()
    {
        foreach (var listener in _listeners)
            listener?.Invoke();
    }
}

// Generic version for typed events
[CreateAssetMenu(menuName = "Events/Int Event Channel")]
public class IntEventChannel : ScriptableObject
{
    private readonly HashSet<Action<int>> _listeners = new();

    public void Register(Action<int> listener) => _listeners.Add(listener);
    public void Unregister(Action<int> listener) => _listeners.Remove(listener);

    public void Raise(int value)
    {
        foreach (var listener in _listeners)
            listener?.Invoke(value);
    }
}
```

Wire these in the Inspector - drag the same ScriptableObject asset into both the
publisher and subscriber. No compile-time coupling between systems.

---

## 4. Async/Await in Unity

UniTask is the recommended library for async/await in Unity. It avoids the
`Task` allocations and integrates with Unity's player loop.

```csharp
using Cysharp.Threading.Tasks;

public class AsyncExample : MonoBehaviour
{
    private async UniTaskVoid Start()
    {
        // Wait for 2 seconds without coroutine allocation
        await UniTask.Delay(TimeSpan.FromSeconds(2));

        // Await a web request
        var request = UnityWebRequest.Get("https://api.example.com/data");
        await request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
            Debug.Log(request.downloadHandler.text);
    }

    // Cancel on destroy to prevent accessing destroyed objects
    private CancellationTokenSource _cts;
    private void OnEnable() => _cts = new CancellationTokenSource();
    private void OnDisable() => _cts?.Cancel();

    private async UniTask FadeOut(CanvasGroup group)
    {
        while (group.alpha > 0)
        {
            group.alpha -= Time.deltaTime;
            await UniTask.Yield(_cts.Token);
        }
    }
}
```

Always pass a CancellationToken tied to the MonoBehaviour's lifetime. Without it,
async operations continue after the object is destroyed, causing NullReferenceExceptions.

---

## 5. Dependency Injection (Lightweight)

For small-to-mid projects, constructor injection via a simple service locator
avoids the weight of full DI frameworks.

```csharp
public static class ServiceLocator
{
    private static readonly Dictionary<Type, object> _services = new();

    public static void Register<T>(T service) => _services[typeof(T)] = service;
    public static T Get<T>() => (T)_services[typeof(T)];
    public static void Clear() => _services.Clear();
}
```

For large projects, use VContainer (lightweight, Unity-native) or Zenject (feature-rich).
Both support scene-scoped lifetimes and constructor injection for MonoBehaviours.

---

## 6. Coroutine vs Update vs InvokeRepeating

| Pattern | Use when | Avoid when |
|---|---|---|
| Coroutine (`IEnumerator`) | One-shot sequences, timed delays, animations | Tight loops needing cancellation control |
| Update + timer float | Continuous per-frame logic, countdown timers | Simple delays (use coroutine instead) |
| InvokeRepeating | Fixed-interval polling, heartbeats | Need to pass parameters or cancel precisely |
| UniTask async | Web requests, file I/O, complex async flows | Very simple delays in non-critical code |

```csharp
// Coroutine approach
private IEnumerator SpawnWave(int count, float interval)
{
    for (int i = 0; i < count; i++)
    {
        SpawnEnemy();
        yield return new WaitForSeconds(interval);
    }
}
```

Cache `WaitForSeconds` objects if reusing the same delay value. Each `new WaitForSeconds`
allocates on the heap.

---

## 7. Serialization Gotchas

Unity's serializer has specific rules that trip up experienced C# developers:

- `private` fields are NOT serialized unless marked `[SerializeField]`
- `public` fields ARE serialized (even if you don't want them in the Inspector)
- `static`, `const`, `readonly` fields are never serialized
- Properties are never serialized
- Dictionaries are not serialized - use two parallel lists or a custom serializable wrapper
- Interfaces and abstract types need `[SerializeReference]` attribute (Unity 2019.3+)
- Polymorphic serialization requires `[SerializeReference]` on the field

```csharp
[Serializable]
public class DialogueLine
{
    [SerializeField] private string speaker;
    [SerializeField] private string text;
    [SerializeField, TextArea] private string longText;
}

public class DialogueSystem : MonoBehaviour
{
    // This works - serialized as a list of the concrete type
    [SerializeField] private List<DialogueLine> lines;

    // This requires [SerializeReference] for polymorphism
    [SerializeReference] private List<IDialogueNode> nodes;
}
```
