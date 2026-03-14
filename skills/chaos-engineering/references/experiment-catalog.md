<!-- Part of the Chaos Engineering AbsolutelySkilled skill. Load this file when looking for ready-to-use experiment recipes organized by failure type, or when choosing the right chaos tool for a specific failure category. -->

# Chaos Experiment Catalog

Ready-to-run experiment recipes organized by failure category. Each entry includes
the failure type, injection method, steady state metric, and success criteria.

---

## 1. Network Failures

### 1.1 Service Latency Injection

**Goal:** Verify that downstream latency does not propagate into user-facing latency
and that timeouts + circuit breakers engage correctly.

| Field | Value |
|---|---|
| Tool | Toxiproxy, tc netem, Gremlin |
| Target | Specific service-to-service TCP connection |
| Failure | 300-500ms added latency on 100% of connections |
| Steady state | User-facing p99 < 800ms |
| Success | Circuit breaker opens; fallback response served; user p99 stays under SLO |

```bash
# Toxiproxy: add 400ms latency to downstream
toxiproxy-cli toxic add my_proxy --type latency --attribute latency=400
# Verify circuit breaker metric: circuit_breaker_state{service="my-svc"} == 1
# Remove: toxiproxy-cli toxic remove my_proxy --toxicName latency_downstream
```

---

### 1.2 Packet Loss

**Goal:** Verify TCP retransmission behavior and connection resilience under lossy
networks (common in multi-region or satellite link scenarios).

| Field | Value |
|---|---|
| Tool | tc netem |
| Target | Host network interface |
| Failure | 5-15% packet loss |
| Steady state | Service success rate >= 99% |
| Success | Retransmissions absorb loss; error rate remains within SLO |

```bash
sudo tc qdisc add dev eth0 root netem loss 10%
# Monitor: ss -s (retransmit counter), application error rate
# Kill switch: sudo tc qdisc del dev eth0 root
```

---

### 1.3 DNS Resolution Failure

**Goal:** Verify graceful degradation when DNS is unavailable and that services do not
hard-crash or hang indefinitely on startup.

| Field | Value |
|---|---|
| Tool | iptables, CoreDNS config, Chaos Mesh |
| Target | DNS port 53 traffic to/from target service |
| Failure | Block UDP/TCP 53 for specific namespace |
| Steady state | Service resolves dependencies at startup |
| Success | Service uses cached DNS or returns graceful error; no hang on startup |

```bash
# Block DNS for a specific process or namespace
iptables -A OUTPUT -p udp --dport 53 -j DROP
# Kill switch: iptables -D OUTPUT -p udp --dport 53 -j DROP
```

---

### 1.4 Network Partition

**Goal:** Test split-brain behavior and distributed consensus handling when two
service groups cannot communicate.

| Field | Value |
|---|---|
| Tool | iptables, Chaos Mesh NetworkChaos |
| Target | Two pods or AZs that must coordinate |
| Failure | Block all traffic between group A and group B |
| Steady state | Writes succeed, reads are consistent |
| Success | System correctly detects partition; writes rejected or quorum maintained |

```yaml
# Chaos Mesh: NetworkChaos YAML
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-partition-test
spec:
  action: partition
  mode: fixed
  value: "1"
  selector:
    namespaces: [staging]
    labelSelectors:
      app: order-service
  direction: both
  target:
    selector:
      namespaces: [staging]
      labelSelectors:
        app: inventory-service
  duration: "5m"
```

---

## 2. Resource Exhaustion

### 2.1 CPU Saturation

**Goal:** Verify that CPU saturation on one pod does not cascade to request timeouts
and that Kubernetes HPA scales within an acceptable window.

| Field | Value |
|---|---|
| Tool | stress-ng, Chaos Monkey for Containers |
| Target | Single pod in multi-replica deployment |
| Failure | Spin CPU to 90% utilization on target pod |
| Steady state | Service p99 < 500ms |
| Success | HPA triggers scale-out; load balancer routes away from hot pod; p99 stays under SLO |

```bash
# In pod: saturate 2 CPU cores for 5 minutes
stress-ng --cpu 2 --timeout 300s

# Watch HPA: kubectl get hpa -w
# Watch pod CPU: kubectl top pods
```

---

### 2.2 Memory Pressure

**Goal:** Verify OOMKill behavior: pod restarts cleanly, persistent state is not
corrupted, and traffic shifts without dropping requests.

| Field | Value |
|---|---|
| Tool | stress-ng, Chaos Mesh StressChaos |
| Target | Single stateless service pod |
| Failure | Consume memory until OOMKill |
| Steady state | Zero OOMKills in production over 7 days |
| Success | Pod restarts; readiness probe prevents traffic until healthy; no user-visible errors |

