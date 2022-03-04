import { DatasourceEnums as enums } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourcePusher as pusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import {
  QueryCondUtil as util,
  WhereRestrict as whereRestrict
} from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { log, UUID as uuid } from '@v-act/vjs.framework.extension.util'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

//加载
let undefined
let undefined
let undefined
let undefined
let undefined
let viewModel
let viewContextManager
let queryConditionUtil
let operationLib
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}
// 规则主入口(必须有)
let main = function (ruleContext) {
  // 当任何一条匹配数据不满足比较条件时，返回false，否则返回true(包括两种情况：不存在匹配数据或所有匹配数据都满足比较条件)；
  let bussinessReturnValue = true

  let ruleCfg = ruleContext.getRuleCfg()
  let paramsValue = ruleCfg['inParams']
  let ruleInstId = ruleCfg['ruleInstId'] // 规则ID
  //				var moduleId = viewContextManager.getModuleId();
  let scope = scopeManager.getScope()
  //var moduleId = scope.getWindowCode();
  let routeRuntime = ruleContext.getRouteContext()
  let params = jsonUtil.json2obj(paramsValue)
  let srcDataSource = params['srcDataSource']
  let srcFilterCondition = params['srcFilterCondition']
  let destDataSource = params['destDataSource']
  let destIsQuery = params['destIsQuery']
  let destFilterCondition = params['destFilterCondition']
  let destQueryParams = params['destQueryParams']

  let matchFields = params['matchFields']

  let compareCondition = params['compareCondition']

  if (compareCondition == null) {
    throw new Error('比较条件配置不能为空，请检查配置！')
  }

  let srcCompareField = compareCondition['srcField']
  let destCompareField = compareCondition['destField']
  let isMergeRepeatData = compareCondition['isMergeRepeatData']
  let operator = compareCondition['compareOperator']

  //				var idField = viewModel.getConstModule().getIDField();
  let idField = enums.IDFIELD

  if (operator == null || operator == '') {
    throw new Error('比较操作符不能为空，请检查配置！')
  }
  if (srcCompareField == null || srcCompareField == '') {
    throw new Error('源实体比较字段不能为空，请检查配置！')
  }
  if (destCompareField == null || destCompareField == '') {
    throw new Error('目标实体比较字段不能为空，请检查配置！')
  }

  // 源实体比较字段类型必须与目标实体比较字段类型兼容
  let numberTypeArray = ['integer', 'number']
  let srcCompareFieldType = getFieldByDataSource(
    srcDataSource,
    srcCompareField
  ).type

  if (!stringUtil.isInArray(srcCompareFieldType, numberTypeArray)) {
    throw new Error('源实体比较字段必须为整数或数字类型，请检查配置！')
  }

  let result = params['result']
  let isSave = result['isSave']
  let isClearSaveData = result['isClearSaveData']
  let saveDataSource = result['saveDataSource']
  let mappings = result['mappings']

  if (stringUtil.isEmpty(srcDataSource) || stringUtil.isEmpty(destDataSource)) {
    throw new Error('源实体或物理表及查询不能为空，请检查配置！')
  }

  if (srcDataSource != destDataSource) {
    let errorMsg = null
    if (matchFields == null || matchFields.length == 0) {
      errorMsg = '匹配字段不能为空，请检查配置！'
    }
    for (let i = 0; i < matchFields.length; i++) {
      let obj = matchFields[i]
      if (obj == null) {
        errorMsg = '匹配字段不能为空，请检查配置！'
        break
      }
      if (stringUtil.isEmpty(obj['srcField'])) {
        errorMsg = '匹配源字段不能为空，请检查配置！'
        break
      }
      if (stringUtil.isEmpty(obj['destField'])) {
        errorMsg = '匹配目标字段不能为空，请检查配置！'
        break
      }
    }
    if (errorMsg != null) {
      throw new Error(errorMsg)
    }
  }
  try {
    validSaveMapping(isSave, mappings)
  } catch (e) {
    throw new Error('存储实体字段映射不能为空，请检查配置！')
  }

  if (isSave) {
    if (stringUtil.isEmpty(saveDataSource)) {
      throw new Error('存储实体不能为空，请检查配置！')
    }
    if (saveDataSource == srcDataSource) {
      throw new Error('存储实体不能为源实体，请检查配置！')
    }
  }

  let srcRecords = getFilterRecords(
    srcDataSource,
    srcFilterCondition,
    ruleContext
  )
  if (srcRecords == null || srcRecords.length == 0) {
    setBusinessRuleResult(ruleContext, true)
    if (isSave && isClearSaveData)
      //						viewModel.getDataModule().removeAllRecordsByDS(saveDataSource);
      pusher.removeAllRecords({ datasourceName: saveDataSource })
    return true
  }
  let destQueryCond = {}
  destQueryCond.srcDataSource = srcDataSource
  destQueryCond.destDataSource = destDataSource
  destQueryCond.destIsQuery = destIsQuery

  let fetchMode = destIsQuery ? 'custom' : 'table'
  let wrParam = {
    fetchMode: fetchMode,
    routeContext: routeRuntime
  }
  let w = whereRestrict.init(wrParam)

  // 组装设置的加载条件
  if (destFilterCondition && destFilterCondition.length > 0) {
    w.andExtraCondition(destFilterCondition, fetchMode)
  }
  if (destQueryParams != null && destQueryParams.length > 0) {
    //					var tmpparams = queryConditionUtil.genCustomParams(destQueryParams);
    let tmpparams = util.genCustomParams({
      paramDefines: destQueryParams,
      routeContext: ruleContext.getRouteContext()
    })
    w.addExtraParameters(tmpparams)
  }
  let condition = w.toWhere()
  let valueParamMap = w.toParameters()
  destQueryCond.destWhere = condition
  destQueryCond.destQueryParams = valueParamMap

  destQueryCond.srcValues = srcRecords
  destQueryCond.matchFields = matchFields

  let cloneCompareCondition = cloneObj(compareCondition)
  let srcField = getFieldByDataSource(srcDataSource, srcCompareField)
  cloneCompareCondition.srcColumnTypeName = srcField.type
  destQueryCond.compareCondition = cloneCompareCondition

  // var result =
  // operationLib.executeRule(viewContext.getModuleId(),
  // ruleCfg.ruleInstId, destQueryCond);
  // if (result.success) {
  // finalResults=result.data;
  //
  // if(isSave){
  // if(isClearSaveData)
  // viewModel.getDataModule().removeAllRecordsByDS(saveDataSource);
  // //获取构造的存储实体数据
  // if(finalResults!=null && finalResults.length>0){
  // var
  // newSaveRecords=getCopyRecordsByMapping(saveDataSource,finalResults,mappings);
  // viewModel.getDataModule().insertByDS(saveDataSource,newSaveRecords);
  // }
  // }
  // if(finalResults!=null &&
  // finalResults.length==srcRecords.length)
  // bussinessReturnValue=true;
  // else
  // bussinessReturnValue=false;
  //
  // setBusinessRuleResult(ruleContext,bussinessReturnValue);
  //
  // } else {
  // log.error("错误信息："+result.msg);
  // throw new Error("数据比较执行异常！");
  // }

  let inputParams = {
    // ruleSetCode为活动集编号
    ruleSetCode: 'CommonRule_CompareEntityAndTableData',
    // params为活动集输入参数
    params: {
      InParams: jsonUtil.obj2json(destQueryCond)
    }
  }
  let callback = function (responseObj) {
    //var outputResult = responseObj.data.result;

    let success = responseObj.IsSuccess
    if (!success) {
      log.error('错误信息：' + result.msg)
      throw new Error('数据比较执行异常！')
    } else {
      finalResultsValue = responseObj.CompareResults
      finalResults = jsonUtil.json2obj(finalResultsValue)
      if (isSave) {
        if (isClearSaveData)
          //								viewModel.getDataModule().removeAllRecordsByDS(saveDataSource);
          pusher.removeAllRecords({ datasourceName: saveDataSource })
        // 获取构造的存储实体数据
        if (finalResults != null && finalResults.length > 0) {
          let newSaveRecords = getCopyRecordsByMapping(
            saveDataSource,
            finalResults,
            mappings
          )
          //								viewModel.getDataModule().insertByDS(saveDataSource, newSaveRecords);
          let datasource = manager.lookup({ datasourceName: saveDataSource })
          datasource.insertRecords({ records: newSaveRecords })
        }
      }
      if (finalResults != null && finalResults.length == srcRecords.length)
        bussinessReturnValue = true
      else bussinessReturnValue = false

      setBusinessRuleResult(ruleContext, bussinessReturnValue)
    }

    return true
  }

  //				operationLib.executeRuleSet(inputParams, callback);
  let sConfig = {
    isAsyn: false,
    componentCode: scope.getComponentCode(),
    transactionId: ruleContext.getRouteContext().getTransactionId(),
    ruleSetCode: 'CommonRule_CompareEntityAndTableData',
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: inputParams.params.InParams
      }
    ],
    afterResponse: callback
  }

  let scopeId = scope.getInstanceId()
  let windowScope = scopeManager.getWindowScope()
  if (scopeManager.isWindowScope(scopeId)) {
    sConfig.windowCode = windowScope.getWindowCode()
  }
  //  调用后台活动集
  //operationLib.executeRuleSet(inputParams, callback);
  remoteMethodAccessor.invoke(sConfig)

  return true
}

