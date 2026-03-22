import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SKILLS_DIR = path.resolve(process.cwd(), '../skills');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SITE = 'https://www.absolutelyskilled.pro';

interface SkillInfo {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  platforms: string[];
}

function readAllSkills(): SkillInfo[] {
  const dirs = fs.readdirSync(SKILLS_DIR).filter((d) => {
    return fs.existsSync(path.join(SKILLS_DIR, d, 'SKILL.md'));
  });

  return dirs
    .map((slug) => {
      const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        name: data.name || slug,
        description: data.description || '',
        category: data.category || 'uncategorized',
        tags: data.tags || [],
        platforms: data.platforms || [],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function groupByCategory(skills: SkillInfo[]): Record<string, SkillInfo[]> {
  const grouped: Record<string, SkillInfo[]> = {};
  for (const skill of skills) {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  }
  return grouped;
}

function generateLlmsTxt(skills: SkillInfo[]): string {
  const grouped = groupByCategory(skills);
  const categories = Object.entries(grouped)
    .sort(([, a], [, b]) => b.length - a.length);

  const lines: string[] = [];
  lines.push('# AbsolutelySkilled');
  lines.push('');
  lines.push(`> A registry of ${skills.length}+ production-ready skills for AI coding agents like Claude Code, Gemini CLI, and OpenAI Codex. Skills teach AI agents specialized knowledge across software engineering, marketing, design, operations, and more.`);
  lines.push('');
  lines.push('## Skills Categories');
  lines.push('');
  for (const [category, catSkills] of categories) {
    lines.push(`- [${category}](${SITE}/category/${category}): ${catSkills.length} skills`);
  }
  lines.push('');
  lines.push('## Key Pages');
  lines.push('');
  lines.push(`- [All Skills](${SITE}/skills): Browse and search all ${skills.length} skills`);
  lines.push(`- [Blog](${SITE}/blog): Guides and tutorials`);
  lines.push(`- [GitHub](https://github.com/AbsolutelySkilled/AbsolutelySkilled): Source code and contributions`);
  lines.push('');
  lines.push('## Install Any Skill');
  lines.push('');
  lines.push('```');
  lines.push('npx skills add AbsolutelySkilled/AbsolutelySkilled --skill <skill-name>');
  lines.push('```');
  lines.push('');
  lines.push('## Optional');
  lines.push('');
  lines.push(`- [Full skill catalog](${SITE}/llms-full.txt): Complete details for every skill`);

  return lines.join('\n') + '\n';
}

function generateLlmsFullTxt(skills: SkillInfo[]): string {
  const grouped = groupByCategory(skills);
  const categories = Object.entries(grouped)
    .sort(([, a], [, b]) => b.length - a.length);

  const lines: string[] = [];
  lines.push('# AbsolutelySkilled - Full Skill Catalog');
  lines.push('');
  lines.push(`> ${skills.length}+ production-ready skills for AI coding agents.`);
  lines.push('');

  for (const [category, catSkills] of categories) {
    lines.push(`## ${category} (${catSkills.length} skills)`);
    lines.push('');
    for (const skill of catSkills) {
      lines.push(`### ${skill.name}`);
      lines.push('');
      lines.push(skill.description);
      lines.push('');
      lines.push(`- URL: ${SITE}/skill/${skill.slug}`);
      lines.push(`- Install: \`npx skills add AbsolutelySkilled/AbsolutelySkilled --skill ${skill.slug}\``);
      lines.push(`- Tags: ${skill.tags.join(', ')}`);
      lines.push(`- Platforms: ${skill.platforms.join(', ')}`);
      lines.push('');
    }
  }

  return lines.join('\n') + '\n';
}

function main() {
  const skills = readAllSkills();

  const llmsTxt = generateLlmsTxt(skills);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt);
  console.log(`Generated llms.txt (${skills.length} skills)`);

  const llmsFullTxt = generateLlmsFullTxt(skills);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullTxt);
  console.log(`Generated llms-full.txt (${skills.length} skills)`);
}

main();
