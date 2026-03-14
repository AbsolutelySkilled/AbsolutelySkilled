<!-- Part of the API Testing AbsolutelySkilled skill. Load this file when setting up MSW for Node.js or browser environments, configuring test servers, writing handler patterns, or troubleshooting MSW intercept behavior. -->

# MSW Patterns Reference

Opinionated setup and handler recipes for Mock Service Worker (MSW v2+).
MSW intercepts at the network layer - not the module layer - which means your
tests exercise the real fetch/axios/got code path and break only when behavior
changes, not when you refactor internal function signatures.

---

## 1. Installation and initial setup

```bash
npm install msw --save-dev
```

MSW v2 ships with separate entry points for Node.js and browser environments.
Do not mix them.

| Environment | Import from | Use in |
|---|---|---|
| Node.js (Jest, Vitest) | `msw/node` | API integration tests, unit tests with fetch |
| Browser (Storybook, Playwright) | `msw/browser` | Component tests, visual testing |

---

## 2. Node.js test server setup

Create the server once per test file (or in a global setup) and configure
lifecycle hooks in the test framework's global setup file.

```typescript
// tests/msw/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// tests/setup.ts (referenced in jest.config.ts setupFilesAfterEach)
import { server } from './msw/server';

// Start the server before all tests in the file
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset per-test overrides so tests don't bleed into each other
afterEach(() => server.resetHandlers());

// Stop cleanly after all tests
afterAll(() => server.close());
```

**`onUnhandledRequest: 'error'`** is the right default. It forces you to declare
every network call your code makes. If an unregistered URL is hit, the test
throws immediately rather than silently returning `undefined`.

---

## 3. Defining handlers

### REST handlers

```typescript
// tests/msw/handlers.ts
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // GET - return JSON
  http.get('https://api.example.com/users/:id', ({ params }) => {
    const { id } = params;
    if (id === 'missing') {
      return HttpResponse.json(
        { type: 'not-found', title: 'User not found', status: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      id,
      email: `user-${id}@example.com`,
      role: 'user',
      createdAt: '2024-01-15T09:30:00Z',
    });
  }),

  // POST - read request body
  http.post('https://api.example.com/users', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      { id: 'new-user-1', ...body, createdAt: new Date().toISOString() },
      { status: 201 }
    );
  }),

  // PATCH - partial update
  http.patch('https://api.example.com/users/:id', async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: params.id, ...body });
  }),

  // DELETE - no body
  http.delete('https://api.example.com/users/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
```

### GraphQL handlers

```typescript
import { graphql, HttpResponse } from 'msw';

export const graphqlHandlers = [
  graphql.query('GetUser', ({ variables }) => {
    if (variables.id === 'missing') {
      return HttpResponse.json({ data: { user: null } });
    }
    return HttpResponse.json({
      data: {
        user: {
          id: variables.id,
          email: `user-${variables.id}@example.com`,
          __typename: 'User',
        },
      },
    });
  }),

  graphql.mutation('CreateOrder', ({ variables }) => {
    return HttpResponse.json({
      data: {
        createOrder: { id: 'order-new', ...variables.input, __typename: 'Order' },
      },
    });
  }),
];
```

---

## 4. Per-test handler overrides

Override handlers for a single test without affecting other tests. MSW applies
`server.use()` additions on top of existing handlers - the last matching handler wins.
`server.resetHandlers()` in `afterEach` removes all per-test additions.

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '../msw/server';

describe('Error handling', () => {
  it('shows an error message when the API returns 500', async () => {
    server.use(
      http.get('https://api.example.com/users/1', () =>
        HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
      )
    );

    // test code - this request will get the 500 response
  });

  it('handles rate limiting gracefully', async () => {
    server.use(
      http.get('https://api.example.com/products', () =>
        new HttpResponse(null, {
          status: 429,
          headers: { 'Retry-After': '30' },
        })
      )
    );

    // test code - this request will get the 429 response
  });
});
```

---

## 5. Simulating network conditions

```typescript
import { http, HttpResponse, delay } from 'msw';

// Simulate slow network
http.get('https://api.example.com/slow-endpoint', async () => {
  await delay(2000); // 2-second delay
  return HttpResponse.json({ data: 'finally' });
});

// Simulate network error (connection refused, DNS failure)
http.get('https://api.example.com/unreachable', () => {
  return HttpResponse.error();
});

// Simulate intermittent failure with a counter
let callCount = 0;
http.post('https://api.example.com/flaky', () => {
  callCount++;
  if (callCount % 2 !== 0) {
    return HttpResponse.json({ message: 'Service unavailable' }, { status: 503 });
  }
  return HttpResponse.json({ ok: true });
});
```

---

## 6. Asserting on requests

MSW does not have built-in request assertion utilities (it is a mock server,
not a spy library). Use a closure or a captured variable to inspect what was sent.

```typescript
it('sends the correct payload when creating an order', async () => {
  let capturedRequest: Request | undefined;

  server.use(
    http.post('https://api.example.com/orders', async ({ request }) => {
      capturedRequest = request.clone();
      return HttpResponse.json({ id: 'order-1' }, { status: 201 });
    })
  );

  await createOrder({ productId: 'p1', quantity: 2 });

  expect(capturedRequest).toBeDefined();
  const body = await capturedRequest!.json();
  expect(body).toMatchObject({ productId: 'p1', quantity: 2 });
});
```

---

## 7. Browser / Storybook setup

For browser environments (Playwright, Cypress component tests, Storybook):

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// src/main.ts (development only)
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'warn' });
}
```

Generate the service worker file once and commit it:

```bash
npx msw init public/ --save
```

---

## 8. Common mistakes and fixes

| Mistake | Symptom | Fix |
|---|---|---|
| Not calling `server.resetHandlers()` in `afterEach` | Per-test overrides leak into later tests | Add `afterEach(() => server.resetHandlers())` in global setup |
| Using `onUnhandledRequest: 'warn'` in tests | Unregistered calls silently return `undefined`, test passes with wrong data | Use `'error'` in test environments |
| Forgetting `await delay()` is async | Delay is skipped, no actual pause | `async () => { await delay(ms); return response; }` |
| Mixing `msw/node` and `msw/browser` imports | Runtime errors or service worker not found | Node tests use `setupServer` from `msw/node` only |
| Hardcoding base URLs differently in handlers and app code | Handlers never match, `onUnhandledRequest: 'error'` throws | Extract base URL to an env variable used by both |
