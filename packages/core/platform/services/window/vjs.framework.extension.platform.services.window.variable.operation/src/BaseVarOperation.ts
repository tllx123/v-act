/**
 * 给基本变量复制
 * vjs名称:	vjs.framework.extension.platform.services.window.variable.operation
 * vjs服务:	vjs.framework.extension.platform.services.window.BaseVarOperation
 */

import { StoreTypes as storeTypes } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourcePusher as pusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import {
  ComponentParam as componentParam,
  WindowParam as windowParam
} from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

/**
 * 变量类型
 * */
const VAR_TYPE = {
  TARGET_SYS_VAR: '0', //系统变量
  TARGET_CONTROL: '1', //控件
  TARGET_COM_VAR: '2', //组件变量
  TARGET_ENTITY: '3', //实体字段
  TARGET_CONTEXT_VAR: '4', //活动集上下文变量
  TARGET_OUTPUT_VAR: '5', //活动集输出变量
  TARGET_WINDOW_OUTPUT_VAR: '6', //窗体输出变量
  TARGET_REPORT_ENTITY: '7', //报表实体
  TARGET_WINDOW_INPUT_VAR: '8' //窗体输入
}

const VALUE_SOURCE_TYPE = {
  //值来源类型
  EXPRESSION: 'expression', //表达式
  ENTITYFIELD: 'entityField' //实体字段
}
export { VALUE_SOURCE_TYPE, VAR_TYPE }

/**
 * 给变量赋值
 * @param	params			赋值映射信息
 * [{
 * 		TargetType			{String}	建议使用VarType的枚举值
 * 		Target				{String}	目标变量名称//不用带前缀
 * 		SourceType			{String}	来源类型：expression（表达式）、entityField（实体字段）建议使用VALUE_SOURCE_TYPE
 * 		SourceEntityType	{String}	来源实体的类型，值前提：SourceType为entityField
 * 		Source				{String}	表达式/实体编码
 * 		entityFieldMapping	{Array}		实体字段映射，值前提：SourceType为entityField
 * 			[{
 * 				destFieldName	{String}	目标实体字段
 * 				srcValueType	{String}	来源值类型：expression（表达式）、entityField（实体字段）
 * 				srcValue		{String}	来源值，表达式或实体字段（实体字段格式：来源实体.字段名）
 * 			},...]
 * },...]
 * @param	routeContext	路由上下文//从规则上下文可取：ruleContext.getRouteContext()，若无规则上下文，则可为空
 * */
export function setVariableValue(params, routeContext) {
  if (!params || params.length < 1) {
    return
  }
  setTargetValue(params, routeContext)
}

/**
 * 对目标值进行设置
 * @param fieldMap 字段映射信息
 */
