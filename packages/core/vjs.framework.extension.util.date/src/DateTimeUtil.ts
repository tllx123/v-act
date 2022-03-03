import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { DateFormatUtil as dateFormatUtil } from '@v-act/vjs.framework.extension.util'
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let TIME_UNIT_YEAR = 'y' // 时间单位： 年
let TIME_UNIT_MONTH = 'M' // 时间单位： 月
let TIME_UNIT_DAY = 'd' // 时间单位： 日
let TIME_UNIT_HOUR = 'H' // 时间单位： 时
let TIME_UNIT_MINUTE = 'm' // 时间单位： 分
let TIME_UNIT_SECOND = 's' // 时间单位： 秒

// 各单位与毫秒的进制数
let TimeSpanMillSecond = {
  s: 1000,
  m: 1000 * 60,
  H: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  M: -1,
  y: -1
}

const dateAdd = function (timeStr, num, timeUnit) {
  if (stringUtil.isEmpty(timeStr)) {
    throw new Error('时间字串为空，请检查')
  }

  let dateReg = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/
  if (timeStr.match(dateReg) != null) {
    timeStr = timeStr + ' 00:00:00'
  }

  let longDateReg =
    /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  let r = timeStr.match(longDateReg)
  if (r == null) {
    throw new Error('时间字串格式必须符合yyyy-MM-dd HH:mm:ss')
  }

  if (stringUtil.isEmpty(num)) {
    throw new Error('时间数为空，请检查')
  }
  if (!mathUtil.judgeInt(num)) {
    throw new Error('时间数必须为整数，请检查')
  }

  if (stringUtil.isEmpty(timeUnit)) {
    throw new Error('时间数的单位为空，请检查')
  }

  if (
    TimeSpanMillSecond[timeUnit] == null ||
    TimeSpanMillSecond[timeUnit] == undefined
  ) {
    throw new Error('时间数的单位配置有误，请检查')
  }
  // 根据时间单位类型进行相关运算
  switch (timeUnit) {
    case TIME_UNIT_YEAR:
      r[1] = r[1] * 1 + num * 1
      break
    case TIME_UNIT_MONTH:
      r[2] = r[2] * 1 + num * 1
      break
    case TIME_UNIT_DAY:
      r[3] = r[3] * 1 + num * 1
      break
    case TIME_UNIT_HOUR:
      r[4] = r[4] * 1 + num * 1
      break
    case TIME_UNIT_MINUTE:
      r[5] = r[5] * 1 + num * 1
      break
    case TIME_UNIT_SECOND:
      r[6] = r[6] * 1 + num * 1
      break
    default:
      break
  }
  let d = new Date(r[1], r[2] - 1, r[3], r[4], r[5], r[6])
  let df = dateFormatUtil.newInstance('yyyy-MM-dd HH:mm:ss')
  return df.format(d)
}

const dateConvert = function (num, timeUnit, destTimeUnit) {
  if (stringUtil.isEmpty(timeUnit)) {
    throw new Error('原时间的单位为空，请检查')
  }
  if (
    TimeSpanMillSecond[timeUnit] == null ||
    TimeSpanMillSecond[timeUnit] == undefined
  ) {
    throw new Error('原时间的单位配置有误，请检查')
  }
  if (TIME_UNIT_YEAR == timeUnit || TIME_UNIT_MONTH == timeUnit) {
    throw new Error('原时间单位不能为年或月，请检查')
  }

  if (stringUtil.isEmpty(destTimeUnit)) {
    throw new Error('目标时间的单位为空，请检查')
  }
  if (
    TimeSpanMillSecond[destTimeUnit] == null ||
    TimeSpanMillSecond[destTimeUnit] == undefined
  ) {
    throw new Error('目标时间的单位配置有误，请检查')
  }
  if (TIME_UNIT_YEAR == destTimeUnit || TIME_UNIT_MONTH == destTimeUnit) {
    throw new Error('目标时间单位不能为年或月，请检查')
  }

  let millSecondValue = mathUtil.multiply(num, TimeSpanMillSecond[timeUnit])
  return mathUtil.divide(millSecondValue, TimeSpanMillSecond[destTimeUnit])
}

const datediff = function (srcTime, destTime, timeUnit) {
  if (stringUtil.isEmpty(srcTime)) {
    throw new Error('原时间字串为空，请检查')
  }
  if (stringUtil.isEmpty(destTime)) {
    throw new Error('目标时间字串为空，请检查')
  }

  let dateReg = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/
  if (srcTime.match(dateReg) != null) {
    srcTime = srcTime + ' 00:00:00'
  }
  if (destTime.match(dateReg) != null) {
    destTime = destTime + ' 00:00:00'
  }

  let reg = /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  if (srcTime.match(reg) == null || destTime.match(reg) == null) {
    throw new Error('时间字串格式必须符合yyyy-MM-dd HH:mm:ss, 请检查')
  }

  if (stringUtil.isEmpty(timeUnit)) {
    throw new Error('时间单位为空，请检查')
  }
  if (
    TimeSpanMillSecond[timeUnit] == null ||
    TimeSpanMillSecond[timeUnit] == undefined
  ) {
    throw new Error('时间的单位配置有误，请检查')
  }
  if (TIME_UNIT_YEAR == timeUnit || TIME_UNIT_MONTH == timeUnit) {
    throw new Error('时间单位不能为年或月，请检查')
  }

  let start = mathUtil.toDate(srcTime).getTime()
  let end = mathUtil.toDate(destTime).getTime()
  let timeSpan = mathUtil.subtract(end, start)
  return mathUtil.divide(timeSpan, TimeSpanMillSecond[timeUnit])
}

export { dateAdd, dateConvert, datediff }
