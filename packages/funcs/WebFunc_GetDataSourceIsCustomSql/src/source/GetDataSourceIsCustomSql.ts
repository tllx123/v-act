import * as log from 'module'
import * as viewModel from 'module'
import * as viewContext from 'module'
import * as operationLib from 'module'

let undefined
let undefined
let undefined
let undefined

exports.initModule = function () {}

/**
 * 主入口
 * @param dataSourceName 数据源名称
 */
let main = function (dataSourceName) {
  if (!dataSourceName || '' == dataSourceName) {
    throw new Error('[GetDataSourceIsCustomSql.main]数据源名称为空，请检查配置')
  }

  let expression = 'GetDataSourceIsCustomSql("' + dataSourceName + '")'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    return result.data.result
  } else {
    throw new Error(
      '[GetDataSourceIsCustomSql.main]获取数据源是否查询失败，result=' + result
    )
  }
}

export { main }
