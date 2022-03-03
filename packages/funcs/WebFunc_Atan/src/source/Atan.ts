import { Math as math } from '@v-act/vjs.framework.extension.util'
let sandbox
let undefined
exports.initModule = function (sb) {
  sandbox = sb
}
let main = function (param) {
  let args = param.getArgs()
  let num = args[0]
  if (math.isEmpty(num)) {
    throw new Error('反正切函数参数为空，请检查')
  }
  if (!math.judgeNum(num)) {
    throw new Error('反正切函数参数不是数字，请检查')
  }

  let result = math.toDecimal(math.atan(num), 10)
  return Number(result)
}
export { main }
