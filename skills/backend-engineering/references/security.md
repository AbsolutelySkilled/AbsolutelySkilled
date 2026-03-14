<!-- Part of the Backend Engineering AbsolutelySkilled skill. Load this file when implementing authentication, authorization, encryption, or security hardening. -->

# Security Reference

Opinionated security guidance for backend engineers. When in doubt, pick the more
restrictive option. Security mistakes are silent until they are catastrophic.

---

## 1. Authentication Patterns

### Comparison

| Method | Best for | Token location | Revocable? | Stateless? |
|---|---|---|---|---|
| Session-based | Traditional web apps | httpOnly cookie (server stores session) | Yes (delete from store) | No |
| JWT | SPAs, mobile, microservices | httpOnly cookie (preferred) | Not natively (use deny-list) | Yes |
| API keys | Service-to-service, third-party | Authorization header | Yes (rotate key) | Yes |

**Recommendation:** Use JWT in httpOnly cookies for user-facing apps. Use API keys +
HMAC signatures for service-to-service. Never store tokens in localStorage or
sessionStorage - XSS can steal them.

### OAuth 2.0 / OIDC Flows

| Flow | Use when |
|---|---|
| Authorization Code + PKCE | User-facing web/mobile apps (always use PKCE, even for confidential clients) |
| Client Credentials | Service-to-service with no user context |
| Device Code | CLI tools, smart TVs, IoT |

Never use Implicit flow - it is deprecated. Never use Resource Owner Password flow
unless migrating a legacy system and you control both client and server.

### Token Refresh Pattern

```
1. Access token: short-lived (5-15 minutes)
2. Refresh token: longer-lived (7-30 days), stored httpOnly cookie, rotated on use
3. On 401 -> call /token/refresh with refresh token
4. Server issues new access + refresh token pair, invalidates old refresh token
5. If refresh token is reused (already rotated) -> revoke entire session (token theft)
```

### MFA Considerations

- Prefer TOTP (app-based) over SMS (SIM-swapping risk)
- Support WebAuthn/passkeys as the strongest option
- Store MFA secrets encrypted at rest, never in plain text
- Implement MFA as a separate authentication step - do not issue full session until MFA completes
- Provide recovery codes (one-time use, hashed like passwords)

---

## 2. Authorization

### Model Comparison

| Model | How it works | Best for | Complexity |
|---|---|---|---|
| RBAC | User -> Role -> Permissions | Simple apps, internal tools | Low |
| ABAC | Policy evaluated against user/resource/environment attributes | Fine-grained rules, compliance-heavy | Medium |
| ReBAC | Permissions derived from relationships (user owns resource) | Social apps, multi-tenant, Google Zanzibar-style | High |

**Recommendation:** Start with RBAC. Move to ReBAC when you need relationship-based
checks (e.g., "user can edit this document because they are in the owning org"). Use
ABAC when you need policy rules that combine time, location, and resource attributes.

### Enforcement Rules

- **Default deny** - if no rule explicitly grants access, deny
- **Enforce at middleware layer** - every route/resolver must pass through auth check
- **Never trust client-side auth checks alone** - they are UX hints, not security
- **Check permissions on the resource, not just the route** - a valid user hitting
  `/api/orders/123` must own order 123 or have admin role

### Row-Level Security Pattern

```pseudocode
// Middleware approach
function authorize(user, resource_id):
    resource = db.find(resource_id)
    if resource is null:
        return 404  // don't leak existence
    if user.role == "admin":
        return allow
    if resource.owner_id != user.id:
        return 403
    return allow

// Database approach (Postgres RLS)
// ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
// CREATE POLICY user_orders ON orders
//   USING (owner_id = current_setting('app.user_id')::int);
```

### Permission Checking Patterns

```pseudocode
// Centralized permission check - preferred
function checkPermission(user, action, resource):
    permissions = getPermissionsForRole(user.role)
    if action not in permissions:
        throw Forbidden
    if resource.requiresOwnership and resource.owner_id != user.id:
        throw Forbidden

// Usage in every handler
function handleDeleteOrder(request):
    checkPermission(request.user, "orders:delete", order)
    // ... proceed
```

---

## 3. OWASP Top 10 - Practical Prevention

| # | Vulnerability | Prevention | Code pattern |
|---|---|---|---|
| A01 | Broken Access Control | Default deny, server-side checks on every request, deny by HTTP method | `checkPermission()` middleware on all routes |
| A02 | Cryptographic Failures | TLS everywhere, AES-256 at rest, Argon2 for passwords | Never log secrets, PII, or tokens |
| A03 | Injection | Parameterized queries, ORM with bind params, never string-concat SQL | `db.query("SELECT * FROM users WHERE id = $1", [id])` |
| A04 | Insecure Design | Threat modeling, abuse case stories, rate limiting business logic | Limit failed login attempts per account |
| A05 | Security Misconfiguration | Harden defaults, disable debug in prod, remove unused endpoints | Automated config scanning in CI |
| A06 | Vulnerable Components | Dependency scanning (Dependabot, Snyk), pin versions, update regularly | `npm audit` / `pip audit` in CI pipeline |
| A07 | Auth Failures | MFA, rate limit login, lock after N failures, credential stuffing protection | Argon2 hashing, no default credentials |
| A08 | Data Integrity Failures | Verify signatures, use integrity checks on CI/CD, sign artifacts | Verify dependency checksums |
| A09 | Logging Failures | Log auth events, access denied, input validation failures | Structured logs with user ID, IP, action |
| A10 | SSRF | Allowlist outbound URLs, block internal IPs, validate/sanitize URLs | Reject `127.0.0.1`, `169.254.x.x`, `10.x.x.x` in user input |

