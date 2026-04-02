# Link Building & Off-Page Reference

## Toxic Link Patterns

### Definite Spam (Auto-Flag for Disavow)

| # | Pattern | Why toxic |
|---|---------|-----------|
| 1 | 10K+ outbound links per page | Link farm, no editorial value |
| 2 | Domain not indexed in Google | Penalized or deindexed domain |
| 3 | Domain <30 days old with 100+ outbound links | Spam domain |
| 4 | Exact-match anchor from 5+ unrelated domains | Coordinated link scheme |
| 5 | Doorway pages (thin, keyword-stuffed) | Penalty-triggering content |
| 6 | Hacked sites (pharma/casino injections) | Malicious link injection |
| 7 | Known PBN (Private Blog Network) | Artificial link scheme |
| 8 | Footer/sidebar site-wide links from unrelated domains | Paid/manipulative links |
| 9 | Auto-generated/spun content | No editorial value |
| 10 | Previously penalized domains | Toxic association |

### Likely Spam (Manual Review Required)

| # | Pattern | Action |
|---|---------|--------|
| 11 | >90% outbound link ratio | Review context |
| 12 | Language mismatch with your content | Usually irrelevant |
| 13 | Expired domain (recently re-registered) | Often repurposed for spam |
| 14 | Pages with 50+ outbound links | Diluted value, possibly link page |
| 15 | Zero organic traffic to linking page | No real audience |
| 16 | Reciprocal link patterns (A links B, B links A) | Excessive reciprocal = scheme |
| 17 | Web 2.0 properties with thin content | Created solely for links |
| 18 | Article directories (pre-Penguin era) | Low quality, often penalized |
| 19 | Low-quality guest posts (generic, off-topic) | Manipulative if pattern |
| 20 | Completely unrelated niche | No topical relevance |

### Potentially Problematic (Monitor)

| # | Pattern | When to act |
|---|---------|------------|
| 21 | Social bookmarking at scale | If hundreds from same platform |
| 22 | Forum profile links (no posts) | If pattern across many forums |
| 23 | Press release networks | If anchor-text optimized |
| 24 | Coupon aggregators | If links are followed |
| 25 | Generic directories (not industry-specific) | If hundreds submitted |
| 26 | Hidden anchor text (same color as background) | Always problematic |
| 27 | Cloaked content (different content for bots) | Always problematic |
| 28 | Affiliate thin content sites | If link farm pattern |
| 29 | Blog comments without editorial context | If mass-submitted |
| 30 | Nofollow-only domains linking | Not toxic, but no value |

---

## Anchor Text Distribution

### Healthy Benchmarks by Industry

| Anchor type | SaaS | E-commerce | Local Service | Publisher |
|------------|------|------------|---------------|----------|
| Branded ("Acme Inc") | 40-55% | 35-45% | 45-60% | 50-65% |
| URL/naked ("acme.com") | 15-20% | 15-25% | 10-15% | 10-20% |
| Generic ("click here", "learn more") | 10-15% | 10-15% | 15-20% | 10-15% |
| Exact-match keyword | 3-8% | 5-10% | 5-10% | 2-5% |
| Partial-match keyword | 10-15% | 10-20% | 5-10% | 5-10% |
| Natural/miscellaneous | 5-10% | 5-10% | 5-10% | 5-10% |

**Red line**: Exact-match keyword anchor >15% = Penguin algorithm penalty risk.

### Analysis Process
1. Export all backlinks with anchor text
2. Categorize each anchor into types above
3. Compare ratios against industry benchmarks
4. Flag if exact-match exceeds 15%
5. Check for patterns (same anchor from multiple domains = likely purchased)

---

## Link Velocity Red Flags

| Pattern | Possible cause | Action |
|---------|---------------|--------|
| 10x normal new links in 1 week | Negative SEO attack or viral content | Check link quality; if spam, disavow |
| 50%+ links lost in 1 month | Penalty, site migration issue, or linking sites removed | Investigate source of loss |
| Zero new links for 3+ months | Content not attracting links | Refresh content strategy |
| All new links from same TLD | Coordinated building | Diversify sources |
| Sudden spike in exact-match anchors | Purchased links campaign | Stop and diversify |

---

## Disavow File Format

```
# Disavow file for example.com
# Generated: 2026-04-01
# Review: Quarterly

# Spam domains (PBN network identified March 2026)
domain:spamsite1.com
domain:spamsite2.com
domain:linkfarm-network.com

# Individual toxic URLs
https://example-directory.com/paid-listing-page
https://hacked-site.com/injected-pharma-page

# Expired domain re-registrations
domain:expired-domain-spam.com
```

### Disavow Decision Framework

| Situation | Action |
|-----------|--------|
| Manual action from Google | Disavow toxic links + submit reconsideration request |
| Negative SEO attack (sudden spam links) | Disavow immediately |
| Old low-quality links from years ago | Disavow if pattern is significant |
| Few low-quality links, no penalty | Monitor, do not disavow (Google usually ignores) |
| Competitor has similar low-quality links and ranks | Do NOT disavow - these links are not causing harm |

