<!-- Part of the programmatic-seo AbsolutelySkilled skill. Load this file when
     designing pSEO page templates, building data pipelines, or implementing
     bulk static generation with Next.js or Astro. -->

# pSEO Template Generation

Deep reference for designing templates, sourcing data, generating pages at scale,
and enforcing quality before publication.

---

## Template anatomy

A pSEO template has three zones that must be explicitly designed:

```
┌─────────────────────────────────────────────┐
│  HEADER FORMULA (semi-unique)               │
│  H1: [Service] in [City], [State]           │
│  Meta: Best [Service] in [City] | [Brand]   │
├─────────────────────────────────────────────┤
│  UNIQUE DATA ZONES (per-page data)          │
│  ● Local statistics / market data           │
│  ● Provider list / inventory / prices       │
│  ● User reviews / ratings                  │
│  ● Comparison table rows                   │
├─────────────────────────────────────────────┤
│  SUPPORTING CONTENT (boilerplate)           │
│  ● How it works explanation                 │
│  ● FAQs (partially templatized)             │
│  ● Trust signals (partly unique)            │
├─────────────────────────────────────────────┤
│  INTERNAL LINKS (auto-generated)            │
│  ● Related pages sidebar/section            │
│  ● Breadcrumb navigation                   │
│  ● Hub page back-link                      │
├─────────────────────────────────────────────┤
│  CTA (boilerplate + personalized)           │
│  ● Primary action tied to page context      │
└─────────────────────────────────────────────┘
```

**Header formula patterns:**

| Page type | H1 formula | Title tag formula |
|---|---|---|
| Location | `Best [Service] in [City], [State]` | `Top [N] [Service] in [City] ([Year])` |
| Comparison | `[Tool A] vs [Tool B]: Full Comparison` | `[Tool A] vs [Tool B] - Which is Better?` |
| Tool/Calculator | `[Currency] to [Currency] Converter` | `Convert [Currency] to [Currency] - Live Rate` |
| Aggregator | `Best [Category] in [Location]` | `[N] Best [Category] in [Location] ([Year])` |
| Glossary | `What is [Term]? Definition & Examples` | `[Term] Definition - [Brand]` |

> Always include the year in title tags for pages where freshness is a ranking factor
> (comparison pages, top-N aggregators). Use a `currentYear` slot populated at build
> time - never hard-code.

---

## Data sourcing strategies

### Tier 1 - Proprietary / user-generated data (highest moat)

Data that only you have. Google cannot find this elsewhere, so pages are inherently unique.

- **Product database**: inventory, pricing, SKU attributes
- **User reviews and ratings**: collected via your platform
- **Transaction data**: average deal size, volume, completion rate
- **Behavioral data**: "most searched for in [city]" signals

### Tier 2 - Licensed dataset APIs

Paid APIs where the license restricts redistribution. Other pSEO competitors cannot
replicate your exact dataset.

- **Yelp Fusion API** - business listings, reviews, hours
- **Google Places API** - location data, ratings, photos
- **Clearbit** - company enrichment data for B2B pSEO
- **SerpAPI** - SERP data for comparison research pages
- **Numerator / Nielsen** - consumer market data (expensive, high moat)

### Tier 3 - Aggregated public data (lowest moat)

Free and open data that anyone can use. Low moat but fast to get started.

- **US Census Bureau** - population, income, demographics by city
- **BLS.gov** - labor market data, wage data by metro
- **Data.gov** - government open datasets by topic
- **Wikipedia data dumps** - useful for glossary and entity pages
- **OpenStreetMap** - geographic data for location pages

**Data freshness requirements by page type:**

| Page type | Stale threshold | Update strategy |
|---|---|---|
| Tool/calculator | 1 day | ISR with short revalidate |
| Price comparison | 1 week | ISR with weekly revalidate |
| Location listing | 1 month | Monthly rebuild or ISR |
| Aggregator/ranking | 3 months | Quarterly rebuild |
| Glossary | 6-12 months | Manual trigger only |

---

## Next.js bulk static generation patterns

### Pattern 1 - Database-driven generateStaticParams

The most common pattern. Query your database at build time to produce the params list.

```typescript
// app/[service]/[state]/[city]/page.tsx
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

type Params = { service: string; state: string; city: string };

export async function generateStaticParams(): Promise<Params[]> {
  // Only generate pages that pass quality gate
  const pages = await db.locationPages.findMany({
    where: {
      qualityScore: { gte: 70 },
      isActive: true,
    },
    select: {
      serviceSlug: true,
      stateSlug: true,
      citySlug: true,
    },
  });

  return pages.map((p) => ({
    service: p.serviceSlug,
    state: p.stateSlug,
    city: p.citySlug,
  }));
}

export const dynamicParams = false; // 404 for any params not in generateStaticParams
```

### Pattern 2 - CSV/JSON file-driven generation (no database)

Good for bootstrapping a pSEO project from a spreadsheet or data export.

