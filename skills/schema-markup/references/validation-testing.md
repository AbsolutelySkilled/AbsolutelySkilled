<!-- Part of the schema-markup AbsolutelySkilled skill. Load this file when
     validating structured data, debugging schema errors, or setting up CI/CD schema checks. -->

# Validation & Testing for Structured Data

Structured data errors are silent - invalid JSON-LD is simply ignored by Google with
no visible error. A working rich result requires syntactically valid JSON-LD, schema.org
vocabulary compliance, and meeting Google's content guidelines. This file covers the
tools and workflows to catch errors before they reach production.

---

## Validation tools overview

| Tool | When to use | URL |
|---|---|---|
| Google Rich Results Test | Primary check before deploy - tests live URL or code snippet for rich result eligibility | search.google.com/test/rich-results |
| Schema.org Validator | Checks schema.org vocabulary compliance (catches typos in property names) | validator.schema.org |
| Google Search Console > Enhancements | Monitor rich result health in production over time | search.google.com/search-console |
| Lighthouse SEO Audit | Quick check in dev tools / CI - flags structured data issues among other SEO problems | Built into Chrome DevTools |

---

## Google Rich Results Test

The primary tool for checking whether a page's structured data qualifies for a rich
result. Accepts either a live URL or pasted HTML/JSON-LD code snippet.

**How to use:**
1. Go to https://search.google.com/test/rich-results
2. Paste a URL or paste HTML directly
3. Review detected rich result types and any errors/warnings

**Output interpretation:**
- **Eligible for rich results** - Schema is valid and meets requirements
- **Warnings** - Schema is valid but missing recommended fields (rich result may be partial)
- **Errors** - Required fields missing or invalid values; rich result suppressed

**Common errors and fixes:**

| Error message | Cause | Fix |
|---|---|---|
| "Missing field 'name'" | Required property absent | Add the `name` property to the root type |
| "Either 'offers', 'review', or 'aggregateRating' should be specified" | Product type without qualifying nested property | Add at least one of these three objects |
| "Invalid URL in field 'availability'" | Using `"InStock"` instead of full URL | Use `"https://schema.org/InStock"` |
| "Invalid value for field 'ratingValue'" | Rating is a number not within 0-5 range | Ensure value is between 0 and 5; use string representation `"4.5"` |
| "Invalid value for field 'position'" | BreadcrumbList position values are not sequential from 1 | Start at 1, increment by 1 for each item |
| "Invalid ISO 8601 date" | Dates formatted incorrectly | Use `YYYY-MM-DD` for dates, `YYYY-MM-DDTHH:MM` for datetimes |

---

## Schema.org Validator

Tests vocabulary compliance against the schema.org specification. Catches property
name typos (e.g., `ratingValues` instead of `ratingValue`) that the Rich Results
Test may not surface.

**How to use:**
1. Go to https://validator.schema.org
2. Paste JSON-LD or enter a URL
3. Review property warnings

Note: The schema.org validator flags issues with the vocabulary itself but does not
test Google's specific rich result requirements. Use both tools for full coverage.

---

## Google Search Console Enhancements

After deploying structured data to production, monitor ongoing health in Search Console
under **Enhancements** in the left sidebar. Each supported schema type has its own
report (FAQs, Products, Breadcrumbs, Events, etc.).

**What to monitor:**
- **Valid items** - Pages with correct schema producing rich results
- **Valid with warnings** - Schema valid but missing recommended fields
- **Invalid** - Errors preventing rich results; Google provides the specific error message and affected URLs

**Workflow for fixing production errors:**
1. Open the relevant Enhancement report
2. Click an error entry to see affected URLs and the specific error
3. Fix the schema in your codebase
4. Re-deploy
5. Use the "Validate Fix" button in Search Console to request re-crawl (results in 1-7 days)

---

## Lighthouse SEO Audit

Lighthouse runs in Chrome DevTools (Audits tab), via the CLI, or in CI/CD. The SEO
category includes a "Structured data is valid" check.

**Run via CLI:**
```bash
npx lighthouse https://example.com --only-categories=seo --output json | \
  jq '.categories.seo.auditRefs[] | select(.id == "structured-data")'
```

