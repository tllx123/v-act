import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { CurrentRecordObserver as CurrentRecordObserver } from '@v-act/vjs.framework.extension.platform.interface.observer'
import { DatasourceObserver as DatasourceObserver } from '@v-act/vjs.framework.extension.platform.interface.observer'
import { DatasourceObserverManager as datasourceObserverManager } from '@v-act/vjs.framework.extension.platform.services.observer.manager'
import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { ExpressionUtil as expressionUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.expression'

let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

/**
 * 获取控件绑定的数据源名称<br />
 * 1. 本接口只获取单个数据源名称<br />
 * 2. 如果控件只绑定一个数据源，则直接取第一个数据源<br />
 * 3. 如果控件又绑定了多个数据源，则报错
 *
 * @param {String} widgetId 控件编号
 * @return {String} 控件绑定的数据源名称
 *
 */
let getBindDatasourceName = function (widgetId) {
  let datasourceName = null
  let datasourceNames = getBindDatasourceNames(widgetId)
  if (datasourceNames.length > 0) {
    if (datasourceNames.length == 1) {
      // 如果控件只绑定一个数据源，则直接取第一个数据源
      datasourceName = datasourceNames[0]
    } else {
      // 如果控件绑定了多个数据源，则报错
      if (undefined == datasourceName || null == datasourceName) {
        throw new Error(
          '[WidgetDatasource.getBindDatasourceName]获取控件数据源名称失败！原因：控件绑定了多个数据源，获取所有数据源名称请使用WidgetDatasource.getBindDatasourceNames()'
        )
      }
    }
  }
  return datasourceName
}

/**
 * 获取控件绑定的数据源名称集合<br />
 * 如果控件没有绑定数据源，则返回空数组。
 *
 * @param {String} widgetId 控件编号
 * @return {Array} 控件绑定的数据源名称集合
 *
 */
let getBindDatasourceNames = function (widgetId) {
  let datasourceNames = windowVmManager.getDatasourceNamesByWidgetCode({
    widgetCode: widgetId
  })
  return datasourceNames
}

/**
 * 获取控件绑定的数据源<br />
 * 1. 本接口只获取单个数据源<br />
 * 2. 如果控件绑定多个数据源，需要通过指定datasourceName获取指定数据源<br />
 * 3. 如果控件只绑定一个数据源，则忽略datasourceName直接取第一个数据源<br />
 * 4. 如果不指定数据源名称，但控件又绑定了多个数据源，则报错
 *
 * @param {String} widgetId 控件编号
 * @param {String} datasourceName （可选）数据源名称
 * @return {Object} 控件绑定的数据源
 *
 */
let getBindDatasource = function (widgetId, datasourceName) {
  let datasourceNames = windowVmManager.getDatasourceNamesByWidgetCode({
    widgetCode: widgetId
  })
  let datasource = null

  if (datasourceNames.length > 0) {
    if (datasourceNames.length == 1) {
      // 如果控件只绑定一个数据源，则忽略datasourceName直接取第一个数据源
      datasource = datasourceManager.lookup({
        datasourceName: datasourceNames[0]
      })
    } else {
      // 如果不指定数据源名称，但控件又绑定了多个数据源，则报错
      if (undefined == datasourceName || null == datasourceName) {
        throw new Error(
          '[WidgetDatasource.getBindDatasource]获取控件数据源失败！原因：控件绑定了多个数据源，但又没指定获取哪个数据源，获取所有数据源请使用WidgetDatasource.getBindDatasources()'
        )
      } else {
        for (let i = 0; i < datasourceNames.length; i++) {
          let dsName = datasourceNames[i]
          if (dsName == datasourceName) {
            datasource = datasourceManager.lookup({
              datasourceName: datasourceNames[i]
            })
          }
        }
      }
    }
  }
  return datasource
}

/**
 * 获取控件绑定的数据源集合<br />
 * 如果控件没有绑定数据源，则返回空数组。
 *
 * @param {String} widgetId 控件编号
 * @return {Array} 控件绑定的数据源集合
 *
 */
let getBindDatasources = function (widgetId) {
  let datasourceNames = windowVmManager.getDatasourceNamesByWidgetCode({
    widgetCode: widgetId
  })
  let datasources = []
  for (let i = 0; i < datasourceNames.length; i++) {
    let datasource = datasourceManager.lookup({
      datasourceName: datasourceNames[i]
    })
    datasources.push(datasource)
  }
  return datasources
}

/**
 * 获取控件绑定的数据源字段<br />
 * 1. 只绑定一个数据源的控件可忽略datasourceName
 *
 * @param {String} widgetId 控件编号
 * @param {String} datasourceName （可选）数据源名称
 * @return {Array} 控件绑定的字段集合
 */
let getBindDatasourceFields = function (widgetId, datasourceName) {
  let datasource = null
  let fields = []
  datasource = getBindDatasource(widgetId, datasourceName)
  fields = windowVmManager.getFieldCodesByWidgetCode({
    widgetCode: widgetId,
    datasourceName: datasourceName
  })
  return fields
}

let addBindDatasourceCurrentRecordEventHandler = function (
  widgetId,
  datasourceName,
  datasourceFields,
  updateEventHandler,
  clearEventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  if (undefined == datasourceFields || null == datasourceFields)
    datasourceFields = getBindDatasourceFields(widgetId, datasourceName)
  if (!arrayUtil.isArray(datasourceFields))
    datasourceFields = [datasourceFields]
  let currentRecordObserver = new CurrentRecordObserver(
    datasourceName,
    widgetId,
    null,
    datasourceFields
  )
  currentRecordObserver.setWidgetValueHandler(function (params) {
    if (updateEventHandler) updateEventHandler(params)
  })
  currentRecordObserver.clearWidgetValueHandler(function (params) {
    if (updateEventHandler) clearEventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: currentRecordObserver
  })
}

/**
 * 添加控件当前行值改变事件
 *
 * @param {String} widgetId 控件编号
 * @return {Function} 设置值事件
 */
let addBindDatasourceCurrentRecordUpdateEventHandler = function (
  widgetId,
  datasourceName,
  datasourceFields,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  if (undefined == datasourceFields || null == datasourceFields)
    datasourceFields = getBindDatasourceFields(widgetId, datasourceName)
  if (!arrayUtil.isArray(datasourceFields))
    datasourceFields = [datasourceFields]
  let currentRecordObserver = new CurrentRecordObserver(
    datasourceName,
    widgetId,
    null,
    datasourceFields
  )
  currentRecordObserver.setWidgetValueHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: currentRecordObserver
  })
}

