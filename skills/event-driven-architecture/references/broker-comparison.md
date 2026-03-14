<!-- Part of the event-driven-architecture AbsolutelySkilled skill. Load this file when
     choosing or configuring a message broker, comparing Kafka vs RabbitMQ, or
     troubleshooting broker-related issues. -->

# Message Broker Comparison

## Quick Decision Matrix

| Factor | Kafka / Redpanda | RabbitMQ | AWS SQS + SNS | NATS |
|---|---|---|---|---|
| Message retention | Days/weeks (configurable) | Until consumed | 14 days max | No retention (JetStream adds it) |
| Ordering guarantee | Per-partition | Per-queue (single consumer) | FIFO queues only | Per-subject (JetStream) |
| Replay capability | Yes (offset-based) | No | No | JetStream only |
| Throughput | Millions/sec | Tens of thousands/sec | Scales automatically | Millions/sec |
| Routing flexibility | Topics + partitions | Exchanges + routing keys | SNS filters | Subjects with wildcards |
| Ops complexity | High (ZooKeeper/KRaft, partitions) | Medium | Zero (managed) | Low |
| Best for | Event streaming, log aggregation | Task queues, RPC, routing | Serverless, AWS-native | Microservice messaging, IoT |

---

## Apache Kafka / Redpanda

### Core model

Kafka organizes messages into **topics**, each split into **partitions**. Producers
write to a topic; the partition is chosen by the message key (hash) or round-robin.
Consumers read from partitions in **consumer groups** - each partition is assigned to
exactly one consumer in a group.

### Key configuration

| Config | Default | Recommendation |
|---|---|---|
| `replication.factor` | 1 | Set to 3 for production |
| `min.insync.replicas` | 1 | Set to 2 (with replication.factor=3) |
| `acks` (producer) | 1 | Set to `all` for durability |
| `enable.auto.commit` | true | Set to false; commit offsets manually after processing |
| `max.poll.records` | 500 | Tune based on consumer processing time |
| `retention.ms` | 7 days | Set based on replay requirements |

### Partition key strategy

- Use the aggregate ID or entity ID as the key to guarantee ordering for that entity
- All events for the same key land on the same partition
- Never use a random or null key if ordering matters
- Avoid hot partitions - if one key produces vastly more events, use a compound key

### Consumer group patterns

**Competing consumers:** Multiple consumers in one group share the load. Each
partition is read by one consumer. Scale consumers up to the number of partitions.

**Fan-out:** Multiple consumer groups each read all messages independently. Use for
different projections, analytics, and audit systems consuming the same events.

### When to use Kafka

- Event sourcing with replay requirements
- High-throughput event streaming (>100k events/sec)
- Multiple consumers need independent reads of the same stream
- You need a durable, ordered event log
- Log aggregation and change data capture (CDC)

### Redpanda vs Kafka

Redpanda is wire-compatible with Kafka but eliminates JVM and ZooKeeper dependencies.
Written in C++, it provides lower latency and simpler operations. Use Redpanda when
you want Kafka semantics without the operational overhead.

---

## RabbitMQ

### Core model

RabbitMQ uses **exchanges**, **queues**, and **bindings**. Producers send messages to
an exchange; the exchange routes to queues based on bindings and routing keys. Consumers
read from queues.

### Exchange types

| Type | Routing behavior |
|---|---|
| Direct | Routes to queues where binding key exactly matches routing key |
| Fanout | Routes to all bound queues (broadcast) |
| Topic | Routes based on wildcard pattern matching on routing key |
| Headers | Routes based on message header attributes |

### Key configuration

| Config | Recommendation |
|---|---|
| Prefetch count | Set to 10-50 per consumer; prevents one consumer from hoarding messages |
| Message TTL | Set per-queue to prevent unbounded growth |
| Dead letter exchange | Configure on every queue; catch poison messages |
| Publisher confirms | Enable for durability; fire-and-forget loses messages |
| Quorum queues | Use instead of classic mirrored queues for replication |

