/**
 * 前台生成UUI
 */
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { string }

const main = function (param) {
  return vds.string.uuid()
}
export { main }
