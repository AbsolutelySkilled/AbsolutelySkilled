<!-- Part of the international-seo AbsolutelySkilled skill. Load this file when
     implementing, auditing, or debugging hreflang tags. -->

# Hreflang Implementation Guide

Complete reference for implementing hreflang across HTML, HTTP headers, and XML
sitemaps. Covers valid language and region codes, x-default behavior, common mistakes,
framework-specific patterns, and debugging workflows.

---

## What hreflang does

The `hreflang` attribute tells Google which URL to serve to which language and/or
regional audience. It is a hint, not a directive - Google may override it when
conflicting signals (canonical tags, content language, internal links) point elsewhere.

hreflang solves two problems:
1. **Language targeting** - Serve French users the French page, not the English page
2. **Regional variants** - Distinguish `en-US` (with USD pricing) from `en-GB` (with GBP pricing)

It does NOT affect Bing or other search engines in the same way.

---

## Valid language and region codes

### Language codes (ISO 639-1)

Use two-letter lowercase codes for languages:

| Code | Language |
|---|---|
| `en` | English |
| `fr` | French |
| `de` | German |
| `es` | Spanish |
| `pt` | Portuguese |
| `it` | Italian |
| `ja` | Japanese |
| `ko` | Korean |
| `zh` | Chinese |
| `ar` | Arabic |
| `nl` | Dutch |
| `pl` | Polish |
| `ru` | Russian |
| `sv` | Swedish |
| `tr` | Turkish |

For Chinese, always specify the script variant - `zh-Hans` (Simplified) or `zh-Hant`
(Traditional) - rather than bare `zh`. Google accepts both BCP 47 and ISO 3166-1 for
country codes.

### Country codes (ISO 3166-1 alpha-2)

Use two-letter UPPERCASE codes for countries:

| Code | Country |
|---|---|
| `US` | United States |
| `GB` | United Kingdom |
| `CA` | Canada |
| `AU` | Australia |
| `DE` | Germany |
| `FR` | France |
| `ES` | Spain |
| `MX` | Mexico |
| `BR` | Brazil |
| `JP` | Japan |
| `KR` | South Korea |
| `CN` | China |
| `IN` | India |
| `SG` | Singapore |

### Common wrong codes

| Wrong | Correct | Why |
|---|---|---|
| `en-UK` | `en-GB` | UK is not an ISO 3166-1 code |
| `sp` | `es` | Spanish ISO code is `es` |
| `zh-CN` capitalization | `zh-Hans` or `zh-Hans-CN` | Prefer script variant for Chinese |
| `no` | `nb` or `nn` | Norwegian Bokmal (`nb`) and Nynorsk (`nn`) are the valid codes |
| `iw` | `he` | Hebrew old code; use `he` |

---

## Implementation method 1: HTML link tags

Place tags in the `<head>` of every page. Each page must list all its variants
including itself (self-reference) and x-default.

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title>Pricing - Example</title>

  <!-- Self-reference is required -->
  <link rel="canonical" href="https://example.com/en-us/pricing/" />

  <!-- Full hreflang set - every page in the group lists all others -->
  <link rel="alternate" hreflang="en-US"    href="https://example.com/en-us/pricing/" />
  <link rel="alternate" hreflang="en-GB"    href="https://example.com/en-gb/pricing/" />
  <link rel="alternate" hreflang="en-AU"    href="https://example.com/en-au/pricing/" />
  <link rel="alternate" hreflang="de"       href="https://example.com/de/pricing/" />
  <link rel="alternate" hreflang="fr"       href="https://example.com/fr/pricing/" />
  <link rel="alternate" hreflang="es"       href="https://example.com/es/pricing/" />
  <link rel="alternate" hreflang="x-default" href="https://example.com/pricing/" />
</head>
```

Absolute URLs only - never use relative paths in hreflang tags.

---

## Implementation method 2: HTTP headers

For non-HTML files (PDFs, JSON feeds) or when you cannot modify HTML, use HTTP
`Link` response headers. Format mirrors the HTML link element.

```
HTTP/1.1 200 OK
Content-Type: application/pdf
Link: <https://example.com/en-us/report.pdf>; rel="alternate"; hreflang="en-US",
      <https://example.com/de/report.pdf>; rel="alternate"; hreflang="de",
      <https://example.com/report.pdf>; rel="alternate"; hreflang="x-default"
