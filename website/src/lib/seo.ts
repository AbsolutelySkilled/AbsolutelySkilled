import type { Skill } from './skills';
import { getCategoryMeta } from './categories';

const SITE = 'https://www.absolutelyskilled.pro';
const SITE_NAME = 'AbsolutelySkilled';
const DEFAULT_DESCRIPTION =
  'A registry of 161+ production-ready skills for AI coding agents. Browse, search, and install skills for Claude Code, Gemini CLI, OpenAI Codex, and more.';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getHomePageSEO() {
  const faqEntries = [
    {
      q: 'What is AbsolutelySkilled?',
      a: 'AbsolutelySkilled is an open-source registry of 161+ production-ready skills for AI coding agents. Skills teach AI agents like Claude Code, Gemini CLI, and OpenAI Codex specialized knowledge - from software engineering to marketing strategy.',
    },
    {
      q: 'What AI agents are supported?',
      a: 'AbsolutelySkilled skills work with Claude Code, Gemini CLI, OpenAI Codex, and 40+ other AI coding agents that support the skills protocol.',
    },
    {
      q: 'How do I install a skill?',
      a: 'Run npx skills add AbsolutelySkilled/AbsolutelySkilled --skill <skill-name> in your terminal. The skill is immediately available in your AI agent.',
    },
    {
      q: 'Are skills free to use?',
      a: 'Yes, all skills in the AbsolutelySkilled registry are free and open source under the MIT license.',
    },
    {
      q: 'How do I contribute a skill?',
      a: 'Fork the GitHub repository, create a skill folder with a SKILL.md and evals.json, then submit a pull request. See the CONTRIBUTING.md guide for details.',
    },
  ];

  return {
    title: `${SITE_NAME} - AI Agent Skills Registry | Teach Your AI Anything`,
    description: DEFAULT_DESCRIPTION,
    canonical: SITE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE,
          description: DEFAULT_DESCRIPTION,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE}/skills?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE,
          logo: `${SITE}/logo.png`,
          sameAs: [
            'https://github.com/AbsolutelySkilled/AbsolutelySkilled',
            'https://www.npmjs.com/package/skills',
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqEntries.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        },
      ],
    },
    faqEntries,
  };
}

export function getSkillPageSEO(skill: Skill, installCount: number) {
  const platformNames = skill.platforms.slice(0, 3).join(', ');
  // Pick the most descriptive tag for the title (prefer longer, multi-word tags)
  const categoryMeta = getCategoryMeta(skill.category);
  const bestTag = [...skill.tags]
    .filter((t) => t !== skill.slug && t.length > 3)
    .sort((a, b) => b.length - a.length)[0];
  const titleKeyword = bestTag
    ? bestTag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : categoryMeta.label;
  const titleSuffix = titleKeyword ? ` - ${titleKeyword}` : '';
  const title = `${skill.name}${titleSuffix} | AI Agent Skill | ${SITE_NAME}`.slice(0, 70);
  const descBase = skill.description.slice(0, 100);
  const description = `${skill.name} is a production-ready AI agent skill for ${platformNames}. ${descBase}. Install with one command.`.slice(0, 160);
  const image = `/og/${skill.slug}.png`;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: SITE },
    { name: categoryMeta.label, url: `${SITE}/category/${skill.category}` },
    { name: skill.name, url: `${SITE}/skill/${skill.slug}` },
  ];

  const faqEntries = [
    {
      q: `What is ${skill.name}?`,
      a: skill.description,
    },
    {
      q: `How do I install ${skill.name}?`,
      a: `Run npx skills add AbsolutelySkilled/AbsolutelySkilled --skill ${skill.slug} in your terminal. The skill will be immediately available in your AI coding agent.`,
    },
    {
      q: `What AI agents support ${skill.name}?`,
      a: `${skill.name} works with ${skill.platforms.join(', ')}. Install it once and use it across any supported AI coding agent.`,
    },
    {
      q: `Is ${skill.name} free?`,
      a: `Yes, ${skill.name} is completely free and open source under the MIT license. Install it with a single command and start using it immediately.`,
    },
    {
      q: `What is the difference between ${skill.name} and similar tools?`,
      a: `${skill.name} is an AI agent skill that teaches your coding agent specialized ${categoryMeta.label.toLowerCase()} knowledge. Unlike standalone tools, it integrates directly into ${platformNames} and other AI agents.`,
    },
    {
      q: `Can I use ${skill.name} with Cursor or Windsurf?`,
      a: `${skill.name} works with any AI coding agent that supports the skills protocol, including Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, and 40+ more.`,
    },
  ];

  return {
    title,
    description,
    image,
    canonical: `${SITE}/skill/${skill.slug}`,
    breadcrumbs,
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
      downloadUrl: `https://skills.sh/registry/absolutelyskilled/absolutelyskilled/${skill.slug}`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: skill.maintainers.map((m) => ({
        '@type': 'Person',
        url: `https://github.com/${m.github}`,
      })),
    },
    additionalJsonLd: [
      getBreadcrumbJsonLd(breadcrumbs),
      // FAQPage: won't generate rich results (restricted Aug 2023) but aids AI citation
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqEntries.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
    faqEntries,
  };
}

