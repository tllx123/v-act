import { Operation as Operation } from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Request as Request } from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'

let undefined

exports.initModule = function (sb) {}

/**
 * 常量枚举
 * @enum {String}
 */
exports.TYPES = {
  /**当前时间*/
  CurrentTime: 'systemCurrentTime'
}

const get = function (params) {
  let type = params.type
  let p = params.params
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
  operation.setOperation('SystemConstant')
  //operation.setTransactionId(params.transactionId);
  let constant = null
  let cb = function (rs) {
    let result = rs.data
    if (result) {
      for (let i = 0, l = result.length; i < l; i++) {
        if (result[i].key == type) {
          constant = result[i].value
          break
        }
      }
    }
  }
  operation.setAfterResponse(cb)
  let keyParams = [
    {
      key: type,
      params: p ? p : []
    }
  ]
  operation.addParam('keyParams', keyParams)
  operation.addParams(params.params)
  let request = new Request()
  let isAsync = false
  request.setAsync(isAsync)
  request.setOperations([operation])
  request.setErrorCallback(function (e) {
    throw e
  })
  remoteOperation.request({ request: request })
  return constant
}

export { get }
