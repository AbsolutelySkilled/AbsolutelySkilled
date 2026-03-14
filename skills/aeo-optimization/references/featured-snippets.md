<!-- Part of the aeo-optimization AbsolutelySkilled skill. Load this file when
     working with featured snippet analysis, reverse-engineering snippet wins,
     defending a snippet position, or diagnosing why a snippet was lost. -->

# Featured Snippets - Deep Reference

## What Google actually extracts

Google's snippet extraction algorithm looks for content that directly answers the
inferred search intent with a self-contained block. The key signals:

- **Proximity to the question**: The best answer block appears immediately below a
  header phrased as (or closely matching) the search query
- **Semantic self-containment**: The block makes sense without surrounding context
- **Format signal**: The HTML element type (p, ol, ul, table) must match the query type
- **Authority signal**: The page must already rank in positions 1-10 for the query;
  pages below position 10 almost never win snippets

---

## Paragraph snippets

### When Google triggers a paragraph snippet

Paragraph snippets appear for:
- Definition queries ("what is X", "what does X mean")
- Explanation queries ("how does X work", "why does X happen")
- Comparison queries that need a summary answer ("X vs Y" at informational intent)
- Historical/factual queries ("who invented X", "when was X founded")

### Optimal format

```markdown
## What is [topic]?

[Direct definition sentence - subject + verb + predicate]. [One sentence of important
context or qualification]. [Optional: one sentence on relevance or use case].
```

**Word count target: 40-60 words.** Below 35 words and Google may consider the answer
too thin. Above 70 words and extraction becomes less reliable - Google may truncate
mid-sentence or skip the block entirely.

### "Is" definition pattern

Google strongly prefers answers starting with the subject echoed back:

- Query: "What is semantic search?"
- Winning format: "Semantic search is a search technique that understands the intent
  and contextual meaning of a query rather than matching keywords literally. It uses
  natural language processing and knowledge graphs to return results that match what
  the user means, not just what they typed."

Avoid starting the answer with "I", "You", or a dependent clause. Echo the subject
from the question.

### Trigger phrases for paragraph snippets

These query modifiers strongly correlate with paragraph snippet extraction:

| Modifier type | Examples |
|---|---|
| Definition | "what is", "what are", "define", "meaning of" |
| Explanation | "how does", "why does", "what causes" |
| Process summary | "how to [abstract action]" (single-step) |
| Fact | "who is", "when did", "where is" |

---

## List snippets

### Ordered vs unordered - when to use each

**Ordered lists (`<ol>`)** win for:
- Step-by-step processes ("how to set up X", "steps to do Y")
- Ranked lists where order has meaning ("top 5 X", "first steps to Y")
- Sequential workflows

**Unordered lists (`<ul>`)** win for:
- Feature or benefit lists ("benefits of X", "features of Y")
- Ingredient or component lists
- Non-sequential collections ("types of X", "examples of Y")

Google respects the semantic distinction. Using `<ol>` for non-sequential content or
`<ul>` for step-by-step processes reduces snippet eligibility.

### H2/H3 header requirement

List snippets almost always originate from a list that lives under an H2 or H3 header
matching (or closely paraphrasing) the search query. Structure:

```html
<h2>How to Optimize for Featured Snippets</h2>
<ol>
  <li>Identify queries where a snippet exists in the SERP</li>
  <li>Analyze the current snippet holder's format</li>
  <li>Write a direct answer block matching that format</li>
  <li>Add the header as a question matching the query</li>
  <li>Implement FAQPage schema if the page is FAQ-structured</li>
</ol>
```

### Item length and truncation behavior

Google shows up to 8 list items in most snippets, with a "More items" link for longer
lists. Each item label should be under 10 words. If your list items are long sentences,
Google may:
- Show only the first 8 items and truncate
- Fail to extract the list and show a paragraph instead

**Best practice:** Short, scannable item labels (under 10 words) with expanded
explanation in paragraph sub-sections below the list.

### Nested lists

Avoid nested lists in content targeting list snippets. Google's extraction algorithm
handles them inconsistently - the snippet may display only the outer level, breaking
the semantic structure, or may skip the block entirely.

---

## Table snippets

### Query types that trigger table snippets

- Comparison queries: "X vs Y", "[product] comparison", "best X for Y"
- Pricing queries: "[product] pricing", "[service] plans"
- Specification queries: "[product] specs", "[device] dimensions"
- Schedule/timetable queries: "[event] schedule", "[transit] times"

### HTML requirements

Table snippets require semantic HTML. CSS-styled divs that look like tables do not
trigger table snippets. Required structure:

