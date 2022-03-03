import * as viewModel from 'module'
import * as formulaUtil from 'module'

let sandbox
let undefined
let undefined

exports.initModule = function (sb) {
  sandbox = sb
}

/**
 * 返回值对象
 */
let getValueObj = function (element, valueAccessor) {
  let valueData = valueAccessor
  if (!valueData) {
    throw new Error('待更新值数据结构不能为空')
  }
  let valueObj = valueData.getValue()
  return valueObj
}

/**
 * 获取改变的数据
 */
let getChangedDatas = function (records) {
  let isArray = jsTool.isArray(records)
  if (isArray) {
    let rs = []
    for (let i = 0, record; (record = records[i]); i++) {
      let changedData = record.getChangedData()
      changedData = changedData ? changedData : {}
      changedData['id'] = record.getSysId()
      rs.push(changedData)
    }
    return rs
  } else {
    let changedData = records.getChangedData()
    changedData = changedData ? changedData : {}
    changedData['id'] = records.getSysId()
    return changedData
  }
}

/**
 * 过滤数据
 */
let filterRecord = function (record, element) {
  if (record) {
    let widgetId = element.getId()
    let mappingInfo = vmMappingManager.widgetIdToDataSourceField(widgetId)
    let rs = {}
    for (let i = 0, len = mappingInfo.length; i < len; i++) {
      let info = mappingInfo[i]
      if (record.hasOwnProperty(info.fieldName)) {
        rs[info.fieldName] = record[info.fieldName]
      }
    }
    rs['id'] = record['id']
    return rs
  }
  return null
}

/**
 * 设置控件的值
 */
let setValue = function (widgetId, propertyValue) {
  viewModel.getDataModule().setSingleValue(widgetId, propertyValue)
}

/**
 * 设置单行多值控件的值
 * @widgetId 控件编码
 * @refieldKey 控件字段属性名 如:IDColumnName
 * @propertyValue 属性值
 */
let setSingleRecordMultiValue = function (widgetId, refieldKey, propertyValue) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let refield = widgetContext.get(widgetId, refieldKey)
  let dateValue = {}
  dateValue[refield] = propertyValue
  viewModel.getDataModule().setSingleRecordMultiValue(widgetId, dateValue)
}

/**
 * 获取控件的值
 */
let getValue = function (widgetId, params) {
  let value = viewModel.getDataModule().getSingleValue(widgetId)
  //动态在ui控件属性中获取
  if (value == null) {
    return null
  }
  return value
}

/**
 * 清空控件数值 widgetId 控件ID
 * @param  onlyCleanSelectedRecord {boolean}  true 只清除选中的记录
 */
let cleanSelectedControlValue = function (widgetID, onlyCleanSelectedRecord) {
  let dataSourceName = viewModel.getMetaModule().getDataSourceName(widgetID)
  let fieldNames = []
  let mappingInfos = viewModel.getMetaModule().getMappingInfoArray(widgetID)
  // 当属性名存在时，需遍历所有的关联控件，找到对应的属性名为止
  for (let i = 0; i < mappingInfos.length; i++) {
    let _dataSourceName = mappingInfos[i].refField
    let mappingItems = mappingInfos[i].mappingItems
    if (mappingItems && mappingItems.length > 0) {
      for (let t = 0; t < mappingItems.length; t++) {
        let mappingItem = mappingItems[t]
        _dataSourceName = mappingItem.refField
        fieldNames.push(_dataSourceName)
      }
    } else {
      fieldNames.push(_dataSourceName)
    }
  }
  if (fieldNames.length > 0) {
    let records = []
    if (onlyCleanSelectedRecord) {
      records = viewModel.getDataModule().getSelectedRowsByDS(dataSourceName)
    } else {
      records = viewModel.getDataModule().getAllRecordsByDS(dataSourceName)
    }
    let resurtDS = []
    let idField = viewModel.getConstModule().getIDField()
    if (records && records.length > 0) {
      for (let m = 0; m < records.length; m++) {
        //var record = {};
        //record[idField]= records[m][idField];
        let record = records[m]
        for (let tmp = 0; tmp < fieldNames.length; tmp++) {
          //record[fieldNames[tmp]] = null;
          if (record.getMetadata().isContainField(fieldNames[tmp])) {
            record.set(fieldNames[tmp], null)
          }
        }
        resurtDS.push(record)
      }
    }
    if (resurtDS.length > 0) {
      viewModel.getDataModule().setBaseValueByDS(dataSourceName, resurtDS, true)
    }
  }
}

let getDefaultValue = function (widgetId) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let defaultValueScript = widgetContext.get(widgetId, 'DefaultValue')
  if (!defaultValueScript) {
    return {}
  }
  let retValue = formulaUtil.evalExpression(defaultValueScript)
  let columnName = widgetContext.get(widgetId, 'ColumnName')
  let reMap = {}
  reMap[columnName] = retValue
  return reMap
}

export {
  getValueObj,
  getChangedDatas,
  filterRecord,
  setSingleRecordMultiValue,
  setValue,
  getValue,
  getDefaultValue,
  cleanSelectedControlValue
}
