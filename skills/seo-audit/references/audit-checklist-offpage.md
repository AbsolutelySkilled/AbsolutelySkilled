<!-- Part of the seo-audit AbsolutelySkilled skill. Load this file when
     performing or reviewing the Off-Page SEO and AEO/GEO sections of an audit. -->

# Off-Page and AEO/GEO Audit Checklist

Detailed verification steps, PASS/FAIL/WARN criteria, and fix guidance for all 10
off-page and AEO/GEO readiness checks (L1-L5 and A1-A5). For each check: what to look
for, how to verify, what status to assign, and how to fix it.

---

## Off-Page SEO Checks (L1-L5)

---

## L1 - Backlink Profile Is Healthy

**What to check:**
- Total referring domains (quality matters more than count)
- Domain Rating (DR) or Domain Authority (DA) trend - growing, stable, or declining
- Diversity: backlinks come from multiple unique domains and industries, not just one source
- Topical relevance: linking sites are in or adjacent to your niche
- Editorial vs. paid vs. directory: editorial backlinks (someone linked because the content
  is good) are the most valuable

**How to verify:**
- Ahrefs: Site Explorer > Backlink Profile > Referring Domains (trending over time)
- Semrush: Backlink Analytics > Referring Domains with Authority Score distribution
- Moz Link Explorer: Domain Authority and Link profile overview
- GSC: Links report shows Google's confirmed view of your top linked pages and linking sites

**PASS/FAIL/WARN criteria:**
- PASS: Growing or stable referring domain count, majority from relevant and authoritative sites,
  diverse link sources, no manual penalty in GSC
- WARN: Flat or slightly declining referring domain count, many links from low-DR directories,
  concentrated from a single vertical or link type
- FAIL: Declining referring domain count with no recovery, majority of links from low-quality
  or irrelevant sites, manual action reported in GSC

**Common fixes:**
- Invest in editorial link acquisition through original research, data studies, or expert content
- Build relationships with niche-relevant sites for guest posts or co-marketing
- Load `link-building` skill for full backlink acquisition strategy

---

## L2 - No Toxic or Spammy Links

**What to check:**
- No links from known link farms, PBNs (Private Blog Networks), or paid link schemes
- No sudden spike of unnatural links (link bomb or negative SEO attack)
- No manual action notification in Google Search Console for unnatural links
- Disavow file is current and accurate if previously filed

**How to verify:**
- Ahrefs: Referring Domains > filter by low DR (under 5) with high link volume
- Semrush: Backlink Audit Tool > Toxic Score identifies risky links
- GSC: Manual Actions > check for any unnatural links manual action
- Review disavow file if one exists in GSC: Search Console > Links > Disavow

**PASS/FAIL/WARN criteria:**
- PASS: No manual actions, no significant toxic link clusters, disavow file up to date if applicable
- WARN: Small percentage of low-quality links but no manual action; disavow file not reviewed recently
- FAIL: Manual action received; large volume of toxic links identified; evidence of negative SEO
  attack with no disavow response

**Common fixes:**
- Attempt link removal requests to the linking domain first (contact webmaster)
- Submit or update the disavow file in GSC for links that cannot be removed
- Monitor with automated alerts for sudden link spikes (Ahrefs Alerts > New Backlinks)
- Load `link-building` skill for toxic link removal and disavow strategy

---

## L3 - Anchor Text Diversity

**What to check:**
- Anchor text distribution is natural: mix of branded (most common), naked URLs, generic
  ("click here"), and partial/exact-match keyword anchors
- Exact-match keyword anchors should not exceed 10-15% of total anchor text
- No single anchor text phrase dominates the profile (sign of manipulative link building)
- Branded anchors (company name, domain name) should represent 30-50% of anchors

**How to verify:**
- Ahrefs: Site Explorer > Anchors (shows all anchor text with frequency)
- Semrush: Backlink Analytics > Anchors tab
- Export anchor distribution; calculate percentage of each type

**PASS/FAIL/WARN criteria:**
- PASS: Branded anchors are most common; exact-match keyword anchors under 15%;
  healthy mix of generic, naked URL, and partial-match anchors
- WARN: Exact-match keyword anchors at 15-25%; limited branded anchor presence
- FAIL: Exact-match keyword anchors dominate (over 30%); clearly unnatural anchor
  pattern that suggests link scheme participation

**Common fixes:**
- When actively building links: vary anchor text intentionally; use brand name or target URL
  more often than exact-match keyword
- If over-optimized anchors exist historically: dilute by acquiring new links with brand/generic anchors
- Load `link-building` skill for anchor text strategy guidelines

---

## L4 - Local SEO Configured (If Applicable)

