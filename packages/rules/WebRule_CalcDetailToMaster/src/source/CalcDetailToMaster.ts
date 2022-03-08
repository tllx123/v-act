import * as formulaUtil from 'module'
import * as log from 'module'
import * as viewContext from 'module'
import * as viewModel from 'module'
import * as widgetAttribute from 'module'

import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

// 加载viewModel模块

// 加载jsonUtil模块

// 加载formulaUtil模块

// 加载widgetAttribute模块

// 加载viewContext模块

//加载log模块

export function initModule(sBox) {}

let FORMULATYPE_SUM = '0' // 求和
let FORMULATYPE_AVG = '1' // 平均值
let FORMULATYPE_MAX = '2' // 最大值
let FORMULATYPE_MIN = '3' // 最小值

// 规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const main = function (ruleContext: RuleContext) {
  // 获取规则上下文中的规则配置值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 处理规则配置值
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)

  // 根据key获取规则配置参数值
  let calFormulaType = inParamsObj['formulaType'] // 计算公式
  let srcFieldName = inParamsObj['detailFieldName'] // 源字段的fieldName, 从表字段
  let destFieldName = inParamsObj['masterFieldName'] // 目标字段的fieldName, 主表字段
  let condition = inParamsObj['detailFieldCondition']
  let destTableName = destFieldName.split('.')[0]
  destFieldName = destFieldName.split('.')[1]

  let refWidgetIds = viewModel
    .getMetaModule()
    .getWidgetIdsByDataSource(destTableName)
  // 根据字段的fieldName与公式类型进行相关公式操作计算出对应的值
  let retValue = calValue(srcFieldName, calFormulaType, condition)
  let flag = true
  for (let index = 0; index < refWidgetIds.length; index++) {
    let retWidgetId = refWidgetIds[index]
    let widgetType = viewContext.getWidgetContext(retWidgetId, 'widgetType') // 操作控件的widgetType
    let storeType = viewContext.getWidgetStoreTypeFromContext(widgetType)
    if (storeType == widgetAttribute.storeType.SET) {
      let record = viewModel.getDataModule().getCurrentRow(retWidgetId)
      if (!record) {
        log.warn(
          '规则【计算从表字段的值并填写到主表字段】，给集合控件赋值时，目标实体没有当前记录，请检查'
        )
        return
      }
      flag = false
      setValueForSet(retValue, destTableName, destFieldName, record)
      break
    } else if (storeType == widgetAttribute.storeType.SINGLE_RECORD) {
      let mappingInfo = viewModel.getMetaModule().getMappingInfo(retWidgetId)
      if (mappingInfo['mappingItems'] != undefined) {
        let mappingItems = mappingInfo.mappingItems
        for (let i = 0; i < mappingItems.length; i++) {
          let mappingItem = mappingItems[i]
          if (mappingItem['refField'] == destFieldName) {
            flag = false
            let destCurRecord = viewModel
              .getDataModule()
              .getCurrentRowByDS(destTableName)
            if (!destCurRecord) {
              log.warn(
                '规则【计算从表字段的值并填写到主表字段】，给单值控件赋值时，目标实体没有当前记录，请检查'
              )
              return
            }
            setValueForSingleValue(retValue, destFieldName, destTableName)
            break
          }
        }
      }
    } else if (
      storeType == widgetAttribute.storeType.SINGLE_RECORD_MULTI_VALUE
    ) {
      let mappingInfo = viewModel.getMetaModule().getMappingInfo(retWidgetId)
      if (mappingInfo['mappingItems'] != undefined) {
        let mappingItems = mappingInfo.mappingItems
        for (let i = 0; i < mappingItems.length; i++) {
          let mappingItem = mappingItems[i]
          if (mappingItem['refField'] == destFieldName) {
            flag = false
            setValueForSingleMultiValue(retValue, destTableName, destFieldName)
            break
          }
        }
      }
    }
  }
  if (flag == true) {
    setValueForSingleValue(retValue, destFieldName, destTableName)
  }
}

