import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-ts'
import commonjs from '@rollup/plugin-commonjs'

import pkg from './package.json'

export default {
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
    // builtins(),
    resolve({
      extensions: ['.ts'],
    }),
    commonjs(),
    typescript(),
    replace({ __packageVersion__: pkg.version, preventAssignment: true }),
  ],
}
