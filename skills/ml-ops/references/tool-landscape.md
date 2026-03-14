<!-- Part of the ml-ops AbsolutelySkilled skill. Load this file when
     selecting MLOps tools or comparing platforms. -->

# MLOps Tool Landscape

Choosing MLOps tooling is a two-dimensional decision: how much infrastructure you
want to own (self-hosted vs fully managed) and how tightly coupled you want to be
to a cloud vendor. This reference compares the major platforms across the four core
MLOps domains: experiment tracking, model registry, feature stores, and model serving.

---

## 1. Experiment Tracking and Model Registry

### MLflow

**What it is:** Open-source, self-hosted experiment tracker and model registry. The
most widely deployed option in on-premise and multi-cloud environments.

**Strengths:**
- No vendor lock-in; runs anywhere (local, Kubernetes, Databricks-managed)
- Native support for sklearn, PyTorch, TensorFlow, XGBoost, HuggingFace, and more
- Unified API: tracking + registry + model serving (MLflow Models) in one library
- Strong community; integrations with most ML frameworks

**Weaknesses:**
- UI is functional but not polished; limited collaboration features
- Managed hosting options (Databricks) require a Databricks subscription
- Scaling the tracking server and artifact store is your problem on self-hosted

**Best for:** Teams that need full data sovereignty, multi-cloud flexibility, or are
already on Databricks.

```python
# Minimal MLflow tracking example
import mlflow

with mlflow.start_run():
    mlflow.log_param("lr", 0.001)
    mlflow.log_metric("val_loss", 0.234)
    mlflow.pytorch.log_model(model, "model")
```

---

### Weights & Biases (W&B)

**What it is:** Fully managed experiment tracking, artifact versioning, and
collaboration platform. SaaS-first with a strong focus on team workflows.

**Strengths:**
- Best-in-class UI: interactive charts, side-by-side run comparisons, reports
- Artifacts API handles datasets, models, and arbitrary files with lineage tracking
- W&B Sweeps: built-in hyperparameter search with Bayesian/grid/random strategies
- W&B Launch: submit training jobs to cloud compute from within W&B
- Strong for research teams and teams that collaborate on experiments heavily

**Weaknesses:**
- SaaS only (W&B Server for self-hosted is a separate, expensive enterprise SKU)
- Data leaves your environment unless using the enterprise deployment
- Pricing scales with data ingestion and seats

**Best for:** Research-heavy teams, ML teams that do a lot of collaborative
experiment analysis, or startups comfortable with SaaS.

```python
import wandb

wandb.init(project="fraud-detection", config={"lr": 0.001})
wandb.log({"train_loss": loss, "val_auc": auc})
wandb.finish()
```

---

### Vertex AI (Google Cloud)

**What it is:** Google Cloud's fully managed MLOps platform. Covers experiment
tracking (Vertex Experiments), model registry, pipelines (Vertex Pipelines), and
serving (Vertex AI Endpoints).

**Strengths:**
- Fully managed: no infra to operate; scales automatically
- Tight integration with BigQuery (feature store, training data), GCS, and Dataflow
- Vertex AI Pipelines is built on Kubeflow Pipelines - portable, container-native
- Vertex Feature Store handles online/offline serving natively
- Strong for teams already on GCP with large data in BigQuery

**Weaknesses:**
- GCP lock-in; difficult to migrate off
- Vertex Experiments tracking is less mature than MLflow or W&B
- Cost unpredictability; managed endpoints can be expensive at low usage
- Less flexible for custom training environments compared to self-hosted

**Best for:** Teams on GCP, especially those with data already in BigQuery and who
want to minimize infra management.

---

### Amazon SageMaker (AWS)

**What it is:** AWS's fully managed ML platform. Covers experiment tracking
(SageMaker Experiments), model registry, pipelines (SageMaker Pipelines), and
serving (SageMaker Endpoints).

**Strengths:**
- Deepest managed training infrastructure: managed spot instances, distributed
  training, automatic model tuning (hyperparameter optimization)
- SageMaker Feature Store: online + offline with point-in-time correct queries
- Tight integration with S3, Glue, Redshift, and AWS ecosystem
- SageMaker Model Monitor: built-in data quality and drift monitoring
- Most mature managed MLOps platform (longest track record)

