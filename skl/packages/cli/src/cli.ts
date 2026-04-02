import Pastel from 'pastel';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new Pastel({
  importMeta: import.meta,
  name: 'skl',
  version: '1.0.0',
  description: 'The AbsolutelySkilled Package Manager',
});

await app.run();
