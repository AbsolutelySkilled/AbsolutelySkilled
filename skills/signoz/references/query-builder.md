<!-- Part of the SigNoz AbsolutelySkilled skill. Load this file when
     working with SigNoz query builder, dashboards, or complex data analysis. -->

# SigNoz Query Builder Reference

## Query builder components

The query builder is used across Logs Explorer, Traces Explorer, Metrics Explorer,
Dashboards, and Alert rules. It provides a unified interface for all three signal types.

## Filtering

Filters narrow data by attribute values. Click the Search Filter field to select
from available attributes.

### Operators

| Operator | Description | Example |
|---|---|---|
| `=` | Exact match | `service.name = demo-app` |
| `!=` | Not equal | `status_code != 200` |
| `IN` | Match any in list | `method IN [GET, POST]` |
| `NOT_IN` | Exclude list values | `env NOT_IN [staging, dev]` |

Multiple filters combine using **AND** logic.

## Aggregation functions

### Basic aggregations

| Function | Description |
|---|---|
| Count | Total number of matching records |
| Count Distinct | Unique values of an attribute |
| Sum | Sum of numeric attribute values |
| Avg | Average of numeric attribute values |
| Min | Minimum value |
| Max | Maximum value |

### Percentile aggregations

P05, P10, P20, P25, P50, P75, P90, P95, P99 - calculate distribution percentiles
for latency analysis, response times, and other numeric metrics.

### Rate aggregations

| Function | Description |
|---|---|
| Rate | Per-second rate of change |
| Rate Sum | Rate of the sum |
| Rate Avg | Rate of the average |
| Rate Min | Rate of the minimum |
| Rate Max | Rate of the maximum |

## Grouping

Group results by any attribute to segment data. Common groupings:
- `service.name` - per-service breakdown
- `method` - HTTP method breakdown
- `status_code` - response code distribution
- `host.name` - per-host analysis

When combined with aggregation: "count errors per endpoint" or "p99 latency per service".

## Result manipulation

| Feature | Description | Example |
|---|---|---|
| Order By | Sort results | `timestamp DESC` |
| Aggregate Every | Time bucket size | `60s` for 1-minute intervals |
| Limit | Cap result count | `100` |
| Having | Filter aggregated results | `count > 10` |
| Legend Format | Dynamic labels | `{{service.name}} - {{method}}` |

## Multiple queries and formulas

Execute multiple independent queries (A, B, C...) and combine them with formulas:
- `A / B` - ratio of two queries
- `A - B` - difference
- Apply functions to queries or formula results

## Mathematical functions

| Category | Functions |
|---|---|
| Trigonometric | sin, cos, tan, asin, acos, atan |
| Logarithmic | log, ln, log2, log10 |
| Statistical | sqrt, exp, abs |
| Time | now |

## Metrics-specific features

### Temporal vs spatial aggregation

- **Temporal aggregation** - consolidates data points across time (e.g. 5-minute averages)
- **Spatial aggregation** - merges metrics across dimensions (container names, regions)

### Extended analysis functions

| Function | Description |
|---|---|
| Cut Off Min | Exclude values below threshold |
| Cut Off Max | Exclude values above threshold |
| Absolute | Convert to absolute values |
| Log (log2, log10) | Logarithmic transformation |
| EWMA 3/5/7 | Exponentially weighted moving average for smoothing |
| Time Shift | Compare with data from N seconds ago |

Functions can be **chained** - apply EWMA smoothing, then time shift, then cut off.

## Dashboard panel types

SigNoz dashboards support:
- **Time series** - line/area charts for temporal data
- **Bar charts** - categorical comparisons
- **Pie charts** - proportional breakdowns
- **Tables** - tabular data display
- **Value panels** - single metric display

### Dashboard management

- Drag-and-drop panel positioning
- Resize by dragging bottom-left corner
- Tag and describe dashboards for organization
- Public sharing with configurable time ranges
- Import pre-built dashboards from SigNoz GitHub repo (JSON format)

## Alert query patterns

Alerts use the same query builder. Common patterns:

```
# High error rate alert
Signal: Logs
Filter: severity_text = ERROR
Aggregation: Count
Aggregate Every: 5m
Threshold: > 100

# Slow endpoint alert
Signal: Traces
Filter: service.name = api-gateway
Aggregation: P99(duration_nano)
Group By: operation
Threshold: > 5000000000 (5 seconds in nanoseconds)

# Host CPU alert
Signal: Metrics
Metric: system.cpu.utilization
Aggregation: Avg
Group By: host.name
Threshold: > 0.85
```
