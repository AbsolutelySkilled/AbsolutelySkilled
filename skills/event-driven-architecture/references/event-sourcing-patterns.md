<!-- Part of the event-driven-architecture AbsolutelySkilled skill. Load this file when
     working with event sourcing implementation details, snapshots, projections, or
     temporal queries. -->

# Event Sourcing Patterns

## Event Store Implementation

The event store is the single source of truth in an event-sourced system. It is an
append-only log of domain events, keyed by aggregate ID.

### Core operations

| Operation | Description |
|---|---|
| Append | Add new events for an aggregate at a specific expected version |
| Load | Retrieve all events for an aggregate (optionally from a snapshot) |
| Subscribe | Stream new events as they are appended (for projections) |

### Optimistic concurrency

Every append includes an expected version number. If the current version in the store
does not match, the append fails with a concurrency conflict. The caller must reload
the aggregate, re-validate business rules, and retry.

```python
def append_events(aggregate_id, events, expected_version):
    current_version = store.get_latest_version(aggregate_id)
    if current_version != expected_version:
        raise ConcurrencyConflict(
            f"Expected version {expected_version}, got {current_version}"
        )
    for i, event in enumerate(events):
        event.version = expected_version + i + 1
        store.insert(event)
```

### Storage backends

| Backend | Pros | Cons |
|---|---|---|
| PostgreSQL + events table | Familiar, ACID, easy to query | Requires manual subscription mechanism (LISTEN/NOTIFY or polling) |
| EventStoreDB | Purpose-built, built-in subscriptions, projections | Operational overhead of a specialized database |
| DynamoDB + streams | Serverless, auto-scaling, built-in change streams | Partition key design is critical; 1MB item limit |
| Kafka (as event store) | High throughput, built-in replication | Log compaction complicates aggregate reconstruction; not a natural fit |

**Recommendation:** Start with PostgreSQL for simplicity. Move to EventStoreDB when
you need built-in subscriptions and projections at scale.

---

## Snapshots

Snapshots periodically checkpoint the aggregate state to avoid replaying the full
event history on every load.

### When to snapshot

- Every N events (e.g., every 100 events per aggregate)
- When aggregate reconstruction exceeds a latency threshold (e.g., >50ms)
- Never snapshot on every event - the overhead defeats the purpose

### Snapshot schema

```sql
CREATE TABLE snapshots (
  aggregate_id   UUID NOT NULL,
  aggregate_type VARCHAR(100) NOT NULL,
  version        INTEGER NOT NULL,
  state          JSONB NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (aggregate_id)
);
```

### Load with snapshot

```python
def load_aggregate(aggregate_id):
    snapshot = snapshot_store.get_latest(aggregate_id)
    if snapshot:
        aggregate = deserialize(snapshot.state)
        events = event_store.get_events(
            aggregate_id, after_version=snapshot.version
        )
    else:
        aggregate = Order()
        events = event_store.get_events(aggregate_id)

    for event in events:
        aggregate.apply(event)
    return aggregate
```

### Snapshot invalidation

Snapshots are never invalidated - they are a cache of a point-in-time state. If the
aggregate model changes (new fields, different apply logic), delete all snapshots
and let them rebuild lazily.

---

## Projections

Projections (also called read models or materializers) subscribe to the event stream
and build denormalized views optimized for specific queries.

### Types of projections

| Type | Description | Use case |
|---|---|---|
| Inline projection | Built synchronously as part of the command handler | When strong read-after-write consistency is required |
| Async projection | Built by a background consumer subscribing to events | Default choice; decouples read from write |
| Catch-up projection | Replays historical events to build a new read model | When adding a new query requirement to an existing system |

### Projection lifecycle

1. **Start from position zero** - subscribe to the event stream from the beginning
2. **Process each event** - update the read model based on event type
3. **Track position** - store the last processed event position/offset
4. **Handle restarts** - resume from the last stored position

```python
class ProjectionRunner:
    def __init__(self, projection, position_store):
        self.projection = projection
        self.position_store = position_store

    def run(self):
        last_position = self.position_store.get(self.projection.name)
        for event in event_store.subscribe(after=last_position):
            self.projection.handle(event)
            self.position_store.save(self.projection.name, event.position)
```

### Rebuilding projections

If a projection is corrupted or the schema changes:
1. Delete the projection data
2. Reset the position to zero
3. Replay all events

This is one of the major benefits of event sourcing - projections are disposable
and rebuildable.

---

## Temporal Queries

Event sourcing enables temporal queries that are impossible with mutable state.

### Point-in-time reconstruction

```python
def get_state_at(aggregate_id, timestamp):
    events = event_store.get_events(
        aggregate_id, up_to=timestamp
    )
    aggregate = Order()
    for event in events:
        aggregate.apply(event)
    return aggregate
```

### Event history for audit

```python
def get_audit_trail(aggregate_id):
    events = event_store.get_events(aggregate_id)
    return [
        {
            "when": e.created_at,
            "what": e.event_type,
            "who": e.metadata.get("user_id"),
            "data": e.event_data
        }
        for e in events
    ]
```

### Retroactive corrections

When a business rule was wrong and past events need correction:
1. Never delete or update existing events
2. Append a compensating event (e.g., OrderAmountCorrected)
3. The compensating event adjusts the aggregate state going forward
4. Projections replay and self-correct

---

## Event Upcasting

When event schemas evolve, upcasters transform old event formats to new ones at
read time.

```python
class OrderPlacedV1ToV2Upcaster:
    def can_upcast(self, event):
        return event.type == "OrderPlaced" and event.schema_version == 1

    def upcast(self, event):
        event.data["currency"] = "USD"  # new required field with default
        event.schema_version = 2
        return event
```

### Upcasting rules

- Upcasters run in a chain: V1 -> V2 -> V3
- Never modify the stored event - upcast only at read time
- Keep upcasters simple - field additions with defaults, field renames
- If the transformation is complex, consider a one-time migration that appends
  new-format events and marks old ones as superseded

---

## Aggregate Design Guidelines

| Guideline | Rationale |
|---|---|
| Keep aggregates small | Fewer events to replay; fewer concurrency conflicts |
| One aggregate per transaction | Cross-aggregate consistency requires sagas |
| Aggregate boundaries = consistency boundaries | Everything inside an aggregate is strongly consistent |
| Reference other aggregates by ID only | Prevents coupling and enables independent scaling |
| Apply events, not commands, to state | The apply method must be pure - no side effects, no validation |
