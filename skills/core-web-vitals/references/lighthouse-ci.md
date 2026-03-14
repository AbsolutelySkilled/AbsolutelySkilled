<!-- Part of the core-web-vitals AbsolutelySkilled skill. Load this file when
     setting up Lighthouse CI, performance budgets, CrUX API integration, or RUM alerting. -->

# Lighthouse CI and Performance Monitoring Reference

---

## Lighthouse CI Setup (GitHub Actions)

Lighthouse CI (LHCI) runs Lighthouse against staging URLs on every PR and fails the build
when performance regressions occur.

### Installation

```bash
npm install --save-dev @lhci/cli
```

### Basic GitHub Actions workflow

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Serve and run Lighthouse CI
        run: |
          npm run start &
          sleep 5
          npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

For deployed staging environments, skip the build/serve steps:

```yaml
# .github/workflows/lighthouse-staging.yml
- name: Run Lighthouse CI against staging
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://staging.example.com/
      https://staging.example.com/products/
      https://staging.example.com/checkout/
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

### lighthouserc.js configuration

```js
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/products/',
        'http://localhost:3000/checkout/',
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      numberOfRuns: 3,  // run 3x to get stable median
      settings: {
        // Simulate mobile network + CPU throttling (matches Lighthouse default)
        preset: 'desktop',           // or 'mobile' for mobile simulation
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // CWV assertions - fail CI if these thresholds are breached
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Warn (not fail) on these
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],

        // Score-based thresholds
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],

        // Turn off specific audits that don't apply
        'uses-http2': 'off',
      },
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LHCI_SERVER_URL,
      token: process.env.LHCI_TOKEN,
    },
  },
};
```

---

## Performance Budget JSON Schema

A separate budget file gives more control over resource sizes and individual metric targets.

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "first-contentful-paint",    "budget": 1800 },
      { "metric": "largest-contentful-paint",  "budget": 2500 },
      { "metric": "total-blocking-time",       "budget": 200  },
      { "metric": "cumulative-layout-shift",   "budget": 0.1  },
      { "metric": "speed-index",               "budget": 3400 }
    ],
    "resourceSizes": [
      { "resourceType": "document",    "budget": 50   },
      { "resourceType": "script",      "budget": 200  },
      { "resourceType": "stylesheet",  "budget": 50   },
      { "resourceType": "image",       "budget": 500  },
      { "resourceType": "font",        "budget": 100  },
      { "resourceType": "third-party", "budget": 100  },
      { "resourceType": "total",       "budget": 1000 }
    ],
    "resourceCounts": [
      { "resourceType": "third-party", "budget": 10 },
      { "resourceType": "script",      "budget": 20 }
    ]
  },
  {
    "path": "/checkout/*",
    "timings": [
      { "metric": "largest-contentful-paint", "budget": 2000 },
      { "metric": "total-blocking-time",      "budget": 150  }
    ]
  }
]
```

**Budget field reference:**
- `timings.budget`: milliseconds for timing metrics; decimal for CLS score
- `resourceSizes.budget`: kilobytes (KB)
- `resourceCounts.budget`: number of requests

---

## Assertion Configuration Reference

LHCI assertions map Lighthouse audit IDs to pass/fail criteria.

```js
assertions: {
  // Levels: 'error' (fails CI), 'warn' (warning only), 'off' (ignore)

  // Metric upper bounds (fail if metric EXCEEDS value)
  'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
  'total-blocking-time':      ['error', { maxNumericValue: 200  }],
  'cumulative-layout-shift':  ['error', { maxNumericValue: 0.1  }],

  // Score lower bounds (fail if score BELOW threshold, 0-1)
  'categories:performance': ['error', { minScore: 0.9  }],
  'categories:seo':         ['warn',  { minScore: 0.95 }],
}
```

**Aggregation methods** (for multiple runs): `median-run` (recommended - most stable),
`optimistic` (best result - can mask flakiness), `pessimistic` (worst - conservative).

---

## CrUX API Integration

Use the CrUX API to pull real user data into monitoring scripts and CI checks.

### Fetch field data for a URL

```js
// scripts/check-crux.js
const API_KEY = process.env.CRUX_API_KEY;

async function getCruxData(url) {
  const response = await fetch(
    `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        metrics: [
          'largest_contentful_paint',
          'interaction_to_next_paint',
          'cumulative_layout_shift',
          'first_contentful_paint',
          'experimental_time_to_first_byte',
        ],
        formFactor: 'PHONE',  // PHONE, DESKTOP, or omit for ALL
      }),
    }
  );

  if (!response.ok) {
    // URL may not have enough CrUX data (< 100 users in 28 days)
    throw new Error(`CrUX API error: ${response.status}`);
  }

  return response.json();
}

