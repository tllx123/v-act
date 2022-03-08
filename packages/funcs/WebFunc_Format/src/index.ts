/**
 * 在格式串内拼接格式信息
 * 代码示例:Format("今天有{0}位同学{1}了,有{2}位同学{3}了",new Array("10","迟到","3","被罚站"))
 * 输出就是 "今天有10位同学迟到了,有3位同学被罚站了" 返回值为'b' 参数数量:2
 * 参数1(字符串类型)，参数2(数组) 返回值为字符串类型
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { object, string }

var main = function () {
  var args = arguments,
    argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null

  if (vds.object.isUndefOrNull(str)) throw new Error('字符串为空，请检查!')

  var jionArgLength = args.length - 1 // 下标个数 = 参数数量-原串数量
  str = str + ''
  for (var index = 0; index < jionArgLength; index++) {
    if (vds.string.indexOf(str, '{' + index + '}') == -1)
      throw new Error('模式串的空位与拼接串个数不符，请检查!')

    var replaceString = args[index + 1] == null ? '' : args[index + 1] + ''
    str = vds.string.replace(str, eval('/\\{' + index + '\\}/g'), replaceString)
  }
  if (str.search(/{\d+}/) >= 0)
    throw new Error('模式串的空位与与拼接串个数不符，请检查!')

  return str
}
export { main }
