import { DateTimeUtil as dateTimeUtil } from '@v-act/vjs.framework.extension.util.date'
import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    timeStr = argsLen >= 1 ? args[0] : null,
    num = argsLen >= 2 ? args[1] : null,
    timeUnit = argsLen >= 3 ? args[2] : null

  if (math.isEmpty(timeStr)) throw new Error('参数1为空，请检查')
  if (math.isEmpty(num)) throw new Error('参数2为空，请检查')
  if (math.isEmpty(timeUnit)) throw new Error('参数3为空，请检查')
  if (!math.judgeInt(num)) throw new Error('时间数是整数类型，请检查')

  let dateSubStr = dateTimeUtil.dateAdd(timeStr, -1 * num, timeUnit)
  let longDateReg =
    /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  let r = timeStr.match(longDateReg)
  if (r == null) {
    dateSubStr = dateSubStr.substring(0, 10)
  }
  return dateSubStr
}

export { main }
