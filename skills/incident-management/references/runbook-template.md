<!-- Part of the incident-management AbsolutelySkilled skill. Load this file when
     writing or reviewing runbooks for alerts and services. -->

# Runbook Template

## Standard runbook structure

Every runbook follows the same six-section format. Consistency across runbooks
means on-call engineers can find information in the same place every time,
even for services they have never seen before.

---

## Template

```markdown
# [Alert Name] - [Service Name] Runbook

**Last updated:** [YYYY-MM-DD]
**Owner:** [Team or individual responsible for this runbook]
**Alert source:** [Monitoring tool and alert ID/link]
**Related services:** [Upstream and downstream dependencies]

---

## 1. SYMPTOM

[Quote the alert condition verbatim. Include the metric, threshold, and window.]

Example:
> Alert: checkout-api-error-rate
> Condition: HTTP 5xx rate > 1% for 5 minutes
> Dashboard: [link to dashboard]

---

## 2. IMPACT

**Who is affected:** [Customer segment or internal users]
**How they are affected:** [Cannot checkout, see errors, experience slowness]
**Severity:** [SEV1/SEV2/SEV3 - reference the severity classification table]
**Business impact:** [Revenue, data integrity, compliance, reputation]

---

## 3. INVESTIGATION STEPS

Follow these steps in order. At each step, the result tells you where to go next.

### Step 1: Check the dashboard
- Open: [dashboard link]
- Normal: Error rate < 0.1%, latency p99 < 300ms
- Abnormal: If error rate is elevated, proceed to Step 2

### Step 2: Check recent deployments
- Run: `kubectl rollout history deployment/checkout-api -n production`
- Or check: [deploy tool link]
- If a deploy happened in the last 30 minutes, this is likely the cause.
  Go to Mitigation Step A (Rollback).

### Step 3: Check downstream dependencies
- Open: [dependency dashboard link]
- Check: database connection pool, payment gateway status, cache hit rate
- If a dependency is degraded, the issue is upstream. Escalate to that
  service's on-call (see Escalation section).

### Step 4: Check resource utilization
- Run: `kubectl top pods -n production -l app=checkout-api`
- Normal: CPU < 70%, Memory < 80%
- If resources are exhausted, go to Mitigation Step B (Scale).

### Step 5: Check application logs
- Run: `kubectl logs -l app=checkout-api -n production --tail=200 | grep ERROR`
- Or query: [log aggregator link with pre-built query]
- Look for: stack traces, connection refused, timeout errors
- If you see a new error pattern, document it and escalate.

---

## 4. MITIGATION STEPS

### Step A: Rollback the last deployment
```bash
kubectl rollout undo deployment/checkout-api -n production
```
Monitor error rate for 10 minutes. If it returns to baseline, the deploy was
the cause. Document and proceed to post-mortem.

### Step B: Scale the service
```bash
kubectl scale deployment/checkout-api -n production --replicas=10
```
Monitor for 5 minutes. If error rate drops, the issue is capacity-related.
Investigate the traffic spike source.

### Step C: Restart pods (last resort)
```bash
kubectl rollout restart deployment/checkout-api -n production
```
Use only if Steps A and B did not help and you suspect a memory leak or
stuck process. This causes brief service disruption during rolling restart.

### Step D: Toggle feature flag (if applicable)
- Open: [feature flag tool link]
- Disable: [flag name] for production environment
- This removes the most recent feature change without a full rollback.

---

## 5. ESCALATION

If the above steps do not resolve the issue within **30 minutes**, escalate:

| Priority | Contact | How to reach |
|---|---|---|
| First | [Service team on-call] | Page via [pager tool] |
| Second | [Team lead / engineering manager] | Page via [pager tool] |
| Third | [Dependent service on-call] | Page via [pager tool] - use for dependency issues |
| SEV1 | [Director / VP Engineering] | Phone: [number] |

---

## 6. CONTEXT

- **Architecture doc:** [link]
- **Service dashboard:** [link]
- **Dependency map:** [link]
- **Past incidents:**
  - [INC-1234] - Similar error spike caused by config change (2026-01)
  - [INC-1189] - Database failover caused checkout errors (2025-11)
- **On-call schedule:** [link]
- **Deployment pipeline:** [link]
```

---

## Runbook quality checklist

Before publishing a runbook, verify:

- [ ] Alert condition is quoted verbatim with metric name and threshold
- [ ] Impact section states who is affected in plain language
- [ ] Every investigation step has a "normal" and "abnormal" result
- [ ] Mitigation steps include actual commands or tool links, not just descriptions
- [ ] Escalation contacts are current (review quarterly)
- [ ] Context links are not broken
- [ ] A new team member can follow this without prior service knowledge

## Runbook maintenance

- **Review cadence:** Every runbook must be reviewed every 90 days
- **Update triggers:** Any incident where the runbook was incomplete or wrong
- **Ownership:** The team that owns the service owns the runbook
- **Testing:** During on-call onboarding, have new engineers walk through runbooks
  for the top 5 most-paged alerts as a tabletop exercise

## Common investigation commands reference

```bash
# Kubernetes - check pod status
kubectl get pods -n production -l app=SERVICE_NAME

# Kubernetes - check recent events
kubectl get events -n production --sort-by='.lastTimestamp' | head -20

# Kubernetes - check resource usage
kubectl top pods -n production -l app=SERVICE_NAME

# Kubernetes - check rollout status
kubectl rollout status deployment/SERVICE_NAME -n production

# Kubernetes - view recent logs
kubectl logs -l app=SERVICE_NAME -n production --tail=100 --since=10m

# Database - check active connections (PostgreSQL)
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Database - check long-running queries (PostgreSQL)
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle' AND now() - pg_stat_activity.query_start > interval '30 seconds'
ORDER BY duration DESC;
```
