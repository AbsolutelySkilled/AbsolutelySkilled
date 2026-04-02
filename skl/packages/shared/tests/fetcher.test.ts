import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm, mkdtemp, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { discoverSkills, fetchSkills, cleanupFetch, type FetchResult } from '../src/fetcher.js';
import type { SkillSource } from '../src/types.js';

// ---------------------------------------------------------------------------
// Helpers - create temp fixture directories
// ---------------------------------------------------------------------------

let tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'skl-test-'));
  tempDirs.push(dir);
  return dir;
}

async function writeSkillMd(
  dir: string,
  name: string,
  description = 'A test skill',
): Promise<void> {
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, 'SKILL.md'),
    `---\nname: ${name}\nversion: "1.0.0"\ndescription: "${description}"\ncategory: engineering\ntags: [test]\nplatforms: [all]\nlicense: MIT\nmaintainers:\n  - github: test\n---\n\n# ${name}\n\nBody content here.\n`,
  );
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

afterEach(async () => {
  for (const dir of tempDirs) {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
  tempDirs = [];
});

// ---------------------------------------------------------------------------
// discoverSkills tests
// ---------------------------------------------------------------------------

describe('discoverSkills', () => {
  it('finds SKILL.md in root directory', async () => {
    const dir = await makeTempDir();
    await writeSkillMd(dir, 'root-skill', 'Root skill description');

    const skills = await discoverSkills(dir);

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('root-skill');
    expect(skills[0].description).toBe('Root skill description');
    expect(skills[0].skillPath).toBe('.');
    expect(skills[0].content).toContain('name: root-skill');
  });

  it('finds skills via skills.yaml manifest', async () => {
    const dir = await makeTempDir();

    // Write manifest
    await writeFile(
      join(dir, 'skills.yaml'),
      `registry:\n  name: test-registry\n  description: Test\nskills:\n  - name: alpha\n    path: skills/alpha\n  - name: beta\n    path: skills/beta\n`,
    );

    await writeSkillMd(join(dir, 'skills', 'alpha'), 'alpha', 'Alpha skill');
    await writeSkillMd(join(dir, 'skills', 'beta'), 'beta', 'Beta skill');

    const skills = await discoverSkills(dir);

    expect(skills).toHaveLength(2);
    expect(skills[0].name).toBe('alpha');
    expect(skills[1].name).toBe('beta');
  });

  it('searches PRIORITY_SUBDIRS', async () => {
    const dir = await makeTempDir();

    // Create skill inside a priority subdir
    await writeSkillMd(join(dir, 'skills', 'my-skill'), 'priority-skill');
    await writeSkillMd(join(dir, 'prompts', 'prompt-skill'), 'prompt-skill');

    const skills = await discoverSkills(dir);

    expect(skills).toHaveLength(2);
    const names = skills.map((s) => s.name);
    expect(names).toContain('priority-skill');
    expect(names).toContain('prompt-skill');
  });

  it('skips SKIP_DIRS (node_modules, .git, etc.)', async () => {
    const dir = await makeTempDir();

    // Skill in a skip dir should be ignored
    await writeSkillMd(join(dir, 'node_modules', 'pkg', 'hidden'), 'hidden-skill');
    await writeSkillMd(join(dir, '.git', 'hooks'), 'git-skill');

    // Skill in a normal dir should be found
    await writeSkillMd(join(dir, 'src'), 'visible-skill');

    const skills = await discoverSkills(dir);

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('visible-skill');
  });

  it('respects MAX_DISCOVERY_DEPTH', async () => {
    const dir = await makeTempDir();

    // Create skill at depth 6 (beyond MAX_DISCOVERY_DEPTH of 5)
    // depth 0 = root scan, so we need 7 nested dirs to exceed depth 5
    let deepPath = dir;
    for (let i = 0; i < 7; i++) {
      deepPath = join(deepPath, `level${i}`);
    }
    await writeSkillMd(deepPath, 'deep-skill');

    // Create skill within depth limit
    await writeSkillMd(join(dir, 'shallow'), 'shallow-skill');

    const skills = await discoverSkills(dir);

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('shallow-skill');
  });

  it('sorts skills by name', async () => {
    const dir = await makeTempDir();

    await writeSkillMd(join(dir, 'c-skill'), 'charlie');
    await writeSkillMd(join(dir, 'a-skill'), 'alpha');
    await writeSkillMd(join(dir, 'b-skill'), 'bravo');

    const skills = await discoverSkills(dir);

    expect(skills.map((s) => s.name)).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('skips SKILL.md files with missing name in frontmatter', async () => {
    const dir = await makeTempDir();

    // Write a SKILL.md without a name field
    await mkdir(join(dir, 'bad-skill'), { recursive: true });
    await writeFile(
      join(dir, 'bad-skill', 'SKILL.md'),
      '---\nversion: "1.0.0"\n---\n\nNo name field.\n',
    );

    await writeSkillMd(join(dir, 'good-skill'), 'good-skill');

    const skills = await discoverSkills(dir);

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('good-skill');
  });
});

// ---------------------------------------------------------------------------
// fetchSkills tests
// ---------------------------------------------------------------------------

describe('fetchSkills', () => {
  it('with local source returns skills directly', async () => {
    const dir = await makeTempDir();
    await writeSkillMd(dir, 'local-skill', 'A local skill');

    const source: SkillSource = { type: 'local', url: dir };
    const result = await fetchSkills(source);

    expect(result.source).toBe(source);
    expect(result.tempDir).toBe(dir);
    expect(result.commitHash).toBe('');
    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].name).toBe('local-skill');
  });

  it('with local source respects subpath', async () => {
    const dir = await makeTempDir();
    await writeSkillMd(join(dir, 'sub', 'inner'), 'inner-skill');
    await writeSkillMd(join(dir, 'outer'), 'outer-skill');

    const source: SkillSource = { type: 'local', url: dir, subpath: 'sub' };
    const result = await fetchSkills(source);

    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].name).toBe('inner-skill');
  });

  it('with local source applies skillFilter', async () => {
    const dir = await makeTempDir();
    await writeSkillMd(join(dir, 'a'), 'alpha');
    await writeSkillMd(join(dir, 'b'), 'beta');

    const source: SkillSource = { type: 'local', url: dir, skillFilter: 'alpha' };
    const result = await fetchSkills(source);

    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].name).toBe('alpha');
  });
});

