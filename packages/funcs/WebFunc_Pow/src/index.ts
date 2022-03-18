/**
 *	指定数字的幂
 *  代码示例:Pow(3,2) 返回值为9
 *  参数数量:2
 *  参数1--要乘幂的数(小数类型),参数2--幂(小数类型)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, math, number }

const main = function (arg1: number, arg2: number) {
  if (vds.object.isUndefOrNull(arg1) || vds.object.isUndefOrNull(arg2))
    throw new Error('指定数字的幂函数参数为空，请检查')
  if (!vds.object.isNumber(arg1) || !vds.object.isNumber(arg2))
    throw new Error('指定数字的幂函数参数不是数字，请检查')

  var ret
  if (arg2 * 1 < 0) ret = vds.math.divide(Math.pow(arg1, arg2), 1)
  else ret = vds.math.pow(arg1, arg2) //该方法不支持幂数为负数

  if (vds.number.isInfinity(ret))
    throw new Error('指定数字的幂函数运算数据超出计算机所表示的范围，无法计算')

  return ret
}
export { main }
