# Schema Types Full Reference

## Active Schema Types (2026)

### Content Types

| Type | Rich result | Required properties | Recommended |
|------|------------|-------------------|-------------|
| Article | Article carousel | headline, datePublished, author, image | dateModified, publisher |
| BlogPosting | Article carousel | headline, datePublished, author | wordCount, articleSection |
| NewsArticle | Top stories | headline, datePublished, author, image | dateline |
| VideoObject | Video carousel | name, uploadDate, thumbnailUrl | duration, contentUrl, description |
| Podcast (PodcastEpisode) | Podcast carousel | name, datePublished, associatedMedia | episodeNumber |
| Book | Book info | name, author | isbn, bookFormat |
| Review | Review snippet | itemReviewed, reviewRating, author | datePublished |

### Business & Organization

| Type | Rich result | Required properties | Recommended |
|------|------------|-------------------|-------------|
| Organization | Knowledge panel | name, url | logo, sameAs, contactPoint |
| LocalBusiness | Local pack | name, address | telephone, openingHoursSpecification, geo |
| ProfilePage | Author card | mainEntity (Person) | dateCreated, dateModified |

### E-commerce

| Type | Rich result | Required properties | Recommended |
|------|------------|-------------------|-------------|
| Product | Shopping, price | name, offers (price + availability + priceCurrency) | brand, image, sku, gtin, review |
| ProductGroup | Variant selector | name, hasVariant, variesBy | productGroupID |
| Offer | Price display | price, priceCurrency, availability | priceValidUntil, seller |
| AggregateOffer | Price range | lowPrice, highPrice, priceCurrency | offerCount |
| MerchantReturnPolicy | Return info | applicableCountry, returnPolicyCategory | **returnPolicyCountry (REQUIRED March 2025)** |

### Navigation & Structure

| Type | Rich result | Required properties |
|------|------------|-------------------|
| BreadcrumbList | Breadcrumb trail | itemListElement (ListItem with position, name, item) |
| ItemList | Carousel | itemListElement |
| SiteNavigationElement | Sitelinks | name, url |
| WebSite | Sitelinks search | name, url, potentialAction (SearchAction) |

### Events

| Type | Rich result | Required properties |
|------|------------|-------------------|
| Event | Event listing | name, startDate, location |
| ConferenceEvent | Event listing | name, startDate, location (added Dec 2025) |
| PerformingArtsEvent | Event listing | name, startDate, location (added Dec 2025) |

### Other Active Types

| Type | Rich result | Notes |
|------|------------|-------|
| SoftwareApplication | App info | operatingSystem, offers required |
| Recipe | Recipe card | Requires ingredients, instructions |
| Course | Course info | name, provider required |
| JobPosting | Job listing | title, datePosted, hiringOrganization, jobLocation |
| SpeakableSpecification | Voice search | cssSelector for speakable content, English-only (Google News) |

---

## Deprecated / Restricted Types - NEVER Recommend

| Type | Status | Date | Replacement |
|------|--------|------|-------------|
| HowTo | **Removed** | Sept 2023 | None (use Article) |
| FAQPage | **Restricted** | Aug 2023 | Only gov/healthcare get rich results. Still useful for AI citation. |
| SpecialAnnouncement | **Retired** | July 31, 2025 | None |
| CourseInfo | Deprecated | June 2025 | Use Course |
| EstimatedSalary | Deprecated | June 2025 | None |
| LearningVideo | Deprecated | June 2025 | Use VideoObject |
| ClaimReview | Deprecated | Late 2025 | None |
| VehicleListing | Deprecated | June 2025 | Use Product + Car |
| PracticeProblem | Deprecated | Late 2025 | None |
| Dataset | Deprecated | Late 2025 | None |

### Recent Additions (2024-2026)
- **ProfilePage** (2025) - For author E-E-A-T signals, mainEntity with Person
- **ProductGroup** (2025) - E-commerce variant grouping with variesBy, hasVariant
- **DiscussionForumPosting** (2024) - Forum/community content structured data
- **ConferenceEvent** (Dec 2025) - Conference-specific events
- **PerformingArtsEvent** (Dec 2025) - Arts events
- **Product Certification** (April 2025) - Energy ratings, safety certifications on products
- **LoyaltyProgram** (June 2025) - Member pricing, loyalty card structured data
- **Organization-level shipping/return** (Nov 2025) - Set via Search Console without Merchant Center

