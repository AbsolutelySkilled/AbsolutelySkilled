import { describe, it, expect } from 'vitest';
import {
  stripFrontmatter,
  extractBody,
  adaptSkill,
  ADAPTERS,
} from '../src/adapters.js';
import type { SkillMetadata } from '../src/types.js';

const FIXTURE = `---
name: cli-design
version: 0.1.0
description: >
  Use this skill when building command-line interfaces.
category: engineering
tags: [cli, terminal]
platforms:
  - claude-code
license: MIT
maintainers:
  - github: maddhruv
---

When this skill is activated, always start your first response with the emoji.

# CLI Design

CLI design is the practice of building command-line tools that are intuitive,
composable, and self-documenting.

---

## When to use this skill

Trigger this skill when the user wants to build a new CLI tool.
`;

const META: SkillMetadata = {
  name: 'cli-design',
  version: '0.1.0',
  description: 'Use this skill when building command-line interfaces.',
  category: 'engineering',
  tags: ['cli', 'terminal'],
  platforms: ['claude-code'],
  recommended_skills: [],
  license: 'MIT',
  maintainers: [{ github: 'maddhruv' }],
};

describe('stripFrontmatter', () => {
  it('removes YAML frontmatter and returns body', () => {
    const result = stripFrontmatter(FIXTURE);
    expect(result).not.toContain('---\nname:');
    expect(result.startsWith('When this skill is activated')).toBe(true);
  });

  it('handles content with no frontmatter gracefully', () => {
    const plain = '# Just a heading\n\nSome content.';
    expect(stripFrontmatter(plain)).toBe(plain);
  });

  it('preserves horizontal rules in body', () => {
    const result = stripFrontmatter(FIXTURE);
    expect(result).toContain('---');
    expect(result).toContain('## When to use this skill');
  });
});

describe('extractBody', () => {
  it('strips frontmatter AND leading # heading', () => {
    const result = extractBody(FIXTURE);
    expect(result).not.toContain('name: cli-design');
    expect(result).not.toMatch(/^# CLI Design/m);
    expect(result).toContain('CLI design is the practice');
  });

  it('strips ## heading if it is the first heading', () => {
    const input = '---\nname: test\n---\n\n## My Title\n\nBody text.';
    const result = extractBody(input);
    expect(result).not.toContain('## My Title');
    expect(result).toBe('Body text.');
  });

  it('preserves content when there is no heading', () => {
    const input = '---\nname: test\n---\n\nJust body content here.';
    expect(extractBody(input)).toBe('Just body content here.');
  });
});

describe('ADAPTERS', () => {
  it('skill-md returns content unchanged', () => {
    expect(ADAPTERS['skill-md'](FIXTURE, META)).toBe(FIXTURE);
  });

  it('mdc strips frontmatter only', () => {
    const result = ADAPTERS['mdc'](FIXTURE, META);
    expect(result).not.toContain('name: cli-design');
    expect(result).toContain('# CLI Design');
  });

  it('generic-md strips frontmatter and leading heading', () => {
    const result = ADAPTERS['generic-md'](FIXTURE, META);
    expect(result).not.toContain('name: cli-design');
    expect(result).not.toMatch(/^# CLI Design/m);
    expect(result).toContain('CLI design is the practice');
  });
});

describe('adaptSkill', () => {
  it('dispatches to the correct adapter by type', () => {
    const skillMd = adaptSkill(FIXTURE, META, 'skill-md');
    const mdc = adaptSkill(FIXTURE, META, 'mdc');
    const generic = adaptSkill(FIXTURE, META, 'generic-md');

    expect(skillMd).toBe(FIXTURE);
    expect(mdc).not.toContain('name: cli-design');
    expect(mdc).toContain('# CLI Design');
    expect(generic).not.toContain('# CLI Design');
  });

  it('passes meta through to adapter', () => {
    // skill-md ignores meta, but the signature accepts it
    const result = adaptSkill(FIXTURE, META, 'skill-md');
    expect(result).toBe(FIXTURE);
  });
});
