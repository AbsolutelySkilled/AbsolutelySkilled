<!-- Part of the core-web-vitals AbsolutelySkilled skill. Load this file when
     working with framework-specific CWV optimizations for Next.js, Nuxt, Astro, or Remix. -->

# Framework-Specific CWV Fixes

Each major React/Vue/meta-framework ships first-party primitives that address Core Web
Vitals at the framework level. Prefer these over manual implementations - they handle
edge cases (responsive breakpoints, format negotiation, priority hints) that manual code
often misses.

---

## Next.js

### next/image - LCP and CLS

`next/image` automatically handles: WebP/AVIF conversion, responsive srcset generation,
lazy loading below-fold images, aspect ratio reservation (prevents CLS), and placeholder
blur.

```jsx
import Image from 'next/image';

// LCP hero image: add priority={true}
// - Adds fetchpriority="high" to the <img>
// - Generates a <link rel="preload"> in <head>
// - Disables lazy loading
export function HeroSection() {
  return (
    <Image
      src="/hero.jpg"
      width={1200}
      height={630}
      priority        // critical: marks this as LCP candidate
      alt="Hero image"
      placeholder="blur"           // optional: shows blurred LQIP while loading
      blurDataURL="/hero-tiny.jpg" // or use static imports for auto blur
    />
  );
}

// Below-fold product image: lazy loaded by default, no priority needed
export function ProductCard({ product }) {
  return (
    <Image
      src={product.imageUrl}
      width={400}
      height={400}
      alt={product.name}
      // lazy loading + WebP conversion are automatic
    />
  );
}
```

**Remote images require domain allowlist in `next.config.js`:**

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // serve AVIF first, then WebP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // srcset breakpoints
  },
};
```

### next/font - CLS and LCP

`next/font` eliminates font-related CLS by: automatically calculating font metric overrides,
self-hosting Google Fonts (no external request), applying `size-adjust` so fallback and
web font have identical metrics.

```js
// app/layout.js (or pages/_app.js)
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',   // or 'optional' for zero CLS
  // Automatically calculates size-adjust, ascent-override, descent-override
  // No font CLS even with display: 'swap'
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

For local fonts:

```js
import localFont from 'next/font/local';

const brandFont = localFont({
  src: './fonts/Brand.woff2',
  display: 'swap',
  variable: '--font-brand', // CSS variable for use in Tailwind or CSS modules
});
```

### next/dynamic - INP and bundle size

Dynamic imports reduce initial JS, improving INP by reducing main thread parse/compile time.

```jsx
import dynamic from 'next/dynamic';

// Lazy load heavy components not needed on initial render
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div className="chart-skeleton" />, // prevents CLS
  ssr: false, // skip server rendering for client-only components
});

// Conditional load: only load modal component when needed
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false,
});

export function ProductPage() {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <>
      <button onClick={() => setShowVideo(true)}>Watch Demo</button>
      {showVideo && <VideoPlayer />}
    </>
  );
}
```

### Next.js Script component - third-party INP

Third-party scripts are a top INP killer. `next/script` provides loading strategies:
- `strategy="afterInteractive"` - loads after hydration (analytics, tag managers)
- `strategy="lazyOnload"` - loads during browser idle time (chat widgets, social embeds)
- `strategy="worker"` - runs in a Web Worker via Partytown; no DOM access (experimental)

---

## Nuxt

### @nuxt/image - LCP and CLS

Install: `npx nuxi@latest module add image`

```vue
<!-- pages/index.vue -->
<template>
  <!-- LCP hero: preload + fetchpriority via :preload and fetchpriority attrs -->
  <NuxtImg
    src="/hero.jpg"
    width="1200"
    height="630"
    preload
    fetchpriority="high"
    format="webp"
    quality="80"
    alt="Hero"
  />

  <!-- Responsive with srcset - provider handles format conversion -->
  <NuxtPicture
    src="/product.jpg"
    :imgAttrs="{ width: 400, height: 400, alt: 'Product' }"
    sizes="sm:100vw md:50vw lg:400px"
    format="avif,webp"
  />
</template>
```

```js
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxt/fonts'],
  image: {
    quality: 80,
    format: ['avif', 'webp'],
    provider: 'cloudinary', // optional CDN provider
    cloudinary: { baseURL: 'https://res.cloudinary.com/your-cloud/image/upload/' },
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Brand', src: '/fonts/brand.woff2' },
    ],
    defaults: { weights: [400, 700], subsets: ['latin'] },
  },
});
```

Nuxt Fonts automatically self-hosts Google Fonts, adds font-face declarations with metric
overrides, and prevents CLS - equivalent to `next/font` behavior.

### Nuxt lazy loading - INP

Use `useLazyAsyncData` to defer non-critical fetches. Prefix any component with `Lazy` in
templates to enable automatic code-split lazy loading (`<LazyRecommendationsList />`).
Reserve space for lazy sections with `min-height` to prevent CLS when content loads.

