import { Math as math } from '@v-act/vjs.framework.extension.util'
import { DateTimeUtil as dateTimeUtil } from '@v-act/vjs.framework.extension.util.date'
import { DateFormatUtil as dateFormatUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    timeStr = argsLen >= 1 ? args[0] : null,
    num = argsLen >= 2 ? args[1] : null,
    timeUnit = argsLen >= 3 ? args[2] : null

  if (math.isEmpty(timeStr)) throw new Error('参数1为空，请检查')
  if (math.isEmpty(num)) throw new Error('参数2为空，请检查')
  if (math.isEmpty(timeUnit)) throw new Error('参数3为空，请检查')
  /*if(timeUnit=="m"){
        timeUnit = "M";
    }else if(timeUnit=="mi"){
        timeUnit = "m";
    }else if(timeUnit=="h"){
        timeUnit = "H";
    }*/
  //输入是长日期，则输出长日期；否则输出短日期
  let dateAddStr = dateTimeUtil.dateAdd(timeStr, num, timeUnit)
  let longDateReg =
    /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  let r = timeStr.match(longDateReg)
  if (r == null) {
    dateAddStr = dateAddStr.substring(0, 10)
  }
  return dateAddStr
}
export { main }
