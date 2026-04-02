// SKL Fetcher - clone repos and discover skills within them

import { mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { simpleGit, type SimpleGit } from 'simple-git';
import matter from 'gray-matter';
// @ts-expect-error - js-yaml has no bundled types (transitive dep of gray-matter)
import yaml from 'js-yaml';

import type { DiscoveredSkill, SkillSource, SkillsManifest } from './types.js';
import {
  CLONE_TIMEOUT_MS,
  MAX_DISCOVERY_DEPTH,
  PRIORITY_SUBDIRS,
  SKIP_DIRS,
} from './constants.js';
import { getGitHubToken } from './auth.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface FetchResult {
  source: SkillSource;
  tempDir: string;
  commitHash: string;
  skills: DiscoveredSkill[];
}

// ---------------------------------------------------------------------------
// fetchSkills - main entry point
// ---------------------------------------------------------------------------

export async function fetchSkills(source: SkillSource): Promise<FetchResult> {
  let dir: string;
  let commitHash = '';

  if (source.type === 'local') {
    dir = resolve(source.url);
  } else {
    // Clone to temp directory
    const tempDir = join(tmpdir(), `skl-fetch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    await mkdir(tempDir, { recursive: true });
    dir = tempDir;

    const cloneUrl = await buildCloneUrl(source);
    const git: SimpleGit = simpleGit({
      timeout: { block: CLONE_TIMEOUT_MS },
    }).env('GIT_TERMINAL_PROMPT', '0');

    const cloneArgs = ['--depth', '1'];
    if (source.ref) {
      cloneArgs.push('--branch', source.ref);
    }

    await git.clone(cloneUrl, tempDir, cloneArgs);

    // Get commit hash
    const repoGit = simpleGit(tempDir);
    const log = await repoGit.log({ maxCount: 1 });
    commitHash = log.latest?.hash ?? '';
  }

  // Determine search root
  const searchRoot = source.subpath ? join(dir, source.subpath) : dir;

  // Discover skills
  let skills = await discoverSkills(searchRoot);

  // Apply skill filter if specified
  if (source.skillFilter) {
    const filter = source.skillFilter.toLowerCase();
    skills = skills.filter((s) => s.name.toLowerCase() === filter);
  }

  return {
    source,
    tempDir: dir,
    commitHash,
    skills,
  };
}

// ---------------------------------------------------------------------------
// discoverSkills - find SKILL.md files in a directory
// ---------------------------------------------------------------------------

export async function discoverSkills(dir: string): Promise<DiscoveredSkill[]> {
  const resolvedDir = resolve(dir);
  const skills: DiscoveredSkill[] = [];

  // 1. Check for skills.yaml manifest
  const manifestPath = join(resolvedDir, 'skills.yaml');
  try {
    const manifestRaw = await readFile(manifestPath, 'utf-8');
    const manifest = yaml.load(manifestRaw) as SkillsManifest;
    if (manifest?.skills?.length) {
      for (const entry of manifest.skills) {
        const skillMdPath = join(resolvedDir, entry.path, 'SKILL.md');
        const skill = await parseSkillMd(skillMdPath, entry.path);
        if (skill) skills.push(skill);
      }
      return skills.sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch {
    // No manifest or parse error - fall through to scanning
  }

  // 2. Scan for SKILL.md files
  const seen = new Set<string>();

  // 2a. Check root dir
  const rootSkill = await parseSkillMd(join(resolvedDir, 'SKILL.md'), '.');
  if (rootSkill) {
    skills.push(rootSkill);
    seen.add(resolvedDir);
  }

  // 2b. Check PRIORITY_SUBDIRS
  for (const sub of PRIORITY_SUBDIRS) {
    const subDir = join(resolvedDir, sub);
    try {
      const s = await stat(subDir);
      if (s.isDirectory()) {
        await scanDir(subDir, resolvedDir, skills, seen, 1);
      }
    } catch {
      // Directory doesn't exist - skip
    }
  }

  // 2c. Recursive search of remaining directories
  await scanDir(resolvedDir, resolvedDir, skills, seen, 0);

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// cleanupFetch - safely remove temp directory
// ---------------------------------------------------------------------------

export async function cleanupFetch(result: FetchResult): Promise<void> {
  // Nothing to clean up for local sources
  if (result.source.type === 'local') return;

  const { realpathSync } = await import('node:fs');
  let tempBase: string;
  let resolved: string;
  try {
    tempBase = realpathSync(tmpdir());
    resolved = realpathSync(resolve(result.tempDir));
  } catch {
    throw new Error(
      `Refusing to remove directory outside tmpdir: ${result.tempDir}`,
    );
  }

  // Safety: only remove dirs inside OS tmpdir
  if (!resolved.startsWith(tempBase)) {
    throw new Error(
      `Refusing to remove directory outside tmpdir: ${resolved} (tmpdir: ${tempBase})`,
    );
  }

  await rm(resolved, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function buildCloneUrl(source: SkillSource): Promise<string> {
  if (source.type !== 'github') return source.url;

  const token = await getGitHubToken();
  if (token && source.owner && source.repo) {
    return `https://x-access-token:${token}@github.com/${source.owner}/${source.repo}.git`;
  }
  return `https://github.com/${source.owner}/${source.repo}.git`;
}

async function parseSkillMd(
  filePath: string,
  skillPath: string,
): Promise<DiscoveredSkill | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const { data } = matter(content);
    const name = typeof data.name === 'string' ? data.name : '';
    const description = typeof data.description === 'string' ? data.description : '';
    if (!name) return null;
    return { name, description, skillPath, content };
  } catch {
    return null;
  }
}

async function scanDir(
  dir: string,
  rootDir: string,
  skills: DiscoveredSkill[],
  seen: Set<string>,
  depth: number,
): Promise<void> {
  if (depth > MAX_DISCOVERY_DEPTH) return;

  const resolved = resolve(dir);
  if (seen.has(resolved)) return;
  seen.add(resolved);

  let entries;
  try {
    entries = await readdir(resolved, { withFileTypes: true });
  } catch {
    return;
  }

  // Check for SKILL.md in this directory
  const hasSkillMd = entries.some((e) => e.isFile() && e.name === 'SKILL.md');
  if (hasSkillMd) {
    const rel = relative(rootDir, resolved) || '.';
    const skill = await parseSkillMd(join(resolved, 'SKILL.md'), rel);
    if (skill && !skills.some((s) => s.skillPath === skill.skillPath)) {
      skills.push(skill);
    }
  }

  // Recurse into subdirectories
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    await scanDir(join(resolved, entry.name), rootDir, skills, seen, depth + 1);
  }
}
