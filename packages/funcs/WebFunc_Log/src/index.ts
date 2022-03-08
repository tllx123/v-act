/**
 *	返回指定数字的自然对数（底为 e）
 *  代码示例:Log(10) 返回值为2.302585092994046
 *  参数1--指定数字(小数)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

const main = function (arg) {
  if (vds.object.isUndefOrNull(arg)) throw new Error('求底函数参数为空，请检查')

  if (!vds.object.isNumber(arg))
    throw new Error('求底函数函数参数不是数字，请检查')

  if (arg <= 0) throw new Error('求底函数函数参数不能小于或等于0，请检查')

  return vds.math.log(arg)
}
export { main }
