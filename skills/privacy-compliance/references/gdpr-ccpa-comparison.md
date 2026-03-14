<!-- Part of the Privacy Compliance AbsolutelySkilled skill. Load this file when conducting a deep regulatory comparison between GDPR and CCPA/CPRA requirements, or when advising on multi-jurisdiction compliance obligations. -->

# GDPR vs CCPA/CPRA - Side-by-Side Comparison

> **Disclaimer:** This is engineering and product implementation reference material,
> not legal advice. Regulations evolve; verify current requirements with qualified
> legal counsel before making compliance decisions.

---

## 1. Applicability and Scope

| Dimension | GDPR | CCPA / CPRA |
|---|---|---|
| Full name | General Data Protection Regulation (EU) 2016/679 | California Consumer Privacy Act (2018) as amended by California Privacy Rights Act (2020), effective Jan 2023 |
| Effective date | May 25, 2018 | CCPA: Jan 1, 2020 / CPRA amendments: Jan 1, 2023 |
| Jurisdiction | European Union + European Economic Area (EEA) | California, USA |
| Who it applies to | Any organization processing personal data of EU/EEA residents, regardless of where the org is located | For-profit businesses meeting at least one threshold (see below) that collect CA residents' personal information |
| Applicability thresholds | No revenue threshold; applies to any controller/processor | Annual gross revenue >$25M; OR buys/sells/receives/shares PI of 100,000+ CA consumers/households per year; OR derives 50%+ of revenue from selling/sharing PI |
| Territorial reach | Extraterritorial - applies to non-EU businesses offering goods/services to EU residents or monitoring their behavior | Extraterritorial within the US - applies to businesses wherever located that serve CA residents |
| Enforcement authority | National Data Protection Authorities (DPAs) in each member state + EDPB for cross-border cases | California Privacy Protection Agency (CPPA) + California AG |

---

## 2. Key Definitions

| Term | GDPR | CCPA/CPRA |
|---|---|---|
| Personal data / information | Any information relating to an identified or identifiable natural person | Information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked to a particular consumer or household |
| Sensitive data | "Special categories": race/ethnicity, political opinions, religion, trade union membership, genetic/biometric data, health, sex life/orientation | Sensitive personal information (CPRA): SSN/driver's license/passport, financial account credentials, precise geolocation, race/ethnicity, religion, union membership, mail/email/text content, genetic data, biometric data for identification, health data, sex life/orientation |
| Controller | Entity that determines purposes and means of processing | "Business" (the first party collecting data) |
| Processor | Entity processing on behalf of a controller | "Service provider" (under CCPA contract) |
| Third party | Any recipient not a controller or processor | Any entity that receives PI not as a service provider or contractor |
| Sale | Not specifically defined as a distinct category | Selling or renting PI for monetary or other valuable consideration; CPRA adds "sharing" (for cross-context behavioral advertising even without money) |
| Data subject | Natural person whose data is processed | "Consumer" (California resident) |

---

## 3. Individual Rights Comparison

| Right | GDPR Article | GDPR Requirements | CCPA/CPRA | CCPA/CPRA Requirements |
|---|---|---|---|---|
| Right to know / access | Art. 15 | Copy of personal data + supplementary info (purposes, categories, recipients, retention, rights) | Yes | Categories and specific pieces of PI collected, purposes, third parties disclosed to, sources |
| Right to correction / rectification | Art. 16 | Rectify inaccurate personal data without undue delay | CPRA only | Correct inaccurate PI; instruct service providers and contractors to correct |
| Right to erasure | Art. 17 | Erase personal data when: no longer needed, consent withdrawn, unlawful processing, legal obligation | Yes | Delete PI collected from consumer; direct service providers to delete |
| Right to portability | Art. 20 | Receive PI in structured, commonly used, machine-readable format; transmit to another controller | Yes | Receive specific pieces of PI in portable, readily usable format allowing transmission to another entity |
| Right to restriction | Art. 18 | Restrict processing during disputes about accuracy, lawfulness, or objection | No equivalent | No direct equivalent |
| Right to object | Art. 21 | Object to processing for direct marketing (absolute), legitimate interests (balancing test), profiling | Opt-out of sale/sharing | Opt-out of sale and sharing of PI; opt-out of cross-context behavioral advertising |
| Automated decision-making | Art. 22 | Right not to be subject to solely automated decisions with significant effects; human review option required | No direct equivalent | No direct equivalent under CCPA/CPRA |
| Limit sensitive PI use | No direct equivalent | Broader consent/LI framework covers sensitive categories | CPRA only | Right to limit use and disclosure of sensitive PI to what is necessary for the requested purpose |
| Non-discrimination | No direct equivalent | Proportionality and fairness principles apply | Yes | Cannot deny goods/services, charge different price, or provide different quality for exercising rights |

---

## 4. Response Deadlines and Verification

