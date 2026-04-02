<!-- Part of the absolute-ui AbsolutelySkilled skill. Load this file when
     working with typography, fonts, text styling, or readability. -->

# Typography

Most UIs are just text and buttons. Typography is the 80/20 of UI design - master it and 80% of your UI quality is handled.

## Type Scale (1.25 ratio - Major Third)

All sizes use a 1.25 multiplier. Base is 16px = 1rem.

```css
:root {
  --text-xs:   0.75rem;  /* 12px - captions, footnotes, timestamps */
  --text-sm:   0.875rem; /* 14px - secondary labels, helper text */
  --text-base: 1rem;     /* 16px - body text, default */
  --text-md:   1.125rem; /* 18px - large body, lead paragraphs */
  --text-lg:   1.25rem;  /* 20px - card titles, small headings */
  --text-xl:   1.5rem;   /* 24px - section headings (h3) */
  --text-2xl:  1.875rem; /* 30px - page sub-headings (h2) */
  --text-3xl:  2.25rem;  /* 36px - page titles (h1) */
  --text-4xl:  3rem;     /* 48px - hero display text */
}
```

Line-height per size:

| Token        | Size  | line-height | Usage                         |
|--------------|-------|-------------|-------------------------------|
| `--text-xs`  | 12px  | 1.75        | Captions, timestamps          |
| `--text-sm`  | 14px  | 1.6         | Helper text, secondary labels |
| `--text-base`| 16px  | 1.5         | Body copy, default            |
| `--text-md`  | 18px  | 1.5         | Lead paragraphs               |
| `--text-lg`  | 20px  | 1.4         | Card titles, nav items        |
| `--text-xl`  | 24px  | 1.3         | Section headings (h3)         |
| `--text-2xl` | 30px  | 1.25        | Sub-headings (h2)             |
| `--text-3xl` | 36px  | 1.2         | Page titles (h1)              |
| `--text-4xl` | 48px  | 1.1         | Hero display                  |

```css
:root {
  --leading-xs:   1.75;
  --leading-sm:   1.6;
  --leading-base: 1.5;
  --leading-md:   1.5;
  --leading-lg:   1.4;
  --leading-xl:   1.3;
  --leading-2xl:  1.25;
  --leading-3xl:  1.2;
  --leading-4xl:  1.1;
}
```

## The Minimal Type Scale Alternative

You can build an entire UI with just 1-2 font sizes. Pick a base (14px or 16px), and go 2px up/down only when truly needed. Weight and color create more hierarchy than size:

- Same 16px at `weight: 700` + `color: hsl(0 0% 100%)` looks like a heading
- Same 16px at `weight: 400` + `color: hsl(0 0% 60%)` looks like secondary text
- Same 16px at `weight: 500` + `color: hsl(220 80% 60%)` looks like a link

**The impact of weight and color on perceived size is wild** - three texts at identical pixel size can look like three different sizes. So before reaching for a bigger font size, first try increasing weight or darkening the color.

**Practical workflow:** set your base at 14 or 16px. Design everything at that size first. Only bump up for page titles and hero headings. Assign as CSS variables:

```css
:root {
  --text-sm: 0.875rem;   /* 14px - when you need smaller */
  --text-base: 1rem;     /* 16px - default everything */
  --text-lg: 1.125rem;   /* 18px - titles, emphasis */
  --text-display: 1.5rem; /* 24px+ - page titles only */
}
```

## Line Height Rules

- Headings (24px+): `line-height: 1.2` to `1.3` - tighter, more impact
- Body text (14-18px): `line-height: 1.5` to `1.6` - comfortable reading
- Small text (12-13px): `line-height: 1.6` to `1.75` - must open up more to stay legible
- Single-line elements (buttons, inputs): `line-height: 1` with vertical `padding` instead
- Rule: smaller text needs proportionally more line-height to remain scannable
- **Line height as spacing**: generous line-height acts as built-in `margin-bottom` for text elements. The "gap" between a card title and its metadata is often line-height, not a margin or padding. In most cases you don't need manual spacing between consecutive text blocks - line height does it for you. This is crucial for titles to "stand on their own" separate from surrounding text groups

```css
/* Single-line interactive elements */
.button {
  line-height: 1;
  padding-block: 0.625rem; /* 10px top/bottom */
}

.input {
  line-height: 1;
  padding-block: 0.5rem; /* 8px top/bottom */
}
```

## Font Pairing

Max 2 font families per project. Load only weights you use.

| # | Aesthetic | Heading | Body | Character |
|---|-----------|---------|------|-----------|
| 1 | Editorial | Fraunces | Satoshi | Warm serifs meet clean sans, literary feel |
| 2 | Brutalist | Neue Haas Grotesk | Akkurat | Raw, precise, no-nonsense |
| 3 | Playful | Cabinet Grotesk | General Sans | Rounded geometry, friendly energy |
| 4 | Luxury | Cormorant Garamond | Outfit | High-contrast serif meets modern sans |
| 5 | Technical | IBM Plex Mono | IBM Plex Sans | Engineered precision, developer tools |
| 6 | Organic | Recoleta | Switzer | Soft serifs, natural warmth |
| 7 | Art Deco | Clash Display | Supreme | Geometric drama, bold statements |

