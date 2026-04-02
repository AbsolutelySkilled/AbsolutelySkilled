import { DEFAULT_REGISTRY, SKL_VERSION } from './constants.js';
import type { TelemetryEvent } from './types.js';

// ---------------------------------------------------------------------------
// Telemetry - anonymous, fire-and-forget, opt-out
// ---------------------------------------------------------------------------

const CI_VARS = [
  'CI',
  'CONTINUOUS_INTEGRATION',
  'GITHUB_ACTIONS',
  'GITLAB_CI',
  'CIRCLECI',
  'TRAVIS',
  'JENKINS_URL',
];

function isCI(): boolean {
  return CI_VARS.some((v) => !!process.env[v]);
}

export function isTelemetryEnabled(): boolean {
  const sklTelemetry = process.env.SKL_TELEMETRY;
  if (sklTelemetry !== undefined) {
    return !['0', 'false', ''].includes(sklTelemetry);
  }
  const dnt = process.env.DO_NOT_TRACK;
  if (dnt && dnt !== '0' && dnt.toLowerCase() !== 'false') return false;
  return true;
}

export function trackEvent(
  event: Omit<TelemetryEvent, 'sklVersion' | 'timestamp' | 'ci' | 'os'>,
): void {
  if (!isTelemetryEnabled()) return;

  const payload: TelemetryEvent = {
    ...event,
    sklVersion: SKL_VERSION,
    timestamp: new Date().toISOString(),
    ci: isCI(),
    os: process.platform as TelemetryEvent['os'],
  };

  fetch(`${DEFAULT_REGISTRY}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(3000),
  }).catch(() => {});
}

export const TELEMETRY_NOTICE = `skl collects anonymous usage data (skill names, commands).
No personal data is collected. Opt out: SKL_TELEMETRY=0
Learn more: absolutelyskilled.pro/telemetry`;
