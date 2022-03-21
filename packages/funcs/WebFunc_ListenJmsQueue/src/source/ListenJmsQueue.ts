import * as operationLib from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import * as viewContext from '@v-act/vjs.framework.extension.platform.init.view'

//const vds = { operationLib, viewContext }

export function initModule() {}
/**
 * 主入口
 * @param serverCode 服务器编码
 * @param queueCode 消息队列编码
 * @param isEnable 是否监听,true:监听,false:停止
 */
const main = function (
  serverCode: string,
  queueCode: string,
  isEnable: boolean
) {
  if (serverCode == null || serverCode == '') {
    throw new Error('服务器编码不能为空，请检查')
  }
  if (queueCode == null || queueCode == '') {
    throw new Error('消息队列编码不能为空，请检查')
  }
  if (isEnable == null) isEnable = false
  let expression =
    'ListenJmsQueue("' + serverCode + '","' + queueCode + '",' + isEnable + ')'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    return true
  } else {
    throw new Error('ListenJmsQueue函数执行失败：' + result['msg'])
  }
}

export { main }
