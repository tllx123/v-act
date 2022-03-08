/**
 *	移除指定索引位置的指定长度的字符
 *  代码示例:Remove("asdfe",2,1) 返回值为 asfe
 *  参数数量:3
 *  参数1(字符串类型) 参数2(正整数) 参数3(正整数)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, string, number }

const main = function (str, index1, index2) {
  if (vds.object.isUndefOrNull(str)) return ''

  str = String(str)
  if (!vds.object.isUndefOrNull(index1)) {
    if (!vds.number.isInteger(index1) || index1 < 0)
      throw new Error('下标不是非负整数类型，请检查')
  }
  if (!vds.object.isUndefOrNull(index2)) {
    if (!vds.number.isInteger(index2) || index2 < 0)
      throw new Error('下标长度不是非负整数类型，请检查')
  }

  return (
    vds.string.substring(str, 0, index1) +
    vds.string.substring(str, index1 * 1 + index2 * 1, str.length)
  )
}
export { main }
