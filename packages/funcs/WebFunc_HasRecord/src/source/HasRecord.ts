import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dsName = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(dsName)) throw new Error('传入表名为空，请检查')

  try {
    let scope = scopeManager.getWindowScope()
    let windowCode = scope.getWindowCode()
    return executeExpression(windowCode, dsName)
  } catch (e) {
    throw new Error('函数执行失败')
  }
}

let executeExpression = function (moduleId, dsName) {
  let expression = 'WebFunc_HasRecord("' + dsName + '")'
  let findParam = {
    expression: expression
  }

  let result
  operation.request({
    windowCode: moduleId,
    operation: 'WebExecuteFormulaExpression',
    isAsync: false,
    params: findParam,
    success: function (rs) {
      result = rs
    }
  })

  if (result.success) return result.data.result
  else throw new Error('执行表达式错误.')
}

export { main }
