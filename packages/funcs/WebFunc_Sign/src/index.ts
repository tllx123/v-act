/**
 *	求正负值
 *  代码示例:Sign(-99)返回值为-1
 *  参数数量:1
 *  参数1--要取符号的数(小数类型)
 *  返回值为整数1或者-1
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

const main = function (arg) {
  if (vds.object.isUndefOrNull(arg))
    throw new Error('求正负值函数参数为空，请检查')
  if (!vds.object.isNumber(arg))
    throw new Error('求正负值函数函数参数不是数字，请检查')

  return vds.math.sign(arg)
}
export { main }
