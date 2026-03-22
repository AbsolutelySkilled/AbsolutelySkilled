<!-- Part of the react-ink AbsolutelySkilled skill. Load this file when
     working with community Ink components for text input, selection, spinners, etc. -->

# React Ink Ecosystem - Community Components

## ink-text-input

Text input component for interactive CLI prompts.

```bash
npm install ink-text-input
```

```tsx
import TextInput from 'ink-text-input';

function SearchPrompt() {
  const [query, setQuery] = useState('');

  return (
    <Box>
      <Text>Search: </Text>
      <TextInput value={query} onChange={setQuery} onSubmit={(value) => search(value)} />
    </Box>
  );
}
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Current input value (controlled) |
| `onChange` | `(value: string) => void` | Called on every keystroke |
| `onSubmit` | `(value: string) => void` | Called when Enter is pressed |
| `placeholder` | `string` | Placeholder text |
| `mask` | `string` | Character to mask input (e.g., `'*'` for passwords) |
| `focus` | `boolean` | Whether this input is focused |
| `showCursor` | `boolean` | Show blinking cursor |

Also exports `UncontrolledTextInput` for self-managed state (just needs `onSubmit`).

---

## ink-select-input

Select/dropdown component for interactive CLI menus.

```bash
npm install ink-select-input
```

```tsx
import SelectInput from 'ink-select-input';

const items = [
  {label: 'TypeScript', value: 'ts'},
  {label: 'JavaScript', value: 'js'},
  {label: 'Python', value: 'py'},
];

function LanguagePicker() {
  return (
    <SelectInput
      items={items}
      onSelect={(item) => console.log(`Selected: ${item.value}`)}
    />
  );
}
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `items` | `Array<{label, value}>` | List of selectable items |
| `onSelect` | `(item) => void` | Called when Enter is pressed on an item |
| `onHighlight` | `(item) => void` | Called when an item is highlighted |
| `isFocused` | `boolean` | Enable/disable keyboard control |
| `initialIndex` | `number` | Initial highlighted item index |

Navigation: Arrow keys, j/k, number keys for instant jump, Enter to select.

---

## ink-spinner

Animated loading spinner with 90+ styles.

```bash
npm install ink-spinner
```

```tsx
import Spinner from 'ink-spinner';

function Loading() {
  return (
    <Text>
      <Spinner type="dots" /> Loading data...
    </Text>
  );
}
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `type` | `string` | Spinner style from cli-spinners (default: `'dots'`) |

Popular types: `dots`, `line`, `pipe`, `star`, `hamburger`, `growVertical`, `bounce`, `arc`, `bouncingBar`.

---

## ink-gradient

Apply gradient colors to terminal text.

```bash
npm install ink-gradient
```

```tsx
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

function Banner() {
  return (
    <Gradient name="rainbow">
      <BigText text="Hello CLI" />
    </Gradient>
  );
}
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `name` | `string` | Preset gradient name (e.g., `'rainbow'`, `'cristal'`, `'mind'`) |
| `colors` | `string[]` | Custom color array (hex values) |

---

## ink-big-text

Render large ASCII art text banners using cfonts.

```bash
npm install ink-big-text
```

```tsx
import BigText from 'ink-big-text';

function Header() {
  return <BigText text="My CLI" font="block" />;
}
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `text` | `string` | Text to render large |
| `font` | `string` | Font style (delegates to cfonts) |
| `backgroundColor` | `string` | Background color |

---

## ink-link

Clickable hyperlinks in terminals that support them.

```bash
npm install ink-link
```

```tsx
import Link from 'ink-link';

function Footer() {
  return (
    <Link url="https://github.com/vadimdemedes/ink">
      Ink on GitHub
    </Link>
  );
}
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `url` | `string` | URL to link to (required) |
| `fallback` | `boolean \| function` | `true` appends URL, `false` hides, function for custom format |

> Automatically detects terminal hyperlink support. Falls back gracefully.

