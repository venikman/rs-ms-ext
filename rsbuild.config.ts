import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      hub: './src/hub/index.tsx',
    },
  },
  output: {
    distPath: {
      root: 'dist',
    },
    // Azure DevOps extensions require relative paths
    assetPrefix: './',
    // Generate clean filenames for extension packaging
    filename: {
      js: '[name].js',
      css: '[name].css',
    },
  },
  html: {
    template: './src/hub/index.html',
  },
  server: {
    // HTTPS only needed when testing inside Azure DevOps
    // For local demo, use HTTP
    https: false,
  },
  performance: {
    // Disable chunk splitting for simpler extension structure
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
});
