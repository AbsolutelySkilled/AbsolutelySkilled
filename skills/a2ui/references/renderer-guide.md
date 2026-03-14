<!-- Part of the A2UI AbsolutelySkilled skill. Load this file when
     building a custom A2UI renderer or working with @a2ui/web-lib. -->

# Renderer Development Guide

## Available renderers

| Renderer | Platform | v0.8 | v0.9 | Package |
|----------|----------|------|------|---------|
| Lit | Web | Yes | Yes | `@a2ui/web-lib` + Lit |
| React | Web | Yes | No | `@a2ui/react` |
| Angular | Web | Yes | Yes | `@a2ui/angular` |
| Flutter (GenUI SDK) | Mobile/Desktop/Web | Yes | Yes | `flutter_genui` |
| SwiftUI | iOS/macOS | - | - | Planned Q2 2026 |
| Jetpack Compose | Android | - | - | Planned Q2 2026 |

All web renderers share `@a2ui/web-lib` (`web_core`) as their foundation.

## web_core modules

| Module | Import | Purpose |
|--------|--------|---------|
| MessageProcessor | `@a2ui/web_core/data/model-processor` | JSONL stream processing, message dispatch |
| v0.9 MessageProcessor | `@a2ui/web_core/v0_9` | v0.9-specific processing |
| SurfaceModel | `@a2ui/web_core/v0_9` | Surface state management |
| SurfaceGroupModel | `@a2ui/web_core/v0_9` | Multi-surface coordination |
| DataModel / DataContext | `@a2ui/web_core/data/*` | Data binding resolution, path lookups |
| ComponentModel | `@a2ui/web_core/data/*` | Component tree state, adjacency list resolution |
| Types | `@a2ui/web_core/types/types` | TypeScript type definitions |
| Primitives | `@a2ui/web_core/types/primitives` | Primitive type helpers |
| Styles | `@a2ui/web_core/styles/index` | Style resolution utilities |
| Expression parser | `@a2ui/web_core/v0_9` | Client-side function evaluation (v0.9 only) |

## Key imports

```typescript
import type * as Types from '@a2ui/web_core/types/types';
import type * as Primitives from '@a2ui/web_core/types/primitives';
import { A2uiMessageProcessor } from '@a2ui/web_core/data/model-processor';
import { MessageProcessor, SurfaceModel } from '@a2ui/web_core/v0_9';
import * as Styles from '@a2ui/web_core/styles/index';
```

## Implementation checklist

### Message processing and state

- [ ] Surface management keyed by `surfaceId` - handle multiple surfaces independently
- [ ] Component buffering as `Map<string, Component>` per surface, store by `id`
- [ ] Resolve component references via container properties (children, child, entryPoint)
- [ ] Separate data model store per surface
- [ ] Handle adjacency list `contents` format for v0.8 data model

### Rendering logic

- [ ] Buffer all `surfaceUpdate`/`dataModelUpdate` messages, wait for `beginRendering` before initial render (v0.8)
- [ ] For v0.9, render on `createSurface` receipt
- [ ] Start render from specified `root` component ID (v0.8) or first component (v0.9)
- [ ] **Data binding resolution order**: Check `literal*` values first, then resolve `path` references
- [ ] Support relative binding in dynamic list templates (paths scoped to array item)
- [ ] **Dynamic lists**: Resolve `template.dataBinding` path, iterate data items, render `template.componentId` for each

### Client-to-server communication

- [ ] Construct `userAction` payload on user interaction
- [ ] Resolve `action.context` bindings at interaction time (not at render time)
- [ ] Include `a2uiClientCapabilities` with `supportedCatalogIds` in every outgoing A2A message metadata
- [ ] Send `error` messages for failed data binding or unknown component types

### Component mapping

Map A2UI component types to native framework widgets:

```typescript
// Example component registry
const componentMap: Record<string, ComponentRenderer> = {
  'Text': renderText,
  'Button': renderButton,
  'TextField': renderTextField,
  'Card': renderCard,
  'Row': renderRow,
  'Column': renderColumn,
  'List': renderList,
  'Image': renderImage,
  'CheckBox': renderCheckBox,
  'DateTimeInput': renderDateTimeInput,
  'Slider': renderSlider,
  'Modal': renderModal,
  'Tabs': renderTabs,
  'Icon': renderIcon,
  'Divider': renderDivider,
  'Video': renderVideo,
  'MultipleChoice': renderMultipleChoice,
};

function renderComponent(model: ComponentModel): FrameworkElement {
  const renderer = componentMap[model.type];
  if (!renderer) {
    console.warn(`Unknown component type: ${model.type}`);
    return renderFallback(model);
  }
  return renderer(model);
}
```

### Custom component registration

Extend the renderer with application-specific components:

```typescript
// Register custom component
componentMap['StockTicker'] = (model: ComponentModel) => {
  const symbol = resolveBinding(model.properties.symbol);
  const interval = model.properties.refreshInterval ?? 5000;
  return createStockTickerWidget(symbol, interval);
};
```

Safety rules for custom components:
- Only register trusted, reviewed components
- Validate all properties before use
- Process user input through sanitization
- Restrict API access from custom component code
