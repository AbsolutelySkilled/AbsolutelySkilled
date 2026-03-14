<!-- Part of the android-kotlin AbsolutelySkilled skill. Load this file when
     preparing an Android app for Google Play Store release, including signing,
     store listing, review guidelines, and staged rollouts. -->

# Play Store Release Checklist

## Pre-release build checklist

### 1. Version management

```kotlin
// app/build.gradle.kts
android {
    defaultConfig {
        versionCode = 12          // Must increment every upload. Integer only.
        versionName = "2.3.0"     // User-visible. Follow semver.
    }
}
```

> The Play Store rejects uploads where `versionCode` is not strictly greater
> than the previously uploaded version.

### 2. Release signing

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("KEYSTORE_PATH") ?: "release.keystore")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: ""
            keyAlias = System.getenv("KEY_ALIAS") ?: ""
            keyPassword = System.getenv("KEY_PASSWORD") ?: ""
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }
}
```

> Use Google Play App Signing (recommended). Upload your app signing key to
> Play Console and sign uploads with a separate upload key. If the upload key
> is compromised, Google can reset it without affecting end users.

### 3. Build the release AAB

```bash
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

> Always use AAB (Android App Bundle) instead of APK for Play Store. AAB
> enables Dynamic Delivery, reducing download size by 15-30%.

### 4. Test the release build locally

```bash
# Install release build on device
./gradlew installRelease

# Or use bundletool to test AAB locally
bundletool build-apks --bundle=app-release.aab --output=app.apks \
  --ks=release.keystore --ks-key-alias=key0
bundletool install-apks --apks=app.apks
```

## ProGuard / R8 configuration

### Common keep rules

```proguard
# Kotlin serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}

# Retrofit
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Room
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *

# Gson (if used)
-keepattributes Signature
-keep class com.example.app.data.model.** { *; }

# Hilt
-keep class dagger.hilt.** { *; }
-keep class javax.inject.** { *; }
-keep @dagger.hilt.android.lifecycle.HiltViewModel class * { *; }
```

### Debugging R8 issues

```bash
# Generate mapping file for crash deobfuscation
android {
    buildTypes {
        release {
            proguardFiles(...)
            // mapping.txt generated at build/outputs/mapping/release/mapping.txt
        }
    }
}
```

> Upload `mapping.txt` to Play Console (App bundle explorer > Downloads tab)
> for deobfuscated crash reports in Android Vitals.

## Store listing requirements

### Required assets

| Asset | Spec |
|---|---|
| App icon | 512x512 PNG, 32-bit, no alpha |
| Feature graphic | 1024x500 PNG or JPG |
| Phone screenshots | Min 2, max 8. 16:9 or 9:16. Min 320px, max 3840px |
| Tablet screenshots | Required if targeting tablets. 7-inch and 10-inch |
| Short description | Max 80 characters |
| Full description | Max 4000 characters |

### Content rating

Complete the IARC content rating questionnaire in Play Console. Without it,
the app may be removed from the store. Covers violence, sexual content,
language, and other categories.

### Privacy policy

Required for all apps that:
- Request sensitive permissions (camera, location, contacts, etc.)
- Access personal or sensitive user data
- Target children (COPPA compliance)

Host the privacy policy at a publicly accessible URL.

### Data safety form

Declare all data collection and sharing practices. Required since July 2022.
Categories include: name, email, location, photos, app activity, device IDs.

## Release tracks

| Track | Purpose | Audience |
|---|---|---|
| Internal testing | Quick iteration, no review needed | Up to 100 internal testers |
| Closed testing | Beta testing with selected users | Invite-only, up to 100K |
| Open testing | Public beta, discoverable on Play Store | Anyone can join |
| Production | Full release | All users |

### Staged rollout

```
Production release flow:
1. Upload AAB to production track
2. Set rollout percentage (start at 5-10%)
3. Monitor Android Vitals for 24-48 hours
4. Check crash rate, ANR rate, user feedback
5. Increase to 25% -> 50% -> 100%
6. Halt rollout immediately if crash rate exceeds baseline
```

> A staged rollout to 5% for 48 hours catches most critical issues before
> they affect the full user base.

## Android Vitals thresholds

Google penalizes apps in search ranking if they exceed these thresholds:

| Metric | Bad threshold | What it measures |
|---|---|---|
| Crash rate | > 1.09% | Percentage of sessions with crashes |
| ANR rate | > 0.47% | Percentage of sessions with Application Not Responding |
| Excessive wakeups | > 10 per hour | Background wakeups draining battery |
| Stuck wake locks | > 0.10% | Sessions with wake locks held > 1 hour |

### Reducing ANRs

- Never do I/O on the main thread
- Use `StrictMode` during development to detect violations
- Keep `BroadcastReceiver.onReceive()` under 10 seconds
- Use `WorkManager` for background tasks instead of long-running services

### Reducing crashes

- Handle nullable data from APIs defensively
- Test on low-memory devices (use `isLowRamDevice`)
- Test with and without network connectivity
- Use `ProcessLifecycleOwner` to handle process death gracefully

## CI/CD integration

### GitHub Actions example

```yaml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
      - name: Build release AAB
        run: ./gradlew bundleRelease
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_SERVICE_ACCOUNT }}
          packageName: com.example.app
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: internal
          mappingFile: app/build/outputs/mapping/release/mapping.txt
```

> Store the keystore file as a base64-encoded secret, decode it in CI.
> Never commit keystores or credentials to version control.
