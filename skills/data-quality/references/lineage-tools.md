<!-- Part of the data-quality AbsolutelySkilled skill. Load this file when
     working with data lineage tools, comparing lineage solutions, or
     integrating lineage into pipelines. -->

# Lineage Tools Comparison and Integration

## Tool comparison

| Tool | Type | Column-level lineage | Hosted option | Best for |
|---|---|---|---|---|
| **OpenLineage** | Open standard/protocol | Yes (via facets) | No (protocol only) | Teams wanting vendor-neutral lineage events |
| **DataHub** | Metadata platform | Yes | Acryl Cloud | Full metadata management + lineage |
| **dbt lineage** | Built into dbt | Yes (via manifest) | dbt Cloud | Teams already using dbt |
| **Atlan** | Data catalog | Yes | SaaS only | Enterprise data governance |
| **Apache Atlas** | Metadata platform | Limited | No | Hadoop/Hive-centric environments |
| **Marquez** | Lineage server | Yes (via OpenLineage) | No | OpenLineage backend/UI |

## OpenLineage

OpenLineage is an open standard for lineage event collection. It defines a JSON schema
for run events that capture inputs, outputs, and job metadata. It is not a platform - it
is a protocol that platforms consume.

### Core event model

```
RunEvent {
  eventType: START | RUNNING | COMPLETE | FAIL | ABORT
  eventTime: ISO 8601 timestamp
  run: { runId: UUID }
  job: { namespace: string, name: string }
  inputs: [ InputDataset { namespace, name, facets } ]
  outputs: [ OutputDataset { namespace, name, facets } ]
}
```

### Native integrations

These tools emit OpenLineage events automatically when configured:

| Tool | Configuration |
|---|---|
| **Apache Airflow** | `pip install openlineage-airflow`, set `OPENLINEAGE_URL` env var |
| **Apache Spark** | Add `openlineage-spark` JAR to Spark conf, set `spark.openlineage.transport.url` |
| **dbt** | dbt 1.4+ emits OpenLineage events natively when `OPENLINEAGE_URL` is set |
| **Flink** | `openlineage-flink` plugin, configure via `flink-conf.yaml` |
| **Great Expectations** | OpenLineage action in checkpoint configuration |

### Setting up Marquez as an OpenLineage backend

Marquez is the reference implementation for collecting and serving OpenLineage events.

```bash
# Docker Compose quickstart
git clone https://github.com/MarquezProject/marquez.git
cd marquez
docker compose up -d

# Marquez API is at http://localhost:5000
# Marquez UI is at http://localhost:3000
```

```python
# Point your OpenLineage clients at Marquez
from openlineage.client import OpenLineageClient

client = OpenLineageClient(url="http://localhost:5000")
```

### Column-level lineage with facets

```python
from openlineage.client.facet_v2 import (
    column_lineage_dataset_facet,
)

output_facets = {
    "columnLineage": column_lineage_dataset_facet.ColumnLineageDatasetFacet(
        fields={
            "total_revenue": column_lineage_dataset_facet.ColumnLineageDatasetFacetFieldsAdditional(
                inputFields=[
                    column_lineage_dataset_facet.InputField(
                        namespace="warehouse",
                        name="raw.orders",
                        field="amount",
                    ),
                    column_lineage_dataset_facet.InputField(
                        namespace="warehouse",
                        name="raw.orders",
                        field="discount",
                    ),
                ],
                transformationDescription="SUM(amount - discount)",
                transformationType="AGGREGATION",
            )
        }
    )
}
```

## dbt lineage

dbt generates lineage automatically from `ref()` and `source()` calls in models.

### Accessing lineage from the manifest

```python
import json

with open("target/manifest.json") as f:
    manifest = json.load(f)

# Get all parents (upstream dependencies) of a model
model_key = "model.my_project.orders_summary"
node = manifest["nodes"][model_key]
parents = node["depends_on"]["nodes"]
print(f"Upstream dependencies: {parents}")

# Get all children (downstream dependents) of a model
children = manifest["child_map"].get(model_key, [])
print(f"Downstream dependents: {children}")
```

### Column-level lineage in dbt

dbt 1.6+ supports column-level lineage in dbt Cloud. For open-source dbt, use the
`dbt-column-lineage` package or parse SQL with `sqlglot`:

```python
import sqlglot
from sqlglot.lineage import lineage

# Parse a dbt model's compiled SQL to extract column lineage
sql = """
SELECT
    o.order_id,
    o.customer_id,
    SUM(oi.quantity * oi.unit_price) AS total_amount
FROM {{ ref('orders') }} o
JOIN {{ ref('order_items') }} oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.customer_id
"""

# After compiling (replacing refs with actual table names):
compiled_sql = sql.replace("{{ ref('orders') }}", "curated.orders")
compiled_sql = compiled_sql.replace("{{ ref('order_items') }}", "curated.order_items")

result = lineage("total_amount", compiled_sql, dialect="postgres")
for node in result.walk():
    print(f"  {node.name} <- {node.source.sql()}")
```

## DataHub

DataHub is a full metadata platform that includes lineage, data discovery, governance,
and observability.

### Emitting lineage to DataHub

```python
from datahub.emitter.rest_emitter import DatahubRestEmitter
from datahub.metadata.schema_classes import (
    DatasetLineageTypeClass,
    UpstreamClass,
    UpstreamLineageClass,
)

emitter = DatahubRestEmitter(gms_server="http://datahub-gms:8080")

upstream_lineage = UpstreamLineageClass(
    upstreams=[
        UpstreamClass(
            dataset="urn:li:dataset:(urn:li:dataPlatform:postgres,raw.orders,PROD)",
            type=DatasetLineageTypeClass.TRANSFORMED,
        ),
        UpstreamClass(
            dataset="urn:li:dataset:(urn:li:dataPlatform:postgres,raw.customers,PROD)",
            type=DatasetLineageTypeClass.TRANSFORMED,
        ),
    ]
)

emitter.emit_mce(
    {
        "proposedSnapshot": {
            "com.linkedin.pegasus2avro.metadata.snapshot.DatasetSnapshot": {
                "urn": "urn:li:dataset:(urn:li:dataPlatform:postgres,curated.order_summary,PROD)",
                "aspects": [upstream_lineage],
            }
        }
    }
)
```

### DataHub + Airflow integration

```bash
pip install acryl-datahub-airflow-plugin

# In airflow.cfg or env vars:
export AIRFLOW__DATAHUB__DATAHUB_REST_CONN_ID=datahub_rest_default
```

DataHub's Airflow plugin automatically captures lineage from `PostgresOperator`,
`BigQueryOperator`, and other SQL-based operators by parsing the SQL.

## Choosing a lineage tool

| If you... | Use |
|---|---|
| Already use dbt | Start with dbt's built-in lineage, add OpenLineage for non-dbt jobs |
| Need a full metadata platform | DataHub (open source) or Atlan (SaaS) |
| Want vendor-neutral events | OpenLineage + Marquez |
| Need column-level lineage across tools | DataHub or Atlan (most complete) |
| Have a Hadoop/Hive stack | Apache Atlas |

> Start with the simplest option that covers your current tools. Lineage is most
> valuable when it is complete - a partial lineage graph is worse than no lineage
> because it gives false confidence about impact analysis.
