<!-- Part of the local-seo AbsolutelySkilled skill. Load this file when
     working with local citations, NAP audits, LocalBusiness schema markup,
     multi-location schema, or review schema. -->

# Local Citations and Schema Markup

Local citations are any online mention of a business's Name, Address, and Phone
number (NAP). They are a key prominence signal for Google's local ranking algorithm.
This file covers citation strategy, the NAP audit process, top citation sources,
and complete LocalBusiness JSON-LD schema patterns.

---

## Citations: Structured vs Unstructured

**Structured citations** are formal directory listings where the NAP appears in
defined fields. Examples: Yelp, Yellow Pages, Foursquare, TripAdvisor, Angi.

**Unstructured citations** are mentions in editorial content - blog posts, news
articles, local event listings, chamber of commerce pages - where the NAP appears
in free-form text rather than structured fields.

Both types contribute to prominence, but structured citations on high-authority
directories carry more weight because they are more easily parsed and verified
by Google's crawlers.

---

## The NAP Audit Process

Run a citation audit before building new citations. Adding more inconsistent
citations makes the problem harder to fix.

### Step 1: Define your canonical NAP

Decide on one exact format that will be used everywhere:

```
Business Name: Acme Plumbing Services          (no "Inc." unless it's the legal name)
Address:       123 Main Street, Suite 100      (spell out Street, not St.)
               Austin, TX 78701
Phone:         (512) 867-5309                  (choose one format and stick to it)
Website:       https://www.acmeplumbing.com    (include trailing slash or not - be consistent)
```

Write this down. Every team member and every tool must use this exact format.

### Step 2: Discover existing citations

Use a combination of methods:
- Search Google for `"business name" "phone number"` and `"business name" "address"`
- Use citation discovery tools: BrightLocal Citation Tracker, Whitespark Local
  Citation Finder, or Moz Local
- Manually check the 20 most important directories (list below)

### Step 3: Categorize discrepancies

Create a spreadsheet with columns:
`Directory | URL | Current Name | Current Address | Current Phone | Status`

Status options: Correct, Needs Update, Needs Claim, Duplicate, Needs Removal

### Step 4: Fix in priority order

1. Claim and correct the top-tier directories first (list below)
2. Claim and correct industry-specific directories
3. Fix or remove duplicates
4. Build new citations on sites where the business is missing

### Step 5: Ongoing maintenance

Audit citations quarterly. Business moves, phone number changes, and staff
turnover cause drift. A citation management platform (Yext, BrightLocal, Moz
Local) can push updates in bulk and monitor for changes.

---

## Top Citation Sources by Priority

### Tier 1: Universal (all business types)

These are the highest-authority citations and should be correct before anything else:

| Directory | URL | Notes |
|---|---|---|
| Google Business Profile | business.google.com | Highest priority; governs local pack |
| Yelp | yelp.com | High consumer trust; important for reviews |
| Facebook | facebook.com | Business pages index heavily |
| Bing Places | bingplaces.com | Powers Bing, Alexa, Cortana |
| Apple Maps | mapsconnect.apple.com | iOS default; growing share |
| Foursquare | foursquare.com | Powers many other directories |
| Yellow Pages | yellowpages.com | Legacy authority |
| Better Business Bureau | bbb.org | Trust signal, especially for service businesses |
| Mapquest | mapquest.com | Still indexed by search engines |

### Tier 2: High-Authority General Directories

