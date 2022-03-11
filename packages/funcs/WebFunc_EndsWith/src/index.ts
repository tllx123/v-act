/**
 *	检查指定的字符串是否以另一指定的模式串结尾
 *  代码示例:EndsWith("asdfe","df") 返回值为 false ;EndsWith("asdfe","fe") 返回值为 true
 *  参数数量:2
 *  参数1(字符串类型) 参数2(字符串类型)
 *  返回值为布尔类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }

const main = function (str1: string, str2: string) {
  if (vds.object.isUndefOrNull(str1)) str1 = ''
  if (vds.object.isUndefOrNull(str2)) str2 = ''

  str1 = String(str1)
  str2 = String(str2)
  const str = str1.slice(str2.length * -1)
  return str == str2
}
export { main }
