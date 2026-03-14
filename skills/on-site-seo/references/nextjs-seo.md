<!-- Part of the on-site-seo AbsolutelySkilled skill. Load this file when
     working with SEO in Next.js App Router projects. -->

# Next.js SEO Reference

Next.js App Router provides a first-class Metadata API that generates head tags
server-side with full TypeScript support. This reference covers the complete
pattern set for production Next.js SEO.

---

## Metadata API - Static

For pages with fixed metadata, export a `metadata` object from any `page.tsx`
or `layout.tsx`. This is the simplest and most common pattern.

```typescript
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Acme Corp',
  description: 'Learn about Acme Corp\'s mission, team, and story.',
  alternates: {
    canonical: 'https://acme.com/about',
  },
  openGraph: {
    title: 'About Us - Acme Corp',
    description: 'Learn about Acme Corp\'s mission, team, and story.',
    url: 'https://acme.com/about',
    siteName: 'Acme Corp',
    images: [
      {
        url: 'https://acme.com/og/about.png',
        width: 1200,
        height: 630,
        alt: 'Acme Corp team photo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Acme Corp',
    description: 'Learn about Acme Corp\'s mission, team, and story.',
    images: ['https://acme.com/og/about.png'],
    site: '@acmecorp',
  },
};
```

---

## Metadata API - Title Templates

Use title templates in `layout.tsx` to avoid repeating the brand name in every
page's metadata export.

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Corp',
    default: 'Acme Corp',
  },
  description: 'Acme Corp makes the world\'s best widgets.',
};

// app/blog/page.tsx - title becomes "Blog | Acme Corp"
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles from the Acme Corp team.',
};

// app/blog/[slug]/page.tsx - use generateMetadata for dynamic title
```

---

## generateMetadata - Dynamic Pages

For pages where metadata depends on fetched data (blog posts, product pages, etc.),
use the `generateMetadata` async function.

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await fetchPost(params.slug);

  // Optionally merge with parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://acme.com/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.ogImage || 'https://acme.com/og/default.png',
          width: 1200,
          height: 630,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage],
    },
  };
}
```

Note: `generateMetadata` and the page component share the same fetch call - Next.js
deduplicates fetches automatically via the `cache` mechanism.

---

## Robots meta tag

```typescript
// app/admin/page.tsx - block indexing for private routes
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

// app/search/page.tsx - noindex dynamic search results pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};
```

---

## sitemap.ts

Generate a dynamic sitemap from your content. Place at `app/sitemap.ts`.

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...postEntries,
  ];
}
```

For large sites (>50k URLs), use multiple sitemaps with a sitemap index:

```typescript
// app/blog-sitemap.xml/route.ts
export async function GET() {
  const posts = await fetchAllPosts();
  const xml = generateSitemapXml(posts);
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

---

## robots.ts

Control crawl access at the site level. Place at `app/robots.ts`.

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  };
}
```

---

## JSON-LD Structured Data

Next.js does not have a built-in JSON-LD API. Inject it via a `<script>` tag in
the page or layout component.

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `https://acme.com/authors/${post.author.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* page content */}</article>
    </>
  );
}
```

For site-wide schema (Organization, WebSite with sitelinks searchbox), add the
`<script>` to `app/layout.tsx`.

---

## next/image for SEO

The `next/image` component automatically handles WebP/AVIF conversion, responsive
srcset, lazy loading, and prevents layout shift. Always specify `width` and `height`
or use `fill` with a sized container.

```typescript
import Image from 'next/image';

// Fixed size image
<Image
  src="/images/hero.jpg"
  alt="Team of engineers working together"
  width={1200}
  height={600}
  priority // use for above-the-fold images (replaces loading="eager")
/>

// Fill container (responsive)
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/images/banner.jpg"
    alt="Product banner showing widget in use"
    fill
    sizes="100vw"
    style={{ objectFit: 'cover' }}
  />
</div>

// Responsive with sizes attribute
<Image
  src="/images/product.webp"
  alt="Acme Pro Widget in matte black"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## next/font - Eliminate Font CLS

Font loading causes Cumulative Layout Shift. `next/font` inlines font CSS and
prevents FOUT by preloading fonts automatically.

```typescript
// app/layout.tsx
import { Inter, Merriweather } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-merriweather',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Dynamic OG Images with next/og

Generate OG images programmatically using the `ImageResponse` API from `next/og`.

```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Blog post open graph image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <p style={{ color: '#64748b', fontSize: 28, margin: 0 }}>Acme Blog</p>
        <h1 style={{ color: '#f8fafc', fontSize: 64, margin: '16px 0' }}>
          {post.title}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 32, margin: 0 }}>
          {post.author.name}
        </p>
      </div>
    ),
    size
  );
}
```

Place `opengraph-image.tsx` (or `.png`, `.jpg`) in the same folder as `page.tsx` -
Next.js automatically links it as the OG image for that route.

---

## Checklist for a new Next.js page

- [ ] `metadata` export or `generateMetadata` function with title and description
- [ ] `alternates.canonical` set to the canonical URL
- [ ] `openGraph` with title, description, image (1200x630), url, type
- [ ] `twitter` with card, title, description, images
- [ ] `robots` set if the page should be noindexed (admin, private, search results)
- [ ] All `<Image>` components have descriptive `alt` text
- [ ] One `<h1>` per page matching the page's primary keyword
- [ ] JSON-LD added for article pages, product pages, or FAQ pages
- [ ] Page appears in `sitemap.ts` output
