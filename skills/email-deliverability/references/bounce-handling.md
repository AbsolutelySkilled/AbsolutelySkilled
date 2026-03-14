<!-- Part of the Email Deliverability AbsolutelySkilled skill. Load this file when
     implementing bounce processing, feedback loop handling, suppression list
     management, or list hygiene automation. -->

# Bounce Handling Reference

Comprehensive bounce code reference, feedback loop setup per provider,
suppression list architecture, and list hygiene automation patterns.

---

## 1. SMTP bounce code reference

### Status code structure

SMTP enhanced status codes follow the format `X.Y.Z`:
- X = class (2=success, 4=temporary failure, 5=permanent failure)
- Y = subject (0=other, 1=address, 2=mailbox, 3=mail system, 4=network, 5=protocol, 7=security)
- Z = detail (specific to subject)

### Hard bounces (5xx) - remove immediately

| Code | Meaning | Action |
|---|---|---|
| 550 5.1.1 | User unknown / mailbox does not exist | Remove from list permanently |
| 550 5.1.2 | Bad destination domain | Remove - domain is invalid |
| 550 5.1.3 | Bad destination mailbox syntax | Remove - address is malformed |
| 550 5.1.10 | Null MX - domain does not accept mail | Remove permanently |
| 551 5.7.1 | Message rejected - policy (spam, blocklist) | Investigate; may need IP/domain cleanup |
| 552 5.2.2 | Mailbox full (some providers treat as permanent) | Suppress after 3 occurrences |
| 553 5.1.3 | Mailbox name invalid | Remove - address format is wrong |
| 554 5.7.1 | Blocked by recipient policy | Check blocklists, content, and reputation |
| 556 5.1.10 | Domain has null MX | Remove permanently |

### Soft bounces (4xx) - retry then suppress

| Code | Meaning | Action |
|---|---|---|
| 421 4.7.0 | Connection rate limited / too many connections | Back off, retry in 30 min |
| 450 4.2.1 | Mailbox temporarily unavailable | Retry 3x over 72h |
| 451 4.3.0 | Mail system temporarily unavailable | Retry 3x over 72h |
| 451 4.7.1 | Greylisting - try again later | Retry after 5-15 minutes |
| 452 4.2.2 | Mailbox full (temporary) | Retry 3x over 72h, suppress if persistent |
| 452 4.5.3 | Too many recipients in one message | Reduce batch size |
| 421 4.7.28 | Gmail rate limit exceeded | Back off for 1h, reduce volume |

### Block bounces - investigate immediately

| Pattern | Likely cause | Action |
|---|---|---|
| "blocked" or "blacklisted" in response | IP on a blocklist | Check Spamhaus, Barracuda, Spamcop |
| "poor reputation" | Domain or IP reputation is low | Check Google Postmaster Tools, SNDS |
| "too many complaints" | Complaint rate exceeded provider threshold | Review FBL data, clean list |
| "authentication required" or "SPF fail" | SPF/DKIM not configured for this IP | Fix authentication records |
| "DMARC policy" | Message fails DMARC and policy is reject/quarantine | Fix SPF/DKIM alignment |

---

## 2. Bounce processing architecture

### Processing pipeline

```
Incoming bounce
    |
    v
Parse DSN (Delivery Status Notification)
    |
    v
Extract: recipient, status code, diagnostic message
    |
    v
Classify: hard bounce / soft bounce / block / complaint
    |
    +-- Hard bounce --> Add to suppression list immediately
    |
    +-- Soft bounce --> Increment retry counter
    |       |
    |       +-- Retries < 3 --> Schedule retry (exponential backoff)
    |       |
    |       +-- Retries >= 3 --> Add to suppression list
    |
    +-- Block bounce --> Alert ops team, check blocklists
    |
    +-- Complaint --> Add to suppression list, flag for analysis
```

### DSN (Delivery Status Notification) parsing

Bounce messages arrive as DSNs (RFC 3464). Key fields to extract:

```
Content-Type: multipart/report; report-type=delivery-status

--boundary
Content-Type: message/delivery-status

Reporting-MTA: dns; mail.example.com
Final-Recipient: rfc822; user@recipient.com
Action: failed
Status: 5.1.1
Diagnostic-Code: smtp; 550 5.1.1 The email account does not exist
```

**Fields to extract:**
- `Final-Recipient` - the address that bounced
- `Status` - the enhanced status code (X.Y.Z)
- `Action` - `failed` (hard), `delayed` (soft), `delivered`, `relayed`
- `Diagnostic-Code` - the full SMTP response from the receiving server

### Retry strategy for soft bounces

Use exponential backoff with jitter:

| Attempt | Wait time | Notes |
|---|---|---|
| 1st retry | 30 minutes | May resolve greylisting |
| 2nd retry | 4 hours | Server outage may resolve |
| 3rd retry | 24 hours | Mailbox full may clear |
| After 3rd | Suppress | Add to soft-bounce suppression (re-evaluate in 30 days) |

Add random jitter of +/- 20% to avoid thundering herd when many bounces resolve
simultaneously.

---

## 3. Feedback loops (FBL)

Feedback loops deliver complaint notifications when a recipient marks your
email as spam. Processing FBLs is critical for maintaining reputation.

### FBL setup by provider

| Provider | FBL type | Setup URL | Format |
|---|---|---|---|
| Yahoo/AOL | Traditional FBL | https://senders.yahooinc.com/complaint-feedback-loop | ARF (RFC 5965) |
| Outlook/Hotmail | JMRP (Junk Mail Reporting Program) | https://sendersupport.olc.protection.outlook.com/snds/JMRP.aspx | ARF |
| Gmail | Postmaster Tools only | https://postmaster.google.com | Dashboard (no individual complaints) |
| Comcast | Traditional FBL | https://postmaster.comcast.net/feedback-loop.html | ARF |
| Apple (iCloud) | None publicly available | N/A | N/A |

