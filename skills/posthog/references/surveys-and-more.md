<!-- Part of the PostHog AbsolutelySkilled skill. Load this file when
     working with surveys, session replay, web analytics, or LLM observability. -->

# PostHog Surveys, Session Replay, Web Analytics & More

## Surveys

### Survey types
- **Popover** - prebuilt UI in the bottom corner of the screen
- **API** - custom UI, PostHog handles targeting logic and analytics
- **Feedback button** - persistent tab for collecting feedback
- **Hosted** - external URL or iframe-embedded, anonymous by default

### Question types
1. Freeform text
2. Link/notification (display-only)
3. Rating - emoji scale
4. Rating - number scale
5. Single choice select
6. Multiple choice select

### Display conditions
- Feature flag targeting
- URL matching
- Device type filtering
- CSS selector matching
- Wait periods between viewings
- Person/group property targeting
- Event-based triggers

### Creating surveys via API

```bash
POST /api/projects/:id/surveys/
{
  "name": "NPS Survey",
  "type": "popover",
  "questions": [
    {
      "type": "rating",
      "question": "How likely are you to recommend us?",
      "scale": 10,
      "lowerBoundLabel": "Not likely",
      "upperBoundLabel": "Very likely"
    }
  ],
  "conditions": {
    "url": "https://example.com/dashboard"
  },
  "start_date": "2026-03-14T00:00:00Z"
}
```

### Handling surveys in code (API mode)

```javascript
// Get active surveys for the current user
posthog.getActiveMatchingSurveys((surveys) => {
  surveys.forEach(survey => {
    // Render custom survey UI
    renderSurvey(survey)
  })
})

// Send survey response
posthog.capture('survey sent', {
  $survey_id: 'survey_uuid',
  $survey_response: 'Great product!',
  $survey_response_1: 9, // for multi-question surveys
})
```

### Repeating surveys
Surveys can repeat via event triggers, scheduled intervals, or when display
conditions are met again. Partial responses are tracked by default with a unique
submission ID per attempt.

---

## Session replay

Session replay records user sessions as replayable videos. It captures DOM changes,
mouse movements, clicks, console logs, and network requests.

### Setup (browser)
Session replay is enabled by default with `posthog-js`. Configure it during init:

```javascript
posthog.init('phc_key', {
  api_host: 'https://us.i.posthog.com',
  session_recording: {
    maskAllInputs: true,        // mask input values
    maskTextContent: false,      // mask text content
    recordCrossOriginIframes: false,
  },
})
```

### Conditional recording
Record only specific sessions to reduce volume:

```javascript
posthog.init('phc_key', {
  api_host: 'https://us.i.posthog.com',
  disable_session_recording: true, // disable by default
})

// Start recording programmatically
posthog.startSessionRecording()
```

### Replay triggers
PostHog can automatically start recording when specific events are queued,
capturing a buffer of activity before the trigger event.

### Privacy controls
- `maskAllInputs: true` - replaces input values with asterisks
- `maskTextContent: true` - masks all text content
- Add `ph-no-capture` class to any element to exclude it from recording
- Add `ph-mask` class to mask specific elements

---

## Web analytics

PostHog web analytics provides a Google Analytics-like dashboard with:
- Pageviews, unique visitors, sessions
- Bounce rate, session duration
- Traffic sources, UTM parameters
- Device, browser, OS, and location breakdowns
- Entry/exit pages

Web analytics uses autocaptured `$pageview` events and requires no additional
setup beyond the standard JS SDK installation. The dashboard is available at
`/web` in your PostHog instance.

### Key autocaptured events
- `$pageview` - page loads
- `$pageleave` - page exits (captures time on page)
- `$autocapture` - clicks, form submissions, input changes
- `$rageclick` - repeated rapid clicks (frustration signal)

### UTM tracking
PostHog automatically captures UTM parameters from URLs:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Stored as properties on the `$pageview` event

---

## Error tracking

PostHog captures JavaScript errors and unhandled exceptions automatically.

### Browser setup
Error tracking is enabled by default in `posthog-js`. It captures:
- Unhandled exceptions
- Unhandled promise rejections
- Console errors (optional)

### Python setup
```python
posthog = Posthog('phc_key',
    host='https://us.i.posthog.com',
    enable_exception_autocapture=True)

# Manual capture
try:
    risky_operation()
except Exception as e:
    posthog.capture_exception(e)
```

### Node.js setup
```javascript
// Errors are captured via the SDK's error tracking module
// Manual capture
client.captureException(error, 'user_123')
```

---

## LLM observability

PostHog provides observability for LLM-powered applications via the `@posthog/ai`
package (Node.js) or built-in Python SDK support.

### What it tracks
- LLM API calls (model, tokens, latency, cost)
- Prompt/completion content (optional, can be masked)
- Error rates and failure modes
- Token usage over time

### Node.js setup
```javascript
import { PostHogAI } from '@posthog/ai'
import OpenAI from 'openai'

const openai = new PostHogAI(new OpenAI(), posthogClient)
// Use openai as normal - PostHog wraps and tracks all calls
```

### Python setup
LLM analytics are built into the Python SDK with context managers and decorators
for tracking LLM calls.

---

## Data warehouse

PostHog includes a built-in data warehouse that can:
- Import data from external sources (Stripe, Hubspot, Postgres, S3, etc.)
- Join external data with PostHog events and persons
- Query everything with HogQL

### External data sources
```bash
POST /api/projects/:id/external_data_sources/
{
  "source_type": "Stripe",
  "job_inputs": {
    "stripe_secret_key": "sk_..."
  }
}
```

This syncs Stripe data (charges, customers, invoices) into PostHog's warehouse
for cross-referencing with product analytics.
