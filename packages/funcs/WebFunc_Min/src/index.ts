/**
 *	求两数最小值
 *  代码示例:Min(3,5) 返回值为3
 *  参数数量:2
 *  参数1--比较值1(小数类型),参数2--比较值2(小数类型)
 *  返回值为小数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

var main = function (arg1, arg2) {
  if (vds.object.isUndefOrNull(arg1) || vds.object.isUndefOrNull(arg2))
    throw new Error('求两数最小值函数参数为空，请检查')
  if (!vds.object.isNumber(arg1) || !vds.object.isNumber(arg2))
    throw new Error('求两数最小值函数参数不是数字，请检查')

  return vds.math.min(arg1, arg2)
}
export { main }