function setBusinessRuleResult(ruleContext, result) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isMatchCompare: result
    })
  }
}

let validSaveMapping = function (isSave, mappings) {
  if (!isSave) return
  if (mappings == null || mappings.length == 0) {
    throw new Error('比较结果存储映射不能为空')
  }
  for (let i = 0; i < mappings.length; i++) {
    if (mappings[i].saveField == null || mappings[i].saveField == '') {
      throw new Error('比较结果存储字段不能为空')
    }
    if (mappings[i].resultField == null || mappings[i].resultField == '') {
      throw new Error('比较结果源或目标表及查询字段不能为空')
    }
  }
}

let cloneObj = function (obj) {
  let clone = {}
  for (prop in obj) {
    clone[prop] = obj[prop]
  }
  return clone
}

let getFieldName = function (fieldName) {
  if (fieldName != null && fieldName.indexOf('.') > 0)
    return fieldName.split('.')[1]
  return fieldName
}

let getCopyRecordsByMapping = function (dataSource, records, mappingFields) {
  //		var emptyRecord=viewModel.getDataModule().createEmptyRecordByDS(dataSource);
  let datasource = manager.lookup({ datasourceName: dataSource })
  let emptyRecord = datasource.createRecord()

  let copyRecords = []
  for (let i = 0; i < records.length; i++) {
    //var obj=emptyRecord.createNew();
    let tempRecord = emptyRecord.clone()
    if (tempRecord.getMetadata().isContainField('id')) {
      tempRecord.set('id', uuid.generate())
    }
    let obj = tempRecord

    for (let j = 0; j < mappingFields.length; j++) {
      let resultFieldVal = records[i][mappingFields[j].resultField]
      if (resultFieldVal == null) {
        resultFieldVal = records[i][getFieldName(mappingFields[j].resultField)]
      }
      obj.set(getFieldName(mappingFields[j].saveField), resultFieldVal)
    }
    copyRecords.push(obj)
  }
  return copyRecords
}

