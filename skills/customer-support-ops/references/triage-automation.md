<!-- Part of the customer-support-ops AbsolutelySkilled skill. Load this file when
     building auto-triage rules, keyword detection patterns, or routing logic. -->

# Triage Automation

Auto-triage rule recipes, keyword detection patterns, and routing logic examples
for common helpdesk platforms.

---

## Auto-triage rule framework

Every auto-triage rule follows this structure:

```
Rule name:      [descriptive name]
Trigger:        [condition that activates the rule]
Actions:        [what happens when triggered]
Priority:       [rule execution order - lower number = higher priority]
Exceptions:     [when this rule should NOT fire]
```

Rules execute in priority order. First matching rule wins unless configured for
cumulative execution (all matching rules apply).

---

## Keyword detection patterns

### Priority detection keywords

**P1 - Urgent (auto-tag + alert):**

```
Keywords:  "down", "outage", "cannot access", "error 500", "503",
           "completely broken", "data loss", "security breach",
           "compromised", "all users affected", "production down"

Rule:
  IF subject OR body contains ANY of the P1 keywords
  AND ticket is from a verified customer (not spam)
  THEN:
    - Set priority to P1
    - Alert on-call support lead
    - Skip L1 queue, route directly to L2
    - Send P1 acknowledgment macro automatically
```

**P2 - High (auto-tag):**

```
Keywords:  "cannot log in", "login failed", "payment failed",
           "stuck", "blocked", "not working", "critical",
           "urgent", "broken", "affecting our team"

Rule:
  IF subject OR body contains ANY of the P2 keywords
  AND NOT already classified as P1
  THEN:
    - Set priority to P2
    - Route to front of L1 queue
```

**P4 - Low (auto-tag):**

```
Keywords:  "feature request", "suggestion", "nice to have",
           "would be cool", "wondering if", "cosmetic",
           "minor", "typo", "alignment"

Rule:
  IF subject OR body contains ANY of the P4 keywords
  AND NOT contains ANY P1 or P2 keywords
  THEN:
    - Set priority to P4
    - Route to general L1 queue
```

### Product area detection keywords

| Product area | Keywords | Tag |
|---|---|---|
| Billing | "invoice", "charge", "refund", "subscription", "payment", "billing", "plan", "upgrade", "downgrade", "cancel" | billing |
| Authentication | "login", "password", "SSO", "2FA", "MFA", "locked out", "reset password", "sign in", "authentication" | auth |
| API | "API", "endpoint", "rate limit", "webhook", "integration", "REST", "SDK", "API key", "401", "403" | api |
| Dashboard | "dashboard", "UI", "display", "layout", "page", "button", "screen", "interface" | dashboard |
| Mobile | "iOS", "Android", "mobile app", "app store", "push notification", "mobile" | mobile |
| Data | "export", "import", "CSV", "report", "analytics", "data", "metrics", "chart" | data |

---

## Routing rules

### Skill-based routing

```
Rule: Route by product area tag
Priority: 10

IF ticket has tag "billing"
  THEN assign to billing-support group

IF ticket has tag "api"
  THEN assign to api-support group

IF ticket has tag "auth"
  THEN assign to auth-support group

IF ticket has no product area tag
  THEN assign to general-support group
```

### Customer tier routing

```
Rule: VIP routing
Priority: 5 (runs before skill-based routing)

IF customer is on Enterprise plan
  OR customer is in VIP account list
  THEN:
    - Add "priority-support" tag
    - Apply Enterprise SLA policy
    - Route to senior-agents group
    - Notify assigned account manager
```

### Language-based routing

```
Rule: Non-English routing
Priority: 3 (runs before all other routing)

IF detected language is NOT English
  THEN:
    - Add language tag (e.g., "lang-es", "lang-fr", "lang-ja")
    - Route to corresponding language support group
    - IF no language group exists, route to general with "needs-translation" tag
```

### Load-balanced assignment within groups

```
Rule: Fair assignment
Priority: 20 (runs after routing determines the group)

Within the assigned group:
  1. Filter to agents who are online and not at capacity
  2. Sort by number of open assigned tickets (ascending)
  3. Assign to agent with fewest open tickets
  4. IF tie, assign to agent who has been idle longest
```

---

## Auto-response rules

### Business hours auto-response

```
Rule: After-hours acknowledgment
Trigger: Ticket created outside business hours

Response:
  "Hi {{customer_name}},

  Thanks for reaching out. Our support team is currently offline and will
  be back at [next business hours start time] [timezone].

  Your ticket (#{{ticket_id}}) has been logged and you'll hear from us
  as soon as we're back. If this is an emergency affecting your production
  service, please email [emergency-email] or call [emergency-phone].

  Best,
  [Company] Support"

Actions:
  - Send auto-response
  - Do NOT start SLA clock until business hours begin (unless P1)
```

### Duplicate detection

```
Rule: Potential duplicate
Trigger: Same customer email + similar subject within 24 hours

Actions:
  - Flag as potential duplicate
  - Link to the most recent open ticket from same customer
  - Do NOT auto-merge (agent reviews and decides)
  - Add internal note: "Potential duplicate of #[ticket_id]"
```

### Auto-close inactive tickets

```
Rule: Inactivity auto-close
Trigger: Status is "Waiting on Customer" for 7+ days

Actions:
  Day 5:  Send check-in macro ("Just checking in...")
  Day 7:  Send closing macro ("I'm closing this ticket...")
  Day 7:  Set status to "Solved"
  Day 7:  Add "auto-closed" tag
  Day 7:  Pause - customer reply within 48 hours reopens automatically
```

---

## Spam and abuse filtering

### Spam detection rules

```
Rule: Spam filter
Priority: 1 (runs first)

IF sender is on blocklist
  OR subject matches known spam patterns (regex library below)
  OR body contains > 5 URLs and no product-related keywords
  OR sender domain is in disposable email list
  THEN:
    - Move to spam queue (do NOT delete)
    - Do NOT send auto-response
    - Do NOT start SLA clock
    - Weekly review of spam queue for false positives
```

**Common spam patterns (regex):**

```
/\b(buy now|limited offer|act fast|congratulations you won)\b/i
/\b(SEO services|web design services|marketing services)\b/i
/(click here|unsubscribe).*(http[s]?:\/\/(?!yourdomain\.com))/i
```

### Abusive language detection

```
Rule: Abusive content flag
Priority: 2

IF body contains profanity or threatening language
  THEN:
    - Add "review-required" tag
    - Route to team lead queue
    - Do NOT auto-respond
    - Agent responds with empathy-first approach
    - If threats of violence: escalate to management + legal immediately
```

---

## Rule testing and maintenance

### Before deploying a new rule

1. Run the rule against the last 30 days of tickets in dry-run mode
2. Check for false positives (tickets that would be incorrectly tagged/routed)
3. Check for false negatives (tickets the rule should have caught but did not)
4. Target: < 5% false positive rate, < 10% false negative rate
5. Get sign-off from support lead before enabling

### Monthly rule review

| Check | Action |
|---|---|
| Rules with 0 triggers in 30 days | Evaluate: is the pattern obsolete? Remove or update |
| Rules with > 10% false positive rate | Tighten keyword patterns or add exceptions |
| New ticket categories not covered by rules | Create new auto-triage rules |
| Keyword list freshness | Add new product names, features, error messages |
| Customer tier list accuracy | Sync with CRM data |
