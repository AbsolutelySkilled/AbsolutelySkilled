<!-- Part of the mobile-testing AbsolutelySkilled skill. Load this file when
     working with Detox setup, configuration, matchers, actions, or CI integration. -->

# Detox Guide

Detox is a gray-box end-to-end testing framework for React Native. It runs tests
on real devices and simulators while synchronizing with the app's JS thread,
native UI animations, and network activity to eliminate flakiness.

---

## Installation and setup

```bash
# Install Detox CLI globally
npm install -g detox-cli

# Add Detox to your project
npm install --save-dev detox

# iOS: install applesimutils (required for simulator control)
brew tap wix/brew
brew install applesimutils

# Android: ensure ANDROID_HOME is set and an emulator is available
```

### Configuration file

```javascript
// .detoxrc.js
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/MyApp.app',
      build: 'xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/MyApp.app',
      build: 'xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_6_API_33' },
    },
  },
  configurations: {
    'ios.sim.debug': { device: 'simulator', app: 'ios.debug' },
    'ios.sim.release': { device: 'simulator', app: 'ios.release' },
    'android.emu.debug': { device: 'emulator', app: 'android.debug' },
    'android.emu.release': { device: 'emulator', app: 'android.release' },
  },
};
```

### Jest config for Detox

```javascript
// e2e/jest.config.js
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.js'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
```

---

## Running tests

```bash
# Build the app first
detox build --configuration ios.sim.debug

# Run tests
detox test --configuration ios.sim.debug

# Run a specific test file
detox test --configuration ios.sim.debug e2e/login.test.js

# Run with retry on failure (useful in CI)
detox test --configuration ios.sim.release --retries 2

# Record video of test run (iOS only)
detox test --configuration ios.sim.debug --record-videos all
```

---

## Element matchers

| Matcher | Usage | Notes |
|---|---|---|
| `by.id(testID)` | `element(by.id('submit-btn'))` | Primary matcher - use `testID` prop in RN |
| `by.text(text)` | `element(by.text('Submit'))` | Matches visible text - fragile with i18n |
| `by.label(label)` | `element(by.label('Close'))` | Matches accessibility label |
| `by.type(nativeType)` | `element(by.type('RCTTextInput'))` | Native view type - platform-specific |
| `by.traits([traits])` | `element(by.traits(['button']))` | iOS accessibility traits only |

### Combining matchers

```javascript
// Match element with both testID and text
element(by.id('greeting').and(by.text('Hello')));

// Match element inside a parent
element(by.id('item-title').withAncestor(by.id('item-row-3')));

// Match element containing a descendant
element(by.id('list-container').withDescendant(by.text('Item 5')));

// Match the 2nd element when multiple match
element(by.id('list-item')).atIndex(1);
```

---

## Actions

| Action | Usage | Notes |
|---|---|---|
| `tap()` | `element(by.id('btn')).tap()` | Single tap |
| `longPress(duration)` | `element(by.id('btn')).longPress(1500)` | Duration in ms |
| `multiTap(count)` | `element(by.id('btn')).multiTap(2)` | Double-tap, triple-tap |
| `typeText(text)` | `element(by.id('input')).typeText('hello')` | Types into focused field |
| `replaceText(text)` | `element(by.id('input')).replaceText('new')` | Replaces without typing animation |
| `clearText()` | `element(by.id('input')).clearText()` | Clears text field |
| `tapReturnKey()` | `element(by.id('input')).tapReturnKey()` | Taps keyboard return |
| `scroll(offset, dir)` | `element(by.id('list')).scroll(200, 'down')` | Scroll by pixels |
| `scrollTo(edge)` | `element(by.id('list')).scrollTo('bottom')` | Scroll to edge |
| `swipe(dir, speed, pct)` | `element(by.id('card')).swipe('left', 'fast', 0.75)` | Swipe gesture |

---

## Expectations

```javascript
await expect(element(by.id('title'))).toBeVisible();
await expect(element(by.id('title'))).not.toBeVisible();
await expect(element(by.id('title'))).toExist();
await expect(element(by.id('title'))).not.toExist();
await expect(element(by.id('title'))).toHaveText('Welcome');
await expect(element(by.id('title'))).toHaveLabel('Welcome header');
await expect(element(by.id('title'))).toHaveId('title');
await expect(element(by.id('switch'))).toHaveToggleValue(true);
await expect(element(by.id('slider'))).toHaveSliderPosition(0.5, 0.05);
```

---

## Device API

```javascript
// Launch / reload
await device.launchApp({ newInstance: true });
await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } });
await device.reloadReactNative();
await device.terminateApp();
await device.installApp();
await device.uninstallApp();

// Device actions
await device.sendToHome();
await device.setBiometricEnrollment(true);
await device.matchFace(); // or matchFinger()
await device.unmatchFace();
await device.shake();
await device.setLocation(37.7749, -122.4194);
await device.setURLBlacklist(['.*google.com.*']);
await device.enableSynchronization();
await device.disableSynchronization();
await device.setStatusBar({ time: '12:34', batteryLevel: 100 });
```

---

## CI integration

### GitHub Actions

```yaml
name: Detox E2E
on: [push, pull_request]
jobs:
  detox-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: brew tap wix/brew && brew install applesimutils
      - run: detox build --configuration ios.sim.release
      - run: detox test --configuration ios.sim.release --retries 2 --cleanup
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: detox-artifacts
          path: artifacts/

  detox-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Start Android emulator
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 33
          target: google_apis
          arch: x86_64
          script: |
            npm ci
            detox build --configuration android.emu.release
            detox test --configuration android.emu.release --retries 2
```

---

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Test hangs indefinitely | Detox waiting for animation/timer to finish | Disable looping animations; use `device.disableSynchronization()` around long timers |
| Element not found | Element off-screen or not yet rendered | Scroll to element first; use `waitFor(element).toBeVisible().withTimeout(5000)` |
| Build fails on CI | Missing Xcode/Android SDK | Pin Xcode version with `xcode-select`; use correct `runs-on` image |
| Flaky on Android emulator | Emulator not fully booted | Add boot wait in CI; use `adb wait-for-device` before running tests |
