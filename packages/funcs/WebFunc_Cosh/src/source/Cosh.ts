import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (math.isEmpty(arg)) throw new Error('双曲余弦值函数参数为空，请检查')
  if (!math.judgeNum(arg)) throw new Error('双曲余弦值函数参数不是数字，请检查')

  let num1 = math.exp(arg)
  let num2 = math.exp(-arg)
  if (math.isInfinity(num1) || math.isInfinity(num2))
    throw new Error('双曲余弦值函数运算数据超出计算机所表示的范围，无法计算')

  let ret = math.add(num1, num2),
    result = math.divide(ret, 2, 10)
  return Number(result)
}

export { main }
