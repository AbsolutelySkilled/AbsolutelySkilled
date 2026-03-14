# Browser Automation

cmux can open browser surfaces alongside terminals and control them via CLI.

## Open a browser surface

```bash
# Open browser split in caller's workspace
cmux browser open "https://example.com"

# Open as a split (explicit)
cmux browser open-split "https://example.com"

# Open browser in a specific pane
cmux --json new-surface --type browser --pane pane:5 --url "https://example.com"

# Open browser in a new pane (split)
cmux --json new-pane --type browser --direction right --url "https://example.com"
```

## Navigation

```bash
# Navigate to URL
cmux browser navigate "https://example.com" --snapshot-after

# Back, forward, reload
cmux browser back --snapshot-after
cmux browser forward --snapshot-after
cmux browser reload --snapshot-after

# Get current URL
cmux browser url
# or
cmux browser get url
```

Use `--snapshot-after` to get an accessibility snapshot of the page after the action.

## Page snapshots (accessibility tree)

```bash
# Default snapshot
cmux browser snapshot

# Interactive snapshot (includes clickable refs)
cmux browser snapshot --interactive

# Compact output
cmux browser snapshot --compact

# Snapshot a specific CSS selector
cmux browser snapshot --selector "#main-content"

# Limit depth
cmux browser snapshot --max-depth 3
```

The snapshot returns an accessibility tree representation - ideal for AI agents
to understand page structure without screenshots.

## Interactions

### Click, hover, focus

```bash
cmux browser click "button.submit" --snapshot-after
cmux browser dblclick "#item" --snapshot-after
cmux browser hover ".menu-trigger" --snapshot-after
cmux browser focus "#search-input" --snapshot-after
```

### Type and fill

```bash
# Type into a focused element (simulates keystrokes)
cmux browser type "#search" "hello world" --snapshot-after

# Fill a field (sets value directly, faster)
cmux browser fill "#email" "user@example.com" --snapshot-after

# Clear a field
cmux browser fill "#email" "" --snapshot-after
```

### Keyboard

```bash
cmux browser press Enter --snapshot-after
cmux browser press "Control+a" --snapshot-after
cmux browser keydown Shift
cmux browser keyup Shift
```

### Select dropdowns

```bash
cmux browser select "#country" "US" --snapshot-after
```

### Checkboxes

```bash
cmux browser check "#agree-terms" --snapshot-after
cmux browser uncheck "#newsletter" --snapshot-after
```

### Scroll

```bash
# Scroll page down by 500px
cmux browser scroll --dy 500 --snapshot-after

# Scroll a specific element
cmux browser scroll --selector ".content" --dy 300 --snapshot-after
```

## Wait for conditions

```bash
# Wait for element to appear
cmux browser wait --selector "#loaded"

# Wait for text on page
cmux browser wait --text "Success"

# Wait for URL change
cmux browser wait --url-contains "/dashboard"

# Wait for page load
cmux browser wait --load-state complete

# Custom JS condition
cmux browser wait --function "() => document.querySelectorAll('.item').length > 5"

# With timeout
cmux browser wait --selector "#loaded" --timeout-ms 10000
```

## Get page data

```bash
cmux browser get title
cmux browser get text                    # full page text
cmux browser get html                    # full page HTML
cmux browser get value "#input-field"    # input value
cmux browser get attr "#link" href       # element attribute
cmux browser get count ".items"          # count matching elements
cmux browser get box "#element"          # bounding box
cmux browser get styles "#element"       # computed styles
```

## Evaluate JavaScript

```bash
cmux browser eval "document.title"
cmux browser eval "document.querySelectorAll('.item').length"
cmux browser eval "window.scrollTo(0, document.body.scrollHeight)"
```

## Find elements (Playwright-style locators)

```bash
cmux browser find role button
cmux browser find text "Submit"
cmux browser find label "Email"
cmux browser find placeholder "Search..."
cmux browser find testid "submit-btn"
cmux browser find first ".item"
cmux browser find last ".item"
cmux browser find nth ".item" 3
```

## Element state checks

```bash
cmux browser is visible "#modal"
cmux browser is enabled "#submit-btn"
cmux browser is checked "#checkbox"
```

## Tabs

```bash
cmux browser tab list
cmux browser tab new "https://example.com"
cmux browser tab switch 1
cmux browser tab close 2
```

## Console and errors

```bash
cmux browser console list
cmux browser console clear
cmux browser errors list
cmux browser errors clear
```

## Cookies and storage

```bash
cmux browser cookies get
cmux browser cookies set '{"name":"token","value":"abc123"}'
cmux browser cookies clear

cmux browser storage local get "myKey"
cmux browser storage local set "myKey" "myValue"
cmux browser storage session clear
```

## Advanced

```bash
# Set viewport size
cmux browser viewport 1280 720

# Handle dialogs (alert, confirm, prompt)
cmux browser dialog accept
cmux browser dialog dismiss "cancel text"

# Highlight an element (visual debugging)
cmux browser highlight ".target-element"

# Save/load browser state
cmux browser state save /tmp/browser-state.json
cmux browser state load /tmp/browser-state.json

# Add custom script or styles
cmux browser addscript "console.log('injected')"
cmux browser addstyle "body { background: red; }"

# Identify which surface the browser is in
cmux browser identify --surface surface:42
```
