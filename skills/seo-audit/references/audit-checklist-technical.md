<!-- Part of the seo-audit AbsolutelySkilled skill. Load this file when
     performing or reviewing the Technical SEO section of an audit. -->

# Technical SEO Audit Checklist

Detailed verification steps, PASS/FAIL/WARN criteria, and fix guidance for all 10
technical SEO checks. For each check: what to look for, how to verify, what status
to assign, and which tool or action fixes it.

---

## T1 - Robots.txt Configured Correctly

**What to check:**
- File exists at `https://domain.com/robots.txt`
- No critical paths are disallowed (product pages, category pages, key content)
- Sitemap location is declared in the file
- No syntax errors (incorrect `User-agent`, typos in paths)

**How to verify:**
- Fetch the robots.txt directly in the browser
- Use Google Search Console > Settings > robots.txt Tester to check specific URLs
- Use Screaming Frog: Configuration > Robots.txt to simulate Googlebot crawl

**PASS/FAIL/WARN criteria:**
- PASS: File exists, sitemap declared, no critical pages disallowed, valid syntax
- WARN: File exists but sitemap not declared, or some low-traffic paths inadvertently blocked
- FAIL: File missing entirely, `/` is disallowed, critical templates are blocked, or
  robots.txt returns a non-200 status code

**Common fixes:**
- Add `Sitemap: https://domain.com/sitemap.xml` as the last line
- Replace `Disallow: /` with specific path-level disallows for admin/staging routes
- For WordPress: Settings > Reading > uncheck "Discourage search engines"

---

## T2 - XML Sitemap Valid and Submitted

**What to check:**
- Sitemap exists at `https://domain.com/sitemap.xml` (or sitemap index)
- All important URLs are included; no noindex URLs are listed
- No URLs returning 404 or 301 are in the sitemap
- Sitemap is submitted to Google Search Console and Bing Webmaster Tools
- `lastmod` values are present and accurate (not all the same date)

**How to verify:**
- Fetch the sitemap URL directly; validate XML with W3C XML Validator or Screaming Frog
- GSC > Sitemaps > check submitted sitemaps and last read date
- Screaming Frog > Sitemaps > Sitemap XML Export: compare to crawl data

**PASS/FAIL/WARN criteria:**
- PASS: Sitemap valid, submitted to GSC, no 404/redirect URLs inside, lastmod present
- WARN: Sitemap exists but not submitted to GSC, or contains a few redirect URLs
- FAIL: No sitemap, sitemap returns 404, XML is malformed, or more than 10% of URLs
  in sitemap return errors

**Common fixes:**
- Generate sitemap with Yoast SEO (WordPress), next-sitemap (Next.js), or Astro sitemap plugin
- Submit via GSC: Index > Sitemaps > Add new sitemap URL
- Remove noindex pages and 404s from sitemap; update programmatically via CMS hooks

---

## T3 - Canonical URLs Set on All Pages

**What to check:**
- Every indexable page has a `<link rel="canonical" href="...">` in `<head>`
- Canonical URLs are self-referencing on canonical pages (not pointing elsewhere)
- Paginated pages either canonicalize to page 1 or have unique canonicals (not all to page 1)
- URL parameter variants (filters, sort, tracking) canonicalize to the clean URL
- No canonical chains (canonical pointing to a page that itself has a different canonical)

**How to verify:**
- Screaming Frog: crawl site, Internal > filter by "Canonical" column
- Check `<head>` source on a sample of pages (View Source > Ctrl+F "canonical")
- Search Console: URL Inspection tool shows canonical Google selected vs declared

**PASS/FAIL/WARN criteria:**
- PASS: All indexable pages have a self-referencing canonical; parameter variants canonicalize correctly
- WARN: Canonical is missing on some page types, or inconsistent on pagination
- FAIL: No canonicals site-wide, canonical chains present, or canonical points to wrong URL
  (e.g., staging URL, HTTP instead of HTTPS)

**Common fixes:**
- Next.js: use `metadata.alternates.canonical` in `layout.tsx` or `generateMetadata`
- WordPress + Yoast: canonicals are auto-generated; check for plugin conflicts
- For URL parameter variants: use `rel="canonical"` in `<head>` pointing to the parameter-free URL

---

## T4 - No Redirect Chains (Max 1 Hop)

**What to check:**
- No URL redirects through more than 1 intermediate URL before reaching the final destination
- Internal links point to final destination URLs, not to URLs that redirect
- Old campaign/vanity URLs redirected directly to final pages
- HTTP > HTTPS redirect is a single 301 (not 301 > 301)

