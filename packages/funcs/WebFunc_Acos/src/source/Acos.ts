import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

let sb

export function initModule(sandbox) {
  sb = sandbox
}
const main = function (param) {
  let args = param.getArgs()
  let num = args[0]
  if (math.isEmpty(num)) {
    throw new Error('反余弦函数参数为空，请检查')
  }
  if (!math.judgeNum(num)) {
    throw new Error('反余弦函数参数不是数字，请检查')
  }
  if (num > 1 || num < -1) {
    throw new Error('反余弦函数参数不在-1至1之间，请检查')
  }
  let result = math.toDecimal(math.acos(num), 10)
  return Number(result)
}
export { main }
