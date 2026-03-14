<!-- Part of the international-seo AbsolutelySkilled skill. Load this file when
     choosing or changing URL structure for international sites. -->

# International URL Structure Strategy

Choosing between ccTLD, subdomain, and subdirectory is one of the most consequential
decisions in international SEO. It affects domain authority, geo-signal strength,
operational complexity, and how difficult it will be to migrate later. This guide
covers the full trade-off analysis, server configuration, and migration strategy.

---

## The three options

### Option 1: Country-code top-level domain (ccTLD)

Each country gets its own registered top-level domain.

```
example.de     (Germany)
example.fr     (France)
example.co.uk  (UK - .co.uk is common but .uk is also used)
example.com.au (Australia)
example.com.br (Brazil)
```

**Strongest geo-signal** - A `.de` domain is inherently German to Google, without
any additional configuration. Google uses the ccTLD as a primary geo-targeting signal.

### Option 2: Subdomain

Each country or language gets a subdomain of the main domain.

```
de.example.com
fr.example.com
en-gb.example.com
au.example.com
```

**Medium geo-signal** - Google treats subdomains as potentially separate sites but
can be told to associate them with a parent domain via Google Search Console.

### Option 3: Subdirectory (subfolder)

All countries/languages live under the same domain with path-based separation.

```
example.com/de/
example.com/fr/
example.com/en-gb/
example.com/en-au/
```

**Weakest geo-signal without GSC** - Requires explicit geo-targeting configuration
in Google Search Console for each subdirectory property. However, benefits from
full domain authority consolidation.

---

## Decision matrix

| Factor | ccTLD | Subdomain | Subdirectory |
|---|---|---|---|
| Geo-signal (without GSC) | Strongest | Medium | Weakest |
| Geo-signal (with GSC + hreflang) | Strongest | Strong | Adequate |
| Domain authority consolidation | None (each domain is separate) | Partial | Full |
| New market launch speed | Slow (register, propagate, configure) | Medium | Fast |
| Cost per market | High (TLD registration, hosting per domain) | Medium | Low |
| Hosting flexibility | Each domain needs own setup | Can share or split | All on one server |
| CDN setup complexity | Per-domain | Moderate | Single origin |
| Team complexity | High (separate deployments) | Medium | Low |
| Link equity isolation | Yes (links to .de don't help .com) | Partial | No (links flow to root) |
| Local trust signals | High (local users trust local TLD) | Medium | Low |
| Best for | Enterprise, committed local markets | Flexible mid-size expansion | Single-domain, resource-constrained |

---

## When to choose each option

### Choose ccTLD when:
- You have dedicated local marketing budgets and in-country teams for each market
- Your target markets strongly prefer local TLDs (Japan `.jp`, Germany `.de`)
- You want complete operational independence between regions
- Domain authority isolation is acceptable (or preferred for brand/legal reasons)
- You can sustain the infrastructure overhead of multiple domains

### Choose subdomain when:
- You want hosting flexibility (serve `de.example.com` from a German data center)
- You need separate deployments per region but want some brand connection to root
- You're adding international markets incrementally and aren't sure of long-term commitment
- You have separate CMS instances per region

### Choose subdirectory when:
- You're a startup or SMB without dedicated international teams
- You want all link equity and domain authority to benefit every market
- You have a single CMS or application that can handle locale-based routing
- Speed of launch matters more than maximum geo-signal strength
- You're expanding to 2-5 markets and may reverse course

---

## Domain authority and link equity implications

### Subdirectory (authority consolidates)

A backlink to `example.com/de/blog/post/` flows authority to the root `example.com`
domain. Every market benefits from every link, regardless of which market earned it.

```
Link to example.com/de/blog/  ---> flows to --> example.com (all markets benefit)
Link to example.com/fr/blog/  ---> flows to --> example.com (all markets benefit)
```

This is the key SEO advantage of subdirectories for newer or smaller sites that
need to build authority efficiently.

### ccTLD (authority is isolated)

Links to `example.de` don't help `example.com` or `example.fr`. Each domain must
build its own authority independently.

```
Link to example.de  ---> only benefits example.de
Link to example.fr  ---> only benefits example.fr
```

This is fine for large brands with strong local link building in each market, but
costly for sites starting from scratch in a new country.

### Subdomain (partial sharing)

Google's treatment of subdomains has evolved. Currently, Google generally treats
subdomains as part of the parent domain for ranking purposes (especially with GSC
association), but the behavior is less predictable than subdirectories.

---

## Server configuration

### Subdirectory with Nginx

Route all locale-prefixed paths to the same application, passing locale via header
or URL parameter:

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    # Route locale-prefixed paths to application
    location ~ ^/(de|fr|es|pt-br)(/.*)?$ {
        proxy_pass http://app_backend;
        proxy_set_header X-Locale $1;
        proxy_set_header Host $host;
    }

    # Default (en or x-default)
    location / {
        proxy_pass http://app_backend;
        proxy_set_header X-Locale "en";
        proxy_set_header Host $host;
    }
}
```

### Subdomain with Nginx

Each subdomain routes to potentially different backends:

```nginx
server {
    listen 443 ssl;
    server_name de.example.com;

    location / {
        proxy_pass http://de_app_backend;
        proxy_set_header Host $host;
    }
}

