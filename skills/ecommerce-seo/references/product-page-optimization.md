<!-- Part of the ecommerce-seo AbsolutelySkilled skill. Load this file when
     working on product page (PDP) SEO: title tags, meta descriptions, images,
     reviews, variant handling, cross-selling, or product schema deep dives. -->

# Product Page Optimization Reference

A complete checklist for making every product detail page (PDP) perform in organic search.
Product pages target high-intent, specific queries. The goal is to match searcher intent,
load fast, and earn rich snippets.

---

## 1. Title Tag

### Formula

```
{Product Name} - {Key Differentiator} | {Brand or Store Name}
```

**Examples:**
```
Nike Air Max 270 - Men's Running Shoes in Black | SportStore
Victorinox Swiss Army Knife - Classic SD 58mm Red | KnifeShop
Bose QuietComfort 45 - Wireless Noise Cancelling Headphones | AudioGear
```

### Rules

- Keep under 60 characters (Google truncates at ~600px width, roughly 60 chars)
- Include the primary product keyword near the front
- Do NOT use the same title across variants - `Nike Air Max 270 Black` and
  `Nike Air Max 270 Red` should have different titles
- Avoid keyword stuffing: `Nike Air Max 270 Running Shoes Best Running Shoe Buy Nike` is
  not a title, it's spam
- For variants consolidated under one URL: use the base product name without the variant
  attribute in the canonical URL's title

### Dynamic title template (CMS / server-side)

```
{product.name} - {product.type} in {product.primary_color} | {store.name}
// Output: "Levi's 501 Original - Men's Jeans in Dark Blue | DenimCo"
```

---

## 2. Meta Description

### Formula

```
{Action verb} the {Product Name}. {Price or deal}. {Key feature or benefit}.
{Shipping/returns info}. {CTA}
```

**Examples:**
```
Shop the Nike Air Max 270 for $129. Max Air heel unit for all-day comfort.
Free 2-day shipping. Easy 30-day returns.

Buy the Bose QC45 Headphones for $279. 24-hour battery life and active noise
cancellation. Ships tomorrow with free Prime delivery.
```

### Rules

- 140-160 characters (longer gets truncated in mobile SERPs)
- Include price - it drives CTR for transactional queries
- Mention availability ("In stock", "Ships today") if it converts
- Dynamic generation: pull from `product.price`, `product.shipping_message`
- Never duplicate meta descriptions across products - even templated ones must have
  unique data (product name + price makes them unique)

---

## 3. Heading Structure

```html
<h1>Nike Air Max 270</h1>          <!-- One per page, matches primary keyword -->
<h2>Product Details</h2>           <!-- Section breaks -->
<h2>Customer Reviews</h2>
<h2>You May Also Like</h2>
```

- H1 must be the product name, matching the URL slug and title tag keyword
- Do not use H1 for taglines or promotional copy ("Our Best Seller!")
- H2s structure the page for both users and crawlers

---

## 4. Product Description Copy

### What makes a description SEO-effective

- **Unique**: Never copy the manufacturer's description verbatim. Every major retailer
  receives the same manufacturer copy - you will never rank above the brand with
  duplicate content.
- **Specific**: Include dimensions, materials, use cases, compatibility
- **Natural keyword inclusion**: Write for the customer; keywords appear naturally
- **Minimum length**: 150-300 words for mid-range products, 300-500 for high-value items
- **Structured**: Use short paragraphs, bullet lists for specs, numbered lists for steps

### Template structure for product descriptions

```
[Opening paragraph - what is it and who is it for? 2-3 sentences]
[Key features list - 4-6 bullets with specifics]
[Use case paragraph - when/how would someone use this? 2-3 sentences]
[Technical specs - table or bullets]
[Social proof mention - "Rated 4.6/5 by 2,300+ customers"]
```

### Example (good)

```
The Nike Air Max 270 is designed for all-day wear. The oversized Air Max unit
in the heel delivers 270 degrees of visible cushioning - the most Air Nike
has ever put in a lifestyle shoe. The lightweight mesh upper keeps feet cool
during long days on your feet.

Key features:
- Full-length Phylon midsole for lightweight cushioning
- 270-degree Max Air heel unit - tallest Air bag in Nike history
- Breathable mesh upper with molded overlays
- Rubber outsole with circular traction pattern

Ideal for: street style, casual wear, light gym use. Runs true to size.
```

---

## 5. Product Images

### Filename and alt text

| Field | Bad | Good |
|---|---|---|
| Filename | `IMG_4892.jpg` | `nike-air-max-270-black-mens-side.jpg` |
| Alt text | `shoe` | `Nike Air Max 270 in black, men's, side view` |
| Alt text | `Nike Air Max 270` | `Nike Air Max 270 men's running shoe in black colorway` |

### Image SEO rules

- **Multiple angles**: Provide at minimum: front, side, back, top, on-model (if apparel).
  Google Images drives significant e-commerce traffic.
- **High resolution**: At least 800x800px. Google requires minimum 160x90px but larger
  images are preferred for rich results eligibility.
- **WebP format with JPEG/PNG fallback**: Reduces file size without quality loss
- **Serve from CDN**: Images must load fast. Use `width` and `height` attributes to
  prevent layout shift (CLS).
