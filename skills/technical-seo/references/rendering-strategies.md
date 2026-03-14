<!-- Part of the Technical SEO AbsolutelySkilled skill. Load this file when choosing a rendering strategy, implementing SSR/SSG/ISR in a specific framework, or diagnosing JavaScript rendering issues for SEO. -->

# Rendering Strategies for SEO Reference

How a page is rendered determines whether Googlebot sees your content immediately
or must wait for a delayed JavaScript render. This reference covers the rendering
strategies, their SEO trade-offs, framework implementations, and edge cases.

---

## 1. Rendering Strategy Comparison Matrix

| Strategy | Full name | HTML on first crawl? | Build time impact | Data freshness | SEO risk |
|---|---|---|---|---|---|
| **SSG** | Static Site Generation | Yes - full HTML | Scales with page count | Stale until rebuild | None |
| **SSR** | Server-Side Rendering | Yes - full HTML | None | Always fresh | None |
| **ISR** | Incremental Static Regeneration | Yes (on cache hit) | Low - builds on demand | Stale until revalidation | Low - stale cache |
| **CSR** | Client-Side Rendering | No - empty shell | None | Always fresh | High for rankable pages |
| **Hybrid SSG+CSR** | Static shell, client fetches data | Partial - shell only | Low | Fresh after hydration | Medium - depends on what CSR fetches |
| **Edge SSR** | SSR at CDN edge | Yes - full HTML | None | Always fresh | None |
| **Dynamic rendering** | Serve HTML to bots, CSR to users | Yes (for Googlebot) | None | Always fresh | Medium - requires maintenance |

---

## 2. Decision Framework by Content Type

```
Is this page behind authentication?
  YES -> CSR is fine. Google cannot and should not index it.
  NO  -> Continue...

Does this page need to rank in search results?
  NO  -> Any strategy works. Choose based on UX requirements.
  YES -> Continue...

Does the content change frequently (multiple times per day)?
  YES -> SSR or Edge SSR
  NO  -> Continue...

Is your page count large enough that SSG builds take >10 minutes?
  YES (100k+ pages) -> ISR
  NO               -> SSG (safest, simplest)
```

### Content type recommendations

| Page type | Strategy | Reasoning |
|---|---|---|
| Homepage | SSG | Rarely changes, highest visibility, fastest TTFB |
| Landing pages | SSG | Infrequent changes, need instant indexing |
| Blog posts / articles | SSG | Write-once, ideal for build-time generation |
| Documentation | SSG | Static content, version-controlled |
| Product detail pages (small catalog) | SSG | Fast, always-indexed |
| Product detail pages (large catalog) | ISR | Build-time impractical at scale |
| Category / listing pages | SSG or ISR | Depends on how often product mix changes |
| News / feed pages | SSR | Must reflect current state |
| User profiles (public) | SSR | Personalized, indexed, dynamic |
| Search results pages | SSR + canonical | Crawlable version needed |
| Account/dashboard pages | CSR | Not indexed, no SEO concern |
| Admin interfaces | CSR | Not indexed, no SEO concern |

---

## 3. Framework Implementation Guide

### Next.js (App Router)

```typescript
// SSG: page is generated at build time (default for static data)
// File: app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug); // fetched at build time
  return <article>{post.content}</article>;
}
```

```typescript
// ISR: regenerate on access, revalidate after N seconds
// File: app/products/[slug]/page.tsx
export const revalidate = 3600; // revalidate every hour

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  return <ProductDetail product={product} />;
}

// On-demand ISR: trigger revalidation from a webhook
// File: app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { slug } = await request.json();
  revalidatePath(`/products/${slug}`);
  return Response.json({ revalidated: true });
}
```

```typescript
// SSR: render on every request
// File: app/news/page.tsx
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const articles = await getLatestNews(); // fetched on every request
  return <NewsFeed articles={articles} />;
}
```

```typescript
// Metadata for SEO - works with all rendering strategies
// File: app/products/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `https://example.com/products/${params.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}
```

### Next.js (Pages Router, legacy)

```typescript
// SSG with getStaticProps
export async function getStaticProps({ params }) {
  const product = await getProduct(params.slug);
  return {
    props: { product },
    revalidate: 3600, // ISR: revalidate every hour
  };
}

// SSR with getServerSideProps
export async function getServerSideProps({ params }) {
  const news = await getLatestNews();
  return { props: { news } };
}
```

### Nuxt 3

```typescript
// SSG: generate at build time
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml'],
    },
  },
});

// pages/products/[slug].vue
const { data: product } = await useAsyncData(
  `product-${route.params.slug}`,
  () => $fetch(`/api/products/${route.params.slug}`)
);

// ISR-equivalent with cache headers
// server/routes/products/[slug].ts
export default defineCachedEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  return await getProduct(slug);
}, {
  maxAge: 60 * 60, // 1 hour
  staleMaxAge: 60 * 60 * 24, // serve stale for 24h while revalidating
});
```

```vue
<!-- SEO meta in Nuxt -->
<script setup>
useSeoMeta({
  title: product.name,
  description: product.description,
  ogTitle: product.name,
  ogDescription: product.description,
});

