<!-- Part of the link-building AbsolutelySkilled skill. Load this file when
     auditing a backlink profile, identifying toxic links, creating a disavow file,
     or monitoring for negative SEO. -->

# Link Audit

A systematic process for auditing your backlink profile, identifying harmful links,
and managing your link equity to protect and improve organic rankings.

---

## 1. When to Run a Link Audit

Trigger a full audit when:
- You have experienced an unexplained rankings drop
- You are inheriting an existing domain (acquisition, agency handover, etc.)
- You have historically used aggressive link building tactics
- You are recovering from a manual action (Google penalty)
- You are conducting quarterly off-page SEO maintenance
- You suspect negative SEO (competitor-initiated spam attack)

Run a lightweight monitor continuously: set Ahrefs or Google Search Console alerts
for significant new link volume spikes, which can signal a negative SEO attack.

---

## 2. Tools for a Backlink Audit

| Tool | Primary use | Cost |
|---|---|---|
| Google Search Console | Official Google data; new links report, manual actions | Free |
| Ahrefs Site Explorer | Most comprehensive backlink index; toxic link scoring | Paid |
| Semrush Backlink Audit | Automated toxicity scoring; disavow file export | Paid |
| Moz Link Explorer | Spam Score metric per domain | Paid (limited free) |
| Majestic | Trust Flow / Citation Flow metrics | Paid |

**Recommended workflow**: Start with Google Search Console for the authoritative
Google view, then enrich with Ahrefs or Semrush for scoring and filtering.

---

## 3. Exporting Your Backlink Data

### Google Search Console

1. Open GSC > Links > External Links
2. Download "More sample links" exports for Top linking sites and Top linked pages
3. This gives you Google's direct view of your link profile - always start here

### Ahrefs

1. Site Explorer > enter your domain > Backlinks
2. Filter: dofollow, one link per domain, live links
3. Export to CSV (up to 150,000 rows on standard plans)

### Semrush

1. Backlink Analytics > your domain > Backlinks
2. Use the Backlink Audit tool (separate from the Analytics tool) for automated
   toxicity scoring with a pre-built "Toxic" column

---

## 4. Metrics to Check Per Backlink

For each linking domain, assess:

| Metric | What it tells you | Concern threshold |
|---|---|---|
| Domain Rating / Domain Authority | Overall link strength of the linking domain | Not a concern in itself - even low-DR links can be legitimate |
| Moz Spam Score | Percentage of similar sites that were penalized | Flag at 60%+ |
| Majestic Trust Flow | Editorial quality of links to the domain | Flag if very low relative to Citation Flow |
| Organic Traffic (Ahrefs) | Does the site have real visitors? | Flag if near-zero traffic with many outbound links |
| Topical Relevance | Is the site related to your niche? | Flag if completely unrelated and pattern-matched |
| Anchor Text | What anchor was used? | Flag for exact-match keyword patterns at scale |
| Link Placement | Where on the page is it? | Flag sitewide footer/sidebar links from low-quality sites |
| Link Velocity | When did the links appear? | Flag for sudden spikes (especially same anchor text) |

---

## 5. Identifying Toxic and Spammy Links

### 5.1 Hard signals (almost always disavow)

- Links from sites that are known link farms (sell links openly, no real content)
- Links from sites in completely unrelated niches in suspicious volumes (e.g.,
  hundreds of links from gambling sites to a B2B software company)
- Sitewide links (links appearing in footers or sidebars across hundreds of pages on
  one domain) from low-quality sites
- Links using exact-match keyword anchors at scale (e.g., 50 links all with the
  anchor "buy cheap insurance online")
- Links from deindexed or penalized domains
- Links that appear to have been placed automatically (comment spam, forum profile
  spam, wiki spam)
- Links from sites that don't exist anymore but are still in Ahrefs index (Wayback
  Machine check shows site was a PBN or thin content site)

### 5.2 Soft signals (investigate before deciding)

- Low Moz Spam Score (30-60%) - check the site manually before disavowing
- Irrelevant domain - an unrelated link is not inherently harmful unless it fits
  a manipulative pattern
- Low DR - low DR links are typically neutral, not harmful
- Nofollow links from spammy sites - these rarely need disavowing as Google already
  ignores them

### 5.3 Manual site inspection checklist

For flagged domains, visit the site and check:
- [ ] Does the site have original, readable content?
- [ ] Are there real authors/About pages?
- [ ] Does the site have organic search traffic? (Ahrefs Overview)
- [ ] Is the outbound link section a paid/sponsored link list?
- [ ] Does the site cover the same or related topics to yours?
- [ ] Was the link editorially placed (in context of an article) or obviously injected?

If 3+ of these checks fail, flag for disavow.

---

## 6. Anchor Text Ratio Analysis

A healthy anchor text distribution looks roughly like:

