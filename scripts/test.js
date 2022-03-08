import fs from 'fs'
import path from 'path'

const moveTo = function (dir) {
  const dirNames = fs.readdirSync(dir)
  dirNames.forEach((name) => {
    const p = path.resolve(dir, name, 'package.json')
    const content = fs.readFileSync(p)
    const json = JSON.parse(new String(content))
    json.name = '@v-act/' + name
    fs.writeFileSync(p, JSON.stringify(json, null, '\t'))
  })
}

const dir = path.resolve(
  process.cwd(),
  'packages/core/platform/services/integration/vds'
)
moveTo(dir)
