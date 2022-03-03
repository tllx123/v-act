import fs from 'fs'
import path from 'path'

const moveTo = function (dir, to) {
  const dirNames = fs.readdirSync(dir)
  dirNames.forEach((name) => {
    const p = path.resolve(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      moveTo(p, path.resolve(to, name))
    } else {
      if (name == 'package.json') {
        const packageJsonPath = path.resolve(dir, name)
        const content = fs.readFileSync(packageJsonPath)
        const packageJson = JSON.parse(new String(content))
        packageJson.name = '@v-act/webfunc_' + packageJson.name.toLowerCase()
        packageJson.scripts = {}
        fs.writeFileSync(
          path.resolve(to, name),
          JSON.stringify(packageJson, null, '\t')
        )
      } else {
        fs.rename(packageJsonPath, path.resolve(to, name))
      }
    }
  })
}

const dir = path.resolve(process.cwd(), '../packages/funcs')
console.log(dir)
const dirNames = fs.readdirSync(dir)
dirNames.forEach((dirName) => {
  if (!dirName.startsWith('WebFunc_')) {
    const packageJsonPath = path.resolve(dir, dirName, 'package.json')
    const content = fs.readFileSync(packageJsonPath)
    const packageJson = JSON.parse(new String(content))
    packageJson.name = '@v-act/webfunc_' + packageJson.name.toLowerCase()
    packageJson.scripts = {}
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t'))
    fs.renameSync(
      path.resolve(dir, dirName),
      path.resolve(dir, 'WebFunc_' + dirName)
    )
  }
})