```html
<table>
  <thead>
    <tr>
      <th>Plan</th>
      <th>Price</th>
      <th>Features</th>
      <th>Users</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Starter</td>
      <td>$9/month</td>
      <td>5 projects</td>
      <td>1 user</td>
    </tr>
    <tr>
      <td>Pro</td>
      <td>$29/month</td>
      <td>Unlimited projects</td>
      <td>5 users</td>
    </tr>
  </tbody>
</table>
```

**Rules:**
- Use `<thead>` and `<tbody>` (not just `<tr>` rows) - semantic structure aids extraction
- Column headers in `<th>` elements, not `<td>` with CSS bold styling
- No merged cells (`colspan`, `rowspan`) - they confuse extraction
- Keep to 3-5 columns and 4-8 rows; larger tables are truncated inconsistently
- First column should be the entity being compared (the "row identifier")

### Introductory paragraph

Precede every table with 1-2 sentences framing the comparison topic. This text provides
the context signal that helps Google understand what the table is about:

```markdown
The following table compares [tool A], [tool B], and [tool C] across price,
key features, and user limits to help teams choose the right plan.

[TABLE]
```

---

## Analyzing current snippet holders

Before writing content to displace a snippet, study the current holder:

### Step 1 - Document the current snippet

Search the query in an incognito window and screenshot:
- The exact text extracted in the snippet
- The word count (count manually or use a word counter)
- The HTML element type (paragraph, list, or table)
- The header above the extracted block
- Whether a source URL is shown

### Step 2 - Visit the source page

On the snippet holder's page, find the extracted block and note:
- The header phrasing (exact text of the H2/H3 above the block)
- The element type in the actual HTML (inspect element)
- The position of the block on the page (above the fold? Mid-page?)
- Whether FAQPage or other structured data is implemented

### Step 3 - Assess replaceability

| Signal | Interpretation |
|---|---|
| Snippet holder is DA 80+ site | Hard to displace; compete on a related but distinct query |
| Answer is outdated or factually thin | High opportunity to displace with better content |
| Current snippet is a list but could be a table | Try a table format for the same query |
| Query shows snippet volatility (changes weekly) | Google is uncertain; fresh, authoritative answer has strong chance |

### Step 4 - Reverse-engineer the win

Model your answer block on the current snippet:
- Match the word count within ±10 words
- Use the same element type (p, ol, ul, table)
- Match the header phrasing pattern
- Then differentiate on accuracy, completeness, and recency

---

## Snippet volatility and defense

### What causes snippet volatility

A snippet is "volatile" when Google rotates it between multiple sources. Volatility
indicates:
- Multiple pages have similar-quality answer blocks
- The query intent is ambiguous (informational vs. navigational)
- Google is testing different formats to see which gets better user signals

Tools like Semrush or SERPWatcher can track snippet ownership over time.

### Defending a snippet position

Once you hold a snippet, protect it by:

1. **Keeping the answer block fresh** - Update the content when the topic evolves.
   Stale snippets are the primary displacement vector.

2. **Not moving the block** - If a page redesign buries the answer block further down
   the page, snippet eligibility drops. Keep the answer block in its original position.

3. **Monitoring for displacement** - Set up weekly rank tracking for your snippet
   queries. A drop from snippet to position 1 is a warning signal.

4. **Resisting padding** - The temptation to add more content around the answer block
   to "improve" the page can dilute the block's extractability. The answer block should
   remain a clean, isolated, self-contained unit.

### When you lose a snippet

If you held a snippet and lost it, check in this order:

1. Did the page's organic ranking drop below position 10? (Snippet requires top-10 rank)
2. Did you move or rewrite the answer block in a recent publish?
3. Did a competitor publish a cleaner, more direct answer?
4. Did Google change the expected snippet format for this query type?

Re-run your snippet analysis from scratch and treat the displacement as a new
optimization opportunity.

---

## Multi-snippet and snippet + PAA strategy

For a high-value topic cluster, it is possible to hold multiple SERP features
simultaneously:
- The featured snippet on the head query
- PAA cards on related sub-questions (from the same or different pages)
- A rich result from FAQPage schema on the same page

The strongest content strategy: one pillar page answering the main query (targeting
the featured snippet) with an FAQ section at the bottom answering the 5-8 PAA
questions around that topic, all marked up with `FAQPage` schema.

---

## Snippet eligibility checklist

Before publishing content targeting a snippet:

- [ ] Target query confirmed to show a snippet in current SERP
- [ ] Page already ranks or is expected to rank positions 1-10
- [ ] Answer block is the correct type (paragraph/list/table) for the query
- [ ] Paragraph: 40-60 words, directly below matching H2/H3 header
- [ ] List: `<ol>` or `<ul>` under H2/H3, items under 10 words each, 5-8 items
- [ ] Table: semantic HTML, `<thead>/<tbody>/<th>`, 3-5 columns, no merged cells
- [ ] No internal links within the answer block
- [ ] No images between the header and the answer block
- [ ] FAQPage or HowTo schema implemented if appropriate
