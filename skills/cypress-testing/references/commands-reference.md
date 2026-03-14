<!-- Part of the cypress-testing AbsolutelySkilled skill. Load this file when
     you need a detailed reference of Cypress commands and their usage. -->

# Cypress Commands Reference

Quick reference for the most-used Cypress commands with practical examples.

---

## Navigation

```typescript
cy.visit('/path')                          // Visit a relative URL (uses baseUrl from config)
cy.visit('https://example.com')            // Visit an absolute URL
cy.visit('/checkout', { timeout: 10000 }) // Custom timeout for slow pages
cy.reload()                                // Reload the current page
cy.go('back')                              // Browser back
cy.go('forward')                           // Browser forward
cy.url().should('include', '/dashboard')   // Assert current URL
cy.title().should('eq', 'My App')          // Assert page title
```

---

## Querying

```typescript
// Preferred: always use data-testid
cy.get('[data-testid="submit-btn"]')
cy.get('[data-testid="user-list"] [data-testid="user-card"]') // nested

// By text content
cy.contains('Submit')                      // first element with text
cy.contains('button', 'Submit')            // scoped to tag
cy.contains('[data-testid="nav"]', 'Home') // scoped to selector

// Scoped queries - search within a subject
cy.get('[data-testid="user-card"]').within(() => {
  cy.get('[data-testid="user-name"]').should('contain', 'Alice');
  cy.get('[data-testid="user-role"]').should('contain', 'Admin');
});

// Index-based access (use sparingly)
cy.get('[data-testid="product-card"]').eq(0).should('contain', 'Widget');
cy.get('[data-testid="product-card"]').first();
cy.get('[data-testid="product-card"]').last();

// Find within a subject
cy.get('[data-testid="form"]').find('input').should('have.length', 3);
```

---

## Assertions

```typescript
// Visibility
cy.get('[data-testid="modal"]').should('be.visible');
cy.get('[data-testid="spinner"]').should('not.exist');
cy.get('[data-testid="error"]').should('exist');

// Text
cy.get('[data-testid="title"]').should('have.text', 'Welcome');
cy.get('[data-testid="message"]').should('contain', 'success');

// Attributes and state
cy.get('input[type="email"]').should('have.value', 'user@example.com');
cy.get('[data-testid="submit"]').should('be.disabled');
cy.get('[data-testid="checkbox"]').should('be.checked');
cy.get('[data-testid="link"]').should('have.attr', 'href', '/about');
cy.get('[data-testid="card"]').should('have.class', 'active');

// Count
cy.get('[data-testid="item"]').should('have.length', 5);
cy.get('[data-testid="item"]').should('have.length.greaterThan', 0);

// Chained: multiple assertions on one subject
cy.get('[data-testid="alert"]')
  .should('be.visible')
  .and('have.class', 'alert-error')
  .and('contain', 'Something went wrong');
```

---

## Interactions

```typescript
// Click
cy.get('[data-testid="btn"]').click();
cy.get('[data-testid="btn"]').click({ force: true }); // bypass visibility check

// Typing
cy.get('[data-testid="email"]').type('user@example.com');
cy.get('[data-testid="search"]').type('query{enter}');   // special keys
cy.get('[data-testid="email"]').clear().type('new@example.com');

// Select dropdown
cy.get('[data-testid="role-select"]').select('admin');
cy.get('[data-testid="role-select"]').select(1); // by index

// Checkboxes and radios
cy.get('[data-testid="agree"]').check();
cy.get('[data-testid="agree"]').uncheck();
cy.get('[data-testid="plan-pro"]').check();

// File upload
cy.get('[data-testid="upload"]').selectFile('cypress/fixtures/avatar.png');

// Keyboard shortcuts
cy.get('[data-testid="editor"]').type('{ctrl+a}{del}');
cy.get('body').type('{esc}');

// Hover (triggers CSS :hover)
cy.get('[data-testid="menu-trigger"]').trigger('mouseover');
cy.get('[data-testid="tooltip-target"]').trigger('mouseenter');

// Focus and blur
cy.get('[data-testid="input"]').focus().blur();
```

---

## Network interception

