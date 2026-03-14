<!-- Part of the appsec-owasp AbsolutelySkilled skill. Load this file when configuring HTTP security headers, Content Security Policy directives, or comparing frame protection mechanisms. -->

# Security Headers Reference

Complete guide to HTTP security headers for web applications. Each header is
described with its purpose, recommended value, common pitfalls, and browser
support notes.

---

## 1. Content-Security-Policy (CSP)

The most powerful and complex security header. CSP instructs the browser on
which sources are allowed to load scripts, styles, images, fonts, and other
resources. A well-configured CSP neutralizes most XSS attacks even if output
encoding fails.

### Directives

| Directive | Controls | Recommended value |
|-----------|----------|-------------------|
| `default-src` | Fallback for all fetch directives not explicitly set | `'self'` |
| `script-src` | JavaScript sources | `'self'` (add `'nonce-{random}'` for inline scripts) |
| `style-src` | CSS sources | `'self'` (add `'unsafe-inline'` only if inline styles are unavoidable) |
| `img-src` | Image sources | `'self' data: https://cdn.example.com` |
| `font-src` | Font sources | `'self' https://fonts.gstatic.com` |
| `connect-src` | XHR, fetch, WebSocket endpoints | `'self' https://api.example.com` |
| `frame-src` | `<frame>` and `<iframe>` src | `'none'` unless embedding content |
| `frame-ancestors` | Which origins can embed THIS page | `'none'` or `'self'` |
| `object-src` | `<object>`, `<embed>`, `<applet>` | `'none'` - Flash is dead |
| `base-uri` | `<base>` href values | `'self'` - prevents base tag hijacking |
| `form-action` | Where forms can submit | `'self'` |
| `upgrade-insecure-requests` | Auto-upgrade HTTP to HTTPS | Include (no value) |
| `block-all-mixed-content` | Block HTTP resources on HTTPS pages | Include if not using upgrade-insecure-requests |
| `report-uri` (legacy) | Where to POST violation reports | `https://your-csp-endpoint.example.com/report` |
| `report-to` | Modern reporting API endpoint | JSON endpoint name |

### Starter policy (strict)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

### Nonce-based inline scripts (preferred over `unsafe-inline`)

When your app requires inline scripts, use a per-request nonce instead of
`'unsafe-inline'`. The nonce must be cryptographically random and change on
every page load.

```typescript
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

function cspMiddleware(req: Request, res: Response, next: NextFunction) {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.cspNonce = nonce;

  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self';`
  );
  next();
}

// In your template: <script nonce="<%= nonce %>">...</script>
```

### CSP report-only mode (for incremental rollout)

Deploy CSP in report-only mode first to discover violations without breaking
production. Migrate to enforcing once violations are resolved.

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
```

### Common CSP mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| `script-src 'unsafe-inline'` | Defeats XSS protection entirely | Use nonces or hashes for inline scripts |
| `script-src *` or `script-src https:` | Any HTTPS script source is allowed (includes attacker-controlled CDNs) | Enumerate exact domains |
| Missing `object-src 'none'` | Flash/Java plugins can bypass CSP | Always include `object-src 'none'` |
| Missing `base-uri 'self'` | Attacker injects `<base href>` to hijack relative URLs | Always include `base-uri 'self'` |
| `'unsafe-eval'` in script-src | Allows `eval()`, `setTimeout(string)`, `new Function()` | Refactor code to eliminate eval; required if using some legacy libraries |

---

## 2. Strict-Transport-Security (HSTS)

Forces browsers to use HTTPS for all future requests to the domain. Once set,
the browser ignores HTTP responses and goes directly to HTTPS for the configured
duration.

### Recommended value

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

| Parameter | Meaning |
|-----------|---------|
| `max-age=63072000` | Cache HSTS policy for 2 years (in seconds) |
| `includeSubDomains` | Apply to all subdomains - include only if all subdomains serve HTTPS |
| `preload` | Request inclusion in browser HSTS preload lists (see hstspreload.org) |

### Rollout strategy

Start with a short max-age and expand gradually:

```
# Week 1 - test
Strict-Transport-Security: max-age=300

# Week 2 - expand
Strict-Transport-Security: max-age=86400

# Week 4 - include subdomains
Strict-Transport-Security: max-age=86400; includeSubDomains

# Week 8 - full production value
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**Warning:** Only set `max-age` values over a week when you are confident that
all endpoints - including subdomains - serve valid HTTPS. HSTS errors cannot
be overridden by end users (by design). A misconfigured HSTS + expired cert
will lock users out for the duration of max-age.

---

## 3. X-Frame-Options vs frame-ancestors

Both protect against clickjacking (embedding your page in an `<iframe>` to
trick users into clicking hidden elements).

| Header | Spec status | Values | Notes |
|--------|-------------|--------|-------|
| `X-Frame-Options` | Obsolete but widely supported | `DENY`, `SAMEORIGIN` | Cannot specify multiple origins |
| `frame-ancestors` (CSP directive) | Current standard | `'none'`, `'self'`, specific URIs | Supersedes X-Frame-Options; more flexible |

### Recommendation

Use `frame-ancestors` in your CSP and keep `X-Frame-Options` as a fallback for
older browsers.

```
# CSP directive (preferred)
Content-Security-Policy: frame-ancestors 'none';

