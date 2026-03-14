<!-- Part of the customer-support-ops AbsolutelySkilled skill. Load this file when
     building or reviewing a macro/canned response library. -->

# Macro Templates

Ready-to-use support response templates organized by scenario. Customize
placeholders and tone for your brand voice before deploying. Never send a macro
blind - always review populated fields before submitting.

---

## Placeholder reference

| Placeholder | Description | Example value |
|---|---|---|
| `{{customer_name}}` | Customer's first name | "Hi Sarah" |
| `{{agent_name}}` | Assigned agent's name | "Best, Alex" |
| `{{ticket_id}}` | Ticket reference number | "#12345" |
| `{{product_area}}` | Affected feature or product | "billing dashboard" |
| `{{timeframe}}` | Expected resolution or follow-up window | "within 2 hours" |
| `{{link}}` | Relevant help article or status page URL | "https://help.example.com/reset" |

**Tone rules:**
- Open with empathy or acknowledgment, never the problem statement
- Close with a clear next step or expectation
- Avoid internal product names, error codes, or jargon the customer would not recognize
- Match severity: apologetic for outages, informational for how-to, warm for resolution

---

## Acknowledgment templates

### First response - general

```
Hi {{customer_name}},

Thanks for reaching out. I've received your request about {{product_area}} and
I'm looking into it now.

I'll have an update for you {{timeframe}}. If anything changes on your end in
the meantime, just reply to this thread.

Best,
{{agent_name}}
```

**Actions:** Set status to "In Progress". Apply product area tag.

---

### First response - urgent (P1/P2)

```
Hi {{customer_name}},

I understand this is urgent and I'm treating it as a top priority. Our team is
actively investigating the {{product_area}} issue you reported.

I'll update you within the next 30 minutes with what we find. You don't need to
do anything on your end right now.

{{agent_name}}
```

**Actions:** Set status to "In Progress". Set priority P1 or P2. Notify team lead.

---

### First response - needs more information

```
Hi {{customer_name}},

Thanks for reaching out about {{product_area}}. To get this resolved quickly,
I need a few more details:

1. {{question_1}}
2. {{question_2}}

Once I have these, I can investigate right away.

Best,
{{agent_name}}
```

**Actions:** Set status to "Waiting on Customer". Pause SLA clock.

---

## Status update templates

### Update - investigating root cause

```
Hi {{customer_name}},

Quick update on ticket {{ticket_id}}: we've identified the {{product_area}} issue
and our team is actively investigating the root cause.

I'll have another update for you within {{timeframe}}. No action needed on your end.

{{agent_name}}
```

---

### Update - fix in progress, ETA known

```
Hi {{customer_name}},

We've identified the root cause of the {{product_area}} issue and a fix is in
progress. We expect it to be deployed by {{timeframe}}.

I'll confirm as soon as it's live.

{{agent_name}}
```

---

### Update - fix in progress, ETA unknown

```
Hi {{customer_name}},

Our engineering team is actively working on the {{product_area}} issue. We don't
have a firm ETA yet, but I'll update you every {{timeframe}} until it's resolved.

Thanks for your patience.

{{agent_name}}
```

---

### Update - escalated to engineering

```
Hi {{customer_name}},

I've escalated your {{product_area}} issue to our engineering team for deeper
investigation. They're looking into it now.

I'm staying on this and will keep you updated. Your ticket reference is {{ticket_id}}.

{{agent_name}}
```

**Actions:** Add "escalated-engineering" tag. Assign to engineering queue.

---

## Resolution templates

### Resolution - issue fixed, steps to verify

```
Hi {{customer_name}},

Good news - the {{product_area}} issue has been resolved. Our team deployed a
fix and verified it's working correctly.

Could you try {{specific_action}} and confirm everything is working on your end?
If you hit any issues, just reply here and I'll jump right back in.

Thanks for your patience throughout this.
{{agent_name}}
```

**Actions:** Set status to "Pending". Apply "resolved" tag. Set 48-hour auto-close timer.

---

### Resolution - workaround provided

```
Hi {{customer_name}},

While our team works on a permanent fix for {{product_area}}, here is a workaround
that will unblock you:

{{workaround_steps}}

I've flagged your account to notify you when the full fix ships. Is there
anything else I can help with in the meantime?

Best,
{{agent_name}}
```

**Actions:** Apply "workaround-provided" tag. Add to notification list for fix release.

---

### Resolution - known issue, linked to status page

```
Hi {{customer_name}},

The {{product_area}} issue you reported is a known incident we are actively
working to resolve. You can track live updates here: {{link}}

I'll also send you a direct notification as soon as it's resolved. No action
is needed on your end.

{{agent_name}}
```

**Actions:** Apply "known-incident" tag. Subscribe customer to status page updates.

---

## Closure templates

### Closing - no response from customer (7 days)

```
Hi {{customer_name}},

I'm closing this ticket since we haven't heard back. No worries - if you still
need help with {{product_area}}, just reply to this thread and it will reopen
automatically. We're here whenever you need us.

Best,
{{agent_name}}
```

**Actions:** Set status to "Solved". Apply "auto-closed-no-response" tag.

---

### Closing - duplicate ticket

```
Hi {{customer_name}},

I've merged this ticket with {{ticket_id}}, where we are already working on
your {{product_area}} issue. All updates will come through on that thread.

Thanks,
{{agent_name}}
```

**Actions:** Set status to "Closed". Apply "duplicate" tag. Link to primary ticket.

---

### Closing - feature request logged

```
Hi {{customer_name}},

Thanks for the suggestion about {{feature_description}}. I've logged this as a
feature request with our product team - your feedback directly influences our roadmap.

I don't have a timeline to share right now, but I've tagged your account so
you'll be among the first to know if we build this.

Is there anything else I can help with?

Best,
{{agent_name}}
```

**Actions:** Set status to "Solved". Apply "feature-request" tag. Log in product tracker.

---

## VIP and escalation templates

### VIP - acknowledgment with named CSM

```
Hi {{customer_name}},

Thank you for reaching out. I'm {{agent_name}}, and I'm personally handling your
request about {{product_area}}.

I've also looped in {{csm_name}}, your dedicated Customer Success Manager, who
is copied on this thread.

I'm treating this as a top priority and will have an update for you within
{{timeframe}}.

{{agent_name}}
```

**Actions:** Apply "VIP" tag. CC CSM. Set P1 priority. Route to VIP queue.

---

### Escalation received - enterprise path

```
Hi {{customer_name}},

I'm {{agent_name}} from our Enterprise Support team. I've received the escalation
on your {{product_area}} issue and I'm taking ownership now.

I've reviewed the full context from {{previous_agent_name}} and you won't need
to repeat anything.

I'll have a detailed update for you within {{timeframe}}.

{{agent_name}}
Senior Support Engineer
```

**Actions:** Assign to enterprise queue. Add escalation note. Notify CSM.

---

## Macro maintenance schedule

| Action | Frequency | Owner |
|---|---|---|
| Review macro usage metrics | Monthly | Support ops lead |
| Update macros with product changes | Every release | Support ops + product |
| Retire macros with < 2% usage rate after 90 days | Quarterly | Support ops lead |
| Audit tone and personalization compliance | Quarterly | Support manager |
| Add macros for emerging ticket patterns | As needed | Senior agents propose, ops approves |