```

**Nginx example:**
```nginx
location ~ /en-us/(.+\.pdf)$ {
    add_header Link '<https://example.com/en-us/$1>; rel="alternate"; hreflang="en-US", <https://example.com/de/$1>; rel="alternate"; hreflang="de", <https://example.com/$1>; rel="alternate"; hreflang="x-default"';
}
```

**Apache example (.htaccess):**
```apache
<FilesMatch "\.pdf$">
  Header add Link '<https://example.com/en-us/report.pdf>; rel="alternate"; hreflang="en-US"'
  Header append Link '<https://example.com/de/report.pdf>; rel="alternate"; hreflang="de"'
</FilesMatch>
```

---

## Implementation method 3: XML sitemap

Best for large sites where modifying every HTML template is impractical. Requires
the `xhtml` namespace declaration.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Group 1: /pricing/ page with all regional variants -->
  <url>
    <loc>https://example.com/en-us/pricing/</loc>
    <lastmod>2025-01-15</lastmod>
    <xhtml:link rel="alternate" hreflang="en-US"     href="https://example.com/en-us/pricing/"/>
    <xhtml:link rel="alternate" hreflang="en-GB"     href="https://example.com/en-gb/pricing/"/>
    <xhtml:link rel="alternate" hreflang="de"        href="https://example.com/de/pricing/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/pricing/"/>
  </url>

  <url>
    <loc>https://example.com/en-gb/pricing/</loc>
    <lastmod>2025-01-15</lastmod>
    <xhtml:link rel="alternate" hreflang="en-US"     href="https://example.com/en-us/pricing/"/>
    <xhtml:link rel="alternate" hreflang="en-GB"     href="https://example.com/en-gb/pricing/"/>
    <xhtml:link rel="alternate" hreflang="de"        href="https://example.com/de/pricing/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/pricing/"/>
  </url>

  <url>
    <loc>https://example.com/de/pricing/</loc>
    <lastmod>2025-01-15</lastmod>
    <xhtml:link rel="alternate" hreflang="en-US"     href="https://example.com/en-us/pricing/"/>
    <xhtml:link rel="alternate" hreflang="en-GB"     href="https://example.com/en-gb/pricing/"/>
    <xhtml:link rel="alternate" hreflang="de"        href="https://example.com/de/pricing/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/pricing/"/>
  </url>

</urlset>
```

Important: Every `<url>` entry must list the FULL hreflang group - not just its own tag.
The sitemap approach requires all variants to appear in the same sitemap file.

---

## x-default: when and how to use

`x-default` designates the fallback URL when no hreflang value matches the user's
language and country. It is required in every hreflang annotation set.

**Appropriate x-default targets:**
- Language/region selector page (`/choose-your-region/`)
- The most broadly applicable version (usually `en` or `en-US`)
- The homepage, if no language-specific versions exist for the path

```html
<!-- Language selector as x-default -->
<link rel="alternate" hreflang="x-default" href="https://example.com/" />

<!-- Default to en-US content -->
<link rel="alternate" hreflang="en-US"     href="https://example.com/en-us/page/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en-us/page/" />
```

x-default can point to the same URL as one of the language-targeted tags. That is
valid and common.

---

## Framework-specific implementation

### Next.js 13+ (App Router)

```tsx
// app/[locale]/page.tsx
import { Metadata } from 'next'

const locales = ['en-US', 'en-GB', 'de', 'fr', 'es'] as const
type Locale = typeof locales[number]

function buildHreflangAlternates(path: string) {
  const base = 'https://example.com'
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    languages[locale] = `${base}/${locale.toLowerCase()}${path}`
  }

  return {
    canonical: `${base}${path}`,
    languages: {
      ...languages,
      'x-default': `${base}${path}`,
    },
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: buildHreflangAlternates('/pricing/'),
  }
}
```

### Next.js 12 (Pages Router)

