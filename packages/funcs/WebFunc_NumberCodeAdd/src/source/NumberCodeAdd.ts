import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    numberCode = argsLen >= 1 ? args[0] : null,
    num = argsLen >= 2 ? args[1] : null

  if (typeof numberCode == 'string' && numberCode != '')
    numberCode = stringUtil.trim(numberCode)

  return mathUtil.numberCodeAdd(numberCode, num)
}

export { main }
