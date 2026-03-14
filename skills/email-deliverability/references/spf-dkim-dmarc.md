<!-- Part of the Email Deliverability AbsolutelySkilled skill. Load this file when
     configuring SPF, DKIM, or DMARC records, troubleshooting authentication
     failures, or setting up BIMI. -->

# SPF, DKIM, and DMARC Reference

Deep-dive reference for email authentication protocols. Covers full DNS record
syntax, alignment modes, common failure patterns, and troubleshooting steps.

---

## 1. SPF - Sender Policy Framework

### Record syntax

```
v=spf1 [mechanisms] [qualifier]all
```

**Mechanisms (evaluated left to right, first match wins):**

| Mechanism | Syntax | DNS lookups | Purpose |
|---|---|---|---|
| `include` | `include:_spf.google.com` | 1+ (recursive) | Authorize another domain's SPF |
| `ip4` | `ip4:203.0.113.0/24` | 0 | Authorize an IPv4 address or range |
| `ip6` | `ip6:2001:db8::/32` | 0 | Authorize an IPv6 address or range |
| `a` | `a:mail.example.com` | 1 | Authorize IPs that the A record resolves to |
| `mx` | `mx` | 1 per MX record | Authorize IPs of the domain's MX records |
| `exists` | `exists:%{i}._spf.example.com` | 1 | Advanced macro-based check |
| `redirect` | `redirect=_spf.example.com` | 1 | Delegate entire SPF policy to another domain |

**Qualifiers:**

| Qualifier | Meaning | Use when |
|---|---|---|
| `+` (default) | Pass | Mechanism matches, authorize |
| `-` | Hard fail | Use with `all` in production: `-all` |
| `~` | Soft fail | Use with `all` during testing: `~all` |
| `?` | Neutral | Rarely useful, avoid |

### The 10-lookup limit

SPF processing must not exceed 10 DNS lookups. Exceeding this causes a permerror
and SPF fails for all messages.

**What counts as a lookup:**
- Each `include:` = 1 lookup + recursive lookups inside the included record
- Each `a:` = 1 lookup
- Each `mx:` = 1 lookup + 1 per MX record returned
- Each `redirect=` = 1 lookup
- Each `exists:` = 1 lookup
- `ip4:` and `ip6:` = 0 lookups (no DNS query needed)

**How to count your lookups:**

```bash
# Check your SPF record
dig TXT example.com +short | grep spf

# Use an online tool to count recursive lookups
# dmarcian.com/spf-survey or mxtoolbox.com/spf.aspx
```

**SPF flattening** resolves all `include:` mechanisms to their underlying IP
addresses at publish time, replacing DNS lookups with `ip4:`/`ip6:` entries.
This reduces lookup count but requires re-flattening when ESPs change their IPs.
Automate flattening with a cron job or use a service like AutoSPF.

### Common SPF errors

| Error | Cause | Fix |
|---|---|---|
| permerror | > 10 lookups or syntax error | Flatten includes or remove unused mechanisms |
| temperror | DNS timeout during lookup | Check DNS server health, reduce lookup count |
| Multiple SPF records | Two TXT records starting with `v=spf1` | Merge into one record |
| Too long (> 450 chars) | Record exceeds practical TXT limit | Split into `include:` sub-records or flatten |

### Subdomain SPF

SPF is evaluated per envelope sender (Return-Path) domain. If you send from
`news@marketing.example.com`, the SPF record at `marketing.example.com` is
checked, not `example.com`. Publish SPF records on every subdomain you send from.

For subdomains you do NOT send from, publish a restrictive SPF to prevent spoofing:

```dns
nosend.example.com.  IN  TXT  "v=spf1 -all"
```

---

## 2. DKIM - DomainKeys Identified Mail

### How DKIM works

1. Sending server computes a hash of specified headers + body
2. Hash is signed with a private key
3. Signature is added as the `DKIM-Signature` header
4. Receiving server fetches the public key from DNS and verifies the signature

