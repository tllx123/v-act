import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import pkg from './package.json'

const extensions = ['.ts', '.tsx']

const entryConfig = defineConfig({
  external: ['react', 'react-dom', '@mui/material'],
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions,
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-react'
      ]
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