let addBindDatasourceCurrentRecordClearEventHandler = function (
  widgetId,
  datasourceName,
  datasourceFields,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  if (undefined == datasourceFields || null == datasourceFields)
    datasourceFields = getBindDatasourceFields(widgetId, datasourceName)
  if (!arrayUtil.isArray(datasourceFields))
    datasourceFields = [datasourceFields]
  let currentRecordObserver = new CurrentRecordObserver(
    datasourceName,
    widgetId,
    null,
    datasourceFields
  )
  currentRecordObserver.clearWidgetValueHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: currentRecordObserver
  })
}

let addBindDatasourceCurrentEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setCurrentRecordHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

let addBindDatasourceSelectEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setSelectRecordHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

let addBindDatasourceLoadEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setLoadHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

//绑定数据源状态（将要取数据）
let addBindDatasourceFetchEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setFetchHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

//绑定数据源状态（获取数据之后？）
let addBindDatasourceFetchedEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setFetchedHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}
let addBindDatasourceUpdateEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setUpdateHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

let addBindDatasourceDeleteEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setRemoveHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

let addBindDatasourceInsertEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setInsertHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

let addBindDatasourceFetchEventHandler = function (
  widgetId,
  datasourceName,
  eventHandler
) {
  if (undefined == datasourceName || null == datasourceName)
    datasourceName = getBindDatasourceName(widgetId)
  if (undefined == datasourceName || null == datasourceName) return
  let datasourceObserver = new DatasourceObserver(
    datasourceName,
    widgetId,
    null
  )
  datasourceObserver.setFetchHandler(function (params) {
    eventHandler(params)
  })
  return datasourceObserverManager.addObserver({
    observer: datasourceObserver
  })
}

/**
 * 获取单值控件的值
 *
 * @param {String} widgetId 控件编号
 * @return {String} 控件值
 */
let getSingleValue = function (widgetId, field) {
  let datasource = getBindDatasource(widgetId)
  let fields = []
  if (field) {
    fields = [field]
  } else {
    fields = getBindDatasourceFields(widgetId)
  }
  let value = null
  if (datasource == null || fields.length < 1) {
    value = widgetAction.executeWidgetAction(widgetId, 'getValue')
  } else {
    let currentRecord = datasource.getCurrentRecord()
    if (currentRecord) {
      let field = fields[0]
      value = currentRecord.get(field)
    }
  }
  return value
}

