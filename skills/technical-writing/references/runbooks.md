<!-- Part of the technical-writing AbsolutelySkilled skill. Load this file when
     working with runbooks, operational procedures, or incident response docs. -->

# Runbooks

## Purpose

A runbook is a step-by-step procedure for an operational task. The reader is
typically an on-call engineer who may be stressed, sleep-deprived, and unfamiliar
with the system. Every word must earn its place.

## Runbook template

```markdown
# Runbook: [Action] [system/component]

**Severity:** [SEV-1 | SEV-2 | SEV-3 | Routine]
**Owner:** [Team name]
**Last tested:** [YYYY-MM-DD]
**Estimated time:** [X-Y minutes]

## Symptoms

- [Observable symptom 1 - what alerts fire, what errors appear]
- [Observable symptom 2]
- [Observable symptom 3]

## Prerequisites

- [ ] Access to [system/tool] with [permission level]
- [ ] [CLI tool] installed and configured
- [ ] Incident channel created in [Slack/Teams/etc.]

## Steps

### 1. [Verify the problem]

[Brief context - why this step matters.]

```bash
[exact command to run]
```

**Expected output:** [what you should see]
**If unexpected:** [what to do - usually "escalate to [team]"]

### 2. [Take corrective action]

```bash
[exact command]
```

**Expected output:** [what success looks like]
**Wait time:** [if the step takes time to propagate]

### 3. [Verify recovery]

```bash
[exact verification command]
```

**Expected output:** [what confirms the fix worked]

## Rollback

If the above steps make things worse, reverse them:

1. [Exact rollback command for step 2]
2. [Verify rollback succeeded]
3. Escalate to [team/person]

## Post-incident

- [ ] Update the incident timeline
- [ ] Write a brief summary in the incident channel
- [ ] Schedule a post-mortem if SEV-1 or SEV-2
```

## Writing rules for runbooks

### Every step must have an exact command

Never write "restart the service" - write the exact command:

```bash
kubectl rollout restart deployment/user-service -n production
```

The on-call engineer should be able to copy-paste every command.

### Include expected output for every step

The reader needs to know if the step worked. Show what success looks like:

```markdown
**Expected output:**
```
deployment.apps/user-service restarted
```

**If you see "not found":** The deployment name may have changed. Run
`kubectl get deployments -n production` to find the current name.
```

### Include timing information

When a step takes time to propagate, say so explicitly:

```markdown
Wait 2-3 minutes for the new pods to become ready. Monitor with:

```bash
kubectl get pods -n production -w | grep user-service
```

All pods should show `Running` and `1/1` ready.
```

### Always include a rollback section

Every runbook must answer: "What if this makes things worse?" Provide explicit
rollback steps, not just "undo the above."

### Include prerequisites as a checklist

Use checkboxes so the on-call engineer can verify they have everything before
starting:

```markdown
## Prerequisites

- [ ] SSH access to production bastion host
- [ ] AWS CLI configured with production credentials
- [ ] PagerDuty incident acknowledged
```

## Severity levels

| Level | Definition | Response time | Example |
|-------|-----------|--------------|---------|
| SEV-1 | Service down, all users affected | Immediate | Database primary is unreachable |
| SEV-2 | Degraded service, many users affected | 15 minutes | API latency > 5s on 50% of requests |
| SEV-3 | Minor issue, few users affected | 1 hour | One webhook endpoint returning errors |
| Routine | Planned maintenance task | Scheduled | Monthly certificate rotation |

## Testing runbooks

Runbooks that have never been tested do not work. Period.

### Testing cadence

- **SEV-1 runbooks:** Test quarterly via gameday exercises
- **SEV-2 runbooks:** Test semi-annually
- **Routine runbooks:** Test on first use, then annually
- **All runbooks:** Review after every incident that used them

### How to test

1. Have someone who did NOT write the runbook follow it in a staging environment
2. Note every place they got confused, had to ask a question, or deviated
3. Update the runbook to address every friction point
4. Record the test date in the "Last tested" field

## Automation ladder

Runbooks exist on a spectrum from fully manual to fully automated:

1. **Manual runbook** - Human follows steps (this document type)
2. **Semi-automated** - Script handles repetitive parts, human makes decisions
3. **Automated with approval** - Script runs end-to-end, human approves
4. **Fully automated** - Triggered by alert, no human needed

Every runbook should aspire to move up this ladder. If you're writing the same
runbook steps for the third time, it's time to automate.
