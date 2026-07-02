<!-- Part of the `absolute` skill (simplify command). Load this file when
     simplifying stylesheets (.css, .scss, .sass, .less) or when Tailwind utility
     classes are in scope (className strings in .jsx/.tsx with a tailwind config). -->

# CSS / Styling Simplification Guide

Deep opinions for simplifying stylesheets and utility-class markup. These
supplement the universal catalog -- apply both. When project config (Stylelint,
Prettier, a design-token file, CLAUDE.md) contradicts anything here, project
config wins.

**Preserve rendered output.** Never change the cascade, specificity outcome, or
computed styles. Simplify how rules are written, not what they render. When a
change might alter specificity or override order, skip it and flag in the summary.

---

## Shorthand Properties

Collapse longhands into shorthand only when ALL relevant longhands are present
and adjacent -- otherwise shorthand silently resets the omitted sides.

```css
/* Before */
margin-top: 8px;
margin-right: 8px;
margin-bottom: 8px;
margin-left: 8px;

/* After */
margin: 8px;
```

Do NOT collapse when only some sides are set, or when an intervening rule sets
another side -- the shorthand would reset it to its initial value.

---

## Redundant Values

| Before | After | Why |
|---|---|---|
| `margin: 0px` | `margin: 0` | Zero needs no unit |
| `color: #ffffff` | `color: #fff` | Hex can shorten when digits pair |
| `font-weight: normal` | `font-weight: 400` (or leave) | Only if project uses numeric weights |
| `border: none; border: 0` (both) | one of them | Duplicate declaration |
| `transform: translate(0, 0)` on static el | remove | No-op |

Do NOT shorten hex if the project's convention or design tokens use full form.

---

## Duplicate & Dead Rules

- **Duplicate selectors** with the same properties -- merge into one rule.
- **Overridden declarations** -- if a property is set then unconditionally
  reset later in the same selector, keep only the effective one.
- **Dead rules** -- selectors matching no element. Be conservative: only remove
  when you can see the markup and confirm no match (dynamic classNames, CSS
  modules, and JS-injected classes are easy to miss). When unsure, skip.

---

## Selector Simplification

- **Over-qualified selectors** -- `ul.nav` → `.nav` when the class is unique;
  `div.card` → `.card`. Drop the tag qualifier unless it's needed for specificity
  or disambiguation.
- **Needless descendant chains** -- `.card .body .title` → `.card-title` only if
  it doesn't change which elements match. Usually safer to leave; flag instead.
- **Do not** lower specificity if another rule relies on the higher specificity
  to win. Specificity changes are behavior changes.

---

## SCSS / Sass

- **Flatten pointless nesting** -- nesting that exists only to group, not to
  build a real descendant selector, adds indentation without meaning.
- **`&` misuse** -- collapse `& { ... }` wrappers that wrap nothing.
- **Unused variables / mixins** -- remove `$vars` and `@mixin`s with no reference
  (confirm no reference across the partial's importers first).
- **Repeated literals** -- a color/size literal repeated 3+ times should become a
  variable or use an existing design token. Prefer an existing token over a new var.

---

## Tailwind / Utility Classes

- **Deduplicate** repeated utilities in one `className` (`p-4 ... p-4`).
- **Conflicting utilities** -- `p-2 p-4` on the same element: the later wins in
  Tailwind's generated order, but relying on that is fragile. Keep the intended
  one, drop the other.
- **Collapse axis pairs** -- `pt-4 pb-4` → `py-4`, `ml-2 mr-2` → `mx-2`,
  `pl-4 pr-4 pt-4 pb-4` → `p-4`. Only when values match on all covered sides.
- **Extract a component/`@apply`** only when the exact utility string repeats in
  2+ places -- not preemptively. Do not invent an abstraction for one use.
- **Do not reorder** utilities for aesthetics unless the project runs
  `prettier-plugin-tailwindcss` (then let the tool do it -- don't hand-sort).

---

## Anti-Patterns to Avoid When Simplifying CSS

| Do NOT do this | Why |
|---|---|
| Collapse partial longhands into shorthand | Shorthand resets the omitted sides to initial |
| Drop a tag qualifier that provided needed specificity | Changes which rule wins |
| Remove a "dead" rule targeting a dynamic/JS-injected class | The class may exist at runtime |
| Lower specificity to "clean up" a selector | Another rule may depend on it winning |
| Hand-reorder Tailwind classes when a plugin already sorts them | Duplicates the tool, causes churn |
| Extract `@apply`/component for a single-use class string | Adds indirection for no reuse |
| Merge `!important` rules without checking override order | Changes the effective style |
