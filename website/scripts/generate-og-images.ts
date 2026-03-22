import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const SKILLS_DIR = path.resolve(process.cwd(), '../skills');
const OG_DIR = path.resolve(process.cwd(), 'public/og');
const FONTS_DIR = path.resolve(process.cwd(), 'scripts/fonts');
const WIDTH = 1200;
const HEIGHT = 630;

const CATEGORY_COLORS: Record<string, string> = {
  engineering: '#3b82f6',
  operations: '#f97316',
  marketing: '#ec4899',
  'ai-ml': '#a855f7',
  design: '#06b6d4',
  product: '#22c55e',
  devtools: '#eab308',
  sales: '#ef4444',
  data: '#14b8a6',
  infra: '#6366f1',
  monitoring: '#84cc16',
  cloud: '#0ea5e9',
  writing: '#f59e0b',
  workflow: '#10b981',
  analytics: '#8b5cf6',
  'game-development': '#d946ef',
  'developer-tools': '#eab308',
  communication: '#64748b',
  video: '#f43f5e',
};

const CATEGORY_LABELS: Record<string, string> = {
  engineering: 'Software Engineering',
  operations: 'Operations',
  marketing: 'Marketing',
  'ai-ml': 'AI & ML',
  design: 'UI/UX & Design',
  product: 'Product',
  devtools: 'Developer Tools',
  sales: 'Sales',
  data: 'Data Engineering',
  infra: 'Infrastructure',
  monitoring: 'Monitoring',
  cloud: 'Cloud',
  writing: 'Technical Writing',
  workflow: 'Workflow',
  analytics: 'Analytics',
  'game-development': 'Game Dev',
  'developer-tools': 'Developer Tools',
  communication: 'Communication',
  video: 'Video Creation',
};

// Helper to build satori-compatible virtual DOM nodes
function h(
  type: string,
  style: Record<string, unknown>,
  ...children: (object | string)[]
): object {
  if (children.length === 0) {
    return { type, props: { style } };
  }
  return { type, props: { style, children: children.length === 1 ? children[0] : children } };
}

function buildSkillOgMarkup(
  name: string,
  description: string,
  category: string,
  tags: string[],
): object {
  const catColor = CATEGORY_COLORS[category] || '#64748b';
  const catLabel = CATEGORY_LABELS[category] || category;
  const displayTags = tags.slice(0, 3);
  // Shorter description for bigger text
  const desc = description.length > 90 ? description.slice(0, 87) + '...' : description;
  // Bigger font sizes - scale based on name length
  const nameSize = name.length > 28 ? 56 : name.length > 18 ? 68 : 76;

  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '56px 72px',
      backgroundColor: '#09090f',
      backgroundImage:
        'radial-gradient(ellipse at 15% 45%, rgba(59,130,246,0.10) 0%, transparent 55%), radial-gradient(ellipse at 85% 55%, rgba(168,85,247,0.07) 0%, transparent 55%)',
      fontFamily: 'Inter',
    },
    // Top section
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: '24px' },
      // Category badge - bigger
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: '14px' },
        h(
          'div',
          {
            display: 'flex',
            padding: '8px 20px',
            borderRadius: '100px',
            border: `2px solid ${catColor}55`,
            backgroundColor: `${catColor}18`,
            color: catColor,
            fontSize: '20px',
            fontWeight: 700,
          },
          catLabel,
        ),
        h(
          'div',
          {
            display: 'flex',
            padding: '8px 18px',
            borderRadius: '100px',
            border: '2px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '18px',
            fontWeight: 600,
          },
          'AI Agent Skill',
        ),
      ),
      // Skill name - much bigger
      h(
        'div',
        {
          fontFamily: 'JetBrains Mono',
          fontSize: `${nameSize}px`,
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
        },
        name,
      ),
      // Description - bigger and brighter
      h(
        'div',
        {
          fontSize: '26px',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.45,
          maxWidth: '950px',
        },
        desc,
      ),
    ),
    // Bottom section
    h(
      'div',
      { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      // Tags - bigger
      h(
        'div',
        { display: 'flex', gap: '10px' },
        ...displayTags.map((tag) =>
          h(
            'div',
            {
              fontFamily: 'JetBrains Mono',
              fontSize: '18px',
              color: 'rgba(255,255,255,0.4)',
              padding: '6px 16px',
              borderRadius: '8px',
              border: '1.5px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            },
            `#${tag}`,
          ),
        ),
      ),
      // Brand - bigger
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: '12px' },
        h('div', {
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
        }),
        h(
          'div',
          {
            fontFamily: 'JetBrains Mono',
            fontSize: '22px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.65)',
          },
          'AbsolutelySkilled',
        ),
      ),
    ),
  );
}

