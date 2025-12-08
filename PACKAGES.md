# Package Justifications

Each dependency in this project has a specific purpose. No unnecessary packages.

## Dependencies (Runtime)

| Package | Version | Justification |
|---------|---------|---------------|
| `react` | ^19.0.0 | Core UI library - latest stable with concurrent features |
| `react-dom` | ^19.0.0 | React DOM renderer - required for web rendering |
| `azure-devops-extension-sdk` | ^4.0.2 | Azure DevOps extension SDK - required for extension initialization and host communication |
| `azure-devops-extension-api` | ^4.248.0 | Azure DevOps REST API types - required for typed API access to Azure DevOps services |

## DevDependencies (Build-time only)

| Package | Version | Justification |
|---------|---------|---------------|
| `@rsbuild/core` | ^1.1.10 | Rspack-powered build tool - fast Rust bundler, replaces webpack/vite |
| `@rsbuild/plugin-react` | ^1.1.0 | React support for Rsbuild - JSX transform, Fast Refresh |
| `tailwindcss` | ^4.1.17 | Utility-first CSS framework - v4 with Lightning CSS |
| `@tailwindcss/postcss` | ^4.1.17 | PostCSS plugin for Tailwind CSS v4 |
| `@types/react` | ^19.0.1 | TypeScript types for React 19 |
| `@types/react-dom` | ^19.0.1 | TypeScript types for ReactDOM 19 |
| `typescript` | ^5.7.2 | TypeScript compiler - type checking only (bundling via Rsbuild) |

## Why Rspack/Rsbuild?

1. **Performance**: Written in Rust, 5-10x faster than webpack
2. **Webpack compatibility**: Drop-in replacement, same config concepts
3. **Built-in features**: TypeScript, CSS, React support out-of-the-box
4. **Smaller footprint**: Fewer dependencies than webpack ecosystem

## Packages NOT included (and why)

- `webpack` / `vite` - Replaced by Rsbuild
- `babel` - Not needed; Rsbuild uses SWC for transforms
- `eslint` / `prettier` - Optional; add only if needed for your workflow
- `jest` / `vitest` - No tests in demo; add Rstest (`@rstest/core`) when needed
- `css-loader` / `style-loader` - Built into Rsbuild
