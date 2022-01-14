import chokidar from 'chokidar'
import { readFileSync } from 'fs-extra'
import { resolve } from 'path'
import { defineConfig } from 'vite'

import { filterPackages } from '@lerna/filter-packages'
import { getPackagesSync } from '@lerna/project'
import { compilePackage } from '@v-act/vdev'
import vitePluginReact from '@vitejs/plugin-react'

const VDEV = './src/assets/__vdev__'

const buildV = () => {
  watchV()
}

/**
 * 监听配置构件
 */
const watchV = () => {
  const vdevdir = resolve(VDEV, './components')
  return chokidar.watch(vdevdir).on('all', (event, path) => {
    if (!path.endsWith('package.xml')) return

    const data = readFileSync(path, 'utf-8')
    compilePackage(data, { dependencies: DEPS })
  })
}

const getWidgets = () => {
  const packages = getPackagesSync()
  const widgetPackages = filterPackages(packages, '@v-act/jg*')

  return widgetPackages.reduce((widgets, pkg) => {
    const widgetType = pkg.get('widgetType')
    widgets[widgetType] = pkg.name
    return widgets
  }, {})
}

const getAlias = () => {
  const alias = {}
  const packages = getPackagesSync()
  packages.forEach((pkg) => {
    const root = pkg.location
    const name = pkg.name
    alias[name] = resolve(`${root}/src`)
  })
  return alias
}

const DEPS = { ...getWidgets() }
const ALIAS = getAlias()

export default defineConfig(async () => {
  buildV()

  return {
    build: { watch: {} },
    // server: { open: '/dev/JGButton' },
    resolve: { alias: ALIAS },
    plugins: [vitePluginReact()]
  }
})
