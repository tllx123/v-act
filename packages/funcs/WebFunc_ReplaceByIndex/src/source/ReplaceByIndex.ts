import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    origStr = argsLen >= 1 ? args[0] : null,
    replaceStr = argsLen >= 2 ? args[1] : null,
    beginIndex = argsLen >= 3 ? args[2] : null,
    endIndex = argsLen >= 4 ? args[3] : null

  if (mathUtil.isEmpty(origStr)) return ''
  if (mathUtil.isEmpty(replaceStr)) throw new Error('替换字符串为空，请检查')
  if (mathUtil.isEmpty(beginIndex)) throw new Error('替换开始索引为空，请检查')
  if (!mathUtil.judgeInt(beginIndex))
    throw new Error('替换开始索引必须为整数，请检查')
  if (!mathUtil.isEmpty(endIndex) && !mathUtil.judgeInt(endIndex))
    throw new Error('替换结束索引必须为整数，请检查')

  origStr = String(origStr)
  replaceStr = String(replaceStr)

  return stringUtil.replaceByIndex(origStr, replaceStr, beginIndex, endIndex)
}

export { main }
