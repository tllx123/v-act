import { resolve } from 'path'
import { createServer } from 'vite'

import { filterPackages } from '@lerna/filter-packages'
import { getPackages } from '@lerna/project'
import vitePluginReact from '@vitejs/plugin-react'
import usePluginImport from 'vite-plugin-importer'
const getAlias = async () => {
  const alias = {}
  const packages = await getPackages()
  packages.forEach((pkg) => {
    const root = pkg.location
    const name = pkg.name
    alias[name] = resolve(`${root}/src`)
  })
  return alias
}

export async function viteServ(scopes) {
  const packages = await getPackages()
  const filteredPackages = filterPackages(packages, scopes)

  const alias = await getAlias()

  return filteredPackages.map((pkg) => {
    return createServer({
      configFile: false,
      root: pkg.location,
      server: { open: '/' },
      resolve: { alias },
      plugins: [
        vitePluginReact(),
        usePluginImport({
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css'
        })
      ]
    })
      .then((serv) => serv.listen())
      .then((serv) => serv.printUrls())
  })
}
