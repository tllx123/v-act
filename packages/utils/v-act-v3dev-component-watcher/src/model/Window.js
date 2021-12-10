const cache = require('../utils/Cache')
const str = require('../utils/String')
const template = require('art-template')
const path = require('path')
const File = require('../utils/File')

class Window {
  constructor(componentCode, obj, vactWidgetMap) {
    this.componentCode = componentCode
    this.windowCode = obj.$.code
    this.obj = obj
    this.vactWidgetMap = vactWidgetMap
    this.toSchmemaObj()
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
      const md5 = window.windows[this.windowCode].md5
      return md5 !== this.getMD5()
    } else {
      return true
    }
  }

  getMD5() {
    if (!this.md5) {
      const content = JSON.stringify(this.obj)
      this.md5 = str.toMD5(content)
    }
    return this.md5
  }

  toSchemaProperty(propertys) {
    const properties = {}
    if (propertys && propertys.property) {
      let property = propertys.property
      property = Array.isArray(property) ? property : [property]
      property.forEach((property) => {
        let attr = property.$.code
        if (attr.length > 1) {
          attr = attr.substring(0, 2).toLowerCase() + attr.substring(2)
        } else {
          attr = attr.toLowerCase()
        }
        const attrVal = property._ || ''
        properties[attr] = attrVal
      })
    }
    return properties
  }

  toSchemaControl(controlObj) {
    const controls = []
    let controlObjs =
      controlObj.controls && controlObj.controls.control
        ? controlObj.controls.control
        : null
    if (controlObjs) {
      controlObjs = Array.isArray(controlObjs) ? controlObjs : [controlObjs]
      controlObjs.forEach((con) => {
        controls.push(this.toSchemaControl(con))
      })
    }
    return {
      type: controlObj.$.type,
      properties: this.toSchemaProperty(controlObj.propertys),
      controls
    }
  }

  toSchmemaObj() {
    if (!this.windowJsonObj) {
      const properties = this.toSchemaProperty(this.obj.propertys)
      const controls = []
      if (this.obj.controls && this.obj.controls.control) {
        let control = this.obj.controls.control
        control = Array.isArray(control) ? control : [control]
        control.forEach((con) => {
          controls.push(this.toSchemaControl(con))
        })
      }
      this.windowJsonObj = {
        properties,
        controls
      }
    }
    return this.windowJsonObj
  }

  getWidgetTypeSet() {
    const windowJsonObj = this.toSchmemaObj()
    const widgetTypeSet = []
    const iter = function (controls) {
      if (controls && controls.length > 0) {
        controls.forEach((control) => {
          const widgetType = control.type
          if (widgetTypeSet.indexOf(widgetType) == -1) {
            widgetTypeSet.push(widgetType)
          }
          iter(control.controls)
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

  toImportScripts() {
    const existWidgets = this.getWidgetMap()
    const script = []
    for (const widgetType in existWidgets) {
      if (Object.hasOwnProperty.call(existWidgets, widgetType)) {
        const pluginName = existWidgets[widgetType]
        script.push(
          `import {convert as convert${widgetType}} from '${pluginName}';`
        )
      }
    }
    return script.join('\n')
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

  getWindowTsxScript() {
    return new Promise((resolve, reject) => {
      try {
        const params = {
          windowJsonScript: JSON.stringify(this.toSchmemaObj()),
          controlConvertMap: this.getControlConverMapScript(),
          importScripts: this.toImportScripts()
        }
        const content = template(
          path.resolve(__dirname, '../template/window.tpl'),
          params
        )
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
