<!-- Part of the aeo-optimization AbsolutelySkilled skill. Load this file when
     working with voice search optimization, Speakable schema, FAQ pages for voice,
     or measuring voice search performance. -->

# Voice Search and FAQ Optimization - Deep Reference

## How voice search differs from typed search

Understanding the structural difference between voice and typed queries is the
foundation of all voice optimization decisions.

| Dimension | Typed query | Voice query |
|---|---|---|
| Average length | 2-4 words | 7-10 words |
| Phrasing | Keyword fragment ("best coffee shop NYC") | Full sentence ("What is the best coffee shop near me?") |
| Question words | Rare | Common (what, how, where, when, why, who) |
| Local intent | Moderate | High - "near me", "open now", "directions to" |
| Speed expectation | Tolerates delay | Expects instant spoken response |
| Ambiguity | Acceptable | Low - voice queries are usually specific |

### The conversational shift

Voice queries mirror how people talk, not how they type. This means:
- Long-tail query coverage matters more - conversational phrases have lower individual
  search volume but collectively capture significant voice traffic
- FAQ content performs strongly because FAQs are inherently structured as the Q&A format
  that voice assistants prefer to read aloud
- "Stop words" (is, the, a, how, what) that are typically stripped from typed queries
  are meaningful in voice - optimize for the full phrase, not the stripped keyword

---

## How voice assistants select answers

### Google Assistant

Google Assistant answers are almost exclusively pulled from featured snippets. If your
page holds the paragraph snippet for a query, Google Assistant will read that snippet
aloud when a user asks the equivalent question via voice. The selection process:

1. Query is interpreted as natural language
2. Google checks for a featured snippet matching the intent
3. If found, the snippet text is synthesized to speech and read with attribution
4. If no snippet, Google may read from a knowledge panel or decline to answer

**Implication:** Winning the paragraph featured snippet for voice-common queries IS the
voice optimization strategy. There is no separate "voice ranking" - it is the snippet.

### Siri (Apple)

Siri uses a combination of:
- Bing search results (for web queries)
- Apple Maps (for local queries)
- Wolfram Alpha (for factual/calculation queries)
- App integrations (calendar, contacts, music)

For general web queries, Siri reads from Bing's featured snippet equivalent. Optimizing
for Bing's featured snippets follows the same format principles as Google (paragraph
40-60 words, direct answer, matching header) but Bing places slightly more weight on
exact phrase matching.

### Amazon Alexa

Alexa primarily uses:
- Bing search results for factual queries
- Alexa's own Skills (developer-built voice apps)
- Specific data providers for weather, news, shopping

For general information queries, Alexa's behavior is similar to Siri - it reads from
Bing's answer boxes. For local and shopping queries, Amazon's own ecosystem takes
priority.

**Key takeaway:** Google Assistant is the most impactful target. Paragraph snippet
optimization benefits all three platforms simultaneously because Siri and Alexa also
use featured-snippet-like extraction from their respective search engines.

---

## Optimizing content for voice queries

### Query identification

Find your voice-appropriate queries:
1. Filter your keyword research for question-form queries (starts with who/what/where/
   when/why/how)
2. Identify queries with a featured snippet already showing in SERP (high voice
   eligibility indicator)
3. Cross-reference with PAA data - PAA questions are frequently voice queries
4. Use Google Search Console to find queries where your pages appear for question-form
   searches with low CTR (a snippet exists but it is not yours)

### Answer writing for voice

Voice answers have different requirements than written answers:

**Write for the ear, not the eye:**
- No bullet points or lists in the answer (lists don't read aloud coherently)
- No parenthetical asides - they sound unnatural when synthesized
- No abbreviations or acronyms without expansion on first use
- No links, citations, or asterisks
- Short sentences - complex syntax sounds robotic when read aloud
- Active voice: "You can do X" not "X can be done"

**Target length for voice answers:**
- 20-30 words for simple factual queries
- 40-60 words for explanatory queries (same as paragraph snippet target)
- Never more than 60 words - voice assistants truncate or skip longer blocks

**Template:**

```
[Query]: How long does keyword research take?

[Voice-optimized answer]: Keyword research typically takes 2 to 4 hours for a focused
topic cluster and 1 to 2 days for a full site audit. The time varies based on your
industry, the number of target pages, and the tools you use.
```

### Page speed for voice results

Google's voice results are served from fast-loading pages. The technical benchmarks
that improve voice eligibility:
- LCP (Largest Contentful Paint) under 2.5 seconds
- Page is served over HTTPS
- Page is mobile-responsive (most voice queries originate from mobile)
- No render-blocking JavaScript on the answer block

---

## Local voice search optimization

Local voice queries represent a disproportionately large share of voice traffic.
Common patterns:
- "[Business type] near me"
- "[Business type] open now"
- "Hours for [Business name]"
- "Directions to [Business name]"
- "Phone number for [Business name]"

### LocalBusiness schema

For any location-based business, `LocalBusiness` schema is the single most impactful
technical implementation for local voice eligibility:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Acme Coffee Roasters",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94102",
    "addressCountry": "US"
  },
  "telephone": "+1-415-555-0100",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "url": "https://acmecoffeeroasters.com",
  "sameAs": [
    "https://www.yelp.com/biz/acme-coffee",
    "https://www.facebook.com/acmecoffee"
  ]
}
</script>
```

### NAP consistency

NAP (Name, Address, Phone) consistency across the web directly affects local voice
eligibility. Google cross-references your LocalBusiness schema against:
- Google Business Profile
- Yelp, Tripadvisor, Bing Places, Apple Maps
- Industry directories

Inconsistencies lower confidence in the data and reduce voice answer reliability.
Audit NAP across all citations quarterly.

### "Near me" optimization

You cannot literally target "near me" in content - Google replaces it with the user's
actual location at query time. What you can do:
- Ensure your Google Business Profile is complete and accurate
- Include city and neighborhood names in your page content naturally
- Implement LocalBusiness schema with precise geo coordinates
- Get citations on local directories (drives confidence in location data)

---

## FAQ page best practices for voice

FAQ pages are the highest-leverage content format for voice because each Q&A pair is
inherently structured for voice extraction. An FAQ page done right can provide dozens
of voice answers from a single content investment.

### FAQ structure for voice eligibility

1. **Question phrasing**: Write questions exactly as users would speak them, including
   stop words. "What are the hours?" not "Hours?"

2. **Answer format**: Prose paragraphs only. No bullet lists, no tables, no images
   within the FAQ answer block.

3. **Answer length**: 20-60 words. Under 20 words may be too thin; over 60 words
   will not be read aloud in full.

4. **Self-contained answers**: Each answer must make sense without the question being
   visible. Voice assistants read the answer, sometimes with the question prefix and
   sometimes without.

5. **Markup**: Use `<details>/<summary>` for expandable FAQs only if you also have
   the FAQ visible in flat HTML format (Google can index hidden text but treats it
   with lower confidence).

### FAQPage schema for voice and rich results

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does SEO take to work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO typically takes 3 to 6 months to show significant results for
                 a new site. Established sites with strong authority can see ranking
                 improvements within 4 to 8 weeks of publishing optimized content."
      }
    }
  ]
}
</script>
```

