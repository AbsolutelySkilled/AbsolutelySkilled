<!-- Part of the data-pipelines AbsolutelySkilled skill. Load this file when
     working with streaming pipelines, Kafka, Flink, exactly-once semantics,
     late-arriving data, or windowing strategies. -->

# Streaming Architecture

## When to use streaming

Streaming adds significant complexity. Use it only when you have a proven
requirement for low-latency data processing:

| Requirement | Architecture |
|---|---|
| Dashboard refreshed every few seconds | Streaming |
| Real-time fraud detection or alerting | Streaming |
| Event-driven microservice reactions | Streaming |
| Hourly/daily analytics and reporting | Batch |
| Historical trend analysis | Batch |
| ML model training on large datasets | Batch |

If unsure, start with batch. You can always add streaming later for the
specific use cases that need it.

## Core streaming concepts

### Event time vs processing time

- **Event time**: when the event actually occurred (embedded in the event payload)
- **Processing time**: when the system processes the event

Always use event time for aggregations. Processing time is unreliable because
network delays, consumer restarts, and backpressure cause events to arrive
out of order.

### Delivery guarantees

| Guarantee | Meaning | Use when |
|---|---|---|
| At-most-once | Events may be lost, never duplicated | Metrics where small loss is acceptable |
| At-least-once | No loss, but duplicates possible | Most use cases (with idempotent consumers) |
| Exactly-once | No loss, no duplicates | Financial transactions, billing |

Exactly-once is expensive. It requires coordination between source, processor,
and sink (typically using transactions or idempotent writes). Prefer
at-least-once with idempotent consumers for most workloads.

### Windowing

Windows group streaming events into finite chunks for aggregation:

| Window type | Description | Use case |
|---|---|---|
| Tumbling | Fixed-size, non-overlapping | Hourly counts, daily totals |
| Sliding | Fixed-size, overlapping | Moving averages (5-min window, 1-min slide) |
| Session | Gap-based, variable size | User session activity (close window after 30min idle) |

## Kafka fundamentals

### Topics and partitions

A Kafka topic is split into partitions. Each partition is an ordered, immutable
log. Partitions enable parallelism - consumers in a group each read from
different partitions.

**Partition key matters:** Events with the same key always go to the same
partition (preserving order for that key). Choose a key that distributes
evenly and groups related events:

```
Good key: user_id (even distribution, related events together)
Bad key:  country (skew - US partition gets 50% of traffic)
Bad key:  null (round-robin, loses ordering guarantees)
```

### Consumer groups

Each consumer group gets a full copy of the data. Within a group, each
partition is assigned to exactly one consumer. Scale consumers up to the
number of partitions (more consumers than partitions means idle consumers).

### Retention and compaction

| Policy | Behavior | Use when |
|---|---|---|
| Time-based retention | Delete events older than N days | Event streams, logs |
| Log compaction | Keep only latest value per key | Changelog streams, state snapshots |

## Exactly-once processing

### Kafka transactions (Kafka Streams / Flink)

The pattern: read from input topic, process, write to output topic - all in
one atomic transaction.

```
1. Consumer reads batch of events
2. Process events, produce output events
3. Commit consumer offsets AND producer writes atomically
4. If any step fails, the entire transaction rolls back
```

In Flink:

```java
// Flink Kafka sink with exactly-once
KafkaSink<String> sink = KafkaSink.<String>builder()
    .setBootstrapServers("kafka:9092")
    .setDeliveryGuarantee(DeliveryGuarantee.EXACTLY_ONCE)
    .setTransactionalIdPrefix("flink-job-1")
    .setRecordSerializer(...)
    .build();
```

### Idempotent consumers (alternative)

If the sink supports idempotent writes (upsert by key), you can achieve
effectively-exactly-once with at-least-once delivery:

