<!-- Part of the lead-scoring AbsolutelySkilled skill. Load this file when
     building or comparing scoring models for a specific GTM motion (SaaS B2B,
     PLG, or enterprise). Contains full attribute tables and threshold guidance. -->

# Scoring Models - Example Reference

Three complete scoring model templates for the most common B2B GTM motions.
Each model uses a 0-100 scale split between a fit sub-score (0-50) and a
behavioral sub-score (0-50). Thresholds and attribute weights should be
validated against your own closed-won data before deploying to live pipeline.

---

## Model 1: SaaS B2B (Sales-Led, SMB/Mid-Market)

**Target motion:** Inside sales team, ACV $10K-$100K, 14-60 day sales cycle.
The model prioritizes company fit and buying-intent signals. A single demo
request from a fit company should immediately route to SDR.

### Fit Sub-Score (0-50)

| Attribute | Criteria | Points |
|---|---|---|
| Industry vertical | Exact ICP industry | +15 |
| | Adjacent industry | +8 |
| | Outside ICP | 0 |
| Company size (employees) | 50-500 (core ICP) | +12 |
| | 501-2000 (upmarket stretch) | +7 |
| | 10-49 (downmarket) | +4 |
| | <10 or >2000 | 0 |
| Job title / seniority | VP or C-level economic buyer | +10 |
| | Director or Manager (champion) | +7 |
| | Individual contributor | +3 |
| | Unknown or irrelevant | 0 |
| Technographic signal | Uses key integration partner tech | +8 |
| | Uses complementary tool category | +4 |
| Funding stage | Series A-C (actively investing) | +5 |
| | Bootstrapped with revenue signals | +3 |
| | Pre-seed / pre-revenue | 0 |
| Geography | Primary target region | 0 (no bonus needed) |
| | Excluded region | -20 (hard disqualify) |

**Fit score disqualifiers (set score to 0, remove from scoring):**
- Competitor employee domain
- Industry on exclusion list (e.g., regulated vertical you cannot serve)
- Company size below minimum viable deal threshold

### Behavioral Sub-Score (0-50)

| Action | Points | Decay Rate |
|---|---|---|
| Demo request (form submit) | +30 | No decay - route immediately |
| Pricing page visit | +20 | -3 pts/week inactive |
| Free trial sign-up | +25 | -2 pts/week inactive |
| ROI calculator completion | +18 | -2 pts/week inactive |
| Case study download (gated) | +10 | -2 pts/week inactive |
| Webinar registered + attended | +10 | -2 pts/week inactive |
| Webinar registered, no-show | +3 | -1 pt/week inactive |
| Product comparison page visit | +12 | -3 pts/week inactive |
| Email click (3+ in 7 days) | +8 | -1 pt/week inactive |
| Email click (1 in 7 days) | +3 | -1 pt/week inactive |
| Blog visit (multiple in session) | +4 | -1 pt/week inactive |
| Blog visit (single) | +2 | -1 pt/week inactive |
| Third-party intent surge (Bombora) | +8 | -2 pts/week if no first-party |
| Unsubscribe | -15 | Permanent |
| Competitor email domain | -10 | Permanent |
| Demo no-show (no reschedule) | -10 | Permanent until re-engagement |

### Thresholds

```
MQL:  Fit >= 25 AND Behavioral >= 20  (total >= 45)
SAL:  Sales accepts MQL within 24 hours
SQL:  Discovery call completed, BANT criteria confirmed
```

**Score bands:**
```
80-100  Hot - route to AE immediately
60-79   Warm - SDR outreach within 4 hours
45-59   MQL - SDR outreach within 24 hours
25-44   Nurture - marketing automation sequences
0-24    Cold - top-of-funnel content only
```

---

## Model 2: PLG (Product-Led Growth)

**Target motion:** Free tier or trial converts to paid. Sales-assist layer for
accounts showing expansion signals. ACV $2K-$30K, touch-less or low-touch.

In a PLG model, the Product Qualified Lead (PQL) replaces the traditional MQL.
A PQL is a user or account that has reached a product activation milestone
predicting conversion - not just a content consumer.

### Fit Sub-Score (0-50)

Same firmographic structure as Model 1, but company size skews smaller:

| Attribute | Criteria | Points |
|---|---|---|
| Company size | 10-200 (PLG sweet spot) | +15 |
| | 201-1000 (expansion candidate) | +10 |
| | 1-9 (solo/micro) | +5 |
| | >1000 (enterprise, different motion) | +3 |
| Job title | Developer / technical user (builds with product) | +12 |
| | Manager / operational buyer | +8 |
| | C-level (unusual for PLG self-serve) | +5 |
| Industry | Exact ICP | +15 |
| | Adjacent | +8 |
| Technographic | GitHub active, AWS/GCP, modern stack | +8 |

### PQL Behavioral Sub-Score (0-50)

PQL signals are product usage events, not marketing touch events:

| Product Action | Points | Signal Meaning |
|---|---|---|
| Invited second user to workspace | +25 | Collaboration intent = retention signal |
| Completed activation milestone | +20 | Reached "aha moment" - varies by product |
| Integrated with core work tool | +20 | Embedded in workflow - high switching cost |
| Used product 5+ days in first 14 | +15 | Habitual usage pattern forming |
| Created 3+ projects / workspaces | +12 | Expanding scope of use |
| Exported or shared output externally | +10 | Value realization, evangelism potential |
| Viewed upgrade/pricing page in-app | +18 | Active evaluation of paid plan |
| Reached usage limit (shown paywall) | +15 | Natural conversion trigger |
| Onboarding completed (100%) | +8 | Setup investment made |
| Logged in 0 days in first 7 days | -10 | Early churn risk |
| Deleted workspace or data | -20 | Strong disengagement signal |

