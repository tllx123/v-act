import * as operationLib from 'module'
import * as viewContext from 'module'

export function initModule() {}
/**
 * 主入口
 * @param serverUrl 远程服务器地址
 */
const main = function (serverUrl) {
  if (serverUrl == null || serverUrl == '') {
    throw new Error('服务器地址不能为空，请检查')
  }

  let expression = 'GetRemoteJMSConnectionURL("' + serverUrl + '")'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    let jmsConnectionUrl = result.data.result
    return jmsConnectionUrl != null && jmsConnectionUrl != ''
  } else {
    throw new Error(
      'IsRemoteServerJMSEnabled函数获取连接地址失败：' + result['msg']
    )
  }
}

export { main }
