import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg)) throw new Error('e的指定次幂函数参数为空，请检查')
  if (!mathUtil.judgeNum(arg))
    throw new Error('e的指定次幂函数参数不是数字，请检查')

  let ret = mathUtil.exp(arg)
  if (mathUtil.isInfinity(ret))
    throw new Error('e的指定次幂函数运算数据超出计算机所表示的范围，无法计算')

  return ret
}

export { main }
