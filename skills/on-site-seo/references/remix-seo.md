<!-- Part of the on-site-seo AbsolutelySkilled skill. Load this file when
     working with SEO in Remix projects. -->

# Remix SEO Reference

Remix handles SEO through its `meta` export function and loader pattern. Unlike
Next.js or Nuxt, Remix merges meta from all matched routes - parent route meta
flows down to child routes unless overridden. This reference covers the complete
SEO implementation pattern for Remix v2 (and Remix with Vite).

---

## meta Function - V2 Convention

In Remix v2, the `meta` function receives the loader data and must return an array
of meta descriptor objects.

```typescript
// app/routes/about.tsx
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'About Us | Acme Corp' },
    { name: 'description', content: 'Learn about Acme Corp\'s mission, team, and story.' },
    { tagName: 'link', rel: 'canonical', href: 'https://acme.com/about' },

    // Open Graph
    { property: 'og:title', content: 'About Us | Acme Corp' },
    { property: 'og:description', content: 'Learn about Acme Corp\'s mission, team, and story.' },
    { property: 'og:image', content: 'https://acme.com/og/about.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: 'https://acme.com/about' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Acme Corp' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'About Us | Acme Corp' },
    { name: 'twitter:description', content: 'Learn about Acme Corp\'s mission, team, and story.' },
    { name: 'twitter:image', content: 'https://acme.com/og/about.png' },
    { name: 'twitter:site', content: '@acmecorp' },
  ];
};
```

---

## Loader-Based Dynamic Meta

Pass data from the loader to the `meta` function via the `data` argument.

```typescript
// app/routes/blog.$slug.tsx
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await fetchPost(params.slug!);
  if (!post) throw new Response('Not Found', { status: 404 });
  return json({ post });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: 'Post Not Found | Acme Corp' },
      { name: 'robots', content: 'noindex' },
    ];
  }

  const { post } = data;

  return [
    { title: `${post.title} | Acme Blog` },
    { name: 'description', content: post.excerpt },
    { tagName: 'link', rel: 'canonical', href: `https://acme.com/blog/${post.slug}` },

    // Open Graph - Article type
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.excerpt },
    { property: 'og:image', content: post.ogImage ?? 'https://acme.com/og/default.png' },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://acme.com/blog/${post.slug}` },
    { property: 'article:published_time', content: post.publishedAt },
    { property: 'article:modified_time', content: post.updatedAt },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.title },
    { name: 'twitter:description', content: post.excerpt },
    { name: 'twitter:image', content: post.ogImage ?? 'https://acme.com/og/default.png' },
  ];
};

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();
  return (
    <article>
      <h1>{post.title}</h1>
      {/* content */}
    </article>
  );
}
```

---

## Merging Meta with Parent Routes

Remix merges meta from matched routes. Without explicit merging, child route meta
completely replaces parent meta. To merge, access parent `matches` data.

```typescript
// app/root.tsx - root meta (applies to all routes)
export const meta: MetaFunction = () => [
  { property: 'og:site_name', content: 'Acme Corp' },
  { name: 'twitter:site', content: '@acmecorp' },
];

// app/routes/blog.$slug.tsx - merge with parent
export const meta: MetaFunction<typeof loader, { root: typeof rootLoader }> = ({
  data,
  matches,
}) => {
  // Get root-level meta to merge
  const rootMeta = matches.find((m) => m.id === 'root')?.meta ?? [];

  // Filter out tags the child route will override
  const inheritedMeta = rootMeta.filter(
    (meta) =>
      !('title' in meta) &&
      !('property' in meta && meta.property === 'og:title') &&
      !('name' in meta && meta.name === 'description')
  );

  return [
    ...inheritedMeta,
    { title: `${data?.post.title} | Acme Blog` },
    { name: 'description', content: data?.post.excerpt },
    { property: 'og:title', content: data?.post.title },
    // ... rest of tags
  ];
};
```

---

## Root Layout - Default Meta and JSON-LD

Set site-wide defaults in `app/root.tsx`. Inject JSON-LD for site-level schema here.

```typescript
// app/root.tsx
import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { property: 'og:site_name', content: 'Acme Corp' },
  { name: 'twitter:site', content: '@acmecorp' },
];

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Acme Corp',
  url: 'https://acme.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://acme.com/search?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

