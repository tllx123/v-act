/**
 * 余弦 代码示例:Cos(1) 0.5403023058681398 参数数量:1 参数1--指定的角度(小数类型) 返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, math, number }

const main = function (arg: number) {
  if (vds.object.isUndefOrNull(arg)) throw new Error('余弦函数参数为空，请检查')

  if (!vds.object.isNumber(arg)) throw new Error('余弦函数参数不是数字，请检查')

  var result = vds.number.toFixed(vds.math.cos(arg), 10)

  return Number(result)
}
export { main }