**FAQPage schema rules:**
- Maximum 4-5 Q&A pairs recommended per page for rich result eligibility (Google
  shows 2 questions expanded in the SERP; more are clickable)
- Never use FAQPage schema on e-commerce product pages or ad-heavy pages (against
  Google guidelines and rich result eligibility rules)
- Answers in schema must exactly match visible page text

---

## Speakable schema - implementation details

Speakable schema (`SpeakableSpecification`) was introduced for news publishers but
applies to any page with content appropriate for audio playback.

### When to implement Speakable

Use Speakable schema when:
- The page has a clearly defined summary or key facts section
- Content is factual and time-relevant (current events, informational)
- You are a Google News-approved publisher (full Speakable eligibility)

For non-news sites, Speakable implementation has limited verified impact but no
downside - implement it on pages with strong FAQ or summary content.

### cssSelector approach (recommended)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "WebPage",
  "name": "What is Answer Engine Optimization",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [
      ".article-lead",
      ".key-takeaways",
      "#summary"
    ]
  },
  "url": "https://example.com/what-is-aeo"
}
</script>
```

The CSS selectors should point to elements containing:
- 1-3 short paragraphs (not lists or tables)
- Self-contained factual statements
- Content that makes sense when read aloud without visual context

### xpath approach (alternative)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "xpath": [
      "/html/head/title",
      "/html/body/article/section[@class='summary']/p[1]"
    ]
  }
}
</script>
```

Use `xpath` only if your CMS makes CSS class targeting unreliable.

### Content requirements for Speakable sections

- Maximum 30 seconds of read-aloud time (approximately 75-100 words at natural speech rate)
- No links, image references, or formatting instructions ("see the table above")
- Factual and declarative - no calls to action
- Content must be in the DOM on initial page load (no lazy loading)

---

## Measuring voice search impact

The honest limitation: there is no direct voice search data in Google Search Console.
Google does not segment queries by input modality (voice vs. typed). Measurement
requires indirect proxies.

### Proxy metrics in Google Search Console

Filter queries to identify likely voice candidates:
- Queries containing question words (how, what, where, when, why, who)
- Queries of 6+ words
- Queries with featured snippet appearances (Impressions with Position = 0)
- Position 0 impressions with low CTR (snippet is showing but users aren't clicking - may be voice)

A rising volume of question-form queries combined with growing Position 0 impressions
is the closest available proxy for growing voice traffic.

### Tracking snippet ownership

Voice traffic is downstream of snippet ownership. Track snippet ownership as the
leading indicator:
- Weekly rank tracking for target queries with `Features: Featured Snippet` filter
- Screenshot and timestamp snippet wins and losses
- Correlate snippet ownership changes with organic traffic changes

### Conversion attribution

For local businesses, attribute voice-driven conversions via:
- "How did you hear about us?" survey data (some users will mention voice/Siri/Alexa)
- Google Business Profile insights (calls, direction requests - these spike with local
  voice visibility)
- Phone call tracking numbers in LocalBusiness schema and GBP

---

## Voice search optimization checklist

- [ ] Question-form queries identified and prioritized by snippet eligibility
- [ ] Voice answer blocks written as 20-60 word prose (no lists, no links)
- [ ] FAQ page structured with conversational question phrasing
- [ ] FAQPage schema implemented on all FAQ pages (max 5 Q&A pairs)
- [ ] LocalBusiness schema implemented for location-based pages
- [ ] NAP consistency verified across all major directories
- [ ] Speakable schema added to pages with summary/key-facts sections
- [ ] Page LCP under 2.5 seconds and HTTPS enforced
- [ ] Google Business Profile complete and verified
- [ ] GSC voice proxy metrics (question-form queries, Position 0 impressions) baselined