**How to verify:**
- Screaming Frog: Bulk Export > Response Codes > Redirects; look for chains flagged in the tool
- HTTPStatus.io or Redirect Path Chrome extension for spot-checking specific URLs
- Screaming Frog: Configuration > Spider > Follow Internal Redirects ON to find chain sources

**PASS/FAIL/WARN criteria:**
- PASS: All redirects are single-hop 301s; no chains detected
- WARN: A few redirect chains exist on low-traffic or old URLs; core pages are clean
- FAIL: Redirect chains on high-traffic pages, the homepage, or key landing pages; any 302 where
  a 301 should be used permanently

**Common fixes:**
- Update all internal links to point to the final destination URL
- Consolidate redirect chains by pointing the original URL directly to the final destination in the server config or `.htaccess`
- HTTP > HTTPS: configure server to do a single 301 redirect at the server level (not via CMS)

---

## T5 - HTTPS Everywhere, No Mixed Content

**What to check:**
- Site loads exclusively on HTTPS; HTTP redirects to HTTPS (301)
- No mixed content warnings in browser console (HTTP resources loaded on HTTPS page)
- SSL certificate is valid and not expiring within 30 days
- HSTS header present (`Strict-Transport-Security`)
- `www` and non-`www` resolve consistently (not both serving content)

**How to verify:**
- Open browser DevTools > Console and Network tabs; look for mixed content warnings
- SSL Labs: `ssllabs.com/ssltest/` for full certificate and HSTS assessment
- Check response headers: `curl -I https://domain.com` to verify HSTS header

**PASS/FAIL/WARN criteria:**
- PASS: All resources HTTPS, valid cert, HSTS set, consistent www/non-www resolution
- WARN: Mixed content on a few pages, cert expiring within 60 days, or no HSTS header
- FAIL: Site serving on HTTP with no redirect, mixed content warnings on key pages, expired
  or invalid SSL certificate

**Common fixes:**
- Update all hardcoded `http://` asset URLs in content and code to `https://`
- Renew SSL certificate; use Let's Encrypt with auto-renewal for cost-free certificates
- Set HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Configure 301 redirect from `www` to non-`www` (or vice versa) at DNS/server level

---

## T6 - Mobile-Friendly (Responsive or Adaptive)

**What to check:**
- Site passes Google's Mobile-Friendly Test
- Viewport meta tag present: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- No horizontal scrolling on mobile
- Touch targets (buttons, links) are at least 48x48px with adequate spacing
- Text readable without zooming (16px minimum body font size)
- No intrusive interstitials that block content on mobile

**How to verify:**
- Google Search Console: Mobile Usability report for site-wide issues
- Google Mobile-Friendly Test: `search.google.com/test/mobile-friendly`
- DevTools: Toggle Device Toolbar (Ctrl+Shift+M) and test at 375px and 768px

**PASS/FAIL/WARN criteria:**
- PASS: Passes Google's Mobile-Friendly Test, no GSC mobile usability errors, good touch targets
- WARN: Passes the test but some minor layout issues (small tap targets, slightly clipped content)
- FAIL: Fails Mobile-Friendly Test, viewport meta missing, site not usable on mobile screens

**Common fixes:**
- Add `<meta name="viewport" content="width=device-width, initial-scale=1">` if missing
- Use CSS `min-height: 48px; min-width: 48px` for all interactive elements
- Replace fixed pixel widths with relative units (`%`, `vw`, `rem`) in CSS

---

## T7 - Core Web Vitals Pass (LCP, CLS, INP)

**What to check:**
- LCP (Largest Contentful Paint): under 2.5s is PASS, 2.5-4s is WARN, over 4s is FAIL
- CLS (Cumulative Layout Shift): under 0.1 is PASS, 0.1-0.25 is WARN, over 0.25 is FAIL
- INP (Interaction to Next Paint): under 200ms is PASS, 200-500ms is WARN, over 500ms is FAIL
- Audit both mobile and desktop; Google uses mobile for ranking signals
- Check field data (real user data) not just lab data - they can differ significantly

**How to verify:**
- Google Search Console: Core Web Vitals report (field data from CrUX)
- PageSpeed Insights: `pagespeed.web.dev` for both lab and field data per URL
- Chrome DevTools: Performance panel and Lighthouse tab for lab measurements
- `web-vitals` JS library for RUM (Real User Monitoring) measurement

