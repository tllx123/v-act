/**
 *	小数的最小整数值(返回大于或等于指定小数的最小整数值)
 *  代码示例:Ceiling(2.555)返回值为3
 *  参数数量:1
 *  参数1--指定的数(小数类型)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

var main = function (decimalNum) {
  if (vds.object.isUndefOrNull(decimalNum))
    throw new Error('小数的最小整数值函数参数为空，请检查')
  if (!vds.object.isNumber(decimalNum))
    throw new Error('小数的最小整数值函数参数不是数字，请检查')

  return vds.math.ceil(decimalNum)
}
export { main }
