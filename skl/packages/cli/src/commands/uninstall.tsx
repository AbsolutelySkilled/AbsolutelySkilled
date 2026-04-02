import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';
import { uninstallSkill, listInstalledSkills } from '@skl/shared';

export const args = z.tuple([z.string().optional().describe('Skill name to uninstall')]);

export const options = z.object({
  all: z.boolean().default(false).describe('Uninstall all skills'),
  agent: z.string().optional().describe('Target agent (e.g. claude, cursor, windsurf)'),
});

type Props = {
  args: z.infer<typeof args>;
  options: z.infer<typeof options>;
};

type Status = 'idle' | 'running' | 'done' | 'error';

export default function Uninstall({ args: positionalArgs, options: opts }: Props) {
  const [name] = positionalArgs;
  const [status, setStatus] = useState<Status>('idle');
  const [removed, setRemoved] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name && !opts.all) {
      setError('Provide a skill name or use --all');
      setStatus('error');
      return;
    }

    let cancelled = false;

    async function run() {
      setStatus('running');
      try {
        if (opts.all) {
          const skills = await listInstalledSkills();
          if (skills.length === 0) {
            setRemoved([]);
            setStatus('done');
            return;
          }
          for (const skill of skills) {
            if (cancelled) return;
            await uninstallSkill(skill.name);
            setRemoved((prev) => [...prev, skill.name]);
          }
        } else {
          await uninstallSkill(name!);
          setRemoved([name!]);
        }
        if (!cancelled) setStatus('done');
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setStatus('error');
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  if (status === 'error') {
    return <Text color="red">{'✗ '}{error}</Text>;
  }

  if (status === 'running') {
    return (
      <Box flexDirection="column">
        <Text color="yellow">Uninstalling...</Text>
        {removed.map((s) => <Text key={s} color="green">{'✓ '}{s}</Text>)}
      </Box>
    );
  }

  if (status === 'done') {
    if (removed.length === 0) {
      return <Text dimColor>No skills installed to remove.</Text>;
    }
    return (
      <Box flexDirection="column">
        {removed.map((s) => <Text key={s} color="green">{'✓ '}{s} uninstalled</Text>)}
        <Text dimColor>{removed.length} skill{removed.length === 1 ? '' : 's'} removed</Text>
      </Box>
    );
  }

  return null;
}
