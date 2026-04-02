// SKL skills.yaml parser - formalized manifest parsing

import { readFile } from 'node:fs/promises';
// @ts-expect-error - js-yaml has no bundled types (transitive dep of gray-matter)
import yaml from 'js-yaml';
import type { SkillsManifest } from './types.js';

/** Runtime type guard for SkillsManifest */
export function validateManifest(data: unknown): data is SkillsManifest {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (!d.registry || typeof d.registry !== 'object') return false;
  const r = d.registry as Record<string, unknown>;
  if (typeof r.name !== 'string' || typeof r.description !== 'string') return false;
  if (!Array.isArray(d.skills)) return false;
  return d.skills.every(
    (s: unknown) =>
      s && typeof s === 'object' &&
      typeof (s as Record<string, unknown>).name === 'string' &&
      typeof (s as Record<string, unknown>).path === 'string',
  );
}

/** Parse and validate a skills.yaml content string. Returns null on any error. */
export function parseSkillsManifest(content: string): SkillsManifest | null {
  try {
    if (!content || !content.trim()) return null;
    const data = yaml.load(content);
    return validateManifest(data) ? (data as SkillsManifest) : null;
  } catch {
    return null;
  }
}

/** Read and parse a skills.yaml from a file path. Returns null if missing or invalid. */
export async function readSkillsManifest(filePath: string): Promise<SkillsManifest | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return parseSkillsManifest(content);
  } catch {
    return null;
  }
}