```typescript
// Observe (no stub) - still creates a waitable alias
cy.intercept('GET', '/api/users').as('getUsers');
cy.visit('/users');
cy.wait('@getUsers');

// Stub with inline body
cy.intercept('GET', '/api/users', {
  statusCode: 200,
  body: [{ id: 1, name: 'Alice' }],
}).as('getUsers');

// Stub with fixture file
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');

// Stub with delay to test loading states
cy.intercept('GET', '/api/users', {
  delay: 1000,
  fixture: 'users.json',
}).as('getUsers');

// Stub error states
cy.intercept('POST', '/api/orders', { statusCode: 500, body: { error: 'Server error' } }).as('createOrder');

// Pattern matching with wildcards
cy.intercept('GET', '/api/users/*').as('getUser');
cy.intercept('GET', '/api/products?*').as('getProducts'); // query params

// Inspect the request after it fires
cy.wait('@getUsers').then((interception) => {
  expect(interception.request.headers).to.have.property('authorization');
  expect(interception.response?.statusCode).to.eq(200);
});

// Wait on multiple requests
cy.wait(['@getUsers', '@getSettings']);
```

---

## Aliases

```typescript
// Alias a DOM element (re-queries on use to avoid stale references)
cy.get('[data-testid="submit"]').as('submitBtn');
cy.get('@submitBtn').click();

// Alias a route (see intercept examples above)
cy.intercept('GET', '/api/data').as('getData');
cy.wait('@getData');

// Alias a fixture value
cy.fixture('users.json').as('usersData');
cy.get('@usersData').then((users) => {
  cy.get('[data-testid="user-row"]').should('have.length', users.length);
});
```

---

## Fixtures and test data

```typescript
// Load fixture inline
cy.fixture('users.json').then((users) => {
  // use users array in test
});

// Load fixture as alias and use in intercept
cy.fixture('products.json').as('productsData');
cy.intercept('GET', '/api/products', { fixture: 'products.json' });

// cypress/fixtures/users.json
// [{ "id": 1, "name": "Alice", "role": "admin" }]
```

---

## Session and storage

```typescript
// cy.session caches login state across tests (Cypress 9+)
cy.session('user-session', () => {
  cy.request('POST', '/api/auth/login', { email: 'u@example.com', password: 'pw' })
    .its('body.token')
    .then((token) => localStorage.setItem('token', token));
});

// Direct storage manipulation
cy.clearLocalStorage();
cy.clearCookies();
window.localStorage.setItem('key', 'value');  // inside cy.window().then()

// Read cookies
cy.getCookie('session_id').should('exist');
cy.setCookie('feature_flag', 'enabled');
```

---

## Tasks and plugins (Node.js bridge)

```typescript
// cypress.config.ts - define tasks
on('task', {
  seedDatabase: async (data) => {
    await db.seed(data);
    return null; // tasks must return a value or null
  },
  clearDatabase: async () => {
    await db.truncateAll();
    return null;
  },
});

// In spec - invoke tasks
beforeEach(() => {
  cy.task('clearDatabase');
  cy.task('seedDatabase', { users: 3, products: 10 });
});
```

---

## Viewport and environment

```typescript
// Set viewport
cy.viewport(1440, 900);
cy.viewport('iphone-14');
cy.viewport('ipad-2');

// Read env vars (set in cypress.env.json or --env flag)
const apiUrl = Cypress.env('API_URL');

// Conditional based on environment
if (Cypress.env('CI')) {
  // CI-specific behavior
}

// Browser info
Cypress.browser.name  // 'chrome', 'firefox', 'electron'
```

---

## Debugging

```typescript
// Pause execution and open DevTools
cy.pause();

// Print subject to console without breaking the chain
cy.get('[data-testid="item"]').debug();

// Log to Cypress command log
cy.log('Current step: navigating to checkout');

// .then() to inspect subject mid-chain
cy.get('[data-testid="total"]').then(($el) => {
  console.log('Total text:', $el.text());
});

// Take screenshot (manual)
cy.screenshot('checkout-page');
cy.screenshot('error-state', { capture: 'viewport' });
```

---

## Configuration reference (`cypress.config.ts`)

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 4000,    // cy.get retry timeout
    requestTimeout: 10000,          // cy.request timeout
    responseTimeout: 30000,         // network response timeout
    video: false,                   // disable in CI to save time
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,                   // retry twice in CI
      openMode: 0,                  // no retries in interactive mode
    },
    env: {
      API_URL: 'http://localhost:3001',
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});
```