| Aspect | GDPR | CCPA/CPRA |
|---|---|---|
| Initial response deadline | 30 days from receipt | 45 days from receipt |
| Extension allowed | Yes - additional 60 days (total 90 days) with notice within initial period | Yes - additional 45 days (total 90 days) with notice within initial period |
| Identity verification | Required; cannot ask for more info than needed to verify | Required; cannot require account creation; must accept requests online, by toll-free number, or by mail |
| Verification standard | Reasonable measures to confirm identity; higher bar for sensitive data requests | Reasonably verify identity; for household requests, additional precautions required |
| No-charge rule | Generally free; can charge reasonable fee for manifestly unfounded/excessive requests | Free; can charge if requests are excessive, repetitive, or manifestly unfounded (but must inform first) |
| Denial | Can deny if manifestly unfounded, excessive, or third-party rights affected | Can deny if cannot verify, if request is excessive/repetitive; must explain why and provide appeals process |
| Appeals process | Complaint to supervisory authority | CPRA: businesses must have an appeals process; notify CPPA of appeal decisions |

---

## 5. Consent Requirements

| Aspect | GDPR | CCPA/CPRA |
|---|---|---|
| Consent required for all processing? | No - only where consent is the chosen lawful basis | No - CCPA does not require consent as a general condition; requires opt-out rights |
| Consent standard | Freely given, specific, informed, unambiguous; affirmative action required; no bundling | Opt-in required for: (a) selling/sharing PI of minors under 13; (b) sensitive PI use beyond necessary purpose (CPRA) |
| Pre-ticked boxes | Explicitly prohibited | Not defined; opt-in standard applies where consent required |
| Withdrawing consent | Must be as easy as giving it; controller must cease processing on withdrawal | Opt-out mechanism must be at least as easy as opting in |
| Consent for children | Parental consent required for under-16 (member states may lower to 13) | Parental consent required for under-13; opt-in required from 13-15 for sale/sharing |
| Consent records | Must be able to demonstrate consent was given (timestamp, version, signal) | No explicit record-keeping requirement, but recommended for defense |
| Global Privacy Control (GPC) | Not specifically addressed (some DPAs recognize it) | Must honor GPC signal as a valid opt-out of sale/sharing |

---

## 6. Notice and Transparency Obligations

| Requirement | GDPR (Art. 13/14) | CCPA/CPRA |
|---|---|---|
| At time of collection notice | Mandatory: identity of controller, purposes, lawful basis, recipients, retention, rights | Mandatory: categories of PI collected, purposes, whether PI is sold/shared, retention periods, consumer rights |
| Privacy policy required | Yes - must cover all Art. 13/14 information; must be concise, transparent, intelligible | Yes - must be posted online; cover categories, purposes, rights, third-party disclosures, sale/sharing |
| Update frequency | Must reflect current practices; notify data subjects of material changes | Must update at least every 12 months; disclose the last date updated |
| Language | Plain, clear language; appropriate for audience (especially children) | Plain language requirement; must be understandable |
| "Do Not Sell or Share My Personal Information" link | No equivalent | Must post prominent link on homepage (or use opt-out preference signal) |
| "Limit the Use of My Sensitive Personal Information" link | No equivalent | CPRA: required if sensitive PI used beyond necessary purposes |
| Record of Processing Activities (RoPA) | Art. 30: required for orgs with 250+ employees or high-risk/regular processing | No RoPA equivalent; categories must be disclosed in privacy policy |

---

## 7. Data Security and Breach Notification

| Aspect | GDPR | CCPA/CPRA |
|---|---|---|
| Security obligation | Art. 32: appropriate technical and organizational measures; risk-based | Reasonable security measures; CPPA can issue regulations specifying requirements |
| Breach notification to authority | Art. 33: 72 hours to supervisory authority; not required if no risk to individuals | No notification to CPPA required (unlike GDPR to DPAs) |
| Breach notification to individuals | Art. 34: without undue delay if high risk to rights and freedoms | California data breach law (Civ. Code 1798.82): expedient time, without unreasonable delay; thresholds for encryption safe harbor |
| Private right of action | Generally no private right of action for GDPR violations (DPA enforcement) | Yes - limited private right of action for breaches of unencrypted/unredacted PI due to failure to implement reasonable security |
| Statutory damages for breach (private action) | N/A - DPA fines up to €20M or 4% global turnover | $100-$750 per consumer per incident or actual damages, whichever is greater; up to $7,500 per intentional violation |

---

## 8. Data Processor / Service Provider Obligations

| Requirement | GDPR - Processor | CCPA/CPRA - Service Provider |
|---|---|---|
| Written agreement required | Yes - Art. 28 Data Processing Agreement (DPA) mandatory | Yes - written contract required limiting use of PI to specified purposes |
| Can processor use data for own purposes? | No - must only act on controller's documented instructions | No - service provider cannot retain, use, or disclose PI for commercial purpose outside the service contract |
| Sub-processor rules | Must get controller authorization; sub-processors bound by same obligations | Contractors may engage sub-contractors; must notify business; same restrictions apply |
| Processor liability | Direct liability to DPAs for processor obligations; joint and several in some cases | Service providers can be held directly liable for CPPA enforcement in some circumstances |
| DPA required elements | Art. 28(3): 8 mandatory clauses (subject matter, duration, nature, purpose, data types, obligations/rights) | Contract must prohibit: retaining/using/disclosing PI outside the service; selling/sharing PI; combining PI with other sources in prohibited ways |