```bash
# Consume 512MB of memory for 3 minutes
stress-ng --vm 1 --vm-bytes 512M --timeout 180s

# Watch: kubectl describe pod <name> | grep -A5 "Last State"
```

---

### 2.3 File Descriptor Exhaustion

**Goal:** Verify that connection leak detection and fd limit alerts fire before the
service becomes unresponsive.

| Field | Value |
|---|---|
| Tool | Custom script (open many files/sockets) |
| Target | Application process |
| Failure | Open fd count approaches ulimit |
| Steady state | fd count < 70% of ulimit |
| Success | Alert fires; service degrades gracefully (rejects new connections with 503) before hard crash |

```bash
# Check current limit: ulimit -n
# Simulate: open many sockets in a tight loop (test environment only)
# Monitor: /proc/<pid>/fd | wc -l
```

---

## 3. Dependency Failures

### 3.1 Dependency Returns 503

**Goal:** Test that circuit breaker opens on 503s and fallback activates instead of
propagating errors to callers.

| Field | Value |
|---|---|
| Tool | Wiremock, Toxiproxy (HTTP reset), Mountebank |
| Target | Downstream service HTTP endpoint |
| Failure | 100% of responses return 503 with 5s delay |
| Steady state | Caller error rate < 0.1% |
| Success | Circuit breaker opens within threshold; fallback serves callers; caller error rate stays < 0.1% |

```json
// Wiremock stub returning 503
{
  "request": { "method": "ANY", "urlPattern": "/api/.*" },
  "response": {
    "status": 503,
    "fixedDelayMilliseconds": 5000,
    "body": "{\"error\": \"Service Unavailable\"}"
  }
}
```

---

### 3.2 Slow Third-Party API

**Goal:** Verify that an external API slowdown does not tie up internal thread pools
and that timeouts are set correctly.

| Field | Value |
|---|---|
| Tool | Toxiproxy (latency toxic), Charles Proxy |
| Target | Outbound HTTPS connection to external API |
| Failure | 10s latency added to all responses (beyond configured timeout) |
| Steady state | Thread pool utilization < 60% |
| Success | Requests to external API time out (not hang indefinitely); thread pool does not exhaust; users see graceful error |

```bash
toxiproxy-cli toxic add external_api_proxy \
  --type latency \
  --attribute latency=10000 \
  --toxicity 1.0
# Verify: application logs show TimeoutError, not hung threads
```

---

### 3.3 Message Queue Unavailability

**Goal:** Test producer and consumer behavior when Kafka/RabbitMQ/SQS is unreachable.

| Field | Value |
|---|---|
| Tool | iptables (block broker port), Stop broker container |
| Target | Message broker port (9092 for Kafka, 5672 for RabbitMQ) |
| Failure | Block TCP connections to broker for 5 minutes |
| Steady state | Message processing rate > 1000 msg/s |
| Success | Producers buffer or retry with backoff; consumers pause and resume without data loss; no infinite retry storms |

```bash
# Block Kafka broker port
iptables -A OUTPUT -p tcp --dport 9092 -j DROP
# Observe producer: check for error logs, retry metrics, DLQ activity
# Kill switch: iptables -D OUTPUT -p tcp --dport 9092 -j DROP
```

---

## 4. Infrastructure Failures

### 4.1 Pod Kill (Chaos Monkey Style)

**Goal:** Verify that random pod termination does not cause user-visible outages
in a properly configured multi-replica deployment.

| Field | Value |
|---|---|
| Tool | Chaos Monkey for Kubernetes, Litmus PodDelete, kubectl delete |
| Target | Random pod from a deployment with >= 3 replicas |
| Failure | Kill 1 pod every 60 seconds for 10 minutes |
| Steady state | Service availability >= 99.9% |
| Success | Availability stays >= 99.9%; killed pods restart within 30s; no data loss |

```bash
# Manual: kill a random pod
kubectl delete pod \
  $(kubectl get pods -l app=my-service -o name | shuf | head -1) \
  --grace-period=0 --force

# Litmus PodDelete experiment:
kubectl apply -f https://hub.litmuschaos.io/api/chaos/3.0.0?file=charts/generic/pod-delete/experiment.yaml
```

---

### 4.2 Node Drain (Zone Simulation)

**Goal:** Simulate loss of one availability zone by draining all pods from a single
node or set of nodes tagged with a specific AZ.

| Field | Value |
|---|---|
| Tool | kubectl drain, AWS FIS |
| Target | 1 of 3 AZ nodes (staging cluster) |
| Failure | Cordon + drain target node(s) |
| Steady state | Cross-AZ traffic balanced; availability >= 99.9% |
| Success | Workloads reschedule to healthy nodes within pod disruption budget; traffic redistributes; no extended downtime |

