<!-- Part of the on-site-seo AbsolutelySkilled skill. Load this file when
     working with SEO in Astro projects. -->

# Astro SEO Reference

Astro's architecture is inherently SEO-friendly: it ships zero JavaScript by default,
renders HTML on the server, and provides excellent tools for meta management. This
reference covers the complete SEO implementation pattern for Astro sites.

---

## SEO Component Pattern

Astro does not have a built-in metadata API - the idiomatic pattern is a reusable
`SEO.astro` component (or `Head.astro`) that accepts props and renders all head tags.

```astro
---
// src/components/SEO.astro
export interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

const {
  title,
  description,
  canonical = Astro.url.href,
  ogImage = '/og/default.png',
  ogType = 'website',
  noindex = false,
  publishedAt,
  updatedAt,
} = Astro.props;

const siteUrl = 'https://acme.com';
const absoluteOgImage = ogImage.startsWith('http')
  ? ogImage
  : `${siteUrl}${ogImage}`;
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />

{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={absoluteOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content={canonical} />
<meta property="og:type" content={ogType} />
<meta property="og:site_name" content="Acme Corp" />

{ogType === 'article' && publishedAt && (
  <meta property="article:published_time" content={publishedAt} />
)}
{ogType === 'article' && updatedAt && (
  <meta property="article:modified_time" content={updatedAt} />
)}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={absoluteOgImage} />
<meta name="twitter:image:alt" content={`${title} preview image`} />
<meta name="twitter:site" content="@acmecorp" />
```

---

## Base Layout Usage

Include the SEO component in your base layout's `<head>`:

```astro
---
// src/layouts/BaseLayout.astro
import SEO from '../components/SEO.astro';

export interface Props {
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
}

const { title, description, ogImage, noindex } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <SEO
      title={title}
      description={description}
      ogImage={ogImage}
      noindex={noindex}
    />
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Content Collections - SEO Frontmatter

Define a Zod schema for your content collection to enforce SEO fields.

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60, 'Title should be under 60 characters'),
    description: z.string().max(160, 'Description should be under 160 characters'),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    ogImage: z.string().optional(),
    noindex: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

```markdown
---
# src/content/blog/image-seo-guide.md
title: 'How to Optimize Images for SEO'
description: 'A complete guide to image alt text, formats, and lazy loading for better search rankings.'
publishedAt: 2025-03-14
ogImage: '/images/image-seo-og.png'
tags: ['seo', 'images', 'performance']
---

# How to Optimize Images for SEO
```

---

## Dynamic Page with Content Collections

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, getEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.noindex);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout
  title={post.data.title}
  description={post.data.description}
  ogImage={post.data.ogImage}
>
  <article>
    <h1>{post.data.title}</h1>
    <time datetime={post.data.publishedAt.toISOString()}>
      {post.data.publishedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
    <Content />
  </article>
</BaseLayout>
```

---

## astro-seo Package

The `astro-seo` package provides a comprehensive SEO component as an alternative
to building your own. Install with `npm install astro-seo`.

```astro
---
// src/layouts/BaseLayout.astro
import { SEO } from 'astro-seo';
---

<head>
  <SEO
    title="Page Title | Acme Corp"
    description="Page description here."
    canonical="https://acme.com/page"
    openGraph={{
      basic: {
        title: 'Page Title',
        type: 'website',
        image: 'https://acme.com/og/page.png',
        url: 'https://acme.com/page',
      },
      image: {
        width: 1200,
        height: 630,
        alt: 'Descriptive alt text for OG image',
      },
      optional: {
        description: 'Page description here.',
        siteName: 'Acme Corp',
      },
    }}
    twitter={{
      card: 'summary_large_image',
      site: '@acmecorp',
      creator: '@authorhandle',
    }}
  />
</head>
```

---

## Sitemap Integration

Use `@astrojs/sitemap` integration for automatic sitemap generation.

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://acme.com',
  integrations: [
    sitemap({
      // Exclude specific pages
      filter: (page) =>
        !page.includes('/admin/') && !page.includes('/private/'),

      // Custom page options
      customPages: ['https://acme.com/special-landing'],

      // Change frequency and priority overrides
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),

      // Serialize for per-page control
      serialize: (item) => {
        if (item.url === 'https://acme.com/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        return item;
      },
    }),
  ],
});
```

---

## Astro Image - next/image Equivalent

Use `@astrojs/image` or the built-in `<Image>` component (Astro 3+) for optimized images.

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Local image - type-safe, automatic optimization -->
<Image
  src={heroImage}
  alt="Team of engineers collaborating in an open office"
  width={1200}
  height={600}
  format="webp"
  quality={85}
  loading="eager"
/>

<!-- Remote image - requires explicit dimensions -->
<Image
  src="https://cdn.acme.com/blog/post-hero.jpg"
  alt="Screenshot showing the Acme dashboard product interface"
  width={800}
  height={450}
  format="webp"
  loading="lazy"
/>

<!-- Responsive image with sizes -->
<Image
  src={heroImage}
  alt="Acme product hero"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  format="webp"
/>
```

---

## JSON-LD Structured Data

Inject JSON-LD directly in the `<head>` using a `<script>` tag.

```astro
---
// src/pages/blog/[slug].astro
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,
  description: post.data.description,
  image: `https://acme.com${post.data.ogImage}`,
  datePublished: post.data.publishedAt.toISOString(),
  dateModified: (post.data.updatedAt ?? post.data.publishedAt).toISOString(),
  author: {
    '@type': 'Person',
    name: post.data.author,
    url: `https://acme.com/authors/${post.data.authorSlug}`,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Acme Corp',
    logo: {
      '@type': 'ImageObject',
      url: 'https://acme.com/logo.png',
    },
  },
};
---

<head>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
</head>
```

---

## View Transitions and SEO

Astro's View Transitions API can affect how search engines index your site. Ensure
the site works correctly without JavaScript enabled (for crawlers).

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <!-- ViewTransitions is progressive enhancement - crawlers see full SSR HTML -->
  <ViewTransitions />
  <!-- SEO tags are always server-rendered regardless of transitions -->
  <SEO title={title} description={description} />
</head>
```

Key consideration: meta tags in `<head>` are updated on each transition by Astro.
Ensure your SEO component renders the correct tags for the current page in both
initial load and transition scenarios.

---

## RSS Feed

Astro generates RSS feeds via `@astrojs/rss`. Create `src/pages/rss.xml.ts` and
use `getCollection` to map posts to feed items. Add the autodiscovery link in `<head>`:

```astro
<link rel="alternate" type="application/rss+xml" title="Acme Corp Blog" href="/rss.xml" />
```

---

## Checklist for a new Astro page

- [ ] SEO component included with title (under 60 chars), description (under 160 chars)
- [ ] Canonical URL set (defaults to `Astro.url.href` in the component above)
- [ ] All OG and Twitter tags populated with correct image (1200x630px)
- [ ] `<Image>` component used for all images with descriptive `alt` text
- [ ] One `<h1>` per page containing the primary keyword
- [ ] JSON-LD added for blog posts, product pages, FAQ pages
- [ ] Page appears in sitemap (not filtered by the sitemap `filter` function)
- [ ] Content collection schema enforces `title` and `description` max lengths
- [ ] `noindex: true` set in frontmatter for private or duplicate content pages
