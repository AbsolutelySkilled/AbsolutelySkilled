<!-- Part of the seo-audit AbsolutelySkilled skill. Load this file when
     performing or reviewing the On-Page and Content SEO sections of an audit. -->

# On-Page and Content SEO Audit Checklist

Detailed verification steps, PASS/FAIL/WARN criteria, and fix guidance for all 15
on-page and content SEO checks (O1-O8 and C1-C7). For each check: what to look for,
how to verify, what status to assign, and how to fix it.

---

## On-Page SEO Checks (O1-O8)

---

## O1 - Unique Title Tags (50-60 Characters)

**What to check:**
- Every page has a `<title>` tag
- All title tags are unique across the site (no duplicates)
- Length is between 50-60 characters (shorter may underuse keyword opportunity;
  longer gets truncated in SERPs)
- Target keyword is present, ideally near the start
- Brand name is appended at the end: `Target Keyword - Page Description | Brand`

**How to verify:**
- Screaming Frog: Page Titles tab > filter by Duplicate, Missing, or Over/Under length
- GSC > Search Appearance > check for "Missing title tags" messages

**PASS/FAIL/WARN criteria:**
- PASS: All pages have unique titles in the 50-60 char range with primary keyword
- WARN: Some pages over 60 chars (truncation risk), a few missing titles, or keyword near end
- FAIL: More than 10% of pages missing title tags, widespread duplicates, or titles under 30 chars

**Common fixes:**
- Set unique title templates per page type: `{Product Name} - {Category} | Brand`
- For programmatic pages: use dynamic title generation based on content fields
- Load `on-site-seo` skill for framework-specific `<head>` management patterns

---

## O2 - Meta Descriptions Present (120-160 Characters)

**What to check:**
- Every indexable page has a unique meta description
- Length is 120-160 characters (shorter misses persuasion opportunity; longer gets truncated)
- Contains a call to action or value proposition - not just a keyword list
- Does not duplicate the title tag content

**How to verify:**
- Screaming Frog: Meta Description tab > filter Duplicate, Missing, Over/Under length
- Note: Google may rewrite meta descriptions. Source-level audit is required; GSC does not show your set descriptions.

**PASS/FAIL/WARN criteria:**
- PASS: All pages have unique descriptions in the 120-160 char range with a value proposition
- WARN: Some pages are missing descriptions, or descriptions are under 100 chars
- FAIL: More than 25% of pages missing meta descriptions, or site-wide duplicates

**Common fixes:**
- Write templates by page type: for product pages use `{product benefit} - {feature} - Shop now.`
- For blog posts: use the first 150 chars of the article intro as a fallback
- Avoid auto-generating descriptions that are identical across a template type

---

## O3 - Single H1 Per Page With Target Keyword

**What to check:**
- Every indexable page has exactly one H1 tag
- H1 contains the primary target keyword (naturally, not stuffed)
- H1 is different from the `<title>` tag (though similar is acceptable - not identical)
- H1 is the first visible heading on the page

**How to verify:**
- Screaming Frog: H1 tab > filter for Missing H1, Multiple H1, or Duplicate H1

**PASS/FAIL/WARN criteria:**
- PASS: Single unique H1 on every page, contains keyword, is first heading
- WARN: Some pages have H1 identical to title tag, or a few pages with multiple H1s
- FAIL: Pages missing H1, or H1 used purely for styling (e.g., a logo in an H1 tag),
  or H1 has no keyword relevance

**Common fixes:**
- Separate the visual heading (CSS `font-size`) from the semantic heading (`<h1>`)
- For CMSs: ensure the page title field maps to H1 in the template
- Do not use H1 for site name/logo in the header - use an `<a>` tag with appropriate aria-label

---

## O4 - Heading Hierarchy Correct (H1 > H2 > H3)

**What to check:**
- Headings follow a logical nested structure: H1 > H2 > H3, no levels are skipped
- H2s represent major sections; H3s represent subsections of H2s
- No H3 appears before any H2 on the page
- No heading tags used purely for visual styling (bold text formatted as H2)

**How to verify:**
- Screaming Frog: Headings tab to view all heading structures per page
- Browser extension HeadingsMap (Chrome/Firefox) shows heading tree visually

