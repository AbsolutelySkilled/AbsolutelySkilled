<!-- Part of the data-warehousing AbsolutelySkilled skill. Load this file when
     working with Snowflake-specific warehouse features. -->

# Snowflake Patterns

## Architecture overview

Snowflake separates storage, compute, and services into three independent layers. Storage
is managed in a columnar format on cloud object storage. Compute is provided by virtual
warehouses (clusters of nodes) that can be resized, suspended, and resumed independently.
The services layer handles authentication, metadata, query parsing, and optimization.

This separation means you can scale compute without affecting storage costs and vice versa.

---

## Virtual warehouses

### Sizing guidelines

| Size | Credits/hr | Best for |
|---|---|---|
| X-Small | 1 | Development, light queries |
| Small | 2 | Single-user analytics, small ETL |
| Medium | 4 | Team analytics, moderate ETL |
| Large | 8 | Complex joins on large tables |
| X-Large+ | 16+ | Heavy ETL, large data loads |

### Multi-cluster warehouses

```sql
-- Auto-scale for concurrent query load
ALTER WAREHOUSE analytics_wh SET
  WAREHOUSE_SIZE = 'MEDIUM'
  MIN_CLUSTER_COUNT = 1
  MAX_CLUSTER_COUNT = 3
  SCALING_POLICY = 'STANDARD'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;
```

**Best practice**: Separate warehouses for ETL (`etl_wh`) and analytics (`analytics_wh`)
to prevent loading jobs from starving interactive queries.

---

## Clustering keys

Snowflake micro-partitions store data in 50-500 MB compressed blocks. Clustering keys
control how data is organized within these partitions.

```sql
-- Cluster by the most common filter columns (left to right = most selective)
ALTER TABLE fct_sales CLUSTER BY (date_sk, region);

-- Check clustering quality
SELECT SYSTEM$CLUSTERING_INFORMATION('fct_sales');
-- average_depth close to 1 = well clustered
-- average_depth > 5 = needs reclustering

-- Snowflake automatically reclusters in the background (costs credits)
-- Monitor with:
SELECT * FROM TABLE(INFORMATION_SCHEMA.AUTOMATIC_CLUSTERING_HISTORY(
  TABLE_NAME => 'fct_sales',
  DATE_RANGE_START => DATEADD(DAY, -7, CURRENT_DATE())
));
```

**When to cluster**: Tables > 1 TB with predictable filter patterns. Do not cluster
small tables - the overhead exceeds the benefit.

---

## Time travel and fail-safe

```sql
-- Query data as it existed 30 minutes ago
SELECT * FROM fct_sales AT(OFFSET => -1800);

-- Query data as it existed at a specific timestamp
SELECT * FROM fct_sales AT(TIMESTAMP => '2026-03-13 10:00:00'::TIMESTAMP);

-- Restore a dropped table
UNDROP TABLE fct_sales;

-- Set retention period (default 1 day; Enterprise edition: up to 90 days)
ALTER TABLE fct_sales SET DATA_RETENTION_TIME_IN_DAYS = 30;
```

> Time travel storage is billed separately. Set retention to the minimum you need for
> operational recovery. Fail-safe adds 7 days of additional protection beyond the
> retention period but is not user-accessible - Snowflake support must restore it.

---

## Zero-copy cloning

```sql
-- Clone an entire database for development (instant, no storage cost until divergence)
CREATE DATABASE dev_warehouse CLONE prod_warehouse;

-- Clone a single table
CREATE TABLE fct_sales_test CLONE fct_sales;

-- Clone at a point in time (combines with time travel)
CREATE TABLE fct_sales_snapshot CLONE fct_sales
  AT(TIMESTAMP => '2026-03-13 08:00:00'::TIMESTAMP);
```

Clones share the underlying micro-partitions. Storage cost only accrues when data in the
clone diverges from the source. Use clones for safe testing of schema changes and ETL.

---

## Streams and tasks (CDC pipeline)

Streams capture change data on tables. Tasks schedule SQL execution.

```sql
-- Create a stream to track changes on the staging table
CREATE STREAM stg_customers_stream ON TABLE staging_customers;

-- Create a task to process changes every 5 minutes
CREATE TASK scd2_customer_task
  WAREHOUSE = etl_wh
  SCHEDULE = '5 MINUTE'
  WHEN SYSTEM$STREAM_HAS_DATA('stg_customers_stream')
AS
  MERGE INTO dim_customer AS target
  USING stg_customers_stream AS source
    ON target.customer_id = source.customer_id
       AND target.is_current = TRUE
  WHEN MATCHED
    AND (target.segment != source.segment
      OR target.region  != source.region)
  THEN UPDATE SET
    expiry_date = CURRENT_DATE - 1,
    is_current  = FALSE
  WHEN NOT MATCHED THEN INSERT (
    customer_sk, customer_id, name, segment, region,
    effective_date, expiry_date, is_current
  ) VALUES (
    dim_customer_seq.NEXTVAL,
    source.customer_id, source.name, source.segment, source.region,
    CURRENT_DATE, '9999-12-31', TRUE
  );

-- Resume the task (tasks are created in suspended state)
ALTER TASK scd2_customer_task RESUME;
```

---

## Stages and data loading

```sql
-- External stage pointing to S3
CREATE STAGE s3_raw_data
  URL = 's3://my-bucket/raw/'
  STORAGE_INTEGRATION = my_s3_integration
  FILE_FORMAT = (TYPE = 'PARQUET');

-- List files in stage
LIST @s3_raw_data;

-- COPY INTO for bulk loading (most efficient method)
COPY INTO staging_customers
FROM @s3_raw_data/customers/
  FILE_FORMAT = (TYPE = 'PARQUET')
  MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE;

-- Snowpipe for continuous loading (serverless, event-driven)
CREATE PIPE customer_pipe
  AUTO_INGEST = TRUE
AS
COPY INTO staging_customers
FROM @s3_raw_data/customers/
  FILE_FORMAT = (TYPE = 'PARQUET');
```

---

## Cost optimization checklist

1. **Auto-suspend all warehouses** at 60 seconds (or 300 for heavy workloads)
2. **Use resource monitors** to set credit quotas per warehouse per month
3. **Cluster only large tables** (> 1 TB) with clear filter patterns
4. **Minimize time travel retention** to what you actually need
5. **Use transient tables** for staging/temp data (no fail-safe, lower storage cost)
6. **Monitor with ACCOUNT_USAGE** views: `WAREHOUSE_METERING_HISTORY`,
   `STORAGE_USAGE`, `QUERY_HISTORY`
