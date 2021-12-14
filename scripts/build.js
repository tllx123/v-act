import chalk from 'chalk'
import { build } from 'vite'

import { filterPackages } from '@lerna/filter-packages'
import { getPackages } from '@lerna/project'
import vitePluginReact from '@vitejs/plugin-react'

const publicExternal = [
  '@mui/icons-material',
  '@mui/material',
  '@mui/styles',
  '@mui/system',
  'react',
  'react-dom'
]

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

export async function viteBuild(scopes) {
  const packages = await getPackages()
  const localExternal = packages.map((pkg) => pkg.name)
  const external = [...publicExternal, ...localExternal]

  const filteredPackages = filterPackages(packages, scopes)

  return await filteredPackages.map(async (pkg) => {
    const root = pkg.location
    const name = pkg.name
    const fileName = () => 'index.js'
    const entry = `${root}/src`

    return await build({
      build: {
        emptyOutDir: true,
        lib: { entry, name, fileName, formats: ['es'] },
        rollupOptions: { external },
        sourcemap: true
      },
      configFile: false,
      root,
      plugins: [vitePluginReact(), vitePluginDts()]
    }).then((result) => {
      console.log(chalk.greenBright(`${name} Builded! \n`))
      return result
    })
  })
}