---

## Canonical URLs in Remix

Canonical URLs require using `{ tagName: 'link' }` in the meta array (not a
separate `links` export - that's for stylesheets).

```typescript
export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  // Build canonical from current URL, stripping query params
  const canonical = `https://acme.com${location.pathname}`;

  return [
    { title: 'Page Title | Acme Corp' },
    { tagName: 'link', rel: 'canonical', href: canonical },
    // For paginated content: point canonical to the first page
    // { tagName: 'link', rel: 'canonical', href: 'https://acme.com/blog' },
  ];
};
```

---

## Noindex for Dynamic/Private Routes

```typescript
// app/routes/search.tsx - noindex search result pages
export const meta: MetaFunction = ({ location }) => [
  { title: `Search Results | Acme Corp` },
  { name: 'robots', content: 'noindex, follow' },
];

// app/routes/admin.tsx - block admin routes
export const meta: MetaFunction = () => [
  { name: 'robots', content: 'noindex, nofollow' },
];
```

---

## handle Convention - Breadcrumbs

Use the `handle` export to provide structured data for breadcrumb generation.

```typescript
// app/routes/blog.$slug.tsx
export const handle = {
  breadcrumb: (data: ReturnType<typeof useLoaderData>) => ({
    label: data.post.title,
    to: `/blog/${data.post.slug}`,
  }),
};

// app/root.tsx - render breadcrumbs using matches
import { useMatches } from '@remix-run/react';

function Breadcrumbs() {
  const matches = useMatches();
  const crumbs = matches
    .filter((match) => match.handle?.breadcrumb)
    .map((match) => match.handle.breadcrumb(match.data));

  return (
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        {crumbs.map((crumb) => (
          <li key={crumb.to}>
            <a href={crumb.to}>{crumb.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

---

## Sitemap Generation in Remix

Remix does not have a built-in sitemap - generate it via a resource route.

```typescript
// app/routes/sitemap[.]xml.ts
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const posts = await fetchAllPosts();
  const baseUrl = new URL(request.url).origin;

  const staticPages = ['', '/about', '/pricing', '/contact'];

  const staticEntries = staticPages
    .map(
      (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${path === '' ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('');

  const dynamicEntries = posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${dynamicEntries}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

---

## OG Image Generation - Resource Route

Generate dynamic OG images via a resource route using `@vercel/og` or `satori`.

```typescript
// app/routes/og[.]png.ts
import { ImageResponse } from '@vercel/og';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') ?? 'Acme Corp';
  const description = url.searchParams.get('description') ?? '';

  return new ImageResponse(
    <div
      style={{
        background: '#0f172a',
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
      }}
    >
      <h1 style={{ color: '#f8fafc', fontSize: '64px', margin: '0 0 24px' }}>
        {title}
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '32px', margin: 0 }}>
        {description}
      </p>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

Reference the route from the meta function:

```typescript
// app/routes/blog.$slug.tsx
export const meta: MetaFunction<typeof loader> = ({ data, request }) => {
  const baseUrl = new URL(request.url).origin;
  const ogImageUrl = `${baseUrl}/og.png?title=${encodeURIComponent(data?.post.title ?? '')}&description=${encodeURIComponent(data?.post.excerpt ?? '')}`;

  return [
    { property: 'og:image', content: ogImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:image', content: ogImageUrl },
  ];
};
```

---

## Checklist for a new Remix route

- [ ] `meta` function exported with title (under 60 chars), description (under 160 chars)
- [ ] Canonical URL set via `{ tagName: 'link', rel: 'canonical', href: '...' }`
- [ ] OG tags with title, description, image (1200x630px), url, type
- [ ] Twitter card tags with card type, title, description, image
- [ ] Loader handles 404 gracefully - `meta` function returns noindex for missing data
- [ ] All images have descriptive `alt` text
- [ ] One `<h1>` in the rendered component matching the primary keyword
- [ ] Route included in `app/routes/sitemap[.]xml.ts` output
- [ ] Parent route meta merged explicitly if site-wide tags are needed
- [ ] `noindex` set for search results, paginated pages, and admin routes
