import { DateTimeUtil as dateTimeUtil } from '@v-act/vjs.framework.extension.util.date'
import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    srcTime = argsLen >= 1 ? args[0] : null,
    destTime = argsLen >= 2 ? args[1] : null,
    timeUnit = argsLen >= 3 ? args[2] : null

  if (math.isEmpty(srcTime)) throw new Error('参数1为空，请检查')
  if (math.isEmpty(destTime)) throw new Error('参数2为空，请检查')
  if (math.isEmpty(timeUnit)) throw new Error('参数3为空，请检查')
  let res = Number(dateTimeUtil.datediff(srcTime, destTime, timeUnit))

  return res
}

export { main }
