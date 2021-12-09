const path = require('path')
const fs = require('fs')

const mkdir = function (dir) {
  const parent = path.resolve(dir, '..')
  if (!fs.existsSync(parent)) {
    mkdir(parent)
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const rm = function (p) {
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      const children = fs.readdirSync(p)
      children.forEach((child) => {
        rm(path.resolve(p, child))
      })
      fs.rmdirSync(p)
    } else {
      fs.unlinkSync(p)
    }
  }
}

const write = function (absPath, content) {
  return new Promise((resolve, reject) => {
    const dir = path.resolve(absPath, '..')
    mkdir(dir)
    fs.writeFile(absPath, content, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

exports.rm = rm
exports.mkdir = mkdir
exports.write = write