```python
# Idempotent write to database - duplicate events just overwrite
def process_event(event):
    db.execute("""
        INSERT INTO orders (order_id, status, updated_at)
        VALUES (%s, %s, %s)
        ON CONFLICT (order_id)
        DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at
    """, (event.order_id, event.status, event.timestamp))
```

## Handling late-arriving data

Events arrive late due to network delays, offline devices, or batch uploads.

### Watermarks

A watermark is a threshold that says: "I believe all events with event time
before this watermark have arrived." Events arriving after the watermark are
considered late.

```python
# Spark Structured Streaming with watermark
from pyspark.sql.functions import window

events = spark.readStream.format("kafka").load()

windowed_counts = events \
    .withWatermark("event_time", "2 hours") \
    .groupBy(
        window("event_time", "1 hour"),
        "event_type"
    ) \
    .count()
```

The watermark of "2 hours" means: events arriving more than 2 hours late
are dropped. Events within the 2-hour grace period update the window result.

### Late data strategies

| Strategy | Trade-off |
|---|---|
| Drop late events | Simple, but loses data |
| Allow late updates within grace period | Good balance, most common |
| Side-output late events for batch reprocessing | No data loss, adds complexity |

## Spark Structured Streaming

### Trigger modes

| Mode | Behavior | Use when |
|---|---|---|
| `processingTime="10 seconds"` | Micro-batch every 10s | Most use cases |
| `availableNow=True` | Process all available, then stop | Incremental batch in streaming framework |
| `continuous` (experimental) | True continuous, ~1ms latency | Ultra-low latency needs |

```python
query = windowed_counts.writeStream \
    .outputMode("update") \
    .format("delta") \
    .option("checkpointLocation", "s3://checkpoints/hourly_counts") \
    .trigger(processingTime="30 seconds") \
    .start()
```

### Output modes

| Mode | Behavior | Use with |
|---|---|---|
| `append` | Only new rows | Non-aggregate queries, watermarked aggregates |
| `update` | Changed rows only | Aggregates (most common) |
| `complete` | Full result table every trigger | Small result sets, unbounded aggregates |

### Checkpointing

Every streaming query must have a checkpoint location. Checkpoints store:
- Current offsets (where in Kafka/files the query has read to)
- State for aggregations (window contents, running counts)
- Metadata for recovery

> Never delete checkpoints of a running query. To reset, stop the query,
> delete the checkpoint, and restart. Changing the query logic may require
> a new checkpoint if the state schema changes.

## Architecture patterns

### Lambda architecture

Run batch and streaming in parallel. Batch produces the "correct" result
(recomputed from raw data). Streaming produces the "fast" result (approximate,
real-time). A serving layer merges both views.

```
Source -> Kafka -> Streaming layer -> Speed view
                -> Batch layer    -> Batch view
                                     |
                          Serving layer (merge)
```

**Downside:** Two codebases doing the same computation, eventual consistency
between views, operational complexity.

### Kappa architecture

Single streaming layer processes everything. Historical reprocessing is done
by replaying the event log from the beginning.

```
Source -> Kafka (long retention) -> Stream processor -> Serving layer
```

**Downside:** Replay can be slow for large histories. Not all computations
are naturally expressible as streaming.

### Practical recommendation

Most teams should use **batch as the default** with **streaming for specific
hot paths** (fraud, alerting, live dashboards). This avoids the operational
burden of full streaming while getting real-time where it matters.

## Common streaming pitfalls

| Pitfall | Fix |
|---|---|
| No dead letter queue | Route failed events to a DLQ for manual review |
| Unbounded state in aggregations | Use watermarks to expire old state |
| Consumer lag growing unbounded | Scale consumers, optimize processing, or increase partitions |
| No backpressure handling | Configure max records per poll, enable consumer flow control |
| Schema changes break consumers | Use a schema registry (Confluent, AWS Glue) with compatibility checks |
| Testing only happy path | Test late events, out-of-order events, duplicate events, and poison pills |
