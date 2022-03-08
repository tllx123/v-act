import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (math.isEmpty(arg)) throw Error('正弦函数参数为空，请检查')
  if (!math.judgeNum(arg)) throw Error('正弦函数参数为空，请检查')

  let result = math.toDecimal(math.sin(arg), 10)
  return Number(result)
}

export { main }
