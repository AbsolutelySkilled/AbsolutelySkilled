<!-- Part of the Vite+ AbsolutelySkilled skill. Load this file when
     working with vite.config.ts configuration blocks. -->

# Vite+ Configuration Reference

All configuration lives in `vite.config.ts` using `defineConfig` from `vite-plus`.
Do not create separate config files for integrated tools.

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  // Standard Vite sections (unchanged from Vite docs)
  server: {},
  build: {},
  preview: {},

  // Vite+ extensions (documented below)
  lint: {},
  fmt: {},
  test: {},
  run: {},
  pack: {},
  staged: {},
});
```

---

## lint (Oxlint)

```typescript
lint: {
  ignorePatterns: ['dist/**'],       // Glob patterns to exclude
  options: {
    typeAware: true,                 // Enable type-aware rules
    typeCheck: true,                 // Enable full type checking via tsgolint
  },
  rules: {
    'no-console': ['error', { allow: ['error'] }],
  },
}
```

- `ignorePatterns` - `string[]` - file patterns excluded from linting
- `options.typeAware` - `boolean` - activates rules requiring TypeScript type info
- `options.typeCheck` - `boolean` - runs full type checking during linting
- `rules` - `Record<string, RuleConfig>` - ESLint-compatible rule overrides

Both `typeAware` and `typeCheck` are enabled by default in `vp create` and
`vp migrate` projects. Keep them enabled for the full type-aware path in
`vp lint` and `vp check`.

Oxlint supports 600+ ESLint-compatible rules. For the full rule list, see the
Oxlint documentation.

---

## fmt (Oxfmt)

```typescript
fmt: {
  ignorePatterns: ['dist/**'],
  singleQuote: true,
  semi: true,
  experimentalSortPackageJson: true,
}
```

- `ignorePatterns` - `string[]` - file patterns excluded from formatting
- `singleQuote` - `boolean` - use single quotes instead of double
- `semi` - `boolean` - enforce semicolons
- `experimentalSortPackageJson` - `boolean` - sort package.json keys

Oxfmt has full Prettier compatibility. For the complete options list, see the
Oxfmt documentation. Point editor formatter config to `./vite.config.ts` for
consistent format-on-save.

---

## test (Vitest)

```typescript
test: {
  include: ['src/**/*.test.ts'],
  coverage: {
    reporter: ['text', 'html'],
  },
}
```

Accepts all Vitest configuration options. Key difference: `vp test` defaults to
single-run mode (not watch). Use `vp test watch` for watch mode.

For the complete configuration reference, see the Vitest docs.

---

## run (Vite Task)

### Top-level options

```typescript
run: {
  enablePrePostScripts: true,    // Run preX/postX lifecycle hooks (workspace root only)
  cache: {                       // Default: { scripts: false, tasks: true }
    scripts: false,
    tasks: true,
  },
  tasks: { /* see below */ },
}
```

### Task definitions

```typescript
run: {
  tasks: {
    ci: {
      command: 'vp check && vp test && vp build',
      dependsOn: [],              // Prerequisite tasks. Cross-package: "pkg#task"
      cache: true,                // Cache task output (default: true)
      env: ['CI', 'NODE_ENV'],    // Env vars in cache fingerprint. Supports wildcards: 'VITE_*'
      untrackedEnv: [],           // Env vars passed but excluded from cache key
      input: [{ auto: true }],    // File tracking. Array of globs or { auto: boolean }
      cwd: '.',                   // Working directory relative to package root
    },
  },
}
```

Commands with `&&` are auto-split into independently cached sub-tasks.

---

## pack (tsdown)

```typescript
pack: {
  dts: true,                     // Generate TypeScript declarations
  format: ['esm', 'cjs'],       // Output formats
  sourcemap: true,               // Generate source maps
  // exe: true                   // Build standalone executable
}
```

Accepts all tsdown configuration options. Do not use `tsdown.config.ts` with
Vite+ - configure everything in the `pack` block.

---

## staged (pre-commit checks)

```typescript
staged: {
  '*.{js,ts,tsx,vue,svelte}': 'vp check --fix',
}
```

Maps file glob patterns to commands that run on staged files before commit.
Used by `vp staged` for pre-commit hooks. Enable hooks during project creation
with `vp create --hooks`.
