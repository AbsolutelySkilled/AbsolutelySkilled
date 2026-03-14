<!-- Part of the mobile-testing AbsolutelySkilled skill. Load this file when
     working with AWS Device Farm, Firebase Test Lab, or BrowserStack setup and comparison. -->

# Device Farms

Device farms provide pools of real physical devices in the cloud for running
automated mobile tests at scale. This reference covers the three major services,
their setup, pricing models, and how to integrate them into CI.

---

## Comparison

| Feature | AWS Device Farm | Firebase Test Lab | BrowserStack App Automate |
|---|---|---|---|
| Device types | Real devices | Real devices + virtual | Real devices |
| Supported frameworks | Appium, XCUITest, Espresso, Calabash | Espresso, XCUITest, Robo, Game Loop | Appium, Espresso, XCUITest, Flutter |
| Pricing | Pay-per-minute or flat monthly | Free tier (10 tests/day), then pay-per-use | Per-parallel-test subscription |
| Video recording | Yes | Yes | Yes |
| Screenshot capture | Yes (per-step) | Yes | Yes |
| Network shaping | Yes | Limited | Yes |
| Private devices | Yes (dedicated fleet) | No | Yes (dedicated devices) |
| CI integrations | AWS CodePipeline, GitHub Actions | Firebase CLI, GitHub Actions | Native CI plugins, GitHub Actions |
| Best for | AWS-centric teams, private device needs | Android-first teams, Firebase ecosystem | Cross-platform teams, broadest device catalog |

---

## AWS Device Farm

### Setup

```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure
# Requires IAM permissions for devicefarm:* actions
```

### Upload and run tests

```bash
# 1. Create a project (one-time)
PROJECT_ARN=$(aws devicefarm create-project \
  --name "MyApp-E2E" \
  --query 'project.arn' --output text)

# 2. Create a device pool (or use curated pools)
DEVICE_POOL_ARN=$(aws devicefarm create-device-pool \
  --project-arn "$PROJECT_ARN" \
  --name "Top Android Devices" \
  --rules '[
    {"attribute":"PLATFORM","operator":"EQUALS","value":"\"ANDROID\""},
    {"attribute":"OS_VERSION","operator":"GREATER_THAN_OR_EQUALS","value":"\"12\""},
    {"attribute":"MANUFACTURER","operator":"IN","value":"\"[\\\"Google\\\",\\\"Samsung\\\"]\""}
  ]' \
  --query 'devicePool.arn' --output text)

# 3. Upload the app
APP_ARN=$(aws devicefarm create-upload \
  --project-arn "$PROJECT_ARN" \
  --name app-release.apk \
  --type ANDROID_APP \
  --query 'upload.arn' --output text)

# Wait for upload processing
aws devicefarm get-upload --arn "$APP_ARN" --query 'upload.status'

# 4. Upload test package
TEST_ARN=$(aws devicefarm create-upload \
  --project-arn "$PROJECT_ARN" \
  --name tests.zip \
  --type APPIUM_NODE_TEST_PACKAGE \
  --query 'upload.arn' --output text)

# 5. Schedule the run
RUN_ARN=$(aws devicefarm schedule-run \
  --project-arn "$PROJECT_ARN" \
  --app-arn "$APP_ARN" \
  --device-pool-arn "$DEVICE_POOL_ARN" \
  --test type=APPIUM_NODE,testPackageArn="$TEST_ARN" \
  --execution-configuration jobTimeoutMinutes=30,videoCapture=true \
  --query 'run.arn' --output text)

# 6. Poll for results
aws devicefarm get-run --arn "$RUN_ARN" --query 'run.{status:status,result:result}'
```

### GitHub Actions integration

```yaml
- name: Run on AWS Device Farm
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-west-2
- name: Schedule Device Farm run
  run: |
    # Upload app and tests, then schedule run (see commands above)
    # Store RUN_ARN and poll until complete
```

---

## Firebase Test Lab

### Setup

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login
gcloud config set project my-project-id

# Enable the Testing API
gcloud services enable testing.googleapis.com
```

### Run Android tests

```bash
# Instrumented tests (Espresso)
gcloud firebase test android run \
  --type instrumentation \
  --app app/build/outputs/apk/debug/app-debug.apk \
  --test app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk \
  --device model=Pixel6,version=33,locale=en,orientation=portrait \
  --device model=Pixel4a,version=30,locale=en,orientation=portrait \
  --timeout 15m \
  --results-bucket gs://my-test-results \
  --results-dir "run-$(date +%Y%m%d-%H%M%S)" \
  --num-flaky-test-attempts 2