### DKIM-Signature header anatomy

```
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
  d=example.com; s=selector1;
  h=from:to:subject:date:message-id;
  bh=base64_body_hash;
  b=base64_signature
```

| Tag | Meaning | Notes |
|---|---|---|
| `v=` | Version | Always `1` |
| `a=` | Algorithm | `rsa-sha256` (required), `ed25519-sha256` (emerging) |
| `c=` | Canonicalization | `relaxed/relaxed` recommended (header/body) |
| `d=` | Signing domain | Must align with From domain for DMARC |
| `s=` | Selector | Identifies which key to fetch from DNS |
| `h=` | Signed headers | Must include `from`; recommended: `to`, `subject`, `date`, `message-id` |
| `bh=` | Body hash | Base64-encoded hash of the canonicalized body |
| `b=` | Signature | Base64-encoded signature of the header hash |
| `l=` | Body length | AVOID - allows appending content to signed messages |

### DNS record format

```dns
selector1._domainkey.example.com.  IN  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqhki..."
```

| Tag | Meaning | Notes |
|---|---|---|
| `v=` | Version | `DKIM1` |
| `k=` | Key type | `rsa` (default) or `ed25519` |
| `p=` | Public key | Base64-encoded; empty `p=` revokes the key |
| `t=` | Flags | `t=s` restricts to exact domain (no subdomains); `t=y` testing mode |

### Key management best practices

- Use 2048-bit RSA keys minimum (1024-bit is cryptographically weak)
- Use a unique selector per sending service (e.g., `sg1` for SendGrid, `gm1` for Gmail)
- Rotate keys annually with zero-downtime process:
  1. Generate new key pair with a new selector name
  2. Publish new public key in DNS
  3. Wait 48-72 hours for DNS propagation
  4. Switch signing to the new key
  5. Keep old public key in DNS for 7 days (inflight messages)
  6. Remove old public key from DNS

### DKIM troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `dkim=fail` in headers | Key mismatch or body modified in transit | Verify public key matches private key; check for content rewriting (mailing lists, AV scanners) |
| `dkim=temperror` | DNS lookup for key failed | Check DNS propagation of the DKIM TXT record |
| Key not found | Wrong selector or DNS not propagated | Verify `dig TXT selector._domainkey.example.com` returns the key |
| Signature covers wrong domain | `d=` in signature doesn't match From domain | Configure ESP to sign with your domain, not theirs |

---

## 3. DMARC - Domain-based Message Authentication, Reporting, and Conformance

### How DMARC works

DMARC validates that at least one of SPF or DKIM passes AND aligns with the
From header domain. "Alignment" means the domain in the From header matches
the domain authenticated by SPF (envelope sender) or DKIM (d= tag).

```
Message passes DMARC if:
  (SPF passes AND SPF aligns with From domain)
  OR
  (DKIM passes AND DKIM d= aligns with From domain)
```

### DMARC record syntax

```dns
_dmarc.example.com.  IN  TXT  "v=DMARC1; p=reject; sp=reject; rua=mailto:dmarc-agg@example.com; ruf=mailto:dmarc-forensic@example.com; adkim=s; aspf=s; pct=100; ri=86400; fo=1"
```

| Tag | Values | Default | Purpose |
|---|---|---|---|
| `v=` | `DMARC1` | required | Version identifier |
| `p=` | `none`, `quarantine`, `reject` | required | Policy for the domain |
| `sp=` | `none`, `quarantine`, `reject` | inherits `p=` | Policy for subdomains |
| `rua=` | `mailto:` URI | none | Aggregate report destination |
| `ruf=` | `mailto:` URI | none | Forensic report destination |
| `adkim=` | `r` (relaxed), `s` (strict) | `r` | DKIM alignment mode |
| `aspf=` | `r` (relaxed), `s` (strict) | `r` | SPF alignment mode |
| `pct=` | 0-100 | 100 | Percentage of messages to apply policy to |
| `ri=` | seconds | 86400 | Aggregate report interval |
| `fo=` | `0`, `1`, `d`, `s` | `0` | Forensic report options |

