<!-- Part of the Cloud Security AbsolutelySkilled skill. Load this file when preparing for SOC 2, HIPAA, or PCI-DSS compliance, or when comparing the controls required across these frameworks. -->

# Compliance Frameworks: SOC 2, HIPAA, PCI-DSS

A side-by-side reference for the three most common compliance frameworks
engineering teams encounter. Each section covers what the framework is, who it
applies to, the core control areas, and the evidence typically required during
an audit.

---

## 1. Framework Overview

| Attribute | SOC 2 | HIPAA | PCI-DSS |
|---|---|---|---|
| Governing body | AICPA | U.S. Dept. of Health & Human Services | PCI Security Standards Council |
| Primary audience | SaaS and service providers | Healthcare organizations and their business associates | Any entity that stores, processes, or transmits cardholder data |
| Data protected | Customer data (defined by scope) | Protected Health Information (PHI) | Cardholder data: PAN, CVV, expiry, name |
| Audit type | Third-party CPA attestation (Type I: design, Type II: operating effectiveness) | Self-attestation + OCR enforcement; no mandatory third-party audit | Self-assessment (SAQ) or Qualified Security Assessor (QSA) audit |
| Frequency | Annual audit for Type II | Ongoing; risk assessments at least annually | Annual assessment; quarterly scans |
| Penalties | Contractual; reputational | Civil: up to $1.9M per violation category per year; Criminal: up to $250K + jail | Fines from card brands ($5K-$100K/month); loss of card processing privileges |

---

## 2. SOC 2

### What it is

SOC 2 is a voluntary framework for service organizations that store or process
customer data. It is structured around five Trust Service Criteria (TSC):
Security (required), Availability, Processing Integrity, Confidentiality, and
Privacy. Most audits focus on Security and Availability.

A **Type I** report attests that controls are *designed* correctly as of a
point in time. A **Type II** report attests that controls *operated effectively*
over a period (typically 6-12 months). Customers and enterprise buyers almost
always require Type II.

### Trust Service Criteria - Engineering Controls

**CC6 - Logical and Physical Access Controls**

| Control | Implementation example |
|---|---|
| CC6.1 - Restrict logical access | IAM roles with least privilege; MFA for all console users |
| CC6.2 - Register and manage user identities | Centralized identity provider (Okta, Google Workspace); automated deprovisioning on offboarding |
| CC6.3 - Remove access when no longer needed | Quarterly access reviews; automated removal of unused accounts after 90 days |
| CC6.6 - Implement logical access security measures | Encryption at rest and in transit; SSH disabled in favor of SSM/IAP |
| CC6.7 - Restrict transmission of confidential information | TLS 1.2+ on all endpoints; DLP policies for exports |
| CC6.8 - Prevent unauthorized use of software | Allowlisted third-party integrations; dependency scanning in CI |

**CC7 - System Operations**

| Control | Implementation example |
|---|---|
| CC7.1 - Detect and monitor for new vulnerabilities | Automated vulnerability scanning (Inspector, Security Command Center); weekly digest |
| CC7.2 - Monitor system components | CloudTrail + SIEM; alerts on IAM changes, failed auth spikes, SG modifications |
| CC7.3 - Evaluate security events | Incident response runbook; severity classification; 24h SLA for critical events |
| CC7.4 - Respond to incidents | Documented IR process; post-mortems for all P1 incidents |
| CC7.5 - Recover from incidents | Tested backup restoration; RTO/RPO defined and measured |

**CC8 - Change Management**

| Control | Implementation example |
|---|---|
| CC8.1 - Manage changes to infrastructure | All changes via IaC (Terraform) with PR review; no manual console changes in prod |

**A1 - Availability**

| Control | Implementation example |
|---|---|
| A1.1 - Capacity planning | Auto-scaling policies; load testing before major releases |
| A1.2 - Environmental protections | Multi-AZ deployments; automated failover |
| A1.3 - Recovery and resumption | Quarterly DR drills; backup restoration tests |

### Typical Audit Evidence

- IAM policies and role assignments (exported at audit period end)
- Access review records (spreadsheet or tool showing quarterly review completion)
- CloudTrail logs showing no direct console changes to production resources
- Terraform state and PR history showing change approval
- Incident tickets and post-mortems for the audit period
- Penetration test report (annual, from a qualified third party)
- Vendor risk assessments for critical subprocessors
- Security training completion records for all employees

