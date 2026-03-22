<!-- Part of the video-analyzer AbsolutelySkilled skill. Load this file when
     using AI vision to analyze video frames for design systems, content
     categorization, accessibility auditing, or structured data extraction. -->

# Vision Analysis Prompts

Structured prompts and workflows for AI vision analysis of video frames.
Load this file only when the task involves using AI models to understand
video frame content semantically.

---

## Design system extraction

### Single frame analysis prompt

When analyzing a single frame for design system elements, structure the
analysis with these exact categories:

```
Analyze this UI screenshot and extract the following design system elements:

1. COLORS
   - Primary brand color (hex)
   - Secondary/accent colors (hex)
   - Background colors (hex)
   - Text colors (hex for headings, body, secondary text)
   - Border/divider colors (hex)
   - Status colors if visible (success, warning, error - hex)

2. TYPOGRAPHY
   - Heading sizes (estimate px values for h1-h6 visible)
   - Body text size (px)
   - Font weight variations visible (regular, medium, semibold, bold)
   - Line height (tight, normal, relaxed)
   - Letter spacing if notable

3. SPACING
   - Base spacing unit (estimate the smallest consistent gap in px)
   - Section padding
   - Card/container padding
   - Gap between elements

4. LAYOUT
   - Grid system (columns, gutter width)
   - Max content width
   - Sidebar width if present
   - Navigation height

5. COMPONENTS
   - List each distinct UI component visible
   - For each: describe shape, colors, padding, border-radius
   - Note hover/active states if visible

6. ICONS AND IMAGERY
   - Icon style (outlined, filled, duotone)
   - Icon size
   - Image aspect ratios used
   - Avatar sizes if present

Output as structured JSON.
```

### Multi-frame aggregation workflow

When analyzing multiple frames from the same video:

1. **Analyze each frame independently** using the single frame prompt above
2. **Track consistency** - note which values appear in 3+ frames
3. **Resolve conflicts** by majority vote (most common value wins)
4. **Flag variations** - different button styles may indicate primary vs secondary
5. **Build the final system** using only values confirmed across multiple frames

### Aggregation prompt

```
I have analyzed N frames from a product video. Here are the per-frame results:

[paste frame results]

Aggregate these into a single design system by:
1. Using the most frequently occurring value for each property
2. Flagging any property where frames disagree significantly
3. Identifying component variants (e.g., primary button vs ghost button)
4. Noting any responsive layout changes between frames

Output the final design system as a JSON object with these top-level keys:
colors, typography, spacing, layout, components, icons
```

---

## Content categorization

### Frame content classification prompt

```
Classify this video frame into one or more categories:

- UI/Product: Shows a software interface, app screen, or website
- Presentation: Shows a slide deck or presentation content
- Talking Head: Shows a person speaking to camera
- Screen Recording: Shows a computer screen with cursor activity
- Animation: Shows motion graphics or animated content
- Whiteboard: Shows diagrams, sketches, or whiteboard content
- Code: Shows code editor, terminal, or code snippets
- Data/Charts: Shows graphs, charts, dashboards, or data visualizations
- B-Roll: Shows supplementary footage (office, nature, etc.)
- Title Card: Shows a title, intro, or outro card

For each category detected, provide:
- Confidence: high/medium/low
- Key elements that led to this classification
- Suggested timestamp label (e.g., "Product Demo", "Feature Overview")
```

### Video chapter generation

```
I have extracted frames at these timestamps from a video:

[list of timestamp + frame description pairs]

Generate a chapter list for this video by:
1. Grouping consecutive frames with similar content types
2. Naming each chapter with a descriptive title (3-6 words)
3. Using the first timestamp of each group as the chapter start
4. Including a one-sentence summary per chapter

Output format:
- 00:00 - Chapter Title - Summary
- 01:23 - Chapter Title - Summary
```

---

## Accessibility auditing

### Contrast analysis prompt

```
Analyze this UI screenshot for accessibility issues:

1. COLOR CONTRAST
   - Check text against background for WCAG AA compliance
   - Flag any text that appears to have insufficient contrast
   - Note the approximate contrast ratio (estimate)

2. TEXT SIZING
   - Flag any text that appears smaller than 12px
   - Note if body text appears smaller than 16px
   - Check that heading hierarchy is clear

3. TOUCH TARGETS
   - Flag any interactive elements that appear smaller than 44x44px
   - Note spacing between clickable elements

4. VISUAL INDICATORS
   - Check if information is conveyed by color alone
   - Note presence of icons, underlines, or other non-color indicators

5. LAYOUT ISSUES
   - Check for text that may be truncated or overflow
   - Note any elements that appear to overlap
   - Flag horizontal scrolling indicators

Rate overall accessibility: Good / Needs Improvement / Poor
Provide specific fix recommendations for each issue found.
```

