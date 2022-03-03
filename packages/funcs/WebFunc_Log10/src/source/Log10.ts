import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sandbox) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg)) throw new Error('求10的底函数参数为空，请检查')
  if (!mathUtil.judgeNum(arg))
    throw new Error('求10的底函数函数参数不是数字，请检查')
  if (arg <= 0) throw new Error('求10的底函数函数参数不能小于或等于0，请检查')

  let lnten = mathUtil.log(10)
  let lnnum = mathUtil.log(arg)
  return mathUtil.divide(lnnum, lnten)
}

export { main }
