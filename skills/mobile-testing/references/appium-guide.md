<!-- Part of the mobile-testing AbsolutelySkilled skill. Load this file when
     working with Appium server setup, desired capabilities, or cross-platform patterns. -->

# Appium Guide

Appium is a cross-platform mobile test automation framework that uses the WebDriver
protocol to drive native, hybrid, and mobile web applications on iOS and Android.
It supports multiple client languages (JavaScript, Python, Java, Ruby, C#) and
automation backends (XCUITest for iOS, UiAutomator2 for Android).

---

## Installation

```bash
# Install Appium 2.x server
npm install -g appium

# Install platform drivers
appium driver install uiautomator2   # Android
appium driver install xcuitest       # iOS

# Verify installation
appium driver list --installed

# Start the Appium server
appium --port 4723
```

### Required environment

- **iOS**: macOS with Xcode, Xcode Command Line Tools, and `ios-deploy` (`npm install -g ios-deploy`)
- **Android**: JDK 17+, Android SDK, `ANDROID_HOME` set, platform-tools in PATH
- **Both**: Node.js 18+

---

## Desired capabilities

Capabilities tell Appium which platform, device, and app to use.

### Android (UiAutomator2)

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Pixel 6",
  "appium:platformVersion": "13.0",
  "appium:app": "/path/to/app-debug.apk",
  "appium:noReset": false,
  "appium:autoGrantPermissions": true,
  "appium:newCommandTimeout": 300
}
```

### iOS (XCUITest)

```json
{
  "platformName": "iOS",
  "appium:automationName": "XCUITest",
  "appium:deviceName": "iPhone 15",
  "appium:platformVersion": "17.0",
  "appium:app": "/path/to/MyApp.app",
  "appium:noReset": false,
  "appium:autoAcceptAlerts": true,
  "appium:newCommandTimeout": 300
}
```

### Key capability flags

| Capability | Purpose | Default |
|---|---|---|
| `appium:noReset` | Do not clear app data before session | `false` |
| `appium:fullReset` | Uninstall app before and after session | `false` |
| `appium:autoGrantPermissions` | Auto-grant Android runtime permissions | `false` |
| `appium:autoAcceptAlerts` | Auto-accept iOS system dialogs | `false` |
| `appium:newCommandTimeout` | Seconds before server kills idle session | `60` |
| `appium:udid` | Target a specific physical device by UDID | auto-detect |

---

## Locator strategies

| Strategy | Syntax (WebdriverIO) | Notes |
|---|---|---|
| Accessibility ID | `$('~login-button')` | Best cross-platform strategy - maps to `testID` (RN), `accessibilityIdentifier` (iOS), `content-desc` (Android) |
| ID (resource-id) | `$('android=new UiSelector().resourceId("com.app:id/btn")')` | Android only |
| XPath | `$('//android.widget.Button[@text="Login"]')` | Slow and fragile - avoid |
| Class name | `$('android.widget.EditText')` | Matches all elements of type |
| iOS predicate | `$('-ios predicate string:name == "login"')` | iOS native predicate |
| iOS class chain | `$('-ios class chain:**/XCUIElementTypeButton[`name == "login"`]')` | Faster than XPath on iOS |

**Best practice**: Always prefer accessibility ID (`~`) as the primary locator. It
works on both platforms and maps to semantic identifiers.

---

## Common actions

```javascript
// WebdriverIO client examples

// Find and interact
const emailField = await $('~email-input');
await emailField.setValue('user@example.com');

const loginBtn = await $('~login-button');
await loginBtn.click();

// Wait for element
const dashboard = await $('~dashboard-screen');
await dashboard.waitForDisplayed({ timeout: 10000 });

// Scroll
await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Settings"))');

// iOS scroll
await driver.execute('mobile: scroll', { direction: 'down' });

// Swipe (gesture)
await driver.execute('mobile: swipeGesture', {
  left: 100, top: 500, width: 200, height: 0,
  direction: 'left', percent: 0.75,
});

// Take screenshot
await driver.saveScreenshot('./screenshots/result.png');

// Handle native alert (iOS)
await driver.acceptAlert();
// or
await driver.dismissAlert();

// Background and foreground
await driver.background(5); // send to background for 5 seconds

// Get element text
const text = await $('~welcome-text').getText();

// Check element state
const isDisplayed = await $('~login-button').isDisplayed();
const isEnabled = await $('~submit-button').isEnabled();
```

---

## Cross-platform test patterns

### Shared test logic with platform-specific selectors

```javascript
// selectors.js
const PLATFORM = driver.isAndroid ? 'android' : 'ios';

const selectors = {
  loginButton: '~login-button',  // accessibility ID works on both
  backButton: PLATFORM === 'ios'
    ? $('-ios class chain:**/XCUIElementTypeButton[`name == "Back"`]')
    : $('~navigate-back'),
};

module.exports = selectors;
```

### Page object pattern

```javascript
// pages/LoginPage.js
class LoginPage {
  get emailInput() { return $('~email-input'); }
  get passwordInput() { return $('~password-input'); }
  get loginButton() { return $('~login-button'); }
  get errorMessage() { return $('~error-message'); }

  async login(email, password) {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async getError() {
    await this.errorMessage.waitForDisplayed({ timeout: 5000 });
    return this.errorMessage.getText();
  }
}

module.exports = new LoginPage();
```

---

## WebdriverIO configuration

```javascript
// wdio.conf.js
const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  path: '/wd/hub',
  specs: ['./test/specs/**/*.spec.js'],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:app': path.resolve('./app/build/outputs/apk/debug/app-debug.apk'),
    'appium:noReset': false,
  }],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
};
```

---

## Parallel execution with BrowserStack

```javascript
// wdio.browserstack.conf.js
exports.config = {
  ...require('./wdio.conf').config,
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  services: ['browserstack'],
  capabilities: [
    {
      'bstack:options': {
        deviceName: 'Samsung Galaxy S23',
        osVersion: '13.0',
        projectName: 'MyApp',
        buildName: `CI-${process.env.BUILD_NUMBER}`,
      },
      platformName: 'Android',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:automationName': 'UiAutomator2',
    },
    {
      'bstack:options': {
        deviceName: 'iPhone 15',
        osVersion: '17',
        projectName: 'MyApp',
        buildName: `CI-${process.env.BUILD_NUMBER}`,
      },
      platformName: 'iOS',
      'appium:app': process.env.BROWSERSTACK_APP_URL,
      'appium:automationName': 'XCUITest',
    },
  ],
};
```

---

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Session not created | Driver not installed or wrong capabilities | Run `appium driver list`; verify `automationName` matches installed driver |
| Element not found | Wrong locator or element not rendered yet | Use `waitForDisplayed()`; prefer accessibility ID over XPath |
| App crashes on launch | Incompatible APK/IPA with device OS version | Check `minSdkVersion`/deployment target matches device |
| Slow test execution | XPath locators or unnecessary waits | Replace XPath with accessibility ID; use explicit waits |
| Permission dialogs block test | System dialog not auto-handled | Set `autoGrantPermissions` (Android) or `autoAcceptAlerts` (iOS) |
