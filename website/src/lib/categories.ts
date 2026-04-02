export interface CategoryMeta {
  slug: string;
  label: string;
  color: string;
  icon: string;
  description: string;
}

// All category colors at uniform OKLCH L=0.72 for perceptual consistency across hues
export const CATEGORIES: Record<string, CategoryMeta> = {
  engineering: {
    slug: 'engineering',
    label: 'Software Engineering',
    color: 'oklch(0.72 0.14 250)',
    icon: 'ENG',
    description:
      'Software engineering skills that help AI agents write clean, tested, production-ready code. Covers React, TypeScript, system design, API development, testing, and more. Best practices and coding standards for AI-powered development.',
  },
  operations: {
    slug: 'operations',
    label: 'Operations',
    color: 'oklch(0.72 0.14 55)',
    icon: 'OPS',
    description:
      'Operations skills for AI agents covering project management, agile workflows, hiring, compliance, and business process optimization.',
  },
  marketing: {
    slug: 'marketing',
    label: 'Marketing',
    color: 'oklch(0.72 0.14 350)',
    icon: 'MKT',
    description:
      'Marketing skills for AI agents spanning SEO, content strategy, email marketing, social media, growth hacking, and competitive analysis. AI-powered marketing tools and automation for modern teams.',
  },
  'ai-ml': {
    slug: 'ai-ml',
    label: 'AI & Machine Learning',
    color: 'oklch(0.72 0.16 300)',
    icon: 'AI',
    description:
      'AI and machine learning skills for building LLM apps, prompt engineering, computer vision, NLP, and ML operations pipelines. Build and deploy AI agents with production-ready frameworks.',
  },
  design: {
    slug: 'design',
    label: 'UI/UX & Design',
    color: 'oklch(0.72 0.10 200)',
    icon: 'UX',
    description:
      'Design skills for AI agents covering UI/UX design, accessibility, responsive layouts, design systems, color theory, and motion design. AI tools for building beautiful, accessible interfaces.',
  },
  product: {
    slug: 'product',
    label: 'Product Management',
    color: 'oklch(0.72 0.16 155)',
    icon: 'PM',
    description:
      'Product management skills for AI agents including product strategy, user stories, product analytics, discovery, and launch planning.',
  },
  devtools: {
    slug: 'devtools',
    label: 'Developer Tools',
    color: 'oklch(0.82 0.14 90)',
    icon: 'DEV',
    description:
      'Developer tools skills for AI agents covering CLI design, Git workflows, debugging, shell scripting, Vim/Neovim, and monorepo management. Boost developer productivity with AI-powered tooling.',
  },
  sales: {
    slug: 'sales',
    label: 'Sales',
    color: 'oklch(0.68 0.18 25)',
    icon: 'SLS',
    description:
      'Sales skills for AI agents spanning CRM management, sales playbooks, lead scoring, pricing strategy, and sales enablement.',
  },
  data: {
    slug: 'data',
    label: 'Data Engineering',
    color: 'oklch(0.72 0.12 180)',
    icon: 'DAT',
    description:
      'Data engineering skills for AI agents covering data pipelines, data quality, warehousing, analytics engineering, and real-time streaming.',
  },
  infra: {
    slug: 'infra',
    label: 'Infrastructure',
    color: 'oklch(0.72 0.14 280)',
    icon: 'INF',
    description:
      'Infrastructure skills for AI agents covering Docker, Kubernetes, Terraform, CI/CD pipelines, and cloud architecture. Infrastructure as code and DevOps automation with AI assistance.',
  },
  monitoring: {
    slug: 'monitoring',
    label: 'Monitoring',
    color: 'oklch(0.78 0.16 130)',
    icon: 'MON',
    description:
      'Monitoring and observability skills for AI agents covering logging, metrics, distributed tracing, alerting, and site reliability engineering.',
  },
  cloud: {
    slug: 'cloud',
    label: 'Cloud',
    color: 'oklch(0.72 0.12 230)',
    icon: 'CLD',
    description:
      'Cloud computing skills for AI agents spanning AWS, GCP, cloud security, and cloud-native architecture patterns.',
  },
  writing: {
    slug: 'writing',
    label: 'Technical Writing',
    color: 'oklch(0.78 0.14 80)',
    icon: 'WRT',
    description:
      'Technical writing skills for AI agents covering documentation, internal docs, API references, tutorials, and developer-facing prose.',
  },
  workflow: {
    slug: 'workflow',
    label: 'Workflow',
    color: 'oklch(0.72 0.14 165)',
    icon: 'WFL',
    description:
      'Workflow automation skills for AI agents covering no-code tools, process automation, and productivity optimization.',
  },
  analytics: {
    slug: 'analytics',
    label: 'Analytics',
    color: 'oklch(0.72 0.16 290)',
    icon: 'ANL',
    description:
      'Analytics skills for AI agents covering product analytics, SaaS metrics, data science, and business intelligence.',
  },
  'game-development': {
    slug: 'game-development',
    label: 'Game Development',
    color: 'oklch(0.72 0.18 320)',
    icon: 'GMD',
    description:
      'Game development skills for AI agents covering Unity, game design patterns, game audio, balancing, and pixel art.',
  },
  'developer-tools': {
    slug: 'developer-tools',
    label: 'Developer Tools',
    color: 'oklch(0.82 0.14 90)',
    icon: 'DXT',
    description:
      'Developer tools skills for building better developer experiences, SDKs, and tooling.',
  },
  communication: {
    slug: 'communication',
    label: 'Communication',
    color: 'oklch(0.70 0.02 260)',
    icon: 'COM',
    description:
      'Communication skills for AI agents covering internal communications, remote collaboration, and team alignment.',
  },
  video: {
    slug: 'video',
    label: 'Video Creation',
    color: 'oklch(0.68 0.16 10)',
    icon: 'VID',
    description:
      'Video creation skills for AI agents covering scriptwriting, Remotion video generation, audio design, and video analysis.',
  },
};

export function getCategoryMeta(category: string): CategoryMeta {
  return (
    CATEGORIES[category] || {
      slug: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
      color: 'oklch(0.70 0.02 260)',
      icon: '---',
      description: '',
    }
  );
}
