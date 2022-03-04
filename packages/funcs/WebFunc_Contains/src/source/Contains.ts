import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sandbox) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    str1 = argsLen >= 1 ? args[0] : null,
    str2 = argsLen >= 2 ? args[1] : null

  if (stringUtil.isEmpty(str1)) str1 = ''
  if (stringUtil.isEmpty(str2)) str2 = ''
  str1 = String(str1)
  str2 = String(str2)

  return stringUtil.indexOf(str1, str2, 0) >= 0
}

export { main }
