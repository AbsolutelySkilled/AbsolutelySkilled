<!-- Part of the real-time-streaming AbsolutelySkilled skill. Load this file when
     working with stream processing patterns, joins, deduplication, or watermark tuning. -->

# Stream Processing Patterns

## Windowing Deep Dive

### Tumbling windows

Non-overlapping, fixed-size windows. Every event belongs to exactly one window.

```
Time:  |---W1---|---W2---|---W3---|
Events: e1 e2    e3 e4 e5  e6
```

Best for: periodic aggregations (per-minute counts, hourly summaries).

### Sliding windows

Fixed-size windows that advance by a slide interval. Events belong to multiple windows.

```
Window size: 10min, Slide: 5min
Time:  |---W1 (0-10)---|
            |---W2 (5-15)---|
                 |---W3 (10-20)---|
```

Best for: moving averages, rolling metrics, trend detection.

> Sliding windows with small slide intervals create many overlapping windows and
> multiply state size. A 1-hour window with 1-second slides creates 3600 windows
> per key. Use sparingly.

### Session windows

Variable-size windows defined by an inactivity gap. A new event after the gap starts
a new session.

```
Gap: 5min
Events: e1 e2  [5min gap]  e3 e4 e5  [5min gap]  e6
Windows: |--S1--|           |---S2---|             |S3|
```

Best for: user session analysis, activity grouping, click-stream analysis.

### Global windows with custom triggers

A single window per key that never closes. Use custom triggers to emit results.

```java
.window(GlobalWindows.create())
.trigger(PurgingTrigger.of(CountTrigger.of(100)))
```

Best for: batch-like processing on streams (emit every N elements).

## Join Patterns

### Stream-stream joins

Join two event streams within a time window. Both sides are buffered.

```java
orderStream
    .keyBy(Order::getOrderId)
    .intervalJoin(paymentStream.keyBy(Payment::getOrderId))
    .between(Time.seconds(-5), Time.minutes(30))
    .process(new OrderPaymentJoinFunction());
```

- `between(-5s, +30min)`: Match payments that arrive between 5 seconds before and
  30 minutes after the order.
- Both streams are buffered in state for the join window duration.
- State grows with: (event rate) x (window duration) x (key cardinality).

### Stream-table joins (enrichment)

Join a stream against a slowly-changing dimension (lookup table).

**Kafka Streams:**
```java
KStream<String, Order> orders = builder.stream("orders");
KTable<String, Customer> customers = builder.table("customers");
orders.join(customers, (order, customer) -> enrich(order, customer));
```

**Flink (temporal table join):**
```sql
SELECT o.*, c.name, c.tier
FROM orders o
JOIN customers FOR SYSTEM_TIME AS OF o.event_time AS c
ON o.customer_id = c.id;
```

The temporal join uses the version of the customer record valid at the order's
event time, not the current version. Essential for correct historical analysis.

### Table-table joins

Both sides are materialized as tables. Produces a new table that updates when
either input changes.

```java
KTable<String, Order> orders = builder.table("orders");
KTable<String, Shipment> shipments = builder.table("shipments");
KTable<String, OrderStatus> status = orders.join(
    shipments,
    (order, shipment) -> new OrderStatus(order, shipment)
);
```

## Deduplication

### Idempotent sinks

The simplest approach: make the sink handle duplicates.

- **Database upserts**: `INSERT ... ON CONFLICT DO UPDATE`
- **Redis**: `SET` is naturally idempotent
- **Elasticsearch**: Index with a deterministic `_id`

### Stream-level deduplication

Use state to track seen event IDs within a window.

```java
events
    .keyBy(Event::getEventId)
    .process(new DeduplicationFunction(Time.minutes(10)));

// DeduplicationFunction keeps a ValueState<Boolean> per key with TTL
// Emits the event only on first occurrence within the TTL window
```

> Set TTL aggressively. Dedup state grows linearly with unique event IDs. A
> 24-hour dedup window on a high-cardinality stream can consume TBs of state.

### Kafka-level deduplication

Idempotent producers handle network-retry duplicates automatically. For application-
level duplicates (same business event sent twice), use a compacted topic as a
dedup buffer:

1. Produce to a compacted intermediate topic keyed by dedup ID
2. Consumer reads from the compacted topic (only latest per key)
3. Compaction removes earlier duplicates over time

## Watermark Strategies

### Bounded out-of-orderness

