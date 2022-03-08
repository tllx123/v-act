/**
 *
 *
 */
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'

const vds = { rpc }

const main = function (fileid, FileInfoType) {
  try {
    return executeExpression(fileid, FileInfoType)
  } catch (e) {
    throw e
  }
}

var executeExpression = function (fileid, FileInfoType) {
  var expression = 'GetFileInfo("' + fileid + '","' + FileInfoType + '")'
  var result = null

  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: {
      expression: expression
    },
    success: function (rs) {
      result = rs.data.result
    },
    fail: function (e) {
      throw e
    }
  })

  return result
}
export { main }
