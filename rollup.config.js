import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'discojs',
    globals: {
      bottleneck: 'Bottleneck',
      'isomorphic-fetch': 'fetch',
    },
  },
  external: [
    'bottleneck',
    'isomorphic-fetch',
  ],
  plugins: [
    json(),
    babel({ exclude: 'node_modules/**' }),
    builtins(),
    commonjs(),
    uglify(),
  ],
}
