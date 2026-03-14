<!-- Part of the Backend Engineering AbsolutelySkilled skill. Load this file when working with database schema design, migrations, or indexing. -->

# Database Schema Design Reference

---

## 1. Normalization Levels

| Normal Form | Rule | Violation Example |
|-------------|------|-------------------|
| **1NF** | Every column holds atomic (single) values; no repeating groups | `tags = "api,auth,billing"` in one column |
| **2NF** | 1NF + every non-key column depends on the *entire* primary key | Composite PK `(order_id, product_id)` with `customer_name` depending only on `order_id` |
| **3NF** | 2NF + no non-key column depends on another non-key column | `zip_code -> city` stored alongside other customer fields |

```sql
-- 1NF violation: repeating group
CREATE TABLE orders (id SERIAL PRIMARY KEY, items TEXT); -- "widget:3,gadget:1"
-- Fix: separate order_items table with one row per item

-- 2NF violation: partial key dependency
CREATE TABLE order_details (
  order_id INT, product_id INT, customer_name TEXT, quantity INT,
  PRIMARY KEY (order_id, product_id)
  -- customer_name depends only on order_id; move it to orders table
);

-- 3NF violation: transitive dependency
CREATE TABLE customers (
  id SERIAL PRIMARY KEY, name TEXT, zip_code TEXT,
  city TEXT  -- city depends on zip_code, not customer; extract to zip_codes table
);
```

### When to Stop Normalizing

**Default: normalize to 3NF.** Deviate when you have measured evidence.

| Scenario | Recommendation |
|----------|---------------|
| OLTP with mixed reads/writes | 3NF - normalize fully |
| Read-heavy analytics / dashboards | Denormalize into materialized views or reporting tables |
| Hot-path query joining 5+ tables | Denormalized read model alongside the normalized source |
| Write-heavy ingestion (logs, events) | Append-only flat tables; normalize downstream |

**Rule of thumb:** Normalize the source of truth. Denormalize the read path. Never denormalize your only copy.

---

## 2. Indexing Strategies

### Index Types

| Index Type | Best For | Avoid When |
|------------|----------|------------|
| **B-tree** (default) | Range queries, equality, sorting, `BETWEEN` | Full-text search, array containment |
| **Hash** | Exact equality lookups only | Range queries, sorting |
| **GIN** | Array containment (`@>`), full-text search, JSONB | Simple scalar equality; high-write tables |
| **GiST** | Geometric/spatial data, range types, nearest-neighbor | Simple equality or range on scalars |

**Default choice: B-tree.** Switch only when the query pattern demands it.

### Composite Index Column Ordering

1. **Leftmost prefix rule** - index on `(a, b, c)` supports `(a)`, `(a, b)`, `(a, b, c)`, but NOT `(b, c)` alone.
2. **Equality columns first, then range/sort columns.**

```sql
-- Query: WHERE tenant_id = ? AND created_at > ? ORDER BY created_at
CREATE INDEX idx_tenant_created ON events (tenant_id, created_at);  -- correct
-- NOT: (created_at, tenant_id) -- breaks leftmost prefix for tenant-scoped queries
```

### Covering and Partial Indexes

```sql
-- Covering: DB never touches the heap (index-only scan)
CREATE INDEX idx_users_email ON users (email) INCLUDE (name);

-- Partial: index only the rows you actually query
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';
```

### When NOT to Index

| Scenario | Why |
|----------|-----|
| Column with < 5 distinct values on a large table | Low selectivity; full scan is often faster |
| Write-heavy table with rarely queried columns | Every index slows INSERT/UPDATE/DELETE |
| Small tables (< 10k rows) | Sequential scan is fast enough |
| Columns only in `SELECT`, never in `WHERE`/`JOIN`/`ORDER BY` | Index won't be used |

### Reading EXPLAIN Output

```
Seq Scan          -- full table scan; missing index or low selectivity
Index Scan        -- good; using index, fetching from heap
Index Only Scan   -- best; all data from the index (covering index)
Bitmap Index Scan -- combines multiple indexes; okay for moderate selectivity
Nested Loop       -- fine for small outer sets; watch for large outer sets
Hash Join         -- good for large equi-joins
Sort              -- check for "external merge Disk" (spilling to disk = bad)
```

