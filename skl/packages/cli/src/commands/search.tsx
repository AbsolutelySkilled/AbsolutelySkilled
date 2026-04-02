import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';
import { defaultClient } from '@skl/shared';
import type { RegistryEntry, SkillCategory } from '@skl/shared';

export const args = z.tuple([z.string().optional()]).describe('Search query');

export const options = z.object({
  category: z.string().optional().describe('Filter by category'),
  minScore: z.number().optional().describe('Minimum audit score (0-10)'),
  limit: z.number().default(20).describe('Max results to return'),
  json: z.boolean().default(false).describe('Output as JSON'),
});

type Props = {
  args: z.infer<typeof args>;
  options: z.infer<typeof options>;
};

function scoreColor(score: number): string {
  if (score >= 7) return 'green';
  if (score >= 4) return 'yellow';
  return 'red';
}

export default function Search({ args: [query], options: opts }: Props) {
  const [results, setResults] = useState<RegistryEntry[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      try {
        const res = await defaultClient.search({
          query,
          category: opts.category as SkillCategory | undefined,
          minScore: opts.minScore,
          limit: opts.limit,
        });
        setResults(res.results);
        setTotal(res.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    run();
  }, []);

  if (error) return <Text color="red">{'✗ '}{error}</Text>;
  if (!results) return <Text color="yellow">Searching...</Text>;

  if (opts.json) {
    return <Text>{JSON.stringify({ results, total }, null, 2)}</Text>;
  }

  if (results.length === 0) {
    return <Text dimColor>No skills found matching '{query || '*'}'</Text>;
  }

  const nW = Math.max(6, ...results.map((s) => s.name.length)) + 2;
  const vW = 10, sW = 7, iW = 10;
  const cW = Math.max(10, ...results.map((s) => s.category.length)) + 2;
  const header = ['Name'.padEnd(nW), 'Version'.padEnd(vW), 'Score'.padEnd(sW),
    'Installs'.padEnd(iW), 'Category'.padEnd(cW), 'Source'].join('');

  return (
    <Box flexDirection="column">
      <Text bold>{header}</Text>
      {results.map((s) => (
        <Text key={s.name}>
          <Text color="cyan">{s.name.padEnd(nW)}</Text>
          {s.version.padEnd(vW)}
          <Text color={scoreColor(s.audit.score)}>{String(s.audit.score).padEnd(sW)}</Text>
          {String(s.telemetry.totalInstalls).padEnd(iW)}
          {s.category.padEnd(cW)}
          {s.source}
        </Text>
      ))}
      <Text dimColor>
        {'\n'}{results.length} of {total} result{total === 1 ? '' : 's'}
        {query ? ` for '${query}'` : ''}
      </Text>
    </Box>
  );
}
