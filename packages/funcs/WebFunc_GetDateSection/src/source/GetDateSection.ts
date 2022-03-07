import { DateTimeUtil as dateFormatUtil } from '@v-act/vjs.framework.extension.util.date'
import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let dateSection, dayOfWeek

export function initModule(sb) {
  dateSection = {
    '0': '0',
    '1': 'yyyy',
    '2': 'MM',
    '3': 'dd',
    '4': 'HH',
    '6': 'mm',
    '7': 'ss',
    '9': '9'
  }
  dayOfWeek = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
  }
  //		dayOfWeek = {
  //			0: "星期一",
  //			1: "星期二",
  //			2: "星期三",
  //			3: "星期四",
  //			4: "星期五",
  //			5: "星期六",
  //			6: "星期日"
  //		};
}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dateStr = argsLen >= 1 ? args[0] : null,
    field = argsLen >= 2 ? args[1] + '' : null

  if (stringUtil.isEmpty(dateStr)) throw new Error('给定的日期为空，请检查')
  if (stringUtil.isEmpty(field))
    throw new Error('指定要返回的日期部分为空，请检查')

  let dateReg = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/,
    longDateReg =
      /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  if (dateStr.match(longDateReg) == null && dateStr.match(dateReg) == null)
    throw new Error('给定的日期格式必须符合yyyy-MM-dd或yyyy-MM-dd HH:mm:ss')
  if (mathUtil.isEmpty(dateSection[field]))
    throw new Error('指定要返回的日期部分不在备选范围内，请检查')

  let dateObj = mathUtil.toDate(dateStr),
    //获取星期几（ 0 - 6 ）
    weekOfDayVal = dateObj.getDay(),
    cnWeekOfDay = dayOfWeek[weekOfDayVal] // 星期几（一 - 日）

  if (field === '0') {
    if (dateStr.match(dateReg) !== null) dateStr = dateStr + ' 00:00:00'
    return dateStr + ' ' + cnWeekOfDay
  } else if (field == '9') return weekOfDayVal
  else {
    let df = dateFormatUtil.newInstance(dateSection[field])
    return df.format(dateObj)
  }
}

export { main }
