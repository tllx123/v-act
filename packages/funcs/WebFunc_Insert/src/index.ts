/**
 *	在指定字符串的指定位置插入另外一指定的模式串
 *  代码示例:Insert("asdfe",3,"df") 返回值为 asddffe
 *  参数数量:3
 *  参数1(字符串类型) 参数2(正整数)参数3(字符串类型)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, string, number }

var main = function (str1, index, str2) {
  if (vds.object.isUndefOrNull(str1)) str1 = ''
  if (vds.object.isUndefOrNull(str2)) str2 = ''
  if (!vds.object.isUndefOrNull(index)) {
    if (!vds.number.isInteger(index) || index < 0)
      throw new Error('下标不是正整数类型，请检查')
  }

  str1 = String(str1)
  str2 = String(str2)
  return (
    vds.string.substring(str1, 0, index) +
    str2 +
    vds.string.substring(str1, index, str1.length)
  )
}
export { main }
