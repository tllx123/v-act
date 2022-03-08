import { DateTimeUtil as dateFormatUtil } from '@v-act/vjs.framework.extension.util.date'
import { MathUtil as math } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    fromatStr = argsLen >= 1 ? args[0] : null,
    dateStr = argsLen >= 2 ? args[1] : null

  if (math.isEmpty(fromatStr)) return ''
  if (math.isEmptyEX(dateStr)) return null

  if (typeof dateStr == 'string') {
    let reg = /^(\d{1,2}):(\d{1,2})$/
    let r = dateStr.match(reg)
    if (r == null) dateStr = math.toDate(dateStr)
    else {
      dateStr = new Date()
      dateStr.setHours(r[1])
      dateStr.setMinutes(r[2])
    }
  }

  try {
    let df = dateFormatUtil.newInstance(fromatStr)
    return df.format(dateStr)
  } catch (e) {
    throw new Error('提供的格式串无法格式，请检查')
  }
}

export { main }
