<!-- Part of the SigNoz AbsolutelySkilled skill. Load this file when
     working with language-specific instrumentation for SigNoz. -->

# SigNoz Instrumentation Guide

## Supported languages and frameworks

### Backend languages (auto + manual instrumentation)

| Language | Auto-instrumentation | Manual | Notable frameworks |
|---|---|---|---|
| Java | Yes | Yes | Spring Boot, Quarkus, JBoss, Tomcat, WildFly |
| Python | Yes | Yes | Django, Flask, FastAPI |
| Node.js | Yes | Yes | Express, NestJS, Next.js, Nuxt.js |
| Go | No (manual only) | Yes | gin, echo, gRPC |
| .NET | Yes (NuGet-based) | Yes | ASP.NET Core |
| Ruby | Yes | Yes | Rails, Sinatra |
| PHP | Yes | Yes | Laravel, Symfony |
| Rust | No (manual only) | Yes | actix-web, axum |
| Elixir | Yes | Yes | Phoenix |
| C++ | No (manual only) | Yes | - |
| Deno | No (manual only) | Yes | - |
| Swift | No (manual only) | Yes | - |

### Mobile platforms

| Platform | Framework | Instrumentation type |
|---|---|---|
| Android | Java, Kotlin | Auto + Manual |
| iOS | SwiftUI | Manual |
| Cross-platform | React Native | Auto |
| Cross-platform | Flutter | Auto |

### Frontend and edge

- **Frontend monitoring** - Browser-based tracing via OTel JS SDK
- **Cloudflare Workers** - Edge function instrumentation
- **NGINX** - Module-based instrumentation

## Auto-instrumentation pattern (Node.js)

Auto-instrumentation captures HTTP requests, database calls, and framework-specific
operations without code changes. Initialize before any application imports:

```javascript
// tracing.js - must be loaded FIRST via -r flag or import
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-grpc");
const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME || "my-service",
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4317",
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4317",
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
process.on("SIGTERM", () => sdk.shutdown());
```

```bash
# Run with tracing
node -r ./tracing.js app.js

# Or set via environment
export NODE_OPTIONS="--require ./tracing.js"
node app.js
```

## Auto-instrumentation pattern (Python)

```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install
```

```bash
OTEL_SERVICE_NAME=my-python-service \
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 \
opentelemetry-instrument python app.py
```

## Auto-instrumentation pattern (Java)

```bash
# Download the OTel Java agent
wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
```

```bash
OTEL_SERVICE_NAME=my-java-service \
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 \
java -javaagent:opentelemetry-javaagent.jar -jar app.jar
```

## Manual instrumentation - adding custom spans

When auto-instrumentation misses business-critical operations, add manual spans:

```python
from opentelemetry import trace

tracer = trace.get_tracer("my-module")

def process_order(order_id):
    with tracer.start_as_current_span("process_order") as span:
        span.set_attribute("order.id", order_id)
        span.set_attribute("order.type", "premium")
        # business logic here
        span.add_event("payment_processed", {"amount": 99.99})
```

```javascript
const { trace } = require("@opentelemetry/api");

const tracer = trace.getTracer("my-module");

function processOrder(orderId) {
  return tracer.startActiveSpan("process_order", (span) => {
    span.setAttribute("order.id", orderId);
    try {
      // business logic
      span.addEvent("payment_processed", { amount: 99.99 });
    } catch (err) {
      span.recordException(err);
      span.setStatus({ code: trace.SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  });
}
```

## Recording exceptions

Auto-instrumentation records unhandled exceptions automatically for Python, Java,
Ruby, and JavaScript. For other languages or custom exception tracking:

```go
import "go.opentelemetry.io/otel/codes"

span.RecordError(err)
span.SetStatus(codes.Error, err.Error())
```

```csharp
activity?.RecordException(ex);
activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
```

```ruby
span.record_exception(error)
span.status = OpenTelemetry::Trace::Status.error(error.message)
```

## SigNoz Cloud vs self-hosted endpoint config

For **SigNoz Cloud**, set the endpoint with TLS and ingestion key:

```env
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.<region>.signoz.cloud:443
OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<your-key>
```

For **self-hosted**, point to your SigNoz instance (default: no auth):

```env
OTEL_EXPORTER_OTLP_ENDPOINT=http://<signoz-host>:4317
```
