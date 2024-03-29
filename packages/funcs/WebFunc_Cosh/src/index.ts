/**
 * 双曲余弦值 代码示例:Cosh(1)返回值为1.54308063481524 参数数量:1 参数1--以弧度为单位的角(小数类型) 返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, math, number }

const main = function (arg: number) {
  if (vds.object.isUndefOrNull(arg))
    throw new Error('双曲余弦值函数参数为空，请检查')
  if (!vds.object.isNumber(arg))
    throw new Error('双曲余弦值函数参数不是数字，请检查')

  var num1 = vds.math.exp(arg)
  var num2 = vds.math.exp(-arg)
  if (vds.number.isInfinity(num1) || vds.number.isInfinity(num2))
    throw new Error('双曲余弦值函数运算数据超出计算机所表示的范围，无法计算')

  var ret = vds.math.add(num1, num2),
    result = vds.math.divide(ret, 2, 10)
  return Number(result)
}
export { main }
