<!-- Part of the react-native AbsolutelySkilled skill. Load this file when
     working with React Navigation, Expo Router, deep linking, or navigation patterns. -->

# Navigation Reference

## Expo Router vs React Navigation

**Expo Router** (recommended for new projects): File-based routing built on React Navigation. The file system defines your routes. Automatic deep linking, type safety, and web support.

**React Navigation** (direct usage): Imperative navigation configuration. Use when you need patterns Expo Router does not yet support, or in non-Expo React Native projects.

Both share the same underlying navigation primitives - stacks, tabs, drawers. Expo Router is a convenience layer, not a replacement.

## Expo Router Patterns

### File structure = route structure

```
app/
  _layout.tsx         -> Root layout (wraps all routes)
  index.tsx           -> / (home screen)
  about.tsx           -> /about
  settings/
    _layout.tsx       -> Layout for /settings/*
    index.tsx         -> /settings
    profile.tsx       -> /settings/profile
  details/
    [id].tsx          -> /details/:id (dynamic segment)
  blog/
    [...slug].tsx     -> /blog/* (catch-all route)
  (auth)/
    _layout.tsx       -> Group layout (no URL segment added)
    login.tsx         -> /login
    register.tsx      -> /register
  +not-found.tsx      -> 404 handler
```

### Navigation actions

```typescript
import { router, Link, useRouter } from 'expo-router';

// Imperative navigation
router.push('/details/123');       // Push onto stack
router.replace('/home');           // Replace current screen
router.back();                     // Go back
router.navigate('/settings');      // Navigate (reuses existing screen if present)

// Declarative navigation
<Link href="/details/123">View Details</Link>
<Link href="/details/123" asChild>
  <Pressable><Text>View Details</Text></Pressable>
</Link>
```

### Typed routes

```typescript
// Enable typed routes in app.json
{ "experiments": { "typedRoutes": true } }

// Then get autocomplete and type checking
router.push('/details/123');  // TypeScript validates this path exists
```

### Layout navigators

```typescript
// Stack layout
import { Stack } from 'expo-router';
export default function Layout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#f5f5f5' } }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="details/[id]" options={{ title: 'Details' }} />
    </Stack>
  );
}

// Tab layout
import { Tabs } from 'expo-router';
export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Feed' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
    </Tabs>
  );
}

// Drawer layout
import { Drawer } from 'expo-router/drawer';
export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ drawerLabel: 'Home' }} />
    </Drawer>
  );
}
```

### Route groups

Groups organize routes without affecting the URL structure. Use parentheses for group names.

```
app/
  (tabs)/
    _layout.tsx       -> Tab navigator
    home.tsx          -> /home (not /(tabs)/home)
    profile.tsx       -> /profile
  (auth)/
    _layout.tsx       -> Stack navigator for auth flow
    login.tsx         -> /login
    register.tsx      -> /register
```

## Authentication Flow Pattern

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

// app/(tabs)/_layout.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

## Deep Linking

### Expo Router (automatic)

Deep linking works out of the box. The file path IS the URL:
- `app/details/[id].tsx` handles `myapp://details/123` and `https://myapp.com/details/123`

Configure the URL scheme in `app.config.ts`:

```typescript
{
  scheme: 'myapp',
  ios: { associatedDomains: ['applinks:myapp.com'] },
  android: {
    intentFilters: [{
      action: 'VIEW',
      autoVerify: true,
      data: [{ scheme: 'https', host: 'myapp.com', pathPrefix: '/' }],
    }],
  },
}
```

### React Navigation (manual)

```typescript
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: '',
      Details: 'details/:id',
      Settings: {
        screens: {
          Profile: 'settings/profile',
        },
      },
    },
  },
};

<NavigationContainer linking={linking}>
  {/* navigators */}
</NavigationContainer>
```

## Nested Navigation Patterns

### Tabs containing stacks

The most common pattern: each tab has its own navigation stack.

```typescript
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen name="home" />
  <Tabs.Screen name="profile" />
</Tabs>

// app/(tabs)/home/_layout.tsx
<Stack>
  <Stack.Screen name="index" />
  <Stack.Screen name="details/[id]" />
</Stack>
```

### Modal presentation

```typescript
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen
    name="modal"
    options={{ presentation: 'modal', headerShown: false }}
  />
</Stack>

// Navigate to modal from anywhere
router.push('/modal');
```

## Navigation State Persistence

Save and restore navigation state for development or user experience:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// In React Navigation (manual approach)
const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const [initialState, setInitialState] = useState();
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  AsyncStorage.getItem(PERSISTENCE_KEY).then((saved) => {
    if (saved) setInitialState(JSON.parse(saved));
    setIsReady(true);
  });
}, []);

<NavigationContainer
  initialState={initialState}
  onStateChange={(state) => AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))}
>
```

## Common Navigation Gotchas

- **Screen names must match file names** in Expo Router - a typo causes "No route" errors
- **Nested navigators reset** when switching tabs unless you configure `unmountOnBlur: false`
- **params are NOT reactive** - use `useLocalSearchParams` (re-renders on change) vs `useGlobalSearchParams` (stays current)
- **Header flickering** with nested stacks - set `headerShown: false` on parent when child has its own header
- **Back behavior on Android** - hardware back button follows stack history, not tab history. Customize with `BackHandler`
