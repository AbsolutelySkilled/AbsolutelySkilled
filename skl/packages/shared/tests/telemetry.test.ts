import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isTelemetryEnabled, trackEvent, TELEMETRY_NOTICE } from '../src/telemetry.js';

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('isTelemetryEnabled', () => {
  it('returns true by default', () => {
    expect(isTelemetryEnabled()).toBe(true);
  });

  it('returns false when SKL_TELEMETRY=0', () => {
    vi.stubEnv('SKL_TELEMETRY', '0');
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('returns false when SKL_TELEMETRY=false', () => {
    vi.stubEnv('SKL_TELEMETRY', 'false');
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('returns false when SKL_TELEMETRY is empty string', () => {
    vi.stubEnv('SKL_TELEMETRY', '');
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('returns true when SKL_TELEMETRY=1', () => {
    vi.stubEnv('SKL_TELEMETRY', '1');
    expect(isTelemetryEnabled()).toBe(true);
  });

  it('returns true when SKL_TELEMETRY=true', () => {
    vi.stubEnv('SKL_TELEMETRY', 'true');
    expect(isTelemetryEnabled()).toBe(true);
  });

  it('returns false when DO_NOT_TRACK=1', () => {
    vi.stubEnv('DO_NOT_TRACK', '1');
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('SKL_TELEMETRY takes precedence over DO_NOT_TRACK', () => {
    vi.stubEnv('SKL_TELEMETRY', '1');
    vi.stubEnv('DO_NOT_TRACK', '1');
    expect(isTelemetryEnabled()).toBe(true);
  });
});

describe('trackEvent', () => {
  it('does not throw even when fetch fails', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    expect(() => trackEvent({ event: 'install', skill: 'test' })).not.toThrow();
  });

  it('builds correct event payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    trackEvent({ event: 'install', skill: 'cli-design', agent: 'claude-code' });

    // Allow microtask to run
    await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('/telemetry');
    const body = JSON.parse(opts.body);
    expect(body.event).toBe('install');
    expect(body.skill).toBe('cli-design');
    expect(body.agent).toBe('claude-code');
    expect(body.sklVersion).toBe('1.0.0');
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(typeof body.ci).toBe('boolean');
    expect(body.os).toBe(process.platform);
  });

  it('does not call fetch when telemetry is disabled', () => {
    vi.stubEnv('SKL_TELEMETRY', '0');
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    trackEvent({ event: 'search', skill: 'test' });
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe('CI detection', () => {
  it('sets ci to true when CI env var is present', async () => {
    vi.stubEnv('CI', 'true');
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    trackEvent({ event: 'audit', skill: 'test' });
    await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.ci).toBe(true);
  });

  it('sets ci to true when GITHUB_ACTIONS is present', async () => {
    vi.stubEnv('GITHUB_ACTIONS', 'true');
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);

    trackEvent({ event: 'install', skill: 'test' });
    await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.ci).toBe(true);
  });
});

describe('TELEMETRY_NOTICE', () => {
  it('contains opt-out instruction', () => {
    expect(TELEMETRY_NOTICE).toContain('SKL_TELEMETRY=0');
  });

  it('contains learn-more URL', () => {
    expect(TELEMETRY_NOTICE).toContain('absolutelyskilled.pro/telemetry');
  });
});
