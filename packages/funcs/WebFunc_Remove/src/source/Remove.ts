import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null,
    index1 = argsLen >= 2 ? args[1] : null,
    index2 = argsLen >= 3 ? args[2] : null

  if (mathUtil.isEmpty(str)) return ''

  str = String(str)
  if (!stringUtil.isEmpty(index1)) {
    if (!mathUtil.judgeInt(index1) || index1 < 0)
      throw new Error('下标不是非负整数类型，请检查')
  }
  if (!stringUtil.isEmpty(index2)) {
    if (!mathUtil.judgeInt(index2) || index2 < 0)
      throw new Error('下标长度不是非负整数类型，请检查')
  }

  return (
    stringUtil.substring(str, 0, index1) +
    stringUtil.substring(str, index1 * 1 + index2 * 1, str.length)
  )
}

export { main }
