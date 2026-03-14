<!-- Part of the Vite+ AbsolutelySkilled skill. Load this file when
     working with vp run, monorepo tasks, or task caching. -->

# Vite+ Task Runner (Vite Task)

`vp run` executes `package.json` scripts and tasks defined in `vite.config.ts`.
It provides built-in caching, dependency ordering, and workspace-aware execution.

---

## Basic usage

```bash
vp run <script>           # Run a package.json script
vp run <task>             # Run a vite.config.ts task
vp run build -v           # Verbose output with cache stats
vp run --last-details     # View previous run's summary
```

---

## Caching behavior

| Source | Default caching |
|---|---|
| `package.json` scripts | Not cached (use `--cache` to enable) |
| `vite.config.ts` tasks | Cached by default |

The cache system tracks file modifications and replays cached output when
inputs haven't changed. Commands with `&&` are auto-split into independently
cached sub-tasks.

### Cache configuration

```typescript
run: {
  cache: {
    scripts: false,    // Cache package.json scripts
    tasks: true,       // Cache vite.config.ts tasks
  },
}
```

Or use a boolean to set both: `cache: true`.

### Per-task cache control

```typescript
run: {
  tasks: {
    build: {
      command: 'vp build',
      cache: true,
      env: ['NODE_ENV', 'VITE_*'],    // Include in cache fingerprint
      untrackedEnv: ['HOME'],          // Pass but exclude from fingerprint
      input: [{ auto: true }],         // File tracking (auto-detect by default)
    },
    dev: {
      command: 'vp dev',
      cache: false,                    // Don't cache dev servers
    },
  },
}
```

---

## Monorepo execution

### Flags

| Flag | Purpose |
|---|---|
| `-r` | Run across all workspace packages in dependency order |
| `-t` | Run in target package + all its dependencies |
| `--filter <pattern>` | Select packages by name, directory, or glob (pnpm syntax) |
| `-w` | Target workspace root package |
| `--cache` | Enable caching for package.json scripts |
| `-v` | Verbose output with cache hit rates and timing |

### Examples

```bash
# Build all packages in dependency order
vp run build -r

# Build one package and its dependencies
vp run build -t --filter my-app

# Run tests only in packages matching a glob
vp run test --filter "packages/*"

# Target workspace root
vp run lint -w
```

### Dependency ordering

Package execution order derives from standard `package.json` dependency
declarations (`dependencies`, `devDependencies`), not task-runner-specific
dependency graphs. Cross-package task dependencies use the `dependsOn` field
with `"package#task"` syntax.

---

## Task definitions

```typescript
run: {
  tasks: {
    ci: {
      command: 'vp check && vp test && vp build',
      dependsOn: ['lint'],              // Must complete first
      cache: true,
      env: ['CI'],
    },
    lint: {
      command: 'vp lint',
      cache: true,
    },
  },
}
```

### Nested vp run

When a command contains `vp run`, Vite Task inlines it as a separate task
rather than spawning a nested process. This keeps output flat and enables
independent caching for each sub-task.

---

## Lifecycle scripts

```typescript
run: {
  enablePrePostScripts: true,   // Default: true, workspace root only
}
```

When enabled, running `vp run build` will automatically run `prebuild` and
`postbuild` scripts from `package.json` if they exist.

---

## Pass-through arguments

Arguments following the task name are forwarded to the underlying command:

```bash
vp run test -- --coverage --reporter=verbose
```