### Injection Prevention Checklist

- [ ] All SQL uses parameterized queries or ORM with bind parameters
- [ ] No string concatenation or template literals in any query
- [ ] NoSQL queries use typed parameters (no raw `$where` or `$regex` from user input)
- [ ] OS command execution is avoided; if unavoidable, use allowlist of commands
- [ ] LDAP queries use proper escaping

### Rate Limiting Login

```pseudocode
// Per-account + per-IP limiting
function handleLogin(ip, email, password):
    if rateLimiter.isBlocked(key="login:" + email, max=5, window=15min):
        return 429 "Too many attempts, try again later"
    if rateLimiter.isBlocked(key="login-ip:" + ip, max=20, window=15min):
        return 429
    result = authenticate(email, password)
    if result == failure:
        rateLimiter.increment("login:" + email)
        rateLimiter.increment("login-ip:" + ip)
        return 401  // use generic message: "Invalid email or password"
    rateLimiter.reset("login:" + email)
    return 200 with session
```

---

## 4. Secrets Management

### Environment by Maturity

| Environment | Approach | Acceptable? |
|---|---|---|
| Local dev | `.env` file (in `.gitignore`) | Yes |
| CI/CD | Pipeline secrets (GitHub Actions secrets, GitLab CI vars) | Yes |
| Staging/Prod | Secrets manager (Vault, AWS Secrets Manager, GCP Secret Manager) | Required |
| Anywhere | Hardcoded in source code | Never |

### Recommendations

- **Use HashiCorp Vault** for multi-cloud or on-prem. Use **AWS Secrets Manager** if
  all-in on AWS. Use **GCP Secret Manager** if all-in on GCP.
- **Rotate secrets regularly** - automate rotation with the secrets manager's built-in
  rotation (e.g., AWS Secrets Manager supports Lambda-based rotation)
- **Least privilege** - each service gets only the secrets it needs
- **Audit access** - log every secret read

### Secret Hygiene Checklist

- [ ] `.env` is in `.gitignore`
- [ ] No secrets in Dockerfiles, docker-compose files, or Kubernetes manifests
- [ ] No secrets in application logs (mask or redact)
- [ ] Secret scanning enabled in CI (e.g., `gitleaks`, `trufflehog`, GitHub secret scanning)
- [ ] Pre-commit hook blocks commits containing high-entropy strings or known patterns
- [ ] Secrets are fetched at runtime, not baked into container images
- [ ] All secrets have a documented rotation schedule

### If a Secret Leaks

```
1. Rotate the compromised secret immediately
2. Audit access logs for unauthorized use
3. Determine blast radius (what systems/data were accessible?)
4. Notify affected parties per incident response policy
5. Post-mortem: how did it leak? Fix the process.
```

---

## 5. Encryption

### Encryption at Rest and in Transit

| Context | Algorithm | Notes |
|---|---|---|
| Data in transit | TLS 1.3 (minimum TLS 1.2) | Terminate at load balancer, re-encrypt to backend if needed |
| Data at rest (general) | AES-256-GCM | Use cloud provider's KMS for key management |
| Password hashing | Argon2id | Preferred. Fallback: bcrypt (cost 12+). Never MD5, SHA-1, SHA-256 |
| API request signing | HMAC-SHA256 | Sign method + path + timestamp + body hash |
| File integrity | SHA-256 | For checksums and verification only, never for passwords |

### Password Hashing Decision

```
Use Argon2id (winner of Password Hashing Competition)
  - memory: 64MB minimum (higher is better)
  - iterations: 3 minimum
  - parallelism: 1 (or match CPU cores)

If Argon2id unavailable:
  Use bcrypt with cost factor 12+

If bcrypt unavailable:
  Use scrypt with N=2^15, r=8, p=1

Never use:
  - MD5, SHA-1, SHA-256 for passwords (fast hashes = fast brute force)
  - Unsalted hashes of any kind
  - Custom/homegrown hashing schemes
```

### HMAC for API Signatures

```pseudocode
// Signing (client side)
function signRequest(method, path, body, secret, timestamp):
    payload = method + "\n" + path + "\n" + timestamp + "\n" + sha256(body)
    signature = hmac_sha256(secret, payload)
    return base64(signature)

// Verification (server side)
function verifyRequest(request, secret):
    timestamp = request.headers["X-Timestamp"]
    if abs(now() - timestamp) > 5 minutes:
        return reject  // replay attack prevention
    expected = signRequest(request.method, request.path, request.body, secret, timestamp)
    if not constantTimeCompare(expected, request.headers["X-Signature"]):
        return reject
    return accept
```

