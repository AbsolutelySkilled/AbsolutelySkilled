import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';
import {
  readGlobalLock,
  readLocalLock,
  writeLocalLock,
  CANONICAL_SKILLS_DIR,
  computeContentHash,
} from '@skl/shared';
import { join } from 'node:path';

export const options = z.object({
  verify: z.boolean().default(false).describe('Verify lockfile integrity without updating'),
});

type Props = {
  options: z.infer<typeof options>;
};

type Mismatch = { name: string; expected: string; actual: string };

export default function Lock({ options: opts }: Props) {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const [mismatches, setMismatches] = useState<Mismatch[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      try {
        if (opts.verify) {
          const local = await readLocalLock();
          const entries = Object.entries(local.skills);
          setCount(entries.length);
          const bad: Mismatch[] = [];
          for (const [name, entry] of entries) {
            try {
              const dir = join(CANONICAL_SKILLS_DIR, name);
              const actual = await computeContentHash(dir);
              if (actual !== entry.contentHash) {
                bad.push({ name, expected: entry.contentHash.slice(0, 8), actual: actual.slice(0, 8) });
              }
            } catch {
              bad.push({ name, expected: entry.contentHash.slice(0, 8), actual: 'missing' });
            }
          }
          setMismatches(bad);
        } else {
          const global = await readGlobalLock();
          const skills: Record<string, { source: string; contentHash: string; declaredVersion: string }> = {};
          for (const [name, entry] of Object.entries(global.skills)) {
            skills[name] = {
              source: entry.source,
              contentHash: entry.contentHash,
              declaredVersion: entry.declaredVersion,
            };
          }
          await writeLocalLock({ version: 1, skills });
          setCount(Object.keys(skills).length);
        }
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    run();
  }, []);

  if (error) return <Text color="red">{'✗ '}{error}</Text>;
  if (!done) return <Text color="yellow">{opts.verify ? 'Verifying...' : 'Generating lock...'}</Text>;

  if (opts.verify) {
    if (mismatches.length === 0) {
      return <Text color="green">{'✓ '}All {count} skills match their lock hashes</Text>;
    }
    return (
      <Box flexDirection="column">
        <Text color="red">{'✗ '}{mismatches.length} mismatch{mismatches.length === 1 ? '' : 'es'} found:</Text>
        {mismatches.map((m) => (
          <Text key={m.name} color="red">  {m.name}: expected {m.expected}, got {m.actual}</Text>
        ))}
      </Box>
    );
  }

  return <Text color="green">{'✓ '}Lock file written with {count} skill{count === 1 ? '' : 's'}</Text>;
}
