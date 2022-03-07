import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    retStr = args && argsLen >= 1 && args[0] ? args[0] : ''

  for (let index = 1; index < args.length; index++) {
    if (mathUtil.isEmpty(args[index])) retStr = stringUtil.concat(retStr, '')
    else retStr = stringUtil.concat(retStr, args[index])
  }

  return retStr
}

export { main }
