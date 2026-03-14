<!-- Part of the analytics-engineering AbsolutelySkilled skill. Load this file when
     working with semantic layer configuration, MetricFlow, Cube, metrics
     definitions, or BI tool integration. -->

# Semantic Layer Deep Dive

## What is a semantic layer?

A semantic layer is a declarative abstraction between your data warehouse tables and
the consumers (BI tools, notebooks, APIs, LLM agents). It defines:

- **Entities** - the join keys and relationships between tables
- **Dimensions** - the columns you group by or filter on
- **Measures** - the aggregations (sum, count, average) applied to columns
- **Metrics** - business-level calculations composed from measures

The semantic layer compiles these definitions into optimized SQL at query time. Every
consumer gets the same metric logic, regardless of which tool they use.

---

## MetricFlow (dbt Semantic Layer)

MetricFlow is the engine behind the dbt Semantic Layer (dbt Cloud). It uses
`semantic_models` and `metrics` defined in YAML.

### Semantic model anatomy

```yaml
semantic_models:
  - name: orders
    description: "Order fact table"
    model: ref('fct_orders')
    defaults:
      agg_time_dimension: order_date

    entities:
      - name: order_id
        type: primary
      - name: customer_id
        type: foreign
      - name: product_id
        type: foreign

    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
      - name: status
        type: categorical
      - name: channel
        type: categorical

    measures:
      - name: order_count
        agg: count
        expr: order_id
        description: "Count of orders"
      - name: total_revenue
        agg: sum
        expr: total_amount_cents
        description: "Sum of order amounts in cents"
      - name: avg_order_value
        agg: average
        expr: total_amount_cents
```

### Entity types

| Type | Meaning | Example |
|---|---|---|
| `primary` | Unique identifier for this semantic model | `order_id` in orders |
| `foreign` | References a primary entity in another model | `customer_id` in orders |
| `unique` | Unique but not the primary grain | `email` in customers |
| `natural` | Non-unique identifier (used for joins) | `session_id` shared across events |

### Dimension types

| Type | Use for | Granularity options |
|---|---|---|
| `categorical` | String/enum columns you group by | N/A |
| `time` | Timestamp/date columns for time-series | `day`, `week`, `month`, `quarter`, `year` |

### Measure aggregation types

| Agg | SQL equivalent | Notes |
|---|---|---|
| `sum` | `SUM(expr)` | Most common for revenue, quantities |
| `count` | `COUNT(expr)` | Count of non-null values |
| `count_distinct` | `COUNT(DISTINCT expr)` | Unique customers, sessions |
| `average` | `AVG(expr)` | Use with caution - averages of averages are wrong |
| `min` / `max` | `MIN(expr)` / `MAX(expr)` | First/last dates, extremes |
| `median` | `PERCENTILE_CONT(0.5)` | Warehouse support varies |
| `sum_boolean` | `SUM(CASE WHEN expr THEN 1 ELSE 0 END)` | Count of true values |

---

## Metric types

### Simple metric

Direct reference to a single measure:

```yaml
metrics:
  - name: total_orders
    type: simple
    label: "Total Orders"
    description: "Count of all orders"
    type_params:
      measure: order_count
```

### Derived metric

Calculation across multiple measures:

```yaml
metrics:
  - name: average_revenue_per_customer
    type: derived
    label: "Revenue per Customer"
    description: "Total revenue divided by unique customer count"
    type_params:
      expr: total_revenue / unique_customers
      metrics:
        - name: total_revenue
        - name: unique_customers
```

### Ratio metric

Special case of derived for common ratio patterns:

```yaml
metrics:
  - name: order_conversion_rate
    type: ratio
    label: "Order Conversion Rate"
    type_params:
      numerator: completed_orders
      denominator: total_orders
```

### Cumulative metric

Running totals over time:

```yaml
metrics:
  - name: cumulative_revenue
    type: cumulative
    label: "Cumulative Revenue"
    type_params:
      measure: total_revenue
      window: 1 month
      grain_to_date: month
```

---

## Cube semantic layer

Cube is an alternative semantic layer that works with any BI tool via REST/GraphQL API.

### Cube schema file

```javascript
// schema/Orders.js
cube('Orders', {
  sql_table: 'analytics.fct_orders',

  joins: {
    Customers: {
      relationship: 'many_to_one',
      sql: `${CUBE}.customer_id = ${Customers}.customer_id`
    }
  },

  dimensions: {
    orderId: {
      sql: 'order_id',
      type: 'string',
      primary_key: true
    },
    status: {
      sql: 'status',
      type: 'string'
    },
    orderDate: {
      sql: 'order_date',
      type: 'time'
    }
  },

  measures: {
    count: {
      type: 'count'
    },
    totalRevenue: {
      sql: 'total_amount_cents',
      type: 'sum'
    },
    averageOrderValue: {
      sql: 'total_amount_cents',
      type: 'avg'
    }
  }
});
```

### Cube vs MetricFlow comparison

| Feature | MetricFlow (dbt) | Cube |
|---|---|---|
| Definition format | YAML | JavaScript/YAML |
| Query API | dbt Cloud Semantic Layer API | REST + GraphQL |
| Caching | Warehouse-level | Built-in pre-aggregations |
| BI integrations | Tableau, Hex, Mode (via dbt Cloud) | Any tool via API |
| Join handling | Entity-based auto-joins | Explicit join definitions |
| Best for | dbt-centric stacks | Multi-tool, API-first stacks |

---

## BI tool integration patterns

### Exposures (dbt)

Document which BI assets depend on which models:

```yaml
# models/exposures.yml
exposures:
  - name: weekly_revenue_dashboard
    type: dashboard
    maturity: high
    url: https://bi.company.com/dashboards/42
    description: "Executive revenue dashboard, refreshed daily"
    depends_on:
      - ref('fct_orders')
      - ref('dim_customers')
    owner:
      name: Data Team
      email: data@company.com
```

Exposures show up in the dbt docs DAG, making it visible which dashboards break
when a model changes.

### Metric query patterns

When querying metrics through the semantic layer API:

```python
# dbt Cloud Semantic Layer (Python SDK)
from dbt_sl_sdk import SemanticLayerClient

client = SemanticLayerClient(
    environment_id=12345,
    auth_token="dbt_cloud_token"
)

result = client.query(
    metrics=["revenue", "order_count"],
    group_by=["metric_time__month", "customer__segment"],
    where=["{{ Dimension('order__status') }} = 'completed'"],
    order_by=["-metric_time__month"],
    limit=100
)
```

---

## Common semantic layer pitfalls

| Pitfall | Impact | Fix |
|---|---|---|
| Averaging an average | Mathematically incorrect results | Use `sum / count` as a derived metric instead |
| Missing time dimension | Cannot do time-series analysis on the metric | Every semantic model needs at least one time dimension |
| Fanout joins | Measures inflate when joining one-to-many | Define entities correctly; use `count_distinct` not `count` |
| No metric descriptions | Analysts cannot discover or trust metrics | Every metric must have a `description` and `label` |
| Too many metrics | Decision paralysis, conflicting definitions | Curate 15-25 core metrics; archive the rest |
