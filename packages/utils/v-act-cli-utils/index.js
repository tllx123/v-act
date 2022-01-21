const clear = require('./src/utils/clear')
const install = require('./src/utils/install')
const { packComponent, packProject } = require('./src/utils/pack')
const preinstall = require('./src/utils/preinstall')
const { publishComponent, publishProject } = require('./src/utils/publish')
const { startProject, startComponent } = require('./src/utils/start')
const { stop } = require('./src/utils/stop')
const build = require('./src/utils/build')
const test = require('./src/utils/test')

const { saveNextProcessPid } = require('./src/utils/utils')

module.exports = {
  saveNextProcessPid,
  clear,
  install,
  packComponent,
  packProject,
  preinstall,
  publishComponent,
  publishProject,
  startProject,
  startComponent,
  stop,
  build,
  test
}
