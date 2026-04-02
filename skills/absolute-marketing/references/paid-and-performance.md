<!-- Part of the Absolute Marketing skill. Load this file when setting up paid ad campaigns, creating ad creative, configuring analytics tracking, or building attribution models. -->

# Paid Advertising & Performance Analytics

## Platform Selection

| Platform    | Best For                  | Targeting Strength        | Cost Profile          | Creative Format         |
|-------------|---------------------------|---------------------------|-----------------------|-------------------------|
| Google Ads  | High-intent search        | Keyword intent, in-market | CPC varies by vertical| Text, Shopping, Video   |
| Meta        | Demand gen, visual        | Interest, lookalike, pixel| CPM $5-15 avg         | Image, Video, Carousel  |
| LinkedIn    | B2B, enterprise           | Job title, company, seniority | Higher CPMs ($30-80) | Sponsored content, InMail |
| TikTok      | Awareness, younger demo   | Interest, creative-first  | Lower CPMs, volatile  | Video-native, UGC-style |

### When to use which

- **Google Ads** - User is actively searching. Bottom-of-funnel. Best ROAS for known-intent products.
- **Meta** - User is not searching but fits your profile. Mid-to-top funnel. Visual products shine.
- **LinkedIn** - Decision-maker targeting matters more than cost. B2B with $10k+ ACV. Accept higher CPMs for precision.
- **TikTok** - Brand awareness, younger demographics (18-34). Creative quality matters more than targeting. Organic-feeling content wins.

## Campaign Structure & Budget

### Budget allocation

- **70% proven** - Campaigns and audiences with demonstrated ROI
- **30% testing** - New audiences, creatives, platforms, offers
- Never put more than 30% of total budget into unproven experiments
- Reserve 5-10% of the testing budget for truly wild experiments

### Scaling rules

1. Increase budget **20-30% at a time** - never double overnight
2. Wait **3-5 days** between increases to let the algorithm stabilize
3. If performance dips after scaling, hold for 48 hours before reverting
4. Horizontal scaling (new ad sets) is safer than vertical scaling (increasing budget)
5. Duplicate winning ad sets rather than endlessly raising spend on one

### Bid strategy progression

| Stage               | Strategy                    | When to move on                |
|---------------------|-----------------------------|--------------------------------|
| Launch              | Manual CPC or cost caps     | Gathering initial data         |
| Learning            | Target CPA with caps        | 50+ conversions in 30 days     |
| Scaling             | Automated with ROAS targets | Stable CPA over 2+ weeks      |
| Mature              | Monitor and adjust targets  | Weekly review cadence          |

- Do not switch to automated bidding until you have at least **50 conversions** in the conversion window
- Set target CPA 10-20% above actual CPA when switching to automated
- Always set maximum bid caps to prevent runaway spend

## Ad Creative

### Testing hierarchy (test in this order)

1. **Concept/angle** - What story are you telling? What pain point?
2. **Hook/headline** - First impression, scroll-stopping element
3. **Visual style** - Photography vs illustration vs UGC vs motion
4. **Body copy** - Supporting message, benefits, proof points
5. **CTA** - Button text, urgency, offer framing

Test higher-order elements first. A better angle beats a better CTA every time.

### Video ad structure (15-30s)

| Segment     | Timing   | Purpose                              |
|-------------|----------|--------------------------------------|
| Hook        | 0-3s     | Stop the scroll - pattern interrupt   |
| Problem     | 3-8s     | Agitate the pain point               |
| Solution    | 8-20s    | Show the product solving it          |
| CTA         | 20-30s   | Clear next step with urgency         |

- **85% of users watch without sound** - always add captions
- Front-load the value proposition in the first 3 seconds
- Show the product in use, not just the logo
- Square (1:1) works across more placements than 16:9
- Vertical (9:16) for Stories, Reels, TikTok

### Batch creative generation

| Wave   | What                          | Volume              |
|--------|-------------------------------|----------------------|
| Wave 1 | 3-5 distinct angles           | 5 variations each   |
| Wave 2 | Extend top 2 performing angles| 5-8 new variations   |
| Wave 3 | Wild cards and experiments    | 3-5 variations       |

- Run Wave 1 for 7-10 days
- Promote winners from Wave 1 into Wave 2
- Wave 3 tests completely new concepts to avoid creative fatigue
- Refresh creative every 4-6 weeks to combat ad fatigue

### Ad Angle Categories

Systematically generate angles before writing creative:

