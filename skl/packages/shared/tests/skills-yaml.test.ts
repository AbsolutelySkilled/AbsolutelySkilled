import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  parseSkillsManifest,
  readSkillsManifest,
  validateManifest,
} from '../src/skills-yaml.js';

const VALID_YAML = `
registry:
  name: my-skills
  description: A test registry
skills:
  - name: foo
    path: skills/foo
  - name: bar
    path: skills/bar
`;

let tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'skl-yaml-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe('parseSkillsManifest', () => {
  it('parses a valid manifest', () => {
    const result = parseSkillsManifest(VALID_YAML);
    expect(result).not.toBeNull();
    expect(result!.registry.name).toBe('my-skills');
    expect(result!.registry.description).toBe('A test registry');
    expect(result!.skills).toHaveLength(2);
    expect(result!.skills[0]).toEqual({ name: 'foo', path: 'skills/foo' });
  });

  it('parses a manifest with optional homepage field', () => {
    const yaml = `
registry:
  name: test
  description: desc
  homepage: https://example.com
skills:
  - name: s1
    path: skills/s1
`;
    const result = parseSkillsManifest(yaml);
    expect(result).not.toBeNull();
    expect(result!.registry.homepage).toBe('https://example.com');
  });

  it('returns null for empty content', () => {
    expect(parseSkillsManifest('')).toBeNull();
    expect(parseSkillsManifest('   ')).toBeNull();
  });

  it('returns null for invalid YAML', () => {
    expect(parseSkillsManifest('{{{')).toBeNull();
  });

  it('returns null for missing registry section', () => {
    const yaml = `
skills:
  - name: foo
    path: skills/foo
`;
    expect(parseSkillsManifest(yaml)).toBeNull();
  });

  it('returns null for missing skills array', () => {
    const yaml = `
registry:
  name: test
  description: desc
`;
    expect(parseSkillsManifest(yaml)).toBeNull();
  });

  it('returns null for skill entries without name', () => {
    const yaml = `
registry:
  name: test
  description: desc
skills:
  - path: skills/foo
`;
    expect(parseSkillsManifest(yaml)).toBeNull();
  });
});

describe('readSkillsManifest', () => {
  it('reads and parses a valid file', async () => {
    const dir = makeTempDir();
    const filePath = join(dir, 'skills.yaml');
    writeFileSync(filePath, VALID_YAML);
    const result = await readSkillsManifest(filePath);
    expect(result).not.toBeNull();
    expect(result!.skills).toHaveLength(2);
  });

  it('returns null for non-existent file', async () => {
    const result = await readSkillsManifest('/tmp/does-not-exist-skl.yaml');
    expect(result).toBeNull();
  });
});

describe('validateManifest', () => {
  it('returns true for valid manifest structure', () => {
    const data = {
      registry: { name: 'x', description: 'y' },
      skills: [{ name: 'a', path: 'b' }],
    };
    expect(validateManifest(data)).toBe(true);
  });

  it('returns false for null/undefined', () => {
    expect(validateManifest(null)).toBe(false);
    expect(validateManifest(undefined)).toBe(false);
  });

  it('returns false when registry.name is not a string', () => {
    const data = {
      registry: { name: 123, description: 'y' },
      skills: [{ name: 'a', path: 'b' }],
    };
    expect(validateManifest(data)).toBe(false);
  });

  it('returns false when skills contains invalid entries', () => {
    const data = {
      registry: { name: 'x', description: 'y' },
      skills: [{ name: 'a' }], // missing path
    };
    expect(validateManifest(data)).toBe(false);
  });
});