| Directory | Notes |
|---|---|
| Angi (formerly Angie's List) | Strong for home services |
| Thumbtack | Lead generation + citation |
| Citysearch | Aggregated by many data providers |
| Superpages | Older but still indexed |
| Hotfrog | International reach |
| Manta | Small business focus |
| Cylex | B2B and local |

### Tier 3: Industry-Specific Directories

**Restaurants and food service:**
- TripAdvisor, OpenTable, Zomato, Grubhub, DoorDash, Uber Eats, MenuPages

**Healthcare and medical:**
- Healthgrades, ZocDoc, WebMD Physician Directory, Vitals, RateMDs, Psychology Today

**Legal services:**
- Avvo, FindLaw, Justia, Lawyers.com, Super Lawyers, Martindale-Hubbell

**Home services (plumbing, HVAC, electrical, etc.):**
- Angi, HomeAdvisor, Houzz, Porch, Thumbtack, Networx

**Auto services:**
- AutoMD, RepairPal, CarGurus, DealerRater (for dealerships)

**Real estate:**
- Zillow, Trulia, Realtor.com, Homes.com

**Hotels and hospitality:**
- TripAdvisor, Booking.com, Expedia, Hotels.com, Airbnb

**Beauty and wellness:**
- StyleSeat, Vagaro, Booksy, Mindbody, Treatwell

### Tier 4: Local Citations

- Local Chamber of Commerce website
- City or county business directory
- Local newspaper business listings
- Local blog mentions and sponsorship pages
- Community organization directories

Local citations from geographically relevant sites carry stronger local ranking
weight than equivalent citations from national generic directories.

---

## LocalBusiness Schema: Core Pattern

Use JSON-LD embedded in a `<script>` tag in the `<head>` or at the end of `<body>`.
Do NOT use Microdata or RDFa - JSON-LD is Google's preferred format.

### Basic LocalBusiness

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Acme Plumbing Services",
  "image": [
    "https://www.acmeplumbing.com/images/storefront.jpg",
    "https://www.acmeplumbing.com/images/team.jpg"
  ],
  "@id": "https://www.acmeplumbing.com/#business",
  "url": "https://www.acmeplumbing.com",
  "telephone": "+15128675309",
  "email": "contact@acmeplumbing.com",
  "priceRange": "$$",
  "currenciesAccepted": "USD",
  "paymentAccepted": "Cash, Credit Card",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street, Suite 100",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "postalCode": "78701",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.2672,
    "longitude": -97.7431
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "14:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/acmeplumbing",
    "https://www.yelp.com/biz/acme-plumbing-austin",
    "https://g.page/acme-plumbing-austin"
  ]
}
</script>
```

### Use Specific @type When Available

Replace `"LocalBusiness"` with the most specific applicable type. Specific types
unlock additional schema properties and can trigger enhanced search features.

Common specific types:
- `Plumber`, `Electrician`, `GeneralContractor`, `HVACBusiness`, `Locksmith`
- `Restaurant`, `FastFoodRestaurant`, `CafeOrCoffeeShop`, `Bakery`, `BarOrPub`
- `MedicalBusiness`, `Dentist`, `Physician`, `Optician`, `Pharmacy`
- `LegalService`, `Attorney`
- `AutomotiveBusiness`, `AutoRepair`, `CarDealer`
- `BeautySalon`, `HairSalon`, `NailSalon`, `SpaOrBeautyService`
- `RealEstateAgent`
- `FinancialService`, `AccountingService`, `InsuranceAgency`
- `ChildCare`
- `FitnessCenter`, `SportsClub`
- `Hotel`, `LodgingBusiness`
- `Store`, `GroceryStore`, `ClothingStore`, `BookStore`

---

## Multi-Location Schema

For businesses with multiple locations, each location page gets its own schema
block. Use `@id` to make each entity distinct and use `parentOrganization` to
link branches to the main company.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Acme Plumbing Services - South Austin",
  "@id": "https://www.acmeplumbing.com/locations/south-austin/#business",
  "url": "https://www.acmeplumbing.com/locations/south-austin/",
  "telephone": "+15128675310",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "456 South Lamar Blvd",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "postalCode": "78704",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.2500,
    "longitude": -97.7600
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Acme Plumbing Services",
    "@id": "https://www.acmeplumbing.com/#organization",
    "url": "https://www.acmeplumbing.com"
  },
  "sameAs": [
    "https://www.yelp.com/biz/acme-plumbing-south-austin",
    "https://g.page/acme-plumbing-south-austin"
  ]
}
</script>
```

**Important:** The `@id` must be unique per location. Use the location page URL
with a fragment identifier (`#business`). Do not reuse the same `@id` across
multiple location pages.

---

## Service Area Schema

For service-area businesses (no storefront or hidden address), use `areaServed`
instead of a fixed geographic coordinate:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Acme Plumbing Services",
  "@id": "https://www.acmeplumbing.com/#business",
  "url": "https://www.acmeplumbing.com",
  "telephone": "+15128675309",
  "areaServed": [
    {
      "@type": "City",
      "name": "Austin",
      "sameAs": "https://en.wikipedia.org/wiki/Austin,_Texas"
    },
    {
      "@type": "City",
      "name": "Round Rock"
    },
    {
      "@type": "City",
      "name": "Cedar Park"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Travis County"
    }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "19:00"
    }
  ]
}
</script>
```

Note: Do NOT include an `address` when the physical address is hidden on GBP.
Inconsistency between schema address and GBP data is a trust signal mismatch.

---

## Review Schema

Add aggregate review data to LocalBusiness schema to display star ratings in
search results. The `aggregateRating` is computed from your review data:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Acme Plumbing Services",
  "@id": "https://www.acmeplumbing.com/#business",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Jane D."
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "datePublished": "2024-11-15",
      "reviewBody": "Fast response, professional service. Fixed our burst pipe within 2 hours."
    }
  ]
}
</script>
```

**Warning:** Only include reviews that are genuine and were given by real customers.
Do not fabricate `review` items in schema - Google cross-references these against
actual review platforms and can apply manual penalties for manipulative markup.

Only include `aggregateRating` if the page genuinely represents a business and
the rating data reflects real reviews. Pages with fabricated ratings can receive
a rich result penalty.

---

## Schema Validation

Always validate schema markup before publishing:

1. **Google Rich Results Test**: `search.google.com/test/rich-results`
   - Tests whether the page is eligible for rich results
   - Shows detected schema entities and any errors

2. **Schema Markup Validator**: `validator.schema.org`
   - Validates against the full Schema.org specification
   - More thorough than the Rich Results Test for edge cases

3. **Google Search Console**: After deployment, check the "Enhancements" section
   in Search Console for structured data errors and warnings at scale

**Common schema errors:**

| Error | Cause | Fix |
|---|---|---|
| Missing required field | A required property (e.g. `name`, `address`) is absent | Add the missing property |
| Invalid value type | A number field contains a string, or a URL field is malformed | Correct the value format |
| Duplicate @id | Two entities share the same `@id` value | Make `@id` values unique per entity |
| Invalid phone format | Phone not in E.164 format (`+1XXXXXXXXXX`) | Use E.164 format or local format consistently |
