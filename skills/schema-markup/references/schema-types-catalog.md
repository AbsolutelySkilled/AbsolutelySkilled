<!-- Part of the schema-markup AbsolutelySkilled skill. Load this file when
     selecting a Schema.org type or checking required/recommended properties for rich results. -->

# Schema Types Catalog

This catalog covers Schema.org types supported by Google for rich results. For each
type: required fields (missing these suppresses the rich result), recommended fields
(improve display richness), and a minimal JSON-LD example.

Full reference: https://developers.google.com/search/docs/appearance/structured-data/search-gallery

---

## Article / BlogPosting / NewsArticle

**Use for:** News articles, blog posts, sports articles, opinion pieces.

**Required:**
- `headline` (max 110 characters)
- `image` (at least one image, min 1200px wide recommended)
- `datePublished`
- `author` with `@type: Person` or `Organization` and `name`

**Recommended:**
- `dateModified`
- `publisher` with `logo`
- `description`

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "New Study Links Sleep Quality to Productivity",
  "image": "https://example.com/sleep-study.jpg",
  "datePublished": "2025-03-01",
  "dateModified": "2025-03-05",
  "author": {
    "@type": "Person",
    "name": "Dr. Alice Kim"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Health News Daily",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
}
```

---

## FAQPage

**Use for:** Pages with a list of question-and-answer pairs. Each Q&A must be visible
on the page. Do NOT use for community Q&A (Stack Overflow style) or where there are
multiple competing answers.

**Required:**
- `mainEntity` array of `Question` objects
- Each `Question` needs `name` (the question) and `acceptedAnswer`
- Each `acceptedAnswer` needs `text`

**Recommended:**
- Keep answers under 300 characters for best display in SERPs

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay."
      }
    }
  ]
}
```

---

## HowTo

**Use for:** Step-by-step instructional pages (how to cook something, fix something,
build something). Not for recipes (use Recipe type).

**Required:**
- `name` (title of the how-to)
- `step` array of `HowToStep` objects
- Each `HowToStep` needs `text`

**Recommended:**
- `HowToStep.name` (short step headline)
- `HowToStep.image`
- `totalTime` (ISO 8601 duration, e.g. `"PT30M"`)
- `estimatedCost`
- `tool` and `supply` arrays

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Repot a Succulent",
  "totalTime": "PT15M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Choose the right pot",
      "text": "Select a pot one size larger with drainage holes at the bottom."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Add fresh soil",
      "text": "Fill the new pot with cactus/succulent potting mix to about one-third full."
    }
  ]
}
```

---

## Product

**Use for:** Individual product pages. Requires at least one of `aggregateRating`,
`offers`, or `review` to be eligible for a rich result.

**Required (for rich result):**
- `name`
- `image`
- At least one of: `aggregateRating`, `offers`, `review`

**Recommended:**
- `description`
- `sku`
- `brand`
- `offers.price` + `offers.priceCurrency` + `offers.availability`
- `offers.priceValidUntil`
- `aggregateRating.ratingValue` + `aggregateRating.reviewCount`

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Running Shoes Pro X",
  "image": "https://example.com/shoes.jpg",
  "sku": "RSX-42",
  "brand": { "@type": "Brand", "name": "SwiftRun" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "312"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "129.99",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

---

## BreadcrumbList

**Use for:** Navigation breadcrumbs shown on the page. Appears as a breadcrumb path
in the SERP URL line (replaces the URL display).

**Required:**
- `itemListElement` array of `ListItem` objects
- Each `ListItem` needs `position` (1-indexed integer), `name`, and `item` (URL)

**Recommended:**
- Include every breadcrumb level visible on the page
- The last item (current page) may omit `item` URL

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Shoes", "item": "https://example.com/shoes" },
    { "@type": "ListItem", "position": 3, "name": "Running Shoes Pro X" }
  ]
}
```

---

## Organization

**Use for:** Company/brand identity on the homepage or about page. Helps populate
Google's Knowledge Panel. Use `@id` with a stable URL to link across pages.

**Required:** None strictly required for Knowledge Panel eligibility, but include as much as possible.

**Recommended:**
- `name`, `url`, `logo`, `contactPoint`, `sameAs` (social profiles), `@id`

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://example.com/#organization",
  "name": "Acme Corp",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-555-1234",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://twitter.com/acmecorp",
    "https://linkedin.com/company/acmecorp"
  ]
}
```

---

## LocalBusiness

**Use for:** Businesses with a physical location. Extend with a more specific subtype
when applicable: `Restaurant`, `Store`, `MedicalBusiness`, `AutoDealer`, `LodgingBusiness`, etc.

**Required (for local rich results):**
- `name`, `address` (with `PostalAddress`), `telephone` or `url`

**Recommended:**
- `openingHoursSpecification`, `geo`, `priceRange`, `image`, `servesCuisine` (for restaurants)

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Sakura Sushi",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "456 Oak Avenue",
    "addressLocality": "Seattle",
    "addressRegion": "WA",
    "postalCode": "98101",
    "addressCountry": "US"
  },
  "telephone": "+1-206-555-9876",
  "servesCuisine": "Japanese",
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "11:30",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "12:00",
      "closes": "23:00"
    }
  ]
}
```

