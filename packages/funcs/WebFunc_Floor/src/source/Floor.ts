import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg))
    throw new Error('小数的最大整数值函数参数为空，请检查')
  if (!mathUtil.judgeNum(arg))
    throw new Error('小数的最大整数值函数参数不是数字，请检查')

  return mathUtil.floor(arg)
}

export { main }
