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
 * @param treeStructMap 树结构配置信息
 * @param loadLevel 动态加载层次
 */
let main = function (variableName, variableValue) {
  if (null == variableName || '' == variableName) {
    log.error('[GetSystemVariableValue.main]变量名称为空，请检查配置')
    return null
  }

  let expression = 'GetSystemVariableValue("' + variableName + '")'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    return result.data.result
  } else {
    throw new Error('[GetSystemVariableValue.main]获取变量值失败')
  }
}

export { main }
