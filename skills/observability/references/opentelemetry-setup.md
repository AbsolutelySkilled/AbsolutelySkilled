<!-- Part of the observability AbsolutelySkilled skill. Load this file when
     setting up OpenTelemetry instrumentation. -->

# OpenTelemetry SDK Setup Reference

OpenTelemetry (OTel) is the vendor-neutral standard for telemetry instrumentation.
This reference covers the SDK setup for Node.js and Python, including exporters,
processors, and samplers. For instrumentation patterns and SLO definitions, refer
to the main SKILL.md.

---

## Architecture overview

```
Your service
  |
  | SDK instruments code (traces, metrics, logs)
  v
OTel SDK (in-process)
  | BatchSpanProcessor -> buffers spans, exports in batches
  | PeriodicExportingMetricReader -> exports metrics every N seconds
  v
Exporter (OTLP over HTTP or gRPC)
  v
OTel Collector (recommended - decouples your app from backend)
  | Receivers: otlp
  | Processors: batch, memory_limiter, resource
  | Exporters: jaeger, prometheus, datadog, honeycomb, etc.
  v
Observability backend (Jaeger, Grafana Tempo, Datadog, Honeycomb)
```

**Always use the OTel Collector in production.** It buffers, retries, and lets you
change backends without redeploying your service.

---

## Node.js SDK

### Installation

```bash
npm install \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/exporter-metrics-otlp-http \
  @opentelemetry/sdk-metrics \
  @opentelemetry/sdk-trace-node
```

### Full SDK setup (TypeScript)

```typescript
// src/instrumentation.ts
// MUST be loaded before any other module.
// Run with: node --require ./dist/instrumentation.js ./dist/server.js

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ParentBasedSampler, TraceIdRatioBased } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } from '@opentelemetry/semantic-conventions';

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: process.env.SERVICE_NAME ?? 'unknown-service',
    [SEMRESATTRS_SERVICE_VERSION]: process.env.SERVICE_VERSION ?? '0.0.0',
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV ?? 'development',
  })
);

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
    : 'http://localhost:4318/v1/traces',
  headers: {
    // For vendors like Honeycomb or Grafana Cloud that need auth:
    ...(process.env.OTEL_EXPORTER_OTLP_HEADERS
      ? Object.fromEntries(
          process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',').map((h) => h.split('='))
        )
      : {}),
  },
});

const metricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`
    : 'http://localhost:4318/v1/metrics',
});

const sdk = new NodeSDK({
  resource,
  spanProcessor: new BatchSpanProcessor(traceExporter, {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30_000,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 15_000,
    exportTimeoutMillis: 10_000,
  }),
  sampler: new ParentBasedSampler({
    // Accept parent's sampling decision; for root spans, sample 10%
    root: new TraceIdRatioBased(
      Number(process.env.OTEL_TRACES_SAMPLER_ARG ?? '0.1')
    ),
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false }, // noisy, disable by default
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) =>
          // Suppress health check traces
          req.url === '/health' || req.url === '/ready',
      },
      '@opentelemetry/instrumentation-pg': { enhancedDatabaseReporting: false }, // avoid logging SQL params
    }),
  ],
});

sdk.start();

process.on('SIGTERM', async () => {
  await sdk.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await sdk.shutdown();
  process.exit(0);
});
```

### Custom metrics (Node.js)

```typescript
// metrics.ts
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('order-service', '1.0.0');

// Counter - value only goes up
export const ordersProcessed = meter.createCounter('orders_processed_total', {
  description: 'Total number of orders processed',
  unit: '{order}',
});

// Histogram - for latency and size distributions
export const orderProcessingDuration = meter.createHistogram(
  'order_processing_duration_seconds',
  {
    description: 'Time to process an order end-to-end',
    unit: 's',
    advice: {
      // Custom bucket boundaries for your latency profile
      explicitBucketBoundaries: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    },
  }
);

// Observable gauge - for values that are polled, not recorded on events
const activeConnections = meter.createObservableGauge('db_active_connections', {
  description: 'Current active database connections',
});
activeConnections.addCallback((result) => {
  result.observe(pool.totalCount - pool.idleCount, { pool: 'primary' });
});

// Usage
export async function processOrder(order: Order) {
  const start = performance.now();
  try {
    const result = await doProcess(order);
    ordersProcessed.add(1, { status: 'success', tier: order.tier });
    return result;
  } catch (err) {
    ordersProcessed.add(1, { status: 'error', tier: order.tier });
    throw err;
  } finally {
    orderProcessingDuration.record((performance.now() - start) / 1000, {
      tier: order.tier,
    });
  }
}
```

---

## Python SDK

### Installation

```bash
pip install \
  opentelemetry-sdk \
  opentelemetry-exporter-otlp-proto-http \
  opentelemetry-instrumentation-flask \
  opentelemetry-instrumentation-requests \
  opentelemetry-instrumentation-sqlalchemy
```

### Full SDK setup (Python / Flask)

```python
# instrumentation.py - import this before your app module

import os
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import Resource, SERVICE_NAME, SERVICE_VERSION
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.trace.sampling import ParentBasedTraceIdRatio

OTLP_ENDPOINT = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4318")

