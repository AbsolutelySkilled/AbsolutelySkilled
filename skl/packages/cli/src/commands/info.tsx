import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';
import { defaultClient } from '@skl/shared';
import type { RegistryEntry } from '@skl/shared';
import AuditReport from '../ui/AuditReport.js';

export const args = z.tuple([z.string()]).describe('skill name');

export const options = z.object({
  json: z.boolean().default(false).describe('Output as JSON'),
});

type Props = {
  args: z.infer<typeof args>;
  options: z.infer<typeof options>;
};

export default function Info({ args: [name], options: opts }: Props) {
  const [skill, setSkill] = useState<RegistryEntry | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    defaultClient.getSkill(name).then(setSkill).catch((err) => {
      setError(err instanceof Error ? err.message : String(err));
    });
  }, []);

  if (error) return <Text color="red">{'✗ '}{error}</Text>;
  if (!skill) return <Text color="yellow">Loading...</Text>;

  if (opts.json) return <Text>{JSON.stringify(skill, null, 2)}</Text>;

  return (
    <Box flexDirection="column">
      <Text>
        <Text bold color="cyan">{skill.name}</Text>
        {'  '}<Text dimColor>v{skill.version}</Text>
        {'  '}<Text color="magenta">[{skill.category}]</Text>
      </Text>
      <Text>{'\n'}{skill.description}</Text>
      <Text dimColor>{'\n'}Source: {skill.sourceUrl}</Text>
      <Text>
        Installs: <Text bold>{skill.telemetry.totalInstalls.toLocaleString()}</Text>
        {'  '}Weekly: <Text bold>{skill.telemetry.weeklyInstalls.toLocaleString()}</Text>
      </Text>
      {skill.hashDrift && (
        <Text color="yellow" bold>
          {'\n'}⚠ Hash drift detected - source content has changed since last crawl
        </Text>
      )}
      <AuditReport audit={skill.audit} />
    </Box>
  );
}
