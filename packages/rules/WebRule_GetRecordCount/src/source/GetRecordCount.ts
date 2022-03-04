import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { WhereRestrict as WhereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { ErrorUtil as rendererUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.error'
import { QueryCondUtil as queryConditionUtil } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { log as logUtil } from '@v-act/vjs.framework.extension.util'
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let rpcEnum
let undefined
exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let ruleCfg = ruleContext.getRuleCfg()
  let params = ruleCfg['inParams']
  let ruleInstId = ruleCfg['ruleInstId']
  let inParamsObj = jsonUtil.json2obj(params)
  let dsWhere = inParamsObj['dsWhere'] // 获取条件
  let queryparam = inParamsObj['queryparam']
  let routeContext = ruleContext.getRouteContext()
  let sqlStr = ''
  let wrParam = {
    fetchMode: 'custom',
    routeContext: routeContext
  }
  let w = WhereRestrict.init(wrParam)
  let scope = scopeManager.getScope()

  if (undefined != queryparam && null != queryparam) {
    let params = queryConditionUtil.genCustomParams({
      paramDefines: queryparam,
      routeContext: routeContext
    })
    w.addExtraParameters(params)
  }
  if (undefined != dsWhere && null != dsWhere && dsWhere.length > 0) {
    // 有进行字段的配置，按照配置生成条件sql
    w.andExtraCondition(dsWhere, 'custom')
  }
  inParamsObj['sql'] = sqlStr + w.toWhere()
  inParamsObj['parameters'] = w.toParameters()

  let resultCount = 0

  let inputParams = {
    // ruleSetCode为活动集编号
    ruleSetCode: 'CommonRule_GetRecordCount',
    // params为活动集输入参数
    params: {
      InParams: jsonUtil.obj2json(inParamsObj)
    }
  }
  let callback = function (responseObj) {
    let resultCount = 0
    let success = responseObj.IsSuccess
    if (!success) {
      rendererUtil.handleError('获取数据库记录数失败')
      return false
    } else {
      resultCount = responseObj.RecordCount
    }
    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult({
        recordCount: resultCount
      })
    }
    ruleContext.fireRouteCallback()
    return true
  }

  let errorCallback = function (responseObj) {
    logUtil.error(responseObj.message)
    ruleContext.handleException(responseObj)
  }
  //  调用后台活动集
  let sConfig = {
    isAsyn: true,
    componentCode: scope.getComponentCode(),
    transactionId: routeContext.getTransactionId(),
    ruleSetCode: 'CommonRule_GetRecordCount',
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: inputParams.params.InParams
      }
    ],
    error: errorCallback,
    afterResponse: callback
  }
  let scopeId = scope.getInstanceId()
  let windowScope = scopeManager.getWindowScope()
  if (scopeManager.isWindowScope(scopeId)) {
    sConfig.windowCode = windowScope.getWindowCode()
  }

  remoteMethodAccessor.invoke(sConfig)
  ruleContext.markRouteExecuteUnAuto()
  return true
}

export { main }
