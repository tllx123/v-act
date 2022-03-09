/**
 *	将指定日期减少一定的时间间隔后的时间字符串最后一个参数时间的单位s-秒,m-分,H-时,d-日,M-月,y-年
 *	代码示例:DateSub("2012-03-05 18:20:30",30,"H")返回值为"2012-03-04 12:20:30"
 *	参数数量:3
 *	参数1--转换的日期(字符串类型)
 *	参数2--增加的时间数(数字类型)
 *	参数3--时间数的单位(字符串类型)
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
const vds = { object, number, date }

const main = function (timeStr: string, num: number, timeUnit: string) {
  if (vds.object.isUndefOrNull(timeStr)) throw new Error('参数1为空，请检查')
  if (vds.object.isUndefOrNull(num)) throw new Error('参数2为空，请检查')
  if (vds.object.isUndefOrNull(timeUnit)) throw new Error('参数3为空，请检查')
  if (!vds.number.isInteger(num)) throw new Error('时间数是整数类型，请检查')

  var dateSubStr = vds.date.add(timeStr, -1 * num, timeUnit)
  var longDateReg =
    /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  var r = timeStr.match(longDateReg)
  if (r == null) {
    dateSubStr = dateSubStr.substring(0, 10)
  }
  return dateSubStr
}
export { main }
