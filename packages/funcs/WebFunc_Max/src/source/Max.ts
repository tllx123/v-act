import { Math as math } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null,
    arg2 = argsLen >= 2 ? args[1] : null

  if (math.isEmpty(arg1) || math.isEmpty(arg2))
    throw new Error('求两数最大值函数参数为空，请检查')
  if (!math.judgeNum(arg1) || !math.judgeNum(arg2))
    throw new Error('求两数最大值函数参数不是数字，请检查')

  return math.max(arg1, arg2)
}

export { main }