> Gmail does not send individual complaint reports. Use Google Postmaster Tools
> to monitor aggregate spam rates. This makes Gmail the hardest to diagnose
> at the individual-message level.

### ARF (Abuse Reporting Format) parsing

FBL complaints arrive as ARF messages (RFC 5965):

```
Content-Type: multipart/report; report-type=feedback-report

--boundary
Content-Type: message/feedback-report

Feedback-Type: abuse
User-Agent: Yahoo!-Mail-Feedback/2.0
Version: 1
Original-Mail-From: bounce@example.com
Arrival-Date: Mon, 14 Mar 2026 10:00:00 -0700
Source-IP: 203.0.113.5
```

**Fields to extract:**
- `Feedback-Type` - usually `abuse` (spam complaint)
- `Original-Mail-From` - your bounce/envelope sender
- `Source-IP` - your sending IP
- The third MIME part contains the original message (extract recipient address)

### FBL processing rules

1. Immediately add the complainant to your suppression list
2. Never send to a complainant again - ever (not even transactional)
3. Track complaint rates per campaign, list segment, and sending IP
4. If complaint rate exceeds 0.1% for any segment, investigate:
   - Was the list source legitimate (opt-in)?
   - Was the content misleading or unexpected?
   - Was the frequency too high?
5. Use List-Unsubscribe headers (RFC 8058) to give users an easy alternative
   to the spam button

---

## 4. Suppression list management

### Suppression list types

| List | Contains | Source | Duration |
|---|---|---|---|
| Hard bounce | Permanently invalid addresses | Bounce processing | Permanent |
| Complaint | Users who reported spam | FBL processing | Permanent |
| Unsubscribe | Users who opted out | Unsubscribe handler | Permanent (per CAN-SPAM/GDPR) |
| Soft bounce | Temporarily failing addresses | Bounce processing | 30 days (then re-evaluate) |
| Role-based | Generic addresses (info@, admin@) | List hygiene scan | Permanent unless explicitly opted in |
| Spam trap | Known spam trap addresses | Third-party hygiene services | Permanent |

### Suppression list architecture

Requirements for a production suppression system:

1. **Global scope** - suppression list applies across ALL sending streams, campaigns,
   and systems. A complaint on marketing mail must suppress transactional mail too.
2. **Check before every send** - every outgoing message must be checked against the
   suppression list before transmission. No exceptions.
3. **Immutable hard entries** - hard bounces, complaints, and unsubscribes must
   never be removed without explicit human review and re-confirmation from the
   recipient.
4. **Audit trail** - log when each entry was added, why (bounce code, complaint,
   unsubscribe), and from which campaign.
5. **Import/export** - support bulk import from ESP migration and bulk export for
   compliance requests (GDPR right to access).

### Implementation pattern

```
Suppression Check Flow:

Before sending to recipient@example.com:
  1. Normalize email: lowercase, trim whitespace
  2. Check suppression table:
     SELECT reason, added_at FROM suppression
     WHERE email_hash = SHA256('recipient@example.com')
  3. If found -> skip send, log suppression hit
  4. If not found -> proceed with send

On bounce/complaint:
  1. Normalize email
  2. INSERT INTO suppression (email_hash, reason, source_campaign, added_at)
  3. Log event for analytics
```

> Store email hashes, not plaintext addresses, in the suppression table.
> This reduces PII exposure. Use a consistent hash function (SHA-256)
> across all systems.

---

## 5. List hygiene automation

### Automated hygiene schedule

| Task | Frequency | Method |
|---|---|---|
| Process bounces | Real-time | Automated bounce handler |
| Process FBL complaints | Real-time | Automated FBL parser |
| Remove hard bounces | Real-time | Automated on receipt |
| Re-verify soft bounces | Every 30 days | Re-send or verify via API |
| Sunset inactive subscribers | Every 90 days | Auto-suppress if no engagement in 90-180 days |
| Full list verification | Quarterly | Third-party verification service |
| Spam trap scan | Quarterly | Third-party hygiene service |

### Sunset policy

A sunset policy automatically suppresses subscribers who have not engaged
within a defined window. This is the single most impactful list hygiene measure.

**Recommended sunset thresholds:**

| Engagement window | Action |
|---|---|
| No open/click in 90 days | Move to re-engagement segment |
| No open/click in 180 days | Send final re-engagement campaign |
| No response to re-engagement | Suppress permanently |

### Re-engagement campaign template

Before suppressing inactive subscribers, send a re-engagement sequence:

1. **Email 1 (Day 0):** "We miss you" - offer value or incentive to re-engage
2. **Email 2 (Day 7):** "Last chance" - clear statement that they will be removed
3. **No response after Day 14:** Add to suppression list

> Only subscribers who open or click in the re-engagement sequence should remain
> on the active list. Passive opens (image proxy pre-fetching) do not count as
> genuine engagement - track click-throughs for reliable signal.

### Email verification services

For bulk list cleaning, use a verification service before any large send:

| Service | What it checks |
|---|---|
| ZeroBounce | Validity, spam traps, abuse emails, catch-all detection |
| NeverBounce | Real-time and bulk verification, deliverability scoring |
| BriteVerify | Syntax, domain, mailbox verification |
| Kickbox | Deliverability, risk scoring, disposable email detection |

Run verification on:
- Any list that has not been mailed in 90+ days
- Lists from acquisitions or migrations
- Before a warm-up campaign
- After any deliverability incident
