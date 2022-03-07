import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    TableName = argsLen >= 1 ? args[0] : null,
    TableColumn = argsLen >= 2 ? args[1] : null,
    prefix = argsLen >= 3 ? args[2] : null,
    Length = argsLen >= 4 ? args[3] : null,
    CoverLetter = argsLen >= 5 ? args[4] : null,
    likeValStr = argsLen >= 6 ? args[5] : null,
    subLength = argsLen >= 7 ? args[6] : null,
    isLeftSubFlag = argsLen >= 8 ? args[7] : null,
    isReuseSerialNumber = argsLen >= 9 ? args[8] : null

  if (
    mathUtil.isEmpty(TableName) ||
    mathUtil.isEmpty(TableColumn) ||
    mathUtil.isEmpty(prefix)
  )
    throw new Error('传入参数不能为空，请检查')

  try {
    if (mathUtil.isEmpty(likeValStr)) likeValStr = ''
    if (mathUtil.isEmpty(subLength)) subLength = ''

    let scope = scopeManager.getWindowScope(),
      windowCode = scope.getWindowCode()

    return executeExpression(
      windowCode,
      TableName,
      TableColumn,
      prefix,
      Length,
      CoverLetter,
      likeValStr,
      subLength,
      isLeftSubFlag,
      isReuseSerialNumber
    )
  } catch (e) {
    throw e
  }
}

let executeExpression = function (
  moduleId,
  TableName,
  TableColumn,
  prefix,
  Length,
  CoverLetter,
  likeValStr,
  subLength,
  isLeftSubFlag,
  isReuseSerialNumber
) {
  let expression =
      'GetSerialNumberFunc("' +
      TableName +
      '","' +
      TableColumn +
      '","' +
      prefix +
      '","' +
      Length +
      '","' +
      CoverLetter +
      '","' +
      likeValStr +
      '","' +
      subLength +
      '","' +
      isLeftSubFlag +
      '","' +
      isReuseSerialNumber +
      '")',
    paramData = { expression: expression },
    result = null

  operation.request({
    windowCode: moduleId,
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
