import { describe, it, expect } from 'vitest';
import { parseSource, sanitizeName } from '../src/resolver.js';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

describe('parseSource', () => {
  // -- Local paths ----------------------------------------------------------

  it('parses relative local path (./)', () => {
    const result = parseSource('./skills/my-skill');
    expect(result.type).toBe('local');
    expect(result.url).toBe(resolve('./skills/my-skill'));
  });

  it('parses absolute local path', () => {
    const result = parseSource('/absolute/path/to/skill');
    expect(result.type).toBe('local');
    expect(result.url).toBe('/absolute/path/to/skill');
  });

  it('parses tilde home-relative path', () => {
    const result = parseSource('~/my-skills');
    expect(result.type).toBe('local');
    expect(result.url).toBe(resolve(homedir(), 'my-skills'));
  });

  // -- GitHub URLs ----------------------------------------------------------

  it('parses GitHub URL with tree path', () => {
    const result = parseSource(
      'https://github.com/owner/repo/tree/main/skills/cli-design'
    );
    expect(result).toEqual({
      type: 'github',
      url: 'https://github.com/owner/repo',
      owner: 'owner',
      repo: 'repo',
      ref: 'main',
      subpath: 'skills/cli-design',
    });
  });

  it('parses GitHub URL tree with branch only (no subpath)', () => {
    const result = parseSource('https://github.com/owner/repo/tree/v2.0');
    expect(result).toEqual({
      type: 'github',
      url: 'https://github.com/owner/repo',
      owner: 'owner',
      repo: 'repo',
      ref: 'v2.0',
    });
  });

  it('parses basic GitHub URL', () => {
    const result = parseSource('https://github.com/maddhruv/AbsolutelySkilled');
    expect(result).toEqual({
      type: 'github',
      url: 'https://github.com/maddhruv/AbsolutelySkilled',
      owner: 'maddhruv',
      repo: 'AbsolutelySkilled',
    });
  });

  it('strips .git suffix from GitHub URL', () => {
    const result = parseSource('https://github.com/owner/repo.git');
    expect(result.repo).toBe('repo');
    expect(result.url).toBe('https://github.com/owner/repo');
  });

  it('handles trailing slash on GitHub URL', () => {
    const result = parseSource('https://github.com/owner/repo/');
    expect(result.repo).toBe('repo');
  });

  // -- GitHub shorthand -----------------------------------------------------

  it('parses basic shorthand (owner/repo)', () => {
    const result = parseSource('maddhruv/AbsolutelySkilled');
    expect(result).toEqual({
      type: 'github',
      url: 'https://github.com/maddhruv/AbsolutelySkilled',
      owner: 'maddhruv',
      repo: 'AbsolutelySkilled',
    });
  });

  it('parses shorthand with skill filter (owner/repo@skill)', () => {
    const result = parseSource('maddhruv/AbsolutelySkilled@cli-design');
    expect(result).toEqual({
      type: 'github',
      url: 'https://github.com/maddhruv/AbsolutelySkilled',
      owner: 'maddhruv',
      repo: 'AbsolutelySkilled',
      skillFilter: 'cli-design',
    });
  });

  it('parses shorthand with subpath (owner/repo/sub/path)', () => {
    const result = parseSource('owner/repo/skills/my-skill');
    expect(result).toEqual({
      type: 'github',
      url: 'https://github.com/owner/repo',
      owner: 'owner',
      repo: 'repo',
      subpath: 'skills/my-skill',
    });
  });

  // -- Safety ---------------------------------------------------------------

  it('rejects path traversal in URL tree subpath', () => {
    expect(() =>
      parseSource('https://github.com/owner/repo/tree/main/../etc/passwd')
    ).toThrow('Path traversal');
  });

  it('rejects path traversal in shorthand subpath', () => {
    expect(() => parseSource('owner/repo/../escape')).toThrow('Path traversal');
  });

  it('trims whitespace from input', () => {
    const result = parseSource('  maddhruv/AbsolutelySkilled  ');
    expect(result.owner).toBe('maddhruv');
    expect(result.repo).toBe('AbsolutelySkilled');
  });

  it('throws on empty input', () => {
    expect(() => parseSource('')).toThrow('cannot be empty');
    expect(() => parseSource('   ')).toThrow('cannot be empty');
  });

  it('throws on unparseable input', () => {
    expect(() => parseSource('just-a-word')).toThrow('Unable to parse');
  });
});

describe('sanitizeName', () => {
  it('lowercases and replaces non-alphanumeric chars', () => {
    expect(sanitizeName('My Cool Skill!')).toBe('my-cool-skill');
  });

  it('collapses multiple dashes', () => {
    expect(sanitizeName('a---b')).toBe('a-b');
  });

  it('strips leading and trailing dashes and dots', () => {
    expect(sanitizeName('--hello--')).toBe('hello');
    expect(sanitizeName('.hidden.')).toBe('hidden');
  });

  it('returns unnamed-skill for empty result', () => {
    expect(sanitizeName('')).toBe('unnamed-skill');
    expect(sanitizeName('!!!')).toBe('unnamed-skill');
  });

  it('truncates to 255 chars', () => {
    const long = 'a'.repeat(300);
    expect(sanitizeName(long).length).toBeLessThanOrEqual(255);
  });
});
