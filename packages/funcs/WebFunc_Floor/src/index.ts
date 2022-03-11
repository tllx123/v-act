import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
/**
 *	小数的最大整数值
 *  代码示例:Floor(2.55456)返回值为2
 *  参数数量:1
 *  参数1--小数的值(小数类型)
 *  返回值为整数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object, math }

const main = function (arg: any) {
  if (vds.object.isUndefOrNull(arg))
    throw new Error('小数的最大整数值函数参数为空，请检查')
  if (!vds.object.isNumber(arg))
    throw new Error('小数的最大整数值函数参数不是数字，请检查')

  return vds.math.floor(arg)
}
export { main }
