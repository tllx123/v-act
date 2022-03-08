/**
 * 双曲正切值 代码示例:Tanh(1)返回值为0.7615941559557647 参数数量:1 参数1--指定的角度(小数类型) 返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

var main = function (arg) {
  if (vds.object.isUndefOrNull(arg))
    throw new Error('双曲正切值函数参数为空，请检查')
  if (!vds.object.isNumber(arg))
    throw new Error('双曲正切值函数参数为空，请检查')

  if (arg > 19.061547465398) return 1
  else if (arg < -19.061547465398) return -1
  else {
    var num1 = vds.math.exp(arg)
    var num2 = vds.math.exp(-arg)
    var ret1 = vds.math.subtract(num1, num2)
    var ret2 = vds.math.add(num1, num2)
    var result = vds.math.divide(ret1, ret2, 10)
    return Number(result)
  }
}
export { main }
