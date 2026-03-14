<!-- Part of the ci-cd-pipelines AbsolutelySkilled skill. Load this file when
     choosing or implementing a deployment strategy. -->

# Deployment Strategies

A deployment strategy defines how a new version of software replaces the old
one in production. The choice affects downtime, rollback speed, risk exposure,
infrastructure cost, and operational complexity. This reference covers the six
primary strategies with diagrams, trade-offs, and decision guidance.

---

## Decision framework

```
Does the deploy require downtime?
  YES -> Can you schedule a maintenance window?
    YES -> Recreate (simplest)
    NO  -> You need a zero-downtime strategy (see below)

Is instant rollback (< 30 seconds) required?
  YES -> Blue-Green

Is gradual traffic shifting acceptable?
  YES -> Can you segment users or requests?
    YES (by user/cohort) -> A/B or Shadow
    YES (by percentage)  -> Canary
    NO                   -> Rolling

Do you need to test a new version with real traffic without affecting users?
  YES -> Shadow
```

---

## 1. Recreate

Stop the old version completely, then start the new version.

```
BEFORE:
  [ v1 ] [ v1 ] [ v1 ]
  Users -> Load Balancer -> v1 instances

DEPLOY:
  [ -- ] [ -- ] [ -- ]    <- downtime window
  (all instances stopped, new ones starting)

AFTER:
  [ v2 ] [ v2 ] [ v2 ]
  Users -> Load Balancer -> v2 instances
```

**When to use:**
- Batch jobs, background workers, or jobs with no user-facing SLA
- Database migrations that are incompatible with the previous schema
- Non-production environments (dev, QA)

**Trade-offs:**

| | |
|---|---|
| Downtime | Yes - hard downtime while old stops and new starts |
| Rollback speed | Slow - must re-deploy v1 |
| Infrastructure cost | Low - no duplicate capacity needed |
| Complexity | Very low |

**GitHub Actions pattern:**
```yaml
- name: Stop old version
  run: kubectl scale deployment myapp --replicas=0

- name: Deploy new version
  run: kubectl set image deployment/myapp myapp=$IMAGE_TAG

- name: Wait for rollout
  run: kubectl rollout status deployment/myapp
```

---

## 2. Rolling Update

Replace instances one at a time (or in small batches). The load balancer
continues routing traffic to the healthy old instances while new ones come up.

```
STEP 1:  [ v2 ] [ v1 ] [ v1 ]   <- 1/3 new
STEP 2:  [ v2 ] [ v2 ] [ v1 ]   <- 2/3 new
STEP 3:  [ v2 ] [ v2 ] [ v2 ]   <- 3/3 new (done)

At all times: Users see a mix of v1 and v2 responses.
```

**When to use:**
- APIs that are backward compatible with the previous version
- Stateless services where any instance can serve any request
- When you have limited capacity and can't run double the instances

**Trade-offs:**

| | |
|---|---|
| Downtime | None (if health checks are configured correctly) |
| Rollback speed | Medium - must roll back instance by instance |
| Infrastructure cost | Low - brief capacity reduction during rollout |
| Complexity | Low - most orchestrators (Kubernetes, ECS) do this natively |
| Risk | Medium - users may hit both old and new version during rollout |

**Warning:** Both v1 and v2 serve traffic simultaneously. Your API must be
backward compatible during the rollout window. If v2 changes a database schema
in a breaking way, rolling updates will break v1 instances.

**GitHub Actions / Kubernetes pattern:**
```yaml
- name: Apply rolling update
  run: |
    kubectl set image deployment/myapp myapp=$IMAGE_TAG
    kubectl rollout status deployment/myapp --timeout=5m

- name: Roll back on failure
  if: failure()
  run: kubectl rollout undo deployment/myapp
```

**Kubernetes config snippet:**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # allow 1 extra instance during update
      maxUnavailable: 0  # never reduce below desired replica count
