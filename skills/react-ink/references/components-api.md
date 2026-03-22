<!-- Part of the react-ink AbsolutelySkilled skill. Load this file when
     working with Ink component props and layout. -->

# Components API Reference

## `<Text>`

Renders styled text. Only text nodes and nested `<Text>` allowed as children.

### Style props

| Prop | Type | Description |
|---|---|---|
| `color` | `string` | Text color - named (`red`, `green`), hex (`#FF8800`), or RGB |
| `backgroundColor` | `string` | Background color - same format as color |
| `bold` | `boolean` | Bold text |
| `italic` | `boolean` | Italic text |
| `underline` | `boolean` | Underlined text |
| `strikethrough` | `boolean` | Strikethrough text |
| `inverse` | `boolean` | Swap foreground/background colors |
| `dimColor` | `boolean` | Reduce text brightness |
| `wrap` | `string` | `'wrap'` \| `'truncate'` \| `'truncate-start'` \| `'truncate-middle'` \| `'truncate-end'` |

### Accessibility props

| Prop | Type | Description |
|---|---|---|
| `aria-label` | `string` | Screen reader label |
| `aria-hidden` | `boolean` | Hide from screen readers |
| `aria-role` | `string` | `'button'` \| `'checkbox'` \| `'radio'` \| `'list'` \| `'menu'` \| `'progressbar'` \| `'tab'` |
| `aria-state` | `object` | `{ checked, disabled, expanded, selected }` |

---

## `<Box>`

Flexbox container (equivalent to `display: flex`). Accepts all props below plus the same accessibility props as Text.

### Dimension props

| Prop | Type | Description |
|---|---|---|
| `width` | `number \| string` | Fixed width or percentage (`'50%'`) |
| `height` | `number \| string` | Fixed height or percentage |
| `minWidth` | `number` | Minimum width |
| `minHeight` | `number` | Minimum height |
| `maxWidth` | `number` | Maximum width |
| `maxHeight` | `number` | Maximum height |
| `aspectRatio` | `number` | Width/height ratio |

### Spacing props

| Prop | Type | Description |
|---|---|---|
| `padding` | `number` | All sides |
| `paddingTop` | `number` | Top only |
| `paddingBottom` | `number` | Bottom only |
| `paddingLeft` | `number` | Left only |
| `paddingRight` | `number` | Right only |
| `paddingX` | `number` | Left + Right |
| `paddingY` | `number` | Top + Bottom |
| `margin` | `number` | All sides |
| `marginTop` | `number` | Top only |
| `marginBottom` | `number` | Bottom only |
| `marginLeft` | `number` | Left only |
| `marginRight` | `number` | Right only |
| `marginX` | `number` | Left + Right |
| `marginY` | `number` | Top + Bottom |
| `gap` | `number` | Gap between children |
| `columnGap` | `number` | Horizontal gap |
| `rowGap` | `number` | Vertical gap |

### Flex props

| Prop | Type | Description |
|---|---|---|
| `flexDirection` | `string` | `'row'` \| `'column'` \| `'row-reverse'` \| `'column-reverse'` |
| `flexWrap` | `string` | `'wrap'` \| `'nowrap'` \| `'wrap-reverse'` |
| `flexGrow` | `number` | Grow factor |
| `flexShrink` | `number` | Shrink factor |
| `flexBasis` | `number \| string` | Initial size |
| `alignItems` | `string` | `'flex-start'` \| `'center'` \| `'flex-end'` \| `'stretch'` |
| `alignSelf` | `string` | Override parent alignItems |
| `alignContent` | `string` | Multi-line alignment |
| `justifyContent` | `string` | `'flex-start'` \| `'center'` \| `'flex-end'` \| `'space-between'` \| `'space-around'` \| `'space-evenly'` |

### Position props

| Prop | Type | Description |
|---|---|---|
| `position` | `string` | `'relative'` \| `'absolute'` \| `'static'` |
| `top` | `number` | Top offset (with absolute) |
| `right` | `number` | Right offset |
| `bottom` | `number` | Bottom offset |
| `left` | `number` | Left offset |

### Display & overflow

| Prop | Type | Description |
|---|---|---|
| `display` | `string` | `'flex'` \| `'none'` |
| `overflow` | `string` | `'visible'` \| `'hidden'` \| `'scroll'` |
| `overflowX` | `string` | Horizontal overflow |
| `overflowY` | `string` | Vertical overflow |

### Border props

| Prop | Type | Description |
|---|---|---|
| `borderStyle` | `string` | `'solid'` \| `'double'` \| `'round'` \| `'bold'` \| `'dashed'` \| `'dotted'` \| `'hidden'` |
| `borderColor` | `string` | Border color (all sides) |
| `borderColorTop` | `string` | Top border color |
| `borderColorBottom` | `string` | Bottom border color |
| `borderColorLeft` | `string` | Left border color |
| `borderColorRight` | `string` | Right border color |
| `borderTop` | `boolean` | Show top border |
| `borderRight` | `boolean` | Show right border |
| `borderBottom` | `boolean` | Show bottom border |
| `borderLeft` | `boolean` | Show left border |
| `borderDimColor` | `boolean` | Dim all border colors |

---

## `<Newline>`

Inserts one or more line breaks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `1` | Number of line breaks |

---

## `<Spacer>`

Flexible empty space that expands along the flex axis. Equivalent to `<Box flexGrow={1} />`. Use to push elements apart:

```tsx
<Box>
  <Text>Left</Text>
  <Spacer />
  <Text>Right</Text>
</Box>
```

---

## `<Static>`

Renders items permanently above the dynamic re-rendering area. Items rendered by Static are never cleared.

| Prop | Type | Description |
|---|---|---|
| `items` | `T[]` | Array of items to render |
| `style` | `object` | Style props for the container |
| `children` | `(item: T, index: number) => ReactNode` | Render function |

```tsx
<Static items={completedTests}>
  {(test, i) => <Text key={i} color="green">✓ {test.name}</Text>}
</Static>
```

> Items in Static must have stable keys. Once rendered, they cannot be updated.

---

## `<Transform>`

Transforms the string representation of child components before rendering.

| Prop | Type | Description |
|---|---|---|
| `transform` | `(output: string, lineIndex: number) => string` | Transform function applied to each line |

```tsx
<Transform transform={(output) => output.toUpperCase()}>
  <Text>hello world</Text>
</Transform>
// Renders: HELLO WORLD
```
