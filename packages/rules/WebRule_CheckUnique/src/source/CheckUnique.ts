import { Criteria } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { WhereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { ArrayUtil } from '@v-act/vjs.framework.extension.util'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let sandBox
let undefined
exports.initModule = function (sBox) {
  sandBox = sBox
}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let ruleConfig = jsonUtil.json2obj(inParams)
  let isBackgroudCheck = ruleConfig.isBackgroudCheck
  let entityName = ruleConfig.entityName
  let checkFields = ruleConfig.checkFields
  let isAutoSelectRepeatRow = ruleConfig.isAutoSelectRepeatRow
  let repeatRecords = []

  let routeRuntime = ruleContext.getRouteContext()
  // 前台检查
  //      var isRepeat = _checkEntityUnique(entityName, checkFields, isAutoSelectRepeatRow);
  let isRepeat = _checkEntityUnique_other(
    entityName,
    checkFields,
    isAutoSelectRepeatRow
  )

  // 后台检查
  // 如果前台已经检查出重复，则不需要再检查后台
  if (isBackgroudCheck == true && isRepeat == false) {
    let tableName = ruleConfig.tableName
    let dsWhere = ruleConfig.dsWhere
    isRepeat = _checkTableUnique(
      entityName,
      tableName,
      checkFields,
      dsWhere,
      isAutoSelectRepeatRow,
      routeRuntime
    )
  }

  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isUnique: !isRepeat
    })
  }
}
let _checkMutilList = function (dataName) {
  let widgetId = windowVMManager.getWidgetCodesByDatasourceName({
    datasourceName: dataName
  })
  let type = widgetContext.getType(widgetId)
  if (
    'JGBizCodeTreeGrid' == type ||
    'JGBizCodeTreeView' == type ||
    'JGDataGrid' == type ||
    'JGTreeGrid' == type ||
    'JGTreeView' == type
  ) {
    let displayMode = widgetContext.get(widgetId, 'DisplayMode')
    if (displayMode) {
    }
  }
  return false
}
// 检查前台实体是否有重复数据
let _checkEntityUnique = function (
  entityName,
  checkFields,
  isAutoSelectRepeatRow
) {
  let isRepeat = false
  let recordObjectCache = {}
  let datasource = DatasourceManager.lookup({
    datasourceName: entityName
  })
  let records = datasource.getAllRecords().toArray()
  let needRecord = []
  let recordIndex = 0
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    let recordValueCache = ''
    for (let j = 0; j < checkFields.length; j++) {
      //              _checkMutilList();
      // 获取并转换字段值，将字段值存入缓存字符串中
      let checkField = checkFields[j].entityFiled
      checkField = _getFieldCode(checkField)
      let fieldValue = record.get(checkField)

      // 转换字段值，如：code="" 转换为>> code为空
      fieldValue = _convertFieldValue(fieldValue)
      // 如果同时检查多个字段，则把字段值用逗号拼装起来，如：id="123",code="abc"
      recordValueCache = _convertCacheValue(
        recordValueCache,
        checkField,
        fieldValue
      )
    }
    if (
      undefined != recordObjectCache[recordValueCache] ||
      null != recordObjectCache[recordValueCache]
    ) {
      // 如果是第一条找到的重复数据，则把重复行设置为当前行
      if (isRepeat == false && isAutoSelectRepeatRow == true) {
        //                  datasource.setCurrentRecord({
        //                      record: record
        //                  });
        needRecord[recordIndex] = record
        recordIndex++
      }
      isRepeat = true
      recordObjectCache[recordValueCache].push(record)
    } else {
      recordObjectCache[recordValueCache] = [record]
    }
  }
  let resultParam = {}
  resultParam['records'] = needRecord
  resultParam['isSelect'] = true
  datasource.selectRecords(resultParam)
  return isRepeat
}

// 检查前台实体是否有重复数据  2016-08-15 liangzc：更换处理逻辑
let _checkEntityUnique_other = function (
  entityName,
  checkFields,
  isAutoSelectRepeatRow
) {
  let isRepeat = false
  let recordObjectCache = {}
  let datasource = DatasourceManager.lookup({
    datasourceName: entityName
  })
  let records = datasource.getAllRecords().toArray()
  let needRecord = []
  let recordIndex = 0
  let recordMap = {} //保存检查字段的数据
  let checkFieldArray = [] //保存所有检查字段
  //将所有检查字段放进Map，所有检查字段对应的一个数组，数组存放该字段的所有数据
  for (let j = 0; j < checkFields.length; j++) {
    let checkField = checkFields[j].entityFiled
    checkField = _getFieldCode(checkField)
    recordMap[checkField] = []
    checkFieldArray[j] = checkField
  }
  let fieldRecord = {} //第一次出现的记录集合
  let NeedFirstRecord = [] //存放重复的，并且是第一次的记录
  let sureRepeatRecord = []
  let recordValueCache = ''
  let data_record = {}
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    //保存当前记录的检查字段数据到Map中
    let markField = ''
    for (let j = 0; j < checkFieldArray.length; j++) {
      let isSave = false
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
    let resultParam = {}
    resultParam['records'] = needRecord
    resultParam['isSelect'] = true
    datasource.setCurrentRecord({
      record: needRecord[needRecord.length - 1]
    })
    datasource.selectRecords(resultParam)
  }
  return isRepeat
}

