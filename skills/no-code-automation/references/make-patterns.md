<!-- Part of the no-code-automation AbsolutelySkilled skill. Load this file when
     working with Make (Integromat) specific automation patterns. -->

# Make Patterns

Advanced patterns for building reliable Make (formerly Integromat) scenarios
with routers, iterators, aggregators, and error handling.

---

## Scenario architecture

Make scenarios are visual flows of modules connected by routes. Unlike Zapier's
linear model, Make supports parallel branches, loops, and error recovery natively.

**Key terminology:**
- **Module** - A single operation (API call, transform, filter)
- **Route** - A connection between modules
- **Router** - Splits flow into parallel branches with filter conditions
- **Scenario** - The complete workflow (equivalent to a Zapier "Zap")
- **Operation** - One module execution (billing unit)

---

## Routers

Routers split a single data flow into multiple parallel paths. Each path
can have its own filter condition.

**Setup:**
1. Add a Router module after any step
2. Add routes by clicking the "+" on the router
3. Set filter conditions on each route (or leave one as fallback)
4. Routes execute in order - the first matching route gets the data

**Pattern: Priority-based routing**
```
Trigger: New Webhook
  |
  Router
    Route 1 (filter: priority = "critical") -> PagerDuty + Slack #critical
    Route 2 (filter: priority = "high")     -> Slack #support + Jira ticket
    Route 3 (fallback, no filter)           -> Log to Google Sheet
```

**Important:** Unlike Zapier Paths, Make routes can each trigger independent
sub-flows with their own error handlers.

---

## Iterators and aggregators

### Iterator
Splits an array into individual items for processing:

```
Get Spreadsheet Rows -> Iterator -> Process Each Row -> Create CRM Contact
```

The Iterator takes an array and emits one bundle per item. Every module
after the Iterator processes each item independently.

### Aggregator
Collects multiple bundles back into a single array:

```
Iterator -> Transform Each Item -> Array Aggregator -> Send Batch to API
```

**Common aggregator types:**
- **Array Aggregator** - Collects items into an array
- **Text Aggregator** - Joins items into a string with a separator
- **Numeric Aggregator** - Sum, average, min, max across items
- **Table Aggregator** - Creates an HTML or CSV table

> Always pair Iterator + Aggregator when you need to process items individually
> but send the result as a batch. Without the aggregator, downstream modules
> execute once per item.

---

## Data stores

Make's built-in key-value database for persisting state between executions:

**Use cases:**
- Deduplication: store processed record IDs to skip duplicates
- State tracking: remember the last processed timestamp
- Lookup tables: map codes to human-readable values
- Counters: track how many items have been processed

**Operations:**
- Add/Replace a record
- Get a record
- Search records
- Delete a record
- Delete all records

**Pattern: Deduplication**
```
Webhook Trigger
  -> Data Store: Search for record where key = event_id
  -> Filter: proceed only if record NOT found
  -> Process the event
  -> Data Store: Add record with key = event_id
```

> Data stores have a 1 MB per record limit and a total size limit based on
> your plan. For large datasets, use an external database instead.

---

## Error handling

Make has the most sophisticated error handling of the three major platforms.

### Error handler types

Right-click any module > "Add error handler" to attach one:

| Handler | Behavior | Use when |
|---|---|---|
| **Resume** | Provides fallback output, continues the scenario | You have a safe default value |
| **Commit** | Commits all previous operations, stops scenario | Partial success is acceptable |
| **Rollback** | Reverts all operations, stops scenario | All-or-nothing transactions |
| **Break** | Stores the bundle for manual retry, stops scenario | You need human review before retry |
| **Ignore** | Swallows the error silently, continues | The error is expected and harmless |

### Error handler pattern

```
API Call Module
  |-- (success) -> Continue flow
  |-- (error) -> Break handler -> Store failed bundle
                    |-> Slack notification: "Scenario X failed on record Y"
```

### Retry with exponential backoff

Make doesn't have built-in retry with backoff, but you can simulate it:

1. Add a Break error handler to the failing module
2. Configure "Automatically retry" with attempts and interval
3. Set interval to increase: 60s, 300s, 900s

---

## Operations optimization

Operations are Make's billing unit. One module execution = one operation.

**Reduce operation count:**
- Use filters before expensive modules to skip unnecessary processing
- Use "Search" modules instead of "List all + Filter" patterns
- Batch API calls: use bulk endpoints when available
- Set scenario scheduling to match actual data frequency (don't poll every
  minute if data arrives hourly)
- Use the "Map" function inline instead of adding separate Set Variable modules

**Operation counting:**
```
Trigger (1) -> Router -> Route A: 2 modules (2) + Route B: 3 modules (3) = 6 ops per execution
With 100 items through an iterator: 6 x 100 = 600 ops
```

---

## Scenario organization

**Naming convention:** `[Team] - [Source] to [Target] - [Purpose]`
- Example: `Sales - Typeform to HubSpot - Lead capture`
- Example: `Ops - Stripe to Sheets - Daily revenue sync`

**Folder structure:**
- Group scenarios by team or business function
- Use color-coded tags for status: green (active), yellow (testing), red (broken)

**Documentation:**
- Add notes to each module describing what it does and why
- Use the scenario description field for the overall purpose
- Document any non-obvious filter conditions or data mappings

---

## Webhook handling

Make provides two webhook trigger types:

### Custom Webhook
- Creates a unique URL for receiving arbitrary POST/GET data
- Auto-detects the data structure from the first request
- Can be re-determined if the payload schema changes

### App-specific Webhooks
- Pre-built webhook triggers for supported apps
- Handle authentication and payload parsing automatically
- Prefer these over custom webhooks when available

**Pattern: Webhook queue processing**
```
Custom Webhook (instant)
  -> Data Store: Add to queue
  -> Response: 200 OK (return immediately)

Scheduled Scenario (every 5 min)
  -> Data Store: Get all queued items
  -> Iterator
  -> Process each item
  -> Data Store: Delete processed item
```

This pattern decouples receipt from processing, preventing webhook timeouts
on heavy operations.