```css
/* Pairing 1 - Editorial (Fraunces + Satoshi) */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Satoshi:wght@400;500&display=swap');

:root {
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body:    'Satoshi', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;
}
```

Rules:
- Never use more than 2 families
- Pair a distinctive display font with a refined body font
- Contrast works: serif + sans, geometric + humanist, heavy + light
- Never pair two visually similar fonts (e.g. Inter + Roboto)
- Always define a system-ui or genre-appropriate fallback
- Each project should have its own typographic personality - never reuse the same pairing

## Anti-Slop Font Rules

These fonts are overused in AI-generated UIs and should be avoided as primary choices:

| Font | Why it's overused | Use instead |
|------|-------------------|-------------|
| Inter | Default in every AI tool, Figma, Vercel | Satoshi, General Sans, Switzer |
| Roboto | Android/Material default, zero personality | Outfit, Plus Jakarta Sans, Nunito Sans |
| Arial/Helvetica | System default, says "I didn't choose a font" | Neue Haas Grotesk (the original), Akkurat |
| Space Grotesk | Every AI SaaS landing page uses this | Cabinet Grotesk, Clash Grotesk, Familjen Grotesk |
| Poppins | Geometric sans that AI defaults to | General Sans, Cabinet Grotesk, Switzer |
| Open Sans | The "safe" Google Font pick | Source Sans 3, Nunito Sans, Plus Jakarta Sans |

The goal is not to blacklist fonts - Inter is genuinely good. The goal is to stop defaulting to the same 5 fonts on every project. Each design deserves its own typographic voice.

**Rule**: Before choosing fonts, define the aesthetic direction first (editorial, brutalist, playful, luxury, etc.), then pick fonts that serve that direction. Never start with "I'll just use Inter."

## Context-Specific Pairings

When the product domain is known, use these industry-optimized pairings:

| Context | Heading | Body | Google Fonts | Notes |
|---|---|---|---|---|
| Wellness / Health | Lora | Raleway | `Lora:wght@400;600;700` `Raleway:wght@300;400;500` | Organic curves meet elegant simplicity |
| Legal / Finance | EB Garamond | Lato | `EB+Garamond:wght@400;500;600;700` `Lato:wght@300;400;700` | Serif authority, clean body text |
| Gaming / Esports | Russo One | Chakra Petch | `Russo+One` `Chakra+Petch:wght@300;400;500;600;700` | Impact display, techy body |
| Restaurant / Food | Playfair Display SC | Karla | `Playfair+Display+SC:wght@400;700` `Karla:wght@300;400;500;600;700` | Small-caps menu elegance |
| Kids / Education | Baloo 2 | Comic Neue | `Baloo+2:wght@400;500;600;700` `Comic+Neue:wght@300;400;700` | Playful, friendly, readable |
| Fashion / Avant-Garde | Syne | Manrope | `Syne:wght@400;500;600;700` `Manrope:wght@300;400;500;600;700` | Distinctive creative headers |
| Crypto / Web3 | Orbitron | Exo 2 | `Orbitron:wght@400;500;600;700` `Exo+2:wght@300;400;500;600;700` | Futuristic, digital currency |
| E-commerce | Rubik | Nunito Sans | `Rubik:wght@300;400;500;600;700` `Nunito+Sans:wght@300;400;500;600;700` | Clean, conversion-focused readability |
| Academic / Research | Crimson Pro | Atkinson Hyperlegible | `Crimson+Pro:wght@400;500;600;700` `Atkinson+Hyperlegible:wght@400;700` | Scholarly serif, maximum accessibility |
| Sports / Fitness | Barlow Condensed | Barlow | `Barlow+Condensed:wght@400;500;600;700` `Barlow:wght@300;400;500;600;700` | Condensed impact headlines |
| Retro / Vintage | Abril Fatface | Merriweather | `Abril+Fatface` `Merriweather:wght@300;400;700` | High-impact vintage feel, display only |
| Bold / Marketing | Bebas Neue | Source Sans 3 | `Bebas+Neue` `Source+Sans+3:wght@300;400;500;600;700` | All-caps display + neutral body |
| Real Estate / Luxury | Cinzel | Josefin Sans | `Cinzel:wght@400;500;600;700` `Josefin+Sans:wght@300;400;500;600;700` | Premium serif elegance |
| Medical / Healthcare | Figtree | Noto Sans | `Figtree:wght@300;400;500;600;700` `Noto+Sans:wght@300;400;500;700` | Clean, highly accessible |
| Dashboard / Data | Fira Code | Fira Sans | `Fira+Code:wght@400;500;600;700` `Fira+Sans:wght@300;400;500;600;700` | Mono-sans family cohesion |

These pairings complement the aesthetic-direction table above. The aesthetic table is for creative direction; this table is for domain-specific defaults when you already know the product type.

