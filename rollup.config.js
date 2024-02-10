const resolve = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const typescript = require('rollup-plugin-ts')
const commonjs = require('rollup-plugin-commonjs')

const pkg = require('./package.json')

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    resolve({
      extensions: ['.ts'],
    }),
    commonjs(),
    typescript(),
    replace({
      preventAssignment: true,
      __packageVersion__: pkg.version,
    }),
  ],
}