// 检查后台表是否有重复数据
let _checkTableUnique = function (
  entityName,
  tableName,
  checkFields,
  dsWhere,
  isAutoSelectRepeatRow,
  routeRuntime
) {
  let isRepeat = false

  let wrParam = {
    fetchMode: 'table',
    routeContext: routeRuntime
  }
  // 组装查询条件
  let where = WhereRestrict.init(wrParam)

  let filterCondition = {}
  let datasource = DatasourceManager.lookup({
    datasourceName: entityName
  })
  let entityRecords = datasource.getAllRecords().toArray()
  if (entityRecords.length === 0) return false

  let fieldType = {}
  let fields = datasource.getMetadata().fields
  for (let i = 0; i < fields.length; i++) {
    fieldType[fields[i]['code']] = fields[i]['type']
  }

  let tmpCondition = {}
  for (let _ii = 0; _ii < checkFields.length; _ii++) {
    let checkField = checkFields[_ii].tableField
    checkField = _getFieldCode(checkField)
    tmpCondition[checkField] = []
  }
  for (let i = 0; i < entityRecords.length; i++) {
    let record = entityRecords[i]
    let andEqConds = []
    for (let t = 0; t < checkFields.length; t++) {
      let checkField = checkFields[t].tableField
      checkField = _getFieldCode(checkField)
      filterCondition[checkField] = ''
      let fieldValue = record.get(checkField)

      // 移除 null
      if (null === fieldValue) continue

      let single_condition = tmpCondition[checkField]
      single_condition.push(fieldValue)
    }
  }

  let newTmpCondition = {}
  for (let _tmpCond in tmpCondition) {
    let _conditionVal = tmpCondition[_tmpCond]
    if (_conditionVal && _conditionVal.length !== 0)
      newTmpCondition[_tmpCond] = _conditionVal
  }

  // 检查判断是否前台实体所需检查条件不存在
  if ('{}' === JSON.stringify(newTmpCondition)) return false

  tmpCondition = newTmpCondition

  let andEqConds = []
  for (let i = 0; i < checkFields.length; i++) {
    let checkField = _getFieldCode(checkFields[i].tableField)
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
  where.andExtraCondition(andEqConds, 'table')
  // 获取前台db变动记录，如果前台记录被删除，则不会再作重复比较
  let entityChangedRecords = []
  let entityDeletedRecords = []
  //删除记录
  let deleteRecords = datasource.getDeletedRecords()
  deleteRecords.iterate(function (record, num) {
    entityDeletedRecords.push(record)
  })
  //新增记录
  let insertRecords = datasource.getInsertedRecords()
  insertRecords.iterate(function (record, num) {
    entityChangedRecords.push(record)
  })
  //更新的记录
  let updateRecords = datasource.getUpdatedRecords()
  updateRecords.iterate(function (record, num) {
    entityChangedRecords.push(record)
  })

  let andWhereCons = []
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
  //      if(tmpNullIn && tmpNullIn.length > 0){
  //          tmpNullIn = tmpNullIn.join(",");
  //          andWhereCons = getCondition("id",tmpNullIn,fieldType["id"],"not in",andWhereCons);
  //          where.andExtraCondition(andWhereCons, "table");
  //      }

  if (undefined != dsWhere && null != dsWhere && dsWhere.length > 0)
    where.andExtraCondition(dsWhere, 'table')
  // 查询后台表记录
  let tableRepeatRecords = _getTableRecords(tableName, where)
  tableRepeatRecords = handleOtherCondition(
    tableRepeatRecords,
    tmpNullIn,
    checkFields
  )
  // 如果有查询到记录，则证明后台查询有重复
  if (
    undefined != tableRepeatRecords &&
    null != tableRepeatRecords &&
    tableRepeatRecords.length > 0
  ) {
    if (isRepeat == false && isAutoSelectRepeatRow == true) {
      let needRecord = []
      let recordIndex = 0
      for (let _a = 0; _a < tableRepeatRecords.length; _a++) {
        let rec = tableRepeatRecords[_a]
        if (rec) {
          let criteria = new Criteria()
          for (let p in filterCondition) {
            fieldValue = rec[p]
            criteria.eq(p, fieldValue)
          }
        }

        let repeateRecords = datasource
          .queryRecord({
            criteria: criteria
          })
          .toArray()
        if (
          undefined != repeateRecords &&
          null != repeateRecords &&
          repeateRecords.length > 0
        ) {
          needRecord[recordIndex] = repeateRecords[0]
          recordIndex++
          //                      datasource.setCurrentRecord({
          //                          record: repeateRecords[0]
          //                      });
        }
      }
      let resultParam = {}
      resultParam['records'] = needRecord
      resultParam['isSelect'] = true
      datasource.selectRecords(resultParam)
    }
    isRepeat = true
  }

  return isRepeat
}
/**
 * 处理字段映射条件
 * */
let handleOtherCondition = function (tableRecord, tmpNullIn, checkFields) {
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
      //              var flag = false;
      //              for(var _i = 0; _i<checkFields.length; _i++){
      //                  var checkField = checkFields[_i].tableField;
      //                  checkField = _getFieldCode(checkField);
      //                  var sourceValue = record[checkField];
      //                  if(!tmpCondition[checkField].contains(sourceValue)){
      //                      flag = true;
      //                      break;
      //                  }
      //              }
      //              if(!flag){
      //                  resultRecord.push(record);
      //              }
    }
  }
  return resultRecord
}
/**
 * 拼装条件
 * */
