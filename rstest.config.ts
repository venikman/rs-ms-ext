import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  testEnvironment: 'jsdom',
  include: ['src/**/*.test.{ts,tsx}'],
  testTimeout: 10000,
  coverage: {
    provider: 'istanbul',
    reports: ['text', 'html']
  }
});
