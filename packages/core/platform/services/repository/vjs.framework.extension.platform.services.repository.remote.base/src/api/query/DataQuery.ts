/**
 * @module DataQuery
 * @desc 数据查询<br/>
 * vjs名称：vjs.framework.extension.platform.services.repository.remote.base<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.repository.query<br/>
 */

import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RPC as operation } from '@v-act/vjs.framework.extension.system.rpc'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

/**
 * 处理可忽略的参数值
 * @param	{Object}	selectDatas	原参数
 * */
var handleParam = function (selectDatas: any) {
  if (!selectDatas) {
    return
  }
  for (var i = 0, len = selectDatas.length; i < len; i++) {
    var params = selectDatas[i].QueryParams
    if (!params) {
      continue
    }
    for (var key in params) {
      var value = params[key]
      if (value == '%' || value == '%%') {
        params[key] = null
      }
    }
  }
}

/**
 * 查询后台
 * @param {Object} params 参数信息
 * {
 * 		"queryParams" : [{
 *  		dataSourceName : String 数据源名称,
 * 			whereRestrict: {@link WhereRestrict} 查询条件对象(默认无条件),
 *  		queryRecordStart ：Integer 记录开始的记录数,
 *  		queryPageSize : Integer 每页需要显示的记录数(-1为全部),
 *  		quertType: String 查询类型(表或自定义查询),
 *  		queryFields : Array 过滤字段(默认查询所有字段)
 * 		}],
 * 		"isConcurrent": Boolean 是否并行加载数据,
 * 		"isAsync" : Boolean 是否异步，默认同步,
 * 		"success" : Function 查询成功后回调
 * }
 */

function query(params: any) {
  var queryParam = params.queryParams,
    isConcurrent = params.isConcurrent,
    isAsync = params.isAsync,
    callback = params.success
  var selectDatas = []
  if (arrayUtil.isArray(queryParam) && queryParam.length > 0) {
    for (var i = 0; i < queryParam.length; i++) {
      var paramObj = queryParam[i]
      var whereRestrict = paramObj.whereRestrict
      //将查询参数值为undefined的改为null值
      var tmp_paramter = whereRestrict.toParameters()
      tmp_paramter = changeUndefinedToNull(tmp_paramter)
      var nullParam =
        whereRestrict.getNullValueParam && whereRestrict.getNullValueParam()
      var selectDataObj = {
        CheckUnique: paramObj.CheckUnique ? true : false,
        DataSourceName: paramObj.dataSourceName,
        QueryParams: tmp_paramter,
        NullValueParamCode: nullParam || [],
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

  var callBackFunc = function (resultDataString: any) {
    if (resultDataString.success == true) {
      var outputResult = resultDataString.data.result
      var outputJson = outputResult.OutputJson
      var rsDataValueStr = outputJson.value
      var resultData = jsonUtil.json2obj(rsDataValueStr)
      if (typeof callback == 'function') {
        callback(resultData)
      }
    } else {
      var e = exceptionFactory.create({
        message: resultDataString.msg,
        type: resultDataString.exceptionType
      })
      throw e
    }
  }
  var scope = scopeManager.getScope()
  //根据路由上下文传递事务id
  var routeContext = params.routeContext
  var transactonId = null
  //并行加载时不添加事务id信息
  if (!isConcurrent && routeContext && routeContext.duringTransaction()) {
    transactonId = routeContext.getTransactionId()
  }
  //处理可忽略的参数
  handleParam(selectDatas)
  var operationParams: any = {
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

/**
 * 高级查询
 * @param {Object} params 参数信息
 * {
 * 		"queryParams" : [{
 *  		dataSourceName : String 数据源名称,
 * 			whereRestrict: {@link WhereRestrict} 查询条件对象(默认无条件),
 *  		queryRecordStart ：Integer 记录开始的记录数,
 *  		queryPageSize : Integer 每页需要显示的记录数(-1为全部),
 *  		quertType: String 查询类型(表或自定义查询),
 *  		queryFields : Array 过滤字段(默认查询所有字段)
 * 		}],
 * 		"isConcurrent": Boolean 是否并行加载数据,
 * 		"isAsync" : Boolean 是否异步，默认同步,
 * 		"success" : Function 查询成功后回调
 * }
 */
function querySenior(params: any) {
  var queryParam = params.queryParams,
    isConcurrent = params.isConcurrent,
    isAsync = params.isAsync,
    callback = params.success
  var selectDatas = []
  if (arrayUtil.isArray(queryParam) && queryParam.length > 0) {
    for (var i = 0; i < queryParam.length; i++) {
      var paramObj = queryParam[i]
      var whereRestrict = paramObj.whereRestrict
      //将查询参数值为undefined的改为null值
      var tmp_paramter = whereRestrict.toParameters()
      tmp_paramter = changeUndefinedToNull(tmp_paramter)
      var selectDataObj = {
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

  var callBackFunc = function (resultDataString: any) {
    if (resultDataString.success == true) {
      var outputResult = resultDataString.data.result
      var outputJson = outputResult.OutputJson
      var rsDataValueStr = outputJson.value
      var resultData = jsonUtil.json2obj(rsDataValueStr)
      if (typeof callback == 'function') {
        callback(resultData)
      }
    } else {
      var e = exceptionFactory.create({
        message: resultDataString.msg,
        type: resultDataString.exceptionType
      })
      throw e
    }
  }
  var scope = scopeManager.getScope()
  //根据路由上下文传递事务id
  var routeContext = params.routeContext
  var transactonId = null
  //并行加载时不添加事务id信息
  if (!isConcurrent && routeContext && routeContext.duringTransaction()) {
    transactonId = routeContext.getTransactionId()
  }
  //处理可忽略的参数
  handleParam(selectDatas)
  var operationParams: any = {
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
var changeUndefinedToNull = function (params: any) {
  if (undefined == params) return
  for (var _key in params) {
    if (undefined === params[_key]) {
      params[_key] = null
    }
  }
  return params
}

export default {
  querySenior,
  query
}