---

## 9. Enforcement and Penalties

| Aspect | GDPR | CCPA/CPRA |
|---|---|---|
| Enforcement body | National DPAs (e.g., CNIL in France, ICO in UK, BfDI in Germany); EDPB for cross-border | California Privacy Protection Agency (CPPA) + California AG (until July 2023, then CPPA primary) |
| Administrative fines - lower tier | Up to €10M or 2% of global annual turnover (processor obligations, consent, child data) | Up to $2,500 per unintentional violation |
| Administrative fines - upper tier | Up to €20M or 4% of global annual turnover (principles, rights, transfers) | Up to $7,500 per intentional violation or violation involving minor's data |
| Private right of action | No (some member state laws differ) | Yes - for data breaches only; $100-$750 per consumer or actual damages |
| Cure period | No statutory cure period (DPAs have discretion) | CPRA removed the 30-day cure period that existed under CCPA (as of Jan 2023) |
| Class actions | Not applicable under GDPR itself | Possible under CA private right of action for breach claims |

---

## 10. Cross-Border Data Transfers

| Mechanism | GDPR | CCPA/CPRA |
|---|---|---|
| Requirement | Transfers to non-adequate countries require a transfer mechanism | No equivalent transfer restriction; applies based on where consumer resides, not where data is stored |
| Adequacy decisions | EC publishes list of adequate countries; transfers to these are permitted without additional mechanism | N/A |
| Standard Contractual Clauses (SCCs) | 2021 SCCs: Module 1 (C2C), Module 2 (C2P), Module 3 (P2C), Module 4 (P2P) | N/A |
| Binding Corporate Rules (BCRs) | Intra-group transfers; requires DPA approval; Controller BCRs and Processor BCRs | N/A |
| Derogations | Art. 49: explicit consent, contract performance, important public interest, legal claims, vital interests | N/A |
| Transfer Impact Assessment (TIA) | Required as part of SCC implementation for transfers to high-risk countries (post-Schrems II) | N/A |

---

## 11. Special Categories / Sensitive Data

| Category | GDPR Art. 9 prohibition + exceptions | CCPA/CPRA sensitive PI treatment |
|---|---|---|
| Race or ethnic origin | Prohibited unless: explicit consent, vital interests, legal claims, public interest/research | Sensitive PI; right to limit use; must disclose if collected |
| Political opinions | Prohibited unless: explicit consent, political activity by member, public data | Sensitive PI (CPRA) |
| Religious or philosophical beliefs | Prohibited unless: explicit consent, vital interests, legal claims, public interest | Sensitive PI (CPRA) |
| Trade union membership | Prohibited unless: explicit consent, employment law obligations, legal claims | Sensitive PI (CPRA) |
| Genetic data | Prohibited unless: explicit consent, medical diagnosis/treatment, public health, research | Sensitive PI (CPRA) |
| Biometric data for identification | Prohibited unless: explicit consent, employment/social security law, vital interests, public interest | Sensitive PI (CPRA); right to limit use |
| Health data | Prohibited unless: explicit consent, vital interests, medical diagnosis/treatment, public health, research | Sensitive PI (CPRA); right to limit use |
| Sex life or sexual orientation | Prohibited unless: explicit consent, vital interests, legal claims | Sensitive PI (CPRA) |
| Precise geolocation | Not a special category under GDPR (but high-risk for DPIA purposes) | Sensitive PI (CPRA): within 1/8 mile radius |
| Financial account credentials | Not a special category under GDPR | Sensitive PI (CPRA): account log-in, debit/credit card number in combination with required credentials |

---

## 12. Quick Reference - Compliance Checklist Differences

| Item | GDPR | CCPA/CPRA |
|---|---|---|
| Appoint DPO | Required if: large-scale systematic monitoring, large-scale special category processing, or public authority | No equivalent; optional Chief Privacy Officer |
| Record of Processing Activities | Required (Art. 30) for most controllers | Not required; privacy policy disclosures serve similar purpose |
| DPIA | Required for high-risk processing (Art. 35) | No statutory equivalent; recommended as best practice |
| Privacy by design | Legally mandated (Art. 25) | Not explicitly required; reasonable security standard implies it |
| Consent withdrawal mechanism | Legally required | Required for sale/sharing opt-out; GPC must be honored |
| Data breach notification deadline | 72 hours to DPA | No DPA notification; CA breach law: expedient/without unreasonable delay |
| Cross-border transfer mechanism | Required | Not applicable |
| "Do Not Sell" link | Not applicable | Required if selling or sharing PI |
