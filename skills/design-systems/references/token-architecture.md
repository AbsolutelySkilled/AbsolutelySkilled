<!-- Part of the design-systems AbsolutelySkilled skill. Load this file when
     working with design token structure, naming conventions, Style Dictionary
     pipelines, or connecting Figma design tokens to code. -->

# Token Architecture

A complete reference for designing, naming, structuring, and tooling design
token systems. Covers everything from a single-brand CSS-only setup to a
multi-brand, multi-platform token pipeline.

---

## The three-tier model

Every production token system uses three tiers. Enforcing the tier contract is
what makes theming work at scale.

```
Tier 1 - Primitive (global)
  Raw design values with no semantic meaning.
  Named by category + scale step.
  Examples: --blue-500, --gray-100, --space-4, --text-sm
  Rule: NEVER referenced in components directly.

Tier 2 - Semantic (alias)
  Purpose-driven names that map to a primitive.
  Named by intent, not by value.
  Examples: --color-interactive-primary, --color-text-muted, --space-component-gap
  Rule: These are the ONLY tokens components should reference.
  Rule: These are the ONLY tokens that change between themes.

Tier 3 - Component (local)
  Optional. Scoped to a single component, maps to a semantic token.
  Examples: --btn-bg, --card-radius, --input-border-color
  Rule: Only define if the component needs to be independently themeable.
```

---

## Naming convention

Pattern: `--{category}-{property}-{variant}-{state}`

All segments after `{category}` are optional and added only when they add
meaningful differentiation.

### Category

| Category | Purpose | Examples |
|---|---|---|
| `color` | Any color value | `--color-bg-primary`, `--color-text-muted` |
| `space` | Spacing and sizing | `--space-4`, `--space-component-gap` |
| `text` | Font size | `--text-sm`, `--text-2xl` |
| `font` | Font family or weight | `--font-sans`, `--font-bold` |
| `leading` | Line height | `--leading-normal`, `--leading-tight` |
| `tracking` | Letter spacing | `--tracking-wide` |
| `radius` | Border radius | `--radius-md`, `--radius-full` |
| `shadow` | Box shadow | `--shadow-md`, `--shadow-xl` |
| `border` | Border width | `--border-width`, `--border-width-strong` |
| `duration` | Animation duration | `--duration-normal`, `--duration-fast` |
| `ease` | Animation easing | `--ease-default`, `--ease-bounce` |
| `z` | Z-index | `--z-modal`, `--z-tooltip` |

### Property segment

Describes what the token controls within its category:

```
color:   bg, text, border, ring, surface, icon, interactive
space:   (scale steps or semantic: gap, padding, inset)
text:    (scale steps: xs, sm, base, lg, xl, 2xl, etc.)
```

### Variant segment

```
primary, secondary, tertiary, muted, inverted
success, warning, error, info
destructive
elevated, overlay
```

### State segment (for interactive tokens)

```
hover, active, focus, disabled, checked, selected, pressed
```

### Good names vs. bad names

| Bad | Good | Why |
|---|---|---|
| `--blue` | `--color-interactive-primary` | Intent is clear, not value |
| `--button-color` | `--color-interactive-primary` | Reusable across components |
| `--dark-text` | `--color-text-primary` | Survives light/dark inversion |
| `--large-spacing` | `--space-8` or `--space-component-gap` | Unambiguous |
| `--text` | `--color-text-primary` | Missing category context |

---

## Full primitive token reference

### Colors

