<!-- Part of the customer-support-ops AbsolutelySkilled skill. Load this file when
     designing or reviewing escalation workflows and cross-team escalation protocols. -->

# Escalation Matrix

Full escalation decision trees, handoff checklists, and cross-team escalation
protocols for multi-tier support operations.

---

## Escalation decision tree

### Should I escalate this ticket?

```
1. Can I resolve this with available macros and knowledge base?
   YES -> Resolve at current tier
   NO  -> Continue

2. Do I have access to the tools/systems needed to investigate?
   NO  -> Escalate to the tier with access
   YES -> Continue

3. Have I spent more than 30 minutes actively working on this?
   YES -> Escalate to next tier with findings
   NO  -> Continue investigating

4. Is this a confirmed bug or requires a code change?
   YES -> Escalate to Tier 3 (Engineering)
   NO  -> Continue

5. Has the customer explicitly requested escalation?
   YES -> Escalate immediately (honor all escalation requests)
   NO  -> Continue

6. Is the SLA at risk (> 75% elapsed)?
   YES -> Escalate with SLA urgency flag
   NO  -> Continue working at current tier
```

### Priority-based escalation timing

| Priority | Max time at L1 before escalation | Max time at L2 before escalation |
|---|---|---|
| P1 | 15 minutes | 30 minutes |
| P2 | 30 minutes | 1 hour |
| P3 | 2 hours | 4 hours |
| P4 | 4 hours | 8 hours |

These are maximum times. Escalate sooner if the decision tree above indicates it.

---

## Escalation handoff checklist

Before escalating any ticket, complete this checklist:

```
[ ] Ticket summary written (1-2 sentences of the core issue)
[ ] Steps already taken documented (numbered list)
[ ] Customer information confirmed:
    - Name, plan tier, account age
    - Any relevant account flags (VIP, at-risk, enterprise)
[ ] Reproduction steps documented (if applicable)
[ ] Screenshots or logs attached (if applicable)
[ ] Customer sentiment noted (frustrated / neutral / understanding)
[ ] SLA status noted (time remaining before breach)
[ ] Specific ask for the next tier stated clearly:
    - "Need database query to check account state"
    - "Need code fix for [specific bug]"
    - "Need access to [internal tool] to investigate"
[ ] Customer notified of the escalation (use escalation notice macro)
```

**Common handoff failures:**
- "Please look into this" with no context = bad handoff
- Forwarding the entire ticket thread without a summary = bad handoff
- Escalating without trying basic troubleshooting = premature escalation

---

## Tier-to-tier escalation paths

### L1 to L2 escalation

**When:** Issue requires specialized product knowledge, access to internal tools,
or deeper technical investigation beyond standard troubleshooting.

**Routing by product area:**

| Product area | L2 queue | L2 team |
|---|---|---|
| Billing and payments | billing-l2 | Finance operations |
| API and integrations | api-l2 | Platform team |
| Authentication and security | auth-l2 | Security team |
| Data and analytics | data-l2 | Data platform team |
| Mobile app | mobile-l2 | Mobile team |
| General / unclear | general-l2 | Senior support agents |

**L2 response expectations:**
- Acknowledge escalation within 30 minutes during business hours
- Provide initial assessment within 2 hours
- Either resolve or escalate to L3 within the SLA window

### L2 to L3 (Engineering) escalation

**When:** Confirmed bug, data inconsistency, performance issue, or security concern
requiring code-level investigation.

**Engineering escalation template:**

```
Title:        [BUG/PERF/DATA/SEC] - Brief description
Priority:     [P1-P4]
Customer:     [name, plan, impact scope (1 customer / multiple / all)]
SLA status:   [time remaining]

What happened:
  [customer-reported symptoms]

What we investigated:
  [L1/L2 troubleshooting steps and findings]

Reproduction steps:
  1. [step]
  2. [step]
  Expected: [what should happen]
  Actual:   [what happens instead]

Evidence:
  [logs, screenshots, error messages, request IDs]

Customer-facing workaround:
  [if one exists, describe it; if not, state "none available"]

Requested action:
  [specific ask: fix bug, investigate data, review performance]
```

**Engineering response expectations:**
- P1: Acknowledge within 15 minutes, actively investigate immediately
- P2: Acknowledge within 1 hour, provide initial assessment within 4 hours
- P3/P4: Acknowledge within 1 business day, schedule fix in next sprint

### Management escalation

**When:** SLA breach on P1/P2, customer threatens churn or legal action, repeated
escalations for same issue (3+), VIP dissatisfaction.

**Management escalation includes:**

```
Escalation reason:   [SLA breach / churn risk / repeated issue / VIP]
Ticket history:      [link to ticket + summary of all related tickets]
Customer value:      [ARR, plan tier, account age, expansion potential]
Business risk:       [churn probability, contract renewal date, legal exposure]
What has been tried: [summary of all support and engineering efforts]
Recommended action:  [specific recommendation for management decision]
```

---

## Cross-team escalation protocols

### Support to Product

**When:** Feature request from multiple customers (3+), workaround is unsustainable,
or product behavior does not match documentation.

**Protocol:**
1. Log feature request in the shared tracker with customer count and business impact
2. Tag the relevant product manager in the tracker
3. Do not promise timelines to customers - say "logged with our product team"
4. Product PM reviews support-tagged items weekly

### Support to Sales/Success

**When:** Customer expresses expansion interest, contract renewal concerns, or
dissatisfaction that may affect retention.

**Protocol:**
1. Internal note on the ticket with the customer's exact words
2. Direct message to the assigned account manager or CSM
3. Include: customer name, current plan, what they said, recommended action
4. Flag urgency: "informational" vs "action needed this week"

### Support to Legal

**When:** Customer mentions legal action, regulatory complaint, data breach inquiry,
or GDPR/CCPA data request.

**Protocol:**
1. Do not make any commitments or admissions to the customer
2. Respond with: "I've escalated this to our appropriate internal team who will
   follow up with you directly within [timeframe]"
3. Immediately notify support manager + legal team via designated channel
4. Attach full ticket history and customer communication

---

## Escalation metrics to track

| Metric | Target | Red flag |
|---|---|---|
| Escalation rate (L1 to L2) | 15-25% | > 35% (knowledge gap) or < 10% (premature closes) |
| Escalation rate (L2 to L3) | 3-8% | > 15% (L2 undertrained) |
| Escalation turnaround time | Within SLA | Consistently near SLA limit |
| Bounce-back rate (escalated then returned) | < 5% | > 10% (bad handoffs) |
| Customer re-escalation rate | < 3% | > 5% (resolution quality issue) |

**Monthly review questions:**
1. Which product areas generate the most escalations? (knowledge gap signal)
2. Which agents escalate most frequently? (training opportunity)
3. Which escalations bounce back? (handoff quality issue)
4. Are engineering escalations increasing? (product quality signal)
