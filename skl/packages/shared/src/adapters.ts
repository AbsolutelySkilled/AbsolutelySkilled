import matter from 'gray-matter';
import type { SkillMetadata } from './types.js';

export type AdapterType = 'skill-md' | 'mdc' | 'generic-md';
export type AdapterFn = (skillMd: string, meta: SkillMetadata) => string;

/** Strip YAML frontmatter, return markdown body only. */
export function stripFrontmatter(md: string): string {
  try {
    return matter(md).content.replace(/^\n+/, '');
  } catch {
    return md;
  }
}

/** Strip frontmatter AND the first # or ## heading found in the body. */
export function extractBody(md: string): string {
  const body = stripFrontmatter(md);
  return body.replace(/^#{1,2}\s+[^\n]+\n*/m, '').replace(/^\n+/, '');
}

export const ADAPTERS: Record<AdapterType, AdapterFn> = {
  'skill-md': (content) => content,
  'mdc': (content) => stripFrontmatter(content),
  'generic-md': (content) => extractBody(content),
};

/** Transform SKILL.md content for a target agent format. */
export function adaptSkill(
  content: string,
  meta: SkillMetadata,
  adapterType: AdapterType,
): string {
  return ADAPTERS[adapterType](content, meta);
}
