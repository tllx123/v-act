/**
 *	返回某个指定的字符串值在字符串中首次出现的位置。
 *  代码示例:IndexOf('ab','b') 返回值为 1
 *  参数数量:3
 *  参数1(字符串类型)，参数2(字符串类型), 参数3(整数类型)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, string, number }

var main = function (arg1, arg2, arg3) {
  if (vds.object.isUndefOrNull(arg1)) {
    //throw new Error("字符串为空，请检查");
  }
  if (vds.object.isUndefOrNull(arg2)) throw new Error('指定字符串为空，请检查')
  if (!vds.object.isUndefOrNull(arg3)) {
    if (!vds.number.isInteger(arg3)) throw new Error('下标不是整数类型，请检查')
  }

  if (arg1 == null || !arg1) arg1 = ''
  else arg1 = String(arg1)

  arg2 = String(arg2)

  return vds.string.indexOf(arg1, arg2, arg3)
}
export { main }
