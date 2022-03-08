import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str1 = argsLen >= 1 ? args[0] : null,
    str2 = argsLen >= 2 ? args[1] : null

  if (mathUtil.isEmpty(str1)) str1 = ''
  if (mathUtil.isEmpty(str2))
    throw new Error('字符串验证包含时第二个参数为空，请检查!')

  str1 = String(str1)
  str2 = String(str2)
  let str = str1.slice(0, str2.length)

  return str == str2
}

export { main }
