<!-- Part of the incident-management AbsolutelySkilled skill. Load this file when
     conducting or writing a post-mortem / post-incident review. -->

# Post-mortem Template

## Document header

```
Title:           [SEV level] [Brief description of the incident]
Date:            [Date of incident]
Duration:        [Start time - End time, including timezone]
Authors:         [Post-mortem owner]
Status:          Draft | In Review | Final
Severity:        SEV1 | SEV2 | SEV3
Services affected: [List of affected services]
Customer impact: [Brief description of user-facing impact]
```

---

## 1. Summary

Write 3-5 sentences covering: what broke, who was affected, how long it lasted,
and how it was resolved. This should be readable by a non-engineer.

**Example:**
> On 2026-03-10 between 14:22 and 15:47 UTC, the checkout service returned 500
> errors for approximately 30% of payment requests. An estimated 2,400 customers
> were unable to complete purchases during this window. The root cause was a
> connection pool exhaustion triggered by a configuration change deployed at 14:15
> UTC. The incident was resolved by rolling back the configuration change and
> increasing the connection pool size.

---

## 2. Timeline

Use UTC timestamps. Include both automated events (alerts, deploys) and human
actions (who did what).

```
14:15 UTC  - Deploy #4521 pushed to production (config change to DB pool settings)
14:22 UTC  - Checkout-api error rate alert fires (threshold: 1%, observed: 8%)
14:24 UTC  - On-call engineer @alice acks the page
14:27 UTC  - @alice opens war room, assigns IC role to @bob
14:30 UTC  - Status page updated: "Investigating increased errors on checkout"
14:35 UTC  - @alice identifies connection pool exhaustion in service metrics
14:40 UTC  - @alice correlates with deploy #4521 timeline
14:45 UTC  - Decision: rollback deploy #4521
14:48 UTC  - Rollback initiated
14:55 UTC  - Rollback complete. Error rate dropping.
15:00 UTC  - Status page updated: "Fix deployed, monitoring"
15:30 UTC  - Error rate back to baseline (0.05%)
15:47 UTC  - IC @bob declares incident resolved
15:47 UTC  - Status page updated: "Resolved"
```

---

## 3. Root cause analysis

### What happened

Describe the technical chain of events. Be specific about the failure mode.

### Five whys

```
Why 1: Why did checkout fail?
  -> Connection pool was exhausted; new requests could not get a DB connection.

Why 2: Why was the connection pool exhausted?
  -> Deploy #4521 reduced max_connections from 100 to 10.

Why 3: Why was that configuration change deployed?
  -> An engineer was tuning connection settings for a staging environment
     and accidentally included the production config file.

Why 4: Why did the production config get included?
  -> The staging and production configs are in the same directory with
     similar names (db-config-staging.yaml, db-config-prod.yaml).

Why 5: Why was there no safeguard?
  -> No automated validation checks connection pool size against a minimum
     threshold before deploy.
```

### Contributing factors

List factors that did not cause the incident but made it worse or slower to resolve:

- No deployment diff review required for config-only changes
- Connection pool metric was not on the checkout service dashboard
- Runbook for this alert did not mention checking recent deploys

---

## 4. Detection analysis

| Question | Answer |
|---|---|
| How was the incident detected? | Automated alert on error rate |
| Time from cause to detection | 7 minutes |
| Could we have detected it sooner? | Yes - a config validation check at deploy time would have caught it instantly |
| Were there earlier signals we missed? | Connection pool utilization was at 95% for 5 minutes before errors started, but no alert was configured for pool saturation |

---

## 5. Response analysis

| Question | Answer |
|---|---|
| Time from detection to ack | 2 minutes |
| Time from ack to mitigation start | 21 minutes |
| Time from mitigation start to resolution | 62 minutes |
| What went well in the response? | Fast ack, war room opened quickly, status page updated promptly |
| What could have been faster? | Correlating the deploy with the outage took 13 minutes; an automated deploy correlation tool would have flagged it immediately |

---

## 6. Impact assessment

| Dimension | Measurement |
|---|---|
| Duration | 85 minutes |
| Users affected | ~2,400 (30% of checkout traffic) |
| Revenue impact | Estimated $18,000 in delayed purchases (95% recovered within 2 hours) |
| SLO budget consumed | 12% of monthly error budget |
| Support tickets | 47 tickets opened |
| Data loss | None |

---

## 7. Action items

Every action item must have: owner, due date, priority, and definition of done.

| ID | Action item | Owner | Priority | Due date | Status |
|---|---|---|---|---|---|
| AI-1 | Add config validation to deploy pipeline: reject connection pool size < 20 | @charlie | P0 | 2026-03-24 | Open |
| AI-2 | Separate staging and production config directories | @alice | P1 | 2026-04-07 | Open |
| AI-3 | Add connection pool utilization alert (threshold: 80%) to checkout-api | @alice | P1 | 2026-03-28 | Open |
| AI-4 | Update checkout-api runbook to include "check recent deploys" as step 2 | @bob | P2 | 2026-03-21 | Open |
| AI-5 | Evaluate automated deploy-correlation tool for the incident dashboard | @dave | P2 | 2026-04-14 | Open |

---

## 8. Lessons learned

### What went well
- Alert fired quickly (7 minutes from cause)
- War room was organized and focused
- Status page was updated within 8 minutes of the page
- Rollback was clean and effective

### What did not go well
- Config change had no validation gate
- It took 13 minutes to identify the deploy as the cause
- The runbook did not mention checking recent deployments

### Where we got lucky
- The config change was easily rollbackable. A schema migration with the same
  type of error would have been much harder to reverse.

---

## Facilitation guide

### Before the meeting
- Post-mortem owner drafts sections 1-3 before the meeting
- Share the draft with all participants 2 hours before the meeting
- Remind everyone: this is a blameless review. We discuss systems, not individuals.

### During the meeting (60-90 minutes)
1. (5 min) IC reads the summary and timeline aloud
2. (20 min) Walk through the root cause analysis. Ask: "Is there anything missing?"
3. (15 min) Review detection and response. Ask: "Where could we have been faster?"
4. (20 min) Draft action items as a group. For each: agree on owner and priority.
5. (10 min) Capture lessons learned. Ask: "What went well? What did not?"
6. (5 min) Agree on review date for action items (usually 30 days)

### After the meeting
- Owner finalizes the document within 24 hours
- Publish to the team's incident archive
- Enter all action items in the issue tracker with the agreed due dates
- Schedule a 30-day follow-up to verify action item completion
