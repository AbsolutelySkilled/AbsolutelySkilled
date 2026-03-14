<!-- Part of the localization-i18n AbsolutelySkilled skill. Load this file when
     working with ICU MessageFormat syntax, plural/select patterns, or message authoring. -->

# ICU MessageFormat - Full Syntax Guide

ICU MessageFormat is the Unicode standard for parameterized, translatable messages.
It is supported by react-intl (FormatJS), i18next-icu, messageformat.js, Java's
`java.text.MessageFormat`, and most professional translation management systems.

---

## Simple interpolation

```
Hello, {name}!
You have {count} items in your cart.
```

Variable names inside `{braces}` are replaced at runtime. The variable name must
match exactly what the code passes.

---

## Plural - `{variable, plural, ...}`

Selects a message variant based on a numeric value using CLDR plural rules.

### Syntax

```
{count, plural,
  =0 {No items}
  one {# item}
  other {# items}
}
```

### Plural categories

The six CLDR categories (not all languages use all of them):

| Category | Used by | Example trigger values |
|---|---|---|
| `zero` | Arabic, Latvian | 0 (in Arabic) |
| `one` | English, French, German, Portuguese | 1 |
| `two` | Arabic, Hebrew, Slovenian | 2 |
| `few` | Polish, Czech, Russian, Arabic | 2-4 (Polish), 3-10 (Arabic) |
| `many` | Polish, Russian, Arabic | 5-20 (Polish), 11-99 (Arabic) |
| `other` | ALL languages (required) | Everything else |

### The `#` symbol

Inside a plural branch, `#` is replaced with the locale-formatted value of the
plural variable:

```
{count, plural,
  one {# file was deleted}
  other {# files were deleted}
}
```

With `count = 1000` and locale `en-US`: "1,000 files were deleted"

### Exact matches with `=N`

`=0`, `=1`, `=2` etc. match exact numeric values and take priority over categories:

```
{count, plural,
  =0 {Your inbox is empty}
  =1 {You have one new message}
  other {You have # new messages}
}
```

### Rule: always include `other`

Every plural message MUST have an `other` branch. Omitting it is a runtime error
in most implementations.

---

## Select - `{variable, select, ...}`

Selects a message variant based on a string value. Commonly used for gender but
works for any categorical variable.

### Syntax

```
{role, select,
  admin {Administrator settings}
  editor {Editor dashboard}
  other {Viewer mode}
}
```

The `other` branch is required and acts as the default for unrecognized values.

### Gender example

```
{gender, select,
  male {He will attend the event}
  female {She will attend the event}
  other {They will attend the event}
}
```

---

## Selectordinal - `{variable, selectordinal, ...}`

Handles ordinal numbers ("1st", "2nd", "3rd", "4th").

```
{position, selectordinal,
  one {#st place}
  two {#nd place}
  few {#rd place}
  other {#th place}
}
```

- 1 -> "1st place" (matches `one`)
- 2 -> "2nd place" (matches `two`)
- 3 -> "3rd place" (matches `few`)
- 4 -> "4th place" (matches `other`)
- 21 -> "21st place" (matches `one`)

---

## Nested patterns

ICU messages can be nested. A common case is combining gender select with plurals:

```
{gender, select,
  male {{count, plural,
    one {He has # new notification}
    other {He has # new notifications}
  }}
  female {{count, plural,
    one {She has # new notification}
    other {She has # new notifications}
  }}
  other {{count, plural,
    one {They have # new notification}
    other {They have # new notifications}
  }}
}
```

> Keep nesting to 2 levels maximum. Deeper nesting makes messages very hard for
> translators to work with. If you need 3+ levels, split into separate messages.

---

## Number and date formatting

### Number skeletons

```
The total is {amount, number, ::currency/USD}.
Progress: {ratio, number, ::percent}.
```

### Date skeletons

```
Joined on {date, date, medium}.
Last seen {time, time, short}.
```

Standard date/time styles: `short`, `medium`, `long`, `full`.

### Custom skeletons (ICU 67+)

```
{date, date, ::yyyyMMdd}
{amount, number, ::compact-short}
```

---

## Escaping literal braces

To include literal `{` or `}` in a message, wrap the literal text in single quotes:

```
Wrap code in '{' curly braces '}'.
```

A single `'` is escaped with `''`:

```
It''s a beautiful day.
```

---

## Rich text / tags (FormatJS extension)

FormatJS extends ICU with XML-like tags for component interpolation:

```
Please <link>click here</link> to continue.
Read the <bold>terms of service</bold>.
```

In React:

```jsx
<FormattedMessage
  id="cta"
  defaultMessage="Please <link>click here</link> to continue."
  values={{
    link: (chunks) => <a href="/next">{chunks}</a>,
  }}
/>
```

This keeps the full sentence available for translators instead of breaking it
into fragments.

---

## Best practices for message authors

1. Keep messages as complete sentences - never split a sentence across multiple keys
2. Include enough context in the message ID or description for translators
3. Limit nesting to 2 levels
4. Always provide `other` for plural and select
5. Use `#` for the formatted number in plural branches, never re-interpolate the count
6. Prefer named variables (`{userName}`) over positional ones
7. Add translator comments explaining context when the meaning is ambiguous
