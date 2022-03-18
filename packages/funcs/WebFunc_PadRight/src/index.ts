/**
 *	检查指定字符串长度是否达到指定长度,未达到则用指定字符在末尾填充
 *  代码示例:PadRight('sdfsd',9,'0') 返回值为 'sdfsd0000'
 *  参数数量:3
 *  参数1(字符串类型) 参数2(正整数) 参数3(字符串类型)
 *  返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, number }

const main = function (str1: string, index: number, str2: string) {
  if (vds.object.isUndefOrNull(str1)) str1 = ''
  if (vds.object.isUndefOrNull(index)) throw new Error('起始下标为空，请检查')
  else {
    if (!vds.number.isInteger(index) || index < 1)
      throw new Error('字符串长度不是正整数类型，请检查')
  }

  str1 = String(str1)
  str2 = String(str2)
  if (vds.object.isUndefOrNull(str2)) str2 = ''
  else {
    if (str2.length != 1) throw new Error('填充的字符串只能有一个字符，请检查!')
  }
  var j = index - str1.length
  for (var i = 0; i < j; i++) {
    str1 += str2
  }
  return str1
}
export { main }