**PASS/FAIL/WARN criteria:**
- PASS: Logical heading hierarchy throughout; no skipped levels; H2s and H3s present
- WARN: Occasional skipped level (H1 > H3 without H2) on secondary pages
- FAIL: No H2s on key long-form pages, or heading tags used purely for visual decoration

**Common fixes:**
- Restructure content so major sections are H2 and subsections are H3
- Use CSS classes to control heading visual styles independently of semantic level

---

## O5 - Image Alt Text Present on All Images

**What to check:**
- All `<img>` elements have an `alt` attribute
- Alt text is descriptive and relevant to the image content (not stuffed with keywords)
- Decorative images use `alt=""` (empty string) - not missing the attribute entirely
- Product images include the product name and key attribute in alt text

**How to verify:**
- Screaming Frog: Images tab > filter for Missing Alt Text or Empty Alt Text

**PASS/FAIL/WARN criteria:**
- PASS: All content images have meaningful alt text; decorative images use `alt=""`
- WARN: Some content images missing alt text, especially on secondary pages
- FAIL: More than 20% of content images missing alt text, especially hero images and
  product images on key pages

**Common fixes:**
- For CMS content: enforce alt text as a required field in the media uploader
- For programmatic image generation: use product name + key attributes as alt template
- Run a content editor audit to add missing alt text to existing images in bulk

---

## O6 - Internal Linking Structure Is Logical

**What to check:**
- Key pages receive internal links from multiple relevant pages (link equity distribution)
- Anchor text is descriptive and keyword-relevant (not "click here" or "read more")
- Pillar pages link to cluster pages; cluster pages link back to pillar pages
- No broken internal links (linking to 404 or redirected URLs)
- Deep pages are accessible within 3-4 clicks from the homepage

**How to verify:**
- Screaming Frog: Inlinks tab on key pages; filter for pages with 0-2 inlinks
- Ahrefs Site Audit or Semrush: internal link distribution reports

**PASS/FAIL/WARN criteria:**
- PASS: Key pages have 5+ internal links from relevant pages with descriptive anchors;
  no broken links; pillar-cluster linking structure implemented
- WARN: Some important pages with fewer than 3 internal links; occasional generic anchor text
- FAIL: Key pages with zero or one internal link; widespread broken internal links;
  no topic cluster linking strategy

**Common fixes:**
- Add contextual internal links in blog post body copy to relevant pillar and product pages
- Update anchor text from generic ("learn more") to descriptive ("see our guide to SEO audits")
- Load `content-seo` skill for topic cluster and internal linking architecture patterns

---

## O7 - Open Graph Tags Complete

**What to check:**
- `og:title` present and accurate (can differ from `<title>` for social context)
- `og:description` present (120-200 chars for social)
- `og:image` present with dimensions at least 1200x630px
- `og:url` matches the canonical URL
- `og:type` set appropriately (`website` for homepage, `article` for blog posts)
- Twitter Card tags present (`twitter:card`, `twitter:title`, `twitter:image`)

**How to verify:**
- Facebook Sharing Debugger: `developers.facebook.com/tools/debug/`
- Screaming Frog: Directives tab > check for OG tags via custom extraction

**PASS/FAIL/WARN criteria:**
- PASS: All five core OG tags present on all indexable pages; image meets size requirements
- WARN: OG tags missing on some page types (e.g., tag or author pages), or image too small
- FAIL: No OG tags site-wide, or `og:image` missing on blog/product pages that are frequently shared

**Common fixes:**
- Next.js: use `metadata.openGraph` in `generateMetadata` or `layout.tsx`
- WordPress: Yoast or RankMath auto-generate OG tags from post data
- Ensure the OG image is uploaded at 1200x630px minimum; use a dynamic OG image generator
  (Vercel OG, Cloudinary) for programmatic content

---

## O8 - Semantic HTML Used

**What to check:**
- `<article>` wraps blog posts and standalone content pieces
- `<nav>` wraps navigation menus
- `<main>` wraps primary page content (only one per page)
- `<aside>` wraps related or sidebar content
- `<header>` and `<footer>` used for site-level structure
- Not using `<div>` for everything when semantic elements exist

**How to verify:**
- View source and inspect the document structure for landmark element usage
- Accessibility testing: axe DevTools or WAVE will flag landmark region issues

