import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null,
    arg2 = argsLen >= 2 ? args[1] : null,
    arg3 = argsLen >= 3 ? args[2] : null

  if (mathUtil.isEmpty(arg1)) return ''

  arg1 = String(arg1)
  if (stringUtil.isEmpty(arg2)) throw new Error('起始下标为空，请检查')
  else {
    if (!mathUtil.judgeInt(arg2) || arg2 < 0)
      throw new Error('起始下标不是非负整数类型，请检查')
  }
  if (!stringUtil.isEmpty(arg3)) {
    if (!mathUtil.judgeInt(arg3) || arg3 < 0)
      throw new Error('终止不是非负整数类型，请检查')
  }

  return stringUtil.substr(arg1, arg2, arg3)
}

export { main }
