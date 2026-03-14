<!-- Part of the content-seo AbsolutelySkilled skill. Load this file when
     working with topic cluster design, pillar-spoke architecture, or internal
     linking strategy for topical authority. -->

# Topic Clusters

A systematic guide to the pillar-spoke content model: how to design clusters, map
keywords to the right tier, wire internal links, and decide when to split or merge.

---

## The pillar-spoke model

The pillar-spoke model organises site content into topical units. Each unit has:

- **One pillar page** - a comprehensive, authoritative overview of a broad topic
- **Multiple spoke pages** - deep-dive articles covering specific subtopics
- **Bidirectional internal links** - pillar links to all spokes; every spoke links back
  to the pillar

The model exists because search engines reward topical depth. A site with 15 well-linked
pages covering every angle of "email marketing" will outrank a site with one very long
page, because the former demonstrates sustained editorial investment in the topic.

### Why clusters outperform isolated pages

- Internal links pass PageRank between related pages, lifting the whole cluster
- Semantic co-citation - neighbouring pages reinforce each other's relevance signals
- Crawlers build a coherent topic model of the site, improving indexing decisions
- Users who land on one spoke can navigate to others, improving session depth and
  reducing single-page abandonment

---

## Anatomy of a pillar page

A pillar page should:

1. **Target a broad, high-volume head keyword** - typically 1-2 words (e.g. "email marketing")
2. **Cover the topic at a breadth-first depth** - enough to be genuinely useful on each
   subtopic, but not exhaustively - that is the spoke's job
3. **Link to every spoke page in the cluster** - using descriptive, keyword-rich anchor text
4. **Be the longest page in the cluster** - typically 2,000-5,000 words depending on topic
5. **Include a table of contents** - with anchor links; signals comprehensiveness to crawlers
6. **Avoid targeting long-tail queries** - those belong in spokes

A pillar page is NOT:
- A thin index page that only lists links
- A product or category page (those serve a different purpose)
- An exhaustive 20,000-word document that duplicates spoke content

### Pillar page structure

```
H1: [Primary Keyword] - The Complete Guide
  [150-200 word intro: what it is, who it's for, what you'll learn]

Table of Contents
  - [Subtopic 1] (links to H2)
  - [Subtopic 2]
  ...

H2: [Subtopic 1]
  [200-400 words covering the subtopic at surface level]
  [Contextual internal link: "For a deeper look, see our guide to [Spoke Page Title]"]

H2: [Subtopic 2]
  ...

H2: Frequently Asked Questions
  [Target featured snippets and PAA boxes]

H2: [Summary / What to Do Next]
  [CTA or link to highest-value spoke or product page]
```

---

## Anatomy of a spoke page

A spoke page should:

1. **Target a specific long-tail or mid-tail keyword** - narrower than the pillar
2. **Cover one subtopic in depth** - the goal is to be the best page on the web for
   that specific query
3. **Link back to the pillar** - in the introduction or first contextual mention,
   using the pillar's primary keyword as anchor text
4. **Link to 1-3 related spoke pages** - where context genuinely warrants it
5. **Not repeat or duplicate the pillar** - it deepens; it does not re-summarise

### Spoke page structure

```
H1: [Specific Subtopic Keyword] - [Angle or Promise]
  [100-150 word intro: specific problem this solves, what reader learns]
  [Early internal link back to pillar: "Part of our complete guide to [Pillar Topic]"]

H2: [Core concept 1]
H2: [Core concept 2]
H2: [Step-by-step / how-to section if applicable]
H2: [Examples / case study / data]
H2: [Common mistakes / FAQ]

[Related reading: links to 1-2 related spoke pages]
```

---

## Mapping a cluster from keyword research output

### Step 1 - Define the pillar keyword

Take your keyword research output and identify the highest-volume, broadest intent
keyword in the set. This is the pillar keyword. It should:
- Be broad enough to encompass all the subtopics you want to cover
- Have sufficient search volume to justify a flagship page (typically 1k+ searches/mo,
  though this varies by niche)
- Not be so broad that it becomes meaningless (e.g. "marketing" is too broad to be
  a pillar for a single cluster)

### Step 2 - Group keywords by subtopic

Cluster the remaining keywords by semantic similarity. Each group that has:
- A distinct concept or question
- Its own search volume (i.e. people search for it separately)
- More than can be covered in 400 words within the pillar

...becomes a spoke page.

**Example grouping for "email marketing" cluster:**

```
Pillar: "email marketing" (40k/mo)

Group A -> Spoke: "Email subject lines"
  - "email subject line examples" (8k/mo)
  - "best email subject lines" (5k/mo)
  - "email subject line length" (2k/mo)
  - "how to write email subject lines" (1.5k/mo)

Group B -> Spoke: "Email list building"
  - "how to build an email list" (6k/mo)
  - "email list building strategies" (2k/mo)
  - "grow email list" (1.8k/mo)

Group C -> Spoke: "Email marketing metrics"
  - "email open rate" (4k/mo)
  - "email click-through rate" (2.5k/mo)
  - "email marketing kpis" (1.2k/mo)
```

Each spoke targets the highest-volume keyword in its group as the primary, with the
rest serving as semantic supporting terms within the same page.

### Step 3 - Identify the spoke's primary keyword

Within each group, the spoke's primary keyword is the one you write the H1 and meta
title around. Rules:
- Highest volume in the group is usually correct
- Unless a longer variant better matches the content's search intent
- Confirm by examining the SERP for each candidate: do the top-ranking pages match
  the content format you are planning?