**PASS/FAIL/WARN criteria:**
- PASS: All major landmark elements used correctly; article/main/nav/aside applied appropriately
- WARN: `<main>` or `<article>` missing on content pages; `<div>` used where semantic element fits
- FAIL: Entire layout built with non-semantic divs; no structural HTML elements present

**Common fixes:**
- Replace `<div class="main-content">` with `<main>`
- Replace `<div class="blog-post">` with `<article>`
- Wrap site navigation in `<nav aria-label="Main navigation">`

---

## Content SEO Checks (C1-C7)

---

## C1 - No Thin Content Pages

**What to check:**
- No indexable pages with fewer than 300 words of meaningful body text
- Pages with low word count that serve a real purpose (contact page, privacy policy) should
  be noindexed if they offer no search value
- Thin pages that dilute crawl budget and domain authority

**How to verify:**
- Screaming Frog: custom extraction for word count, or use the Word Count column
- Ahrefs Site Audit: Content Quality report for thin pages
- GSC: check pages with impressions but very low CTR - often thin pages ranking poorly

**PASS/FAIL/WARN criteria:**
- PASS: All indexable content pages above 500 words; thin utility pages are noindexed
- WARN: Some landing pages in the 300-500 word range; a few utility pages unnecessarily indexed
- FAIL: Blog posts or product pages under 300 words indexed at scale; empty category pages indexed

**Common fixes:**
- Expand thin content with relevant supporting information, examples, or FAQs
- Add `<meta name="robots" content="noindex, follow">` to utility pages with no search value
- Consolidate multiple thin pages on the same topic into one comprehensive page

---

## C2 - No Keyword Cannibalization

**What to check:**
- Only one URL targets each primary keyword cluster
- Two or more pages are not competing for the same keyword (splitting ranking signals)
- Homepage and a blog post are not both targeting the same branded keyword
- Product page and a category page are not both optimized for the same product keyword

**How to verify:**
- Google: `site:domain.com "target keyword"` to find competing pages
- Ahrefs: Keywords Explorer > site filter to see which pages rank for the same keyword
- Semrush: Keyword Cannibalization report

**PASS/FAIL/WARN criteria:**
- PASS: One clearly designated URL per primary keyword; other pages supporting without competing
- WARN: Two pages occasionally ranking for similar (not identical) terms; minor overlap
- FAIL: Two or more pages directly targeting the same keyword with similar title, H1, and content

**Common fixes:**
- Designate one canonical URL for the keyword; redirect or consolidate competing pages
- Differentiate the cannibalized page to target a different keyword cluster
- Add internal links from the weaker page to the canonical page to consolidate signals
- Load `content-seo` skill for cannibalization resolution strategy

---

## C3 - Topic Clusters Defined

**What to check:**
- Pillar pages exist for core topics (long-form, comprehensive, 2000+ words)
- Cluster pages (supporting articles) cover subtopics and link to the pillar
- Pillar pages link to all relevant cluster pages
- Cluster pages link back to the pillar page with relevant anchor text
- No isolated content exists outside any cluster structure

**How to verify:**
- Map existing content to topics; pillar pages should show high inlink counts from cluster pages
- Ahrefs or Semrush: check which pages rank for topic variations - clusters should reinforce one another

**PASS/FAIL/WARN criteria:**
- PASS: Clear pillar-cluster structure for each core topic; bidirectional internal linking in place
- WARN: Pillar pages exist but cluster pages don't consistently link back; some topics lack clusters
- FAIL: No pillar pages; all content exists as isolated articles with no topic cluster structure

**Common fixes:**
- Identify top 3-5 core topics; create or designate a pillar page for each
- Audit existing cluster pages for missing links back to pillar; add contextual links in body copy
- Load `content-seo` skill for full topic cluster architecture methodology

---

## C4 - E-E-A-T Signals Present

**What to check:**
- Experience: first-hand experience evident in the content (personal examples, case studies)
- Expertise: author bio with credentials, professional background, or relevant experience
- Authoritativeness: links to and from authoritative sources in the niche
- Trustworthiness: clear publication and last-updated dates; citing sources; no misleading claims

