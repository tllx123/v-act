import * as log from 'module'
import * as operationLib from 'module'
import * as viewContext from 'module'

export function initModule() {}
/**
 * 主入口
 * @param dataSourceName 数据源名称
 * @param treeStructMap 树结构配置信息
 * @param loadLevel 动态加载层次
 */
const main = function (variableName, variableValue) {
  if (null == variableName || '' == variableName) {
    log.error('[SetSystemVariableValue.main]变量名称为空，请检查配置')
    return null
  }

  let expression =
    'SetSystemVariableValue("' + variableName + '","' + variableValue + '")'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    return result.data.result
  } else {
    throw new Error('[SetSystemVariableValue.main]设置变量值失败')
  }
}

export { main }
