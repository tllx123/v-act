import fs from 'fs-extra'
import path from 'path'
import prettier from 'prettier'
import { normalizePath } from 'vite'

import { getPackages } from '@lerna/project'

import { viteBuild } from './build.js'

export async function buildEnv() {
  await buildTsConfigPaths()
  await buildCoreDependencies()
}

export async function buildTsConfigPaths() {
  const packages = await getPackages()
  const root = path.resolve('./')
  const tscPath = path.resolve(root, 'tsconfig.paths.json')

  const tsc = fs.readJSONSync(tscPath, { encoding: 'utf-8' })
  const paths = tsc.compilerOptions.paths

  packages.forEach((pkg) => {
    const pkgroot = pkg.location.replace(root, '.').replace(/\\\\/g, '/')
    const name = pkg.name
    paths[name] = [normalizePath(`${pkgroot}/src`)]
  })

  const formatedTsc = await prettier
    .resolveConfig(process.cwd())
    .then((options) => {
      options.parser = 'json'
      options.printWidth = 120
      return prettier.format(JSON.stringify(tsc), options)
    })

  fs.writeFileSync(tscPath, formatedTsc)
}

export async function buildCoreDependencies() {
  await viteBuild(
    [
      '@v-act/schema-types',
      '@v-act/widget-context',
      '@v-act/widget-utils',
      '@v-act/component-schema-utils',
      '@v-act/window-schema-utils'
    ],
    './apps/runtime'
  )
}
