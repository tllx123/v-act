/**
 *	检查指定的字符串是否以另一指定的模式串开头
 *  代码示例:StartsWith("asdfe","df") 返回值为 false ;StartsWith("asdfe","as") 返回值为 true
 *  参数数量:2
 *  参数1(字符串类型) 参数2(字符串类型)
 *  返回值为布尔类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { object }

const main = function (str1, str2) {
  if (vds.object.isUndefOrNull(str1)) str1 = ''
  if (vds.object.isUndefOrNull(str2))
    throw new Error('字符串验证包含时第二个参数为空，请检查!')

  str1 = String(str1)
  str2 = String(str2)
  var str = str1.slice(0, str2.length)

  return str == str2
}
export { main }
