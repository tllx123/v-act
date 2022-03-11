/**
 *
 *
 */
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'

const vds = { rpc }

const main = function (fileid: string, FileInfoType: string) {
  try {
    return executeExpression(fileid, FileInfoType)
  } catch (e) {
    throw e
  }
}

var executeExpression = function (fileid: string, FileInfoType: string) {
  var expression = 'GetFileInfo("' + fileid + '","' + FileInfoType + '")'
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
