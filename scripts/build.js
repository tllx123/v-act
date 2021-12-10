import { build } from 'vite'

import { filterPackages } from '@lerna/filter-packages'
import { getPackages } from '@lerna/project'
import vitePluginReact from '@vitejs/plugin-react'

const external = [
  '@mui/icons-material',
  '@mui/material',
  '@mui/styles',
  '@mui/system',
  '@v-act/schema-types',
  'react',
  'react-dom'
]

export async function viteBuild(scopes) {
  const packages = await getPackages()
  const filteredPackages = filterPackages(packages, scopes)

  return filteredPackages.map((pkg) => {
    const root = pkg.location
    const name = pkg.name
    const fileName = 'index'
    const entry = `${root}/src`

    return build({
      build: {
        emptyOutDir: true,
        lib: { entry, name, fileName, formats: ['es'] },
        rollupOptions: { external },
        sourcemap: true
      },
      configFile: false,
      root,
      plugins: [
        vitePluginReact(),
        {
          name: '@v-act/vite-plugin-dts',
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
      ]
    })
  })
}
