/**
 *取消关闭窗体
 *
 */

import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { window }

//规则主入口(必须有)
const main = function (ruleContext) {
  return new Promise(function (resolve, reject) {
    try {
      vds.window.cancelClose()
      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}

export { main }
