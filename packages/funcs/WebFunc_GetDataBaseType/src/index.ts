import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
/**
 *
 *
 */
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

const vds = { window, rpc }

const main = function () {
  try {
    return executeExpression()
  } catch (e) {
    throw e
  }
}

var executeExpression = function () {
  var expression = 'GetDataBaseType()'
  var result = null

  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: {
      expression: expression
    },
    success: function (rs: any) {
      result = rs.data.result
    },
    fail: function (e: any) {
      throw e
    }
  })

  return result
}
export { main }
