// filepath: vitest.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/vitest.config.ts',
        '**/prisma/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@devatlas/types': resolve(__dirname, './packages/types/src'),
      '@devatlas/ui': resolve(__dirname, './packages/ui/src'),
      '@devatlas/api-client': resolve(__dirname, './packages/api-client/src'),
    },
  },
});
