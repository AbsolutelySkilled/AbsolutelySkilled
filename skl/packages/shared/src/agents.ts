import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// ---------------------------------------------------------------------------
// Agent Definitions - detection, paths, and format adapters for 45+ agents
// ---------------------------------------------------------------------------

export type FormatAdapter = 'skill-md' | 'mdc' | 'generic-md';

export interface AgentDefinition {
  /** Unique identifier (matches AgentPlatform where applicable) */
  name: string;
  /** Human-readable name */
  displayName: string;
  /** Path to the agent's skills/rules directory, or a function that takes homedir */
  skillsDir: string | ((home: string) => string);
  /** Check if agent is installed by looking for its config directory */
  detect: () => boolean;
  /** Format adapter used when writing skills to this agent */
  adapter: FormatAdapter;
  /** Whether this agent reads from ~/.agents/skills/ as canonical source */
  universal: boolean;
}

// ---------------------------------------------------------------------------
// Canonical shared directory
// ---------------------------------------------------------------------------

export const UNIVERSAL_AGENTS_DIR = join(homedir(), '.agents', 'skills');

// ---------------------------------------------------------------------------
// Helper: check if a directory exists under home
// ---------------------------------------------------------------------------

const homeDir = homedir();

function dirExists(...segments: string[]): boolean {
  return existsSync(join(homeDir, ...segments));
}

// ---------------------------------------------------------------------------
// Agent Definitions
// ---------------------------------------------------------------------------

