// ---------------------------------------------------------------------------
// SKL Shared Types - all interfaces from the design spec
// ---------------------------------------------------------------------------

// -- Skill Categories & Platforms ------------------------------------------

export type SkillCategory =
  | 'engineering'
  | 'operations'
  | 'marketing'
  | 'ai-ml'
  | 'design'
  | 'product'
  | 'devtools'
  | 'sales'
  | 'data'
  | 'infra'
  | 'monitoring'
  | 'cloud'
  | 'writing'
  | 'workflow'
  | 'analytics'
  | 'game-development'
  | 'developer-tools'
  | 'communication'
  | 'video';

export type AgentPlatform =
  | 'claude-code'
  | 'codex'
  | 'cursor'
  | 'windsurf'
  | 'copilot'
  | 'cline'
  | 'roo-code'
  | 'aider'
  | 'continue'
  | 'zed'
  | 'amp'
  | 'opencode'
  | 'gemini-cli'
  | 'kilo-code'
  | 'trae'
  | 'void'
  | 'aide'
  | 'pear-ai'
  | 'all';

// -- Skill Metadata (parsed from SKILL.md frontmatter) ---------------------

export interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  platforms: AgentPlatform[];
  recommended_skills: string[];
  license: string;
  maintainers: { github: string }[];
}

// -- Global Lock File (~/.agents/.skl-lock.json) ---------------------------

export interface SKLGlobalLock {
  version: 4;
  skills: Record<string, SKLLockEntry>;
  trustedSources: string[];
  config: {
    telemetry: boolean;
    defaultAgents: string[];
  };
  migrated?: {
    from: 'vercel-skills';
    at: string;
    count: number;
  };
}

export interface SKLLockEntry {
  source: string;
  sourceUrl: string;
  skillPath: string;
  contentHash: string;
  declaredVersion: string;
  auditScore: number | null;
  installedAt: string;
  updatedAt: string;
  agents: string[];
  hashAtInstall: string;
}

// -- Local Lock File (./skl-lock.json) -------------------------------------

export interface SKLLocalLock {
  version: 1;
  skills: Record<
    string,
    {
      source: string;
      contentHash: string;
      declaredVersion: string;
    }
  >;
}

// -- Registry Index Entry --------------------------------------------------

export interface RegistryEntry {
  name: string;
  version: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  source: string;
  sourceUrl: string;
  skillPath: string;
  contentHash: string;
  audit: AuditReport;
  telemetry: {
    totalInstalls: number;
    weeklyInstalls: number;
    monthlyInstalls: number;
  };
  hashDrift: boolean;
  lastCrawled: string;
  firstIndexed: string;
}

// -- Audit Types -----------------------------------------------------------

export interface AuditReport {
  score: number;
  categories: {
    promptInjection: CategoryScore;
    dangerousOps: CategoryScore;
    dataExfiltration: CategoryScore;
    supplyChain: CategoryScore;
    structuralQuality: CategoryScore;
    behavioralSafety: CategoryScore;
  };
  findings: AuditFinding[];
  lastAudited: string;
}

export interface CategoryScore {
  score: number;
  severity: 'clean' | 'info' | 'low' | 'medium' | 'high' | 'critical';
  findingCount: number;
}

export interface AuditFinding {
  id: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  location?: string;
  recommendation: string;
}

// -- Telemetry -------------------------------------------------------------

export interface TelemetryEvent {
  event:
    | 'install'
    | 'uninstall'
    | 'search'
    | 'upgrade'
    | 'browse'
    | 'audit'
    | 'verify';
  skill?: string;
  source?: string;
  agent?: string;
  sklVersion: string;
  timestamp: string;
  ci: boolean;
  os: 'darwin' | 'linux' | 'win32';
}

// -- Per-repo skills.yaml Manifest -----------------------------------------

export interface SkillsManifest {
  registry: {
    name: string;
    description: string;
    homepage?: string;
  };
  skills: {
    name: string;
    path: string;
  }[];
}

// -- Skill Source (parsed specifier) ---------------------------------------

export interface SkillSource {
  type: 'github' | 'gitlab' | 'url' | 'local' | 'registry';
  url: string;
  owner?: string;
  repo?: string;
  ref?: string;
  subpath?: string;
  skillFilter?: string;
}

// -- Discovered Skill (from fetcher/crawler) -------------------------------

export interface DiscoveredSkill {
  name: string;
  description: string;
  skillPath: string;
  content: string;
}

// -- Installed Skill (from lock file + filesystem) -------------------------

export interface InstalledSkill {
  name: string;
  description: string;
  path: string;
  agents: string[];
  lock: SKLLockEntry;
}