export function getCategoryPageSEO(
  category: string,
  label: string,
  count: number,
  skillItems: { name: string; slug: string }[],
) {
  const title = `${label} AI Agent Skills (${count}) | ${SITE_NAME}`;
  const description = `Browse ${count} ${label.toLowerCase()} skills for AI coding agents. Production-ready skills for Claude Code, Gemini CLI, and more. Install with one command.`;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: SITE },
    { name: label, url: `${SITE}/category/${category}` },
  ];

  return {
    title,
    description,
    image: `/og/category-${category}.png`,
    canonical: `${SITE}/category/${category}`,
    breadcrumbs,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${label} AI Agent Skills`,
      description,
      url: `${SITE}/category/${category}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: count,
        itemListElement: skillItems.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.name,
          url: `${SITE}/skill/${s.slug}`,
        })),
      },
    },
    additionalJsonLd: [getBreadcrumbJsonLd(breadcrumbs)],
  };
}

export function getSkillsPageSEO(
  totalCount: number,
  skillItems: { name: string; slug: string }[] = [],
) {
  const title = `All ${totalCount} AI Agent Skills | ${SITE_NAME}`;
  const description = `Browse all ${totalCount} production-ready AI agent skills. Search by name, filter by category, and find the perfect skill for Claude Code, Gemini CLI, and more.`;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: SITE },
    { name: 'All Skills', url: `${SITE}/skills` },
  ];

  return {
    title,
    description,
    canonical: `${SITE}/skills`,
    breadcrumbs,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `All AI Agent Skills`,
      description,
      url: `${SITE}/skills`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: totalCount,
        itemListElement: skillItems.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.name,
          url: `${SITE}/skill/${s.slug}`,
        })),
      },
    },
    additionalJsonLd: [getBreadcrumbJsonLd(breadcrumbs)],
  };
}

export function getAgentPageSEO(agent: {
  slug: string;
  name: string;
  tagline: string;
  description: string;
}, skillCount: number) {
  const title = `${agent.name} Skills - Teach ${agent.name} Anything | ${SITE_NAME}`.slice(0, 70);
  const description = `${agent.description}`.slice(0, 160);

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: SITE },
    { name: 'Agents', url: `${SITE}/agents` },
    { name: agent.name, url: `${SITE}/agents/${agent.slug}` },
  ];

  const faqEntries = [
    {
      q: `What skills are available for ${agent.name}?`,
      a: `AbsolutelySkilled offers ${skillCount}+ production-ready skills for ${agent.name} across software engineering, marketing, design, DevOps, AI/ML, and more. All skills are free and open source.`,
    },
    {
      q: `How do I install skills for ${agent.name}?`,
      a: `Run npx skills add AbsolutelySkilled/AbsolutelySkilled --skill <skill-name> in your terminal. The skill will be immediately available in ${agent.name}.`,
    },
    {
      q: `Are ${agent.name} skills free?`,
      a: `Yes, all skills in the AbsolutelySkilled registry are free and open source under the MIT license. Install as many as you need.`,
    },
    {
      q: `Can I create custom skills for ${agent.name}?`,
      a: `Yes, you can create custom skills by following the CONTRIBUTING.md guide. Each skill is a markdown file with structured knowledge that any supported AI agent can use.`,
    },
  ];

  return {
    title,
    description,
    canonical: `${SITE}/agents/${agent.slug}`,
    breadcrumbs,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${agent.name} Skills`,
      description,
      url: `${SITE}/agents/${agent.slug}`,
    },
    additionalJsonLd: [
      getBreadcrumbJsonLd(breadcrumbs),
      // FAQPage: won't generate rich results (restricted Aug 2023) but aids AI citation
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqEntries.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
    faqEntries,
  };
}

export function getBlogPostSEO(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  image?: string;
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: SITE },
    { name: 'Blog', url: `${SITE}/blog` },
    { name: post.title, url: `${SITE}/blog/${post.slug}` },
  ];

  return {
    title: `${post.title} - ${SITE_NAME} Blog`,
    description: post.description,
    image: `/og/blog-${post.slug}.png`,
    canonical: `${SITE}/blog/${post.slug}`,
    breadcrumbs,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${SITE}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.date,
      image: post.image ? `${SITE}${post.image}` : `${SITE}/og/blog-${post.slug}.png`,
      author: { '@type': 'Person', name: post.author },
      publisher: { '@type': 'Organization', name: SITE_NAME },
    },
    additionalJsonLd: [getBreadcrumbJsonLd(breadcrumbs)],
  };
}

export function getBlogIndexSEO() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: SITE },
    { name: 'Blog', url: `${SITE}/blog` },
  ];

  return {
    title: `Blog - AI Agent Skills Guides | ${SITE_NAME}`,
    description:
      'Guides, tutorials, and insights about AI agent skills. Learn how to teach your AI coding agent new capabilities with production-ready skills.',
    canonical: `${SITE}/blog`,
    breadcrumbs,
    additionalJsonLd: [getBreadcrumbJsonLd(breadcrumbs)],
  };
}