```

---

## 3. Blue-Green

Maintain two identical production environments (blue and green). Only one is
live at a time. Deploy to the idle environment, test it, then switch traffic.

```
CURRENT STATE (blue is live):
  Users -> Load Balancer -> [ blue: v1 ] [ blue: v1 ] [ blue: v1 ]
                            [ green: v1 ] [ green: v1 ] [ green: v1 ]  <- idle

DEPLOY TO GREEN:
  Users -> Load Balancer -> [ blue: v1 ] [ blue: v1 ] [ blue: v1 ]
                            [ green: v2 ] [ green: v2 ] [ green: v2 ]  <- staging v2

SMOKE TEST PASSES, SWITCH TRAFFIC:
  Users -> Load Balancer -> [ blue: v1 ] [ blue: v1 ] [ blue: v1 ]  <- idle (rollback target)
                         -> [ green: v2 ] [ green: v2 ] [ green: v2 ]  <- live

ROLLBACK (instant - just flip the switch):
  Users -> Load Balancer -> [ blue: v1 ] [ blue: v1 ] [ blue: v1 ]  <- live again
```

**When to use:**
- Services where instant rollback (under 30 seconds) is a hard requirement
- Deployments that are risky or involve significant changes
- E-commerce, payments, authentication - anywhere downtime costs money

**Trade-offs:**

| | |
|---|---|
| Downtime | None |
| Rollback speed | Instant - traffic switch is atomic |
| Infrastructure cost | High - 2x capacity at all times |
| Complexity | Medium - requires traffic switching mechanism |
| Database challenge | Hard - both environments may share a database, requiring backward-compatible schema |

**Key consideration - databases:** Blue-green is simple for stateless compute
but complex for databases. If both environments share one database, schema
changes must be backward compatible with both versions simultaneously. The
expand-contract migration pattern handles this:
1. **Expand**: add new column/table (v1 and v2 both work)
2. **Migrate**: v2 writes to both old and new
3. **Contract**: once v1 is gone, remove the old column

---

## 4. Canary Release

Route a small percentage of real traffic to the new version. Increase gradually
if metrics look healthy. Roll back immediately if error rate or latency spikes.

```
INITIAL CANARY (10% traffic):
  Users (90%) -> Load Balancer -> [ v1 ] [ v1 ] [ v1 ] [ v1 ] [ v1 ]
  Users (10%) ->                  [ v2 ]

AFTER MONITORING (promote to 50%):
  Users (50%) -> Load Balancer -> [ v1 ] [ v1 ] [ v1 ]
  Users (50%) ->                  [ v2 ] [ v2 ] [ v2 ]

FULL ROLLOUT (100%):
  Users (100%) ->                 [ v2 ] [ v2 ] [ v2 ] [ v2 ] [ v2 ]
```

**When to use:**
- High-traffic services where even a 1% error rate affects thousands of users
- Deployments with uncertain performance characteristics
- When you need real production data to validate before full rollout

**Trade-offs:**

| | |
|---|---|
| Downtime | None |
| Rollback speed | Fast - reduce canary weight to 0 |
| Infrastructure cost | Low during canary phase, zero extra after full rollout |
| Complexity | High - requires traffic splitting and monitoring integration |
| Observability requirement | High - need reliable per-version metrics |

**Canary promotion checklist:**
- Error rate on canary <= error rate on stable
- p99 latency on canary <= p99 latency on stable
- No new error types in logs
- Memory and CPU usage within expected range
- Business metrics (conversion, checkout success) unchanged

**Automatic rollback trigger thresholds (example):**

| Metric | Threshold |
|---|---|
| Error rate | > 1% (vs 0.1% baseline) |
| p99 latency | > 500ms (vs 120ms baseline) |
| 5xx rate | > 0.5% |
| Memory | > 90% of limit |

---

## 5. A/B Testing (Feature Flags)

Route specific user segments to different versions based on user attributes,
not just percentages. Used to test product hypotheses, not just deployment risk.

```
Segment routing:
  User (cohort A: beta users)  -> [ v2 - new checkout flow ]
  User (cohort B: everyone else) -> [ v1 - old checkout flow ]

  Routing logic lives in:
  - Load balancer rules (header-based)
  - Feature flag service (LaunchDarkly, Unleash, Flipt)
  - Application layer (check flag at runtime)
