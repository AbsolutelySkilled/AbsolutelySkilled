<!-- Part of the data-pipelines AbsolutelySkilled skill. Load this file when
     working with dbt model design, macros, packages, or CI/CD for dbt. -->

# dbt Patterns

## Model layering

Structure every dbt project in three layers. This is not optional - it is the
standard that prevents spaghetti SQL and enables maintainability.

### Staging layer (`models/staging/`)

- One model per source table (1:1 mapping)
- Only light transformations: renaming, casting, timezone conversion
- Materialized as `view` (cheap, always fresh)
- Naming: `stg_<source>__<table>.sql` (double underscore separates source from table)

```sql
-- models/staging/stripe/stg_stripe__payments.sql
with source as (
    select * from {{ source('stripe', 'payments') }}
),

renamed as (
    select
        id as payment_id,
        customer_id,
        cast(amount as decimal(10,2)) / 100 as amount_dollars,
        currency,
        status,
        cast(created as timestamp) as created_at
    from source
)

select * from renamed
```

### Intermediate layer (`models/intermediate/`)

- Business logic: joins, deduplication, window functions, enrichment
- Materialized as `view` or `ephemeral` (no warehouse cost unless needed)
- Naming: `int_<entity>_<verb>.sql` (e.g. `int_orders_enriched.sql`)

```sql
-- models/intermediate/int_orders_enriched.sql
with orders as (
    select * from {{ ref('stg_raw__orders') }}
),

customers as (
    select * from {{ ref('stg_raw__customers') }}
),

enriched as (
    select
        o.order_id,
        o.ordered_at,
        o.order_total,
        c.customer_name,
        c.customer_segment,
        row_number() over (
            partition by o.customer_id order by o.ordered_at
        ) as order_sequence_number
    from orders o
    left join customers c on o.customer_id = c.customer_id
)

select * from enriched
```

### Marts layer (`models/marts/`)

- Consumer-facing tables (dashboards, APIs, ML features)
- Materialized as `table` or `incremental`
- Split into fact tables (`fct_`) and dimension tables (`dim_`)
- Naming: `fct_<metric>.sql` or `dim_<entity>.sql`

```sql
-- models/marts/fct_daily_revenue.sql
{{
  config(
    materialized='incremental',
    unique_key='revenue_date',
    on_schema_change='sync_all_columns'
  )
}}

with enriched_orders as (
    select * from {{ ref('int_orders_enriched') }}
    {% if is_incremental() %}
    where ordered_at > (select max(revenue_date) from {{ this }})
    {% endif %}
)

select
    date_trunc('day', ordered_at) as revenue_date,
    customer_segment,
    count(*) as order_count,
    sum(order_total) as total_revenue,
    avg(order_total) as avg_order_value
from enriched_orders
group by 1, 2
```

## Incremental strategies

| Strategy | When to use | Config |
|---|---|---|
| `append` | Insert-only tables (events, logs) | `incremental_strategy='append'` |
| `merge` | Tables with updates (orders, users) | `incremental_strategy='merge', unique_key='id'` |
| `delete+insert` | Partition-level replacement | `incremental_strategy='delete+insert', unique_key='date'` |
| `insert_overwrite` | Large partitioned tables (Spark/Hive) | `incremental_strategy='insert_overwrite'` |

> Always set `on_schema_change` for incremental models. Options: `ignore` (default,
> dangerous), `append_new_columns`, `sync_all_columns`, `fail`.

## Testing

### Schema tests (in `schema.yml`)

```yaml
models:
  - name: fct_daily_revenue
    description: Daily revenue aggregated by customer segment
    columns:
      - name: revenue_date
        tests:
          - not_null
          - unique
      - name: total_revenue
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
      - name: customer_segment
        tests:
          - not_null
          - accepted_values:
              values: ['enterprise', 'mid_market', 'smb', 'consumer']
```

### Custom data tests (in `tests/`)

```sql
-- tests/assert_revenue_not_negative.sql
select revenue_date, total_revenue
from {{ ref('fct_daily_revenue') }}
where total_revenue < 0
```

If this query returns any rows, the test fails.

### Source freshness

```yaml
sources:
  - name: raw
    freshness:
      warn_after: { count: 12, period: hour }
      error_after: { count: 24, period: hour }
    loaded_at_field: _loaded_at
    tables:
      - name: orders
      - name: customers
```

Run with `dbt source freshness` to check whether upstream data is stale.

## Useful macros

### Generate surrogate keys

```sql
-- uses dbt_utils package
select
    {{ dbt_utils.generate_surrogate_key(['order_id', 'line_item_id']) }} as order_line_key,
    *
from {{ ref('stg_raw__order_lines') }}
```

### Pivot columns

```sql
select
    customer_id,
    {{ dbt_utils.pivot(
        'order_status',
        dbt_utils.get_column_values(ref('stg_raw__orders'), 'order_status')
    ) }}
from {{ ref('stg_raw__orders') }}
group by 1
```

## Essential packages

| Package | What it provides |
|---|---|
| `dbt-utils` | Surrogate keys, pivots, date spine, accepted_range tests |
| `dbt-expectations` | Great Expectations-style tests in dbt |
| `dbt-audit-helper` | Compare model results between dev and prod |
| `dbt-codegen` | Auto-generate staging models and schema YAML |

Install in `packages.yml`:

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.0.0", "<2.0.0"]
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<0.11.0"]
```

## CI/CD for dbt

### Slim CI (only test changed models)

```bash
# In CI pipeline after PR is opened
dbt run --select state:modified+ --state ./prod-manifest/
dbt test --select state:modified+ --state ./prod-manifest/
```

The `state:modified+` selector runs only models that changed and their downstream
dependents. The `--state` flag points to the production `manifest.json` for comparison.

### Pre-merge checklist

1. `dbt build --select state:modified+` passes
2. Source freshness checks pass
3. No new `<!-- VERIFY -->` comments without justification
4. Documentation updated for new models (`description` in schema.yml)
5. No direct references to source tables outside staging layer
