import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
/**
 *	流水号函数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'

const vds = { object, rpc, exception }

const main = function (
  TableName: string,
  TableColumn: any,
  prefix: any,
  Length: string,
  CoverLetter: any,
  likeValStr: string,
  subLength: string,
  isLeftSubFlag: boolean,
  isReuseSerialNumber: boolean
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
  TableName: string,
  TableColumn: any,
  prefix: any,
  Length: string,
  CoverLetter: any,
  likeValStr: string,
  subLength: string,
  isLeftSubFlag: boolean,
  isReuseSerialNumber: boolean
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
    success: function (rs: any) {
      result = rs.data.result
    },
    fail: function (e: any) {
      throw e
    }
  })

  return result
}
