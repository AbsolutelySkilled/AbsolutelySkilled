<!-- Part of the Regulatory Compliance AbsolutelySkilled skill. Load this file when building a SOC 2 controls matrix, mapping Trust Services Criteria to controls, or preparing evidence for a SOC 2 Type I or Type II audit. -->

# SOC 2 Controls Matrix

SOC 2 Trust Services Criteria (TSC) mapped to common controls, evidence types, owners,
and review frequencies. Based on AICPA TSC 2017 (updated). Adapt column values to
match your environment.

This matrix covers the Security (CC) criteria, which are required for all SOC 2 reports.
Availability (A), Confidentiality (C), Processing Integrity (PI), and Privacy (P) criteria
are additive if included in your audit scope.

---

## How to use this matrix

1. Copy this matrix into a spreadsheet (one row per control)
2. Fill in **Your Control** with how your organization satisfies the requirement
3. Fill in **Evidence Location** with the actual path, URL, or system
4. Assign a **Control Owner** - the person accountable for operating the control
5. Confirm **Review Frequency** is met and scheduled
6. Share with your auditor as the control-mapping artifact (often called the RCM -
   Risk and Controls Matrix)

---

## Common Criteria (CC) - Security

### CC1: Control Environment

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC1.1 | Board/management demonstrates commitment to integrity and ethical values | Administrative | Code of conduct policy acknowledged annually by all employees | Policy + acknowledgment records | Annual |
| CC1.2 | Board oversees internal controls system | Administrative | Security committee charter; quarterly security reviews with leadership | Meeting minutes | Quarterly |
| CC1.3 | Management establishes structure and reporting lines | Administrative | Org chart with defined security ownership; RACI for security functions | Org chart + job descriptions | Annual |
| CC1.4 | Competent individuals are committed to compliance | Administrative | Security awareness training completion records | Training completion log | Annual (+ on hire) |
| CC1.5 | Accountability is enforced | Administrative | Documented sanctions policy; HR records of policy enforcement actions | Sanctions policy | Annual |

### CC2: Communication and Information

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC2.1 | Entity obtains relevant quality information | Operational | Threat intelligence feeds; security mailing lists subscribed | Subscription records | Ongoing |
| CC2.2 | Internal communication supports control functioning | Administrative | Security policies distributed to all staff; intranet publication | Policy distribution records + acknowledgments | Annual |
| CC2.3 | Communication with external parties occurs | Administrative | Privacy policy published; responsible disclosure policy; vendor agreements with security terms | Policy documents + vendor contracts | Annual |

### CC3: Risk Assessment

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC3.1 | Risk assessment objectives are specified | Administrative | Documented risk assessment methodology aligned to NIST SP 800-30 or ISO 27005 | Risk assessment methodology doc | Annual |
| CC3.2 | Risk identification and analysis | Administrative | Completed risk register with threat actors, vulnerabilities, likelihood, impact scores | Risk register + scoring documentation | Annual + after major changes |
| CC3.3 | Fraud risk is considered | Administrative | Risk register includes fraud scenarios (insider theft, account takeover, data manipulation) | Risk register | Annual |
| CC3.4 | Changes affecting internal controls are identified | Administrative | Change management process that triggers risk re-assessment for significant changes | Change log + impact assessment records | Per significant change |

### CC4: Monitoring Activities

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC4.1 | Controls are monitored | Technical + Operational | Automated monitoring alerts; control effectiveness dashboards in compliance platform | Alert configurations + incident log | Ongoing |
| CC4.2 | Deficiencies are communicated and corrected | Administrative | Issue tracking for control deficiencies; SLA for remediation by risk level | Deficiency log + remediation records | Per deficiency |

### CC5: Control Activities

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC5.1 | Controls address risk mitigation | Administrative | Controls mapped to risk register entries; residual risk documented | Risk register + controls mapping | Annual |
| CC5.2 | Technology controls are implemented | Technical | IaC enforces required configurations; policy-as-code detects drift | IaC repo + policy scan results | Continuous |
| CC5.3 | Policies and procedures are deployed | Administrative | All policies in version-controlled policy management system with approval workflow | Policy version history + approval records | Annual review cycle |

### CC6: Logical and Physical Access Controls

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC6.1 | Logical access to assets is managed | Technical | MFA enforced for all systems via IdP; SSO for all cloud services | IdP MFA enforcement config + user export | Quarterly |
| CC6.2 | New access is provisioned based on authorization | Administrative + Technical | Access request workflow with manager approval before provisioning; JIRA/ServiceNow tickets | Access request records | Per provisioning event |
| CC6.3 | Access is reviewed and removed | Administrative | Quarterly access reviews; off-boarding checklist with access revocation within 24h | Access review records + off-boarding tickets | Quarterly |
| CC6.4 | Physical access is managed | Physical | Badge access logs for data center / office; visitor log | Badge access export + visitor log | Quarterly |
| CC6.5 | Logical access is removed when no longer needed | Technical | Automated de-provisioning on HR termination trigger; IdP deactivation | Termination records cross-referenced with IdP | Per termination |
| CC6.6 | Logical access to external systems is managed | Administrative | Vendor inventory with access levels; annual vendor access review | Vendor register + access review records | Annual |
| CC6.7 | User authentication requires multiple factors | Technical | MFA enforced at IdP level for all users; hardware key required for privileged access | IdP policy screenshot + MFA enrollment export | Quarterly |
| CC6.8 | Infrastructure is protected from malware | Technical | EDR agent deployed on all endpoints; server anti-malware policies enforced | EDR coverage report; policy export | Monthly |

