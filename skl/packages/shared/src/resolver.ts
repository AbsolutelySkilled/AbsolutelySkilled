// SKL Source Resolver - parses skill specifiers into SkillSource objects

import type { SkillSource } from './types.js';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const GITHUB_TREE_RE =
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.+))?$/;
const GITHUB_URL_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/;
const SHORTHAND_SKILL_RE = /^([^/]+)\/([^/@]+)@(.+)$/;
const SHORTHAND_SUBPATH_RE = /^([^/]+)\/([^/]+)\/(.+)$/;
const SHORTHAND_BASIC_RE = /^([^/]+)\/([^/]+)$/;

const strip = (s: string) => (s.endsWith('.git') ? s.slice(0, -4) : s);

function gh(owner: string, repo: string, extra?: Partial<SkillSource>): SkillSource {
  return { type: 'github', url: `https://github.com/${owner}/${repo}`, owner, repo, ...extra };
}

function assertNoTraversal(subpath: string): void {
  const decoded = decodeURIComponent(subpath);
  if (decoded.split(/[\\/]/).includes('..'))
    throw new Error(`Path traversal detected in subpath: ${subpath}`);
}

/** Parse a skill specifier string into a normalized SkillSource object. */
export function parseSource(input: string): SkillSource {
  const t = input.trim();
  if (!t) throw new Error('Skill source cannot be empty');

  // 1. Local paths: ./ | / | ~
  if (t.startsWith('./') || t.startsWith('/') || t.startsWith('~')) {
    const resolved = t.startsWith('~') ? resolve(homedir(), t.slice(2)) : resolve(t);
    return { type: 'local', url: resolved };
  }

  // 2. GitHub URL with tree path
  let m = t.match(GITHUB_TREE_RE);
  if (m) {
    const [, owner, rawRepo, ref, subpath] = m;
    const repo = strip(rawRepo);
    if (subpath) assertNoTraversal(subpath);
    return gh(owner, repo, { ref, ...(subpath ? { subpath } : {}) });
  }

  // 3. GitHub URL basic
  m = t.match(GITHUB_URL_RE);
  if (m) return gh(m[1], strip(m[2]));

  // 4. Shorthand: owner/repo@skill-name
  m = t.match(SHORTHAND_SKILL_RE);
  if (m) return gh(m[1], m[2], { skillFilter: m[3] });

  // 5. Shorthand: owner/repo/sub/path
  m = t.match(SHORTHAND_SUBPATH_RE);
  if (m) {
    assertNoTraversal(m[3]);
    return gh(m[1], m[2], { subpath: m[3] });
  }

  // 6. Shorthand: owner/repo
  m = t.match(SHORTHAND_BASIC_RE);
  if (m) return gh(m[1], m[2]);

  throw new Error(`Unable to parse skill source: "${t}"`);
}

/**
 * Sanitize a skill name for filesystem and registry use.
 * Lowercases, replaces non-alphanumeric with dashes, strips edges, max 255 chars.
 */
export function sanitizeName(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]/, '')
    .replace(/[-.]$/, '')
    .slice(0, 255);
  return s || 'unnamed-skill';
}
