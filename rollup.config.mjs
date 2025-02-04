import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

import pkg from './package.json' with { type:'json' }

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
    resolve({
      extensions: ['.ts'],
    }),
    commonjs(),
    typescript({
      outDir: pkg.files[0],
    }),
    replace({
      preventAssignment: true,
      __packageVersion__: pkg.version,
    }),
  ],
}
