import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let mathUti

exports.initModule = function (sandbox) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null,
    defaultVal = argsLen >= 2 ? args[1] : null

  return mathUtil.isEmpty(arg) || stringUtil.isEmpty(arg) ? defaultVal : arg
}

export { main }
