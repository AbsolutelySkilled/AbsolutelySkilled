<!-- Part of the programmatic-seo AbsolutelySkilled skill. Load this file when
     implementing automated internal linking for a pSEO site - hub-and-spoke
     architecture, related pages algorithms, breadcrumbs, or silo structure. -->

# Internal Linking Automation for pSEO

Automated internal linking is the connective tissue of a pSEO site. Without it,
thousands of pages exist in isolation - hard for Google to crawl and impossible
to pass PageRank between. With it, the cluster becomes a topical authority signal.

---

## Hub-and-spoke architecture

The fundamental pSEO link structure. A small number of "hub" pages (high editorial
value, strong links) fan out to many "spoke" pages (programmatic, data-driven).

```
                    ┌─────────────────┐
                    │   Root Hub      │
                    │  /accountants/  │
                    └────────┬────────┘
                             │
           ┌─────────────────┼──────────────────┐
           │                 │                  │
    ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
    │  State Hub  │  │  State Hub   │  │  State Hub   │
    │  /TX/       │  │  /CA/        │  │  /NY/        │
    └──────┬──────┘  └──────────────┘  └──────────────┘
           │
    ┌──────┴──────────────────────────────────┐
    │        │           │          │         │
  Austin   Dallas    Houston    San Antonio  Austin
  spoke    spoke     spoke      spoke        spoke
```

**Link direction rules:**
- Hubs always link DOWN to spokes (navigational breadth)
- Spokes always link UP to their hub (authority concentration)
- Spokes link SIDEWAYS to nearby spokes (topical clustering)
- Never link from spoke to spoke across different hubs without context

---

## Related pages algorithm

The algorithm that decides which pages link to each other on the same level.

### Geographic proximity (location pSEO)

```typescript
// lib/related-pages/geographic.ts
import { db } from '@/lib/db';

interface RelatedPage {
  title: string;
  href: string;
  signal: string; // "120 providers" or "from $45/hr"
}

export async function getGeographicRelatedPages(
  citySlug: string,
  stateSlug: string,
  serviceSlug: string,
  limit = 6
): Promise<RelatedPage[]> {
  // Priority 1: same state, same service (most relevant)
  const sameSate = await db.locationPages.findMany({
    where: {
      stateSlug,
      serviceSlug,
      citySlug: { not: citySlug },
      qualityScore: { gte: 65 },
    },
    orderBy: { providerCount: 'desc' }, // show richest pages first
    take: limit,
  });

  if (sameSate.length >= limit) {
    return sameSate.map(toRelatedPage);
  }

  // Priority 2: different state, same service (fill remaining slots)
  const otherStates = await db.locationPages.findMany({
    where: {
      serviceSlug,
      stateSlug: { not: stateSlug },
      citySlug: { not: citySlug },
      qualityScore: { gte: 65 },
    },
    orderBy: { searchVolume: 'desc' },
    take: limit - sameSate.length,
  });

  return [...sameSate, ...otherStates].map(toRelatedPage);
}

function toRelatedPage(loc: {
  cityName: string;
  citySlug: string;
  serviceSlug: string;
  providerCount: number;
}): RelatedPage {
  return {
    title: `${loc.cityName}`,
    href: `/${loc.serviceSlug}/${loc.citySlug}`,
    signal: `${loc.providerCount} providers`,
  };
}
```

### Categorical similarity (comparison/tool pSEO)

```typescript
// lib/related-pages/categorical.ts

export async function getCategoricalRelatedPages(
  currentSlug: string,
  categoryTags: string[],
  limit = 6
): Promise<RelatedPage[]> {
  // Find pages sharing the most tags with the current page
  const candidates = await db.comparisonPages.findMany({
    where: {
      slug: { not: currentSlug },
      tags: { hasSome: categoryTags },
      qualityScore: { gte: 65 },
    },
  });

  // Score by tag overlap count
  const scored = candidates
    .map((page) => ({
      page,
      overlap: page.tags.filter((t) => categoryTags.includes(t)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit);

  return scored.map(({ page }) => ({
    title: page.title,
    href: `/${page.slug}`,
    signal: page.shortSummary,
  }));
}
```

