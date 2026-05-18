---
name: prevu-preview-environments
version: 0.1.0
description: >
  Use this skill when working with Prevu preview environments for coding agents.
  Triggers on creating VM-backed staging environments, exposing HTTPS preview
  URLs, using the prevu CLI, checking environment services and logs, SSHing into
  Prevu environments, or sharing work-in-progress software for human review
  before production.
category: devtools
tags: [prevu, preview-environments, coding-agents, staging, devops, cli]
platforms:
  - claude-code
  - gemini-cli
  - openai-codex
  - cursor
  - windsurf
sources:
  - url: https://github.com/prevu-cloud/prevu
    accessed: 2026-05-10
    description: Open-source Prevu CLI and agent skills repository
  - url: https://prevu.cloud
    accessed: 2026-05-10
    description: Prevu product site
license: MIT
maintainers:
  - github: prevu-cloud
---

# Prevu Preview Environments

Prevu gives coding agents a real VM-backed preview environment where they can
run work-in-progress changes, expose HTTPS URLs, inspect services and logs, and
hand humans a reviewable link before production.

Use this skill when the user wants an agent to:

- Create or manage a Prevu environment.
- Expose a running local or remote service as a public preview URL.
- SSH into a Prevu environment to inspect files, processes, ports, or logs.
- Share a live preview with a teammate, designer, PM, or mobile reviewer.
- Keep an agent development loop grounded in a real running environment instead
  of screenshots or static diffs.

Do not use this skill for production deployment instructions unless the user
explicitly asks to deploy. Prevu is primarily for preview and review loops.

## Setup

Install the Prevu CLI:

```bash
npm install -g @prevu/cli
```

Install the published Prevu skills package when the agent supports skill sync:

```bash
npm install -D @prevu/skills
npx skills experimental_sync -a claude-code
```

Alternative direct install:

```bash
npx skills add prevu-cloud/prevu -a claude-code
```

## Authentication

Check authentication before creating environments:

```bash
prevu auth status
```

If the user is not signed in, ask them to authenticate:

```bash
prevu auth login
```

When running in CI or an automation environment, prefer `PREVU_TOKEN` if the user
has already provided one. Never invent or expose tokens.

## Core Workflow

### Create an Environment

Create a new environment with a short, memorable slug:

```bash
prevu env create my-app-preview
```

List environments when choosing an existing target:

```bash
prevu env list
```

### Connect with SSH

Use SSH for remote setup, service startup, or debugging:

```bash
prevu env ssh my-app-preview
```

Inside the VM, verify runtime basics before assuming the app is broken:

```bash
pwd
ls
ps aux
ss -ltnp
```

### Expose a Service

Expose the port that the app actually listens on:

```bash
prevu env expose my-app-preview --port 3000
```

Report the returned HTTPS URL to the user and use it for review. If the page
does not load, check whether the app is bound to `0.0.0.0` rather than only
`localhost`, and confirm any framework-specific allowed-host settings.

### Inspect Services and Logs

Use service and log commands before restarting blindly:

```bash
prevu env services my-app-preview
prevu env logs my-app-preview
```

If the CLI supports a narrower service target, prefer the service-specific log
view over a broad dump.

## Mobile and Human Review Loop

For "review from my phone" or "send this to a teammate" requests:

1. Start or confirm the app process in the Prevu environment.
2. Expose the correct app port.
3. Open or probe the HTTPS preview URL.
4. Share a concise status with the exact URL, what is running, and any known
   caveats.

Use wording like:

```text
Preview URL: https://my-app-preview-3000.prevu.page
Running: Vite dev server on port 3000
Ready for: mobile review, teammate click-through, PM signoff
```

## Troubleshooting

If the preview URL returns a blocked-host error, update the app's dev server
configuration to allow the Prevu hostname. For Vite, this usually means setting
`server.allowedHosts` in `vite.config.ts`.

If the port is closed, inspect the process and bind address inside the VM:

```bash
ss -ltnp
curl -I http://127.0.0.1:3000
```

If cloning a private repository inside the VM fails, use the user's approved
repository access path. Do not create new access tokens without explicit user
approval.

## Safety

- Treat Prevu as a staging and preview layer, not a production deploy target.
- Ask before deleting environments unless the user already authorized cleanup.
- Do not paste secrets into public preview URLs, logs, issue comments, or docs.
- Prefer small, reversible environment changes when debugging.
