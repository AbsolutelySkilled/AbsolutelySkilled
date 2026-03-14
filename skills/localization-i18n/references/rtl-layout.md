<!-- Part of the localization-i18n AbsolutelySkilled skill. Load this file when
     working with RTL (right-to-left) layout support for Arabic, Hebrew, Persian, or Urdu. -->

# RTL Layout - Complete Migration Guide

Right-to-left (RTL) support is required for Arabic, Hebrew, Persian (Farsi), and Urdu.
RTL is not just "flip the text" - it requires rethinking the entire visual layout
direction, including margins, padding, icons, and reading flow.

---

## RTL languages

| Language | Script | Direction | BCP 47 examples |
|---|---|---|---|
| Arabic | Arabic | RTL | `ar`, `ar-SA`, `ar-EG` |
| Hebrew | Hebrew | RTL | `he`, `he-IL` |
| Persian (Farsi) | Arabic | RTL | `fa`, `fa-IR` |
| Urdu | Arabic | RTL | `ur`, `ur-PK` |
| Pashto | Arabic | RTL | `ps` |
| Kurdish (Sorani) | Arabic | RTL | `ckb` |

---

## Step 1: Set the document direction

```html
<!-- For RTL locales -->
<html dir="rtl" lang="ar">

<!-- For LTR locales -->
<html dir="ltr" lang="en">
```

Set `dir` dynamically based on the active locale:

```javascript
const rtlLocales = ['ar', 'he', 'fa', 'ur', 'ps', 'ckb'];

function isRtl(locale) {
  const lang = locale.split('-')[0];
  return rtlLocales.includes(lang);
}

document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr';
document.documentElement.lang = locale;
```

---

## Step 2: Replace physical CSS properties with logical properties

This is the most impactful change. Logical properties automatically flip based on
the document's `dir` attribute.

### Property mapping

| Physical (DON'T) | Logical (DO) |
|---|---|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left` | `float: inline-start` |
| `float: right` | `float: inline-end` |
| `border-radius: 4px 0 0 4px` | `border-start-start-radius: 4px; border-end-start-radius: 4px` |

### Shorthand logical properties

```css
/* Physical shorthand - values are top/right/bottom/left */
.box {
  margin: 10px 20px 10px 5px; /* DON'T - left/right are hardcoded */
}

/* Logical shorthand - values are block/inline */
.box {
  margin-block: 10px;         /* top and bottom */
  margin-inline: 5px 20px;    /* start and end */
}
```

### Size properties

| Physical | Logical |
|---|---|
| `width` | `inline-size` |
| `height` | `block-size` |
| `min-width` | `min-inline-size` |
| `max-height` | `max-block-size` |

---

## Step 3: Handle Flexbox and Grid

Flexbox `row` direction automatically flips in RTL contexts. No changes needed
for basic flex layouts if you're using logical properties for gaps and padding.

```css
/* This automatically reverses order in RTL */
.nav {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
```

For Grid, `grid-column-start` and `grid-column-end` do NOT flip. Use logical
equivalents or rely on `direction` inheritance:

```css
/* Explicit placement - does NOT flip */
.sidebar {
  grid-column: 1 / 2; /* Always left column */
}

/* Better: use named areas that respond to direction */
.layout {
  display: grid;
  grid-template-areas: "sidebar content";
}

[dir="rtl"] .layout {
  grid-template-areas: "content sidebar";
}
```

---

## Step 4: Mirror directional icons

Icons with directional meaning must be mirrored in RTL:

**Mirror these:**
- Back/forward arrows
- Navigation chevrons
- Reply/forward icons
- Progress indicators
- List bullets
- External link indicators

**Do NOT mirror these:**
- Clocks (time goes clockwise universally)
- Checkmarks
- Media play/pause (universal convention)
- Logos and brand marks
- Physical world representations (maps, compasses)

### CSS mirroring approach

```css
[dir="rtl"] .icon-directional {
  transform: scaleX(-1);
}
```

### Better: use a dedicated RTL icon set or CSS class

```css
.icon-back {
  background-image: url('arrow-left.svg');
}

[dir="rtl"] .icon-back {
  background-image: url('arrow-right.svg');
}
```

---

## Step 5: Handle bidirectional text (bidi)

When RTL and LTR text appear together (usernames, URLs, code snippets, numbers
in Arabic text), use Unicode bidi controls or HTML attributes:

### HTML `dir="auto"`

For user-generated content where you don't know the direction:

```html
<p dir="auto">{userComment}</p>
```

The browser determines direction from the first strong character.

### Unicode bidi isolation

```html
<!-- Wrap embedded opposite-direction text -->
<bdi>{userName}</bdi> left a comment.
```

`<bdi>` (bidirectional isolation) prevents the embedded text from disrupting
the surrounding text's direction.

### CSS bidi isolation

```css
.user-content {
  unicode-bidi: isolate;
}
```

---

## Step 6: Numbers in RTL

Arabic text is RTL, but numbers in Arabic are written left-to-right (even in
Arabic script). The browser handles this automatically for standard numbers.

Arabic-Indic numerals (used in some Arabic locales):

| Western | Arabic-Indic |
|---|---|
| 0 | ٠ |
| 1 | ١ |
| 2 | ٢ |
| 3 | ٣ |

Use `Intl.NumberFormat` to respect the locale's numbering system:

```javascript
new Intl.NumberFormat('ar-SA', { numberingSystem: 'arab' }).format(1234);
// -> "١٬٢٣٤"

new Intl.NumberFormat('ar-SA').format(1234);
// -> "1,234" (default, western numerals)
```

---

## Testing RTL

1. **Quick test:** Add `dir="rtl"` to `<html>` in your browser's dev tools
2. **Pseudolocalization:** Use a tool that reverses strings and adds RTL marks
3. **Visual regression:** Screenshot tests in both LTR and RTL modes
4. **Real language testing:** Test with actual Arabic or Hebrew content, not
   just mirrored English - real text reveals bidi edge cases
5. **Common breakpoints:** Check text truncation, overflow, and tooltip positioning

---

## Browser support

CSS logical properties have excellent support (95%+ global coverage as of 2025).
The main gap is older Safari versions (< 15). If you need to support them, use
a PostCSS plugin like `postcss-logical` to generate physical property fallbacks.
