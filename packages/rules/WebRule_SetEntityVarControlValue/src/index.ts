import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
/**
 *  给界面实体/控件/变量赋值
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

const vds = {
  ds,
  exception,
  expression,
  string,
  component,
  window,
  log,
  widget
}

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      let inParams = ruleContext.getVplatformInput()
      if (!inParams) {
        //建议兼容
        inParams = ''
      }
      const fieldMap = inParams['FieldMap']
      if (!fieldMap || fieldMap.length <= 0) {
        vds.log.warn('没有配置任何字段映射信息，无法进行赋值')
        resolve()
        return
      }
      setTargetValue(fieldMap, ruleContext)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
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

/**
 * 对目标值进行设置
 * @param fieldMap 字段映射信息
 */
const setTargetValue = function (fieldMap, ruleContext) {
  const methodContext = ruleContext.getMethodContext()
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
    const srcVal = getSourceValue(sourceType, source, fieldObj, ruleContext)
    switch (targetType + '') {
      case VAR_TYPE.TARGET_SYS_VAR:
        vds.component.setVariant(target, srcVal)
        break
      case VAR_TYPE.TARGET_CONTROL:
        if (target.indexOf('.') == -1) {
          // 目标不存在.表示为单值控件
          //兼容一些不是没有绑定数据库的控件，如：检索控件
          vds.widget.execute(target, 'setValue', [srcVal])
        } else {
          // 目标存在.表示为多值控件
          const widgetId = target.split('.')[0]
          const propertyCode = target.split('.')[1]
          vds.widget.execute(widgetId, 'set' + propertyCode, [srcVal])
        }
        break
      case VAR_TYPE.TARGET_COM_VAR:
        vds.window.setInput(target, srcVal)
        break
      case VAR_TYPE.TARGET_ENTITY:
        const dest = target.split('.')
        const dsName = dest[0]
        if (entityInfos[dsName]) {
          const columnInfos = entityInfos[dsName]
          columnInfos[dest[1]] = srcVal
        } else {
          const field_value = {}
          field_value[dest[1]] = srcVal
          entityInfos[dsName] = field_value
        }
        break
      case VAR_TYPE.TARGET_CONTEXT_VAR:
        // 给当前方法上下文变量赋值
        methodContext.setVariable(target, srcVal)
        break
      case VAR_TYPE.TARGET_OUTPUT_VAR:
        // 给当前方法输出变量赋值
        methodContext.setOutput(target, srcVal)
        break
      case VAR_TYPE.TARGET_WINDOW_OUTPUT_VAR:
        // 给当前窗体输出变量赋值
        vds.window.setOutput(target, srcVal)
        break
      case VAR_TYPE.TARGET_WINDOW_INPUT_VAR:
        // 给当前窗体输入变量赋值
        vds.window.setInput(target, srcVal)
        break
      case VAR_TYPE.TARGET_REPORT_ENTITY:
        updateReportEntity(fieldObj, srcVal, target)
        break
      default:
        vds.log.error('无效的目标类型：' + targetType)
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
    const datasource = vds.ds.lookup(entityName)
    const records = datasource.getAllRecords()
    if (
      records == null ||
      records == undefined ||
      records.toArray().length == 0
    ) {
      vds.log.warn('目标实体没有数据，无法进行赋值')
      continue
    }

    const record = datasource.getCurrentRecord()
    if (!record) {
      vds.log.warn('目标实体没有当前行数据，无法进行赋值')
      continue
    }
    const fieldInfos = entityInfos[entityName]
    for (const field in fieldInfos) {
      const value = fieldInfos[field]
      record.set(field, value)
    }
    datasource.updateRecords([record])
  }
}

/**
 * 按照来源类型，获取来源的值
 */