- **Image sitemap**: Include product images in your XML sitemap or use a dedicated image
  sitemap for large catalogs

### `ImageObject` schema for primary image

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nike Air Max 270",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/images/nike-am270-black-front-800x800.jpg",
    "width": 800,
    "height": 800
  }
}
</script>
```

---

## 6. Review Integration

Reviews serve dual purposes: ranking signal (freshness, engagement) and rich snippet
eligibility (star ratings in search results).

### Requirements for review rich snippets

Google's requirements for review rich snippets on product pages:
- Reviews must be written by real customers (editorial reviews from staff do not qualify)
- `AggregateRating` schema must reflect actual ratings shown on the page
- Rating counts must be accurate - inflating rating count is a manual action risk
- Cannot show stars for reviews that are not genuinely about the specific product on
  the canonical URL

### Schema implementation

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nike Air Max 270",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "bestRating": "5",
    "worstRating": "1",
    "reviewCount": "2341"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Sarah M."
      },
      "reviewBody": "Extremely comfortable for all-day wear. True to size.",
      "datePublished": "2024-11-15"
    }
  ]
}
</script>
```

### UX recommendations that support SEO

- Display review count prominently near the product name (builds trust + schema signal)
- Show star distribution (1-5 star breakdown) - reduces bounce rate
- Allow filtering reviews by verified purchase, rating, recency
- Show most recent reviews first, not just "most helpful" - signals freshness to Google

---

## 7. Variant Handling

### When to consolidate variants under one URL (recommended default)

Consolidate when variants differ only by color, size, material, or other minor attributes:
- `/products/nike-air-max-270` with a color selector on the page
- Canonical URL: always the base product URL
- Title tag: base product name (no specific color/size)
- All variants share one `Product` schema block with multiple `Offer` items

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nike Air Max 270",
  "offers": [
    {
      "@type": "Offer",
      "name": "Black - Size 10",
      "sku": "NK-AM270-BLK-10",
      "availability": "https://schema.org/InStock",
      "price": "129.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "name": "White - Size 10",
      "sku": "NK-AM270-WHT-10",
      "availability": "https://schema.org/OutOfStock",
      "price": "129.99",
      "priceCurrency": "USD"
    }
  ]
}
</script>
```

### When to give variants separate URLs (exception)

Give variants their own indexed URLs when:
- Each variant targets a distinct search query with meaningful volume
  (e.g., "red nike air max" vs "black nike air max" - check Search Console data)
- Variants are substantially different products (e.g., a hoodie vs a zip-up version)

For separate variant URLs:
- Each gets its own canonical, unique title, and unique description
- Include a `<link rel="canonical">` pointing to the variant's own URL (not the parent)
- Cross-link variants via a "Also available in:" section

### URL parameter handling for variants

Avoid: `/products/nike-air-max-270?color=black&size=10` as the canonical URL.
Prefer: `/products/nike-air-max-270` with color/size passed via JavaScript state or
form submission.

If you must use URL parameters for variants, use the canonical tag to consolidate:
```html
<!-- On /products/nike-air-max-270?color=black -->
<link rel="canonical" href="https://example.com/products/nike-air-max-270">
```

---

## 8. Cross-selling and Related Products

### SEO value of related products

Related product sections create internal links from product pages back to other product
pages, distributing PageRank through the catalog and reducing dead-end pages.

### Implementation rules

- Use the product name as anchor text ("Nike React Infinity Run"), not "Related Product 1"
- Link to products in the same category or complementary categories
- Include 4-8 related products - enough to be useful, not so many it dilutes the page
- Place above the fold if possible for crawl depth

### Schema for related products

Use `isRelatedTo` on the Product schema to signal relationships:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nike Air Max 270",
  "isRelatedTo": [
    {
      "@type": "Product",
      "name": "Nike React Infinity Run",
      "url": "https://example.com/products/nike-react-infinity-run"
    }
  ]
}
</script>
```

---

## 9. Product Page Technical Checklist

### Before launch

- [ ] Title tag: unique, under 60 chars, includes product name
- [ ] Meta description: unique, includes price or key feature, 140-160 chars
- [ ] H1: matches product name, one per page
- [ ] Description copy: unique (not manufacturer copy), 150+ words
- [ ] Images: descriptive filenames, alt text on all images
- [ ] `Product` schema with `Offer`: valid, availability matches page state
- [ ] `AggregateRating` schema (if reviews displayed): review count matches page
- [ ] Canonical URL: points to itself (or base product for variants)
- [ ] Breadcrumbs: present with `BreadcrumbList` schema
- [ ] Internal links: at minimum 4 related products with product name anchor text
- [ ] Page speed: LCP < 2.5s on mobile (run via PageSpeed Insights)
- [ ] No duplicate title/meta across products - spot check 10 products
- [ ] Validate schema with Google's Rich Results Test

### After launch

- [ ] Monitor Search Console > Enhancements > Products for schema errors
- [ ] Check Index Coverage for product pages - are they indexed within 2-3 weeks?
- [ ] Watch Crawl Stats for crawl frequency on product pages (indicates freshness signals)
- [ ] Track position for top product keywords (brand + product name queries)
