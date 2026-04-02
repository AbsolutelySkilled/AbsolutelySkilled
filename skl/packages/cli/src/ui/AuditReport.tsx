import React from 'react';
import { Text, Box } from 'ink';
import type { AuditReport as AuditReportType } from '@skl/shared';

const LABELS: Record<string, string> = {
  promptInjection: 'Prompt Injection',
  dangerousOps: 'Dangerous Ops',
  dataExfiltration: 'Data Exfiltration',
  supplyChain: 'Supply Chain',
  structuralQuality: 'Structural Quality',
  behavioralSafety: 'Behavioral Safety',
};

function severityColor(severity: string): string {
  if (severity === 'clean' || severity === 'info') return 'green';
  if (severity === 'low') return 'cyan';
  if (severity === 'medium') return 'yellow';
  return 'red';
}

type Props = { audit: AuditReportType };

export default function AuditReport({ audit }: Props) {
  const cats = Object.entries(audit.categories) as [string, { score: number; severity: string; findingCount: number }][];

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>Audit Score: </Text>
      <Text bold color={audit.score >= 8 ? 'green' : audit.score >= 5 ? 'yellow' : 'red'}>
        {'  '}{audit.score.toFixed(1)}/10
      </Text>
      <Text dimColor>  Last audited: {audit.lastAudited}</Text>
      <Box flexDirection="column" marginTop={1}>
        {cats.map(([key, cat]) => (
          <Text key={key}>
            {'  '}{(LABELS[key] ?? key).padEnd(22)}
            <Text color={severityColor(cat.severity)}>{cat.score.toFixed(1).padStart(4)}</Text>
            {'  '}{cat.severity.padEnd(8)}
            {'  '}{cat.findingCount} finding{cat.findingCount === 1 ? '' : 's'}
          </Text>
        ))}
      </Box>
      {audit.findings.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>  Findings ({audit.findings.length}):</Text>
          {audit.findings.map((f) => (
            <Text key={f.id}>
              {'    '}<Text color={severityColor(f.severity)}>[{f.severity}]</Text> {f.title}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}
