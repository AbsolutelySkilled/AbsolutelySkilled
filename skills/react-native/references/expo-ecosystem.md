<!-- Part of the react-native AbsolutelySkilled skill. Load this file when
     working with Expo SDK, config plugins, prebuild, or EAS services. -->

# Expo Ecosystem Reference

## Managed vs Bare Workflow

**Managed workflow** (recommended): Use `app.json`/`app.config.ts` to configure native projects. Run `npx expo prebuild` to generate ios/ and android/ directories from config. Add native customizations through config plugins. EAS Build handles compilation in the cloud.

**Bare workflow**: Full access to ios/ and android/ directories. Use when you need custom native code that cannot be expressed through config plugins or Expo Modules. You still get Expo SDK modules, EAS services, and Expo Router - you just manage native projects yourself.

**Decision guide:**
- Start with managed. Always.
- Move to bare only when you hit a wall that config plugins cannot solve
- Common reasons to go bare: proprietary native SDKs with complex linking, custom app extensions (widgets, watch apps), or heavily modified native build configurations

## Expo Prebuild

Prebuild generates native projects from your `app.config.ts` and config plugins.

```bash
# Generate native projects
npx expo prebuild

# Clean regenerate (wipe ios/ and android/ first)
npx expo prebuild --clean

# Generate for one platform only
npx expo prebuild --platform ios
```

**Key principle:** Treat `ios/` and `android/` as generated artifacts. Do not manually edit them in managed workflow - use config plugins instead. Add `ios/` and `android/` to `.gitignore` in managed projects.

## Expo SDK Modules (commonly used)

| Module | Purpose | Install |
|---|---|---|
| `expo-camera` | Camera capture, barcode scanning | `npx expo install expo-camera` |
| `expo-notifications` | Push and local notifications | `npx expo install expo-notifications` |
| `expo-image-picker` | Photo/video selection from gallery | `npx expo install expo-image-picker` |
| `expo-file-system` | File read/write, downloads | `npx expo install expo-file-system` |
| `expo-secure-store` | Encrypted key-value storage | `npx expo install expo-secure-store` |
| `expo-location` | GPS, geofencing | `npx expo install expo-location` |
| `expo-av` | Audio and video playback | `npx expo install expo-av` |
| `expo-haptics` | Haptic feedback | `npx expo install expo-haptics` |
| `expo-image` | High-performance image component | `npx expo install expo-image` |
| `expo-splash-screen` | Splash screen control | `npx expo install expo-splash-screen` |
| `expo-updates` | OTA update client | `npx expo install expo-updates` |
| `expo-router` | File-based navigation | `npx expo install expo-router` |

Always install Expo modules with `npx expo install` (not `npm install`) to get the correct version for your SDK.

## Config Plugins

Config plugins modify native project files during prebuild. They are the primary mechanism for native customization in managed workflow.

### Built-in plugin API

```typescript
import {
  ConfigPlugin,
  withInfoPlist,        // Modify iOS Info.plist
  withEntitlementsPlist, // Modify iOS entitlements
  withAndroidManifest,  // Modify AndroidManifest.xml
  withAppDelegate,      // Modify AppDelegate
  withMainActivity,     // Modify MainActivity
  withProjectBuildGradle, // Modify project build.gradle
  withAppBuildGradle,   // Modify app build.gradle
  withPlugins,          // Compose multiple plugins
  withDangerousMod,     // Raw file system access (last resort)
} from 'expo/config-plugins';
```

### Plugin structure

```typescript
// plugins/withMyPlugin.ts
import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

interface PluginProps {
  apiKey: string;
}

const withMyPlugin: ConfigPlugin<PluginProps> = (config, { apiKey }) => {
  return withInfoPlist(config, (config) => {
    config.modResults.MY_API_KEY = apiKey;
    return config;
  });
};

export default withMyPlugin;
```

### Usage in app.config.ts

```typescript
export default {
  plugins: [
    ['./plugins/withMyPlugin', { apiKey: 'abc123' }],
    'expo-camera', // Expo modules are also config plugins
    ['expo-notifications', { icon: './assets/notification-icon.png' }],
  ],
};
```

### Plugin best practices

- Always check if a community plugin exists before writing your own
- Use typed mods (`withInfoPlist`, `withAndroidManifest`) over `withDangerousMod`
- Test plugins by running `npx expo prebuild --clean` and inspecting the generated native files
- Plugins run in order - later plugins can override earlier ones

## EAS Services

### EAS Build

Cloud build service. No local Xcode or Android Studio needed.

```bash
eas build --platform ios --profile development  # Dev client build
eas build --platform android --profile preview  # Internal distribution
eas build --platform all --profile production    # Store builds
```

### EAS Submit

Submit builds directly to App Store Connect and Google Play.

```bash
eas submit --platform ios --latest
eas submit --platform android --latest
```

### EAS Update

Over-the-air JS bundle updates. See `references/ota-updates.md` for details.

### EAS Metadata (Beta)

Manage app store metadata (screenshots, descriptions) as code.

```bash
eas metadata:pull   # Pull current metadata from stores
eas metadata:push   # Push metadata to stores
```

## Development Builds (Dev Client)

Custom development builds that include your native modules but with the Expo Go-like development experience.

```bash
# Create a dev client build
eas build --platform ios --profile development

# Start the dev server
npx expo start --dev-client
```

Use dev clients instead of Expo Go when:
- Your app uses custom native modules
- You need to test config plugin changes
- You are using libraries not included in Expo Go (e.g., `react-native-maps`, `@react-native-firebase`)

## Expo Image (expo-image)

High-performance replacement for React Native's `<Image>`. Supports:
- Automatic caching with configurable policies
- BlurHash and ThumbHash placeholders
- AVIF, WebP, animated GIF/WebP, SVG
- Content-fit modes (cover, contain, fill, scale-down)
- Recycling for list performance

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/photo.jpg' }}
  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
  contentFit="cover"
  transition={200}
  style={{ width: 300, height: 200 }}
/>
```

Always prefer `expo-image` over React Native's built-in `<Image>` for production apps.