### Reliability pattern

```
Producer -> Exchange -> Queue -> Consumer
   |                      |         |
   +-- publisher confirm  |    +-- manual ack
                          |
                     +-- dead letter exchange -> DLQ
```

1. Producer sends with publisher confirms enabled
2. Broker acknowledges receipt
3. Consumer processes and sends manual ACK
4. If consumer fails or rejects, message goes to dead letter exchange
5. Monitor DLQ depth; alert on non-zero

### When to use RabbitMQ

- Task queues (background jobs, email sending)
- Complex routing requirements (topic exchanges, header-based routing)
- RPC-style request/reply patterns
- When you need message-level TTL and priority queues
- Moderate throughput (<50k messages/sec)

---

## AWS SQS + SNS

### Core model

**SNS** (Simple Notification Service) is a pub/sub topic. **SQS** (Simple Queue
Service) is a message queue. Combine them: SNS fan-out to multiple SQS queues.

### SQS variants

| Feature | Standard Queue | FIFO Queue |
|---|---|---|
| Ordering | Best-effort | Strict per message group |
| Delivery | At-least-once | Exactly-once (with dedup) |
| Throughput | Unlimited | 3,000 msg/sec (with batching) |
| Deduplication | None | Content-based or explicit dedup ID |

### Key configuration

| Config | Recommendation |
|---|---|
| Visibility timeout | Set to 6x your average processing time |
| Receive wait time | 20 seconds (enable long polling; reduce empty receives) |
| Redrive policy | Max receives = 3-5 before sending to DLQ |
| Message retention | 4-14 days based on recovery needs |

### When to use SQS + SNS

- AWS-native architecture
- Serverless (Lambda consumers)
- You want zero operational overhead
- Fan-out from SNS to multiple SQS queues
- FIFO ordering per message group is sufficient

---

## NATS

### Core model

NATS is a lightweight, high-performance messaging system. Core NATS is pure pub/sub
with no persistence. **JetStream** adds persistence, replay, and consumer groups.

### Subject-based addressing

```
orders.placed       - specific event
orders.*            - wildcard: any event in orders
orders.>            - multi-level wildcard: orders.placed, orders.us.placed
```

### When to use NATS

- Microservice-to-microservice communication
- Low-latency requirements (<1ms)
- IoT and edge computing
- Simple pub/sub without complex routing
- When Kafka is overkill for your throughput needs

---

## Broker Anti-Patterns

| Anti-pattern | Problem | Solution |
|---|---|---|
| Using Kafka as a database | Compacted topics lose event history; query support is poor | Use Kafka as transport; store in a proper database |
| Auto-committing offsets in Kafka | Messages marked as consumed before processing completes; data loss on crash | Manual commit after successful processing |
| RabbitMQ with unlimited prefetch | One fast consumer starves others; memory exhaustion on consumer failure | Set prefetch to 10-50 |
| No dead-letter queue | Poison messages block the entire queue forever | Always configure DLQ; alert on depth |
| Synchronous publish in request path | Broker latency adds to user-facing response time; broker outage blocks requests | Publish asynchronously; use an outbox pattern if durability is needed |
| Choosing a broker before defining requirements | Ends up with Kafka for a task queue or RabbitMQ for event replay | Start from requirements: ordering, replay, throughput, ops budget |

---

## The Transactional Outbox Pattern

When you need to atomically update a database and publish an event (dual write problem):

1. Write the event to an "outbox" table in the same database transaction as the
   business data
2. A separate process (poller or CDC) reads the outbox table and publishes to the broker
3. After successful publish, mark the outbox entry as published

```sql
CREATE TABLE outbox (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  VARCHAR(100) NOT NULL,
  payload     JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  published   BOOLEAN DEFAULT false
);
```

This guarantees that the database write and the event publish either both happen
or neither happens - solving the dual write problem without distributed transactions.
