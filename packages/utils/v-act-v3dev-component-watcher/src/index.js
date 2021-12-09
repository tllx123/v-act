const chokidar = require('chokidar')
const fs = require('fs')
const Component = require('../src/model/Component')
let watcherReady = false

exports.watch = function (v3devCmpDir) {
  if (!v3devCmpDir) {
    throw Error('未传递开发系统业务构件目录，监听失败!')
  }
  if (fs.existsSync(v3devCmpDir)) {
    if (fs.existsSync(v3devCmpDir)) {
      const watcher = chokidar.watch(v3devCmpDir, {
        awaitWriteFinish: true
      })
      watcher.on('ready', () => {
        watcherReady = true
      })
      watcher.on('unlink', (p) => {
        const component = new Component(p)
        component.destroy()
      })
      watcher.on('add', (p) => {
        const component = new Component(p)
        component.generate()
      })
      watcher.on('change', (p) => {
        const component = new Component(p)
        component.generate()
      })
    }
  }
}