/**
 * 设置单值控件的值
 *
 * @param {String} widgetId 控件编号
 * @param {String} value 控件值
 */
let setSingleValue = function (widgetId, value) {
  let datasource = getBindDatasource(widgetId)
  let fields = getBindDatasourceFields(widgetId)
  if (fields.length > 1)
    throw new Error('接口调用错误，控件【' + widgetId + '】绑定了多个字段！')
  let field = fields[0]
  if (datasource == null || fields.length < 1) {
    widgetAction.executeWidgetAction(widgetId, 'setValue', value)
  } else {
    let record = datasource.getCurrentRecord()
    if (!record) {
      record = datasource.createRecord()
      datasource.insertRecords({
        records: [record]
      })
      record = datasource.getRecordById(record.getSysId())
    }
    record.set(field, value)
    datasource.updateRecords({
      records: [record]
    })
  }
}

/**
 * 清除控件值
 *
 * @param {String} widgetId 控件编号
 * @param {Boolean} onlyCleanSelectedRecord 是否只清除选中记录的值
 */
let clearValue = function (widgetId, onlyCleanSelectedRecord) {
  let datasource = getBindDatasource(widgetId)
  let fields = getBindDatasourceFields(widgetId)
  let records = []
  if (onlyCleanSelectedRecord) records = datasource.getSelectedRecords()
  else records = datasource.getAllRecords()

  let updatedRecords = []
  let iterator = records.iterator()
  while (iterator.hasNext()) {
    let record = iterator.next()
    for (let i = 0; i < fields.length; i++) {
      if (record.getMetadata().isContainField(fields[i])) {
        record.set(fields[i], null)
        updatedRecords.push(record)
      }
    }
  }
  datasource.updateRecords({
    records: updatedRecords
  })
}

/**
 * 设置控件的多个值
 *
 * @param {String} widgetId 控件编号
 * @param {Array} value 控件值
 */
let setSingleRecordMultiValue = function (widgetId, value) {
  let datasource = getBindDatasource(widgetId)
  let currentRecord = datasource.getCurrentRecord()
  if (!currentRecord) {
    currentRecord = datasource.createRecord()
    datasource.insertRecords({
      records: [currentRecord]
    })
    currentRecord = datasource.getRecordById(currentRecord.getSysId())
  }
  for (let key in value) {
    currentRecord.set(key, value[key])
  }
  datasource.updateRecords({
    records: [currentRecord]
  })
}

/**
 * 获取控件的多个值
 *
 * @param {String} widgetId 控件编号
 */
let getSingleRecordMultiValue = function (widgetId) {
  let datasource = getBindDatasource(widgetId)
  let currentRecord = datasource.getCurrentRecord()
  return currentRecord.toMap()
}

/**
 * 获取单值控件的默认值
 *
 * @param {String} widgetId 控件编号
 */
let getSingleColumnWidgetDefaultValue = function (widgetId) {
  let defaultValueScript = widgetContext.get(widgetId, 'DefaultValue')
  let value = ''
  if (defaultValueScript) {
    value = expressionUtil.execute(defaultValueScript)
  }
  if (undefined == value || null == value) {
    return ''
  } else {
    let columnName = widgetContext.get(widgetId, 'ColumnName')
    let reMap = {}
    reMap[columnName] = value
    return reMap
  }
}

let setBaseValue = function (widgetId, records) {
  let datasource = getBindDatasource(widgetId)
  datasource.updateRecords({
    records: records
  })
}

export {
  getBindDatasourceName,
  getBindDatasourceNames,
  getBindDatasource,
  getBindDatasources,
  getBindDatasourceFields,
  addBindDatasourceCurrentRecordEventHandler,
  addBindDatasourceCurrentRecordUpdateEventHandler,
  addBindDatasourceCurrentRecordClearEventHandler,
  addBindDatasourceCurrentEventHandler,
  addBindDatasourceSelectEventHandler,
  addBindDatasourceLoadEventHandler,
  addBindDatasourceFetchEventHandler,
  addBindDatasourceFetchedEventHandler,
  addBindDatasourceUpdateEventHandler,
  addBindDatasourceDeleteEventHandler,
  addBindDatasourceInsertEventHandler,
  getSingleValue,
  setSingleValue,
  clearValue,
  setSingleRecordMultiValue,
  getSingleColumnWidgetDefaultValue,
  setBaseValue
}
