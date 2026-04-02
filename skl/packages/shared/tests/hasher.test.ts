import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { computeContentHash, hashString } from '../src/hasher.js';

let tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'skl-hasher-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe('computeContentHash', () => {
  it('produces a 64-char hex SHA-256 for a directory with known content', async () => {
    const dir = makeTempDir();
    writeFileSync(join(dir, 'SKILL.md'), '# Hello\n');
    const hash = await computeContentHash(dir);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('is deterministic - same content always produces same hash', async () => {
    const dir1 = makeTempDir();
    const dir2 = makeTempDir();
    writeFileSync(join(dir1, 'a.txt'), 'content');
    writeFileSync(join(dir1, 'b.txt'), 'more');
    writeFileSync(join(dir2, 'a.txt'), 'content');
    writeFileSync(join(dir2, 'b.txt'), 'more');

    const hash1 = await computeContentHash(dir1);
    const hash2 = await computeContentHash(dir2);
    expect(hash1).toBe(hash2);
  });

  it('normalizes line endings - CRLF and LF produce same hash', async () => {
    const dir1 = makeTempDir();
    const dir2 = makeTempDir();
    writeFileSync(join(dir1, 'file.txt'), 'line1\nline2\n');
    writeFileSync(join(dir2, 'file.txt'), 'line1\r\nline2\r\n');

    const hash1 = await computeContentHash(dir1);
    const hash2 = await computeContentHash(dir2);
    expect(hash1).toBe(hash2);
  });

  it('file order does not matter - alphabetical sorting ensures determinism', async () => {
    const dir1 = makeTempDir();
    const dir2 = makeTempDir();
    // Write in different order but same content
    writeFileSync(join(dir1, 'z.txt'), 'last');
    writeFileSync(join(dir1, 'a.txt'), 'first');
    writeFileSync(join(dir2, 'a.txt'), 'first');
    writeFileSync(join(dir2, 'z.txt'), 'last');

    const hash1 = await computeContentHash(dir1);
    const hash2 = await computeContentHash(dir2);
    expect(hash1).toBe(hash2);
  });

  it('empty directory produces a consistent hash', async () => {
    const dir1 = makeTempDir();
    const dir2 = makeTempDir();

    const hash1 = await computeContentHash(dir1);
    const hash2 = await computeContentHash(dir2);
    expect(hash1).toBe(hash2);
    // SHA-256 of empty string
    expect(hash1).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });

  it('skips node_modules and .git directories', async () => {
    const dir1 = makeTempDir();
    const dir2 = makeTempDir();

    writeFileSync(join(dir1, 'SKILL.md'), '# Test\n');
    writeFileSync(join(dir2, 'SKILL.md'), '# Test\n');

    // Add node_modules and .git to dir2 - should be ignored
    mkdirSync(join(dir2, 'node_modules'));
    writeFileSync(join(dir2, 'node_modules', 'pkg.js'), 'junk');
    mkdirSync(join(dir2, '.git'));
    writeFileSync(join(dir2, '.git', 'HEAD'), 'ref: refs/heads/main');

    const hash1 = await computeContentHash(dir1);
    const hash2 = await computeContentHash(dir2);
    expect(hash1).toBe(hash2);
  });

  it('handles nested subdirectories correctly', async () => {
    const dir = makeTempDir();
    mkdirSync(join(dir, 'references'));
    writeFileSync(join(dir, 'SKILL.md'), '# Skill\n');
    writeFileSync(join(dir, 'references', 'deep.md'), '# Deep\n');

    const hash = await computeContentHash(dir);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('different content produces different hashes', async () => {
    const dir1 = makeTempDir();
    const dir2 = makeTempDir();
    writeFileSync(join(dir1, 'file.txt'), 'aaa');
    writeFileSync(join(dir2, 'file.txt'), 'bbb');

    const hash1 = await computeContentHash(dir1);
    const hash2 = await computeContentHash(dir2);
    expect(hash1).not.toBe(hash2);
  });
});

describe('hashString', () => {
  it('produces consistent results for same input', () => {
    const hash1 = hashString('hello world');
    const hash2 = hashString('hello world');
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it('produces different results for different input', () => {
    expect(hashString('foo')).not.toBe(hashString('bar'));
  });

  it('matches known SHA-256 value', () => {
    // SHA-256 of empty string
    expect(hashString('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});
