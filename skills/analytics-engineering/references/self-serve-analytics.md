<!-- Part of the analytics-engineering AbsolutelySkilled skill. Load this file when
     building analyst-friendly data platforms, documentation strategies, data
     catalogs, or self-serve analytics patterns. -->

# Self-Serve Analytics Patterns

## The self-serve spectrum

Self-serve analytics is not binary. Teams operate on a spectrum:

| Level | Who queries | What they need | Analytics eng. effort |
|---|---|---|---|
| 1. Dashboard consumers | Everyone | Pre-built dashboards, no SQL | Low - build once, maintain |
| 2. Guided exploration | Analysts | Curated datasets + BI tool | Medium - model + document |
| 3. SQL self-serve | Data-literate staff | Clean marts + docs | High - full modeling + semantic layer |
| 4. Full autonomy | Data engineers | Raw + modeled data | Minimal - provide access + catalog |

Most teams should target Level 2-3. Level 4 is for data teams querying their own
warehouse. Level 1 alone creates a dashboard factory with infinite ticket queues.

---

## Building analyst-friendly marts

### Naming conventions

| Pattern | Example | Rule |
|---|---|---|
| Fact tables | `fct_orders` | Prefix with `fct_`, use plural noun |
| Dimension tables | `dim_customers` | Prefix with `dim_`, use plural noun |
| Date columns | `order_date`, `created_at` | Suffix with `_date` (date) or `_at` (timestamp) |
| Boolean columns | `is_active`, `has_subscription` | Prefix with `is_` or `has_` |
| Amount columns | `total_amount_cents` | Include unit in name (`_cents`, `_usd`, `_seconds`) |
| Count columns | `lifetime_order_count` | Suffix with `_count` |
| ID columns | `customer_id` | Suffix with `_id`, match the dimension table name |

Never use abbreviations. `cust_id` saves 4 characters and costs every analyst a
lookup. Use `customer_id`.

### Column descriptions in YAML

Every column in every mart model must have a description:

```yaml
models:
  - name: fct_orders
    description: >
      One row per order. Grain: order_id. Includes payment totals joined from
      the payments intermediate model. Updated incrementally on each dbt run.
    columns:
      - name: order_id
        description: "Unique order identifier from Shopify. Primary key."
      - name: customer_id
        description: "FK to dim_customers. The customer who placed this order."
      - name: order_date
        description: "Date the order was placed (UTC, date only, no time)."
      - name: status
        description: >
          Current order status. Values: pending, confirmed, shipped, delivered,
          cancelled, refunded.
      - name: total_amount_cents
        description: >
          Total order value in US cents (integer). Divide by 100 for dollars.
          Includes tax, excludes shipping.
      - name: is_first_order
        description: >
          True if this is the customer's first order by order_date. Useful for
          new vs returning customer analysis.
```

### Grain documentation pattern

Every mart model's YAML description must state the grain explicitly:

```
Grain: one row per <entity>
```

Examples:
- `fct_orders`: "Grain: one row per order"
- `fct_order_items`: "Grain: one row per order line item"
- `dim_customers`: "Grain: one row per customer (current state)"
- `fct_daily_active_users`: "Grain: one row per user per day"

If you cannot state the grain in one sentence, the model is likely mixing grains
and should be split.

---

## Documentation strategies

### dbt docs

Generate and host dbt docs for the entire project:

```bash
dbt docs generate
dbt docs serve --port 8080
```

For production, deploy to a static hosting service (S3 + CloudFront, Netlify, etc.)
or use dbt Cloud's hosted docs.

### What to document beyond column descriptions

1. **Model-level description** - What this model is, its grain, key assumptions
2. **Source freshness expectations** - How often data arrives, acceptable lag
3. **Known limitations** - "Does not include orders from the legacy system before 2021"
4. **Business rules** - "An order is considered 'completed' when status = 'delivered'
   AND payment_status = 'captured'"
5. **Metric definitions** - Link to the semantic layer metric, not a BI dashboard

### Data dictionary template

For teams that need a document outside of dbt docs:

