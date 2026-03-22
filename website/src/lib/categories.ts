export interface CategoryMeta {
  slug: string;
  label: string;
  color: string;
  icon: string;
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  engineering: {
    slug: 'engineering',
    label: 'Software Engineering',
    color: '#3b82f6',
    icon: '{ }',
  },
  operations: {
    slug: 'operations',
    label: 'Operations',
    color: '#f97316',
    icon: '...',
  },
  marketing: {
    slug: 'marketing',
    label: 'Marketing',
    color: '#ec4899',
    icon: '...',
  },
  'ai-ml': {
    slug: 'ai-ml',
    label: 'AI & Machine Learning',
    color: '#a855f7',
    icon: '...',
  },
  design: {
    slug: 'design',
    label: 'UI/UX & Design',
    color: '#06b6d4',
    icon: '...',
  },
  product: {
    slug: 'product',
    label: 'Product Management',
    color: '#22c55e',
    icon: '...',
  },
  devtools: {
    slug: 'devtools',
    label: 'Developer Tools',
    color: '#eab308',
    icon: '...',
  },
  sales: {
    slug: 'sales',
    label: 'Sales',
    color: '#ef4444',
    icon: '...',
  },
  data: {
    slug: 'data',
    label: 'Data Engineering',
    color: '#14b8a6',
    icon: '...',
  },
  infra: {
    slug: 'infra',
    label: 'Infrastructure',
    color: '#6366f1',
    icon: '...',
  },
  monitoring: {
    slug: 'monitoring',
    label: 'Monitoring',
    color: '#84cc16',
    icon: '...',
  },
  cloud: {
    slug: 'cloud',
    label: 'Cloud',
    color: '#0ea5e9',
    icon: '...',
  },
  writing: {
    slug: 'writing',
    label: 'Technical Writing',
    color: '#f59e0b',
    icon: '...',
  },
  workflow: {
    slug: 'workflow',
    label: 'Workflow',
    color: '#10b981',
    icon: '...',
  },
  analytics: {
    slug: 'analytics',
    label: 'Analytics',
    color: '#8b5cf6',
    icon: '...',
  },
  'game-development': {
    slug: 'game-development',
    label: 'Game Development',
    color: '#d946ef',
    icon: '...',
  },
  'developer-tools': {
    slug: 'developer-tools',
    label: 'Developer Tools',
    color: '#eab308',
    icon: '...',
  },
  communication: {
    slug: 'communication',
    label: 'Communication',
    color: '#64748b',
    icon: '...',
  },
  video: {
    slug: 'video',
    label: 'Video Creation',
    color: '#f43f5e',
    icon: '...',
  },
};

export function getCategoryMeta(category: string): CategoryMeta {
  return (
    CATEGORIES[category] || {
      slug: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
      color: '#64748b',
      icon: '...',
    }
  );
}
