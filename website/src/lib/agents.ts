export interface AgentInfo {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  website: string;
  skillsKeyword: string;
  features: string[];
}

export const AGENTS: AgentInfo[] = [
  {
    slug: 'claude-code',
    name: 'Claude Code',
    tagline: 'Skills for Claude Code - Anthropic\'s AI Coding Agent',
    description:
      'Browse production-ready skills for Claude Code, Anthropic\'s CLI-based AI coding agent. Install skills to teach Claude Code specialized knowledge in software engineering, marketing, design, DevOps, and more.',
    website: 'https://claude.ai/claude-code',
    skillsKeyword: 'claude-code',
    features: [
      'CLI-native agent with full filesystem access',
      'Supports skills protocol for extensibility',
      'Available as desktop app, web app, and IDE extensions',
      'Powered by Claude Opus and Sonnet models',
    ],
  },
  {
    slug: 'cursor',
    name: 'Cursor',
    tagline: 'Skills for Cursor - The AI-First Code Editor',
    description:
      'Browse production-ready skills and rules for Cursor, the AI-first code editor. Install skills to extend Cursor\'s AI capabilities with specialized knowledge across engineering, testing, design, and more.',
    website: 'https://cursor.com',
    skillsKeyword: 'cursor',
    features: [
      'AI-first IDE built on VS Code',
      'Inline AI code generation and editing',
      'Supports custom rules and skills for AI behavior',
      'Multi-file editing with codebase awareness',
    ],
  },
  {
    slug: 'windsurf',
    name: 'Windsurf',
    tagline: 'Skills for Windsurf - AI-Powered IDE by Codeium',
    description:
      'Browse production-ready skills for Windsurf (formerly Codeium), the AI-powered IDE. Install skills to teach Windsurf\'s AI agent specialized knowledge for coding, testing, DevOps, and beyond.',
    website: 'https://codeium.com/windsurf',
    skillsKeyword: 'windsurf',
    features: [
      'AI-powered IDE with Cascade agent',
      'Multi-file editing and refactoring',
      'Supports custom rules and skills',
      'Deep codebase understanding and indexing',
    ],
  },
  {
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    tagline: 'Skills for GitHub Copilot - AI Pair Programmer',
    description:
      'Browse production-ready skills for GitHub Copilot, the AI pair programmer by GitHub. Install skills to enhance Copilot\'s capabilities with domain-specific knowledge across engineering, operations, and more.',
    website: 'https://github.com/features/copilot',
    skillsKeyword: 'github-copilot',
    features: [
      'Integrated into VS Code, JetBrains, and Neovim',
      'AI pair programming with code suggestions',
      'Copilot Chat for explanations and refactoring',
      'Supports custom instructions and skills',
    ],
  },
  {
    slug: 'gemini-cli',
    name: 'Gemini CLI',
    tagline: 'Skills for Gemini CLI - Google\'s AI Coding Agent',
    description:
      'Browse production-ready skills for Gemini CLI, Google\'s command-line AI coding agent. Install skills to teach Gemini CLI specialized knowledge in software engineering, cloud, infrastructure, and more.',
    website: 'https://cloud.google.com/gemini',
    skillsKeyword: 'gemini-cli',
    features: [
      'CLI-based agent powered by Gemini models',
      'Native Google Cloud integration',
      'Supports skills protocol for extensibility',
      'Multi-modal input support',
    ],
  },
  {
    slug: 'openai-codex',
    name: 'OpenAI Codex',
    tagline: 'Skills for OpenAI Codex - AI Coding Agent by OpenAI',
    description:
      'Browse production-ready skills for OpenAI Codex, the cloud-based AI coding agent. Install skills to extend Codex with specialized knowledge across engineering, data, AI/ML, and more.',
    website: 'https://openai.com',
    skillsKeyword: 'openai-codex',
    features: [
      'Cloud-based AI coding agent',
      'Powered by OpenAI models',
      'Sandboxed execution environment',
      'Supports skills protocol for extensibility',
    ],
  },
];

export function getAgentBySlug(slug: string): AgentInfo | undefined {
  return AGENTS.find((a) => a.slug === slug);
}
