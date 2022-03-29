import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { ObjectUtil } from '@v-act/vjs.framework.extension.util.object'
import { CollectionUtil } from '@v-act/vjs.framework.extension.util.collection'

/**
 *	vmmapping格式
 * 	{
 * 		"widgets":{
 * 			<widgetCode>:{
 * 				"widgetId" : 控件编号,
 * 				"mappingItems": [{
 * 					"dataSource":数据源名称,
 * 					“dataSourceType”：数据源类型，
 * 					"mappingItem": [{
 * 						"field": 控件属性名称,
                        "refField": 字段编号,
                        "refIdColField": 下拉列保存字段（特殊处理下拉列保存字段）
 * 					}]
 * 				}]
 * 			}
 * 		},
 * 		"dataSources":{
 * 			<datasourceName>:{
 * 				"tables": "info",
 *				"id": "info",
 *				"whereClause": "",
 *				"defaultValues": [],
 *				"persistence": false,
 *				"fetchMode": "dataSet",
 *				"initDefaultData": [{}],
 *				"isVirtual": true,
 *				"initMetaFields": [{}]
 * 			}
 * 		}
 * } 
 */

let keys = ObjectUtil.keys,
  each = CollectionUtil.each,
  token = 'WindowVMMapping_Token_Key',
  token_window_vm = 'WindowVMMapping_Token_Window_Vm'

let getWindowStorage = function (
  componentCode: string,
  windowCode: string,
  isCreate: boolean
) {
  let rs,
    s = storageManager.get(storageManager.TYPES.MAP, token),
    depth = [componentCode, windowCode]
  for (let i = 0, key; (key = depth[i]); i++) {
    if (s.containsKey(key)) {
      rs = s = s.get(key)
    } else if (isCreate) {
      rs = storageManager.newInstance(storageManager.TYPES.MAP)
      s.put(key, rs)
      s = rs
    }
  }
  return rs
}

let getWidgets = function (componentCode: string, windowCode: string) {
  let wStorage = getWindowStorage(componentCode, windowCode, false)
  if (wStorage) {
    let vm = wStorage.get(token_window_vm)
    if (vm && vm.widgets) {
      return vm.widgets
    }
  }
  return null
}

let iterateFromWidgetMp = function (
  code: string,
  widgetMp: any,
  callback: any
) {
  let items = widgetMp.mappingItems
  if (items) {
    each(items, function (item: any) {
      callback(code, item)
    })
  }
}

let iterateMappingItem = function (
  componentCode: string,
  windowCode: string,
  callback: any
) {
  let widgets = getWidgets(componentCode, windowCode)
  if (!widgets) return
  let widgetCodes = keys(widgets)
  each(widgetCodes, function (code: string) {
    iterateFromWidgetMp(code, widgets[code], callback)
  })
}

let iterateFieldMappingItem = function (dsItem: any, callback: any) {
  let mappingItems = dsItem.mappingItem
  if (mappingItems) {
    each(mappingItems, function (item: any) {
      callback(item)
    })
  }
}

const addVMMapping = function (
  componentCode: string,
  windowCode: string,
  vmmapping: any
) {
  let wStorage = getWindowStorage(componentCode, windowCode, true)
  wStorage.put(token_window_vm, vmmapping)
}

let _getDatasourceFromWindowProperty = function () {
  let windowScope = scopeManager.getWindowScope()
  let windowCode = windowScope.getWindowCode()
  let entitys = widgetContext.get(windowCode, 'entitys')
  if (entitys) {
    let dsCfg = {}
    for (let i = 0, l = entitys.length; i < l; i++) {
      let entity = entitys[i]
      let entityCode = entity.code
      let initMetaFields: any = []
      dsCfg[entity.code] = {
        tables: entityCode,
        whereClause: '',
        initMetaFields: initMetaFields,
        fetchMode: 'dataSet',
        chineseName: 'ds',
        defaultValues: [],
        persistence: false,
        id: entityCode,
        isVirtual: true
      }
      let entityFields = entity.entityFields
      if (entityFields) {
        for (let j = 0, len = entityFields.length; j < len; j++) {
          let entityField = entityFields[j]
          initMetaFields.push({
            code: entityField.code,
            name: entityField.name,
            type: entityField.type,
            length: parseInt(entityField.length),
            precision:
              entityField.precision == '' ? 0 : parseInt(entityField.precision),
            expression: entityField.expression
          })
        }
      }
      let entityDefRows = entity.entityDefRows
      if (entityDefRows && entityDefRows.length > 0) {
        dsCfg[entity.code].initDefaultData = entityDefRows
      }
    }
    return dsCfg
  }
  return null
}

const getVMMapping = function (componentCode: string, windowCode: string) {
  let windowScope = scopeManager.getWindowScope()
  windowCode = windowScope.getWindowCode()
  let version = widgetContext.get(windowCode, 'version')
  let wStorage = getWindowStorage(componentCode, windowCode, false)
  if (!wStorage || !wStorage.get(token_window_vm)) {
    if (version == '4') {
      let dsCfg = _getDatasourceFromWindowProperty()
      // @ts-ignore
      this.addVMMapping(componentCode, windowCode, { dataSources: dsCfg })
      wStorage = getWindowStorage(componentCode, windowCode, false)
    }
  }
  return wStorage ? wStorage.get(token_window_vm) : null
}

const getWidgetCodesByDatasourceName = function (
  componentCode: string,
  windowCode: string,
  datasourceName: string
) {
  let widgetCodes: any = []
  iterateMappingItem(
    componentCode,
    windowCode,
    function (code: string, item: any) {
      if (datasourceName == item.dataSource) {
        widgetCodes.push(code)
      }
    }
  )
  return widgetCodes
}