```

**A/B vs Canary - key difference:**
- **Canary** is about deployment safety - random % of traffic
- **A/B** is about product experimentation - specific user segments, tracked metrics

**When to use:**
- Testing product changes (new UI, new algorithm) before full rollout
- Personalization experiments
- When you need statistical significance over a defined cohort

**Trade-offs:**

| | |
|---|---|
| Downtime | None |
| Rollback speed | Instant - toggle the flag |
| Infrastructure cost | None extra (same instances, different code paths) |
| Complexity | High - requires feature flag infrastructure |
| Long-term risk | Flag debt - unremoved flags become tech debt |

**Rule:** Set a sunset date for every feature flag when you create it.

---

## 6. Shadow Deployment (Traffic Mirroring)

Send a copy of production traffic to the new version, but discard its responses.
Users only see v1 responses. v2 processes requests in parallel for observation.

```
Request flow:
  User -> Load Balancer -> [ v1 ] -> Response to user
                        \-> [ v2 ] -> Response discarded (observability only)

  v2 receives:  real production traffic, same volume and shape
  v2 returns:   responses that nobody sees
  v2 records:   latency, errors, resource usage, output diffs
```

**When to use:**
- Replacing a core algorithm or pricing engine where correctness is critical
- Testing a new service that must match an existing service's behavior exactly
- Pre-production load testing with real traffic patterns

**Trade-offs:**

| | |
|---|---|
| Downtime | None |
| Rollback speed | N/A - users were never on v2 |
| Infrastructure cost | Medium - v2 runs at full production load |
| Complexity | High - requires traffic mirroring infrastructure |
| Side effects risk | High - v2 must not write to production databases or send emails |

**Critical:** In shadow mode, v2 must not produce side effects. Disable:
- Database writes (connect to a shadow/read-only DB)
- Outbound emails or notifications
- Payment processing
- Third-party API calls with side effects

---

## Strategy comparison matrix

| Strategy | Downtime | Rollback speed | Extra infra cost | Complexity | Best for |
|---|---|---|---|---|---|
| Recreate | Yes | Slow | None | Very low | Batch jobs, incompatible migrations |
| Rolling | No | Medium | Low (brief) | Low | Stateless, backward-compatible APIs |
| Blue-Green | No | Instant | High (2x) | Medium | High-stakes deploys, instant rollback |
| Canary | No | Fast | Low | High | High-traffic, uncertain perf |
| A/B | No | Instant | None | High | Product experiments, feature flags |
| Shadow | No | N/A | Medium | High | Algorithm replacement, behavior matching |

---

## Combining strategies

Real systems often combine strategies:

- **Blue-green + canary**: deploy to green slot, then use canary to shift
  traffic 10% -> 50% -> 100% before decommissioning blue
- **Feature flags + rolling**: roll out binary with a flag off, then gradually
  enable the flag for user cohorts
- **Shadow + canary**: shadow first to verify correctness, then canary to
  validate performance under load, then full rollout

---

## Database migration compatibility by strategy

| Strategy | Schema requirement |
|---|---|
| Recreate | Any schema change (downtime window covers migration) |
| Rolling | Schema must be backward compatible with v1 during rollout |
| Blue-Green | Schema must be compatible with both blue and green simultaneously |
| Canary | Schema must be compatible with both versions simultaneously |
| A/B | Schema must support both code paths simultaneously |
| Shadow | v2 should use a separate or read-only database |

The **expand-contract pattern** (also called parallel change) makes rolling,
blue-green, and canary deploys safe with schema changes:

```
Phase 1 - Expand:   Add new_column (nullable). Deploy v1 unchanged.
Phase 2 - Migrate:  Deploy v2 that writes to both old_column and new_column.
Phase 3 - Backfill: Migrate historical data to new_column.
Phase 4 - Contract: Deploy v3 that reads only new_column. Remove old_column.
```

Each phase can be deployed and verified independently, with rollback possible
at every step.
