import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { z } from 'zod';

import {
  parseSource,
  fetchSkills, cleanupFetch, type FetchResult,
  installSkills, type InstallResult,
  getInstalledAgents, AGENTS, type AgentDefinition,
} from '@skl/shared';

export const args = z.tuple([
  z.string().describe('Package specifier (GitHub URL, owner/repo, or local path)'),
]);

export const options = z.object({
  global: z.boolean().default(false).describe('Install globally for all agents (-g)'),
  yes: z.boolean().default(false).describe('Skip confirmation prompts (-y)'),
  agent: z.string().optional().describe('Target agent (e.g. claude, cursor, windsurf)'),
  trust: z.boolean().default(false).describe('Trust the skill and skip integrity checks'),
  category: z.string().optional().describe('Override skill category'),
});

type Props = {
  args: z.infer<typeof args>;
  options: z.infer<typeof options>;
};

type Step = 'resolving' | 'fetching' | 'installing' | 'done' | 'error';

export default function Install({ args: positionalArgs, options: opts }: Props) {
  const [specifier] = positionalArgs;
  const [step, setStep] = useState<Step>('resolving');
  const [error, setError] = useState<string>('');
  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);
  const [installResult, setInstallResult] = useState<InstallResult | null>(null);
  const [agents, setAgents] = useState<AgentDefinition[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // 1. Resolve source
        const source = parseSource(specifier);
        if (cancelled) return;

        // 2. Fetch skills
        setStep('fetching');
        const result = await fetchSkills(source);
        if (cancelled) return;
        setFetchResult(result);

        if (result.skills.length === 0) {
          setError('No skills found in the specified source.');
          setStep('error');
          return;
        }

        // 3. Determine target agents
        let targetAgents: AgentDefinition[];
        if (opts.agent) {
          const match = AGENTS.find((a) => a.name === opts.agent);
          if (!match) {
            setError(`Unknown agent: ${opts.agent}`);
            setStep('error');
            return;
          }
          targetAgents = [match];
        } else {
          targetAgents = getInstalledAgents();
        }

        if (targetAgents.length === 0) {
          setError('No supported agents detected. Use --agent to specify one.');
          setStep('error');
          return;
        }

        setAgents(targetAgents);
        if (cancelled) return;

        // 4. Install all discovered skills to all target agents
        setStep('installing');
        const sourceUrl = source.url;
        const installed = await installSkills({
          skills: result.skills,
          agents: targetAgents,
          source,
          sourceUrl,
          commitHash: result.commitHash,
        });
        if (cancelled) return;
        setInstallResult(installed);

        // 5. Cleanup temp directory
        if (source.type !== 'local') {
          await cleanupFetch(result);
        }

        setStep('done');
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setStep('error');
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, [specifier, opts.agent]);

  if (step === 'error') {
    return (
      <Box flexDirection="column">
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  if (step === 'fetching' || step === 'resolving') {
    return <Text dimColor>Fetching from {specifier}...</Text>;
  }

  if (step === 'installing') {
    return <Text dimColor>Installing {fetchResult?.skills.length ?? 0} skill(s)...</Text>;
  }

  const { installed = [], errors = [] } = installResult ?? {};

  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column">
        {installed.map((s) => (
          <Text key={s.name}>
            <Text color="green">  ✓ </Text>
            <Text bold>{s.name}</Text>
            <Text dimColor> → {s.agents.join(', ')}</Text>
          </Text>
        ))}
        {errors.map((e) => (
          <Text key={e.skill} color="red">  ✗ {e.skill}: {e.error}</Text>
        ))}
      </Box>
      <Text dimColor>
        {installed.length} skill(s) installed to {agents.length} agent(s)
      </Text>
    </Box>
  );
}
