import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  testEnvironment: 'jsdom',
  include: ['src/**/*.test.{ts,tsx}'],
  testTimeout: 10000,
  coverage: {
    enabled: true,
    include: ['src/components/**/*.{ts,tsx}', 'src/utils/helpers.ts'],
    exclude: ['src/**/*.test.{ts,tsx}'],
    thresholds: {
      statements: 80,
      branches: 70,
      functions: 100,
      lines: 80,
    },
  },
});