```css
:root {
  /* Grays */
  --gray-50:  #f9fafb; --gray-100: #f3f4f6; --gray-200: #e5e7eb;
  --gray-300: #d1d5db; --gray-400: #9ca3af; --gray-500: #6b7280;
  --gray-600: #4b5563; --gray-700: #374151; --gray-800: #1f2937; --gray-900: #111827;

  /* Blue */
  --blue-50: #eff6ff; --blue-100: #dbeafe; --blue-400: #60a5fa;
  --blue-500: #3b82f6; --blue-600: #2563eb; --blue-700: #1d4ed8;

  /* Indigo */
  --indigo-50: #eef2ff; --indigo-400: #818cf8;
  --indigo-500: #6366f1; --indigo-600: #4f46e5; --indigo-700: #4338ca;

  /* Green */
  --green-50: #f0fdf4; --green-400: #4ade80;
  --green-500: #22c55e; --green-600: #16a34a; --green-700: #15803d;

  /* Red */
  --red-50: #fef2f2; --red-400: #f87171;
  --red-500: #ef4444; --red-600: #dc2626; --red-700: #b91c1c;

  /* Amber */
  --amber-50: #fffbeb; --amber-400: #fbbf24;
  --amber-500: #f59e0b; --amber-600: #d97706; --amber-700: #b45309;
}
```

### Spacing (4px base unit)

```css
:root {
  --space-0:   0px;  --space-0-5: 2px;   --space-1:  4px;
  --space-1-5: 6px;  --space-2:   8px;   --space-2-5: 10px;
  --space-3:  12px;  --space-4:  16px;   --space-5:  20px;
  --space-6:  24px;  --space-8:  32px;   --space-10: 40px;
  --space-12: 48px;  --space-16: 64px;   --space-20: 80px;
  --space-24: 96px;  --space-32: 128px;
}
```

### Typography

```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
  --text-5xl:  3rem;      /* 48px */

  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;

  --leading-none:    1;
  --leading-tight:   1.25;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.75;

  --tracking-tighter: -0.05em;
  --tracking-tight:   -0.025em;
  --tracking-normal:   0em;
  --tracking-wide:     0.025em;
  --tracking-wider:    0.05em;
}
```

### Effects

```css
:root {
  --shadow-xs:  0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-sm:  0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  --shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,0.05);

  --radius-none: 0px;
  --radius-sm:   0.125rem;  /* 2px */
  --radius-md:   0.375rem;  /* 6px */
  --radius-lg:   0.5rem;    /* 8px */
  --radius-xl:   0.75rem;   /* 12px */
  --radius-2xl:  1rem;      /* 16px */
  --radius-full: 9999px;

  --border-width:        1px;
  --border-width-strong: 2px;

  --duration-instant: 0ms;
  --duration-fast:    100ms;
  --duration-normal:  200ms;
  --duration-slow:    300ms;
  --duration-slower:  500ms;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);

  --z-base:     0;
  --z-raised:   1;
  --z-dropdown: 10;
  --z-sticky:   20;
  --z-overlay:  30;
  --z-modal:    40;
  --z-toast:    50;
  --z-tooltip:  60;
}
```

---

## Semantic token reference

### Light theme (`:root` defaults)

```css
:root {
  /* Backgrounds */
  --color-bg-primary:   #ffffff;
  --color-bg-secondary: var(--gray-50);
  --color-bg-tertiary:  var(--gray-100);

  /* Surfaces (elevated elements: cards, dropdowns) */
  --color-surface:         #ffffff;
  --color-surface-elevated: #ffffff;
  --color-surface-overlay:  rgba(0, 0, 0, 0.5);

  /* Text */
  --color-text-primary:   var(--gray-900);
  --color-text-secondary: var(--gray-600);
  --color-text-tertiary:  var(--gray-400);
  --color-text-inverted:  #ffffff;
  --color-text-disabled:  var(--gray-300);

  /* Borders */
  --color-border:         var(--gray-200);
  --color-border-strong:  var(--gray-400);
  --color-border-focus:   var(--indigo-500);

  /* Focus ring */
  --color-ring: var(--indigo-500);

  /* Interactive - primary action */
  --color-interactive-primary:        var(--indigo-600);
  --color-interactive-primary-hover:  var(--indigo-700);
  --color-interactive-primary-active: var(--indigo-800);
  --color-interactive-primary-text:   #ffffff;

  /* Interactive - destructive action */
  --color-interactive-destructive:        var(--red-600);
  --color-interactive-destructive-hover:  var(--red-700);
  --color-interactive-destructive-text:   #ffffff;

  /* Status */
  --color-success:      var(--green-600);
  --color-success-bg:   var(--green-50);
  --color-success-text: var(--green-700);

  --color-warning:      var(--amber-500);
  --color-warning-bg:   var(--amber-50);
  --color-warning-text: var(--amber-700);

  --color-error:        var(--red-600);
  --color-error-bg:     var(--red-50);
  --color-error-text:   var(--red-700);

  --color-info:         var(--blue-600);
  --color-info-bg:      var(--blue-50);
  --color-info-text:    var(--blue-700);
}
```

