import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null,
    arg2 = argsLen >= 2 ? args[1] : null,
    arg3 = argsLen >= 3 ? args[2] : null

  if (mathUtil.isEmpty(arg1)) {
    //throw new Error("字符串为空，请检查");
  }
  if (mathUtil.isEmpty(arg2)) throw new Error('指定字符串为空，请检查')
  if (!stringUtil.isEmpty(arg3)) {
    if (!mathUtil.judgeInt(arg3)) throw new Error('下标不是整数类型，请检查')
  }

  if (mathUtil.isEmpty(arg1)) arg1 = ''
  else arg1 = String(arg1)

  arg2 = String(arg2)
  if (arg3) {
    return stringUtil.lastIndexOf(arg1, arg2, arg3)
  } else {
    return stringUtil.lastIndexOf(arg1, arg2)
  }
}

export { main }
