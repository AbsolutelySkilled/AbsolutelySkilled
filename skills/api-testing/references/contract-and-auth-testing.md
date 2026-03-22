<!-- Part of the API Testing AbsolutelySkilled skill. Load this file when working with contract testing (Pact) or authentication flow testing. -->

# Contract Testing and Authentication Flow Testing

## Contract testing with Pact

Pact tests the contract from the consumer side first. The consumer defines
what it expects; the provider verifies it can satisfy those expectations.

```typescript
// consumer/tests/order-service.pact.test.ts
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { fetchOrder } from '../src/order-client';

const { like, iso8601DateTimeWithMillis } = MatchersV3;

const provider = new PactV3({
  consumer: 'checkout-service',
  provider: 'order-service',
  dir: './pacts',
});

describe('Order Service contract', () => {
  it('returns order details for a valid order id', async () => {
    await provider
      .given('order 42 exists')
      .uponReceiving('a request for order 42')
      .withRequest({ method: 'GET', path: '/orders/42' })
      .willRespondWith({
        status: 200,
        body: {
          id: like('42'),
          status: like('confirmed'),
          total: like(99.99),
          createdAt: iso8601DateTimeWithMillis(),
        },
      })
      .executeTest(async (mockServer) => {
        const order = await fetchOrder('42', mockServer.url);
        expect(order.id).toBe('42');
        expect(order.status).toBeDefined();
      });
  });
});

// provider/tests/order-service.pact.verify.test.ts
import { Verifier } from '@pact-foundation/pact';

describe('Provider verification', () => {
  it('satisfies all consumer pacts', () => {
    return new Verifier({
      provider: 'order-service',
      providerBaseUrl: 'http://localhost:3001',
      pactUrls: ['./pacts/checkout-service-order-service.json'],
      stateHandlers: {
        'order 42 exists': async () => {
          await seedOrder({ id: '42', status: 'confirmed', total: 99.99 });
        },
      },
    }).verifyProvider();
  });
});
```

## Test authentication flows

Test each auth state explicitly: no token, expired token, wrong scope, and
valid token. Never assume auth "just works" at the middleware level.

```typescript
// tests/auth.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { signToken } from './helpers/auth';

const PROTECTED = '/api/v1/profile';

describe('Authentication middleware', () => {
  it('returns 401 when Authorization header is missing', async () => {
    await request(app).get(PROTECTED).expect(401);
  });

  it('returns 401 when token is malformed', async () => {
    await request(app)
      .get(PROTECTED)
      .set('Authorization', 'Bearer not.a.valid.jwt')
      .expect(401);
  });

  it('returns 401 when token is expired', async () => {
    const expired = signToken({ userId: '1' }, { expiresIn: '-1s' });
    await request(app)
      .get(PROTECTED)
      .set('Authorization', `Bearer ${expired}`)
      .expect(401);
  });

  it('returns 403 when token lacks required scope', async () => {
    const token = signToken({ userId: '1', scopes: ['read:orders'] });
    await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('returns 200 when token is valid and has correct scope', async () => {
    const token = signToken({ userId: '1', scopes: ['read:profile'] });
    await request(app)
      .get(PROTECTED)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```