**Weaknesses:**
- AWS lock-in; SageMaker SDK is verbose and AWS-specific
- Steep learning curve; abstraction layers can obscure what's actually happening
- Pipelines DSL is more constrained than Kubeflow/Argo
- Cost management is complex; easy to incur charges from idle endpoints

**Best for:** Teams deeply invested in AWS infrastructure who want managed training
and serving without managing Kubernetes.

---

### Head-to-Head Comparison

| Capability | MLflow | W&B | Vertex AI | SageMaker |
|---|---|---|---|---|
| Experiment tracking | Excellent | Excellent | Good | Good |
| Model registry | Good | Good | Good | Excellent |
| Pipeline orchestration | Basic (Projects) | Limited | Good (KFP) | Good |
| Feature store | None (use Feast) | None | Native | Native |
| Model serving | Basic (MLflow Models) | None | Native | Native |
| Drift monitoring | None (use Evidently) | None | Basic | Good (Model Monitor) |
| Collaboration UI | Basic | Best | Good | Basic |
| Vendor lock-in | None | SaaS | GCP | AWS |
| Self-hosted option | Yes | Enterprise | No | No |
| Cost model | OSS + infra | Per seat/usage | Per usage | Per usage |

---

## 2. Feature Stores

Feature stores are specialized. The right choice depends on scale, latency
requirements, and cloud affinity.

### Feast (Open Source)

**What it is:** The leading open-source feature store. Orchestrates feature
computation, stores features in online/offline stores of your choice, and handles
point-in-time correct retrieval.

**Strengths:**
- Cloud-agnostic; works with any online store (Redis, DynamoDB, Cassandra) and
  offline store (BigQuery, Snowflake, Redshift, Parquet)
- Strong community; actively maintained by Tecton alumni and community
- Point-in-time correct historical retrieval with `get_historical_features`
- Declarative feature definitions in Python

**Weaknesses:**
- No managed option; you operate everything
- Feature transformation is compute-agnostic (you bring Spark/dbt), Feast only
  manages storage and retrieval
- Monitoring and feature quality checks require external tooling

```python
from feast import FeatureStore

store = FeatureStore(repo_path=".")

# Offline retrieval for training (point-in-time correct)
training_df = store.get_historical_features(
    entity_df=events_df,
    features=["user_stats:30d_spend", "user_stats:country"]
).to_df()

# Online retrieval for serving (low-latency)
feature_vector = store.get_online_features(
    features=["user_stats:30d_spend", "user_stats:country"],
    entity_rows=[{"user_id": "u-123"}]
).to_dict()
```

---

### Tecton

**What it is:** Fully managed feature platform built by the team that created Uber's
Michelangelo feature store. The most capable commercial feature store option.

**Strengths:**
- Manages the full feature lifecycle: definition, computation, storage, serving,
  monitoring, and lineage
- Supports batch, streaming (Spark Streaming, Flink), and real-time feature pipelines
- Built-in feature monitoring, data quality, and SLOs
- Point-in-time correct historical retrieval

**Weaknesses:**
- Most expensive option; pricing is not public
- Vendor lock-in (though feature definitions are Python)
- Overkill for small teams or simple feature sets

**Best for:** Enterprise ML teams with complex real-time feature requirements and
budget for a managed platform.

---

### Vertex AI Feature Store

**Best for:** Teams already on GCP who want zero infra management. Online serving
uses Bigtable under the hood. Point-in-time queries against BigQuery offline store.
Limitation: GCP lock-in, and the API is more constrained than Feast or Tecton.

### SageMaker Feature Store

**Best for:** Teams on AWS. Tight integration with SageMaker training jobs. Online
store backed by DynamoDB, offline store in S3 + Glue catalog. Limitation: AWS
lock-in, and feature transformation must happen outside the feature store.

---

### Feature Store Comparison

| Capability | Feast | Tecton | Vertex Feature Store | SageMaker Feature Store |
|---|---|---|---|---|
| Managed | No | Yes | Yes | Yes |
| Real-time features | Via Redis/Cassandra | Yes (streaming) | Limited | Limited |
| Point-in-time correct | Yes | Yes | Yes | Yes |
| Built-in monitoring | No | Yes | Basic | Basic |
| Cloud agnostic | Yes | Mostly | No (GCP) | No (AWS) |
| Cost | Infra only | Enterprise | Per usage | Per usage |