| Anchor type | Healthy range | Red flag range |
|---|---|---|
| Branded (company name, domain) | 40-60% | Below 20% |
| Naked URL (yourdomain.com) | 10-20% | Below 5% |
| Generic ("click here", "read more") | 5-15% | Not a concern unless 50%+ |
| Partial match (keyword + other words) | 10-20% | Not a concern unless rising unusually |
| Exact match (target keyword verbatim) | 1-5% | Above 10% is a Penguin risk signal |
| Other/miscellaneous | 5-15% | Not a concern |

**How to check**: In Ahrefs Site Explorer, go to Anchors report. Export the full list
and categorize each anchor into the buckets above. Calculate percentages.

**If exact-match anchors are over 10%**:
1. Identify which domains are using exact-match anchors
2. Check if these are editorial links where the anchor was natural, or if they look
   placed specifically for SEO
3. Disavow the obviously manipulative exact-match links first
4. Begin building more branded and generic-anchor links to dilute the ratio

---

## 7. Segmenting Links for Action

After reviewing your flagged links, segment them:

**Category A - Keep**: Legitimate editorial links, even if from lower-quality sites.
Do not disavow links from real sites that editorially chose to link to you.

**Category B - Request removal**: The most egregious toxic links (PBN links, paid
links you acquired, link farm placements). Attempt to contact the site owner first:
- Use Hunter.io or WHOIS to find contact info
- Send a polite removal request email
- Log every attempt with date and response
- If no response after 2 attempts, move to Category C

**Category C - Disavow**: Links where removal is impossible (site is abandoned, owner
unresponsive after 2 attempts, or site is clearly spam with no legitimate contact).
Also: any link you are confident is manipulative and harming your site.

**Threshold for disavowing**: Do not disavow based on low DR alone. Google ignores
most irrelevant low-quality links naturally. Only disavow when you see clear
manipulative patterns or hard signals above.

---

## 8. Creating a Disavow File

### 8.1 File format

The disavow file is a plain text (.txt) file. Google's format:

```
# Disavow file for example.com
# Created: 2025-01-15 | Reason: Toxic link cleanup after manual audit
# Domains disavowed: 47

# Tier 1 - confirmed PBN and link farms (manual review)
domain:cheap-links-example.com
domain:pbn-network-site.net
domain:spam-blog-2019.co

# Tier 2 - unresponsive removal requests
domain:abandoned-spam-site.com

# Individual URLs (use when only specific pages are problematic)
https://otherwise-legitimate.com/specific-spam-page
```

**Rules**:
- One entry per line
- `domain:` prefix disavows ALL links from that domain (preferred)
- A bare URL disavows only that specific URL
- Lines starting with `#` are comments - use them liberally for documentation
- File encoding must be UTF-8 or 7-bit ASCII
- Maximum file size: 2MB (approximately 100,000 lines)

### 8.2 Uploading to Google Search Console

1. Go to Google Search Console Disavow Tool:
   `https://search.google.com/search-console/disavow-links`
2. Select your property
3. Click "Upload Disavow List"
4. Upload your .txt file
5. Google will confirm receipt; the file takes 1-4 weeks to be processed

**Important**: The disavow tool replaces your entire previous file - it is not
additive. Always maintain a master disavow file and upload the complete updated
version each time.

### 8.3 Keeping the file updated

- Date-stamp entries with comments when you add them
- Review and update quarterly as part of your link audit
- Never delete entries from previous audits - only add new ones unless you have
  confirmed a previously-disavowed domain is now legitimate

---

## 9. When Not to Disavow

Do not disavow:
- Low-DR links that are topically relevant and look editorial
- Nofollow links from any source (Google already ignores them for ranking)
- Links from unrelated niches that appear as single one-off placements
- Links from sites you don't recognize but that have real organic traffic
- Competitor links pointing to your site that look legitimate (even if surprising)

**The cost of over-disavowing**: If you disavow legitimate editorial links, you
actively remove ranking signals. The disavow tool is for spam, not for trimming
a link profile you wish looked different.

---

## 10. Monitoring for Negative SEO

Negative SEO is when a competitor (or bad actor) intentionally points toxic links
at your site to trigger an algorithmic filter or manual action.

### 10.1 Signs of a negative SEO attack

- Sudden spike in referring domains (hundreds or thousands of new links in days)
- New links all share the same suspicious anchor text
- Large volume of links from the same or similar IP ranges
- Links from known PBN clusters appearing all at once
- Ahrefs alerts fire multiple times in one day for new link spikes

### 10.2 Response playbook

1. Verify the spike in Ahrefs New Backlinks report (filter by last 7 days)
2. Export and categorize the new links
3. If clearly manipulative, add the domains to your disavow file immediately
4. Submit the updated disavow file to Google Search Console
5. Document the incident: dates, volume, anchor text used, domains involved
6. If traffic has already dropped, submit a reconsideration request if there is a
   manual action; otherwise wait for the disavow to take effect algorithmically

### 10.3 Preventive monitoring setup

- Ahrefs Alerts: "New backlinks" for your domain - weekly digest minimum
- Google Search Console: Check "Manual Actions" monthly
- Set a baseline for normal new-referring-domain velocity so spikes are obvious
- Quarterly full audit (export, score, review) even without visible problems
