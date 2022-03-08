/**
 *	将指定日期减去另一日期后的时间段最后一个参数时间的单位s-秒,m-分,H-时,d-日,M-月,y-年,目标日期减去原日期
 *	代码示例:Datediff("2012-11-25 01:00:32","2012-11-24 05:55:33","d")返回值为-1
 *	参数数量:3
 *	参数1--原日期(字符串类型)
 *	参数2--目标日期(字符串类型)
 *	参数3--时间的单位(字符串类型)
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
const vds = { object, date }

const main = function (srcTime, destTime, timeUnit) {
  if (vds.object.isUndefOrNull(srcTime)) throw new Error('参数1为空，请检查')
  if (vds.object.isUndefOrNull(destTime)) throw new Error('参数2为空，请检查')
  if (vds.object.isUndefOrNull(timeUnit)) throw new Error('参数3为空，请检查')
  var res = Number(vds.date.diff(srcTime, destTime, timeUnit))

  return res
}
export { main }
