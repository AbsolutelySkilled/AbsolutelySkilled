import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SKILLS_DIR = path.resolve(process.cwd(), '../skills');

function generateReadme(slug: string): string {
  const skillPath = path.join(SKILLS_DIR, slug, 'SKILL.md');
  const raw = fs.readFileSync(skillPath, 'utf-8');
  const { data, content } = matter(raw);

  const name = data.name || slug;
  const description = data.description || '';
  const tags: string[] = data.tags || [];
  const platforms: string[] = data.platforms || [];
  const recommended: string[] = data.recommended_skills || [];
  const maintainers: { github: string }[] = data.maintainers || [];

  // Extract first meaningful section from body (after activation line)
  const bodyLines = content
    .replace(/^When this skill is activated.*\n\n?/m, '')
    .replace(/---\s*\n## Companion check[\s\S]*$/, '')
    .trim();

  // Get first section (up to second h2)
  const sections = bodyLines.split(/\n## /);
  const overview = sections[0].replace(/^#\s+.*\n\n?/, '').trim();
  const overviewTruncated = overview.split('\n').slice(0, 10).join('\n');

  const lines: string[] = [];
  lines.push(`# ${name}\n`);
  lines.push(`${description.trim()}\n`);
  lines.push(`## Install\n`);
  lines.push('```bash');
  lines.push(`npx skills add AbsolutelySkilled/AbsolutelySkilled --skill ${slug}`);
  lines.push('```\n');

  if (overviewTruncated) {
    lines.push(`## Overview\n`);
    lines.push(`${overviewTruncated}\n`);
  }

  if (tags.length > 0) {
    lines.push(`## Tags\n`);
    lines.push(tags.map((t) => `\`${t}\``).join(' ') + '\n');
  }

  if (platforms.length > 0) {
    lines.push(`## Platforms\n`);
    lines.push(platforms.map((p) => `- ${p}`).join('\n') + '\n');
  }

  if (recommended.length > 0) {
    lines.push(`## Recommended Skills\n`);
    lines.push(
      recommended
        .map((s) => `- [${s}](https://absolutely-skilled.vercel.app/skill/${s})`)
        .join('\n') + '\n'
    );
  }

  if (maintainers.length > 0) {
    lines.push(`## Maintainers\n`);
    lines.push(
      maintainers
        .map((m) => `- [@${m.github}](https://github.com/${m.github})`)
        .join('\n') + '\n'
    );
  }

  lines.push(`---\n`);
  lines.push(`*Generated from [AbsolutelySkilled](https://absolutely-skilled.vercel.app/skill/${slug})*`);

  return lines.join('\n');
}

function main() {
  const slugs = fs.readdirSync(SKILLS_DIR).filter((d) => {
    return fs.existsSync(path.join(SKILLS_DIR, d, 'SKILL.md'));
  });

  let generated = 0;

  for (const slug of slugs) {
    try {
      const readme = generateReadme(slug);
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
