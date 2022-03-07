import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sandbox) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    firstStr = argsLen >= 1 ? args[0] : null,
    secondStr = argsLen >= 2 ? args[1] : null,
    isSubOrSup = argsLen >= 3 ? args[2] : null

  if (firstStr === null) firstStr = ''

  firstStr = firstStr + ''
  if (secondStr === null) secondStr = ''

  secondStr = secondStr + ''
  if (mathUtil.isEmpty(firstStr)) {
    throw new Error('字符串比较时第一个参数为空，请检查')
    return
  }
  if (mathUtil.isEmpty(secondStr))
    throw new Error('字符串比较时第二个参数为空，请检查')

  if (typeof isSubOrSup != 'boolean')
    throw new Error('字符串比较时第三个参数不是布尔型，请检查')

  if (isSubOrSup) {
    //如果不区分大小写则都转换为小写再比较
    firstStr = stringUtil.toLowerCase(firstStr)
    secondStr = stringUtil.toLowerCase(secondStr)
  }

  return firstStr == secondStr
}

export { main }
