import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import vite from 'vite'

import vitePluginReact from '@vitejs/plugin-react'

const rootDir = path.resolve('./packages/widgets')
const devServDir = path.resolve(rootDir, '__dev__')

const scanWidgets = () => glob.sync(`${rootDir}/JG*`)
const scanWidgetEntry = (widgetDir) => glob.sync(`${widgetDir}/src/index.ts*`)

const build = () => {}

const dev = async () => {
  const widgetAlias = {}
  const widgets = scanWidgets()

  widgets.forEach((widget) => {
    const widgetPkg = fs.readJSONSync(`${widget}/package.json`)
    const name = widgetPkg.name
    const entry = scanWidgetEntry(widget)[0]
    widgetAlias[name] = entry
  })

  const serv = await vite.createServer({
    configFile: false,
    mode: 'development',
    plugins: [vitePluginReact()],
    resolve: { alias: widgetAlias },
    root: devServDir,
    server: { open: '/' }
  })
  await serv.listen()
  serv.printUrls()
}

export { build, dev }
