const xml2js = require('xml2js')
const fs = require('fs')
const path = require('path')
const Window = require('./Window')
const File = require('../utils/File')
const Cache = require('../utils/Cache')
const template = require('art-template')
const packageJson = require('../../package.json')
const render = template.compile(
  new String(
    fs.readFileSync(path.resolve(__dirname, '../template/component.tpl'))
  ).toString()
)

class Component {
  filePath

  xmlContent = null

  xmlObj = {}

  componentCode = null

  constructor(filePath) {
    this.filePath = filePath
  }

  setXmlContent(xmlContent) {
    this.xmlContent = xmlContent
  }

  getXmlObj() {
    return this.xmlObj
  }

  getCode() {
    return this.componentCode
  }

  getFilePath() {
    return this.filePath
  }

  _xmlToJson() {
    return new Promise((resolve, reject) => {
      var parser = new xml2js.Parser({
        explicitArray: false
      })
      parser
        .parseStringPromise(this.xmlContent)
        .then((obj) => {
          this.xmlObj = obj
          resolve(obj)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  _parseToWindow() {
    return new Promise((resolve, reject) => {
      this._xmlToJson()
        .then((obj) => {
          const component = obj.component
          this.componentCode = component.$.code
          const windows = component.windows || {}
          let windowList = windows.window
          windowList = Array.isArray(windowList) ? windowList : [windowList]
          const winObjs = []
          if (windowList) {
            windowList.forEach((win) => {
              const w = new Window(
                this.componentCode,
                win,
                Cache.getWidgetMap()
              )
              winObjs.push(w)
            })
          }
          this.windows = winObjs
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  generate() {
    return new Promise((resolve, reject) => {
      this._parseToWindow()
        .then(() => {
          try {
            const changedWindows = []
            this.windows.forEach((win) => {
              if (win.isChanged()) {
                changedWindows.push(win)
              }
            })
            if (changedWindows.length > 0) {
              const compnentCache =
                Cache.getComponentCache(this.componentCode) || {}
              compnentCache.absPath = this.getFilePath()
              compnentCache.componentCode = this.componentCode
              const promises = []
              const windows = compnentCache.windows || {}
              changedWindows.forEach((win) => {
                promises.push(win.generate())
                const windowCode = win.getCode()
                const winInfo = windows[windowCode] || {}
                winInfo.md5 = win.getMD5()
                winInfo.metadataVersion = packageJson.metadataVersion
                windows[windowCode] = winInfo
              })
              compnentCache.windows = windows
              Promise.all(promises)
                .then(() => {
                  this._parseComponent()
                    .then(() => {
                      Cache.saveComponentCache(
                        this.componentCode,
                        compnentCache
                      )
                        .then(() => {
                          resolve()
                        })
                        .catch((err) => {
                          reject(err)
                        })
                    })
                    .catch((err) => {
                      reject(err)
                    })
                })
                .catch((err) => {
                  reject(err)
                })
            }
          } catch (err) {
            reject(err)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  _parseComponent() {
    return new Promise((resolve, reject) => {
      const component = {}
      const componentObj = this.xmlObj.component
      for (const key in componentObj) {
        if (
          key !== 'windows' &&
          Object.hasOwnProperty.call(componentObj, key)
        ) {
          const value = componentObj[key]
          component[key] = value
        }
      }
      try {
        const params = {
          componentSchema: JSON.stringify(component)
        }
        const componentCode = componentObj.$.code
        const content = render(params)
        File.write(
          path.resolve(
            process.cwd(),
            'src',
            'componentdefs',
            `${componentCode}.tsx`
          ),
          content
        )
          .then(() => {
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  destroy() {
    return new Promise((resolve, reject) => {
      try {
        const caches = Cache.getComponentCaches()
        const componentCode = null
        for (let index = 0; index < caches.length; index++) {
          const cache = caches[index]
          if (cache.absPath === this.getFilePath()) {
            componentCode = cache.componentCode
            break
          }
        }
        if (componentCode !== null) {
          const promises = []
          promises.push(Cache.cleanComponentCache(componentCode))
          const componentPath = path.resolve(
            process.cwd(),
            'pages',
            componentCode
          )
          File.rm(componentPath)
          Promise.all(promises)
            .then(() => {
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          resolve()
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = Component
