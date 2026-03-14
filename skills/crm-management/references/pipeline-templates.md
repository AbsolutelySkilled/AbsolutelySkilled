<!-- Part of the CRM Management AbsolutelySkilled skill. Load this file when designing pipeline stages for SaaS, enterprise, or PLG sales motions, or when reviewing stage definitions and exit criteria. -->

# Pipeline Stage Templates

Opinionated stage templates for three common go-to-market motions. Adapt to your
sales cycle length and deal complexity - but always preserve the principle: every
stage represents a verifiable buyer decision, not a rep activity.

---

## How to use these templates

1. Pick the template that matches your primary sales motion
2. Review exit criteria with your sales team - they must agree that each criterion
   is genuinely observable before a stage change happens
3. Set default probability values in your CRM to match the template
4. Lock stage definitions for one full quarter before building automation on top

---

## Template 1: SaaS - Mid-Market (30-90 day sales cycle)

Target deal size: $10k - $150k ACV. Single or dual-threaded, AE-led with SDR support.

| # | Stage | Definition | Entry criteria | Exit criteria | Default probability |
|---|---|---|---|---|---|
| 1 | Prospecting | Target identified; no meaningful contact yet | Account exists in CRM; ICP criteria met | Meeting booked and confirmed | 5% |
| 2 | Discovery | Actively exploring pain, budget, and timeline with champion | First call/meeting completed | Discovery call notes complete; pain and success criteria documented | 15% |
| 3 | Demo / Evaluation | Product value demonstrated; evaluating technical and business fit | Demo held with at least one stakeholder | Demo completed; champion has shared internal feedback or next steps | 30% |
| 4 | Business Case | Champion building internal justification; economic buyer engaged | Economic buyer (EB) identified and introduced | EB has reviewed proposal or attended a meeting | 50% |
| 5 | Procurement | Legal review, security review, or commercial negotiation in progress | Mutual action plan (MAP) agreed; redline or security review initiated | Legal review complete; verbal agreement on commercial terms | 75% |
| 6 | Closed Won | Contract executed | Signed order form or MSA received | - | 100% |
| 7 | Closed Lost | Deal not progressing; buyer chose competitor or no decision | - | Loss reason entered; deal disqualified | 0% |

**Notes for mid-market SaaS:**
- Deals that stall in Discovery for more than 21 days without a next step should be reviewed or disqualified
- If a deal skips "Business Case" because the EB was on the first call, note it and move directly to Procurement
- Win rate benchmark by stage: Discovery -> Demo: 60-70%, Demo -> Business Case: 40-55%, Business Case -> Closed: 65-80%

---

## Template 2: Enterprise (90-180+ day sales cycle)

Target deal size: $150k+ ACV. Multi-threaded, multiple stakeholders, security and legal review standard.

| # | Stage | Definition | Entry criteria | Exit criteria | Default probability |
|---|---|---|---|---|---|
| 1 | Target | Strategic account identified; research underway | Account in territory plan; executive sponsor or champion identified | Intro meeting booked with champion or sponsor | 5% |
| 2 | Discovery | Exploring enterprise pain, org structure, and strategic priorities across multiple stakeholders | Multi-stakeholder discovery calls in progress | Pain validated with 2+ stakeholders; org chart mapped; budget process understood | 10% |
| 3 | Technical Evaluation | IT, security, or technical stakeholders evaluating product fit and integration requirements | Technical POC or deep-dive session scheduled | Technical requirements documented; security questionnaire submitted; integration feasibility confirmed | 25% |
| 4 | POC / Pilot | Paid or unpaid proof-of-concept underway with defined success criteria | POC agreement signed or verbal; success criteria mutually agreed and documented | POC success criteria met; executive sponsor briefed on results | 40% |
| 5 | Proposal & Business Case | Formal proposal and ROI business case delivered; procurement process initiated | Proposal sent and acknowledged by EB; formal RFP response submitted if applicable | EB has confirmed proposal is in their budget cycle; shortlisted (if competitive) | 60% |
| 6 | Negotiation | Commercial and legal terms under negotiation; legal redline in progress | MSA or order form sent to legal | Final commercial terms agreed verbally; legal review complete | 80% |
| 7 | Closed Won | Contract executed | Signed MSA and order form received | - | 100% |
| 8 | Closed Lost | Deal lost or indefinitely deferred | - | Loss reason entered; key contact flagged for future nurture | 0% |

