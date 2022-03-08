import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空

export function initModule(sb) {}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  let argsLen = args ? args.length : 0

  if (argsLen != 2) {
    return ''
  }
  let fileid = args[0]
  let FileInfoType = args[1]

  try {
    let scope = scopeManager.getWindowScope()
    let windowCode = scope.getWindowCode()
    return executeExpression(windowCode, fileid, FileInfoType)
  } catch (e) {
    throw e
  }
}
let executeExpression = function (windowCode, fileid, FileInfoType) {
  let expression = 'GetFileInfo("' + fileid + '","' + FileInfoType + '")'
  let paramData = { expression: expression }
  let result = null

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