---

## Breadcrumb generation

Breadcrumbs serve dual purpose: user navigation and internal linking to hub pages.
Every breadcrumb link is an internal link with descriptive anchor text.

```typescript
// lib/breadcrumbs.ts

export interface Breadcrumb {
  label: string;
  href: string | null; // null for the current page (no link)
}

export function buildLocationBreadcrumbs(
  serviceLabel: string,
  serviceSlug: string,
  stateLabel: string,
  stateSlug: string,
  cityLabel: string,
): Breadcrumb[] {
  return [
    { label: 'Home', href: '/' },
    { label: serviceLabel, href: `/${serviceSlug}/` },
    { label: stateLabel, href: `/${serviceSlug}/${stateSlug}/` },
    { label: cityLabel, href: null }, // current page - no link
  ];
}

// React component
// components/Breadcrumbs.tsx
import type { Breadcrumb } from '@/lib/breadcrumbs';

export function Breadcrumbs({ crumbs }: { crumbs: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {crumbs.map((crumb, index) => (
          <li
            key={crumb.label}
            itemScope
            itemType="https://schema.org/ListItem"
            itemProp="itemListElement"
          >
            {crumb.href ? (
              <a href={crumb.href} itemProp="item">
                <span itemProp="name">{crumb.label}</span>
              </a>
            ) : (
              <span itemProp="name">{crumb.label}</span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

Add `BreadcrumbList` schema markup to the breadcrumbs. Google uses this to display
breadcrumb trails in SERPs, which improves click-through rate for pSEO pages.

---

## Contextual link injection

Beyond a "related pages" section, inject links directly into body copy where relevant.
This is the highest-value internal link type because anchor text is natural and in-context.

```typescript
// lib/contextual-links.ts

interface ContextualLinkConfig {
  keyword: string;       // trigger phrase in body copy
  href: string;          // destination URL
  anchorText: string;    // anchor text to use (may differ from keyword)
  maxOccurrences: number; // how many times to inject per page (usually 1)
}

