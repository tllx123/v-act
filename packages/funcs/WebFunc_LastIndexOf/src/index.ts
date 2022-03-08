/**
 *	返回某个指定的字符串值在字符串中首次出现的位置(从后向前)。
 *  代码示例:LastIndexOf('abab','b') 返回值为 3
 *  参数数量:3
 *  参数1(字符串类型)，参数2(字符串类型), 参数3(整数类型)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, string, number }

const main = function (arg1, arg2, arg3) {
  if (vds.object.isUndefOrNull(arg1)) {
    //throw new Error("字符串为空，请检查");
  }
  if (vds.object.isUndefOrNull(arg2)) throw new Error('指定字符串为空，请检查')
  if (!vds.object.isUndefOrNull(arg3)) {
    if (!vds.number.isInteger(arg3)) throw new Error('下标不是整数类型，请检查')
  }

  if (vds.object.isUndefOrNull(arg1)) arg1 = ''
  else arg1 = String(arg1)

  arg2 = String(arg2)
  if (arg3) {
    return vds.string.lastIndexOf(arg1, arg2, arg3)
  } else {
    return vds.string.lastIndexOf(arg1, arg2)
  }
}
export { main }
