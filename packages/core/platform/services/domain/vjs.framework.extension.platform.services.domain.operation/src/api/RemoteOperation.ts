import { ExpressionEngine as expEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import {
  Operation,
  Request
} from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'

export function initModule(sb) {}

const request = function (params) {
  let operation = new Operation()
  let scope = scopeManager.getWindowScope()
  let componentCode = params.hasOwnProperty('componentCode')
    ? params.componentCode
    : scope.getComponentCode()
  let windowCode = params.hasOwnProperty('windowCode')
    ? params.windowCode
    : scope.getWindowCode()
  operation.setComponentCode(componentCode)
  operation.setWindowCode(windowCode)
  operation.setOperation(params.operation)
  operation.setTransactionId(params.transactionId)
  operation.setAfterResponse(params.success)
  operation.addParams(params.params)
  let request = new Request()
  let isAsync = typeof params.isAsync == 'boolean' ? params.isAsync : true
  request.setAsync(isAsync)
  request.setOperations([operation])
  request.setErrorCallback(params.error)
  remoteOperation.request({ request: request })
}

let findExpVar = function (exp) {
  return expEngine.parseVars({ expression: exp })
}

const evalExpression = function (params) {
  let operation = new Operation()
  let scope = scopeManager.getWindowScope()
  let componentCode = params.hasOwnProperty('componentCode')
    ? params.componentCode
    : scope.getComponentCode()
  let windowCode = params.hasOwnProperty('windowCode')
    ? params.windowCode
    : scope.getWindowCode()
  operation.setComponentCode(componentCode)
  operation.setWindowCode(windowCode)
  operation.setOperation('WebExecuteFormulaExpression')
  //operation.setTransactionId(params.transactionId);
  let result
  let cb = function (rs) {
    result = rs
  }
  operation.setAfterResponse(cb)
  let exp = params.expression
  operation.addParam('expression', exp)
  operation.addParam('variables', findExpVar(exp))
  let request = new Request()
  let isAsync = false
  request.setAsync(isAsync)
  request.setOperations([operation])
  remoteOperation.request({ request: request })
  return result
}

export { evalExpression, request }
