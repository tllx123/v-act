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
 */
let main = function (bindMenuId) {
  if (null == bindMenuId || '' == bindMenuId) {
    log.error('[MenuGetData.main]菜单ID为空，请检查配置')
    return null
  }

  let expression = 'MenuGetData("' + bindMenuId + '")'
  let result = operationLib.executeFormulaExpression(
    viewContext.getModuleId(),
    expression
  )
  if (result && result.success == true) {
    return result.data.result
  } else {
    throw new Error('[MenuGetData.main]获取菜单失败，result=' + result)
  }
}

export { main }
