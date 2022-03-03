import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { DatasourcePusher as pusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { StoreTypes as storeTypes } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetDatasource as widgetDatasource } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.logic.datasource'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
let sandBox
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {
  sandBox = sBox
}

// 目标类型： 0 系统变量，1 控件， 2 组件变量， 3 实体字段，4活动集上下文变量，5活动集输出变量，6窗体输出变量
let TARGET_SYS_VAR = '0'
let TARGET_CONTROL = '1'
let TARGET_COM_VAR = '2'
let TARGET_ENTITY = '3'
let TARGET_CONTEXT_VAR = '4'
let TARGET_OUTPUT_VAR = '5'
let TARGET_WINDOW_OUTPUT_VAR = '6'
let TARGET_REPORT_ENTITY = '7'

let main = function (ruleContext) {
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg()['inParams'])
  let fieldMap = inParams['FieldMap']
  if (!fieldMap || fieldMap.length <= 0) {
    log.warn('没有配置任何字段映射信息，无法进行赋值')
    return
  }
  setTargetValue(ruleContext, fieldMap)
}

/**
 * 对目标值进行设置
 * @param fieldMap 字段映射信息
 */
let setTargetValue = function (ruleContext, fieldMap) {
  /**
   * 保存需要赋值的实体字段信息
   * 格式：
   * {
   * 	entityCode：[{
   * 				name:column1,
   * 				value:value
   * 			 }.....]
   * }
   * */
  let entityInfos = {}
  for (let i = 0; i < fieldMap.length; i++) {
    let fieldObj = fieldMap[i]
    let targetType = fieldObj['TargetType']
    let target = fieldObj['Target']
    let sourceType = fieldObj['SourceType']
    let source = fieldObj['Source']
    //如果当前表达式中有使用到前面赋值过的实体字段，则先把之前的数据更新，再去获取值。
    entityInfos = updatePreEntityData(source, entityInfos)
    let srcVal = getSourceValue(
      sourceType,
      source,
      fieldObj,
      ruleContext.getRouteContext()
    )
    switch (targetType + '') {
      case TARGET_SYS_VAR:
        componentParam.setVariant({
          code: target,
          value: srcVal
        })
        break
      case TARGET_CONTROL:
        if (target.indexOf('.') == -1) {
          // 目标不存在.表示为单值控件
          //						widgetDatasource.setSingleValue(target, srcVal);
          //兼容一些不是没有绑定数据库的控件，如：检索控件
          widgetProperty.set(target, 'Value', srcVal)
        } else {
          // 目标存在.表示为多值控件
          var widgetId = target.split('.')[0]
          var propertyCode = target.split('.')[1]
          widgetProperty.set(widgetId, propertyCode, srcVal)
        }
        break
      case TARGET_COM_VAR:
        windowParam.setInput({
          code: target,
          value: srcVal
        })
        break
      case TARGET_ENTITY:
        var dest = target.split('.')
        var dsName = dest[0]
        /*var datasource = manager.lookup({
                    "datasourceName": dsName
                });
                var records = datasource.getAllRecords();
                if (records == null || records == undefined || records.toArray().length == 0) {
                    log.warn("目标实体没有数据，无法进行赋值");
                    break;
                }

                var record = datasource.getCurrentRecord();
                if (!record) {
                    log.warn("目标实体没有当前数据，无法进行赋值");
                    break;
                }
                setEntityVal(dsName, dest[1], srcVal);*/
        if (entityInfos[dsName]) {
          var columnInfos = entityInfos[dsName]
          columnInfos[dest[1]] = srcVal
        } else {
          var field_value = {}
          field_value[dest[1]] = srcVal
          entityInfos[dsName] = field_value
        }
        break
      case TARGET_CONTEXT_VAR:
        // 给当前活动集上下文变量赋值
        ruleContext.getRouteContext().setVariable(target, srcVal)
        break
      case TARGET_OUTPUT_VAR:
        // 给当前活动集输出变量赋值
        ruleContext.getRouteContext().setOutputParam(target, srcVal)
        break
      case TARGET_WINDOW_OUTPUT_VAR:
        // 给当前窗体输出变量赋值
        windowParam.setOutput({
          code: target,
          value: srcVal
        })
        break
      case TARGET_REPORT_ENTITY:
        updateReportEntity(fieldObj, srcVal, target)
        break
      default:
        log.error('无效的目标类型：' + targetType)
        break
    }
  }
  //给实体赋值
  setEntityValue(entityInfos)
}

