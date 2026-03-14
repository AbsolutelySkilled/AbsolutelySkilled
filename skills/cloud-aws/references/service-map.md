<!-- Part of the cloud-aws AbsolutelySkilled skill. Load this file when
     selecting AWS services or mapping requirements to services. -->

# AWS Service Map

Quick-reference table mapping use cases to the right AWS service. Use this when
a task involves service selection or when translating requirements to AWS primitives.

---

## Compute

| Use case | Service | Notes |
|---|---|---|
| Long-running stateful app, OS control needed | **EC2** | Choose instance family: M (general), C (compute), R (memory), G (GPU) |
| Containerized workload, no host management | **ECS Fargate** | Preferred default for containers |
| Containerized, need Kubernetes | **EKS** | Use when k8s portability or ecosystem is required |
| Event-driven, short tasks (<15 min) | **Lambda** | Sub-second billing, scales to zero |
| HTTP service from container or source, zero ops | **App Runner** | Auto-deploys, TLS, scaling handled |
| Large-scale batch jobs | **AWS Batch** | Managed job queues, Fargate or EC2 backing |
| Edge compute / CDN logic | **Lambda@Edge / CloudFront Functions** | CloudFront Functions for lightweight transforms (<1ms budget) |

---

## Storage

| Use case | Service | Notes |
|---|---|---|
| Object storage, media, backups, static assets | **S3** | Unlimited scale, 11 nines durability |
| Block storage for EC2 | **EBS** | gp3 is the default general-purpose volume type |
| Shared filesystem (NFS) across EC2 | **EFS** | POSIX-compliant, multi-AZ |
| High-performance shared filesystem (HPC) | **FSx for Lustre** | Scratch or persistent mode |
| File shares (Windows/SMB) | **FSx for Windows File Server** | Active Directory integration |
| Archival, long-term retention | **S3 Glacier Instant / Flexible / Deep Archive** | Deep Archive cheapest (~$1/TB/month), hours retrieval |
| Content delivery / CDN | **CloudFront** | 400+ PoPs, S3 or custom origin |

---

## Database

| Use case | Service | Notes |
|---|---|---|
| Relational OLTP (Postgres/MySQL) | **RDS** | Managed, Multi-AZ, automated backups |
| High-throughput relational, auto-scaling storage | **Aurora** | 5x MySQL throughput; Aurora Serverless v2 for variable load |
| Key-value / document at massive scale | **DynamoDB** | Single-digit ms, design around access patterns first |
| In-memory cache / session store | **ElastiCache for Redis** | Sub-ms, supports data structures and pub/sub |
| Simple key-value cache (no persistence) | **ElastiCache for Memcached** | Multi-threaded, simpler than Redis |
| Full-text and log search | **OpenSearch Service** | Managed Elasticsearch/OpenSearch |
| Analytical / data warehouse | **Redshift** | Columnar, petabyte-scale, RA3 nodes |
| Serverless analytics on S3 | **Athena** | Presto-based, pay per query scanned |
| Highly connected data (graph) | **Neptune** | Gremlin and SPARQL APIs |
| Ledger / immutable audit log | **QLDB** | Cryptographically verifiable, document model |
| Time-series data | **Timestream** | Purpose-built, automatic tiering |

---

## Networking

| Use case | Service | Notes |
|---|---|---|
| Isolated private network | **VPC** | One per workload/account; CIDR plan carefully |
| Layer 7 HTTP(S) load balancing | **ALB (Application Load Balancer)** | Path/host routing, WebSocket, Cognito auth |
| Layer 4 TCP/UDP load balancing | **NLB (Network Load Balancer)** | Static IPs, ultra-low latency, PrivateLink |
| DNS management | **Route 53** | Health-check-based failover, latency routing |
| Private connectivity to AWS services | **VPC Endpoints (Gateway / Interface)** | Avoid internet traversal for S3, DynamoDB, etc. |
| Connect on-premises to VPC | **Site-to-Site VPN / Direct Connect** | VPN for quick setup; DX for dedicated bandwidth |
| Hub-and-spoke multi-VPC routing | **Transit Gateway** | Replaces VPC peering mesh at scale |
| Global accelerator for TCP/UDP | **Global Accelerator** | Anycast IPs, routes via AWS backbone |
| DDoS protection | **Shield Standard / Advanced** | Standard is automatic; Advanced adds 24/7 DDoS response team |
| Web Application Firewall | **WAF** | Attach to ALB, API Gateway, or CloudFront |

