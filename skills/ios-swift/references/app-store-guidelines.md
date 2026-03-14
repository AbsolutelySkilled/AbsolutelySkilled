<!-- Part of the ios-swift AbsolutelySkilled skill. Load this file when
     preparing an app for App Store submission or resolving a rejection. -->

# App Store Guidelines

## Pre-Submission Checklist

### Privacy and permissions

- [ ] Add `NSCameraUsageDescription` to Info.plist if using camera
- [ ] Add `NSPhotoLibraryUsageDescription` if accessing photo library
- [ ] Add `NSLocationWhenInUseUsageDescription` or `NSLocationAlwaysAndWhenInUseUsageDescription` for location
- [ ] Add `NSMicrophoneUsageDescription` if recording audio
- [ ] Add `NSContactsUsageDescription` if accessing contacts
- [ ] Add `NSCalendarsUsageDescription` if accessing calendar
- [ ] Add `NSUserTrackingUsageDescription` for App Tracking Transparency
- [ ] All purpose strings must clearly explain WHY the permission is needed (not just "we need camera access")
- [ ] Implement `ATTrackingManager.requestTrackingAuthorization` BEFORE any tracking or ad SDK initialization
- [ ] Complete the App Privacy section in App Store Connect (data collection declarations)

### Authentication

- [ ] If the app offers third-party login (Google, Facebook), also offer Sign in with Apple
- [ ] Sign in with Apple must be presented as a prominently displayed option
- [ ] Guest access should be available where reasonable (content browsing)
- [ ] Login-required apps must provide demo credentials in the review notes

### In-App Purchases

- [ ] All digital goods and services must use Apple's In-App Purchase system
- [ ] Physical goods and services (Uber rides, food delivery) may use external payment
- [ ] Provide a "Restore Purchases" button for non-consumable IAPs and subscriptions
- [ ] Clearly display subscription terms, pricing, and renewal info before purchase
- [ ] Use StoreKit 2 for new implementations
- [ ] Handle receipt validation server-side for production apps
- [ ] Never reference external purchasing methods for digital content

### Content and behavior

- [ ] App must function as described in metadata - no hidden features
- [ ] No placeholder content (lorem ipsum, test data, dummy screenshots)
- [ ] App must be fully functional without requiring additional purchases to be usable
- [ ] User-generated content apps must have reporting and blocking mechanisms
- [ ] Apps with age-restricted content must implement age gating
- [ ] No misleading screenshots or app previews

### Technical requirements

- [ ] Runs without crashing on the declared minimum iOS version
- [ ] Supports all screen sizes for the declared device families (iPhone, iPad)
- [ ] IPv6-only network compatibility (no hardcoded IPv4 addresses)
- [ ] Does not use private APIs or undocumented frameworks
- [ ] App size is reasonable (keep under 200MB for cellular downloads)
- [ ] Background modes declared in Info.plist match actual background usage
- [ ] No excessive battery, memory, or CPU usage

### Metadata

- [ ] App name does not include generic terms like "best", "#1", or competitor names
- [ ] Description accurately reflects app functionality
- [ ] Keywords are relevant (no competitor names or misleading terms)
- [ ] Screenshots show actual app UI (no marketing overlays that obscure functionality)
- [ ] Privacy policy URL is valid and accessible
- [ ] Support URL is valid and leads to a support mechanism
- [ ] Age rating is set correctly based on content

---

## Common Rejection Reasons

### Guideline 2.1 - Performance: App Completeness

**Cause:** App crashes, has placeholder content, or features don't work.

**Fix:**
- Test every flow on the minimum supported iOS version on a real device
- Remove all debug/test UI and placeholder content
- Ensure all buttons and links lead somewhere functional

### Guideline 2.3.3 - Performance: Screenshots

**Cause:** Screenshots don't match the actual app or show a device frame with wrong device type.

**Fix:**
- Use actual app screenshots taken on the current UI
- Match screenshot device to the upload slot (iPhone 6.7" for iPhone 15 Pro Max, etc.)

### Guideline 3.1.1 - Business: In-App Purchase

**Cause:** Using external payment for digital goods or not offering IAP for premium features.

**Fix:**
- All digital content, subscriptions, and premium features must use StoreKit
- Physical goods/services are exempt

### Guideline 4.0 - Design: Minimum Functionality

**Cause:** App is too simple, wraps a website, or is a trivial modification of a template.

**Fix:**
- Add native functionality beyond what a web app provides
- Include meaningful features that justify a native app

### Guideline 5.1.1 - Legal: Privacy - Data Collection

**Cause:** Missing privacy purpose strings, tracking without ATT prompt, or incomplete privacy declarations.

**Fix:**
- Add descriptive purpose strings for every permission
- Request ATT before any tracking
- Complete all data collection declarations in App Store Connect

### Guideline 5.1.2 - Legal: Privacy - Data Use and Sharing

**Cause:** App collects data not disclosed in the privacy label, or shares data without consent.

**Fix:**
- Audit all SDKs and analytics for data collection
- Declare everything in the privacy nutrition labels
- Provide opt-out mechanisms where applicable

---

## TestFlight

### Internal testing
- Up to 100 internal testers (members of your App Store Connect team)
- No review required
- Builds available immediately after processing

### External testing
- Up to 10,000 external testers
- First build of each version requires Beta App Review (usually < 24 hours)
- Subsequent builds of the same version are usually auto-approved
- Testers join via public link or email invitation
- Builds expire after 90 days

### Best practices
- Include meaningful "What to Test" notes for each build
- Use test groups to segment testers by feature or risk level
- Monitor crash reports and feedback in App Store Connect
- Remove testers who are not actively testing

---

## App Store Connect Submission Flow

1. **Archive** the app in Xcode (Product -> Archive)
2. **Upload** via Xcode Organizer or `xcodebuild -exportArchive`
3. **Configure** in App Store Connect: screenshots, description, keywords, pricing
4. **Submit** for review - typical review time is 24-48 hours
5. **Respond** to any rejection with specific fixes in the Resolution Center

### Expedited review

Available for critical bug fixes. Request through the Apple developer contact form. Include:
- Detailed description of the critical issue
- Steps to reproduce
- Business impact explanation
- Expected timeline for fix

Use sparingly - Apple tracks expedited review requests and may deny frequent requesters.
