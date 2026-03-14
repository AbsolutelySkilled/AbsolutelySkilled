<!-- Part of the SigNoz AbsolutelySkilled skill. Load this file when
     working with OpenTelemetry Collector configuration for SigNoz. -->

# OTel Collector Configuration for SigNoz

## Installation methods

| Platform | Method | Config location |
|---|---|---|
| Linux (DEB/RPM) | Package manager, runs as systemd service | `/etc/otelcol-contrib/config.yaml` |
| Linux (manual) | Tarball extraction, manual process management | User-specified |
| macOS | Tarball (Intel or Apple Silicon) | User-specified |
| Windows | MSI installer, runs as Windows service | Event log integration |

Required ports: 4317 (gRPC), 4318 (HTTP), 8888 (metrics), 1777 (pprof), 13133 (health check).

## Full configuration template

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

  # Host metrics - CPU, memory, disk, network, load
  hostmetrics:
    collection_interval: 60s
    scrapers:
      cpu: {}
      disk: {}
      load: {}
      filesystem: {}
      memory: {}
      network: {}
      paging: {}
      process:
        mute_process_name_error: true
        mute_process_exe_error: true
        mute_process_io_error: true
      processes: {}
    # For Docker: mount host filesystem and set root_path
    # root_path: /hostfs

processors:
  batch:
    send_batch_size: 1000
    timeout: 10s

  resourcedetection:
    detectors: [env, system]
    timeout: 2s
    system:
      hostname_sources: [os]

exporters:
  # SigNoz Cloud
  otlp/signoz-cloud:
    endpoint: "ingest.<region>.signoz.cloud:443"
    tls:
      insecure: false
    headers:
      signoz-ingestion-key: "${env:SIGNOZ_INGESTION_KEY}"

  # Self-hosted SigNoz
  # otlp/signoz-self-hosted:
  #   endpoint: "<signoz-otel-collector-host>:4317"
  #   tls:
  #     insecure: true

  # Debug exporter - enable to troubleshoot data flow
  # debug:
  #   verbosity: detailed

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch, resourcedetection]
      exporters: [otlp/signoz-cloud]
    metrics:
      receivers: [otlp, hostmetrics]
      processors: [batch, resourcedetection]
      exporters: [otlp/signoz-cloud]
    logs:
      receivers: [otlp]
      processors: [batch, resourcedetection]
      exporters: [otlp/signoz-cloud]
```

## Common receivers

### Filelog receiver (container/application logs)

```yaml
receivers:
  filelog:
    include: [/var/log/app/*.log]
    start_at: end
    operators:
      - type: json_parser
        timestamp:
          parse_from: attributes.time
          layout: "%Y-%m-%dT%H:%M:%S.%fZ"
```

### Prometheus receiver (scrape existing Prometheus targets)

```yaml
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: "my-app"
          scrape_interval: 30s
          static_configs:
            - targets: ["localhost:9090"]
```

### Database/service receivers

The OTel Collector contrib distribution includes receivers for Redis, PostgreSQL,
MySQL, MongoDB, Kafka, RabbitMQ, Nginx, Apache, and more. Each is configured
under `receivers:` with service-specific connection parameters.

## Docker deployment considerations

When running the collector in Docker, mount the host filesystem for hostmetrics:

```yaml
# docker-compose.yaml
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    volumes:
      - ./config.yaml:/etc/otelcol-contrib/config.yaml
      - /:/hostfs:ro  # Mount host root for hostmetrics
    ports:
      - "4317:4317"
      - "4318:4318"
    environment:
      - SIGNOZ_INGESTION_KEY=${SIGNOZ_INGESTION_KEY}
```

Set `root_path: /hostfs` in the hostmetrics receiver config.

## Kubernetes deployment

Use the OpenTelemetry Operator or Helm chart for Kubernetes deployments. The
collector typically runs as a DaemonSet (for node-level metrics and logs) and
a Deployment (for application traces).

## Troubleshooting

1. **Verify collector starts**: Look for "Everything is ready. Begin running and
   processing data." in logs
2. **Enable debug exporter**: Add `debug` exporter with `verbosity: detailed`
   to verify data arrives at the collector
3. **Check endpoint connectivity**: `curl -v https://ingest.<region>.signoz.cloud:443`
4. **Verify ports**: Ensure 4317 and 4318 are not bound by another process
5. **Check host in SigNoz**: Navigate to Infrastructure Monitoring > Hosts tab
