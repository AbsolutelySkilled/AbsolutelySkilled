import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// We need to mock GLOBAL_LOCK_PATH before importing the module
let tempHome: string;
let tempDirs: string[] = [];

function makeTempDir(prefix = 'skl-lock-'): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

// Mock constants to use temp dirs instead of real ~/.agents/
vi.mock('../src/constants.js', async (importOriginal) => {
  const orig = (await importOriginal()) as Record<string, unknown>;
  return {
    ...orig,
    get GLOBAL_LOCK_PATH() {
      return join(tempHome, '.skl-lock.json');
    },
  };
});

// Dynamic import after mocks are set up
let lockfile: typeof import('../src/lockfile.js');

beforeEach(async () => {
  tempHome = makeTempDir('skl-home-');
  // Re-import to get fresh module with updated mock
  lockfile = await import('../src/lockfile.js');
});

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

// ---------------------------------------------------------------------------
// Global lock
// ---------------------------------------------------------------------------

describe('readGlobalLock', () => {
  it('returns default when file is missing', async () => {
    const lock = await lockfile.readGlobalLock();
    expect(lock.version).toBe(4);
    expect(lock.skills).toEqual({});
    expect(lock.trustedSources).toEqual([]);
    expect(lock.config.telemetry).toBe(true);
  });

  it('returns default when version mismatches', async () => {
    writeFileSync(
      join(tempHome, '.skl-lock.json'),
      JSON.stringify({ version: 3, skills: { old: {} } }),
    );
    const lock = await lockfile.readGlobalLock();
    expect(lock.version).toBe(4);
    expect(lock.skills).toEqual({});
  });

  it('returns default when file is invalid JSON', async () => {
    writeFileSync(join(tempHome, '.skl-lock.json'), 'not json{{{');
    const lock = await lockfile.readGlobalLock();
    expect(lock.version).toBe(4);
    expect(lock.skills).toEqual({});
  });
});

