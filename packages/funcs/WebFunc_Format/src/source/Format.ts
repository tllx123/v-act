import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(str)) throw new Error('字符串为空，请检查!')

  let jionArgLength = args.length - 1 // 下标个数 = 参数数量-原串数量
  str = str + ''
  for (let index = 0; index < jionArgLength; index++) {
    if (stringUtil.indexOf(str, '{' + index + '}') == -1)
      throw new Error('模式串的空位与拼接串个数不符，请检查!')

    let replaceString = args[index + 1] == null ? '' : args[index + 1] + ''
    str = stringUtil.replace(str, eval('/\\{' + index + '\\}/g'), replaceString)
  }
  if (str.search(/{\d+}/) >= 0)
    throw new Error('模式串的空位与与拼接串个数不符，请检查!')

  return str
}

export { main }
