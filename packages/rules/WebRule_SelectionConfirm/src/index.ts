/**
 *	退出业务组件(本业务规则主要用户弹出选择类操作，选择确定时会返回确认信息，并将组件的输出返回给上级组件。)
 */
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { window }

/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      vds.window.dispose(ruleContext)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
export { main }
