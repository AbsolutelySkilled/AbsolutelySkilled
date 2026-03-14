<!-- Part of the data-warehousing AbsolutelySkilled skill. Load this file when
     working with BigQuery-specific warehouse features. -->

# BigQuery Patterns

## Architecture overview

BigQuery is a serverless columnar warehouse. There are no clusters to manage - you submit
SQL and Google allocates compute automatically. Storage and compute are decoupled.
Pricing is either **on-demand** (per TB scanned) or **capacity-based** (reserved slots).
All data is stored in Capacitor columnar format, replicated across zones.

---

## Pricing models

| Model | How it works | Best for |
|---|---|---|
| On-demand | $6.25/TB scanned (first 1 TB/month free) | Exploration, low-volume analytics |
| Standard edition | $0.04/slot-hour (autoscaled) | Predictable workloads |
| Enterprise edition | $0.06/slot-hour (with advanced features) | Large orgs needing governance |

**Key insight**: On-demand charges are based on bytes scanned, not rows returned. A
`SELECT *` on a 500 GB table costs ~$3.13 even if the result is 10 rows. Partitioning
and clustering directly reduce bytes scanned and therefore cost.

---

## Partitioning

```sql
-- Partition by date column (most common)
CREATE TABLE `project.dataset.fct_events`
(
  event_id    STRING    NOT NULL,
  event_date  DATE      NOT NULL,
  user_id     STRING    NOT NULL,
  event_type  STRING    NOT NULL,
  properties  JSON
)
PARTITION BY event_date
OPTIONS (
  partition_expiration_days = 365,  -- auto-delete old partitions
  require_partition_filter = TRUE   -- prevent full scans
);

-- Partition by ingestion time (when source has no reliable date column)
CREATE TABLE `project.dataset.fct_raw_events`
(
  payload STRING
)
PARTITION BY _PARTITIONDATE;

-- Integer range partitioning
CREATE TABLE `project.dataset.fct_transactions`
(
  txn_id      INT64,
  customer_id INT64,
  amount      NUMERIC
)
PARTITION BY RANGE_BUCKET(customer_id, GENERATE_ARRAY(0, 10000000, 100000));
```

> `require_partition_filter = TRUE` is a guardrail that prevents queries without a
> partition filter from running. Use it on all large fact tables.

---

## Clustering

```sql
-- Cluster by up to 4 columns (order matters: most filtered first)
CREATE TABLE `project.dataset.fct_sales`
(
  sale_date    DATE      NOT NULL,
  region       STRING    NOT NULL,
  customer_id  STRING    NOT NULL,
  product_id   STRING    NOT NULL,
  amount       NUMERIC   NOT NULL
)
PARTITION BY sale_date
CLUSTER BY region, customer_id;

-- BigQuery auto-reclusters in the background at no cost
-- Unlike Snowflake, there is no manual recluster command
```

**Clustering column selection**: Choose columns that appear frequently in WHERE clauses,
JOIN conditions, or GROUP BY. High-cardinality columns (like `customer_id`) benefit most.

---

## Nested and repeated fields (STRUCT and ARRAY)

BigQuery natively supports nested data, which avoids joins.

```sql
-- Schema with nested and repeated fields
CREATE TABLE `project.dataset.orders_nested`
(
  order_id    STRING NOT NULL,
  order_date  DATE   NOT NULL,
  customer    STRUCT<
    id        STRING,
    name      STRING,
    segment   STRING
  >,
  items       ARRAY<STRUCT<
    product_id STRING,
    quantity   INT64,
    unit_price NUMERIC
  >>
);

-- Query nested fields with dot notation
SELECT
  order_id,
  customer.name,
  customer.segment
FROM `project.dataset.orders_nested`
WHERE order_date = '2026-03-14';

-- Unnest arrays to flatten
SELECT
  o.order_id,
  item.product_id,
  item.quantity * item.unit_price AS line_total
FROM `project.dataset.orders_nested` o,
  UNNEST(o.items) AS item;
```

> Use nested/repeated fields when the child data is always accessed with the parent.
> This eliminates join costs and scans less data. Do not use when the child needs
> independent access patterns (keep it as a separate table).

---

## Materialized views

```sql
CREATE MATERIALIZED VIEW `project.dataset.mv_daily_revenue`
AS
SELECT
  sale_date,
  region,
  SUM(amount)  AS total_revenue,
  COUNT(*)     AS txn_count
FROM `project.dataset.fct_sales`
GROUP BY sale_date, region;

-- BigQuery automatically uses the MV when it can answer a query
-- No need to query the MV directly (smart tuning / automatic rewriting)

-- Refresh is automatic and incremental
-- Force refresh if needed:
CALL BQ.REFRESH_MATERIALIZED_VIEW('project.dataset.mv_daily_revenue');
```

Limitations: MVs cannot use non-deterministic functions, OUTER JOINs, or window
functions. They work best for simple aggregations on partitioned/clustered tables.

---

## BI Engine

BI Engine is an in-memory analysis service that accelerates queries from BI tools
(Looker, Data Studio, Tableau). Reserve BI Engine capacity in the BigQuery console.

- Queries that fit in the BI Engine reservation are served from memory (~1 second)
- No code changes needed - it transparently accelerates compatible queries
- Best for dashboards with repetitive query patterns on a stable dataset

---

## Scheduled queries

```sql
-- Schedule a daily aggregation (runs as a scheduled query in BigQuery UI or API)
-- In the BigQuery console: More > Schedule > set schedule

-- Or via bq CLI:
-- bq mk --transfer_config \
--   --project_id=myproject \
--   --data_source=scheduled_query \
--   --target_dataset=dataset \
--   --display_name='Daily Sales Agg' \
--   --schedule='every 24 hours' \
--   --params='{"query":"INSERT INTO dataset.daily_sales SELECT ..."}'
```

---

## Federated queries

Query external data without loading it into BigQuery.

```sql
-- Query Cloud SQL (PostgreSQL) directly from BigQuery
SELECT * FROM EXTERNAL_QUERY(
  'projects/myproject/locations/us/connections/my-cloudsql',
  'SELECT id, email, created_at FROM users WHERE created_at > NOW() - INTERVAL 1 DAY'
);

-- External tables over Cloud Storage (Parquet, CSV, JSON)
CREATE EXTERNAL TABLE `project.dataset.ext_events`
  OPTIONS (
    format = 'PARQUET',
    uris = ['gs://my-bucket/events/*.parquet']
  );
```

> Federated queries are slower than native tables. Use them for ad-hoc exploration
> or infrequent joins with external systems. For regular analytics, load data into
> BigQuery native tables.

---

## Cost optimization checklist

1. **Always partition** fact tables by date and set `require_partition_filter = TRUE`
2. **Cluster** by top 2-4 filter/group columns
3. **Avoid SELECT ***; list only needed columns (columnar storage = less scan)
4. **Use dry runs** (`bq query --dry_run`) to estimate cost before executing
5. **Set custom cost controls** in project settings (max bytes billed per query)
6. **Monitor with INFORMATION_SCHEMA.JOBS** to find expensive queries
7. **Consider editions pricing** when monthly spend exceeds ~$2,000 on-demand
8. **Use table expiration** and partition expiration to auto-delete old data
