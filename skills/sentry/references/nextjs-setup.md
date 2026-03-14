<!-- Part of the Sentry AbsolutelySkilled skill. Load this file when
     working with Sentry + Next.js integration. -->

# Sentry Next.js Integration Guide

## Quick setup with wizard

```bash
npx @sentry/wizard@latest -i nextjs
```

The wizard creates all necessary files and prompts for feature selection
(Error Monitoring, Logs, Session Replay, Tracing).

## Files created by the wizard

### `instrumentation-client.ts` (browser-side)

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  integrations: [Sentry.replayIntegration()],
});
```

### `instrumentation.ts` (server + edge registration)

```typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
```

### `sentry.server.config.ts`

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  enableLogs: true,
});
```

### `sentry.edge.config.ts`

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### `next.config.ts` wrapper

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // your existing config
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Route browser requests through your server to avoid ad blockers
  tunnelRoute: "/monitoring",

  // Suppress build output unless in CI
  silent: !process.env.CI,

  // Automatically upload source maps during build
  // Source maps are deleted from the build output after upload
});
```

### `app/global-error.tsx` (React error boundary)

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

## Environment variables

```env
# Required
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_AUTH_TOKEN=sntrys_YOUR_TOKEN_HERE
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
```

> `NEXT_PUBLIC_SENTRY_DSN` is needed for client-side, `SENTRY_DSN` for server-side.
> `SENTRY_AUTH_TOKEN` is only needed at build time for source map upload.

## Structured logging

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.logger.info("User completed checkout", { orderId: "123" });
Sentry.logger.warn("Payment retry attempted", { attempt: 2 });
Sentry.logger.error("Payment failed", { reason: "insufficient_funds" });
```

## Key gotchas

- The `tunnelRoute` option routes Sentry requests through your Next.js server,
  avoiding ad blockers. The default `/monitoring` path should not conflict with
  your app routes.
- Source maps are automatically uploaded during `next build` and then deleted
  from the output. They never reach your production server.
- Adjust `tracesSampleRate` for production traffic - development uses 1.0 by
  default, but production should typically use 0.1 or lower.
- The `onRequestError` export in `instrumentation.ts` captures server-side
  rendering errors automatically.
