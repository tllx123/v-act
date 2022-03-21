import * as operationLib from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import * as log from '@v-act/vjs.framework.extension.util.logutil'
import * as viewContext from '@v-act/vjs.framework.extension.platform.init.view'
const vds = { operationLib, log, viewContext }

export function initModule() {}
/**
 * 主入口
 */
const main = function (bindMenuId: string) {
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
