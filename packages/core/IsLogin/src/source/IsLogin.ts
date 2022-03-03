import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
let undefined
let undefined
exports.initModule = function (sb) {}

let main = function (param) {
  let scope = scopeManager.getWindowScope(),
    windowCode = scope.getWindowCode(),
    result = false

  /*operation.request({
        "windowCode": windowCode,
        "operation": "IsLoginExpression",
        "isAsync": false,
        "params": null,
        "success": function(rs) {
            if (rs.data && rs.data.id)
                result = true;
        },
        "error": function(e) {
            throw e;
        }
    });*/
  let routeContext = param.getRouteContext()
  let params = null
  let callback = function (rs) {
    if (rs.data && rs.data.id) result = true
    //return result;
  }
  let sConfig = {
    isAsyn: false,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    transactionId: routeContext.getTransactionId(),
    ruleSetCode: 'IsLoginExpression',
    isRuleSetCode: false,
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: params
      }
    ],
    afterResponse: callback
  }

  remoteMethodAccessor.invoke(sConfig)

  return result
}

export { main }
