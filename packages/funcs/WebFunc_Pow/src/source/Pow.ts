import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sandbox) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null,
    arg2 = argsLen >= 2 ? args[1] : null

  if (mathUtil.isEmpty(arg1) || mathUtil.isEmpty(arg2))
    throw new Error('指定数字的幂函数参数为空，请检查')
  if (!mathUtil.judgeNum(arg1) || !mathUtil.judgeNum(arg2))
    throw new Error('指定数字的幂函数参数不是数字，请检查')

  let ret
  if (arg2 * 1 < 0) ret = mathUtil.divide(Math.pow(arg1, arg2), 1)
  else ret = mathUtil.pow(arg1, arg2) //该方法不支持幂数为负数

  if (mathUtil.isInfinity(ret))
    throw new Error('指定数字的幂函数运算数据超出计算机所表示的范围，无法计算')

  return ret
}

export { main }
