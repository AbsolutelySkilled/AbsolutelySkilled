import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { Spinner } from '@inkjs/ui';
import { z } from 'zod';
import {
  readGlobalLock, type SKLLockEntry,
  parseSource, sanitizeName,
  fetchSkills, cleanupFetch, type FetchResult,
  installSkills,
  computeContentHash,
  getInstalledAgents,
} from '@skl/shared';
import { join } from 'node:path';

export const args = z.tuple([z.string().optional().describe('Skill name to upgrade')]);
export const options = z.object({
  all: z.boolean().default(false).describe('Upgrade all installed skills'),
  dryRun: z.boolean().default(false).describe('Show what would be upgraded without making changes'),
});
type Props = { args: z.infer<typeof args>; options: z.infer<typeof options> };
interface UpgradeInfo {
  name: string; oldHash: string; newHash: string;
  oldVersion: string; newVersion: string; hashDrift: boolean;
}

export default function Upgrade({ args: [name], options: opts }: Props) {
  const [status, setStatus] = useState('Checking for updates...');
  const [upgrades, setUpgrades] = useState<UpgradeInfo[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [error, setError] = useState(''); const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetched: FetchResult[] = [];
    const cleanup = async () => { for (const f of fetched) { try { await cleanupFetch(f); } catch {} } };

    (async () => {
      try {
        const lock = await readGlobalLock();
        let entries = Object.entries(lock.skills) as [string, SKLLockEntry][];
        if (!name && !opts.all) {
          setError('Specify a skill name or use --all to upgrade everything.');
          setDone(true); return;
        }
        if (name) {
          entries = entries.filter(([n]) => n === name);
          if (!entries.length) { setError(`Skill "${name}" is not installed.`); setDone(true); return; }
        }

        const found: UpgradeInfo[] = [];
        let upToDate = 0;
        for (const [skillName, entry] of entries) {
          if (cancelled) return;
          setStatus(`Checking ${skillName}...`);
          try {
            const result = await fetchSkills(parseSource(entry.sourceUrl));
            fetched.push(result);
            const match = result.skills.find(
              (s: { name: string; skillPath: string }) =>
                s.name.toLowerCase() === skillName.toLowerCase() || s.skillPath === entry.skillPath,
            );
            if (!match) { upToDate++; continue; }
            const { mkdir, writeFile } = await import('node:fs/promises');
            const tmpDir = join(result.tempDir, '__skl_hash__', skillName);
            await mkdir(tmpDir, { recursive: true });
            await writeFile(join(tmpDir, 'SKILL.md'), match.content, 'utf-8');
            const newHash = await computeContentHash(tmpDir);
            if (newHash === entry.contentHash) { upToDate++; continue; }
            const { data } = await import('gray-matter').then((m) => m.default(match.content));
            const newVer = typeof data.version === 'string' ? data.version : '0.0.0';
            found.push({
              name: skillName, oldHash: entry.contentHash, newHash,
              oldVersion: entry.declaredVersion, newVersion: newVer,
              hashDrift: newVer === entry.declaredVersion,
            });
          } catch { upToDate++; }
        }

        setUpgrades(found);
        setSkipped(upToDate);

        if (found.length && !opts.dryRun) {
          setStatus('Installing updates...');
          for (const fr of fetched) {
            const skills = fr.skills.filter((s: { name: string }) =>
              found.some((u) => u.name === sanitizeName(s.name)),
            );
            if (skills.length) {
              await installSkills({
                skills, agents: getInstalledAgents(), source: fr.source,
                sourceUrl: fr.source.url, commitHash: fr.commitHash,
              });
            }
          }
        }
        await cleanup(); setDone(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e)); await cleanup(); setDone(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) return <Text color="red">Error: {error}</Text>;
  if (!done) return <Box><Spinner label={status} /></Box>;

  return (
    <Box flexDirection="column">
      {upgrades.map((u) => (
        <Box key={u.name} flexDirection="column">
          <Text><Text color="green" bold>{u.name}</Text> {u.oldVersion} {'->'} {u.newVersion}</Text>
          <Text dimColor>  {u.oldHash.slice(0, 12)} {'->'} {u.newHash.slice(0, 12)}</Text>
          {u.hashDrift && <Text color="yellow">  warning: hash drift (version unchanged)</Text>}
        </Box>
      ))}
      {opts.dryRun && upgrades.length > 0 && <Text color="cyan">Dry run - no changes made.</Text>}
      <Text>{upgrades.length} skill{upgrades.length !== 1 ? 's' : ''} upgraded, {skipped} already up to date</Text>
    </Box>
  );
}
