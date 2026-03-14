<!-- Part of the real-time-streaming AbsolutelySkilled skill. Load this file when
     working with Debezium CDC configuration, schema evolution, or database-specific setup. -->

# CDC with Debezium

## Architecture Overview

Debezium runs as a Kafka Connect source connector. It reads the database's transaction
log and publishes change events to Kafka topics (one topic per table by default).

```
Database (WAL/binlog) -> Debezium Connector -> Kafka Topics -> Consumers
```

Each change event contains:
- `before`: row state before the change (null for inserts)
- `after`: row state after the change (null for deletes)
- `op`: operation type (`c`=create, `u`=update, `d`=delete, `r`=read/snapshot)
- `source`: metadata (database, table, LSN/binlog position, timestamp)
- `ts_ms`: event timestamp

## PostgreSQL Configuration

### Database prerequisites

```sql
-- Enable logical replication in postgresql.conf
-- wal_level = logical
-- max_replication_slots = 4
-- max_wal_senders = 4

-- Create a dedicated user
CREATE ROLE debezium WITH LOGIN REPLICATION PASSWORD 'secret';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;

-- Create a publication (pgoutput plugin)
CREATE PUBLICATION dbz_publication FOR TABLE orders, order_items, customers;
```

### Connector configuration

```json
{
  "name": "pg-orders-cdc",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "db-primary.internal",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "${file:/secrets/cdc-password.txt:password}",
    "database.dbname": "commerce",
    "topic.prefix": "cdc",
    "table.include.list": "public.orders,public.order_items",
    "plugin.name": "pgoutput",
    "publication.name": "dbz_publication",
    "slot.name": "debezium_orders",
    "snapshot.mode": "initial",
    "heartbeat.interval.ms": "10000",
    "heartbeat.action.query": "UPDATE debezium_heartbeat SET ts = NOW()",
    "tombstones.on.delete": true,
    "decimal.handling.mode": "string",
    "time.precision.mode": "connect"
  }
}
```

### Replication slot management

Replication slots prevent WAL segments from being recycled until consumed. If the
connector falls behind or is removed without cleaning up:

- WAL accumulates on disk, eventually filling the volume
- `pg_replication_slots` shows `active=false` for orphaned slots

**Monitor and alert on:**
```sql
SELECT slot_name, active, pg_size_pretty(
  pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
) AS slot_lag
FROM pg_replication_slots;
```

Alert when slot lag exceeds a threshold (e.g., 1GB). Drop orphaned slots with:
```sql
SELECT pg_drop_replication_slot('debezium_orders');
```

### Heartbeats

The heartbeat mechanism prevents WAL bloat on low-traffic tables. Without heartbeats,
the replication slot holds WAL even when no changes occur on monitored tables.

Set `heartbeat.interval.ms=10000` and `heartbeat.action.query` to a lightweight
UPDATE on a dedicated heartbeat table.

## MySQL Configuration

### Database prerequisites

```sql
-- Enable binlog in my.cnf
-- server-id = 1
-- log_bin = mysql-bin
-- binlog_format = ROW
-- binlog_row_image = FULL
-- expire_logs_days = 3

-- Create a dedicated user
CREATE USER 'debezium'@'%' IDENTIFIED BY 'secret';
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium'@'%';
```

### GTID mode (recommended)

```json
{
  "connector.class": "io.debezium.connector.mysql.MySqlConnector",
  "database.hostname": "mysql-primary",
  "database.port": "3306",
  "database.user": "debezium",
  "database.password": "${file:/secrets/mysql-password.txt:password}",
  "database.server.id": "184054",
  "topic.prefix": "cdc",
  "database.include.list": "commerce",
  "table.include.list": "commerce.orders,commerce.customers",
  "include.schema.changes": true,
  "gtid.source.includes": ".*",
  "snapshot.mode": "initial"
}
```

> Use GTIDs for reliable binlog position tracking across failovers. Without GTIDs,
> a MySQL primary failover can cause the connector to lose its position.

## Snapshot Modes

| Mode | Behavior | When to use |
|---|---|---|
| `initial` | Snapshot existing data, then stream changes | First deployment |
| `initial_only` | Snapshot only, no streaming | One-time migration |
| `no_data` | No snapshot, stream changes from current position | Redeployment after initial snapshot |
| `when_needed` | Snapshot if offsets are missing | Safe default for restarts |
| `never` | Never snapshot | When you control the starting offset |

> After the initial deployment with `snapshot.mode=initial`, change to
> `when_needed` for resilience. If offsets are lost (e.g., Kafka topic deleted),
> it will automatically re-snapshot.

## Schema Evolution

### Compatible changes (no connector restart needed)

- Adding a nullable column
- Adding a column with a default value
- Increasing column width (e.g., VARCHAR(50) to VARCHAR(100))

### Breaking changes (require planning)

- Renaming a column: Debezium sees this as drop + add. Downstream consumers must handle both field names during transition.
- Changing column type: May break deserialization. Use Avro + schema registry with
  `BACKWARD` compatibility to catch issues before deployment.
- Dropping a column: The `before` image will stop containing the field. Consumers
  relying on that field will break.

### Recommended approach for schema changes

1. Deploy consumer code that handles both old and new schema
2. Apply the database schema change
3. Debezium automatically picks up the new schema from the transaction log
4. After all old-schema events are processed, remove legacy handling from consumers

## Transforms (SMTs)

### Common single-message transforms

```json
{
  "transforms": "route,unwrap,filter",

  "transforms.route.type": "io.debezium.transforms.ByLogicalTableRouter",
  "transforms.route.topic.regex": "cdc\\.public\\.(.*)",
  "transforms.route.topic.replacement": "cdc.$1",

  "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
  "transforms.unwrap.drop.tombstones": false,
  "transforms.unwrap.delete.handling.mode": "rewrite",
  "transforms.unwrap.add.fields": "op,source.ts_ms",

  "transforms.filter.type": "io.debezium.transforms.Filter",
  "transforms.filter.language": "jsr223.groovy",
  "transforms.filter.condition": "value.op != 'r'"
}
```

- **ByLogicalTableRouter**: Simplify topic names (remove schema prefix).
- **ExtractNewRecordState**: Flatten the envelope to just the `after` state. Useful
  when sinking to databases or search indexes that expect flat records.
- **Filter**: Drop snapshot records (`op=r`) or filter by field values.

## Monitoring

### Key Kafka Connect metrics

| Metric | What it means |
|---|---|
| `source-record-poll-total` | Total records polled from the database |
| `source-record-write-total` | Total records written to Kafka |
| `source-record-active-count` | Records polled but not yet written (backlog) |
| `milliseconds-behind-source` | How far the connector is behind the database |
| `snapshot-completion-pct` | Progress of initial snapshot (0-100) |

### Debezium-specific metrics (JMX)

```
debezium.postgres:type=connector-metrics,context=streaming,server=<prefix>
  - MilliSecondsBehindSource
  - NumberOfEventsFiltered
  - LastEvent
  - Connected
```

Alert on `MilliSecondsBehindSource` trending upward and `Connected=false`.
