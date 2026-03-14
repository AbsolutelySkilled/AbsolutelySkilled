<!-- Part of the data-pipelines AbsolutelySkilled skill. Load this file when
     working with Airflow DAG design, sensors, dynamic DAGs, or backfill strategies. -->

# Airflow Patterns

## DAG design principles

### Keep DAGs thin

The DAG file should define orchestration only - scheduling, dependencies, and retries.
Business logic belongs in external modules, dbt projects, or Spark jobs that the DAG
calls. This makes testing possible and prevents import-time side effects.

```python
# Good: DAG calls an external function
extract = PythonOperator(
    task_id="extract",
    python_callable=extract_module.run,  # logic lives elsewhere
    op_kwargs={"date": "{{ ds }}"},
)

# Bad: Business logic inline in the DAG file
extract = PythonOperator(
    task_id="extract",
    python_callable=lambda: pd.read_sql("SELECT * FROM orders", engine),
)
```

### Task granularity

Each task should be:
- **Idempotent** - safe to re-run without side effects
- **Atomic** - either fully succeeds or fully fails (no partial state)
- **Observable** - produces logs and metrics that indicate success or failure

Split tasks when they have different retry profiles or SLAs. Merge tasks when
the overhead of XCom or intermediate storage exceeds the benefit of granularity.

### Naming conventions

```
dag_id:   <team>_<domain>_<frequency>    e.g. data_orders_daily
task_id:  <verb>_<noun>                  e.g. extract_orders, test_row_counts
```

## Template variables

Use Jinja templates for date-aware, idempotent pipelines:

| Variable | Example value | Use for |
|---|---|---|
| `{{ ds }}` | `2024-01-15` | Partition keys, WHERE clauses |
| `{{ ds_nodash }}` | `20240115` | File paths, table suffixes |
| `{{ data_interval_start }}` | `2024-01-15T00:00:00+00:00` | Precise time ranges |
| `{{ data_interval_end }}` | `2024-01-16T00:00:00+00:00` | Exclusive upper bound |
| `{{ prev_ds }}` | `2024-01-14` | Referencing previous partition |

> Never use `datetime.now()` in a DAG. It breaks idempotency and makes backfills
> produce wrong results. Always use template variables.

## Sensor patterns

Sensors wait for external conditions before proceeding. Use them sparingly -
they consume a worker slot while waiting.

```python
from airflow.sensors.external_task import ExternalTaskSensor
from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor

# Wait for upstream DAG to complete
wait_for_ingestion = ExternalTaskSensor(
    task_id="wait_for_ingestion",
    external_dag_id="data_ingestion_hourly",
    external_task_id="load_complete",
    mode="reschedule",  # releases worker slot between checks
    timeout=3600,
    poke_interval=120,
)

# Wait for file to appear in S3
wait_for_file = S3KeySensor(
    task_id="wait_for_file",
    bucket_key="s3://data-lake/orders/{{ ds_nodash }}/*.parquet",
    mode="reschedule",
    timeout=7200,
)
```

> Always use `mode="reschedule"` for sensors in production. The default
> `mode="poke"` holds a worker slot for the entire wait duration.

## Dynamic DAGs

Generate tasks dynamically when the number of partitions or tables varies:

```python
tables = ["orders", "customers", "products", "inventory"]

with DAG(dag_id="ingest_all_tables", ...) as dag:
    start = EmptyOperator(task_id="start")
    end = EmptyOperator(task_id="end")

    for table in tables:
        extract = PythonOperator(
            task_id=f"extract_{table}",
            python_callable=extract_table,
            op_kwargs={"table": table, "ds": "{{ ds }}"},
        )
        load = PythonOperator(
            task_id=f"load_{table}",
            python_callable=load_to_warehouse,
            op_kwargs={"table": table},
        )
        start >> extract >> load >> end
```

For truly dynamic workloads (number of tasks unknown at DAG parse time), use
Airflow's `@task.expand()` (dynamic task mapping) in Airflow 2.3+:

```python
@task
def get_partitions(ds=None):
    return ["2024-01-01", "2024-01-02", "2024-01-03"]

@task
def process_partition(partition):
    # process one partition
    pass

with DAG(...) as dag:
    partitions = get_partitions()
    process_partition.expand(partition=partitions)
```

## Backfill strategies

### When to backfill

- Schema change in the source that affects historical data
- Bug fix in transformation logic
- New column or metric added to an existing model

### How to backfill safely

1. Set `catchup=True` temporarily or use `airflow dags backfill`
2. Ensure all tasks are idempotent (re-running a date overwrites, not appends)
3. Throttle with `max_active_runs` to avoid overwhelming the warehouse
4. Monitor for data quality regressions in downstream tables

```bash
# Backfill a specific date range
airflow dags backfill \
    --start-date 2024-01-01 \
    --end-date 2024-01-31 \
    --reset-dagruns \
    daily_orders_pipeline
```

> Set `max_active_runs=3` (or lower) during backfills. Running 365 days
> simultaneously will overwhelm your warehouse and Airflow scheduler.

## Common Airflow pitfalls

| Pitfall | Fix |
|---|---|
| Top-level imports in DAG file slow scheduler | Use lazy imports inside callables |
| XCom for large data (>48KB default) | Use external storage (S3/GCS), pass URI via XCom |
| No `execution_timeout` on tasks | Set timeout to prevent zombie tasks |
| Using `depends_on_past=True` carelessly | Blocks entire pipeline if one run fails |
| Not setting `sla` on critical tasks | Add SLA miss callbacks for alerting |
