<!-- Part of the Super Simplify AbsolutelySkilled skill. Load this file when
     simplifying Go files. -->

# Go Simplification Guide

Deep opinions for simplifying Go code. These supplement the universal catalog --
apply both. When project conventions or existing patterns contradict anything
here, project conventions win. Go already has strong opinions via `gofmt` and
`go vet` -- do not fight them.

---

## Formatting and Naming

**Do not fight `gofmt`.** All formatting is handled by the tool. Never manually
adjust indentation, brace placement, or spacing in Go code.

**Naming conventions:**
- Exported: `PascalCase` (e.g., `CreateUser`, `HTTPClient`)
- Unexported: `camelCase` (e.g., `createUser`, `httpClient`)
- No underscores in Go names (except test functions `Test_something`)
- Acronyms are all caps: `HTTP`, `ID`, `URL` (not `Http`, `Id`, `Url`)
- Short names for short scopes: `i`, `n`, `r`, `w` are fine in loops and small functions
- Descriptive names for package-level and exported identifiers

---

## Error Handling

This is the most impactful area for Go simplification. Error handling patterns
make or break Go code readability.

### Always check errors
```go
// NEVER
_ = someFunc()

// ALWAYS
if err := someFunc(); err != nil {
    return fmt.Errorf("context: %w", err)
}
```

The only exception: deliberately ignoring errors where the docs say it's safe
(e.g., `fmt.Fprintf` to stdout in a CLI).

### Wrap with context using %w
```go
// Before
if err != nil {
    return err  // No context -- hard to debug
}

// After
if err != nil {
    return fmt.Errorf("failed to fetch user %s: %w", userID, err)
}
```

Every error return should add context about what operation failed and with
what input.

### Sentinel errors with errors.New
```go
// Define at package level for expected error conditions
var ErrNotFound = errors.New("user not found")
var ErrPermissionDenied = errors.New("permission denied")
```

### errors.Is / errors.As over string comparison
```go
// Before
if err.Error() == "not found" { ... }  // Fragile

// After
if errors.Is(err, ErrNotFound) { ... }  // Correct
```

### Reduce error handling boilerplate
When multiple operations share the same error handling pattern:
```go
// Before -- repetitive
data, err := fetchData(id)
if err != nil {
    return nil, fmt.Errorf("fetch: %w", err)
}
parsed, err := parseData(data)
if err != nil {
    return nil, fmt.Errorf("parse: %w", err)
}
result, err := processData(parsed)
if err != nil {
    return nil, fmt.Errorf("process: %w", err)
}

// This is fine in Go. Don't try to "simplify" it further.
// Go's explicit error handling is a feature, not boilerplate.
```

**Do NOT try to abstract away Go's error handling pattern.** It's intentional.

---

## Interface Design

### Small interfaces (1-3 methods)
The Go proverb: "The bigger the interface, the weaker the abstraction."

```go
// Good
type Reader interface {
    Read(p []byte) (n int, err error)
}

// Too big -- break it up or use concrete types
type UserService interface {
    Create(user User) error
    Update(id string, user User) error
    Delete(id string) error
    Get(id string) (User, error)
    List(filter Filter) ([]User, error)
    // ... and more
}
```

### Accept interfaces, return structs
```go
// Good -- accepts io.Reader (interface), returns concrete type
func ParseConfig(r io.Reader) (*Config, error) { ... }

// Avoid -- returning an interface hides the concrete type
func NewService() ServiceInterface { ... }
```

### Define interfaces at the consumer, not the provider
```go
// In the consumer package, define only what you need
type userGetter interface {
    GetUser(id string) (User, error)
}

// The handler only depends on what it uses
func NewHandler(users userGetter) *Handler { ... }
```

**When NOT to simplify interfaces:** Don't add interfaces where there's only
one implementation and no testing need. Interfaces for the sake of interfaces
add complexity.

---

## Struct Initialization

### Named fields in struct literals
```go
// Before (positional -- breaks when fields are added)
user := User{"Alice", "alice@example.com", true}

// After (named -- resilient to field additions)
user := User{
    Name:   "Alice",
    Email:  "alice@example.com",
    Active: true,
}
```

### Constructor functions for validation
```go
// When a struct has required fields or invariants
func NewUser(name, email string) (*User, error) {
    if name == "" {
        return nil, errors.New("name is required")
    }
    return &User{Name: name, Email: email, Active: true}, nil
}
```

