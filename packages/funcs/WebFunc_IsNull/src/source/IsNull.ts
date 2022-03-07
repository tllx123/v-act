import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null,
    defaultVal = argsLen >= 2 ? args[1] : null

  return mathUtil.isEmpty(arg) ? defaultVal : arg
}

export { main }