**EXPLAIN checklist:**
- [ ] No unexpected `Seq Scan` on large tables
- [ ] `rows` estimate within 10x of `actual rows` (with `EXPLAIN ANALYZE`)
- [ ] No `Sort Method: external merge Disk`
- [ ] Join order makes sense (smaller table drives the join)

---

## 3. Migration Safety Patterns

### The Expand-Contract Pattern

Use for any rename, type change, or restructure with zero downtime.

| Step | Action | Example |
|------|--------|---------|
| 1. Expand | Add new structure alongside old | `ALTER TABLE users ADD COLUMN handle TEXT;` |
| 2. Dual-write | Write to both columns; read new with fallback to old | Application code change |
| 3. Backfill | Populate new column for existing rows (in batches) | `UPDATE users SET handle = username WHERE handle IS NULL LIMIT 5000;` |
| 4. Cutover | All code reads/writes only new column | Application code change |
| 5. Contract | Drop old column in subsequent deploy | `ALTER TABLE users DROP COLUMN username;` |

### Online DDL Safety

| Operation | Safe Online? | Notes |
|-----------|-------------|-------|
| `ADD COLUMN` (nullable, no default) | Yes | Metadata-only in most DBs |
| `ADD COLUMN` with default | Depends | PostgreSQL 11+ safe; older versions rewrite table |
| `DROP COLUMN` | Yes (logically) | Mark unused first |
| `RENAME COLUMN` | No | Breaks running application code instantly |
| `ALTER COLUMN TYPE` | No | May rewrite table; use expand-contract |
| `ADD INDEX` | Use `CONCURRENTLY` | Avoids write locks |
| `ADD NOT NULL` | Risky | Full table scan for validation; add as check constraint first |

### Zero-Downtime Migration Checklist

- [ ] Migration only *adds* - no renames, drops, or type changes
- [ ] New columns are nullable or have a safe default
- [ ] Indexes created with `CONCURRENTLY` (or equivalent)
- [ ] No full-table locks held for more than a few seconds
- [ ] Application code backward-compatible with old and new schema
- [ ] Backfills run in batches (1k-10k rows), not a single UPDATE
- [ ] Rollback plan documented
- [ ] Tested against production-sized dataset

### Backfill Pattern

```
-- Pseudocode: batched backfill
cursor = 0
LOOP:
    rows = SELECT id FROM table WHERE new_col IS NULL AND id > cursor
           ORDER BY id LIMIT 5000
    IF rows IS EMPTY: BREAK
    UPDATE table SET new_col = derive(old_col) WHERE id IN (rows)
    cursor = MAX(rows.id)
    SLEEP 100ms  -- throttle to reduce replication lag
```

---

## 4. Schema Evolution

### Nullable Columns vs New Tables

| Approach | Use When |
|----------|----------|
| **Nullable column** | Data belongs to same entity; most rows will eventually have it; simple scalar |
| **New table (1:1 FK)** | Data is sparse (< 20% of rows); complex sub-object; different access patterns |

### JSON Columns

| JSON is okay when... | JSON is tech debt when... |
|-----------------------|--------------------------|
| Schema-less by nature (user prefs, feature flags) | You query individual fields in WHERE clauses |
| Rarely queried, mostly stored/retrieved whole | You need referential integrity on nested data |
| Evolves faster than your deploy cycle | Multiple tables reference the same nested structure |
| Event payloads, audit log metadata | You write `data->>'field'` in every query |

**If you index a JSON field more than twice, extract it into a real column.**

### Soft Deletes vs Hard Deletes

| Factor | Soft Delete (`deleted_at`) | Hard Delete (`DELETE`) |
|--------|---------------------------|----------------------|
| Data recovery | Easy - clear the flag | Requires backups |
| Query complexity | Every query needs `WHERE deleted_at IS NULL` | Queries are simple |
| Storage | Grows forever | Reclaims space |
| GDPR compliance | Does NOT satisfy "right to erasure" | Satisfies erasure |
| Performance over time | Table bloat slows queries | Table stays lean |

**Recommended default:** Hard delete with an audit log table for recovery needs.

```sql
CREATE TABLE audit_log (
  id           BIGSERIAL PRIMARY KEY,
  table_name   TEXT NOT NULL,
  record_id    BIGINT NOT NULL,
  action       TEXT NOT NULL,  -- 'INSERT', 'UPDATE', 'DELETE'
  old_data     JSONB,
  new_data     JSONB,
  performed_by TEXT,
  performed_at TIMESTAMPTZ DEFAULT now()
);
```

