const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const typescript = require('@rollup/plugin-typescript').default;
const json = require('@rollup/plugin-json').default;

const packageJson = require('./package.json');

// External dependencies - these will not be bundled
const external = ['axios', 'crypto', 'fs', 'path'];

// Node.js build plugins
const nodePlugins = [
  resolve({
    preferBuiltins: true, // Prefer Node.js built-ins
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: './tsconfig.json',
  }),
];

module.exports = [
  // CommonJS build (Node.js)
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: nodePlugins,
    external,
  },
  // ES Module build (Node.js)
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: nodePlugins,
    external,
  },
];
