<!-- Part of the Super Simplify AbsolutelySkilled skill. Load this file when
     simplifying Python files. -->

# Python Simplification Guide

Deep opinions for simplifying Python code. These supplement the universal
catalog -- apply both. When project config (pyproject.toml, ruff.toml, CLAUDE.md)
contradicts anything here, project config wins.

---

## PEP 8 Essentials

Beyond what linters catch, enforce these consistently:

- `snake_case` for functions, methods, and variables
- `PascalCase` for classes
- `UPPER_SNAKE_CASE` for module-level constants
- 4-space indentation (never tabs)
- Blank lines: 2 between top-level definitions, 1 between methods
- Max line length: follow project config (usually 88 for Black, 79 for PEP 8)

**Note:** If the project uses Black or Ruff with formatting, do not manually
fix formatting -- the tool handles it.

---

## Type Hints

**Add type hints to function signatures if the project already uses them.**
Check existing files first -- if the project has zero type hints, don't
introduce them (that's a separate initiative, not a simplification).

### Modern syntax (Python 3.10+)
```python
# Before
from typing import Optional, Union, List

def process(items: List[str], timeout: Optional[int] = None) -> Union[str, None]:
    ...

# After (if project targets 3.10+)
def process(items: list[str], timeout: int | None = None) -> str | None:
    ...
```

Check `pyproject.toml` for `requires-python` or `python_requires` to verify
the target version before using modern syntax.

### Return type hints on public functions
```python
# Prefer
def get_user(user_id: str) -> User | None:
    ...

# Avoid (missing return type on public function)
def get_user(user_id: str):
    ...
```

Internal helpers can rely on inference if the return is obvious.

---

## Data Structures

### Dataclasses over plain dicts for structured data
```python
# Before
user = {"name": "Alice", "email": "alice@example.com", "role": "admin"}
print(user["name"])  # No autocomplete, no type checking

# After
@dataclass
class User:
    name: str
    email: str
    role: str

user = User(name="Alice", email="alice@example.com", role="admin")
print(user.name)  # Autocomplete, type checked
```

**When NOT to convert:** Dicts that are ephemeral (built and consumed in the
same function), come from JSON/API responses and are passed through without
field access, or have dynamic keys.

### NamedTuple for multi-value returns
```python
# Before
def get_bounds(data):
    return min(data), max(data)

lo, hi = get_bounds(data)  # Which is which? Reader has to check

# After
from typing import NamedTuple

class Bounds(NamedTuple):
    lower: float
    upper: float

def get_bounds(data: list[float]) -> Bounds:
    return Bounds(lower=min(data), upper=max(data))

bounds = get_bounds(data)
print(bounds.lower, bounds.upper)  # Self-documenting
```

### TypedDict for dict schemas from external APIs
```python
from typing import TypedDict

class APIResponse(TypedDict):
    status: str
    data: list[dict]
    pagination: dict
```

---

## Context Managers

### Replace try/finally with `with`
```python
# Before
f = open("data.txt")
try:
    content = f.read()
finally:
    f.close()

# After
with open("data.txt") as f:
    content = f.read()
```

Applies to: file handles, database connections, locks, temporary directories,
HTTP sessions, and any resource with a context manager.

---

## Comprehensions

### Use when the transformation is simple
```python
# Before
squares = []
for x in range(10):
    squares.append(x ** 2)

# After
squares = [x ** 2 for x in range(10)]
```

### NEVER nest comprehensions
```python
# NEVER do this
result = [process(x) for group in data for x in group if x.valid]

# Instead, use a function or explicit loop
def process_valid(data):
    results = []
    for group in data:
        for x in group:
            if x.valid:
                results.append(process(x))
    return results
```

### Dict/set comprehensions where appropriate
```python
# Dict comprehension
name_to_id = {user.name: user.id for user in users}

# Set comprehension
unique_tags = {tag for item in items for tag in item.tags}
```

---

## Path Handling

### `pathlib.Path` over `os.path`
```python
# Before
import os
path = os.path.join(base_dir, "data", "output.csv")
if os.path.exists(path):
    with open(path) as f:
        ...

# After
from pathlib import Path
path = Path(base_dir) / "data" / "output.csv"
if path.exists():
    content = path.read_text()
```

**When NOT to convert:** If the project consistently uses `os.path` everywhere
and has no `pathlib` usage, converting one file creates inconsistency. Either
convert a coherent set of files or leave it.

---

## String Formatting

### f-strings over .format() and %
```python
# Before
msg = "Hello {}, you have {} items".format(name, count)
msg = "Hello %s, you have %d items" % (name, count)

# After
msg = f"Hello {name}, you have {count} items"
```

### Multi-line f-strings
```python
# Prefer parenthesized strings
msg = (
    f"User {user.name} (ID: {user.id}) "
    f"has {len(user.items)} items in their cart"
)
```

---

## Conditional Simplification

### Guard clauses
```python
# Before
def process(data):
    if data is not None:
        if data.is_valid():
            # 20 lines of logic
            return result
        else:
            raise ValueError("Invalid data")
    else:
        raise ValueError("No data")

# After
def process(data):
    if data is None:
        raise ValueError("No data")
    if not data.is_valid():
        raise ValueError("Invalid data")

    # 20 lines of logic at base indentation
    return result
```

### `any()` / `all()` over loop-and-flag
```python
# Before
has_admin = False
for user in users:
    if user.role == "admin":
        has_admin = True
        break

# After
has_admin = any(user.role == "admin" for user in users)
```

### Ternary for simple value assignment
```python
# Good -- simple, clear
label = "Active" if user.is_active else "Inactive"

# Bad -- too complex for ternary, use if/else
result = process_a(x) if condition_a else process_b(x) if condition_b else default
```

---

## Import Organization

**Sort order:**
1. Standard library (`os`, `sys`, `pathlib`)
2. Third-party packages (`django`, `requests`, `pytest`)
3. Local/project imports (`from myapp.models import User`)

Separate groups with blank lines. Remove unused imports.

**Note:** If the project uses `isort` or Ruff's import sorting, skip manual
sorting -- the tool handles it.

### `from x import y` vs `import x`
Use `from x import y` when accessing a single name repeatedly:
```python
# Prefer (when using Path many times)
from pathlib import Path

# Prefer (when using os for multiple things)
import os
```

---

## Error Handling

### Catch specific exceptions
```python
# Before
try:
    result = process(data)
except:  # Catches EVERYTHING including KeyboardInterrupt
    log.error("Failed")

# After
try:
    result = process(data)
except (ValueError, TypeError) as e:
    log.error(f"Processing failed: {e}")
```

### Exception chaining with `from`
```python
# Before
try:
    user = db.get_user(id)
except DatabaseError:
    raise ServiceError("Could not fetch user")  # Original traceback lost

# After
try:
    user = db.get_user(id)
except DatabaseError as e:
    raise ServiceError("Could not fetch user") from e  # Preserves chain
```

### Include context in error messages
```python
# Before
raise ValueError("Invalid ID")

# After
raise ValueError(f"Invalid user ID: {user_id!r}")
```

---

## Anti-Patterns to Avoid When Simplifying Python

| Do NOT do this | Why |
|---|---|
| Convert all loops to comprehensions | Nested comprehensions are unreadable. Complex logic belongs in loops |
| Add type hints to a project that has none | That's a separate initiative, not a simplification |
| Replace all dicts with dataclasses | Ephemeral/pass-through dicts don't benefit from dataclasses |
| Convert os.path to pathlib in one file of a pure-os.path project | Creates inconsistency. Convert a coherent set or leave it |
| Use walrus operator `:=` everywhere it technically works | Only use when it genuinely reduces a repeated expression |
| Replace explicit loops with `map()`/`filter()` with lambdas | List comprehensions are more Pythonic. `map(lambda ...)` is worse |
| Remove `# type: ignore` comments without understanding why they exist | They often suppress known issues with third-party type stubs |
| Convert `except Exception` to bare `except:` | Bare except catches `SystemExit` and `KeyboardInterrupt` |
