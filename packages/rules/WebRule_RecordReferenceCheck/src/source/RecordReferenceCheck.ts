import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourcePuller as datasourcePuller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { WhereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

// 业务返回值：是否被引用,true表示有引用
let BIZ_RESULT_ISREFERENCED = 'isReferenced'

function main(ruleContext) {
  debugger
  let ruleConfig = ruleContext.getRuleCfg()
  let inParamObj = jsonUtil.json2obj(ruleConfig.inParams)
  let scope = scopeManager.getWindowScope()
  let rows = datasourcePuller.getSelectedAndCurrentRecords({
    datasourceName: inParamObj.sourceTable
  })
  //如果要检查的数据源当前没有选中行，则检查通过，业务返回值为false[表示没有被引用]
  if (!rows || rows.length == 0) {
    setBusinessRuleResult(ruleContext, false)
    return true
  }
  let routeRuntime = ruleContext.getRouteContext()

  let params = {
    rowValues: [],
    condition: '',
    parameters: {}
  }
  // 构建查询条件
  let wrParam = {
    fetchMode: 'custom',
    routeContext: routeRuntime
  }
  let w = WhereRestrict.init(wrParam)
  let orConds = []
  let sourceField = inParamObj.sourceField.split('.')[1]
  for (let i = 0; i < rows.length; i++) {
    let value = rows[i].get(sourceField)
    // 跳过空值不检查
    if (value != null) {
      params.rowValues.push(value)
      orConds.push(w.eq(inParamObj.checkField, value))
    }
  }
  w.or(orConds)

  let condition = inParamObj.Condition
  if (undefined != condition && null != condition && condition.length > 0) {
    w.andExtraCondition(condition, 'custom')
  }
  params.condition = w.toWhere()
  params.parameters = w.toParameters()
  params.checkTable = inParamObj['checkTable']

  // 2015-05-22 liangchaohui：如果检查字段的值是Null，会执行该记录，如果没有需要检查的记录，则直接返回false
  if (params.rowValues.length < 1) {
    setBusinessRuleResult(ruleContext, false)
  } else {
    let callback = scopeManager.createScopeHandler({
      handler: function (responseObj) {
        let result = responseObj.Success
        setBusinessRuleResult(ruleContext, result)
        ruleContext.fireRouteCallback()
        return true
      }
    })
    let errorCallback = scopeManager.createScopeHandler({
      handler: function (responseObj) {
        let result = responseObj.Success
        throw new Error('记录引用检查执行异常！' + result)
      }
    })
    let sConfig = {
      isAsyn: true,
      componentCode: scope.getComponentCode(),
      windowCode: scope.getWindowCode(),
      transactionId: ruleContext.getRouteContext().getTransactionId(),
      ruleSetCode: 'CommonRule_RecordReferenceCheck',
      commitParams: [
        {
          paramName: 'InParams',
          paramType: 'char',
          paramValue: jsonUtil.obj2json(params)
        }
      ],
      afterResponse: callback,
      error: errorCallback
    }
    ruleContext.markRouteExecuteUnAuto()
    remoteMethodAccessor.invoke(sConfig)
  }
}

function setBusinessRuleResult(ruleContext, result) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isReferenced: result
    })
  }
}

export { main }