---

## Messaging and Integration

| Use case | Service | Notes |
|---|---|---|
| Decoupled async message queue | **SQS** | Standard (at-least-once) or FIFO (exactly-once, ordered) |
| Fan-out pub/sub notifications | **SNS** | Push to SQS, Lambda, HTTP, email, SMS |
| Real-time streaming / event bus | **Kinesis Data Streams** | Ordered, replayable, shards scale throughput |
| Managed Kafka | **MSK (Managed Streaming for Kafka)** | When Kafka ecosystem/tooling required |
| Event-driven integration / routing | **EventBridge** | Schema registry, cross-account, SaaS integrations |
| Workflow orchestration | **Step Functions** | Standard (audit, long-running) or Express (high-volume, short) |
| Managed message broker (AMQP/STOMP) | **Amazon MQ** | Lift-and-shift for RabbitMQ or ActiveMQ |

---

## Security and Identity

| Use case | Service | Notes |
|---|---|---|
| Identity and access management | **IAM** | Roles, policies, permission boundaries |
| User authentication / OIDC | **Cognito** | User pools (auth), identity pools (AWS credentials) |
| Secrets storage and rotation | **Secrets Manager** | Automatic rotation for RDS, Redshift, DocumentDB |
| Config/environment parameters | **Parameter Store (SSM)** | Free tier for standard params; use SecureString for sensitive values |
| Encryption key management | **KMS** | CMKs for envelope encryption; key policies control access |
| Certificate management | **ACM (Certificate Manager)** | Free TLS certs for ALB/CloudFront; auto-renewal |
| Threat detection (logs analysis) | **GuardDuty** | ML-based anomaly detection on VPC flow logs, CloudTrail, DNS |
| Security findings aggregation | **Security Hub** | Aggregates GuardDuty, Inspector, Macie findings |
| S3 sensitive data discovery | **Macie** | PII detection in S3 buckets |
| Vulnerability scanning (EC2/containers) | **Inspector** | CVE scanning, network reachability |
| Audit trail for API calls | **CloudTrail** | Enable in all regions; store in S3 with integrity validation |

---

## Monitoring and Observability

| Use case | Service | Notes |
|---|---|---|
| Metrics, alarms, dashboards | **CloudWatch Metrics + Alarms** | 1-min granularity for detailed monitoring |
| Log aggregation and querying | **CloudWatch Logs + Logs Insights** | Structured JSON logs; Logs Insights for ad-hoc queries |
| Distributed tracing | **X-Ray** | Trace across Lambda, ECS, API Gateway, SDK-instrumented services |
| Synthetic monitoring (uptime) | **CloudWatch Synthetics** | Canary scripts to test endpoints |
| Application performance monitoring | **CloudWatch Application Insights** | Auto-detects and groups related metrics/logs |
| Infrastructure events | **EventBridge / CloudWatch Events** | React to AWS service state changes |

---

## Developer Tools and IaC

| Use case | Service | Notes |
|---|---|---|
| Infrastructure as code (native) | **CloudFormation / CDK** | CDK (TypeScript/Python) compiles to CloudFormation |
| Source control | **CodeCommit** | Managed Git; most teams use GitHub/GitLab instead |
| CI/CD pipeline | **CodePipeline + CodeBuild** | Managed pipeline; CodeBuild for build/test steps |
| Container image registry | **ECR (Elastic Container Registry)** | Private, integrated with ECS/EKS, image scanning |
| Artifact storage | **CodeArtifact** | npm, Maven, pip, NuGet package proxy and hosting |

---

## Cost Optimization Quick Reference

| Strategy | Best for | Typical saving |
|---|---|---|
| Reserved Instances (1-year, no upfront) | Stable EC2 and RDS | ~30-40% vs on-demand |
| Compute Savings Plans | EC2 + Fargate + Lambda mix | ~20-30% |
| Spot Instances | Fault-tolerant batch, stateless workers | ~60-80% vs on-demand |
| S3 Intelligent-Tiering | Objects with unknown access frequency | ~40% on cold objects |
| Graviton (ARM) instances | General-purpose EC2, ECS, RDS | ~10-20% vs x86 equivalents |
| Lambda right-sizing (Power Tuning tool) | All Lambda functions | 20-50% memory/cost balance |
