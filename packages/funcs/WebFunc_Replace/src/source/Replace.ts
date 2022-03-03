import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null,
    arg2 = argsLen >= 2 ? args[1] : null,
    arg3 = argsLen >= 3 ? args[2] : null,
    isRegexp = argsLen >= 4 ? args[3] : null

  if (mathUtil.isEmpty(arg1)) arg1 = ''

  if (mathUtil.isEmpty(arg2)) throw new Error('被替换字符串为空，请检查')
  if (mathUtil.isEmpty(arg3)) throw new Error('替换字符串为空，请检查')

  arg1 = String(arg1)
  arg2 = String(arg2)
  arg3 = String(arg3)

  if (isRegexp == true) {
    try {
      eval('var re = /' + arg2 + '/g;')
    } catch (e) {
      throw new Error(
        'Replace函数的第2个参数需要正则表达式，请检查正则表达式是否合法：arg2=' +
          arg2 +
          ', ' +
          e.message
      )
    }
    arg1 = stringUtil.replace(arg1, re, arg3)
  }
  // 替换所有匹配字符
  // arg1 = arg1.replaceAll(arg2, arg3);
  // replaceAll是sc加进去的函数，不适合所有场景使用
  else arg1 = arg1.split(arg2).join(arg3)

  return arg1
}

export { main }
