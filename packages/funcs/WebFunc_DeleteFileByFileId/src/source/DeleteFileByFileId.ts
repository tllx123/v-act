import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
let undefined
exports.initModule = function (sBox) {}

//规则主入口(必须有)
let main = function (ruleContext) {
  let args = ruleContext.getArgs()
  let argsLen = args ? args.length : 0
  let fileid = argsLen == 1 ? args[0] : null
  if (mathUtil.isEmpty(fileid)) {
    throw new Error('参数不能为空，请检查')
  }
  let expression = 'WebFunc_DeleteFileByFileId("' + fileid + '")'

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
}

export { main }
