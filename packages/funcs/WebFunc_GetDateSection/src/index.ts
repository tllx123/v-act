/**
 * 获取日期的某一部分 dateStr String 给定的日期，
 * 格式yyyy-MM-dd或者yyyy-MM-dd HH:mm:ss field int 指定要返回的日期部分：
 * 0:全部， 1:年，2：月，3：日，4：小时，6：分，7：秒；9：星期；
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { object, date, exception }

var main = function (dateStr, field) {
  if (field != null) {
    field += ''
  }
  var dateSection = {
    '0': '0',
    '1': 'yyyy',
    '2': 'MM',
    '3': 'dd',
    '4': 'HH',
    '6': 'mm',
    '7': 'ss',
    '9': '9'
  }
  var dayOfWeek = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
  }
  if (vds.object.isUndefOrNull(dateStr))
    throw vds.exception.newConfigException('给定的日期为空，请检查')
  if (vds.object.isUndefOrNull(field))
    throw vds.exception.newConfigException('指定要返回的日期部分为空，请检查')

  var dateReg = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/,
    longDateReg =
      /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  if (dateStr.match(longDateReg) == null && dateStr.match(dateReg) == null)
    throw vds.exception.newConfigException(
      '给定的日期格式必须符合yyyy-MM-dd或yyyy-MM-dd HH:mm:ss'
    )
  if (vds.object.isUndefOrNull(dateSection[field]))
    throw vds.exception.newConfigException(
      '指定要返回的日期部分不在备选范围内，请检查'
    )

  var dateObj = vds.date.valueOf(dateStr),
    weekOfDayVal = dateObj.getDay(), //获取星期几（ 0 - 6 ）
    cnWeekOfDay = dayOfWeek[weekOfDayVal] // 星期几（一 - 日）

  if (field === '0') {
    if (dateStr.match(dateReg) !== null) dateStr = dateStr + ' 00:00:00'
    return dateStr + ' ' + cnWeekOfDay
  } else if (field == '9') return weekOfDayVal
  else {
    var value = vds.date.format(dateObj, dateSection[field])
    return value
  }
}
export { main }
