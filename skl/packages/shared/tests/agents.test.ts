import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(() => false),
}));

import { existsSync } from 'node:fs';
const mockExistsSync = vi.mocked(existsSync);

import {
  AGENTS,
  UNIVERSAL_AGENTS_DIR,
  getAgentSkillsDir,
  getInstalledAgents,
  type AgentDefinition,
  type FormatAdapter,
} from '../src/agents.js';

describe('AGENTS', () => {
  it('has at least 20 entries', () => {
    expect(AGENTS.length).toBeGreaterThanOrEqual(20);
  });

  it('has at least 45 entries', () => {
    expect(AGENTS.length).toBeGreaterThanOrEqual(45);
  });

  it('all agents have required fields', () => {
    for (const agent of AGENTS) {
      expect(agent.name).toBeTruthy();
      expect(agent.displayName).toBeTruthy();
      expect(agent.skillsDir).toBeDefined();
      expect(typeof agent.detect).toBe('function');
      expect(agent.adapter).toBeTruthy();
      expect(typeof agent.universal).toBe('boolean');
    }
  });

  it('has no duplicate agent names', () => {
    const names = AGENTS.map((a) => a.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('adapter mapping is valid for all agents', () => {
    const validAdapters: FormatAdapter[] = ['skill-md', 'mdc', 'generic-md'];
    for (const agent of AGENTS) {
      expect(validAdapters).toContain(agent.adapter);
    }
  });

  it('includes core agents from AgentPlatform type', () => {
    const names = AGENTS.map((a) => a.name);
    const coreAgents = [
      'claude-code',
      'codex',
      'cursor',
      'windsurf',
      'copilot',
      'cline',
      'roo-code',
      'aider',
      'continue',
      'zed',
      'amp',
      'opencode',
      'gemini-cli',
      'kilo-code',
      'trae',
      'void',
      'aide',
      'pear-ai',
    ];
    for (const core of coreAgents) {
      expect(names).toContain(core);
    }
  });
});

describe('UNIVERSAL_AGENTS_DIR', () => {
  it('ends with .agents/skills', () => {
    expect(UNIVERSAL_AGENTS_DIR).toMatch(/\.agents[/\\]skills$/);
  });
});

describe('getAgentSkillsDir', () => {
  it('resolves function-based skillsDir', () => {
    const agent = AGENTS.find((a) => a.name === 'claude-code')!;
    const dir = getAgentSkillsDir(agent);
    expect(dir).toMatch(/\.claude[/\\]skills$/);
  });

  it('resolves cursor rules path', () => {
    const agent = AGENTS.find((a) => a.name === 'cursor')!;
    const dir = getAgentSkillsDir(agent);
    expect(dir).toMatch(/\.cursor[/\\]rules$/);
  });

  it('resolves copilot instructions path', () => {
    const agent = AGENTS.find((a) => a.name === 'copilot')!;
    const dir = getAgentSkillsDir(agent);
    expect(dir).toMatch(/\.github[/\\]copilot-instructions$/);
  });

  it('resolves string-based skillsDir directly', () => {
    const fakeAgent: AgentDefinition = {
      name: 'test',
      displayName: 'Test',
      skillsDir: '/some/fixed/path',
      detect: () => false,
      adapter: 'skill-md',
      universal: false,
    };
    expect(getAgentSkillsDir(fakeAgent)).toBe('/some/fixed/path');
  });
});

describe('universal agents', () => {
  it('universal agents all use skill-md adapter', () => {
    const universals = AGENTS.filter((a) => a.universal);
    for (const agent of universals) {
      expect(agent.adapter).toBe('skill-md');
    }
  });

  it('non-universal agents exist with different adapters', () => {
    const nonUniversals = AGENTS.filter((a) => !a.universal);
    expect(nonUniversals.length).toBeGreaterThan(0);
    const adapters = new Set(nonUniversals.map((a) => a.adapter));
    expect(adapters.size).toBeGreaterThan(1);
  });
});

describe('getInstalledAgents', () => {
  beforeEach(() => {
    mockExistsSync.mockReset();
  });

  it('returns empty array when no agents detected', () => {
    mockExistsSync.mockReturnValue(false);
    const installed = getInstalledAgents();
    expect(installed).toEqual([]);
  });

  it('returns only detected agents', () => {
    // Make existsSync return true only for paths containing ".claude"
    mockExistsSync.mockImplementation((p: unknown) => {
      return typeof p === 'string' && p.includes('.claude');
    });
    const installed = getInstalledAgents();
    const names = installed.map((a) => a.name);
    expect(names).toContain('claude-code');
    // Should not include agents whose dirs don't exist
    expect(names).not.toContain('cursor');
  });
});