**How to verify:**
- Manually review a sample of key content pages for author attribution, bio, and dates
- Check for About page, team page, and individual author pages
- Look for outbound links to authoritative sources (studies, official sources)

**PASS/FAIL/WARN criteria:**
- PASS: Author bios with credentials on all content pages; dates visible; sources cited; About page present
- WARN: Author attribution present but minimal bio; dates not shown or approximate
- FAIL: No author attribution on YMYL (Your Money Your Life) content; no About page; no sourcing;
  or content presents unverified claims without citation

**Common fixes:**
- Add author bio blocks with name, credentials, and LinkedIn or portfolio link to all articles
- Display visible publication and "last updated" dates on all content
- Create an About page and team page if absent
- Load `content-seo` skill for full E-E-A-T implementation strategy

---

## C5 - Content Freshness Maintained

**What to check:**
- No key pages with a "last updated" date more than 18 months ago (unless evergreen accuracy confirmed)
- High-traffic pages (top 20 by impressions) have been reviewed and updated in the past year
- Outdated statistics, product names, or pricing have been corrected
- Seasonal or time-sensitive content has date-appropriate messaging

**How to verify:**
- Export top 50 pages by impressions from GSC; check content update dates
- CMS admin: sort all published posts by last modified date; flag everything over 18 months

**PASS/FAIL/WARN criteria:**
- PASS: All top-traffic pages reviewed in the past 12 months; no visibly outdated statistics or dates
- WARN: Some secondary pages showing stale dates (12-24 months); minor outdated content
- FAIL: High-traffic pages with 2+ year old dates; outdated year references (e.g., "best tools of 2021");
  product pages referencing discontinued features

**Common fixes:**
- Set a quarterly content review calendar; prioritize top 20 pages by impressions
- Update `dateModified` in Article schema when content is substantively refreshed
- Remove or redirect content that is too outdated to refresh cost-effectively

---

## C6 - No Duplicate Content

**What to check:**
- No internal duplicate pages (same content on multiple URLs - with/without trailing slash,
  with/without `www`, HTTP vs HTTPS)
- No near-duplicate pages (product variants, color/size pages with near-identical copy)
- No content scraped or syndicated from other sites without canonical attribution
- Paginated pages don't duplicate the content of page 1

**How to verify:**
- Siteliner: `siteliner.com` scans for internal duplicate and near-duplicate content
- Screaming Frog: Content tab > filter Near Duplicates

**PASS/FAIL/WARN criteria:**
- PASS: No significant internal duplication; all URL variants canonicalize correctly
- WARN: Some near-duplicate product variant pages; minor pagination duplication
- FAIL: Multiple URLs serving identical content without canonicals; large-scale internal duplication

**Common fixes:**
- Add canonical tags: all URL variants (`?sort=price`, `/page/1`, `/index.html`) point to the
  clean canonical URL
- For product variants: create unique differentiating copy for each variant page, or canonicalize
  all variants to the main product page
- Configure 301 redirects: `www` > non-`www`, HTTP > HTTPS, trailing slash consistency

---

## C7 - Search Intent Alignment

**What to check:**
- Informational keywords target blog posts, guides, or FAQ pages (not product/category pages)
- Commercial investigation keywords target comparison pages, review articles, or category pages
- Transactional keywords target product pages, pricing pages, or signup/checkout flows
- Navigational keywords target brand or specific product pages
- Content format matches intent: step-by-step guides for "how to" queries, lists for "best X" queries

**How to verify:**
- Search the target keyword in Google and review the SERP: what format and type are the top 10 results?
- If top results are all listicles and your page is a product page - intent mismatch
- Ahrefs: SERP overview for a keyword shows the content type Google is rewarding

**PASS/FAIL/WARN criteria:**
- PASS: Content type and format match what Google is already ranking for the target keyword
- WARN: Content is directionally correct (informational) but format is wrong (guide vs. listicle)
- FAIL: Product page targeting an informational query; blog post targeting a transactional query;
  content format entirely misaligned with what Google is rewarding

**Common fixes:**
- Remap misaligned URLs: convert a product page that targets an informational keyword into a guide,
  or create a new informational page and let the product page target transactional variants
- Reformat content: convert a long-form article into a numbered list if top results are all listicles
- Load `keyword-research` skill for intent classification methodology
