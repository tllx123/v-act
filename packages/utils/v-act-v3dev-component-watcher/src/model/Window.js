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

const parser = require('@v-act/xml-parser')
const expresion = require('@v-act/expression-parser')

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
        const ruleInfo = this.getRuleImportAndDefines()
        const funcInfo = this.getFuncImportAndDefines()
        const params = {
          componentCode: this.componentCode,
          ruleDefines: ruleInfo.ruleDefines,
          ruleImports: ruleInfo.ruleImports,
          funcDefines: funcInfo.funcDefines,
          funcImports: funcInfo.funcImports,
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

  getRuleImportAndDefines() {
    const ruleSet = this.getRuleSet()
    const ruleImports = []
    const ruleDefines = ['{']
    if (ruleSet.length > 0) {
      ruleSet.forEach((ruleCode) => {
        ruleImports.push(
          `const ${ruleCode} = (await import('@v-act/webrule_${ruleCode.toLowerCase()}'))`
        )
        ruleImports.push('\n')
        ruleDefines.push(`"${ruleCode}":${ruleCode}`)
        ruleDefines.push(',')
      })
      ruleImports.pop()
      ruleDefines.pop()
    }
    ruleDefines.push('}')
    return {
      ruleDefines: ruleDefines.join(''),
      ruleImports: ruleImports.join('')
    }
  }

  getFuncImportAndDefines() {
    const funcSet = this.getFuncSet()
    const funcImports = []
    const funcDefines = ['{']
    if (funcSet.length > 0) {
      funcSet.forEach((funcCode) => {
        funcImports.push(
          `const ${ruleCode} = (await import('@v-act/webfunc_${funcCode.toLowerCase()}'))`
        )
        funcImports.push('\n')
        funcDefines.push(`"${ruleCode}":${ruleCode}`)
        funcDefines.push(',')
      })
      funcImports.pop()
      funcDefines.pop()
    }
    funcDefines.push('}')
    return {
      funcDefines: funcDefines.join(''),
      funcImports: funcImports.join('')
    }
  }

  getRuleSet() {
    const ruleSet = []
    if (this.obj.logics && this.obj.logics.logic) {
      const logicList = this.obj.logics.logic
      logicList = Array.isArray(logicList) ? logicList : [logicList]
      logicList.forEach((logic) => {
        const attrs = logic.$
        if (attrs && attrs.type == 'client') {
          if (logic.ruleInstances && logic.ruleInstances.ruleInstance) {
            let ruleInstanceList = logic.ruleInstances.ruleInstance
            ruleInstanceList = Array.isArray(ruleInstanceList)
              ? ruleInstanceList
              : [ruleInstanceList]
            ruleInstanceList.forEach((ruleInstance) => {
              const ruleCode = ruleInstance.$.ruleCode
              if (ruleSet.indexOf(ruleCode) == -1) {
                ruleSet.push(ruleCode)
              }
            })
          }
        }
      })
    }
    return ruleSet
  }

  getFuncSet() {
    const funcSet = []
    if (this.obj.expressions && this.obj.expressions.expression) {
      const expressionList = this.obj.expressions.expression
      expressionList = Array.isArray(expressionList)
        ? expressionList
        : [expressionList]
      expressionList.forEach((expression) => {
        const attrs = expression.$
        if (attrs && attrs.content && attrs.type == 'client') {
          const exp = attrs.content
          const funcs = expresion.getFuncs(exp)
          if (funcs && funcs.length > 0) {
            funcs.forEach((func) => {
              if (funcSet.indexOf(func) == -1) {
                funcSet.push(func)
              }
            })
          }
        }
      })
    }
    return funcSet
  }
}

module.exports = Window
