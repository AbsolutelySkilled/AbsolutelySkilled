<!-- Part of the real-time-streaming AbsolutelySkilled skill. Load this file when
     working with Flink job design, checkpointing, state management, or complex event processing. -->

# Flink Patterns

## Checkpointing and Fault Tolerance

### Checkpoint configuration

```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

// Enable checkpointing every 60 seconds
env.enableCheckpointing(60000, CheckpointingMode.EXACTLY_ONCE);

// Checkpoint must complete within 10 minutes or be discarded
env.getCheckpointConfig().setCheckpointTimeout(600000);

// Allow only 1 checkpoint in progress at a time
env.getCheckpointConfig().setMaxConcurrentCheckpoints(1);

// Minimum 30 seconds between checkpoint starts
env.getCheckpointConfig().setMinPauseBetweenCheckpoints(30000);

// Keep checkpoints on cancellation for manual recovery
env.getCheckpointConfig().setExternalizedCheckpointCleanup(
    ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);
```

### Checkpoint interval tuning

- **Short interval (10-30s)**: Lower recovery time but higher I/O overhead. Use for
  latency-sensitive jobs with small state.
- **Medium interval (60-120s)**: Good default for most production jobs.
- **Long interval (5-10min)**: For jobs with very large state (TBs) where checkpoint
  I/O is expensive.

### Savepoints vs checkpoints

| Feature | Checkpoint | Savepoint |
|---|---|---|
| Purpose | Automatic fault tolerance | Manual operational snapshot |
| Triggered by | Flink runtime | Operator (CLI or REST API) |
| Format | Incremental, optimized | Full, portable |
| Use case | Crash recovery | Job upgrades, migration, A/B testing |
| Retained on cancel | Configurable | Always retained |

Always take a savepoint before: upgrading job code, changing parallelism, migrating
clusters, or modifying state schema.

```bash
# Trigger savepoint
flink savepoint <jobId> s3://flink-savepoints/job-name/

# Restore from savepoint
flink run -s s3://flink-savepoints/job-name/savepoint-abc123 job.jar
```

## State Backends

### RocksDB (recommended for production)

```java
env.setStateBackend(new EmbeddedRocksDBStateBackend(true)); // incremental checkpoints
env.getCheckpointConfig().setCheckpointStorage("s3://flink-checkpoints/job-name/");
```

- Supports state larger than available memory (spills to disk).
- Incremental checkpoints: only uploads changed SST files.
- Tune `state.backend.rocksdb.block.cache-size` (default 8MB, increase to 256MB+).
- Monitor `rocksdb_compaction_pending` - high values indicate I/O bottleneck.

### HashMap (in-memory)

```java
env.setStateBackend(new HashMapStateBackend());
```

- Faster for small state (fits in JVM heap).
- Full checkpoint every time (no incremental).
- Use only when state fits comfortably in memory with headroom.

## Windowing Strategies

### Window types

| Type | Behavior | Use case |
|---|---|---|
| Tumbling | Fixed-size, non-overlapping | Hourly aggregations, batch-like processing |
| Sliding | Fixed-size, overlapping | Moving averages, rolling metrics |
| Session | Gap-based, variable size | User session analysis, activity grouping |
| Global | One window per key, custom triggers | Custom aggregation logic |

### Event time vs processing time

Always prefer **event time** for correctness. Processing time is simpler but produces
inconsistent results during backfill or replay.

```java
// Event time with bounded out-of-orderness
WatermarkStrategy.<Event>forBoundedOutOfOrderness(Duration.ofSeconds(30))
    .withTimestampAssigner((event, ts) -> event.getEventTime())
    .withIdleness(Duration.ofMinutes(1)); // handle idle partitions
```

The `withIdleness` call is critical for topics with uneven partition throughput.
Without it, an idle partition holds back the watermark for the entire operator,
stalling all windows.

### Custom triggers

```java
.window(TumblingEventTimeWindows.of(Time.minutes(5)))
.trigger(ContinuousEventTimeTrigger.of(Time.seconds(30)))
```

Fires intermediate results every 30 seconds within a 5-minute window. Useful for
dashboards that need frequent updates before the window closes.

## Complex Event Processing (CEP)

Detect patterns in event streams using Flink's CEP library.

```java
Pattern<Event, ?> pattern = Pattern.<Event>begin("start")
    .where(new SimpleCondition<Event>() {
        public boolean filter(Event e) { return e.getType().equals("LOGIN_FAILED"); }
    })
    .timesOrMore(3)
    .within(Time.minutes(5))
    .followedBy("success")
    .where(new SimpleCondition<Event>() {
        public boolean filter(Event e) { return e.getType().equals("LOGIN_SUCCESS"); }
    });

PatternStream<Event> patternStream = CEP.pattern(events.keyBy(Event::getUserId), pattern);

patternStream.select(new PatternSelectFunction<Event, Alert>() {
    public Alert select(Map<String, List<Event>> matches) {
        return new Alert("BRUTE_FORCE_DETECTED", matches.get("start").get(0).getUserId());
    }
});
```

> CEP patterns are stateful and consume memory proportional to the number of
> in-progress pattern matches. Set `within()` to bound memory usage.

## Table API and SQL

For analysts and simpler transformations, Flink SQL is often more productive.

```sql
CREATE TABLE orders (
    order_id STRING,
    amount DECIMAL(10, 2),
    event_time TIMESTAMP(3),
    WATERMARK FOR event_time AS event_time - INTERVAL '10' SECOND
) WITH (
    'connector' = 'kafka',
    'topic' = 'orders',
    'properties.bootstrap.servers' = 'broker:9092',
    'format' = 'json'
);

SELECT
    TUMBLE_START(event_time, INTERVAL '1' HOUR) AS window_start,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM orders
GROUP BY TUMBLE(event_time, INTERVAL '1' HOUR);
```

> Flink SQL windows use the same watermark mechanism as the DataStream API.
> Ensure `WATERMARK FOR` is defined in the table DDL for event-time processing.

## Performance Tuning

### Parallelism

- Set job-level default: `env.setParallelism(N)`.
- Override per operator for hotspots: `stream.keyBy(...).window(...).setParallelism(32)`.
- Parallelism cannot exceed partition count of the source topic.

### Network buffers

```
taskmanager.network.memory.fraction: 0.15
taskmanager.network.memory.min: 256mb
taskmanager.network.memory.max: 1gb
```

Increase for high-throughput jobs or when seeing backpressure at network level.

### Managed memory

```
taskmanager.memory.managed.fraction: 0.4
```

RocksDB state backend uses managed memory for its block cache and write buffers.
Increase this fraction for state-heavy jobs.
