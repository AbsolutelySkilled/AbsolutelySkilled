<!-- Part of the SEO Mastery AbsolutelySkilled skill. Load this file when implementing JSON-LD structured data for any page type. -->

# Schema Markup Reference

JSON-LD structured data examples for common page types. Always inject in `<head>` using
`<script type="application/ld+json">`. Validate with Google's Rich Results Test before
deploying.

---

## 1. Article

For blog posts, news articles, and editorial content. Enables article rich results and
improves E-E-A-T signals.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Build a Keyword Research Strategy in 5 Steps",
  "description": "A complete guide to keyword research for SEO beginners and advanced practitioners.",
  "image": "https://example.com/images/keyword-research-guide.jpg",
  "datePublished": "2024-01-15T08:00:00+00:00",
  "dateModified": "2024-03-10T10:30:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/authors/jane-smith",
    "sameAs": [
      "https://twitter.com/janesmith",
      "https://linkedin.com/in/janesmith"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Co",
    "url": "https://example.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png",
      "width": 200,
      "height": 60
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/keyword-research-guide"
  }
}
</script>
```

---

## 2. Product

For e-commerce product pages. Enables price, availability, and review rich results.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SEO Audit Tool Pro",
  "description": "Comprehensive SEO auditing software for agencies and in-house teams.",
  "image": [
    "https://example.com/images/seo-tool-1.jpg",
    "https://example.com/images/seo-tool-2.jpg"
  ],
  "sku": "SEO-TOOL-PRO-001",
  "brand": {
    "@type": "Brand",
    "name": "Example Co"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/seo-audit-tool-pro",
    "priceCurrency": "USD",
    "price": "99.00",
    "priceValidUntil": "2025-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Example Co"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "312",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Alex Johnson"
      },
      "reviewBody": "Best SEO tool I've used in 10 years of agency work."
    }
  ]
}
</script>
```

---

## 3. FAQPage

Earns accordion-style rich snippets in SERPs. Highly effective for informational pages.
Each question/answer pair should be visible on the page - do not add hidden FAQ schema.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is keyword difficulty and how is it measured?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Keyword difficulty (KD) is a 0-100 score estimating how hard it is to rank on the first page for a given keyword. It is calculated from the authority of pages currently ranking - higher authority pages mean higher difficulty. Scores under 30 are generally attainable for newer sites; 30-60 requires solid backlink profiles; 60+ demands significant domain authority."
      }
    },
    {
      "@type": "Question",
      "name": "How long does SEO take to show results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most SEO changes take 3 to 6 months to produce measurable ranking improvements. Technical fixes (crawl issues, speed) resolve faster - sometimes within weeks. Content and link building compounds over 6-12 months. Highly competitive keywords may take 12-24 months."
      }
    },
    {
      "@type": "Question",
      "name": "Is it possible to rank without backlinks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, for low-competition informational queries - especially long-tail keywords under difficulty 20. However, backlinks remain necessary for competitive head terms. Building topical authority through a content cluster strategy can reduce the number of external links needed."
      }
    }
  ]
}
</script>
```

---

## 4. HowTo

Earns rich snippets with step-by-step structured results. Use on tutorial and guide pages.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Submit a Sitemap to Google Search Console",
  "description": "Step-by-step guide to submitting your XML sitemap to Google Search Console for faster indexing.",
  "totalTime": "PT10M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Google Search Console account"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Open Search Console",
      "text": "Go to search.google.com/search-console and sign in with your Google account.",
      "url": "https://example.com/submit-sitemap#step-1",
      "image": "https://example.com/images/step-1-search-console.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Select your property",
      "text": "Choose the verified property you want to submit the sitemap for from the left-hand dropdown.",
      "url": "https://example.com/submit-sitemap#step-2"
    },
    {
      "@type": "HowToStep",
      "name": "Navigate to Sitemaps",
      "text": "In the left sidebar, click Indexing > Sitemaps.",
      "url": "https://example.com/submit-sitemap#step-3"
    },
    {
      "@type": "HowToStep",
      "name": "Enter your sitemap URL",
      "text": "In the 'Add a new sitemap' field, enter your sitemap URL (e.g., https://yourdomain.com/sitemap.xml) and click Submit.",
      "url": "https://example.com/submit-sitemap#step-4"
    }
  ]
}
</script>
```

---

## 5. BreadcrumbList

Enables breadcrumb rich results in SERPs. Add to every page that has a navigable hierarchy.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "SEO Guides",
      "item": "https://example.com/seo-guides"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Keyword Research Guide",
      "item": "https://example.com/seo-guides/keyword-research"
    }
  ]
}
</script>
```

---

## 6. LocalBusiness

For local business pages and landing pages targeting geographic queries. Enables Knowledge
Panel signals and local pack eligibility.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Acme SEO Agency",
  "image": "https://example.com/images/office.jpg",
  "url": "https://example.com",
  "telephone": "+1-555-123-4567",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94105",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://www.google.com/maps/place/acme-seo-agency",
    "https://www.yelp.com/biz/acme-seo-agency",
    "https://linkedin.com/company/acme-seo-agency"
  ]
}
</script>
```

---

## 7. SitelinksSearchbox

Adds a search box directly in Google's SERP result for your brand query. Only show on
your homepage.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://example.com",
  "name": "Example Co",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
```

> This only appears in SERPs for branded queries on sites Google already recognizes.
> Do not expect it to appear on a new domain with low brand authority.

---

## Validation Checklist

Before deploying schema markup, verify:

| Check | Tool |
|---|---|
| Valid JSON syntax | jsonlint.com |
| Schema properties recognized | Google Rich Results Test (search.google.com/test/rich-results) |
| Schema eligible for rich results | Rich Results Test > "Eligible" status |
| No markup-content mismatch | Visually confirm every schema field matches visible page content |
| No hidden FAQ/review schema | Schema content must be visible to users, not hidden via CSS |

Post-deploy: monitor Search Console > Enhancements section for schema errors and warnings.
Rich results typically appear within 1-4 weeks after indexing.
