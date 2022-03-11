/**
 * 前后台唯一性检查
 */

import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'

const vds = { ds, object, rpc, string, widget }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      let ruleConfig = ruleContext.getVplatformInput()
      let isBackgroudCheck = ruleConfig.isBackgroudCheck
      let entityName = ruleConfig.entityName
      let checkFields = ruleConfig.checkFields
      let isAutoSelectRepeatRow = ruleConfig.isAutoSelectRepeatRow
      // 前台检查
      let isRepeat = checkEntityUnique(
        entityName,
        checkFields,
        isAutoSelectRepeatRow
      )
      // 后台检查
      // 如果前台已经检查出重复，则不需要再检查后台
      if (isBackgroudCheck == true && isRepeat == false) {
        let tableName = ruleConfig.tableName
        let dsWhere = ruleConfig.dsWhere
        checkTableUnique(
          entityName,
          tableName,
          checkFields,
          dsWhere,
          isAutoSelectRepeatRow,
          ruleContext,
          resolve,
          reject
        )
      } else {
        setResult(ruleContext, isRepeat, resolve)
      }
    } catch (ex) {
      reject(ex)
    }
  })
}

/** 设置规则返回值 */
let setResult = function (
  ruleContext: RuleContext,
  isRepeat: boolean,
  resolve: Function
) {
  if (ruleContext.setResult) {
    ruleContext.setResult('isUnique', !isRepeat)
  }
  resolve()
}

/** 检查前台实体是否有重复数据 */
let checkEntityUnique = function (
  entityName: string,
  checkFields: Array<Record<string, any>>,
  isAutoSelectRepeatRow: boolean
) {
  let isRepeat = false
  let datasource = vds.ds.lookup(entityName)
  let records = datasource.getAllRecords().toArray()
  let needRecord = []
  let recordIndex = 0
  let recordMap: Record<string, any> = {} //保存检查字段的数据
  let checkFieldArray = [] //保存所有检查字段
  //将所有检查字段放进Map，所有检查字段对应的一个数组，数组存放该字段的所有数据
  for (let j = 0; j < checkFields.length; j++) {
    let checkField = checkFields[j].entityFiled
    checkField = getFieldCode(checkField)
    recordMap[checkField] = []
    checkFieldArray[j] = checkField
  }
  let fieldRecord: Record<string, any> = {} //第一次出现的记录集合
  let NeedFirstRecord = [] //存放重复的，并且是第一次的记录
  let sureRepeatRecord = []
  let data_record: Record<string, any> = {}
  let isSave
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    //保存当前记录的检查字段数据到Map中
    let markField = ''
    for (let j = 0; j < checkFieldArray.length; j++) {
      isSave = false
      // 获取并转换字段值，将字段值存入缓存字符串中
      let checkField = checkFieldArray[j]
      let fieldValue = record.get(checkField)
      markField = markField + checkField + '=' + fieldValue + ','
    }
    if (sureRepeatRecord.indexOf(markField) != -1) {
      //在确定重复的字段里出现，就代表之前已经有重复过的
      isSave = true
    } else {
      if (null != data_record[markField]) {
        //表示该记录不是第一次出现
        isSave = true
        //第一次记录，还没刷掉时候
        if (fieldRecord[markField] != null) {
          NeedFirstRecord[NeedFirstRecord.length] = fieldRecord[markField]
        }
        fieldRecord[markField] = null //刷掉第一次记录
        if (sureRepeatRecord.indexOf(markField) == -1) {
          sureRepeatRecord[sureRepeatRecord.length] = markField
        }
      } else {
        data_record[markField] = record //添加一次记录
        fieldRecord[markField] = record //标识第一次出现
      }
    }
    if (isSave) {
      needRecord[recordIndex] = record
      recordIndex++
      isRepeat = true
    }
  }
  //添加第一次出现，但重复的记录
  for (let i = 0; i < NeedFirstRecord.length; i++) {
    needRecord[recordIndex] = NeedFirstRecord[i]
    recordIndex++
  }
  if (
    isRepeat == true &&
    isAutoSelectRepeatRow == true &&
    needRecord != null &&
    needRecord.length > 0
  ) {
    datasource.setCurrentRecord(needRecord[needRecord.length - 1])
    datasource.selectRecords(needRecord)
  }
  return isRepeat
}

