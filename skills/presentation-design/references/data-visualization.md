<!-- Part of the presentation-design AbsolutelySkilled skill. Load this file when
     working with data-heavy slides, chart selection, or data formatting in decks. -->

# Data Visualization for Presentations

This reference covers chart selection, formatting standards, color usage, labeling,
and annotation techniques specifically for slide-based presentations. Slides have
different constraints than dashboards or reports - the audience sees each chart for
10-30 seconds, so every chart must communicate its message instantly.

---

## The one rule

Every data slide must answer one question, and the answer must be stated in the
slide headline. The chart provides the visual proof. If you remove the chart, the
headline alone should still convey the insight. If you remove the headline, the
chart alone should still make the point through annotation and design.

---

## Chart selection by analytical purpose

### Comparison

**Horizontal bar chart** - The default for comparing values across categories.
- Sort bars by value (largest to smallest) unless there's a natural order (time, rank)
- Use a single highlight color for the key bar; gray for all others
- Label values at the end of each bar; remove the x-axis if labels are present
- Limit to 10-12 bars maximum per slide

**Grouped bar chart** - For comparing 2-3 series across categories.
- Never group more than 3 series (use small multiples instead)
- Use clearly distinct colors for each series
- Always include a legend, positioned above the chart

### Trend over time

**Line chart** - The default for showing change over time.
- Use time on the x-axis (left to right, chronological)
- Limit to 4 lines maximum; highlight the key line with color and thickness
- Label the end of each line directly (remove the legend if possible)
- Start the y-axis at zero for absolute values; break the axis only if clearly marked
- Add annotations for key events (product launch, policy change, etc.)

**Area chart** - Use only for cumulative/stacked trends where the total matters.
- Use semi-transparent fills to allow overlap visibility
- Don't use for more than 3-4 series (becomes unreadable)

### Part-to-whole

**Pie/donut chart** - Use ONLY for 2-3 segments where the relationship to 100% matters.
- Never use for more than 3 segments
- Always label segments directly with both percentage and absolute value
- Start the largest segment at 12 o'clock, going clockwise
- Use a donut variant when you want to place a key metric in the center

**Stacked bar chart** - For part-to-whole with 4+ categories or across time periods.
- Use consistent color order across all bars
- Label segments directly when they're large enough; use a legend for small segments
- Consider a 100% stacked bar when proportions matter more than absolute values

**Treemap** - For hierarchical part-to-whole with many categories.
- Use when you have 5-20 categories with clear size differences
- Label directly on each rectangle
- Use color to encode a second variable (e.g., growth rate) or keep monochromatic

### Distribution

**Histogram** - For showing the shape of a continuous distribution.
- Choose bin widths that reveal the pattern (10-20 bins is typical)
- Label the x-axis with meaningful ranges
- Add a mean/median line with annotation if relevant

**Box plot** - For comparing distributions across categories.
- Always explain the box plot components if the audience may not be familiar
- Use horizontal orientation for readability
- Add individual data points as a jitter overlay for small datasets

### Correlation

**Scatter plot** - For showing the relationship between two variables.
- Always label both axes clearly with units
- Add a trend line only if the correlation is the point
- Use size for a third variable (bubble chart) sparingly - hard to read precisely
- Highlight and annotate specific data points that support the narrative

### Flow and change

**Waterfall chart** - For showing how a value changes through additions and subtractions.
- Color-code increases (green/blue) and decreases (red/orange) consistently
- Label each bar with the change value
- Show the starting and ending totals as full bars

**Sankey diagram** - For showing flow between stages or categories.
- Use when showing conversion funnels, budget allocation, or migration patterns
- Limit to 3-4 stages and 5-8 flows for slide readability
- Color by source or destination category

---

## Formatting standards for slides