resource = Resource.create({
    SERVICE_NAME: os.getenv("SERVICE_NAME", "unknown-service"),
    SERVICE_VERSION: os.getenv("SERVICE_VERSION", "0.0.0"),
    "deployment.environment": os.getenv("FLASK_ENV", "development"),
})

# Traces
sampler = ParentBasedTraceIdRatio(float(os.getenv("OTEL_TRACES_SAMPLER_ARG", "0.1")))
tracer_provider = TracerProvider(resource=resource, sampler=sampler)
tracer_provider.add_span_processor(
    BatchSpanProcessor(
        OTLPSpanExporter(endpoint=f"{OTLP_ENDPOINT}/v1/traces"),
        max_queue_size=2048,
        max_export_batch_size=512,
        schedule_delay_millis=5000,
    )
)
trace.set_tracer_provider(tracer_provider)

# Metrics
metric_reader = PeriodicExportingMetricReader(
    OTLPMetricExporter(endpoint=f"{OTLP_ENDPOINT}/v1/metrics"),
    export_interval_millis=15_000,
)
meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
metrics.set_meter_provider(meter_provider)
```

```python
# app.py
import instrumentation  # noqa: F401 - must be first import

from flask import Flask
from opentelemetry.instrumentation.flask import FlaskInstrumentation
from opentelemetry.instrumentation.requests import RequestsInstrumentation
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentation

app = Flask(__name__)

# Auto-instrumentation for Flask, outbound HTTP, and SQLAlchemy
FlaskInstrumentation().instrument_app(app)
RequestsInstrumentation().instrument()
SQLAlchemyInstrumentation().instrument(engine=db.engine)
```

```python
# Manual spans and custom metrics in Python
from opentelemetry import trace, metrics
from opentelemetry.trace import Status, StatusCode

tracer = trace.get_tracer("order-service")
meter = metrics.get_meter("order-service", "1.0.0")

orders_counter = meter.create_counter(
    "orders_processed_total",
    description="Total orders processed",
    unit="order",
)
order_duration = meter.create_histogram(
    "order_processing_duration_seconds",
    description="Order processing duration",
    unit="s",
)

def process_payment(order_id: str, amount: float):
    with tracer.start_as_current_span("payment.process") as span:
        span.set_attributes({
            "order.id": order_id,
            "payment.amount": amount,
        })
        try:
            result = stripe_client.charge(amount)
            span.set_status(Status(StatusCode.OK))
            return result
        except Exception as e:
            span.set_status(Status(StatusCode.ERROR, str(e)))
            span.record_exception(e)
            raise
```

---

## Sampler reference

| Sampler | Description | Use case |
|---|---|---|
| `AlwaysOn` | Sample 100% of traces | Dev / low-traffic services |
| `AlwaysOff` | Sample nothing | Disable tracing without code change |
| `TraceIdRatioBased(0.1)` | Sample 10% of root spans deterministically | Production baseline |
| `ParentBasedSampler(root)` | Respect parent decision; use `root` for new traces | Production (recommended) |
| Tail-based (Collector) | Collect all spans, decide after trace completes | Catching errors/slow traces |

**Tail-based sampling requires the OTel Collector** with the `tailsampling` processor.
Example Collector config:

```yaml
# otel-collector.yaml (partial)
processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 50000
    policies:
      - name: errors
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: slow-traces
        type: latency
        latency: { threshold_ms: 2000 }
      - name: probabilistic-baseline
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }
```

---

## Exporter quick reference

| Backend | Exporter package | Endpoint format |
|---|---|---|
| OTel Collector (recommended) | `exporter-trace-otlp-http` | `http://collector:4318/v1/traces` |
| Jaeger | `exporter-jaeger` or OTLP to Jaeger | `http://jaeger:14268` |
| Grafana Tempo | OTLP HTTP | `http://tempo:4318` |
| Datadog | `dd-trace` (separate SDK) or OTel Collector with Datadog exporter | `https://trace.agent.datadoghq.com` |
| Honeycomb | OTLP HTTP with API key header | `https://api.honeycomb.io` |
| New Relic | OTLP HTTP with license key header | `https://otlp.nr-data.net:4318` |

**Datadog note:** Datadog's native `dd-trace` library has better Datadog-specific
features (APM, runtime metrics, profiling) than routing OTel through the Collector.
Use `dd-trace` if Datadog is your primary backend.

---

## Environment variables reference

OTel SDKs respect these standard env vars:

```bash
# Service identity
OTEL_SERVICE_NAME=order-api
OTEL_SERVICE_VERSION=1.4.2

# Exporter endpoint (all signals)
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318

# Per-signal endpoint override
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://otel-collector:4318/v1/traces
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://otel-collector:4318/v1/metrics

# Auth headers for managed services (comma-separated key=value)
OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=YOUR_API_KEY

# Sampling
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1  # 10%

# Log level for the OTel SDK itself (not your app)
OTEL_LOG_LEVEL=warn
```

Using env vars instead of hardcoding SDK config keeps your instrumentation code
environment-agnostic - the same binary runs in dev (100% sampling, console exporter)
and production (10% sampling, OTLP to Collector) with only env changes.