### Dark theme overrides

```css
[data-theme="dark"] {
  --color-bg-primary:   var(--gray-950, #0a0f1a);
  --color-bg-secondary: var(--gray-900);
  --color-bg-tertiary:  var(--gray-800);

  --color-surface:          var(--gray-900);
  --color-surface-elevated: var(--gray-800);

  --color-text-primary:   var(--gray-50);
  --color-text-secondary: var(--gray-400);
  --color-text-tertiary:  var(--gray-500);
  --color-text-inverted:  var(--gray-900);
  --color-text-disabled:  var(--gray-600);

  --color-border:        var(--gray-700);
  --color-border-strong: var(--gray-500);
  --color-ring:          var(--indigo-400);

  --color-interactive-primary:        var(--indigo-500);
  --color-interactive-primary-hover:  var(--indigo-400);
  --color-interactive-primary-active: var(--indigo-300);

  --color-interactive-destructive:       var(--red-500);
  --color-interactive-destructive-hover: var(--red-400);

  --color-success:      var(--green-400);
  --color-success-bg:   rgba(34, 197, 94, 0.1);
  --color-success-text: var(--green-400);

  --color-warning:      var(--amber-400);
  --color-warning-bg:   rgba(245, 158, 11, 0.1);
  --color-warning-text: var(--amber-400);

  --color-error:        var(--red-400);
  --color-error-bg:     rgba(239, 68, 68, 0.1);
  --color-error-text:   var(--red-400);

  --color-info:         var(--blue-400);
  --color-info-bg:      rgba(59, 130, 246, 0.1);
  --color-info-text:    var(--blue-400);
}

/* System dark as fallback when no explicit data-theme attribute */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary:   var(--gray-900);
    --color-bg-secondary: var(--gray-800);
    --color-text-primary: var(--gray-50);
    --color-border:       var(--gray-700);
    --color-surface:      var(--gray-900);
    --color-ring:         var(--indigo-400);
    --color-interactive-primary: var(--indigo-500);
  }
}
```

---

## File structure

Organize token files so they can be imported selectively:

```
tokens/
  primitives/
    colors.css
    spacing.css
    typography.css
    effects.css         (shadows, radius, borders)
    motion.css
    z-index.css
  semantic/
    light.css           (:root defaults)
    dark.css            ([data-theme="dark"] overrides)
  components/           (optional component-scoped tokens)
    button.css
    input.css
    card.css
  index.css             (imports in order: primitives -> semantic -> components)
```

`index.css` import order:
```css
@import './primitives/colors.css';
@import './primitives/spacing.css';
@import './primitives/typography.css';
@import './primitives/effects.css';
@import './primitives/motion.css';
@import './primitives/z-index.css';
@import './semantic/light.css';
@import './semantic/dark.css';
```

---

## Style Dictionary pipeline

Style Dictionary is the standard tool for platform-neutral token pipelines.
It takes JSON/YAML source files and outputs platform-specific formats (CSS,
JS, iOS, Android, etc.).

### Source token format

