/**
 *
 *
 */
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { window }

const main = function () {
  return vds.window.getCode() ? vds.window.getCode() : ''
}
export { main }