```java
WatermarkStrategy.<Event>forBoundedOutOfOrderness(Duration.ofSeconds(30))
```

Watermark = max observed event time - 30 seconds. Simple and effective when you
know the maximum expected delay.

### Custom watermark generator

```java
WatermarkStrategy.<Event>forGenerator(ctx -> new WatermarkGenerator<Event>() {
    private long maxTimestamp = Long.MIN_VALUE;

    public void onEvent(Event event, long eventTimestamp, WatermarkOutput output) {
        maxTimestamp = Math.max(maxTimestamp, event.getTimestamp());
    }

    public void onPeriodicEmit(WatermarkOutput output) {
        output.emitWatermark(new Watermark(maxTimestamp - 30000));
    }
});
```

Use custom generators when:
- Different sources have different latency characteristics
- You need to emit watermarks based on external signals (e.g., a "flush" event)

### Handling idle sources

```java
.withIdleness(Duration.ofMinutes(1))
```

If a partition produces no events for 1 minute, it is marked idle and excluded
from watermark calculation. Without this, one idle partition blocks all windows.

### Watermark alignment (Flink 1.15+)

```java
.withWatermarkAlignment("alignment-group", Duration.ofSeconds(20))
```

Prevents fast sources from advancing the watermark too far ahead of slow sources.
Limits the drift between the fastest and slowest source in the alignment group.

## Exactly-Once Patterns

### End-to-end exactly-once checklist

1. **Source**: Kafka consumer with committed offsets (replay on failure)
2. **Processing**: Flink checkpointing or Kafka Streams state stores
3. **Sink**: One of:
   - Idempotent writes (upserts, conditional writes)
   - Two-phase commit sink (Flink's `TwoPhaseCommitSinkFunction`)
   - Transactional Kafka producer (atomic offset + output commit)

### Two-phase commit sinks (Flink)

```java
public class ExactlyOnceDatabaseSink extends TwoPhaseCommitSinkFunction<Record, Connection, Void> {
    protected Connection beginTransaction() {
        Connection conn = dataSource.getConnection();
        conn.setAutoCommit(false);
        return conn;
    }
    protected void invoke(Connection txn, Record value, Context ctx) {
        // Write to database within transaction
    }
    protected void preCommit(Connection txn) {
        txn.flush(); // Ensure all writes are sent
    }
    protected void commit(Connection txn) {
        txn.commit();
        txn.close();
    }
    protected void abort(Connection txn) {
        txn.rollback();
        txn.close();
    }
}
```

> Two-phase commit sinks hold open transactions between checkpoints. This means
> the transaction duration equals the checkpoint interval. Set checkpoint interval
> low enough to avoid long-running transactions that cause database lock contention.

## Backpressure Handling

### Flink (built-in)

Flink uses credit-based flow control. When a downstream operator is slow:
- It stops granting credits to the upstream operator
- The upstream operator buffers locally until credits are available
- Backpressure propagates upstream to the source

**Diagnosing**: Check the Flink Web UI's backpressure tab. Look for operators with
`HIGH` backpressure ratio. The bottleneck is typically the first operator that is
NOT backpressured (it's the slow one causing pressure upstream).

### Kafka consumers

Kafka does not have built-in backpressure. Instead:
- Reduce `max.poll.records` to process smaller batches
- Increase `max.poll.interval.ms` to allow longer processing time
- Use `pause()` / `resume()` on specific partitions to temporarily stop fetching

```java
consumer.pause(overloadedPartitions);
// Process existing records
consumer.resume(overloadedPartitions);
```

## Event Sourcing with Streams

### Pattern: Event store on Kafka

```
Command -> Validate -> Event (Kafka topic, key=entityId)
                              |
                              +-> Projector 1 -> Read DB (PostgreSQL)
                              +-> Projector 2 -> Search index (Elasticsearch)
                              +-> Projector 3 -> Analytics (ClickHouse)
```

- Use a compacted + time-retained topic for the event store
- Key by entity ID for ordering guarantees per entity
- Projectors are independent Kafka consumers (different consumer groups)
- Each projector materializes a different read model

### Snapshots for long event histories

When replaying hundreds of thousands of events per entity is too slow:

1. Periodically write a snapshot to a separate compacted topic
2. On recovery, load the latest snapshot, then replay events after the snapshot offset
3. Snapshot frequency: every N events or every T minutes per entity