## Font Weight Usage

```css
:root {
  --weight-regular:  400; /* Body text, descriptions, paragraphs */
  --weight-medium:   500; /* Buttons, labels, nav items, secondary headings */
  --weight-semibold: 600; /* Card titles, section headings */
  --weight-bold:     700; /* Page titles, hero text */
}
```

Usage:

```css
body         { font-weight: var(--weight-regular); }
.btn, label  { font-weight: var(--weight-medium); }
h3, h4, h5   { font-weight: var(--weight-semibold); }
h1, h2       { font-weight: var(--weight-bold); }

/* Display text at 40px+ only */
.hero-display {
  font-size: var(--text-4xl);
  font-weight: 300; /* Thin weights only at this size */
}
```

Never use weight 300 for body text - it fails readability at small sizes. Reserve thin weights for display text at 40px+.

## Measure (Line Length)

```css
:root {
  --measure:      65ch; /* Optimal paragraph width */
  --measure-wide: 80ch; /* Code blocks */
  --measure-narrow: 45ch; /* Pull quotes, sidebars */
}

p, li, blockquote {
  max-width: var(--measure);
}

pre, code {
  max-width: var(--measure-wide);
}
```

- Optimal reading: 45-75 characters per line
- `65ch` is the sweet spot for paragraphs
- For wider layouts, increase margins or use columns - never widen the text column
- Code blocks can go to `80ch` since scanning is different from reading prose

## Letter Spacing

```css
:root {
  --tracking-tight:  -0.02em; /* Large headings 24px+ */
  --tracking-normal:  0em;    /* Body text default */
  --tracking-wide:    0.01em; /* Small text 12px */
  --tracking-widest:  0.05em; /* All-caps labels */
}

h1, h2, h3 {
  letter-spacing: var(--tracking-tight); /* Tighten large text */
}

body {
  letter-spacing: var(--tracking-normal);
}

.label-caps {
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest); /* Must widen caps */
  font-size: var(--text-xs);
}

.caption {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
}
```

## Vertical Rhythm

Consistent spacing creates visual coherence. Base unit: 1rem (16px).

```css
:root {
  --rhythm: 1.5rem; /* Matches body line-height of 1.5 */
}

p {
  margin-block-end: var(--rhythm); /* 1x rhythm between paragraphs */
}

h1, h2, h3, h4 {
  margin-block-start: calc(var(--rhythm) * 2); /* 2x above heading */
  margin-block-end:   calc(var(--rhythm) * 0.5); /* 0.5x below - keep close to content */
}

ul, ol {
  line-height: var(--leading-base); /* Match body line-height */
}

li + li {
  margin-block-start: 0.375rem; /* 6px - mid-range of 4-8px */
}
```

## CSS Font Loading

```html
<!-- Preload the critical body font -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Preload heading font if different -->
<link rel="preload" href="/fonts/space-grotesk-subset.woff2" as="font" type="font/woff2" crossorigin>
```

```css
/* Body font - swap prevents FOIT (flash of invisible text) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900; /* Variable font range */
  font-display: swap;
}

/* Decorative font - optional skips if slow (shows fallback permanently) */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display.woff2') format('woff2');
  font-display: optional;
}
```

Rules:
- `font-display: swap` for body/heading fonts (prevents invisible text)
- `font-display: optional` for decorative or non-critical fonts
- Always `crossorigin` on preload for fonts served from CDN
- Subset to latin if not supporting other scripts - saves 60-80% file size
- Variable fonts: one file covers all weights (smaller total download than separate weight files)

## Text Styling Patterns

```css
/* Links - underline OR color, not both decorations */
a {
  color: var(--color-primary);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* Truncation - single line */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Truncation - multi-line (2 lines example) */
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Inline code */
code {
  font-family: var(--font-mono);
  font-size: 0.875em; /* Slightly smaller than context */
  background-color: var(--color-surface-subtle);
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
}

/* Labels / badges */
.label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  line-height: 1;
  padding: 0.25rem 0.5rem;
}

/* Placeholder */
::placeholder {
  color: var(--color-text-subtle); /* Lighter, never same as input value */
  /* Never use placeholder as a label - it disappears on focus */
}
```

## Common Typography Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| More than 6-7 unique font sizes | Visual noise, no hierarchy | Use the defined scale tokens only |
| Body text under 14px | Fails accessibility, strains eyes | Minimum `--text-sm` (14px) for body |
| Body text over 18px | Feels oversized, breaks measure | Cap body at `--text-md` (18px) |
| Heading and body sizes too close | No visual hierarchy | Maintain at least 1.5x size ratio between levels |
| Centered body text | Hard to track line starts when reading | Center only headings and short labels (under 3 words) |
| Line length over 80ch on desktop | Eye fatigue, hard to track return | Enforce `max-width: 65ch` on prose |
| Missing letter-spacing on caps | Cramped, hard to read | Always add `letter-spacing: 0.05em` to `text-transform: uppercase` |
| Using 300 weight for body | Fails at small sizes, low contrast feel | 400 minimum for body text |