/**
 * 检查当前来源是否使用前面赋值的实体字段,如果由使用，则先更新使用的实体数据。
 * */
let updatePreEntityData = function (sVal, entityInfos) {
  let newEntityInfo = {}
  for (let entity in entityInfos) {
    let fields = entityInfos[entity]
    if (fields) {
      for (let field in fields) {
        let value = '[' + entity + '].[' + field + ']'
        if (sVal.indexOf(value) != -1) {
          newEntityInfo[entity] = entityInfos[entity]
          delete entityInfos[entity]
          break
        }
      }
    }
  }
  //给实体赋值
  setEntityValue(newEntityInfo)
  return entityInfos
}

/**
 * 给实体记录赋值
 * */
let setEntityValue = function (entityInfos) {
  for (let key in entityInfos) {
    let entityName = key
    let datasource = manager.lookup({
      datasourceName: entityName
    })
    let records = datasource.getAllRecords()
    if (
      records == null ||
      records == undefined ||
      records.toArray().length == 0
    ) {
      log.warn('目标实体没有数据，无法进行赋值')
      continue
    }

    let record = datasource.getCurrentRecord()
    if (!record) {
      log.warn('目标实体没有当前行数据，无法进行赋值')
      continue
    }
    let fieldInfos = entityInfos[entityName]
    for (let field in fieldInfos) {
      let value = fieldInfos[field]
      record.set(field, value)
    }
    datasource.updateRecords({
      records: [record]
    })
  }
}

/**
 * 给目标实体字段赋值
 */
let setEntityVal = function (dsName, destFieldName, srcVal) {
  let refWidgetIds = windowVMManager.getWidgetCodesByDatasourceName({
    datasourceName: dsName
  })
  let flag = true
  for (let index = 0; index < refWidgetIds.length; index++) {
    let retWidgetId = refWidgetIds[index]
    let widgetType = widgetContext.get(retWidgetId, 'widgetType')
    let storeType = widgetContext.getStoreType(retWidgetId)
    if (storeType == storeTypes.SET) {
      let datasource = manager.lookup({
        datasourceName: dsName
      })
      let record = datasource.getCurrentRecord()
      if (!record) {
        return
      }
      flag = false
      record.set(destFieldName, srcVal)
      datasource.updateRecords({
        records: [record]
      })
      break
    } else if (storeType == storeTypes.SINGLE_RECORD) {
      let mappingInfo = windowVMManager.getFieldCodesByWidgetCode({
        widgetCode: retWidgetId
      })
      if (mappingInfo['mappingItems'] != undefined) {
        let mappingItems = mappingInfo.mappingItems
        for (let i = 0; i < mappingItems.length; i++) {
          let mappingItem = mappingItems[i]
          if (mappingItem['refField'] == destFieldName) {
            flag = false
            pusher.setFieldValue({
              datasourceName: dsName,
              fieldCode: destFieldName,
              value: srcVal
            })
            break
          }
        }
      }
    } else if (storeType == storeTypes.SINGLE_RECORD_MULTI_VALUE) {
      let mappingInfo = windowVMManager.getFieldCodesByWidgetCode({
        widgetCode: retWidgetId
      })
      if (mappingInfo['mappingItems'] != undefined) {
        let mappingItems = mappingInfo.mappingItems
        for (let i = 0; i < mappingItems.length; i++) {
          let mappingItem = mappingItems[i]
          if (mappingItem['refField'] == destFieldName) {
            flag = false
            let obj = {}
            obj[destFieldName] = srcVal
            pusher.setValues({
              datasourceName: dsName,
              values: obj
            })
            break
          }
        }
      }
    }
  }
  if (flag == true) {
    pusher.setFieldValue({
      datasourceName: dsName,
      fieldCode: destFieldName,
      value: srcVal
    })
  }
}

