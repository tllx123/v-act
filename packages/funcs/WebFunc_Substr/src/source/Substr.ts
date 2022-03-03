import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (arg1, arg2) {
  if (mathUtil.isEmpty(arg1)) {
    throw new Error('字符串为空，请检查')
  }
  if (mathUtil.isEmpty(arg2)) {
    throw new Error('起始下标为空，请检查')
  } else {
    if (!mathUtil.judgeInt(arg2)) {
      throw new Error('起始下标不是整数类型，请检查')
    }
  }
  if (!mathUtil.isEmpty(arg3)) {
    if (!mathUtil.judgeInt(arg3)) {
      throw new Error('字符数目不是整数类型，请检查')
    }
  }
  return stringUtil.substr(arg1, arg2, arg3)
}

export { main }
