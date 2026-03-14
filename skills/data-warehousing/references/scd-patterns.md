<!-- Part of the data-warehousing AbsolutelySkilled skill. Load this file when
     working with slowly changing dimension implementations. -->

# SCD Patterns

Slowly Changing Dimensions (SCDs) handle the reality that dimension attributes change
over time. The type you choose determines whether history is preserved and how it is
queried. This reference covers all standard types with complete SQL implementations.

---

## SCD Type 0 - Fixed attribute

The attribute never changes after initial load. Use for truly immutable data.

```sql
-- Examples: birth_date, original_signup_date, first_order_date
-- Implementation: simply never update these columns
-- In MERGE statements, exclude Type 0 columns from the WHEN MATCHED clause
```

---

## SCD Type 1 - Overwrite

Replace the old value with the new value. No history is preserved.

```sql
-- Snowflake Type 1 MERGE
MERGE INTO dim_product AS target
USING staging_products AS source
  ON target.product_id = source.product_id
WHEN MATCHED
  AND (target.category != source.category
    OR target.brand    != source.brand)
THEN UPDATE SET
  target.category = source.category,
  target.brand    = source.brand,
  target.updated_at = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN INSERT (
  product_sk, product_id, product_name, category, brand, updated_at
) VALUES (
  dim_product_seq.NEXTVAL,
  source.product_id, source.product_name, source.category, source.brand,
  CURRENT_TIMESTAMP()
);
```

**When to use**: Corrections (fixing a typo), attributes where history is irrelevant
(e.g., updating a product description), or when storage/complexity must be minimized.

**Trade-off**: Simple and fast but you cannot answer "what was the category last month?"

---

## SCD Type 2 - Add new row

Create a new row for each change, preserving full history. This is the most common
type for analytical warehouses.

### Required columns

| Column | Purpose |
|---|---|
| `surrogate_key` | Unique per row (version), not per entity |
| `natural_key` | Business identifier (same across all versions) |
| `effective_date` | When this version became active |
| `expiry_date` | When this version was superseded (`9999-12-31` for current) |
| `is_current` | Boolean flag for easy filtering of current records |

### Snowflake implementation

```sql
-- Step 1: Expire changed rows
MERGE INTO dim_customer AS target
USING staging_customers AS source
  ON target.customer_id = source.customer_id
     AND target.is_current = TRUE
WHEN MATCHED
  AND (target.segment  != source.segment
    OR target.region   != source.region
    OR target.tier     != source.tier)
THEN UPDATE SET
  target.expiry_date = CURRENT_DATE - 1,
  target.is_current  = FALSE;

-- Step 2: Insert new current rows for changed and new records
INSERT INTO dim_customer (
  customer_sk, customer_id, name, segment, region, tier,
  effective_date, expiry_date, is_current
)
SELECT
  dim_customer_seq.NEXTVAL,
  s.customer_id, s.name, s.segment, s.region, s.tier,
  CURRENT_DATE, '9999-12-31', TRUE
FROM staging_customers s
WHERE NOT EXISTS (
  SELECT 1 FROM dim_customer d
  WHERE d.customer_id = s.customer_id
    AND d.is_current = TRUE
    AND d.segment = s.segment
    AND d.region  = s.region
    AND d.tier    = s.tier
);
```

### BigQuery implementation

```sql
-- Step 1: Expire changed rows
MERGE `project.dataset.dim_customer` AS target
USING `project.dataset.staging_customers` AS source
  ON target.customer_id = source.customer_id
     AND target.is_current = TRUE
WHEN MATCHED
  AND (target.segment != source.segment
    OR target.region  != source.region
    OR target.tier    != source.tier)
THEN UPDATE SET
  expiry_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY),
  is_current  = FALSE;

-- Step 2: Insert new current rows
INSERT INTO `project.dataset.dim_customer` (
  customer_sk, customer_id, name, segment, region, tier,
  effective_date, expiry_date, is_current
)
SELECT
  GENERATE_UUID(),
  s.customer_id, s.name, s.segment, s.region, s.tier,
  CURRENT_DATE(), DATE '9999-12-31', TRUE
FROM `project.dataset.staging_customers` s
WHERE NOT EXISTS (
  SELECT 1 FROM `project.dataset.dim_customer` d
  WHERE d.customer_id = s.customer_id
    AND d.is_current = TRUE
    AND d.segment = s.segment
    AND d.region  = s.region
    AND d.tier    = s.tier
);
```

### Querying Type 2 dimensions

```sql
-- Get current state of all customers
SELECT * FROM dim_customer WHERE is_current = TRUE;

-- Point-in-time lookup: what segment was customer C123 in on 2025-06-15?
SELECT segment
FROM dim_customer
WHERE customer_id = 'C123'
  AND effective_date <= '2025-06-15'
  AND expiry_date   >= '2025-06-15';

-- Join fact to dimension for historical accuracy
SELECT f.sale_date, d.segment, SUM(f.net_amount)
FROM fct_sales f
JOIN dim_customer d
  ON f.customer_sk = d.customer_sk  -- surrogate key join: gets the version active at sale time
GROUP BY f.sale_date, d.segment;
```

