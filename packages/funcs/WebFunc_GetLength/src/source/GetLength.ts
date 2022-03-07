import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(str)) return 0

  str = String(str)
  return str.length
}

export { main }
