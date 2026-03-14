<!-- Part of the partnership-strategy AbsolutelySkilled skill. Load this file when
     working with channel partner programs, deal registration, or partner portals. -->

# Channel Program Operations

## Partner portal features

A partner portal is the operational hub for channel partners. Build or buy a
portal that includes these features, ordered by priority:

### Must-have (launch with these)

1. **Deal registration** - Partners submit opportunities for approval, preventing
   channel conflict and securing their margin
2. **Content library** - Sales decks, battle cards, case studies, product sheets
3. **Training / certification** - On-demand courses with completion tracking
4. **Lead distribution** - Inbound leads routed to partners by geography or vertical
5. **Commission / margin tracker** - Real-time visibility into earned and pending payouts

### Nice-to-have (add within 6 months)

6. **Co-branded collateral generator** - Partners add their logo to approved templates
7. **Partner directory / locator** - Public-facing partner finder for end customers
8. **MDF request workflow** - Submit, approve, and track marketing fund usage
9. **Performance dashboard** - Revenue, pipeline, certification status, tier progress
10. **Community forum** - Partners share best practices and ask questions

### Portal platform options

| Platform | Best for | Price range |
|----------|----------|-------------|
| PartnerStack | SaaS, affiliate + channel hybrid | $$$ |
| Crossbeam / Reveal | Account mapping + co-selling | $$ |
| Allbound | Full PRM (partner relationship mgmt) | $$$ |
| Salesforce PRM | Enterprise, existing SF customers | $$$$ |
| Custom build | Unique workflows, full control | Varies |
| Notion / Google Sites | MVP / pilot with < 20 partners | Free-$ |

---

## Deal registration workflow

Deal registration prevents channel conflict (two partners or your direct team
competing on the same deal) and gives partners confidence to invest in selling.

### Registration flow

```
1. Partner submits deal via portal:
   - Customer name and domain
   - Opportunity size (estimated ARR)
   - Expected close date
   - Key contact at customer
   - Products / SKUs of interest

2. Auto-checks (immediate):
   - Is this customer already in another partner's pipeline? -> flag conflict
   - Is this customer already in direct sales pipeline? -> flag for review
   - Is the partner's certification current? -> block if expired

3. Partner manager reviews (within 48 hours):
   - Approve: Partner gets exclusivity for 90 days
   - Reject: Provide clear reason (duplicate, out of territory, etc.)
   - Conflict: Mediate between competing partners

4. Approved deal rules:
   - 90-day exclusivity window (extendable once by 30 days)
   - Partner must update deal status monthly or registration expires
   - If deal closes, partner receives tier-appropriate margin
   - If registration expires, deal returns to open pool
```

### Channel conflict resolution

| Scenario | Resolution |
|----------|-----------|
| Two partners register same deal within 7 days | First to register wins |
| Partner registers deal already in direct pipeline | Direct team owns; partner gets referral fee (5-10%) |
| Partner registers deal, goes silent for 60 days | Send warning at day 45; expire at day 60 |
| Customer requests a different partner | Honor customer preference; compensate original partner with referral fee |
| Partner and direct team both actively selling | Assign to partner if they registered first; assign to direct if they had prior relationship |

---

## Certification programs

### Sales certification (required for all partners)

```
Module 1: Product overview (30 min)
  - What the product does, who it's for
  - Key differentiators vs. competitors
  - Pricing and packaging

Module 2: ICP and discovery (45 min)
  - Ideal customer profile
  - Discovery questions to ask
  - Qualifying criteria (BANT / MEDDIC)

Module 3: Demo and pitch (45 min)
  - Standard demo flow
  - Handling top 5 objections
  - ROI calculator walkthrough

Module 4: Deal mechanics (30 min)
  - Deal registration process
  - Pricing and discounting guidelines
  - Order submission and provisioning

Assessment: 20-question quiz, 80% to pass
Validity: 12 months, then recertify
```

### Technical certification (required for Gold+ partners)

```
Module 1: Architecture overview (1 hour)
  - System architecture and deployment models
  - Integration points and APIs
  - Security and compliance

Module 2: Implementation hands-on (2 hours)
  - Guided lab: deploy in test environment
  - Configure core features
  - Integrate with common tools (CRM, SSO, etc.)

Module 3: Troubleshooting (1 hour)
  - Common issues and resolution steps
  - Escalation path to vendor support
  - Log analysis and diagnostics

Assessment: Hands-on lab exam (deploy + configure + troubleshoot)
Validity: 12 months
```

---

## Quarterly Business Review (QBR) template

### QBR agenda (60 minutes)

```
[0:00-0:05]  Relationship check-in
[0:05-0:15]  Performance review (metrics vs. targets)
[0:15-0:25]  Pipeline review (top 5 opportunities)
[0:25-0:35]  Joint activities review + next quarter planning
[0:35-0:45]  Product roadmap update + partner feedback
[0:45-0:55]  Action items and commitments
[0:55-0:60]  Executive alignment check
```

### QBR metrics dashboard

```
PARTNER: [Name]          TIER: [Silver/Gold/Platinum]
PERIOD: Q[X] [Year]      PARTNER MANAGER: [Name]

Revenue Performance
  Target:     $[X]
  Actual:     $[X]     ([X]% of target)
  QoQ growth: [+/- X]%
  Deals closed: [N]
  Average deal size: $[X]

Pipeline Health
  Registered deals: [N]
  Pipeline value: $[X]
  Win rate: [X]%
  Avg sales cycle: [N] days

Enablement
  Certified sales reps: [N] / [required]
  Certified technical staff: [N] / [required]
  Training hours completed: [N]

Engagement
  Deal registrations submitted: [N]
  Co-marketing activities: [N]
  Support escalations: [N]
  Portal logins (monthly avg): [N]

Tier Status
  Current: [tier]
  Next tier requirement: [what's needed]
  On track: [Yes/No]
```

---

## Partner compensation models

### Reseller margin

Partners buy at a discount and sell at list price (or their own markup):

```
Registered tier:  10-15% margin
Silver tier:      15-20% margin
Gold tier:        25-30% margin
Platinum tier:    30-40% margin

Deal registration bonus: +5% on registered deals
New logo bonus: +3% on first deal with a new customer
Multi-year bonus: +2% on 2-year deals, +5% on 3-year deals
```

### Referral fee

Partners introduce leads but don't manage the sale:

```
Qualified referral: $500-2,000 flat fee per meeting that converts to opportunity
Closed-won referral: 10-15% of first-year contract value
Recurring referral: 5-10% for duration of contract (12-24 month cap)
```

### Influence / co-sell credit

Partners assist in closing deals alongside your direct sales team:

```
Co-sell credit: 5-10% of deal value
Applied when partner provides: demo support, technical validation, or
executive introduction that materially advances the deal
Tracked via CRM field: "Partner Influenced" = Yes + partner name
```
