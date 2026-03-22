import type { Skill } from './skills';

const SITE = 'https://absolutely-skilled.vercel.app';
const SITE_NAME = 'AbsolutelySkilled';
const DEFAULT_DESCRIPTION = 'A registry of 161+ production-ready skills for AI coding agents. Browse, search, and install skills for Claude Code, Gemini CLI, OpenAI Codex, and more.';

export function getHomePageSEO() {
  return {
    title: `${SITE_NAME} - AI Agent Skills Registry`,
    description: DEFAULT_DESCRIPTION,
    canonical: SITE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE,
      description: DEFAULT_DESCRIPTION,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  };
}

export function getSkillPageSEO(skill: Skill, installCount: number) {
  const title = `${skill.name} - ${SITE_NAME}`;
  const description = skill.description.slice(0, 160);

  return {
    title,
    description,
    canonical: `${SITE}/skill/${skill.slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: skill.name,
      description: skill.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      url: `${SITE}/skill/${skill.slug}`,
      version: skill.version,
      license: `https://opensource.org/licenses/${skill.license}`,
      installUrl: `https://skills.sh/registry/absolutelyskilled/absolutelyskilled/${skill.slug}`,
      aggregateRating: installCount > 0 ? { '@type': 'AggregateRating', ratingCount: installCount } : undefined,
      author: skill.maintainers.map((m) => ({
        '@type': 'Person',
        url: `https://github.com/${m.github}`,
      })),
    },
  };
}

export function getCategoryPageSEO(category: string, label: string, count: number) {
  const title = `${label} Skills - ${SITE_NAME}`;
  const description = `Browse ${count} ${label.toLowerCase()} skills for AI coding agents. Install production-ready skills for Claude Code, Gemini CLI, and more.`;

  return {
    title,
    description,
    canonical: `${SITE}/category/${category}`,
  };
}

export function getBlogPostSEO(post: { title: string; description: string; slug: string; date: string; author: string }) {
  return {
    title: `${post.title} - ${SITE_NAME} Blog`,
    description: post.description,
    canonical: `${SITE}/blog/${post.slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${SITE}/blog/${post.slug}`,
      datePublished: post.date,
      author: { '@type': 'Person', name: post.author },
      publisher: { '@type': 'Organization', name: SITE_NAME },
    },
  };
}
