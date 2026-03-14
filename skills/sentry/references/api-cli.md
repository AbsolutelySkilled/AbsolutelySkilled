<!-- Part of the Sentry AbsolutelySkilled skill. Load this file when
     working with the Sentry REST API or sentry-cli. -->

# Sentry API and CLI Reference

## REST API

### Base URLs

| Region | URL |
|---|---|
| Default | `https://sentry.io/api/0/` |
| US | `https://us.sentry.io/api/0/` |
| EU (DE) | `https://de.sentry.io/api/0/` |

### Authentication

```bash
# Bearer token (recommended)
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  https://sentry.io/api/0/organizations/

# DSN-based auth (limited to event submission)
curl -H "Authorization: DSN https://public@sentry.io/1" \
  https://sentry.io/api/0/...
```

Create auth tokens at: Settings > Auth Tokens (or `sentry.io/settings/auth-tokens/`).

### Key API endpoints

| Category | Endpoint | Description |
|---|---|---|
| Organizations | `GET /api/0/organizations/` | List all organizations |
| Projects | `GET /api/0/organizations/{org}/projects/` | List org projects |
| Issues | `GET /api/0/organizations/{org}/issues/` | List org issues |
| Issue detail | `GET /api/0/issues/{issue_id}/` | Get issue details |
| Resolve issue | `PUT /api/0/issues/{issue_id}/` | Update issue status |
| Events | `GET /api/0/issues/{issue_id}/events/` | List issue events |
| Releases | `POST /api/0/organizations/{org}/releases/` | Create a release |
| Teams | `GET /api/0/organizations/{org}/teams/` | List teams |
| Alerts | `GET /api/0/organizations/{org}/alert-rules/` | List alert rules |

### Resolve an issue via API

```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}' \
  https://sentry.io/api/0/issues/12345/
```

### Create a release via API

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "my-app@1.2.0",
    "projects": ["my-project"]
  }' \
  https://sentry.io/api/0/organizations/my-org/releases/
```

### Pagination

API responses use cursor-based pagination via the `Link` header:

```
Link: <https://sentry.io/api/0/...?cursor=next_cursor>; rel="next"; results="true"
```

Check `results="true"` to determine if more pages exist.

### Rate limits

The API returns `429 Too Many Requests` when rate limited. Check the
`Retry-After` header for the number of seconds to wait.

---

## Sentry CLI (`sentry-cli`)

### Installation

```bash
# npm (recommended for JS projects)
npm install -g @sentry/cli

# Homebrew (macOS)
brew install getsentry/tools/sentry-cli

# curl (Linux/macOS)
curl -sL https://sentry.io/get-cli/ | bash

# Docker
docker pull getsentry/sentry-cli
```

### Configuration

Create a `.sentryclirc` file at project root or home directory:

```ini
[auth]
token=sntrys_YOUR_TOKEN_HERE

[defaults]
org=your-org-slug
project=your-project-slug
url=https://sentry.io/
```

Or use environment variables:

```bash
export SENTRY_AUTH_TOKEN=sntrys_YOUR_TOKEN_HERE
export SENTRY_ORG=your-org-slug
export SENTRY_PROJECT=your-project-slug
```

### Key commands

#### Release management

```bash
# Create a new release
sentry-cli releases new my-app@1.2.0

# Associate commits with a release
sentry-cli releases set-commits my-app@1.2.0 --auto

# Mark a release as deployed
sentry-cli releases deploys my-app@1.2.0 new -e production

# Finalize a release
sentry-cli releases finalize my-app@1.2.0
```

#### Source maps

```bash
# Upload source maps for a release
sentry-cli sourcemaps upload --release=my-app@1.2.0 ./dist

# Upload with URL prefix for hosted apps
sentry-cli sourcemaps upload --release=my-app@1.2.0 \
  --url-prefix="~/static/js" ./build/static/js

# Validate source maps before uploading
sentry-cli sourcemaps explain --release=my-app@1.2.0
```

#### Debug files (native apps)

```bash
# Upload debug symbols (iOS dSYMs, Android debug files)
sentry-cli debug-files upload ./path/to/dsyms

# Check what debug files exist for a project
sentry-cli debug-files check
```

#### Cron monitoring

```bash
# Wrap a cron job for automatic monitoring
sentry-cli monitors run my-cron-slug -- /path/to/script.sh

# Send manual check-ins
sentry-cli monitors check-in my-cron-slug --status=ok
sentry-cli monitors check-in my-cron-slug --status=error
```

#### Send test events

```bash
# Send a test event to verify setup
sentry-cli send-event -m "Test event from CLI"
```