---

## Animation and transition analysis

### Transition detection prompt

```
I have extracted frames at 0.1-second intervals during a transition.
The frames show consecutive states of a UI change.

Analyze the transition and describe:

1. TRANSITION TYPE
   - Fade, slide, scale, rotate, morph, or combination
   - Direction (left-to-right, top-to-bottom, center-out, etc.)

2. TIMING
   - Estimated total duration based on number of frames
   - Easing curve (linear, ease-in, ease-out, ease-in-out, spring)
   - Any delay before the transition starts

3. ELEMENTS INVOLVED
   - Which elements are entering the view
   - Which elements are leaving the view
   - Which elements are changing state (color, size, position)

4. CSS EQUIVALENT
   - Write the CSS transition or animation that would reproduce this
   - Include keyframes if complex
   - Specify timing function

Output the CSS implementation.
```

### Animation timing extraction

```
These frames show an animation sequence extracted at regular intervals.

For each frame pair (current vs previous), describe:
- Which properties changed (position, opacity, scale, color)
- Estimated magnitude of change
- Whether the change is accelerating or decelerating

Then synthesize into an animation specification:
- Total duration estimate
- Keyframe breakdown (0%, 25%, 50%, 75%, 100%)
- Recommended easing function
- CSS @keyframes implementation
```

---

## Component inventory

### UI component detection prompt

```
Scan this UI screenshot and create a component inventory.

For each unique component type found, document:

1. COMPONENT NAME (use common design system naming)
2. VARIANTS VISIBLE (e.g., primary button, secondary button)
3. VISUAL PROPERTIES
   - Background color (hex)
   - Border (width, color, radius)
   - Padding (estimate in px)
   - Shadow (if any)
4. CONTENT PATTERN
   - Text content pattern (e.g., "short label", "sentence", "paragraph")
   - Icon position (left, right, none)
   - Image usage (avatar, thumbnail, hero)
5. STATE (default, hover, active, disabled, if distinguishable)

Group components by category:
- Navigation (navbar, sidebar, breadcrumbs, tabs)
- Content (cards, lists, tables, text blocks)
- Input (buttons, text fields, selects, checkboxes)
- Feedback (alerts, toasts, modals, tooltips)
- Layout (containers, grids, dividers, spacers)

Output as structured JSON array.
```

---

## Structured output templates

### Design tokens JSON template

```json
{
  "colors": {
    "primary": { "value": "#hex", "usage": "CTA buttons, links" },
    "secondary": { "value": "#hex", "usage": "secondary actions" },
    "neutral": {
      "50": "#hex",
      "100": "#hex",
      "200": "#hex",
      "300": "#hex",
      "400": "#hex",
      "500": "#hex",
      "600": "#hex",
      "700": "#hex",
      "800": "#hex",
      "900": "#hex"
    },
    "semantic": {
      "success": "#hex",
      "warning": "#hex",
      "error": "#hex",
      "info": "#hex"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "font name",
      "body": "font name",
      "mono": "font name"
    },
    "fontSize": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    "fontWeight": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },
  "spacing": {
    "unit": "4px",
    "scale": ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px"]
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)"
  }
}
```

### Component inventory JSON template

```json
{
  "components": [
    {
      "name": "Button",
      "variants": [
        {
          "name": "primary",
          "background": "#hex",
          "textColor": "#hex",
          "borderRadius": "8px",
          "padding": "12px 24px",
          "fontSize": "14px",
          "fontWeight": 600
        }
      ],
      "occurrences": 5,
      "frames": [1, 3, 5, 8, 12]
    }
  ]
}
```

---

## Best practices for vision analysis

1. **Use the highest quality frames** - Extract frames as PNG at original
   resolution for accurate color and typography analysis. JPEG compression
   shifts color values.

2. **Analyze in batches of 5-10** - Processing too many frames at once
   exceeds context limits. Batch frames and aggregate results.

3. **Provide reference context** - Tell the vision model what the video is
   about (product demo, tutorial, etc.) for better component naming.

4. **Validate hex values** - Vision models estimate colors; verify extracted
   hex values by sampling actual pixel values from the PNG frames.

5. **Cross-reference with code** - If the analyzed product has a public
   repository, cross-reference extracted design tokens with actual CSS/theme
   files for ground truth.

6. **Account for video compression** - Video codecs compress colors and blur
   fine text. Extract frames from the highest quality source available and
   note that typography identification may be approximate.
