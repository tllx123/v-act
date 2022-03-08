/**
 * 反正弦 代码示例:Asin(1) 返回值为1.5707963267948966 参数数量:1 参数1--指定的角度(小数类型) 返回值为小数
 */
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { math, object, number }

var main = function (num) {
  if (vds.object.isUndefOrNull(num)) {
    throw new Error('反正弦函数参数为空，请检查')
  }
  if (!vds.object.isNumber(num)) {
    throw new Error('反正弦函数参数不是数字，请检查')
  }
  if (num > 1 || num < -1) {
    throw new Error('反正弦函数参数不在-1至1之间，请检查')
  }
  var result = vds.number.toFixed(vds.math.asin(num), 10)
  return Number(result)
}
export { main }