**Activation milestone (define per product):**
```
Example for a project management tool:
  Milestone = Created first project + added a collaborator + completed a task
  Until milestone is hit, behavioral score is capped at 15 regardless of visits.
```

### PQL Thresholds

```
PQL:  Fit >= 20 AND Product behavioral >= 30 (total >= 50)
Sales-assist trigger: Account has 3+ users OR Fit >= 35 AND PQL score >= 50
Enterprise flag: Company size > 500 employees, auto-route to enterprise AE
```

**Score-based action map:**
```
50-100  PQL - Sales-assist outreach (in-product + email)
35-49   Active user - Trigger upgrade campaign sequence
20-34   Engaged - Onboarding nudges, feature discovery emails
0-19    At-risk - Re-engagement sequence or suppress
```

---

## Model 3: Enterprise (Field Sales, ABM)

**Target motion:** Account-Based Marketing (ABM), enterprise deals $100K+ ACV,
6-18 month sales cycle, multiple stakeholders. Scoring operates at the account
level (account score), not individual contact level.

In enterprise ABM, the unit of measurement is the buying committee. An account
qualifies when enough of the buying committee is engaged, not just one contact.

### Account Fit Score (0-50)

| Attribute | Criteria | Points |
|---|---|---|
| Company size (employees) | 1000-10000 (mid-enterprise) | +15 |
| | 10000+ (large enterprise) | +12 |
| | 500-999 (upper mid-market) | +8 |
| Annual revenue | $100M-$1B | +12 |
| | $1B+ | +10 |
| | $50M-$99M | +6 |
| Industry vertical | Tier 1 ICP industry | +15 |
| | Tier 2 adjacent | +8 |
| Technographic fit | Key enterprise tech stack signals | +8 |
| Strategic priority | On named target account list | +10 |
| Executive relationship | Existing exec contact/intro | +8 |
| Prior engagement | Past opportunity (lost or expired) | +5 |

### Account Engagement Score (0-50)

Enterprise behavioral scoring tracks the buying committee collectively:

| Signal | Points | Notes |
|---|---|---|
| Economic buyer engaged (VP/C-level activity) | +20 | Strongest signal in enterprise |
| Champion identified (internal advocate) | +15 | Confirmed via sales discovery |
| 3+ contacts from same account active | +15 | Buying committee breadth |
| Executive attended event or briefing | +12 | High-effort, high-intent signal |
| RFP or security review initiated | +25 | Late-stage, legal motion started |
| Procurement team engaged | +20 | Budget allocation confirmed |
| Competitive evaluation confirmed | +10 | Active deal, not just research |
| Second-party intent: integration install | +12 | Technical validation begun |
| Third-party intent surge (enterprise category) | +8 | Category research confirmed |
| Champion changed roles or left | -15 | Re-qualification needed |
| Decision deferred to next fiscal year | -10 | Recycle to long-nurture |
| Legal/security block identified | -5 | Obstacle, not disqualifier |

### Account Thresholds

```
Tier 1 (Hot): Fit >= 35 AND Engagement >= 30 - AE + SDR coordinated outreach
Tier 2 (Active): Fit >= 25 AND Engagement >= 15 - AE-led outreach, monthly touch
Tier 3 (Nurture): Fit >= 20 AND Engagement < 15 - Marketing-led ABM programs
Deprioritize: Fit < 20 - Remove from named account list
```

**Buying committee coverage model:**
```
Role               | Required for SQL | Points if engaged
-------------------|------------------|------------------
Economic Buyer     | Yes              | +20
Champion           | Yes              | +15
Technical Evaluator| Yes              | +10
Legal / Procurement| No (nice to have)| +8
End User           | No               | +5
```

> An enterprise opportunity should not advance to SQL unless an economic buyer
> is engaged. Champion enthusiasm without economic buyer access is the most
> common reason enterprise deals stall at procurement.

---

## Model Comparison Summary

| Dimension | SaaS B2B | PLG | Enterprise |
|---|---|---|---|
| Scoring unit | Contact | User/Account | Account |
| Primary fit signal | Firmographic | Firmographic + technographic | Strategic account list |
| Primary intent signal | Demo/pricing request | Activation milestone | Buying committee engagement |
| MQL/PQL trigger | Fit + behavioral threshold | Product usage threshold | Account engagement threshold |
| Score decay | Yes (behavioral weekly) | Yes (usage-based, 30 days) | Partial (engagement, 60 days) |
| Typical model refresh | Quarterly | Monthly | Semi-annually |
| Validate against | Closed-won vs. closed-lost | Trial-to-paid conversion | Won enterprise deals |

---

## Recalibration Checklist

Run this checklist quarterly to keep models accurate:

```
[ ] Score last 90 days of closed-won deals - are scores above MQL threshold?
[ ] Score last 90 days of closed-lost - are scores below threshold?
[ ] Check MQL rejection rate - is it above 25%? (indicates threshold too low)
[ ] Check MQL-to-SQL conversion - is it below 50%? (recalibrate fit criteria)
[ ] Review new behavioral signals (new product features, new content assets)
[ ] Sync with sales on which leads felt right vs. wrong - collect qualitative signal
[ ] Update negative ICP list if new disqualifier patterns have emerged
[ ] Verify decay rates are not zeroing out legitimate re-engaged leads
```