/** 检查后台表是否有重复数据 */
let checkTableUnique = function (
  entityName: string,
  tableName: string,
  checkFields: Array<Record<string, any>>,
  dsWhere: any,
  isAutoSelectRepeatRow: boolean,
  ruleContext: RuleContext,
  resolve: Function,
  reject: Function
) {
  let isRepeat = false
  let wrParam = {
    type: vds.ds.WhereType.Table,
    methodContext: ruleContext.getMethodContext()
  }
  // 组装查询条件
  let where = vds.ds.createWhere(wrParam)

  let filterCondition: Record<string, any> = {}
  let datasource = vds.ds.lookup(entityName)
  let entityRecords = datasource.getAllRecords().toArray()
  if (entityRecords.length === 0) {
    setResult(ruleContext, isRepeat, resolve)
    return false
  }

  let fieldType: Record<string, any> = {}
  let fields = datasource.getMetadata().getFields()
  for (let i = 0; i < fields.length; i++) {
    fieldType[fields[i].getCode()] = fields[i].getType()
  }

  let tmpCondition: Record<string, any> = {}
  for (let _ii = 0; _ii < checkFields.length; _ii++) {
    let checkField = checkFields[_ii].tableField
    checkField = getFieldCode(checkField)
    tmpCondition[checkField] = []
  }

  for (let i = 0; i < entityRecords.length; i++) {
    let record = entityRecords[i]
    let andEqConds = []
    for (let t = 0; t < checkFields.length; t++) {
      let checkField = checkFields[t].tableField
      checkField = getFieldCode(checkField)
      filterCondition[checkField] = ''
      let fieldValue = record.get(checkField)

      // 移除 null
      if (null === fieldValue) continue

      let single_condition = tmpCondition[checkField]
      single_condition.push(fieldValue)
    }
  }

  let newTmpCondition: Record<string, any> = {}
  for (let _tmpCond in tmpCondition) {
    let _conditionVal = tmpCondition[_tmpCond]
    if (_conditionVal && _conditionVal.length !== 0)
      newTmpCondition[_tmpCond] = _conditionVal
  }

  // 检查判断是否前台实体所需检查条件不存在
  if ('{}' === JSON.stringify(newTmpCondition)) {
    setResult(ruleContext, isRepeat, resolve)
    return false
  }

  tmpCondition = newTmpCondition

  let andEqConds: Array<Record<string, any>> = []
  for (let i = 0; i < checkFields.length; i++) {
    let checkField = getFieldCode(checkFields[i].tableField)
    let value = tmpCondition[checkField]
    if (value && value.length > 0) {
      value = value.join(',')
      andEqConds = getCondition(
        checkField,
        value,
        fieldType[checkField],
        'in',
        andEqConds
      )
    }
  }

  where.addCondition(andEqConds)

  // 获取前台db变动记录，如果前台记录被删除，则不会再作重复比较
  let entityChangedRecords: Array<Record<string, any>> = []
  let entityDeletedRecords: Array<Record<string, any>> = []
  //删除记录
  let deleteRecords = datasource.getDeletedRecords()
  deleteRecords.iterate(function (record: Record<string, any>, num: number) {
    entityDeletedRecords.push(record)
  })
  //新增记录
  let insertRecords = datasource.getInsertedRecords()
  insertRecords.iterate(function (record: Record<string, any>, num: number) {
    entityChangedRecords.push(record)
  })
  //更新的记录
  let updateRecords = datasource.getUpdatedRecords()
  updateRecords.iterate(function (record: Record<string, any>, num: number) {
    entityChangedRecords.push(record)
  })

  let tmpNullIn = []
  for (let i = 0; i < entityDeletedRecords.length; i++) {
    let deleteRecord = entityDeletedRecords[i]
    let idValue = deleteRecord.getSysId()
    if (tmpNullIn.indexOf(idValue) == -1) {
      tmpNullIn.push(idValue)
    }
  }
  for (let i = 0; i < entityRecords.length; i++) {
    let record = entityRecords[i]
    let idValue = record.getSysId()
    if (tmpNullIn.indexOf(idValue) == -1) {
      tmpNullIn.push(idValue)
    }
  }

  if (undefined != dsWhere && null != dsWhere && dsWhere.length > 0)
    where.addCondition(dsWhere)

  //检测后台表记录
  getTableRecords(
    tableName,
    where,
    tmpNullIn,
    isAutoSelectRepeatRow,
    filterCondition,
    datasource,
    ruleContext,
    resolve,
    reject
  )
}

