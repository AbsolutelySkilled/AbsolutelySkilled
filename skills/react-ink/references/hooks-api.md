<!-- Part of the react-ink AbsolutelySkilled skill. Load this file when
     working with Ink hooks for input, focus, streams, or app lifecycle. -->

# Hooks API Reference

## `useInput(handler, options?)`

Captures keyboard input from stdin.

```tsx
useInput((input, key) => {
  if (input === 'q') exit();
  if (key.return) submit();
  if (key.upArrow) moveUp();
});
```

**Parameters:**
- `handler: (input: string, key: KeyObject) => void`
- `options.isActive: boolean` - enable/disable (default: true)

**Key object properties:**

| Property | Type | Description |
|---|---|---|
| `upArrow` | `boolean` | Up arrow pressed |
| `downArrow` | `boolean` | Down arrow pressed |
| `leftArrow` | `boolean` | Left arrow pressed |
| `rightArrow` | `boolean` | Right arrow pressed |
| `return` | `boolean` | Enter/Return pressed |
| `escape` | `boolean` | Escape pressed |
| `ctrl` | `boolean` | Ctrl held |
| `shift` | `boolean` | Shift held |
| `tab` | `boolean` | Tab pressed |
| `backspace` | `boolean` | Backspace pressed |
| `delete` | `boolean` | Delete pressed |
| `pageDown` | `boolean` | Page Down pressed |
| `pageUp` | `boolean` | Page Up pressed |
| `home` | `boolean` | Home pressed |
| `end` | `boolean` | End pressed |
| `meta` | `boolean` | Meta key held |

---

## `usePaste(handler, options?)`

Handles pasted text from clipboard.

```tsx
usePaste((text) => {
  setInput(prev => prev + text);
});
```

**Parameters:**
- `handler: (text: string) => void`
- `options.isActive: boolean` - enable/disable (default: true)

---

## `useApp()`

App lifecycle control.

```tsx
const {exit, waitUntilRenderFlush} = useApp();

// Exit with success
exit();

// Exit with error
exit(new Error('Something failed'));

// Wait for render to complete
await waitUntilRenderFlush();
```

**Returns:**
| Method | Description |
|---|---|
| `exit(errorOrResult?)` | Terminate the app. Pass Error for failure, anything else for success |
| `waitUntilRenderFlush()` | Promise resolving after next render flush |

---

## `useStdin()`

Access to stdin stream and raw mode.

```tsx
const {stdin, isRawModeSupported, setRawMode} = useStdin();

if (isRawModeSupported) {
  setRawMode(true);
}
```

**Returns:**
| Property/Method | Type | Description |
|---|---|---|
| `stdin` | `ReadableStream` | The stdin stream |
| `isRawModeSupported` | `boolean` | Whether raw mode is available |
| `setRawMode(flag)` | `function` | Enable/disable raw mode |

> Always check `isRawModeSupported` before calling `setRawMode`. In CI or piped environments, raw mode is unavailable.

---

## `useStdout()`

Access to stdout stream.

```tsx
const {stdout, write} = useStdout();
write('Direct output to stdout\n');
```

**Returns:**
| Property/Method | Type | Description |
|---|---|---|
| `stdout` | `WritableStream` | The stdout stream |
| `write(data)` | `function` | Write string directly to stdout |

---

## `useStderr()`

Access to stderr stream.

```tsx
const {stderr, write} = useStderr();
write('Debug: processing step 3\n');
```

**Returns:**
| Property/Method | Type | Description |
|---|---|---|
| `stderr` | `WritableStream` | The stderr stream |
| `write(data)` | `function` | Write string directly to stderr |

---

## `useWindowSize()`

Terminal dimensions with automatic resize handling.

```tsx
const {columns, rows} = useWindowSize();
```

**Returns:**
| Property | Type | Description |
|---|---|---|
| `columns` | `number` | Terminal width in characters |
| `rows` | `number` | Terminal height in lines |

> Values update automatically when the terminal is resized.

---

## `useFocus(options?)`