function buildDefaultOgMarkup(): object {
  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 80px',
      backgroundColor: '#09090f',
      backgroundImage:
        'radial-gradient(ellipse at 50% 25%, rgba(59,130,246,0.14) 0%, transparent 55%), radial-gradient(ellipse at 65% 75%, rgba(168,85,247,0.10) 0%, transparent 55%)',
      fontFamily: 'Inter',
    },
    h('div', {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)',
      marginBottom: '36px',
    }),
    h(
      'div',
      {
        fontFamily: 'JetBrains Mono',
        fontSize: '72px',
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '-0.03em',
        textAlign: 'center',
      },
      'AbsolutelySkilled',
    ),
    h(
      'div',
      {
        fontSize: '32px',
        color: 'rgba(255,255,255,0.6)',
        marginTop: '20px',
        textAlign: 'center',
        fontWeight: 600,
      },
      'Teach your AI agent anything.',
    ),
    h(
      'div',
      {
        display: 'flex',
        gap: '32px',
        marginTop: '48px',
        fontSize: '22px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.4)',
      },
      h('span', {}, '168+ Skills'),
      h('span', { color: 'rgba(255,255,255,0.15)' }, '|'),
      h('span', {}, '20 Categories'),
      h('span', { color: 'rgba(255,255,255,0.15)' }, '|'),
      h('span', {}, 'Open Source'),
    ),
  );
}

function buildCategoryOgMarkup(label: string, count: number, color: string): object {
  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '56px 72px',
      backgroundColor: '#09090f',
      backgroundImage: `radial-gradient(ellipse at 20% 45%, ${color}14 0%, transparent 55%), radial-gradient(ellipse at 80% 55%, rgba(168,85,247,0.07) 0%, transparent 55%)`,
      fontFamily: 'Inter',
    },
    // Top
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: '24px' },
      // Badge
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: '14px' },
        h(
          'div',
          {
            display: 'flex',
            padding: '8px 20px',
            borderRadius: '100px',
            border: `2px solid ${color}55`,
            backgroundColor: `${color}18`,
            color,
            fontSize: '20px',
            fontWeight: 700,
          },
          'Category',
        ),
        h(
          'div',
          {
            display: 'flex',
            padding: '8px 18px',
            borderRadius: '100px',
            border: '2px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '18px',
            fontWeight: 600,
          },
          `${count} Skills`,
        ),
      ),
      // Category name
      h(
        'div',
        {
          fontFamily: 'JetBrains Mono',
          fontSize: '76px',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
        },
        label,
      ),
      // Subtitle
      h(
        'div',
        {
          fontSize: '26px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.45,
        },
        `Production-ready AI agent skills for ${label.toLowerCase()}.`,
      ),
    ),
    // Bottom brand
    h(
      'div',
      { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: '12px' },
        h('div', {
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
        }),
        h(
          'div',
          {
            fontFamily: 'JetBrains Mono',
            fontSize: '22px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.65)',
          },
          'AbsolutelySkilled',
        ),
      ),
    ),
  );
}

function buildBlogOgMarkup(title: string, date: string): object {
  const titleSize = title.length > 50 ? 48 : title.length > 35 ? 56 : 64;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '56px 72px',
      backgroundColor: '#09090f',
      backgroundImage:
        'radial-gradient(ellipse at 25% 40%, rgba(236,72,153,0.10) 0%, transparent 55%), radial-gradient(ellipse at 75% 60%, rgba(59,130,246,0.08) 0%, transparent 55%)',
      fontFamily: 'Inter',
    },
    // Top
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: '24px' },
      // Badge
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: '14px' },
        h(
          'div',
          {
            display: 'flex',
            padding: '8px 20px',
            borderRadius: '100px',
            border: '2px solid rgba(236,72,153,0.4)',
            backgroundColor: 'rgba(236,72,153,0.12)',
            color: '#ec4899',
            fontSize: '20px',
            fontWeight: 700,
          },
          'Blog',
        ),
        h(
          'div',
          {
            display: 'flex',
            padding: '8px 18px',
            borderRadius: '100px',
            border: '2px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '18px',
            fontWeight: 600,
          },
          formattedDate,
        ),
      ),
      // Title
      h(
        'div',
        {
          fontSize: `${titleSize}px`,
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          maxWidth: '1000px',
        },
        title,
      ),
    ),
    // Bottom brand
    h(
      'div',
      { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: '12px' },
        h('div', {
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
        }),
        h(
          'div',
          {
            fontFamily: 'JetBrains Mono',
            fontSize: '22px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.65)',
          },
          'AbsolutelySkilled',
        ),
      ),
    ),
  );
}

