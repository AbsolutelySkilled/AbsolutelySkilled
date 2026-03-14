<!-- Part of the api-monetization AbsolutelySkilled skill. Load this file when
     working with rate limiting algorithms, Redis implementations, or
     distributed rate limiting. -->

# Rate Limiting Patterns

## Algorithm comparison

| Algorithm | Accuracy | Memory | Burst handling | Complexity |
|---|---|---|---|---|
| Fixed window | Low | Low | Poor (boundary burst) | Simple |
| Sliding window log | High | High | Good | Medium |
| Sliding window counter | Good | Low | Good | Medium |
| Token bucket | Good | Low | Configurable | Medium |
| Leaky bucket | Good | Low | Smooths bursts | Medium |

## Fixed window

Counts requests in fixed time intervals (e.g., per minute starting at :00).

```javascript
async function fixedWindow(redis, key, limit, windowSec) {
  const windowKey = `${key}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  const count = await redis.incr(windowKey);
  if (count === 1) await redis.expire(windowKey, windowSec);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
```

**Weakness:** A burst of requests at the boundary of two windows can allow
2x the intended limit. E.g., 100 requests at 11:59:59 + 100 at 12:00:00
passes a 100/minute limit.

## Sliding window counter (recommended for most APIs)

Hybrid of fixed window and sliding log. Uses two adjacent fixed windows
weighted by the current position within the window.

```javascript
async function slidingWindowCounter(redis, key, limit, windowSec) {
  const now = Date.now() / 1000;
  const currentWindow = Math.floor(now / windowSec);
  const previousWindow = currentWindow - 1;
  const elapsed = (now / windowSec) - currentWindow; // 0.0 to 1.0

  const [prevCount, currCount] = await Promise.all([
    redis.get(`${key}:${previousWindow}`).then(Number),
    redis.get(`${key}:${currentWindow}`).then(Number),
  ]);

  const estimatedCount = (prevCount || 0) * (1 - elapsed) + (currCount || 0);

  if (estimatedCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await redis.incr(`${key}:${currentWindow}`);
  await redis.expire(`${key}:${currentWindow}`, windowSec * 2);

  return {
    allowed: true,
    remaining: Math.max(0, Math.floor(limit - estimatedCount - 1)),
  };
}
```

## Token bucket

Tokens are added at a steady rate. Each request consumes one token. Allows
controlled bursting up to the bucket capacity.

```javascript
async function tokenBucket(redis, key, rate, capacity) {
  const now = Date.now() / 1000;
  const lua = `
    local tokens_key = KEYS[1]
    local timestamp_key = KEYS[2]
    local rate = tonumber(ARGV[1])
    local capacity = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local last_time = tonumber(redis.call('get', timestamp_key) or now)
    local current_tokens = tonumber(redis.call('get', tokens_key) or capacity)

    local elapsed = math.max(0, now - last_time)
    local new_tokens = math.min(capacity, current_tokens + elapsed * rate)

    if new_tokens < 1 then
      return {0, math.ceil((1 - new_tokens) / rate)}
    end

    new_tokens = new_tokens - 1
    redis.call('set', tokens_key, new_tokens)
    redis.call('set', timestamp_key, now)
    redis.call('expire', tokens_key, math.ceil(capacity / rate) * 2)
    redis.call('expire', timestamp_key, math.ceil(capacity / rate) * 2)

    return {1, 0}
  `;

  const [allowed, retryAfter] = await redis.eval(
    lua, 2,
    `${key}:tokens`, `${key}:ts`,
    rate, capacity, now
  );

  return { allowed: allowed === 1, retryAfter };
}
```

> Token bucket is ideal when you want to allow short bursts (e.g., 10
> requests instantly) while maintaining a steady-state limit (e.g., 100/min).

## Response headers

Always include these headers on every response, not just 429s:

```
X-RateLimit-Limit: 100          # max requests per window
X-RateLimit-Remaining: 42       # requests left in current window
X-RateLimit-Reset: 1710432000   # Unix timestamp when window resets
Retry-After: 30                 # seconds to wait (only on 429)
```

```javascript
function setRateLimitHeaders(res, limit, remaining, resetTimestamp) {
  res.set('X-RateLimit-Limit', String(limit));
  res.set('X-RateLimit-Remaining', String(Math.max(0, remaining)));
  res.set('X-RateLimit-Reset', String(resetTimestamp));
}
```

## Distributed rate limiting

When running multiple API server instances, rate limiting must be centralized.

### Redis-based (recommended)

All instances share a single Redis cluster. The algorithms above work
as-is because Redis operations are atomic.

### Considerations for high scale:

1. **Redis latency** adds to every request. Keep Redis in the same
   region as your API servers (< 1ms RTT).
2. **Redis failures** - decide on a fail-open or fail-closed policy.
   Fail-open (allow all requests) is safer for production APIs;
   fail-closed (deny all) is safer for abuse prevention.
3. **Lua scripts** for multi-step operations (like token bucket) ensure
   atomicity without requiring distributed locks.

### Per-endpoint weighting

Not all endpoints cost the same. An ML inference endpoint might cost
100x more than a data lookup.

```javascript
const ENDPOINT_WEIGHTS = {
  'GET /v1/users': 1,
  'POST /v1/analyze': 10,
  'POST /v1/generate': 50,
};

async function weightedRateLimit(redis, apiKey, endpoint, tierLimit) {
  const weight = ENDPOINT_WEIGHTS[endpoint] || 1;
  const key = `ratelimit:${apiKey}`;
  // Consume `weight` tokens instead of 1
  // Apply to any of the above algorithms
}
```

## Rate limiting by tier

Map tiers to limits in a configuration object for easy updates:

```javascript
const TIER_CONFIG = {
  free: {
    requests_per_minute: 10,
    requests_per_day: 1000,
    burst_capacity: 15,
    concurrent_requests: 2,
  },
  pro: {
    requests_per_minute: 100,
    requests_per_day: 50000,
    burst_capacity: 150,
    concurrent_requests: 10,
  },
  enterprise: {
    requests_per_minute: 1000,
    requests_per_day: null, // unlimited
    burst_capacity: 1500,
    concurrent_requests: 50,
  },
};
```

Apply multiple limits simultaneously - per-minute AND per-day. A request
must pass all limit checks to proceed.

## Graceful degradation

When a customer exceeds limits, offer a degradation path instead of a
hard block:

1. **Soft limit (80%)** - return `X-RateLimit-Warning: approaching` header
2. **At limit (100%)** - return `429` with `Retry-After`
3. **Sustained over-limit** - queue requests with lower priority instead of rejecting
4. **Abuse detected** - temporary ban with explanation

```javascript
function getRateLimitResponse(usage, limit) {
  const ratio = usage / limit;
  if (ratio < 0.8) return { status: 'ok' };
  if (ratio < 1.0) return { status: 'warning', header: 'approaching' };
  if (ratio < 1.5) return { status: 'throttled', retryAfter: 60 };
  return { status: 'blocked', retryAfter: 3600 };
}
```