```json
// tokens/color/primitive.json
{
  "color": {
    "blue": {
      "500": { "value": "#3b82f6", "type": "color", "description": "Primary blue at medium lightness" },
      "600": { "value": "#2563eb", "type": "color" }
    },
    "gray": {
      "50":  { "value": "#f9fafb", "type": "color" },
      "900": { "value": "#111827", "type": "color" }
    }
  }
}
```

```json
// tokens/color/semantic.json
{
  "color": {
    "interactive": {
      "primary": {
        "value": "{color.blue.600}",
        "type": "color",
        "description": "Primary action color"
      }
    },
    "text": {
      "primary": { "value": "{color.gray.900}", "type": "color" }
    }
  }
}
```

### Configuration

```javascript
// style-dictionary.config.mjs
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'primitives.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('primitive'),
          options: { selector: ':root', outputReferences: false },
        },
        {
          destination: 'semantic.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic'),
          options: { selector: ':root', outputReferences: true },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [{ destination: 'tokens.mjs', format: 'javascript/es6' }],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [{ destination: 'tokens.d.ts', format: 'typescript/es6-declarations' }],
    },
  },
};
```

```bash
# Install and run
npm install style-dictionary
npx style-dictionary build --config style-dictionary.config.mjs
```

### Custom transform example (camelCase to kebab-case CSS var names)

```javascript
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'name/kebab',
  type: 'name',
  transformer: (token) => token.path.join('-').toLowerCase(),
});
```

---

## Multi-brand token patterns

For multi-brand systems, the brand layer sits on top of semantic tokens and
overrides only color values. Typography, spacing, and motion remain shared.

```css
/* brands/acme.css */
.brand-acme,
[data-brand="acme"] {
  --color-interactive-primary:        #0d9488; /* teal-600 */
  --color-interactive-primary-hover:  #0f766e; /* teal-700 */
  --color-interactive-primary-active: #115e59; /* teal-800 */
  --color-ring:                       #0d9488;
  --color-interactive-primary-text:   #ffffff;
}

/* brands/nova.css */
[data-brand="nova"] {
  --color-interactive-primary:        #7c3aed; /* violet-600 */
  --color-interactive-primary-hover:  #6d28d9; /* violet-700 */
  --color-ring:                       #7c3aed;
}
```

Apply at the root or any ancestor element:

```html
<body data-brand="acme" data-theme="dark">
  <!-- All components adapt automatically -->
</body>
```

Token resolution order (highest specificity wins):
`component tokens -> brand tokens -> theme tokens -> semantic tokens -> primitive tokens`

---

## Figma Variables integration

Figma Variables map directly to the three-tier token model:

| Figma concept | Token tier | Sync tool |
|---|---|---|
| Collection "Primitives" | Tier 1 (primitive) | Tokens Studio, Variables2CSS |
| Collection "Semantic" | Tier 2 (semantic) | Tokens Studio |
| Modes (Light/Dark) | Theme overrides | Variables2CSS |

### Workflow with Tokens Studio

1. Install the Tokens Studio Figma plugin
2. Connect to your token repo (GitHub sync)
3. Push token changes from Figma -> JSON files in repo
4. CI runs Style Dictionary -> outputs CSS/JS
5. Component library picks up updated token build artifacts

### Export Figma Variables to CSS (manual)

Use the community plugin "Variables to CSS" or "CSS Variables" to export
Figma variables as CSS custom properties matching your naming convention.
Always review the export - Figma names may need mapping to your convention.

---

## Common mistakes

| Mistake | Fix |
|---|---|
| Using `--blue-500` in a component | Swap to `--color-interactive-primary` |
| Separate token files for each component (not shared) | Use semantic layer shared across all components |
| Forgetting to add new semantic tokens to dark theme | Audit dark theme after every new semantic token |
| Naming tokens by value (`--light-blue`) | Name by intent (`--color-interactive-primary`) |
| One monolithic `tokens.css` file | Split by tier and category for maintainability |
| No description field on tokens | Add `description` to all semantic tokens for Storybook integration |
| Brand overrides changing spacing | Brands should only override color tokens |
