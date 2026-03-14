<!-- Part of the on-site-seo AbsolutelySkilled skill. Load this file when
     working with SEO in Nuxt 3 projects. -->

# Nuxt 3 SEO Reference

Nuxt 3 provides composables (`useSeoMeta`, `useHead`) and the `@nuxtjs/seo` module
suite for complete on-site SEO implementation. This reference covers the core patterns
for production Nuxt 3 SEO.

---

## useSeoMeta - Recommended Approach

`useSeoMeta` is the recommended composable for setting all SEO meta tags. It provides
full TypeScript support and is XSS-safe (unlike raw `useHead` with arbitrary tags).

```typescript
// pages/about.vue
<script setup lang="ts">
useSeoMeta({
  title: 'About Us - Acme Corp',
  description: 'Learn about Acme Corp\'s mission, team, and story.',
  ogTitle: 'About Us - Acme Corp',
  ogDescription: 'Learn about Acme Corp\'s mission, team, and story.',
  ogImage: 'https://acme.com/og/about.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: 'https://acme.com/about',
  ogType: 'website',
  ogSiteName: 'Acme Corp',
  twitterCard: 'summary_large_image',
  twitterTitle: 'About Us - Acme Corp',
  twitterDescription: 'Learn about Acme Corp\'s mission, team, and story.',
  twitterImage: 'https://acme.com/og/about.png',
  twitterSite: '@acmecorp',
});
</script>
```

---

## useSeoMeta - Reactive / Dynamic Pages

Use `computed` refs or reactive values to update meta when data changes. Nuxt handles
the reactivity automatically.

```typescript
// pages/blog/[slug].vue
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`);

useSeoMeta({
  title: () => post.value?.title ?? 'Blog Post',
  description: () => post.value?.excerpt ?? '',
  ogTitle: () => post.value?.title ?? 'Blog Post',
  ogDescription: () => post.value?.excerpt ?? '',
  ogImage: () => post.value?.ogImage ?? 'https://acme.com/og/default.png',
  ogUrl: () => `https://acme.com/blog/${route.params.slug}`,
  ogType: 'article',
  articlePublishedTime: () => post.value?.publishedAt,
  articleModifiedTime: () => post.value?.updatedAt,
  twitterCard: 'summary_large_image',
  twitterImage: () => post.value?.ogImage ?? 'https://acme.com/og/default.png',
});
</script>
```

---

## useHead - Full Control

For cases where `useSeoMeta` doesn't cover a tag (canonical, structured data, etc.),
use `useHead` directly.

```typescript
// pages/blog/[slug].vue
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`);

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://acme.com/blog/${route.params.slug}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value?.title,
        description: post.value?.excerpt,
        datePublished: post.value?.publishedAt,
        dateModified: post.value?.updatedAt,
        author: {
          '@type': 'Person',
          name: post.value?.author?.name,
        },
      }),
    },
  ],
});
</script>
```

---

## nuxt.config.ts - Site-wide SEO defaults

Set default meta values in `nuxt.config.ts`. These are inherited by all pages and
can be overridden with `useSeoMeta` or `useHead`.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Acme Corp',
      meta: [
        { name: 'description', content: 'Acme Corp makes the world\'s best widgets.' },
        { property: 'og:site_name', content: 'Acme Corp' },
        { name: 'twitter:site', content: '@acmecorp' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
});
```

---

## definePageMeta - Robots / Layout Control

Use `definePageMeta` to set route-level options. For SEO, use it to control the
layout context - actual meta tags should still use `useSeoMeta`.

```typescript
// pages/admin/dashboard.vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  robots: 'noindex, nofollow',
});
</script>
```

---

## Title Templates

Use `titleTemplate` in `app.vue` or a layout to apply a consistent brand suffix
across all pages.

```typescript
// app.vue
<script setup lang="ts">
useHead({
  titleTemplate: (title) => title ? `${title} | Acme Corp` : 'Acme Corp',
});
</script>
```

Then each page only needs to set the page-specific part:

```typescript
// pages/pricing.vue
<script setup lang="ts">
useSeoMeta({ title: 'Pricing' }); // renders as "Pricing | Acme Corp"
</script>
```

---

## @nuxtjs/seo Module Suite

The `@nuxtjs/seo` meta-module installs and configures several SEO-related modules.
Install with `npx nuxi module add seo`.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo'],

  site: {
    url: 'https://acme.com',
    name: 'Acme Corp',
    description: 'Acme Corp makes the world\'s best widgets.',
    defaultLocale: 'en',
  },

  // Robots configuration (via nuxt-robots)
  robots: {
    disallow: ['/admin', '/private'],
  },

  // Sitemap configuration (via nuxt-simple-sitemap)
  sitemap: {
    strictNuxtContentPaths: true,
  },
});
```

