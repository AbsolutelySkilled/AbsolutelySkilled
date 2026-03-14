<!-- Part of the Sentry AbsolutelySkilled skill. Load this file when
     working with detailed SDK configuration options. -->

# Sentry SDK Configuration Reference

## JavaScript SDK (`@sentry/browser`, `@sentry/node`, `@sentry/nextjs`)

### Core options

| Option | Type | Default | Description |
|---|---|---|---|
| `dsn` | string | required | Data Source Name - where to send events |
| `environment` | string | `production` | Environment tag (production, staging, dev) |
| `release` | string | auto-detected | App version for release tracking and source maps |
| `debug` | boolean | `false` | Enable verbose SDK logging to console |
| `enabled` | boolean | `true` | Set to `false` to disable the SDK entirely |
| `sendDefaultPii` | boolean | `false` | Attach request headers and IP addresses |
| `maxBreadcrumbs` | number | `100` | Max breadcrumbs to store (0 disables) |
| `attachStacktrace` | boolean | `false` | Attach stack traces to pure message events |
| `sampleRate` | number | `1.0` | Error event sample rate (0.0 to 1.0) |
| `tunnel` | string | none | Proxy URL to bypass ad blockers |

### Tracing options

| Option | Type | Default | Description |
|---|---|---|---|
| `tracesSampleRate` | number | none | Transaction sample rate (0.0 to 1.0) |
| `tracesSampler` | function | none | Dynamic sampling function, receives `samplingContext` |
| `tracePropagationTargets` | array | `["localhost", /^\//]` | URLs for trace header propagation |

### Replay options

| Option | Type | Default | Description |
|---|---|---|---|
| `replaysSessionSampleRate` | number | none | Percentage of all sessions to record |
| `replaysOnErrorSampleRate` | number | none | Percentage of error sessions to record |

### Profiling options

| Option | Type | Default | Description |
|---|---|---|---|
| `profilesSampleRate` | number | none | Profile sample rate (relative to traces) |

### Integrations

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  integrations: [
    // Performance tracing - auto-instruments page loads and navigation
    Sentry.browserTracingIntegration(),

    // Session replay - records DOM state as video-like reproduction
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
      maskAllInputs: true,
    }),

    // User feedback widget
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],
});
```

### Hooks and callbacks

```javascript
Sentry.init({
  // Filter events before sending
  beforeSend(event, hint) {
    if (event.exception?.values?.[0]?.type === "NetworkError") {
      return null; // Drop this event
    }
    return event;
  },

  // Filter breadcrumbs
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === "console") {
      return null; // Drop console breadcrumbs
    }
    return breadcrumb;
  },

  // Filter transactions
  beforeSendTransaction(event) {
    if (event.transaction === "/health") {
      return null; // Drop health check transactions
    }
    return event;
  },
});
```

---

## Python SDK (`sentry-sdk`)

### Core options

| Option | Type | Default | Description |
|---|---|---|---|
| `dsn` | str | required | Data Source Name |
| `environment` | str | `production` | Environment tag |
| `release` | str | auto-detected | Application version |
| `debug` | bool | `False` | Enable verbose logging |
| `send_default_pii` | bool | `False` | Send PII like user IPs and headers |
| `max_breadcrumbs` | int | `100` | Max breadcrumbs stored |
| `sample_rate` | float | `1.0` | Error event sample rate (0.0 to 1.0) |
| `traces_sample_rate` | float | none | Transaction sample rate |
| `profiles_sample_rate` | float | none | Profile sample rate |
| `profile_session_sample_rate` | float | none | Continuous profiling rate |
| `profile_lifecycle` | str | none | Set to `"trace"` for trace-based profiling |
| `enable_logs` | bool | `False` | Route application logs to Sentry |

### Framework auto-detection

The Python SDK auto-detects and integrates with frameworks:
- **Django** - middleware, template errors, signals
- **Flask** - request context, error handlers
- **FastAPI** - ASGI middleware, request tracing
- **Celery** - task monitoring, error capture
- **SQLAlchemy** - query spans
- **Redis** - command spans
- **httpx/requests** - outgoing HTTP spans

### Hooks and callbacks

```python
import sentry_sdk

def before_send(event, hint):
    if "exc_info" in hint:
        exc_type, exc_value, tb = hint["exc_info"]
        if isinstance(exc_value, KeyboardInterrupt):
            return None  # Drop keyboard interrupts
    return event

sentry_sdk.init(
    dsn="...",
    before_send=before_send,
)
```

---

## Recommended production sample rates

| Traffic level | traces | replays (session) | replays (error) |
|---|---|---|---|
| High (100k+ sessions/day) | 0.01 - 0.05 | 0.01 | 1.0 |
| Medium (10k-100k/day) | 0.1 | 0.1 | 1.0 |
| Low (< 10k/day) | 0.25 - 1.0 | 0.25 | 1.0 |

> Always set `replaysOnErrorSampleRate: 1.0` in production to capture
> all error sessions with replay context.
