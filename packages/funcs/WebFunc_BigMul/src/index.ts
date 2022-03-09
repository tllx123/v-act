/**
 * 整数乘积 代码示例:bigMul(3,5)返回值为15 参数数量:2 参数1--乘数(数字类型),参数2--被乘数(数字类型) 返回值为整数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

const main = function (multiplier1: number, multiplier2: number): number {
  if (
    vds.object.isUndefOrNull(multiplier1) ||
    vds.object.isUndefOrNull(multiplier2)
  )
    throw new Error('整数乘积函数的因数为空，请检查')
  if (isNaN(multiplier1) || isNaN(multiplier2))
    throw Error('整数乘积函数的因数不是数字，请检查')

  multiplier1 = vds.math.round(multiplier1)
  multiplier2 = vds.math.round(multiplier2)

  return vds.math.multiply(multiplier1, multiplier2)
}
export { main }
