const cache = require('../utils/Cache')
const str = require('../utils/String')
const template = require('art-template')
const path = require('path')
const File = require('../utils/File')
const fs = require('fs')
const packageJson = require('../../package.json')
const render = template.compile(
  new String(
    fs.readFileSync(path.resolve(__dirname, '../template/window.tpl'))
  ).toString()
)

const parser = require('../../../v-act-xml-parser/dist/index')

const forInObj = (obj) => {
  for (let key in obj) {
    let target = obj[key]
    if (
      key === '_' &&
      target.indexOf('<') !== -1 &&
      target.indexOf('/>') !== -1
    ) {
      const dom = parser.parse(`<root>${target}</root>`)
      obj[key] = dom[0].children
    }

    if (Object.prototype.toString.call(target).slice(8, -1) == 'Object')
      forInObj(target)
  }
}

class Window {
  constructor(componentCode, obj, vactWidgetMap) {
    this.componentCode = componentCode
    this.windowCode = obj.$.code
    this.vactWidgetMap = vactWidgetMap

    // 处理xml脚本节点字符串问题
    forInObj(obj)
    this.obj = obj

    console.log(JSON.stringify(this.obj, null, 2))
  }

  getCode() {
    return this.windowCode
  }

  /**
   * 是否有调整
   */
  isChanged() {
    const component = cache.getComponentCache(this.componentCode)
    if (component && component.windows && window.windows[this.windowCode]) {
      const win = window.windows[this.windowCode]
      if (
        win.metadataVersion == packageJson.metadataVersion &&
        win.md5 == this.getMD5()
      ) {
        return false
      }
    }
    return true
  }

  getMD5() {
    if (!this.md5) {
      const content = JSON.stringify(this.obj)
      this.md5 = str.toMD5(content)
    }
    return this.md5
  }

  getWidgetTypeSet() {
    const windowJsonObj = this.obj
    const widgetTypeSet = []
    const iter = function (controls) {
      if (controls && controls.control) {
        controls = controls.control
        controls = Array.isArray(controls) ? controls : [controls]
        controls.forEach((control) => {
          const attrs = control.$
          if (attrs) {
            const widgetType = attrs.type
            if (widgetTypeSet.indexOf(widgetType) == -1) {
              widgetTypeSet.push(widgetType)
            }
          }
          iter(control.controls)
          iter(control.headerControls)
        })
      }
    }
    iter(windowJsonObj.controls)
    return widgetTypeSet
  }

  getWidgetMap() {
    if (!this.widgetMap) {
      const widgetTypes = this.getWidgetTypeSet()
      const widgetMap = {}
      widgetTypes.forEach((widgetType) => {
        if (this.vactWidgetMap[widgetType]) {
          widgetMap[widgetType] = this.vactWidgetMap[widgetType]
        }
      })
      this.widgetMap = widgetMap
    }
    return this.widgetMap
  }

  getControlConverMapScript() {
    const existWidgets = this.getWidgetMap()
    const script = ['{']
    for (const widgetType in existWidgets) {
      if (Object.hasOwnProperty.call(existWidgets, widgetType)) {
        script.push(`"${widgetType}":convert${widgetType},`)
      }
    }
    script.push('}')
    return script.join('')
  }

  getControlDefineMapScript() {
    const existWidgets = this.getWidgetMap()
    const script = ['{']
    for (const widgetType in existWidgets) {
      if (Object.hasOwnProperty.call(existWidgets, widgetType)) {
        script.push(`"${widgetType}":${widgetType},`)
      }
    }
    script.push('}')
    return script.join('')
  }

  toImportScripts() {
    const existWidgets = this.getWidgetMap()
    const script = []
    for (const widgetType in existWidgets) {
      if (Object.hasOwnProperty.call(existWidgets, widgetType)) {
        const info = existWidgets[widgetType]
        const ssr = info.ssr
        let importScript
        if (ssr) {
          importScript = `const ${widgetType} = dynamic(()=>{return import('${info.pluginName}').then(mod=>mod.Json${widgetType})});`
        } else {
          importScript = `const ${widgetType} = dynamic(()=>{return import('${info.pluginName}').then(mod=>mod.Json${widgetType})},{ssr:${ssr}});`
        }
        script.push(importScript)
      }
    }
    return script.join('\n')
  }

  getWindowTsxScript() {
    return new Promise((resolve, reject) => {
      try {
        const params = {
          componentCode: this.componentCode,
          windowCode: this.windowCode,
          windowJsonScript: JSON.stringify(this.obj),
          importScripts: this.toImportScripts(),
          controlDefines: this.getControlDefineMapScript()
        }
        const content = render(params)
        resolve(content)
      } catch (err) {
        reject(err)
      }
    })
  }

  getWindowTsxPath() {
    return path.resolve(
      process.cwd(),
      'pages',
      this.componentCode,
      this.windowCode,
      'index.tsx'
    )
  }

  generate() {
    return new Promise((resolve, reject) => {
      this.getWindowTsxScript()
        .then((content) => {
          File.write(this.getWindowTsxPath(), content)
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
  }
}

module.exports = Window