# Fallback header
X-Frame-Options: DENY
```

When `frame-ancestors` and `X-Frame-Options` both exist, modern browsers honor
`frame-ancestors` and ignore `X-Frame-Options`.

| Value | Effect |
|-------|--------|
| `frame-ancestors 'none'` | Page cannot be embedded anywhere |
| `frame-ancestors 'self'` | Page can only be embedded by same origin |
| `frame-ancestors https://dashboard.example.com` | Specific allowed parent |

---

## 4. X-Content-Type-Options

Prevents browsers from MIME-sniffing a response away from the declared
Content-Type. Without this header, a browser might execute an uploaded text file
as JavaScript if it looks like a script.

```
X-Content-Type-Options: nosniff
```

`nosniff` is the only valid value. Always set it. There is no reason not to.

---

## 5. Referrer-Policy

Controls how much referrer information is sent in the `Referer` header when
navigating away from your site. Without this header, full URLs (including query
params with tokens or PII) are leaked to third-party sites.

| Value | What is sent | When to use |
|-------|-------------|-------------|
| `no-referrer` | Nothing | Maximum privacy; breaks some analytics |
| `no-referrer-when-downgrade` | Full URL to HTTPS, nothing to HTTP | Browser default (pre-2021); avoid |
| `origin` | Just the origin (e.g., `https://example.com`) | When downstream needs origin but not path |
| `strict-origin` | Origin on same security level, nothing on downgrade | Good for public pages |
| `origin-when-cross-origin` | Full URL same-origin, origin cross-origin | Common choice |
| `strict-origin-when-cross-origin` | Full URL same-origin, origin cross-origin, nothing on HTTPS->HTTP | **Recommended default** |
| `unsafe-url` | Full URL everywhere | Never use |

```
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 6. Permissions-Policy (formerly Feature-Policy)

Restricts which browser features the page and embedded iframes can use. Disabling
unused features reduces the attack surface from malicious scripts.

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
```

Syntax: `feature=()` disables entirely; `feature=(self)` allows only same-origin;
`feature=(self "https://trusted.com")` allows same-origin and specific third party.

| Feature | Recommendation |
|---------|----------------|
| `camera` | `()` unless you build video chat |
| `microphone` | `()` unless voice features are needed |
| `geolocation` | `()` unless location features are used |
| `payment` | `()` unless you use Payment Request API |
| `usb` | `()` unless you interface with USB devices |
| `interest-cohort` | `()` - opt out of FLoC/Topics API tracking |

---

## 7. Cross-Origin Headers (CORP, COEP, COOP)

These three headers work together to provide stronger process isolation and are
required for features like `SharedArrayBuffer` and high-resolution timers.

### Cross-Origin-Resource-Policy (CORP)

```
Cross-Origin-Resource-Policy: same-origin
```

Prevents other origins from loading this resource. Values: `same-origin`,
`same-site`, `cross-origin`.

### Cross-Origin-Embedder-Policy (COEP)

```
Cross-Origin-Embedder-Policy: require-corp
```

Requires that all cross-origin resources opt in to being loaded (via CORP or
CORS). Required to enable `SharedArrayBuffer`.

### Cross-Origin-Opener-Policy (COOP)

```
Cross-Origin-Opener-Policy: same-origin
```

Isolates the browsing context group, preventing cross-origin window references.
Mitigates Spectre-class side-channel attacks.

**To enable SharedArrayBuffer (e.g., for WebAssembly workloads):**

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

---

## 8. Express.js - Full secure header configuration

```typescript
import helmet from 'helmet';
import { Express } from 'express';
import crypto from 'crypto';

export function applySecurityHeaders(app: Express): void {
  // Generate a per-request nonce for inline scripts
  app.use((_req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            (_req, res) => `'nonce-${(res as any).locals.cspNonce}'`,
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
    })
  );

  app.use((_req, res, next) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'
    );
    next();
  });
}
```

---

## 9. Testing your headers

| Tool | How to use |
|------|-----------|
| [securityheaders.com](https://securityheaders.com) | Paste your URL, get a grade and per-header breakdown |
| [Mozilla Observatory](https://observatory.mozilla.org) | Comprehensive scan including TLS, cookies, and CORS |
| `curl -I https://yoursite.com` | Quick CLI check of response headers |
| Chrome DevTools > Network > Response Headers | Inspect headers for any page load |
| OWASP ZAP passive scan | Automated header check as part of DAST scanning |

### Minimum passing checklist

- [ ] `Content-Security-Policy` set and does not contain `unsafe-inline` in script-src
- [ ] `Strict-Transport-Security` with `max-age` >= 31536000
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` or `frame-ancestors 'none'` in CSP
- [ ] `Referrer-Policy` set to anything other than `unsafe-url` or browser default
- [ ] `Permissions-Policy` restricts at minimum camera, microphone, geolocation
- [ ] No `Server` or `X-Powered-By` headers leaking technology stack info
