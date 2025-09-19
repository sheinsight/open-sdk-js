const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const typescript = require('@rollup/plugin-typescript').default;
const json = require('@rollup/plugin-json').default;

const packageJson = require('./package.json');

// External dependencies - these will not be bundled
const external = [
  'axios',
  'crypto',
  'fs',
  'path',
  'crypto-js',
  'js-base64',
  // Add Node.js built-in modules
  'http',
  'https',
  'url',
  'querystring',
  'stream',
  'util',
  'buffer',
  'events',
];

// Shared resolve configuration for better tree-shaking
const resolveConfig = {
  preferBuiltins: true,
  browser: false, // Ensure Node.js resolution
  exportConditions: ['node', 'import', 'require', 'default'],
  mainFields: ['module', 'main'],
};

// Shared commonjs configuration
const commonjsConfig = {
  ignoreDynamicRequires: true, // Better for tree-shaking
  requireReturnsDefault: 'auto',
};

// Base TypeScript configuration
const baseTypescriptConfig = {
  tsconfig: './tsconfig.json',
  compilerOptions: {
    declaration: true,
    declarationMap: true,
    sourceMap: false, // Disable sourcemaps for smaller build
  },
  exclude: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*'],
};

// Shared plugins for standard builds
const getBasePlugins = (customTsConfig = {}) => [
  resolve(resolveConfig),
  commonjs(commonjsConfig),
  json(),
  typescript({
    ...baseTypescriptConfig,
    ...customTsConfig,
  }),
];

module.exports = [
  // CommonJS build with bundled dependencies (backward compatibility)
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      interop: 'auto',
    },
    plugins: getBasePlugins(),
    external: ['axios', 'crypto', 'fs', 'path'], // Keep fewer externals for CJS backward compatibility
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
  },

  // ES Module build with preserved modules for optimal tree-shaking
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib/esm',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
    },
    plugins: getBasePlugins({
      outDir: 'lib/esm',
      declarationDir: 'lib/esm',
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        sourceMap: false,
        module: 'ESNext', // Ensure ESM output
        target: 'ES2017',
      },
    }),
    external,
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
  },

  // Single file ES Module build (backward compatibility)
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.module,
      format: 'esm',
      exports: 'named',
      sourcemap: false,
    },
    plugins: getBasePlugins(),
    external,
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
  },
];