let getFieldByDataSource = function (dataSource, fieldName) {
  //	      var fields=viewModel.getMetaModule().getMetadataFieldsByDS(dataSource);
  let datasource = manager.lookup({ datasourceName: dataSource })
  let metadata = datasource.getMetadata()
  let fields = metadata.getFields()

  let field = null
  if (fields != null) {
    for (let i = 0; i < fields.length; i++) {
      let metaFieldName = fields[i].field
      if (metaFieldName == null) metaFieldName = fields[i].code

      let b = fieldName.split('.')
      if (metaFieldName == fieldName) {
        field = fields[i]
      }
      if (b.length == 2 && metaFieldName == b[1]) {
        field = fields[i]
      }
    }
  }
  return field
}

/**
 *	根据源实体名称及拷贝类型来获取要拷贝的行数据
 *  @param	dataSource	源实体名称
 *  @param	condition		    源实体条件
 */
let getFilterRecords = function (dataSource, condition, ruleContext) {
  let outputRecords = []
  //		var records = viewModel.getDataModule().getAllRecordsByDS(dataSource);
  let datasource = manager.lookup({ datasourceName: dataSource })
  let records = datasource.getAllRecords().toArray()

  if (condition == null || condition == '') {
    let resultData = []
    if (records && records.length > 0) {
      for (let i = 0; i < records.length; i++) {
        let record = records[i]
        resultData.push(record.toMap())
      }
    }
    //			return viewModel.getDataModule().genDataMaps(records);
    return resultData
  }

  if (records && records.length > 0) {
    let retRecords = []
    for (let index = 0; index < records.length; index++) {
      let record = records[index]
      //var ret = formulaUtil.evalExpressionByRecords(condition, record);
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      context.setRecords([record])
      let ret = engine.execute({ expression: condition, context: context })
      if (typeof ret != 'boolean') {
        log.error('条件必须返回布尔类型，请检查')
        continue
      }
      if (ret == true) {
        outputRecords.push(record.toMap())
      }
    }
  }
  return outputRecords
}

export { main }
