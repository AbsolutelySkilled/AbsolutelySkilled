<!-- Part of the react-native AbsolutelySkilled skill. Load this file when
     working with OTA updates, EAS Update, CodePush, or runtime versioning. -->

# OTA Updates Reference

## How OTA Updates Work

Over-the-air updates push new JavaScript bundles and assets to users without requiring an app store submission. The native binary stays the same - only the JS layer is replaced.

**What CAN be updated OTA:**
- JavaScript/TypeScript code
- Images and assets bundled via `require()`
- JSON configuration files

**What CANNOT be updated OTA:**
- Native code (Swift, Kotlin, Objective-C, Java)
- Native module additions or removals
- Changes to `app.json`/`app.config.ts` that affect native configuration
- New Expo SDK modules (they include native code)

## EAS Update

Expo's official OTA update service. Integrated with EAS Build.

### Setup

```bash
# Install the updates client
npx expo install expo-updates

# Configure EAS Update
eas update:configure

# This adds to app.json:
# "updates": { "url": "https://u.expo.dev/<project-id>" }
# "runtimeVersion": { "policy": "appVersion" }
```

### Publishing updates

```bash
# Update a specific branch
eas update --branch production --message "Fix login bug"

# Update with auto-generated message from git
eas update --branch production --auto

# Update only specific platforms
eas update --branch production --platform ios

# Preview what would be updated
eas update --branch preview --message "Test new feature"
```

### Branch and channel model

```
Channels (mapped to build profiles)     Branches (where updates live)
-----------------------------------     ----------------------------
production channel  ------>  production branch
preview channel     ------>  preview branch
development channel ------>  development branch
```

- A **channel** is embedded in the native build at compile time
- A **branch** is where updates are published
- Channels point to branches. You can remap them without rebuilding.

```bash
# Point production channel to a different branch (instant rollback)
eas channel:edit production --branch rollback-v1

# View current mappings
eas channel:list
```

### Runtime versioning

Runtime versions ensure JS updates are only applied to compatible native binaries.

| Policy | How it works | When to use |
|---|---|---|
| `appVersion` | Uses `version` from app.json | Simple apps with infrequent native changes |
| `nativeVersion` | Uses `ios.buildNumber` / `android.versionCode` | When you track native versions manually |
| `fingerprint` | Auto-hashes all native dependencies and config | Recommended - catches ALL native changes automatically |
| Custom string | You set `"runtimeVersion": "1.0.0"` manually | Full control, but error-prone |

```typescript
// app.config.ts - recommended setup
{
  runtimeVersion: {
    policy: 'fingerprint', // Auto-detects native code changes
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id',
    fallbackToCacheTimeout: 0, // Don't block app start
    checkAutomatically: 'ON_LOAD', // Check on every app open
  },
}
```

### Update lifecycle and behavior

```typescript
import * as Updates from 'expo-updates';

// Check for updates manually
async function checkForUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Restart to apply - prompt user first
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.log('Update check failed:', error);
  }
}

// Listen for automatic update events
Updates.addListener((event) => {
  if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
    // An update was downloaded and is ready to apply
    // Show a prompt to the user
  }
  if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
    // Already on the latest version
  }
  if (event.type === Updates.UpdateEventType.ERROR) {
    // Update check or download failed
    console.error(event.message);
  }
});
```

### Update strategies

**Strategy 1: Silent background update** (most common)
- Check on app launch, download in background
- Apply on next app open (user sees old version until restart)
- Set `fallbackToCacheTimeout: 0`

**Strategy 2: Forced update**
- Check on app launch, block until downloaded
- Set `fallbackToCacheTimeout: 30000` (30s timeout)
- Use for critical fixes only - degrades UX

**Strategy 3: Prompted update**
- Check on app launch, notify user when ready
- Let user choose when to restart
- Best balance of UX and update speed

### Rollback

```bash
# Option 1: Remap channel to a previous branch
eas channel:edit production --branch production-rollback

# Option 2: Republish a previous commit
git checkout <previous-commit>
eas update --branch production --message "Rollback to v1.2.0"
git checkout main

# Option 3: EAS Update automatically rolls back
# If an update crashes on startup, expo-updates falls back to the embedded bundle
```

### Debugging updates

```bash
# View published updates
eas update:list --branch production

# View update details
eas update:view <update-id>

# Check what runtime version a build expects
eas build:list --platform ios --status finished
```

## CodePush Migration

Microsoft CodePush (App Center) reached end-of-life in March 2025. Migrate to EAS Update.

### Migration steps

1. Install `expo-updates`: `npx expo install expo-updates`
2. Remove `react-native-code-push` from your project
3. Remove CodePush wrapper from your root component
4. Configure EAS Update in `app.config.ts`
5. Set up branches and channels to match your CodePush deployment targets
6. Update CI/CD to use `eas update` instead of `appcenter codepush release-react`

### Key differences from CodePush

| Feature | CodePush | EAS Update |
|---|---|---|
| Mandatory updates | `codePush.CheckFrequency.ON_APP_RESUME` | `fallbackToCacheTimeout` + manual check |
| Deployment targets | Production / Staging | Branches + Channels (more flexible) |
| Rollback | Manual via CLI | Automatic crash rollback + manual |
| Runtime compatibility | Manual version targeting | Fingerprint policy (automatic) |
| Hosting | Microsoft Azure | Expo (AWS) |

## Best Practices

1. **Always use fingerprint runtime versioning** - it prevents the most common OTA failure (JS/native mismatch)
2. **Test updates on preview branch first** before publishing to production
3. **Set `fallbackToCacheTimeout: 0`** in production - never block app start for an update
4. **Monitor update adoption** with `eas update:list` and analytics events
5. **Keep updates small** - only ship changed JS, not the entire bundle (EAS handles this automatically with diffs)
6. **Have a rollback plan** - know how to remap channels before you need to
7. **Use CI/CD for updates** - automate `eas update` in your merge-to-main pipeline

```yaml
# GitHub Actions example
- name: Publish OTA update
  if: github.ref == 'refs/heads/main'
  run: eas update --branch production --auto --non-interactive
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```
