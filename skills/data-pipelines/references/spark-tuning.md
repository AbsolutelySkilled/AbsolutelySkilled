<!-- Part of the data-pipelines AbsolutelySkilled skill. Load this file when
     working with Spark job optimization, memory tuning, shuffle configuration,
     or partitioning strategies. -->

# Spark Tuning

## Memory architecture

Spark executors divide memory into three regions:

```
Total Executor Memory
  |
  +-- Execution Memory (shuffle, joins, sorts, aggregations)
  |     Default: 50% of (heap - 300MB reserved)
  |
  +-- Storage Memory (cached DataFrames, broadcast variables)
  |     Default: 50% of (heap - 300MB reserved)
  |
  +-- Reserved (300MB, not configurable)
```

Execution and storage share a unified region. If execution needs more memory and
storage is not using its share, execution can borrow. The reverse is also true.

### Key memory configs

| Config | Default | Guidance |
|---|---|---|
| `spark.executor.memory` | 1g | Set to 4-8g for most workloads, up to 16g for large joins |
| `spark.executor.memoryOverhead` | max(384MB, 10% of executor memory) | Increase for PySpark or jobs with many UDFs |
| `spark.memory.fraction` | 0.6 | Fraction of heap for execution + storage |
| `spark.memory.storageFraction` | 0.5 | Initial storage share within the unified region |
| `spark.driver.memory` | 1g | Increase if collecting large results to driver |

> Out of Memory errors? First check if a single partition is too large (skew).
> Increasing executor memory is a band-aid if the root cause is data skew.

## Shuffle optimization

Shuffles are the #1 performance bottleneck in Spark. A shuffle occurs whenever
data must move between partitions (joins, groupBy, repartition, distinct).

### Reducing shuffle volume

1. **Filter early** - push WHERE clauses before joins to reduce data volume
2. **Select only needed columns** - less data per row = less shuffle bytes
3. **Broadcast small tables** - eliminates shuffle entirely for one side of join

```python
from pyspark.sql.functions import broadcast

# Broadcast tables under ~100MB to avoid shuffle
result = large_df.join(broadcast(small_df), "join_key")
```

### Partition tuning

| Config | Default | Guidance |
|---|---|---|
| `spark.sql.shuffle.partitions` | 200 | Set to 2-4x the number of cores for your cluster |
| `spark.sql.files.maxPartitionBytes` | 128MB | Controls input partition size for file reads |

**Rule of thumb:** Target 100-200MB per partition after shuffle. Too many small
partitions create scheduling overhead. Too few large partitions cause OOM and skew.

```python
# Check partition sizes after a transformation
df.rdd.mapPartitions(lambda it: [sum(1 for _ in it)]).collect()

# Repartition to target size
target_partitions = total_data_size_mb // 150  # ~150MB per partition
df = df.repartition(target_partitions)
```

### Adaptive Query Execution (AQE)

Enable AQE (default in Spark 3.2+) to let Spark auto-tune at runtime:

```python
spark.conf.set("spark.sql.adaptive.enabled", True)
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", True)
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", True)
```

AQE handles:
- Coalescing small partitions after shuffle
- Splitting skewed partitions automatically
- Switching join strategies at runtime based on actual data sizes

## Handling data skew

Data skew occurs when one or a few partition keys contain disproportionately
more data than others. Symptoms: one task takes 10-100x longer than peers.

### Diagnosis

```python
# Check key distribution
df.groupBy("join_key").count().orderBy(col("count").desc()).show(20)
```

### Salting technique

Add a random salt to the skewed key, join on the salted key, then aggregate:

```python
from pyspark.sql.functions import lit, rand, floor, concat, col

SALT_BUCKETS = 10

# Salt the large table
large_salted = large_df.withColumn(
    "salt", floor(rand() * SALT_BUCKETS).cast("int")
).withColumn(
    "salted_key", concat(col("join_key"), lit("_"), col("salt"))
)

# Explode the small table to match all salt values
from pyspark.sql.functions import explode, array
small_exploded = small_df.withColumn(
    "salt", explode(array([lit(i) for i in range(SALT_BUCKETS)]))
).withColumn(
    "salted_key", concat(col("join_key"), lit("_"), col("salt"))
)

# Join on salted key (distributes skewed key across SALT_BUCKETS partitions)
result = large_salted.join(small_exploded, "salted_key")
```

## Partitioning output files

### Avoid small files problem

```python
# Bad: thousands of tiny files
df.write.partitionBy("date").parquet("output/")

# Good: control file count per partition
df.repartition("date").write.partitionBy("date").parquet("output/")

# Better: explicit file count
df.repartition(100, "date").write.partitionBy("date").parquet("output/")
```

### Coalesce vs repartition

| Method | Shuffles? | Use when |
|---|---|---|
| `coalesce(N)` | No (narrows partitions) | Reducing partitions after filter (fewer files) |
| `repartition(N)` | Yes (full shuffle) | Even distribution needed, or changing partition key |
| `repartition(N, "col")` | Yes | Writing partitioned output with controlled file count |

> Use `coalesce` after filtering to reduce partition count without a shuffle.
> Use `repartition` before writing to ensure even file sizes.

## Caching strategy

Cache DataFrames that are reused across multiple actions:

```python
# Cache when a DataFrame is used in 2+ downstream actions
enriched_df = large_join_result.cache()
enriched_df.count()  # triggers caching

# Use after multiple operations
summary = enriched_df.groupBy("segment").agg(...)
detail = enriched_df.filter(col("amount") > 1000)

# Unpersist when done
enriched_df.unpersist()
```

**When NOT to cache:**
- DataFrame is used only once
- Dataset is larger than available storage memory
- The computation is cheap (simple filters on Parquet with predicate pushdown)

## Common Spark anti-patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| `collect()` on large DataFrame | OOM on driver | Use `take(N)`, `show()`, or write to storage |
| UDFs in PySpark | Serialization overhead, no Catalyst optimization | Use built-in functions or `pandas_udf` |
| `count()` to check emptiness | Scans entire dataset | Use `head(1)` or `isEmpty()` (Spark 3.3+) |
| No predicate pushdown | Reads entire Parquet file | Filter on partition columns, use `where` before `select` |
| Caching everything | Wastes memory, evicts useful caches | Cache only reused DataFrames, unpersist when done |
| Ignoring `explain()` | Missing optimization opportunities | Check physical plan for scans, shuffles, and broadcast decisions |