### Typography on charts
- Chart title: omit if the slide headline serves as the title (preferred)
- Axis labels: 12-14pt, regular weight, dark gray (#4A4A4A)
- Data labels: 12-14pt, bold for highlighted values, regular for others
- Annotations: 12-14pt, italic or with a callout line
- Source line: 10pt, light gray, bottom-left of the chart area

### Gridlines and axes
- Remove all gridlines by default; add back only if the audience needs to read
  precise values (rare in presentations)
- Remove the top and right borders of the chart area (open frame)
- Keep the x-axis and y-axis lines thin (0.5-1pt) and gray
- Remove tick marks; use the label positions to imply the axis

### Whitespace
- Chart should occupy 60-70% of the slide area below the headline
- Leave breathing room between the chart and slide edges (minimum 5% margin)
- Don't stretch charts to fill the entire slide - whitespace signals confidence

---

## Color usage

### Primary palette approach
- Choose one primary color for the key data series or highlighted element
- Use gray (#B0B0B0 to #D0D0D0) for all non-highlighted data
- Use one accent color (sparingly) for secondary highlights or annotations
- Never use more than 5 distinct colors on a single chart

### Color meaning conventions
- Green for positive/growth (use cautiously - consider color blindness)
- Red for negative/decline (same caveat)
- Blue as a neutral primary color (safe default)
- Gray for context, benchmarks, or de-emphasized data

### Accessibility
- Never encode meaning through color alone - always pair with labels or patterns
- Test charts for color-blind accessibility (red-green is the most common deficiency)
- Maintain a minimum 3:1 contrast ratio between data colors and background
- Use colorblind-safe palettes: blue-orange, blue-red, purple-green alternatives

---

## Annotation techniques

Annotations are the most underused tool in presentation data visualization. They
transform a chart from "here's some data" to "here's what the data means."

### Direct labeling
- Label data points directly on the chart instead of using a legend
- Place labels at the end of lines, inside or beside bars, on pie segments
- This eliminates the legend-to-chart lookup that slows comprehension

### Callout annotations
- Use a short text callout with an arrow pointing to the key data point
- Keep callout text to 5-10 words maximum
- Example: "23% increase after feature launch" with arrow to the inflection point
- Position callouts in open areas of the chart to avoid overlapping data

### Reference lines
- Add a horizontal reference line for targets, benchmarks, or averages
- Label the line directly ("Industry avg: 42%")
- Use a dashed style to distinguish from data lines

### Shaded regions
- Shade a time period on a line chart to highlight a specific era
- Use very light fills (10-20% opacity) to avoid obscuring data
- Label the region ("Beta period", "Post-launch", "COVID impact")

---

## Common data visualization mistakes in presentations

| Mistake | Impact | Fix |
|---|---|---|
| Dual y-axes | Misleads by implying correlation through scale manipulation | Use two separate charts side by side |
| Truncated y-axis without marking | Exaggerates small differences | Start at zero or clearly mark the break |
| Pie chart with 5+ segments | Audience cannot compare arc angles | Switch to horizontal bar chart |
| 3D chart effects | Distorts proportions and obscures data | Use flat 2D charts exclusively |
| Rainbow color palette | No visual hierarchy; distracting | Use gray + one highlight color |
| No data labels on bars | Forces audience to estimate from axis | Label bars directly |
| Chart without headline insight | Audience doesn't know what to conclude | Write assertion headline |
| Too many data series | Visual noise; nothing stands out | Highlight 1-2 series; gray the rest |
| Gridlines at full opacity | Compete with data for visual attention | Remove or reduce to 10-15% opacity |
| Using a table when a chart would work | Tables require sequential reading; slow | Convert to chart; reserve tables for precise lookups |

---

## When to use a table instead of a chart

Tables are appropriate on slides only when:
- The audience needs to look up specific exact values (prices, dates, specifications)
- You have a small dataset (under 5 rows x 5 columns) with no clear visual pattern
- The data is categorical text, not numeric (feature comparison matrices)
- You're showing a schedule, roster, or specification sheet

Table formatting for slides:
- Remove all internal borders; use alternating row shading (very subtle) or horizontal
  lines only
- Bold the header row; left-align text; right-align numbers
- Highlight the key row or column with background color
- Keep font size at 14pt minimum (anything smaller is unreadable in a presentation)

---

## Data storytelling sequence

When building a data-heavy section of a presentation, follow this sequence:

1. **Setup slide** - State the question the data will answer (assertion headline
   framed as the answer). Brief context on data source and timeframe.

2. **Overview chart** - Show the full picture at a high level. This orients the
   audience before you zoom in.

3. **Zoom-in slides** - One slide per key insight, drilling into specific segments,
   time periods, or comparisons. Each has its own assertion headline.

4. **Synthesis slide** - Pull the data insights together into 2-3 key takeaways.
   This is where you translate data into implications.

5. **Action slide** - What should happen as a result of this data. Specific,
   assigned, time-bound actions.

> Never dump multiple charts on one slide and expect the audience to synthesize.
> That's your job as the presenter. One chart, one insight, one slide.
