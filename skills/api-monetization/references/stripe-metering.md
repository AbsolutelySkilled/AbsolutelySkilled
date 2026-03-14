<!-- Part of the api-monetization AbsolutelySkilled skill. Load this file when
     working with Stripe metered billing, usage records, or invoice lifecycle. -->

# Stripe Metering Deep Dive

## Metered billing flow

The complete lifecycle for Stripe metered billing:

1. **Create a Product** - represents your API service
2. **Create a metered Price** on that Product - defines the per-unit cost
3. **Subscribe a customer** to the metered Price
4. **Report usage** via `subscriptionItems.createUsageRecord()`
5. **Stripe aggregates** usage over the billing period
6. **Invoice generated** at period end with total usage charges

## Price configuration options

### Per-unit pricing

Charge a flat rate per API call.

```javascript
const price = await stripe.prices.create({
  product: 'prod_xxx',
  currency: 'usd',
  recurring: {
    interval: 'month',
    usage_type: 'metered',
    aggregate_usage: 'sum', // sum | last_during_period | last_ever | max
  },
  unit_amount: 1, // $0.01 per unit
  billing_scheme: 'per_unit',
});
```

### Tiered pricing (graduated)

Different rates at different volume levels. Use graduated tiers so that
the first N calls are at one rate, the next M at another.

```javascript
const tieredPrice = await stripe.prices.create({
  product: 'prod_xxx',
  currency: 'usd',
  recurring: {
    interval: 'month',
    usage_type: 'metered',
    aggregate_usage: 'sum',
  },
  billing_scheme: 'tiered',
  tiers_mode: 'graduated', // graduated | volume
  tiers: [
    { up_to: 10000, unit_amount: 0 },        // first 10k free (included)
    { up_to: 100000, unit_amount: 1 },        // next 90k at $0.01
    { up_to: 'inf', unit_amount: 0.5 },       // everything above at $0.005
  ],
});
```

### Volume pricing

All units charged at the tier the total falls into (not graduated).

```javascript
const volumePrice = await stripe.prices.create({
  product: 'prod_xxx',
  currency: 'usd',
  recurring: {
    interval: 'month',
    usage_type: 'metered',
    aggregate_usage: 'sum',
  },
  billing_scheme: 'tiered',
  tiers_mode: 'volume',
  tiers: [
    { up_to: 10000, unit_amount: 2 },
    { up_to: 100000, unit_amount: 1 },
    { up_to: 'inf', unit_amount: 0.5 },
  ],
});
```

## Aggregate usage modes

| Mode | Behavior | Use case |
|---|---|---|
| `sum` | Adds all reported quantities | API call counting |
| `last_during_period` | Uses only the last reported value | Seat-based billing |
| `last_ever` | Uses the most recent value ever | High-water-mark licensing |
| `max` | Uses the highest reported value in the period | Peak concurrent connections |

For API monetization, `sum` is almost always correct.

## Usage record reporting

### Increment mode (recommended)

```javascript
await stripe.subscriptionItems.createUsageRecord('si_xxx', {
  quantity: 500,
  timestamp: Math.floor(Date.now() / 1000),
  action: 'increment',
});
```

Each call adds to the running total. Safe to retry - worst case you
slightly over-count rather than losing data.

### Set mode (use with caution)

```javascript
await stripe.subscriptionItems.createUsageRecord('si_xxx', {
  quantity: 15000,
  timestamp: Math.floor(Date.now() / 1000),
  action: 'set',
});
```

Replaces the current total. Dangerous if retried after a network timeout -
you may overwrite a higher correct value with a stale one.

## Reporting frequency

<!-- VERIFY: Stripe rate limits for usage record creation are not explicitly
     documented. The 500 req/min general API limit applies. -->

| Frequency | Pros | Cons |
|---|---|---|
| Per-request | Maximum accuracy | Enormous API load, may hit Stripe rate limits |
| Hourly | Good balance of accuracy and efficiency | Up to 1 hour of data at risk if process crashes |
| Daily | Minimal API calls | Significant data loss risk, poor real-time visibility |

**Recommendation:** Report hourly with a durable queue backing the buffer.

## Invoice lifecycle

1. **Draft invoice created** ~1 hour before billing period ends
2. **Usage finalized** - Stripe stops accepting usage records for the period
3. **Invoice finalized** - becomes payable
4. **Payment attempted** - charges the customer's payment method
5. **Invoice paid** or **payment failed** - webhook events fired

Important: You cannot report usage for a past billing period after the
invoice has been finalized. Always report usage promptly.

## Webhooks for metered billing

Key events to listen for:

| Event | When | Action |
|---|---|---|
| `invoice.created` | Draft invoice generated | Verify usage totals look correct |
| `invoice.finalized` | Invoice ready for payment | Last chance to add manual adjustments |
| `invoice.payment_succeeded` | Customer charged | Update internal billing status |
| `invoice.payment_failed` | Charge failed | Notify customer, consider throttling |
| `customer.subscription.updated` | Plan changed | Update tier limits in your system |
| `customer.subscription.deleted` | Subscription cancelled | Revoke API access or downgrade to free |

## Handling subscription changes mid-cycle

When a customer upgrades from Free to Pro mid-cycle:

```javascript
// Prorate the base price and add metered component
const subscription = await stripe.subscriptions.update('sub_xxx', {
  items: [
    { id: 'si_base', price: 'price_pro_base' },
    { id: 'si_metered', price: 'price_pro_metered' },
  ],
  proration_behavior: 'create_prorations',
});
```

Usage records reported before the upgrade are billed at the old rate.
Records after the upgrade use the new rate. Stripe handles the cutover
automatically within the same billing period.

## Testing metered billing

Use Stripe test mode with test clocks to simulate billing cycles:

```javascript
// Create a test clock
const testClock = await stripe.testHelpers.testClocks.create({
  frozen_time: Math.floor(Date.now() / 1000),
});

// Create customer attached to test clock
const customer = await stripe.customers.create({
  test_clock: testClock.id,
  email: 'test@example.com',
});

// Subscribe, report usage, then advance the clock
// ... create subscription, report usage records ...

// Advance clock to trigger invoice generation
await stripe.testHelpers.testClocks.advance(testClock.id, {
  frozen_time: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
});
```