```markdown
## fct_orders

| Column | Type | Description | Example |
|---|---|---|---|
| order_id | varchar | Unique order ID from Shopify | ord_abc123 |
| customer_id | varchar | FK to dim_customers | cust_xyz789 |
| order_date | date | Date order was placed (UTC) | 2024-03-15 |
| status | varchar | Order status enum | delivered |
| total_amount_cents | integer | Total in cents, incl. tax, excl. shipping | 4999 |

**Grain**: One row per order
**Refresh**: Incremental, every 6 hours
**Owner**: Data Engineering (@data-eng)
```

---

## Data catalog integration

### Popular catalog tools

| Tool | Type | Best for |
|---|---|---|
| dbt Docs | Built-in | Teams already using dbt |
| Atlan | SaaS catalog | Enterprise, governance-heavy |
| DataHub (LinkedIn) | Open source | Large orgs, custom metadata |
| Amundsen (Lyft) | Open source | Discovery-focused |
| Select Star | SaaS | Automated lineage |
| Monte Carlo | SaaS | Data observability + catalog |

### Catalog integration pattern

1. Run `dbt docs generate` to produce `manifest.json` and `catalog.json`
2. Push these artifacts to your catalog tool's API
3. The catalog ingests model descriptions, column descriptions, lineage, and tests
4. Analysts search the catalog, find the right table, and start querying

```bash
# Example: push dbt artifacts to DataHub
datahub ingest -c dbt_recipe.yml
```

```yaml
# dbt_recipe.yml (DataHub)
source:
  type: dbt
  config:
    manifest_path: target/manifest.json
    catalog_path: target/catalog.json
    target_platform: snowflake
```

---

## Access patterns for self-serve

### Role-based access

```sql
-- Create analyst role with read-only access to marts
CREATE ROLE analyst_readonly;
GRANT USAGE ON SCHEMA analytics TO analyst_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO analyst_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics
  GRANT SELECT ON TABLES TO analyst_readonly;

-- Staging and raw schemas are NOT granted to analysts
-- They should only query marts
```

### Query guardrails

Prevent runaway queries from consuming warehouse resources:

```sql
-- Snowflake: warehouse-level query timeout
ALTER WAREHOUSE analyst_wh SET
  STATEMENT_TIMEOUT_IN_SECONDS = 300;

-- BigQuery: use BI Engine for fast, bounded queries
-- Redshift: WLM queue with memory and concurrency limits
```

---

## Onboarding analysts to self-serve

### The self-serve onboarding checklist

1. Share the dbt docs URL (or data catalog link)
2. Walk through the 3-5 most important mart tables and their grains
3. Show how to find metric definitions in the semantic layer
4. Provide 5-10 example queries covering common analysis patterns
5. Set up a Slack channel (#data-questions) for questions with a 24h SLA
6. Review their first 3 queries/dashboards for correctness
7. After 2 weeks, check: are they filing fewer data tickets? If not, the
   models or documentation need improvement, not the analyst.

### Example starter queries for analysts

```sql
-- Revenue by month
SELECT
  DATE_TRUNC('month', order_date) AS month,
  SUM(total_amount_cents) / 100.0 AS revenue_dollars
FROM analytics.fct_orders
WHERE status = 'delivered'
GROUP BY 1
ORDER BY 1;

-- Customer segmentation breakdown
SELECT
  customer_segment,
  COUNT(*) AS customer_count,
  AVG(lifetime_value_cents) / 100.0 AS avg_ltv_dollars
FROM analytics.dim_customers
GROUP BY 1
ORDER BY 3 DESC;

-- New vs returning customers by week
SELECT
  DATE_TRUNC('week', o.order_date) AS week,
  COUNT(CASE WHEN o.is_first_order THEN 1 END) AS new_customers,
  COUNT(CASE WHEN NOT o.is_first_order THEN 1 END) AS returning_customers
FROM analytics.fct_orders o
WHERE o.status != 'cancelled'
GROUP BY 1
ORDER BY 1;
```

---

## Measuring self-serve success

Track these metrics to know if self-serve is working:

| Metric | Target | How to measure |
|---|---|---|
| Data ticket volume | Decreasing month-over-month | Count tickets tagged "data request" |
| Time to first query | < 1 week for new analysts | Warehouse audit logs |
| Query error rate | < 10% of analyst queries fail | Warehouse query history |
| Dashboard trust score | > 4/5 in quarterly survey | Survey stakeholders |
| Metric definition coverage | > 80% of KPIs in semantic layer | Audit metrics YAML vs BI tools |
