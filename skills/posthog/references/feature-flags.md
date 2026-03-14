<!-- Part of the PostHog AbsolutelySkilled skill. Load this file when
     working with feature flags, experiments, or A/B testing. -->

# PostHog Feature Flags & Experiments

## Feature flag types

### Boolean (release toggle)
Returns `true` when enabled and conditions match, `false` when disabled, or
`undefined`/`null` when conditions don't match.

```javascript
if (posthog.isFeatureEnabled('new-checkout')) {
  renderNewCheckout()
}
```

### Multivariate
Returns a variant key string (e.g. `control`, `test`, `variant-a`). Each variant
has a configurable rollout percentage that must total 100%.

```javascript
const variant = posthog.getFeatureFlag('checkout-experiment')
if (variant === 'test') {
  renderTestCheckout()
} else {
  renderControlCheckout()
}
```

### Remote config
Delivers a static configuration value consistently to all matching users. Does not
support percentage-based rollouts. Used for dynamic configuration without deploys.

```javascript
const config = posthog.getFeatureFlagPayload('app-config')
// Returns the JSON payload attached to the flag
```

---

## Release conditions

Conditions evaluate top-to-bottom, first match wins. Options:
- **Match by user** (default) - target individual persons by properties
- **Match by device** - target by device properties
- **Match by group** - target by group properties (requires group analytics)

Filters available:
- Person properties (exact, contains, regex, is set/not set)
- Cohort membership
- Geographic location (country, city)
- Semantic version comparisons (for app version targeting)
- Percentage rollout (0-100%)

---

## Local evaluation (server-side)

Local evaluation avoids a network call per flag check by polling flag definitions
and evaluating them locally. Requires a personal API key.

```javascript
// Node.js
const client = new PostHog('phc_key', {
  host: 'https://us.i.posthog.com',
  personalApiKey: 'phx_personal_key',
  featureFlagsPollingInterval: 30000, // poll every 30s (default: 300000ms / 5min)
})

// This evaluates locally - no network call
const flag = await client.getFeatureFlag('my-flag', 'user_123', {
  personProperties: { plan: 'pro', country: 'US' },
  groupProperties: { company: { name: 'Acme' } },
})
```

```python
# Python
posthog = Posthog('phc_key',
    host='https://us.i.posthog.com',
    personal_api_key='phx_personal_key',
    poll_interval=30)  # seconds

flag = posthog.get_feature_flag('my-flag', 'user_123',
    person_properties={'plan': 'pro'},
    group_properties={'company': {'name': 'Acme'}})
```

**Important**: When using local evaluation, you must provide `personProperties`
and `groupProperties` that match the conditions. If a flag condition uses a
property you didn't provide, it falls back to a remote API call.

Rate limit for local evaluation polling: 600 requests/minute.

---

## Bootstrapping (client-side)

Bootstrap flags on page load to avoid flickering. Pass flag values from
server-side rendering.

```javascript
posthog.init('phc_key', {
  api_host: 'https://us.i.posthog.com',
  bootstrap: {
    distinctID: 'user_123',
    featureFlags: {
      'new-checkout': true,
      'checkout-experiment': 'test',
    },
    featureFlagPayloads: {
      'app-config': { theme: 'dark' },
    },
  },
})
```

> The `distinctID` in bootstrap must match the user's actual distinct ID. If it
> doesn't, flags will be re-fetched from the server, causing a flash.

---

## Experiments / A/B testing

Experiments are built on top of feature flags with statistical analysis.

### Creating an experiment
1. Create a multivariate feature flag with `control` and `test` variants
2. Create an experiment linked to that flag
3. Define a goal metric (trend, funnel, or secondary metrics)
4. Set minimum sample size and run duration
5. Launch the experiment (activates the linked flag)

### Evaluating in code
Experiments use the same flag evaluation methods:

```javascript
const variant = posthog.getFeatureFlag('signup-experiment')
if (variant === 'test') {
  renderNewSignupFlow()
}
// PostHog automatically tracks exposure via $feature_flag_called event
```

### Statistical significance
PostHog uses a Bayesian approach to calculate statistical significance. Results
show win probability and credible intervals. The experiment dashboard indicates
when significance is reached.

---

## Feature flag best practices

1. **Use descriptive keys** - `new-checkout-flow` not `flag-1`
2. **Clean up stale flags** - remove flags after full rollout to reduce evaluation overhead
3. **Use local evaluation server-side** - avoids latency and API dependency for critical paths
4. **Bootstrap client-side** - prevents UI flickering on page load
5. **Provide person properties for local eval** - missing properties trigger remote fallback
6. **Use payloads for configuration** - attach JSON payloads to flags instead of hardcoding values

---

## Feature Flags API

```bash
# List all flags
curl -H "Authorization: Bearer phx_key" \
  "https://us.posthog.com/api/projects/:project_id/feature_flags/"

# Get a specific flag
curl -H "Authorization: Bearer phx_key" \
  "https://us.posthog.com/api/projects/:project_id/feature_flags/:id/"

# Evaluate flags for a user (public endpoint)
curl -X POST "https://us.i.posthog.com/decide?v=3" \
  -H "Content-Type: application/json" \
  -d '{"api_key": "phc_key", "distinct_id": "user_123"}'
```

The `/decide` endpoint returns all active flags and their values for a given user.
This is what the SDKs call internally.