# Robo test (automated exploration - no test code needed)
gcloud firebase test android run \
  --type robo \
  --app app-release.apk \
  --device model=Pixel6,version=33 \
  --timeout 5m \
  --robo-directives "text:username_field=testuser,text:password_field=testpass,click:login_button="
```

### Run iOS tests

```bash
# XCUITest
gcloud firebase test ios run \
  --test MyAppUITests.zip \
  --device model=iphone14pro,version=16.6,locale=en_US,orientation=portrait \
  --timeout 15m \
  --results-bucket gs://my-test-results
```

### GitHub Actions integration

```yaml
- uses: google-github-actions/auth@v2
  with:
    credentials_json: ${{ secrets.GCP_SA_KEY }}
- uses: google-github-actions/setup-gcloud@v2
- name: Run Firebase Test Lab
  run: |
    gcloud firebase test android run \
      --type instrumentation \
      --app app-debug.apk \
      --test app-debug-androidTest.apk \
      --device model=Pixel6,version=33 \
      --num-flaky-test-attempts 2
```

---

## BrowserStack App Automate

### Setup

```bash
# Upload app binary
APP_URL=$(curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
  -F "file=@app-release.apk" \
  -F "custom_id=MyApp-latest" \
  | jq -r '.app_url')

echo "App uploaded: $APP_URL"
```

### WebdriverIO configuration

```javascript
// wdio.browserstack.conf.js
exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  services: ['browserstack'],
  capabilities: [{
    'bstack:options': {
      projectName: 'MyApp',
      buildName: `CI-${process.env.GITHUB_RUN_NUMBER || 'local'}`,
      sessionName: 'Login Flow',
      deviceName: 'Samsung Galaxy S23',
      osVersion: '13.0',
      networkLogs: true,
      video: true,
      debug: true,
    },
    platformName: 'Android',
    'appium:app': process.env.BROWSERSTACK_APP_URL,
    'appium:automationName': 'UiAutomator2',
  }],
  maxInstances: 5,  // parallel sessions based on your plan
};
```

### REST API for results

```bash
# Get session details
curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  "https://api-cloud.browserstack.com/app-automate/sessions/$SESSION_ID.json"

# Get video URL
curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  "https://api-cloud.browserstack.com/app-automate/sessions/$SESSION_ID.json" \
  | jq -r '.automation_session.video_url'

# Mark session as passed/failed
curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  -X PUT "https://api-cloud.browserstack.com/app-automate/sessions/$SESSION_ID.json" \
  -H "Content-Type: application/json" \
  -d '{"status":"passed","reason":"All assertions passed"}'
```

---

## Device matrix strategy

### Recommended minimum matrix

| Slot | Purpose | Example |
|---|---|---|
| Min supported OS | Catch API-level incompatibilities | Android 10 / iOS 15 |
| Latest OS | Catch deprecation warnings, new permission models | Android 14 / iOS 17 |
| Popular mid-range | Real-world perf on constrained hardware | Samsung Galaxy A54 / iPhone SE 3 |
| Tablet (optional) | Catch layout issues on larger screens | iPad Air / Samsung Tab S9 |

### Sharding strategy for CI

```yaml
# Run different test suites on different devices to reduce total time
matrix:
  include:
    - device: "Pixel 6"
      os: "13"
      suite: "critical-path"
    - device: "Samsung Galaxy S21"
      os: "12"
      suite: "regression"
    - device: "Pixel 4a"
      os: "11"
      suite: "accessibility"
```

Keep total device farm time under 20 minutes for PR checks. Run the full matrix
on nightly or release branches only.

---

## Cost optimization

- **Use simulators/emulators for PR checks** - Reserve real devices for nightly and release runs
- **Pin specific devices** - Avoid "any available device" which can cause unpredictable wait times
- **Shard tests across devices** - Run different test suites on different devices instead of all tests on all devices
- **Use free tiers** - Firebase Test Lab offers 10 free test executions per day on physical devices, 15 on virtual
- **Set timeouts** - Always set `--timeout` to prevent runaway sessions from burning budget
- **Cache builds** - Upload the same binary once and reference it by ID across multiple test runs