const getWidgetCodesByField = function (
  componentCode: string,
  windowCode: string,
  datasourceName: string,
  fieldCode: string
) {
  let widgetCodes: any = []
  iterateMappingItem(
    componentCode,
    windowCode,
    function (code: string, item: any) {
      if (datasourceName == item.dataSource) {
        iterateFieldMappingItem(item, function (mappingItem: any) {
          if (mappingItem.refField == fieldCode) {
            widgetCodes.push(code)
          } else if (
            mappingItem.refIdColField &&
            mappingItem.refIdColField == fieldCode
          ) {
            widgetCodes.push(code)
          }
        })
      }
    }
  )
  return widgetCodes
}

const getDatasourceNameByWidgetCode = function (
  componentCode: string,
  windowCode: string,
  widgetCode: string
) {
  let datasources = {}
  let widgets = getWidgets(componentCode, windowCode)
  if (widgets && widgets[widgetCode]) {
    iterateFromWidgetMp(
      widgetCode,
      widgets[widgetCode],
      function (code: string, item: any) {
        datasources[item.dataSource] = true
      }
    )
  }
  return keys(datasources)
}

const getFieldCodesByWidgetCode = function (
  componentCode: string,
  windowCode: string,
  widgetCode: string,
  datasourceName: string
) {
  let fieldCodes: any = []
  let widgets = getWidgets(componentCode, windowCode)
  if (widgets) {
    if (!widgets[widgetCode]) {
      //当前验证场景：打开窗体返回值给控件赋值
      throw new Error(
        '控件【' + widgetCode + '】不存在，请检查配置.',
        // @ts-ignore
        exceptionFactory.TYPES.Config
      )
    }
    iterateFromWidgetMp(
      widgetCode,
      widgets[widgetCode],
      function (code: string, item: any) {
        iterateFieldMappingItem(item, function (mappingItem: any) {
          if (mappingItem.refField)
            //弹出选择只绑定显示字段会报错Task20201109080
            fieldCodes.push(mappingItem.refField)
        })
      }
    )
  }
  return fieldCodes
}

const getFieldCodeByPropertyCode = function (
  componentCode: string,
  windowCode: string,
  widgetCode: string,
  propertyCode: string
) {
  let fieldCode = null
  let widgets = getWidgets(componentCode, windowCode)
  if (widgets) {
    iterateFromWidgetMp(
      widgetCode,
      widgets[widgetCode],
      function (code: string, item: any) {
        iterateFieldMappingItem(item, function (mappingItem: any) {
          if (mappingItem.field == propertyCode) {
            fieldCode = mappingItem.refField
          }
        })
      }
    )
  }
  return fieldCode
}

const getPropertyCodeByFieldCode = function (
  componentCode: string,
  windowCode: string,
  widgetCode: string,
  fieldCode: string
) {
  let propertyCode: any = null
  let widgets = getWidgets(componentCode, windowCode)
  if (widgets) {
    iterateFromWidgetMp(
      widgetCode,
      widgets[widgetCode],
      function (code: string, item: any) {
        iterateFieldMappingItem(item, function (mappingItem: any) {
          let refField = mappingItem.refField
          let field = mappingItem.field
          if (refField == fieldCode) {
            //存在多个匹配的Task20191230144
            if (
              null == propertyCode ||
              (null != field && field.indexOf(widgetCode) == -1)
            ) {
              propertyCode = mappingItem.field
            }
          }
        })
      }
    )
  }
  return propertyCode
}

const resetToDefault = function (
  componentCode: string,
  windowCode: string,
  widgetCode: string,
  datasourceName: string
) {
  let widgets = getWidgets(componentCode, windowCode)
  let widget = widgets[widgetCode]
  if (widget) {
    let currentMappingItems = widget['mappingItems']
    if (!currentMappingItems) {
      widget['mappingItems'] = [
        {
          dataSource: datasourceName,
          mappingItem: []
        }
      ]
    } else {
      let mappingItemsArray = widget['mappingItems']
      let hasMatchDS = false
      for (let index = 0; index < mappingItemsArray.length; index++) {
        let mappingItemsObj = mappingItemsArray[index]
        if (mappingItemsObj['dataSource'] == datasourceName) {
          hasMatchDS = true
          break
        }
      }
      if (!hasMatchDS) {
        widget['mappingItems'].push({
          dataSource: datasourceName,
          mappingItem: []
        })
      }
    }
  } else {
    widget = {
      widgetId: widgetCode,
      mappingItems: [
        {
          dataSource: datasourceName,
          mappingItem: []
        }
      ]
    }
    widgets[widgetCode] = widget
  }
}

const removeVMapping = function (
  componentCode: string,
  windowCode: string,
  widgetCode: string,
  datasourceName: string
) {
  let widgets = getWidgets(componentCode, windowCode)
  let widget = widgets[widgetCode]
  if (widget) {
    let currentMappingItems = widget['mappingItems']
    if (!currentMappingItems) {
      return false
    }
    let hasMatchDS = false
    let afterDelMappingItemArray = []
    for (let index = 0; index < currentMappingItems.length; index++) {
      let mappingItemsObj = currentMappingItems[index]
      if (mappingItemsObj['dataSource'] == datasourceName) {
        hasMatchDS = true
        continue
      }
      afterDelMappingItemArray.push(mappingItemsObj)
    }
    if (hasMatchDS) {
      widget['mappingItems'] = afterDelMappingItemArray
    }
  }
  return false
}

export {
  addVMMapping,
  getDatasourceNameByWidgetCode,
  getFieldCodeByPropertyCode,
  getFieldCodesByWidgetCode,
  getPropertyCodeByFieldCode,
  getVMMapping,
  getWidgetCodesByDatasourceName,
  getWidgetCodesByField,
  removeVMapping,
  resetToDefault
}
