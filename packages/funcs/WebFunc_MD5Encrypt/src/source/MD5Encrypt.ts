import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    encryptValue = argsLen >= 1 ? args[0] : null

  if (encryptValue == null) return ''

  try {
    let scope = scopeManager.getWindowScope(),
      windowCode = scope.getWindowCode()

    return executeExpression(windowCode, encryptValue)
  } catch (e) {
    throw e
  }
}

let executeExpression = function (windowCode, encryptValue) {
  let strategy = 'MD5',
    expression =
      'WebFunc_EncryptionFunc("' + strategy + '","' + encryptValue + '")',
    paramData = { expression: expression },
    result = null

  operation.request({
    windowCode: windowCode,
    operation: 'WebExecuteFormulaExpression',
    isAsync: false,
    params: paramData,
    success: function (rs) {
      result = rs.data.result
    },
    error: function (e) {
      throw e
    }
  })

  return result
}

export { main }
