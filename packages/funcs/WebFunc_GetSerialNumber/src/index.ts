/**
 *	流水号函数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { object, rpc, exception }

var main = function (
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
  if (
    vds.object.isUndefOrNull(TableName) ||
    vds.object.isUndefOrNull(TableColumn) ||
    vds.object.isUndefOrNull(prefix)
  )
    throw vds.exception.newConfigException('传入参数不能为空，请检查')

  if (vds.object.isUndefOrNull(likeValStr)) likeValStr = ''
  if (vds.object.isUndefOrNull(subLength)) subLength = ''

  return executeExpression(
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
}
export { main }

var executeExpression = function (
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
  var expression =
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

  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: paramData,
    success: function (rs) {
      result = rs.data.result
    },
    fail: function (e) {
      throw e
    }
  })

  return result
}
