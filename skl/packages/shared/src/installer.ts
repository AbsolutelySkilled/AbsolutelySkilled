// SKL Installer - install/uninstall/list skills for target agents

import { mkdir, readdir, readFile, rm, symlink, writeFile, cp, lstat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import matter from 'gray-matter';

import type {
  DiscoveredSkill,
  InstalledSkill,
  SKLLockEntry,
  SkillSource,
} from './types.js';
import { CANONICAL_SKILLS_DIR } from './constants.js';
import type { AgentDefinition } from './agents.js';
import { getAgentSkillsDir } from './agents.js';
import { adaptSkill } from './adapters.js';
import type { AdapterType } from './adapters.js';
import { computeContentHash } from './hasher.js';
import {
  addSkillToGlobalLock,
  addSkillToLocalLock,
  readGlobalLock,
  removeSkillFromGlobalLock,
  removeSkillFromLocalLock,
} from './lockfile.js';
import { sanitizeName } from './resolver.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InstallOptions {
  skills: DiscoveredSkill[];
  agents: AgentDefinition[];
  source: SkillSource;
  sourceUrl: string;
  commitHash: string;
}

export interface InstallResult {
  installed: InstalledSkill[];
  errors: { skill: string; error: string }[];
}

// ---------------------------------------------------------------------------
// installSkills
// ---------------------------------------------------------------------------

export async function installSkills(options: InstallOptions): Promise<InstallResult> {
  const { skills, agents, source, sourceUrl, commitHash } = options;
  const installed: InstalledSkill[] = [];
  const errors: { skill: string; error: string }[] = [];

  for (const skill of skills) {
    try {
      const safeName = sanitizeName(skill.name);

      // Compute content hash from the skill content
      const canonicalDir = join(CANONICAL_SKILLS_DIR, safeName);

      // Copy skill to canonical directory
      await mkdir(canonicalDir, { recursive: true });
      await writeFile(join(canonicalDir, 'SKILL.md'), skill.content, 'utf-8');

      // Compute hash from the canonical dir
      const contentHash = await computeContentHash(canonicalDir);

      // Parse frontmatter for metadata
      const { data } = matter(skill.content);
      const declaredVersion = typeof data.version === 'string' ? data.version : '0.0.0';

      // Install to each agent
      const agentNames: string[] = [];
      for (const agent of agents) {
        const agentDir = getAgentSkillsDir(agent);
        const agentSkillDir = join(agentDir, safeName);

        if (agent.universal) {
          // Universal agents: symlink from agent dir -> canonical
          await mkdir(agentDir, { recursive: true });
          try {
            // Remove existing symlink/dir first
            await rm(agentSkillDir, { recursive: true, force: true });
            await symlink(canonicalDir, agentSkillDir);
          } catch {
            // Symlink failed (e.g. Windows) - fall back to copy
            await mkdir(agentSkillDir, { recursive: true });
            await writeFile(
              join(agentSkillDir, 'SKILL.md'),
              skill.content,
              'utf-8',
            );
          }
        } else {
          // Non-universal agents: copy with adapted content
          const adapted = adaptSkill(
            skill.content,
            data as Parameters<typeof adaptSkill>[1],
            agent.adapter as AdapterType,
          );
          await mkdir(agentSkillDir, { recursive: true });
          const ext = agent.adapter === 'mdc' ? '.mdc' : '.md';
          const filename = agent.adapter === 'skill-md' ? 'SKILL.md' : `${safeName}${ext}`;
          await writeFile(join(agentSkillDir, filename), adapted, 'utf-8');
        }

        agentNames.push(agent.name);
      }

      // Build lock entry
      const now = new Date().toISOString();
      const lockEntry: SKLLockEntry = {
        source: source.type,
        sourceUrl,
        skillPath: skill.skillPath,
        contentHash,
        declaredVersion,
        auditScore: null,
        installedAt: now,
        updatedAt: now,
        agents: agentNames,
        hashAtInstall: commitHash,
      };

      // Update lock files
      await addSkillToGlobalLock(safeName, lockEntry);
      await addSkillToLocalLock(safeName, {
        source: source.type,
        contentHash,
        declaredVersion,
      });

      installed.push({
        name: safeName,
        description: skill.description,
        path: canonicalDir,
        agents: agentNames,
        lock: lockEntry,
      });
    } catch (err) {
      errors.push({
        skill: skill.name,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { installed, errors };
}

// ---------------------------------------------------------------------------
// uninstallSkill
// ---------------------------------------------------------------------------

export async function uninstallSkill(name: string): Promise<void> {
  const safeName = sanitizeName(name);

  // Read the global lock to find which agents have this skill
  const lock = await readGlobalLock();
  const entry = lock.skills[safeName];
  const agentNames = entry?.agents ?? [];

  // Remove canonical directory
  const canonicalDir = join(CANONICAL_SKILLS_DIR, safeName);
  await rm(canonicalDir, { recursive: true, force: true });

  // Remove from each agent's skills directory
  // Import AGENTS lazily to get all agent definitions
  const { AGENTS } = await import('./agents.js');
  for (const agent of AGENTS) {
    if (agentNames.length === 0 || !agentNames.includes(agent.name)) continue;
    const agentDir = getAgentSkillsDir(agent);
    const agentSkillDir = join(agentDir, safeName);
    try {
      await rm(agentSkillDir, { recursive: true, force: true });
    } catch {
      // Agent dir may not exist - ignore
    }
  }

  // Remove from lock files
  await removeSkillFromGlobalLock(safeName);
  await removeSkillFromLocalLock(safeName);
}

// ---------------------------------------------------------------------------
// listInstalledSkills
// ---------------------------------------------------------------------------

export async function listInstalledSkills(): Promise<InstalledSkill[]> {
  const lock = await readGlobalLock();
  const results: InstalledSkill[] = [];

  for (const [name, entry] of Object.entries(lock.skills)) {
    const canonicalDir = join(CANONICAL_SKILLS_DIR, name);

    // Check if canonical dir still exists
    try {
      await lstat(canonicalDir);
    } catch {
      continue; // Directory doesn't exist - skip stale entry
    }

    // Parse SKILL.md for description
    let description = '';
    try {
      const content = await readFile(join(canonicalDir, 'SKILL.md'), 'utf-8');
      const { data } = matter(content);
      description = typeof data.description === 'string' ? data.description : '';
    } catch {
      // Can't read SKILL.md - use empty description
    }

    results.push({
      name,
      description,
      path: canonicalDir,
      agents: entry.agents,
      lock: entry,
    });
  }

  return results;
}