/**
 * 按照来源类型，获取来源的值
 */
let getSourceValue = function (sourceType, source, fieldObj, routeContext) {
  let value = null
  switch (sourceType + '') {
    case 'expression':
      var context = new ExpressionContext()
      context.setRouteContext(routeContext)
      value = engine.execute({
        expression: source,
        context: context
      })
      break
    case 'entityField':
      source = getFreeDBSourceDBName(fieldObj)
      var freeDBName = 'freeDB_' + uuid.generate()
      var fieldsMapping = getFreeDBFieldsMapping(fieldObj)
      var freeDBMeDate = {
        model: [
          {
            datasource: freeDBName,
            fields: fieldsMapping
          }
        ]
      }
      var freeDBParams = {
        datas: null,
        metadata: freeDBMeDate
      }
      var freeDB = datasourceFactory.unSerialize(freeDBParams)
      // 处理来源实体来自方法变量、窗体输入输出
      var srcDB = _getEntityDS(fieldObj.SourceEntityType, source, routeContext)
      //实体间数据拷贝
      var copyFieldsMapping = getFreeDBCopyFieldsMapping(fieldObj)
      var paramDB = pusher.copyBetweenEntities({
        sourceEntity: srcDB,
        destEntity: freeDB,
        valuesMapping: copyFieldsMapping,
        dataFilterType: 'all',
        routeContext: routeContext
      })
      value = paramDB
      break
    default:
      log.warn('无效的来源值类型：' + sourceType)
      break
  }
  return value
}

/**
 * TODO:由于目前配置信息中没有来源实体的名称，所以必须从字段配置中获取
 */
let getFreeDBSourceDBName = function (fieldObj) {
  if (fieldObj['entityFieldMapping'][0]['srcValue'] == 'entityField') {
    let firstFieldConfig = fieldObj['entityFieldMapping'][0]['srcValue']
    return firstFieldConfig.split('.')[0]
  } else {
    return fieldObj.Source
  }
}

/**
 * 按照变量类型及变量编号获取实体变量的字段定义信息
 * @param variableType 变量类型(窗体变量:windowVariant,窗体输出变量:windowOutput,活动集输入变量:ruleSetInput,活动集上下文变量:ruleSetVariant,活动集输出变量:ruleSetOutput)
 */
let getEntityVariableColumnConfig = function (variableType, variableCode) {
  if (windowVariant == 'windowVariant') {
    // 窗体输入变量
    let variableConfig = windowParam.getInput({
      code: variableCode
    })
    return variableConfig.configs
  } else if (windowVariant == 'windowOutput') {
    // 窗体输出变量
    let variableConfig = windowParam.getInput({
      code: variableCode
    })
    return variableConfig.configs
  } else if (windowVariant == 'ruleSetInput') {
    // 窗体输入变量
    return null
  } else if (windowVariant == 'ruleSetVariant') {
    // 活动集上下文变量
    return null
  } else if (windowVariant == 'ruleSetOutput') {
    // 活动集输出变量
    return null
  }
  return null
}

let getFreeDBFieldsMapping = function (fieldObj) {
  let configFieldsMapping = fieldObj['entityFieldMapping']
  let fieldsMapping = []
  for (let i = 0; i < configFieldsMapping.length; i++) {
    let configField = configFieldsMapping[i]
    let code = configField.destFieldName
    let type = 'char' //目前没有取值的来源，只能认为都是char
    fieldsMapping.push({
      code: code,
      type: type
    })
  }
  return fieldsMapping
}