---

## Slice and Map Patterns

### Pre-allocate when capacity is known
```go
// Before
var result []string
for _, item := range items {
    result = append(result, item.Name)
}

// After
result := make([]string, 0, len(items))
for _, item := range items {
    result = append(result, item.Name)
}
```

### Use slices/maps packages (Go 1.21+)
```go
// Before (manual clone)
clone := make([]string, len(original))
copy(clone, original)

// After
clone := slices.Clone(original)
```

Check `go.mod` for the Go version before using newer stdlib packages.

### Nil slice is fine as empty
```go
// Don't initialize to empty when nil works
var items []string           // nil -- fine for append, json, etc.
items := make([]string, 0)  // only needed when you specifically need non-nil
```

---

## Control Flow

### Early return to reduce nesting
```go
// Before
func process(data *Data) error {
    if data != nil {
        if data.IsValid() {
            // 20 lines of logic
            return nil
        } else {
            return errors.New("invalid data")
        }
    } else {
        return errors.New("nil data")
    }
}

// After
func process(data *Data) error {
    if data == nil {
        return errors.New("nil data")
    }
    if !data.IsValid() {
        return errors.New("invalid data")
    }
    // 20 lines of logic at base indentation
    return nil
}
```

### No else after return
```go
// Before
if err != nil {
    return err
} else {
    // happy path
}

// After
if err != nil {
    return err
}
// happy path (un-indented)
```

### Switch over long if/else chains
```go
// Before
if status == "active" {
    ...
} else if status == "pending" {
    ...
} else if status == "error" {
    ...
} else {
    ...
}

// After
switch status {
case "active":
    ...
case "pending":
    ...
case "error":
    ...
default:
    ...
}
```

---

## Goroutine and Channel Patterns

### Always ensure goroutines can exit
Use `select` with `ctx.Done()` or a done channel so goroutines don't leak.
```go
go func() {
    for {
        select {
        case item := <-ch:
            processItem(item)
        case <-ctx.Done():
            return
        }
    }
}()
```

### errgroup for concurrent operations that can fail
Use `errgroup.WithContext` for fan-out with error propagation. Use
`sync.WaitGroup` when errors don't matter.

---

## Table-Driven Tests

### Replace copy-paste test functions with table tests
```go
func TestParseSize(t *testing.T) {
    tests := []struct {
        name string; input string; want int64; wantErr bool
    }{
        {"bytes", "100B", 100, false},
        {"kilobytes", "1KB", 1024, false},
        {"invalid", "abc", 0, true},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := ParseSize(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("error = %v, wantErr %v", err, tt.wantErr)
            }
            if got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}
```

---

## Defer Patterns

### Use defer for cleanup
```go
f, err := os.Open(path)
if err != nil {
    return err
}
defer f.Close()
```

### Beware defer in loops
Defers accumulate in loops -- files stay open until the function returns.
Fix by extracting the loop body to a function so defer runs per iteration.
```go
// FIX: extract to function so defer runs per iteration
for _, path := range paths {
    if err := processFile(path); err != nil {
        log.Printf("skipping %s: %v", path, err)
    }
}
```

---

## Import Organization

**`goimports` handles this automatically.** If the project uses `goimports`
(most do), do not manually sort imports.

Manual sort order (if needed):
1. Standard library
2. Third-party packages
3. Internal packages

Separate groups with blank lines.

---

## Anti-Patterns to Avoid When Simplifying Go

| Do NOT do this | Why |
|---|---|
| Over-abstract with interfaces for one implementation | Premature abstraction. Use concrete types until you need polymorphism |
| Wrap errors without adding context | `fmt.Errorf(": %w", err)` with empty context is noise |
| Use `init()` for setup logic | Hard to test, hard to trace. Prefer explicit initialization |
| Replace clear if/else with clever bit manipulation | Readability matters more than cleverness in Go |
| Ignore the `_ = value` pattern without checking why | May be intentional (implementing an interface, side effect) |
| "Simplify" Go's explicit error handling into helpers | Go's error pattern is a feature. Don't abstract it away |
| Use named returns for "simplification" | Named returns are for documenting complex signatures, not for saving keystrokes |
| Convert all string concatenation to fmt.Sprintf | `+` is fine for simple cases. `fmt.Sprintf` is for formatted strings |
