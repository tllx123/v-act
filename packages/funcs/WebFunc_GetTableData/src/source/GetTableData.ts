import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'

let queryConditionUtil

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    columnNames = argsLen >= 1 ? args[0] : null,
    dataSourceName = argsLen >= 2 ? args[1] : null,
    queryStr = argsLen >= 3 ? args[2] : null

  if (
    mathUtil.isEmpty(dataSourceName) ||
    mathUtil.isEmpty(columnNames) ||
    mathUtil.isEmpty(queryStr)
  ) {
    throw new Error('所有参数不能为空，请检查')
  }

  // 如果存在数字则转换为字符串
  dataSourceName = '' + dataSourceName
  columnNames = '' + columnNames
  queryStr = '' + queryStr
  queryStr = replaceAll(queryStr, '&', ' and ')
  queryStr = replaceAll(queryStr, '\\|', ' or ')
  let mqlStr = ''
  if (queryStr.indexOf(':') != -1) {
    mqlStr = queryStr.substring(0, queryStr.indexOf('{'))
    let valueParamMapStr = queryStr.substring(
      queryStr.indexOf('{'),
      queryStr.length
    )
    let valueParamMap = jsonUtil.json2obj(valueParamMapStr)
    if (!mqlStr) {
      mqlStr = '1=0'
    }
  } else mqlStr = queryStr

  // 修改调用后台查询逻辑 dengb
  let expression =
    'WebFunc_GetTableData("' +
    columnNames +
    '","' +
    dataSourceName +
    '","' +
    mqlStr +
    '")'

  let findParam = {
    expression: expression
  }
  let scope = scopeManager.getWindowScope()
  let windowCode = scope.getWindowCode()
  let result
  operation.request({
    windowCode: windowCode,
    operation: 'WebExecuteFormulaExpression',
    isAsync: false,
    params: findParam,
    success: function (rs) {
      result = rs.data.result
    }
  })
  return result
}

let replaceAll = function (str, fromStr, toStr) {
  let reg = new RegExp(fromStr, 'g')
  return str.replace(reg, toStr)
}

export { main }
