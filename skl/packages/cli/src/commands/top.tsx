import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';
import { defaultClient } from '@skl/shared';
import type { RegistryEntry } from '@skl/shared';

export const args = z.tuple([z.string().optional()]).describe('category filter');

export const options = z.object({
  limit: z.number().default(10).describe('Number of results'),
  weekly: z.boolean().default(false).describe('Sort by weekly installs'),
  json: z.boolean().default(false).describe('Output as JSON'),
});

type Props = {
  args: z.infer<typeof args>;
  options: z.infer<typeof options>;
};

export default function Top({ args: [category], options: opts }: Props) {
  const [skills, setSkills] = useState<RegistryEntry[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    defaultClient.getTop({
      category,
      limit: opts.limit,
      period: opts.weekly ? 'weekly' : 'all',
    }).then(setSkills).catch((err) => {
      setError(err instanceof Error ? err.message : String(err));
    });
  }, []);

  if (error) return <Text color="red">{'✗ '}{error}</Text>;
  if (!skills) return <Text color="yellow">Loading...</Text>;

  if (opts.json) return <Text>{JSON.stringify(skills, null, 2)}</Text>;

  const nameW = Math.max(6, ...skills.map((s) => s.name.length)) + 2;

  return (
    <Box flexDirection="column">
      <Text bold>
        {'#'.padEnd(4)}{'Name'.padEnd(nameW)}{'Score'.padEnd(8)}{'Installs'.padEnd(12)}Category
      </Text>
      {skills.map((s, i) => (
        <Text key={s.name}>
          {String(i + 1).padStart(2).padEnd(4)}
          {s.name.padEnd(nameW)}
          {String(s.audit.score).padStart(3).padEnd(8)}
          {String(s.telemetry.totalInstalls).padStart(7).padEnd(12)}
          {s.category}
        </Text>
      ))}
      <Text dimColor>
        {'\n'}Top {skills.length} skills{category ? ` in ${category}` : ''}{opts.weekly ? ' (weekly)' : ''}
      </Text>
    </Box>
  );
}