describe('writeGlobalLock', () => {
  it('creates file with correct format', async () => {
    const lock = lockfile.createDefaultGlobalLock();
    lock.skills['test-skill'] = makeLockEntry();
    await lockfile.writeGlobalLock(lock);

    const raw = readFileSync(join(tempHome, '.skl-lock.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed.version).toBe(4);
    expect(parsed.skills['test-skill']).toBeDefined();
    // Verify 2-space indent and trailing newline
    expect(raw).toMatch(/^\{/);
    expect(raw.endsWith('\n')).toBe(true);
    expect(raw).toContain('  "version"');
  });

  it('sorts skills alphabetically', async () => {
    const lock = lockfile.createDefaultGlobalLock();
    lock.skills['zeta'] = makeLockEntry();
    lock.skills['alpha'] = makeLockEntry();
    lock.skills['mango'] = makeLockEntry();
    await lockfile.writeGlobalLock(lock);

    const raw = readFileSync(join(tempHome, '.skl-lock.json'), 'utf-8');
    const keys = Object.keys(JSON.parse(raw).skills);
    expect(keys).toEqual(['alpha', 'mango', 'zeta']);
  });
});

describe('addSkillToGlobalLock', () => {
  it('adds entry and preserves existing skills', async () => {
    // Write initial lock with one skill
    const lock = lockfile.createDefaultGlobalLock();
    lock.skills['existing'] = makeLockEntry();
    await lockfile.writeGlobalLock(lock);

    // Add a new skill
    await lockfile.addSkillToGlobalLock('new-skill', makeLockEntry());

    const result = await lockfile.readGlobalLock();
    expect(result.skills['existing']).toBeDefined();
    expect(result.skills['new-skill']).toBeDefined();
  });
});

describe('removeSkillFromGlobalLock', () => {
  it('removes the specified skill', async () => {
    const lock = lockfile.createDefaultGlobalLock();
    lock.skills['keep'] = makeLockEntry();
    lock.skills['remove'] = makeLockEntry();
    await lockfile.writeGlobalLock(lock);

    await lockfile.removeSkillFromGlobalLock('remove');

    const result = await lockfile.readGlobalLock();
    expect(result.skills['keep']).toBeDefined();
    expect(result.skills['remove']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Local lock
// ---------------------------------------------------------------------------

describe('readLocalLock', () => {
  it('returns default when file is missing', async () => {
    const dir = makeTempDir();
    const lock = await lockfile.readLocalLock(dir);
    expect(lock.version).toBe(1);
    expect(lock.skills).toEqual({});
  });

  it('returns default when version mismatches', async () => {
    const dir = makeTempDir();
    writeFileSync(
      join(dir, 'skl-lock.json'),
      JSON.stringify({ version: 99, skills: { old: {} } }),
    );
    const lock = await lockfile.readLocalLock(dir);
    expect(lock.version).toBe(1);
    expect(lock.skills).toEqual({});
  });
});

describe('writeLocalLock', () => {
  it('creates deterministic JSON with sorted keys', async () => {
    const dir = makeTempDir();
    const lock = lockfile.createDefaultLocalLock();
    lock.skills['zebra'] = {
      source: 'github',
      contentHash: 'abc',
      declaredVersion: '1.0.0',
    };
    lock.skills['apple'] = {
      source: 'github',
      contentHash: 'def',
      declaredVersion: '2.0.0',
    };
    await lockfile.writeLocalLock(lock, dir);

    const raw = readFileSync(join(dir, 'skl-lock.json'), 'utf-8');
    const keys = Object.keys(JSON.parse(raw).skills);
    expect(keys).toEqual(['apple', 'zebra']);
    expect(raw.endsWith('\n')).toBe(true);
  });
});

describe('addSkillToLocalLock', () => {
  it('adds entry correctly', async () => {
    const dir = makeTempDir();
    await lockfile.addSkillToLocalLock(
      'my-skill',
      { source: 'github', contentHash: 'hash1', declaredVersion: '1.0.0' },
      dir,
    );

    const lock = await lockfile.readLocalLock(dir);
    expect(lock.skills['my-skill']).toEqual({
      source: 'github',
      contentHash: 'hash1',
      declaredVersion: '1.0.0',
    });
  });
});

describe('removeSkillFromLocalLock', () => {
  it('removes the specified skill', async () => {
    const dir = makeTempDir();
    const lock = lockfile.createDefaultLocalLock();
    lock.skills['keep'] = {
      source: 'github',
      contentHash: 'a',
      declaredVersion: '1.0.0',
    };
    lock.skills['remove'] = {
      source: 'github',
      contentHash: 'b',
      declaredVersion: '1.0.0',
    };
    await lockfile.writeLocalLock(lock, dir);

    await lockfile.removeSkillFromLocalLock('remove', dir);

    const result = await lockfile.readLocalLock(dir);
    expect(result.skills['keep']).toBeDefined();
    expect(result.skills['remove']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Vercel Skills migration
// ---------------------------------------------------------------------------

describe('migrateVercelSkillsLock', () => {
  it('maps fields correctly from v3 lock', async () => {
    const dir = makeTempDir();
    const vercelLock = {
      version: 3,
      skills: {
        'my-skill': {
          source: 'github',
          sourceUrl: 'https://github.com/org/repo',
          skillPath: 'skills/my-skill',
          installedAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-06-01T00:00:00Z',
          sourceType: 'git',
          pluginName: 'my-plugin',
          dismissed: false,
        },
      },
    };
    const lockPath = join(dir, 'vercel-lock.json');
    writeFileSync(lockPath, JSON.stringify(vercelLock));

    const result = await lockfile.migrateVercelSkillsLock(lockPath);

    expect(result.count).toBe(1);
    expect(result.skills['my-skill']).toEqual({
      source: 'github',
      sourceUrl: 'https://github.com/org/repo',
      skillPath: 'skills/my-skill',
      installedAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z',
    });
  });

  it('drops sourceType, pluginName, and dismissed fields', async () => {
    const dir = makeTempDir();
    const vercelLock = {
      version: 3,
      skills: {
        'test': {
          source: 'url',
          sourceType: 'http',
          pluginName: 'test-plugin',
          dismissed: true,
          sourceUrl: 'https://example.com',
        },
      },
    };
    const lockPath = join(dir, 'vercel-lock.json');
    writeFileSync(lockPath, JSON.stringify(vercelLock));

    const result = await lockfile.migrateVercelSkillsLock(lockPath);
    const entry = result.skills['test'] as Record<string, unknown>;

    expect(entry).not.toHaveProperty('sourceType');
    expect(entry).not.toHaveProperty('pluginName');
    expect(entry).not.toHaveProperty('dismissed');
  });

  it('returns partial entries without contentHash', async () => {
    const dir = makeTempDir();
    const vercelLock = {
      version: 3,
      skills: {
        'skill-a': { source: 'github' },
        'skill-b': { source: 'url' },
      },
    };
    const lockPath = join(dir, 'vercel-lock.json');
    writeFileSync(lockPath, JSON.stringify(vercelLock));

    const result = await lockfile.migrateVercelSkillsLock(lockPath);

    expect(result.count).toBe(2);
    expect(result.skills['skill-a']).not.toHaveProperty('contentHash');
    expect(result.skills['skill-b']).not.toHaveProperty('contentHash');
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLockEntry(): import('../src/types.js').SKLLockEntry {
  return {
    source: 'github',
    sourceUrl: 'https://github.com/org/repo',
    skillPath: 'skills/test',
    contentHash: 'abc123',
    declaredVersion: '1.0.0',
    auditScore: null,
    installedAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    agents: ['claude-code'],
    hashAtInstall: 'abc123',
  };
}
