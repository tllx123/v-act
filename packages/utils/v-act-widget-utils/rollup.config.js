import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import pkg from './package.json'

const extensions = ['.js', '.ts', '.tsx']

const entryConfig = defineConfig({
  external: ['react', 'csstype', '@v-act/jggrouppanel', '@v-act/schema-types'],
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
      exclude: /node_modules/,
      extensions,
      presets: [
        ['@babel/preset-env'],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic'
          }
        ],
        ['@babel/preset-typescript']
      ]
    }),
    commonjs({
      include: /node_modules/,
      namedExports: {
        'react/jsx-runtime': ['jsx', 'jsxs'],
        'react/jsx-dev-runtime': ['jsx', 'jsxs', 'jsxDEV']
      }
    }),
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
