import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'

interface resultInterface {
  data: {
    result: unknown
  }
}

interface paramsInterface {
  moduleId: string
  TableName: string
  TableColumn: string
  prefix: string
  Length: number
  CoverLetter: string
  likeValStr: string
  subLength: number
  isLeftSubFlag: boolean
  isReuseSerialNumber: boolean
  isAsync: boolean
  success: (arg: unknown) => void
}

const getSerialNumber = function (params: paramsInterface): void {
  let moduleId = params.moduleId
  let TableName = params.TableName
  let TableColumn = params.TableColumn
  let prefix = params.prefix
  let Length = params.Length
  let CoverLetter = params.CoverLetter
  let likeValStr = params.likeValStr
  let subLength = params.subLength
  let isLeftSubFlag = params.isLeftSubFlag
  let isReuseSerialNumber = params.isReuseSerialNumber
  let isAsync = params.isAsync
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
    paramData = { expression: expression }
  operation.request({
    windowCode: moduleId,
    operation: 'WebExecuteFormulaExpression',
    isAsync: isAsync,
    params: paramData,
    success: function (rs: resultInterface) {
      let result: unknown = rs.data.result
      if (typeof params.success == 'function') {
        params.success(result)
      }
    },
    error: function (e: string) {
      throw e
    }
  })
}

export { getSerialNumber }
