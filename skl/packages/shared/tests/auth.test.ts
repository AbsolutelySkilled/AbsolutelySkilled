import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGitHubToken, clearTokenCache } from '../src/auth.js';

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

import { execSync } from 'node:child_process';
const mockExecSync = vi.mocked(execSync);

describe('getGitHubToken', () => {
  beforeEach(() => {
    clearTokenCache();
    vi.unstubAllEnvs();
    mockExecSync.mockReset();
  });

  it('returns GITHUB_TOKEN when set', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'ghp_abc123');
    vi.stubEnv('GH_TOKEN', '');
    expect(await getGitHubToken()).toBe('ghp_abc123');
  });

  it('falls back to GH_TOKEN when GITHUB_TOKEN not set', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    vi.stubEnv('GH_TOKEN', 'gho_xyz789');
    expect(await getGitHubToken()).toBe('gho_xyz789');
  });

  it('falls back to gh auth token CLI', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    vi.stubEnv('GH_TOKEN', '');
    mockExecSync.mockReturnValue('ghp_from_cli\n');
    expect(await getGitHubToken()).toBe('ghp_from_cli');
  });

  it('returns null when no token available and gh CLI fails', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    vi.stubEnv('GH_TOKEN', '');
    mockExecSync.mockImplementation(() => {
      throw new Error('gh: command not found');
    });
    expect(await getGitHubToken()).toBeNull();
  });

  it('caches result across calls', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'ghp_cached');
    vi.stubEnv('GH_TOKEN', '');
    await getGitHubToken();
    vi.stubEnv('GITHUB_TOKEN', 'ghp_changed');
    expect(await getGitHubToken()).toBe('ghp_cached');
  });

  it('clearTokenCache resets cache', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'ghp_first');
    vi.stubEnv('GH_TOKEN', '');
    await getGitHubToken();
    clearTokenCache();
    vi.stubEnv('GITHUB_TOKEN', 'ghp_second');
    expect(await getGitHubToken()).toBe('ghp_second');
  });
});
