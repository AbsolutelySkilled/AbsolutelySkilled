<!-- Part of the jest-vitest AbsolutelySkilled skill. Load this file when
     migrating a project from Jest to Vitest or comparing the two APIs. -->

# Jest to Vitest Migration Guide

Vitest is API-compatible with Jest for the vast majority of use cases. Most
projects can migrate in a few hours. The main work is replacing configuration,
swapping the import source for test utilities, and handling a handful of API
differences.

---

## Why migrate

| Factor | Jest | Vitest |
|---|---|---|
| Transform pipeline | Babel/ts-jest (separate config) | Reuses Vite config |
| Cold start (large suite) | 3-8 s | 0.3-1 s |
| Watch mode HMR | Full re-run of changed files | Module-level HMR |
| ESM support | Experimental, config-heavy | Native |
| TypeScript | Requires `ts-jest` or `babel-jest` | Built-in, zero config |
| Config file | `jest.config.js` | `vitest.config.ts` |

Migrate when: your project already uses Vite, you want faster feedback loops,
or you are tired of maintaining separate Babel/ts-jest config.

Do NOT migrate if: your project does not use Vite and you would need to add it
just for testing. The DX gains are smaller if you introduce a full build-tool
dependency only for tests.

---

## Step-by-step migration

### 1. Install Vitest

```bash
npm install -D vitest @vitest/coverage-v8
# If using jsdom (React, browser-like tests):
npm install -D jsdom
# If using happy-dom (lighter alternative):
npm install -D happy-dom
```

### 2. Replace jest.config with vitest.config.ts

```typescript
// vitest.config.ts  (replaces jest.config.js)
import { defineConfig } from 'vitest/config';
// If you already have a vite.config.ts, extend it instead:
// import { mergeConfig } from 'vitest/config';
// import viteConfig from './vite.config';

export default defineConfig({
  test: {
    globals: true,        // enable describe/it/expect globally (matches Jest default)
    environment: 'jsdom', // or 'node' or 'happy-dom'
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
    },
  },
});
```

If you have an existing `vite.config.ts`, merge rather than duplicate:

```typescript
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
}));
```

### 3. Update package.json scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 4. Update imports in test files

Jest injects `describe`, `it`, `expect`, etc. globally. Vitest does too when
`globals: true` is set. If you prefer explicit imports (recommended for IDE
support), add them:

```typescript
// Before (Jest - globals implicit)
describe('Cart', () => { ... });

// After option A - keep globals: true in config, no import needed
describe('Cart', () => { ... });

// After option B - explicit imports (preferred for type safety)
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
```

For automated codemod, use:

```bash
npx @vitest/codemod --type=jest-to-vitest src/**/*.test.ts
```

### 5. Replace Jest-specific globals with Vitest equivalents

| Jest | Vitest | Notes |
|---|---|---|
| `jest.fn()` | `vi.fn()` | Direct replacement |
| `jest.spyOn(obj, 'method')` | `vi.spyOn(obj, 'method')` | Direct replacement |
| `jest.mock('module')` | `vi.mock('module')` | Direct replacement |
| `jest.resetAllMocks()` | `vi.resetAllMocks()` | Direct replacement |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` | Direct replacement |
| `jest.restoreAllMocks()` | `vi.restoreAllMocks()` | Direct replacement |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` | Direct replacement |
| `jest.advanceTimersByTime(n)` | `vi.advanceTimersByTime(n)` | Direct replacement |
| `jest.runAllTimers()` | `vi.runAllTimers()` | Direct replacement |
| `jest.requireActual('m')` | `vi.importActual('m')` | Returns a Promise in Vitest |
| `jest.requireMock('m')` | `vi.importMock('m')` | Returns a Promise in Vitest |
| `jest.setTimeout(n)` | `{ timeout: n }` option on `it`/`describe` | Or `vi.setConfig({ testTimeout: n })` |

### 6. Handle `vi.importActual` - it's async

In Jest, `jest.requireActual` is synchronous. In Vitest, `vi.importActual` is
async and must be awaited inside a factory function:

```typescript
// Jest
jest.mock('./config', () => ({
  ...jest.requireActual('./config'),
  API_URL: 'http://localhost',
}));

// Vitest
vi.mock('./config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./config')>();
  return {
    ...actual,
    API_URL: 'http://localhost',
  };
});
```

### 7. Update snapshot files (optional)

Vitest uses the same `.snap` format as Jest. Existing snapshot files continue
to work without modification. If you want to regenerate them cleanly:

```bash
npx vitest run --updateSnapshot
```

---

## API differences and gotchas

### `vi.mock` hoisting

Both Jest and Vitest hoist `vi.mock` / `jest.mock` calls to the top of the
file before any imports. Vitest enforces this more strictly - if you try to
use a variable defined outside the `vi.mock` factory, you will get an error
unless the variable name starts with `mock`:

```typescript
// This fails in Vitest - "returnValue" is not accessible in hoisted scope
const returnValue = { id: 1 };
vi.mock('./service', () => ({ getUser: vi.fn(() => returnValue) }));

// Fix: prefix the variable with "mock"
const mockReturnValue = { id: 1 };
vi.mock('./service', () => ({ getUser: vi.fn(() => mockReturnValue) }));
```

### `expect.assertions` behavior

`expect.assertions(n)` works in Vitest. Prefer `await expect(p).rejects.toThrow()`
over `expect.assertions` for async error testing - it is more explicit.

### Module resolution

Vitest resolves modules through Vite's resolver. If your `tsconfig.json` has
path aliases (`@/*`), they work automatically in Vitest - no extra config
needed. In Jest, you need `moduleNameMapper`.

```typescript
// jest.config.js - required for aliases
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}

// vitest.config.ts - aliases from vite.config.ts are inherited automatically
// No extra config needed if vite.config.ts already has resolve.alias
```

### `testEnvironment` per file

Vitest supports per-file environment overrides via a docblock comment, which
is handy for mixed node/browser test suites:

```typescript
// @vitest-environment node
import { describe, it } from 'vitest';
// This file runs in Node even if the default environment is jsdom
```

### Timer mocks - `Date` and `performance.now`

```typescript
// Vitest fake timers also mock Date by default
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
expect(new Date().toISOString()).toBe('2024-01-15T10:00:00.000Z');
vi.useRealTimers();

// In Jest you need jest.setSystemTime separately
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-15T10:00:00Z'));
```

---

## Removing Jest after migration

Once all tests pass under Vitest:

```bash
npm uninstall jest @types/jest babel-jest ts-jest jest-environment-jsdom
# Remove jest.config.js
rm jest.config.js
# Remove babel.config.js if it was only used for Jest transforms
```

Check `package.json` for any lingering `"jest"` config keys and remove them.

---

## Common migration errors

| Error | Cause | Fix |
|---|---|---|
| `ReferenceError: vi is not defined` | `globals: true` not set and no import | Add `import { vi } from 'vitest'` or set `globals: true` |
| `Cannot use import statement` | ESM module not transformed | Add the package to `server.deps.inline` in vitest config |
| `vi.mock() variable out of scope` | Variable not prefixed with `mock` | Rename variable to `mockXxx` |
| `Cannot find module './setup'` | Wrong path in `setupFiles` | Use path relative to project root, not the config file |
| Snapshot mismatch on first run | Snapshots from Jest are stale | Run `npx vitest run --updateSnapshot` |
| `TypeError: Cannot read properties of undefined` | `vi.resetAllMocks()` not called between tests | Add `afterEach(() => vi.resetAllMocks())` or `clearMocks: true` in config |
