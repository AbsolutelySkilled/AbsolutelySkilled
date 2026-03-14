<!-- Part of the real-time-streaming AbsolutelySkilled skill. Load this file when
     working with Kafka broker configuration, topic management, monitoring, or security. -->

# Kafka Operations

## Topic Management

### Creation best practices

- **Partition count**: Target 2x your maximum expected consumer parallelism. 12-24
  partitions is a reasonable default for most workloads. High-throughput topics may
  need 50-100+.
- **Replication factor**: Always 3 in production. Never 1, even in staging.
- **`min.insync.replicas`**: Set to 2 with replication factor 3. This ensures writes
  are durable on at least 2 replicas before acknowledging.
- **Retention**: `retention.ms` for time-based, `retention.bytes` for size-based.
  Use `cleanup.policy=compact` for KTable-backing topics, `delete` for event streams,
  `compact,delete` for compacted topics with a retention window.

### Key configuration parameters

| Parameter | Default | Recommendation | Why |
|---|---|---|---|
| `num.partitions` | 1 | 12+ | Default is too low for any real workload |
| `default.replication.factor` | 1 | 3 | Durability requires replication |
| `min.insync.replicas` | 1 | 2 | Prevents data loss on broker failure |
| `unclean.leader.election.enable` | false | false | Never enable - causes data loss |
| `message.max.bytes` | 1MB | 1MB | Increase only if truly needed; large messages are an anti-pattern |

### Compaction

Compacted topics retain only the latest value per key. Essential for:
- KTable changelog topics (Kafka Streams)
- CDC snapshot topics
- Configuration distribution

Set `min.cleanable.dirty.ratio=0.5` and `segment.ms=3600000` (1 hour) to control
compaction frequency. Lower dirty ratio = more frequent compaction = less disk but
more I/O.

## Broker Tuning

### Memory

- **JVM heap**: 6GB is sufficient for most brokers. Do not exceed 8GB (GC pressure).
- **Page cache**: The real performance driver. Ensure the OS has 32-64GB+ of free
  RAM for page cache. Kafka reads/writes are sequential and rely heavily on OS cache.
- **`socket.send.buffer.bytes`** / **`socket.receive.buffer.bytes`**: Set to 1MB+
  for cross-datacenter replication.

### Disk

- Use dedicated disks for Kafka log directories (not shared with OS).
- XFS or ext4 filesystem. Mount with `noatime`.
- Stripe across multiple disks using `log.dirs=/disk1/kafka,/disk2/kafka`.
- Monitor `under-replicated partitions` metric - if non-zero, a broker is falling behind.

### Network

- `num.network.threads`: Set to number of CPU cores (handles socket I/O).
- `num.io.threads`: Set to 2x number of disks (handles log read/write).
- `num.replica.fetchers`: Increase to 2-4 for high-partition-count clusters.

## Monitoring

### Critical metrics to alert on

| Metric | Threshold | Action |
|---|---|---|
| `UnderReplicatedPartitions` | > 0 for 5 min | Broker falling behind; check disk I/O and network |
| `ActiveControllerCount` | != 1 across cluster | Controller election issue; check ZK/KRaft |
| `OfflinePartitionsCount` | > 0 | Data unavailable; check broker health |
| `RequestHandlerAvgIdlePercent` | < 0.3 | Broker overloaded; scale or reduce load |
| `NetworkProcessorAvgIdlePercent` | < 0.3 | Network thread saturation |
| `LogFlushRateAndTimeMs` | p99 > 100ms | Disk performance degradation |
| Consumer group lag | Growing trend | Consumers not keeping up; scale or tune |

### JMX metrics collection

Export via JMX exporter to Prometheus. Key bean paths:

```
kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions
kafka.controller:type=KafkaController,name=ActiveControllerCount
kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec
kafka.server:type=BrokerTopicMetrics,name=BytesInPerSec
kafka.network:type=RequestMetrics,name=RequestsPerSec,request=Produce
kafka.consumer:type=consumer-fetch-manager-metrics,client-id=*
```

## Security

### Authentication

- **SASL/SCRAM**: Recommended for most deployments. Supports dynamic credential
  management without broker restart.
- **mTLS**: Use for service-to-service in zero-trust environments. More operational
  overhead (certificate management).
- **SASL/OAUTHBEARER**: For environments with existing OAuth infrastructure.

### Authorization

Use Kafka ACLs with a deny-by-default policy:

```bash
kafka-acls.sh --bootstrap-server localhost:9092 \
  --add --allow-principal User:order-service \
  --operation Read --operation Write \
  --topic orders \
  --group order-processor-group
```

### Encryption

- **In-transit**: Enable `ssl.protocol=TLSv1.3` on all listeners.
- **At-rest**: Use filesystem-level encryption (LUKS, dm-crypt) or cloud-managed
  encrypted volumes. Kafka does not provide native at-rest encryption.

## KRaft Migration

Kafka 3.3+ supports KRaft (Kafka Raft) mode, removing the ZooKeeper dependency.

- New clusters: Always use KRaft mode.
- Existing clusters: Migrate using the `kafka-metadata.sh` tool. Test thoroughly
  in staging first.
- KRaft benefits: Faster controller failover, simplified operations, no ZK dependency.
- KRaft controllers need dedicated nodes in large clusters (100+ brokers).
