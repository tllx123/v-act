/**
 *	用于把字符串转换为大写
 *  代码示例:ToUpper('abcd') 返回值为'ABCD'
 *  参数数量:1
 *  参数1(字符串类型)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { object, string }

const main = function (arg1) {
  if (vds.object.isUndefOrNull(arg1)) return ''

  arg1 = String(arg1)
  return vds.string.toUpperCase(arg1)
}
export { main }
