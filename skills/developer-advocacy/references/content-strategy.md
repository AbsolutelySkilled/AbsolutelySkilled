<!-- Part of the developer-advocacy AbsolutelySkilled skill. Load this file when
     working with editorial calendars, developer SEO, cross-posting, or content
     repurposing strategies. -->

# Content Strategy for Developer Advocacy

## Editorial calendar framework

### Planning cadence

Plan content monthly, publish weekly, promote daily. A realistic sustainable
pace for a single developer advocate:

| Frequency | Content type | Time investment |
|-----------|-------------|-----------------|
| Weekly | Social posts (2-3), community responses | 3-4 hours |
| Biweekly | Blog post or tutorial | 6-8 hours per post |
| Monthly | Video tutorial or livestream | 4-6 hours (prep + record + edit) |
| Quarterly | Conference talk (new or updated) | 15-20 hours (prep + practice + travel) |
| Quarterly | SDK example refresh / new quickstart | 8-12 hours |

### Content pillars

Organize all content around 3-4 recurring pillars. Every piece of content maps
to exactly one pillar. Example pillars for a hypothetical API company:

1. **Getting started** - First-time setup, quickstarts, "hello world" examples
2. **Advanced patterns** - Performance, scaling, edge cases, integration patterns
3. **Community spotlight** - Guest posts, contributor stories, use-case showcases
4. **Product updates** - Changelog walkthroughs, migration guides, new features

### Monthly planning template

```
## [Month Year] Content Plan

### Theme: [one sentence focus for the month]

### Blog posts
- [ ] Week 1: [title] - Pillar: [pillar] - Author: [name]
- [ ] Week 3: [title] - Pillar: [pillar] - Author: [name]

### Video
- [ ] Week 2: [title] - Format: [tutorial/livestream/demo]

### Social
- [ ] Ongoing: [platform] - [N] posts promoting blog/video content
- [ ] Ongoing: Community thread engagement ([platform])

### Events
- [ ] [Date]: [Event name] - [Talk title or booth/workshop]

### SDK/Code
- [ ] [Repo]: [PR description] - updates examples for [version]
```

---

## SEO for developer content

### Keyword strategy

Developers search differently from other audiences. They search for:

- Error messages (exact strings): `"TypeError: Cannot read property 'map' of undefined"`
- How-to queries: `"how to authenticate with OAuth2 in Python"`
- Comparison queries: `"REST vs GraphQL performance"`
- Version-specific queries: `"migrate from webpack 4 to 5"`

### On-page SEO checklist

- [ ] Title starts with the primary keyword or action verb
- [ ] URL slug is short and descriptive (`/blog/cursor-pagination-guide`, not `/blog/post-47`)
- [ ] First paragraph contains the primary search query naturally
- [ ] H2/H3 headings use question or task format ("How to implement...", "Setting up...")
- [ ] Code blocks are wrapped in proper language-tagged fences for syntax highlighting
- [ ] Include a "Prerequisites" section (captures long-tail queries)
- [ ] Add a "Troubleshooting" or "Common errors" section at the end
- [ ] Internal links to related posts and official docs
- [ ] Meta description is 150-160 characters, includes the primary keyword

### Technical SEO for developer blogs

- Ensure code blocks are rendered as text (not images) so search engines can index them
- Use semantic HTML: `<code>`, `<pre>`, `<article>` tags
- Add `datePublished` and `dateModified` structured data
- Canonical URLs on cross-posted content to avoid duplicate content penalties
- Fast page load - developers have zero patience for slow sites

---

## Cross-posting workflow

### Where to cross-post

| Platform | Audience | Notes |
|----------|----------|-------|
| Company blog | Existing users + SEO | Canonical URL lives here |
| Dev.to | Broad developer audience | Set canonical URL to company blog |
| Hashnode | Developer-focused, good SEO | Set canonical URL to company blog |
| Medium | General tech audience | Only if your audience is there; declining for devs |
| LinkedIn | Professional/enterprise developers | Shorter format, link to full post |

### Cross-posting rules

1. **Always publish on your own domain first** - This is your canonical URL
2. **Wait 24-48 hours** before cross-posting to let search engines index the original
3. **Set the canonical URL** on every cross-posted version pointing to your domain
4. **Adapt the format** - Dev.to readers expect different tone than enterprise blog readers
5. **Never copy-paste without adjusting** - At minimum, update the intro for each platform

### Syndication template

When cross-posting, add this footer:

```
---
*Originally published on [Company Blog](https://blog.example.com/original-post).
Follow us on [Twitter/X](https://twitter.com/example) for more developer content.*
```

---

## Content repurposing matrix

One piece of source content should generate 5-8 derivative pieces:

```
Source: 30-minute conference talk on "Building Real-time APIs with WebSockets"

Derivatives:
1. Blog post    - Full written tutorial based on the talk content
2. Video clip   - 2-minute highlight reel for Twitter/LinkedIn
3. Thread       - 8-tweet thread summarizing key points
4. Code repo    - GitHub repo with the demo code, cleaned up and documented
5. Quickstart   - Simplified version of the demo as an official quickstart
6. Slide deck   - Published to Speaker Deck or Google Slides (public link)
7. Newsletter   - Summary + link in the next developer newsletter
8. Community    - Post the recording in Discord/Slack with discussion prompt
```

### Repurposing priority order

Not every derivative is worth the effort. Prioritize by ROI:

1. **Blog post from talk** (highest ROI) - Evergreen, SEO value, easy to produce
2. **Code repo** - Developers want to clone and run; high trust signal
3. **Social clips** - Low effort, high reach
4. **Thread** - Good engagement, fast to write
5. **Newsletter mention** - Drives traffic to the main content

---

## Content quality checklist

Before publishing any developer-facing content, verify:

### Accuracy
- [ ] All code examples run successfully on a clean environment
- [ ] SDK/API versions are pinned and match current stable release
- [ ] Links to external resources are not broken
- [ ] Technical claims are verifiable (benchmarks, comparisons)

### Clarity
- [ ] The reader knows what they'll learn in the first 2 sentences
- [ ] Each section has a clear purpose (no filler paragraphs)
- [ ] Code examples include comments explaining non-obvious lines
- [ ] Jargon is defined on first use or linked to a glossary

### Completeness
- [ ] Prerequisites are listed (language version, tools, accounts needed)
- [ ] The "happy path" AND at least one error scenario are covered
- [ ] A "next steps" section points to deeper resources
- [ ] Complete, copy-pasteable code is provided (not just snippets)

### Tone
- [ ] Written in second person ("you") not first person ("we")
- [ ] No marketing superlatives ("revolutionary", "game-changing", "seamless")
- [ ] Honest about limitations or trade-offs
- [ ] Respectful of the reader's time - no unnecessary preamble