---

## 3. HIPAA

### What it is

HIPAA (Health Insurance Portability and Accountability Act) protects Protected
Health Information (PHI) - any individually identifiable health information.
The **Security Rule** specifies administrative, physical, and technical
safeguards for electronic PHI (ePHI). The **Privacy Rule** governs how PHI
may be used and disclosed. A **Business Associate Agreement (BAA)** is required
with any vendor that handles PHI on your behalf (AWS, GCP, Azure, Twilio, etc.).

### Technical Safeguard Categories

**Access Control (45 CFR 164.312(a))**

| Specification | Required/Addressable | Implementation |
|---|---|---|
| Unique user identification | Required | No shared accounts; each user has a unique identity |
| Emergency access procedure | Required | Break-glass accounts documented and tested |
| Automatic logoff | Addressable | Session timeouts after inactivity (15-30 min) |
| Encryption and decryption | Addressable | Encrypt ePHI at rest with AES-256; treat as required for cloud |

**Audit Controls (45 CFR 164.312(b))**

| Requirement | Implementation |
|---|---|
| Record and examine access to ePHI | CloudTrail + application-level audit logs for every PHI access |
| Log retention | Minimum 6 years (HIPAA); align with state law (often longer) |
| Anomaly detection | Alert on unusual access patterns: bulk exports, off-hours access, new IP geolocation |

**Integrity (45 CFR 164.312(c))**

| Requirement | Implementation |
|---|---|
| Protect ePHI from improper alteration or destruction | Enable S3 versioning + Object Lock; RDS Point-in-Time Recovery |
| Mechanism to authenticate ePHI | Checksums and hash verification for data exports |

**Transmission Security (45 CFR 164.312(e))**

| Requirement | Implementation |
|---|---|
| Guard against unauthorized access during transmission | TLS 1.2+ on all endpoints; no HTTP for any ePHI-carrying traffic |
| Encryption of ePHI in transit | TLS with valid certificates; mTLS for internal service-to-service |

### Key HIPAA Engineering Rules

- **BAAs are non-negotiable**: before storing ePHI with any vendor, obtain a
  signed BAA. Major cloud providers offer BAAs (AWS HIPAA eligible services,
  GCP HIPAA Business Associate Agreement, Azure BAA).
- **Minimum necessary principle**: only access or disclose the minimum PHI
  required. Implement field-level access controls so support staff cannot see
  data they do not need.
- **Breach notification**: if ePHI is breached, you have 60 days to notify
  affected individuals and HHS. Encrypt all ePHI so that a lost device or
  leaked backup does not trigger breach notification (encryption provides a
  safe harbor).
- **Workforce training**: document annual HIPAA training completion for all
  staff with access to ePHI.

### HIPAA-Eligible AWS Services (selected)

- EC2, RDS, S3, Lambda, EKS, DynamoDB, CloudTrail, KMS, CloudWatch,
  Secrets Manager, Cognito, API Gateway. Full list: aws.amazon.com/compliance/hipaa-eligible-services-reference

---

## 4. PCI-DSS

### What it is

PCI-DSS (Payment Card Industry Data Security Standard) applies to any
organization that stores, processes, or transmits cardholder data (credit/debit
card numbers, CVV, expiry dates, cardholder names). Version 4.0 is the current
standard (effective March 2024). The scope is determined by the Cardholder Data
Environment (CDE) - ideally, minimize scope by tokenizing card data and using a
PCI-validated payment processor (Stripe, Adyen, Braintree) so your systems never
touch raw cardholder data.

### 12 Requirements Summary

