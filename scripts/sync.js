import fs from 'fs-extra'
import path from 'path'

import { filterPackages } from '@lerna/filter-packages'
import { getPackagesSync } from '@lerna/project'

export function sync(scopes, copyToPath) {
  const packages = getPackagesSync()
  const filteredPackages = filterPackages(
    packages,
    [
      '@v-act/schema-types',
      '@v-act/widget-context',
      '@v-act/widget-utils',
      '@v-act/component-schema-utils',
      '@v-act/window-schema-utils',
      scopes
    ].flat()
  )
  filteredPackages.forEach((pkg) => {
    const distDir = path.resolve(`${copyToPath}/node_modules/${pkg.name}/`)
    fs.rmSync(distDir, {
      force: true,
      recursive: true
    })
    fs.copySync(pkg.location, distDir)
    const nodemodules = path.resolve(`${distDir}/node_modules/`)
    fs.rmSync(nodemodules, {
      recursive: true,
      force: true
    })
  })
}
