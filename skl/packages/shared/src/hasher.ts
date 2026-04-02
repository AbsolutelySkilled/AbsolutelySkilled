import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { SKIP_DIRS } from './constants.js';

// ---------------------------------------------------------------------------
// Deterministic SHA-256 content hashing for skill directories
// ---------------------------------------------------------------------------

/**
 * Recursively list all files in `dir`, sorted alphabetically by relative path.
 * Skips directories in SKIP_DIRS.
 */
async function listFiles(dir: string, base: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await listFiles(join(dir, entry.name), base)));
    } else {
      files.push(relative(base, join(dir, entry.name)));
    }
  }

  return files;
}

/**
 * Compute a deterministic SHA-256 hash of a skill directory's contents.
 *
 * Algorithm:
 * 1. List all files recursively (sorted alphabetically, skipping SKIP_DIRS)
 * 2. For each file: normalize path to forward slashes, read as UTF-8, normalize line endings
 * 3. Concatenate "relativePath\0content\0" for each file
 * 4. Return SHA-256 hex digest
 */
export async function computeContentHash(skillDir: string): Promise<string> {
  const files = (await listFiles(skillDir, skillDir)).sort();
  const hash = createHash('sha256');

  for (const file of files) {
    const normalizedPath = file.replace(/\\/g, '/');
    const content = (await readFile(join(skillDir, file), 'utf-8')).replace(
      /\r\n/g,
      '\n',
    );
    hash.update(`${normalizedPath}\0${content}\0`);
  }

  return hash.digest('hex');
}

/** SHA-256 hash a plain string, returning hex. Used by the lockfile module. */
export function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}
