<!-- Part of the database-engineering AbsolutelySkilled skill. Load this file when
     optimizing database queries or analyzing EXPLAIN plans. -->

# PostgreSQL Query Optimization Reference

A deep reference for reading EXPLAIN plans, choosing index types, understanding join
strategies, and resolving the most common query performance bottlenecks in PostgreSQL.

---

## EXPLAIN ANALYZE fundamentals

### Basic usage

```sql
-- Minimum useful form: always use ANALYZE to get actual row counts
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;

-- Full form: BUFFERS shows I/O, FORMAT TEXT is most readable
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.id, c.email
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'pending'
ORDER BY o.created_at DESC
LIMIT 50;

-- For long-running queries: use auto_explain in postgresql.conf
-- auto_explain.log_min_duration = '1s'
-- auto_explain.log_analyze = on
-- auto_explain.log_buffers = on
```

### Anatomy of an EXPLAIN node

```
-> Index Scan using idx_orders_customer_id on orders  (cost=0.43..8.45 rows=3 width=72)
                                                              ^      ^    ^          ^
                                                         startup  total  estimated  row
                                                           cost   cost    rows      width
   (actual time=0.021..0.031 rows=3 loops=1)
    ^                    ^         ^
    first row time    last row  actual rows  (loops multiplies all of these)
   Buffers: shared hit=5 read=0
```

**cost** is a dimensionless planner estimate. Only meaningful in relative comparisons.

**actual time** is in milliseconds. This is the real number to optimize.

**loops** - the node was executed this many times. `actual time` and `rows` are *per
loop*. Multiply by loops to get the total contribution.

**Buffers: shared hit** - pages served from shared buffer cache (RAM). Fast.
**Buffers: shared read** - pages read from disk. 100-1000x slower.

---

## Scan node types

| Node | Description | When it appears | Cost profile |
|---|---|---|---|
| `Seq Scan` | Reads every page in the table | No usable index, or filter selectivity is low (<~10%) | High for large tables |
| `Index Scan` | Traverses index, then fetches heap rows | Selective filter with a matching index | Low startup, moderate total |
| `Index Only Scan` | Answers query entirely from index | All needed columns are in a covering index | Lowest cost for point lookups |
| `Bitmap Index Scan` + `Bitmap Heap Scan` | Builds a bitmap of matching row locations, then fetches | Moderately selective filter, or OR across multiple indexes | Good middle ground |
| `TID Scan` | Fetches rows by physical location | Queries using `ctid` directly | Rare, avoid in application code |

### When Postgres ignores your index

The planner chooses a Seq Scan when it estimates that the index path costs more than a
sequential read. This happens when:

1. **Low selectivity** - the column has few distinct values (e.g. a boolean, or a status
   column where 90% of rows have `status = 'active'`). The planner believes fetching
   nearly every heap page via the index is slower than a single sequential pass.

2. **Stale statistics** - `pg_statistic` is out of date. Run `ANALYZE tablename` to
   refresh, or lower `autovacuum_analyze_scale_factor` for high-churn tables.

3. **Wrong column order in composite index** - filtering on `(b, c)` when the index is
   `(a, b, c)` does not use the index (leftmost prefix rule).

4. **Type mismatch or implicit cast** - `WHERE created_at = '2024-01-01'` on a
   `TIMESTAMPTZ` column works, but `WHERE date(created_at) = '2024-01-01'` wraps the
   column in a function and prevents index use. Use range predicates instead:
   `WHERE created_at >= '2024-01-01' AND created_at < '2024-01-02'`.

5. **small table** - Postgres skips the index if the table fits in a few pages. This is
   correct behavior.

---

## Join strategies

| Strategy | Description | Best for |
|---|---|---|
| `Nested Loop` | For each outer row, scan inner relation | Small outer set + indexed inner lookup |
| `Hash Join` | Hash the smaller relation, probe with larger | Equi-joins where neither side is tiny; no index required |
| `Merge Join` | Sort both sides, merge in order | Large sorted inputs; good for ORDER BY queries |

### Forcing a join strategy (for testing, never in production)

```sql
SET enable_nestloop = off;   -- force hash or merge join
SET enable_hashjoin = off;   -- force merge join
SET enable_mergejoin = off;  -- force hash join
-- Remember to reset after testing:
RESET enable_nestloop;
```

### Hash batches - disk spill warning

```
Hash  (cost=... rows=50000 ...)
  Buckets: 65536  Batches: 8  Memory Usage: 4096kB
                  ^^^^^^^^^
                  Batches > 1 means the hash spilled to disk
```

Fix: increase `work_mem` for the session (`SET work_mem = '64MB'`) or add an index to
convert the Hash Join to a Nested Loop with index lookup.

---

## Index types - when to use each

### B-tree (default)

```sql
-- Good for: equality, range, ORDER BY, IS NULL / IS NOT NULL
CREATE INDEX ON orders(created_at);                   -- range queries
CREATE INDEX ON orders(customer_id, created_at DESC); -- composite + sort
```

### Partial index

Only indexes rows matching a predicate. Stays small even as the full table grows.
The query's WHERE clause must imply the partial index predicate for the planner to use it.

```sql
-- Indexes only pending orders - stays small as orders are fulfilled
CREATE INDEX idx_orders_pending_customer
  ON orders(customer_id, created_at)
  WHERE status = 'pending';

-- Query that uses this index (planner can infer status = 'pending')
SELECT * FROM orders WHERE customer_id = $1 AND status = 'pending';
```

### Covering index (INCLUDE)

