import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str = argsLen >= 1 ? args[0] : null

  return stringUtil.isEmpty(str)
}

export { main }