```typescript
// lib/pSEO-data.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface LocationRow {
  city: string;
  state: string;
  citySlug: string;
  stateSlug: string;
  providerCount: number;
  averagePrice: number;
  topProviders: string; // JSON stringified array in CSV
}

export function loadLocationData(): LocationRow[] {
  const csvPath = path.join(process.cwd(), 'data', 'locations.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  return parse(content, { columns: true, cast: true });
}

// app/[city]/page.tsx
import { loadLocationData } from '@/lib/pSEO-data';

export async function generateStaticParams() {
  const rows = loadLocationData();
  return rows
    .filter((r) => r.providerCount >= 5) // quality gate
    .map((r) => ({ city: r.citySlug }));
}
```

### Pattern 3 - Incremental Static Regeneration for live data

For pSEO pages where data changes regularly (prices, inventory, ratings).

```typescript
// app/[city]/[service]/page.tsx
export const revalidate = 86400; // revalidate every 24 hours

// Or for on-demand revalidation from a webhook:
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { secret, citySlug, serviceSlug } = await request.json();
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidatePath(`/${citySlug}/${serviceSlug}`);
  return Response.json({ revalidated: true });
}
```

---

## Astro bulk static generation patterns

Astro's content collections and dynamic routes work well for file-based pSEO.

```typescript
// src/pages/[city]/[service].astro
---
import { getCollection } from 'astro:content';
import LocationTemplate from '@/components/LocationTemplate.astro';

export async function getStaticPaths() {
  const locations = await getCollection('locations', ({ data }) => {
    return data.providerCount >= 5; // quality gate
  });

  return locations.map((location) => ({
    params: {
      city: location.data.citySlug,
      service: location.data.serviceSlug,
    },
    props: { location },
  }));
}

const { location } = Astro.props;
---

<LocationTemplate data={location.data} />
```

For large datasets, Astro's build parallelism is faster than Next.js `getStaticPaths`
when generating 10,000+ pages. Benchmark before committing to a framework at scale.

---

## Quality scoring algorithm

Build a quality score before any page is published. The score gates what gets generated.

```typescript
// lib/quality-score.ts

export interface PageQualityResult {
  score: number;       // 0-100
  grade: 'A' | 'B' | 'C' | 'F';
  passes: boolean;     // true if score >= threshold
  reasons: string[];   // why points were deducted
}

interface LocationPageData {
  providerCount: number;
  topProviders: unknown[];
  averagePrice: number;
  localStat: string;
  reviewCount: number;
  nearbyLocations: string[];
  uniqueBodyWords: number; // word count of unique (non-boilerplate) content
}

export function scoreLocationPage(
  data: LocationPageData,
  threshold = 65
): PageQualityResult {
  let score = 0;
  const reasons: string[] = [];

  // Provider data quality (30 points)
  if (data.providerCount >= 10) score += 30;
  else if (data.providerCount >= 5) score += 20;
  else { score += 0; reasons.push(`Low provider count: ${data.providerCount}`); }

  // Pricing data present (20 points)
  if (data.averagePrice > 0) score += 20;
  else reasons.push('No average price data');

  // Local stat present (15 points)
  if (data.localStat && data.localStat.length >= 30) score += 15;
  else reasons.push('Missing or thin local stat');

  // Review data (15 points)
  if (data.reviewCount >= 10) score += 15;
  else if (data.reviewCount >= 3) score += 8;
  else reasons.push(`Insufficient reviews: ${data.reviewCount}`);

  // Internal linking potential (10 points)
  if (data.nearbyLocations.length >= 4) score += 10;
  else reasons.push('Not enough nearby locations for internal links');

  // Unique content density (10 points)
  if (data.uniqueBodyWords >= 200) score += 10;
  else reasons.push(`Low unique word count: ${data.uniqueBodyWords}`);

  const passes = score >= threshold;
  const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'F';

  return { score, grade, passes, reasons };
}
```

Run this during `generateStaticParams` / `getStaticPaths` and log all failed pages
to a file for review. Do not silently drop them - you want to know what data is missing.

```typescript
// scripts/quality-audit.ts
import { loadAllLocationData } from '@/lib/data';
import { scoreLocationPage } from '@/lib/quality-score';
import fs from 'fs';

const all = await loadAllLocationData();
const failed = all
  .map((page) => ({ page, result: scoreLocationPage(page) }))
  .filter(({ result }) => !result.passes);

console.log(`Quality audit: ${failed.length}/${all.length} pages below threshold`);

fs.writeFileSync(
  'reports/quality-audit.json',
  JSON.stringify(failed, null, 2)
);
```

---

## Batch publishing cadence

Publishing schedule to avoid triggering Google's quality review systems:

| Phase | Volume | Cadence | Goal |
|---|---|---|---|
| Seed | 50-100 pages | Day 1 | Validate template in real SERP |
| Observe | 0 new pages | Weeks 2-6 | Check indexing, coverage, ranking |
| Ramp | 100-200/day | Weeks 7-10 | Scale while monitoring coverage |
| Cruise | 500-1000/day | Week 11+ | Full velocity once proven |
| Maintenance | On data update | Ongoing | Refresh stale pages |

**Publish via sitemap submission, not manual URL inspection.** Submitting 10,000 URLs
manually via Search Console wastes your inspection quota. Instead, submit the sitemap
index and let Googlebot discover pages at its own crawl rate.

**Avoid mass deletions.** If a page gets deindexed, do not delete it - redirect it to
the hub page. Mass 404s damage crawl budget trust. Only hard-delete pages that were
never indexed.
