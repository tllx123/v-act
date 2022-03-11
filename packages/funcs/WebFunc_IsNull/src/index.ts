/**
 *	空值处理
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }

const main = function (arg: any, defaultVal: any) {
  return vds.object.isUndefOrNull(arg) ? defaultVal : arg
}
export { main }
