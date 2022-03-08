import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str1 = argsLen >= 1 ? args[0] : null,
    index = argsLen >= 2 ? args[1] : null,
    str2 = argsLen >= 3 ? args[2] : null

  if (stringUtil.isEmpty(str1)) str1 = ''
  if (stringUtil.isEmpty(str2)) str2 = ''
  if (!stringUtil.isEmpty(index)) {
    if (!mathUtil.judgeInt(index) || index < 0)
      throw new Error('下标不是正整数类型，请检查')
  }

  str1 = String(str1)
  str2 = String(str2)
  return (
    stringUtil.substring(str1, 0, index) +
    str2 +
    stringUtil.substring(str1, index, str1.length)
  )
}

export { main }
