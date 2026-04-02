import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegistryClient, createRegistryClient } from '../src/registry-client.js';

const BASE = 'https://test.registry.local/api';

function mockFetchOk(data: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

function mockFetchError(status: number, body: string) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    text: () => Promise.resolve(body),
  });
}

let client: RegistryClient;

beforeEach(() => {
  vi.restoreAllMocks();
  client = new RegistryClient(BASE);
});

describe('RegistryClient', () => {
  it('search builds correct URL with query params', async () => {
    const mock = mockFetchOk({ results: [], total: 0 });
    vi.stubGlobal('fetch', mock);
    await client.search({ query: 'react', category: 'engineering', limit: 5 });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain('/search?');
    expect(url).toContain('q=react');
    expect(url).toContain('category=engineering');
    expect(url).toContain('limit=5');
  });

  it('search returns parsed results', async () => {
    const data = { results: [{ name: 'a' }], total: 1 };
    vi.stubGlobal('fetch', mockFetchOk(data));
    const result = await client.search({ query: 'a' });
    expect(result).toEqual(data);
  });

  it('getSkill fetches correct endpoint', async () => {
    const mock = mockFetchOk({ name: 'cli-design' });
    vi.stubGlobal('fetch', mock);
    await client.getSkill('cli-design');
    expect(mock.mock.calls[0][0]).toBe(`${BASE}/skills/cli-design`);
  });

  it('getAudit fetches correct endpoint', async () => {
    const mock = mockFetchOk({ score: 95 });
    vi.stubGlobal('fetch', mock);
    await client.getAudit('my-skill');
    expect(mock.mock.calls[0][0]).toBe(`${BASE}/skills/my-skill/audit`);
  });

  it('getCategories returns parsed array', async () => {
    const data = [{ name: 'engineering', count: 10, topSkills: ['a'] }];
    vi.stubGlobal('fetch', mockFetchOk(data));
    const result = await client.getCategories();
    expect(result).toEqual(data);
  });

  it('getTop with options builds correct URL', async () => {
    const mock = mockFetchOk([]);
    vi.stubGlobal('fetch', mock);
    await client.getTop({ category: 'ai-ml', limit: 3, period: 'weekly' });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain('/top?');
    expect(url).toContain('category=ai-ml');
    expect(url).toContain('limit=3');
    expect(url).toContain('period=weekly');
  });

  it('verify returns hash info', async () => {
    const data = { contentHash: 'abc', declaredVersion: '1.0', auditScore: 90 };
    vi.stubGlobal('fetch', mockFetchOk(data));
    const result = await client.verify('test-skill');
    expect(result).toEqual(data);
  });

  it('publish includes auth header', async () => {
    const mock = mockFetchOk({ status: 'ok', skillsFound: 2 });
    vi.stubGlobal('fetch', mock);
    // Mock getGitHubToken by stubbing env
    vi.stubEnv('GITHUB_TOKEN', 'ghp_test123');
    const { clearTokenCache } = await import('../src/auth.js');
    clearTokenCache();
    await client.publish('https://github.com/org/repo');
    const opts = mock.mock.calls[0][1] as RequestInit;
    expect(opts.method).toBe('POST');
    expect((opts.headers as Record<string, string>)['Authorization']).toBe(
      'Bearer ghp_test123',
    );
  });

  it('HTTP error throws with status and message', async () => {
    vi.stubGlobal('fetch', mockFetchError(404, 'Not found'));
    await expect(client.getSkill('missing')).rejects.toThrow(
      'Registry error 404: Not found',
    );
  });

  it('timeout handling via AbortSignal', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError')),
    );
    await expect(client.getSkill('slow')).rejects.toThrow('Aborted');
  });

  it('custom base URL works via createRegistryClient', () => {
    const custom = createRegistryClient('https://custom.api/v2');
    expect(custom.baseUrl).toBe('https://custom.api/v2');
  });

  it('createRegistryClient uses default registry when no URL given', () => {
    const def = createRegistryClient();
    expect(def.baseUrl).toBe('https://absolutelyskilled.pro/api');
  });
});