The `INCLUDE` clause adds non-key columns to the index leaf pages. The index cannot be
used for filtering or sorting on included columns, but an Index Only Scan can return them
without a heap fetch.

```sql
CREATE INDEX idx_products_sku_cover
  ON products(sku)
  INCLUDE (name, price_cents);

-- This query needs sku for lookup and name, price_cents for output.
-- With the covering index: Index Only Scan, no heap access.
SELECT name, price_cents FROM products WHERE sku = $1;
```

### GIN - JSONB and full-text

```sql
-- Index all keys in a JSONB column
CREATE INDEX idx_events_payload ON events USING GIN (payload);

-- Query uses GIN for containment check
SELECT * FROM events WHERE payload @> '{"type": "purchase"}';

-- Full-text search
CREATE INDEX idx_products_fts ON products
  USING GIN (to_tsvector('english', name || ' ' || description));

SELECT * FROM products
WHERE to_tsvector('english', name || ' ' || description)
      @@ plainto_tsquery('english', 'wireless keyboard');
```

### BRIN - large append-only tables

```sql
-- Events table with natural time ordering. BRIN stores min/max per block range.
-- Tiny index size (128 pages vs millions for B-tree), but coarser.
CREATE INDEX idx_events_created_brin ON events
  USING BRIN (created_at) WITH (pages_per_range = 128);

-- Effective only when the table is physically ordered by created_at (append-only pattern)
```

---

## Common bottlenecks and fixes

### N+1 at the SQL level

**Symptom**: `Nested Loop` with a large outer row count, many Index Scans on the inner
relation.

```sql
-- N+1: one query per order to get customer
SELECT id FROM orders WHERE status = 'pending'; -- returns 5000 rows
-- then for each: SELECT email FROM customers WHERE id = ?

-- Fix: single JOIN
SELECT o.id, c.email
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'pending';
```

### Missing index on foreign key

PostgreSQL does NOT automatically create indexes on foreign key columns (unlike MySQL).
Every FK referencing a parent table needs an explicit index on the child side or
`ON DELETE CASCADE` / `ON DELETE RESTRICT` will cause full scans on the child table.

```sql
-- Always add an index on the FK column
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

### Function on indexed column

```sql
-- BAD: function wraps the column, index unused
SELECT * FROM users WHERE lower(email) = 'alice@example.com';

-- FIX option 1: expression index
CREATE INDEX idx_users_email_lower ON users(lower(email));

-- FIX option 2: store the normalized form
ALTER TABLE users ADD COLUMN email_lower TEXT GENERATED ALWAYS AS (lower(email)) STORED;
CREATE INDEX ON users(email_lower);
```

### High dead tuple ratio (bloat)

```sql
-- Check table bloat
SELECT relname,
       n_dead_tup,
       n_live_tup,
       round(n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0) * 100, 1) AS dead_pct,
       last_autovacuum,
       last_autoanalyze
FROM pg_stat_user_tables
ORDER BY dead_pct DESC NULLS LAST;

-- Trigger immediate vacuum + analyze
VACUUM ANALYZE orders;

-- Reclaim space (locks table briefly)
VACUUM FULL orders; -- avoid in production unless bloat is severe
```

Tune autovacuum for high-churn tables to prevent bloat from accumulating:

```sql
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.01,   -- trigger at 1% dead tuples (default 20%)
  autovacuum_analyze_scale_factor = 0.005  -- update stats at 0.5% changes
);
```

### Lock contention

```sql
-- See what is waiting and what is blocking
SELECT
  blocked.pid,
  blocked.query                       AS blocked_query,
  blocking.pid                        AS blocking_pid,
  blocking.query                      AS blocking_query,
  now() - blocked.query_start         AS wait_duration
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
  ON blocking.pid = ANY(pg_blocking_pids(blocked.pid))
WHERE blocked.wait_event_type = 'Lock';

-- Kill a blocking query (graceful)
SELECT pg_cancel_backend(<blocking_pid>);

-- Kill a blocking query (immediate)
SELECT pg_terminate_backend(<blocking_pid>);
```

---

## Query planning configuration knobs

| Parameter | Default | Tune when |
|---|---|---|
| `work_mem` | 4MB | Hash joins spilling to disk, sort operations slow |
| `shared_buffers` | 128MB | Buffer cache hit rate low; set to 25% of RAM |
| `effective_cache_size` | 4GB | Planner underestimates cache; set to 50-75% of RAM |
| `random_page_cost` | 4.0 | On SSD: set to 1.1-2.0; planner prefers seq scans too much otherwise |
| `enable_seqscan` | on | Set to `off` in session to force index use during testing only |

```sql
-- Temporary session-level tuning for a heavy report query
SET work_mem = '256MB';
SET enable_seqscan = off;  -- testing only
-- run query
RESET ALL;
```

---

## Query optimization checklist

1. Run `EXPLAIN (ANALYZE, BUFFERS)` before touching any code
2. Find the node with the highest `actual time` - that is the bottleneck
3. Check `rows` estimate vs actual - large divergence means stale statistics (`ANALYZE`)
4. Look for `Seq Scan` on large tables with low selectivity filters
5. Look for `Hash Join` with `Batches > 1` - increase `work_mem` or add an index
6. Look for `Nested Loop` with high outer loop count - classic N+1 pattern
7. Check for function calls wrapping indexed columns in WHERE
8. Verify FK columns have indexes on the child side
9. Check `pg_stat_user_tables` for high dead tuple ratios
10. After adding an index: re-run EXPLAIN to confirm it is used (`Index Scan` or `Index Only Scan`)
