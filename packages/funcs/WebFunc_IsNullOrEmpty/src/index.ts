/**
 *	空值空字符串处理
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { object, string }

const main = function (arg: any, defaultVal: any) {
  return vds.object.isUndefOrNull(arg) || vds.string.isEmpty(arg)
    ? defaultVal
    : arg
}
export { main }
