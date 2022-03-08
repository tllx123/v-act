/**
 *	从字符串指定索引位置开始提取指定长度的该字符串的子链
 *  代码示例:Substring('abcd',1,2) 返回值为'bc'
 *  参数数量:3
 *  参数1(字符串类型)，参数2(非负整数类型)，参数3(非负整数类型)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, string, number }

const main = function (arg1, arg2, arg3) {
  if (vds.object.isUndefOrNull(arg1)) return ''

  arg1 = String(arg1)
  if (vds.object.isUndefOrNull(arg2)) throw new Error('起始下标为空，请检查')
  else {
    if (!vds.number.isInteger(arg2) || arg2 < 0)
      throw new Error('起始下标不是非负整数类型，请检查')
  }
  if (!vds.object.isUndefOrNull(arg3)) {
    if (!vds.number.isInteger(arg3) || arg3 < 0)
      throw new Error('终止不是非负整数类型，请检查')
  }

  return vds.string.substr(arg1, arg2, arg3)
}
export { main }
