<!-- Part of the internal-docs AbsolutelySkilled skill. Load this file when
     working with runbooks, playbooks, or standard operating procedures. -->

# Runbooks

## What makes a good runbook

A runbook is a set of step-by-step instructions for performing an operational task.
The golden test: can an engineer who has never seen this system follow the runbook
at 3 AM and resolve the issue without calling anyone?

### The three rules

1. **No ambiguity** - Every step has one interpretation. "Check the logs" fails.
   "Run `kubectl logs -n production deployment/checkout --tail=100`" succeeds.

2. **No assumed knowledge** - Don't assume the reader knows where things are,
   what tools to use, or what "normal" looks like. Show expected output.

3. **No dead ends** - Every step has a "what if this doesn't work" path. The reader
   should never be stuck without a next action.

## Runbook anatomy

```markdown
# Runbook: <Descriptive title>

**Owner:** <team name>
**Last verified:** <date someone actually ran through this>
**Estimated time:** <realistic duration>
**Risk level:** Low | Medium | High
**Related alerts:** <list PagerDuty/Datadog alert names that lead here>

## When to use
<Specific trigger conditions. What alert fires? What symptom appears? What request
comes in? Be explicit about when this runbook applies AND when it does not.>

## Prerequisites
- [ ] Access to <specific system> via <specific tool>
- [ ] Permissions: <specific IAM role, kubectl context, or credentials>
- [ ] Tools installed: <specific CLI tools with version requirements>

## Steps

### Step 1: <Verb phrase describing the action>

<Exact command or UI navigation path>

```bash
<command to run>
```

**Expected output:**
```
<what the output should look like when things are working>
```

**If this fails:**
- If you see `<error message>`: <what to do>
- If the command hangs: <what to do>
- If output differs from expected: <what to do>

### Step 2: ...

## Verification
<How to confirm the procedure worked. Specific checks, not "verify it's working.">

## Rollback
<Exact steps to undo everything. Same level of detail as the main procedure.>

## Escalation
| Condition | Contact | Channel |
|---|---|---|
| Steps don't resolve the issue | <on-call rotation name> | <PagerDuty/Slack> |
| Data loss suspected | <team lead + data team> | <phone + Slack> |
| Customer-facing for >30 min | <engineering manager> | <phone> |
```

## Writing effective steps

### Command formatting

Always provide complete, copy-pasteable commands:

**Bad:**
```
Check the pod status
```

**Good:**
```bash
# Check pod status in the production namespace
kubectl get pods -n production -l app=checkout-service

# Expected: All pods should show STATUS=Running, READY=1/1
# If any pod shows CrashLoopBackOff, proceed to Step 3
```

### Decision points

When a step requires judgment, provide explicit decision trees:

```markdown
### Step 3: Assess memory usage

```bash
kubectl top pods -n production -l app=checkout-service
```

**Decision tree:**
- Memory usage < 80%: This is not a memory issue. Skip to Step 5.
- Memory usage 80-95%: Proceed to Step 4 (graceful restart).
- Memory usage > 95%: Proceed to Step 4 with `--force` flag.
```

### Variable substitution

When commands need environment-specific values, use clear placeholders:

```bash
# Replace <ENVIRONMENT> with: production | staging
# Replace <POD_NAME> with the output of Step 1
kubectl exec -it <POD_NAME> -n <ENVIRONMENT> -- /bin/sh
```

## Runbook categories

| Category | Purpose | Example |
|---|---|---|
| Incident response | Fix a specific failure mode | "Database connection pool exhausted" |
| Maintenance | Perform scheduled operations | "Monthly certificate rotation" |
| Provisioning | Set up new resources | "Onboard a new microservice" |
| Troubleshooting | Diagnose an unknown issue | "High latency investigation flowchart" |
| Recovery | Restore from a failure state | "Restore database from backup" |

## Testing and maintenance

### Verification schedule

Runbooks must be tested regularly. An untested runbook is a liability.

| Risk level | Verification frequency | Method |
|---|---|---|
| High (incident response) | Monthly | Dry run or game day exercise |
| Medium (maintenance) | Quarterly | Execute during scheduled maintenance |
| Low (provisioning) | Every use | Verify steps match current tooling |

### Testing method

1. **Dry run** - Walk through the runbook without executing destructive steps.
   Verify all commands are valid and outputs match expectations.

2. **Shadow execution** - Run the procedure in a staging environment that mirrors
   production.

3. **Game day** - Schedule a simulated incident where a team member follows the
   runbook under realistic conditions.

### Maintenance workflow

```
Runbook created -> Author verifies -> Peer review -> Published
     ^                                                    |
     |                                                    v
     +-- Update needed <-- Quarterly review <-- In use <--+
```

After each use, the executor should:
1. Note any steps that were unclear, incorrect, or missing
2. Update the runbook immediately (while context is fresh)
3. Update the "Last verified" date

### Staleness indicators

Flag a runbook for review if:
- "Last verified" is more than 3 months old
- The system it covers has had a major version change
- An incident occurred where the runbook was followed but didn't resolve the issue
- A team member reports confusion during execution

## Linking runbooks to alerts

Every production alert should link to a runbook. In the alert definition:

```yaml
# PagerDuty / Datadog / Grafana alert annotation
annotations:
  runbook_url: "https://wiki.internal/runbooks/checkout-high-latency"
  summary: "Checkout service p99 latency > 1000ms for 5 minutes"
```

This ensures the on-call engineer sees the runbook link immediately when paged,
reducing mean time to resolution (MTTR).
