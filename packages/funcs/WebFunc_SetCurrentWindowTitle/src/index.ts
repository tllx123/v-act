/**
 *  SetCurrentWindowTitle("编辑");
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { object, window }

var main = function (newTitle) {
  if (vds.object.isUndefOrNull(newTitle)) return

  vds.window.setTitle(newTitle)
}
export { main }
