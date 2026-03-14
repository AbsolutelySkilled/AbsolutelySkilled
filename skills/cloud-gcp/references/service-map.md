<!-- Part of the cloud-gcp AbsolutelySkilled skill. Load this file when
     selecting GCP services or mapping requirements to services. -->

# GCP Service Map

Quick reference: use case to GCP service. Load this file when the task involves
service selection, architecture review, or mapping requirements to GCP primitives.

---

## Compute

| Use case | Service | Notes |
|---|---|---|
| Containerized HTTP/gRPC API | Cloud Run | Default for stateless workloads; scales to zero |
| Containerized, always-on, or stateful workloads | GKE Autopilot | Use when you need GPUs, long-lived connections, or complex networking |
| Lightweight event handler or scheduled job | Cloud Functions (gen2) | Under 60-min execution; event-triggered or HTTP |
| Legacy app, custom OS, persistent disk | Compute Engine | Lift-and-shift; otherwise prefer managed options |
| Batch / HPC jobs | Cloud Batch or Dataproc | Managed Hadoop/Spark on Dataproc; generic batch jobs on Cloud Batch |

---

## Storage and databases

| Use case | Service | Avoid when |
|---|---|---|
| Transactional relational SQL (single-region) | Cloud SQL (Postgres recommended) | Over 10 TB or multi-region writes needed |
| Transactional relational SQL (global / multi-region writes) | Spanner | Single-region only - 5-10x cost of Cloud SQL |
| Document store (hierarchical, real-time sync) | Firestore | Heavy aggregations - bills per operation |
| Wide-column key-value at massive scale (IoT, time-series) | Bigtable | Under 1 TB - minimum node cost applies |
| Analytics / OLAP, large-scale SQL | BigQuery | Sub-5 ms OLTP queries - use Cloud SQL instead |
| Object / blob storage | Cloud Storage | Structured relational queries |
| In-memory cache, sessions, leaderboards | Memorystore (Redis) | Durable primary storage - ephemeral only |

---

## Messaging and streaming

| Use case | Service | Notes |
|---|---|---|
| Async messaging, event fan-out, service decoupling | Pub/Sub | At-least-once; supports push (webhook) and pull |
| High-throughput stream processing, ETL | Dataflow | Apache Beam managed; use for transformation pipelines |
| Real-time analytics on streams | BigQuery Subscriptions (from Pub/Sub) | Skip Dataflow if no transformation needed |
| Task queues for background jobs | Cloud Tasks | HTTP-target tasks with rate/retry control |
| Cron / scheduled invocation | Cloud Scheduler | Triggers Pub/Sub, HTTP, or Cloud Functions |

---

## Data and analytics

| Use case | Service | Notes |
|---|---|---|
| Interactive SQL analytics | BigQuery | Serverless; partition by date, cluster by key columns |
| BI and dashboards | Looker / Looker Studio | Looker Studio is free; Looker adds data modeling layer |
| Data transfer from SaaS / external | BigQuery Data Transfer Service | Managed connectors for Ads, Salesforce, S3, etc. |
| ML model training | Vertex AI Training | Managed training jobs; supports custom containers |
| ML model serving | Vertex AI Prediction | Online + batch predictions; managed endpoints |
| Feature store for ML | Vertex AI Feature Store | Consistent features across training and serving |

---

## Networking

| Use case | Service | Notes |
|---|---|---|
| Load balancing for Cloud Run / GKE / GCE | Cloud Load Balancing (Global HTTP(S)) | Supports HTTP/2, WebSockets, gRPC |
| CDN caching for static assets and APIs | Cloud CDN | Attach to HTTP(S) Load Balancer backend services |
| WAF, DDoS protection, rate limiting | Cloud Armor | Attach to Load Balancer; supports custom rules |
| Private networking between services | VPC | Use Private Google Access to reach GCP APIs without public IPs |
| DNS management | Cloud DNS | Authoritative DNS; supports private zones for VPCs |
| Connecting on-premises to GCP | Cloud Interconnect / VPN | Interconnect for high bandwidth; VPN for encrypted tunnel |

---

## Security and identity

| Use case | Service | Notes |
|---|---|---|
| Identity for human users (Google Workspace) | Cloud Identity / Workspace | SSO, 2FA, directory management |
| Identity for workloads on GCP | Service Accounts + Workload Identity | Never download key files; bind SA to workload |
| Secrets, API keys, connection strings | Secret Manager | Versioned; automatic rotation with Cloud Functions |
| Audit logging and compliance | Cloud Audit Logs | Admin Activity and Data Access logs |
| Vulnerability scanning for containers | Artifact Analysis | Integrated with Artifact Registry; CVE scanning |
| Policy enforcement across projects | Organization Policy | Constraints on allowed resource types, regions, IAM |

---

## Observability

| Use case | Service | Notes |
|---|---|---|
| Centralized logging | Cloud Logging | Structured JSON logs; auto-ingested from GCP services |
| Metrics, dashboards, alerting | Cloud Monitoring | Built-in GCP metrics; custom metrics via OpenTelemetry |
| Distributed tracing | Cloud Trace | Auto-instrumented for Cloud Run and GKE |
| Error reporting | Error Reporting | Groups and surfaces exceptions from logs |
| Uptime checks and alerting | Cloud Monitoring Uptime | HTTP/TCP probes from multiple global regions |

---

## Developer tooling

| Use case | Service | Notes |
|---|---|---|
| Container image registry | Artifact Registry | Replaces Container Registry; supports Docker, Maven, npm, Python |
| CI/CD pipelines | Cloud Build | Trigger on GitHub/GitLab; build, test, push, deploy |
| Infrastructure as code | Cloud Deployment Manager / Terraform | Terraform preferred for multi-cloud; CDM for GCP-only |
| Secrets in CI/CD | Secret Manager + Cloud Build | Mount secrets as env vars or files in build steps |