### Deprecated Business Types
- **Attorney**: Deprecated by Schema.org - use `LegalService` + `Person` with `hasCredential`
- **VehicleListing**: Rich results removed June 12, 2025 - use `Car` + `Offer` instead
- **Book Actions**: Deprecated then reversed, still functional as of Feb 2026

---

## JSON-LD Examples

### Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize Core Web Vitals in 2026",
  "description": "A practical guide to LCP, INP, and CLS optimization.",
  "image": "https://example.com/images/cwv-guide.jpg",
  "datePublished": "2026-03-15",
  "dateModified": "2026-03-28",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/authors/jane-smith",
    "sameAs": ["https://twitter.com/janesmith", "https://linkedin.com/in/janesmith"]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Inc",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
}
```

### Product with Offers

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Noise-Canceling Headphones",
  "image": "https://example.com/headphones.jpg",
  "description": "Premium wireless headphones with active noise cancellation.",
  "brand": { "@type": "Brand", "name": "AudioTech" },
  "sku": "AT-WNC-100",
  "gtin13": "1234567890123",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "234"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/headphones",
    "price": "299.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31",
    "seller": { "@type": "Organization", "name": "Example Store" },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
        "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 5, "unitCode": "DAY" }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "US",
      "returnPolicyCountry": "US",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail"
    }
  }
}
```

### LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": "https://example.com/locations/downtown#business",
  "name": "Downtown Family Dental",
  "image": "https://example.com/downtown-office.jpg",
  "telephone": "+1-555-123-4567",
  "url": "https://example.com/locations/downtown",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St, Suite 200",
    "addressLocality": "Portland",
    "addressRegion": "OR",
    "postalCode": "97201",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.52345,
    "longitude": -122.67890
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "156"
  },
  "priceRange": "$$",
  "branchOf": { "@type": "Organization", "@id": "https://example.com/#org" }
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://example.com/products/" },
    { "@type": "ListItem", "position": 3, "name": "Headphones", "item": "https://example.com/products/headphones/" }
  ]
}
```

### FAQPage (Gov/Healthcare Only for Rich Results)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the eligibility requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Applicants must be 18 years or older and reside in the state."
      }
    }
  ]
}
```

Note: FAQPage rich results restricted to government and healthcare authority sites since August 2023. However, the schema still provides value for AI/LLM citation visibility across non-Google platforms.

---

## Industry-Specific Schema Patterns

### Restaurant
- Type: `Restaurant` (subtype of LocalBusiness)
- Add: `servesCuisine`, `menu` (URL), `acceptsReservations`
- Include `hasMenu` with `MenuSection` and `MenuItem` for rich menu display

### Healthcare
- Type: `MedicalClinic`, `Hospital`, or `Dentist`
- Add: `medicalSpecialty`, physician `Person` entities with `hasCredential`
- Include NPI number in `sameAs` links

### Legal
- Type: `LegalService` (NOT the deprecated `Attorney`)
- Add: `Person` with `hasCredential` for bar admissions
- Include practice area pages with `areaServed`

### Real Estate
- Type: `RealEstateAgent`
- Include `RealEstateListing` with `Offer` for property listings
- Note: `VehicleListing` deprecated June 2025, use `Product` + `Car` instead

---

## Validation Checklist

1. [ ] All required properties present per type
2. [ ] Content marked up is visible on the page (no hidden content)
3. [ ] JSON-LD is syntactically valid (test with jsonlint.com)
4. [ ] `@context` uses `https://` (NOT `http://`)
5. [ ] All URLs are absolute (NOT relative paths)
6. [ ] Test with Google Rich Results Test (search.google.com/test/rich-results)
7. [ ] Test with Schema.org validator (validator.schema.org)
8. [ ] No deprecated types used
9. [ ] URLs use canonical form
10. [ ] Prices include ISO 4217 currency codes
11. [ ] Dates use ISO 8601 format (e.g., `2026-03-15T08:00:00-07:00`)
12. [ ] `@id` used consistently for entity references across pages
13. [ ] No placeholder text in live schemas
