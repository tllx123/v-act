/**
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { object }

var main = function (str) {
  if (vds.object.isUndefOrNull(str)) return 0

  str = String(str)
  return str.length
}
export { main }
