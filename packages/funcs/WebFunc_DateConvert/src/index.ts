/**
 *	将一时间的单位转换成另一种单位后的时间数
 *	代码示例:DateConvert(30,"s","m")返回值为0.5
 *	参数数量:3
 *	参数1--时间数(数值类型)
 *	参数2--原时间的单位(字符串类型)
 *	参数3--目标时间的单位(字符串类型)
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as date from '@v-act/vjs.framework.extension.platform.services.integration.vds.date'
const vds = { object, date }

const main = function (num: string, timeUnit: string, destTimeUnit: string) {
  if (vds.object.isUndefOrNull(num)) throw new Error('参数1为空，请检查')
  if (vds.object.isUndefOrNull(timeUnit)) throw new Error('参数2为空，请检查')
  if (vds.object.isUndefOrNull(destTimeUnit))
    throw new Error('参数3为空，请检查')

  return vds.date.convert(num, timeUnit, destTimeUnit)
}
export { main }