### Alignment modes explained

**Relaxed alignment** (`adkim=r`, `aspf=r`):
- Organizational domain must match (e.g., `mail.example.com` aligns with `example.com`)
- Recommended during initial deployment

**Strict alignment** (`adkim=s`, `aspf=s`):
- Exact domain match required (e.g., `mail.example.com` does NOT align with `example.com`)
- Recommended for production after confirming all senders align

### DMARC deployment roadmap

**Phase 1 - Monitor (weeks 1-4):**
```dns
_dmarc.example.com. IN TXT "v=DMARC1; p=none; rua=mailto:dmarc@example.com; fo=1"
```
- Collect reports, identify all legitimate sending sources
- Use a DMARC report analyzer (dmarcian, Valimail, Postmark) to parse XML reports

**Phase 2 - Quarantine (weeks 5-8):**
```dns
_dmarc.example.com. IN TXT "v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@example.com"
```
- Start at 25%, increase to 50%, then 100% over 3-4 weeks
- Monitor reports for legitimate mail being quarantined

**Phase 3 - Reject (week 9+):**
```dns
_dmarc.example.com. IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc@example.com; adkim=s; aspf=s"
```
- Full enforcement with strict alignment
- Continue monitoring reports permanently

### DMARC aggregate report structure

Reports are XML files sent daily. Key fields:

```xml
<feedback>
  <report_metadata>
    <org_name>google.com</org_name>
    <date_range><begin>1234567890</begin><end>1234654290</end></date_range>
  </report_metadata>
  <record>
    <row>
      <source_ip>203.0.113.5</source_ip>
      <count>150</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>fail</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>example.com</header_from>
    </identifiers>
    <auth_results>
      <dkim><domain>example.com</domain><result>pass</result></dkim>
      <spf><domain>bounce.example.com</domain><result>fail</result></spf>
    </auth_results>
  </record>
</feedback>
```

---

## 4. BIMI - Brand Indicators for Message Identification

BIMI displays your brand logo next to authenticated emails in supported
mailbox providers (Gmail, Yahoo, Apple Mail).

### Prerequisites

- DMARC policy must be `p=quarantine` or `p=reject` (not `none`)
- A Verified Mark Certificate (VMC) from a certificate authority (DigiCert, Entrust)
- Logo in SVG Tiny PS format

### DNS record

```dns
default._bimi.example.com.  IN  TXT  "v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/vmc.pem"
```

| Tag | Purpose |
|---|---|
| `l=` | URL to SVG Tiny PS logo file (HTTPS required) |
| `a=` | URL to VMC certificate in PEM format |

> BIMI is a reward for doing authentication right. It requires DMARC at
> enforcement level, which means SPF and DKIM must already be solid.

---

## 5. Verifying authentication from email headers

When troubleshooting, check the `Authentication-Results` header in a received
message:

```
Authentication-Results: mx.google.com;
  dkim=pass header.i=@example.com header.s=selector1;
  spf=pass (google.com: domain of bounce@example.com designates 203.0.113.5 as permitted sender) smtp.mailfrom=bounce@example.com;
  dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=example.com
```

**What to look for:**
- `dkim=pass` with correct `header.i=` domain
- `spf=pass` with correct `smtp.mailfrom=` domain
- `dmarc=pass` with expected policy
- If any show `fail`, check the specific domain and IP in the result

**Quick diagnostic commands:**

```bash
# Check SPF record
dig TXT example.com +short | grep spf

# Check DKIM public key
dig TXT selector1._domainkey.example.com +short

# Check DMARC record
dig TXT _dmarc.example.com +short

# Check BIMI record
dig TXT default._bimi.example.com +short

# Test with a real message - send to a Gmail account and view
# "Show Original" to see full Authentication-Results header
```