| Req | Domain | Key engineering controls |
|---|---|---|
| 1 | Network security controls | Firewall rules documenting all CDE traffic; no inbound from untrusted networks; deny-all default |
| 2 | Secure configurations | Harden all system defaults; remove unnecessary services; vendor-supplied passwords changed before deployment |
| 3 | Protect stored account data | Never store CVV after authorization; encrypt PAN at rest (AES-256); mask PAN in displays (show only last 4 digits) |
| 4 | Protect data in transit | TLS 1.2+ for all cardholder data transmission; no older SSL/early TLS |
| 5 | Protect systems from malicious software | Anti-malware on all applicable systems; integrity monitoring |
| 6 | Secure systems and software | Vulnerability management program; penetration testing; secure development lifecycle; WAF required for web-facing CDE |
| 7 | Restrict access by business need | RBAC; access to CDE components restricted to those with a defined business need |
| 8 | Identify users and authenticate | Unique IDs; MFA required for all non-console CDE access (v4.0: MFA for all CDE access) |
| 9 | Restrict physical access | Physical access controls for CDE hardware; media destruction policies |
| 10 | Log and monitor all access | Audit logs for all CDE access; logs protected from modification; 12-month retention (3 months immediately available) |
| 11 | Test security regularly | Internal vulnerability scans quarterly; external scans by Approved Scanning Vendor (ASV) quarterly; annual pen test |
| 12 | Support information security | Written security policy; risk assessment annually; incident response plan tested annually |

### Scope Reduction Strategy

The single highest-leverage action for PCI compliance is **scope reduction**:

```
Option A: Tokenization via PCI-validated processor
  - Stripe/Adyen/Braintree handles card data; you receive only a token
  - Your systems never touch PAN, CVV, or track data
  - SAQ A or SAQ A-EP applies (minimal controls vs. full QSA audit)

Option B: iframe / hosted payment page
  - Card entry happens in a provider-hosted iframe
  - CDE is isolated to the payment processor
  - Reduces scope to network controls and security policies

Option C: Full CDE in isolated AWS account
  - Cardholder data in a dedicated AWS account with no peering to other workloads
  - CDE boundary clearly defined in network diagrams
  - Full SAQ D or QSA assessment required
```

### PCI-DSS v4.0 Changes (effective March 2024)

- MFA required for all access to the CDE (not just remote access)
- Targeted risk analysis required for many previously prescriptive controls
- Web application firewalls (WAFs) required for all internet-facing web applications
  in scope
- Script integrity checks required for payment pages (Subresource Integrity or CSP)
- Penetration testing methodology must include testing for business logic flaws

---

## 5. Cross-Framework Controls Matrix

Controls that satisfy requirements across all three frameworks simultaneously:

| Control | SOC 2 | HIPAA | PCI-DSS |
|---|---|---|---|
| MFA for all privileged access | CC6.1 | Access Control | Req 8 |
| Encryption at rest (AES-256) | CC6.6, CC6.7 | Technical Safeguard | Req 3 |
| TLS 1.2+ for all data in transit | CC6.7 | Transmission Security | Req 4 |
| Centralized, immutable audit logs | CC7.2 | Audit Controls | Req 10 |
| Quarterly access reviews | CC6.3 | Minimum Necessary | Req 7 |
| Annual penetration testing | CC4.1 | Risk Analysis | Req 11 |
| Incident response plan (tested) | CC7.4, CC7.5 | Breach Notification | Req 12 |
| Secrets manager (no hardcoded creds) | CC6.1 | Access Control | Req 2, 8 |
| Vulnerability scanning in CI | CC7.1 | Risk Analysis | Req 6, 11 |
| IaC-only infrastructure changes | CC8.1 | Change Management | Req 6 |

**Practical advice**: implement these 10 controls first. They give you the
largest cross-framework coverage for the least engineering effort. Then layer in
framework-specific requirements based on which audits you are preparing for.

---

## Quick Reference: Which Framework Do I Need?

```
Do you handle credit/debit card numbers (PAN)?
  YES -> PCI-DSS is mandatory. Minimize scope with tokenization.

Do you store, process, or transmit health data about US individuals?
  YES -> HIPAA applies if you are a covered entity or business associate.
         Obtain BAAs with all vendors handling ePHI.

Do you provide a B2B SaaS service where enterprise customers ask about
security practices before signing contracts?
  YES -> SOC 2 Type II is effectively required for enterprise sales.

Are you subject to GDPR (EU personal data)?
  YES -> SOC 2 Privacy TSC + DPA agreements cover significant overlap,
         but GDPR has additional requirements (lawful basis, DSAR process,
         72-hour breach notification). Consider ISO 27001 for EU markets.
```
