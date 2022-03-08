/**
 *	求浮点数的整数部分
 *  代码示例:Truncate(1.99)返回值为1
 *  参数数量:1
 *  参数1--指定的小数(小数类型)
 *  返回值为整数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

const main = function (arg) {
  if (vds.object.isUndefOrNull(arg))
    throw new Error('求浮点数的整数部分参数为空，请检查')
  if (!vds.object.isNumber(arg))
    throw new Error('求浮点数的整数部分参数不是数字，请检查')

  return vds.math.truncate(arg)
}
export { main }
