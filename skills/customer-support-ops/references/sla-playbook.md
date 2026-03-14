<!-- Part of the customer-support-ops AbsolutelySkilled skill. Load this file when
     defining, configuring, or auditing SLA policies. -->

# SLA Playbook

Detailed SLA policy configurations, breach response procedures, and reporting
templates for customer support operations.

---

## SLA policy tiers

### Standard tier (free / starter plans)

```
Business hours:  Mon-Fri, 9am-6pm (customer's timezone or HQ timezone)
Channels:        Email, help center form

First response targets:
  P1: 1 hour     P2: 4 hours     P3: 8 hours     P4: 24 hours

Resolution targets:
  P1: 8 hours    P2: 24 hours    P3: 48 hours     P4: 5 business days

SLA clock behavior:
  - Runs only during business hours
  - Pauses when status is "Waiting on Customer"
  - Resumes when customer replies
```

### Premium tier (paid plans)

```
Business hours:  Mon-Fri, 8am-8pm (customer's timezone)
Channels:        Email, help center, live chat during business hours

First response targets:
  P1: 30 min     P2: 2 hours     P3: 4 hours      P4: 8 hours

Resolution targets:
  P1: 4 hours    P2: 8 hours     P3: 24 hours      P4: 48 hours

SLA clock behavior:
  - Runs only during business hours
  - Pauses when status is "Waiting on Customer"
  - P1 tickets: clock runs 24/7 regardless of business hours
```

### Enterprise tier (enterprise contracts)

```
Business hours:  24/7 for P1/P2; Mon-Fri 8am-8pm for P3/P4
Channels:        Email, help center, live chat, phone, dedicated Slack channel

First response targets:
  P1: 15 min     P2: 1 hour      P3: 2 hours       P4: 4 hours

Resolution targets:
  P1: 4 hours    P2: 8 hours     P3: 24 hours       P4: 48 hours

SLA clock behavior:
  - P1/P2: clock runs 24/7
  - P3/P4: runs during business hours only
  - Pauses when status is "Waiting on Customer"
  - Named account manager monitors all open tickets daily
```

---

## SLA clock rules

### When the clock pauses

| Status | Clock behavior | Rationale |
|---|---|---|
| Waiting on Customer | Paused | Cannot resolve without customer input |
| Waiting on Third Party | Paused (with cap) | External dependency; cap at 48 hours then resume |
| On Hold (internal) | Running | Internal delays should count against SLA |
| Pending Customer Confirmation | Paused | Solution provided, awaiting verification |

### When the clock resets vs continues

- **Customer replies to a solved ticket:** New SLA clock starts (treated as new ticket)
- **Agent reopens a ticket:** SLA clock continues from where it paused
- **Priority changes mid-ticket:** SLA adjusts to new priority targets retroactively
- **Ticket is merged:** Surviving ticket keeps its original SLA clock

---

## Breach response procedures

### Pre-breach alerting

```
75% of SLA elapsed:
  - Notify assigned agent via in-app alert
  - Highlight ticket in queue with yellow warning indicator
  - No escalation yet

90% of SLA elapsed:
  - Notify assigned agent + team lead
  - Highlight ticket in queue with red warning indicator
  - Auto-reassign if agent is offline or at capacity

100% SLA breach:
  - Notify team lead + support manager
  - Log breach in weekly report
  - Trigger post-breach review for P1/P2 breaches
```

### Post-breach actions

**For P1/P2 breaches:**

1. Immediate manager review - why did the breach occur?
2. Customer outreach - apologize and provide updated resolution timeline
3. Log in breach tracker with root cause category:
   - Staffing gap (not enough agents)
   - Knowledge gap (agent lacked expertise)
   - Process gap (routing or triage failure)
   - Volume spike (unexpected ticket surge)
   - Complexity (issue harder than priority suggested)
4. Review in weekly ops meeting

**For P3/P4 breaches:**

1. Log in breach tracker with root cause category
2. Review in weekly ops meeting if pattern emerges (3+ breaches same category)
3. No individual customer outreach required unless CSAT survey indicates dissatisfaction

---

## SLA reporting

### Weekly SLA report template

```
Week of: [date range]

Overall compliance:
  First response SLA: [X]% (target: > 95%)
  Resolution SLA:     [X]% (target: > 90%)

By priority:
  P1: [X]% first response | [X]% resolution | [N] total tickets
  P2: [X]% first response | [X]% resolution | [N] total tickets
  P3: [X]% first response | [X]% resolution | [N] total tickets
  P4: [X]% first response | [X]% resolution | [N] total tickets

Breach summary:
  Total breaches:     [N] ([X]% of volume)
  P1/P2 breaches:     [N] (each documented below)
  Root cause breakdown:
    Staffing gap:     [N]
    Knowledge gap:    [N]
    Process gap:      [N]
    Volume spike:     [N]
    Complexity:       [N]

Top 3 actions for next week:
  1. [specific action with owner]
  2. [specific action with owner]
  3. [specific action with owner]
```

### Monthly SLA trend report

Track these metrics month-over-month to identify trends:

| Metric | Month 1 | Month 2 | Month 3 | Trend |
|---|---|---|---|---|
| First response compliance | | | | |
| Resolution compliance | | | | |
| Average first response time | | | | |
| Average resolution time | | | | |
| Breach count | | | | |
| Ticket volume | | | | |
| Agent headcount | | | | |
| Tickets per agent per day | | | | |

**Red flags in trends:**
- Compliance dropping while volume is flat = process or staffing problem
- Compliance stable but CSAT dropping = premature closures
- Volume rising faster than headcount = scaling problem; plan hiring
- P1 breaches increasing = triage or escalation workflow needs review

---

## SLA negotiation guidelines

When setting SLAs for new customer tiers or enterprise contracts:

1. **Start with what you can reliably deliver** - promise 80% of your current
   performance, not your best-case scenario
2. **Build in buffer for growth** - if you hit 95% compliance at current volume,
   set the SLA target at the level you can maintain at 150% volume
3. **Differentiate on response, not resolution** - response time is controllable;
   resolution depends on issue complexity. Offer aggressive first-response SLAs
   and reasonable resolution SLAs
4. **Define exclusions clearly** - maintenance windows, third-party dependencies,
   and customer-caused delays must be documented upfront
5. **Include SLA review cadence** - quarterly review clause to adjust targets based
   on actual performance data
