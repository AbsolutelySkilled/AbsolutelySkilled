<!-- Part of the `absolute` skill (simplify command). Load this file when
     simplifying SQL files (.sql) or SQL embedded in query builders / migrations. -->

# SQL Simplification Guide

Deep opinions for simplifying SQL queries. These supplement the universal
catalog -- apply both. When project config (a linter like sqlfluff, a dialect
convention, CLAUDE.md) contradicts anything here, project config wins.

**Preserve result set and semantics exactly** -- same rows, same columns, same
ordering guarantees, same NULL behavior. SQL is full of subtle semantic traps
(NULLs, duplicates, join fan-out). When a rewrite might change the result set,
skip it and flag in the summary. Never rewrite a query you can't reason about
fully, and never assume the dialect -- Postgres, MySQL, SQLite, and others differ.

---

## SELECT *

Replace `SELECT *` with an explicit column list when the surrounding code depends
on a fixed shape (application code, a view, an INSERT ... SELECT).

```sql
-- Before
SELECT * FROM users WHERE active = true;

-- After
SELECT id, email, created_at FROM users WHERE active = true;
```

Do NOT expand `SELECT *` when you cannot see the table's columns -- guessing the
column list is a behavior change. In that case, leave it and flag.

---

## Redundant DISTINCT / GROUP BY

- **`DISTINCT` after a unique key** -- selecting a primary/unique key already
  guarantees distinctness. Redundant `DISTINCT` is dead weight (and can mask a
  join fan-out bug -- if removing it changes the count, the join was wrong; do
  not silently "fix" that, flag it).
- **`GROUP BY` with no aggregate** -- if there's no aggregate function, `GROUP BY`
  is being (mis)used as `DISTINCT`. Only simplify if you're certain of intent.
- **Grouping by columns functionally dependent** on an already-grouped key --
  dialect-dependent; leave unless the dialect clearly allows it.

---

## Subqueries → JOINs / EXISTS

Correlated subqueries in `SELECT`/`WHERE` are often clearer and faster as JOINs
or `EXISTS`.

```sql
-- Before
SELECT name,
       (SELECT count(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

-- After
SELECT u.name, count(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;
```

**Caution:** an `IN (subquery)` is NOT equivalent to a JOIN when the subquery can
return duplicates or NULLs -- a JOIN can fan out rows, and `NOT IN` with a NULL
returns no rows. Prefer `EXISTS`/`NOT EXISTS` for membership tests; only convert
to a JOIN when you've confirmed no fan-out and no NULL trap.

---

## CTEs for Readability

Break a deeply nested subquery into named CTEs when it improves readability.

```sql
-- Before -- nested derived tables
SELECT * FROM (
  SELECT user_id, sum(total) AS spent FROM (
    SELECT * FROM orders WHERE status = 'paid'
  ) paid GROUP BY user_id
) totals WHERE spent > 1000;

-- After
WITH paid_orders AS (
  SELECT user_id, total FROM orders WHERE status = 'paid'
),
totals AS (
  SELECT user_id, sum(total) AS spent FROM paid_orders GROUP BY user_id
)
SELECT * FROM totals WHERE spent > 1000;
```

Do NOT introduce CTEs on dialects/versions where they force materialization and
regress performance (older Postgres < 12, some MySQL versions). Readability is
the goal, not a rewrite that changes the plan on a hot query.

---

## Predicate & Expression Simplification

| Before | After | Note |
|---|---|---|
| `WHERE x = x` / `1 = 1` | remove | Unless a builder needs the `1=1` seed |
| `WHERE col IN (1)` | `WHERE col = 1` | Single-element IN |
| `OR` chain on one column | `IN (...)` | `a = 1 OR a = 2` → `a IN (1, 2)` |
| `COALESCE(x, x)` | `x` | Redundant |
| `NOT (a = b)` | `a <> b` | Watch NULLs -- `<>` also yields NULL, not true |
| Nested `CASE` | flat `CASE WHEN ... WHEN ...` | Never nest CASE for branching |

**NULL rule:** any `=`, `<>`, or arithmetic with NULL yields NULL, not true/false.
Never "simplify" a NULL-aware predicate (`x IS NULL OR x = 1`) into one that drops
the NULL branch.

---

## Joins

- **Explicit `JOIN ... ON`** over comma joins with `WHERE` conditions -- clearer
  and separates join logic from filters.
- **Drop redundant join conditions** only when they're truly implied.
- **Do not change `LEFT`/`INNER`** to shorten -- the join type is behavior.

---

## Anti-Patterns to Avoid When Simplifying SQL

| Do NOT do this | Why |
|---|---|
| Expand `SELECT *` without seeing the columns | Guessing the column list changes output |
| Remove `DISTINCT` that masks a join fan-out | Changes the row count -- flag the fan-out instead |
| Convert `IN (subquery)`/`NOT IN` to a JOIN blindly | Fan-out + NULL semantics differ |
| Rewrite `NOT (a = b)` to `a <> b` ignoring NULLs | Three-valued logic drops the NULL branch |
| Add CTEs on an engine where they block optimization | Regresses the query plan on hot paths |
| Change `LEFT JOIN` to `INNER JOIN` to "clean up" | Drops unmatched rows -- behavior change |
| Assume the dialect | Functions/semantics vary; verify before rewriting |