**What to check:**
- Only check this if the business has a physical location(s) or serves customers in specific
  geographic areas. Mark N/A for fully remote or global digital businesses.
- Google Business Profile (GBP) is claimed, verified, and fully completed
- NAP (Name, Address, Phone) is consistent across GBP, website, and all directory listings
- Reviews: business has recent reviews and owner is responding to them
- Local schema markup (`LocalBusiness`, `PostalAddress`) present on the site
- Embedded Google Map on the contact page

**How to verify:**
- Search `business name + city` in Google - GBP panel should appear on the right
- Moz Local or BrightLocal: NAP consistency audit across major directories
- Schema validator: `validator.schema.org` to check LocalBusiness schema

**PASS/FAIL/WARN criteria:**
- PASS: GBP claimed and fully filled (categories, hours, photos, description); NAP consistent;
  local schema present; recent reviews with responses
- WARN: GBP exists but incomplete (missing hours, no photos); occasional NAP discrepancies
  in minor directories
- FAIL: GBP not claimed; significant NAP inconsistencies; no local schema; no reviews in 6+ months

**Common fixes:**
- Claim and fully complete GBP profile: add all categories, photos, products/services, hours
- Run a NAP audit with Moz Local or BrightLocal; fix inconsistencies in top directories
- Load `local-seo` skill for full local SEO optimization methodology

---

## L5 - Brand Mentions and Citations

**What to check:**
- Brand name is mentioned on authoritative external websites, even without a link
- Brand is mentioned on industry publications, news sites, or relevant directories
- Brand appears in lists and roundups in the niche (e.g., "Top 10 tools for X")
- Unlinked brand mentions exist that could be converted to backlinks
- NAP citations in general business directories (Yelp, Crunchbase, LinkedIn company page)

**How to verify:**
- Google Alerts: set up for brand name to track new mentions
- Ahrefs: Content Explorer > search brand name with `highlight_unlinked` to find unlinked mentions
- Semrush: Brand Monitoring tool for mention tracking
- Manual search: `"brand name" -site:yourdomain.com` in Google

**PASS/FAIL/WARN criteria:**
- PASS: Regular new brand mentions on authoritative sites; unlinked mentions tracked and being
  converted; presence in major industry directories and listings
- WARN: Few brand mentions outside of owned content; not present in key industry lists
- FAIL: No external brand mentions; brand essentially unknown to the external web

**Common fixes:**
- Reach out to sites with unlinked mentions and ask them to add a link
- Submit to industry-relevant directories and lists: Crunchbase, G2, Product Hunt, etc.
- Issue press releases or original research to earn media coverage and citations
- Load `link-building` skill for digital PR and brand mention acquisition tactics

---

## AEO & GEO Readiness Checks (A1-A5)

---

## A1 - Content Optimized for Featured Snippets

**What to check:**
- Definition questions answered with a concise 40-60 word paragraph directly after the question
- "How to" content uses numbered steps formatted as an `<ol>` list
- Comparison or "best" content uses HTML tables
- "What is" and definitional queries have a bold or clearly structured first-answer paragraph
- Target question appears in the H2 or H3 directly above the answer

**How to verify:**
- Search your target keyword in Google and check if you hold the featured snippet (position 0)
- If a competitor holds it, analyze their format: paragraph, list, or table
- Ahrefs: SERP Features report shows which of your keywords trigger featured snippets

**PASS/FAIL/WARN criteria:**
- PASS: Key question-based keywords have a formatted direct-answer section; site holds
  featured snippets on some target keywords
- WARN: Question content exists but is buried in body paragraphs without direct-answer formatting;
  no featured snippet wins yet
- FAIL: No structured Q&A formatting on informational content; all answers buried in paragraphs

**Common fixes:**
- Reformat answers: add a question as H2/H3, then answer in 40-60 word paragraph immediately below
- Convert "how to" body paragraphs into `<ol>` numbered lists
- Load `aeo-optimization` skill for featured snippet capture methodology

---

## A2 - FAQ and HowTo Schema Implemented