Makes a component focusable via Tab/Shift+Tab navigation.

```tsx
function Item({label}: {label: string}) {
  const {isFocused} = useFocus();
  return <Text color={isFocused ? 'green' : undefined}>{label}</Text>;
}
```

**Options:**
| Option | Type | Description |
|---|---|---|
| `autoFocus` | `boolean` | Auto-focus when component mounts |
| `isActive` | `boolean` | Enable/disable focus capability |
| `id` | `string` | Unique ID for programmatic focus targeting |

**Returns:**
| Property | Type | Description |
|---|---|---|
| `isFocused` | `boolean` | Whether this component currently has focus |

---

## `useFocusManager()`

Control focus programmatically across all focusable components.

```tsx
const {focusNext, focusPrevious, focus, enableFocus, disableFocus, activeId} = useFocusManager();

// Focus a specific component by ID
focus('search-input');

// Cycle focus
focusNext();
focusPrevious();
```

**Returns:**
| Method/Property | Type | Description |
|---|---|---|
| `enableFocus()` | `function` | Enable the focus system |
| `disableFocus()` | `function` | Disable the focus system |
| `focusNext()` | `function` | Move focus to next component |
| `focusPrevious()` | `function` | Move focus to previous component |
| `focus(id)` | `function` | Focus a specific component by its ID |
| `activeId` | `string \| null` | ID of the currently focused component |

---

## `useBoxMetrics(ref)`

Get layout measurements for a Box element.

```tsx
import {useRef} from 'react';
import {Box, useBoxMetrics} from 'ink';

function Measured() {
  const ref = useRef(null);
  const {width, height, left, top, hasMeasured} = useBoxMetrics(ref);

  return (
    <Box ref={ref}>
      <Text>{hasMeasured ? `${width}x${height} at (${left},${top})` : 'Measuring...'}</Text>
    </Box>
  );
}
```

**Returns:**
| Property | Type | Description |
|---|---|---|
| `width` | `number` | Element width |
| `height` | `number` | Element height |
| `left` | `number` | Left offset |
| `top` | `number` | Top offset |
| `hasMeasured` | `boolean` | Whether measurement is complete |

---

## `useCursor(visible?)`

Cursor positioning for IME (Input Method Editor) support and wide characters.

```tsx
const {setCursorPosition} = useCursor();

// Position cursor at column 5, row 0
setCursorPosition({x: 5, y: 0});

// Hide cursor
setCursorPosition(undefined);
```

---

## `useIsScreenReaderEnabled()`

Detect if a screen reader is active.

```tsx
const isScreenReaderEnabled = useIsScreenReaderEnabled();
```

Enable screen reader mode when rendering: `render(<App />, {isScreenReaderEnabled: true})`.

---

## `render(tree, options?)`

Mount and render a React component tree to the terminal.

```tsx
const instance = render(<App />, {
  exitOnCtrlC: true,
  patchConsole: false,
});
await instance.waitUntilExit();
```

**Key options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `stdout` | `Stream` | `process.stdout` | Output stream |
| `stdin` | `Stream` | `process.stdin` | Input stream |
| `stderr` | `Stream` | `process.stderr` | Error stream |
| `exitOnCtrlC` | `boolean` | `true` | Exit on Ctrl+C |
| `patchConsole` | `boolean` | `false` | Redirect console.log to Ink |
| `debug` | `boolean` | `false` | Enable debug mode |
| `alternateScreen` | `boolean` | `false` | Use alternate terminal buffer |
| `concurrent` | `boolean` | `false` | Enable concurrent rendering |
| `incrementalRendering` | `boolean` | `false` | Render incrementally for perf |
| `kittyKeyboard` | `boolean` | `false` | Enhanced key reporting |

**Instance methods:**

| Method | Description |
|---|---|
| `rerender(tree)` | Update the component tree |
| `unmount()` | Unmount and clean up |
| `waitUntilExit()` | Promise that resolves on exit |
| `clear()` | Clear terminal output |
| `cleanup()` | Clean up resources |
