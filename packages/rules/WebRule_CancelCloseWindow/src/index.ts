/**
 *取消关闭窗体
 *
 */

//规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

const vds = { window }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      vds.window.cancelClose()
      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}

export { main }