let getCondition = function (field, value, fieldType, operation, allCondition) {
  let logicOperation = null
  if (allCondition.length > 0) {
    logicOperation = 'and'
  }
  let singleCondition = {}
  singleCondition['columnType'] = '1'
  singleCondition['field'] = field
  singleCondition['fieldType'] = fieldType
  singleCondition['leftBracket'] = '('
  singleCondition['logicOperation'] = logicOperation
  singleCondition['operation'] = operation
  singleCondition['rightBracket'] = ')'
  //singleCondition["value"] = fieldType == "char" ? "\""+value+"\"":value;
  //不管类型，都加上双引号执行表达式
  //布尔类型不能加引号 liangzc 20180824
  //        singleCondition["value"] = "\"" + value + "\"";
  singleCondition['value'] = fieldType != 'boolean' ? '"' + value + '"' : value
  singleCondition['valueType'] = '9'
  allCondition.push(singleCondition)
  return allCondition
}
// 获取后台表数据
let _getTableRecords = function (tableName, whereRestrict) {
  let records = []
  let dataQuery = sandBox.getService(
    'vjs.framework.extension.platform.services.repository.query'
  )
  let queryParam = {
    CheckUnique: true,
    dataSourceName: tableName,
    whereRestrict: whereRestrict,
    queryRecordStart: 0,
    queryPageSize: -0,
    queryType: 'table'
  }

  // 2015-06-17 liangchaohui：配合SDK的修改作出修改
  dataQuery.query({
    queryParams: [queryParam],
    isAsync: false,
    success: function (resultData) {
      if (ArrayUtil.isArray(resultData) && resultData.length > 0) {
        let ds = resultData[0]
        records = ds.datas.values
      }
    }
  })
  return records
}

// 转换字段中的值
// 如果值为null或为空串，则作对应转换以便重复判断
let _convertFieldValue = function (value) {
  if ('null' == value) {
    value = '"null"'
  }
  if (value == null || value == '') {
    value = ''
  }
  if (
    value != null &&
    stringUtil.trim(value + '') == '' &&
    (value + '').length > 0
  ) {
    value = '"' + value + '"'
  }
  return '' + value
}

// 转换检查缓存中的值
// 如果同时检查多个字段，则把多个字段的值都拼装成一个字符串
let _convertCacheValue = function (cacheValue, checkField, fieldValue) {
  if (cacheValue == '') {
    if (fieldValue == '') {
      cacheValue = checkField + '为空'
    } else {
      cacheValue = checkField + '=' + fieldValue
    }
  } else {
    if (fieldValue == '') {
      cacheValue = cacheValue + ',' + checkField + '为空'
    } else {
      cacheValue = cacheValue + ',' + checkField + '=' + fieldValue
    }
  }
  return cacheValue
}

let _getFieldCode = function (field) {
  //if (field.indexOf(".") >= 0)
  //field = field.split(".")[1];
  if (field.indexOf('.') >= 0) {
    let fieldSplit = field.split('.')
    if (fieldSplit.length == 2) field = fieldSplit[1]
    else if (fieldSplit.length == 3) field = fieldSplit[2]
  }
  return field
}

export { main }
