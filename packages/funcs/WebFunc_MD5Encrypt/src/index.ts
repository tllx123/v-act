/**
 * MD5加密函数
 * by liyp on 20120615
 * 参数：encryptValue 需要加密的控件值
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
const vds = { object, exception, rpc }

const main = function (encryptValue) {
  if (vds.object.isUndefOrNull(encryptValue)) return ''

  try {
    return executeExpression(encryptValue)
  } catch (e) {
    throw vds.exception.newConfigException(e)
  }
}
export { main }

var executeExpression = function (encryptValue) {
  var strategy = 'MD5',
    expression =
      'WebFunc_EncryptionFunc("' + strategy + '","' + encryptValue + '")',
    paramData = { expression: expression },
    result = null

  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: paramData,
    success: function (rs) {
      result = rs.data.result
    },
    error: function (e) {
      throw vds.exception.newConfigException(e)
    }
  })

  return result
}