/** 拼装条件 */
let getCondition = function (
  field: string,
  value: any,
  fieldType: string,
  operation: string,
  allCondition: Array<Record<string, any>>
) {
  let logicOperation = null
  if (allCondition.length > 0) {
    logicOperation = 'and'
  }
  let singleCondition: Record<string, any> = {}
  singleCondition['columnType'] = '1'
  singleCondition['field'] = field
  singleCondition['fieldType'] = fieldType
  singleCondition['leftBracket'] = '('
  singleCondition['logicOperation'] = logicOperation
  singleCondition['operation'] = operation
  singleCondition['rightBracket'] = ')'
  singleCondition['value'] = fieldType != 'boolean' ? '"' + value + '"' : value
  singleCondition['valueType'] = '9'
  allCondition.push(singleCondition)
  return allCondition
}

/** 检测后台表数据 */
let getTableRecords = function (
  tableName: string,
  whereRestrict: any,
  tmpNullIn: Array<string>,
  isAutoSelectRepeatRow: boolean,
  filterCondition: Record<string, any>,
  datasource: Record<string, any>,
  ruleContext: RuleContext,
  resolve: Function,
  reject: Function
) {
  let callback = function (resultData: Array<Record<string, any>>) {
    let isRepeat = false
    if (vds.object.isArray(resultData) && resultData.length > 0) {
      let ds = resultData[0]
      let records = ds.datas.values
      let tableRepeatRecords = handleOtherCondition(records, tmpNullIn)
      // 如果有查询到记录，则证明后台查询有重复
      if (
        undefined != tableRepeatRecords &&
        null != tableRepeatRecords &&
        tableRepeatRecords.length > 0
      ) {
        if (isAutoSelectRepeatRow == true) {
          let needRecord = []
          let recordIndex = 0
          let criteria
          for (let _a = 0; _a < tableRepeatRecords.length; _a++) {
            let rec = tableRepeatRecords[_a]
            if (rec) {
              criteria = vds.ds.createCriteria()
              for (let p in filterCondition) {
                let fieldValue = rec[p]
                criteria.eq(p, fieldValue)
              }
            }

            let repeateRecords = datasource.queryRecord(criteria).toArray()
            if (
              undefined != repeateRecords &&
              null != repeateRecords &&
              repeateRecords.length > 0
            ) {
              needRecord[recordIndex] = repeateRecords[0]
              recordIndex++
            }
          }
          datasource.selectRecords(needRecord)
        }
        isRepeat = true
        setResult(ruleContext, isRepeat, resolve)
      } else {
        setResult(ruleContext, isRepeat, resolve)
      }
    } else {
      setResult(ruleContext, isRepeat, resolve)
    }
  }

  vds.rpc.queryDataSync(tableName, 'table', null, null, {
    where: whereRestrict,
    pageConfig: {
      pageSize: -0,
      recordStart: 0
    },
    methodContext: ruleContext.getMethodContext(),
    CheckUnique: true,
    success: callback,
    fail: reject
  })
}

/** 处理字段映射条件 */
let handleOtherCondition = function (
  tableRecord: Array<Record<string, any>>,
  tmpNullIn: Array<string>
) {
  let resultRecord = []
  if (
    undefined != tableRecord &&
    null != tableRecord &&
    tableRecord.length > 0
  ) {
    for (let i = 0; i < tableRecord.length; i++) {
      let record = tableRecord[i]
      let recordId = tableRecord[i]['id']
      if (tmpNullIn.indexOf(recordId) == -1) {
        resultRecord.push(record)
      }
    }
  }
  return resultRecord
}

/** 获取字段编码 */
let getFieldCode = function (field: string) {
  if (field.indexOf('.') >= 0) {
    let fieldSplit = field.split('.')
    if (fieldSplit.length == 2) field = fieldSplit[1]
    else if (fieldSplit.length == 3) field = fieldSplit[2]
  }
  return field
}

export { main }