```tsx
// pages/[locale]/pricing.tsx
import Head from 'next/head'

const HreflangTags = ({ currentPath }: { currentPath: string }) => {
  const base = 'https://example.com'
  const variants = [
    { locale: 'en-US', path: `/en-us${currentPath}` },
    { locale: 'en-GB', path: `/en-gb${currentPath}` },
    { locale: 'de',    path: `/de${currentPath}` },
  ]

  return (
    <Head>
      {variants.map(({ locale, path }) => (
        <link key={locale} rel="alternate" hreflang={locale} href={`${base}${path}`} />
      ))}
      <link rel="alternate" hreflang="x-default" href={`${base}${currentPath}`} />
    </Head>
  )
}
```

### Nuxt 3

```typescript
// composables/useHreflang.ts
export function useHreflang(path: string) {
  const config = useRuntimeConfig()
  const base = config.public.siteUrl

  const locales = ['en-US', 'en-GB', 'de', 'fr']

  useHead({
    link: [
      ...locales.map(locale => ({
        rel: 'alternate',
        hreflang: locale,
        href: `${base}/${locale.toLowerCase()}${path}`,
      })),
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${base}${path}`,
      },
    ],
  })
}
```

### WordPress (programmatic via wp_head)

```php
<?php
// functions.php - add to theme or plugin

function add_hreflang_tags() {
    $current_url = get_permalink();
    $polylang_translations = function_exists('pll_the_languages')
        ? pll_get_post_translations(get_the_ID())
        : [];

    foreach ($polylang_translations as $lang_code => $post_id) {
        $url = get_permalink($post_id);
        echo '<link rel="alternate" hreflang="' . esc_attr($lang_code) . '" href="' . esc_url($url) . '" />' . "\n";
    }

    // x-default
    echo '<link rel="alternate" hreflang="x-default" href="' . esc_url(home_url('/')) . '" />' . "\n";
}
add_action('wp_head', 'add_hreflang_tags');
```

---

## hreflang for paginated content

When paginated content has language variants, hreflang applies to each paginated URL
independently. Do not use rel=prev/next in combination with hreflang at the set level.

```html
<!-- Page 2 of /de/blog/ -->
<link rel="canonical" href="https://example.com/de/blog/page/2/" />
<link rel="alternate" hreflang="de"        href="https://example.com/de/blog/page/2/" />
<link rel="alternate" hreflang="en"        href="https://example.com/en/blog/page/2/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/page/2/" />
```

Each paginated URL is its own distinct resource. The hreflang group for page 2 only
includes page 2 variants - not the root blog page.

---

## Debugging hreflang with Google Search Console

1. Open Google Search Console
2. Go to **Enhancements > International Targeting**
3. Click the **Language** tab to see hreflang errors

### Common error types

| Error message | Root cause | Resolution |
|---|---|---|
| "Return tag missing" | Page A lists page B, but B doesn't list A | Add the missing reciprocal tag to all referenced pages |
| "Unknown language tag" | Invalid ISO code (e.g., `en-uk`, `sp`) | Replace with valid ISO 639-1 + ISO 3166-1 codes |
| "Multiple x-default" | More than one `hreflang="x-default"` on a page | Remove duplicates; keep exactly one x-default per page |
| "No return tag from URL" | The linked URL returns a non-200 status | Fix the linked URL or update hreflang to point to a live URL |

### Third-party tools

- **Screaming Frog SEO Spider** - Crawls site and extracts all hreflang tags; surfaces missing
  return tags, invalid codes, and broken URLs in bulk
- **hreflang.org tester** - Paste a URL to validate its hreflang implementation
- **Google Rich Results Test** - Can render a single page and confirm tags are in the DOM
- **Sitebulb** - Visual hreflang cluster maps showing which pages reference which

---

## Quick checklist

Before deploying hreflang:

- [ ] Every page in a group lists all other pages in that group
- [ ] Every page is self-referenced in its own hreflang set
- [ ] x-default is present on every page in the group
- [ ] All URLs are absolute (https://...)
- [ ] Language codes use ISO 639-1 (lowercase)
- [ ] Country codes use ISO 3166-1 alpha-2 (uppercase)
- [ ] No broken URLs in hreflang attributes (all return 200)
- [ ] Canonical tags are consistent with hreflang targets
- [ ] Only one implementation method used per site (HTML OR sitemap OR HTTP headers)