```bash
# Cordon the node (no new pods)
kubectl cordon node-az-b-01

# Drain (evict existing pods)
kubectl drain node-az-b-01 --ignore-daemonsets --delete-emptydir-data --grace-period=30

# Monitor: kubectl get pods -o wide -w (watch rescheduling)
# Restore: kubectl uncordon node-az-b-01
```

---

### 4.3 AWS AZ Failover (FIS)

**Goal:** Test full AZ failover behavior in an AWS-managed environment using the
native Fault Injection Simulator.

| Field | Value |
|---|---|
| Tool | AWS Fault Injection Simulator |
| Target | EC2 instances / ECS tasks in a single AZ |
| Failure | Terminate all instances tagged with `az: us-east-1b` |
| Steady state | Multi-AZ health check passing |
| Success | ALB stops routing to failed AZ within 30s; traffic redistributes to remaining AZs; RDS promotes replica |

```json
// AWS FIS experiment template (abbreviated)
{
  "description": "Terminate EC2 instances in us-east-1b",
  "targets": {
    "az-b-instances": {
      "resourceType": "aws:ec2:instance",
      "filters": [
        { "path": "Placement.AvailabilityZone", "values": ["us-east-1b"] },
        { "path": "State.Name", "values": ["running"] }
      ],
      "selectionMode": "PERCENT(50)"
    }
  },
  "actions": {
    "terminate-instances": {
      "actionId": "aws:ec2:terminate-instances",
      "targets": { "Instances": "az-b-instances" }
    }
  },
  "stopConditions": [
    { "source": "aws:cloudwatch:alarm", "value": "arn:aws:cloudwatch:...error-rate-high" }
  ]
}
```

---

## 5. Application-Level Failures

### 5.1 Exception Injection

**Goal:** Test error handling paths that are rarely exercised in normal operation by
injecting exceptions at the code level.

| Field | Value |
|---|---|
| Tool | Byte Buddy (Java), custom middleware, feature flags |
| Target | Specific code path (e.g., payment processing function) |
| Failure | Throw exception on N% of calls |
| Steady state | Error rate < 0.1% |
| Success | Exception is caught; user receives graceful error; alert fires; no unhandled rejection |

```javascript
// Feature-flag-based exception injection (Node.js middleware)
function chaosMiddleware(req, res, next) {
  const chaosRate = parseFloat(process.env.CHAOS_EXCEPTION_RATE || '0');
  if (chaosRate > 0 && Math.random() < chaosRate) {
    throw new Error('[CHAOS] Injected exception for resilience testing');
  }
  next();
}
// Set CHAOS_EXCEPTION_RATE=0.05 for 5% injection in staging
```

---

### 5.2 Clock Skew

**Goal:** Test behavior of distributed systems when nodes disagree on wall clock time.
Critical for JWT expiry, event ordering, and distributed locks.

| Field | Value |
|---|---|
| Tool | `date` command, faketime, Chaos Mesh TimeChaos |
| Target | Single service pod |
| Failure | Advance clock by 10 minutes on target pod |
| Steady state | All JWTs and cache TTLs valid |
| Success | Service detects clock skew; JWTs are not prematurely expired for other nodes; distributed lock behaves correctly |

```yaml
# Chaos Mesh TimeChaos
apiVersion: chaos-mesh.org/v1alpha1
kind: TimeChaos
metadata:
  name: clock-skew-test
spec:
  mode: one
  selector:
    namespaces: [staging]
    labelSelectors:
      app: auth-service
  timeOffset: "+10m"
  duration: "5m"
```

---

## Tool Selection Matrix

| Scenario | Best Tool | Alternative |
|---|---|---|
| Kubernetes pod/node failures | Litmus, Chaos Mesh | kubectl delete |
| Network latency/packet loss (service-level) | Toxiproxy | Chaos Mesh NetworkChaos |
| Network latency (host-level) | tc netem | Gremlin |
| AWS infrastructure failures | AWS FIS | Chaos Monkey for ECS |
| Multi-cloud or SaaS managed | Gremlin | - |
| CPU/memory stress | stress-ng, Chaos Mesh StressChaos | Gremlin |
| Application exception injection | Feature flags + custom middleware | Byte Buddy (JVM) |
| External API simulation | Wiremock, Mountebank | WireMock Cloud |

---

## Experiment Graduation Checklist

Before graduating any experiment from staging to production:

- [ ] Hypothesis was validated in staging (steady state held or gap was found and fixed)
- [ ] Blast radius is documented and smaller than in staging run
- [ ] Kill switch is tested and confirmed to work in < 30 seconds
- [ ] On-call engineer is aware and monitoring during the experiment
- [ ] Rollback procedure is documented in the experiment record
- [ ] Observability dashboards are confirmed live for all steady state metrics
- [ ] Stop condition (automatic abort) is configured if available (e.g., AWS FIS stop condition)