async function renderOgImage(
  markup: object,
  fonts: { inter: ArrayBuffer; interRegular: ArrayBuffer; mono: ArrayBuffer },
): Promise<Buffer> {
  const svg = await satori(markup as React.ReactNode, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Inter', data: fonts.inter, weight: 700, style: 'normal' as const },
      { name: 'Inter', data: fonts.interRegular, weight: 400, style: 'normal' as const },
      { name: 'JetBrains Mono', data: fonts.mono, weight: 700, style: 'normal' as const },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width' as const, value: WIDTH },
  });
  return resvg.render().asPng();
}

async function main() {
  console.log('Loading fonts...');
  const inter = fs.readFileSync(path.join(FONTS_DIR, 'inter-bold.ttf')).buffer as ArrayBuffer;
  const interRegular = fs.readFileSync(path.join(FONTS_DIR, 'inter-regular.ttf')).buffer as ArrayBuffer;
  const mono = fs.readFileSync(path.join(FONTS_DIR, 'jetbrains-mono-bold.ttf')).buffer as ArrayBuffer;
  const fonts = { inter, interRegular, mono };

  // Ensure output directory
  if (!fs.existsSync(OG_DIR)) {
    fs.mkdirSync(OG_DIR, { recursive: true });
  }

  // Generate default OG image
  console.log('Generating default OG image...');
  const defaultMarkup = buildDefaultOgMarkup();
  const defaultPng = await renderOgImage(defaultMarkup, fonts);
  fs.writeFileSync(path.join(OG_DIR, 'default.png'), defaultPng);

  // Read all skills
  const slugs = fs.readdirSync(SKILLS_DIR).filter((d) =>
    fs.existsSync(path.join(SKILLS_DIR, d, 'SKILL.md')),
  );

  console.log(`Generating OG images for ${slugs.length} skills...`);
  let count = 0;

  // Process in batches to avoid memory pressure
  const BATCH_SIZE = 20;
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    const batch = slugs.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (slug) => {
        try {
          const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8');
          const { data } = matter(raw);

          const name = data.name || slug;
          const description = (data.description || '')
            .replace(/^Use this skill when\s*/i, '')
            .replace(/\.?\s*Triggers on\b.*/i, '')
            .replace(/\.?\s*Also triggers on\b.*/i, '')
            .trim();
          const category = data.category || 'engineering';
          const tags: string[] = data.tags || [];

          const markup = buildSkillOgMarkup(name, description, category, tags);
          const png = await renderOgImage(markup, fonts);
          fs.writeFileSync(path.join(OG_DIR, `${slug}.png`), png);
          count++;
        } catch (err) {
          console.error(`Error generating OG for ${slug}:`, err);
        }
      }),
    );
    process.stdout.write(`  ${Math.min(i + BATCH_SIZE, slugs.length)}/${slugs.length}\r`);
  }

  console.log(`\nGenerated ${count} skill OG images + 1 default`);

  // Generate category OG images
  const categorySkillCounts: Record<string, number> = {};
  for (const slug of slugs) {
    try {
      const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8');
      const { data } = matter(raw);
      const cat = data.category || 'engineering';
      categorySkillCounts[cat] = (categorySkillCounts[cat] || 0) + 1;
    } catch {}
  }

  const categories = Object.entries(categorySkillCounts);
  console.log(`Generating OG images for ${categories.length} categories...`);
  for (const [cat, catCount] of categories) {
    const color = CATEGORY_COLORS[cat] || '#64748b';
    const label = CATEGORY_LABELS[cat] || cat;
    const markup = buildCategoryOgMarkup(label, catCount, color);
    const png = await renderOgImage(markup, fonts);
    fs.writeFileSync(path.join(OG_DIR, `category-${cat}.png`), png);
  }
  console.log(`Generated ${categories.length} category OG images`);

  // Generate blog post OG images
  const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');
  if (fs.existsSync(BLOG_DIR)) {
    const blogFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
    console.log(`Generating OG images for ${blogFiles.length} blog posts...`);
    for (const file of blogFiles) {
      try {
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
        const { data } = matter(raw);
        const slug = file.replace(/\.(mdx?|md)$/, '');
        const title = data.title || slug;
        const date = data.date || '2026-01-01';
        const markup = buildBlogOgMarkup(title, date);
        const png = await renderOgImage(markup, fonts);
        fs.writeFileSync(path.join(OG_DIR, `blog-${slug}.png`), png);
      } catch (err) {
        console.error(`Error generating blog OG for ${file}:`, err);
      }
    }
    console.log(`Generated ${blogFiles.length} blog OG images`);
  }
}

main();