---

## 3. Model Serving

### Frameworks

| Tool | Type | Best for |
|---|---|---|
| **BentoML** | Framework | Packaging any model as a containerized service; strong for custom logic |
| **Seldon Core** | Kubernetes-native | Complex serving graphs, A/B testing, explainability on K8s |
| **KServe** | Kubernetes-native | Standard model serving on K8s; successor to KFServing |
| **Ray Serve** | Python-native | High-throughput, composable serving; integrates with Ray training |
| **TorchServe** | PyTorch-specific | Serving PyTorch models with batching and versioning |
| **TF Serving** | TF-specific | Serving TensorFlow SavedModels at scale |

### Managed Endpoints

| Platform | Managed serving option | Key feature |
|---|---|---|
| GCP | Vertex AI Endpoints | Auto-scaling, traffic split for A/B, built-in monitoring |
| AWS | SageMaker Endpoints | Real-time + batch transform, auto-scaling, Model Monitor |
| Azure | Azure ML Online Endpoints | Managed K8s-backed, traffic split |
| Self-hosted | Seldon + KServe | Full control, cloud-agnostic |

### Serving Decision Flowchart

```
Do you need real-time (<100ms) predictions?
  NO  -> Batch prediction job (BigQuery ML, SageMaker Batch Transform)
  YES -> What is your latency SLA?
    >200ms  -> REST endpoint (BentoML, Flask, FastAPI)
    <50ms   -> Consider feature pre-computation + cached lookup
    gRPC?   -> KServe / Seldon for gRPC protocol support

Are you on a cloud provider?
  GCP -> Vertex AI Endpoint (easiest path)
  AWS -> SageMaker Endpoint
  Azure -> Azure ML Endpoint
  Multi-cloud / on-prem -> BentoML + Kubernetes (KServe)
```

---

## 4. Drift Monitoring Tools

| Tool | What it monitors | Integration |
|---|---|---|
| **Evidently AI** | Data drift, prediction drift, data quality; generates HTML reports | OSS, works with any serving setup |
| **WhyLabs** | Statistical profiles, data quality, model performance | Managed SaaS with OSS SDK (whylogs) |
| **Arize AI** | Model performance, drift, explainability | Managed SaaS |
| **SageMaker Model Monitor** | Data quality, model quality, bias, feature attribution drift | AWS-native only |
| **Vertex AI Model Monitoring** | Feature skew and drift detection | GCP-native only |

**Recommendation for most teams:** Start with Evidently AI (OSS) for data and
prediction drift. It generates shareable HTML reports and integrates with any
serving infrastructure. Move to WhyLabs or Arize when you need a managed dashboard
and alerting at scale.

```python
# Evidently drift report example
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=training_df, current_data=production_batch_df)
report.save_html("drift_report.html")
```

---

## 5. Summary: Recommended Stack by Team Size

### Small team (1-5 ML engineers), startup

- Experiment tracking: **MLflow** (self-hosted on a cheap VM or Databricks Community)
- Feature store: **Skip it** - use a shared Pandas utility library until you have
  >5 features reused across models
- Model serving: **BentoML** or a simple FastAPI container
- Monitoring: **Evidently AI** scheduled batch reports

### Mid-size team (5-20 ML engineers), growth company

- Experiment tracking: **W&B** (collaboration features pay off at this size)
- Feature store: **Feast** + Redis (online) + Snowflake/BigQuery (offline)
- Model serving: **Kubernetes + KServe** or **Vertex AI / SageMaker** endpoints
- Monitoring: **WhyLabs** or **Evidently** with automated alerting

### Large team (20+ ML engineers), enterprise

- Experiment tracking: **MLflow on Databricks** or **W&B Enterprise**
- Feature store: **Tecton** or **SageMaker Feature Store** (if AWS)
- Model serving: **Seldon Core** or managed cloud endpoints with traffic splits
- Monitoring: **Arize AI** or **WhyLabs** with SLO-based alerting
