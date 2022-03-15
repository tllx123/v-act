import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { build } from 'vite'

import { filterPackages } from '@lerna/filter-packages'
import { getPackages } from '@lerna/project'
import vitePluginReact from '@vitejs/plugin-react'

import cssInjectedByJsPlugin from './cssInjected.js'

const publicExternal = [
  '@grapecity/spread-sheets-react',
  '@mui/icons-material',
  '@mui/material',
  '@mui/styles',
  '@mui/system',
  'echarts',
  'echarts-for-react',
  'react',
  'react-dom',
  'antd'
]
const nodeExternal = ['art-template', 'fast-xml-parser', 'fs-extra', 'path']

const vitePluginDts = () => {
  const plugin = {
    name: 'vite:dts',
    apply: 'build',
    async generateBundle({ format }) {
      if (format !== 'es') return
      this.emitFile({
        type: 'asset',
        fileName: 'index.d.ts',
        source: `export * from './../src'`
      })
    }
  }
  return plugin
}

export async function viteBuild(scopes, copyToPath, watch) {
  const packages = await getPackages()
  const localExternal = packages.map((pkg) => pkg.name)
  const external = [...publicExternal, ...localExternal, ...nodeExternal]
  const filteredPackages = filterPackages(packages, scopes)

  await filteredPackages.map(async (pkg) => {
    const root = pkg.location
    const name = pkg.name
    const fileName = (fmt) => (fmt === 'umd' ? 'index.js' : 'index.es.js')
    const entry = `${root}/src`
    return await build({
      build: {
        terserOptions: {
          compress: {
            drop_console: watch === true
          }
        },

        emptyOutDir: true,
        lib: {
          entry,
          name,
          fileName,
          formats: ['umd', 'es']
        },
        rollupOptions: {
          external
        },
        sourcemap: true,
        watch: watch ? {} : undefined
      },
      configFile: false,
      root,
      plugins: [
        vitePluginReact(),
        vitePluginDts(),
        cssInjectedByJsPlugin(),
        // usePluginImport({
        //   libraryName: 'antd',
        //   libraryDirectory: 'es',
        //   style: 'css'
        // }),
        {
          name: 'vite-plugin-vact-builder',
          closeBundle: () => {
            if (copyToPath) {
              const distDir = path.resolve(`${copyToPath}/node_modules/${name}`)
              fs.copySync(root, distDir)
              const nodemodules = path.resolve(`${distDir}/node_modules/`)

              // node v14.14.0以上可用
              fs.rmSync &&
                fs.rmSync(nodemodules, {
                  recursive: true,
                  force: true
                })
            }
          }
        }
      ]
    }).then((result) => {
      console.log(chalk.greenBright(`${name} Builded! \n`))
      return result
    })
  })

  if (copyToPath) {
    filterPackages(packages, [
      '@v-act/schema-types',
      '@v-act/widget-context',
      '@v-act/widget-utils',
      '@v-act/component-schema-utils',
      '@v-act/window-schema-utils'
    ]).forEach((pkg) => {
      const distDir = path.resolve(`${copyToPath}/node_modules/${pkg.name}/`)

      // node v14.14.0以上可用
      fs.rmSync &&
        fs.rmSync(distDir, {
          force: true,
          recursive: true
        })
      fs.copySync(pkg.location, distDir)
      const nodemodules = path.resolve(`${distDir}/node_modules/`)

      // node v14.14.0以上可用
      fs.rmSync &&
        fs.rmSync(nodemodules, {
          recursive: true,
          force: true
        })
    })
  }
}
