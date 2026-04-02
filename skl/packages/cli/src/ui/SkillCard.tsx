import React from 'react';
import { Text, Box } from 'ink';
import type { RegistryEntry } from '@skl/shared';

interface Props {
  skill: RegistryEntry;
  selected: boolean;
}

export function SkillCard({ skill, selected }: Props) {
  const score = skill.audit?.score ?? 0;
  const installs = skill.telemetry?.totalInstalls ?? 0;
  const scoreBadge =
    score >= 8 ? 'green' : score >= 5 ? 'yellow' : 'red';

  return (
    <Box>
      <Text color={selected ? 'cyan' : undefined} bold={selected}>
        {selected ? '> ' : '  '}
        {skill.name.padEnd(24)}
      </Text>
      <Text dimColor>v{skill.version.padEnd(8)}</Text>
      <Text color={scoreBadge}>{score.toFixed(1).padStart(4)}/10</Text>
      <Text dimColor>  {String(installs).padStart(5)} installs</Text>
    </Box>
  );
}