| Angle | Hook Pattern | Example |
|-------|-------------|---------|
| Pain point | "Tired of [problem]?" | "Tired of losing deals to slow follow-up?" |
| Outcome | "[Result] in [timeframe]" | "Close 30% more deals this quarter" |
| Social proof | "[Number] teams use [product] to..." | "10,000+ teams ship 3x faster" |
| Curiosity | "The [thing] most [people] miss" | "The metric most marketers ignore" |
| Comparison | "[Old way] vs [new way]" | "Spreadsheets vs. real-time dashboards" |
| Urgency | "[Deadline/scarcity] + [benefit]" | "Free until Friday - then $49/mo" |
| Identity | "Built for [persona]" | "Built for founders who hate busywork" |
| Contrarian | "[Common belief] is wrong" | "More features won't save your product" |

Test 3-5 angles in Wave 1. The winning angle matters more than the winning headline.

### Creative Iteration Workflow

After initial performance data (7-10 days, 1,000+ impressions per creative):

1. **Identify winners** - Top 2-3 by primary metric (CTR for awareness, CPA for conversion)
2. **Analyze losers** - Why did they fail? Wrong angle, weak hook, unclear CTA, or wrong audience?
3. **Iterate winners** - New hooks with same angle, different visuals, alternate CTAs
4. **Log learnings** - Maintain an iteration log: creative ID, angle, hook, result, learning
5. **Refresh cycle** - Replace bottom 20% of creatives every 2-3 weeks

### Minimum sample size

- **1,000 impressions** minimum before judging any creative
- **100 clicks** minimum before judging CTR reliability
- **20-30 conversions** minimum before judging conversion rate
- Statistical significance matters - use a calculator, do not eyeball it

## Platform Character Limits

| Platform   | Element          | Character Limit          | Notes                    |
|------------|------------------|--------------------------|--------------------------|
| Google RSA | Headline         | 30 chars x 15 slots      | Min 3 required           |
| Google RSA | Description      | 90 chars x 4 slots       | Min 2 required           |
| Meta       | Primary text     | 125 visible (full: 2200) | First 125 chars matter   |
| Meta       | Headline         | 40 chars                 | Truncates on mobile      |
| Meta       | Description      | 30 chars                 | Often hidden on mobile   |
| LinkedIn   | Intro text       | 150 recommended (600 max)| First 150 before "see more"|
| LinkedIn   | Headline         | 70 chars                 | Keep under 50 for mobile |
| TikTok     | Ad description   | 80 recommended (100 max) | Shorter performs better  |

Write to the visible limit. Assume everything after the fold is invisible.

## Retargeting

### Audience windows

| Segment | Definition              | Window    | Frequency         | Typical CPA  |
|---------|-------------------------|-----------|--------------------|---------------|
| Hot     | Cart abandon, trial start| 1-7 days  | Higher freq OK (daily) | Lowest    |
| Warm    | Key pages, pricing, demo | 7-30 days | 3-5x per week     | Medium        |
| Cold    | Any site visit           | 30-90 days| 1-2x per week     | Highest       |

### Retargeting rules

- Always exclude existing customers and recent converters
- Match creative to funnel stage - do not show the same ad to cart abandoners and blog readers
- Hot audience gets urgency and specific offers (discount, free trial extension)
- Warm audience gets social proof and case studies
- Cold audience gets brand reinforcement and education
- Set frequency caps per platform to avoid ad fatigue
- Burn pixels: remove users from retargeting once they convert

## Analytics Tracking

### Event naming conventions

- Format: `object_action` - lowercase, underscores as separators
- Be specific: `cta_hero_clicked` not `button_clicked`
- Include location context: `pricing_plan_selected` not `plan_selected`
- Use past tense for completed actions: `form_submitted`, `video_played`

Examples of good vs bad event names:

| Bad                  | Good                        | Why                            |
|----------------------|-----------------------------|--------------------------------|
| `click`              | `cta_hero_clicked`          | Specifies what and where       |
| `pageview`           | `pricing_page_viewed`       | Specifies which page matters   |
| `submit`             | `lead_form_submitted`       | Specifies the form type        |
| `Button1`            | `signup_button_clicked`     | Descriptive, no arbitrary IDs  |

### UTM conventions

- All lowercase, no spaces
- Use hyphens for multi-word values: `utm_campaign=spring-sale-2024`
- Consistent structure: `utm_source` (platform), `utm_medium` (channel type), `utm_campaign` (campaign name), `utm_content` (creative variant), `utm_term` (keyword or audience)
- Document all UTMs in a shared spreadsheet - UTM sprawl kills attribution
- Never put PII in UTM parameters

### Core tracking principle

