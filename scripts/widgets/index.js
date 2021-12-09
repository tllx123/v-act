import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import vite from 'vite'

import vitePluginReact from '@vitejs/plugin-react'

const rootDir = path.resolve('./packages')
const devServDir = path.resolve(rootDir, 'widgets/__dev__')

const scanRegex = `{${rootDir}/utils/*/,${rootDir}/widgets/JG*/}`
const scanDeps = () => glob.sync(scanRegex)
const scanDepEntry = (widgetDir) => glob.sync(`${widgetDir}/src/index.ts*`)

const build = () => {}

const dev = async () => {
  const depAlias = {}
  const depDirs = scanDeps()

  depDirs.forEach((dep) => {
    const pkg = fs.readJSONSync(`${dep}/package.json`)
    const name = pkg.name
    const entry = scanDepEntry(dep)[0]
    depAlias[name] = entry
  })

  const serv = await vite.createServer({
    configFile: false,
    mode: 'development',
    plugins: [vitePluginReact()],
    resolve: { alias: depAlias },
    root: devServDir,
    server: { open: '/' }
  })
  await serv.listen()
  serv.printUrls()
}

export { build, dev }
