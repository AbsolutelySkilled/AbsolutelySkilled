<!-- Part of the site-reliability AbsolutelySkilled skill. Load this file when
     conducting or writing a postmortem. -->

# Postmortem Template

A blameless postmortem is a structured learning exercise, not an accountability
hearing. The goal is to understand what happened, improve the system, and prevent
recurrence. Every question in this template focuses on systems, processes, and
tooling - not on individuals.

---

## Facilitation Guide

**Before the meeting:**
- Designate one facilitator (neutral; preferably not the incident commander)
- Designate one scribe (takes verbatim notes, not the facilitator)
- Share the draft timeline 24 hours before so attendees can correct it
- Invite: incident responders, on-call, service owners, one representative from affected teams
- Block 60-90 minutes; complex incidents need 90

**During the meeting:**
- Open with: "This is a learning session. There is no blame here."
- Use "the system did X" not "you did X"
- When discussion gets heated: redirect to "what could the system have done differently?"
- Time-box root cause discussion to 30 minutes; spend remaining time on action items
- If someone is defensive, ask: "What would have had to be true for anyone in that position to have done differently?"

**After the meeting:**
- Publish draft within 24 hours for comment
- Finalize and share within 5 days of incident
- Enter all action items into your issue tracker with owners and due dates
- Review open action items at the start of every sprint retrospective

---

## Postmortem Document

### Incident metadata

| Field | Value |
|---|---|
| Incident ID | INC-YYYY-NNN |
| Date and time detected | YYYY-MM-DD HH:MM UTC |
| Date and time resolved | YYYY-MM-DD HH:MM UTC |
| Total duration | X hours Y minutes |
| Severity | SEV1 / SEV2 / SEV3 |
| Incident commander | Name |
| Postmortem owner | Name |
| Postmortem date | YYYY-MM-DD |
| Services affected | List each service |
| Customer impact | Description (e.g., "100% of checkout requests failed") |
| SLO impact | Error budget consumed (e.g., "0.08% of 30-day availability budget") |

**Example:**

| Field | Value |
|---|---|
| Incident ID | INC-2025-047 |
| Date and time detected | 2025-03-14 14:32 UTC |
| Date and time resolved | 2025-03-14 16:18 UTC |
| Total duration | 1 hour 46 minutes |
| Severity | SEV1 |
| Incident commander | Priya Sharma |
| Postmortem owner | Jordan Lee |
| Postmortem date | 2025-03-16 |
| Services affected | payments-api, order-service |
| Customer impact | 100% of payment attempts failed for 1h 46m |
| SLO impact | Consumed 87% of monthly error budget in one incident |

---

### Summary

> One paragraph. What happened, when, who was affected, and how it was resolved.
> Written for someone who was not involved. Avoid jargon.

**Example:**

On 2025-03-14 at 14:32 UTC, the payments-api began returning 503 errors for all
requests. This was caused by database connection pool exhaustion triggered by a
configuration change deployed at 14:15 UTC that reduced the connection pool max size
from 100 to 10. All checkout attempts failed for 1 hour 46 minutes until the
configuration was reverted at 16:18 UTC. Approximately 14,000 customers were unable
to complete purchases during the window.

---

### Timeline

> List events in chronological order with UTC timestamps. Include the detection,
> escalation, diagnosis, and resolution events. Include near-misses and things that
> helped recovery - not just failures.

| Time (UTC) | Event | Actor |
|---|---|---|
| YYYY-MM-DD HH:MM | | |
| YYYY-MM-DD HH:MM | | |

**Example:**