---

## Astro

Astro's default architecture (zero client-side JS) produces excellent CWV scores out of
the box. The key is knowing when and how to hydrate interactive islands.

### astro:assets Image component - LCP and CLS

```astro
---
// src/pages/index.astro
import { Image, Picture } from 'astro:assets';
import heroImage from '../assets/hero.jpg'; // local image
---

<!-- LCP image: fetchpriority + eager loading -->
<Image
  src={heroImage}
  width={1200}
  height={630}
  fetchpriority="high"
  loading="eager"
  format="webp"
  quality={80}
  alt="Hero"
/>

<!-- Responsive with format fallbacks -->
<Picture
  src={heroImage}
  widths={[400, 800, 1200]}
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 1200px"
  formats={['avif', 'webp']}
  alt="Hero"
/>
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    remotePatterns: [{ hostname: '**.example.com' }],
  },
});
```

### Astro island hydration - INP

Client directives control when components hydrate. Defer hydration of below-fold or
non-interactive components to keep main thread free for INP.

```astro
---
import HeroCarousel from '../components/HeroCarousel.jsx';
import SocialFeed from '../components/SocialFeed.jsx';
import ChatWidget from '../components/ChatWidget.jsx';
import HeavyTable from '../components/HeavyTable.jsx';
---

<!-- client:load: hydrates immediately (use only for critical interactive UI) -->
<HeroCarousel client:load />

<!-- client:idle: hydrates during browser idle time (good for below-fold interactive) -->
<SocialFeed client:idle />

<!-- client:visible: hydrates when component enters viewport -->
<HeavyTable client:visible />

<!-- client:media: hydrates only on matching media query -->
<ChatWidget client:media="(min-width: 1024px)" />
```

**CWV impact of client directives:**
- `client:load` - contributes to initial JS bundle, may increase INP
- `client:idle` - deferred, minimal INP impact
- `client:visible` - best for below-fold heavy components
- No directive (default) - static HTML, zero JS, best for CWV

For font CLS in Astro: self-host fonts in `/public/fonts/`, preload the woff2 file in the
`<head>`, and use `font-display: optional` in the `@font-face` declaration to eliminate
swap-related layout shifts. Use `@astrojs/google-fonts` for automatic self-hosting.

---

## Remix

### Image handling in Remix - LCP

Remix does not ship a built-in image component. Use `@unpic/react` or `remix-image` for
optimization, or manually manage `srcset` and `fetchpriority`.

```jsx
// Manual LCP image with correct attributes
export default function HeroSection() {
  return (
    <img
      src="/hero.webp"
      srcSet="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
      sizes="(max-width: 600px) 100vw, 800px"
      fetchPriority="high"  // React camelCase
      loading="eager"
      width={1200}
      height={630}
      alt="Hero"
    />
  );
}

// Add preload in the document head using Remix's links export
export const links = () => [
  {
    rel: 'preload',
    as: 'image',
    href: '/hero-800.webp',
    imageSrcSet: '/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w',
    imageSizes: '(max-width: 600px) 100vw, 800px',
  },
];
```

### Remix prefetch - LCP on next page

Remix's `<Link prefetch>` pre-fetches the next page's data and assets on hover or when
visible, dramatically improving LCP for subsequent navigations.

```jsx
import { Link } from '@remix-run/react';

// prefetch="intent": prefetch on hover (best for navigation links)
<Link to="/product/123" prefetch="intent">View Product</Link>

// prefetch="render": prefetch when link renders (use for critical CTAs)
<Link to="/checkout" prefetch="render">Checkout</Link>

// prefetch="viewport": prefetch when link is visible (use for list items)
<Link to={`/product/${id}`} prefetch="viewport">
  {product.name}
</Link>
```

### Remix streaming with defer - INP and LCP

Streaming defers slow data without blocking the initial HTML response. The page shell (nav,
above-fold content) arrives immediately, improving LCP for the critical path.

```jsx
// routes/product.$id.jsx
import { defer } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

export async function loader({ params }) {
  // Critical data: awaited - included in initial HTML
  const product = await getProduct(params.id);

  // Non-critical data: deferred - streams in after initial paint
  const recommendations = getRecommendations(params.id); // not awaited

  return defer({ product, recommendations });
}

export default function ProductPage() {
  const { product, recommendations } = useLoaderData();

  return (
    <>
      {/* Renders immediately - LCP candidate */}
      <ProductHero product={product} />

      {/* Streams in - shows fallback until ready */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Await resolve={recommendations}>
          {(data) => <RecommendationsList items={data} />}
        </Await>
      </Suspense>
    </>
  );
}
```

**CWV impact of streaming:**
- LCP improves because critical HTML arrives before slow data queries complete
- CLS risk: use `<Suspense>` fallback with the same dimensions as the final content
- INP unaffected - streaming is a network/render concern, not an interaction concern