function checkCwvAssessment(cruxData) {
  const { metrics } = cruxData.record;
  const thresholds = {
    largest_contentful_paint: 2500,
    interaction_to_next_paint: 200,
    cumulative_layout_shift: 0.1,
  };

  const results = {};
  for (const [metric, threshold] of Object.entries(thresholds)) {
    const p75 = metrics[metric]?.percentiles?.p75;
    if (p75 !== undefined) {
      results[metric] = {
        p75,
        status: p75 <= threshold ? 'GOOD' : p75 <= threshold * 1.6 ? 'NI' : 'POOR',
      };
    }
  }

  return results;
}

// Run as a CI check or cron job
const url = process.argv[2] || 'https://example.com/';
const data = await getCruxData(url);
const assessment = checkCwvAssessment(data);
console.table(assessment);

const hasPoorMetric = Object.values(assessment).some(r => r.status === 'POOR');
process.exit(hasPoorMetric ? 1 : 0);
```

### CrUX History API (trend tracking)

Use `https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord` with the same
POST body for 25 weeks of trend data. Zip `collectionPeriods` with `percentilesTimeseries.p75s`
to plot LCP/CLS trends over time.

---

## RUM Setup with web-vitals

Capture real user CWV data from production browsers and send to your analytics pipeline.

### Full RUM integration

```js
// src/lib/vitals.js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendVital({ name, value, rating, id, delta, navigationType }) {
  const body = {
    name,
    value: Math.round(name === 'CLS' ? value * 1000 : value), // normalize to integers
    rating,            // 'good' | 'needs-improvement' | 'poor'
    id,                // unique ID for deduplication
    delta,             // change since last report
    navigationType,    // 'navigate' | 'reload' | 'back-forward' | 'prerender'
    url: location.href,
    connection: navigator.connection?.effectiveType, // device segmentation
  };
  navigator.sendBeacon('/api/vitals', JSON.stringify(body)); // non-blocking
}

onLCP(sendVital);
onINP(sendVital, { reportAllChanges: true });
onCLS(sendVital, { reportAllChanges: true });
onFCP(sendVital);
onTTFB(sendVital);
```

### Attribution for debugging

When a metric is poor, attribution data helps identify the specific element and code path.

```js
// web-vitals/attribution provides element selectors and timing breakdowns
import { onINP } from 'web-vitals/attribution';

onINP(({ value, attribution }) => {
  sendVital({
    name: 'INP',
    value,
    rating: value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor',
    // Attribution fields
    inp_target: attribution.interactionTarget,       // CSS selector of clicked element
    inp_type: attribution.interactionType,           // 'pointer' | 'keyboard'
    inp_input_delay: attribution.inputDelay,         // ms
    inp_processing: attribution.processingDuration,  // ms
    inp_presentation: attribution.presentationDelay, // ms
    inp_script_url: attribution.longAnimationFrameEntries?.[0]?.scripts?.[0]?.sourceURL,
  });
}, { reportAllChanges: true });

import { onLCP } from 'web-vitals/attribution';

onLCP(({ value, attribution }) => {
  sendVital({
    name: 'LCP',
    value,
    // Attribution fields
    lcp_element: attribution.element,          // CSS selector
    lcp_url: attribution.url,                  // resource URL
    lcp_ttfb: attribution.timeToFirstByte,     // ms
    lcp_load_delay: attribution.resourceLoadDelay,    // ms
    lcp_load_duration: attribution.resourceLoadDuration, // ms
    lcp_render_delay: attribution.elementRenderDelay, // ms
  });
});
```

### Alerting on CWV regressions

Set up monitoring that fires alerts when real-user metrics degrade.

```js
// Example: simple threshold alerting using CrUX API on a schedule (cron / serverless function)
export async function checkCwvAlert() {
  const pages = [
    'https://example.com/',
    'https://example.com/products/',
  ];

  const alerts = [];

  for (const url of pages) {
    try {
      const data = await getCruxData(url);
      const { metrics } = data.record;

      const lcp = metrics.largest_contentful_paint?.percentiles?.p75;
      const inp = metrics.interaction_to_next_paint?.percentiles?.p75;
      const cls = metrics.cumulative_layout_shift?.percentiles?.p75;

      if (lcp > 2500) alerts.push({ url, metric: 'LCP', value: lcp, threshold: 2500 });
      if (inp > 200)  alerts.push({ url, metric: 'INP', value: inp, threshold: 200 });
      if (cls > 0.1)  alerts.push({ url, metric: 'CLS', value: cls, threshold: 0.1 });

    } catch {
      // Page may not have enough CrUX data yet
    }
  }

  if (alerts.length > 0) {
    await sendSlackAlert(alerts);
    // Or: create Jira/GitHub issues, page on-call, update status page
  }
}

async function sendSlackAlert(alerts) {
  const text = alerts.map(a =>
    `:red_circle: ${a.metric} degraded on ${a.url}: ${a.value} (threshold: ${a.threshold})`
  ).join('\n');

  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({ text: `*CWV Alert*\n${text}` }),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### Google Analytics 4 integration

For GA4: call `gtag('event', name, { value, metric_rating: rating, non_interaction: true })`
inside each callback. Use `reportAllChanges: false` to send only the final value per session.
Build a custom GA4 report with `event_name` and `metric_rating` dimensions, segmented by device.
