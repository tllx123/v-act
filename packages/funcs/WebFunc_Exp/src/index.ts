/**
 *	e的指定次幂
 *  代码示例:Exp(2)返回值为7.38905609893065
 *  参数数量:1
 *  参数1--幂(小数类型)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, math, number }

const main = function (arg) {
  if (vds.object.isUndefOrNull(arg))
    throw new Error('e的指定次幂函数参数为空，请检查')
  if (!vds.object.isNumber(arg))
    throw new Error('e的指定次幂函数参数不是数字，请检查')

  var ret = vds.math.exp(arg)
  if (vds.number.isInfinity(ret))
    throw new Error('e的指定次幂函数运算数据超出计算机所表示的范围，无法计算')

  return ret
}
export { main }