/**
 *  计算公式值赋值给单行多值控件的fieldname。
 *  @param	retValue		汇总结果
 *  @param  destTableName   赋值字段的dsname, 主表表名
 *  @param  destFieldName   赋值字段的fieldname, 主表字段
 */
let setValueForSingleMultiValue = function (
  retValue,
  destTableName,
  destFieldName
) {
  // 对应字段赋值
  let obj = {}
  obj[destFieldName] = retValue
  viewModel.getDataModule().setSingleRecordMultiValueByDS(destTableName, obj)
}

/**
 *  计算公式值赋值给单值控件的fieldname。
 *  @param	retValue		汇总结果
 *	@param  destFieldName   赋值字段的fieldname, 主表字段
 *  @param  destTableName   赋值字段的dsname, 主表表名
 */
let setValueForSingleValue = function (retValue, destFieldName, destTableName) {
  // 对应字段赋值
  viewModel
    .getDataModule()
    .setSingleValueByDS(destTableName, destFieldName, retValue)
}

/**
 *  计算公式值赋值集合控件的对应行的某一列。
 *  @param	retValue		汇总结果
 *  @param  destTableName   赋值字段的dsname, 主表表名
 *  @param  destFieldName   赋值字段的fieldname, 主表字段
 *  @param  record          集合控件操作行的数据
 */
let setValueForSet = function (retValue, destTableName, destFieldName, record) {
  record.set(destFieldName, retValue)
  // 对应字段赋值
  viewModel.getDataModule().setRecordValueByDS(destTableName, record)
}

/**
 *  根据字段的fieldName与公式类型进行相关公式操作计算出对应的值
 *  @param	fieldName  字段的fieldName 如：JC_XMYL.OrderNo
 *  @param  calFormulaType 计算公式的类型（求和："sum"、平均值："avg"、 最大值："max"、 最小值："min"）
 */
let calValue = function (fieldName, calFormulaType, condition) {
  let retValue = 0
  if (fieldName.indexOf('.') == -1) {
    throw new Error('根据fieldName的值获取表名失败,格式必须为"表名.字段名"')
  }
  let dsName = fieldName.substring(0, fieldName.indexOf('.'))
  fieldName = fieldName.substring(fieldName.indexOf('.') + 1)
  // 获取从表所有数据
  let records = getFilterRows(dsName, condition)
  if (null != records && records.length > 0) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let value = record.get(fieldName) ? parseFloat(record.get(fieldName)) : 0
      if (i == 0) {
        retValue = value
        continue
      }
      switch (calFormulaType) {
        case FORMULATYPE_SUM:
          retValue = retValue + value
          break
        case FORMULATYPE_AVG:
          retValue = retValue + value
          break
        case FORMULATYPE_MAX:
          retValue = value > retValue ? value : retValue
          break
        case FORMULATYPE_MIN:
          retValue = value < retValue ? value : retValue
          break
        default:
          break
      }
    }
    if (FORMULATYPE_AVG == calFormulaType) {
      retValue = isNaN(retValue) ? 0 : retValue / records.length
    }
  }
  return isNaN(retValue) ? 0 : retValue
}

/**
 *	根据实体名称及筛选条件过滤数据
 *  @param	tableName    	实体名称
 *  @param	condition		筛选条件
 */
let getFilterRows = function (tableName, condition) {
  let records = viewModel.getDataModule().getAllRecordsByDS(tableName)
  if (undefined != records && null != records && records.length > 0) {
    if (undefined != condition && null != condition && condition.length > 0) {
      let retRecords = []
      for (let index = 0; index < records.length; index++) {
        let record = records[index]
        let ret = formulaUtil.evalExpressionByRecords(condition, record)
        if (typeof ret != 'boolean') {
          throw '条件必须返回布尔类型，请检查'
        }
        if (ret == true) {
          retRecords.push(record)
        }
      }
      return retRecords
    }
  }
  return records
}
export { main }
