const chokidar = require('chokidar')
const fs = require('fs')
const XmlComponent = require('./model/XmlComponent')
const ZipComponent = require('../src/model/ZipComponent')
const path = require('path')

const Cache = require('../src/utils/Cache')
let watcherReady = false

const getComponentInst = function (filePath) {
  const ext = path.extname(filePath)
  if (ext === '.xml') {
    return new XmlComponent(filePath)
  } else if (ext === '.zip') {
    return new ZipComponent(filePath)
  } else {
    return null
  }
}

exports.watch = function (v3devCmpDir) {
  if (!v3devCmpDir) {
    throw Error('未传递开发系统业务构件目录，监听失败!')
  }
  if (fs.existsSync(v3devCmpDir)) {
    if (fs.existsSync(v3devCmpDir)) {
      watcher = chokidar.watch(v3devCmpDir, {
        awaitWriteFinish: true,
        ignored: ['**/.DS_Store']
      })
      watcher.on('ready', () => {
        watcherReady = true
      })
      watcher.on('unlink', (p) => {
        const inst = getComponentInst(p)
        if (inst) {
          inst.destroy()
        }
      })
      watcher.on('add', (p) => {
        const inst = getComponentInst(p)
        if (inst) {
          inst.generate()
        }
      })
      watcher.on('change', (p) => {
        const inst = getComponentInst(p)
        if (inst) {
          inst.generate()
        }
      })
    }
  }
}
