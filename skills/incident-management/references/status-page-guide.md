<!-- Part of the incident-management AbsolutelySkilled skill. Load this file when
     setting up or updating a status page during an incident. -->

# Status Page Guide

## Status page structure

### Components

Organize by user-facing service, not internal architecture. Customers do not care
which microservice is down - they care what they cannot do.

**Good component names:**
- Checkout & Payments
- User Dashboard
- API (v2)
- Mobile App
- Webhooks & Notifications
- Data Exports

**Bad component names (internal jargon):**
- payment-gateway-service
- redis-cache-cluster
- kafka-consumer-group-3

### Component statuses

| Status | Meaning | When to use |
|---|---|---|
| Operational | Everything working normally | Default state |
| Degraded Performance | Slower than normal but functional | Elevated latency, partial slowdown |
| Partial Outage | Some users or features affected | Errors for a subset of requests |
| Major Outage | Service is unavailable | Complete failure of a core function |
| Under Maintenance | Planned downtime | Scheduled maintenance windows |

---

## Incident update templates

### Investigating

```
Title: Elevated error rates on [Component]

Update (HH:MM UTC):
We are investigating reports of [symptom in plain language]. Some customers
may experience [specific impact - e.g., "errors when attempting to check out"
or "slower page load times on the dashboard"].

We will provide an update within 30 minutes.
```

### Identified

```
Update (HH:MM UTC):
We have identified the cause of [symptom]. [One sentence about the cause in
plain language - e.g., "A configuration change is causing connection issues
with our payment processor."]

Our engineering team is working on a fix. We expect to have this resolved
within [estimated time if known, or "the next 1-2 hours"].

We will provide another update within 30 minutes.
```

### Monitoring

```
Update (HH:MM UTC):
We have deployed a fix for [symptom]. Our systems are recovering and we are
monitoring to confirm the issue is fully resolved.

[If applicable: "Some customers may continue to see intermittent errors for
the next 10-15 minutes as the fix propagates."]

We will provide a final update once we confirm full recovery.
```

### Resolved

```
Update (HH:MM UTC):
This incident has been resolved. [Component] is operating normally.

Summary: Between [start time] and [end time] UTC, [brief description of what
happened and who was affected]. [One sentence on what was done to fix it.]

[If applicable: "No customer action is required." or "If you experienced
[specific issue], please [specific action - e.g., retry your request, contact
support at support@example.com]."]

We will be conducting a thorough post-incident review to prevent recurrence.
We apologize for the disruption.
```

---

## Maintenance notification templates

### Scheduled maintenance (advance notice)

```
Title: Scheduled maintenance for [Component]

We will be performing scheduled maintenance on [Component] on [date] from
[start time] to [end time] UTC ([convert to major customer timezones]).

During this window:
- [Specific impact - e.g., "The API will return 503 errors"]
- [What will still work - e.g., "The dashboard will remain accessible in
  read-only mode"]
- [Estimated duration of actual downtime within the window]

[If applicable: "We recommend scheduling any critical operations before or
after this maintenance window."]

We will update this notice when maintenance begins and when it is complete.
```

---

## Communication cadence

| Incident phase | Update frequency | Who writes |
|---|---|---|
| Investigating | Every 30 minutes | Communications Lead |
| Identified | Every 30 minutes | Communications Lead |
| Monitoring | Every 60 minutes | Communications Lead |
| Resolved | Once (final update) | Communications Lead + IC review |

**Rules:**
- Never go more than 30 minutes without an update during an active incident
- If there is no new information, say so: "We are continuing to investigate.
  No new information at this time. Next update in 30 minutes."
- All timestamps in UTC with local timezone equivalents for major customer regions
- The IC reviews the resolved update before publishing

---

## Writing guidelines

### Do
- State the customer impact first, then what you are doing
- Use plain language a non-technical person can understand
- Be honest about what you know and do not know
- Include specific times and durations
- Acknowledge the disruption: "We apologize for the inconvenience"

### Do not
- Use internal service names, error codes, or technical jargon
- Say "no impact" if customers are reporting problems
- Blame third parties without confirmation ("our cloud provider caused...")
- Promise specific resolution times unless you are confident
- Use passive voice to hide accountability ("errors were experienced")

### Tone
- Professional but human
- Direct and factual
- Empathetic without being overly apologetic
- Confident about what you know, transparent about what you do not

---

## Status page tool setup checklist

When setting up a new status page:

- [ ] Define components based on user-facing services (not internal architecture)
- [ ] Set up subscriber notifications (email, SMS, webhook, RSS)
- [ ] Configure automated status updates from monitoring (operational/degraded)
- [ ] Pre-draft incident templates (copy from this guide)
- [ ] Assign ownership: who can publish updates (on-call + Communications Lead)
- [ ] Test the notification flow end-to-end before going live
- [ ] Add the status page link to your application's footer and support docs
- [ ] Configure maintenance window scheduling
- [ ] Set up uptime metrics display (90-day rolling window per component)
- [ ] Review and update component list quarterly as services evolve
