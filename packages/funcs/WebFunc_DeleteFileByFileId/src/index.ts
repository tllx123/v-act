/**
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
const vds = { object, rpc }

var main = function (fileid) {
  if (vds.object.isUndefOrNull(fileid)) {
    throw new Error('参数不能为空，请检查')
  }

  try {
    return executeExpression(fileid)
  } catch (e) {
    throw e
  }
}

var executeExpression = function (fileid) {
  var expression = 'WebFunc_DeleteFileByFileId("' + fileid + '")'
  var result = null

  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: {
      expression: expression
    },
    success: function (rs) {
      result = rs.data.result
    }
  })

  return result
}

export { main }