| Time (UTC) | Event | Actor |
|---|---|---|
| 2025-03-14 14:15 | Config change deployed: pool_max_connections reduced from 100 to 10 | CI/CD pipeline |
| 2025-03-14 14:32 | SLO burn rate alert fires: 14.4x burn rate on payments-api availability | Alerting system |
| 2025-03-14 14:35 | Primary on-call acks alert, begins investigation | Kenji Tanaka |
| 2025-03-14 14:41 | Error rate confirmed at 100%; incident declared SEV1; incident commander assigned | Kenji Tanaka |
| 2025-03-14 14:48 | Traces show all requests timing out at DB layer | Kenji Tanaka |
| 2025-03-14 15:02 | DB team joins call; connection pool exhaustion confirmed | DB on-call |
| 2025-03-14 15:20 | Root cause identified: pool_max_connections=10 in recent deploy | Priya Sharma |
| 2025-03-14 15:45 | Config revert prepared and reviewed | Kenji Tanaka, Priya Sharma |
| 2025-03-14 16:15 | Config revert deployed | CD pipeline |
| 2025-03-14 16:18 | Error rate returns to < 0.1%; incident resolved | Kenji Tanaka |
| 2025-03-14 16:30 | All-clear communication sent to customer support | Priya Sharma |

---

### Root cause analysis

> Ask "why" five times. Each answer becomes the input to the next question.
> Stop when you reach a systemic cause - something about processes, tooling,
> or design - not a person.

**The five-why chain:**

```
Why did the service fail?
  -> Connection pool was exhausted; all DB requests timed out

Why was the connection pool exhausted?
  -> pool_max_connections was set to 10, far below the 100 connections needed at peak load

Why was pool_max_connections set to 10?
  -> A config change in the deploy reduced it from 100 to 10

Why did the config change ship with an incorrect value?
  -> The config value was changed to 10 (not 100) when cleaning up a test environment config,
     and no automated validation checked the value range before deploy

Why was there no validation?
  -> The configuration system has no schema enforcement or range validation on pool settings
```

**Root cause (systemic):** The configuration deployment pipeline lacks validation
that enforces minimum and maximum bounds on critical infrastructure parameters.
There was no automated guard between an incorrect configuration value and production.

---

### Detection

> How was the incident detected? How long after it started? Could it have been
> caught sooner?

**Questions to answer:**
- Was the incident detected by an alert, a customer report, or manual discovery?
- How long was the service degraded before detection?
- Did the alert fire at the right severity?
- Was the runbook link in the alert? Was the runbook accurate?
- What could have detected this sooner?

**Example:**

The burn rate alert fired 17 minutes after the config was deployed. Detection was
automated and appropriate. However, the runbook linked from the alert did not include
steps for diagnosing connection pool issues - the responder had to search Slack
history to find the DB team's contact. The 17-minute window could be reduced: a
canary analysis check during deploy could have caught the pool exhaustion before
reaching 100% of traffic.

---

### Response

> How long did mitigation take? What slowed it down? What helped?

**Questions to answer:**
- From alert to mitigation: what was the elapsed time? Was that acceptable?
- What information was missing at the start of the investigation?
- Were the right people in the incident call quickly enough?
- Was communication to stakeholders/customers timely?
- What tools or runbooks saved time? What was missing?

**Example:**

Time-to-mitigate was 1 hour 43 minutes from detection. The longest delay was 35
minutes identifying the root cause, because:

1. The connection pool metrics were not on the default service dashboard
2. The DB team had to be manually pulled in; no automated escalation path existed
   for DB-layer incidents

What helped: the incident commander used the standard war room template, which kept
communication structured. The config diff was easy to find because all deploys are
tagged with a commit hash in the config store.

---

### Impact assessment

> Quantify the impact across customer experience, business metrics, and reliability
> targets.

| Dimension | Impact |
|---|---|
| Users affected | Estimated or exact count |
| Requests failed | Total failed / total expected |
| Revenue impact | Estimate (if applicable) |
| SLO budget consumed | % of monthly budget |
| Secondary systems affected | List |
| Data integrity impact | Any data loss or corruption? |

**Example:**

| Dimension | Impact |
|---|---|
| Users affected | ~14,200 unique users (based on session counts during window) |
| Requests failed | 847,000 / 847,000 checkout requests (100%) |
| Revenue impact | ~$340,000 GMV blocked (not permanently lost; retried after resolution) |
| SLO budget consumed | 87% of monthly error budget consumed in one incident |
| Secondary systems affected | Order-service (dependent on payments-api); failed gracefully |
| Data integrity impact | No data loss; all failed transactions rolled back cleanly |

---

### Contributing factors

