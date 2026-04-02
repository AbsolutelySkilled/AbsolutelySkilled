import type { RegistryEntry, AuditReport, SkillCategory } from './types.js';
import { DEFAULT_REGISTRY } from './constants.js';
import { getGitHubToken } from './auth.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchOptions {
  query?: string;
  category?: SkillCategory;
  minScore?: number;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  results: RegistryEntry[];
  total: number;
}

export interface CategoryInfo {
  name: string;
  count: number;
  topSkills: string[];
}

export interface VerifyResult {
  contentHash: string;
  declaredVersion: string;
  auditScore: number;
}

export interface PublishResult {
  status: string;
  skillsFound: number;
}

export interface TopOptions {
  category?: string;
  limit?: number;
  period?: 'weekly' | 'monthly' | 'all';
}

// ---------------------------------------------------------------------------
// Registry Client
// ---------------------------------------------------------------------------

const TIMEOUT_MS = 10_000;

export class RegistryClient {
  constructor(public readonly baseUrl: string) {}

  async search(options: SearchOptions): Promise<SearchResult> {
    const params = new URLSearchParams();
    if (options.query) params.set('q', options.query);
    if (options.category) params.set('category', options.category);
    if (options.minScore !== undefined)
      params.set('minScore', String(options.minScore));
    if (options.limit !== undefined)
      params.set('limit', String(options.limit));
    if (options.offset !== undefined)
      params.set('offset', String(options.offset));
    return this.get<SearchResult>(`/search?${params}`);
  }

  async getSkill(name: string): Promise<RegistryEntry> {
    return this.get<RegistryEntry>(`/skills/${encodeURIComponent(name)}`);
  }

  async getAudit(name: string): Promise<AuditReport> {
    return this.get<AuditReport>(
      `/skills/${encodeURIComponent(name)}/audit`,
    );
  }

  async getCategories(): Promise<CategoryInfo[]> {
    return this.get<CategoryInfo[]>('/categories');
  }

  async getTop(options?: TopOptions): Promise<RegistryEntry[]> {
    const params = new URLSearchParams();
    if (options?.category) params.set('category', options.category);
    if (options?.limit !== undefined)
      params.set('limit', String(options.limit));
    if (options?.period) params.set('period', options.period);
    const qs = params.toString();
    return this.get<RegistryEntry[]>(`/top${qs ? `?${qs}` : ''}`);
  }

  async verify(name: string): Promise<VerifyResult> {
    return this.get<VerifyResult>(
      `/verify/${encodeURIComponent(name)}`,
    );
  }

  async publish(repoUrl: string): Promise<PublishResult> {
    const token = await getGitHubToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}/publish`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ repoUrl }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Registry error ${res.status}: ${body}`);
    }

    return res.json() as Promise<PublishResult>;
  }

  // -- Internal helpers -----------------------------------------------------

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Registry error ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }
}

// ---------------------------------------------------------------------------
// Factory & default instance
// ---------------------------------------------------------------------------

export function createRegistryClient(baseUrl?: string): RegistryClient {
  return new RegistryClient(baseUrl ?? DEFAULT_REGISTRY);
}

export const defaultClient = createRegistryClient(DEFAULT_REGISTRY);
