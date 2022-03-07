import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

const main = function (param: FunctionContext) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (math.isEmpty(arg)) throw new Error('双曲正切值函数参数为空，请检查')
  if (!math.judgeNum(arg)) throw new Error('双曲正切值函数参数为空，请检查')

  if (arg > 19.061547465398) return 1
  else if (arg < -19.061547465398) return -1
  else {
    let num1 = math.exp(arg)
    let num2 = math.exp(-arg)
    let ret1 = math.subtract(num1, num2)
    let ret2 = math.add(num1, num2)
    let result = math.divide(ret1, ret2, 10)
    return Number(result)
  }
}

export { main }
