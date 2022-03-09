import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RPC as operation } from '@v-act/vjs.framework.extension.system'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let sandBox

export function initModule(sBox) {
  sandBox = sBox
}

const query = function (params) {
  let queryParam = params.queryParams,
    isAsync = params.isAsync,
    callback = params.success,
    isConcurrent = params.isConcurrent
  let selectDatas = []
  if (arrayUtil.isArray(queryParam) && queryParam.length > 0) {
    for (let i = 0; i < queryParam.length; i++) {
      let paramObj = queryParam[i]
      let whereRestrict = paramObj.whereRestrict
      //将查询参数值为undefined的改为null值
      let tmp_paramter = whereRestrict.toParameters()
      tmp_paramter = changeUndefinedToNull(tmp_paramter)
      let selectDataObj = {
        CheckUnique: paramObj.CheckUnique ? true : false,
        DataSourceName: paramObj.dataSourceName,
        QueryParams: tmp_paramter,
        QueryCondition: whereRestrict.toWhere(),
        QueryOrderBy: whereRestrict.toOrderBy(),
        QueryFields: paramObj.queryFields,
        QueryRecordStart: paramObj.queryRecordStart,
        QueryPageSize: paramObj.queryPageSize,
        QueryType: paramObj.queryType
      }
      selectDatas.push(selectDataObj)
    }
  }

  let callBackFunc = function (resultDataString) {
    if (resultDataString.success == true) {
      let outputResult = resultDataString.data.result
      let outputJson = outputResult.OutputJson
      let rsDataValueStr = outputJson.value
      let resultData = jsonUtil.json2obj(rsDataValueStr)
      if (typeof callback == 'function') {
        callback(resultData)
      }
    } else {
      let e = exceptionFactory.create({
        message: resultDataString.msg,
        type: resultDataString.exceptionType
      })
      throw e
    }
  }
  let scope = scopeManager.getScope()
  //根据路由上下文传递事务id
  let routeContext = params.routeContext
  let transactonId = null
  //异步请求时去除事务id，防止并发发起事务请求
  if (!isConcurrent && routeContext && routeContext.duringTransaction()) {
    transactonId = routeContext.getTransactionId()
  }
  let operationParams = {
    param: {
      componentCode: scope.getComponentCode(),
      ruleSetCode: 'CommonRule_DataBaseDataToInterfaceEntity',
      params: {
        SelectDatas: jsonUtil.obj2json(selectDatas)
      }
    },
    componentCode: scope.getComponentCode(),
    operationName: 'ExecuteRuleSet',
    transactionId: transactonId,
    isAsync: isAsync,
    afterResponse: callBackFunc
  }
  if (scopeManager.isWindowScope(scope.getInstanceId())) {
    operationParams.windowCode = scope.getWindowCode()
    operationParams.param.windowCode = scope.getWindowCode()
  }
  operation.invokeOperation(operationParams)
}

const querySenior = function (params) {
  let queryParam = params.queryParams,
    isAsync = params.isAsync,
    callback = params.success
  let selectDatas = []
  if (arrayUtil.isArray(queryParam) && queryParam.length > 0) {
    for (let i = 0; i < queryParam.length; i++) {
      let paramObj = queryParam[i]
      let whereRestrict = paramObj.whereRestrict
      //将查询参数值为undefined的改为null值
      let tmp_paramter = whereRestrict.toParameters()
      tmp_paramter = changeUndefinedToNull(tmp_paramter)
      let selectDataObj = {
        DataSourceName: paramObj.dataSourceName,
        QueryParams: tmp_paramter,
        QueryCondition: whereRestrict.toWhere(),
        QueryOrderBy: whereRestrict.toOrderBy(),
        QueryFields: paramObj.queryFields,
        QueryRecordStart: paramObj.queryRecordStart,
        QueryPageSize: paramObj.queryPageSize,
        QueryType: paramObj.queryType,
        TableOrQuery: paramObj.tableOrQuery,
        SourceType: paramObj.sourceType,
        EntityInfo: paramObj.entityInfo
      }
      selectDatas.push(selectDataObj)
    }
  }

  let callBackFunc = function (resultDataString) {
    if (resultDataString.success == true) {
      let outputResult = resultDataString.data.result
      let outputJson = outputResult.OutputJson
      let rsDataValueStr = outputJson.value
      let resultData = jsonUtil.json2obj(rsDataValueStr)
      if (typeof callback == 'function') {
        callback(resultData)
      }
    } else {
      let e = exceptionFactory.create({
        message: resultDataString.msg,
        type: resultDataString.exceptionType
      })
      throw e
    }
  }
  let scope = scopeManager.getScope()
  //根据路由上下文传递事务id
  let routeContext = params.routeContext
  let transactonId = null
  //异步请求时去除事务id，防止并发发起事务请求
  if (!isAsync && routeContext && routeContext.duringTransaction()) {
    transactonId = routeContext.getTransactionId()
  }
  let operationParams = {
    param: {
      ruleSetCode: 'CommonRule_DynamicCrossDataToInterfaceEntity',
      params: {
        SelectDatas: jsonUtil.obj2json(selectDatas)
      }
    },
    componentCode: scope.getComponentCode(),
    operationName: 'ExecuteRuleSet',
    transactionId: transactonId,
    isAsync: isAsync,
    afterResponse: callBackFunc
  }
  if (scopeManager.isWindowScope(scope.getInstanceId())) {
    operationParams.windowCode = scope.getWindowCode()
    operationParams.param.windowCode = scope.getWindowCode()
  }
  operation.invokeOperation(operationParams)
}

/**
 * 将参数值为undefined的改为null值
 * */
let changeUndefinedToNull = function (params) {
  if (undefined == params) return
  for (let _key in params) {
    if (undefined === params[_key]) {
      params[_key] = null
    }
  }
  return params
}

export { query, querySenior }
