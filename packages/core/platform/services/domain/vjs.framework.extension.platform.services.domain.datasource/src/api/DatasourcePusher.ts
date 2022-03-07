import {
  ExpressionContext,
  ExpressionEngine as expressionEngine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as dsManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { uuid as UUID } from '@v-act/vjs.framework.extension.util.uuid'

export function initModule(sb) {}

const removeAllRecords = function (params) {
  let dsName = params.datasourceName
  let datasource = dsManager.lookup({ datasourceName: dsName })
  let ids = []
  let rs = datasource.getAllRecords()
  rs.iterate(function (rd) {
    ids.push(rd.getSysId())
  })
  datasource.removeRecordByIds({ ids: ids })
}

const setFieldValue = function (params) {
  let dsName = params.datasourceName,
    code = params.fieldCode,
    val = params.value
  let datasource = dsManager.lookup({ datasourceName: dsName })
  let record = datasource.getCurrentRecord()
  if (!record) {
    record = datasource.createRecord()
    datasource.insertRecords({
      records: [record]
    })
  }
  record.set(code, val)
  datasource.updateRecords({ records: [record] })
}

const setValues = function (params) {
  let dsName = params.datasourceName,
    values = params.values
  let datasource = dsManager.lookup({ datasourceName: dsName })
  let record = datasource.getCurrentRecord()
  let exists = !!record
  record = exists ? record : datasource.createRecord()
  for (let field in values) {
    record.set(field, values[field])
  }
  if (exists) {
    datasource.updateRecords({ records: [record] })
  } else {
    datasource.insertRecords({ records: [record] })
  }
}

const copyBetweenEntities = function (params) {
  let srcEntity = params.sourceEntity,
    destEntity = params.destEntity,
    valuesMapping = params.valuesMapping,
    dataFilterType = params.dataFilterType,
    routeContext = params.routeContext
  let dataValues = []
  //得到源实体所有记录
  let srcAllRecords = getRecords(srcEntity, dataFilterType)
  //根据值映射信息将记录载入目标实体
  for (let i = 0; i < srcAllRecords.length; i++) {
    let curRecord = srcAllRecords[i]
    let paramValueObj = {}
    let isExistValue = false
    for (let j = 0; j < valuesMapping.length; j++) {
      let mapping = valuesMapping[j]
      let paramEntityField = mapping['paramEntityField']
      let fieldValueType = mapping['fieldValueType']
      let fieldValue = mapping['fieldValue']
      if (curRecord != null) {
        isExistValue = true
        //字段值类型为前台实体字段时
        if (fieldValueType == 'field') {
          paramValueObj[paramEntityField] = curRecord.get(fieldValue)
        } else {
          //表达式类型
          paramValueObj[paramEntityField] = getExpValue(
            fieldValue,
            routeContext
          )
        }
      }
    }
    // 如果记录没有ID的情况下，补充UUID
    if (isExistValue) {
      if (typeof paramValueObj.id == 'undefined' || null == paramValueObj.id) {
        paramValueObj.id = UUID.generate()
      }
      dataValues.push(paramValueObj)
    }
  }
  destEntity.load({ datas: dataValues, isAppend: false })
  return destEntity
}

let getRecords = function (ds, dataFilterType) {
  let records
  if (dataFilterType == 'all') {
    records = ds.getAllRecords().toArray()
  } else {
    inserted = ds.getInsertedRecords().toArray()
    updated = ds.getUpdatedRecords().toArray()
    records = inserted.concat(updated)
  }
  return records
}

let getExpValue = function (exp, routeContext) {
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  return expressionEngine.execute({ expression: exp, context: context })
}

const loadRecords = function (params) {
  let records = params.records
  if (records && records.length > 0) {
    let datas = []
    let isAppend = params.hasOwnProperty('isAppend') ? params.isAppend : false
    let datasource = dsManager.lookup({ datasourceName: params.datasourceName })
    for (let i = 0, l = records.length; i < l; i++) {
      datas.push(records[i].toMap())
    }
    datasource.load({
      datas: datas,
      isAppend: isAppend
    })
  }
}

export {
  copyBetweenEntities,
  createRecords,
  getFieldName,
  getSelectedAndCurrentRecords,
  hasChanged,
  loadRecords,
  removeAllRecords,
  setFieldValue,
  setValues
}
