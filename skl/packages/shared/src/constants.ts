import { join } from 'node:path';
import { homedir } from 'node:os';

// ---------------------------------------------------------------------------
// SKL Constants
// ---------------------------------------------------------------------------

// -- Versioning ------------------------------------------------------------

export const SKL_VERSION = '1.0.0';

/** Starts at 4 to continue from Vercel Skills v3, signaling compatible lineage */
export const LOCK_VERSION = 4 as const;

export const LOCAL_LOCK_VERSION = 1 as const;

// -- File Paths & Names ----------------------------------------------------

export const LOCK_FILENAME = '.skl-lock.json';

export const LOCAL_LOCK_FILENAME = 'skl-lock.json';

/** Canonical install directory: ~/.agents/skills/ */
export const CANONICAL_SKILLS_DIR = join(homedir(), '.agents', 'skills');

/** Global lock path: ~/.agents/.skl-lock.json */
export const GLOBAL_LOCK_PATH = join(homedir(), '.agents', LOCK_FILENAME);

// -- Registry & Discovery --------------------------------------------------

export const GITHUB_TOPIC = 'skl-skills';

export const DEFAULT_REGISTRY = 'https://absolutelyskilled.pro/api';

export const CLONE_TIMEOUT_MS = 60_000;

// -- Skill Discovery -------------------------------------------------------

/** Directories to skip when scanning for SKILL.md files */
export const SKIP_DIRS: ReadonlySet<string> = new Set([
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  '.output',
  'coverage',
  '__pycache__',
  '.venv',
  'venv',
  '.tox',
  'vendor',
  'target',
]);

export const MAX_DISCOVERY_DEPTH = 5;

/** Subdirectories checked first when scanning for skills */
export const PRIORITY_SUBDIRS: readonly string[] = [
  'skills',
  'prompts',
  'rules',
  '.cursor',
  '.claude',
  '.github',
  'docs',
];

// -- Telemetry -------------------------------------------------------------

/** Env vars that disable telemetry when set to a truthy value */
export const TELEMETRY_OPT_OUT_VARS: readonly string[] = [
  'SKL_TELEMETRY',
  'DO_NOT_TRACK',
];