**Important**: Only submit disavow if you have evidence of penalty or significant toxic patterns. Over-disavowing can remove beneficial links.

---

## Link Acquisition Strategies

### 1. Digital PR (Highest Value)

**Process**:
1. Create a linkable asset (original research, data study, survey, tool, infographic)
2. Identify 50-100 journalists/bloggers covering your topic
3. Write personalized outreach (reference their recent work)
4. Pitch the story angle, not just the link
5. Follow up once after 3-5 business days

**Success metrics**: 5-15% response rate, 2-5% placement rate is good.

**Linkable asset types by effectiveness**:
- Original data/research studies (highest)
- Interactive tools and calculators
- Comprehensive industry reports
- Expert roundups with unique insights
- Visual content (infographics with unique data)

### 2. Resource Page Link Building

**Process**:
1. Search `intitle:"resources" + [your topic]` or `inurl:resources + [your niche]`
2. Find pages that curate links to useful resources
3. Verify the page is actively maintained (check last update)
4. Ensure your content genuinely adds value to their list
5. Email the page owner with a specific suggestion for where your link fits

### 3. Broken Link Building

**Process**:
1. Find resource pages in your niche (same as above)
2. Check outbound links for 404s (browser extension or crawl tool)
3. Create or identify your content that replaces the broken resource
4. Email: "I noticed [broken link] on your [page]. I have a similar resource at [URL] that covers [topic]."

**Response rate**: Typically 5-10% (higher than cold outreach because you're solving a problem)

### 4. Guest Posting

**Site vetting checklist**:
- [ ] Has real organic traffic (not just domain authority)
- [ ] Publishes content relevant to your niche
- [ ] Has editorial standards (rejects low-quality submissions)
- [ ] Links are contextual within content (not author bio only)
- [ ] Not a "write for us" link farm (check if they accept everything)

### 5. Unlinked Brand Mentions

**Process**:
1. Set up Google Alerts for your brand name, product names, key personnel
2. When a mention appears without a link, email: "Thanks for mentioning [brand]. Would you consider adding a link to [URL] for your readers' convenience?"
3. Focus on mentions in editorial content, not comments or forums

**Success rate**: 10-20% (highest of all strategies because they already know you)

---

## Backlink Profile Health Score

### Scoring Components

| Component | Weight | What to measure |
|-----------|--------|----------------|
| Referring domain diversity | 20% | Unique domains linking (more = better) |
| Domain quality distribution | 20% | % of links from DR 40+ domains |
| Anchor text distribution | 15% | Alignment with industry benchmarks |
| Toxic link ratio | 20% | % of links matching toxic patterns |
| Link velocity trend | 10% | Steady growth vs spikes/drops |
| Follow/nofollow ratio | 5% | Natural mix (70-85% follow is typical) |
| Topical relevance | 10% | % of links from topically related sites |

### Score Interpretation

| Score | Status | Action |
|-------|--------|--------|
| 85-100 | Excellent | Maintain current strategy |
| 70-84 | Good | Address minor issues |
| 50-69 | Needs work | Prioritize toxic cleanup and diversification |
| 30-49 | Poor | Major cleanup needed, focus on quality acquisition |
| 0-29 | Critical | Likely penalized, full audit and disavow required |

---

## Free Backlink Data Sources

| Source | Data quality | Coverage | Best for |
|--------|-------------|----------|----------|
| Moz API (free tier) | Good | ~70% | DA/PA, spam score (2,500 rows/month) |
| Bing Webmaster | Moderate | ~15% | Competitor comparison (unlimited for verified) |
| Common Crawl | Basic | 25-40% | Domain-level PageRank, always free |
| Manual verification | Binary | N/A | Confirming specific links exist |

**Key insight**: Free sources combined capture 20-40% of raw backlink data but **60-70% of actionable intelligence** (highest-authority links appear in free samples). For sites with <500 backlinks, free sources capture 50%+ of the meaningful profile.

### Confidence Weighting for Multi-Source Analysis
| Source | Weight |
|--------|--------|
| DataForSEO (premium) | 1.00 |
| Verification crawler (binary) | 0.95 |
| Moz API | 0.85 |
| Bing Webmaster | 0.70 |
| Common Crawl | 0.50 |

**Data sufficiency gate**: Require 4+ of 7 scoring factors to produce a numeric health score. Otherwise report "INSUFFICIENT DATA" rather than misleading scores.

---

## Competitor Backlink Gap Analysis

### Process
1. Identify top 3-5 ranking competitors for your target keywords
2. Pull backlink profiles for each competitor
3. Find domains that link to 2+ competitors but NOT to you (= gap)
4. Prioritize gap domains by: relevance > authority > traffic
5. Create content that earns links from gap domains
6. Outreach with content that adds value to their audience

### Gap Prioritization

| Priority | Criteria |
|----------|----------|
| High | Links to 3+ competitors, topically relevant, DR 40+ |
| Medium | Links to 2 competitors, or relevant with DR 20-40 |
| Low | Links to 1 competitor only, or low relevance |
