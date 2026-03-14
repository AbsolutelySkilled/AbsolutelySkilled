<!-- Part of the react-native AbsolutelySkilled skill. Load this file when
     working with React Native performance optimization, Hermes, profiling, or startup time. -->

# Performance Reference

## Hermes Engine

Hermes is the default JS engine for React Native (since RN 0.70). It compiles JavaScript to bytecode at build time, reducing startup time and memory usage.

### Key benefits
- **Bytecode precompilation**: No JIT needed at runtime - faster cold starts
- **Optimized garbage collector**: Generational GC reduces pause times
- **Lower memory footprint**: ~30-50% less memory than JSC for typical apps
- **Hermes bytecode (.hbc)**: Shipped in the app bundle instead of raw JS

### Verify Hermes is enabled

```typescript
const isHermes = () => !!(global as any).HermesInternal;
console.log('Hermes enabled:', isHermes());
```

### Hermes profiling

```bash
# Capture a Hermes CPU profile
npx react-native profile-hermes

# Or via Chrome DevTools
# Open chrome://inspect, connect to Hermes, use the Performance tab
```

## Startup Time Optimization

### Measurement

```typescript
// Measure TTI (Time to Interactive)
import { PerformanceObserver } from 'react-native-performance';

// Or simple timestamp approach
const appStartTime = global.__APP_START_TIME__; // Set in native code
const jsLoadTime = Date.now();

// In your root component
useEffect(() => {
  const tti = Date.now() - appStartTime;
  console.log(`TTI: ${tti}ms`);
}, []);
```

### Optimization checklist

1. **Enable Hermes** (default in modern RN - verify it is not disabled)
2. **Reduce JS bundle size**: Code split with `require()` calls, remove unused dependencies
3. **Defer non-critical initialization**: Load heavy modules lazily after first render
4. **Optimize splash screen**: Use `expo-splash-screen` to control when splash hides
5. **Preload critical data**: Start fetching API data in parallel with JS initialization
6. **Minimize synchronous storage reads**: Move `AsyncStorage.getItem` calls out of the render path
7. **Use RAM bundles on Android**: For very large apps, enables loading modules on demand

```typescript
// Lazy module loading
const HeavyChart = React.lazy(() => import('./components/HeavyChart'));

// With Suspense
<Suspense fallback={<ActivityIndicator />}>
  <HeavyChart data={chartData} />
</Suspense>
```

## FlatList Deep Optimization

### Critical props

| Prop | Default | Recommended | Why |
|---|---|---|---|
| `windowSize` | 21 | 5-11 | Reduces off-screen rendering. Lower = less memory, more blank flash |
| `maxToRenderPerBatch` | 10 | 10-20 | Items rendered per frame. Higher = less blank, more frame drops |
| `initialNumToRender` | 10 | 8-15 | Items in first render. Match visible area |
| `removeClippedSubviews` | false | true (Android) | Detaches off-screen views. Inconsistent on iOS |
| `getItemLayout` | none | provide always | Eliminates async measurement. Required for `scrollToIndex` |
| `keyExtractor` | none | provide always | Stable keys prevent unnecessary re-mounts |

### Advanced patterns

```typescript
// Use FlashList for large lists (drop-in FlatList replacement)
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={data}
  renderItem={renderItem}
  estimatedItemSize={80}  // Required - provide best estimate
  keyExtractor={keyExtractor}
/>
```

FlashList (by Shopify) uses cell recycling - it reuses view instances instead of creating/destroying them. For lists over 100 items, FlashList typically outperforms FlatList by 5-10x.

### Image optimization in lists

```typescript
// Use expo-image with recyclingKey for list performance
import { Image } from 'expo-image';

const renderItem = ({ item }) => (
  <Image
    source={{ uri: item.imageUrl }}
    recyclingKey={item.id}  // Enables view recycling
    placeholder={{ blurhash: item.blurhash }}
    contentFit="cover"
    transition={100}
    style={styles.thumbnail}
  />
);
```

## Re-render Prevention

### Diagnosis

1. **React DevTools Profiler**: Enable "Highlight updates when components render" to visualize re-renders
2. **why-did-you-render**: Library that logs unnecessary re-renders with reasons

```bash
npm install @welldone-software/why-did-you-render --save-dev
```

```typescript
// wdyr.ts (import at app entry before any other imports)
import React from 'react';
if (__DEV__) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, { trackAllPureComponents: true });
}
```

### Common causes and fixes

| Cause | Fix |
|---|---|
| New object/array created every render in props | `useMemo` for computed values |
| Inline function props | `useCallback` for functions passed to children |
| Context re-renders all consumers | Split contexts by update frequency, or use Zustand/Jotai |
| Parent re-render cascades | `React.memo` on expensive child components |
| Unstable `key` prop | Use stable IDs, never array index for dynamic lists |

### State management for performance

```typescript
// BAD: React Context re-renders ALL consumers on ANY state change
const AppContext = createContext({ user: null, theme: 'light', cart: [] });

// GOOD: Zustand with selectors - components only re-render for their slice
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  theme: 'light',
  cart: [],
  setTheme: (theme) => set({ theme }),
}));

// This component ONLY re-renders when theme changes
function ThemeToggle() {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  // ...
}
```

## Memory Profiling

### iOS
- Xcode Instruments > Allocations: Track memory growth over time
- Xcode Memory Graph Debugger: Find retain cycles and leaks

### Android
- Android Studio Profiler > Memory: Real-time heap tracking
- `adb shell dumpsys meminfo <package>`: Snapshot memory stats

### Common memory leaks in React Native

| Leak source | Fix |
|---|---|
| Event listeners not cleaned up | Always return cleanup function from `useEffect` |
| Timers (`setInterval`) not cleared | Clear in useEffect cleanup |
| Navigation listeners not removed | Use `navigation.addListener` return value for cleanup |
| Large images cached without limits | Set cache policies on `expo-image` |
| Closures capturing stale references | Use refs for mutable values in long-lived callbacks |

## Animation Performance

### Use the UI thread

```typescript
// react-native-reanimated runs animations on the UI thread
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function AnimatedBox() {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <Animated.View style={[styles.box, animatedStyle]}>
      <Pressable onPress={() => { offset.value = withSpring(offset.value + 50); }}>
        <Text>Move</Text>
      </Pressable>
    </Animated.View>
  );
}
```

### Animation rules
- Never use `Animated` from `react-native` for complex animations - use `react-native-reanimated`
- Avoid `useNativeDriver: false` - it runs animations on the JS thread
- Gesture handling: use `react-native-gesture-handler` for 60fps gesture-driven animations
- Avoid animating `width`/`height` - use `transform: scale` instead
- Use `layout` animations from reanimated for enter/exit transitions

## Bundle Size Analysis

```bash
# React Native CLI
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output bundle.js
npx source-map-explorer bundle.js

# Expo
npx expo export --platform ios
# Inspect the generated bundles in dist/
```

### Size reduction strategies
- Replace `moment` with `date-fns` or native `Intl`
- Replace `lodash` with individual imports or native methods
- Use `expo-image` instead of multiple image libraries
- Audit native dependencies - each adds to binary size on both platforms
- Enable ProGuard on Android and bitcode on iOS for release builds