**What to check:**
- FAQ schema (`FAQPage` + `Question` + `acceptedAnswer`) present on pages with Q&A content
- HowTo schema (`HowTo` + `HowToStep`) present on tutorial and step-by-step guide pages
- Schema is valid JSON-LD (not Microdata), placed in `<script type="application/ld+json">`
- Schema accurately reflects the visible content (Google rejects schema that doesn't match content)
- No over-implementation: FAQ schema only on pages that actually have FAQ sections

**How to verify:**
- Google Rich Results Test: `search.google.com/test/rich-results` for page-level validation
- Schema.org Validator: `validator.schema.org` for JSON-LD syntax checking
- GSC: Enhancements > FAQ / HowTo > check for errors and valid items

**PASS/FAIL/WARN criteria:**
- PASS: FAQ schema on FAQ pages, HowTo schema on tutorial pages, all valid in Rich Results Test,
  no GSC enhancement errors
- WARN: Schema present but some errors in GSC; or schema missing on some eligible page types
- FAIL: No FAQ or HowTo schema implemented despite site having significant Q&A and tutorial content;
  or schema present but invalid (causing GSC errors)

**Common fixes:**
- Add FAQ JSON-LD block to blog posts with FAQ sections - use a standard template
- For HowTo: ensure each `HowToStep` has a `name` and `text` property
- Load `schema-markup` skill for full structured data implementation patterns

---

## A3 - Content Structured for AI Extraction

**What to check:**
- Key information is presented in clearly labeled, extractable formats (not buried in prose)
- Definitions and explanations are in the first 100 words of a section, not at the end
- Content uses clear question-as-heading + answer-below structure throughout
- Tables and lists are used for comparative or enumerated information
- No critical information is locked inside images or PDFs without text equivalents
- Summary sections or TL;DR blocks at the top of long content

**How to verify:**
- Manually read the page as if you are an AI trying to answer "what is X" - can you
  find a clear, citable answer in the first few sentences?
- Check if the content appears in ChatGPT, Perplexity, or Google AI Overviews responses
  for target queries (manual spot-check)

**PASS/FAIL/WARN criteria:**
- PASS: Key answers are in the opening sentences of sections; information is in extractable
  text formats; content appears in AI answer boxes for target queries
- WARN: Information exists but requires reading full paragraphs to extract; some critical
  content is image-based
- FAIL: All key information buried in long prose paragraphs; heavy use of images for
  informational content; no Q&A structure

**Common fixes:**
- Add a "Quick Answer" or "TL;DR" block at the top of long articles
- Restructure paragraphs so the answer comes first, then the elaboration (inverted pyramid)
- Load `geo-optimization` skill for full AI search optimization methodology

---

## A4 - Entity Authority Signals Present

**What to check:**
- Brand entity is consistent across the web: same name, description, and category everywhere
- Wikipedia or Wikidata entry exists (for established brands)
- Knowledge Panel appears in Google for branded searches
- Content consistently references and is referenced by authoritative entities in the niche
- Structured data uses `sameAs` property to link to authoritative entity sources
  (LinkedIn, Crunchbase, Wikipedia, official social profiles)

**How to verify:**
- Search `brand name` in Google - does a Knowledge Panel appear on the right?
- Check Wikidata: `wikidata.org/wiki/Special:Search` for the brand name
- Inspect `Organization` or `Person` schema for `sameAs` properties

**PASS/FAIL/WARN criteria:**
- PASS: Knowledge Panel present for brand; `sameAs` in Organization schema pointing to
  LinkedIn, Crunchbase, and social profiles; consistent entity description across the web
- WARN: No Knowledge Panel; Organization schema missing `sameAs` links; inconsistent
  brand descriptions across platforms
- FAIL: No Organization schema; no entity presence on any authoritative third-party platform;
  brand name completely absent from the knowledge graph

**Common fixes:**
- Add `Organization` schema with `sameAs` array linking to all authoritative profiles
- Ensure GBP, LinkedIn company page, Crunchbase, and social profiles all use consistent
  brand name and description
- Load `schema-markup` skill for `Organization` and entity schema implementation

---

## A5 - LLMs.txt Present (If Applicable)

**What to check:**
- `https://domain.com/llms.txt` exists and is accessible (returns 200)
- `llms.txt` accurately describes what the site is, who it serves, and its key sections
- File follows the `llms.txt` specification: title, summary, and section links
- `llms-full.txt` optionally present for extended context
- Relevant pages are included in `llms.txt` for AI crawlers to prioritize

**How to verify:**
- Fetch `https://domain.com/llms.txt` directly in the browser
- Check that the file format matches the specification at `llmstxt.org`
- Verify the linked pages in the file are accessible and content-rich

**PASS/FAIL/WARN criteria:**
- PASS: `llms.txt` exists, well-formatted, includes key pages and accurate site description
- WARN: `llms.txt` exists but outdated or incomplete (missing key sections)
- FAIL: `llms.txt` missing entirely (FAIL only applies to sites where AI discoverability
  is a stated goal; mark N/A for sites that have no AI-search strategy)
- N/A: Site has no AI search optimization goals or is purely local/private

**Common fixes:**
- Create `llms.txt` at the domain root following the `llmstxt.org` specification
- Include: site title, summary paragraph, and links to the most important content sections
- Update quarterly when site structure or major content sections change
- Load `geo-optimization` skill for full `llms.txt` and GEO optimization methodology