---

## Frameworks & UI Kits

| Package | Description |
|---|---|
| `@inkjs/ui` | Official UI kit by Vadim Demedes (2k+ stars) - TextInput, EmailInput, PasswordInput, ConfirmInput, Select, MultiSelect, Spinner, ProgressBar, Badge, StatusMessage, Alert, UnorderedList, OrderedList. The go-to component library for Ink. |
| `pastel` | Next.js-like framework for CLIs built with Ink (2.4k stars) - file-based routing, automatic help generation |
| `giggles` | Batteries-included React framework for rich terminal apps |
| `fullscreen-ink` | Create fullscreen command line apps with Ink |

> **Prefer `@inkjs/ui` over individual packages** when possible - it bundles the most common components with consistent styling and is actively maintained by the Ink creator.

---

## All Community Components

### Input Components

| Package | Description |
|---|---|
| `ink-text-input` | Text input with placeholder, masking, cursor (detailed above) |
| `ink-select-input` | Single-select dropdown with arrow/j/k navigation (detailed above) |
| `ink-multi-select` | Multi-select checkbox input |
| `ink-confirm-input` | Yes/No confirmation prompt |
| `ink-password-input` | Password input with masking (archived - use ink-text-input mask prop) |
| `ink-autocomplete` | Autocomplete/typeahead input (82 stars) |
| `ink-quicksearch` | Quicksearch input with fuzzy filtering |
| `ink-search-select` | Incremental search and select |
| `ink-form` | Complex multi-field user-friendly forms (51 stars) |
| `ink-checkbox-list` | Checkbox list component |
| `ink-filter-list` | Pick or search items from a filterable list |

### Display & Text Components

| Package | Description |
|---|---|
| `ink-big-text` | Large ASCII art text banners via cfonts (detailed above) |
| `ink-gradient` | Rainbow/custom gradient colors on text (detailed above) |
| `ink-link` | Clickable terminal hyperlinks with fallback (detailed above) |
| `ink-box` | Styled box/border containers (114 stars) |
| `ink-text-animation` | Text animation with color effects (68 stars) |
| `ink-markdown` | Render markdown in the terminal (55 stars) |
| `ink-ascii` | ASCII art rendering component (31 stars) |
| `ink-color-pipe` | Pipe-syntax color styling (e.g., `blue.underline`) |
| `ink-highlight` | Highlight/search-match component |
| `ink-syntax-highlight` | Syntax highlighting for code in the terminal |

### Table & List Components

| Package | Description |
|---|---|
| `ink-table` | Table rendering with column alignment (224 stars) |
| `ink-task-list` | Task runner with status indicators (41 stars) |
| `ink-console` | Scrollable terminal log viewer (60 stars) |
| `ink-list-paginator` | List pagination component |

### Layout & Navigation Components

| Package | Description |
|---|---|
| `ink-divider` | Horizontal divider/separator (44 stars) |
| `ink-tab` | Tabbed interface component (105 stars) |
| `ink-scrollbar` | Scrollbar component (43 stars) |
| `ink-command-router` | Simple command routing for multi-view CLIs |

### Feedback & Status Components

| Package | Description |
|---|---|
| `ink-spinner` | Animated loading spinner with 90+ styles (detailed above) |
| `ink-progress-bar` | Progress bar component (50 stars) |

### Media Components

| Package | Description |
|---|---|
| `ink-image` | Render images in the terminal (83 stars) |
| `ink-picture` | Better image rendering component (33 stars) |
| `ink-chart` | Chart/graph visualizations |
| `ink-playing-cards` | Terminal-based card game framework |

### Interaction Components

| Package | Description |
|---|---|
| `ink-mouse` | Click, hover, drag and scroll events (23 stars) |
| `ink-blit` | Hooks and components for building CLI games |

> The Ink ecosystem has 50+ community packages on npm. Search `ink-` on npm to discover more.
