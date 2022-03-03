import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sandbox) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg))
    throw new Error('求浮点数的整数部分参数为空，请检查')
  if (!mathUtil.judgeNum(arg))
    throw new Error('求浮点数的整数部分参数不是数字，请检查')

  return mathUtil.truncate(arg)
}

export { main }
