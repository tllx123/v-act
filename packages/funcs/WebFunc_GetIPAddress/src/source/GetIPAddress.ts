import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  try {
    let expression = 'GetIPAddressFunc()'
    let findParam = {
      expression: expression
    }
    let scope = scopeManager.getWindowScope()
    let windowCode = scope.getWindowCode()
    let result

    operation.request({
      windowCode: windowCode,
      operation: 'WebExecuteFormulaExpression',
      isAsync: false,
      params: findParam,
      success: function (rs) {
        result = rs.data.result
      }
    })
    return result
  } catch (e) {
    throw new Error('函数执行失败')
  }
}

export { main }
