import React from 'react';
import { Text, Box } from 'ink';
import { SKL_VERSION } from '@skl/shared';

const SKL_ASCII = `███████╗██╗  ██╗██╗
██╔════╝██║ ██╔╝██║
███████╗█████╔╝ ██║
╚════██║██╔═██╗ ██║
███████║██║  ██╗███████╗
╚══════╝╚═╝  ╚═╝╚══════╝`;

export function Banner() {
  return (
    <Box flexDirection="column">
      <Text color="cyan">{SKL_ASCII}</Text>
      <Box marginTop={1}>
        <Text bold color="white">
          skl
        </Text>
        <Text dimColor> v{SKL_VERSION}</Text>
      </Box>
      <Text>The AbsolutelySkilled Package Manager</Text>
    </Box>
  );
}
