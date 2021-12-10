import path from 'path'
import { createServer } from 'vite'

import { filterPackages } from '@lerna/filter-packages'
import { getPackages } from '@lerna/project'
import vitePluginReact from '@vitejs/plugin-react'

const getWidgetsAlias = async () => {
  const packages = await getPackages()
  const widgetPackages = filterPackages(packages, [
    '@v-act/schema-types',
    '@v-act/jg*'
  ])

  const widgetAlias = {}
  widgetPackages.forEach((pkg) => {
    const root = pkg.location
    const name = pkg.name
    widgetAlias[name] = path.resolve(`${root}/src`)
  })

  return widgetAlias
}

export async function viteServ(scopes) {
  const packages = await getPackages()
  const filteredPackages = filterPackages(packages, scopes)

  const alias = await getWidgetsAlias()

  return filteredPackages.map((pkg) => {
    const root = pkg.location
    console.log(root)

    return createServer({
      configFile: false,
      root,
      server: { open: '/' },
      resolve: { alias },
      build: { watch: {} },
      logLevel: 'info',
      plugins: [vitePluginReact()]
    })
      .then((serv) => serv.listen())
      .then((serv) => serv.printUrls())
  })
}
