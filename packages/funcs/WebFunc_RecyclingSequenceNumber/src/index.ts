/**
 *	流水号函数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
const vds = { object, exception, rpc }

var main = function (key, serialNumber) {
  if (vds.object.isUndefOrNull(key) || vds.object.isUndefOrNull(serialNumber))
    throw vds.exception.newConfigException('传入参数不能为空，请检查')

  try {
    return executeExpression(key, serialNumber)
  } catch (e) {
    throw vds.exception.newConfigException(e)
  }
}
export { main }

var executeExpression = function (key, serialNumber) {
  var expression =
      'RecyclingSequenceNumber("' + key + '","' + serialNumber + '")',
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
