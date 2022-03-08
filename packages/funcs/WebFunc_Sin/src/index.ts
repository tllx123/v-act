/**
 * 正弦 代码示例:Sin(1) 返回值为0.841470984807897 参数数量:1 参数1--指定的角度(小数类型) 返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, math, number }

const main = function (arg) {
  if (vds.object.isUndefOrNull(arg)) throw Error('正弦函数参数为空，请检查')
  if (!vds.object.isNumber(arg)) throw Error('正弦函数参数为空，请检查')

  var result = vds.number.toFixed(vds.math.sin(arg), 10)
  return Number(result)
}
export { main }
