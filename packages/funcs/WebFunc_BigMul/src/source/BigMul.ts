import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    multiplier1 = argsLen >= 1 ? args[0] : null,
    multiplier2 = argsLen >= 2 ? args[1] : null

  if (math.isEmpty(multiplier1) || math.isEmpty(multiplier2))
    throw new Error('整数乘积函数的因数为空，请检查')
  if (isNaN(multiplier1) || isNaN(multiplier2))
    throw Error('整数乘积函数的因数不是数字，请检查')

  multiplier1 = math.round(multiplier1)
  multiplier2 = math.round(multiplier2)

  return math.multiply(multiplier1, multiplier2)
}

export { main }
