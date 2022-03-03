import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sandbox) {}

let main = function (param) {
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
