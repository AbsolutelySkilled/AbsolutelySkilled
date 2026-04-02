import React from 'react';
import { Text, Box } from 'ink';
import { Banner } from '../ui/Banner.js';

const commands = [
  {
    name: 'install <pkg>',
    description: 'Install skills from GitHub or local path',
  },
  {
    name: 'uninstall [name]',
    description: 'Remove installed skills',
  },
  {
    name: 'list',
    description: 'List installed skills',
  },
  {
    name: 'upgrade [name]',
    description: 'Upgrade skills to latest version',
  },
  {
    name: 'lock',
    description: 'Generate or update skl-lock.json',
  },
];

export default function Index() {
  return (
    <Box flexDirection="column">
      <Banner />

      <Box marginTop={1} flexDirection="column">
        <Text bold>Usage:</Text>
        <Text>
          {'  '}skl {'<command>'} [options]
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold>Commands:</Text>
        {commands.map((cmd) => (
          <Box key={cmd.name}>
            <Box width={22}>
              <Text color="cyan">{'  '}{cmd.name}</Text>
            </Box>
            <Text>{cmd.description}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>
          Run skl {'<command>'} --help for more info on a command.
        </Text>
      </Box>
    </Box>
  );
}
