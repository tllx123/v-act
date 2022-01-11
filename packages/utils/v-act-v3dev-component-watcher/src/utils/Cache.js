const path = require('path')
const File = require('./File')
const os = require('os')
const fs = require('fs')
const MEMERY_CACHE = {}
const WIDGET_MAP = {}

const getCacheDir = function () {
  return path.resolve(__dirname, 'v-act-v3dev-component-watcher')
}

const getComponentCachePath = function (componentCode) {
  return path.resolve(getCacheDir(), componentCode, 'metadata.json')
}

/**
 *
 * @param {string} componentCode
 * @returns {
 *      absPath:string,
 *      componentCode: string,
 *      windows:{
 *          [windowCode]:{
 *              md5:string
 *          }
 *      }
 * }
 */
const getComponentCache = function (componentCode) {
  return new Promise((resolve, reject) => {
    if (MEMERY_CACHE[componentCode]) {
      resolve(MEMERY_CACHE[componentCode])
    } else {
      const p = getComponentCachePath(componentCode)
      if (fs.existsSync(p)) {
        fs.readFile(p, (err, data) => {
          if (err) {
            return reject(err)
          }
          try {
            resolve(JSON.parse(new String(data)))
          } catch (e) {
            resolve(null)
          }
        })
      } else {
        resolve(null)
      }
    }
  })
}

const getComponentCaches = function () {
  return new Promise((resolve, reject) => {
    const caches = []
    const cacheDir = getCacheDir()
    const dirNames = fs.readdirSync(cacheDir)
    const promises = []
    dirNames.forEach((componentCode) => {
      promises.push(
        new Promise((res, rej) => {
          getComponentCache(componentCode)
            .then((cache) => {
              if (cache) {
                caches.push(cache)
              }
              resolve()
            })
            .catch((err) => {
              rej(err)
            })
        })
      )
    })
    Promise.all(promises)
      .then(() => {
        resolve(caches)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const mkdir = function (dir) {
  const parent = path.resolve(dir, '..')
  if (!fs.existsSync(parent)) {
    mkdir(parent)
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

/**
 *
 * @param {string} componentCode
 * @param {object} component {
 *      componentCode: string,
 *      absPath:string,
 *      windows:{
 *          [windowCode]:{
 *              md5:string
 *          }
 *      }
 * }
 * @returns
 */
const saveComponentCache = function (componentCode, component) {
  return new Promise((resolve, reject) => {
    const p = getComponentCachePath(componentCode)
    mkdir(path.resolve(p, '..'))
    fs.writeFile(p, JSON.stringify(component, null, '\t'), (err) => {
      if (err) {
        return reject(err)
      }
      MEMERY_CACHE[componentCode] = component
      resolve()
    })
  })
}

const cleanComponentCache = function (componentCode) {
  return new Promise((resolve, reject) => {
    try {
      const p = getComponentCachePath(componentCode)
      File.rm(p)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

const scanVActWidgets = function () {
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules')
  const iter = function (dir) {
    const packagePath = path.resolve(dir, 'package.json')
    if (fs.existsSync(packagePath)) {
      const packageJson = require(packagePath)
      if (packageJson.widgetType) {
        WIDGET_MAP[packageJson.widgetType] = packageJson.name
      }
    } else {
      const dirNames = fs.readdirSync(dir)
      dirNames.forEach((dirName) => {
        const ph = path.resolve(dir, dirName)
        const state = fs.statSync(ph)
        if (state.isDirectory()) {
          iter(ph)
        }
      })
    }
  }
  iter(nodeModulesPath)
}

const getWidgetMap = function () {
  return WIDGET_MAP
}

exports.saveComponentCache = saveComponentCache
exports.getComponentCache = getComponentCache
exports.getWidgetMap = getWidgetMap
exports.scanVActWidgets = scanVActWidgets
exports.cleanComponentCache = cleanComponentCache
exports.getComponentCaches = getComponentCaches
