import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { listInstalledSkills } from '@skl/shared';
import type { InstalledSkill } from '@skl/shared';

export const options = z.object({
  agent: z.string().optional().describe('Filter by agent (e.g. claude, cursor, windsurf)'),
  json: z.boolean().default(false).describe('Output as JSON'),
});

type Props = {
  options: z.infer<typeof options>;
};

export default function List({ options: opts }: Props) {
  const [skills, setSkills] = useState<InstalledSkill[] | null>(null);
  const [vercelCount, setVercelCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      try {
        let installed = await listInstalledSkills();
        if (opts.agent) {
          installed = installed.filter((s) => s.agents.includes(opts.agent!));
        }
        setSkills(installed);

        // Check for Vercel Skills lock (migration detection)
        try {
          const vercelLock = join(homedir(), '.agents', '.skill-lock.json');
          const raw = await readFile(vercelLock, 'utf-8');
          const parsed = JSON.parse(raw) as { skills?: Record<string, unknown> };
          const count = parsed.skills ? Object.keys(parsed.skills).length : 0;
          if (count > 0) setVercelCount(count);
        } catch {
          // No Vercel Skills lock - ignore
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    run();
  }, []);

  if (error) return <Text color="red">{'✗ '}{error}</Text>;
  if (!skills) return <Text color="yellow">Loading...</Text>;

  if (opts.json) {
    return <Text>{JSON.stringify(skills, null, 2)}</Text>;
  }

  if (skills.length === 0) {
    return (
      <Box flexDirection="column">
        <Text dimColor>No skills installed. Run `skl install` to get started.</Text>
        {vercelCount > 0 && (
          <Text color="cyan">
            Detected {vercelCount} skills from Vercel Skills. Run 'skl import --from vercel-skills' to migrate.
          </Text>
        )}
      </Box>
    );
  }

  // Column widths
  const nameW = Math.max(6, ...skills.map((s) => s.name.length)) + 2;
  const verW = 10;
  const srcW = 10;
  const agentW = Math.max(8, ...skills.map((s) => s.agents.join(', ').length)) + 2;

  const header = [
    'Name'.padEnd(nameW),
    'Version'.padEnd(verW),
    'Source'.padEnd(srcW),
    'Agents'.padEnd(agentW),
    'Hash',
  ].join('');

  return (
    <Box flexDirection="column">
      <Text bold>{header}</Text>
      {skills.map((s) => (
        <Text key={s.name}>
          {s.name.padEnd(nameW)}
          {(s.lock.declaredVersion || '-').padEnd(verW)}
          {(s.lock.source || '-').padEnd(srcW)}
          {s.agents.join(', ').padEnd(agentW)}
          {s.lock.contentHash.slice(0, 8)}
        </Text>
      ))}
      <Text dimColor>{'\n'}{skills.length} skill{skills.length === 1 ? '' : 's'} installed</Text>
      {vercelCount > 0 && (
        <Text color="cyan">
          Detected {vercelCount} skills from Vercel Skills. Run 'skl import --from vercel-skills' to migrate.
        </Text>
      )}
    </Box>
  );
}