---

## Event

**Use for:** Events with a specific date, time, and location (concerts, conferences,
webinars). Online events use `eventAttendanceMode: OnlineEventAttendanceMode`.

**Required:**
- `name`, `startDate`, `location`
- `location` must be a `Place` (with `name` and `address`) or `VirtualLocation`
- `eventStatus` (use `https://schema.org/EventScheduled`)

**Recommended:**
- `endDate`, `description`, `image`, `organizer`, `offers`, `eventAttendanceMode`

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "FrontendConf 2025",
  "startDate": "2025-09-20T09:00",
  "endDate": "2025-09-21T18:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Portland Convention Center",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "777 NE Martin Luther King Jr Blvd",
      "addressLocality": "Portland",
      "addressRegion": "OR",
      "addressCountry": "US"
    }
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/tickets",
    "price": "399",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## Recipe

**Use for:** Food and drink recipes. One of the richest rich result types - can show
image, ratings, cook time, and ingredients directly in the SERP.

**Required:**
- `name`, `image`, `author`, `datePublished`, `description`
- `recipeIngredient` (array of ingredient strings)
- `recipeInstructions` (array of `HowToStep`)
- `recipeYield`, `prepTime`, `cookTime` (ISO 8601 durations)

**Recommended:**
- `aggregateRating`, `nutrition`, `recipeCategory`, `recipeCuisine`, `keywords`

```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Classic Banana Bread",
  "image": "https://example.com/banana-bread.jpg",
  "author": { "@type": "Person", "name": "Chef Maria" },
  "datePublished": "2024-08-10",
  "prepTime": "PT15M",
  "cookTime": "PT60M",
  "recipeYield": "1 loaf",
  "recipeIngredient": [
    "3 ripe bananas", "1/3 cup melted butter", "3/4 cup sugar", "1 egg", "1 tsp vanilla"
  ],
  "recipeInstructions": [
    { "@type": "HowToStep", "text": "Preheat oven to 350°F (175°C)." },
    { "@type": "HowToStep", "text": "Mash bananas and mix in butter, sugar, egg, and vanilla." },
    { "@type": "HowToStep", "text": "Fold in flour and baking soda, pour into loaf pan, bake 60 minutes." }
  ],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "543" }
}
```

---

## VideoObject

**Use for:** Pages where a video is the primary content. Enables video rich results
with thumbnail, duration, and upload date in SERPs.

**Required:**
- `name`, `description`, `thumbnailUrl`, `uploadDate`

**Recommended:**
- `duration` (ISO 8601), `contentUrl` or `embedUrl`, `expires`

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Deploy a Next.js App to Vercel",
  "description": "Complete walkthrough of deploying a Next.js app with environment variables and custom domains.",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "uploadDate": "2025-01-15",
  "duration": "PT12M30S",
  "embedUrl": "https://www.youtube.com/embed/abc123"
}
```

---

## SoftwareApplication

**Use for:** Software apps, mobile apps, or web apps. Can show ratings, OS support,
and price in SERPs.

**Required:**
- `name`, `operatingSystem`, `applicationCategory`

**Recommended:**
- `offers`, `aggregateRating`, `screenshot`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TaskFlow",
  "operatingSystem": "iOS, Android, Web",
  "applicationCategory": "ProductivityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "ratingCount": "8200"
  }
}
```

---

## Course

**Use for:** Online courses and educational content. Shows course provider and
description in SERPs.

**Required:**
- `name`, `description`, `provider`

**Recommended:**
- `hasCourseInstance` (with `courseMode`, `startDate`), `offers`

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Advanced JavaScript: Closures, Async, and Modules",
  "description": "Master advanced JavaScript concepts used in real-world applications.",
  "provider": {
    "@type": "Organization",
    "name": "CodeAcademy Pro",
    "sameAs": "https://codeacademypro.com"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseSchedule": { "@type": "Schedule", "repeatFrequency": "self-paced" }
  }
}
```

---

## JobPosting

**Use for:** Job listings. Appears as rich results in Google Jobs integration.

**Required:**
- `title`, `description`, `datePosted`, `validThrough`, `hiringOrganization`, `jobLocation`

**Recommended:**
- `employmentType`, `baseSalary`, `identifier`, `applicantLocationRequirements`

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Senior Frontend Engineer",
  "description": "Build and maintain React-based interfaces for our SaaS platform.",
  "datePosted": "2025-03-01",
  "validThrough": "2025-06-01",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "BuildFast Inc.",
    "sameAs": "https://buildfast.io",
    "logo": "https://buildfast.io/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 150000,
      "maxValue": 200000,
      "unitText": "YEAR"
    }
  }
}
```

---

## Multiple types on one page

When a page has more than one schema type, use an array at the top level or include
separate `<script type="application/ld+json">` blocks:

```html
<!-- Option A: array in one block -->
<script type="application/ld+json">
[
  { "@context": "https://schema.org", "@type": "Product", "name": "..." },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [...] }
]
</script>

<!-- Option B: separate blocks (also valid) -->
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "Product", "name": "..." }
</script>
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [...] }
</script>
```

Both approaches are valid. Arrays in a single block are preferred for organization.