useHead({
  link: [
    { rel: 'canonical', href: `https://example.com/products/${product.slug}` }
  ]
});
</script>
```

### Astro

Astro defaults to SSG with optional server-side rendering per route.

```astro
---
// src/pages/products/[slug].astro
// SSG: default behavior - rendered at build time
export async function getStaticPaths() {
  const products = await getProducts();
  return products.map(product => ({
    params: { slug: product.slug },
    props: { product },
  }));
}

const { product } = Astro.props;
---

<html>
  <head>
    <title>{product.name}</title>
    <meta name="description" content={product.description} />
    <link rel="canonical" href={`https://example.com/products/${product.slug}`} />
  </head>
  <body>
    <h1>{product.name}</h1>
  </body>
</html>
```

```javascript
// astro.config.mjs - enable SSR for specific routes
export default defineConfig({
  output: 'hybrid', // SSG by default, SSR opt-in
  adapter: node({ mode: 'standalone' }),
});
```

```astro
---
// Enable SSR for this specific page
export const prerender = false; // override default SSG

const news = await fetch('/api/news').then(r => r.json());
---
```

### Remix

Remix is SSR-first. All routes render on the server by default.

```typescript
// app/routes/products.$slug.tsx
import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }: LoaderFunctionArgs) {
  const product = await getProduct(params.slug!);
  if (!product) throw new Response('Not Found', { status: 404 });
  return product;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.name },
    { name: 'description', content: data?.description },
    { tagName: 'link', rel: 'canonical', href: `https://example.com/products/${data?.slug}` },
  ];
};

export default function ProductPage() {
  const product = useLoaderData<typeof loader>();
  return <ProductDetail product={product} />;
}
```

For SSG-like behavior in Remix, use HTTP caching headers:

```typescript
export function headers() {
  return {
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
  };
}
```

---

## 4. Edge Rendering

Edge rendering runs SSR at CDN edge nodes geographically close to the user.
SEO characteristics are identical to standard SSR - Googlebot receives full HTML.
Benefits are performance (lower TTFB) which is a positive ranking signal.

### When to use edge rendering

- SSR pages where TTFB > 200ms from major geographic markets
- Personalized content that must be indexed (e.g., localized pricing)
- A/B testing that needs to remain invisible to Googlebot

### Edge rendering in Next.js

```typescript
// app/products/[slug]/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  return <ProductDetail product={product} />;
}
```

Constraints: Edge runtime does not support all Node.js APIs. Avoid database
connections in edge functions; use edge-compatible APIs or KV stores instead.

---

## 5. Dynamic Rendering (Escape Hatch)

Dynamic rendering serves pre-rendered HTML to crawlers and CSR to regular users.
It is an escape hatch for legacy apps that cannot easily migrate to SSR/SSG.

### Implementation with a rendering proxy

```nginx
# Route Googlebot and other bots to a pre-rendering service
map $http_user_agent $is_bot {
  default         0;
  ~*googlebot     1;
  ~*bingbot       1;
  ~*slurp         1;
  ~*duckduckbot   1;
}

server {
  location / {
    if ($is_bot) {
      proxy_pass https://prerender-service.example.com;
    }
    # Regular users get the CSR app
    try_files $uri $uri/ /index.html;
  }
}
```

### Risks of dynamic rendering

- **Cloaking concern**: Serving different HTML to bots vs users. Google explicitly
  permits dynamic rendering as a workaround but views SSR as the correct long-term
  solution. If the bot version is significantly different from the user version,
  it may be treated as cloaking.
- **Maintenance burden**: Two rendering paths to maintain. The bot version can
  diverge from the user version over time.
- **Prerender service latency**: Adds latency to Googlebot crawls.

Use dynamic rendering only as a transitional strategy while migrating to SSR/SSG.

---

## 6. Hydration and SEO Implications

Hydration is the process of attaching React (or other framework) event handlers
to server-rendered HTML in the browser. It does not affect what Googlebot sees
on the first crawl but it affects user experience metrics.

### Hydration failures that affect SEO

**Hydration mismatch**: When the server-rendered HTML differs from what React
renders on the client, React discards the server HTML and re-renders from scratch.
During this process, content may disappear briefly, which can affect Core Web Vitals.

```typescript
// Common cause: using browser-only APIs in server components
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

// WRONG: conditional rendering based on mount causes hydration mismatch
return mounted ? <ActualContent /> : null;

// BETTER: render content on server, enhance on client
return (
  <div suppressHydrationWarning>
    <ActualContent />
  </div>
);
```

**Lazy-loaded content and indexing**: Content loaded via React.lazy or dynamic
imports is available after the JavaScript bundle loads. For Googlebot second-wave
rendering, this content is typically visible. But for pages where immediate indexing
is critical, keep primary content in the initial server-rendered output.

### Core Web Vitals and rendering

| Metric | Affected by rendering strategy |
|---|---|
| LCP (Largest Contentful Paint) | SSG/SSR have faster LCP; CSR often has poor LCP |
| CLS (Cumulative Layout Shift) | Hydration mismatches cause CLS; SSG/SSR avoid this |
| INP (Interaction to Next Paint) | Mostly a JavaScript execution concern, not rendering strategy |
| TTFB (Time to First Byte) | SSG fastest (static file); SSR variable; CSR fast shell |

LCP is a ranking signal. CSR pages frequently have poor LCP because the browser
must download, parse, and execute JavaScript before painting the largest content
element. SSG pages typically have strong LCP.