### Key Management Rules

- Never store encryption keys alongside encrypted data
- Use cloud KMS (AWS KMS, GCP Cloud KMS, Azure Key Vault) for key management
- Implement key rotation - encrypt new data with new key, re-encrypt old data on access
- Use envelope encryption: KMS encrypts a data key, data key encrypts actual data
- Log all key usage for audit

---

## 6. Security Headers and Transport

### Required Headers

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'` | Prevent XSS via inline scripts |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused browser features |

### CORS Configuration

```pseudocode
// Be explicit. Never use origin: "*" with credentials.
cors_config = {
    allowed_origins: ["https://app.example.com"],  // explicit list, no wildcards
    allowed_methods: ["GET", "POST", "PUT", "DELETE"],
    allowed_headers: ["Authorization", "Content-Type"],
    allow_credentials: true,
    max_age: 86400  // preflight cache: 24 hours
}
```

**CORS rules:**
- Never allow `*` origin with `credentials: true`
- Allowlist specific origins, do not reflect the Origin header blindly
- Keep `max_age` high to reduce preflight requests

### Rate Limiting

| Strategy | Use case | Implementation |
|---|---|---|
| Token bucket | User-facing APIs | Allows bursts, refills at steady rate |
| Fixed window | Internal services | Simple, predictable |
| Sliding window | High-accuracy rate limiting | Smooths boundary spikes |

- Always return `429 Too Many Requests` with `Retry-After` header
- Rate limit by authenticated user ID, fall back to IP for unauthenticated requests
- Set request body size limits (e.g., 1MB default, higher for file upload endpoints)

### Input Sanitization

- Validate at system boundaries (API gateway, controller layer)
- Use allowlists for expected formats (regex for email, UUID pattern for IDs)
- Reject unexpected fields (strict schema validation)
- Encode output contextually (HTML-encode for HTML, JSON-encode for JSON)
- Never trust `Content-Type` header alone - validate actual content

---

## 7. Security Checklist for New Services

Use this checklist before deploying any new backend service.

### Authentication and Authorization

- [ ] Authentication is required on all non-public endpoints
- [ ] Authorization checks enforce default deny
- [ ] Permissions checked per-request at middleware level, not just at the edge
- [ ] Password hashing uses Argon2id (or bcrypt with cost 12+)
- [ ] Session/token expiration is configured (access: 15min, refresh: 30 days max)
- [ ] Failed login attempts are rate-limited per account and per IP
- [ ] MFA is available for privileged accounts

### Transport and Encryption

- [ ] TLS 1.2+ required on all endpoints (TLS 1.3 preferred)
- [ ] HSTS header set with long max-age
- [ ] Sensitive data encrypted at rest using AES-256-GCM
- [ ] Database connections use TLS
- [ ] Internal service-to-service calls use mTLS or signed requests

### Secrets

- [ ] No secrets in source code, Dockerfiles, or CI config files
- [ ] Secrets loaded from a secrets manager at runtime
- [ ] `.env` in `.gitignore`
- [ ] Secret scanning enabled in CI pipeline
- [ ] Rotation schedule documented for all secrets

### Dependencies

- [ ] Dependency vulnerability scanning in CI (Dependabot, Snyk, or `npm audit`)
- [ ] No dependencies with known critical CVEs
- [ ] Dependencies pinned to specific versions (lockfile committed)
- [ ] Base container images are minimal and regularly updated

### Logging and Monitoring

- [ ] Authentication events logged (login, logout, failure, MFA)
- [ ] Authorization failures logged with user ID, IP, and attempted resource
- [ ] No secrets, tokens, or passwords in logs
- [ ] PII in logs is masked or excluded
- [ ] Alerts configured for anomalous auth patterns (spike in 401s/403s)

### Input Validation

- [ ] All SQL queries use parameterized statements
- [ ] Request body size limits enforced
- [ ] Input validated against strict schemas at API boundary
- [ ] File uploads validated for type, size, and scanned for malware
- [ ] CORS configured with explicit origin allowlist

### Security Headers

- [ ] HSTS, CSP, X-Content-Type-Options, X-Frame-Options all set
- [ ] CORS does not use wildcard origin with credentials
- [ ] API versioning in place to avoid breaking changes silently

---

## Quick Decision Reference

**"Which auth pattern should I use?"**
- User-facing web app -> OAuth 2.0 Authorization Code + PKCE, JWT in httpOnly cookie
- Mobile app -> Same as web, with secure storage for refresh token
- Service-to-service -> Client Credentials flow or API key + HMAC
- Third-party integration -> API key with scoped permissions

**"Which hashing algorithm?"**
- Passwords -> Argon2id, always
- Integrity checks -> SHA-256
- API signing -> HMAC-SHA256
- Never -> MD5, SHA-1 for anything security-related

**"Where do I put secrets?"**
- Dev -> `.env` file (gitignored)
- CI -> Pipeline secret variables
- Prod -> Secrets manager (Vault / AWS / GCP), fetched at runtime
