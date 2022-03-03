import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sandbox) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null,
    arg2 = argsLen >= 2 ? args[1] : null

  if (mathUtil.isEmpty(arg1) || mathUtil.isEmpty(arg2))
    throw new Error('求余数函数参数为空，请检查')
  if (!mathUtil.judgeNum(arg1) || !mathUtil.judgeNum(arg2))
    throw new Error('求余数函数参数不是数字，请检查')
  if (arg2 == 0) throw new Error('求余数函数除数不能为0，请检查')

  // 两数相除后取整数部分
  return mathUtil.getRemainder(arg1, arg2)
}

export { main }
