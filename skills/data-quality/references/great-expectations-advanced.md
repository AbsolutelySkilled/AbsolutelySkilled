<!-- Part of the data-quality AbsolutelySkilled skill. Load this file when
     working with advanced Great Expectations patterns like custom expectations,
     data docs hosting, store backends, or multi-batch validation. -->

# Great Expectations - Advanced Patterns

## Custom expectations

When built-in expectations don't cover your business logic, write a custom expectation
by subclassing `Expectation`.

```python
from great_expectations.expectations import Expectation
from great_expectations.core import ExpectationValidationResult
import re


class ExpectColumnValuesToMatchCorporateEmail(Expectation):
    """Expect column values to be valid corporate email addresses."""

    expectation_type = "expect_column_values_to_match_corporate_email"
    domain = "column"

    domain_param = "column"
    success_keys = ("column", "domain_suffix")

    default_kwarg_values = {
        "domain_suffix": "@company.com",
    }

    def _validate(self, metrics, runtime_configuration=None, execution_engine=None):
        column_values = metrics.get("column_values.nonnull")
        domain_suffix = self.kwargs.get("domain_suffix", "@company.com")

        unexpected = [
            v for v in column_values
            if not str(v).endswith(domain_suffix)
        ]

        return ExpectationValidationResult(
            success=len(unexpected) == 0,
            result={
                "unexpected_count": len(unexpected),
                "unexpected_values": unexpected[:20],
                "element_count": len(column_values),
            },
        )
```

Register custom expectations by placing them in a `great_expectations/plugins/expectations/`
directory in your project. GX auto-discovers them on context initialization.

## Store backends

By default GX stores expectations and validation results on the local filesystem. For
team use, configure a cloud store backend.

```yaml
# great_expectations/great_expectations.yml
stores:
  expectations_store:
    class_name: ExpectationsStore
    store_backend:
      class_name: TupleS3StoreBackend
      bucket: my-gx-store
      prefix: expectations/

  validation_results_store:
    class_name: ValidationResultsStore
    store_backend:
      class_name: TupleS3StoreBackend
      bucket: my-gx-store
      prefix: validations/

  checkpoint_store:
    class_name: CheckpointStore
    store_backend:
      class_name: TupleS3StoreBackend
      bucket: my-gx-store
      prefix: checkpoints/
```

Supported backends: local filesystem, S3, GCS, Azure Blob, PostgreSQL.

## Data Docs hosting

Data Docs are static HTML reports generated from validation results. Host them for team
visibility.

```yaml
# great_expectations/great_expectations.yml
data_docs_sites:
  s3_site:
    class_name: SiteBuilder
    store_backend:
      class_name: TupleS3StoreBackend
      bucket: my-data-docs
      prefix: docs/
    site_index_builder:
      class_name: DefaultSiteIndexBuilder
```

For internal hosting, use S3 static website hosting with CloudFront, or serve from
a simple Nginx container.

## Multi-batch validation

Validate expectations across multiple batches (e.g., compare today's data to yesterday's).

```python
import great_expectations as gx

context = gx.get_context()
asset = context.data_sources.get("warehouse").get_asset("orders")

# Define batch definitions for different partitions
today_batch = asset.add_batch_definition_daily("today", column="created_at")
yesterday_batch = asset.add_batch_definition_daily("yesterday", column="created_at")

# Run same suite against both batches
suite = context.suites.get("orders_quality")

for batch_def in [today_batch, yesterday_batch]:
    validation = gx.ValidationDefinition(
        name=f"orders_{batch_def.name}",
        data=batch_def,
        suite=suite,
    )
    result = validation.run()
    print(f"{batch_def.name}: {'PASS' if result.success else 'FAIL'}")
```

## Conditional expectations

Apply expectations only to subsets of data using row conditions.

```python
import great_expectations as gx

suite = context.suites.get("orders_quality")

# Only check refund_amount for cancelled orders
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(
        column="refund_amount",
        row_condition='status == "cancelled"',
        condition_parser="pandas",
    )
)

# Only check shipping_address for non-digital orders
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(
        column="shipping_address",
        row_condition='product_type != "digital"',
        condition_parser="pandas",
    )
)
```

## Integration with Airflow

Use the `GreatExpectationsOperator` to run checkpoints as Airflow tasks.

```python
from airflow import DAG
from airflow.utils.dates import days_ago
from great_expectations_provider.operators.great_expectations import (
    GreatExpectationsOperator,
)

with DAG(
    dag_id="orders_quality_check",
    start_date=days_ago(1),
    schedule_interval="@daily",
    catchup=False,
) as dag:

    validate_orders = GreatExpectationsOperator(
        task_id="validate_orders",
        data_context_root_dir="/opt/airflow/great_expectations",
        checkpoint_name="orders_checkpoint",
        fail_task_on_validation_failure=True,
    )
```

> The Airflow provider is `apache-airflow-providers-great-expectations`. Install it
> separately: `pip install apache-airflow-providers-great-expectations`.
