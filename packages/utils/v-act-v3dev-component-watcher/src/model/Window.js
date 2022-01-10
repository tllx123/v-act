const cache = require('../utils/Cache')
const str = require('../utils/String')
const template = require('art-template')
const path = require('path')
const File = require('../utils/File')
const fs = require('fs')
const { TableRows } = require('@mui/icons-material')
const render = template.compile(
  new String(
    fs.readFileSync(path.resolve(__dirname, '../template/window.tpl'))
  ).toString()
)

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

  toSchemaDataBinding(dataBinding) {
    let dataMemberObjs =
      dataBinding.dataMembers && dataBinding.dataMembers.dataMember
        ? dataBinding.dataMembers.dataMember
        : null
    const dataMembers = []
    if (dataMemberObjs) {
      dataMemberObjs = Array.isArray(dataMemberObjs)
        ? dataMemberObjs
        : [dataMemberObjs]
      dataMemberObjs.forEach((dataMemberObj) => {
        dataMembers.push({
          name: dataMemberObj.$.name,
          code: dataMemberObj.$.code,
          value: dataMemberObj._
        })
      })
    }
    return {
      dataSource: dataBinding.dataSource ? dataBinding.dataSource : null,
      dataMembers: dataMembers
    }
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
    const headerControls = []
    let headerControlObjs =
      controlObj.headerControls && controlObj.headerControls.control
        ? controlObj.headerControls.control
        : null
    if (headerControlObjs) {
      headerControlObjs = Array.isArray(headerControlObjs)
        ? headerControlObjs
        : [headerControlObjs]
      headerControlObjs.forEach((con) => {
        headerControls.push(this.toSchemaControl(con))
      })
    }
    const dataBindings = []
    let dataBindingObjs =
      controlObj.dataBindings && controlObj.dataBindings.dataBinding
        ? controlObj.dataBindings.dataBinding
        : null
    if (dataBindingObjs) {
      dataBindingObjs = Array.isArray(dataBindingObjs)
        ? dataBindingObjs
        : [dataBindingObjs]
      dataBindingObjs.forEach((dataBindingObj) => {
        dataBindings.push(this.toSchemaDataBinding(dataBindingObj))
      })
    }
    return {
      type: controlObj.$.type,
      properties: this.toSchemaProperty(controlObj.propertys),
      headerControls,
      controls,
      dataBindings
    }
  }

  toSchemaField(field) {
    return {
      code: field.$.code,
      name: field.$.name,
      chineseName: field.$.chineseName,
      type: field.$.type,
      length: field.$.length,
      precision: field.$.precision,
      defaultValue: field.$.defaultValue
    }
  }

  toSchemaRow(entityDefRow) {
    let entityFieldDefVal = entityDefRow.entityFieldDefVal
    const value = {}
    if (entityFieldDefVal) {
      entityFieldDefVal = Array.isArray(entityFieldDefVal)
        ? entityFieldDefVal
        : [entityFieldDefVal]
      entityFieldDefVal.forEach((defVal) => {
        value[defVal.$.fieldCode] = defVal._
      })
    }
    return value
  }

  toSchemaEntity(entity) {
    const fileds = []
    if (entity.entityFields && entity.entityFields.entityField) {
      let entitiesFields = entity.entityFields.entityField
      entitiesFields = Array.isArray(entitiesFields)
        ? entitiesFields
        : [entitiesFields]
      entitiesFields.forEach((field) => {
        fileds.push(this.toSchemaField(field))
      })
    }
    const rows = []
    if (entity.entityDefRows && entity.entityDefRows.entityDefRow) {
      let entitiesDefRows = entity.entityDefRows.entityDefRow
      entitiesDefRows = Array.isArray(entitiesDefRows)
        ? entitiesDefRows
        : [entitiesDefRows]
      entitiesDefRows.forEach((row) => {
        rows.push(this.toSchemaRow(row))
      })
    }
    return {
      code: entity.$.code,
      name: entity.$.name,
      chineseName: entity.$.chineseName,
      fields: fileds,
      rows: rows
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
      const entities = []
      if (this.obj.entitys && this.obj.entitys.entity) {
        let entity = this.obj.entitys.entity
        entity = Array.isArray(entity) ? entity : [entity]
        entity.forEach((en) => {
          entities.push(this.toSchemaEntity(en))
        })
      }
      this.windowJsonObj = {
        type: 'JGComponent',
        properties,
        controls,
        entities
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

  toImportScripts() {
    const existWidgets = this.getWidgetMap()
    const script = []
    for (const widgetType in existWidgets) {
      if (Object.hasOwnProperty.call(existWidgets, widgetType)) {
        const pluginName = existWidgets[widgetType]
        script.push(
          `import {${widgetType},convert as convert${widgetType}} from '${pluginName}';`
        )
      }
    }
    return script.join('\n')
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