The suite includes: `nuxt-robots`, `nuxt-simple-sitemap`, `nuxt-og-image`,
`nuxt-schema-org`, `nuxt-link-checker`, and `nuxt-seo-ui`.

---

## nuxt-simple-sitemap

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-simple-sitemap'],

  sitemap: {
    // For dynamic routes - provide all URLs
    urls: async () => {
      const posts = await fetchAllPosts();
      return posts.map((post) => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.updatedAt,
        changefreq: 'weekly',
        priority: 0.8,
      }));
    },
    // Exclude routes
    exclude: ['/admin/**', '/api/**'],
  },
});
```

---

## nuxt-og-image - Automatic OG Image Generation

`nuxt-og-image` generates OG images from Vue components at build time or on-demand.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-og-image'],
  ogImage: {
    fonts: ['Inter:400', 'Inter:700'],
  },
});
```

```typescript
// pages/blog/[slug].vue
<script setup lang="ts">
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`);

// Define OG image using the built-in template
defineOgImage({
  component: 'BlogPost', // references OG image component
  title: post.value?.title,
  description: post.value?.excerpt,
  author: post.value?.author?.name,
});
</script>
```

```typescript
// components/OgImage/BlogPost.vue
<template>
  <div class="w-full h-full bg-slate-900 flex flex-col justify-center p-20">
    <p class="text-slate-400 text-2xl mb-4">Acme Blog</p>
    <h1 class="text-white text-6xl font-bold">{{ title }}</h1>
    <p class="text-slate-300 text-3xl mt-6">{{ author }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description: string; author: string }>();
</script>
```

---

## NuxtImg - Optimized Images

`@nuxt/image` provides automatic format conversion, resizing, and srcset generation.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // Providers for external images
    domains: ['cdn.acme.com'],
    // Default image quality
    quality: 80,
  },
});
```

```html
<!-- pages/blog/[slug].vue -->
<NuxtImg
  :src="post.heroImage"
  :alt="post.heroImageAlt"
  width="1200"
  height="630"
  format="webp"
  loading="eager"
  sizes="sm:100vw md:100vw lg:1200px"
/>

<!-- Lazy loaded image below the fold -->
<NuxtImg
  :src="post.thumbnail"
  :alt="post.thumbnailAlt"
  width="400"
  height="300"
  format="webp"
  loading="lazy"
/>
```

---

## Nuxt Content - SEO with Markdown

When using `@nuxt/content`, define SEO fields in frontmatter and access them in
the page component.

```markdown
---
title: 'How to Optimize Images for SEO'
description: 'A complete guide to image SEO including alt text, formats, and lazy loading.'
ogImage: '/images/image-seo-guide.png'
publishedAt: '2025-03-14'
updatedAt: '2025-03-14'
---

# How to Optimize Images for SEO
```

```typescript
// pages/blog/[...slug].vue
<script setup lang="ts">
const { data: page } = await useAsyncData(
  route.path,
  () => queryContent(route.path).findOne()
);

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
  ogTitle: page.value?.title,
  ogDescription: page.value?.description,
  ogImage: page.value?.ogImage ?? 'https://acme.com/og/default.png',
  ogUrl: `https://acme.com${route.path}`,
  articlePublishedTime: page.value?.publishedAt,
  articleModifiedTime: page.value?.updatedAt,
});
</script>
```

---

## Checklist for a new Nuxt 3 page

- [ ] `useSeoMeta` with title, description, and all OG/Twitter properties
- [ ] `useHead` with canonical link pointing to the preferred URL
- [ ] Title uses `titleTemplate` from `app.vue` (page-specific part only)
- [ ] All `<NuxtImg>` components have descriptive `alt` text
- [ ] One `<h1>` per page containing the primary keyword
- [ ] Page included in sitemap via `nuxt-simple-sitemap` or manual `urls` config
- [ ] OG image defined (1200x630px) via `defineOgImage` or static image
- [ ] `robots: 'noindex'` set on admin, private, and duplicate content pages
