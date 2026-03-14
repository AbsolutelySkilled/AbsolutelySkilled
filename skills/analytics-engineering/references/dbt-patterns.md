<!-- Part of the analytics-engineering AbsolutelySkilled skill. Load this file when
     working with advanced dbt patterns, macros, packages, hooks, custom
     materializations, or CI/CD integration. -->

# Advanced dbt Patterns

## Macros

Macros are reusable Jinja functions. Use them to DRY up repeated SQL patterns.

### Utility macro: cents to dollars

```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name, precision=2) %}
    round({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}
```

Usage in a model:

```sql
select
    order_id,
    amount_cents,
    {{ cents_to_dollars('amount_cents') }} as amount_dollars
from {{ ref('stg_stripe__payments') }}
```

### Generate schema name macro

Override the default schema naming to control where models land:

```sql
-- macros/generate_schema_name.sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}
        {{ default_schema }}
    {%- elif target.name == 'prod' -%}
        {{ custom_schema_name | trim }}
    {%- else -%}
        {{ default_schema }}_{{ custom_schema_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

This ensures `schema: finance` resolves to `finance` in prod but `dev_jsmith_finance`
in development - preventing dev runs from writing to production schemas.

### Pivot macro

```sql
-- macros/pivot.sql
{% macro pivot(column, values, alias=True, agg='sum', then_value=1, else_value=0) %}
    {% for value in values %}
        {{ agg }}(
            case when {{ column }} = '{{ value }}'
                then {{ then_value }}
                else {{ else_value }}
            end
        ) {% if alias %} as {{ column }}_{{ value | replace(' ', '_') | lower }} {% endif %}
        {% if not loop.last %},{% endif %}
    {% endfor %}
{% endmacro %}
```

---

## Essential packages

Add to `packages.yml`:

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.0.0", "<2.0.0"]
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<0.11.0"]
  - package: dbt-labs/codegen
    version: [">=0.12.0", "<0.13.0"]
```

### dbt_utils highlights

| Macro | Purpose |
|---|---|
| `surrogate_key(['col1', 'col2'])` | Generate deterministic hash keys for dimensions |
| `star(from=ref('model'), except=['col'])` | Select all columns except specified ones |
| `date_spine(datepart, start, end)` | Generate a continuous date dimension |
| `pivot(column, values, then_value)` | Pivot rows to columns |
| `union_relations([ref('a'), ref('b')])` | UNION ALL with column alignment |
| `accepted_range(min, max)` | Test that values fall within a range |
| `at_least_one` | Test that a column has at least one non-null value |

### dbt_expectations highlights

Statistical and distribution tests:

```yaml
columns:
  - name: amount_cents
    tests:
      - dbt_expectations.expect_column_values_to_be_between:
          min_value: 0
          max_value: 10000000
      - dbt_expectations.expect_column_mean_to_be_between:
          min_value: 1000
          max_value: 50000
```

---

## Hooks

### Pre-hook: grant access after model build

```yaml
# dbt_project.yml
models:
  my_project:
    marts:
      +post-hook:
        - "grant select on {{ this }} to role analyst_readonly"
```

### On-run-end: refresh BI cache

```yaml
on-run-end:
  - "{{ log('Run completed at ' ~ run_started_at, info=True) }}"
```

---

## Custom materializations

### Incremental with delete+insert strategy

For warehouses that do not support MERGE (e.g., Redshift without MERGE support):

```yaml
{{
    config(
        materialized='incremental',
        incremental_strategy='delete+insert',
        unique_key='event_id',
        on_schema_change='append_new_columns'
    )
}}
```

### Snapshot (SCD Type 2)

```sql
-- snapshots/snap_customers.sql
{% snapshot snap_customers %}
{{
    config(
        target_schema='snapshots',
        unique_key='customer_id',
        strategy='timestamp',
        updated_at='updated_at',
        invalidate_hard_deletes=True
    )
}}

select * from {{ source('shopify', 'customers') }}

{% endsnapshot %}
```

This creates `dbt_valid_from`, `dbt_valid_to`, and `dbt_updated_at` columns
automatically. A row with `dbt_valid_to IS NULL` is the current version.

---

## CI/CD integration

### Slim CI with state comparison

```bash
# Only run models that changed since last production run
dbt build --select state:modified+ --state ./prod-manifest/
```

### CI pipeline steps

```yaml
# .github/workflows/dbt-ci.yml (simplified)
steps:
  - name: Install deps
    run: dbt deps

  - name: Check source freshness
    run: dbt source freshness --target ci

  - name: Build changed models
    run: dbt build --select state:modified+ --state ./prod-manifest/ --target ci

  - name: Run all tests on changed models
    run: dbt test --select state:modified+ --state ci

  - name: Generate docs
    run: dbt docs generate
```

### Production run pattern

```bash
# Full refresh on schedule (weekly or as needed)
dbt build --full-refresh --target prod

# Daily incremental run
dbt build --target prod

# Source freshness check before build
dbt source freshness --target prod && dbt build --target prod
```

---

## Model selection syntax

| Selector | Meaning |
|---|---|
| `dbt run -s my_model` | Run one model |
| `dbt run -s my_model+` | Run model and all downstream |
| `dbt run -s +my_model` | Run model and all upstream |
| `dbt run -s +my_model+` | Run full lineage (upstream + downstream) |
| `dbt run -s tag:finance` | Run all models tagged "finance" |
| `dbt run -s path:models/marts/finance` | Run all models in a directory |
| `dbt run -s state:modified+` | Run changed models and downstream (CI) |
| `dbt run --exclude stg_legacy__*` | Run everything except legacy staging |

---

## Project configuration best practices

```yaml
# dbt_project.yml
name: my_analytics
version: '1.0.0'

profile: my_analytics

vars:
  my_analytics:
    start_date: '2020-01-01'

models:
  my_analytics:
    staging:
      +materialized: view
      +schema: staging
    intermediate:
      +materialized: ephemeral
    marts:
      +materialized: table
      +schema: analytics
      finance:
        +tags: ['finance', 'daily']
      marketing:
        +tags: ['marketing', 'daily']

seeds:
  my_analytics:
    +schema: seeds

snapshots:
  my_analytics:
    +target_schema: snapshots
```

Key rules:
- Staging as views (no warehouse cost, always fresh)
- Intermediate as ephemeral (inlined into downstream queries, no table created)
- Marts as tables (fast for analyst queries)
- Override per-folder when needed (e.g., a heavy intermediate that should be a table)
