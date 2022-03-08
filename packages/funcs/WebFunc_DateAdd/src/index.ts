/**
 *	将指定日期加上一定的时间间隔后的时间字符串最后一个参数时间的单位s-秒,m-分,H-时,d-日,M-月,y-年
 *	代码示例:DateAdd("2012-03-05 18:20:30",30,"H")返回值为"2012-03-07 00:20:30"
 *	参数数量:3
 *	参数1--转换的日期(字符串类型)
 *	参数2--增加的时间数(数字类型)
 *	参数3--时间数的单位(字符串类型)
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
const vds = { object, date }

var main = function (timeStr, num, timeUnit) {
  if (vds.object.isUndefOrNull(timeStr)) throw new Error('参数1为空，请检查')
  if (vds.object.isUndefOrNull(num)) throw new Error('参数2为空，请检查')
  if (vds.object.isUndefOrNull(timeUnit)) throw new Error('参数3为空，请检查')
  /*if(timeUnit=="m"){
        timeUnit = "M";
    }else if(timeUnit=="mi"){
        timeUnit = "m";
    }else if(timeUnit=="h"){
        timeUnit = "H";
    }*/
  //输入是长日期，则输出长日期；否则输出短日期
  var dateAddStr = vds.date.add(timeStr, num, timeUnit)
  var longDateReg =
    /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  var r = timeStr.match(longDateReg)
  if (r == null) {
    dateAddStr = dateAddStr.substring(0, 10)
  }
  return dateAddStr
}
export { main }