**PASS/FAIL/WARN criteria:**
- PASS: All three metrics pass on both mobile and desktop in field data (CrUX)
- WARN: One or two metrics in the "Needs Improvement" range; or passing in lab but failing in field
- FAIL: Any metric failing on mobile in field data; or template-wide failures affecting many URLs

**Common fixes:**
- LCP: preload hero image, use `fetchpriority="high"` on LCP image, optimize image format (WebP/AVIF),
  reduce TTFB with CDN and server-side caching
- CLS: always specify `width` and `height` attributes on images; use `aspect-ratio` CSS; avoid injecting content above the fold after load
- INP: reduce main thread blocking, split long tasks, use web workers for heavy computation

---

## T8 - No Orphan Pages

**What to check:**
- Every indexable page is reachable via internal links from at least one other page
- No pages exist only in the sitemap or accessed only via direct URL
- Orphans often appear after CMS migrations, content pruning, or faceted navigation removal
- Paginated pages are linked to from the page before them

**How to verify:**
- Screaming Frog: crawl site from homepage, then cross-reference crawl output against sitemap URLs
  - Pages in sitemap but not found in crawl = orphan candidates
- Sitebulb or Ahrefs Site Audit: dedicated orphan pages report

**PASS/FAIL/WARN criteria:**
- PASS: All sitemap URLs are also found in crawl; no pages with zero internal links
- WARN: A small number of low-traffic or archive pages are orphaned
- FAIL: Key pages (product pages, landing pages, blog posts) have zero internal links

**Common fixes:**
- Add links to orphaned pages from relevant hub pages, category listings, or navigation
- For paginated series: ensure page N links to page N+1 and N-1
- Add a dynamic "related posts" or "related products" module to ensure new content gets linked

---

## T9 - Clean URL Structure

**What to check:**
- URLs use lowercase letters and hyphens (not underscores or spaces)
- No tracking parameters (`?utm_source`) in canonical or crawlable URLs
- URL depth: no more than 3-4 levels deep for key content (`/blog/category/post-slug/`)
- No session IDs, user-specific tokens, or auto-generated numeric identifiers in indexed URLs
- URL slug contains the target keyword (where practical)

**How to verify:**
- Screaming Frog: URL column; filter for uppercase, underscores, or very long URLs
- Export all indexed URLs from GSC and check for parameter pollution

**PASS/FAIL/WARN criteria:**
- PASS: All URLs lowercase, hyphens only, no parameters on indexed pages, max 4 levels deep
- WARN: Some legacy URLs with underscores, a few deep hierarchy paths, minor parameter exposure
- FAIL: URLs with session IDs indexed, large-scale parameter pollution in index, URLs using
  non-ASCII characters without encoding

**Common fixes:**
- 301 redirect old underscore URLs to hyphen equivalents
- Add URL parameter handling in GSC: Settings > URL Parameters (legacy but still functional)
- Implement canonical tags on all parameterized URL variants

---

## T10 - Rendering Strategy Appropriate

**What to check:**
- For client-side rendered (CSR) apps: key content is not hidden behind JavaScript that
  Googlebot can't execute reliably
- For server-side rendered (SSR) or static (SSG) apps: confirm full HTML is in the initial
  response, not populated by client-side JS
- Dynamic rendering (serving static HTML to bots, JS to browsers) is documented and working
  if implemented
- `<noscript>` tags provide meaningful fallback content where applicable

**How to verify:**
- View source (`Ctrl+U`) vs. Inspect Element: source should show content, not empty `<div id="app">`
- Google Search Console > URL Inspection > View Crawled Page > HTML and Screenshot tabs
  confirm what Googlebot actually sees
- Fetch as Google via URL Inspection: compare rendered and non-rendered HTML

**PASS/FAIL/WARN criteria:**
- PASS: Content fully present in initial HTML response OR Google's URL Inspection confirms
  full rendering with no content gaps
- WARN: Some secondary content or pagination loaded via JS but primary content is in HTML
- FAIL: Primary content (headings, body text, links) only visible after JavaScript execution;
  Google's crawl snapshot shows blank or skeleton page

**Common fixes:**
- Next.js: use `generateStaticParams` (SSG) or `export default async function Page()` with
  server components to ensure HTML is served
- Vue/React SPAs: migrate key pages to SSR or pre-rendering; use Next.js, Nuxt, or Astro
- Load `on-site-seo` skill for framework-specific rendering fix patterns
