import { execSync } from 'node:child_process';

let cachedToken: string | null | undefined;

/**
 * Resolve a GitHub token via: GITHUB_TOKEN -> GH_TOKEN -> `gh auth token`.
 * Result is cached for the session lifetime.
 */
export async function getGitHubToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken;

  const fromEnv = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (fromEnv) {
    cachedToken = fromEnv;
    return cachedToken;
  }

  try {
    const result = execSync('gh auth token', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    cachedToken = result || null;
  } catch {
    cachedToken = null;
  }

  return cachedToken;
}

/** Reset the cached token (useful for testing). */
export function clearTokenCache(): void {
  cachedToken = undefined;
}
