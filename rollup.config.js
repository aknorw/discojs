import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'discojs',
      globals: {
        bottleneck: 'Bottleneck',
        'isomorphic-fetch': 'fetch',
      },
    },
    {
      file: pkg.module,
      format: 'esm',
      name: 'discojs',
    },
  ],
  external: ['bottleneck', 'isomorphic-fetch', 'querystring'],
  plugins: [json(), babel({ exclude: 'node_modules/**' }), builtins(), commonjs(), terser()],
}