**Track for decisions, not for data.** Before adding any event, ask: "What decision will this data inform?" If there is no answer, do not track it.

### GA4 essentials

1. **Enhanced measurement** - Enable page views, scrolls, outbound clicks, site search, video engagement, file downloads
2. **Custom events** - Key conversion actions specific to your product (signup, purchase, feature activation)
3. **Conversion events** - Mark your 3-5 most important events as conversions
4. **Audiences** - Build audiences for remarketing: engaged users, cart abandoners, feature users
5. **BigQuery export** - Enable for raw data access if you need custom analysis beyond GA4 UI

### Tracking implementation checklist

- [ ] Base analytics tag firing on all pages
- [ ] Conversion tracking pixel for each ad platform
- [ ] Server-side tracking for critical conversions (purchases, signups)
- [ ] UTM parameters on all paid links
- [ ] Cross-domain tracking if multiple domains
- [ ] Consent management for GDPR/CCPA compliance
- [ ] Enhanced conversions enabled (hashed first-party data)

## Attribution Models

| Model            | How it works                           | Best for              | Limitation                    |
|------------------|----------------------------------------|-----------------------|-------------------------------|
| First-touch      | 100% credit to first interaction       | Understanding discovery | Ignores nurture touchpoints  |
| Last-touch       | 100% credit to last interaction        | Understanding closing  | Ignores awareness channels   |
| Linear           | Equal credit to all touchpoints        | Simple multi-touch     | Over-credits low-value touches|
| Time-decay       | More credit to recent touchpoints      | Longer sales cycles    | Under-credits awareness      |
| Position-based   | 40% first, 40% last, 20% middle       | Balanced view          | Arbitrary weighting          |
| Data-driven      | ML-based credit assignment             | High-volume accounts   | Needs significant data volume |

### Attribution gotchas

- **Platform attribution is inflated** - every platform takes credit for the conversion. Facebook says it drove the sale. Google says it drove the sale. Both count it.
- **Compare platform data to GA4** - GA4 is your neutral source of truth (with its own biases)
- **Look at blended CAC** - Total marketing spend / total new customers. This is the number that actually matters.
- **Incrementality testing** - The gold standard. Hold out a geographic or audience segment, measure the lift. Expensive but honest.
- **View-through conversions** - Count them separately. A 1-day view-through is more credible than 28-day.
- Data-driven attribution requires **300+ conversions per month** to be reliable in most platforms.

## Paid Benchmarks

| Metric              | Google Search | Google Display | Meta (FB/IG)  | LinkedIn       | General Target  |
|---------------------|---------------|----------------|---------------|----------------|-----------------|
| CTR                 | 3-5%          | 0.5-1%         | 1-2%          | 0.5-1%         | -               |
| CPC                 | $1-5 (varies) | $0.50-2        | $0.50-3       | $5-12          | -               |
| CPM                 | -             | $2-10          | $5-15         | $30-80         | -               |
| Conversion Rate     | 3-5%          | 0.5-1%         | 1-3%          | 1-3%           | -               |
| LTV:CAC ratio       | -             | -              | -             | -              | 3:1 to 5:1     |
| Payback period      | -             | -              | -             | -              | < 12 months     |
| ROAS (e-commerce)   | 4-8x          | 2-4x           | 3-6x          | 2-4x           | > 3x            |

These are median benchmarks. Your vertical, offer, and funnel quality will cause significant variance. Always benchmark against your own historical data first.

## Common Mistakes

1. **Starting without conversion tracking** - Running ads without proper pixel/tag setup is burning money. Set up tracking before spending a dollar.
2. **Too many ad sets splitting budget** - Each ad set needs enough budget to exit learning phase. 3-5 ad sets is better than 15.
3. **Not excluding existing customers** - You are paying to re-acquire people who already bought. Always exclude customer lists.
4. **Judging creative under 1,000 impressions** - Small sample sizes produce random results. Be patient.
5. **Scaling budget more than 30%** - Large budget jumps reset the algorithm's learning. Scale gradually.
6. **Ignoring creative fatigue** - Performance drops after 4-6 weeks. Refresh creative on a schedule, not just when metrics tank.
7. **Optimizing for vanity metrics** - High CTR with low conversion rate means your ad promises something the landing page does not deliver.
8. **Same landing page for all campaigns** - Match the landing page message to the ad. Search ads need different pages than social ads.
9. **No negative keywords (Google)** - Without negatives, you pay for irrelevant searches. Review search terms weekly.
10. **Trusting platform attribution blindly** - Cross-reference with GA4 and blended CAC. Every platform over-reports.
