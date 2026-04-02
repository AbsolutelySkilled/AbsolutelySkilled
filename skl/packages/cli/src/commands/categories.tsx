import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';
import { defaultClient } from '@skl/shared';
import type { CategoryInfo } from '@skl/shared';

export const options = z.object({
  json: z.boolean().default(false).describe('Output as JSON'),
});

type Props = {
  options: z.infer<typeof options>;
};

export default function Categories({ options: opts }: Props) {
  const [cats, setCats] = useState<CategoryInfo[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    defaultClient.getCategories().then((data) => {
      setCats(data.sort((a, b) => b.count - a.count));
    }).catch((err) => {
      setError(err instanceof Error ? err.message : String(err));
    });
  }, []);

  if (error) return <Text color="red">{'✗ '}{error}</Text>;
  if (!cats) return <Text color="yellow">Loading...</Text>;

  if (opts.json) return <Text>{JSON.stringify(cats, null, 2)}</Text>;

  const nameW = Math.max(10, ...cats.map((c) => c.name.length)) + 2;

  return (
    <Box flexDirection="column">
      <Text bold>
        {'Name'.padEnd(nameW)}{'Count'.padEnd(8)}Top Skills
      </Text>
      {cats.map((c) => (
        <Text key={c.name}>
          {c.name.padEnd(nameW)}
          {String(c.count).padStart(4).padEnd(8)}
          {c.topSkills.slice(0, 3).join(', ')}
        </Text>
      ))}
      <Text dimColor>{'\n'}{cats.length} categories</Text>
    </Box>
  );
}
