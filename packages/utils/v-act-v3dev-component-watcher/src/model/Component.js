const xml2js = require('xml2js')
const fs = require('fs')
const Window = require('./Window')
const File = require('../utils/File')
const Cache = require('../utils/Cache')

class Component {
  xmlUrl = null

  xmlObj = {}

  componentCode = null

  constructor(xmlUrl) {
    this.xmlUrl = xmlUrl
  }

  getContent() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.xmlUrl)) {
        fs.readFile(this.xmlUrl, (err, data) => {
          if (err) {
            return reject(err)
          }
          resolve(new String(data))
        })
      } else {
        reject(Error('文件不存在！path=' + this.xmlUrl))
      }
    })
  }

  xmlToJson() {
    return new Promise((resolve, reject) => {
      this.getContent()
        .then((content) => {
          var parser = new xml2js.Parser({
            explicitArray: false
          })
          parser
            .parseStringPromise(content)
            .then((obj) => {
              resolve(obj)
            })
            .catch((e) => {
              reject(e)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  parseToWindow() {
    return new Promise((resolve, reject) => {
      this.xmlToJson()
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
      this.parseToWindow()
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
              compnentCache.absPath = this.xmlUrl
              compnentCache.componentCode = this.componentCode
              const promises = []
              const windows = compnentCache.windows || {}
              changedWindows.forEach((win) => {
                promises.push(win.generate())
                const windowCode = win.getCode()
                const winInfo = windows[windowCode] || {}
                winInfo.md5 = win.getMD5()
                windows[windowCode] = winInfo
              })
              compnentCache.windows = windows
              Promise.all(promises)
                .then(() => {
                  Cache.saveComponentCache(this.componentCode, compnentCache)
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

  destroy() {
    return new Promise((resolve, reject) => {
      try {
        const caches = Cache.getComponentCaches()
        const componentCode = null
        for (let index = 0; index < caches.length; index++) {
          const cache = caches[index]
          if (cache.absPath === this.xmlUrl) {
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
