<!-- Part of the Security Incident Response AbsolutelySkilled skill. Load this file when the active incident matches one of the playbook types below: ransomware, credential theft, data exfiltration, insider threat, or supply chain attack. -->

# Incident Playbooks

Step-by-step response playbooks for the five most common enterprise incident types.
Each playbook follows the NIST IR phases and includes specific commands, decision
points, and communication guidance.

---

## How to use these playbooks

1. Identify the incident type (or closest match)
2. Start at "Immediate actions" - these are time-critical
3. Work through Detection, Containment, Eradication, and Recovery in order
4. Adapt to your environment - not every step applies to every organization
5. Document every action taken in your incident timeline as you go

---

## Playbook 1: Ransomware

### Overview

Ransomware encrypts files and demands payment for decryption keys. Modern ransomware
operators also exfiltrate data before encrypting (double extortion) and may use
ransomware as a distraction for deeper persistence.

**Common initial access vectors:** phishing email attachments, RDP exposed to internet,
unpatched public-facing services (Exchange, VPNs, Citrix), compromised MSP access.

### Immediate actions (first 15 minutes)

- [ ] Isolate affected systems from the network immediately - pull ethernet or block
  at the switch/firewall. Do NOT power off.
- [ ] Alert your incident response team, management, and legal
- [ ] Determine scope: is encryption still spreading? Check neighboring systems for
  encrypted files or unusual disk activity.
- [ ] Disable file shares and mapped drives accessible from the affected network segment
- [ ] Block all outbound traffic from affected segment at the firewall (C2 callback)

### Detection and analysis

**Identify patient zero:**
```bash
# Windows: check file modification timestamps in affected directories
# Find recently modified files across a share
Get-ChildItem -Recurse -Path \\server\share | Sort-Object LastWriteTime -Descending | Select-Object -First 100

# Check Windows Event Log for first encryption activity
Get-WinEvent -LogName Security | Where-Object {$_.Id -eq 4663} | Select-Object TimeCreated, Message | Select-Object -First 50
```