### CC7: System Operations

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC7.1 | Infrastructure components are kept current | Technical | Patch management policy; automated OS patching; dependency scanning in CI | Patch status report + scan results | Monthly |
| CC7.2 | Monitoring detects and responds to incidents | Technical | SIEM with alert rules; on-call rotation; incident response runbooks | Alert rule configurations + on-call schedule | Quarterly review |
| CC7.3 | Security incidents are identified | Operational | Incident log with all security events; classification by severity | Incident register | Ongoing |
| CC7.4 | Security incidents are responded to | Operational | Incident response policy with defined roles, escalation paths, and SLAs | IR policy + post-mortems for incidents | Per incident |
| CC7.5 | Incident response includes recovery and communication | Operational | Post-mortem process; customer notification SLAs defined in IR policy | Post-mortem records + notification evidence | Per incident |

### CC8: Change Management

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC8.1 | Changes to infrastructure and software are controlled | Technical + Administrative | All changes deployed via CI/CD; PRs require at least one approval; no direct production access | PR merge log + branch protection settings | Ongoing |

### CC9: Risk Mitigation

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| CC9.1 | Risk mitigation activities are identified | Administrative | Risk treatment plan aligned to risk register; accepted risks signed off by risk owner | Risk treatment plan + sign-off records | Annual |
| CC9.2 | Vendor and partner risks are managed | Administrative | Third-party risk management process; vendor SOC 2 reports or security questionnaires collected annually | Vendor register + collected reports/questionnaires | Annual |

---

## Availability Criteria (A) - if in scope

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| A1.1 | Availability commitments are specified | Administrative | SLA documentation with uptime commitments; status page | SLA docs + status page | Annual |
| A1.2 | Environmental threats are addressed | Technical | Multi-AZ deployments; automated failover; disaster recovery runbooks | Architecture diagram + DR test results | Annual DR test |
| A1.3 | Recovery plans are tested | Operational | Annual DR test with documented RTO/RPO results | DR test report | Annual |

---

## Confidentiality Criteria (C) - if in scope

| Criteria ID | Requirement Summary | Control Type | Example Control | Evidence Type | Review Frequency |
|---|---|---|---|---|---|
| C1.1 | Confidential information is identified | Administrative | Data classification policy with sensitivity labels (Public, Internal, Confidential, Restricted) | Data classification policy + data inventory | Annual |
| C1.2 | Confidential information is protected | Technical | Encryption at rest (AES-256) and in transit (TLS 1.2+); DLP controls for data egress | Encryption configuration exports + DLP policy | Quarterly |

---

## Evidence Collection Checklist

Before submitting your controls matrix to an auditor, verify each row has:

- [ ] A specific, named control (not "we use best practices")
- [ ] An identified control owner by name or role
- [ ] At least one evidence artifact with a known location
- [ ] A confirmed review frequency that has actually been met
- [ ] Supporting documentation for the most recent review cycle

### Common evidence gaps that delay audits

| Gap | Root cause | Prevention |
|---|---|---|
| Access review not completed for the observation period | Quarterly reviews were skipped | Schedule recurring calendar events with the control owner; automate reminders |
| Policy not acknowledged by all employees | New hires not enrolled in acknowledgment workflow | Automate policy acknowledgment in onboarding checklist |
| Vendor SOC 2 reports expired | Annual collection not tracked | Add vendor report expiry to risk register; automate renewal reminders |
| Patch status report not generated | No automated reporting | Connect endpoint management to compliance platform for automated exports |
| Change management evidence is informal | Engineers merged PRs without required approvals | Enforce branch protection rules at the repo level; auditors will check GitHub settings |

---

## Quick reference: Criteria to common tooling

| TSC Area | Common tools that satisfy it |
|---|---|
| Identity and MFA (CC6.1, CC6.7) | Okta, Google Workspace, Azure AD, JumpCloud |
| Endpoint protection (CC6.8) | CrowdStrike, SentinelOne, Jamf Protect |
| Vulnerability scanning (CC7.1) | Snyk, Trivy, Wiz, Qualys |
| SIEM and monitoring (CC7.2) | Datadog, Splunk, Sumo Logic, AWS Security Hub |
| Change management (CC8.1) | GitHub with branch protection, GitLab, Jira with approval workflows |
| Vendor management (CC9.2) | SecurityScorecard, Whistic, Vanta vendor portal |
| Compliance automation | Vanta, Drata, Secureframe, Thoropass |
