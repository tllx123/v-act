/**
 *	整数商
 *  代码示例:Divrem(54,8)返回值为6
 *  参数数量:2
 *  参数1--被除数(小数类型),参数2--除数(小数类型)
 *  返回值为整数
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, math }

var main = function (arg1, arg2) {
  if (vds.object.isUndefOrNull(arg1) || vds.object.isUndefOrNull(arg2))
    throw new Error('整数商函数参数为空，请检查')
  if (!vds.object.isNumber(arg1) || !vds.object.isNumber(arg2))
    throw new Error('整数商函数参数不是数字，请检查')
  if (arg2 == 0) throw new Error('整数商函数除数不能为0，请检查')

  return vds.math.divrem(arg1, arg2)
}
export { main }
