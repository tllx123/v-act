import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str1 = argsLen >= 1 ? args[0] : null,
    index = argsLen >= 2 ? args[1] : null,
    str2 = argsLen >= 3 ? args[2] : null

  if (mathUtil.isEmpty(str1)) str1 = ''

  if (mathUtil.isEmpty(index)) throw new Error('起始下标为空，请检查')
  else {
    if (!mathUtil.judgeInt(index) || index < 1)
      throw new Error('字符串长度不是正整数类型，请检查')
  }

  str1 = String(str1)
  str2 = String(str2)
  if (mathUtil.isEmpty(str2)) str2 = ''
  else {
    if (str2.length != 1) throw new Error('填充的字符串只能有一个字符，请检查!')
  }
  let j = index - str1.length
  for (i = 0; i < j; i++) {
    str1 = str2 + str1
  }

  return str1
}

export { main }