export const AGENTS: AgentDefinition[] = [
  // ---- Universal agents (use ~/.agents/skills/, adapter 'skill-md') --------

  {
    name: 'claude-code',
    displayName: 'Claude Code',
    skillsDir: (home) => join(home, '.claude', 'skills'),
    detect: () => dirExists('.claude'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'codex',
    displayName: 'OpenAI Codex',
    skillsDir: (home) => join(home, '.codex', 'skills'),
    detect: () => dirExists('.codex'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'opencode',
    displayName: 'OpenCode',
    skillsDir: (home) => join(home, '.opencode', 'skills'),
    detect: () => dirExists('.opencode'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'cline',
    displayName: 'Cline',
    skillsDir: (home) => join(home, '.cline', 'skills'),
    detect: () => dirExists('.cline'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'continue',
    displayName: 'Continue',
    skillsDir: (home) => join(home, '.continue', 'skills'),
    detect: () => dirExists('.continue'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'gemini-cli',
    displayName: 'Gemini CLI',
    skillsDir: (home) => join(home, '.gemini', 'skills'),
    detect: () => dirExists('.gemini'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'amp',
    displayName: 'Amp',
    skillsDir: (home) => join(home, '.amp', 'skills'),
    detect: () => dirExists('.amp'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'roo-code',
    displayName: 'Roo Code',
    skillsDir: (home) => join(home, '.roo-code', 'skills'),
    detect: () => dirExists('.roo-code'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'aider',
    displayName: 'Aider',
    skillsDir: (home) => join(home, '.aider', 'skills'),
    detect: () => dirExists('.aider'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'kilo-code',
    displayName: 'Kilo Code',
    skillsDir: (home) => join(home, '.kilo-code', 'skills'),
    detect: () => dirExists('.kilo-code'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'void',
    displayName: 'Void',
    skillsDir: (home) => join(home, '.void', 'skills'),
    detect: () => dirExists('.void'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'pear-ai',
    displayName: 'Pear AI',
    skillsDir: (home) => join(home, '.pear-ai', 'skills'),
    detect: () => dirExists('.pear-ai'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'aide',
    displayName: 'Aide',
    skillsDir: (home) => join(home, '.aide', 'skills'),
    detect: () => dirExists('.aide'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'trae',
    displayName: 'Trae',
    skillsDir: (home) => join(home, '.trae', 'skills'),
    detect: () => dirExists('.trae'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'zed',
    displayName: 'Zed',
    skillsDir: (home) => join(home, '.zed', 'skills'),
    detect: () => dirExists('.zed'),
    adapter: 'skill-md',
    universal: true,
  },

  // ---- Universal agents (CLI-based, skill-md) ------------------------------

  {
    name: 'goose',
    displayName: 'Goose',
    skillsDir: (home) => join(home, '.goose', 'skills'),
    detect: () => dirExists('.goose'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'mentat',
    displayName: 'Mentat',
    skillsDir: (home) => join(home, '.mentat', 'skills'),
    detect: () => dirExists('.mentat'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'sweep',
    displayName: 'Sweep',
    skillsDir: (home) => join(home, '.sweep', 'skills'),
    detect: () => dirExists('.sweep'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'gpt-engineer',
    displayName: 'GPT Engineer',
    skillsDir: (home) => join(home, '.gpt-engineer', 'skills'),
    detect: () => dirExists('.gpt-engineer'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'tabby',
    displayName: 'Tabby',
    skillsDir: (home) => join(home, '.tabby', 'skills'),
    detect: () => dirExists('.tabby'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'supermaven',
    displayName: 'Supermaven',
    skillsDir: (home) => join(home, '.supermaven', 'skills'),
    detect: () => dirExists('.supermaven'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'sourcegraph-cody',
    displayName: 'Sourcegraph Cody',
    skillsDir: (home) => join(home, '.cody', 'skills'),
    detect: () => dirExists('.cody'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'tabnine',
    displayName: 'Tabnine',
    skillsDir: (home) => join(home, '.tabnine', 'skills'),
    detect: () => dirExists('.tabnine'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'double',
    displayName: 'Double',
    skillsDir: (home) => join(home, '.double', 'skills'),
    detect: () => dirExists('.double'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'devin',
    displayName: 'Devin',
    skillsDir: (home) => join(home, '.devin', 'skills'),
    detect: () => dirExists('.devin'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'bolt',
    displayName: 'Bolt',
    skillsDir: (home) => join(home, '.bolt', 'skills'),
    detect: () => dirExists('.bolt'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'v0',
    displayName: 'v0',
    skillsDir: (home) => join(home, '.v0', 'skills'),
    detect: () => dirExists('.v0'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'replit-agent',
    displayName: 'Replit Agent',
    skillsDir: (home) => join(home, '.replit', 'skills'),
    detect: () => dirExists('.replit'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'codeium',
    displayName: 'Codeium',
    skillsDir: (home) => join(home, '.codeium', 'skills'),
    detect: () => dirExists('.codeium'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'qodo',
    displayName: 'Qodo',
    skillsDir: (home) => join(home, '.qodo', 'skills'),
    detect: () => dirExists('.qodo'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'codestory',
    displayName: 'CodeStory',
    skillsDir: (home) => join(home, '.codestory', 'skills'),
    detect: () => dirExists('.codestory'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'privy',
    displayName: 'Privy',
    skillsDir: (home) => join(home, '.privy', 'skills'),
    detect: () => dirExists('.privy'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'codegeex',
    displayName: 'CodeGeeX',
    skillsDir: (home) => join(home, '.codegeex', 'skills'),
    detect: () => dirExists('.codegeex'),
    adapter: 'skill-md',
    universal: true,
  },
  {
    name: 'claude-dev',
    displayName: 'Claude Dev',
    skillsDir: (home) => join(home, '.claude-dev', 'skills'),
    detect: () => dirExists('.claude-dev'),
    adapter: 'skill-md',
    universal: true,
  },

  // ---- Agent-specific (their own format adapters) --------------------------

  {
    name: 'cursor',
    displayName: 'Cursor',
    skillsDir: (home) => join(home, '.cursor', 'rules'),
    detect: () => dirExists('.cursor'),
    adapter: 'mdc',
    universal: false,
  },
  {
    name: 'windsurf',
    displayName: 'Windsurf',
    skillsDir: (home) => join(home, '.windsurf', 'rules'),
    detect: () => dirExists('.windsurf'),
    adapter: 'generic-md',
    universal: false,
  },
  {
    name: 'copilot',
    displayName: 'GitHub Copilot',
    skillsDir: (home) => join(home, '.github', 'copilot-instructions'),
    detect: () => dirExists('.github'),
    adapter: 'generic-md',
    universal: false,
  },
  {
    name: 'augment',
    displayName: 'Augment',
    skillsDir: (home) => join(home, '.augment', 'skills'),
    detect: () => dirExists('.augment'),
    adapter: 'skill-md',
    universal: false,
  },
  {
    name: 'kiro',
    displayName: 'Kiro',
    skillsDir: (home) => join(home, '.kiro', 'skills'),
    detect: () => dirExists('.kiro'),
    adapter: 'skill-md',
    universal: false,
  },
  {
    name: 'avante',
    displayName: 'Avante (Neovim)',
    skillsDir: (home) => join(home, '.avante', 'rules'),
    detect: () => dirExists('.avante'),
    adapter: 'generic-md',
    universal: false,
  },
  {
    name: 'cody-vscode',
    displayName: 'Cody (VS Code)',
    skillsDir: (home) => join(home, '.vscode', 'cody'),
    detect: () => dirExists('.vscode', 'cody'),
    adapter: 'generic-md',
    universal: false,
  },
  {
    name: 'jetbrains-ai',
    displayName: 'JetBrains AI',
    skillsDir: (home) => join(home, '.jetbrains', 'ai', 'skills'),
    detect: () => dirExists('.jetbrains'),
    adapter: 'generic-md',
    universal: false,
  },
  {
    name: 'amazon-q',
    displayName: 'Amazon Q',
    skillsDir: (home) => join(home, '.aws', 'amazonq', 'skills'),
    detect: () => dirExists('.aws', 'amazonq'),
    adapter: 'generic-md',
    universal: false,
  },
  {
    name: 'pieces',
    displayName: 'Pieces',
    skillsDir: (home) => join(home, '.pieces', 'skills'),
    detect: () => dirExists('.pieces'),
    adapter: 'generic-md',
    universal: false,
  },
  {
    name: 'sourcery',
    displayName: 'Sourcery',
    skillsDir: (home) => join(home, '.sourcery', 'rules'),
    detect: () => dirExists('.sourcery'),
    adapter: 'generic-md',
    universal: false,
  },
];

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/**
 * Resolves the actual skills directory path for a given agent definition.
 */
export function getAgentSkillsDir(agent: AgentDefinition): string {
  if (typeof agent.skillsDir === 'function') {
    return agent.skillsDir(homeDir);
  }
  return agent.skillsDir;
}

/**
 * Returns all agents whose config directories exist on disk.
 */
export function getInstalledAgents(): AgentDefinition[] {
  return AGENTS.filter((agent) => agent.detect());
}
