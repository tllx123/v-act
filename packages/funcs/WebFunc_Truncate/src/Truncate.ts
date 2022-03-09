import { Math as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

let main = function (param: FunctionContext) {
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
