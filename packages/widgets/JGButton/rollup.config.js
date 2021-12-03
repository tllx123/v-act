import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const extensions = ['.ts', '.tsx']

const entryConfig = defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions,
      rootMode: 'upward'
    }),
    commonjs(),
    json(),
    nodeResolve({
      extensions,
      preferBuiltins: true
    }),
    ,
    json()
  ]
})

const dtsConfig = defineConfig({
  input: './src/index.ts',
  output: {
    file: './dist/index.d.ts',
    format: 'es'
  },
  plugins: [dts()]
})

export default [entryConfig, dtsConfig]
