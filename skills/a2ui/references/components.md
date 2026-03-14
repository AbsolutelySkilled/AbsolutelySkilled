<!-- Part of the A2UI AbsolutelySkilled skill. Load this file when
     working with A2UI component types and their properties. -->

# A2UI Component Reference

## Component categories

### Layout components

**Row** - Horizontal layout container.

| Property | Type | Description |
|----------|------|-------------|
| `children` | string[] | List of child component IDs |
| `justify` | string | Horizontal distribution: `start`, `center`, `end`, `spaceBetween`, `spaceAround` |
| `align` | string | Vertical alignment: `start`, `center`, `end`, `stretch` |

**Column** - Vertical layout container. Same properties as Row but axes are swapped.

**List** - Renders a collection of items. Supports static children or dynamic templates.

| Property | Type | Description |
|----------|------|-------------|
| `children` | string[] | Static child component IDs |
| `direction` | string | `vertical` or `horizontal` |
| `template` | object | Dynamic rendering: `{dataBinding: "/path", componentId: "template-id"}` |

### Display components

**Text** - Renders text content.

| Property | Type | v0.8 | v0.9 |
|----------|------|------|------|
| `text` | string/binding | `{literalString: "..."}` or `{path: "/..."}` | `"string"` or `{path: "/..."}` |
| Style hint | string | `usageHint`: `h1`-`h5`, `body`, `caption` | `variant`: `h1`-`h5`, `body`, `caption` |

**Image** - Displays an image.

| Property | Type | Description |
|----------|------|-------------|
| `src` | string/binding | Image URL |
| `alt` | string | Accessibility text |
| `fit` | string | `cover` or `contain` |

**Icon** - Renders a named icon from the catalog's icon set.

**Divider** - Visual separator.

| Property | Type | Description |
|----------|------|-------------|
| `axis` | string | `horizontal` or `vertical` |

**Video** - Embeds video content with a source URL.

### Interactive components

**Button** - Clickable action trigger.

| Property | Type | v0.8 | v0.9 |
|----------|------|------|------|
| `child` | string | Child component ID for label | Same |
| Style | string | `primary` flag | `variant`: `primary` |
| Action | object | `{name: "event_name"}` | `{event: {name: "...", context: {...}}}` |
| `checks` | array | N/A | Validation conditions (v0.9 only) |

**TextField** - Text input with bidirectional data binding.

| Property | Type | Description |
|----------|------|-------------|
| `value` | binding | `{path: "/data/field"}` - reads and writes to data model |
| `label` | string/binding | Input label text |
| `textFieldType` | string | `text`, `email`, `password`, `number`, `tel`, `url` |

**CheckBox** - Boolean toggle with bidirectional binding.

| Property | Type | Description |
|----------|------|-------------|
| `value` | binding | Path to boolean in data model |
| `label` | string/binding | Checkbox label |

**Slider** - Numeric range input.

| Property | Type | Description |
|----------|------|-------------|
| `value` | binding | Path to numeric value |
| `min` | number | Minimum value |
| `max` | number | Maximum value |
| `step` | number | Step increment |

**DateTimeInput** - Date and/or time picker.

| Property | Type | Description |
|----------|------|-------------|
| `value` | binding | Path to date/time string |
| `label` | string/binding | Input label |
| `enableDate` | boolean | Show date picker |
| `enableTime` | boolean | Show time picker |

**MultipleChoice / ChoicePicker** - Selection from options.

| Property | Type | Description |
|----------|------|-------------|
| `value` | binding | Path to selected value(s) |
| `options` | array | Available choices |

### Container components

**Card** - Visual grouping container with optional elevation/border.

| Property | Type | Description |
|----------|------|-------------|
| `children` | string[] | Child component IDs |

**Modal** - Overlay dialog triggered by an entry point component.

| Property | Type | Description |
|----------|------|-------------|
| `entryPoint` | string | Component ID that opens the modal |
| `content` | string | Component ID rendered inside the modal |

**Tabs** - Tabbed navigation container.

| Property | Type | Description |
|----------|------|-------------|
| `tabItems` | array | Tab definitions with labels and content component IDs |

## Common properties (all components)

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | **Required**. Unique identifier |
| `component` | string | **Required** (v0.9). Component type name |
| `accessibility` | object | Accessibility metadata (label, role) |
| `weight` | number | Flex weight for layout distribution |

## v0.8 vs v0.9 syntax comparison

**v0.8 component:**
```json
{"id": "title", "component": {"Text": {"text": {"literalString": "Hello"}, "usageHint": "h1"}}}
```

**v0.9 component:**
```json
{"id": "title", "component": "Text", "text": "Hello", "variant": "h1"}
```

**v0.8 children:**
```json
{"children": {"explicitList": ["child-1", "child-2"]}}
```

**v0.9 children:**
```json
{"children": ["child-1", "child-2"]}
```
