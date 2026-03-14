<!-- Part of the Email Deliverability AbsolutelySkilled skill. Load this file when
     planning an IP or domain warm-up, recovering from reputation damage, or
     handling blocklist delisting. -->

# Warm-up and Reputation Reference

Detailed warm-up schedules for different volume tiers, reputation monitoring
playbooks, and blocklist delisting procedures.

---

## 1. IP warm-up schedules

### Why warm-up matters

Mailbox providers track sender reputation per IP and per domain. A new IP has
zero history - providers treat it as suspicious by default. Warm-up builds a
track record of legitimate sending behavior. Skipping warm-up is the most
common cause of deliverability failure for new senders.

### Low volume (target: < 25K emails/day)

| Day | Daily volume | Notes |
|---|---|---|
| 1-3 | 50 | Most engaged recipients only (opened in last 14 days) |
| 4-7 | 100-200 | Expand to opened in last 30 days |
| 8-14 | 500-1,000 | Expand to opened in last 60 days |
| 15-21 | 2,000-5,000 | Expand to opened in last 90 days |
| 22-28 | 10,000-25,000 | Full active list |

### Medium volume (target: 25K-100K emails/day)

| Day | Daily volume | Notes |
|---|---|---|
| 1-3 | 100 | Most engaged only |
| 4-7 | 500 | Opened in last 30 days |
| 8-14 | 2,000-5,000 | Opened in last 60 days |
| 15-21 | 10,000-25,000 | Opened in last 90 days |
| 22-35 | 25,000-100,000 | Gradually include full list |

### High volume (target: 100K+ emails/day)

| Day | Daily volume | Notes |
|---|---|---|
| 1-3 | 200 | Most engaged only |
| 4-7 | 1,000-2,000 | Opened in last 30 days |
| 8-14 | 5,000-15,000 | Opened in last 60 days |
| 15-28 | 15,000-75,000 | Opened in last 90 days |
| 29-42 | 75,000-250,000+ | Full list, increase 25-50% per day |

> High-volume senders should warm up over 6 weeks, not 4. The stakes are
> higher and recovery from a failed warm-up takes longer.

### Warm-up rules (all tiers)

1. **Start with your most engaged recipients** - high open rates prove to
   providers that people want your mail
2. **Send at consistent times** - same time each day, same days each week
3. **Do not skip days** - gaps in sending reset the trust you have built
4. **Monitor daily:**
   - Hard bounce rate must stay under 2%
   - Complaint rate must stay under 0.1%
   - If either threshold is exceeded, pause for 24h, clean list, resume
     at the previous day's volume
5. **Separate streams** - warm up transactional and marketing IPs independently
6. **Avoid weekends initially** - some providers have stricter weekend filtering

### Domain warm-up

Domain reputation is increasingly more important than IP reputation (especially
for Gmail). When warming a new sending domain:

- The domain warm-up schedule mirrors the IP warm-up schedule above
- Subdomains inherit partial reputation from the parent domain
- Use subdomains to isolate streams: `transactional.example.com`,
  `marketing.example.com`, `notifications.example.com`
- Each subdomain needs its own SPF, DKIM, and DMARC configuration

---

## 2. Reputation monitoring

### Provider-specific tools

**Google Postmaster Tools (Gmail):**
- URL: https://postmaster.google.com
- Shows: domain reputation (High/Medium/Low/Bad), spam rate, authentication
  results, encryption percentage, delivery errors
- Requires DNS TXT verification of domain ownership
- Data appears only for domains sending > ~200 messages/day to Gmail
- Domain reputation levels:
  - High: good standing, mail delivered to inbox
  - Medium: some filtering, watch for decline
  - Low: significant filtering, investigate immediately
  - Bad: most mail going to spam, urgent action needed

**Microsoft SNDS (Outlook/Hotmail):**
- URL: https://sendersupport.olc.protection.outlook.com/snds/
- Shows: IP reputation (Green/Yellow/Red), complaint rate, spam trap hits
- Requires IP ownership verification
- Data is per-IP, not per-domain

**Sender Score (Validity):**
- URL: https://senderscore.org
- Third-party IP reputation score from 0-100
- Score > 80: good, 70-80: needs attention, < 70: deliverability problems

<!-- VERIFY: Sender Score thresholds are approximate industry consensus.
     Validity does not publish official threshold definitions. -->

### Key metrics dashboard

Track these metrics per sending IP and per sending domain:

| Metric | Source | Frequency | Healthy | Action trigger |
|---|---|---|---|---|
| Bounce rate | Your MTA logs | Per send | < 1% | > 2% pause and clean |
| Complaint rate | FBL reports / Postmaster Tools | Daily | < 0.05% | > 0.1% investigate |
| Spam trap hits | Blocklist monitors | Daily | 0 | Any hit: investigate source |
| Inbox placement | Seed list testing | Weekly | > 95% | < 85% full audit |
| Domain reputation | Google Postmaster Tools | Daily | High | Medium or below: investigate |
| IP reputation | Microsoft SNDS | Daily | Green | Yellow: watch; Red: act |
| Authentication rate | DMARC aggregate reports | Daily | > 99% pass | < 95%: fix auth config |

### Engagement metrics that affect reputation