**Confirm ransomware family:**
- Collect a ransom note and sample encrypted file
- Submit file hash to [VirusTotal](https://virustotal.com) or use `id-ransomware.malwarehunterteam.com`
- Identify family to determine if a free decryptor exists (check [No More Ransom](https://nomoreransom.org))

**Assess exfiltration:**
- Review DNS query logs and firewall logs for large outbound transfers in the 24-72
  hours before encryption began
- Look for use of rclone, WinRAR, 7-Zip, or cloud storage clients (common exfil tools)
- Check for staging directories (common temp paths like `C:\ProgramData\`, `%TEMP%`)

### Containment

- [ ] Isolate all confirmed and suspected compromised systems
- [ ] Disable or reset all privileged accounts used on affected systems
- [ ] Revoke all VPN, RDP, and remote access credentials pending investigation
- [ ] Block the C2 domains/IPs identified in ransomware sample at perimeter
- [ ] Take VM snapshots or disk images of affected systems before any remediation

**Do not:**
- Pay the ransom without legal and executive approval and law enforcement consultation
- Delete encrypted files until backups are verified clean
- Patch or update affected systems before forensic imaging

### Eradication and recovery

- [ ] Identify and close the initial access vector (patch, disable RDP, MFA on VPN)
- [ ] Audit all accounts for unauthorized additions or privilege escalations
- [ ] Restore from the last known-clean backup that predates the intrusion
- [ ] Validate restored data integrity before returning systems to production
- [ ] Reimage compromised systems rather than cleaning in-place (ransomware operators
  often leave backdoors)
- [ ] Deploy EDR/AV with updated signatures before reconnecting to production network

**Backup validation steps:**
```
1. Identify backup timestamp before first indicators in logs
2. Restore to isolated environment first
3. Verify file integrity (compare hashes against known-good baseline if available)
4. Confirm no encrypted or corrupted files in restored backup
5. Validate application functionality in isolated environment before production restore
```

### Communication guidance

- Engage legal before any external communication (double extortion means data may
  be published publicly)
- Law enforcement notification: FBI (US), NCSC (UK), BSI (DE) - do not pay ransom
  without consulting law enforcement
- Cyber insurance carrier must be notified early - many policies have specific
  requirements that can void coverage if not followed

---

## Playbook 2: Credential Theft and Account Takeover

### Overview

An attacker has obtained valid credentials (username/password, API keys, tokens,
or session cookies) and is using them to access systems. Sources include phishing,
credential stuffing, password spray, malware keyloggers, or database breach of a
third-party service.

**Indicators:** login from unusual geography or IP, access outside normal hours,
bulk data downloads, new MFA devices added, password resets not initiated by the user.

### Immediate actions (first 15 minutes)

- [ ] Disable or force password reset for the compromised account(s)
- [ ] Terminate all active sessions for the compromised account
- [ ] If API keys or service tokens were compromised, revoke immediately and rotate
- [ ] Check for MFA bypass or new authenticator devices added by the attacker
- [ ] Alert the account owner to confirm they did not initiate the activity

### Detection and analysis

**Determine scope of access:**
```bash
# AWS: review CloudTrail for actions taken by compromised credentials
aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=<username> \
  --start-time <incident_start_iso8601> --end-time <now_iso8601>

# Review what services/resources the compromised credential could access
aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::<account>:user/<username> \
  --action-names "s3:GetObject" "rds:DescribeDBInstances" "ec2:DescribeInstances"

# GCP: review audit logs
gcloud logging read "protoPayload.authenticationInfo.principalEmail=<email>" \
  --freshness=24h --format=json
```

**Check for lateral movement:**
- Were other accounts accessed or created using the compromised credential?
- Were there API calls to IAM (adding permissions, creating new users/keys)?
- Were any external data transfers initiated?
- Were new instances, functions, or services spun up (cryptomining is common)?

**Determine credential source:**
- Was this a phishing attack? Check email logs for suspicious links/attachments sent
  to the victim
- Credential stuffing? Check for parallel login attempts across multiple accounts
  from the same IP range
- Exposed credential? Check Have I Been Pwned API for the email address
- Internal leak? Review if the credential appears in recent code commits or logs

### Containment

- [ ] Revoke and rotate all credentials for the compromised account
- [ ] Revoke credentials for any accounts the attacker may have pivoted to
- [ ] Remove any unauthorized MFA devices, SSH keys, or OAuth app authorizations
- [ ] Terminate and deauthorize any active sessions or tokens
- [ ] Enable conditional access policies (block risky sign-ins) if not already in place

### Eradication and recovery

- [ ] Enforce MFA on all accounts that did not have it (particularly privileged accounts)
- [ ] Reset passwords for all users in the same organizational unit if credential
  stuffing is suspected
- [ ] Review and remove any new IAM roles, policies, or permissions added during
  the attack window
- [ ] Audit and clean up any resources created (instances, functions, storage buckets)
  by the attacker
- [ ] Enable anomalous login alerting (impossible travel, new device, new country)
- [ ] Implement or enforce passwordless/passkey for high-value accounts

---

## Playbook 3: Data Exfiltration

### Overview

An attacker or malicious insider has transferred sensitive data outside of authorized
systems. This may be the primary objective or a secondary action during a broader
intrusion. Focus is on determining what was taken, stopping ongoing exfiltration,
and fulfilling notification obligations.

**Indicators:** large outbound transfers, access to unusual data sets, use of
personal cloud storage (Dropbox, Google Drive) from corporate systems, DLP alerts,
DNS tunneling anomalies, bulk API reads.

### Immediate actions (first 15 minutes)

- [ ] Block outbound traffic from the suspected exfiltration source at the firewall
- [ ] Preserve firewall, proxy, and DLP logs before they are rotated
- [ ] Identify the destination of the exfiltration (external IP, cloud service, domain)
- [ ] Determine if the exfiltration is still in progress
- [ ] Alert legal immediately - data exfiltration triggers notification obligations

### Detection and analysis

**Quantify what was exfiltrated:**
```bash
# Estimate volume from firewall/proxy logs
# Look for large outbound sessions to unfamiliar destinations
grep "<source_ip>" /var/log/firewall.log | awk '{print $7, $8, $9}' | sort -k3 -rn | head -50

# S3: check for bulk GetObject operations
aws s3api list-objects --bucket <bucket> --query 'Contents[].{Key:Key,Size:Size}' | \
  jq 'sort_by(.Size) | reverse | .[:20]'

# Check CloudTrail for S3 data events
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=GetObject \
  --start-time <start> --end-time <end>
```

**Classify the data:**
- What data classifications were in the exfiltrated dataset? (PII, PHI, PCI, IP)
- How many records? How many individuals are affected?
- Is the data subject to specific regulations? (GDPR, HIPAA, CCPA, PCI-DSS)
- Was encryption applied to the data at rest? Was the encryption key also exfiltrated?

**Determine the exfiltration method:**

| Method | Detection source | Evidence to collect |
|---|---|---|
| HTTPS upload to cloud storage | Proxy/firewall logs, DLP | URLs, byte counts, timestamps |
| Email attachment | Email gateway logs | Subject, recipients, attachment names/hashes |
| DNS tunneling | DNS query logs | Query volume, query entropy, unusual subdomain patterns |
| Physical media | USB device logs (Windows Event 4663) | Device ID, user, timestamp, files accessed |
| API bulk reads | Application and API gateway logs | Endpoint, query params, response size |

### Containment

- [ ] Block the exfiltration destination (IP, domain, cloud service endpoint)
- [ ] Revoke access for the account used to exfiltrate
- [ ] Enable egress DLP rules for the affected data classification
- [ ] Coordinate with legal on regulatory notification timeline (GDPR: 72 hours)
- [ ] Preserve all logs for legal hold

### Eradication and recovery

- [ ] Remove unauthorized access paths (misconfigured S3 bucket policies, exposed APIs)
- [ ] Implement data loss prevention controls for the vector used
- [ ] Rotate encryption keys for any encrypted data whose keys may have been exposed
- [ ] Review and tighten data access controls (least privilege, just-in-time access)
- [ ] Enable data access auditing on sensitive datasets if not already active

---

## Playbook 4: Insider Threat

### Overview

A current or former employee, contractor, or privileged user is intentionally or
accidentally causing harm - through data theft, sabotage, unauthorized access, or
sharing credentials. Insider threats are the hardest to detect and require careful
coordination between security, HR, and legal.

**Important:** Do not confront the suspected insider directly. Do not alert them
that they are under investigation. All actions must be coordinated with HR and legal.

### Immediate actions (first 15 minutes)

- [ ] Immediately loop in HR and legal - do not proceed without them
- [ ] Do not alert or confront the suspect
- [ ] Preserve all access logs, emails, and activity records for the suspect's accounts
- [ ] Determine if they still have active access and what systems/data they can reach
- [ ] Assess whether an emergency access revocation is warranted (destructive risk)

### Detection and analysis

**Behavioral indicators to investigate:**
- Access to data outside normal job function or data they have no business reason to
  access
- Bulk downloads or transfers to personal devices or external services
- Access attempts after hours or from unusual locations
- Searching for competitors, sensitive company information, or executive communications
- Recent performance issues, disciplinary actions, or announced resignation

**Technical evidence collection:**
```
1. Pull complete access logs for the suspect's accounts (SSO, VPN, cloud, app)
2. Capture email metadata (do not read content without legal authorization)
3. Collect DLP alerts and endpoint activity logs
4. Document all systems the suspect has valid credentials for
5. Preserve badge/physical access records if applicable
```

**Legal constraints:**
- In many jurisdictions, monitoring employee communications requires consent or a
  specific legal basis - consult legal before accessing email content, chat logs,
  or personal device data
- Evidence collected in violation of applicable law may be inadmissible and create
  liability
- Preserve chain of custody with particular care - insider cases often result in
  litigation

### Containment

Containment timing is critical and must be coordinated with HR:

- For active destruction risk: revoke access immediately, notify HR simultaneously
- For ongoing exfiltration: legal and HR may want to monitor briefly to gather
  evidence before revocation - this is their decision, not security's
- Prepare a complete access revocation runbook before executing (all accounts, all
  systems, physical access, personal devices enrolled in MDM)

**Access revocation checklist:**
- [ ] SSO / identity provider account disabled
- [ ] VPN certificate revoked
- [ ] All cloud provider IAM accounts/keys revoked
- [ ] All application accounts disabled
- [ ] SSH keys removed from all systems
- [ ] MDM: remote wipe initiated for company-managed devices
- [ ] Physical access cards deactivated
- [ ] Shared account passwords rotated if suspect knew them

### Eradication and recovery

- [ ] Audit for any backdoors, new accounts, or scheduled tasks created by the insider
- [ ] Review changes made to code, infrastructure configs, or data during the suspect's
  access window
- [ ] Recover or attempt to recover any deleted or modified data from backups
- [ ] Conduct a privilege audit across all systems to identify over-provisioned access
  (the insider case often reveals systemic access control failures)
- [ ] Implement user behavior analytics (UEBA) if not already deployed

---

## Playbook 5: Supply Chain Attack

### Overview

A trusted third-party software package, vendor, or service has been compromised and
used as a vector to attack your systems. Examples include SolarWinds-style trojanized
updates, compromised npm/PyPI packages, or a vendor whose credentials gave them
access to your environment.

**Indicators:** unexpected network connections from trusted software, security alerts
from vendor or public disclosure, anomalous behavior from a recently updated dependency,
threat intelligence from a feed or ISAC.

### Immediate actions (first 15 minutes)

- [ ] Identify all instances of the compromised software/package in your environment
- [ ] Check the vendor's security advisory for indicators of compromise (IOCs)
- [ ] Determine if those IOCs are present in your systems (run the provided hashes,
  domains, and file paths against your SIEM/EDR)
- [ ] Assess blast radius: what access did the compromised component have?
- [ ] If active compromise is confirmed, treat as a P1 and begin containment

### Detection and analysis

**Software bill of materials (SBOM) query:**
```bash
# Find all instances of a specific package version across your repos
# npm
find /path/to/repos -name "package-lock.json" -exec grep -l "<package>@<version>" {} \;

# Python
find /path/to/repos -name "requirements*.txt" -exec grep -l "<package>=<version>" {} \;

# Docker images: use your image registry's vulnerability scanning
# AWS ECR, GitHub Container Registry, etc. provide package inventory APIs
```

**Check for IOC presence:**
```bash
# Search for known malicious file hashes
find / -type f -exec sha256sum {} \; 2>/dev/null | grep -f <ioc_hashes_file>

# Check DNS for known C2 domains in logs
grep -E "(malicious-domain1|malicious-domain2)" /var/log/dns-queries.log

# Check EDR for process executions matching known malicious binaries
# (tool-specific - use your EDR's threat hunting query interface)
```

**Determine compromise window:**
- When was the compromised version first deployed in your environment?
- What actions were taken by processes running the compromised software?
- Was any data accessible to the compromised component exfiltrated?

### Containment

- [ ] Remove or disable the compromised software/package version from all systems
- [ ] Block C2 domains and IPs from the vendor's IOC list at firewall and DNS
- [ ] If the compromised component had cloud provider access, rotate all credentials
  it used
- [ ] If a vendor's SSO or direct access was used as the attack vector, revoke their
  access immediately and notify the vendor
- [ ] Enable enhanced logging on all systems that ran the compromised software

### Eradication and recovery

- [ ] Upgrade to a clean version verified by the vendor, or remove the dependency
- [ ] Verify the clean version with the vendor's provided hash or signature
- [ ] Audit all systems that ran the compromised version for persistence mechanisms
- [ ] Implement dependency pinning and integrity verification (lock files, SRI hashes,
  signed packages) if not already in place
- [ ] Add SBOM generation to your CI/CD pipeline for future visibility
- [ ] Subscribe to security advisories for all critical third-party dependencies

**Verification commands:**
```bash
# npm: verify package integrity
npm audit
npm pack <package>@<version> | sha256sum  # compare with vendor-published hash

# Python: verify with pip hash checking
pip install --require-hashes -r requirements.txt

# Docker: verify image digest
docker pull <image>@sha256:<digest>
```

---

## Quick reference: Incident type to playbook

| What you're seeing | Playbook |
|---|---|
| Files being encrypted, ransom note | Ransomware (Playbook 1) |
| Login from unusual location, account used without owner's knowledge | Credential Theft (Playbook 2) |
| Large outbound data transfer, DLP alert, bulk API reads | Data Exfiltration (Playbook 3) |
| Employee suspected of data theft or sabotage | Insider Threat (Playbook 4) |
| Vendor security advisory, compromised npm/PyPI package | Supply Chain Attack (Playbook 5) |

For incidents that combine types (e.g., credential theft leading to exfiltration),
run both playbooks and combine the containment and eradication steps.
