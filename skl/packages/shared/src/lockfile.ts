import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import {
  GLOBAL_LOCK_PATH,
  LOCAL_LOCK_FILENAME,
  LOCK_VERSION,
  LOCAL_LOCK_VERSION,
} from './constants.js';
import type { SKLGlobalLock, SKLLocalLock, SKLLockEntry } from './types.js';

// ---------------------------------------------------------------------------
// Default empty locks
// ---------------------------------------------------------------------------

export function createDefaultGlobalLock(): SKLGlobalLock {
  return {
    version: LOCK_VERSION,
    skills: {},
    trustedSources: [],
    config: {
      telemetry: true,
      defaultAgents: [],
    },
  };
}

export function createDefaultLocalLock(): SKLLocalLock {
  return {
    version: LOCAL_LOCK_VERSION,
    skills: {},
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sort object keys alphabetically, returning a new object */
function sortKeys<T>(obj: Record<string, T>): Record<string, T> {
  const sorted: Record<string, T> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key];
  }
  return sorted;
}

async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

// ---------------------------------------------------------------------------
// Global lock operations
// ---------------------------------------------------------------------------

export async function readGlobalLock(): Promise<SKLGlobalLock> {
  try {
    const raw = await readFile(GLOBAL_LOCK_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as SKLGlobalLock;
    if (parsed.version !== LOCK_VERSION) {
      return createDefaultGlobalLock();
    }
    return parsed;
  } catch {
    return createDefaultGlobalLock();
  }
}

export async function writeGlobalLock(lock: SKLGlobalLock): Promise<void> {
  await ensureDir(dirname(GLOBAL_LOCK_PATH));
  const output: SKLGlobalLock = {
    ...lock,
    skills: sortKeys(lock.skills),
  };
  await writeFile(GLOBAL_LOCK_PATH, JSON.stringify(output, null, 2) + '\n', 'utf-8');
}

export async function addSkillToGlobalLock(
  name: string,
  entry: SKLLockEntry,
): Promise<void> {
  const lock = await readGlobalLock();
  lock.skills[name] = entry;
  await writeGlobalLock(lock);
}

export async function removeSkillFromGlobalLock(name: string): Promise<void> {
  const lock = await readGlobalLock();
  delete lock.skills[name];
  await writeGlobalLock(lock);
}

// ---------------------------------------------------------------------------
// Local lock operations
// ---------------------------------------------------------------------------

function localLockPath(dir?: string): string {
  return join(dir ?? process.cwd(), LOCAL_LOCK_FILENAME);
}

export async function readLocalLock(dir?: string): Promise<SKLLocalLock> {
  try {
    const raw = await readFile(localLockPath(dir), 'utf-8');
    const parsed = JSON.parse(raw) as SKLLocalLock;
    if (parsed.version !== LOCAL_LOCK_VERSION) {
      return createDefaultLocalLock();
    }
    return parsed;
  } catch {
    return createDefaultLocalLock();
  }
}

export async function writeLocalLock(
  lock: SKLLocalLock,
  dir?: string,
): Promise<void> {
  const output: SKLLocalLock = {
    ...lock,
    skills: sortKeys(lock.skills),
  };
  const filePath = localLockPath(dir);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
}

export async function addSkillToLocalLock(
  name: string,
  entry: { source: string; contentHash: string; declaredVersion: string },
  dir?: string,
): Promise<void> {
  const lock = await readLocalLock(dir);
  lock.skills[name] = entry;
  await writeLocalLock(lock, dir);
}

export async function removeSkillFromLocalLock(
  name: string,
  dir?: string,
): Promise<void> {
  const lock = await readLocalLock(dir);
  delete lock.skills[name];
  await writeLocalLock(lock, dir);
}

// ---------------------------------------------------------------------------
// Vercel Skills migration helper
// ---------------------------------------------------------------------------

export async function migrateVercelSkillsLock(
  vercelLockPath: string,
): Promise<{ skills: Record<string, Partial<SKLLockEntry>>; count: number }> {
  const raw = await readFile(vercelLockPath, 'utf-8');
  const parsed = JSON.parse(raw) as {
    version: number;
    skills: Record<string, Record<string, unknown>>;
  };

  const skills: Record<string, Partial<SKLLockEntry>> = {};
  let count = 0;

  for (const [name, entry] of Object.entries(parsed.skills)) {
    const mapped: Partial<SKLLockEntry> = {};

    // Map supported fields
    if (typeof entry.source === 'string') mapped.source = entry.source;
    if (typeof entry.sourceUrl === 'string') mapped.sourceUrl = entry.sourceUrl;
    if (typeof entry.skillPath === 'string') mapped.skillPath = entry.skillPath;
    if (typeof entry.installedAt === 'string') mapped.installedAt = entry.installedAt;
    if (typeof entry.updatedAt === 'string') mapped.updatedAt = entry.updatedAt;

    // Dropped fields: sourceType, pluginName, dismissed
    // contentHash needs recomputation so it's not mapped

    skills[name] = mapped;
    count++;
  }

  return { skills, count };
}