Mailbox providers (especially Gmail) use engagement signals to determine inbox
placement:

| Signal | Positive | Negative |
|---|---|---|
| Opens | High open rate (> 20%) | Low open rate (< 5%) |
| Clicks | Users click links | No engagement |
| Replies | Users reply to your emails | Never any replies |
| Move to inbox | Users move from spam to inbox | Users never rescue from spam |
| Mark as spam | Rare (< 0.05%) | Frequent (> 0.1%) |
| Delete without reading | Rare | Frequent (suggests unwanted mail) |

---

## 3. Reputation recovery

### When reputation is damaged

Signs of reputation damage:
- Google Postmaster Tools shows "Low" or "Bad" domain reputation
- Inbox placement drops below 85%
- Bounce rates spike above 5%
- You appear on one or more blocklists

### Recovery playbook

**Step 1 - Stop the bleeding (Day 1):**
- Reduce sending volume to 10% of normal
- Send only to your most engaged segment (opened in last 14 days)
- Verify all authentication (SPF, DKIM, DMARC) is passing

**Step 2 - Clean your list (Days 2-3):**
- Remove all hard bounces permanently
- Suppress addresses that have not engaged in 180+ days
- Run your list through an email verification service (ZeroBounce, NeverBounce,
  BriteVerify) to catch invalid addresses and known spam traps
- Remove role-based addresses (info@, admin@, support@) unless they opted in

**Step 3 - Identify root cause (Days 3-5):**
- Review DMARC aggregate reports for authentication failures
- Check if a specific campaign or list segment caused the spike
- Look for spam trap sources (often purchased lists or scraped addresses)
- Review recent content changes that might trigger content filters

**Step 4 - Rebuild (Weeks 2-6):**
- Follow the warm-up schedule as if starting from scratch
- Send only to engaged recipients for the first 2 weeks
- Gradually expand to the full (cleaned) list
- Monitor daily - if metrics degrade, reduce volume again

**Step 5 - Prevent recurrence:**
- Implement double opt-in for all new subscribers
- Add sunset policies: auto-suppress after 90 days of no engagement
- Set up automated alerts on bounce rate, complaint rate, and reputation score
- Schedule quarterly list hygiene reviews

---

## 4. Blocklist handling

### Major blocklists

| Blocklist | Impact | Check URL |
|---|---|---|
| Spamhaus SBL | Severe - widely used by enterprise receivers | https://check.spamhaus.org |
| Spamhaus XBL | Severe - compromised hosts / botnets | https://check.spamhaus.org |
| Barracuda BRBL | Moderate - used by Barracuda appliance users | http://www.barracudacentral.org/lookups |
| SURBL | Moderate - domain-based (checks URLs in email body) | https://surbl.org/surbl-analysis |
| Spamcop | Moderate - complaint-driven | https://www.spamcop.net/bl.shtml |
| UCE Protect | Low-Moderate | https://www.uceprotect.net/en/ |

### Delisting procedures

**General process:**
1. Identify which blocklist you are on (use MXToolbox Blacklist Check)
2. Fix the underlying cause FIRST (sending to traps, compromised server, etc.)
3. Submit a delisting request through the blocklist's self-service portal
4. Wait - processing time varies from hours to days
5. Monitor to ensure you do not get relisted

**Spamhaus delisting:**
- Self-service removal: https://check.spamhaus.org (lookup your IP, follow removal link)
- Fix the issue first - Spamhaus will relist immediately if the problem persists
- SBL listings require explanation of what happened and what you changed
- XBL listings are usually automatic (compromised host) - secure the server first

**Barracuda delisting:**
- Self-service: http://www.barracudacentral.org/lookups/lookup-reputation
- Requires that your IP has no negative activity for 12+ hours before requesting
- Generally processes within 12-24 hours

### Preventing blocklisting

- Never send to purchased or scraped lists (spam traps are embedded)
- Process hard bounces immediately (repeated hits to dead addresses flag you)
- Honor unsubscribe requests within 24 hours (not the 10-day CAN-SPAM maximum)
- Monitor for compromised accounts sending spam through your infrastructure
- Use feedback loops to catch complaint spikes early
- Implement rate limiting to prevent abuse if your system allows user-generated email

---

## 5. Dedicated vs shared IP strategy

| Factor | Shared IP | Dedicated IP |
|---|---|---|
| Volume threshold | < 50K emails/month | > 50K emails/month |
| Reputation control | Shared with other senders | Fully in your control |
| Warm-up required | No (pre-warmed by ESP) | Yes (must warm up yourself) |
| Cost | Lower (included in ESP plan) | Higher (additional IP cost) |
| Risk | Neighbor's bad behavior affects you | Only your behavior matters |
| Best for | Small senders, startups | High-volume or reputation-sensitive senders |

**When to move to a dedicated IP:**
- Volume exceeds 50K emails/month consistently
- You need full control over sender reputation
- Your industry has strict deliverability requirements (finance, healthcare)
- You are experiencing deliverability issues on shared IPs despite good practices

**Multiple dedicated IPs:**
- Separate transactional mail (receipts, password resets) from marketing
- Consider separate IPs per mail stream if volume justifies it
- Each IP needs its own warm-up schedule
- PTR records must be configured for each IP (reverse DNS)