**Limitations:** Lighthouse's structured data check is basic - it detects invalid
JSON but does not check schema.org property requirements or Google's rich result
eligibility rules. Use it as a first-pass sanity check, not a replacement for the
Rich Results Test.

---

## CI/CD integration

Automate schema validation in your pipeline to catch regressions before deploy.

### Option 1 - schema-dts type checking (TypeScript)

`schema-dts` is a Google-maintained TypeScript type definitions package for schema.org.
It catches property name errors and type mismatches at build time.

```bash
npm install schema-dts
```

```typescript
import { Product, WithContext } from 'schema-dts';

const productSchema: WithContext<Product> = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Running Shoes Pro X",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "129.99",
    "availability": "https://schema.org/InStock"
  }
};
// TypeScript will error on unknown properties or wrong value types
```

### Option 2 - structured-data-testing-tool CLI

Google deprecated its standalone CLI, but the community-maintained `structured-data-linter`
can validate JSON-LD files in CI:

```bash
npm install -g structured-data-linter
structured-data-linter path/to/schema.json
```

### Option 3 - Playwright / Puppeteer extraction test

Extract and validate JSON-LD from rendered HTML in an end-to-end test:

```typescript
// Using Playwright
import { test, expect } from '@playwright/test';

test('product page has valid JSON-LD', async ({ page }) => {
  await page.goto('/products/running-shoes');

  const schemas = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(s => JSON.parse(s.textContent ?? '{}'));
  });

  const product = schemas.find(s => s['@type'] === 'Product');
  expect(product).toBeDefined();
  expect(product?.name).toBeTruthy();
  expect(product?.offers?.priceCurrency).toBe('USD');
  expect(product?.offers?.availability).toBe('https://schema.org/InStock');
});
```

### Option 4 - GitHub Actions with Rich Results Test API

Google provides a Rich Results Test API (paid, part of Search API) for automated
URL testing. For most projects, the Playwright extraction test above is sufficient
without requiring API access.

---

## Framework-specific patterns

### Next.js App Router

Inject JSON-LD as a `<script>` tag inside the page component. Use `JSON.stringify`
with a replacer to prevent XSS via user-generated content in schema values.

```tsx
// app/products/[slug]/page.tsx
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ProductPage({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JsonLd data={schema} />
      <h1>{product.name}</h1>
    </>
  );
}
```

For dynamic pages, generate schema data server-side using the same data fetching
function that populates page content to ensure schema stays in sync with displayed data.

### Nuxt 3

Use `useHead()` composable to inject structured data. This works with both SSR and
SSG rendering modes.

```typescript
// pages/products/[slug].vue
<script setup lang="ts">
const { data: product } = await useFetch(`/api/products/${route.params.slug}`);

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value?.name,
        offers: {
          '@type': 'Offer',
          price: product.value?.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }
      })
    }
  ]
});
</script>
```

### Astro

In Astro components, inject the script tag directly in the `<head>` slot or inline
in the component. `JSON.stringify` is called at build time for static pages.

```astro
---
// src/pages/products/[slug].astro
const { product } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "USD"
  }
};
---

<html>
  <head>
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  </head>
  <body>
    <h1>{product.name}</h1>
  </body>
</html>
```

---

## Common validation gotchas

**JSON syntax errors** - A single trailing comma or unescaped quote in a description
field breaks the entire JSON-LD block. Validate JSON syntax separately from schema
compliance: `JSON.parse(yourSchemaString)` in the browser console is the fastest check.

**Missing `@context` on nested types** - Only the root object needs `"@context": "https://schema.org"`.
Nested objects like `Offer`, `AggregateRating`, and `PostalAddress` should NOT repeat `@context`.

**Date format mismatches** - Google requires ISO 8601 dates. `"2025-3-1"` is invalid;
use `"2025-03-01"`. For datetimes: `"2025-03-01T09:00:00"` or `"2025-03-01T09:00:00+05:30"`.

**Duration format** - ISO 8601 durations use `PT` prefix for time: `PT30M` (30 minutes),
`PT1H30M` (1.5 hours), `P1Y` (1 year). `"30 minutes"` as a plain string is invalid.

**Schema in SPAs** - In Single Page Applications, ensure JSON-LD is rendered in the
initial server-side HTML, not injected only by client-side JavaScript. Googlebot
can execute JavaScript but prefers statically rendered structured data.
