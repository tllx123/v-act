/**
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'

const vds = { object, rpc }

const main = function (fileid: string) {
  if (vds.object.isUndefOrNull(fileid)) {
    throw new Error('参数不能为空，请检查')
  }

  try {
    return executeExpression(fileid)
  } catch (e) {
    throw e
  }
}

let executeExpression = function (fileid: string) {
  let expression = 'WebFunc_DeleteFileByFileId("' + fileid + '")'
  let result = null

  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: {
      expression: expression
    },
    success: function (rs: Record<string, any>) {
      result = rs.data.result
    }
  })

  return result
}

export { main }
