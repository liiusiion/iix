import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // The app's configs parse process.env on import, and Vitest doesn't load .env into it
    env: parseEnv(readFileSync('.env', 'utf8')),
  },
});