server {
    listen 443 ssl;
    server_name fr.example.com;

    location / {
        proxy_pass http://fr_app_backend;
        proxy_set_header Host $host;
    }
}
```

### ccTLD with shared backend (Nginx virtual hosts)

```nginx
server {
    listen 443 ssl;
    server_name example.de;
    ssl_certificate /etc/ssl/example.de/fullchain.pem;
    ssl_certificate_key /etc/ssl/example.de/privkey.pem;

    location / {
        proxy_pass http://app_backend;
        proxy_set_header X-Country "DE";
        proxy_set_header X-Lang "de";
        proxy_set_header Host $host;
    }
}
```

### Apache subdirectory (.htaccess)

```apache
# Rewrite rules for locale routing
RewriteEngine On

# Serve locale-specific content
RewriteRule ^(de|fr|es)(/.*)?$  /index.php?locale=$1&path=$2 [L,QSA]

# Default locale
RewriteRule ^(.*)$ /index.php?locale=en&path=$1 [L,QSA]
```

---

## CDN configuration for international sites

### Cloudflare (subdirectory or subdomain)

Use Cloudflare's geo-routing with Cache Rules to serve regional variants efficiently:

```
# Cloudflare Transform Rules - set X-Country header
When: Country equals "DE"
Then: Set request header "X-Target-Locale" to "de"

When: Country equals "FR"
Then: Set request header "X-Target-Locale" to "fr"
```

For subdirectories, configure Page Rules to cache `/de/*` separately from `/fr/*`:

```
Cache Rule: example.com/de/*
  Edge TTL: 4 hours
  Cache Key: Include URL path (includes /de/ prefix)
```

### AWS CloudFront (ccTLD or subdomain)

Create separate distributions per domain/subdomain, each pointing to the same or
different origin:

```json
{
  "Origins": {
    "de.example.com": { "DomainName": "app.eu-central-1.example.com" },
  },
  "DefaultCacheBehavior": {
    "ForwardedValues": {
      "Headers": ["Accept-Language", "CloudFront-Viewer-Country"]
    }
  }
}
```

---

## Migration paths

### Migrating from subdomain to subdirectory

1. Set up subdirectory structure on root domain
2. Copy content and implement hreflang on new paths
3. Submit new paths to GSC and request indexing
4. Set up 301 redirects from old subdomains
5. Monitor Search Console for coverage errors and ranking changes
6. Wait 2-4 weeks before evaluating impact (crawl/index lag)

```nginx
# Redirect de.example.com to example.com/de/
server {
    server_name de.example.com;
    return 301 https://example.com/de$request_uri;
}
```

### Migrating from ccTLD to subdirectory

This is the highest-risk migration. Each ccTLD has its own ranking history.

1. Announce the consolidation in GSC (remove ccTLD properties after migration)
2. Set up subdirectory paths with exact URL parity where possible
3. Implement hreflang on new paths before redirecting
4. 301 redirect the entire ccTLD to the subdirectory equivalent
5. Monitor for 3-6 months - ccTLD migrations can take longer to stabilize

```nginx
# Redirect example.de to example.com/de/
server {
    server_name example.de;
    return 301 https://example.com/de$request_uri;
}
```

### Migrating from subdirectory to ccTLD

Lower risk for SEO than the reverse, but requires sustained link building on new domains.

1. Register and configure ccTLDs
2. Set up 301 redirects from subdirectory to ccTLD
3. Update hreflang to reference ccTLD URLs
4. Update internal links sitewide
5. Build local backlinks to the new ccTLD - existing root domain links will not transfer

---

## Google Search Console geo-targeting

For non-ccTLD URLs, configure GSC geo-targeting per property:

- **Root domain** (`example.com`) - Set to the default market, or leave blank for global
- **Subdirectory** (`example.com/de/`) - Add as a separate property, set country to Germany
- **Subdomain** (`de.example.com`) - Add as a separate property, set country to Germany
- **ccTLD** (`example.de`) - Cannot set geo-targeting; inherits from TLD

To add a subdirectory property in GSC:
1. Click "Add property" in GSC
2. Choose "URL prefix" and enter `https://example.com/de/`
3. Verify ownership (DNS TXT, HTML file, or Google Analytics)
4. Go to Settings > International Targeting > Country
5. Select the target country

---

## Recommendation summary

For most teams building international presence:

1. **Starting out with 1-3 languages**: Use subdirectories. Fast, cheap, authority
   consolidates, easy to reverse if a market doesn't take off.

2. **Growing to 5+ markets with budget**: Consider subdomains for hosting flexibility,
   especially if markets need different tech stacks or deployment cadences.

3. **Enterprise with committed local market investment**: ccTLDs for markets that
   matter most. Use subdirectories for smaller or experimental markets.

4. **Never**: Auto-detect and redirect by IP without offering an override. This blocks
   Googlebot from crawling regional variants.