export function injectContextualLinks(
  htmlContent: string,
  links: ContextualLinkConfig[]
): string {
  let result = htmlContent;

  for (const link of links) {
    let count = 0;
    const regex = new RegExp(`\\b(${escapeRegex(link.keyword)})\\b`, 'gi');

    result = result.replace(regex, (match) => {
      if (count >= link.maxOccurrences) return match;
      count++;
      return `<a href="${link.href}">${link.anchorText}</a>`;
    });
  }

  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Usage in template rendering
const links: ContextualLinkConfig[] = await db.contextualLinks.findMany({
  where: { pageType: 'location', serviceSlug: data.serviceSlug },
});

const linkedContent = injectContextualLinks(data.bodyHtml, links);
```

> Limit contextual injection to 1 occurrence per keyword per page. Over-linking
> looks spammy and can trigger Google's link spam classifier. One natural link
> outperforms three forced ones.

---

## Silo architecture

A silo groups topically related pages so PageRank flows within the topic cluster
rather than leaking to unrelated content.

**Hard silo (strict):** pages within a silo only link to other pages in the same silo.
Used for highly competitive niches where topical authority concentration matters most.

**Soft silo (practical):** pages primarily link within their silo, but cross-silo links
are allowed at the hub level. This is the recommended approach for most pSEO sites.

```typescript
// lib/silo.ts - enforce soft silo rules

export function validateInternalLink(
  sourceSilo: string,
  targetSilo: string,
  sourceDepth: number,  // 0 = root, 1 = hub, 2 = spoke
): { allowed: boolean; reason?: string } {
  // Rule 1: same-silo links always allowed
  if (sourceSilo === targetSilo) {
    return { allowed: true };
  }

  // Rule 2: root and hub pages can cross-link (soft silo)
  if (sourceDepth <= 1) {
    return { allowed: true };
  }

  // Rule 3: spokes cannot cross-link to other silos
  return {
    allowed: false,
    reason: `Spoke page in silo "${sourceSilo}" cannot link to silo "${targetSilo}"`,
  };
}
```

**URL structure reflects silo structure:**
```
/accountants/                    ← root hub (silo: accountants)
/accountants/texas/              ← state hub
/accountants/texas/austin/       ← city spoke
/accountants/texas/dallas/       ← city spoke

/bookkeepers/                    ← separate silo
/bookkeepers/texas/
/bookkeepers/texas/austin/
```

---

## Link graph visualization

For large pSEO sites, visualize the link graph to spot orphaned pages, thin clusters,
and over-linked hub pages.

```typescript
// scripts/generate-link-graph.ts
// Outputs a Graphviz DOT file for visualization

import { db } from '@/lib/db';

async function generateLinkGraph(): Promise<void> {
  const pages = await db.locationPages.findMany({
    include: { outboundLinks: { include: { target: true } } },
  });

  const lines: string[] = ['digraph pSEO {', '  rankdir=TB;'];

  for (const page of pages) {
    const depth = page.depth; // 0=root, 1=state, 2=city
    const color = depth === 0 ? 'red' : depth === 1 ? 'orange' : 'lightblue';
    lines.push(`  "${page.slug}" [label="${page.slug}" fillcolor="${color}" style=filled];`);

    for (const link of page.outboundLinks) {
      lines.push(`  "${page.slug}" -> "${link.target.slug}";`);
    }
  }

  lines.push('}');

  const fs = await import('fs');
  fs.writeFileSync('reports/link-graph.dot', lines.join('\n'));
  console.log('Link graph written to reports/link-graph.dot');
  console.log('Render: dot -Tsvg reports/link-graph.dot -o reports/link-graph.svg');
}

generateLinkGraph();
```

**Metrics to check in the graph:**

| Metric | Healthy | Concerning |
|---|---|---|
| Orphaned pages (0 inbound links) | < 1% of total | > 5% - check sitemap and hub pages |
| Hub inbound link concentration | Top 10% of pages get 60-70% of links | Top 1% gets 90%+ (bottleneck) |
| Average link depth (clicks from root) | < 3 for all spoke pages | > 4 for any page (crawl risk) |
| Cross-silo links from spokes | 0 (hard silo) or < 5% (soft silo) | > 10% dilutes topical authority |

---

## Link audit script

Run periodically to detect internal linking regressions - orphaned pages, broken
links, or silo violations introduced during data updates.

```typescript
// scripts/link-audit.ts
import { db } from '@/lib/db';

interface AuditResult {
  orphanedPages: string[];
  brokenLinks: Array<{ source: string; target: string }>;
  siloViolations: Array<{ source: string; target: string; reason: string }>;
}

export async function runLinkAudit(): Promise<AuditResult> {
  const allPages = await db.locationPages.findMany({
    include: { outboundLinks: true, inboundLinks: true },
  });

  const slugSet = new Set(allPages.map((p) => p.slug));

  const orphanedPages = allPages
    .filter((p) => p.depth > 0 && p.inboundLinks.length === 0)
    .map((p) => p.slug);

  const brokenLinks: AuditResult['brokenLinks'] = [];
  const siloViolations: AuditResult['siloViolations'] = [];

  for (const page of allPages) {
    for (const link of page.outboundLinks) {
      if (!slugSet.has(link.targetSlug)) {
        brokenLinks.push({ source: page.slug, target: link.targetSlug });
      }

      const target = allPages.find((p) => p.slug === link.targetSlug);
      if (target && page.depth >= 2 && page.silo !== target.silo) {
        siloViolations.push({
          source: page.slug,
          target: target.slug,
          reason: `Cross-silo spoke link: ${page.silo} -> ${target.silo}`,
        });
      }
    }
  }

  return { orphanedPages, brokenLinks, siloViolations };
}

// CI integration - fail build if audit finds regressions
const result = await runLinkAudit();
const issues = result.orphanedPages.length + result.brokenLinks.length + result.siloViolations.length;

if (issues > 0) {
  console.error('Link audit failed:', JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log('Link audit passed. No issues found.');
```

Run this in CI before deploying any data update that adds, removes, or restructures
pSEO pages. A broken internal link graph is silent in production but compounds over
time as Google's crawl model of your site diverges from reality.