If you must soft delete, use a partial index: `CREATE INDEX idx_active ON users (email) WHERE deleted_at IS NULL;`

### Temporal Tables

When you need full history of every change, maintain a `_history` table:

```sql
CREATE TABLE products_history (
  history_id  BIGSERIAL PRIMARY KEY,
  id          INT NOT NULL,       -- FK to products
  name        TEXT NOT NULL,
  price_cents INT NOT NULL,
  valid_from  TIMESTAMPTZ NOT NULL,
  valid_to    TIMESTAMPTZ,        -- NULL = current version
  changed_by  TEXT
);
-- Populate via trigger or application hook on every UPDATE/DELETE
```

---

## 5. Data Types

### Primary Keys: UUID vs Auto-Increment

| Factor | Auto-Increment (`BIGSERIAL`) | UUID (v4 or v7) |
|--------|------------------------------|-----------------|
| Size | 8 bytes | 16 bytes |
| Index performance | Excellent (sequential, no page splits) | v4: poor (random). v7: good (time-sorted) |
| Multi-source merge | Conflicts guaranteed | No conflicts |
| URL guessability | Trivially enumerable | Not guessable |
| Client-side generation | Not possible | Possible (offline/distributed) |

**Recommended default:** `BIGSERIAL` PK + separate public UUID column.

```sql
CREATE TABLE users (
  id        BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  email     TEXT NOT NULL
);
-- Internal joins use 'id' (fast). APIs expose 'public_id' (safe).
```

For distributed/multi-region systems, use UUIDv7 (time-sorted) as the PK directly.

### Timestamps

**Always use `TIMESTAMPTZ`.** No exceptions. Store UTC, convert in the application layer.

```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT now()   -- good
created_at TIMESTAMP NOT NULL DEFAULT now()     -- bad: loses timezone context
```

### Money

**Store as integer cents.** Never use `FLOAT` or `DOUBLE`.

| Approach | Pros | Cons |
|----------|------|------|
| `INT` (cents) | Fast, no rounding, easy math | Must convert for display |
| `NUMERIC(p,s)` | Exact decimals, multi-currency friendly | Slower than integer math |
| `FLOAT`/`DOUBLE` | **Never use for money** | `0.1 + 0.2 = 0.30000000000000004` |

### Enums: Column vs Lookup Table

| Approach | Use When | Avoid When |
|----------|----------|------------|
| **Check constraint** | < 5 values, almost never changes | Values change quarterly |
| **Enum type** (PG `CREATE TYPE`) | Moderate set, rarely changes | Need to *remove* values (PG enums can't drop) |
| **Lookup table** | Values change often, need metadata, referenced across tables | Only 2-3 static values |

**Recommended default:** Check constraint for tiny static sets; lookup table for everything else.

```sql
-- Check constraint
CREATE TABLE orders (
  id     BIGSERIAL PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered'))
);

-- Lookup table
CREATE TABLE order_statuses (
  id   SMALLINT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE orders (
  id        BIGSERIAL PRIMARY KEY,
  status_id SMALLINT NOT NULL REFERENCES order_statuses(id)
);
```

---

## Quick Decision Cheat Sheet

| Question | Default | Deviate When |
|----------|---------|-------------|
| How far to normalize? | 3NF | Read-heavy reporting needs denormalized views |
| Which index type? | B-tree | Arrays/JSONB (GIN), spatial (GiST), pure equality (hash) |
| Composite index order? | Equality first, then range/sort | Benchmark proves otherwise |
| Column rename strategy? | Expand-contract | Maintenance window is acceptable |
| Soft or hard delete? | Hard delete + audit log | Undo feature required in product |
| UUID or auto-increment? | BIGSERIAL + public UUID | Distributed system (use UUIDv7) |
| Timestamp type? | TIMESTAMPTZ, always | Never deviate |
| Money storage? | Integer cents | Multi-currency precision (use NUMERIC) |
| Enum or lookup table? | Check constraint < 5; lookup table otherwise | PG enum if values never removed |
| JSON column? | Only for schema-less data | Extract fields you query or index |
