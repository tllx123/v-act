import { DateTimeUtil as dateTimeUtil } from '@v-act/vjs.framework.extension.util.date'
import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    num = argsLen >= 1 ? args[0] : null,
    timeUnit = argsLen >= 2 ? args[1] : null,
    destTimeUnit = argsLen >= 3 ? args[2] : null

  if (math.isEmpty(num)) throw new Error('参数1为空，请检查')
  if (math.isEmpty(timeUnit)) throw new Error('参数2为空，请检查')
  if (math.isEmpty(destTimeUnit)) throw new Error('参数3为空，请检查')

  return dateTimeUtil.dateConvert(num, timeUnit, destTimeUnit)
}

export { main }