> Not the root cause - but conditions that made the incident more likely, more
> severe, or harder to detect and resolve. Each factor is a separate improvement opportunity.

List each factor as a sentence describing the systemic condition:

- The configuration deployment pipeline had no validation for parameter bounds
- Connection pool metrics were absent from the service's primary dashboard
- The runbook for availability alerts did not cover DB layer diagnosis
- There was no automated canary analysis step in the config deployment pipeline
- The escalation path for DB-layer incidents was not documented

---

### Action items

> Each action item must have: a description, an owner (person, not team), a due date,
> and a clear definition of done. "Improve X" is not an action item.

| ID | Action | Owner | Due date | Status | Definition of done |
|---|---|---|---|---|---|
| AI-001 | | | | Open | |
| AI-002 | | | | Open | |

**Example:**

| ID | Action | Owner | Due date | Status | Definition of done |
|---|---|---|---|---|---|
| AI-001 | Add schema validation with min/max bounds to config deployment pipeline for all DB connection pool parameters | Jordan Lee | 2025-04-04 | Open | CI pipeline rejects any config with pool_max_connections < 20 or > 500; tested with a deliberately bad config |
| AI-002 | Add connection pool utilization panel (current/max, wait time) to payments-api service dashboard | Kenji Tanaka | 2025-03-28 | Open | Dashboard panel live in Grafana, verified against staging traffic |
| AI-003 | Update availability alert runbook to include DB connection pool diagnosis steps | Kenji Tanaka | 2025-03-21 | Open | Runbook has a "Check DB connection pool" section with commands and expected output |
| AI-004 | Add canary analysis step to config deploy pipeline checking error rate before promoting to 100% | Priya Sharma | 2025-04-18 | Open | Config deploys pause at 5% traffic for 5 minutes; auto-rollback if error rate > baseline + 1% |
| AI-005 | Document DB team escalation path in on-call handbook and link from all DB-related alerts | Priya Sharma | 2025-03-21 | Open | On-call handbook has "DB layer incidents" section; all DB alerts have escalation contact |

---

### What went well

> Explicitly document what worked. Reinforcing good practices is as important as
> fixing gaps. This section prevents the meeting from becoming purely negative.

**Example:**

- Burn rate alerting fired within 17 minutes of incident start - fast enough for automatic detection
- The incident commander kept a clear timeline in real-time, which made this postmortem significantly easier to write
- All failed transactions rolled back cleanly - no data integrity work required after resolution
- Customer support was notified within 20 minutes of incident declaration and had accurate status updates throughout

---

### Lessons learned

> High-level principles the team is taking away. Not action items - these are insights
> that change how the team thinks. Useful for sharing across teams.

**Example:**

- Configuration changes are code changes: they need the same validation, review, and canary deployment treatment as binary changes
- Dashboard completeness is an on-call SLA: if it is not on the dashboard, it will not be checked during an incident under pressure
- The postmortem process worked: having a designated incident commander and real-time timeline shortened the postmortem meeting by an estimated 30 minutes

---

### Follow-up review date

> Set a date to review the status of action items. Default: 30 days after postmortem.

**Next review:** YYYY-MM-DD
**Review owner:** Name (verify all action items are complete or have updated owners/dates)

---

## Quick-reference: postmortem checklist

**During the incident:**
- [ ] Designate an incident commander
- [ ] Start a shared timeline document immediately
- [ ] Note every significant event with a timestamp

**Within 24 hours of resolution:**
- [ ] Draft timeline shared with participants for corrections
- [ ] Postmortem owner assigned
- [ ] Meeting scheduled within 48 hours

**At the meeting:**
- [ ] Facilitator opens with blameless framing
- [ ] Timeline reviewed and finalized
- [ ] Root cause chain completed (5 whys)
- [ ] Contributing factors listed
- [ ] Action items have owners and due dates

**Within 5 days:**
- [ ] Final postmortem published internally
- [ ] All action items entered in issue tracker
- [ ] Summary shared with affected stakeholders
- [ ] SLO impact documented in reliability dashboard

**30-day review:**
- [ ] All action items complete or rescheduled with explanation
- [ ] Lessons learned shared with broader engineering organization