const setTargetValue = function (fieldMap, routeContext) {
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
    const fieldObj = fieldMap[i]
    const targetType = fieldObj['TargetType']
    const target = fieldObj['Target']
    const sourceType = fieldObj['SourceType']
    const source = fieldObj['Source']
    //如果当前表达式中有使用到前面赋值过的实体字段，则先把之前的数据更新，再去获取值。
    entityInfos = updatePreEntityData(source, entityInfos)
    const srcVal = getSourceValue(sourceType, source, fieldObj, routeContext)
    switch (targetType + '') {
      case exports.VAR_TYPE.TARGET_SYS_VAR:
        componentParam.setVariant({
          code: target,
          value: srcVal
        })
        break
      case exports.VAR_TYPE.TARGET_CONTROL:
        if (target.indexOf('.') == -1) {
          // 目标不存在.表示为单值控件
          //						widgetDatasource.setSingleValue(target, srcVal);
          //兼容一些不是没有绑定数据库的控件，如：检索控件
          widgetProperty.set(target, 'Value', srcVal)
        } else {
          // 目标存在.表示为多值控件
          const widgetId = target.split('.')[0]
          const propertyCode = target.split('.')[1]
          widgetProperty.set(widgetId, propertyCode, srcVal)
        }
        break
      case exports.VAR_TYPE.TARGET_COM_VAR:
        windowParam.setInput({
          code: target,
          value: srcVal
        })
        break
      case exports.VAR_TYPE.TARGET_ENTITY:
        const dest = target.split('.')
        const dsName = dest[0]
        /*const datasource = manager.lookup({
						"datasourceName": dsName
					});
					const records = datasource.getAllRecords();
					if (records == null || records == undefined || records.toArray().length == 0) {
						log.warn("目标实体没有数据，无法进行赋值");
						break;
					}

					const record = datasource.getCurrentRecord();
					if (!record) {
						log.warn("目标实体没有当前数据，无法进行赋值");
						break;
					}
					setEntityVal(dsName, dest[1], srcVal);*/
        if (entityInfos[dsName]) {
          const columnInfos = entityInfos[dsName]
          columnInfos[dest[1]] = srcVal
        } else {
          const field_value = {}
          field_value[dest[1]] = srcVal
          entityInfos[dsName] = field_value
        }
        break
      case exports.VAR_TYPE.TARGET_CONTEXT_VAR:
        // 给当前活动集上下文变量赋值
        routeContext.setVariable(target, srcVal)
        break
      case exports.VAR_TYPE.TARGET_OUTPUT_VAR:
        // 给当前活动集输出变量赋值
        routeContext.setOutputParam(target, srcVal)
        break
      case exports.VAR_TYPE.TARGET_WINDOW_OUTPUT_VAR:
        // 给当前窗体输出变量赋值
        windowParam.setOutput({
          code: target,
          value: srcVal
        })
        break
      case exports.VAR_TYPE.TARGET_WINDOW_INPUT_VAR:
        // 给当前窗体输入变量赋值
        windowParam.setInput({
          code: target,
          value: srcVal
        })
        break
      case exports.VAR_TYPE.TARGET_REPORT_ENTITY:
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
const updatePreEntityData = function (sVal, entityInfos) {
  const newEntityInfo = {}
  for (const entity in entityInfos) {
    const fields = entityInfos[entity]
    if (fields) {
      for (const field in fields) {
        const value = '[' + entity + '].[' + field + ']'
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
const setEntityValue = function (entityInfos) {
  for (const key in entityInfos) {
    const entityName = key
    const datasource = manager.lookup({
      datasourceName: entityName
    })
    const records = datasource.getAllRecords()
    if (
      records == null ||
      records == undefined ||
      records.toArray().length == 0
    ) {
      log.warn('目标实体没有数据，无法进行赋值')
      continue
    }

    const record = datasource.getCurrentRecord()
    if (!record) {
      log.warn('目标实体没有当前行数据，无法进行赋值')
      continue
    }
    const fieldInfos = entityInfos[entityName]
    for (const field in fieldInfos) {
      const value = fieldInfos[field]
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
const setEntityVal = function (dsName, destFieldName, srcVal) {
  const refWidgetIds = windowVMManager.getWidgetCodesByDatasourceName({
    datasourceName: dsName
  })
  let flag = true
  for (let index = 0; index < refWidgetIds.length; index++) {
    const retWidgetId = refWidgetIds[index]
    const widgetType = widgetContext.get(retWidgetId, 'widgetType')
    const storeType = widgetContext.getStoreType(retWidgetId)
    if (storeType == storeTypes.SET) {
      const datasource = manager.lookup({
        datasourceName: dsName
      })
      const record = datasource.getCurrentRecord()
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
      const mappingInfo = windowVMManager.getFieldCodesByWidgetCode({
        widgetCode: retWidgetId
      })
      if (mappingInfo['mappingItems'] != undefined) {
        const mappingItems = mappingInfo.mappingItems
        for (let i = 0; i < mappingItems.length; i++) {
          const mappingItem = mappingItems[i]
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
      const mappingInfo = windowVMManager.getFieldCodesByWidgetCode({
        widgetCode: retWidgetId
      })
      if (mappingInfo['mappingItems'] != undefined) {
        const mappingItems = mappingInfo.mappingItems
        for (let i = 0; i < mappingItems.length; i++) {
          const mappingItem = mappingItems[i]
          if (mappingItem['refField'] == destFieldName) {
            flag = false
            const obj = {}
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
const getSourceValue = function (sourceType, source, fieldObj, routeContext) {
  let value = null
  switch (sourceType + '') {
    case 'expression':
      const context = new ExpressionContext()
      context.setRouteContext(routeContext)
      value = engine.execute({
        expression: source,
        context: context
      })
      break
    case 'entityField':
      source = getFreeDBSourceDBName(fieldObj)
      const freeDBName = 'freeDB_' + uuid.generate()
      const fieldsMapping = getFreeDBFieldsMapping(fieldObj)
      const freeDBMeDate = {
        model: [
          {
            datasource: freeDBName,
            fields: fieldsMapping
          }
        ]
      }
      const freeDBParams = {
        datas: null,
        metadata: freeDBMeDate
      }
      const freeDB = datasourceFactory.unSerialize(freeDBParams)
      // 处理来源实体来自方法变量、窗体输入输出
      const srcDB = _getEntityDS(
        fieldObj.SourceEntityType,
        source,
        routeContext
      )
      //实体间数据拷贝
      const copyFieldsMapping = getFreeDBCopyFieldsMapping(fieldObj)
      const paramDB = pusher.copyBetweenEntities({
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
const getFreeDBSourceDBName = function (fieldObj) {
  if (fieldObj['entityFieldMapping'][0]['srcValue'] == 'entityField') {
    const firstFieldConfig = fieldObj['entityFieldMapping'][0]['srcValue']
    return firstFieldConfig.split('.')[0]
  } else {
    return fieldObj.Source
  }
}

/**
 * 按照变量类型及变量编号获取实体变量的字段定义信息
 * @param variableType 变量类型(窗体变量:windowVariant,窗体输出变量:windowOutput,活动集输入变量:ruleSetInput,活动集上下文变量:ruleSetVariant,活动集输出变量:ruleSetOutput)
 */
const getEntityVariableColumnConfig = function (variableType, variableCode) {
  if (windowVariant == 'windowVariant') {
    // 窗体输入变量
    const variableConfig = windowParam.getInput({
      code: variableCode
    })
    return variableConfig.configs
  } else if (windowVariant == 'windowOutput') {
    // 窗体输出变量
    const variableConfig = windowParam.getInput({
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

const getFreeDBFieldsMapping = function (fieldObj) {
  const configFieldsMapping = fieldObj['entityFieldMapping']
  const fieldsMapping = []
  for (let i = 0; i < configFieldsMapping.length; i++) {
    const configField = configFieldsMapping[i]
    const code = configField.destFieldName
    const type = 'char' //目前没有取值的来源，只能认为都是char
    fieldsMapping.push({
      code: code,
      type: type
    })
  }
  return fieldsMapping
}

const getFreeDBCopyFieldsMapping = function (fieldObj) {
  const configFieldsMapping = fieldObj['entityFieldMapping']
  const copyFieldsMapping = []
  for (let i = 0; i < configFieldsMapping.length; i++) {
    const configField = configFieldsMapping[i]
    const paramEntityField = configField.destFieldName
    const fieldValueType =
      configField.srcValueType == 'expression' ? 'expression' : 'field'
    const _srcValueItems = configField.srcValue.split('.')
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
const _getEntityDS = function (entityType, entityName, routeContext) {
  let ds
  let errMsg = ''
  if (entityType == 'window') {
    ds = manager.lookup({
      datasourceName: entityName
    })
  } else if (entityType == 'windowInput') {
    ds = windowParam.getInput({
      code: entityName
    })
    errMsg = '窗体输入'
  } else if (entityType == 'windowOutput') {
    ds = windowParam.getOutput({
      code: entityName
    })
    errMsg = '窗体输出'
  } else if (entityType == 'ruleSetInput') {
    ds = routeContext.getInputParam(entityName)
    errMsg = '方法输入'
  } else if (entityType == 'ruleSetOutput') {
    ds = routeContext.getOutPutParam(entityName)
    errMsg = '方法输出'
  } else if (entityType == 'ruleSetVar') {
    ds = routeContext.getVariable(entityName)
    errMsg = '方法变量'
  } else if (entityType == 'REPORT_ENTITY') {
    ds = getReportEntityDS(entityName)
    errMsg = ''
  }
  if (undefined == ds)
    throw new Error(
      errMsg + '实体【' + entityName + '】不存在，请检查配置',
      undefined,
      undefined,
      exceptionFactory.TYPES.Config
    )
  return ds
}

const getReportEntity = function (rptEntityName) {
  let destObj
  const scope = scopeManager.getScope()
  const entities = scope.get('Report@@Entity')
  if (entities) {
    destObj = entities[rptEntityName]
  }
  return destObj
}

const getReportEntityDS = function (rptEntityName) {
  let freeDB
  const rptEntity = getReportEntity(rptEntityName)
  if (rptEntity) {
    const fieldsMapping = []
    const fieldNames = Object.keys(rptEntity)
    for (let i = 0; i < fieldNames.length; i++) {
      const code = fieldNames[i]
      const type = 'char'
      fieldsMapping.push({
        code: code,
        type: type
      })
    }

    const freeDBMeDate = {
      model: [
        {
          datasource: rptEntityName,
          fields: fieldsMapping
        }
      ]
    }

    const entities = []
    entities.push(rptEntity)
    const freeDBParams = {
      datas: {
        values: entities
      },
      metadata: freeDBMeDate
    }
    freeDB = datasourceFactory.unSerialize(freeDBParams)
  }
  return freeDB
}

const updateReportEntity = function (fieldObj, srcVal, rptEntityName) {
  let srcObj = srcVal.getCurrentRecord()
  if (!srcObj) {
    const records = srcVal.getAllRecords()
    if (records && records.size > 0) {
      srcObj = records[0]
    }
  }
  if (srcObj) {
    const mappings = fieldObj['entityFieldMapping']
    if (mappings && mappings.size() > 0) {
      const destObj = getReportEntity(rptEntityName)
      if (destObj) {
        for (let i = 0; i < mappings.size(); i++) {
          const mapping = mappings[i]
          const destFieldName = mapping['destFieldName']
          destObj[destFieldName] = srcObj.get(destFieldName)
        }

        //修改状态
        const statValue = destObj['I_N_P_U_T_S_T_A_T_E']
        if (statValue != 'Add') {
          destObj['I_N_P_U_T_S_T_A_T_E'] = 'Edit'
        }
      }
    }
  }
}