// ---------------------------------------------------------------------------
// cleanupFetch tests
// ---------------------------------------------------------------------------

describe('cleanupFetch', () => {
  it('removes temp directory inside tmpdir', async () => {
    const dir = await makeTempDir();
    await writeFile(join(dir, 'test.txt'), 'hello');

    const result: FetchResult = {
      source: { type: 'github', url: 'https://github.com/test/repo' },
      tempDir: dir,
      commitHash: '',
      skills: [],
    };

    await cleanupFetch(result);

    await expect(stat(dir)).rejects.toThrow();
    // Remove from tracking since it's already cleaned up
    tempDirs = tempDirs.filter((d) => d !== dir);
  });

  it('skips cleanup for local sources', async () => {
    const dir = await makeTempDir();
    await writeFile(join(dir, 'test.txt'), 'hello');

    const result: FetchResult = {
      source: { type: 'local', url: dir },
      tempDir: dir,
      commitHash: '',
      skills: [],
    };

    await cleanupFetch(result);
    // Dir should still exist
    const s = await stat(dir);
    expect(s.isDirectory()).toBe(true);
  });

  it('rejects paths outside tmpdir', async () => {
    const result: FetchResult = {
      source: { type: 'github', url: 'https://github.com/test/repo' },
      tempDir: '/home/user/real-project',
      commitHash: '',
      skills: [],
    };

    await expect(cleanupFetch(result)).rejects.toThrow('Refusing to remove directory outside tmpdir');
  });
});
