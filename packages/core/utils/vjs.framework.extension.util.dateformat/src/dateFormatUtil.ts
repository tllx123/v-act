/**
 * constructor
 */
let DateFormat = function (pattern: string) {
  // @ts-ignore
  this.pattern = pattern
}

DateFormat.zh_cn_month1 = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12'
]
DateFormat.zh_cn_month2 = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]
DateFormat.zh_cn_month3 = [
  '\u4e00\u6708',
  '\u4e8c\u6708',
  '\u4e09\u6708',
  '\u56db\u6708',
  '\u4e94\u6708',
  '\u516d\u6708',
  '\u4e03\u6708',
  '\u516b\u6708',
  '\u4e5d\u6708',
  '\u5341\u6708',
  '\u5341\u4e00\u6708',
  '\u5341\u4e8c\u6708'
]
DateFormat.zh_cn_month4 = [
  '\u4e00\u6708',
  '\u4e8c\u6708',
  '\u4e09\u6708',
  '\u56db\u6708',
  '\u4e94\u6708',
  '\u516d\u6708',
  '\u4e03\u6708',
  '\u516b\u6708',
  '\u4e5d\u6708',
  '\u5341\u6708',
  '\u5341\u4e00\u6708',
  '\u5341\u4e8c\u6708'
]
DateFormat.us_en_month4 = [
  'Janu',
  'Febr',
  'Marc',
  'Apri',
  'May',
  'Juhn',
  'July',
  'Augu',
  'Sept',
  'Octo',
  'Nove',
  'Dece'
]
DateFormat.us_en_month3 = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Juh',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
DateFormat.us_en_month2 = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]
DateFormat.us_en_month1 = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12'
]
DateFormat.zh_cn_week = [
  '\u661f\u671f\u65e5',
  '\u661f\u671f\u4e00',
  '\u661f\u671f\u4e8c',
  '\u661f\u671f\u4e09',
  '\u661f\u671f\u56db',
  '\u661f\u671f\u4e94',
  '\u661f\u671f\u516d'
]
DateFormat.zh_cn_am = '\u4e0b\u5348'
DateFormat.zh_cn_pm = '\u4e0a\u5348'
DateFormat.language = 'zh_cn'
//(navigator.userLanguage == undefined ? navigator.language : navigator.userLanguage).replace("-", "_").toLowerCase();

/**
 *  格式化日期
 * @param date 日期
 * @return String
 */
DateFormat.prototype.format = function (date) {
  let year4 = date.getFullYear()
  let year2 = year4.toString().substring(2)
  let pattern = this.pattern
  pattern = pattern.replace(/yyyy/g, year4)
  pattern = pattern.replace(/yy/g, year2)
  let month = date.getMonth()
  pattern = pattern.replace(
    /MMMM/g,
    DateFormat[DateFormat.language + '_month4'][month]
  )
  pattern = pattern.replace(
    /MMM/g,
    DateFormat[DateFormat.language + '_month3'][month]
  )
  pattern = pattern.replace(
    /MM/g,
    DateFormat[DateFormat.language + '_month2'][month]
  )
  pattern = pattern.replace(
    /M/g,
    DateFormat[DateFormat.language + '_month1'][month]
  )

  let dayOfMonth = date.getDate()
  let dayOfMonth2 = dayOfMonth
  let dayOfMonthLength = dayOfMonth.toString().length
  if (dayOfMonthLength == 1) {
    dayOfMonth2 = '0' + dayOfMonth
  }
  pattern = pattern.replace(/dd/g, dayOfMonth2)
  pattern = pattern.replace(/d/g, dayOfMonth)
  let hours = date.getHours()
  let hours2 = hours
  let hoursLength = hours.toString().length
  if (hoursLength == 1) {
    hours2 = '0' + hours
  }
  pattern = pattern.replace(/HH/g, hours2)
  pattern = pattern.replace(/H/g, hours)
  let minutes = date.getMinutes()
  let minutes2 = minutes
  let minutesLength = minutes.toString().length
  if (minutesLength == 1) {
    minutes2 = '0' + minutes
  }
  pattern = pattern.replace(/mm/g, minutes2)
  pattern = pattern.replace(/m/g, minutes)
  let seconds = date.getSeconds()
  let seconds2 = seconds
  let secondsLength = seconds.toString().length
  if (secondsLength == 1) {
    seconds2 = '0' + seconds
  }
  pattern = pattern.replace(/ss/g, seconds2)
  pattern = pattern.replace(/s/g, seconds)
  let milliSeconds = date.getMilliseconds()
  pattern = pattern.replace(/S+/g, milliSeconds)
  let day = date.getDay()
  pattern = pattern.replace(
    /E+/g,
    DateFormat[DateFormat.language + '_week'][day]
  )
  if (hours > 12) {
    pattern = pattern.replace(/a+/g, DateFormat[DateFormat.language + '_am'])
  } else {
    pattern = pattern.replace(/a+/g, DateFormat[DateFormat.language + '_pm'])
  }
  let kHours = hours
  if (kHours == 0) {
    kHours = 24
  }
  let kHours2 = kHours
  let kHoursLength = kHours.toString().length
  if (kHoursLength == 1) {
    kHours2 = '0' + kHours
  }
  pattern = pattern.replace(/kk/g, kHours2)
  pattern = pattern.replace(/k/g, kHours)
  let KHours = hours
  if (hours > 11) {
    KHours = hours - 12
  }
  let KHours2 = KHours
  let KHoursLength = KHours.toString().length
  if (KHoursLength == 1) {
    KHours2 = '0' + KHours
  }
  pattern = pattern.replace(/KK/g, KHours2)
  pattern = pattern.replace(/K/g, KHours)
  let hHours = KHours
  if (hHours == 0) {
    hHours = 12
  }
  let hHours2 = hHours
  let hHoursLength = hHours.toString().length
  if (KHoursLength == 1) {
    hHours2 = '0' + hHours
  }
  pattern = pattern.replace(/hh/g, hHours2)
  pattern = pattern.replace(/h/g, hHours)
  return pattern
}

const newInstance = function (pattern) {
  return new DateFormat(pattern)
}

export { newInstance }
