import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [path.join(rootDir, 'tests/setup/node.ts')],
    include: [
      'tests/**/*.test.ts',
      'src/__tests__/**/*.test.ts',
      '**/__tests__/**/*.test.ts',
      'packages/**/tests/**/*.test.ts',
      'packages/**/__tests__/**/*.test.ts',
    ],
  },
});