**Notes for enterprise:**
- Never advance to Proposal before POC success criteria are defined - you'll write proposals for deals that aren't real
- "No Decision" is its own loss reason - track separately from competitive losses
- Multi-year deals: track TCV in a separate field; use ACV for quota and forecasting
- Executive sponsor engagement (VP or above) is a required field from Discovery onward
- Security review is a stage gate, not a parallel track - account for it in timeline

**MEDDIC fields to map in CRM:**

| MEDDIC component | CRM field | Type |
|---|---|---|
| Metrics | `success_metrics` | Long text |
| Economic Buyer | `economic_buyer` | Lookup to Contact |
| Decision Criteria | `decision_criteria` | Long text |
| Decision Process | `decision_process` | Long text |
| Identify Pain | `identified_pain` | Long text |
| Champion | `champion` | Lookup to Contact |

---

## Template 3: Product-Led Growth (PLG) - Self-Serve to Sales-Assisted

Target deal size: $5k - $50k ACV. Expansion from existing free/trial users; Sales assists at PQL threshold.

| # | Stage | Definition | Entry criteria | Exit criteria | Default probability |
|---|---|---|---|---|---|
| 1 | PQL - Identified | User or account has crossed product-qualified lead threshold | PQL score >= threshold (e.g., 3+ team members, 80% of free tier consumed, key feature activated) | Sales rep has reviewed account and accepted it as worth pursuing | 10% |
| 2 | Expansion Outreach | Rep has initiated contact with champion (often the admin or power user) | First outreach sent; champion identified within the account | Champion has responded and expressed interest in upgrading or expanding | 20% |
| 3 | Needs Assessment | Understanding expansion use case - more seats, higher tier, or enterprise add-ons | Discovery call with champion and/or EB completed | Use case and budget owner identified; upgrade path agreed | 40% |
| 4 | Proposal / Trial Upgrade | Proposal or trial upgrade offered; pricing shared | Pricing page visit or direct pricing conversation | Champion has shared proposal internally; or trial upgraded to paid | 60% |
| 5 | Commercial Negotiation | Volume pricing, multi-year, or enterprise contract terms under discussion | Procurement or finance stakeholder engaged | Commercial terms verbally agreed | 80% |
| 6 | Closed Won | Upgrade or expansion contract signed | Payment processed or order form signed | - | 100% |
| 7 | Closed Lost | User decided to stay on free tier or chose another tool | - | Loss reason entered | 0% |

**Notes for PLG:**
- PQL threshold should be defined in collaboration with the data/product team and revisited quarterly
- Don't open a CRM opportunity for every PQL - qualify by company size, ICP fit, and engagement depth first
- Self-serve upgrades (no sales touch) should be tracked as their own deal source ("Self-Serve") for analysis
- Expansion deals often have no formal procurement process - move faster than enterprise template
- Track product usage metrics (seats active, features used, API calls) as CRM fields synced from product analytics

**PQL scoring example:**

| Signal | Weight | Notes |
|---|---|---|
| Team invite sent (3+ members) | +25 | Strong growth intent |
| Core feature activated | +20 | Product value realized |
| Daily active usage (7 consecutive days) | +15 | Habit formed |
| Admin role assigned to user | +10 | Internal champion signal |
| 80% of free tier limit consumed | +20 | Upgrade need is real |
| Visited pricing page 2+ times | +10 | Commercial intent |

Route to sales when total PQL score >= 60 AND company size >= 20 employees.

---

## Stage count guidelines

| Sales motion | Recommended active stages | Warning sign |
|---|---|---|
| SMB / transactional | 4-5 | > 6 stages = over-engineered |
| Mid-market SaaS | 5-6 | > 7 = reps will skip stages |
| Enterprise | 6-8 | < 5 = missing key buyer gates |
| PLG expansion | 4-5 | > 6 = too much friction for fast deals |

---

## Probability calibration

After one quarter with new stages, run this calibration check:

1. Export all Closed Won and Closed Lost deals from the quarter
2. For each stage, calculate: `actual win rate = (deals that were Won) / (all deals that passed through this stage)`
3. Compare actual win rate to the default probability set in the template
4. Adjust default probabilities to match observed reality - not aspirational targets

If actual win rates are consistently below default probabilities, reps are advancing
deals too early (optimism bias). If consistently above, stages may be too conservative
or deals are being added to the pipeline too late.
