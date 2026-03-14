<!-- Part of the localization-i18n AbsolutelySkilled skill. Load this file when
     working with pluralization rules, CLDR plural categories, or language-specific plural forms. -->

# Pluralization - CLDR Plural Rules

Pluralization is one of the hardest parts of i18n because languages have wildly
different rules. English has 2 forms (singular/plural), Arabic has 6, Polish has 4,
Japanese has 1 (no plural distinction). The Unicode CLDR (Common Locale Data Repository)
defines the authoritative plural rules for every language.

---

## The six CLDR plural categories

| Category | Meaning | Example languages |
|---|---|---|
| `zero` | Special form for zero | Arabic, Latvian, Welsh |
| `one` | Singular or special "one" form | English, French, German, Spanish, Hindi |
| `two` | Dual form | Arabic, Hebrew, Slovenian |
| `few` | Paucal / small numbers | Polish (2-4), Czech (2-4), Russian (2-4 mod 10), Arabic (3-10) |
| `many` | Large numbers | Polish (5+), Russian (5+ mod 10), Arabic (11-99) |
| `other` | General / default (ALWAYS required) | All languages |

---

## Plural rules by language

### English (2 forms: one, other)

```
one: n = 1
other: everything else
```

```
{count, plural,
  one {# item}
  other {# items}
}
```

### French (2 forms: one, other)

```
one: n = 0 or n = 1 (NOTE: 0 is singular in French!)
other: everything else
```

This is a common gotcha - in French, `0 pomme` (singular), not `0 pommes`.

### German (2 forms: one, other)

Same as English: `one` for 1, `other` for everything else.

### Russian (3 forms: one, few, many, other)

```
one:   n mod 10 = 1 AND n mod 100 != 11
few:   n mod 10 in 2..4 AND n mod 100 not in 12..14
many:  n mod 10 = 0 OR n mod 10 in 5..9 OR n mod 100 in 11..14
other: (used for non-integer values)
```

Examples:
- 1 -> one: "1 файл" (file)
- 2 -> few: "2 файла" (files, genitive singular)
- 5 -> many: "5 файлов" (files, genitive plural)
- 21 -> one: "21 файл"
- 22 -> few: "22 файла"
- 11 -> many: "11 файлов"

### Polish (3 forms: one, few, many, other)

```
one:   n = 1
few:   n mod 10 in 2..4 AND n mod 100 not in 12..14
many:  n != 1 AND n mod 10 in 0..1, OR n mod 10 in 5..9, OR n mod 100 in 12..14
other: (non-integer values)
```

### Arabic (6 forms: zero, one, two, few, many, other)

```
zero:  n = 0
one:   n = 1
two:   n = 2
few:   n mod 100 in 3..10
many:  n mod 100 in 11..99
other: everything else (including 100, 1000, etc.)
```

Arabic is the most complex major language for pluralization.

### Japanese, Chinese, Korean, Vietnamese (1 form: other)

These languages have no grammatical plural. Only the `other` category is used.

```
{count, plural,
  other {#個のアイテム}
}
```

### Hebrew (3 forms: one, two, other)

```
one:   n = 1
two:   n = 2
other: everything else
```

---

## Common pluralization mistakes

### Mistake 1: Hardcoding English plural logic

```javascript
// WRONG - only works for English
const label = count === 1 ? 'item' : 'items';

// CORRECT - use ICU MessageFormat
const message = intl.formatMessage({
  id: 'cart.items',
  defaultMessage: '{count, plural, one {# item} other {# items}}',
}, { count });
```

### Mistake 2: Forgetting the `other` category

```
// WRONG - missing `other`, will crash for non-integer values
{count, plural,
  one {# item}
}

// CORRECT
{count, plural,
  one {# item}
  other {# items}
}
```

### Mistake 3: Only providing English plural forms in source messages

When writing source messages (usually English), only provide `one` and `other`.
Translators for Arabic, Polish, etc. will add `zero`, `two`, `few`, `many` during
translation. Your source messages don't need all six categories.

### Mistake 4: Using `=0` when `zero` is intended

`=0` is an exact match for the number 0, used in all languages.
`zero` is a CLDR plural category, used only in languages that have a grammatical
zero form (like Arabic).

```
// =0 shows in ALL languages when count is exactly 0
{count, plural,
  =0 {No items}
  one {# item}
  other {# items}
}

// zero category only activates in languages with a grammatical zero form
```

Use `=0` for "empty state" messages that apply universally. Let translators handle
the `zero` category for language-specific forms.

### Mistake 5: Assuming decimal numbers follow integer rules

In many languages, decimal numbers (1.5, 2.0, 0.5) have different plural rules
than integers. CLDR rules use `i` (integer part) and `f`/`t` (fractional parts)
in their definitions. Test with decimals, not just integers.

---

## Testing pluralization

Always test these values for each plural message:

| Value | Why |
|---|---|
| 0 | Empty state |
| 1 | Singular (one) |
| 2 | Dual form languages (Arabic, Hebrew) |
| 5 | Triggers `many` in Russian, Polish |
| 11 | Gotcha: `many` in Russian (not `one` even though it ends in 1) |
| 21 | Gotcha: `one` in Russian (mod 10 = 1, mod 100 != 11) |
| 0.5 | Decimal - may use `other` even in English |
| 1.0 | May or may not match `one` depending on implementation |

---

## CLDR plural rule reference

The authoritative source for all plural rules is:
https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html

When in doubt, check this reference rather than guessing.