---

## SCD Type 3 - Previous value column

Store the current and one previous value as separate columns. Limited history.

```sql
CREATE TABLE dim_customer_type3 (
  customer_sk       INT         PRIMARY KEY,
  customer_id       VARCHAR(50) NOT NULL,
  name              VARCHAR(200),
  current_segment   VARCHAR(50),
  previous_segment  VARCHAR(50),
  segment_change_date DATE
);

-- Update: shift current to previous
UPDATE dim_customer_type3
SET previous_segment  = current_segment,
    current_segment   = 'Enterprise',
    segment_change_date = CURRENT_DATE
WHERE customer_id = 'C123';
```

**When to use**: Rarely. Only when you need exactly one prior value and never more.
Most analytical needs are better served by Type 2.

---

## SCD Type 6 - Hybrid (1 + 2 + 3)

Combines Type 2 history rows with a Type 1 overwrite column for the current value.
This gives you both full history and easy access to the current state on every row.

```sql
CREATE TABLE dim_customer_type6 (
  customer_sk        INT         PRIMARY KEY,
  customer_id        VARCHAR(50) NOT NULL,
  name               VARCHAR(200),
  -- Type 2 historical value
  historical_segment VARCHAR(50),
  -- Type 1 current value (same on ALL rows for this customer)
  current_segment    VARCHAR(50),
  -- Type 2 tracking
  effective_date     DATE        NOT NULL,
  expiry_date        DATE        NOT NULL DEFAULT '9999-12-31',
  is_current         BOOLEAN     NOT NULL DEFAULT TRUE
);

-- When segment changes:
-- 1. Expire the current row (Type 2)
UPDATE dim_customer_type6
SET expiry_date = CURRENT_DATE - 1,
    is_current  = FALSE,
    current_segment = 'Enterprise'  -- Type 1: update on ALL rows
WHERE customer_id = 'C123' AND is_current = TRUE;

-- 2. Insert new current row (Type 2)
INSERT INTO dim_customer_type6 VALUES (
  NEXTVAL, 'C123', 'Acme Corp',
  'Enterprise',   -- historical_segment = the new value
  'Enterprise',   -- current_segment = the new value
  CURRENT_DATE, '9999-12-31', TRUE
);

-- 3. Backfill current_segment on all historical rows (Type 1 overwrite)
UPDATE dim_customer_type6
SET current_segment = 'Enterprise'
WHERE customer_id = 'C123';
```

### Querying Type 6

```sql
-- "What segment is the customer in NOW?" (use current_segment on any row)
SELECT DISTINCT customer_id, current_segment
FROM dim_customer_type6
WHERE customer_id = 'C123';

-- "What segment were they in when this sale happened?" (use historical_segment)
SELECT f.sale_date, d.historical_segment, SUM(f.net_amount)
FROM fct_sales f
JOIN dim_customer_type6 d ON f.customer_sk = d.customer_sk
GROUP BY f.sale_date, d.historical_segment;
```

**When to use**: When analysts frequently need both "current state" and "historical
state" queries and you want to avoid a self-join to the current row.

---

## Choosing the right SCD type

| Need | Recommended type |
|---|---|
| Attribute never changes | Type 0 |
| Only current value matters, no history needed | Type 1 |
| Full history required for point-in-time analysis | Type 2 |
| Only need one previous value | Type 3 |
| Full history + easy current value access | Type 6 |

**Default recommendation**: Start with Type 2 for any attribute where there is even a
possibility of needing historical analysis. The storage cost is minimal in cloud
warehouses. Migrating from Type 1 to Type 2 retroactively is painful because the
history is already lost.

---

## Migration: Type 1 to Type 2

When you realize you need history after starting with Type 1:

```sql
-- Add tracking columns
ALTER TABLE dim_customer ADD COLUMN effective_date DATE DEFAULT '1900-01-01';
ALTER TABLE dim_customer ADD COLUMN expiry_date DATE DEFAULT '9999-12-31';
ALTER TABLE dim_customer ADD COLUMN is_current BOOLEAN DEFAULT TRUE;

-- Set effective_date to the best available timestamp
UPDATE dim_customer
SET effective_date = COALESCE(last_modified_at, created_at, '1900-01-01');

-- From this point forward, use Type 2 MERGE logic
-- Note: all history before this migration is lost - you only have the current state
```

> This migration preserves only the current snapshot. Any changes that occurred before
> the migration are permanently lost. This is why defaulting to Type 2 from the start
> is strongly recommended for analytics-critical attributes.
