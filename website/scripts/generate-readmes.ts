import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SKILLS_DIR = path.resolve(process.cwd(), '../skills');
const SITE = 'https://www.absolutelyskilled.pro';

interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  category: string;
  version: string;
  tags: string[];
  platforms: string[];
  recommended: string[];
  maintainers: { github: string }[];
  license: string;
}

function readSkillMeta(slug: string): SkillMeta {
  const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8');
  const { data } = matter(raw);
  return {
    slug,
    name: data.name || slug,
    description: data.description || '',
    category: data.category || 'uncategorized',
    version: data.version || '0.1.0',
    tags: data.tags || [],
    platforms: data.platforms || [],
    recommended: data.recommended_skills || [],
    maintainers: data.maintainers || [],
    license: data.license || 'MIT',
  };
}

function getOverview(slug: string): string {
  const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8');
  const { content } = matter(raw);

  const bodyLines = content
    .replace(/^When this skill is activated.*\n\n?/m, '')
    .replace(/---\s*\n## Companion check[\s\S]*$/, '')
    .trim();

  const sections = bodyLines.split(/\n## /);
  const overview = sections[0].replace(/^#\s+.*\n\n?/, '').trim();
  return overview.split('\n').slice(0, 18).join('\n');
}

// Build a map of slug -> name for recommended skill descriptions
function buildSkillNameMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const dirs = fs.readdirSync(SKILLS_DIR).filter((d) =>
    fs.existsSync(path.join(SKILLS_DIR, d, 'SKILL.md')),
  );
  for (const slug of dirs) {
    try {
      const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8');
      const { data } = matter(raw);
      map[slug] = data.name || slug;
    } catch {
      map[slug] = slug;
    }
  }
  return map;
}

function generateReadme(meta: SkillMeta, overview: string, nameMap: Record<string, string>): string {
  const lines: string[] = [];

  // Title
  lines.push(`# ${meta.name}\n`);

  // Definition paragraph (AEO-optimized)
  // Clean up description: strip "Use this skill when" prefix and "Triggers on..." suffix for a cleaner opening
  let cleanDesc = meta.description
    .replace(/^Use this skill when\s*/i, '')
    .replace(/\.?\s*Triggers on\b.*/i, '')
    .replace(/\.?\s*Also triggers on\b.*/i, '')
    .replace(/\.?\s*Covers\b.*/i, '')
    .trim();
  // Ensure it doesn't start with lowercase awkwardly
  if (cleanDesc.length > 0) {
    cleanDesc = cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1);
  }
  if (!cleanDesc.endsWith('.')) cleanDesc += '.';

  const platformSuffix = meta.platforms.length > 3
    ? `${meta.platforms.slice(0, 3).join(', ')}, and ${meta.platforms.length - 3} more`
    : meta.platforms.join(', ');
  lines.push(
    `${meta.name} is a production-ready AI agent skill for ${platformSuffix}. ${cleanDesc}\n`,
  );

  // Quick Facts table
  lines.push(`## Quick Facts\n`);
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  lines.push(`| Category | ${meta.category} |`);
  lines.push(`| Version | ${meta.version} |`);
  lines.push(`| Platforms | ${meta.platforms.join(', ')} |`);
  lines.push(`| License | ${meta.license} |`);
  lines.push('');

  // Install
  lines.push(`## How to Install\n`);
  lines.push(`1. Make sure you have Node.js installed on your machine.`);
  lines.push(`2. Run the following command in your terminal:\n`);
  lines.push('```bash');
  lines.push(`npx skills add AbsolutelySkilled/AbsolutelySkilled --skill ${meta.slug}`);
  lines.push('```\n');
  lines.push(
    `3. The ${meta.name} skill is now available in your AI coding agent (Claude Code, Gemini CLI, OpenAI Codex, etc.).\n`,
  );

  // Overview
  if (overview) {
    lines.push(`## Overview\n`);
    lines.push(`${overview}\n`);
  }

  // Tags
  if (meta.tags.length > 0) {
    lines.push(`## Tags\n`);
    lines.push(meta.tags.map((t) => `\`${t}\``).join(' ') + '\n');
  }

  // Platforms
  if (meta.platforms.length > 0) {
    lines.push(`## Platforms\n`);
    lines.push(meta.platforms.map((p) => `- ${p}`).join('\n') + '\n');
  }

  // Related Skills (enriched with descriptions)
  if (meta.recommended.length > 0) {
    lines.push(`## Related Skills\n`);
    lines.push(`Pair ${meta.name} with these complementary skills:\n`);
    lines.push(
      meta.recommended
        .map((s) => {
          const name = nameMap[s] || s;
          return `- [${name}](${SITE}/skill/${s})`;
        })
        .join('\n') + '\n',
    );
  }

  // FAQ section (matches FAQPage schema)
  lines.push(`## Frequently Asked Questions\n`);
  lines.push(`### What is ${meta.name}?\n`);
  lines.push(`${meta.description}\n`);
  lines.push(`### How do I install ${meta.name}?\n`);
  lines.push(
    `Run \`npx skills add AbsolutelySkilled/AbsolutelySkilled --skill ${meta.slug}\` in your terminal. The skill will be immediately available in your AI coding agent.\n`,
  );
  lines.push(`### What AI agents support ${meta.name}?\n`);
  lines.push(
    `This skill works with ${meta.platforms.join(', ')}. Install it once and use it across any supported AI coding agent.\n`,
  );

  // Maintainers
  if (meta.maintainers.length > 0) {
    lines.push(`## Maintainers\n`);
    lines.push(
      meta.maintainers.map((m) => `- [@${m.github}](https://github.com/${m.github})`).join('\n') +
        '\n',
    );
  }

  lines.push(`---\n`);
  lines.push(
    `*Generated from [AbsolutelySkilled](${SITE}/skill/${meta.slug})*`,
  );

  return lines.join('\n');
}

function main() {
  const slugs = fs.readdirSync(SKILLS_DIR).filter((d) => {
    return fs.existsSync(path.join(SKILLS_DIR, d, 'SKILL.md'));
  });

  const nameMap = buildSkillNameMap();
  let generated = 0;

  for (const slug of slugs) {
    try {
      const meta = readSkillMeta(slug);
      const overview = getOverview(slug);
      const readme = generateReadme(meta, overview, nameMap);
      const readmePath = path.join(SKILLS_DIR, slug, 'README.md');
      fs.writeFileSync(readmePath, readme + '\n');
      generated++;
    } catch (err) {
      console.error(`Error generating README for ${slug}:`, err);
    }
  }

  console.log(`Generated ${generated} README files`);
}

main();
