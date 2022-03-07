import { Math as math } from '@v-act/vjs.framework.extension.util.math'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

let main = function (param: FunctionContext) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (math.isEmpty(arg)) throw new Error('正切函数参数为空，请检查')
  if (!math.judgeNum(arg)) throw new Error('正切函数参数不是数字，请检查')

  let pai = math.getPI()
  let judgeNum = math.getRemainder(arg - pai / 2, pai)
  if (judgeNum == 0) throw new Error('正切函数参数不符合要求，请检查')

  let result = math.toDecimal(math.tan(arg), 10)
  return Number(result)
}

export { main }