### Step 4 - Check for cannibalization risk

Before finalising the cluster map, verify no two spokes share a primary keyword.
Run each candidate through your keyword tool and check if any of your existing pages
already rank for it. If yes, consolidate or redirect before building new content.

---

## Internal linking patterns within clusters

### The minimum linking requirement

| Page type | Must link to | Must receive links from |
|---|---|---|
| Pillar | Every spoke in the cluster | Every spoke; homepage; relevant nav items |
| Spoke | Pillar (mandatory), 1-3 related spokes | Pillar (mandatory), related spokes, category pages |

### Anchor text rules

- **Pillar - spoke link:** use the spoke's primary keyword or a close variant as
  the anchor text. Never use "read more" or "click here".
- **Spoke - pillar link:** use the pillar's primary keyword as anchor text in the
  first or second contextual mention.
- **Spoke - spoke link:** use the target spoke's primary keyword or the specific
  concept being referenced.

### Placement best practices

- The pillar-to-spoke link should appear in the H2 section that covers that subtopic,
  not just in a link list at the bottom
- The spoke-to-pillar link should appear in the first 150 words (the intro), not just
  in a footer nav
- Contextual links (embedded in prose) carry more weight than standalone link lists

### Visualising the link graph

Use a site crawler (Screaming Frog, Sitebulb) to export the internal link graph.
A healthy cluster looks like a hub-and-spoke wheel with the pillar at the centre.
Warning signs:
- Orphan spoke pages (no inbound internal links from within the cluster)
- Spokes linking to each other but not back to the pillar
- Pillar not linked from the homepage or site navigation (loss of equity)

---

## Content hierarchy

A single site can contain multiple clusters. The site-level hierarchy is:

```
Homepage
  |
  +-- Pillar A ("Email Marketing")
  |     +-- Spoke A1, A2, A3 ...
  |
  +-- Pillar B ("Social Media Marketing")
  |     +-- Spoke B1, B2, B3 ...
  |
  +-- Pillar C ("Content Marketing")
        +-- Spoke C1, C2, C3 ...
```

Cross-cluster links are allowed and valuable when the topics genuinely intersect.
For example, a spoke on "email list building" might link to a spoke under the
"landing page design" cluster. Keep these contextual - do not force links for the
sake of it.

---

## Examples of well-structured clusters

### B2B SaaS - "Project Management" cluster

```
Pillar: "Project Management" -> /blog/project-management-guide/
  Spoke: "Project management methodologies" -> /blog/project-management-methodologies/
  Spoke: "Agile vs Waterfall" -> /blog/agile-vs-waterfall/
  Spoke: "How to write a project plan" -> /blog/project-plan-template/
  Spoke: "Project management tools" -> /blog/best-project-management-tools/
  Spoke: "Project status report template" -> /blog/project-status-report/
  Spoke: "Risk management in projects" -> /blog/project-risk-management/
```

Each spoke links back to the pillar, the pillar links out to each spoke, and spokes
that are semantically adjacent (e.g. "Agile vs Waterfall" and "Project management
methodologies") cross-link with relevant anchor text.

### E-commerce - "Running Shoes" cluster

```
Pillar: "Running Shoes" -> /running-shoes/ (category page as pillar)
  Spoke: "Best running shoes for beginners" -> /running-shoes/beginners/
  Spoke: "Trail running shoes guide" -> /running-shoes/trail/
  Spoke: "Running shoe size guide" -> /running-shoes/sizing/
  Spoke: "How long do running shoes last" -> /blog/running-shoe-lifespan/
  Spoke: "Running shoes for wide feet" -> /running-shoes/wide-feet/
```

In e-commerce, a category page can serve as the pillar. The cluster includes both
commercial (product) spokes and informational (blog) spokes - the informational spokes
drive top-of-funnel traffic that flows into the commercial pages.

---

## When to split a cluster

Split a single cluster into two when:

1. **The pillar page is unwieldy** - approaching 8,000+ words and still not covering
   all subtopics adequately
2. **Subtopics have diverging intent** - some spokes are heavily informational, others
   are highly transactional, and combining them under one pillar dilutes topical focus
3. **Search volume supports it** - there is enough search demand to justify a second
   pillar page (typically 2,000+ searches/month for the new pillar keyword)
4. **A subtopic has grown into its own domain** - e.g. "email marketing automation"
   started as a spoke but now warrants its own full cluster

### How to split

1. Identify the new pillar keyword (it was probably a high-volume spoke)
2. Move the relevant spokes to the new cluster, update internal links
3. Add a bidirectional link between the two pillar pages at the point where the topics
   intersect
4. Update the original pillar to briefly mention the new cluster and link to it

---

## When to merge clusters

Merge two clusters into one when:

1. **They are targeting overlapping keywords** and competing with each other
2. **Neither cluster has enough spokes** to establish topical authority on its own
   (typically fewer than 4-5 spokes)
3. **Search volume is insufficient** to sustain two pillar pages (combined demand does
   not clearly split between two distinct head keywords)

### How to merge

1. Decide which pillar URL to keep (choose based on backlinks and existing rankings)
2. 301 redirect the weaker pillar to the stronger
3. Merge the content: expand the surviving pillar to cover the redirected pillar's
   subtopics, or convert the redirected pillar's content into a spoke
4. Update all internal links to point to the surviving URL
5. Consolidate spokes from the retired cluster under the surviving pillar's hierarchy
