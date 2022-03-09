/**
 * 刷新组件内系统变量的值
 */
import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
const vds = { component }

/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var inParamsObj = ruleContext.getVplatformInput()
      var systemVarNames = inParamsObj['systemVarNames'] // 赋值字段的fieldName
      if (
        undefined != systemVarNames &&
        null != systemVarNames &&
        systemVarNames.length > 0
      ) {
        vds.component.refreshVariant(systemVarNames)
      }
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
export { main }
