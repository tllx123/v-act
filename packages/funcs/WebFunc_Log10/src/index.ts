/**
 *	返回指定数字以 10 为底的对数。
 *  代码示例:Log10(100) 返回值为2
 *  参数1--指定数字(小数)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

const main = function (arg) {
  if (vds.object.isUndefOrNull(arg))
    throw new Error('求10的底函数参数为空，请检查')
  if (!vds.object.isNumber(arg))
    throw new Error('求10的底函数函数参数不是数字，请检查')
  if (arg <= 0) throw new Error('求10的底函数函数参数不能小于或等于0，请检查')

  var lnten = vds.math.log(10)
  var lnnum = vds.math.log(arg)
  return vds.math.divide(lnnum, lnten)
}
export { main }
