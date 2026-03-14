<!-- Part of the data-quality AbsolutelySkilled skill. Load this file when
     working with data contract definitions, versioning strategies, or
     enforcement patterns. -->

# Data Contracts Specification

## What is a data contract?

A data contract is a formal, versioned agreement between a data producer and its
consumers. It defines what data will look like (schema), what it means (semantics),
how fresh it will be (SLAs), and who is responsible (ownership). Contracts shift
data quality left - the producer guarantees quality at the source instead of consumers
building defensive checks downstream.

## Contract structure

Every data contract should include these sections:

### Metadata

```yaml
apiVersion: datacontract/v1.0
kind: DataContract
metadata:
  name: orders                    # Unique identifier
  version: 2.1.0                  # Semantic versioning
  owner: payments-team            # Producing team
  consumers:                      # Who reads this data
    - analytics-team
    - ml-team
    - marketing-team
  tags: [payments, orders, transactional]
  description: >
    All customer orders from the checkout flow. Updated in near-real-time
    via CDC from the orders microservice PostgreSQL database.
```

### Schema definition

```yaml
schema:
  type: table
  database: warehouse
  table: curated.orders
  columns:
    - name: order_id
      type: string
      constraints: [not_null, unique]
      description: UUID v4 primary key
      pii: false

    - name: customer_id
      type: string
      constraints: [not_null]
      description: FK to customers.customer_id
      pii: true

    - name: total_amount
      type: decimal(10,2)
      constraints: [not_null]
      description: Gross order total in USD (before discounts)
      semantic: gross_revenue
      unit: USD

    - name: discount_amount
      type: decimal(10,2)
      constraints: [not_null]
      description: Total discount applied
      default: 0.00

    - name: status
      type: string
      constraints: [not_null]
      allowed_values: [pending, processing, completed, cancelled, refunded]
      description: Current order lifecycle status

    - name: created_at
      type: timestamp_tz
      constraints: [not_null]
      description: Order creation time in UTC

    - name: updated_at
      type: timestamp_tz
      constraints: [not_null]
      description: Last modification time in UTC
```

### Semantic definitions

Avoid ambiguity by defining what business terms mean:

```yaml
semantics:
  gross_revenue: >
    Total order amount before any discounts, taxes, or shipping costs.
    Includes all line items at their list price.
  net_revenue: >
    gross_revenue minus discount_amount. Does NOT include tax or shipping.
  active_order: >
    An order with status in [pending, processing]. Completed, cancelled,
    and refunded orders are not active.
```

### SLA definitions

```yaml
sla:
  freshness: 15m                  # Data must be no older than 15 minutes
  volume:
    min_rows_per_hour: 100        # Alert if fewer than 100 orders/hour
    max_rows_per_hour: 50000      # Alert if spike exceeds 50k/hour
  availability: 99.9%             # Table must be queryable 99.9% of the time
  quality:
    null_rate_threshold: 0.01     # No column should exceed 1% null rate
    duplicate_rate_threshold: 0    # Zero tolerance for duplicate order_ids
```

### Contact and escalation

```yaml
support:
  slack_channel: "#payments-data"
  oncall_rotation: payments-data-oncall
  escalation_policy: >
    1. Post in #payments-data with details
    2. If no response in 30min, page payments-data-oncall
    3. If P1 impact, page payments-eng-oncall directly
```

## Versioning strategy

Follow semantic versioning for data contracts:

| Change type | Version bump | Examples |
|---|---|---|
| **Patch** (0.0.x) | Bug fix in description, tightening an SLA | Fix typo in column description |
| **Minor** (0.x.0) | Additive, non-breaking change | New nullable column, new allowed_value added |
| **Major** (x.0.0) | Breaking change | Column removed, type changed, column renamed, constraint tightened |

### Breaking change protocol

1. Producer announces breaking change in the contract's Slack channel
2. Minimum 7-day notice period for consumer teams to adapt
3. Producer publishes new contract version (major bump)
4. Old version remains supported for a deprecation window (typically 30 days)
5. Producer removes old version after deprecation window

## Enforcement patterns

### Schema enforcement at ingestion

```python
import json
import jsonschema

def validate_against_contract(record: dict, contract_path: str) -> bool:
    """Validate a single record against its data contract schema."""
    with open(contract_path) as f:
        contract = yaml.safe_load(f)

    # Convert contract columns to JSON Schema
    properties = {}
    required = []
    for col in contract["schema"]["columns"]:
        prop = {"type": _map_type(col["type"])}
        if "allowed_values" in col:
            prop["enum"] = col["allowed_values"]
        properties[col["name"]] = prop
        if "not_null" in col.get("constraints", []):
            required.append(col["name"])

    schema = {
        "type": "object",
        "properties": properties,
        "required": required,
        "additionalProperties": False,
    }

    jsonschema.validate(record, schema)
    return True
```

### Contract testing in CI

Run contract tests on every PR that modifies a producer's schema:

```yaml
# .github/workflows/contract-test.yml
name: Data Contract Tests
on:
  pull_request:
    paths:
      - 'contracts/**'
      - 'migrations/**'
      - 'models/**'

jobs:
  contract-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate contract schema
        run: |
          pip install datacontract-cli
          datacontract test contracts/orders-v2.yaml
      - name: Check for breaking changes
        run: |
          datacontract breaking contracts/orders-v2.yaml --against main
```

### Runtime enforcement with Great Expectations

Generate GX expectations automatically from a data contract:

```python
def contract_to_expectations(contract_path: str) -> list:
    """Convert a data contract YAML to Great Expectations expectations."""
    import yaml
    import great_expectations as gx

    with open(contract_path) as f:
        contract = yaml.safe_load(f)

    expectations = []
    for col in contract["schema"]["columns"]:
        if "not_null" in col.get("constraints", []):
            expectations.append(
                gx.expectations.ExpectColumnValuesToNotBeNull(column=col["name"])
            )
        if "unique" in col.get("constraints", []):
            expectations.append(
                gx.expectations.ExpectColumnValuesToBeUnique(column=col["name"])
            )
        if "allowed_values" in col:
            expectations.append(
                gx.expectations.ExpectColumnValuesToBeInSet(
                    column=col["name"],
                    value_set=col["allowed_values"],
                )
            )
    return expectations
```