const getSourceValue = function (sourceType, source, fieldObj, ruleContext) {
  let value = null
  const routeContext = ruleContext.getMethodContext()
  switch (sourceType + '') {
    case 'expression':
      value = vds.expression.execute(source, {
        expression: source,
        ruleContext: ruleContext
      })
      break
    case 'entityField':
      source = getFreeDBSourceDBName(fieldObj)
      const fieldsMapping = getFreeDBFieldsMapping(fieldObj)
      const freeDB = vds.ds.unSerialize(fieldsMapping)
      // 处理来源实体来自方法变量、窗体输入输出
      const srcDB = _getEntityDS(
        fieldObj.SourceEntityType,
        source,
        routeContext
      )
      //实体间数据拷贝
      const copyFieldsMapping = getFreeDBCopyFieldsMapping(fieldObj)
      const paramDB = copyBetweenEntities({
        sourceEntity: srcDB,
        destEntity: freeDB,
        valuesMapping: copyFieldsMapping,
        dataFilterType: 'all',
        ruleContext: ruleContext
      })
      value = paramDB
      break
    default:
      vds.log.warn('无效的来源值类型：' + sourceType)
      break
  }
  return value
}
const copyBetweenEntities = function (params: any) {
  const srcEntity = params.sourceEntity,
    destEntity = params.destEntity,
    valuesMapping = params.valuesMapping,
    dataFilterType = params.dataFilterType,
    ruleContext = params.ruleContext
  const dataValues = []
  //得到源实体所有记录
  const srcAllRecords = getRecords(srcEntity, dataFilterType)
  //根据值映射信息将记录载入目标实体
  for (let i = 0; i < srcAllRecords.length; i++) {
    const curRecord = srcAllRecords[i]
    const paramValueObj: any = {}
    let isExistValue = false
    for (let j = 0; j < valuesMapping.length; j++) {
      const mapping = valuesMapping[j]
      const paramEntityField = mapping['paramEntityField']
      const fieldValueType = mapping['fieldValueType']
      const fieldValue = mapping['fieldValue']
      if (curRecord != null) {
        isExistValue = true
        //字段值类型为前台实体字段时
        if (fieldValueType == 'field') {
          paramValueObj[paramEntityField] = curRecord.get(fieldValue)
        } else {
          //表达式类型
          paramValueObj[paramEntityField] = vds.expression.execute(fieldValue, {
            ruleContext: ruleContext
          })
        }
      }
    }
    // 如果记录没有ID的情况下，补充UUID
    if (isExistValue) {
      if (typeof paramValueObj.id == 'undefined' || null == paramValueObj.id) {
        paramValueObj.id = vds.string.uuid()
      }
      dataValues.push(paramValueObj)
    }
  }
  destEntity.loadRecords(dataValues)
  return destEntity
}

const getRecords = function (ds: any, dataFilterType: string) {
  let records
  if (dataFilterType == 'all') {
    records = ds.getAllRecords().toArray()
  } else {
    let inserted = ds.getInsertedRecords().toArray()
    let updated = ds.getUpdatedRecords().toArray()
    records = inserted.concat(updated)
  }
  return records
}
/**
 * TODO:由于目前配置信息中没有来源实体的名称，所以必须从字段配置中获取
 */
const getFreeDBSourceDBName = function (fieldObj: any) {
  if (fieldObj['entityFieldMapping'][0]['srcValue'] == 'entityField') {
    const firstFieldConfig = fieldObj['entityFieldMapping'][0]['srcValue']
    return firstFieldConfig.split('.')[0]
  } else {
    return fieldObj.Source
  }
}

const getFreeDBFieldsMapping = function (fieldObj: any) {
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

const getFreeDBCopyFieldsMapping = function (fieldObj: any) {
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
const _getEntityDS = function (
  entityType: string,
  entityName: string,
  methodContext: any
) {
  let ds
  let errMsg = ''
  if (entityType == 'window') {
    ds = vds.ds.lookup(entityName)
  } else if (entityType == 'windowInput') {
    ds = vds.window.getInput(entityName)
    errMsg = '窗体输入'
  } else if (entityType == 'windowOutput') {
    ds = vds.window.getOutput(entityName)
    errMsg = '窗体输出'
  } else if (entityType == 'ruleSetInput') {
    ds = methodContext.getInput(entityName)
    errMsg = '方法输入'
  } else if (entityType == 'ruleSetOutput') {
    ds = methodContext.getOutput(entityName)
    errMsg = '方法输出'
  } else if (entityType == 'ruleSetVar') {
    ds = methodContext.getVariable(entityName)
    errMsg = '方法变量'
  } else if (entityType == 'REPORT_ENTITY') {
    ds = getReportEntityDS(entityName)
    errMsg = ''
  }
  if (undefined == ds)
    throw vds.exception.newConfigException(
      errMsg + '实体【' + entityName + '】不存在，请检查配置'
    )
  return ds
}

const getReportEntity = function (rptEntityName: string) {
  let destObj
  const entities = vds.window.get('Report@@Entity')
  if (entities) {
    destObj = entities[rptEntityName]
  }
  return destObj
}

const getReportEntityDS = function (rptEntityName: string) {
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
    const entities = []
    entities.push(rptEntity)
    freeDB = vds.ds.unSerialize(fieldsMapping, {
      datas: entities,
      dsCode: rptEntityName
    })
  }
  return freeDB
}

const updateReportEntity = function (
  fieldObj: any,
  srcVal: any,
  rptEntityName: any
) {
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

export { main }
