// filepath: apps/web/vitest.config.ts
import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '.next'],
    },
  },
  resolve: {
    alias: {
      '@devatlas/api-client': resolve(__dirname, '../../packages/api-client/src'),
      '@devatlas/types': resolve(__dirname, '../../packages/types/src'),
      '@devatlas/ui': resolve(__dirname, '../../packages/ui/src'),
    },
  },
});