let getFreeDBCopyFieldsMapping = function (fieldObj) {
  let configFieldsMapping = fieldObj['entityFieldMapping']
  let copyFieldsMapping = []
  for (let i = 0; i < configFieldsMapping.length; i++) {
    let configField = configFieldsMapping[i]
    let paramEntityField = configField.destFieldName
    let fieldValueType =
      configField.srcValueType == 'expression' ? 'expression' : 'field'
    let _srcValueItems = configField.srcValue.split('.')
    let fieldValue = null

    if (fieldValueType == 'field') {
      fieldValue = _srcValueItems[_srcValueItems.length - 1]
    } else {
      fieldValue = configField.srcValue
    }
    copyFieldsMapping.push({
      paramEntityField: paramEntityField,
      fieldValueType: fieldValueType,
      fieldValue: fieldValue
    })
  }
  return copyFieldsMapping
}

// 获取实体数据源
let _getEntityDS = function (entityType, entityName, routeContext) {
  let ds
  if (entityType == 'window')
    ds = manager.lookup({
      datasourceName: entityName
    })
  else if (entityType == 'windowInput')
    ds = windowParam.getInput({
      code: entityName
    })
  else if (entityType == 'windowOutput')
    ds = windowParam.getOutput({
      code: entityName
    })
  else if (entityType == 'ruleSetInput')
    ds = routeContext.getInputParam(entityName)
  else if (entityType == 'ruleSetOutput')
    ds = routeContext.getOutPutParam(entityName)
  else if (entityType == 'ruleSetVar') ds = routeContext.getVariable(entityName)
  else if (entityType == 'REPORT_ENTITY') ds = getReportEntityDS(entityName)

  if (undefined == ds)
    throw new Error('找不到类型为[' + entityType + ']的实体：' + entityName)
  return ds
}

let getReportEntity = function (rptEntityName) {
  let destObj
  let scope = scopeManager.getScope()
  let entities = scope.get('Report@@Entity')
  if (entities) {
    destObj = entities[rptEntityName]
  }
  return destObj
}

let getReportEntityDS = function (rptEntityName) {
  let freeDB
  let rptEntity = getReportEntity(rptEntityName)
  if (rptEntity) {
    let fieldsMapping = []
    let fieldNames = Object.keys(rptEntity)
    for (let i = 0; i < fieldNames.length; i++) {
      let code = fieldNames[i]
      let type = 'char'
      fieldsMapping.push({
        code: code,
        type: type
      })
    }

    let freeDBMeDate = {
      model: [
        {
          datasource: rptEntityName,
          fields: fieldsMapping
        }
      ]
    }

    let entities = []
    entities.push(rptEntity)
    let freeDBParams = {
      datas: {
        values: entities
      },
      metadata: freeDBMeDate
    }
    freeDB = datasourceFactory.unSerialize(freeDBParams)
  }
  return freeDB
}

let updateReportEntity = function (fieldObj, srcVal, rptEntityName) {
  let srcObj = srcVal.getCurrentRecord()
  if (!srcObj) {
    let records = srcVal.getAllRecords()
    if (records && records.size > 0) {
      srcObj = records[0]
    }
  }
  if (srcObj) {
    let mappings = fieldObj['entityFieldMapping']
    if (mappings && mappings.size() > 0) {
      let destObj = getReportEntity(rptEntityName)
      if (destObj) {
        for (let i = 0; i < mappings.size(); i++) {
          let mapping = mappings[i]
          let destFieldName = mapping['destFieldName']
          destObj[destFieldName] = srcObj.get(destFieldName)
        }

        //修改状态
        let statValue = destObj['I_N_P_U_T_S_T_A_T_E']
        if (statValue != 'Add') {
          destObj['I_N_P_U_T_S_T_A_T_E'] = 'Edit'
        }
      }
    }
  }
}

export { main }
